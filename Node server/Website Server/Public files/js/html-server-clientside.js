/**
 * This script describes the main functionality of the site.
 */

//********  Event listeners
function userInputTrigger()
{
    checkAllInputFields();
}

function buttonPressed()
{
    getNewInvoiceNumber();
}


//********  Main functions
/**
 * 
 */
var checkAllInputFields = function()
{
    var discountContent = document.getElementById("discount").value;
    var successContent = document.getElementById("successes").value;
    var failureContent = document.getElementById("failures").value;
    var button = document.getElementById("orderButton");
    //Check that the user input constitutes values that can be calculated.
    if (discountContent != null && discountContent > 0 && discountContent <= 99
        && successContent != null && successContent >= 0 && successContent <= 99
        && failureContent != null && failureContent >= 0 && failureContent <= 99)
    {
        var buttonClass = button.className;
        if (buttonClass.indexOf("disabled") != -1) 
        {
            buttonClass = buttonClass.replace("disabled", "");
            button.className = buttonClass;
        }
    } 
    else 
    {
        var buttonClass = button.className;
        if (buttonClass.indexOf("disabled") == -1)
        {
            var buttonClass = buttonClass + " disabled";
            button.className = buttonClass;
        }
    }
}

var onInvoiceChange = function()
{
    checkHashAndGetResult();
}

var disableAllInputs = function()
{
    //TODO disable when asked for invoice.
}


var getNewInvoiceNumber = function()
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
    document.getElementById("paymentText").value = responseObject.billText;
    checkHashAndGetResult();
}

var checkHashAndGetResult = function()
{
    var discountContent = document.getElementById("discount").value;
    var successContent = document.getElementById("successes").value;
    var failureContent = document.getElementById("failures").value;
    var r_hash = document.getElementById("paymentText").value;
    var paramsString = "?discount=" + discountContent + "&successes=" + successContent + "&failures=" + failureContent + "&r_hash=" + r_hash;
    httpGetAsyncFunction(URLTargets.checkBill, paramsString, parseResult);
}

var parseResult = function(JSONResponse)
{
    var responseObject = JSON.parse(JSONResponse);
    document.getElementById("result").innerHTML = "paid: " + responseObject.paid + ", index:" + responseObject.gittins_index;
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
var URLTargets = {getBill: "./getbill/", checkBill: "./checkbill/"};

/*
* Generation of QR code
*/
// from clientside.html: var scr = "../js/qrcode.js"
var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 400,
	height : 400
    });
alert("qrcode var = "+JSON.stringify(qucode));

var qrcode = null;

function displayQRCode() {
    if (qrcode == null) {
        qrcode = new QRCode(document.getElementById("qrcode"), {
	    width : 400, height : 400
        });
    }
    qrcode.makeCode(document.getElementById("paymentText").value);
}

/*
* Copy bill to clipboard
*/

function cpClipBoard() {
  var field = document.getElementById("paymentText");
  field.select();
  var ok = document.execCommand('copy');
  if (ok) M.toast({html: 'Copied: ' + document.getElementById("paymentText").value, displayLength: 1000})
  else M.toast({html: 'Sorry, unable to copy!', displayLength: 2000});
  field.blur();
}