var grpc = require('grpc');
var receive_order = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;
function main() {
  var client = new receive_order.BuyGittinsIndex('0.0.0.0:14203',
	grpc.credentials.createInsecure());
  client.orderGittinsIndex({
      discount: 90,
      successes: 1,
      failures: 0
    }, function(err, response) {
    console.log('Please pay: ' + response.billText);
    console.log('r_hash: ' + response.r_hash);
  })
}

main();
