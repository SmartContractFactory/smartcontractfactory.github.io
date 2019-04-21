/**
* Allows the user to mint new tokens to a specified address if and only if the user is the 
* owner of the ERC20 token contract. 
**/
function mintTokens() {
	//Check if the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		//Assign the recipient to a variable and then check if it is the empty string. If
		//so the user will be prompted to add an address.
		var recipientAddress = $("#mint-recipient").val();
		if(recipientAddress == "") {
			alert("PLEASE ENETER A RECIPIENT ADDRESS");
			return;
		}
		//Check if the recipient address of the token minting is has a valid format. 
		if(!isValidAddr("#mint-recipient")) {
			alert("THE RECIPIENT ADDRESS PROVIDED HAS AN INVALID FORMAT");
			return;
		} 
		//Assign the number of tokens to mint provided by the user in a variable and then 
		//check if the value provided is an empty string. If so, the user will be prompted 
		//to add a value. 
		var tokensToMint = $("#tokens-to-mint").val();
		if(tokensToMint == "") {
			alert("PLEASE ENTER THE AMOUNT OF TOKENS TO MINT");
			return;
		}
		tokensToMint = tokensToMint * (10**erc20Decimals);
		//Check if the number of tokens to mint provided by the user is a positive number. 
		//If not, the user will be promted to enter a positive number. 
		if(!isPositiveNumber("#tokens-to-mint")) {
			alert("PLEASE ENTER A POSITIVE NUMBER AS THE AMOUNT OF TOKENS TO MINT");
			return;
		}
		if(!erc20IsMintable) {
			//If the token is not mintable alert the user.
			alert("THIS TOKEN IS NOT MINTABLE");
			return;
		} else {
			//If the token is mintable, check to see whether or not the user is the owner of the contract.
			if(erc20Owner != web3.eth.accounts[0]) {
				//If the user is not the owner of the contract alert the user and exit the function. 
				alert("YOU ARE NOT THE OWNER OF THIS TOKEN CONTRACT. ONLY THE OWNER IS ALLOWED TO MINT TOKENS");
				return;
			} else {
				//If the user is the owner of the ERC20 token contract then invoke the mintTokens() funciton of the smart contract. 
				//For more details on the mintTokens() funciton check the ERC20Template.sol smart contract. 
				erc20Instance.mintTokens(recipientAddress, tokensToMint, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
					if(!error) {
						$("#tx-msg").html("Check the status of your token minting ");
						$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
            			$("#txModal").modal('show');
					} else {
						console.error(error);
					}
				})
			}
		}



	}
}




/**
* Allows the user to burn tokens from his or her personal token balance if and only if the user 
* is the owner of the ERC20 token contract. 
**/
function burnTokens() {
	//Check if the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		//Take the value provided by the user and store it in a variable. Then check if the input is the 
		//empty string or a non-positive number. If either are true, then the user will be prompted to 
		//enter a positive number. 
		var tokensToBurn = $("#tokens-to-burn").val();
		if(!isPositiveNumber("#tokens-to-burn") || tokensToBurn == "") {
			alert("PLEASE ENTER A POSITIVE NUMBER REPRESENTING THE AMOUNT OF TOKENS YOU WOULD LIKE TO BURN");
			return;
		}
		tokensToBurn = tokensToBurn*(10**erc20Decimals);
		//Check if the user has a sufficient balance for the token burning.
		if(tokensToBurn > erc20Balance) {
			alert("YOU DO NOT HAVE ENOUGH TOKENS IN YOUR BALANCE TO BURN " + $("#tokens-to-burn").val());
			return;
		}
		if(!erc20IsBurnable) {
			//If the token is not burnable, alert the user and exit the funciton.
			alert("THIS TOKEN IS NOT BURNABLE");
			return;
		} else {
			//Check if the user is the owner of the ERC20 token contract.
			if(erc20Owner != web3.eth.accounts[0]) {
				//If the user is not the owner alert the user that he or she cannot burn tokens.
				alert("YOU ARE NOT THE OWNER OF THIS TOKEN CONTRACT. ONLY THE OWNER IS ALLOWED TO BURN TOKENS");
				return;
			} else {
				//If the user is the owner of the token contract then invoke the burnTokens() function of the ERC20 token.
				//For more details on the burnTokens() function check the ERC20Template.sol smart contract. 
				erc20Instance.burnTokens(tokensToBurn, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
					if(!error) {
						$("#tx-msg").html("Check the status of your token burning ");
						$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
            			$("#txModal").modal('show');
					} else {
						console.error(error);
					}
				})
			}
		}
	} 
}




