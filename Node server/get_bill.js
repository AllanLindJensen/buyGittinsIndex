/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/../../protos/rpc.proto';

var grpc = require('grpc');
var fs = require('fs');
var lndCert = fs.readFileSync("/home/allan/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
var lnrpcDescriptor = grpc.load(PROTO_PATH);
var lnrpc = lnrpcDescriptor.lnrpc;
var lightning = new lnrpc.Lightning('localhost:10009', credentials); 

function main() {
  lightning.channelBalance({}, function(err, response) {
    console.log("Channelbalance: ",response);
  });
}

main();



Nu får jeg fejlen

allan@DanishLightning:~/grpc/examples/node/dynamic_codegen$ node get_bill.js
E0327 17:16:58.019509041   19933 ssl_transport_security.cc:188] ssl_info_callback: error occured.

E0327 17:16:58.019576290   19933 ssl_transport_security.cc:989] Handshake failed with fatal error SSL_ERROR_SSL: error:14094410:SSL routines:ssl3_read_bytes:sslv3 alert handshake failure.
Channelbalance:  undefined

