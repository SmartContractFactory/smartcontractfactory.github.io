var airdropABI = JSON.parse('[{"constant":false,"inputs":[{"name":"_recipientAddress","type":"address"},{"name":"_tokensToWithdraw","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"assignOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipientAddresses","type":"address[]"},{"name":"_tokensToSend","type":"uint256[]"}],"name":"multiValueAirdrop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipientAddresses","type":"address[]"},{"name":"_tokensToSend","type":"uint256"}],"name":"singleValueAirdrop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"}]');

var airdrop = web3.eth.contract(airdropABI);

var airdropInstance;
var airdropAddress;


/**
* This function is invoked automatically when the user wants to interact with an airdrop 
* smart contract (deployed by the Contract Factory) when the user inputs the airdrop 
* contract's address. 
**/
function getTokenDataOfAirdropContract() {
	//First make the erc20Instance and airdropInstance to be undefined. This is necessary 
	//because the user has provided new input so he or she will probably want to interact 
	//with a different airdrop contract which can only airdrop a specific erc20 token. 
	erc20Instance = undefined;
	airdropInstance = undefined;
	//Now check if the provided input by the user has the valid format of an ETH address. 
	if(isValidAddr("#erc-address-input-airdrop-interact")) {
		//If the provided input by the user has a the valid format of an ETH address, use
		//the address provided to create an instance of the airdrop contract.
		airdropAddress = $("#erc-address-input-airdrop-interact").val();
		airdropInstance = airdrop.at(airdropAddress);
		//Now it is time to get the address of the erc20 token which the airdrop contract 
		//will be distributing. 
		airdropInstance.getTokenAddress((error,addressOfToken)=>{
			if(!error) {
				//If the getTokenAddress() function of the airdrop smart contract does not 
				//return "0x", then it must be the case that the user has provided an ETH
				//address which does belong to an airdrop contract deployed from the 
				//Contract Factory. 
				if(addressOfToken!="0x") {
					//Display the contract address of the erc20 token on sale.
					$("#token-address-airdrop-interact").html(addressOfToken);
					//Now display the token details to the user. 
					getTokenInfoFromAddress(addressOfToken);
					$("#invalid-contract-address-airdrop-deploy").hide();
					$("#token-info-container-airdrop-interact").show();
					$("#token-data-airdrop-interact").show();
				} else {
					//If the getTokenAddress() function of the airdrop smart contract 
					//returns "0x", then it must be the case that the user has 
					//provided an address which does not belong to an airdrop contract
					//deployed by the Contract Factory because when a user deploys 
					//an airdrop contract, the user has to provide the address of the token.
					//In such a case, set the contract instances to be undefined and 
					//inform the user that the wrong address has been provided. 
					airdropAddress = undefined;
					airdropInstance = undefined;
					$("#token-info-container-airdrop-interact").hide();
					$("#token-data-airdrop-interact").show();
					$("#invalid-contract-address-airdrop-deploy").show();
				}
			} else {
				console.error(error);
			}
		})
	} else {
		//If the input provided by the user does not match the regular expression of all ETH addresses
		//then hide the token info containers.
		$("#token-info-container-airdrop-interact").hide();
		$("#token-data-airdrop-interact").hide();
		$("#invalid-contract-address-airdrop-deploy").hide();
	}
}


/**
* Allows for the deposit of tokens on airdrop smart contract. This function simply just invokes the 
* transfer() function of the erc20Instance and just transfers tokens from the user's MetaMask wallet
* to the airdrop contract address.
**/
function airdropDeposit() {
	//First check that the erc20Instance is defined. 
	if(erc20InstanceDefined()) {
		//Next take the user's input to see how many tokens the user wants to deposit. 
		var tokensToDeposit = $("#value-of-airdrop-deposit").val();
		//Now check if the user's input is a positive number. 
		if(isPositiveNumber("#value-of-airdrop-deposit")) {
			//If it is a positive number then multiply it by (10**erc20Decimals) to give the number
			//the correct number of zeros at the end.
			tokensToDeposit = tokensToDeposit * (10**erc20Decimals);
		} else {
			//If the input is not a positive number, then warn the user and exit the funciton. 
			alert("PLEASE ENTER THE TOTAL AMOUNT OF TOKENS YOU WANT TO DEPOSIT ON THE AIRDROP CONTRACT");
			return;
		}
		//Now check that the user has enough tokens in his or her MetaMask wallet to fascilitate the 
		//deposit. 
		if(tokensToDeposit > erc20Balance) {
			//If the user does not have enough tokens then alert the user and exit the function. 
			alert("YOU DO NOT HAVE ENOUGH TOKENS IN YOUR WALLET FOR THIS DEPOSIT");
			return;
		}
		//Now invoke the transfer() function of the erc20 token and have the user sign the transaction 
		//to have the tokens transferred from his or her MetaMask to the airdrop contract address. 
		erc20Instance.transfer(airdropAddress, tokensToDeposit, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
			if(!error) {
				$("#tx-msg").html("Check the status of your token deposit ");
				$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
				$("#txModal").modal('show');
			} else {
				console.error(error);
			}
		})
	} 
}