/**
* Allows the user to transfer tokens.
**/
function transfer() {
	//Check if the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		var recipientAddress = $("#recipient-of-transfer").val();
		//Check if the recipient address provided by the user is the empty string. 
		if(recipientAddress == "") {
			//If it is an empty string then prompt the user to 
			alert("PLEASE ENETER A RECIPIENT ADDRESS");
			return;
		} 
		//Check if the recipient's address provided by the user is valid.
		if(!isValidAddr("#recipient-of-transfer")) {
			//If the address is not valid then alert the user that the address has the wrong format
			//and then exit the function. 
			alert("THE RECIPIENT ADDRESS PROVIDED HAS AN INVALID FORMAT");
			return;
		} 
		var tokensToTransfer = $("#value-of-transfer").val();
		//Check if the transfer value provided by the user is the empty string.
		if(tokensToTransfer == "") {
			//If the value is an empty string them alert the user that a value is needed. 
			alert("PLEASE ENTER THE AMOUNT OF TOKENS TO TRANSFER");
			return;
		}
		//Check if the transfer value provided by the user is positive number.
		if(!isPositiveNumber("#value-of-transfer")) {
			//If the value is not a positive number then prompt the user to input a postive number
			//and then exit the function.
			alert("PLEASE ENTER A POSITIVE NUMBER AS THE AMOUNT TO TRANSFER");
			return;
		}
		tokensToTransfer = tokensToTransfer * (10**erc20Decimals);
		//Check that the user has enough tokens for the transfer.
		if(tokensToTransfer > erc20Balance) {
			//If the user does not have a sufficient balance, then alert the user and exit the funciton.
			alert("YOU DO NOT HAVE ENOUGH TOKENS FOR THIS TRANSFER");
			return;
		}
		//Otherwise, if the user has enough tokens then invoke the transfer() function of the ERC20 token.
		//For more details on transfer() function of the token, visit the ERC20Template.sol smart contract code. 
		erc20Instance.transfer(recipientAddress, tokensToTransfer, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
			if(!error) {
				$("#tx-msg").html("Check the status of your token transfer ");
				$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
    			$("#txModal").modal('show');
			} else {
				console.error(error);
			}
		})
	}
} 




