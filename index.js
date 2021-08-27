const express = require('express'),
morgan = require('morgan');
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

let topTenMovies = [
    {
      title: 'Furie',
      director: 'Le Van Kiet',
      released: "2/22/2019",
      Rating: "6.3/10",
      Actors: ["Veronica Ngo", "Phan Thanh Nhien", "Pham Anh Khoa"],
      genre: "action"
    },

    {
      title: 'See You Yesterday',
      director: 'Stefon Bristol',
      released: "5/3/2019",
      Rating: "5.2/10",
      Actors: ["Eden Duncan-Smith", "Stro", "Michael J. Fox"],
      genre: "Science fiction"
    },

    {
      title: 'Raya and The Last Dragon',
      director: 'Carlos Lopez Estrada',
      released: "3/5/2021",
      Rating: "7.4/10",
      Actors: ["Kelly Marie Tran", "Awkwafina", "Gemma Chan"],
      genre: "Animation"
    },

    {
      title: 'A Quiet Place',
      director: 'John Krasinski',
      released: "4/6/2018",
      Rating: "7.5/10",
      Actors: ["John Krasinski", "Emiley Blunt", "Cillian Murphy"],
      genre: "Thriller"
    },

    {
      title: 'Harry Potter and the  Deathly Hallows: Part 2',
      director: 'David Yates',
      released: "7/15/2011",
      Rating: "8.1/10",
      Actors: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson"],
      genre: "Fantasy Fiction"
    },

    {
      title: 'Avatar',
      director: 'James Cameron',
      released: "12/18/2009",
      Rating: "7.8/10",
      Actors: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      genre: "Fantasy Fiction"
    },

    {
      title: 'Crazy Rich Asians',
      director: 'Jon M. Chu',
      released: "8/15/2018",
      Rating: "6.9/10",
      Actors: ["Constance Wu", "Henry Golding", "Awkwafina"],
      genre: "Drama"
    },

    {
      title: 'White Chicks',
      director: 'Keenen Ivory Wayans',
      released: "6/23/2004",
      Rating: "5.6/10",
      Actors: ["Marlon Wayans", "Shawn Wayans", "Trey Crews"],
      genre: "Comedy"
    },

    {
      title: 'Bird Box',
      director: 'Susanne Bier',
      released: "12/14/2018",
      Rating: "6.6/10",
      Actors: ["Sandra Bullock", "Trevante Rhodes", "Sarah Paulson"],
      genre: "Thriller"
    },

    {
      title: 'Black Panther',
      director: 'Ryan Coogler',
      released: "2/16/2018",
      Rating: "7.3/10",
      Actors: ["Chadwich Boseman", "Lupita Nyong'o", "Michael B. Jordan"],
      genre: "Action"
    },
];

let genres = [
    {
      title: "Thriller",
      discription: "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.",
    },
    {
      title: "Action",
      discription: "Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases.",
    },
    {
      title: "Comedy",
      discription: "Comedy Films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
    },
    {
      title: "Drama",
      discription: "Drama Films are serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
    },
    {
      title: "Fantasy Fiction",
      discription: "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.",
    },
    {
      title: "Animation",
      discription: "An animated movie or cartoon, is made up of a series of slightly different drawings of people, animals, and objects that make them appear to move.",
    },
    {
      title: "Science fiction",
      discription: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, alien worlds, extrasensory perception and time travel, along with futuristic elements such as spacecraft, robots, cyborgs, interstellar travel or other technologies.",
    },
];

