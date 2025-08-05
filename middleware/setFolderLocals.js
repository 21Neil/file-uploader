const setFolderLocals = (req, res, next) => {
  if(req.user && req.user.folder) res.locals.currentFolder = req.user.folder.id;
  next()
}

export default setFolderLocals