/**
* Allows the user to transfer tokens from the account of someone else if and 
* only if that someone else has previosly approved the user to spend tokens 
* on his or her behalf given that the user does not try to transfer more tokens
* than what was approved. 
**/
function transferFrom() {
	//Check if the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		var fromAddress = $("#from-addr-of-transfer-from").val();
		//Check if the from address (i.e, the token holder's address) provided
		//is the empty string or not.
		if(fromAddress == "") {
			//If it is the empty string, prompt the user to enter an address 
			//and then exit the function. 
			alert("PLEASE ENTER THE ADDRESS FORM WHICH YOU WILL BE TRANSFERRING TOKENS FROM");
			return;
		}
		//Check if the from address provided by the user has a valid format. 
		if(!isValidAddr("#from-addr-of-transfer-from")) {
			//If the from address provided is not valid, then alert the user 
			//and exit the function. 
			alert("THE FROM ADDRESS PROVIDED HAS AN INVALID FORMAT");
			return;
		} 

		var recipientAddress = $("#recipient-of-transfer-from").val();
		//Check if the recipient address provided by the user is the empty string. 
		if(recipientAddress == "") {
			//If the recipient address provided is an emtpy string then alert the 
			//user to enter an address. 
			alert("PLEASE ENETER A RECIPIENT ADDRESS");
			return;
		}
		//Check if the recipient address provided by the user has a valid format. 
		if(!isValidAddr("#recipient-of-transfer-from")) {
			//If the recipient address provided is not valid, then alert the user 
			//and exit the function. 
			alert("THE RECIPIENT ADDRESS PROVIDED HAS AN INVALID FORMAT");
			return;
		} 

		var tokensToTransfer = $("#value-of-transfer-from").val();
		//Check if the transfer value provided by the user is the empty string.
		if(tokensToTransfer == "") {
			//If the transfer value provided by the user is the empty string,
			//then alert the user that a value is needed and exit the function. 
			alert("PLEASE ENTER THE AMOUNT OF TOKENS TO TRANSFER");
			return;
		}
		//Check if the transfer value provided by the user is a positive number. 
		if(!isPositiveNumber("#value-of-transfer-from")) {
			//If it is not a positive number then alert the user that a positive 
			//number is needed and exit the function. 
			alert("PLEASE ENTER A POSITIVE NUMBER AS THE AMOUNT TO TRANSFER");
			return;
		}

		tokensToTransfer = tokensToTransfer * (10**erc20Decimals);

		//Now it is time to check if the from address (i.e., the token owner) has
		//approved the spender to at least spend the specified amount of tokens that the 
		//the user provided. To do this the allowance() function is invoked on the ERC20
		//token contract. For more details on this function visit the ERC20Template.sol
		//smart contract. 
		erc20Instance.allowance(fromAddress, web3.eth.accounts[0], (error, allowance)=>{
			if(!error) {
				//Check if the allowance user has enough allownace.
				if(tokensToTransfer > allowance) {
					//If the user does not have enough allowance then alert the user and
					//then exit the function. 
					alert("YOUR ALLOWANCE FROM THE GIVEN FROM ADDRESS IS JUST " 
						+ numberWithCommas(allowance / (10**erc20Decimals)) 
						+ " YET YOU HAVE ATTEMPTED TO TRANSFER " 
						+ numberWithCommas(tokensToTransfer / (10**erc20Decimals)) 
						+ " TOKENS");
					return;
				} else {
					//Otherwise if the user does have a sufficient allownace then check if 
					//the from address has enough tokens for the transfer by invoking the 
					//balanceOf() function of the ERC20 token contract. For more details about 
					//the balanceOf() function visit the ERC20Template.sol smart contract.
					erc20Instance.balanceOf(fromAddress, (error, fromAddressBalance)=>{
						if(!error){
							if(tokensToTransfer > fromAddressBalance) {
								//If the from address does not have enough tokens, then aler the  
								//user and exit the function.
								alert("THE ADDRESS WHICH YOU WISH TO TRANSFER TOKENS FROM HAS AN INSUFFICIENT BALANCE");
								return;
							} else {
								//If the from address does have enough tokens, then invoke the 
								//transferFrom() function of the ERC20 token contract. For more 
								//info on this function, visit the ERC20Template.sol contract. 
								erc20Instance.transferFrom(fromAddress, recipientAddress, tokensToTransfer, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
									$("#tx-msg").html("Check the status of your token transfer ");
									$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
					    			$("#txModal").modal('show');
								})
							}
						} else {
							console.error(error);
						}
					})
				}
			} else {
				console.error(error);
			}
		})
	}
}





/**
* Allows the user to approve another user to spend up to a certain amount of tokens from
* his or her account. 
**/
function approve() {
	//Check if the erc20Instance is defined.
	if(erc20InstanceDefined()){
		//Check if the user has provided a valid address for the approval.
		if(!isValidAddr("#approve-spender")) {
			//If not alert the user and exit the function.
			if($("#approve-spender").val() == "") {
				alert("PLEASE ENTER THE ADDRESS OF THE SPENDER");
			} else {
				alert("THE SPENDER ADDRESS PROVIDED HAS AN INVALID FORMAT");
			}
			return;
		} 
		var spenderAddress = $("#approve-spender").val();
		//Check if the user has provided a positive number as the approval amount. 
		if(!isPositiveNumber("#approval-amount")) {
			//If not, alert the user and exit the funciton. 
			if($("#approval-amount").val() == "") {
				alert("PLEASE ENETER THE TOTAL AMOUNT OF TOKENS YOU WOULD LIKE TO APPROVE THE SPENDER TO SPEND ON YOUR BEHALF");
			} else {
				alert("PLEASE ENTER A POSITIVE NUMBER AS THE AMOUNT OF TOKENS TO APPROVE THE SPENDER TO SPEND ON YOUR BEHALF");
			}
			return;
		} 
		var approvalAmount = $("#approval-amount").val();
		approvalAmount = approvalAmount * (10**erc20Decimals);
		//Invoke the approve() function of the ERC20 token contract. For more details 
		//on the approve() funciton visit the ERC20Template.sol contract. 
		erc20Instance.approve(spenderAddress, approvalAmount, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
			$("#tx-msg").html("Check the status of your token approval ");
			$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
			$("#txModal").modal('show');
		})
	}
}