<?php
    
    function retrieveRecords($result) {
        $inc = 0;
        $temp = array();        
        if($result->num_rows > 0){
            while (($row = $result->fetch_assoc()) && ($inc < 20)) {
                $jsonArrayObject = (array('ID' => $row["ID"], 'FirstName' => $row["FirstName"], 'LastName' => $row["LastName"], 'PhoneNumber' => $row["PhoneNumber"]));
                $temp[$inc] = $jsonArrayObject;
                $inc++;
            }
        }
        return $temp;
    }



	$inData = getRequestInfo();

	// $id = 0;
	
	$conn = new mysqli("localhost", "APIUser", "ProjectOne", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $temp = $inData["search"];
        $search = explode(" ", $temp);
        if(count($search) == 1){
            $temp = "%" . $search[0] . "%";
            $rows = array();
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?)");
            $stmt->bind_param("isss", $inData["id"], $temp, $temp, $temp);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows = retrieveRecords($result);

            sendResultInfoAsJson($rows);

        }
        else if(count($search) == 2){
            $temp = "%" . $search[0] . "%";
            $temp2 = "%" . $search[1] . "%";
            $rows = array();
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?) AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?)");
            $stmt->bind_param("issssss", $inData["id"], $temp, $temp, $temp, $temp2, $temp2, $temp2);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows = retrieveRecords($result);

            sendResultInfoAsJson($rows);
        }
        else if(count($search) == 3){
            $temp = "%" . $search[0] . "%";
            $temp2 = "%" . $search[1] . "%";
            $temp3 = "%" . $search[2] . "%";
            $rows = array();
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?) AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?) AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?)");
            $stmt->bind_param("isssssssss", $inData["id"], $temp, $temp, $temp, $temp2, $temp2, $temp2, $temp3, $temp3, $temp3);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows = retrieveRecords($result);

            sendResultInfoAsJson($rows);
        }
        else
        {
            returnWithError("Cannot process more than 3 search criteria");
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