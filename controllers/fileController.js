import { getFilePath } from '../lib/pathUtils.js';
import { deleteItemById, getFileById } from '../prisma/queries.js';
// import fs from 'fs';
import { deleteFileFromR2, getFileFromR2 } from '../services/r2Services.js';

export const deleteFile = async (req, res, next) => {
  const fileId = parseInt(req.body.fileId);
  const folderId = parseInt(req.body.folderId);
  const path = await getFilePath(fileId);

  // fs.unlink(`files/${path}`, err => {
  //   if (err) {
  //     console.log(err);
  //     next(err);
  //   }
  // });
  await deleteFileFromR2(path)
  await deleteItemById(fileId);

  res.redirect(`/folder/${folderId}`);
};

export const downloadFile = async (req, res) => {
  const id = parseInt(req.params.id)
  const path = await getFilePath(id)
  const fileBuffer = await getFileFromR2(path)
  const file = await getFileById(id)

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(file.filename)}`)
  res.send(fileBuffer)
}
