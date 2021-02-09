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

var Email = function () {
    function Email(app) {
        _classCallCheck(this, Email);

        this.app = app;
    }

    _createClass(Email, [{
        key: 'sendDownloadLink',
        value: function sendDownloadLink(post) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};


            var app = this.app;
            var email = app.email;

            var from = _lodash2.default.get(post, 'from'); //post.from;
            var to = _lodash2.default.get(post, 'to');
            var message = _lodash2.default.get(post, 'message', '');
            var postId = _lodash2.default.get(post, '_id');
            var downloadLink = _config.url + '/share/' + postId;

            var messageOptions = {
                from: from, // sender address
                to: to, // list of receivers
                subject: '[Share] Download Invitation', // Subject line
                text: message, // plain text body
                html: '<p>' + from + ' has sent you a file. Click <a href="' + downloadLink + '">here</a> to download.</p><p>Message: ' + message + '</p>' // html body
            };

            email.sendMail(messageOptions, function (err, info) {
                console.log("sending an email with callback", err, info);

                return callback(err, info);
            });
        }
    }]);

    return Email;
}();

exports.default = Email;
//# sourceMappingURL=email.js.map