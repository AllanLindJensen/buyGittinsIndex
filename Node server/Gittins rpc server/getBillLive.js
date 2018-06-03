<<<<<<< HEAD
var fs = require('fs');
var grpc = require('grpc');

var gi_proto = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;
var host = '0.0.0.0:14203';

function main() {
  if (process.argv.length != 5) {
=======
function main() {
  if (process.argv.length != 3) {
>>>>>>> d8fd95bc0c43c01c644a413c3d7b496244a146e6
    console.log("give discount factor in integral percent, No. successes, No. failures, e.g. 90 1 0");
    return;
  }
  
<<<<<<< HEAD
  client = new gi_proto.BuyGittinsIndex(host,grpc.credentials.createInsecure());
  var order = {discount: parseInt(process.argv[2]), successes: parseInt(process.argv[3]), failures: parseInt(process.argv[4])};
  client.OrderGittinsIndex(order, function(err, response) {
    if (err) 
    {
       console.log("ERR: "+err);
    } else {
       console.log("Bill "+response.billText);
       console.log("rHash: " + response.r_hash);       
    }
  });
}

main();
=======
>>>>>>> d8fd95bc0c43c01c644a413c3d7b496244a146e6
