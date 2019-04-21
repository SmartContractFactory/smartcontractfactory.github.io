var erc20ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getSymbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isMintable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burnTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"assignOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isBurnable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"mintTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_totalSupply","type":"uint256"},{"name":"_decimals","type":"uint8"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_isMintable","type":"bool"},{"name":"_isBurnable","type":"bool"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"}]')

//Using the ABI of the ERC20 smart contract create an object which can interact 
//with any ERC20 token
var ERC20 = web3.eth.contract(erc20ABI);

//erc20Instance will hold reference to the smart contract of the deployed
//token on the Ethereum blockchain.
var erc20Instance;

//Here we will store the relevant data associated with the token.
var erc20Address; 
var erc20Decimals;
var erc20Balance;
var erc20Name;
var erc20Symbol;
var erc20Supply;
var erc20IsMintable;
var erc20IsBurnable;
var erc20Owner;

var airdropTokenBalance;
var airdropAddress;

var icoTokenBalance;
var icoAddress;


//Enum to keep track of which mode the user is on and also used to detect 
//when the user has changed screen in order to display data on the current
//display that the user is using. 
var DisplayMode = {
  ERC20_INTERACTER: 1,
  AIRDROP_DEPLOYER: 2,
  AIRDROP_INTERACTER: 3,
  ICO_DEPLOYER: 4,
  ICO_INTERACTER: 5
};


var currentDisplay = DisplayMode.ERC20_INTERACTER;


//Every 2,000 ms update the display of the token data to reflect 
//changes in real time when they happen. 
setInterval(function() {
	if($("#interact-erc20-display").is(":visible")) {
		if(currentDisplay != DisplayMode.ERC20_INTERACTER) {
			currentDisplay = DisplayMode.ERC20_INTERACTER;
			erc20Instance = undefined;
			getTokenInfo('#erc-address-input','#token-data-erc20');
		}
		if(erc20Instance != undefined) {
			getTokenOwner();
			displayTokenDetails(
				'#token-name-erc20',
				'#token-symbol-erc20',
				'#token-decimals-erc20',
				'#token-balance-erc20',
				'#token-supply-erc20',
				'#token-is-mintable-erc20',
				'#token-is-burnable-erc20',
				'#invalid-token-address-erc20',
				'#token-data-erc20',
				'#token-info-container-erc20'
			);
		}
	} else if($("#deploy-airdrop-display").is(":visible")){
		if(currentDisplay != DisplayMode.AIRDROP_DEPLOYER) {
			currentDisplay = DisplayMode.AIRDROP_DEPLOYER;
			erc20Instance = undefined;
			getTokenInfo('#erc-address-input-airdrop-deployer','#token-data-airdrop-deploy');
		}
		if(erc20Instance != undefined) {
			displayTokenDetails(
				'#token-name-airdrop-deploy',
				'#token-symbol-airdrop-deploy',
				'#token-decimals-airdrop-deploy',
				'#token-balance-airdrop-deploy',
				'#token-supply-airdrop-deploy',
				'#token-is-mintable-airdrop-deploy',
				'#token-is-burnable-airdrop-deploy',
				'#invalid-token-address-airdrop-deploy',
				'#token-data-airdrop-deploy',
				'#token-info-container-airdrop-deploy'
			);
		}
	} else if($("#interact-airdrop-display").is(":visible")){
		if(currentDisplay != DisplayMode.AIRDROP_INTERACTER) {
			currentDisplay = DisplayMode.AIRDROP_INTERACTER;
			erc20Instance = undefined;
		}
		if(erc20Instance != undefined) {
			displayTokenDetails(
				'#token-name-airdrop-interact',
				'#token-symbol-airdrop-interact',
				'#token-decimals-airdrop-interact',
				'#token-balance-airdrop-interact',
				'#token-supply-airdrop-interact',
				'#token-is-mintable-airdrop-interact',
				'#token-is-burnable-airdrop-interact',
				'#ignore',
				'#ignore',
				'#ignore'
			);
		}
	} else if($("#deploy-ico-display").is(":visible")) {
		if(currentDisplay != DisplayMode.ICO_DEPLOYER) {
			currentDisplay = DisplayMode.ICO_DEPLOYER;
			erc20Instance = undefined;
			getTokenInfo('#erc-address-input-ico-deployer','#token-data-ico-deploy');
		}
		if(erc20Instance != undefined) {
			displayTokenDetails(
				'#token-name-ico-deploy',
				'#token-symbol-ico-deploy',
				'#token-decimals-ico-deploy',
				'#token-balance-ico-deploy',
				'#token-supply-ico-deploy',
				'#token-is-mintable-ico-deploy',
				'#token-is-burnable-ico-deploy',
				'#invalid-token-address-ico-deploy',
				'#token-data-ico-deploy',
				'#token-info-container-ico-deploy'
			);
		}
	} else if($("#interact-ico-display").is(":visible")) {
		if(currentDisplay != DisplayMode.ICO_INTERACTER) {
			currentDisplay = DisplayMode.ICO_INTERACTER;
			erc20Instance = undefined;
		}
		if(erc20Instance != undefined) { 
			displayTokenDetails(
				'#token-name-ico-interact',
				'#token-symbol-ico-interact',
				'#token-decimals-ico-interact',
				'#token-balance-ico-interact',
				'#token-supply-ico-interact',
				'#token-is-mintable-ico-interact',
				'#token-is-burnable-ico-interact',
				'#ignore', 
				'#ignore',
				'#ignore'
			);
		}
	}
}, 2000);



/**
* This function is invoked only by the ICO and Airdrop interaction
* modes (i.e., when a user wants to interact with an already deployed
* contract of either of those types). The reason it is needed is 
* because in these modes the user will need to provide the contract 
* address of the already existing (Airdrop or ICO) smart contract.
* both those contracts have a getTokenAddress() function, the result
* of which is passed through to this funciton in order to create an 
* instance of the token and thus enable the display of the token's 
* associated data.
*
* @param addressOfToken - The resulting address of the token from 
* the getTokenAddress() function of either the Airdrop or ICO contract.
**/
function getTokenInfoFromAddress(addressOfToken) {
	erc20Address = addressOfToken;
	erc20Instance = ERC20.at(erc20Address);
}

/**
* Queries the ERC20 smart contract to find who is the owner. The 
* intended purpose of this is to see whether or not the user is 
* the owner in order to check if the user can mint or burn tokens
* which are functions only the owner of the token contract can 
* execute. For more details on how onlyOwner functions work, check
* the Owned.sol smart contract. 
**/
function getTokenOwner() {
	erc20Instance.getOwner((error, owner)=>{
		if(!error) {
			erc20Owner = owner;
		} else {
			console.error(error);
		}
	});
}

/**
* Checks if a valid ETH address has been provided and if so it will 
* invoke the displayTokenDetails() function to update the user interface
* with the relevant data associated with the ERC20 token. 
**/
function getTokenInfo(txtInputArea, divIdOfTokenData) {
	//Set the erc20Instance to be undefined
	erc20Instance = undefined;
	if(!isValidAddr(txtInputArea)) {
		//If the input provided by the user does not have the format of an 
		//Ethereum address hide the token data on the user interface. 
		$(divIdOfTokenData).hide();
		return;
	} else {
		//Otherwise, if the input provided by the user does have the format 
		//of an Ethereum address, remove the red background warning, take 
		//the address provided by the user and then make the erc20Instance
		//point to the ERC20 smart contract on the blockchain. 
		$(txtInputArea).css("background-color","white");
		erc20Address = $(txtInputArea).val();
		erc20Instance = ERC20.at(erc20Address);
		//Now display the data associated with the ERC20 token to the user. 
		//displayTokenDetails();
	}
}


var divID1; //HTML div ID to display the token name.
var divID2; //HTML div ID to display the token symbol.
var divID3; //HTML div ID to display the token decimals.
var divID4; //HTML div ID to display the user's token balance.
var divID5; //HTML div ID to display the token's total supply.
var divID6; //HTML div ID to display if the token is mintable.
var divID7; //HTML div ID to display if the token is burnable.
var divID8; //HTML div ID of the invalid token address warning
var divID9; //HTML div ID of the token info to be displayed
var divID10;//HTML div ID of the token info container



/**
* Invokes the displayTokenName() function which then invokes the displayTokenSymbol()
* function which in turn invokes the displayTokenDecimals(), after that the 
* displayUserTokenBalance() function is invoked which then calls the displayTokenSupply()
* function which goes on to invoke the displayIfTokenIsMintable() and finally the 
* displayIfTokenIsBurnable() funciton. The reason for designing the code this way is 
* due to some delays with synchronous function calls resulting in data displaying on the 
* user interface at different times. Not the biggest issue but it was desired to have all 
* the data display at exactly the same time.
**/
function displayTokenDetails(ID1,ID2,ID3,ID4,ID5,ID6,ID7,ID8,ID9,ID10) {
	//The conditional if statements below were created to mitigate some unexpected 
	//behaviour which resulted in some of the arguments passed to the function to 
	//be undefined. The cause of this problem is still unknown but the statements below
	//avoid any unwanted behaviour.
	if(ID1  != divID1  && ID1  != undefined) {divID1  = ID1};
	if(ID2  != divID2  && ID2  != undefined) {divID2  = ID2};
	if(ID3  != divID3  && ID3  != undefined) {divID3  = ID3};
	if(ID4  != divID4  && ID4  != undefined) {divID4  = ID4};
	if(ID5  != divID5  && ID5  != undefined) {divID5  = ID5};
	if(ID6  != divID6  && ID6  != undefined) {divID6  = ID6};
	if(ID7  != divID7  && ID7  != undefined) {divID7  = ID7};
	if(ID8  != divID8  && ID8  != undefined) {divID8  = ID8};
	if(ID9  != divID9  && ID9  != undefined) {divID9  = ID9};
	if(ID10 != divID10 && ID10 != undefined) {divID10 =ID10};
	displayTokenName();
}


/**
* Adds the token's name to the HTML and then invokes the displayTokenSymbol()
* function.
**/
function displayTokenName() {
	//Query the name of the ERC20 token
	erc20Instance.name((error, name)=>{
		if(!error){
			if(name != null) {
				//If the resulting name is not equal to null then add the name to the 
				//HTML and then invoke the displayTokenSymbol() function.
				erc20Name = name;
				$(divID1).html("NAME: " + erc20Name);
				displayTokenSymbol();
			} 
		} else {
			erc20Instance = undefined;
			//If there was an error then we can assume that the address provided by 
			//the user is not one which is associated with an ERC20 token on the 
			//Ropsten test network of the Ethereum blockchain. In this case, display 
			//an error message on the user interface. 
			$(divID10).hide(); //Hide the token info container
			$(divID8).show(); //Show the invalid token address message
			$(divID9).show(); //Show the token data (will contain a warning message)
			console.error(error);
		}
	});
}


/**
* Adds the token's symbol to the HTML and then invokes the displayTokenDecimals()
* function. 
**/
function displayTokenSymbol() {
	//Query the symbol of the token
	erc20Instance.symbol((error, symbol)=>{
		if(!error){
			//If no error has occured, then store and display the symbol of the token. 
			erc20Symbol = symbol;
			$(divID2).html("SYMBOL: " + erc20Symbol);
			displayTokenDecimals();
		} else {
			console.error(error);
		}
	});
}


/**
* Adds the token's decimals to the HTML and then invokes the displayUserTokenBalance().
* Unless if the current display mode is either AIRDROP_INTERACTER or ICO_INTERACTER, then 
* different functions will be invoked first but eventually the displayUserTokenBalance()
* will also be invoked futher down the line. 
**/
function displayTokenDecimals() {
	//Query the decimals of the token
	erc20Instance.decimals((error, decimals)=>{
		if(!error){
			//If no error has occured, then store and display the decimals of the token.
			erc20Decimals = decimals;
			$(divID3).html("DECIMALS: " + erc20Decimals);
			//If the current display mode is of the airdrop interactor, then invoke the 
			//displayTokenBalanceOfAirdropContract
			if(currentDisplay == DisplayMode.AIRDROP_INTERACTER) {
				displayTokenBalanceOfAirdropContract();
			} else {
				displayUserTokenBalance();
			}
		} else {
			console.error(error);
		}
	});
}


function displayTokenBalanceOfAirdropContract(){
	airdropAddress = $("#erc-address-input-airdrop-interact").val();
	erc20Instance.balanceOf(airdropAddress, (error, airdropBalance)=>{
		if(!error) {
			airdropTokenBalance = airdropBalance;
			$("#token-balance-of-airdrop-interact").html("TOKEN SUPPLY OF AIRDROP CONTRACT: " + numberWithCommas(Number(airdropBalance.div(10**erc20Decimals).toFixed(3))));
			displayUserTokenBalance();
		} else {
			console.error(error);
		}
	})
}


/**
* Adds the user's token balance to the HTML and then invokes the displayTokenSupply() function.
**/
function displayUserTokenBalance() {
	//Query the token balance of the user.
	erc20Instance.balanceOf(web3.eth.accounts[0], (error, balance)=>{
		if(!error) {
			erc20Balance = balance;
			$(divID4).html("YOUR BALANCE: " + numberWithCommas(Number(erc20Balance.div(10**erc20Decimals).toFixed(3))));
			displayTokenSupply();
		} else {
			console.error(error);
		}
	});
}



/**
* Adds the token's total supply to the HTML and then invokes the displayIfTokenIsMintable() function.
**/
function displayTokenSupply() {
	//Query the total supply of the token.
	erc20Instance.totalSupply((error, supply)=>{
		if(!error) {
			erc20Supply = supply;
			$(divID5).html("TOTAL SUPPLY: " + numberWithCommas(Number(supply.div(10**erc20Decimals).toFixed(3))));
			//Display the token data on the user interface. 
			displayIfTokenIsMintable();
		} else {
			console.error(error);
		}
	});
}



/**
* Checks whether the token is mintable and then adds the result to the HTML. Afterwhich, the 
* method then invokes the displayIfTokenIsBurnable() function.
**/
function displayIfTokenIsMintable() {
	//Query the token to see if it is mintable
	erc20Instance.isMintable((error, isMintable)=>{
		if(!error) {
			erc20IsMintable = isMintable;
			if(isMintable) {
				$(divID6).html("TOKEN IS MINTABLE: TRUE");
			} else {
				$(divID6).html("TOKEN IS MINTABLE: FALSE");
			}
			displayIfTokenIsBurnable();
		} else {
			console.error(error);
		}
	});
}


/**
* Checks whether the token is burnable and then adds the result to the HTML. Afterwhich, if
* if no errors occured then the token data will finally be displayed on the user interface.
**/
function displayIfTokenIsBurnable() {
	//Query the token to see if it is burnable
	erc20Instance.isBurnable((error, isBurnable)=>{
		if(!error){
			erc20IsBurnable = isBurnable;
			if(isBurnable) {
				$(divID7).html("TOKEN IS BURNABLE: TRUE");
			} else {
				$(divID7).html("TOKEN IS BURNABLE: FALSE");
			}
			//Display the token data on the user interface. 
			$(divID8).hide(); //Hide the invalid token address message
			$(divID9).show(); //Show the erc20 token data
			$(divID10).show(); //Show the erc20 token info container
		} else {
			console.error(error);
		}
	});
}



/**
* Returns true if the erc20Instance is defined, false otherwise. 
**/
function erc20InstanceDefined() {
	if(erc20Instance == undefined) {
		if(
			currentDisplay == DisplayMode.ERC20_INTERACTER || 
			currentDisplay == DisplayMode.AIRDROP_DEPLOYER ||
			currentDisplay == DisplayMode.ICO_DEPLOYER
		) {
			alert("PLEASE ENTER THE ADDRESS OF THE ERC20 TOKEN IN THE 'TOKEN ADDRESS' INPUT FIELD");
		} else if(currentDisplay == DisplayMode.AIRDROP_INTERACTER) {
			alert("TRANSACTION FAILED DUE TO INVALID AIRDROP CONTRACT ADDRESS");
		} else if(currentDisplay == DisplayMode.ICO_INTERACTER) {
			alert("TRANSACTION FAILED DUE TO INVALID ICO CONTRACT ADDRESS");
		}
		return false;
	}
	return true;
}