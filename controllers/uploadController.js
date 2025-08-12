import multer from 'multer';
import { uploadFile } from '../prisma/queries.js';
import { getFolderPath } from '../lib/pathUtils.js';
import fs from 'fs';

const upload = multer({ dest: 'files/temp/' });

const getUploadView = (req, res) => {
  res.render('upload', {
    title: 'Upload',
  });
};

const postUpload = [
  upload.single('file'),
  async (req, res, next) => {
    const folderId = parseInt(req.body.folderId);
    const file = req.file;

    if (!file) return res.status(400).send('No file uploaded.');
    if (!folderId) {
      fs.unlink(file.path, err => {
        if (err) console.log(err);
      });
      return res.status(400).send('Folder id is missing.');
    }

    try {
      const folderPath = await getFolderPath(folderId);
      const filename = Buffer.from(file.originalname, 'latin1').toString(
        'utf8'
      );

      fs.rename(file.path, `files/${folderPath}/${filename}`, err => {
        if (err) console.log(err);
      });

      await uploadFile(filename, file.size, folderId);
    } catch (err) {
      next(err);
      res.status(500).send('An unexpected error occurred.');
    }

    res.redirect(`folder/${folderId}`);
  },
];

export { getUploadView, postUpload };
