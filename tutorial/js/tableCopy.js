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
