// mported the Model class and DataTypes object from Sequelize. 
// This Model class is what we create our own models from using the 
// extends keyword so User inherits all of the functionality the Model class has. 

// Each column's definition gets its own type definition, 
// in which we use the imported Sequelize DataTypes object to define 
// what type of data it will be
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');



// Here, we're using JavaScript's built-in static keyword to indicate 
// that the upvote method is one that's based on the Post model and not 
// an instance method like we used earlier with the User model. This 
// exemplifies Sequelize's heavy usage of object-oriented principles and concepts.
class Post extends Model {
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}


// create fields/columns for Post model
Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isURL: true
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
    }
  );

  module.exports = Post;