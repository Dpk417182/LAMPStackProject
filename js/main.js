var urlBase = 'http://cop4331-fourteen.live/LAMPAPI';
var extension = '.php';

var userId = 0;
var firstName = "";
var lastName = "";
var tempFirst = "";
var tempLast = "";
var tempPhone = "";
var canEdit = true;


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
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

function doRegister()
{
	// e.preventDefault();
	// alert("I am here");
	var fName;
	var fNameVal;
	var lName;
	var userName;
	var password;
	var retypePassword;
	var retypePasswordVal;
	var userNameVal;

	fName = document.getElementById("registerFirstName").value;
	fNameVal = document.getElementById("registerFirstName");
	lName = document.getElementById("registerLastName").value;
	userName = document.getElementById("registerUserName").value;
	password = document.getElementById("registerPassword").value;
	retypePassword = document.getElementById("registerRetypePassword").value;
	retypePasswordVal = document.getElementById("registerRetypePassword");
	userNameVal = document.getElementById("registerUserName");
	
	// alert(password + " = " + retypePassword);
	if(password != retypePassword){
		// alert("I am in false passwords");
		// alert(password + " = " + retypePassword);
		// retypePasswordVal.setCustomValidity("Passwords don't match");
		// document.getElementById("registerPassword").value = "";
		// document.getElementById("registerRetypePassword").value = "";
		// password = retypePassword = null;
		// goToRegisterPage();
		document.getElementById("loginResult").innerHTML = "Passwords do not match";
		document.getElementById("registerDiv").reset();
		document.getElementById("registerFirstName").value = fName;
		document.getElementById("registerLastName").value = lName;
		document.getElementById("registerUserName").value = userName;
		// retypePasswordVal.setCustomValidity('');

		return;
	}
	else {
		// retypePasswordVal.setCustomValidity('');
	}

	// alert("I am there");
	// goToLogin();
	// alert("I am there");
	// document.getElementById("loginResult").innerHTML = "";
	// alert("I am in there2");
	var hash = md5( password );
	// alert("I am everywhere");
	var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : "'+ lName + '", "userName" : "' + userName + '", "password" : "' + hash + '"}';
	// alert(jsonPayload);
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
				var errid = jsonObject.errid;
				// console.log(errid);
				// alert(jsonObject);
				if(errid == "1" )
				{	
					goToLogin();
				}
				else{
					// userNameVal.setCustomValidity("Username already exists");
					document.getElementById("loginResult").innerHTML = "Username already exists";
					document.getElementById("registerDiv").reset();
					document.getElementById("registerFirstName").value = fName;
					document.getElementById("registerLastName").value = lName;
					document.getElementById("registerUserName").value = "";
					// userNameVal.setCustomValidity('');
				}

				
							
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}		
}

$("#registerDiv").submit(function () {
	// alert("I am in submit");
	doRegister();
	// alert("I am in submit 2");
	return false;
   });

$('#registerPassword, #registerRetypePassword').on('keyup', function () {
	if ($('#registerPassword').val() == $('#registerRetypePassword').val()) {
	  $('#message').html('Password matches').css('color', 'green');
	} else 
	  $('#message').html('Password doesn\'t match').css('color', 'red');
  });
  
function createButton(id, type){
	// <input type="button" id="loginButton" class="buttons" value = "Return to Login" onclick="goToLogin();"> 
	let input = document.createElement("input");
	// input.id = id;
	input.value = type;
	input.className = "invertedMiniButtons";
	input.type = "button";
	if(type == "editButton"){
		input.onclick = function() {doEdit(id)};
		input.value = "edit";
	}
	else if(type == "delete"){
		input.onclick = function() {doDelete(id)};
	}
	else if(type == "add"){
		input.onclick = function() {addContactSubmit()};
	}
	else if(type == "edit"){
		input.onclick = function() {editContactSubmit(id)};
	}
	return input;
}

function createTextButton(id, placeholder, bool){
	bool = bool ?? true;
	let input = document.createElement("input");
	input.id = id;
	// alert("Bool: " + bool);
	if(bool)
		input.placeholder = placeholder;
	else
		input.value = placeholder;
	input.type = "text";
	return input;
}

