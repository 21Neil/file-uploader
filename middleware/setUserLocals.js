const setUserLocals = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

export default setUserLocals