import express from 'express'
import session from 'express-session'
import passport from 'passport'
import 'dotenv/config'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import indexRouter from './routes/indexRouter.js'
import signupRouter from './routes/signupRouter.js'
import loginRouter from './routes/loginRouter.js'
import './config/passport.js'
import prisma from './prisma/prisma.js'
import logoutRouter from './routes/logoutRouter.js'
import uploadRouter from './routes/uploadRouter.js'
import authenticate from './middleware/authenticated.js'

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 1000
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
)
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter)
app.use('/sign-up', signupRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/upload', authenticate, uploadRouter)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT, console.log(`http://localhost:${PORT}`))
