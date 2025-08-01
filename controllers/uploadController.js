import multer from 'multer'
import { uploadFile } from '../prisma/queries.js'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('files/' + req.user.id)) fs.mkdirSync('files/' + req.user.id)
    cb(null, 'files/' + req.user.id)
  },
  filename: async (req, file, cb) => {
    const filename = Buffer.from(file.originalname, 'latin1').toString('utf8')
    await uploadFile(filename)
    cb(null, filename)
  }
})
const upload = multer({ storage })

const getUploadView = (req, res) => {
  res.render('upload', {
    title: 'Upload',
    user: req.user
  })
}

const postUpload = [
  upload.single('file'),
  async (req, res) => {
    console.log(req.file)
    res.render('upload', {
      title: 'Upload',
      msg: 'Upload success',
      user: req.user
    })
  }
]

export {
  getUploadView,
  postUpload,
}
