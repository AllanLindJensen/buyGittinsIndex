// Connecting to lnd (using Example on accessing API)

var fs = require('fs');
var grpc = require('grpc');
var GICompute = require('./compute_index');
var life_span = 3600; // bills expire in 1 hour
var waitingList = []; // list of bills awating payment

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
var awaitList = []; // list of processes awaiting confirmation of payment
  // Added by call to awaitPayment
  // Deleted by a) payment, b) checkPayment c) every day old ones
  // {time: longint, RHash: string, caller: streamObject}

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
 * GetBill RPC method.
 */
function orderGittinsIndex(call, callback) {
  gamma = call.request.discount;
  ones = call.request.successes;
  zeros = call.request.failures;
  if (gamma <1 || gamma > 100 || ones < 0 || ones >100 || zeros < 0 || zeros > 100) {
    callback("params out of range",{});
  } else {
    var memo = "GI("+gamma+","+ones+","+zeros+")";
    client.addInvoice({
        "memo": memo,
        "value": 150,
        "expiry": life_span
        }, function(err, response) {
        if (err != null) {
          callback(err,{})
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
 * CheckPayment RPC method.
 */
function checkPayment(call, callback) {
  var rHashText = call.request.r_hash;
  var rHash = toByteArray(rHashText);
  client.lookupInvoice({
        r_hash: rHash
      }, function(err, response) {
        if (err != null) {
          callback(err,{})
        } else {
          if (response.settled) {
            var memo = response.memo;
            var GI = computeGI(memo);
            console.log(new Date().toUTCString() + " paid " + rHashText + " for " + memo + " = 0." + GI);
            callback(null,{paid:true, gittins_index: GI});
// TODO remove from list. if it is on it.
          } else {
            callback(null, {
                paid:false, gittins_index:0
            });
	  }
        }
  });
}

/*
 * Wait for the bill to be paid. Put it on hte waitingList
 */

function awaitPayment(call, callback) {
  var rHash = call.request.r_hash; 
  var i = searchHashInWaitingList(rHash);
console.log(" i = " + i + ", rHash = " + rHash);
  if (i == -1) 
  {
    waitingList.push({
        time: Date.now(),
        RHASH: rHash,
        callBack: callback
    });
    console.log(new Date().toUTCString() + " Added to waiting list " + rHash);
  }
}

//when LND informs that a bill has been paid
function billPaid(invoice) {
    var memo = invoice.memo;
    var paidHash = toHexString(invoice.r_hash);
    if (memo.substring(0,3) != "GI(") 
    {
      return; //not invoice for a Gittins Index
    }
    var paidHash = toHexString(invoice.r_hash);
    var i = searchHashInWaitingList(paidHash);

    if (i == -1) return;  //not on the waitingList
    var gi = computeGI(memo);
    waitingList[i].callBack(null,{gittins_index: gi});
    console.log(new Date().toUTCString() + " delivered " + paidHash + " for " + memo + " = 0." + gi);
    waitingList.splice(i,1); // remove from waitingList
}

// functions regarding the waitingList

function searchHashInWaitingList(RHash) {
  return waitingList.findIndex( el => {
        return (el.RHASH == RHash);
    });
}

  //TODO
function sanatizeWaitingList() {
   // waitingList.sort();
   // var lim = Date.now() - 4000;
   // var i = waitingList.findIndex( el => {return (el.time > lim)} );
   // if (i >= 0) {
   // how many are there???
   // waitingList.splice(0, ?? );
}

//compute the Gittins index from the memo of the bill

function computeGI(memo) { 
    var pos1 = memo.indexOf(',');
    var discount = parseInt(memo.substring(3,pos1));
    var pos2 = memo.indexOf(',',pos1+1);
    var ones = parseInt(memo.substring(pos1 + 1, pos2));
    var zeros = parseInt(memo.substring(pos2 + 1, memo.indexOf(")")));
    var gi = 0;
    if ( !isNaN(discount)  && discount > 0 && discount <= 99
        && !isNaN(ones) && ones >= 0 && ones <= 100
        && !isNaN(zeros) && zeros >= 0 && zeros <= 100) {
      gi = GICompute.gittinsBinary(discount,ones,zeros);
    }
    return gi;
}

// open the server

function main() {
  var server = new grpc.Server();
  server.addService(gi_proto.BuyGittinsIndex.service, {orderGittinsIndex: orderGittinsIndex, awaitPayment: awaitPayment, checkPayment: checkPayment});
  server.bind('0.0.0.0:14203', grpc.ServerCredentials.createInsecure());
  server.start();
  // subscribe to paid invoices
  var lnd = client.subscribeInvoices({});
  lnd.on('data', billPaid);
  lnd.on('end', function() {
    // The server has finished sending
    console.log(new Date().toUTCString() + " LND stops:");
  });
  lnd.on('error', function(err) {
    console.log(new Date().toUTCString() + " ERR: " + err);
  });
  lnd.on('status', function(status) {
    // Process status
    console.log(new Date().toUTCString() + "Current status: " + JSON.stringify(status));
  });
  setInterval(sanatizeWaitingList, 24*3600000); //once a day
  console.log(new Date().toUTCString() + " Initialization complete");
}

main();
