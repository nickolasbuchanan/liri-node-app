//use the users env file
require("dotenv").config();
var request = require("request");
var fs = require("fs");
//this is where the APIs are kept
var keys = require("./keys.js");
//add the need npms for twitter and spotify
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var clientSpotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//Make sure that it takes commands from the command line
var arguments = process.argv;

function getMovie(movie, req, res) {
    console.log(movie);
    // request for movie information using the trilogy api
    request('http://www.omdbapi.com/?t='+movie+'&y=&plot=short&apikey=trilogy', function(error, response, body) {

        // If theres is an error
        if (!error && response.statusCode === 200) {
            var tempString = JSON.parse(body).Title;
            console.log(tempString);
            res.send(JSON.parse(body));
            res.end();
        } else {
            console.log(error);
            logInfo(error);
        }
    });
}

function getTweets(req, res)  {
    var params = {screen_name: 'nick_olas85'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            res.send(tweets);
            res.end();
        } else {
            console.log(error);
            logInfo(error);
        }
    });

}

function getMusic(title, req, res) {
    clientSpotify.search({ type: 'track', query: title }, function(err, data) {
        res.send(data);
        res.end();
    });
}

function executeFile() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err);
            logInfo(err);
        }else {
            var dataArr = data.split(",");
            var task = dataArr[0];
            var input = dataArr[1];
            runApp(task, input);
        }
    });
}

function runApp(task, input) {
    switch(task) {
        case 'my-tweets':
            showTweets();
            break;
        case 'spotify-this-song':
            getMusic(input);
            break;
        case 'movie-this':
            getMovie(input);
            break;
        case 'do-what-it-says':
            executeFile();
            break;
        default:
        console.log("Danger Danger Danger");
    }
};

function logInfo(info) {
    fs.appendFile("log.txt", info, function(err) {
        if (err) {
            console.log(err);
        }else {
            console.log("Content Added!");
        }
    });
};
