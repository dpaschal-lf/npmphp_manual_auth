<?php

require_once('mysqlconnection.php');

$token = '';
if(!empty($_COOKIE['phpcookie'])){
	$token = $_COOKIE['phpcookie'];
}

$query = "SELECT userID FROM connections WHERE token = '{$token}'";

$result = $db->query($query);

if($result){
	if($result->num_rows>0){
		print("you are logged in");
		exit();
	} 
}
print("you are not logged in");

?>