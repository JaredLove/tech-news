const router = require('express').Router();


router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('errorPage', {loggedIn: true});
      }
      res.render('errorPage');
});


module.exports = router;