/**
* Allows the owner of the airdrop smart contract to withdraw tokens from the airdrop contract. 
**/
function airdropWithdraw() {
	//First check that the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the airdrop contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		airdropInstance.getOwner((error, owner)=>{
			if(!error) {
				//If the owner address of the airdrop smart contract is NOT the same as the user's address,
				//then alert the user and exit from the function.
				if(owner != web3.eth.accounts[0]){
					alert("ONLY THE OWNER IS ALLOWED TO WITHDRAW TOKENS FROM THE AIRDROP CONTRACT");
					return;
				} else {
					//If the owner address of the airdrop smart contract IS the same as the user's address,
					//then proceed to check the total amount of tokens the user wants to withdraw. If the
					//input is of the format of a positive number, then multiply the value by (10**erc20Decimals)
					//to ensure the correct amount of tokens are withdrawn (without the user having to add a 
					//whole bunch of zeros at the end of the value).
					var tokensToWithdraw = $("#value-of-airdrop-withdrawal").val();
					if(isPositiveNumber("#value-of-airdrop-withdrawal")) {
						tokensToWithdraw = tokensToWithdraw*(10**erc20Decimals);
					} else {
						alert("PLEASE ENTER THE TOTAL AMOUNT OF TOKENS YOU WANT TO WITHDRAW FROM THE AIRDROP CONTRACT");
						return;
					}
					//Now check that the airdrop smart contract has enough tokens for the withdrawal. 
					if(tokensToWithdraw > airdropTokenBalance) {
						alert("THE AIRDROP CONTRACT CONTAINS " 
							+ (airdropTokenBalance/(10**erc20Decimals))
							+ " TOKENS, YET YOU HAVE ATTEMPTED TO WITHDAW " 
							+ (tokensToWithdraw/(10**erc20Decimals)));
						return;
					}
					//At this point check if the address of recipient has the correct format of an ETH address.
					var recipientOfWithdrawal = $("#recipient-of-airdrop-withdrawal").val();
					if(!isValidAddr("#recipient-of-airdrop-withdrawal")) {
						alert("THE RECIPIENT ADDRESS HAS AN INVALID FORMAT");
						return;
					}
					//Invoke the withdrawTokens() function of the airdrop smart contract.
					airdropInstance.withdrawTokens(recipientOfWithdrawal, tokensToWithdraw, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
						if(!error) {
							$("#tx-msg").html("Check the status of your token withdrawal ");
							$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
							$("#txModal").modal('show');
						} else {
							console.error(error);
						}
					});
				}
			} else {
				console.error(error);
			}
		});
	} 
}


/**
* Allows the owner of the airdrop smart contract to airdrop (or batch transfer) tokens.
**/
function airdropTokens() {
	//First check that the erc20Instance is defined. 
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the airdrop contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		airdropInstance.getOwner((error,owner)=>{
			if(!error) {
				//If the owner's address of the airdrop smart contract is NOT the same as the user's address,
				//alert the user and exit the function. 
				if(owner != web3.eth.accounts[0]) {
					alert("ONLY THE OWNER OF THE CONTRACT IS ALLOWED TO AIRDROP TOKENS");
					return;
				} else {
					//If the owner address of the airdrop smart contract IS the same as the user's address,
					//then proceed to take the user's input starting with the addresses of all recipients of
					//the batch transfer. 

					//In case the user has separated all addresses (or just some) with a comma or a new line
					//then replace every occurence of each with a white space.
				    var addrsInput = document.getElementById("recipient_addrs").value.replaceAll(",", " ");
				    addrsInput = addrsInput.replaceAll("\n", " ")
				    //Now split the input into an array by the white spaces. 
				    addrsInput = addrsInput.split(" ");
				    //Create a new array to hold the addresses
				    var addrs = [];
				    for(i=0; i < addrsInput.length; i++) {
				    	//If once trimmed (i.e., all white space removed) the value is not the empty string,
				    	//then add it to the array of addresses. 
				        if(addrsInput[i].trim() != ""){
				            addrs.push(addrsInput[i].trim())
				        }
				    }
				    addrs = addrs.map(el => el.trim());
				    //Now do the exact same thing for the input values (i.e., the total amounts of tokens the 
				    //user wants to send to each address) as what was done with the recipient addresses provided
				    //by the user as input. 
				    var valsInput = document.getElementById("corresponding_values").value.replaceAll(",", " ");
				    valsInput = valsInput.replaceAll("\n", " ")
				    valsInput = valsInput.split(" ");
				    var vals = []
				    for(i=0; i < valsInput.length; i++) {
				        if(valsInput[i].trim() != ""){
				            vals.push(valsInput[i].trim())
				        }
				    }
				    vals = vals.map(el => el.trim());
				    //Now check that all addresses provided by the user match the regular expression for
				    //ETH addresses. 
				    var ethAddrRegex = "^0x[a-fA-F0-9]{40}$";
				    for(var i = 0; i < addrs.length; i++) {
				        if(!addrs[i].match(ethAddrRegex)){
				            alert("Invalid address found in address list " + addrs[i]);
				            return;
				        }
				    }
				    //At this point we check to see if the user has provided more than one value in order
				    //to know whether or not the user wants to make a single or multi value airdrop. 
				    if(vals.length > 1) {
				    	//If more than one value has been provided then it will be a multi value airdrop,
				    	//in which case it is necessary to check that the user has provided the same 
				    	//amount of values as addresses.
				        if(vals.length != addrs.length) {
				        	//If the user has provided different amounts of values as addresses, then
				        	//alert the user and exit the function. 
				            alert("Number of values must be the same as number of addresses");
				            return;
				        }
				        //Otherwise, multiply all the values by (10**erc20Decimals) to ensure that all 
				        //values have the correct number of zeros at the end. 
				        for(var i = 0; i < vals.length; i++) {
				            vals[i] = (vals[i] * (10 ** erc20Decimals));
				        }
				        //Now invoke the multiValue airdrop function to distribute the tokens. 
				        multiValueAirdrop(addrs, vals);
				    } else {
				    	//In this case, the user wants to make a single value airdrop. So all that 
				    	//needs to be done is to multiply the single value by (10 ** erc20Decimals)
				    	//to ensure that the value has the correct number of zeros at the end and then 
				    	//invoke the singleValueAirdrop function to distribute the tokens. 
				        var value = (vals[0] * (10 ** erc20Decimals));
				        singleValueAirdrop(addrs, value);
				    }
				}
			}
		})
	}
}


