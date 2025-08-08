import { Router } from 'express'
import { addFolder, getFolderView } from '../controllers/folderController.js';
import setCurrentFolderId from '../middleware/setCurrentFolderId.js';

const folderRouter = new Router();

folderRouter.post('/add', addFolder)
folderRouter.get('/:id', setCurrentFolderId, getFolderView)

export default folderRouter
