var grpc = require('grpc');
var fs = require('fs');
var lndCert = fs.readFileSync("/home/allan/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
var lnrpcDescriptor = grpc.load('../Proto files/lnd_rpc.proto');
var lnrpc = lnrpcDescriptor.lnrpc;
var lightning = new lnrpc.Lightning('localhost:10009', credentials); 

var m = fs.readFileSync('/home/allan/.lnd/admin.macaroon');
var macaroon = m.toString('hex');
 
 // build meta data credentials
var metadata = new grpc.Metadata();
metadata.add('macaroon', macaroon);
var macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
   callback(null, metadata);
 });

function main() {

  process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
  lightning.addInvoice({
       memo:'GI(90,1,0)',
       value: 1000
    },
    function(err, response) {
    if (err != undefined) {
      console.log("ERR: "+err);
    }
    console.log("Payment request: " + response.payment_request);
    console.log("r_hash: " + response.r_hash);
  })
}

main();

