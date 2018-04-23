// require the .env file that contains api keys
require('dotenv').config();

// require keys.js file
const keys = require('./keys.js');

// Twitter npm package
const Twitter = require('twitter');

const client = new Twitter(keys.twitter);

// Spotify npm package
const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);

let songTitle;

const searchSong = function() {
  spotify.search({ type: 'track', query: songTitle, limit: 1 }, function (err, data) {

    if (err) {
      return console.log(`Error occurred: ${err}`);
    }

    console.log(`The song "${data.tracks.items[0].name}" is by ${data.tracks.items[0].artists[0].name}.\nIt is on their album, ${data.tracks.items[0].album.name}.\nPreview the song here: ${data.tracks.items[0].preview_url}`);

    // return data;
  });
};

// OMDB npm package
const request = require('request');

const omdbKey = keys.omdb.key;

// do what it says using fs node package and random.txt file
const fs = require('file-system');

// Twitter

if (process.argv[2] === 'my-tweets' && !process.argv[3]) {
  let params = { beckspics: 'nodejs' };
  client.get('statuses/user_timeline', params, function(error, tweets) {
    if (!error) {
      if (tweets.length < 20) {
        for (let i = 0; i < tweets.length; i++) {
          console.log(`${tweets[i].text}\n${tweets[i].created_at}`);
        }
      } else {
        for (let i = 0; i < 20; i++) {
          console.log(`${tweets[i].text}\n${tweets[i].created_at}`);
        }
      }
    }
  });
} else if (process.argv[2] === 'spotify-this-song' && process.argv[3] && !process.argv[4]) {
  songTitle = process.argv[3];
  searchSong();
} else if (process.argv[2] === 'movie-this' && process.argv[3] && !process.argv[4]) {
  const movieTitleInput = process.argv[3];
  const titleArray = movieTitleInput.split(' ');
  const movieTitle = titleArray.join('+');
  console.log(movieTitle);

  request(`http://www.omdbapi.com/?apikey=${omdbKey}&t=${movieTitle}`, function (err, response, body) {
    if (err) {
      return console.log(err);
    }
    console.log(`Title: ${JSON.parse(body).Title}\nYear released: ${JSON.parse(body).Year}\nIMDB Rating: ${JSON.parse(body).Ratings[0].Value}\nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}\nCountry: ${JSON.parse(body).Country}\nLanguage: ${JSON.parse(body).Language}\nPlot: ${JSON.parse(body).Plot}\nActors: ${JSON.parse(body).Actors}`);
  });
} else if (process.argv[2] === 'do-what-it-says' && !process.argv[3]) {
  fs.readFile('./random.txt', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }

    let command;
    [command, songTitle] = data.split(',');

    console.log(songTitle);

    searchSong();
  });
} else if (process.argv[2] !== 'spotify-this-song' || 'my-tweets' || 'movie-this' || 'do-what-it-says') {
  console.log('4 Please use a valid format --> node liri.js "your request here (choose: spotify-this-song, my-tweets, movie-this or do-what-it-says) "song or movie title here (or leave blank for my-tweets and do-what-it-says"');
}
