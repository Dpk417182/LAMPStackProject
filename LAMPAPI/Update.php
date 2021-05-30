<?php

	$inData = getRequestInfo();

    $id = $inData["id"];                        
    $firstName = $inData["firstName"];          
    $lastName = $inData["lastName"];            
    $PhoneNumber = $inData["PhoneNumber"];      
    $newFirstName = $inData["newFirstName"];     
    $newLastName = $inData["newLastName"];      
    $newPhoneNumber = $inData["newPhoneNumber"];
	
	$conn = new mysqli("localhost", "APIUser", "ProjectOne", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        # if no new data provided, copy in old data
        if ($newFirstName == "") {
            $newFirstName = $firstName;
        }
        if ($newLastName == "") {
            $newLastName = $lastName;
        }
        if ($newPhoneNumber == "") {
            $newPhoneNumber = $PhoneNumber;
        }

		# updates a contact to the table
		$stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?, PhoneNumber = ? WHERE (id = ? && firstName = ? && lastName = ? && PhoneNumber = ?)");
		$stmt->bind_param("sssisss", $newFirstName, $newLastName, $newPhoneNumber, $id, $firstName, $lastName, $PhoneNumber);
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