const User = require('./User');

const Post = require('./Post');

const Vote = require('./Vote');

const Comment = require('./Comment');



// create associations
// A user can make many posts. But a post only belongs to a single user, 
// and never many users. By this relationship definition, 
// we know we have a one-to-many relationship.
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

  // We also need to make the reverse association by adding the following statement:
  // This association creates the reference for the id column in the User model to link to the corresponding
  // foreign key pair, which is the user_id in the Post model.
  Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });


  // The Vote model will connect the User and Post models together,
  // as each vote will belong to a user and a post.
  // We'll also need to make the reverse association in the User and Post models.
  // This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Vote model.
  User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
  });
  
  // We also need to make the reverse association by adding the following statement:
  // This association creates the reference for the id column in the Post model to link to the corresponding foreign key pair, which is the post_id in the Vote model.
  Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
  });

  Vote.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
  Vote.belongsTo(Post, {
    foreignKey: 'post_id'
  });
  
  User.hasMany(Vote, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Vote, {
    foreignKey: 'post_id'
  });


  Comment.belongsTo(User, {
    foreignKey: 'user_id'
  });

  Comment.belongsTo(Post, {
    foreignKey: 'post_id'
  })

  User.hasMany(Comment, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Comment, {
    foreignKey: 'post_id'
  });









    module.exports = { User, Post, Vote, Comment };