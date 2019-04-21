var icoABI = JSON.parse('[{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokensToWithdraw","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getEthRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"softCapReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenDecimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokensSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newDeadline","type":"uint256"}],"name":"shortenDeadline","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newRate","type":"uint256"}],"name":"changeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"assignOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalTokensSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investments","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"icoHasEnded","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ethSoftCap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimRefund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"cancelICO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"icoCancelled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ethRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_tokenDecimals","type":"uint256"},{"name":"_ethSoftCap","type":"uint256"},{"name":"_rate","type":"uint256"},{"name":"_durationInDays","type":"uint256"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"by","type":"address"},{"indexed":false,"name":"totalTokensPurchased","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"}]');
var ico =  web3.eth.contract(icoABI);

var icoInstance;
var icoAddress;

var icoDeadline;
var icoContractEthBalance;
var icoContractEthRaised;
var icoContractSoftCap;
var icoContractRate;


/**
* Gets and displays all the data associated with the ICO contract using the 
* contract address provided by the user. If the contract address does not 
* belong to one of the ICO contracts deployed by the Contract Factory, then 
* the user will be informed. 
*
* This funciton is invoked every time the user provides input to the "ICO 
* CONTRACT ADDRESS" on the ICO interactor display mode. 
**/
function getDataOfICOContract() {
	//First make the erc20Instance and airdropInstance to be undefined. This is necessary 
	//because the user has provided new input so he or she will probably want to interact 
	//with a different ICO contract which can only sell a specific erc20 token. 
	erc20Instance = undefined;
	icoInstance = undefined;	
	//Now check if the provided input by the user has the valid format of 
	//an ETH address. 
	if(isValidAddr("#ico-address-input-interact")) {
		//If the provided input by the user has a the valid format of an 
		//ETH address, use the address provided to create an instance of 
		//the ico contract.
		icoAddress = $("#ico-address-input-interact").val();
		icoInstance = ico.at(icoAddress);
		//Now it is time to get the address of the erc20 token which is 
		//on sale on the ICO contract.
		icoInstance.getTokenAddress((error, addressOfToken)=>{
			if(!error) {
				//If the getTokenAddress() function of the ICO smart contract does not 
				//return "0x", then it must be the case that the user has provided an
				//ETH address which does belong to an ICO contract deployed from the 
				//Contract Factory. 
				if(addressOfToken!="0x") {
					//Display the contract address of the erc20 token on sale.
					$("#token-address-ico-interact").html(addressOfToken);
					getTokenInfoFromAddress(addressOfToken);
					//Decimals needs to be queried to mitigate bug caused 
					//by async functions. 
					erc20Instance.decimals((error, decs)=>{
						if(!error) {
							erc20Decimals = decs;
							getAndDisplayStateOfICO();
						}
					});
					//Display the data associated with the ICO to the user on the UI. 
					$("#invalid-ico-address").hide();
					$("#info-container-ico-interact").show();
					$("#data-of-ico").show();
				} else {
					//If the getTokenAddress() function of the ICO smart contract 
					//returns "0x", then it must be the case that the user has 
					//provided an address which does not belong to an ICO contract
					//deployed by the Contract Factory because when a user deploys 
					//an ICO contract, the user has to provide the address of the token.
					//In such a case, set the contract instances to be undefined and 
					//inform the user that the wrong address has been provided. 
					icoAddress = undefined;
					icoInstance = undefined;
					$("#info-container-ico-interact").hide();
					$("#data-of-ico").show();
					$("#invalid-ico-address").show();
				}
			} else {
				console.error(error);
			}
		});
	}
}


/**
* Every 2000ms invoke the getAndDisplayStateOfICO() function if the ICO interactor screen 
* is currently visible. This interval function is made to dispaly changes to the state of 
* the ICO contract and the user's token balance in real time on the UI.
**/
setInterval(function() {
	if($("#interact-ico-display").is(":visible")) {
		getAndDisplayStateOfICO();
	}
}, 2000);