function addContact(id, bool, firstName, lastName, phoneNumber){
	id = id ?? 0;
	bool = bool ?? true;
	firstName = firstName ?? "First Name";
	lastName = lastName ?? "Last Name";
	phoneNumber = phoneNumber ?? "Phone Number";
	var table = document.getElementById("searchResultsTable");
	table.deleteRow(id);
	row = table.insertRow(id);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	if(bool){
		addORcreate = "add";
	}
	else{
		addORcreate = "edit";
	}

	cell4.appendChild(createButton(id, addORcreate));
	cell1.appendChild(createTextButton(addORcreate + "FirstName", firstName, bool));
	cell2.appendChild(createTextButton(addORcreate + "LastName", lastName, bool));
	cell3.appendChild(createTextButton(addORcreate + "PhoneNumber", phoneNumber, bool));
	// Create a text input button. Takes in the id, placeholder and a boolean (true or blank for placeholder, false for value).
	// createTextButton("addFirstName", "First Name");
	
	
}

function addEntry(table, entryPoint, firstName, lastName, phoneNumber, bool){
	bool = bool ?? true;
	row = table.insertRow(entryPoint);
	
	if(bool){
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		var cell5 = row.insertCell(4);
		cell1.innerHTML = firstName;
		cell2.innerHTML = lastName;
		cell3.innerHTML = phoneNumber;
		
		cell4.appendChild(createButton(entryPoint, "editButton"));
		cell5.appendChild(createButton(entryPoint, "delete"));
	}
	else{
		var x = document.createElement("th");
		var x1 = document.createElement("th");
		var x2 = document.createElement("th");
		var y = document.createTextNode(firstName);
		var y1 = document.createTextNode(lastName);
		var y2 = document.createTextNode(phoneNumber);
		x.appendChild(y);
		x1.appendChild(y1);
		x2.appendChild(y2);

		row.appendChild(x);
		row.appendChild(x1);
		row.appendChild(x2); 
	}
}

function doSearch()
{
	var srchText = document.getElementById('searchBar').value; // Value of item typed in the search bar gotten
	document.getElementById("searchResult").innerHTML = ""	// Gets the status of the search 

	readCookie();
	var jsonPayload = '{"search" : "' + srchText + '", "id" : "' + userId + '" }'; 
	var url = urlBase + '/Search' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				$("#searchResultsTable tr").remove();
				
				var jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("searchResult").innerHTML = "Retrieved contact(s)";

				var table = document.getElementById("searchResultsTable");
				addEntry(table, 0, "First Name", "Last Name", "Phone Number", false);
				document.getElementById("searchResult").innerHTML = "";

				var length = Object.keys(jsonObject).length

				//Add all entries from the search results to the table, starts at 1 because the headers are in index 0
				for(var i = 0; i < length; i++ )
				{
					addEntry(table, i+1, jsonObject[i].FirstName, jsonObject[i].LastName, jsonObject[i].PhoneNumber);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}

function editContactSubmit(id){
	// alert("I am here: " + id);
	var table = document.getElementById("searchResultsTable");
	
	var addFName = document.getElementById("editFirstName");
	var addLName = document.getElementById("editLastName");
	var addPhNum = document.getElementById("editPhoneNumber");

	if(addFName == null || addLName == null || addPhNum == null){
		// alert("Hi there 2:");
		return;
	}
	if(addFName.value == "" || addLName.value == "" || addPhNum.value == ""){
		// alert("Hi there 3:");
		if(addFName.value == ""){
			addFName.placeholder = "Please include value";
		}
		if(addLName.value == ""){
			addLName.placeholder = "Please include value";
		}
		if(addPhNum.value == ""){
			addPhNum.placeholder = "Please include value";
		}
		return;
	}

	var addFNameValue = document.getElementById("editFirstName").value;
	var addLNameValue = document.getElementById("editLastName").value;
	var addPhNumValue = document.getElementById("editPhoneNumber").value;

	document.getElementById("searchResultsTable").deleteRow(id);
	addEntry(table, id, addFNameValue, addLNameValue, addPhNumValue);
	readCookie();
	var jsonPayload = '{"id" : "' + userId + '", "firstName" : "' + tempFirst + '", "lastName" : "' + tempLast + '", "phoneNumber" : "' + tempPhone + '", "newFirstName" : "' + addFNameValue + '", "newLastName" : "' + addLNameValue + '", "newPhoneNumber" : "' + addPhNumValue + '"}';
	// alert(jsonPayload);
	var url = urlBase + '/Update' + extension;
	
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
				
			}
		};
	
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// document.getElementById("Name" + no).innerHTML = err.message;
	}
	canEdit = true;
}

