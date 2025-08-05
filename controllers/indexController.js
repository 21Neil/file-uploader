import { getFolderById } from "../prisma/queries.js"

const getIndexView = async (req, res) => {
  if (res.locals.currentFolder) {
    const folder = await getFolderById(res.locals.currentFolder)
    res.render('index', {
      title: 'Home',
      folders: folder.subFolders,
      files: folder.items
    })
  } else {
    res.render('index', {
      title: 'Home'
    })
  }
}

export {
  getIndexView
}
