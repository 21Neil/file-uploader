const getIndexView = async (req, res) => {
  res.render('index', {
    title: 'Home',
  });
};

export { getIndexView };
