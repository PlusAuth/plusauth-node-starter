const express = require("express");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const { Issuer, Strategy } = require("openid-client");

(async () => {
  const app = express();

  const sessionOptions = {
    secret: "SomeRandomValue", // Change this to a random value
    resave: false,
    saveUninitialized: true,
  }

  if(process.env.NODE_ENV === "production"){
    // Use secure cookies in production. More info at https://www.npmjs.com/package/express-session#cookiesecure
    sessionOptions.cookie.secure = true;
  }

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session(sessionOptions));

  const issuer = await Issuer.discover(process.env.PLUSAUTH_ISSUER_URL);

  const plusauthClient = new issuer.Client({
    PLUSAUTH_CLIENT_ID: process.env.PLUSAUTH_CLIENT_ID,
    PLUSAUTH_CLIENT_SECRET: process.env.PLUSAUTH_CLIENT_SECRET,
    redirect_uris: ["http://localhost:3000/auth/callback"],

    post_logout_redirect_uris: ["http://localhost:3000/auth/logout/callback"],
    response_types: ["code"],
  });

  passport.use(
    "oidc",
    new Strategy(
      {
        client: plusauthClient,
        params: {
          claims: "openid email profile",
        },
      },
      (token, done) => {
        // Fetch profile from Plusauth using issued token
        plusauthClient.userinfo(token).then((user) => {
          return done(null, { ...user, ...token });
        });
      }
    )
  );
  passport.serializeUser((user, next) => {
    next(null, user);
  });

  passport.deserializeUser((obj, next) => {
    next(null, obj);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/auth/login");
  }

  app.use("/auth/login", passport.authenticate("oidc"));
  app.use("/profile", isLoggedIn, (req, res) => {
    res.render("profile", { user: req.user });
  });
  app.use(
    "/auth/callback",
    passport.authenticate("oidc", {
      failureRedirect: "/error",
      successRedirect: "/profile",
    })
  );
  app.get("/", function (req, res) {
    res.render("index", { user: req.user });
  });
  app.get("/auth/logout", (req, res) => {
    res.redirect(
      plusauthClient.endSessionUrl({ id_token_hint: req.user.id_token })
    );
  });
  app.get("/auth/logout/callback", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000");
  });
})();
