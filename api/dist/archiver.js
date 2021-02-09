'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _s = require('./s3');

var _s2 = _interopRequireDefault(_s);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileArchiver = function () {
        function FileArchiver(app) {
                var files = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
                var response = arguments[2];

                _classCallCheck(this, FileArchiver);

                this.app = app;
                this.files = files;
                this.response = response;
        }

        _createClass(FileArchiver, [{
                key: 'download',
                value: function download() {

                        var app = this.app;
                        var files = this.files;
                        //const uploadDir = app.get('storageDir')
                        var zip = (0, _archiver2.default)('zip');
                        var response = this.response;

                        response.attachment('download.zip');
                        zip.pipe(response);

                        var s3Downloader = new _s2.default(app, response);

                        _lodash2.default.each(files, function (file) {

                                var fileObject = s3Downloader.getObject(file);

                                zip.append(fileObject, { name: _lodash2.default.get(file, 'originalName') });

                                //const filePath = path.join(uploadDir, _.get(file, 'name'));
                                //zip.file(filePath, {name: _.get(file, 'originalName')});
                        });

                        zip.finalize();

                        return this;
                }
        }]);

        return FileArchiver;
}();

exports.default = FileArchiver;
//# sourceMappingURL=archiver.js.map