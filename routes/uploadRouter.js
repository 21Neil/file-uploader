import { Router } from 'express'
import { getUploadView, postUpload } from '../controllers/uploadController.js';

const uploadRouter = new Router();

uploadRouter.get('/', getUploadView)
uploadRouter.post('/', postUpload)

export default uploadRouter;
