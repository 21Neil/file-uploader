import { getUserById, getUserByUsername } from "../prisma/queries.js";
import bcrypt from 'bcryptjs';
import passport from "passport";
import { Strategy } from 'passport-local'

const verify = async (username, password, done) => {
  try {
    const user = await getUserByUsername(username)
    if (!user) return done(null, false, { message: 'Incorrect username'})
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return done(null, false, { message: 'Incorrect password' })

    done(null, user)
  } catch (err) {
    done(err)
  }
};

const localStrategy = new Strategy({ usernameField: 'email'}, verify)

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})
