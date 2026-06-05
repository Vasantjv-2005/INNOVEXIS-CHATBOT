const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Password is required in schema, so let's generate a secure random one
          const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-10);
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          user = await User.create({
            name: profile.displayName || profile.username || "Google User",
            email: email,
            password: hashedPassword,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// We are not using session-based authentication since we use JWTs, but passport.initialize() expects these if serialization is triggered.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
