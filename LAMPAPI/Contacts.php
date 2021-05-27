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
		# selects all available contacts for a given user's ID (primary key)
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
		$stmt->bind_param("i", $inData["id"]);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result->num_rows > 0)
		{
			
			$rows = array();
						
            $inc = 0;
            while ($row = $result->fetch_assoc()) {
                $jsonArrayObject = (array('ID' => $row["ID"], 'FirstName' => $row["FirstName"], 'LastName' => $row["LastName"], 'PhoneNumber' => $row["PhoneNumber"]));
                $rows[$inc] = $jsonArrayObject;
                $inc++;
            }
			sendResultInfoAsJson($rows);
		}
		else
		{
			returnWithError("No Records Found");
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
		
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{  "id":0,"firstName":"","lastName":"","phoneNumber":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
?>
