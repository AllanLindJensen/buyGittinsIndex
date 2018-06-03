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
    if (discountContent != null && discountContent > 0 
        && successContent != null && successContent > 0 
        && failureContent != null && failureContent > 0)
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
    var cardText = document.getElementById("paymentText").innerHTML;
    document.getElementById("paymentText").innerHTML = "INVOICE: " + responseObject.bill[1].r_hash;
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


console.log("SBN client side js last line read.");