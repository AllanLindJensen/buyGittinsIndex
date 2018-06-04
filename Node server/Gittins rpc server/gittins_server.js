var grpc = require('grpc');
var gi_proto = grpc.load('../Proto files/buyGittinsIndex.proto').buygittinsindex;

/**
 * getBill RPC method.
 */
function orderGittinsIndex(call, callback) {
  console.log('order GI('+call.request.discount+','+call.request.successes+','+call.request.failures+')');
  callback(null, {billText: 'lntb17u1pds5mrnpp5futgff358jg89s2890jh2ajcapsavkg9undxd95rz60dc6m2dk3qdpzxysy2umswfjhxum0yppk76twypgxzmnwvycqp2l6pl66cas74jjfkmzn68y9s84vfz3xsem3sdfrle4m8r0wqjgwmj87he3va8xc88atd8zvex66vlrjr6a282xm8k04hv2l7kr8yqt2cqzmrhl2',
    r_hash: 'f20918876cd11317246e3dd2700bd41a2c25b3b37401412ea28d3dc3d433ecc4'});
}

/**
 * deliver RPC method.
 */
function deliver(call, callback) {
  gamma = call.request.discount * 0.01;
  ones = call.request.successes;
  zeros = call.request.failures; 
  var b = (ones !=0); var gi;
  console.log("? " + call.request.r_hash);
  if (b) {
    gi = Math.round(gittinsBinary()*10000);
    console.log("paid, GI = " + gi);
  } else {
    gi = 0;
    console.log("unpaid");
  }
  callback(null, {paid: b, gittins_index: gi});
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


function main() {
  var server = new grpc.Server();
  server.addService(gi_proto.BuyGittinsIndex.service, {orderGittinsIndex: orderGittinsIndex, deliver: deliver});
  server.bind('0.0.0.0:14203', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
