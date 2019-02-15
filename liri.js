// Load exports from keys.js file which has Twitter auth keys
var keys = require("./keys.js");
var twitterCredentials = keys.twitterKeys;

// node liri.js [ command ] [ query - optional ]
var command = process.argv[2];
var query = process.argv[3];

// Functions for 3 main functions of the app
// 	--> do-what-it-says requires the use of functions
var myTweets = function() {
	// Load twitter module from npm
	var Twitter = require('twitter');

	// From exports of keys.js file
	var client = new Twitter({
		consumer_key: twitterCredentials.consumer_key,
		consumer_secret: twitterCredentials.consumer_secret,
		access_token_key: twitterCredentials.access_token_key,
		access_token_secret: twitterCredentials.access_token_secret
	});

	// Twitter API parameters
	var params = {
		screen_name: 'Shakywarrior',
		count: 20
	};

	// GET request for last 20 tweets on my account's timeline
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) { // if there IS an error
			console.log('Error occurred: ' + error);
		} else { // if there is NO error
	  	console.log("My 20 Most Recent Tweets");
	  	console.log("");

	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("( #" + (i + 1) + " )  " + tweets[i].text);
	  		console.log("Created:  " + tweets[i].created_at);
	  		console.log("");
	  	}
	  }
	});
}

var spotifyThisSong = function(trackQuery) {
	// Load Spotify npm package
	var spotify = require('spotify');

	// if no trackQuery is passed in, then we will be querying for this particular song
	if(trackQuery === undefined) {
		trackQuery = "the sign ace of base";
	}

	// Spotify API request (if an object is returned, output the first search result's artist(s), song, preview link, and album)
	spotify.search({ type: 'track', query: trackQuery }, function(error, data) {
	    if(error) { // if error
	        console.log('Error occurred: ' + error);
			} else { // if no error
				console.log(data.tracks.items[0].artists);
	    	// For loop is for when a track has multiple artists
				for(var i = 0; i < data.tracks.items[0].artists.length; i++) {
					if(i === 0) {
						console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
					} else {
						console.log("              " + data.tracks.items[0].artists[i].name);
					}
				}
				console.log("Song:         " + data.tracks.items[0].name);
				console.log("Preview Link: " + data.tracks.items[0].preview_url);
				console.log("Album:        " + data.tracks.items[0].album.name);
	    }
	 
	 		
	});
}

var movieThis = function(movieQuery) {
	// Load request npm module
	var request = require("request");

	// if query that is passed in is undefined, Mr. Nobody becomes the default
	if(movieQuery === undefined) {
		movieQuery = "mr nobody";
	}

	// HTTP GET request
	request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json", function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	    console.log("* Title of the movie:         " + JSON.parse(body).Title);
	    console.log("* Year the movie came out:    " + JSON.parse(body).Year);
	    console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
	    console.log("* Country produced:           " + JSON.parse(body).Country);
	    console.log("* Language of the movie:      " + JSON.parse(body).Language);
	    console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
	    console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

	    // For loop parses through Ratings object to see if there is a RT rating
	    // 	--> and if there is, it will print it
	    for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
	    	if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	    		console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
	    		if(JSON.parse(body).Ratings[i].Website !== undefined) {
	    			console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
	    		}
	    	}
	    }
	  }
	});
}

// App functionality due to user input
if(command === "my-tweets") {
	myTweets();
} else if(command === "spotify-this-song") {
	spotifyThisSong(query);
} else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	// App functionality from file read / loads fs npm package
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;

		// If there is a comma, then we will split the string from file in order to differentiate between the command and query
		// 	--> if there is no comma, then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		// After reading the command from the file, decides which app function to run
		if(command === "my-tweets") {
			myTweets();
		} else if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if(command === undefined) { // use case where no command is given
	console.log("Please enter a command to run LIRI.")
} else { // use case where command is given but not recognized
	console.log("Command not recognized! Please try again.")
}