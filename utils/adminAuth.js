const withAdminAuth = (req, res, next) => {
    if (!req.session.admin) {
      res.redirect('/dashboard');
    } else {
      next();
    }
  };
  
    module.exports = withAdminAuth;