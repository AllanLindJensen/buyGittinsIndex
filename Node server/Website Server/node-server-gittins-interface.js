/**
 * This script has functions for calling the gittins server.
 * 
 * 
 */
var grpc = require('grpc');
var gi_proto = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;
//var routeguide = grpc.load(PROTO_PATH).routeguide;
var client = null;

/**
 * Keep the client as singleton for each call.
 * 
 * @param {string} host host name and port number.
 */
var getClient = function(host)
{
    if (client == null)
    {
        client = new routeguide.RouteGuide(host,
                        grpc.credentials.createInsecure());
    }
    return client;
}

