 /**
  * Server logic.
  * 
  */
var url = require('url'); //Easy cleaning of URL-params etc.
var path = require('path');

var gittinsServerModule = require('./node-server-gittins-interface');
var htmlModule = require('./node-server-HTML')
var fileServer = require('./node-server-fileserver');

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
        //Extract the requested location from the URL params.
        var URLParams = url.parse(request.url, true); //URLParams now contain all params as fields (URLParams.parameterName). Get each one as js-var.
  
        var html;
        var content;
        var paths = URLParams.path.split("/");

        //Handle routing based on paths from client. For css/js folder, simply serve the file.
        if (paths.length > 2) //implies the format /*/filename with possible additional folders.
        {
            fileServer.sendFile(URLParams.path, response);
        }
        else 
        {
            //Handle standard page, and special calls.
            html = htmlModule.getMainPage();
            content = 'text/html';
            //TODO: for now, always send the basic html.
            sendResponse(html, response, content);
        }
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