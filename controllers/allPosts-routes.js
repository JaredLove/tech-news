const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');







router.get('/', (req, res) => {
    console.log('======================');
    const itemsPerPage = 8; // Number of items per page
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * itemsPerPage;
        Post.findAll({
            limit: itemsPerPage,
            offset: offset,
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
          // passing an object to the template.
          
          const posts = dbPostData.map(post => post.get({ plain: true }));
          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = posts.length === itemsPerPage ? page + 1 : null;
          console.log(dbPostData.length);
        // console.log(posts);
          res.render('allPosts', { 
            posts, 
            prevPage, 
            nextPage,
            loggedIn: req.session.loggedIn
          });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
  });



  module.exports = router;