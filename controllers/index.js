const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');
const profileRoutes = require('./profile-routes.js');
const errorRoutes = require('./errorPage-routes.js');
const allPostsRoutes = require('./allPosts-routes.js');
const adminRoutes = require('./admin-routes.js');

router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);
router.use('/allPosts', allPostsRoutes);
router.use('/errorPage', errorRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

// we'll receive a 404 error indicating we have requested an incorrect resource, another RESTful API practice.

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;