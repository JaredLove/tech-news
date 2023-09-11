const router = require('express').Router();
const { User, Post, Comment, Vote } = require("../../models");



// GET /api/users
router.get('/', (req, res) => {
    // The .findAll() method lets us query all of the users 
    // from the user table in the database, and is the 
    // JavaScript equivalent of the following SQL query: SELECT * FROM users;
                                            
    // Access our User model and run .findAll() method)
  User.findAll({
    attributes: { exclude: ['password'] }
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// GET /api/users/1
router.get('/:id', (req, res) => {

//     In this case, we're using the where option to indicate we want to find a user where its id value equals whatever req.params.id is, much like the following SQL query:

// SELECT * FROM users WHERE id = 1
    User.findOne({
      attributes: { exclude: ['password'] },
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at']
          },
          // include the Comment model here:
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          },
          {
            model: Post,
            attributes: ['title'],
            through: Vote,
            as: 'voted_posts'
          }
        ]

      })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
      // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    //   .create() method. Pass in key/value pairs where the keys are what we defined in the User 
    //   model and the values are what we get from req.body. In SQL, this command would look like 
    //   the following code:

    //   INSERT INTO users
    //     (username, email, password)
    //   VALUES
    //     ("Lernantino", "lernantino@gmail.com", "password1234");
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })     
  .then(dbUserData => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.admin = dbUserData.admin;
      req.session.loggedIn = true;

      res.json(dbUserData);
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// router.post('/:id', (req, res) => {
//   User.findByPk({
//     where:{
//       id: req.session.user_id
//     }
//   })
// });

router.post('/login', (req, res) => {

  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  // We queried the User table using the findOne() method for the email entered by the user and assigned it to req.body.email.
  // If the user with that email was not found, a message is sent back as a response to the client. However, if the email was 
  // found in the database, the next step will be to verify the user's identity by matching the password from the user and the 
  // hashed password in the database. This will be done in the Promise of the query.
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.admin = dbUserData.admin;
      req.session.loggedIn = true;
  
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
     // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead

//   This .update() method combines the parameters for creating data and looking up data. 
//   We pass in req.body to provide the new data we want to use in the update and req.params.id 
//   to indicate where exactly we want that new data to be used.

// The associated SQL syntax would look like the following code:

// UPDATE users
// SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
// WHERE id = 1;
  User.update(req.body, {
    //  We pass in req.body to provide the new data we want to use in the update and req.params.id
    // to indicate where exactly we want that new data to be used.
    // individualHooks: true is set so that the beforeUpdate and afterUpdate hooks will be executed.
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {

    // .destroy() method and provide some type of identifier 
    // to indicate where exactly we would like to delete data 
    // from the user database table.
    User.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});



module.exports = router;