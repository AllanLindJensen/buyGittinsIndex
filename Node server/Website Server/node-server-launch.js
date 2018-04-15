/**
 * Main script, which launches the server.
 * All essential logic should be kept in the various modules, to keep launch logic separate.
 */
var port = 8080;
 //required node modules.
var serverLogic = require('./node-server-logic');
var https = require('https'); //Make sure to only use the https module (not http).
var http = require('http'); //HTTP FOR LOCALHOST TESTING (without ssl) - NOT PRODUCTION

//TODO change to https module before public launch.
//create a server object, and define a basic function for reacting to requests.
http.createServer(serverLogic.serverMain) //Call with the serverMain function from node-server-logic.js
.listen(port); //the server object listens on port 8080. 

//Use port 8081 to verify that the server is running as intented. Only for debugging purposes.
http.createServer(function (req, res) {
    console.log("request recieved on 8081.");
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
  }).listen(8081);
console.log('Server launched successfully on port ' + port);