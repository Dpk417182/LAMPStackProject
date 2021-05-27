<?php
// var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : "'+ lName + '", "userName" : "' + userName + '", "password" : "' + password + '", "retypePassword" : "' + retypePassword + '"}';
	$inData = getRequestInfo();

	$firstname = $inData["firstName"];
	$lastname = $inData["lastName"];
	$username = $inData["userName"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "APIUser", "ProjectOne", "COP4331"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//If User exists, send error codes below
		// 1: created successfully; 0, login already exists, forget username/password
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		if($row = $result->fetch_assoc())
		{
			returnWithError("0");
		}
		else
		{
			$stmt = $conn->prepare("INSERT into Users (DateCreated, firstName, lastName, Login, Password) VALUES(CURRENT_TIMESTAMP,?,?,?,?)");
			$stmt->bind_param("ssss", $firstname, $lastname, $username, $password);
			$stmt->execute();
			returnWithError("1");
		}
		$stmt->close();
		$conn->close();
	
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"errid":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>