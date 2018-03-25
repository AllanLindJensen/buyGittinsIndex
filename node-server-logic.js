 /**
  * Server logic.
  */
var url = require('url'); //Easy cleaning of URL-params etc.

var lndModule = require('./node-server-lightning-module');
var htmlModule = require('./node-server-HTML')

module.exports = {
    /**
     *  Main server logic.
     * 
     * request docs: https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp
     * response docs: https://www.w3schools.com/nodejs/obj_http_serverresponse.asp
     * 
     * 
     */
    
    serverMain: function (request, response) {
        console.log("server main."); //SBN
        //Extract the requested location from the URL params.
        var URLParams = url.parse(request.url, true); //URLParams now contain all params as fields (URLParams.parameterName). Get each one as js-var.
        
        //TODO: for now, always send the basic html.
        var html = htmlModule.getMainPage();
        sendResponse(html, response, 'text/html');
    }
};

//Implement functions called from the main server logic here.


/**
 * Function for sending a response.
 * @param {string} content The content to send to client.
 * @param {https.response} response The response to send.
 * @param {*} contentType MIME-type.
 */
var sendResponse = function(content, response, contentType)
{
    console.log("sending response."); //SBN
    response.writeHead(200, {'Content-Type': contentType});
    response.write(content); //write a response to the client
    response.end(); //end the response..
}