import multer from 'multer';
import { uploadFile } from '../prisma/queries.js';
import { getFolderPath } from '../lib/pathUtils.js';
import fs from 'fs';
import { uploadFileToR2 } from '../services/r2Services.js';

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
      const fileContent = fs.readFileSync(file.path, err => {
        if (err) {
          console.log(err);
          next(err);
        }
      });

      // fs.rename(file.path, `files/${folderPath}/${filename}`, err => {
      //   if (err) console.log(err);
      // });

      fs.unlink(file.path, err => {
        if (err) console.log(err);
      });

      await uploadFileToR2(
        `${folderPath}/${filename}`,
        fileContent,
        file.mimetype
      );
      await uploadFile(filename, file.size, file.mimetype, folderId);
    } catch (err) {
      next(err);
      res.status(500).send('An unexpected error occurred.');
    }

    res.redirect(`folder/${folderId}`);
  },
];

export { getUploadView, postUpload };
