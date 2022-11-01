const express = require('express');


var uuid = require('node-uuid');
var fs = require('fs-extra');
var path = require('path');
var multer  = require('multer')


//------------------------------- creating one more multer start------------------------
const storage = multer.diskStorage({
    // Destination to store image     
    destination: 'faces', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
var upload=multer({storage})


//---------------------------------multer 2 end-----------------------------------------


//  ------------------------------AWS config part start----------------------------------------------------------
var AWS = require('aws-sdk');
const { stringify } = require('querystring');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.SECRET_ACCESS_KEY;
AWS.config.region = "ap-south-1";

var rekognition = new AWS.Rekognition({region: process.env.REGION});

// ------------------------------AWS config part end-------------------------------------------------------------

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index')
})


router.post('/api/recognize',upload.single("image"), function (req, res, next) {
	var bitmap = fs.readFileSync(req.file.path);

	rekognition.searchFacesByImage({
	 	"CollectionId": process.env.COLLECTION_NAME,
	 	"FaceMatchThreshold": 70,
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
	 	"MaxFaces": 1
	}, function(err, data) {
	 	if (err) {
	 		res.send(err);
	 	} else {
			if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
			{
                console.log(data.FaceMatches[0].Face)
				// res.send(data.FaceMatches[0].Face);
                let pather=req.file.path
                pather=pather.slice(6)
                console.log(pather)
                res.render('result',{detail:data.FaceMatches[0].Face,bit:pather})	
			} else {
				res.render('alert')
			}
		}
	});
});
module.exports = router