/**
* This function is invoked internally by the airdropTokens() function. It fascilitates batch transfers
* to multiple ETH addresses in which each address receives a different amount of tokens from the airdrop 
* smart contract. 
*
* @param addrs - The list of addresses provided by the user.
* @param vals - The list of (number) values provided by the user.
**/
function multiValueAirdrop(addrs, vals) {
	//First it is important to check how many tokens the user wants to airdrop because the airdrop
	//smart contract may not have a sufficient amount in its balance. 
    sumOfVals = 0;
    for(i=0; i<vals.length; i++){
        sumOfVals += vals[i];
    }
    //If the airdrop smart contract does not have enough tokens, then alert the user and exit the function. 
    if(sumOfVals > airdropTokenBalance) {
        alert("YOU HAVE ATTEMPTED TO AIRDROP A TOTAL OF "
        	+ (sumOfVals/(10**erc20Decimals)) 
        	+ " YET THE AIRDROP CONTRACT ONLY HAS " 
        	+ (airdropTokenBalance/(10**erc20Decimals)));
        return;
    }
    //Invoke the multiValueAirdrop function of the airdrop smart contract. 
    airdropInstance.multiValueAirdrop(addrs, vals, {from: web3.eth.accounts[0], gasPrice: 5e10}, ((error, result) => {
		if(!error) {
			$("#tx-msg").html("Check the status of your multi-value airdrop ");
			$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
			$("#txModal").modal('show');
		} else {
			console.error(error);
		}
    }))
}


/**
* This function is invoked internally by the airdropTokens() function. It fascilitates batch transfers
* to multiple ETH addresses in which each address receives the same amount of tokens from the airdrop 
* smart contract. 
*
* @param addrs - The list of addresses provided by the user.
* @param val - The (number) value provided by the user. 
**/
function singleValueAirdrop(addrs, val) {
	//First it is important to check how many tokens the user wants to airdrop because the airdrop
	//smart contract may not have a sufficient amount in its balance. 
    var sumOfVals = val * addrs.length;
    //If the airdrop smart contract does not have enough tokens, then alert the user and exit the function. 
    if(sumOfVals > airdropTokenBalance) {
        alert("YOU HAVE ATTEMPTED TO AIRDROP A TOTAL OF "
        	+ (sumOfVals/(10**erc20Decimals)) 
        	+ " YET THE AIRDROP CONTRACT ONLY HAS " 
        	+ (airdropTokenBalance/(10**erc20Decimals)));
        return;
    }
    //Invoke the singleValueAirdrop function of the airdrop smart contract. 
    airdropInstance.singleValueAirdrop(addrs, val, {from: web3.eth.accounts[0], gasPrice: 5e10}, ((error, result) => {
		if(!error) {
			$("#tx-msg").html("Check the status of your single-value airdrop ");
			$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
			$("#txModal").modal('show');
		} else {
			console.error(error);
		}
    }))
}