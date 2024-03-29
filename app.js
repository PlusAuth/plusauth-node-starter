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

  if (process.env.NODE_ENV === "production") {
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

  const PlusAuthIssuer = await Issuer.discover(process.env.PLUSAUTH_ISSUER_URL);

  const PlusAuthClient = new PlusAuthIssuer.Client({
    client_id: process.env.PLUSAUTH_CLIENT_ID,
    client_secret: process.env.PLUSAUTH_CLIENT_SECRET,
    redirect_uris: ["http://localhost:3000/auth/callback"],
    token_endpoint_auth_method: "client_secret_post",
    post_logout_redirect_uris: ["http://localhost:3000/auth/logout/callback"],
    response_types: ["code"],
  });

  const PlusAuthStrategy = new Strategy(
    {
      client: PlusAuthClient,
      params: {
        scope: "openid email profile",
      },
      passReqToCallback: true
    },
    (req, token, user, done) => {
      // Store token in session
      req.session.token = token
      return done(null, user);
    }
  )

  passport.use("PlusAuth", PlusAuthStrategy);

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

  app.use("/auth/login", passport.authenticate("PlusAuth"));

  app.use("/profile", isLoggedIn, (req, res) => {
    res.render("profile", { user: req.user });
  });

  app.use(
    "/auth/callback",
    passport.authenticate("PlusAuth", {
      failureMessage: true,
      failureRedirect: "/error",
      successRedirect: "/profile",
    })
  );

  app.get("/", function (req, res) {
    res.render("index", { user: req.user });
  });

  app.get("/auth/logout", (req, res) => {
    res.redirect(
      PlusAuthClient.endSessionUrl({ client_id: process.env.PLUSAUTH_CLIENT_ID })
    );
  });

  app.get("/auth/logout/callback", (req, res, next) => {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  app.get("/error", (req, res) => {
    const messages = req.session.messages
    res.json(messages[messages.length - 1])
  })

  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Application started at http://localhost:" + listener.address().port);
  });
})();
