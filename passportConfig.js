// passportConfig.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./database/userDB"); // Adjust the path as necessary
const bcrypt = require("bcrypt");
const logger = require("./logger"); // Import the logger

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ "account.username": username });
        if (!user) {
          logger.log(
            "passportConfig.js",
            `Incorrect username: ${username}`,
            "warn"
          );
          return done(null, false, { message: "Incorrect username." });
        }

        // Assuming the first account object is the relevant one
        const account = user.account[0];

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
          logger.log(
            "passportConfig.js",
            `Incorrect password attempt for username: ${username}`,
            "warn"
          );
          return done(null, false, { message: "Incorrect password." });
        }

        logger.log(
          "passportConfig.js",
          `User authenticated successfully: ${username}`,
          "info"
        );
        return done(null, user);
      } catch (err) {
        logger.log(
          "passportConfig.js",
          `Error during authentication: ${err.message}`,
          "error"
        );
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    logger.log(
      "passportConfig.js",
      `Error deserializing user: ${err.message}`,
      "error"
    );
    done(err);
  }
});

module.exports = passport;
