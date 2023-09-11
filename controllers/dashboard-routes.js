const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment } = require('../models');


router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
          // use the ID from the session
          user_id: req.session.user_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['id', 'username']
            }
          },
          {
            model: User,
            attributes: ['id','username', 'email']
          }
        ]
      })
        .then(dbPostData => {
          // serialize data before passing to template
          const posts = dbPostData.map(post => post.get({ plain: true }));
          console.log(req.session.admin);
          res.render('dashboard', { posts, admin: req.session.admin, loggedIn: true });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
  });


  router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
        attributes: ['id', 'title', 'post_url',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['id','username']
          }
        ]
    })
    .then(dbPostData => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });
     
        res.render('edit-post', {
          post,
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