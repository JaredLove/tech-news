const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


// The res.render() method can accept a second argument, an object, which includes all of the data you want to pass to your template.
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
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
              attributes: ['id','username']
            }
          },
          {
            model: User,
            attributes: ['id','username']
          }
        ]
      })

      .then(dbPostData => {
          // pass a single post object into the homepage template
        //   The data that Sequelize returns is actually a Sequelize 
        //   object with a lot more information attached to it than you 
        //   might have been expecting. To serialize the object down to 
        //   only the properties you need, you can use Sequelize's get() method.

        // This will loop over and map each Sequelize object into a serialized 
        // version of itself, saving the results in a new posts array. Now we can 
        // plug that array into the template. However, even though the render() 
        // method can accept an array instead of an object, that would prevent us 
        // from adding other properties to the template later on. To avoid future 
        // headaches, we can simply add the array to an object and continue 
        // passing data to the template as an object.
        const posts = dbPostData.map(post=> post.get({ plain: true }));
        res.render('homepage', { 
          posts,
          admin: req.session.admin,
          loggedIn: req.session.loggedIn
        });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});


router.get('/login', (req, res) => {
  console.log('======================');
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});




router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
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
          attributes: ['id','username']
        }
      },
      {
        model: User,
        attributes: ['id','username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('single-post',{
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;