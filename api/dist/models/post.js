'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Post = function () {
    function Post(app) {
        _classCallCheck(this, Post);

        this.app = app;

        this.model = {
            from: null,
            to: null,
            message: null,
            files: [],
            create: new Date()
        };
    }

    _createClass(Post, [{
        key: 'initWithObject',
        value: function initWithObject(obj) {

            this.model.from = _lodash2.default.get(obj, 'from');
            this.model.to = _lodash2.default.get(obj, 'to');
            this.model.message = _lodash2.default.get(obj, 'message');
            this.model.files = _lodash2.default.get(obj, 'files', []);
            this.model.created = _lodash2.default.get(obj, 'created', new Date());

            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.model;
        }
    }]);

    return Post;
}();

exports.default = Post;
//# sourceMappingURL=post.js.map