var Web3 = require('web3');

/**
* Checks if web3 has been injected into the browser. If not, the user 
* will be promted to install the MetaMask browser extension. 
**/
function web3IsInjected() {
    if (typeof web3 != 'undefined') {
        web3 = new Web3(web3.currentProvider);
        return true;
    } else {
        alert("PLEASE INSTALL METAMASK");
        return false;
    }
}


/**
* Checks to see if the user is connected to the Ropsten test network.
* Since the smart contracts only exist on the Ropsten network, it is 
* necessary to be connected to this network. 
**/
function checkNetwork() {
    web3.version.getNetwork((err, netId) => {
        if(netId != "3") {
            alert("PLEASE CONNECT TO THE ROPSTEN NETWORK ON METAMASK");
        }
    })
}


/**
* Checks if the MetaMask wallet extension is locked or not. 
**/
function metamaskIsLocked() {
    return web3.eth.accounts.length == 0;
}


//If the user has MetaMask installed, check if it is locked. 
if(web3IsInjected()) {
    if(metamaskIsLocked()) {
        alert("UNLOCK YOUR METAMASK");
    }
	checkNetwork();
}