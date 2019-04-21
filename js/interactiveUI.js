
function showContractDeploymentTxModal(txHash) {
    $("a.txLink").attr("href", "https://ropsten.etherscan.io/tx/"+txHash+"");
    $("#contractDeploymentTxModal").modal('show');
}

/**
* Changes the display accordingly to the mode the user wants to use. 
* For example, the token deployer or ICO interactor. 
*
* @param display - The HTML div id of the display. 
**/
function updateDisplay(display) {
    //Hide all modes and then show the one the user wants to display. 
    $('#interact-erc20-display').hide();
    $('#deploy-erc20-display').hide();
    $('#deploy-airdrop-display').hide();
    $('#interact-airdrop-display').hide();
    $('#deploy-ico-display').hide();
    $("#interact-ico-display").hide();
    $(display).show();
}


/**
* This function is invoked automatically when the user inputs a value in a
* text input field which requires a positve integer (i.e., when the user is
* specifying the number of decimals a token should have). 
*
* @param valueInputID - The id of the text input field in the HTML.
*
* @return True if the number is a positive integer, false otherwise. 
**/
function isPositiveInteger(valueInputID) {
    //Take the user's input
	value = $(valueInputID).val();
    //Check if it is a positive integer using a regular expression.
    if(!(/^\+?[1-9][\d]*$/.test(value))){
        //If it is not a positive integer and the input field is not
        //empty, then turn the input field red so the user knows that 
        //the input provided is invalid. 
    	if(value!="") {
    		$(valueInputID).css("background-color","red");
    	} else {
            //Otherwise, if the string is empty then the input field 
            //is too, in which case the input field will turn white again. 
    		$(valueInputID).css("background-color","white");
    	}
    	return false;
    } else {
        //If the value provided is a positive integer, then make sure
        //the text input field is white.
    	$(valueInputID).css("background-color","white");
    	return true;
    }
}


/**
* This function is invoked automatically when the user inputs a value in a 
* text input field which requires a positive number (i.e., when the user is 
* specifying the total amount of tokens to transfer to some recipient).
*
* @param valueInputID - The id of the text input field in the HTML.
*
* @return True if the number is a positive number, false otherwise. 
**/
function isPositiveNumber(valueInputID) {
    //Take the user's input
	value = $(valueInputID).val();
    //Now check if the isNaN is false which is short for "is not a number"
    //and also check that the value is greater than 0. 
	if(!(!isNaN(value) && value > 0)) {
        //If it is not a positive number and the input field is not
        //empty, then turn the input field red so the user knows that 
        //the input provided is invalid.
    	if(value!="") {
    		$(valueInputID).css("background-color","red");
    	} else {
            //Otherwise, if the string is empty then the input field 
            //is too, in which case the input field will turn white again.
    		$(valueInputID).css("background-color","white");
    	}
    	return false;
	} else {
        //If the value provided is a positive number, then make sure
        //the text input field is white.
    	$(valueInputID).css("background-color","white");
    	return true;
	}
}


/**
* This function is invoked automatically when the user inputs a value in a 
* text input field which requires an ETH address (i.e., when the user is 
* specifying the recipient of a token transfer). 
*
* @param valueInputID - The id of the text input field in the HTML.
*
* @return True if the input provided is a valid ETH address, false otherwise. 
**/
function isValidAddr(valueInputID) {
    //The line below stores a regular expression which matches all ETH addresses. 
    var ethAddrRegex = "^0x[a-fA-F0-9]{40}$";
    //Take the user's input
    addr = $(valueInputID).val();
    //Check if the user's input matches the regular expression. 
    if(addr.match(ethAddrRegex)) {
        //If the user's input does match the regular expression, then make sure 
        //that the input field is white.
        $(valueInputID).css("background-color","white");
        return true;
    } else {
        //If the input does not match the regular expression.
        if(addr=="") {
            //If the string is empty then the input field is too, in which case 
            //the input field will turn white again.
            $(valueInputID).css("background-color","white");
        } else {
            //Otherwise, if the input field is not empty and the input does not 
            //match the regular expression, then turn the input field red so the 
            //user knows that the input provided is invalid.
            $(valueInputID).css("background-color","red");
        }
        return false;
    }
}


//The code below makes the collapsable elements of the UI open and 
//close when clicked (i.e., the functions in the contract interactors).
var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}


/**
* This function takes any number as input and returns it as a string with 
* commas. For example, with the input 1000 the function will return "1,000".
**/
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/**
* This adds to the String object's functions which allows for one to replace 
* all occurences of a character with another (or the empty string).
**/
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 