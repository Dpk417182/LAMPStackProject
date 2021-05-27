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
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
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
				// console.log("jsonObject: " + jsonObject);
				userId = jsonObject.id
				
				if( userId < 1 )
				{		
					
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					// document.getElementById("loginResult").innerHTML = "User/Password combination incorrect: " + jsonObject.error;
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "test.html";
				
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
	window.location.href = "index.html";
}

function goToRegisterPage()
{
	window.location.href = "register.html";
}

function doRegister()
{

	var fName = document.getElementById("registerFirstName").value;
	var lName = document.getElementById("registerLastName").value;
	var userName = document.getElementById("registerUserName").value
	var password = document.getElementById("registerPassword").value;
	var retypePassword = document.getElementById("registerRetypePassword").value;

	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : "'+ lName + '", "userName" : "' + userName + '", "password" : "' + password + '", "retypePassword" : "' + retypePassword + '"}';
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
				// var jsonObject = JSON.parse(xhr.responseText); // Returns text received from server following the request sent
				// console.log("jsonObject: " + jsonObject);
				// userId = jsonObject.id

				if (fName == '')
				{
					document.getElementById("loginResult").innerHTML = "Please enter your first name";
				}
				else if(lName == '')
				{
					document.getElementById("loginResult").innerHTML = "Please enter your last name";
				}
				else if (userName == '')
				{
					document.getElementById("loginResult").innerHTML = "Please enter your Username";
				}
				else if (password == '')
				{
					document.getElementById("loginResult").innerHTML = "Please enter your password";
				}
				else if (retypePassword == '')
				{
					document.getElementById("loginResult").innerHTML = "Please enter your name";
				}
				else if (password != retypePassword)
				{
					document.getElementById("loginResult").innerHTML = "Passwords don't match";
				}
				else
				{
					window.location.href = "color.html";
				}
		
				fName = jsonObject.firstName;
				lName = jsonObject.lastName;
				userName = jsonObject.userName;
				password = jsonObject.password;
				retypePassword = jsonObject.retypePassword;

				// saveCookie();
				clearFunc();	
				//window.location.href = "index.html";			
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}		
}
function clearFunc()
{
	// document.getElementById("registerFirstName").value="";
	// document.getElementById("registerLastName").value="";
	// document.getElementById("registerUserName").value="";
	document.getElementById("registerPassword").value="";
	document.getElementById("registerRetypePassword").value="";
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
		window.location.href = "index.html";
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
	window.location.href = "index.html";
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
