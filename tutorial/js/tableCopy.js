// var copyBtn1 = document.querySelector('#copy_200_addrs');
// copyBtn1.addEventListener('click', function () {
//   var urlField1 = document.querySelectorAll('table')[0];
   
//   // create a Range object
//   var range1 = document.createRange();  
//   console.log(range1)
//   // set the Node to select the "range"
//   range1.selectNode(urlField1);
//   // add the Range to the set of window selections
//   window.getSelection().addRange(range1);
   
//   // execute 'copy', can't 'cut' in this case
//   document.execCommand('copy');
// }, false);


// var copyBtn2 = document.querySelector('#copy_200_vals');
// copyBtn2.addEventListener('click', function () {
//   var urlField2 = document.querySelectorAll('table')[1];
   
//   // create a Range object
//   var range2 = document.createRange();  
//   console.log(range2)
//   // set the Node to select the "range"
//   range2.selectNode(urlField2);
//   // add the Range to the set of window selections
//   window.getSelection().addRange(range2);
   
//   // execute 'copy', can't 'cut' in this case
//   document.execCommand('copy');
// }, false);


function copyTableData(index) {
	if (window.getSelection) {
	   if (window.getSelection().empty) {  // Chrome
	     window.getSelection().empty();
	   } else if (window.getSelection().removeAllRanges) {  // Firefox
	     window.getSelection().removeAllRanges();
	   }
	} else if (document.selection) {  // IE?
	  document.selection.empty();
	}
	var urlField2 = document.querySelectorAll('table')[index];
	var range2 = document.createRange(); 
	range2.selectNode(urlField2);
	window.getSelection().addRange(range2);
	document.execCommand('copy');
}