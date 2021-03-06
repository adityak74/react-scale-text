"use strict";

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _warning = _interopRequireDefault(require("warning"));

var _shortid = require("shortid");

var _shallowEqual = _interopRequireDefault(require("./shallow-equal"));

var _getFillsize = _interopRequireDefault(require("./get-fillsize"));

var _domUtils = require("./dom-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var ScaleText =
/*#__PURE__*/
function (_Component) {
  _inherits(ScaleText, _Component);

  function ScaleText(props) {
    var _this;

    _classCallCheck(this, ScaleText);

    _this = _possibleConstructorReturn(this, (ScaleText.__proto__ || Object.getPrototypeOf(ScaleText)).call(this, props));
    _this.state = {
      size: null
    };
    _this._resizing = false;
    _this._invalidChild = false;
    _this._mounted = false;

    _this._handleResize = function () {
      if (!_this._resizing) {
        requestAnimationFrame(_this.handleResize.bind(_assertThisInitialized(_this)));
      }

      _this._resizing = true;
    };

    return _this;
  }

  _createClass(ScaleText, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var children = this.props.children;
      this._mounted = true;
      this._invalidChild = _react.default.Children.count(children) > 1;
      (0, _warning.default)(!this._invalidChild, "'ScaleText' expects a single node as a child, but we found\n      ".concat(_react.default.Children.count(children), " children instead.\n      No scaling will be done on this subtree"));

      if (this.shouldResize()) {
        this.resize();
        window.addEventListener('resize', this._handleResize);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // compare children's props for change
      if (!(0, _shallowEqual.default)(prevProps.children.props, this.props.children.props) || prevProps.children !== this.props.children || prevProps !== this.props) {
        this.resize();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.shouldResize()) {
        window.removeEventListener('resize', this._handleResize);
      }
    }
  }, {
    key: "shouldResize",
    value: function shouldResize() {
      return !this._invalidChild;
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      this._resizing = false;
      this.resize();
    }
  }, {
    key: "resize",
    value: function resize() {
      var _this2 = this;

      var _props = this.props,
          minFontSize = _props.minFontSize,
          maxFontSize = _props.maxFontSize,
          widthOnly = _props.widthOnly;
      if (!this._mounted || !this._wrapper) return;

      if (this.ruler) {
        this.clearRuler();
      }

      this.createRuler();
      var fontSize = (0, _getFillsize.default)(this.ruler, minFontSize || Number.NEGATIVE_INFINITY, maxFontSize || Number.POSITIVE_INFINITY, widthOnly);
      this.setState({
        size: parseFloat(fontSize, 10),
        complete: true
      }, function () {
        _this2.clearRuler();
      });
    }
  }, {
    key: "createRuler",
    value: function createRuler() {
      // Create copy of wrapper for sizing
      this.ruler = this._wrapper.cloneNode(true);
      this.ruler.id = (0, _shortid.generate)();
      (0, _domUtils.css)(this.ruler, {
        position: 'absolute',
        top: '0px',
        left: 'calc(100vw * 2)',
        width: (0, _domUtils.getStyle)(this._wrapper, 'width'),
        height: (0, _domUtils.getStyle)(this._wrapper, 'height')
      });
      document.body.appendChild(this.ruler);
    }
  }, {
    key: "clearRuler",
    value: function clearRuler() {
      if (this.ruler) {
        document.body.removeChild(this.ruler);
      }

      this.ruler = null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var fontSize = this.state.size;
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          containerWidth = _props2.containerWidth,
          containerMaxWidth = _props2.containerMaxWidth,
          widthOnly = _props2.widthOnly;
      var overflowStyle = widthOnly ? {
        overflowY: 'visible',
        overflowX: 'hidden',
        height: 'auto'
      } : {
        overflow: 'hidden'
      };
      var child = _react.default.isValidElement(children) ? _react.default.Children.only(children) : _react.default.createElement("span", null, children);

      var style = _extends({
        fontSize: fontSize ? "".concat(fontSize.toFixed(2), "px") : 'inherit',
        width: containerWidth,
        height: '100%',
        maxWidth: containerMaxWidth
      }, overflowStyle);

      var childProps = {
        fontSize: fontSize ? parseFloat(fontSize.toFixed(2)) : 'inherit'
      };
      return _react.default.createElement("div", {
        className: className,
        ref: function ref(c) {
          _this3._wrapper = c;
        },
        style: style
      }, _react.default.cloneElement(child, childProps));
    }
  }]);

  return ScaleText;
}(_react.Component);

ScaleText.propTypes = {
  children: _propTypes.default.node.isRequired,
  className: _propTypes.default.string,
  containerWidth: _propTypes.default.string,
  containerMaxWidth: _propTypes.default.string,
  minFontSize: _propTypes.default.number.isRequired,
  maxFontSize: _propTypes.default.number.isRequired,
  widthOnly: _propTypes.default.bool
};
ScaleText.defaultProps = {
  className: 'scaletext-wrapper',
  containerWidth: '100%',
  containerMaxWidth: '100%',
  minFontSize: Number.NEGATIVE_INFINITY,
  maxFontSize: Number.POSITIVE_INFINITY,
  widthOnly: false
}; // export default ScaleText;

module.exports = ScaleText;