const express = require('express'),
  morgan = require('morgan');

const app = express();

let topTenMovies = [
    {
      title: 'Furie',
      director: 'Le Van Kiet'
    },

    {
      title: 'See You Yesterday',
      director: 'Stefon Bristol'
    },

    {
      title: 'Raya and The Last Dragon',
      director: 'Carlos Lopez Estrada'
    },

    {
      title: 'A Quiet Place',
      director: 'John Krasinski'
    },

    {
      title: 'Harry Potter and the  Deathly Hallows: Part 2',
      director: 'David Yates'
    },

    {
      title: 'Avatar',
      director: 'James Cameron'
    },

    {
      title: 'Crazy Rich Asians',
      director: 'Jon M. Chu'
    },

    {
      title: 'White Chicks',
      director: 'Keenen Ivory Wayans'
    },

    {
      title: 'Bird Box',
      director: 'Susanne Bier'
    },

    {
      title: 'Black Panther',
      director: 'Ryan Coogler'
    },
]

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to My Flix App!');
});

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
