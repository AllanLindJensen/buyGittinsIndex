/**
 * Module with functions for getting html-pages.
 */
var fs = require('fs'); //For interacting with the file-system.
//Add extension to read html-files as simple text. Needed to read html-files for sending to client.
require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };

//Import the html file as variable, for easing sending to client. Must be done after the html-extension.
var HTMLTemplate = require('./HTML/clientside.html');

module.exports = {
    // return page/info with error to user. Might not be needed.
    getErrorPage: function () {
    
    },
    // Used when users try accessing non-existing URLs.
    getNoSuchPageFound: function () {
      
    },
    //Get the main html.
    getMainPage: function() {
        console.log("getMainPage."); //SBN
        return HTMLTemplate;
    }
};