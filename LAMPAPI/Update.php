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
		# inserts a contact to the table, matching ID with user's primary key
		$stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?, phoneNumber = ? WHERE id = ?");
		$stmt->bind_param("sssi", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["id"]);
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
		# error value 1 is a successful update
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
