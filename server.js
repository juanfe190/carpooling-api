process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//EXPRESS FRAMEWORK IMPLEMENTATION
var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//JWT-EXPRESS
var jwtMiddleware = require('express-jwt');

//UTIL
var constants = require('./App/Util/constants');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

server.listen(port, ipaddress, function(){console.log('App running on port: '+port)});

//SOCKET.IO IMPLEMENTATION
var io = require('socket.io').listen(server);
//io.set('origins', '*');

require('./socket').startConnection(io);

//MONGOOSE CONNECTION
require('./App/Database/connection');

/**********************
********ROUTING********
***********************/

/***CONTROLLERS***/
var UsersController = require('./App/Controllers/UsersController');
var ProvinceController = require('./App/Controllers/ProvincesController');
var CarrerasController = require('./App/Controllers/CarrerasController');

/***MIDDLEWARES***/
var UsersMiddlewares = require('./App/Middlewares/UsersMiddlewares');

/***ROUTES***/
app.get('/', function(request, response){
	response.json({status: 'ok'});
});

//LOGIN
app.post('/login', 
	UsersMiddlewares.checkIfUsernameExists,
	require('./App/Controllers/LoginController'));

//USERS
app.post('/usuario/registrar',
	UsersMiddlewares.checkRequiredValues,
	UsersMiddlewares.checkIfEmailIsValid,
	UsersMiddlewares.populateCity,
	 UsersController.store);

app.post('/usuario/activar',
	UsersMiddlewares.checkIfEmailExists,
	UsersController.activate);

app.get('/usuario/:id', 
	//jwtMiddleware({secret: constants.jwtPrivateKey}),
	UsersMiddlewares.checkIfExists,
	UsersController.find);

app.put('/usuario/actualizar/:id', 
	//jwtMiddleware({secret: constants.jwtPrivateKey}),
	UsersMiddlewares.checkIfExists,
	UsersController.update);

app.delete('/usuario/eliminar',
	//jwtMiddleware({secret: constants.jwtPrivateKey}),
	UsersMiddlewares.checkIfExists, 
	UsersController.destroy);

//PROVINCIAS
app.get('/provincia/all', ProvinceController.getAllProvinces);
app.get('/provincia/canton/:id', ProvinceController.getCanton);

//CARRERAS
app.get('/carrera/all', CarrerasController.all);
app.post('/carrera/registrar', CarrerasController.store);

//__TESTING
app.get('/test', require('./App/Controllers/RidesController').store);