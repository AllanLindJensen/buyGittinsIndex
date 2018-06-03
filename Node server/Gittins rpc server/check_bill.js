var grpc = require('grpc');
var fs = require('fs');
var lndCert = fs.readFileSync("/home/allan/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
var lnrpcDescriptor = grpc.load('../Proto files/lnd_rpc.proto');
var lnrpc = lnrpcDescriptor.lnrpc;
var lightning = new lnrpc.Lightning('localhost:10009', credentials); 

function main() {
  process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
  lightning.lookupInvoice({
       r_hash: process.argv[2]
    },
    function(err, response) {
    if (err != undefined) {
      console.log("ERR: "+err);
    }
    console.log("Paid: " + response.settled);
  })
}

main();

