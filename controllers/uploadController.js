import multer from 'multer'
import { uploadFile } from '../prisma/queries.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/' + res.locals.currentFolder)
  },
  filename: async (req, file, cb) => {
    const filename = Buffer.from(file.originalname, 'latin1').toString('utf8')
    await uploadFile(filename, res.locals.currentFolder)
    cb(null, filename)
  }
})
const upload = multer({ storage })

const getUploadView = (req, res) => {
  res.render('upload', {
    title: 'Upload',
  })
}

const postUpload = [
  upload.single('file'),
  async (req, res) => {
    console.log(req.file)
    res.render('upload', {
      title: 'Upload',
      msg: 'Upload success',
    })
  }
]

export {
  getUploadView,
  postUpload,
}
