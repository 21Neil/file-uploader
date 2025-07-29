import { Router } from 'express';
import { logout } from '../controllers/logoutController.js';

const logoutRouter = new Router();

logoutRouter.get('/', logout)

export default logoutRouter;
