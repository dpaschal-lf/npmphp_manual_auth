

$(document).ready( startup );


function startup(){
	$("#login").click( loginUser );
}

function loginUser(){
	debugger;
	const username = $("#username").val();
	const password = $("#password").val();
	$.ajax({
		url: '/login',
		method: 'post',
		data: {
			user: username,
			pass: password
		},
		success: function( response ){
			debugger;
			console.log(response);
		}
	})

}