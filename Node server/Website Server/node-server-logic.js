 /**
  * Server logic.
  * 
  */
var url = require('url'); //Easy cleaning of URL-params etc.
var path = require('path');

var gittinsServerModule = require('./node-server-gittins-interface');
var htmlModule = require('./node-server-HTML')
var fileServer = require('./node-server-fileserver');

var gittinsHost = '0.0.0.0';
var gittinsPort = "14203";

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
        var paramsMap = url.parse(URLParams.path, true);
        //Handle routing based on paths from client. For css/js folder, simply serve the file.
        if (paths.length > 2) //implies the format /*/filename with possible additional folders.
        {
            fileServer.sendFile(URLParams.path, response);
        }
        else 
        {
            //Check/handle params.
            if (paramsMap.query.discount)
            {
                gittinsServerModule.setClient(gittinsHost + ":" + gittinsPort);
                var bill = gittinsServerModule.getNewBill(parseInt(paramsMap.query.discount), parseInt(paramsMap.query.successes), parseInt(paramsMap.query.failures), sendJSONResponse, response);
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
    },
    setHost: function(newHost)
    {
        gittinsHost = newHost;
    },
    setPort: function(newPort)
    {
        gittinsPort = newPort;
    }
};

//Implement functions called from the main server logic here.
var routingLogic = function()
{

}

/**
 * Function for sending a response.
 * @param {string} content The content to send to client.
 * @param {https.response} response The response to send.
 * @param {*} contentType MIME-type.
 */
var sendResponse = function(content, response, contentType)
{
    response.writeHead(200, {'Content-Type': contentType});
    response.write(content); //write a response to the client
    response.end(); //end the response..
}

var sendJSONResponse = function(JSONObject, response)
{
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(JSONObject)); //write a response to the client
    response.end(); //end the response..
}