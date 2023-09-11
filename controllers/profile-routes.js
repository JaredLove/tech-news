const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { User, Post, Vote, Comment } = require('../models');



router.get('/', withAuth, (req, res) => {
  if (req.session.loggedIn) {
  User.findOne({
        attributes: { exclude: ['password'] },
        where : { id: req.session.user_id }
    })
    .then(dbUserData => {
        // serialize data before passing to template
        const profileImages = ['default-profile-picture.jpg', 'art.jpg', 'walle.jpg'];
        const user = dbUserData.get({ plain: true });
        console.log(user);
        res.render('profile', { user, profileImages, admin: req.session.admin, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
    } else {
      res.redirect('/login');
    }
});
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: req.params.id },

    include: [
      {
        model: Post,
        attributes: ['id', 
        'title', 
        'post_url', 
        'created_at',
        ],
        include: 
        {
          model: Comment,
          attributes: ['id', 'post_id', 'created_at'],
        },


      },
    ]

  })

  .then(dbUserData => {
    // serialize data before passing to template
    const user = dbUserData.get({ plain: true });
    console.log(req.session.admin);
    res.render('userProfile', { user, admin: req.session.admin, loggedIn: true });
  })
  .catch(err => {
    res.redirect('/errorPage');
  });
});


router.get('/edit/:id', withAuth, (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    },
      attributes: ['username', 'email', 'profilepicture']
  })
  .then(dbUserData => {
    if (dbUserData) {
      const profileImages = ['art.jpg', 'default-profile-picture.jpg', 'walle.jpg'];
      const user = dbUserData.get({ plain: true });
      res.render('edit-profile', {
        user,
        profileImages,
        admin: req.session.admin,
        loggedIn: true
      });
    } else {
      res.status(404).end();
    }
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


module.exports = router;