<?php

	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "APIUser", "ProjectOne", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		# deletes a contact specified by first and last name which matches user's primary key
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE (ID = ? && FirstName = ? && LastName = ? && PhoneNumber = ?)");
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
