import { getFilePath, getFolderPath } from '../lib/pathUtils.js';
import {
  createFolder,
  deleteFolderById,
  deleteItemById,
  getFolderById,
  updateFolderNameById,
} from '../prisma/queries.js';
import { deleteFileFromR2 } from '../services/r2Services.js';
// import fs from 'fs';

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
    await createFolder(foldername, userId, folderId);
    await getFolderPath(folderId);
    // const newFolder = await createFolder(foldername, userId, folderId);
    // const folderPath = await getFolderPath(folderId);
    // fs.mkdir(`files/${folderPath}/${newFolder.id}`, err => {
    //   if (err) console.log(err);
    // });
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

const renameFolder = async (req, res) => {
  const { id, name, currentFolderId } = req.body;

  await updateFolderNameById(+id, name);

  res.redirect(`/folder/${currentFolderId}`);
};

const deleteFolder = async (req, res) => {
  const { id, currentFolderId } = req.body;
  // const path = `files/${await getFolderPath(+id)}`;
  const deleteFolderRecursive = async folderId => {
    const folder = await getFolderById(folderId);

    if (folder.subFolders) {
      for (const subFolder of folder.subFolders) {
        await deleteFolderRecursive(subFolder.id);
      }
    }
    if (folder.items) {
      for (const item of folder.items) {
        const path = await getFilePath(item.id);

        await deleteFileFromR2(path);
        await deleteItemById(item.id);
      }
    }
    await deleteFolderById(folder.id);
  };

  // fs.rmSync(path, { recursive: true, force: true });
  await deleteFolderRecursive(+id);

  res.redirect(`/folder/${currentFolderId}`);
};

export { addFolder, getFolderView, renameFolder, deleteFolder };
