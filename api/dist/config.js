'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var smtp = exports.smtp = {
	host: 'smtp.sendgrid.net',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'apikey', // generated ethereal user
		pass: process.env.NODEMAILER_PASSWORD // generated ethereal password
	}
};

var url = exports.url = 'http://localhost:3001';

var s3Config = exports.s3Config = {
	accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
	secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
};
var s3Region = exports.s3Region = 'ca-central-1';
var s3Bucket = exports.s3Bucket = 'fileapp-dary';
//# sourceMappingURL=config.js.map