/**
* Invokes the getDeadline() function (which goes on to invoke all other functions for 
* displaying the state of the ICO contract on the UI) if the icoInstance variable is 
* not undefined. 
**/
function getAndDisplayStateOfICO() {
	if(icoInstance != undefined) {
		getDeadline();
	} 
}


/**
* Gets and displays the deadline of the ICO in GMT using UNIX timestamps from the 
* ICO smart contract.
**/
function getDeadline() {
	icoInstance.deadline((error, deadline)=>{
		if(!error){
			icoDeadline = deadline;
			var date = new Date();
			date.setTime(icoDeadline * 1000);
			stringOfDate = date.toUTCString();
			//Display the deadline on the UI. 
			$("#ico-end-time").html("DEADLINE: " + stringOfDate);
			getTokensSold();
		} else {
			console.error(error);
		}
	});
}


/**
* Gets and displays the total amount of tokens sold on the ICO contract. 
**/
function getTokensSold() {
	icoInstance.getTotalTokensSold((error, tokensSold)=>{
		if(!error){
			//Display the total amount of tokens sold on the UI. 
			$("#tokens-sold-ico-interact").html("TOKENS SOLD: " + numberWithCommas(Number(tokensSold.div(10**erc20Decimals).toFixed(3))));
			getEthRaised();
		} else {
			console.error(error);
		}
	});
}


/**
* Gets and displays the total amount of ETH raised and compares it to the 
* ETH soft cap of the ICO smart contract.
**/
function getEthRaised() {
	//First get the soft cap of the ICO contract.
	icoInstance.ethSoftCap((error, softCap)=>{
		if(!error) {
			//Next get the total amount of ETH raised.
			icoInstance.getEthRaised((error, ethRaised)=>{
				if(!error) {
					icoContractEthRaised = ethRaised;
					//Display the data on the UI in the form of: <ETH RAISED> / <SOFT CAP>
					$("#eth-funded-ico-interact").html("FUNDED: " 
						+  numberWithCommas(Number((ethRaised/(10**18)).toFixed(3)))
						+ " / " + numberWithCommas(Number((softCap/(10**18)).toFixed(3)))
						+ " ETH (SOFT CAP)");
					getIcoEthBalance();
				} else {
					console.error(error);
				}
			}); 
		} else {
			console.error(error);
		}
	})
}


/**
* Gets and displays the current ETH balance of the ICO smart contract.
**/
function getIcoEthBalance() {
	web3.eth.getBalance(icoAddress,(error, balance)=>{
		if(!error) {
			icoContractEthBalance = balance;
			//Display the ETH balance on the UI.
			$("#eth-balance-ico-interact").html("BALANCE: " + numberWithCommas(Number(balance.div(10**18).toFixed(3)))
				+ " ETH");
			getRate();
		} else {
			console.error(error);
		}
	});
}



/**
* Gets the ETH exchange rate at which the token on sale on the ICO contract is being sold for.
**/
function getRate() {
	icoInstance.rate((error,rate)=>{
		if(!error) {
			//Update the exchange rate
			icoContractRate = rate;
			//Display the exchange rate on the UI. 
			$("#eth-exchange-rate-ico-interact").html("ETH EXCHANGE RATE: " + numberWithCommas(rate));
			dispalyTokenBalanceOfICOContract();
		} else {
			console.error(error);
		}
	});
}


/**
* Gets and displays the total amount of tokens (i.e., the token on sale) which remain on the ICO smart 
* contract address. These are the tokens on sale and tokens can be deposited or withdrawn anytime by 
* the owner of the ICO contract. 
**/
function dispalyTokenBalanceOfICOContract() {
	//First check that the erc20 token contract instance is defined. 
	if(erc20Instance != undefined) {
		//If it is defined, then query the token balance of the ICO contract by invoking the balanceOf()
		//function of the erc20Instance contract. 
		icoAddress = $("#ico-address-input-interact").val();
		erc20Instance.balanceOf(icoAddress, (error, icoBalance)=>{
			if(!error) {
				icoTokenBalance = icoBalance;
				//Display the remaining tokens on the UI. 
				$("#token-balance-of-ico-interact").html("TOKENS REMAINING: " + numberWithCommas(Number(icoBalance.div(10**erc20Decimals).toFixed(3))));
			} else {
				console.error(error);
			}
		})
	}
}


