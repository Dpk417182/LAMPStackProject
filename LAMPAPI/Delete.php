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
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE (FirstName = ? && LastName = ? && id = ?)");
		$stmt->bind_param("iss", $inData["id"], $inData["firstName"], $inData["lastName"]);
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
