<?php
    $inc = 0;
    function retrieveRecords($result) {
                            
        if($result->num_rows > 0){
            $rows = array();

            while ($row = $result->fetch_assoc() && $inc < 20) {
                $jsonArrayObject = (array('ID' => $row["ID"], 'FirstName' => $row["FirstName"], 'LastName' => $row["LastName"], 'PhoneNumber' => $row["PhoneNumber"]));
                $rows[$inc] = $jsonArrayObject;
                $inc++;
            }
        }
        return $rows;
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
        if(count($search) > 1)
        {

        }
        else
        {
            $temp = "%" . $search[0] . "%";
            // echo $temp;
            $rows = array();
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND FirstName LIKE ?");
            $stmt->bind_param("is", $inData["id"], $temp);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows += retrieveRecords($result);

            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND LastName LIKE ?");
            $stmt->bind_param("is", $inData["id"], $temp);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows += retrieveRecords($result);
            
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND PhoneNumber LIKE ?");
            $stmt->bind_param("is", $inData["id"], $temp);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows += retrieveRecords($result);


            
            sendResultInfoAsJson($rows);
        }

		# selects all available contacts for a given user's ID (primary key)
		// $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
		// $stmt->bind_param("i", $inData["id"]);
		// $stmt->execute();
		// $result = $stmt->get_result();

		// if($result->num_rows > 0)
		// {
			
		// 	$rows = array();
						
        //     $inc = 0;
        //     while ($row = $result->fetch_assoc()) {
        //         $jsonArrayObject = (array('ID' => $row["ID"], 'FirstName' => $row["FirstName"], 'LastName' => $row["LastName"], 'PhoneNumber' => $row["PhoneNumber"]));
        //         $rows[$inc] = $jsonArrayObject;
        //         $inc++;
        //     }
		// 	sendResultInfoAsJson($rows);
		// }
		// else
		// {
		// 	returnWithError("No Records Found");
		// }

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