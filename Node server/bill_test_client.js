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

var grpc = require('grpc');
var gi_proto = grpc.load(buyGittinsIndex.proto).buygittinsindex;

function main() {
  var client = new gi_proto.BuyGittinsIndex('localhost:4203',
                                       grpc.credentials.createInsecure());
  var user;
  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    user = 'world';
  }
  client.sayHello({discount: 90; successes: 0; failures: 0}, function(err, response) {
    console.log('Response:', response.billText);
  });
}

main();
