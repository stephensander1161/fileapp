'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('../package.json');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _file = require('./models/file');

var _file2 = _interopRequireDefault(_file);

var _post = require('./models/post');

var _post2 = _interopRequireDefault(_post);

var _mongodb = require('mongodb');

var _archiver = require('./archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _email = require('./email');

var _email2 = _interopRequireDefault(_email);

var _s = require('./s3');

var _s2 = _interopRequireDefault(_s);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppRouter = function () {
	function AppRouter(app) {
		_classCallCheck(this, AppRouter);

		this.app = app;
		this.setupRouters();
	}

	_createClass(AppRouter, [{
		key: 'setupRouters',
		value: function setupRouters() {
			var _this = this;

			var app = this.app;
			var db = app.get('db');
			var uploadDir = app.get('storageDir');
			var upload = app.upload;

			//route routing.
			app.get('/', function (req, res, next) {
				return res.status(200).json({
					version: _package.version
				});
			});

			//upload routing
			app.post('/api/upload', upload.array('files'), function (req, res, next) {
				var files = _lodash2.default.get(req, 'files', []);

				console.log('files objects from s3 multer', files);
				var fileModels = [];

				_lodash2.default.each(files, function (fileObject) {
					var newFile = new _file2.default(app).initWithObject(fileObject).toJSON();
					fileModels.push(newFile);
				});

				if (fileModels.length) {
					db.collection('files').insertMany(fileModels, function (err, result) {
						if (err) {
							return res.status(503).json({
								error: {
									message: 'unable to save your files'
								}
							});
						}

						var post = new _post2.default(app).initWithObject({
							from: _lodash2.default.get(req, 'body.from'),
							to: _lodash2.default.get(req, 'body.to'),
							message: _lodash2.default.get(req, 'body.message'),
							files: result.insertedIds
						}).toJSON();

						// let save post object to posts collection

						db.collection('posts').insertOne(post, function (err, result) {
							if (err) {
								return res.status(503).json({ error: { message: 'Your upload could not be saved.' } });
							}
							// implement email sending to userwith download link.

							// send email
							var sendEmail = new _email2.default(app).sendDownloadLink(post, function (err, info) {
								sendEmail.sendDownloadLink(post, function (err, info) {
									if (err) {
										console.log('error sending email notify downloading link', err);
									}
								});
							});

							//callback to react app with post details.
							return res.json(post);
						});
					});
				} else {
					return res.status(503).json({
						error: { message: 'file upload is required' }
					});
				}
			});

			//Download routing

			app.get('/api/download/:id', function (req, res, next) {
				var fileId = req.params.id;

				db.collection('files').find({ _id: (0, _mongodb.ObjectID)(fileId) }).toArray(function (err, result) {
					var fileName = _lodash2.default.get(result, '[0].name');

					if (err || !fileName) {
						return res.status(404).json({
							error: {
								message: 'file not found'
							}
						});
					}

					// download file from s3 service
					var file = _lodash2.default.get(result, '[0]');
					var downloader = new _s2.default(app, res);

					//return downloader.download(file); Proxy download from s3 service

					//Download Directly from S3

					var downloadUrl = downloader.getDownloadUrl(file);

					return res.redirect(downloadUrl);

					/*const filePath = path.join(uploadDir, fileName);
                 return res.download(filePath, _.get(result, '[0].originalName'), (err) => {
                     if(err){
                         return res.status(404).json({
                             error: {
                                 message: "file not found"
                             }
                         });
                     }else{
                         console.log("file downloaded");
                     }
                 });*/
				});
			});

			//routing for post detail /api/posts/:id

			app.get('/api/posts/:id', function (req, res, next) {
				var postId = _lodash2.default.get(req, 'params.id');

				_this.getPostById(postId, function (err, result) {
					if (err) {
						return res.status(404).json({ error: { message: 'File not found.' } });
					}

					return res.json(result);
				});
			});

			//routing download zip files.
			app.get('/api/posts/:id/download', function (req, res, next) {
				var id = _lodash2.default.get(req, 'params.id', null);

				_this.getPostById(id, function (err, result) {
					if (err) {
						return res.status(404).json({ error: { message: 'File not found.' } });
					}

					var files = _lodash2.default.get(result, 'files', []);

					var archiver = new _archiver2.default(app, files, res).download();

					return archiver;
				});
			});
		}
	}, {
		key: 'getPostById',
		value: function getPostById(id) {
			var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

			var app = this.app;

			var db = app.get('db');

			var postObjectId = null;

			try {
				postObjectId = new _mongodb.ObjectID(id);
			} catch (err) {
				return callback(err, null);
			}
			db.collection('posts').find({ _id: postObjectId }).limit(1).toArray(function (err, results) {
				var result = _lodash2.default.get(results, '[0]');

				if (err || !result) {
					return callback(err ? err : new Error('file not found.'));
				}

				var fileIds = _lodash2.default.get(result, 'files', []);

				db.collection('files').find({ _id: { $in: fileIds } }).toArray(function (err, files) {
					if (err || !files || !files.length) {
						return callback(err ? err : new Error('file not found.'));
					}
					result.files = files;

					return callback(null, result);
				});
			});
		}
	}]);

	return AppRouter;
}();

exports.default = AppRouter;
//# sourceMappingURL=router.js.map