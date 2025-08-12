const setCurrentFolderId = (req, res, next) => {
  const folderId = req.params.id;

  if (folderId) {
    res.locals.currentFolderId = +folderId;
  } else {
    res.locals.currentFolderId = null;
  }

  next();
};

export default setCurrentFolderId;
