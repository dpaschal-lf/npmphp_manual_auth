<?php
session_start();

require_once('mysqlconnection.php');

$username = addslashes($_POST['user']);
$password = sha1($_POST['pass']);

$query = "SELECT * FROM users WHERE displayname = '$username' AND password = '$password'";

//$result = mysqli_query($db, $query)
$result = $db->query($query);
if($result){
	//if(mysqli_num_rows($result) > 0)
	if($result->num_rows>0){
		
		$row = $result->fetch_assoc();
		$token = makeToken();
		$loginQuery = "INSERT INTO connections SET token='$token', userID='{$row['ID']}'";
		$db->query($loginQuery);
		setcookie('phpcookie', $token, time() + (86400 * 30), "/"); // 86400 = 1 day
		print("you are logged in ");
		//$_SESSION['userID'] = $row;
	} else {
		print("you are not logged in");
	}
} else {
	print("DB error");
}

function makeToken( $length = 20){
	$values = 'abcdefghijklmnopqrstuvwxyz0123456789';
	$output = '';
	srand( explode(" ", microtime())[1]);
	while( strlen($output) < $length){
		$randomInt = rand(0, strlen($output));
		$output .= substr($values, $randomInt, 1);
	}
	return $output;
}
?>