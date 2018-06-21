/**
 * This script describes the main functionality of the site.
 */

//********  Event listeners

function userInputTrigger()
{
    checkAllInputFields();
}

function buyPressed()
{
    getNewInvoice();
}

function resetPressed() 
{
    clearFields();
}

function QRCodePressed()
{
    displayQRCode();
}

function cpPressed()
{
    cpClipBoard();
}

function checkBill()
{
    checkHashAndGetResult();
}

//********  Main functions
/**
 * 
 */

/*
* Clear All Fields, stop asking
*/

var clearFields = function()
{
    document.getElementById("discount").value = ""; 
    document.getElementById("successes").value = "";
    document.getElementById("failures").value = "";
    document.getElementById("btn_buy").disabled = true;
    continue_checking_bill = false;
    $('#paymentText').value = "";
    setVisibility(false,false);
}

var checkAllInputFields = function()
{
    var discountContent = document.getElementById("discount").value;
    var successContent = document.getElementById("successes").value;
    var failureContent = document.getElementById("failures").value;
    var button = document.getElementById("btn_buy");
    //Check that the user input constitutes values that can be calculated.
    if (discountContent != "" && discountContent > 0 && discountContent <= 99
        && successContent != "" && successContent >= 0 && successContent <= 100
        && failureContent != "" && failureContent >= 0 && failureContent <= 100)
    {
        button.disabled = false;
    } 
    else 
    {
        button.disabled = true;
    }
}

var disableAllInputs = function()
{
    //TODO disable when asked for invoice.
}

var getNewInvoice = function()
{
    var discountContent = document.getElementById("discount").value;
    var successContent = document.getElementById("successes").value;
    var failureContent = document.getElementById("failures").value;
    httpGetAsyncFunction(URLTargets.getBill, "?discount=" + discountContent + "&successes=" + successContent + "&failures=" + failureContent, insertInvoice);
}

var insertInvoice = function(JSONResponse)
{
    var responseObject = JSON.parse(JSONResponse);
    var cardText = document.getElementById("paymentText").value;
    r_hash = responseObject.r_hash;
    document.getElementById("paymentText").value = responseObject.billText;
    setVisibility(true,false);
    awaitPayment();
}

var checkHashAndGetResult = function()
{
    var paramsString = "?r_hash=" + r_hash;
    httpGetAsyncFunction(URLTargets.checkBill, paramsString, parseCheckBillResult);
}

var parseCheckBillResult = function(JSONResponse)
{
    var responseObject = JSON.parse(JSONResponse);
    if (responseObject.paid) {
	document.getElementById("result").innerHTML = "Your index is 0." + responseObject.gittins_index;
        setVisibility(false,true);
        return;
    } else {
      M.toast('The bill is still unsettled', 2000);
    }
}

var awaitPayment = function()
{
    var paramsString = "?r_hash=" + r_hash;
    httpGetAsyncFunction(URLTargets.awaitPayment, paramsString, parseAwaitResult);
}

var parseAwaitResult = function(JSONResponse)
{
    var responseObject = JSON.parse(JSONResponse);
    document.getElementById("result").innerHTML = "Your index is 0." + responseObject.gittins_index;
    setVisibility(false,true);
}

//********  async http functions
//TODO Change to https.
function httpGetAsyncFunction(URLTarget, parameters, callbackFunction)
{
    var URL = URLTarget + parameters;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callbackFunction(xmlHttp.responseText);
    }
    xmlHttp.open("GET", URL, true);
    xmlHttp.send(null);
}

//*******global variables

var URLTargets = {getBill: "./getbill/", awaitPayment: "./awaitpayment/", checkBill: "./checkbill/"};
var r_hash = ""; // string holding the r_hash as a HEX string

/*
* Generation of QR code
*/
// from clientside.html: var scr = "../js/qrcode.js"

function displayQRCode() 
{
	var url = QRCode.generatePNG($('#paymentText').val(), [{ecclevel:"ecclevel-M"}]);
        document.getElementById("qr-division").style.display = 'block';
	$('#qr-division').html('<img src="' + url + '">'+ "<br>Thanx to Kang Seonghoon, Korea.");
}

/*
 * Copy bill to clipboard
*/

function cpClipBoard() 
{
  var field = document.getElementById("paymentText");
  field.select();
  var ok = document.execCommand('copy');
  if (ok) 
  {
     M.toast({html: 'Bill Copied.', displayLength: 1000});
  } else 
  {
    M.toast({html: 'Sorry, unable to copy!', displayLength: 2000});
  }
  field.blur();
}

/*
 * Handle visibility
*/

function setVisibility(show_bill_section,show_result_section) 
{
  var paymentDiv = document.getElementById("payment division");
  var resultDiv = document.getElementById("result card");
  if (show_bill_section) {
    paymentDiv.style.display = 'block';
    document.getElementById("qr-division").style.display = 'none'; //hide until generated with the new bill.
  } else {
    paymentDiv.style.display = 'none';
  }
  if (show_result_section) {
    resultDiv.style.display = 'block';
  } else {
    resultDiv.style.display = 'none';
  }
}    
    

