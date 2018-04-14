var grpc = require('grpc');
var fs = require('fs');
var lndCert = fs.readFileSync("/home/allan/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
var lnrpcDescriptor = grpc.load('lnd_rpc.proto');
var lnrpc = lnrpcDescriptor.lnrpc;
var lightning = new lnrpc.Lightning('localhost:10009', credentials); 
var unlocker = new lnrpc.WalletUnlocker('localhost:10009', credentials);

function main() {
  process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';

  lightning.getInfo({}, function(err, response) {
    if (err != undefined) {
      console.log("ERR: "+err);
    }
    console.log("INFO: " + response.block_height);
  })
}

main();

