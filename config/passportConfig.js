import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { getUserById, getUserByIdentifier } from "../database/dbQueries.js";

passport.use(
  new LocalStrategy(
    { usernameField: "identifier" },
    async (identifier, password, done) => {
      try {
        const user = await getUserByIdentifier(identifier);
        if (!user) {
          return done(null, false, {
            message: "No account found with that email or username.",
          });
        }

        const match = await bcryptjs.compare(password, user.password);
        if (!match) {
          return done(null, false, {
            message: "The password you entered is incorrect.",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
