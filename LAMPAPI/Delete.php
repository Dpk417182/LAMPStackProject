
<?php
	$inData = getRequestInfo();
	$firstName = "";
	$lastName = "";
	
	$conn = new mysqli("localhost", "APIUser", "ProjectOne", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Users WHERE (FirstName = ? && LastName = ?)");
		$stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
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
