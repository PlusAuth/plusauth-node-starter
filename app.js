const express = require("express");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const { Issuer, Strategy } = require("openid-client");
require("dotenv").config();

(async () => {
  const app = express();

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: "ItIsYourBirthday.",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const issuer = await Issuer.discover(process.env.AUTH_URL);

  const plusauthClient = new issuer.Client({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ["http://localhost:3000/login/callback"],
    post_logout_redirect_uris: ["http://localhost:3000/"],
    response_types: ["code"],
  });

  passport.use(
    "oidc",
    new Strategy(
      {
        client: plusauthClient,
        params: {
          scope: "openid email profile",
        },
      },
      (token, done) => {
        plusauthClient
          .userinfo(token)
          .then((user) => {
            return done(null, { ...user, ...token });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    )
  );

  passport.serializeUser((user, next) => next(null, user));

  passport.deserializeUser((obj, next) => next(null, obj));

  const isLoggedIn = (req, res, next) =>
    req.isAuthenticated() ? next() : res.redirect("/login");

  app.get("/login", passport.authenticate("oidc"));

  app.get("/profile", isLoggedIn, (req, res) =>
    res.render("profile", { user: req.user })
  );

  app.get(
    "/login/callback",
    passport.authenticate("oidc", {
      failureRedirect: "/error",
      successRedirect: "/profile",
    })
  );
  app.get("/", (req, res) => res.render("index", { user: req.user }));

  app.get("/logout", (req, res) => {
    const id_token = req.user.id_token;
    req.logout();
    res.redirect(plusauthClient.endSessionUrl({ id_token_hint: id_token }));
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
})();
