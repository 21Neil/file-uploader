import { Router } from 'express';
import { getSignupView, postSignup } from '../controllers/signupController.js';

const signupRouter = new Router()

signupRouter.get('/', getSignupView)
signupRouter.post('/', postSignup)

export default signupRouter
