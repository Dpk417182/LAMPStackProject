<?php

	$inData = getRequestInfo();

	$id = 0;
	$firstName = "";
	$lastName = "";
	$phoneNumber = "";
	
	$conn = new mysqli("localhost", "APIUser", "ProjectOne", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (ID, FirstName, LastName, PhoneNumber) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("isss", $inData["id"], $inData["firstName"], $inData["lastName"], $inData["phoneNumber"]);
		$stmt->execute();
		$stmt->close();
		$conn->close();
        returnWithError("1");
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
