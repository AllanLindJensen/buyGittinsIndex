var grpc = require('grpc');
var gi_proto = grpc.load('buyGittinsIndex.proto').buygittinsindex;

/**
 * getBill RPC method.
 */
function orderGittinsIndex(call, callback) {
  callback(null, {billText: 'lnt876htr3iuytjuy654nhgtr7ytrdjhy5jhgr87ytfjuyjhgfjuy65jhtri876587trd',
    r_hash: '9876kjhyt54kjhytr7y6trhtr4'});
}

/**
 * deliver RPC method.
 */
function deliver(call, callback) {
  var b = (call.request.successes !=0); var gi;
  if (b) {gi = 7059;} else {gi = 0;}
  callback(null, {paid: b, gittins_index: gi});
}

/*
 * 
 * 
 */
function main() {
  var server = new grpc.Server();
  server.addService(gi_proto.BuyGittinsIndex.service, {orderGittinsIndex: orderGittinsIndex, deliver: deliver});
  server.bind('0.0.0.0:4203', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
