import { Router } from 'express'
import { addFolder, getFolderView, renameFolder } from '../controllers/folderController.js';

const folderRouter = new Router();

folderRouter.post('/add', addFolder)
folderRouter.get('/:id', getFolderView)
folderRouter.post('/update', renameFolder)

export default folderRouter
