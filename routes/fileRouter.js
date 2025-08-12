import { Router } from 'express'
import { deleteFile, downloadFile } from '../controllers/fileController.js'

const fileRouter = new Router()

fileRouter.post('/delete', deleteFile)
fileRouter.get('/download/:id', downloadFile)

export default fileRouter
