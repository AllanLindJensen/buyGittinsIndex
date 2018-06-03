function main() {
  if (process.argv.length != 3) {
    console.log("give discount factor in integral percent, No. successes, No. failures, e.g. 90 1 0");
    return;
  }
  