/**
* Allows for the deposit of the token on sale to be made on the ICO smart contract. This function simply
* just invokes the transfer() function of the erc20Instance and just transfers tokens from the user's 
* MetaMask wallet to the ICO contract address.
**/
function icoDepositTokens() {
	//First check that the erc20Instance is defined. 
	if(erc20InstanceDefined()) {
		//Next check that the total amount of tokens to deposit provided by the user input is of the 
		//form of a positive number.
		var tokensToDeposit = $("#value-of-ico-deposit").val();
		if(isPositiveNumber("#value-of-ico-deposit")) {
			tokensToDeposit = tokensToDeposit * (10**erc20Decimals);
		} else {
			alert("PLEASE ENTER THE TOTAL AMOUNT OF TOKENS YOU WANT TO DEPOSIT ON THE ICO CONTRACT");
			return;
		}
		//Now check that the user has a suficcient balance of tokens in his or her MetaMask wallet
		//to make the deposit. 
		if(tokensToDeposit > erc20Balance) {
			alert("YOU DO NOT HAVE ENOUGH TOKENS IN YOUR WALLET FOR THIS DEPOSIT");
			return;
		}
		//If the above conditions are met, then invoke the transfer function of the erc20Instance
		//and transfer the specified amount of tokens from the user's MetaMask wallet to the ICO 
		//smart contract address. 
		erc20Instance.transfer(icoAddress, tokensToDeposit, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
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
* Allows the owner of the ICO smart contract to withdraw tokens from the ICO contract. 
**/
function icoWithdrawTokens() {
	//First check that the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the ICO contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		icoInstance.getOwner((error, owner)=>{
			if(!error) {
				//If the owner address of the ICO smart contract is NOT the same as the user's address,
				//then alert the user and exit from the function.
				if(owner != web3.eth.accounts[0]){
					alert("ONLY THE OWNER IS ALLOWED TO WITHDRAW TOKENS FROM THE ICO CONTRACT");
					return;
				} else {
					//If the owner address of the ICO smart contract IS the same as the user's address,
					//then proceed to check the total amount of tokens the user wants to withdraw. If the
					//input is of the format of a positive number, then multiply the value by (10**erc20Decimals)
					//to ensure the correct amount of tokens are withdrawn (without the user having to add a 
					//whole bunch of zeros at the end of the value).
					var tokensToWithdraw = $("#value-of-ico-withdrawal").val();
					if(isPositiveNumber("#value-of-ico-withdrawal")) {
						tokensToWithdraw = tokensToWithdraw*(10**erc20Decimals);
					} else {
						alert("PLEASE ENTER THE TOTAL AMOUNT OF TOKENS YOU WANT TO WITHDRAW FROM THE ICO CONTRACT");
						return;
					}
					//Now check that the ICO has enough tokens for the withdrawal. 
					if(tokensToWithdraw > icoTokenBalance) {
						alert("THE ICO CONTRACT CONTAINS " 
							+ (icoTokenBalance/(10**erc20Decimals))
							+ " TOKENS, YET YOU HAVE ATTEMPTED TO WITHDAW " 
							+ (tokensToWithdraw/(10**erc20Decimals)));
						return;
					}
					//At this point check if the address of recipient has the correct format of an ETH address.
					var recipientOfWithdrawal = $("#recipient-of-ico-withdrawal").val();
					if(!isValidAddr("#recipient-of-ico-withdrawal")) {
						alert("THE RECIPIENT ADDRESS HAS AN INVALID FORMAT");
						return;
					}
					//Invoke the withdrawTokens() function of the ICO smart contract with the parameters 
					//provided by the user. 
					icoInstance.withdrawTokens(recipientOfWithdrawal, tokensToWithdraw, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error, result)=>{
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
* Allows the owner of the ICO smart contract to withdraw ETH only if the soft cap has been 
* reached before the deadline. 
**/
function withdrawETH() {
	//First check that the erc20Instance is defined. 
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the ICO contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		icoInstance.getOwner((error, owner)=>{
			if(!error) {
				//If the owner address of the ICO smart contract is NOT the same as the user's address,
				//then alert the user and exit from the function.
				if(owner != web3.eth.accounts[0]) {
					alert("ONLY THE OWNER IS ALLOWED TO WITHDRAW ETH FROM THE ICO CONTRACT");
					return;
				} else {
					//If the owner address of the ICO smart contract IS the same as the user's address,
					//then check if the soft cap has been reached.
					icoInstance.softCapReached((error, softCapReached)=>{
						if(!softCapReached) {
							//If the soft cap has not been reached then alert the user and exit the funciton. 
							alert("ETH WITHDRAWALS ARE NOT ALLOWED UNTIL THE SOFT CAP HAS BEEN REACHED").
							return;
						} else {
							//If the soft cap has been reached, then proceed to withdraw all the ETH in the 
							//ICO contract to the owner's MetaMask wallet address.
							icoInstance.withdrawEth({from: web3.eth.accounts[0], gasPrice: 5e10},(error, result)=>{
								if(!error) {
									$("#tx-msg").html("Check the status of your ETH withdrawal ");
									$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
									$("#txModal").modal('show');
								} else {
									console.error(error);
								}
							});
						}
					})
				}
			} else {
				console.error(error);
			}
		});
	}
}


/**
* Allows the owner of the smart contract to change the ETH exchange rate at which the token is being sold. 
**/
function changeRate(){
	//First check that the erc20Instance is defined.
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the ICO contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		icoInstance.getOwner((error, owner)=>{
			if(!error) {
				//If the owner address of the ICO smart contract is NOT the same as the user's address,
				//then alert the user and exit from the function.
				if(owner != web3.eth.accounts[0]) {
					alert("ONLY THE OWNER OF THE ICO CONTRACT IS ALLOWED TO CHANGE THE EXCHANGE RATE");
					return;
				} else {
					//If the owner address of the ICO smart contract IS the same as the user's address,
					//then proceed to change the exchange rate at which the token is being sold, if of 
					//course the user has provided a positive number for the new exchange rate. 
					if(isPositiveNumber("#value-of-new-rate-ico")) {
						var newRate = $("#value-of-new-rate-ico").val();
						icoInstance.changeRate(newRate,{from: web3.eth.accounts[0], gasPrice: 5e10},(error,result)=>{
							if(!error) {
								$("#tx-msg").html("Check the status of your rate change ");
								$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
								$("#txModal").modal('show');
							} else {
								console.error(error);
							}
						});
					} else {
						alert("PLEASE ENTER THE TOTAL AMOUNT OF TOKENS YOU WANT TO DEPOSIT ON THE ICO CONTRACT");
						return;
					}
				}
			} else {
				console.error(error);
			}
		})
	}
}


/**
* Allows the owner of the ICO smart contract to shorten the deadline of the token sale. 
**/
function shortenDeadline() {
	//First check that the erc20Instance is defined. 
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the ICO contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		icoInstance.getOwner((error, owner)=>{
			if(!error) {
				//If the owner address of the ICO smart contract is NOT the same as the user's address,
				//then alert the user and exit from the function.
				if(owner != web3.eth.accounts[0]) {
					alert("ONLY THE OWNER OF THE ICO CONTRACT IS ALLOWED TO SHORTEN THE DEADLINE");
					return;
				} else {
					//If the owner address of the ICO smart contract IS the same as the user's address,
					//then proceed to shortening the deadline of the token sale if of course the user
					//has provided a positive number representing the total amount of days the ICO 
					//should end in starting from the moment of invocation.
					if(isPositiveInteger("#new-deadline-ico")) {
						var newDeadline = $("#new-deadline-ico").val();
						icoInstance.shortenDeadline(newDeadline, {from: web3.eth.accounts[0], gasPrice: 5e10}, (error,result)=>{
							if(!error) {
								$("#tx-msg").html("Check the status of your ");
								$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
								$("#txModal").modal('show');
							} else {
								console.error(error);
							}
						});
					} else {
						alert("PLEASE PROVIDE THE NEW DEADLINE IN DAYS FROM NOW IN THE FORM OF A POSITIVE INTEGER");
					}
				}
			} else {
				console.error(error);
			}
		});
	}
}


/**
* Allows those who have invested ETH during the ICO to claim a refund from the smart contract if the 
* ICO failed to reach the required soft cap prior to the deadline of the token sale, or if the owner
* of the ICO decided to cancel the token sale. 
**/
function getRefund() {
	//First check that the erc20Instance is defined. 
	if(erc20InstanceDefined()) {
		//Now check to see whether or not the ICO has ended. The condition will be true if a) the 
		//deadline has passed and the soft cap has not been reached, or b) the owner of the ICO 
		//canceled the token sale. 
		icoInstance.icoHasEnded((error,icoHasEnded)=>{
			//If the ICO has NOT ended then inform the user and exit from the function. 
			if(!icoHasEnded) {
				alert("REFUNDS CANNOT BE CLAIMED UNLESS THE ICO HAS BEEN CANCELLED " +
					"OR IF THE DEADLINE HAS PASSED AND THE SOFT CAP HAS NOT BEEN REACHED"
				)
				return;
			} else {
				//If the ICO HAS ended, then check to see if the user has invested ETH on the ICO 
				//smart contract.
				icoInstance.investments(web3.eth.accounts[0],(error,investment)=>{
					if(!error) {
						//If the returned query shows that the investment IS greater than 0, this 
						//means that the user's investment is still on the ICO smart contract. 
						if(investment > 0) {
							//Proceed to giving the user a full refund.
							icoInstance.claimRefund({from: web3.eth.accounts[0], gasPrice: 5e10},(error, result)=>{
								if(!error) {
									$("#tx-msg").html("Check the status of your refund ");
									$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
									$("#txModal").modal('show');
								} else {
									console.error(error);
								}
							})
						} else {
							//If the query shows that the investment is NOT greater than 0, then this
							//means that the user never invested anything to the ICO contract, or that 
							//the user did and already has claimed a refund. In either case the user will 
							//be alerted and nothing will happen. 
							alert("YOU HAVE NO ETH IN THE CONTRACT. " +
								"EITHER YOU INVESTED FROM A DIFFERENT ACCOUNT, " +
								"OR YOU ALREADY CLAIMED A REFUND."
							);
						}
					} else {
						console.error(error);
					}
				})
			}
		});
	}
}


/**
* Allows the owner of the ICO smart contract to cancel the token sale. 
**/
function cancelICO() {
	//First check that the erc20Instance is defined (if it is not then neither will the icoInstance be).
	if(erc20InstanceDefined()) {
		//Now we need to check who is the owner of the ICO contract by invoking the getOwner() function.
		//The details of this funciton can be found in the Owned.sol smart contract code.  
		icoInstance.getOwner((error,owner)=>{
			//If the owner address of the ICO smart contract is NOT the same as the user's address,
			//then alert the user and exit from the function.
			if(owner != web3.eth.accounts[0]) {
				alert("ONLY THE OWNER OF THE ICO CONTRACT IS ALLOWED TO CANCEL THE ICO");
				return;
			} else {
				//If the owner address of the ICO smart contract IS the same as the user's address,
				//then proceed to cancelling the token sale. 
				icoInstance.cancelICO({from: web3.eth.accounts[0], gasPrice: 5e10},(error,result)=>{
					if(!error) {
						$("#tx-msg").html("Check the status of your ICO cancellation ");
						$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
						$("#txModal").modal('show');
					} else {
						console.error(error);
					}
				});
			}
		});
	}
}


/**
* Allows investors to buy tokens directly from the web application at the click of a button. Alternatively 
* investors could just send ETH to the ICO smart contract address and automatically receive tokens in return. 
**/
function buyTokens() {
	//First check that the erc20Instance is defined (if it is not then neither will the icoInstance be).
	if(erc20InstanceDefined()) {
		//Now check if the ICO is still active. 
		icoInstance.icoHasEnded((error, hasEnded)=>{
			if(hasEnded) {
				//If the ICO has ended then alert the user and exit the function. 
				alert("THE TOKEN SALE IS NO LONGER ACTIVE");
				return;
			} else {
				//Now check the user's ETH balance from the MetaMask wallet browser extension. This is done to determine 
				//if the user has a sufficient balance to buy the tokens (because the users will specify how much ETH they
				//want to send). 
				web3.eth.getBalance(web3.eth.accounts[0],(error, userBalance)=>{
					if(!error) {
						//Now check the total amount of ETH the user wants to send to the ICO smart contract. Also check 
						//to see if it is a positive number that is provided. 
						var ethValue = $("#eth-value-of-purchase-ico").val();
						if(isPositiveNumber("#eth-value-of-purchase-ico")) {
							//Multiply the user's input value by (10**18) because ETH has 18 decimals (i.e., 1 ETH = 1e18)
							ethValue = ethValue * (10**18);
							//Now check to see if the user's ETH balance on the MetaMask wallet browser extension has 
							//enough ETH for the token purchase. If not, then alert the user and exit the function. 
							if(userBalance < ethValue) {
								alert("YOU HAVE AN INSUFFICIENT BALANCE. PLEASE LOWER THE AMOUNT OF ETH YOU WANT TO "
									+ "SEND OR DEPOSIT MORE ETH INTO YOUR ACCOUNT");
								return;
							} else {
								//If the user does have enough ETH for the token purchase, then proceed to send the 
								//ETH to the ICO smart contract address. This will result in the tokens being automatically
								//sent to the user's wallet.
								web3.eth.sendTransaction({to:icoAddress, from: web3.eth.accounts[0], value:ethValue, gasPrice: 5e10, gas:200000}, ((error,result)=>{
									if(!error) {
										$("#tx-msg").html("Check the status of your token purchase ");
										$("a.tx-link").attr("href", "https://ropsten.etherscan.io/tx/"+result);
										$("#txModal").modal('show');
									} else {
										console.error(error);
									}
								}));
							}
						} else {
							alert("PLEASE ENTER THE TOTAL AMOUNT OF ETH YOU WANT TO SEND TO THE ICO CONTRACT");
							return;
						}
					} else {
						console.error(error);
					}
				});
			}
		})
	}
}




/**
* This function is invoked every time the user provides input to the "ETH TO SEND TO ICO" input field in the 
* "BUY TOKENS" collapsable field and automatically calculates and displays the total amount of tokens the users  
* will receive if they send the specified amount of ETH to the ICO smart contract. For example, if the ETH 
* exchange rate that the token is being sold for is 1 ETH = 10,000 tokens, then if the user inputs 0.5 then the 
* user will be displayed with 5,000.
**/
function ethToTokensConverter() {
    var ethValue = $("#eth-value-of-purchase-ico").val();
    if(ethValue == "") {
        $('#tokens-owed-purchase-ico').val("");
    } else {
        $('#tokens-owed-purchase-ico').val(ethValue * icoContractRate);
    }
}


/**
* This function is invoked every time the user provides input to the "TOKENS YOU WILL RECEIVE" input field in the
* "BUY TOKENS" collapsable field and automatically calculates and displays the total amount of ETH the user will 
* need to send to the ICO smart contract. For example, if the ETH exchange rate that the token is being sold for is 
* 1 ETH = 10,000 tokens, then if the user inputs 5,000 then the user will be displayed with 0.5 ETH as the price. 
**/
function tokensToEthConverter() {
	var tokensOwed = $("#tokens-owed-purchase-ico").val();
    if(tokensOwed == "") {
        $('#eth-value-of-purchase-ico').val("");
    } else {
        $('#eth-value-of-purchase-ico').val(tokensOwed / icoContractRate);
    }
}