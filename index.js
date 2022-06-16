const express = require('express'),
morgan = require('morgan');
bodyParser = require('body-parser'),
uuid = require('uuid');
const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
const cors = require('cors');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb://localhost:27017/theMoviesdb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

let allowedOrigins = [
  'http://localhost:8081', 
  'http://localhost:1234', 
  'https://nhas-flixdb-2021.herokuapp.com', 
  'https://nv-myflix.netlify.app', 
  'http://localhost:4200', 
  '*',
  'https://iamvonha.github.io',
  'https://iamvonha.github.io/',
  'https://github.com/IamVoNha/myFlix-client',
  'https://iamvonha.github.io/myFlix-Angular-client',
  'https://iamvonha.github.io/myFlix-Angular-client/',
  'https://iamvonha.github.io/myFlix-Angular-client/movies',
];
 
 app.use(cors({
   origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
     return callback(null, true);
   }
 }));

// Importing Auth.js & Passport.js
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/** Get the homepage
* @method GET
* @param {string} endpoint - endpoint to load the homepage: "/"
* @returns {object} - returns the welcome page
*/
app.get('/', (req, res) => {
  res.send('Welcome to My Flix Database!');
});

/**
  * Get the list of data about All movies 
  * @method GET
  * @param {string} endpoint - endpoint to fetch all movies: "/movies"
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, returns all movies
  */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find()
   .then((movies) => {
     res.status(201).json(movies);
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ', err);
   });
});

/**
  * Gets data about a specific movie
  * @method GET
  * @method GET
  * @param {string} endpoint - endpoint to fetch a single movie: "/movies/:Title"
  * @param {string} - movie name is required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, returns single movie
  */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.findOne({ Title: req.params.Title })
     .then((movie) => {
       res.json(movie);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
     });
 });

/**
  * Return data about a director by name
  * @method GET
  * @param {string} endpoint - endpoint to fetch a director: "/movies/director/:Name"
  * @param {string} - director name is required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, returns director
  */
app.get("/movies/director/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.findOne({ "Director.Name": req.params.Name })
     .then(movie => {
       res.status(201).json(movie.Director);
     })
     .catch(err => {
       console.error(err);
       res.status(500).send("Error: " + err);
     });
 });

/** Get a single genre
  * @method GET
  * @param {string} endpoint - endpoint to fetch a genre: "/movies/genre/:Name"
  * @param {string} - genre name is required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, returns genre
  */
app.get("/movies/genre/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.findOne({ "Genre.Name": req.params.Name })
     .then(movie => {
       res.status(201).json(movie.Genre);
     })
     .catch(err => {
       console.error(err);
       res.status(500).send("Error: " + err);
     });
 });

/** Allow a user to register
  * @method POST
  * @param {string} endpoint - endpoint to register a user: "/users"
  * @param {string} - user information is required in following JSON format:
    * {
    *   Username: String,(required)
    *   Password: String,(required)
    *   Email: String,(required)
    *   Birthday: Date
    *  }
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, adds user information to database
  */
 app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/** Get all users
  * @method GET
  * @param {string} endpoint - endpoint to get all users: "/users"
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, gets all users
  */
app.get("/users", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/** Get a single user by username
  * @method GET
  * @param {string} endpoint - endpoint to get all users: "/users/:Name"
  * @param {string} - username is required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, gets single user
  */
app.get('/users/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOne({Name: req.params.Name})
    .then ((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** Allow a user to update their information
  * @method PUT
  * @param {string} endpoint - endpoint to register a user: "/users/:Username"
  * @param {string} - user information is required in following JSON format:
    * {
    *   Username: String,(required)
    *   Password: String,(required)
    *   Email: String,(required)
    *   Birthday: Date
    *  }
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, user information is updated
  */
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/** Allow existing users to delete their account
  * @method DELETE
  * @param {string} endpoint - endpoint to register a user: "/users/:Username"
  * @param {string} - username is required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, user's account is deleted from database
  */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(400).send('Error: ' + err);
      });
  }
);

/**
  * Add a movie as favorite using authentication
  * @method POST
  * @param {string} endpoint - endpoint to register a user: "/users/:Username/movies/:MovieID"
  * @param {string} - username and movie ID are required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, movie is added to user's list of favorites
  */
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
  * Remove a movie from favorites using authentication
  * @method DELETE
  * @param {string} endpoint - endpoint to register a user: "/users/:Username/movies/:MovieID"
  * @param {string} - username and movie ID are required
  * @returns {object} - returns success/error message
  * @returns {object} - if successful, movie is deleted from user's list of favorites
  */
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);


//Error

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
