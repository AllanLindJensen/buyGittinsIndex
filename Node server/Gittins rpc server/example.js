var fs = require('fs');
var grpc = require('grpc');

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

var m = fs.readFileSync('/home/allan/.lnd/admin.macaroon');
var macaroon = m.toString('hex');

// build meta data credentials
var metadata = new grpc.Metadata()
metadata.add('macaroon', macaroon)
var macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
  callback(null, metadata);
});

// build ssl credentials using the cert the same as before
var lndCert = fs.readFileSync("/home/allan/.lnd/tls.cert");
var sslCreds = grpc.credentials.createSsl(lndCert);

// combine the cert credentials and the macaroon auth credentials
// such that every call is properly encrypted and authenticated
var credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

// Pass the crendentials when creating a channel
var lnrpcDescriptor = grpc.load('../Proto files/lnd_rpc.proto');
var lnrpc = lnrpcDescriptor.lnrpc;
var client = new lnrpc.Lightning('localhost:10009', credentials);

function main() {
  console.log("main entered.");
  client.getInfo({}, function(err, response) {
      if (err != undefined) {
        console.log("ERR: "+err);
      } else {
        console.log("Public Node Key: " + response.identity_pubkey);
        console.log("Number of open channels: " + response.num_active_channels);
      }
  });
  console.log("call finished");
}

main();
