/**
* Deploys a new ERC20 token from the ContractFactory.sol smart contract. The type of
* token created will depend on the inputs of the user. 
**/
function deployERC20() {
	//First check if the user has ticked the burnable checkbox.
	var burnable = $("#burnable-checkbox").prop('checked');
	//Next check if the user has selected the mintable checkbox.
	var mintable = $("#mintable-checkbox").prop('checked');
	//In the next 4 assignments we take the name, symbol, total supply and decimals 
	//which the token will have. 
	var name = $('#erc-name-input').val();
	var symbol = $('#erc-symbol-input').val();
	var totalSupply = parseInt($('#erc-supply-input').val());
	var decimals = parseInt($('#erc-decimals-input').val());
	var txURL = ""
	if(!burnable && !mintable) {
		//If the token is not mintable and also not burnable, then deploy a token 
		//which has neither of these functionalities. 
		contractFactory.deploySimpleToken(totalSupply*(10**decimals), decimals, name, symbol, {from: web3.eth.accounts[0], gasPrice: 5e10}, ((error, result)=>{
			if(error) {console.log(error)}
			else {showContractDeploymentTxModal(result)}
		}))
	} else if(!burnable && mintable) {
		//If the token is not burnable but it is mintable, then deploy a token 
		//which has the minting function but not the burning function.
		contractFactory.deployMintableToken(totalSupply*(10**decimals), decimals, name, symbol, {from: web3.eth.accounts[0], gasPrice: 5e10}, ((error, result)=>{
			if(error) {console.log(error)}
			else {showContractDeploymentTxModal(result)}
		}))
	} else if(burnable && !mintable){
		//If the token is not burnable but is mintable, then deploy a token 
		//which has the burning function but not the minting function. 
		contractFactory.deployBurnableToken(totalSupply*(10**decimals), decimals, name, symbol, {from: web3.eth.accounts[0], gasPrice: 5e10}, ((error, result)=>{
			if(error) {console.log(error)}
			else {showContractDeploymentTxModal(result)}
		}))
	} else {
		//In this case the token must be both mintable and burnable, so a 
		//token with both minting and burning functionalities must be deployed. 
		contractFactory.deployMintableBurnableToken(totalSupply*(10**decimals), decimals, name, symbol, {from: web3.eth.accounts[0], gasPrice: 5e10}, ((error, result)=>{
			if(error) {console.log(error)}
			else {showContractDeploymentTxModal(result)}
		}))
	} 
}



/**
* Listen for events on the Contract Factory for when a new erc20 token has
* been deployed by the user. Once the event is broadcast this will mean the 
* contract has been created and the user will be presented with the address
* of the new erc20 token smart contract.
**/
var tokenDeploymentEvent = contractFactory.TokenDeployed({by: web3.eth.accounts[0]});
tokenDeploymentEvent.watch(function(error, result){
	if(error) {
		alert("error");
	} else {
		$("#contractDeploymentTxModal").modal('hide');
		$('#contractDeployedModalBody').html("Congratulations! You have deployed your own ERC20 token. Please make sure to copy and save the contract address: "
			+ result["args"]["addressOfToken"]);
		$('#contractDeployedModal').modal('show');
	}
})


/**
* This function is used to ensure that users have input legal parameters.
* If any invalid parameters have been provided, then the button for deploying
* the new token will be disabled. 
**/
function checkDeployERC20Inputs() {
	var legalTotalSupply = true;
	var legalDecimals = true;
	var legalName = true;
	var legalSymbol = true;
	//First check that the user entered a positive integer for the total
	//supply of the token.
	if(!isPositiveInteger('#erc-supply-input')) {
		legalTotalSupply = false;
	} 
	//Next check that the user has entered a positive integer for the decimals
	//of the token. 
	if(!isPositiveInteger('#erc-decimals-input')) {
		legalDecimals = false;
	}
	//Now check that the user has entered a name which is not the empty string.
	var name = $('#erc-name-input').val();
	if(name == "") {
		legalName = false;
	}
	//Finally check that the user has entered a symbol which is not the empty string.
	var symbol = $('#erc-symbol-input').val();
	if(symbol == "") {
		legalSymbol = false;
	}
	//Now check if all inputs are legal. If not then disable the button for deploying
	//the new token. Otherwise, enable the button. 
	if(legalTotalSupply && legalDecimals && legalName && legalSymbol) {
		$("#deploy-erc20-btn").attr("disabled", false);
	} else {
		$("#deploy-erc20-btn").attr("disabled", true);
	}
}

checkDeployERC20Inputs();