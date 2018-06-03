 /**
  * Server logic.
  * 
  */
var url = require('url'); //Easy cleaning of URL-params etc.
var path = require('path');

var gittinsServerModule = require('./node-server-gittins-interface');
var htmlModule = require('./node-server-HTML')
var fileServer = require('./node-server-fileserver');

var gittinsHost = '0.0.0.0:14203'; //'176.21.113.33';
var gittinsPort = "14203";

var URLTargets = {getBill: "getbill", checkBill: "checkbill"};

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
        var functionToRun = routingLogic(paths);
        functionToRun(URLParams, response);
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
var routingLogic = function(pathNames)
{
    //Check for any resource names in the path:
    if (pathNames.length > 2) //More than the domain and a file
    {
        //There are paths. Check the names.
        switch (pathNames[1]){
            case URLTargets.getBill:
                return getBillFromGittins;
                break;
            case URLTargets.checkBill:
                return getResultIfReady;
                break;
            default:
                return sendPublicFiles;
                break;
        }
    }
    //No resources requested. Return main page.
    else return sendMainPage;
}

var sendPublicFiles = function(URLParams, response)
{
    fileServer.sendFile(URLParams.path, response);
}

var sendMainPage = function(URLParams, response)
{
    //Handle standard page, and special calls.
    html = htmlModule.getMainPage();
    content = 'text/html';
    //TODO: for now, always send the basic html.
    sendResponse(html, response, content);
}

var getBillFromGittins = function(URLParams, response)
{
    var paramsMap = url.parse(URLParams.path, true);
    gittinsServerModule.setClient(gittinsHost + ":" + gittinsPort);
    var bill = gittinsServerModule.getNewBill(parseInt(paramsMap.query.discount), parseInt(paramsMap.query.successes), parseInt(paramsMap.query.failures), sendJSONResponse, response);
}

var getResultIfReady = function(URLParams, response)
{
    var paramsMap = url.parse(URLParams.path, true);
    var r_hashInput = paramsMap.query.r_hash.toString();
    var discountInput = parseInt(paramsMap.query.discount);
    var successesInput = parseInt(paramsMap.query.successes);
    var failuresInput = parseInt(paramsMap.query.failures);
    //If the hashinput is ok, but the numbers are missing, input 0 0 0.
    if (!(r_hashInput == "") && (discountInput == "NaN" || successesInput == "NaN" || failuresInput == "NaN"))
    {
        discountInput = 0;
        successesInput = 0;
        failuresInput = 0;
        gittinsServerModule.setClient(gittinsHost + ":" + gittinsPort);
        gittinsServerModule.CheckBillAndGetResult(r_hashInput, discountInput, successesInput, failuresInput, sendJSONResponse, response);
    }
    else 
    {
        gittinsServerModule.setClient(gittinsHost + ":" + gittinsPort);
        gittinsServerModule.CheckBillAndGetResult(r_hashInput, discountInput, successesInput, failuresInput, sendJSONResponse, response);
    }
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
