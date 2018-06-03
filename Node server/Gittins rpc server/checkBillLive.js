var fs = require('fs');
var grpc = require('grpc');

var gi_proto = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;
var host = '0.0.0.0:14203';

function main() {
  if (process.argv.length != 3) {
    console.log("Present the r_hash of the bill as a 64 byte HEX string, e.g. '4b02f...45'");
    return;
  }
  var str = process.argv[2];
  if (str.length != 64) {
    console.log("The r_hash must be 64 digits long.");
    return;
  }
  client = new gi_proto.BuyGittinsIndex(host,grpc.credentials.createInsecure());
  var order = {"r_hash": str};
  client.deliver(order, function(err, response) {
    if (err) 
    {
       console.log("ERR: "+err);
    } else {
       if (response.paid) {
         console.log("Bill Paid, Gittins Index is 0."+response.gittins_index+".");       
       } else {
         console.log("The bill has not been settled.");
       }
    }
  });
}

main();
