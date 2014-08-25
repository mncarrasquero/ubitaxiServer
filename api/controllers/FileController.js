var uuid = require('node-uuid');
var path = require('path');
module.exports = {

	index: function(req, res) {

		res.writeHead(200, {
			'content-type': 'text/html'
		});
		res.end(
			'<form action="http://localhost:1337/file/upload" enctype="multipart/form-data" method="post">' +
			'<input type="text" name="title"><br>' +
			'<input type="file" name="avatar" multiple="multiple"><br>' +
			'<input type="submit" value="Upload">' +
			'</form>'
		)
	},



	upload: function(req, res) {
		if (req.method === 'GET')
			return res.json({
				'status': 'GET not allowed'
			}); // Call to /upload via GET is error

		var uploadFile = req.file('avatar');
		
		console.log(" tratando de subir la foto");
		uploadFile.upload({
			//dirname: './assets/drivers'
			dirname: sails.config.appPath + "/assets/linker/drivers/",
			//saveAs:  uuid.v4() + path.extname(uploadFile),
				

		}, function onUploadComplete(err, files) { // Files will be uploaded to ./assets/images

			if (err) return res.serverError(err); // IF ERROR Return and send 500 error with error

			console.log(files);
			res.json({
				status: 200,
				file: files
			});
		});
	}

}