<?php

if(!empty($_COOKIE['phpcookie'])){
	setcookie('phpcookie', null, -1, '/');
}

print('you are logged out');
?>