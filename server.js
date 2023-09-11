require('dotenv').config();

const express = require('express');
const routes = require('./controllers');
const path = require('path');
const session = require('express-session');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;
// 
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');


// template engine handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });




// create session
const sess = {
  secret: (process.env.SECRET),
  cookie: {},
  resave: false,
  saveUninitialized: true,
  // The store property indicates that we want to store the session data in the Sequelize store.
  store: new SequelizeStore({
    db: sequelize
  })
};
app.use(session(sess));

// set up handlebars.js engine with custom helpers
// The app.engine() method tells Express.js to use the express-handlebars package as the template engine.
// The first argument ('handlebars') sets the engine name to 'handlebars' (any name can be used here).
// The second argument (hbs.engine) calls the imported express-handlebars instance. This is the module
// that parses our templates and turns them into HTML.
// The app.set() method assigns the handlebars.js engine to the Express.js app as the template engine.
// The first argument ('view engine') sets an Express.js setting named view engine. We use the same
// syntax as the key in the app.engine() method so that Express.js knows to use the handlebars.js package
// for our template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// The express.static() method is a built-in Express.js middleware function that can take all of the contents 
// of a folder and serve them as static assets. This is useful for front-end specific files like images, style 
// sheets, and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));


// turn on routes
app.use(routes);





// turn on connection to db and server
// In the sync method, there is a configuration parameter { force: false }. 
// If we change the value of the force property to true, then the database 
// connection must sync with the model definitions and associations. By forcing 
// the sync method to true, we will make the tables re-create if there are any association changes.
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
  });