var grpc = require('grpc');
var receive_order = grpc.load('buyGittinsIndex.proto').buygittinsindex;
function main() {
  var client = new receive_order.BuyGittinsIndex('localhost:14203',
                                       grpc.credentials.createInsecure());
  client.deliver({
      r_hash: '357uikm5367j56j',
      discount: 90,
      successes: 1, //set to zero if bill is to be unpaid
      failures: 0
    }, function(err, response) {
      if (err != undefined) {
	console.log('ERROR: '+err);
      } else {
	if (response.paid) {console.log('Gittins Index: 0.'+response.gittins_index);}
	else {console.log('still not paid');}
      }
    }
  )
}

main();
