const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');




class Comment extends Model{}


Comment.init(
    {
      // columns will go here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // this menas the comment must be atleast 4 characters long
            len: [4]
        },
      },
      
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'comment'
    }
  );
  
  module.exports = Comment;