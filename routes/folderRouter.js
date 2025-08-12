import { Router } from 'express'
import { addFolder, deleteFolder, getFolderView, renameFolder } from '../controllers/folderController.js';

const folderRouter = new Router();

folderRouter.post('/add', addFolder)
folderRouter.get('/:id', getFolderView)
folderRouter.post('/update', renameFolder)
folderRouter.post('/delete/', deleteFolder)

export default folderRouter
