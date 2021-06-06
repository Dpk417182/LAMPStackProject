var urlBase = 'http://cop4331-fourteen.live/LAMPAPI';
var extension = '.php';

var userId = 0;
var firstName = "";
var lastName = "";
var arrHead = new Array();	// array for header.
arrHead = ['Firstname', 'Lastname', 'Phone Number', ''];
    


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "./main.html";

				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function goToLogin()
{
	window.location.href = "./index.html";
}

function goToRegisterPage()
{
	window.location.href = "./register.html";

}

function doRegister(e)
{
	e.preventDefault();
	var fName = document.getElementById("registerFirstName").value;
	var lName = document.getElementById("registerLastName").value;
	var userName = document.getElementById("registerUserName").value
	var password = document.getElementById("registerPassword").value;
	var retypePassword = document.getElementById("registerRetypePassword").value;
	var retypePasswordVal = document.getElementById("registerRetypePassword");
	var userNameVal = document.getElementById("registerUserName");

	if(password != retypePassword){
		retypePasswordVal.setCustomValidity("Passwords don't match");
		return;
	}
	else {
		retypePasswordVal.setCustomValidity('');
	}


	document.getElementById("loginResult").innerHTML = "";
	var hash = md5( password );
	var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : "'+ lName + '", "userName" : "' + userName + '", "password" : "' + hash + '", "retypePassword" : "' + retypePassword + '"}';
	var url = urlBase + '/Register' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // Opens up connection

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8") // Sets type of content to be sent.
	try
	{
		xhr.onreadystatechange = function()
		{
			// readyState: 4 = request finished & response ready
			// status: 4 = "OK"
			
			if(this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );
				errid = jsonObject.errid;
				console.log(errid);
				if(errid == "1" )
				{	
					goToLogin();
				}
				else{
					userNameVal.setCustomValidity("Username already exists");
					document.getElementById("loginResult").innerHTML = "Username already exists";
				}

				document.getElementById("registerPassword").value="";
				document.getElementById("registerRetypePassword").value="";	
							
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}		
}

function createTable()
{
	var empTable = document.createElement('table'); // create table
	empTable.setAttribute('id', 'empTable'); // table id.

	var tr = empTable.insertRow(-1);
	for (var h = 0; h < arrHead.length; h++) 
	{
		var th = document.createElement('th'); // create table headers
		th.innerHTML = arrHead[h];
		tr.appendChild(th); // append table headers to the table rows.
	}
	var div = document.getElementById('cont'); // Gets the container from html
	div.appendChild(empTable);  // adds the TABLE to the container.
}

function addRow()
{
	var empTab = document.getElementById('empTable');
	var rowCnt = empTab.rows.length;   // table row count.
	var tr = empTab.insertRow(rowCnt); // the table row.
	tr = empTab.insertRow(rowCnt);
	
	for (var c = 0; c < arrHead.length; c++) {
		var td = document.createElement('td'); // table definition.
		td = tr.insertCell(c);

		if (c == 3) {      // the last column.
			// add a button in every new row at the last column.
			var button = document.createElement('input');

			// set input attributes.
			button.setAttribute('type', 'button');
			button.setAttribute('value', 'Remove');

			// add button's 'onclick' event.
			button.setAttribute('onclick', 'removeRow(this)');

			td.appendChild(button);
		}
		else {
			// 2nd, 3rd and 4th column, will have textbox.
			var ele = document.createElement('input');
			ele.setAttribute('type', 'text2');
			ele.setAttribute('value', '');

			td.appendChild(ele);
		}
	}	
}

