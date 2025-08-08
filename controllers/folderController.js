import { getFolderPath } from '../lib/pathUtils.js';
import { createFolder, getFolderById } from '../prisma/queries.js';
import fs from 'fs';

const addFolder = async (req, res) => {
  const { foldername } = req.body;
  const folderId = parseInt(req.body.folderId);
  const userId = res.locals.currentUser.id;

  if (folderId) {
    const folder = await getFolderById(folderId, userId);
    if (!folder) {
      return res
        .status(403)
        .send('Parent folder not found or not owned by user.');
    }
  }

  try {
    const newFolder = await createFolder(foldername, folderId, userId);
    const folderPath = await getFolderPath(folderId);
    fs.mkdir(`files/${folderPath}/${newFolder.id}`, err => {
      if (err) console.log(err);
    });
  } catch (err) {
    if (err.code === 'P2002') {
      res
        .status(409)
        .send('A folder with that name already exists is this directory.');
    }
  }

  res.redirect(`/folder/${folderId}`);
};

const getFolderView = async (req, res) => {
  const folder = await getFolderById(+req.params.id, req.user.id);
  res.render('folder', {
    title: 'My Files',
    folderId: folder.id,
    folders: folder.subFolders,
    files: folder.items,
  });
};

export { addFolder, getFolderView };
