const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const withAdminAuth = require('../utils/adminAuth');





router.get('/', withAdminAuth, (req, res) => {
    User.findAll({
      attributes: [
        'id',
        'username',
        'email',
        'admin'
  
      ],
    })
      .then(dbUserData => {
      const users = dbUserData.map(user => user.get({ plain: true }));
      console.log(users);

      res.render('admin', { 
        users,
        admin: req.session.admin,
        loggedIn: req.session.loggedIn
      });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


  router.get('/edit/user/:id', withAdminAuth, (req, res) => {
    User.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'username',
        'email',
        'admin',
        'password'
      ]
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        
        const user = dbUserData.get({ plain: true });
        res.render('edit-user', { 
          user,
          admin: req.session.admin,
          loggedIn: req.session.loggedIn
        });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

  module.exports = router;