// delete TABLE row function.
function removeRow(oButton) 
{
	var empTab = document.getElementById('empTable');
	empTab.deleteRow(oButton.parentNode.parentNode.rowIndex); // button -> td -> tr.
}

 // function to extract and submit table data.
 function submit() 
 {
	var nextLine = "";
	var myTab = document.getElementById('empTable');
	var arrValues = new Array();

	// loop through each row of the table.
	for (row = 1; row < myTab.rows.length - 1; row++) {
		// loop through each cell in a row.
		for (c = 0; c < myTab.rows[row].cells.length; c++) {  
			var element = myTab.rows.item(row).cells[c];
			if (element.childNodes[0].getAttribute('type') == 'text2') {
				arrValues.push("'" + element.childNodes[0].value + "'");
				nextLine = " /n";

			}

			
		}
	}
	
	// The final output.
	// document.getElementById('loginResult').innerHTML = arrValues;
	console.log (arrValues);

}
function doSearch()
{
	//event.preventDefault();


	var srchText = document.getElementById('searchBar').value; // Value of item typed in the search bar gotten
	document.getElementById("searchResult").innerHTML = ""	// Gets the status of the search 

	//'<tr><th class="tl column tableheader tlfname">First Name</th><th class="tl column tableheader tllname">Last Name</th><th class="tl column tableheader phone">Phone Number</th></tr>';

	var jsonPayload = '{"search" : "' + srchText + '", "userId" : "' + userId + '" }'; 
	var url = urlBase + '/Search.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("searchResult").innerHTML = "Retrieved contact(s)";
				//var id = jsonObject.results;
				var id = jsonObject.error; // Verify with "returnwithError" function in search.php

				// console.log(id);

				// var searchList = "";

				var table = document.getElementById("searchResultsTable");
				table.remove();

				var a = 0, b = 1; c = 0;

				var myTable = document.createElement("TABLE");
				newTable.setAttribute("id", "searchResultsTable");
				document.body.appendChild(myTable);


				document.getElementById("searchResults").innerHTML = "";
				var row = myTable.insertRow(0);
				var FirstName = row.insertCell(0);
				var LastName = row.insertCell(1);
				var PhoneNumber = row.insertCell(2);
				var Edit = row.insertCell(3);
				var Delete = row.insertCell(4);

				var butn;
				var conId = '';
				var numRow = '';

				FirstName.innerHTML = "FirstName";
				LastName.innerHTML = "LastName";
				PhoneNumber.innerHTML = "PhoneNumber";
				Edit.innerHTML = "Edit";
				Delete.innerHTML = "Delete";


				for( var i = 0; i < jsonObject.results.length; i++ )
				{
					searchResultsTable += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					
					{
						row = myTable.insertRow(b);
						while(jsonObject.results.charAt(a) != ',')
							a++
						conId = jsonObject.results.substr(c, a - c);
						a++
						c = a;

						row.setAttribute("id", "Row" + b);
						row.setAttribute("title" + conId);

						FirstName = row.insertCell(0);
						FirstName.setAttribute("id", "FirstName" + b);

						LastName = row.insertCell(1);
						LastName.setAttribute("id", "LastName" + b);


						PhoneNumber = row.insertCell(2);
						PhoneNumber.setAttribute("id", "PhoneNumber" + b);

						Edit = row.insertCell(3);
						Edit.setAttribute("id", "Edit" + b);

						Delete = row.insertCell(4);
						Delete.setAttribute("id", "Delete" + b);


						butn = document.createElement("BUTTON");
						butn.innerHTML = "Edit";
						butn.onclick = function() {};
						Edit.appendChild(butn);

						butn = document.createElement("BUTTON");
						butn.innerHTML = "Delete";
						butn.id = b;
						var name = "Row" + b;
						var R = toString(r);
						butn.onclick = function() {doDelete(this.title, this.id)};
						Edit.appendChild(butn);		
						
						
						FirstName.innerHTML = b;
						while(jsonObject.results.charAt(a) != ',')
						{
							a++;
						}
						LastName.innerHTML = jsonObject.results.substr(c, a - c);
						a++;
						c = a;
	
						while(jsonObject.results.charAt(a) != ',')
						{
							a++;
						}
						PhoneNumber.innerHTML = jsonObject.results.substr(c, a - c);
						a++;
						c = a;
						b++;								
					}
				}
			//	document.getElementsById("searchBar").innerHTML;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}

function doRead()
{
	
	var jsonPayload = '{"userId" : "' + userId + '" }'; 
	var url = urlBase + '/Read.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				//var id = jsonObject.results;
				//var id = jsonObject.error; // Verify with "returnwithError" function in search.php

				var table = document.getElementById("searchResultsTable");
				table.remove();

				var a = 0, b = 1; c = 0;

				var myTable = document.createElement("TABLE");
				newTable.setAttribute("id", "searchResultsTable");
				document.body.appendChild(myTable);


				document.getElementById("searchResults").innerHTML = "";
				var row = myTable.insertRow(0);
				var FirstName = row.insertCell(0);
				var LastName = row.insertCell(1);
				var PhoneNumber = row.insertCell(2);
				var Edit = row.insertCell(3);
				var Delete = row.insertCell(4);

				var butn;
				var conId = '';
				var numRow = '';

				FirstName.innerHTML = "FirstName";
				LastName.innerHTML = "LastName";
				PhoneNumber.innerHTML = "PhoneNumber";
				Edit.innerHTML = "Edit";
				Delete.innerHTML = "Delete";


				for( var i = 0; i < jsonObject.results.length; i++ )
				{
					searchResultsTable += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					
					{
						row = myTable.insertRow(b);
						while(jsonObject.results.charAt(a) != ',')
							a++
						conId = jsonObject.results.substr(c, a - c);
						a++
						c = a;

						row.setAttribute("id", "Row" + b);
						row.setAttribute("title" + conId);

						FirstName = row.insertCell(0);
						FirstName.setAttribute("id", "FirstName" + b);

						LastName = row.insertCell(1);
						LastName.setAttribute("id", "LastName" + b);


						PhoneNumber = row.insertCell(2);
						PhoneNumber.setAttribute("id", "PhoneNumber" + b);

						Edit = row.insertCell(3);
						Edit.setAttribute("id", "Edit" + b);

						Delete = row.insertCell(4);
						Delete.setAttribute("id", "Delete" + b);


						butn = document.createElement("BUTTON");
						butn.innerHTML = "Edit";
						butn.onclick = function() {};
						Edit.appendChild(butn);

						butn = document.createElement("BUTTON");
						butn.innerHTML = "Delete";
						butn.id = b;
						var name = "Row" + b;
						var R = toString(r);
						butn.onclick = function() {doDelete(this.title, this.id)};
						Edit.appendChild(butn);		
						
						
						FirstName.innerHTML = b;
						while(jsonObject.results.charAt(a) != ',')
						{
							a++;
						}
						LastName.innerHTML = jsonObject.results.substr(c, a - c);
						a++;
						c = a;
	
						while(jsonObject.results.charAt(a) != ',')
						{
							a++;
						}
						PhoneNumber.innerHTML = jsonObject.results.substr(c, a - c);
						a++;
						c = a;
						b++;								
					}
				}
				//document.getElementsById("loginResult").innerHTML;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}
function doDelete()
{
	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "PhoneNumber" : "' + phoneNumber + '"}';
	var url = urlBase + '/Delete.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{	document.getElementById("FirstName" + no).innerHTML = this.readyState + ", " + this.status;		
			if (this.readyState == 4 && this.status == 200) 
			{				
				var jsonObject = JSON.parse( xhr.responseText );

				document.getElementById("FirstName").innerHTML = "Deleted";
				document.getElementById("LastNAme").innerHTML = "Deleted";
				document.getElementById("PhoneNumber").innerHTML = "Deleted";
				document.getElementById("Edit").innerHTML = "Deleted";
				document.getElementById("Delete").innerHTML = "Deleted";
			}
		};
		xhr.send(jsonPayload);
	}catch(err)
	{
		document.getElementById("Name" + no).innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		goToLogin();
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	// userId = 0;
	// firstName = "";
	// lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	goToLogin();
}

