var mongoose = require('mongoose');
mongoose.connect('mongodb://carpool:ulacit2015@ds021000.mlab.com/carpooldb');

var db = mongoose.connection;

db.on('error', function(err){
	console.log('Error capturado: '+err);
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 