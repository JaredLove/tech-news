// mported the Model class and DataTypes object from Sequelize. 
// This Model class is what we create our own models from using the 
// extends keyword so User inherits all of the functionality the Model class has. 

// Each column's definition gets its own type definition, 
// in which we use the imported Sequelize DataTypes object to define 
// what type of data it will be
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// import bcrypt for password hashing
// The bcrypt package will encrypt the user's password so that it's not 
// saved as plain text in the database. This is important because we don't
// want anyone who gains access to the database to be able to see sensitive
// data like a user's password.
const bcrypt = require('bcrypt');

// create our User model
// Once we create the User class, we use the .init() method to initialize the model's 
// data and configuration, passing in two objects as arguments. The first object will 
// define the columns and data types for those columns. The second object it accepts 
// configures certain options for the table.
class User extends Model {
  // set up method to run on instance data (per user) to check password
  // The checkPassword() instance method will become a part of instances (i.e. user objects) 
  // created from this model, so we can perform a check to see if an unhashed password 
  // entered by the user matches the hashed password stored in the database.
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configuration
// The .init() method we execute after is the part that actually 
// provides context as to how those inherited methods should work.
// The first argument passed to the init() method is an object that 
// will define the columns and data types for those columns. The second
// argument passed to the init() method configures certain options for the table.
User.init(
  {
     // define an id column
     id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
      },
      // define a username column
      username: {
        type: DataTypes.STRING,
           // there cannot be any duplicate username values in this table
           unique: true,
        allowNull: false
      },
      // define an email column
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
          isEmail: true
        }
      },
      // define a password column
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // this means the password must be at least four characters long
          len: [4]
        }
      },

      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      profilepicture: {
        type: DataTypes.STRING,
        defaultValue: 'default-profile-picture.jpg' // Default profile picture filename
      },
  },
  {

    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      // beforeCreate will only run if a user is creating an account to hash the password
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
        
        // set up beforeUpdate lifecycle "hook" functionality
        // beforeUpdate will only run if a user is updating their password so that the new password is hashed     
  async beforeUpdate(updatedUserData) {
    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
    return updatedUserData;
  }
    },
    // hooks: {
    //   // set up beforeCreate lifecycle "hook" functionality
    //   beforeCreate(userData) {
    //     return bycrypt.hash(userData.password, 10).then(newUserData => {
    //       return newUserData
    //     });
    //   } 
    // }
  
  
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

// export the newly created model so we can use it in other parts of the app
module.exports = User;