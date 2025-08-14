import { Router } from 'express'
import { createShareFolder, getShareFolderView, getShareSubFolderView, getShareView } from '../controllers/shareController.js'
import authenticate from '../middleware/authenticated.js'
import { downloadFile } from '../controllers/fileController.js'

const shareRouter = new Router()

shareRouter.get('/create/:id',authenticate, getShareView)
shareRouter.post('/create',authenticate, createShareFolder)
shareRouter.get('/download/:id', downloadFile)
shareRouter.get('/:id', getShareFolderView)
shareRouter.get('/:id/:folderId', getShareSubFolderView)

export default shareRouter