function addContactSubmit(){
	// alert("Hi there:");
	var addFName = document.getElementById("addFirstName");
	var addLName = document.getElementById("addLastName");
	var addPhNum = document.getElementById("addPhoneNumber");

	if(addFName == null || addLName == null || addPhNum == null){
		// alert("Hi there 2:");
		return;
	}
	if(addFName.value == "" || addLName.value == "" || addPhNum.value == ""){
		// alert("Hi there 3:");
		if(addFName.value == ""){
			addFName.placeholder = "Please include value";
		}
		if(addLName.value == ""){
			addLName.placeholder = "Please include value";
		}
		if(addPhNum.value == ""){
			addPhNum.placeholder = "Please include value";
		}
		return;
	}
	
	// document.getElementById("loginResult").innerHTML = "";
	// var hash = md5( password );
	readCookie();
	// alert("firstName: " + addFName.value + "   lastName: "+ addLName.value + "     phoneNumber: " + addPhNum.value + "    id: " + userId);
	var jsonPayload = '{"firstName" : "' + addFName.value + '", "lastName" : "'+ addLName.value + '", "phoneNumber" : "' + addPhNum.value + '", "id" : "' + userId + '"}';
	var url = urlBase + '/Create' + extension;
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
				var jsonObject = JSON.parse(xhr.responseText);
				var errid = jsonObject.errid;
				
				if(errid == "1" )
				{	
					document.getElementById("searchResultsTable").deleteRow(0);
					addEntry(document.getElementById("searchResultsTable"), 0, "First Name", "Last Name", "Phone Number", false);
				}
				else{
				//Contact already exists
				}		
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}		

}

function doDelete(id)
{
	if(confirm('Are you sure you want to delete this contact?')){

	}
	else{
		return;
	}
	var table = document.getElementById("searchResultsTable");
	// alert(table.rows[id].innerHTML);
	// alert(table.rows[id].cells[0].innerHTML);
	var firstName = table.rows[id].cells[0].innerHTML;
	var lastName = table.rows[id].cells[1].innerHTML;
	var phoneNumber = table.rows[id].cells[2].innerHTML;
	readCookie();
	//id takes in the entrypoint of the entry in the form
	var jsonPayload = '{"id" : "' + userId + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phoneNumber" : "' + phoneNumber + '"}';
	var url = urlBase + '/Delete' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{	
			// document.getElementById("FirstName" + no).innerHTML = this.readyState + ", " + this.status;		
			if (this.readyState == 4 && this.status == 200) 
			{				
				var jsonObject = JSON.parse( xhr.responseText );

				
				table.rows[id].cells[0].innerHTML = "Deleted";
				table.rows[id].cells[1].innerHTML = "Deleted";
				table.rows[id].cells[2].innerHTML = "Deleted";
				table.rows[id].cells[3].innerHTML = "Deleted";
				table.rows[id].cells[4].innerHTML = "Deleted";
			}
		};
	
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// document.getElementById("Name" + no).innerHTML = err.message;
	}

}

function doEdit(id)
{
	if(!canEdit){
		return;
	}
	var table = document.getElementById("searchResultsTable");
	var firstName = table.rows[id].cells[0].innerHTML;
	var lastName = table.rows[id].cells[1].innerHTML;
	var phoneNumber = table.rows[id].cells[2].innerHTML;
	tempFirst = firstName;
	tempLast = lastName;
	tempPhone = phoneNumber;
	// var edit = table.rows[id].cells[3];
	// alert(edit);
	canEdit = false;
	addContact(id, false, firstName, lastName, phoneNumber);

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
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

