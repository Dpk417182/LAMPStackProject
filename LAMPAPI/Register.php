<?php
// Hopefully this works. Need to make a register page before I can really test this
	$inData = getRequestInfo();

	$firstname = $inData["FirstName"];
	$lastname = $inData["LastName"];
	$username = $inData["login"];
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
			$stmt = $conn->prepare("INSERT into Users (DateCreated, FirstName, LastName, Login, Password) VALUES(CURRENT_TIMESTAMP,?,?,?,?)");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>