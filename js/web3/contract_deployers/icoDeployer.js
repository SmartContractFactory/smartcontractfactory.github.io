/**
* Deploys a new ICO contract from the ContractFactory.sol smart contract.
**/
function deployICO() {
	//First check that the erc20 instance is defined.
	if(erc20InstanceDefined()){
		//Now take the contract address of the erc20 token to be passed as
		//the first parameter of the deployICOContract function of the 
		//ContractFactory.sol smart contract.
		var tokenAddr = $("#erc-address-input-ico-deployer").val();

		//Check that the user has provided an ETH soft cap value which is
		//is a positive number.  
		if(!isPositiveNumber("#eth-softcap-ico-deployer")) {
			alert("PLEASE ENTER A VALID SOFT CAP VALUE");
			return;
		}
		//If the provided soft cap value is a positive number, assign it 
		//to a variable and then multiply it by (10**18) because ETH is 
		//an 18 decimal coin itself. This will be the second argument of 
		//of the deployICOContract function of the ContractFactory.sol 
		//smart contract.
		var softCap = $("#eth-softcap-ico-deployer").val();
		softCap = softCap*(10**18);

		//Now check that the ETH exchange rate of the token provided by 
		//the user is a positive number.
		if(!isPositiveNumber("#rate-ico-deployer")) {
			alert("PLEASE ENTER A VALID EXCHANGE RATE");
			return;
		}
		//If the exchange rate provided by the user is a positive number,
		//then assign it to a variable to be passed as the third argument 
		//of the deployICOContract function of the ContractFactory.sol 
		//smart contract.
		var rate = $("#rate-ico-deployer").val();

		//Now check that the user has provided a duration in days for 
		//which the ICO will be active that is a positive integer.
		if(!isPositiveInteger("#duration-ico-deployer")) {
			alert("PLEASE ENTER A VALID DURATION FOR THE ICO");
			return;
		}
		//If the duration in days provided by the user is a positive 
		//integer, then assign it to a variable to be passed as the final
		//argument of the deployICOContract function of the ContractFactory.sol 
		//smart contract.
		var days = $("#duration-ico-deployer").val();

		//Finaly at this point the new ICO smart contract will be deployed.
		contractFactory.deployICOContract(tokenAddr, Number(erc20Decimals), softCap, rate, days, {from: web3.eth.accounts[0], gasPrice: 5e10},(error,result)=>{
			if(error) {
				console.errror(error);
			} else {showContractDeploymentTxModal(result)}
		});
	}
}


/**
* Listen for events on the Contract Factory for when a new ICO contract has
* been deployed by the user. Once the event is broadcast this will mean the 
* contract has been created and the user will be presented with the address
* of the new ICO smart contract.
**/
var icoDeploymentEvent = contractFactory.ICODeployed({by: web3.eth.accounts[0]});
icoDeploymentEvent.watch(function(error, result){
	if(error) {
		alert("error");
	} else {
		$("#contractDeploymentTxModal").modal('hide');
		$('#contractDeployedModalBody').html("Congratulations! You have deployed your own ICO contract. Please make sure to copy and save the contract address: "
			+ result["args"]["addressOfICO"]);
		$('#contractDeployedModal').modal('show');
	}
})