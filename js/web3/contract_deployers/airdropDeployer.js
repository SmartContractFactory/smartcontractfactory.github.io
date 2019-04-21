/**
* Invokes the deployAirdropContract of the ContractFactory.sol smart contract.
**/
function deployAirdrop() {
	//First check that the erc20 instance is defined.
	if(erc20InstanceDefined()){
		//If the erc20 instance is defined, then pass the address of the erc20 
		//token as the argument to the deployAirdropContract function of the 
		//smart contract. 
		contractFactory.deployAirdropContract(erc20Address,{from: web3.eth.accounts[0], gasPrice: 5e10},(error,result)=>{
			if(error) {
				console.errror(error);
			} else {showContractDeploymentTxModal(result)}
		});
	}
}


/**
* Listen for events on the Contract Factory for when an airdrop contract has
* been deployed by the user. Once the event is broadcast this will mean the 
* contract has been created and the user will be presented with the address
* of the new airdrop smart contract.
**/
var airdropDeploymentEvent = contractFactory.AirdropDeployed({by: web3.eth.accounts[0]});
airdropDeploymentEvent.watch(function(error, result){
	if(error) {
		alert("error");
	} else {
		$("#contractDeploymentTxModal").modal('hide');
		$('#contractDeployedModalBody').html("Congratulations! You have deployed your own airdrop contract. Please make sure to copy and save the contract address: "
			+ result["args"]["addressOfAirdrop"]);
		$('#contractDeployedModal').modal('show');
	}
})
