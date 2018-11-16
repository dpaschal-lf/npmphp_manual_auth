
const express = require('express');
const mysql = require('mysql');
const server = express();
const sha1 = require('sha1');
const cookieParser = require('cookie-parser');


const db = mysql.createConnection({
	'host': 'localhost',
	'user': 'root',
	'password': 'root',
	'database': 'c9.18db',
	'port': 8889
});

server.use( express.urlencoded({ extended: false }));
server.use( express.static(__dirname + '/html'));
server.use(cookieParser());

server.post('/login', (request, response)=>{
	const username = request.body.user.replace(/["']/g, "\\'");
	const password = sha1(request.body.pass);
	db.connect(()=>{
		const query = `SELECT * FROM users WHERE displayname = '${username}' AND password = '${password}'`;
		console.log("query = "+query);
		db.query(query, (error, fields)=>{
			if(!error){
				if(fields.length> 0){
					const token = makeToken();
					const loginQuery = `INSERT INTO connections SET token='${token}', userID='${fields[0].ID}'`;
					db.query(loginQuery, (error)=>{
						response.cookie('token',token, { maxAge: 900000, httpOnly: true })
						response.send('you are logged in');	
					})

				} else {
					response.send('you are not logged in');
				}
			} else {
				response.send('db error');
			}
		})
	})
	//code
})
server.get('/logout', (request, response)=>{
	response.cookie('token','', { maxAge: -1, httpOnly: true });
	response.send('you are now logged out');
})

server.get('/data', (request, response)=>{
	const token = request.cookies.token;
	if(token!==undefined){
		db.connect( ()=>{
			db.query(`SELECT userID FROM connections WHERE token = '${token}'`, (error, data)=>{
				if(!error && data.length>0){
					console.log('in')
					response.send('you are logged in, so I will give you data')
				} else {
					console.log('out');
					response.send('you are not logged in');
				}
			});
		})
	} else {
		response.send('no token, you are not logged in');
	}
})


function makeToken(length = 20){
	const startValues = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let output = '';
	while(output.length < length){
		let randomInt = (startValues.length * Math.random()) >> 0;
		output += startValues[ randomInt ];
	}
	return output;
}

server.listen(3000, ()=>{
	console.log('server is listening');
});











