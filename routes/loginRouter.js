import { Router } from 'express'
import { getLoginView, postLogin } from '../controllers/loginController.js'

const loginRouter = new Router()

loginRouter.get('/', getLoginView)
loginRouter.post('/', postLogin)

export default loginRouter
