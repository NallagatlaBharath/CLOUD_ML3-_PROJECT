var express = require('express');
var app = express();

var config = require('./config.js')

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });



require('dotenv').config({path :'./secrets.env'})


//  ------------------------------AWS config part start----------------------------------------------------------
var AWS = require('aws-sdk')
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.SECRET_ACCESS_KEY;
AWS.config.region = "ap-south-1";


AWS.config.region = config.region;
var rekognition = new AWS.Rekognition({region: config.region});

// ------------------------------AWS config part end-------------------------------------------------------------





var uuid = require('node-uuid');
var fs = require('fs-extra');
var path = require('path');



app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('./faces'))
app.use('/', require('./routes'))


app.listen(5555, function () {
	console.log('Listening on port 5555!');
})