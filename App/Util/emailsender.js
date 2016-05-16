var nodemailer = require('nodemailer');

module.exports = {
	send
}

var transporter = nodemailer.createTransport('smtps://juanfe190@gmail.com:password@smtp.gmail.com');
function send(options){
	var mailOptions = {
	    from: options.from || '"Carpooling" <contacto@ulacti.ed.cr>', // sender address
	    to: options.to ||'', // list of receivers
	    subject: options.subject || 'Carpooling ULACIT', // Subject line
	    html: options.body || '' // html body
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error) return console.log(error);
		console.log('Message sent: ' + info.response);
	});
}