let directors = [
  {
    name: "Le Van Kiet",
    bio:  "LE-VAN Kiet grew up in the United States, where he studied at the UCLA School of Theater, Film and Television. In his debut film Dust of Life (2006), a coming-of-age drama, he incorporated an episode from his personal life - the exodus of Vietnamese boat people in the 1970s and 1980s. Since then, drama and horror have taken turns in his work.",
    birthyear: 1978,
    deathyear: "",
  },
  {
    name: "Stefon Bristol",
    bio:  "Brooklyn-born, Long Island-bred, Stefon Bristol is writing his own success story as a fresh face with a creative voice in the indie film world. Bristol graduated from the best college in the United States of America, MOREHOUSE College and NYU’s Tisch School of the Arts",
    birthyear: 1988,
    deathyear: "",
  },
  {
    name: "Carlos Lopez Estrada",
    bio:  "Carlos López Estrada is a Mexican-American filmmaker, music video director, commercial director, theatre director, and actor. Born in Mexico, he moved to the United States when he was 12 and later enrolled at Chapman University. He made his feature film directorial debut in 2018 with Blindspotting.",
    birthyear: 1988,
    deathyear: "",
  },
  {
    name: "John Krasinski",
    bio:  "John Burke Krasinski is an American actor, director, producer, and screenwriter. He has received four Primetime Emmy Award nominations and won two Screen Actors Guild Awards. He was named by Time magazine as one of the 100 most influential people in the world in 2018.",
    birthyear: 1979,
    deathyear: "",
  },
  {
    name: "David Yates",
    bio:  "David Yates is an English film director who has directed films, short films, and television productions. He is best known for directing the later four films in the Harry Potter series and the first two films in the Harry Potter prequel series, Fantastic Beasts.",
    birthyear: 1963,
    deathyear: "",
  },
  {
    name: "James Cameron",
    bio:  "James Francis Cameron CC is a Canadian film director, producer, screenwriter, editor, artist, and environmentalist who currently lives in New Zealand. He is best known for making science fiction and epic films. Cameron first gained recognition for directing The Terminator.",
    birthyear: 1954,
    deathyear: "",
  },
  {
    name: "Jon M. Chu",
    bio:  "Jonathan Murray Chu is an American film and television director, producer, and screenwriter. He is best known as the director of 2018's Crazy Rich Asians, the first film by a major Hollywood studio to feature a majority cast of Asian descent in a modern setting since The Joy Luck Club in 1993.",
    birthyear: 1979,
    deathyear: "",
  },
  {
    name: "Keenen Ivory Wayans",
    bio:  "Keenen Ivory Desuma Wayans is an American actor, comedian, filmmaker, and a member of the Wayans family of entertainers. He first came to prominence as the host and the creator of the 1990–1994 Fox sketch comedy series In Living Color.",
    birthyear: 1958,
    deathyear: "",
  },
  {
    name: "Susanne Bier",
    bio:  "Susanne Bier is a Danish film director, screenwriter, and producer. She is best known for her feature films Brothers, After the Wedding, In a Better World, and Bird Box, and the TV miniseries The Night Manager on AMC and The Undoing on HBO.",
    birthyear: 1960,
    deathyear: "",
  },
  {
    name: "Ryan Coogler",
    bio:  "Ryan Kyle Coogler is an American film director, producer, and screenwriter. His first feature film, Fruitvale Station, won the top audience and grand jury awards in the U.S. dramatic competition at the 2013 Sundance Film Festival.",
    birthyear: 1986,
    deathyear: "",
  },
];

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/documentation', (req, res) => {
   res.sendFile('public/documentation.html', {root: __dirname});
 });

app.get('/', (req, res) => {
  res.send('Welcome to My Flix App!');
});

//Get the list of data about All movies
app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

//Gets data about a specific movie
app.get('/movies/:title', (req, res) => {
   res.json(topTenMovies.find((movie) => {
     return movie.title === req.params.title
   }));
 });

//Gets data about the directors
app.get("/directors", (req, res) => {
  res.json(directors);
  res.send("Successful GET request returning data on all directors");
});
//Return data about a director by name
app.get("/directors/:name", (req, res) => {
  res.json(
    directors.find(director => {
      return director.name === req.params.name;
    })
  );
   res.send("Successful GET request returning data about " + director.name);
 });

//Gets data about the movie genre
app.get("/genres", (req, res) => {
  res.json(genres);
  res.send("Successful GET request returning data on all genres");
});
//Return data about a genre
app.get("/genres/:title", (req, res) => {
  res.json(
    genres.find(genre => {
      return genre.title === req.params.title;
    })
  );
  res.send("Successful GET request returning data about " + genre.title);
});
 //New User Account Registration

 app.post('/users', (req, res) => {
   res.json('Successful POST request for new user registration');
 });

//Update User Information

app.put('/users/:username', (req, res) => {
  res.json('Successful PUT request for updating users username');
});

//  Existing User Deregistration

 app.delete('/users/:username', (req, res) => {
   res.json('Successful DELETE request for deregistration of users account');
 });

// Adding movies to list of favorites

app.post('/users/:username/favorites', (req, res) => {
  res.json('Successful POST request that add movies to a favorite list');
});

//Deleting movie from list of favorite

app.delete('/users/:username/favorites', (req, res) => {
  res.json('Successful DELETE request that removes movies from a favorite list');
});

//Error

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
