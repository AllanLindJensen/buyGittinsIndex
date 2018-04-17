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
var setClient = function(host)
{
    if (client == null)
    {
        console.log("first setClient call - typeof gi_proto.BuyGittinsIndex: " + gi_proto.BuyGittinsIndex);
        client = new gi_proto.BuyGittinsIndex(host,
                        grpc.credentials.createInsecure());
    }
}

var getNewBill = function(discountInput, failuresInput, successesInput, JSONcallback, httpResponse)
{
    var order = {discount: discountInput, successes: successesInput, failures: failuresInput};
    var bill = client.OrderGittinsIndex(order, function(err, response) {
        if (err) 
        {
            
        } 
        else
        {
            var JSONobject = {};
            JSONobject.bill = [
                { id: 1, message: response.message }
            , { id: 2, r_hash: response.r_hash }
            ];
            JSONcallback(JSONobject, httpResponse);            
        }
      });
}

exports.getNewBill = getNewBill;
exports.setClient = setClient;