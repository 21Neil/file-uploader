import { getFilePath } from '../lib/pathUtils.js';
import { deleteItemById } from '../prisma/queries.js';
import fs from 'fs';

export const deleteFile = async (req, res, next) => {
  const fileId = parseInt(req.body.fileId);
  const folderId = parseInt(req.body.folderId);
  const path = await getFilePath(fileId);

  fs.unlink(`files/${path}`, err => {
    if (err) {
      console.log(err);
      next(err);
    }
  });
  await deleteItemById(fileId);

  res.redirect(`/folder/${folderId}`);
};

export const downloadFile = async (req, res) => {
  const id = parseInt(req.params.id)
  const path = await getFilePath(id)

  res.download(`files/${path}`)
}
