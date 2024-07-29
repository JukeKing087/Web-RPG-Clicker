// passportConfig.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./database/userDB"); // Adjust the path as necessary
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ "account.username": username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // Assuming the first account object is the relevant one
        const account = user.account[0];

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
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
    done(err);
  }
});

module.exports = passport;
