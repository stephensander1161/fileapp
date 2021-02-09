'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var S3 = function () {
    function S3(app, response) {
        _classCallCheck(this, S3);

        this.app = app;
        this.response = response;
    }

    _createClass(S3, [{
        key: 'getObject',
        value: function getObject(file) {
            var s3 = this.app.s3;
            var options = {
                Bucket: _config.s3Bucket,
                Key: _lodash2.default.get(file, 'name')
            };
            return s3.getObject(options).createReadStream();
        }
    }, {
        key: 'download',
        value: function download(file) {

            var s3 = this.app.s3;
            var response = this.response;

            //get object from s3 service

            var filename = _lodash2.default.get(file, 'originalName');
            response.attachment(filename);

            var options = {
                Bucket: _config.s3Bucket,
                Key: _lodash2.default.get(file, 'name')
            };
            var fileObject = s3.getObject(options).createReadStream();

            fileObject.pipe(response);
        }
    }, {
        key: 'getDownloadUrl',
        value: function getDownloadUrl(file) {

            var s3 = this.app.s3;
            var options = {
                Bucket: _config.s3Bucket,
                Key: _lodash2.default.get(file, 'name'),
                Expires: 3600 //one hour 
            };

            var url = s3.getSignedUrl('getObject', options);

            return url;
        }
    }]);

    return S3;
}();

exports.default = S3;
//# sourceMappingURL=s3.js.map