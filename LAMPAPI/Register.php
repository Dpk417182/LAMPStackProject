<?php
// Hopefully this works. Need to make a register page before I can really test this
	$inData = getRequestInfo();
	
	$firstName = "";
	$lastName = "";

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
		$stmt = $conn->prepare("INSERT into Users (DateCreated, FirstName, LastName, Login, Password) VALUES(FROM_UNIXTIME(?),?,?,?,?)");
		
		$stmt->bind_param("issss", date("Y/m/d h:i:s"), $firstname, $lastname, $username, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");

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