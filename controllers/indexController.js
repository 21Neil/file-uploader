const getIndexView = async (req, res) => {
  res.render('index', {
    user: req.user,
    title: 'Home'
  })
}

export {
  getIndexView
}
