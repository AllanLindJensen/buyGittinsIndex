// Connecting to lnd (using Example on accessing API)

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

//Gittins rpc server
var gi_proto = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;

// functions converting the byte[] r_hash to HEX string and back

function toHexString(byteArray) {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}
function toByteArray(hexString) {
  var result = new Uint8Array(32); var n = hexString.length;
  for (var i = 0; i<n;i = i+2) {
    result[i >>> 1] = (parseInt("0x"+hexString.substring(i, i+2), 16));
  }
  return result;
}

/**
 * getBill RPC method.
 */
function orderGittinsIndex(call, callback) {
  gamma = call.request.discount;
  ones = call.request.successes;
  zeros = call.request.failures;
  if (gamma <0 || gamma > 99 || ones < 0 || ones >99 || zeros < 0 || zeros > 99) {
    callback("params out of range",null);
  } else

  {
    var memo = "GI("+gamma+","+ones+","+zeros+")";
    client.addInvoice({
        "memo": memo,
        "value": 150
      }, function(err, response) {
        if (err != null) {
          callback(err,null)
        } else {
          //we have a sale and a bill
          var rHash = toHexString(response.r_hash);
	  callback(null, {
	    billText: response.payment_request,
    	    r_hash: rHash
	  });
          console.log(memo + " " + rHash);
        }
      });

  }
}

/**
 * deliver RPC method.
 */
function deliver(call, callback) {
  gamma = call.request.discount * 0.01;
  ones = call.request.successes;
  zeros = call.request.failures;
  var rHash = call.request.r_hash;
  if (gamma <0 || gamma > .999 || ones < 0 || ones >100 || zeros < 0 || zeros > 100) {
    callback("params out of range",null);
  } else {
    client.lookupInvoice({
        r_hash: toByteArray(rHash)
      }, function(err, response) {
        if (err != null) {
          callback(err,null)
        } else {
          //we have a sale and a bill
          if (response.settled) {
            var gi = Math.round(gittinsBinary()*10000);
            callback(null, {
               paid: true,
               gittins_index: gi
            });
            console.log(rHash + " paid. GI = "+gi);
          } else {
            callback(null, {
                paid:false, gittins_index:0
            });
	  }
        }
    });
  }
}

/*
 * variables and constants to computation of 2D Beta Distribution Gittins Index
 */

var gamma, ones, zeros;
var epsilon = 1E-5;
var zip = 1E-9;

/*
 * Methods for the computation
 */

function minInt(a,b) {
  if (a<= b) {return a;} else {return b;}
}

function competingBinary(N,p) {
        
        // gam is the discount, assumed 0 < gam < 1
        // N >= a+b is the look-ahead
        // p is the probability of success of the competingTernary Bandit
  var j1,j2,i;
  var ret = p/(1-gamma);
  var iLim = minInt(Math.floor((p*(N+2))-1),N);
  var k=(1-gamma)*(N+2);
  var A = new Array(N+1);
//      System.out.printf("a = %d,b = %d, N = %d, og iLim = %d%n",a,b,N,iLim);
  for (i = 0; i <= iLim; i++) { A[i] = ret;}
  for(i = iLim+1; i <= N; i++) {
    A[i] = 1.0*(i+1)/k;
//      System.out.printf("Sæt A[i] lig %.4f",1.0*(i+1)/(N+2)); System.out.println();
  }
//      for (i=0;i<=N;i++){System.out.print(String.valueOf(A[i])+" ");};
//      System.out.println();
        //This is the expected best outcome after N tests
        //Now the best expected outcome is computed backwards in time
  var l = ones+zeros; //returns are computed from N (set above) down to l
  for (var j = N-1; j >= l;j--) {
    j1 = j+1; j2 = j+2;
    for (i = 0;i<=j;i++) {
//          System.out.printf("i = %d, og yields er %f og %f%n",
//              i,(i+1)*(1+A[i+1])/j2,(j1-i)*A[i]/j2);
      A[i] = Math.max(ret,
              ((1+gamma*A[i+1])*(i+1)+gamma*A[i]*(j1-i))/j2);
    }
  }
//      for (i=0;i<=N;i++){System.out.print(String.valueOf(A[i])+" ");};
//      System.out.println();
  return A[ones];
}

function GN(gam, N){
  var p1 = 1.0*(ones+1)/(ones+zeros+2); var p2 = 1.0;
  var rate = 1 - gam;
  var y; var p;
  while (p2 - p1 > epsilon) {
    p = (p1+p2)*0.5;
    y = competingBinary(N,p)*rate;
    if (y>p+zip) {p1 = p;} else {p2 = p;}
  }
  return (p1+p2)*0.5;
}

function gittinsBinary(){
  var N0 = Math.round((6*Math.pow(1/(1-gamma),0.72)));
  var deltaN = Math.floor(N0/2);
  var N = ones+zeros + N0;
  var p1 = 0.0; var p2 = GN(gamma,N);
  while ((p2 - p1 > 0.5*epsilon) && (N < 1000000)) {
    N = N + deltaN;
    p1 = p2; p2 = GN(gamma,N);
  }
  return p2;
}    

// open the server

function main() {
  var server = new grpc.Server();
  server.addService(gi_proto.BuyGittinsIndex.service, {orderGittinsIndex: orderGittinsIndex, deliver: deliver});
  server.bind('0.0.0.0:14203', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
