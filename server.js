//EXPRESS FRAMEWORK IMPLEMENTATION
var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

//JWT-EXPRESS
var jwtMiddleware = require('express-jwt');

//UTIL
var constants = require('./App/Util/constants');

//SOCKET.IO IMPLEMENTATION
var io = require('socket.io').listen(server);
io.set('origins', 'https://gentle-temple-29130.herokuapp.com');

var port = process.env.PORT || 3000;
server.listen(port, function(){console.log('App running on port: '+port)});
require('./socket').startConnection(io);

//MONGOOSE CONNECTION
require('./App/Database/connection');

/**********************
********ROUTING********
***********************/
app.get('/', function(request, response){
	response.json({status: 'ok'});
});
//LOGIN
app.post('/login', require('./App/Controllers/LoginController'));

//USERS
var UsersController = require('./App/Controllers/UsersController');
var UsersMiddlewares = require('./App/Middlewares/UsersMiddlewares');

app.post('/usuario/registrar',
	 UsersController.store);

app.get('/usuario/:id', 
	jwtMiddleware({secret: constants.jwtPrivateKey}),
	UsersMiddlewares.checkIfExists,
	UsersController.find);

app.put('/usuario/actualizar/:id', 
	jwtMiddleware({secret: constants.jwtPrivateKey}),
	UsersMiddlewares.checkIfExists,
	UsersController.update);

app.delete('/usuario/eliminar',
	jwtMiddleware({secret: constants.jwtPrivateKey}),
	UsersMiddlewares.checkIfExists, 
	UsersController.destroy);

//PROVINCIAS
var ProvinceController = require('./App/Controllers/ProvincesController');
app.get('/provincia/all', ProvinceController.getAllProvinces);
app.get('/provincia/canton/:id', ProvinceController.getCanton);

//TESTING
app.post('/ride', require('./App/Controllers/RidesController').store);