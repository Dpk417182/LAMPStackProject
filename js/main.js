var urlBase = 'http://cop4331-fourteen.live/LAMPAPI';
var extension = '.php';

var userId = 0;
var firstName = "";
var lastName = "";


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
				
				//firstindexFirstname = jsonObject[0].FirstName;
				//firstindexLastName = jsonObject[0].LastName;
				//firstindexPhoneNumber = jsonObject[0].PhoneNumber;
				//firstindexFirstname = jsonObject[1].FirstName;
				//firstindexLastName = jsonObject[1].LastName;
				//firstindexPhoneNumber = jsonObject[1].PhoneNumber;
				

				
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

function myTable()
{
	var table = document.getElementById("searchResultsTable");
	var row = searchResultsTable.insertRow(1);
	var FirstName = row.insertCell(0);
	var LastName = row.insertCell(1);
	var PhoneNumber = row.insertCell(2);
	var Edit = row.insertCell(3);
	var Delete = row.insertCell(4);

	FirstName.innerHTML = "Tom";
	LastName.innerHTML = "Jerry";
	PhoneNumber.innerHTML = "123456789";
	Edit.innerHTML = "Edit";
	Delete.innerHTML = "Delete";
}

function doSearch(event)
{
	event.preventDefault();

	var srchText = document.getElementById('searchBar').value; // Value of item typed in the search bar gotten
	const searchResultsTable = document.getElementById('searchResultsTable');
	
	//document.getElementById("loginResult").innerHTML = "";

	// Gets the status of the search 
	document.getElementById("searchResult").innerHTML = ""

	//'<tr><th class="tl column tableheader tlfname">First Name</th><th class="tl column tableheader tllname">Last Name</th><th class="tl column tableheader phone">Phone Number</th></tr>';

	// var jsonPayload = '{"search" : "' + srch + '","firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "PhoneNumber" : "' + phoneNumber + '"}';
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
				document.getElementById("searchResult").innerHTML = "Retrieved contact(s)";
				// '<tr><th class="tl column tableheader tlfname">First Name</th><th class="tl column tableheader tllname">Last Name</th><th class="tl column tableheader phone">Phone Number</th></tr>';
				var jsonObject = JSON.parse( xhr.responseText );
				var id = jsonObject.id;

				console.log(id);
				
				myTable();
				for( var i = 0; i < jsonObject.id.length; i++ )
				{
					searchResultsTable += jsonObject.id[i];
					if( i < jsonObject.id.length - 1 )
					
					{
						"<td>" +
						jsonObject[i].FirstName +
						"</td>" +
						"<td>" +
						jsonObject[i].LastName +
						"</td>" +
						"<td>" +
						jsonObject[i].PhoneNumber +
						"</td>";
						
						// contactList += "<br />\r\n";
					}

				}
				document.getElementsById("p")[0].innerHTML = contactList;
			}
		};
		//xhr.open("GET", "Search.php?q=" + event, true);
		//xhr.send();
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

// async function getContact()
// {
// 	const userId = getActiveUser().userId;
// 	const srch = document.getElementById("searchBar").value;

// 	console.log("srch: ", srch);

// 	const listResult = await Search(userId, srch);
// 	comsole.log(listResult);

// }

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
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	goToLogin();
}

// function addColor()
// {
// 	var newColor = document.getElementById("colorText").value;
// 	document.getElementById("colorAddResult").innerHTML = "";
	
// 	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
// 	var url = urlBase + '/AddColor.' + extension;
	
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function() 
// 		{
// 			if (this.readyState == 4 && this.status == 200) 
// 			{
// 				document.getElementById("colorAddResult").innerHTML = "Color has been added";
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	}
// 	catch(err)
// 	{
// 		document.getElementById("colorAddResult").innerHTML = err.message;
// 	}
	
// }

// function searchColor()
// {
// 	var srch = document.getElementById("searchText").value;
// 	document.getElementById("colorSearchResult").innerHTML = "";
	
// 	var colorList = "";
	
// 	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
// 	var url = urlBase + '/SearchColors.' + extension;
	
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function() 
// 		{
// 			if (this.readyState == 4 && this.status == 200) 
// 			{
// 				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
// 				var jsonObject = JSON.parse( xhr.responseText );
				
// 				for( var i=0; i<jsonObject.results.length; i++ )
// 				{
// 					colorList += jsonObject.results[i];
// 					if( i < jsonObject.results.length - 1 )
// 					{
// 						colorList += "<br />\r\n";
// 					}
// 				}
				
// 				document.getElementsByTagName("p")[0].innerHTML = colorList;
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	}
// 	catch(err)
// 	{
// 		document.getElementById("colorSearchResult").innerHTML = err.message;
// 	}
	
// }
