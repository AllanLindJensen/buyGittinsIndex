/**
 * This script has functions for calling the gittins server.
 * 
 * 
 */
var grpc = require('grpc');
var gi_proto = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;
//var routeguide = grpc.load(PROTO_PATH).routeguide;
var gittinsHost = '0.0.0.0:14203';
var client = null;

/**
 * Keep the client as singleton for each call.
 * 
 * @param {string} host host name and port number.
 */
var setClient = function()
{
    if (client == null)
    {
        console.log("first setClient call - typeof gi_proto.BuyGittinsIndex: " + gi_proto.BuyGittinsIndex);
        client = new gi_proto.BuyGittinsIndex(gittinsHost,
                        grpc.credentials.createInsecure());
    }
}

var getNewBill = function(discountInput, successesInput, failuresInput, JSONcallback, httpResponse)
{
    var order = {discount: discountInput, successes: successesInput, failures: failuresInput};
console.log("getNewBill successes" + successesInput + ', failures ' + failuresInput);
    var bill = client.OrderGittinsIndex(order, function(err, response) {
        if (err) 
        {
            
console.log("getNewBill err: " + err);
        } 
        else
        {
            var JSONobject = { "billText": response.billText, "r_hash": response.r_hash };
console.log("getNewBill " + response.billText);
            JSONcallback(JSONobject, httpResponse);            
        }
      });
}

exports.getNewBill = getNewBill;
exports.setClient = setClient;
