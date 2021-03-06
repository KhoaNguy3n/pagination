'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var React = require('react');
var I18n = require('react-fluxible-i18n').I18n;
var Pager = require('./Pager');
var Options = require('./Options');
var KEYCODE = require('./KeyCode');

function noop() {}

var DEFAULT_LOCALE = 'en-us';
var MAX_TOTAL = 100;

var Pagination = function (_React$Component) {
  _inherits(Pagination, _React$Component);

  function Pagination(props) {
    _classCallCheck(this, Pagination);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    var hasOnChange = props.onChange !== noop;
    var hasCurrent = 'current' in props;
    if (hasCurrent && !hasOnChange) {
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.'); // eslint-disable-line
    }

    var current = props.defaultCurrent;
    if ('current' in props) {
      current = props.current;
    }

    var pageSize = props.defaultPageSize;
    if ('pageSize' in props) {
      pageSize = props.pageSize;
    }

    _this.state = {
      current: current,
      _current: current,
      pageSize: pageSize
    };

    var locale = I18n._localeKey || _this.props.locale || DEFAULT_LOCALE;
    locale = locale.toLowerCase();

    try {
      _this._localeObj = require('./locale/' + locale);
    } catch (err) {
      _this._localeObj = require('./locale/' + DEFAULT_LOCALE);
    }

    ['render', '_handleChange', '_handleKeyUp', '_handleKeyDown', '_changePageSize', '_isValid', '_prev', '_next', '_hasPrev', '_hasNext', '_jumpPrev', '_jumpNext'].forEach(function (method) {
      return _this[method] = _this[method].bind(_this);
    });
    return _this;
  }

  Pagination.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if ('current' in nextProps) {
      this.setState({
        current: nextProps.current,
        _current: nextProps.current
      });
    }

    if ('pageSize' in nextProps) {
      var newState = {};
      var current = this.state.current;
      var newCurrent = this._calcPage(nextProps.pageSize);
      current = current > newCurrent ? newCurrent : current;
      if (!('current' in nextProps)) {
        newState.current = current;
        newState._current = current;
      }
      newState.pageSize = nextProps.pageSize;
      this.setState(newState);
    }
  };

  // private methods

  Pagination.prototype._calcPage = function _calcPage(p) {
    var pageSize = p;
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize;
    }
    var result = Math.floor((this.props.total - 1) / pageSize) + 1;

    if (this.props.shouldLimitTotal && result > 100) {
      return MAX_TOTAL;
    }

    return result;
  };

  Pagination.prototype._isValid = function _isValid(page) {
    return typeof page === 'number' && page >= 1 && page !== this.state.current;
  };

  Pagination.prototype._handleKeyDown = function _handleKeyDown(evt) {
    if (evt.keyCode === KEYCODE.ARROW_UP || evt.keyCode === KEYCODE.ARROW_DOWN) {
      evt.preventDefault();
    }
  };

  Pagination.prototype._handleKeyUp = function _handleKeyUp(evt) {
    var _val = evt.target.value;
    var val = void 0;

    if (_val === '') {
      val = _val;
    } else if (isNaN(Number(_val))) {
      val = this.state._current;
    } else {
      val = Number(_val);
    }

    this.setState({
      _current: val
    });

    if (evt.keyCode === KEYCODE.ENTER) {
      this._handleChange(val);
    } else if (evt.keyCode === KEYCODE.ARROW_UP) {
      this._handleChange(val - 1);
    } else if (evt.keyCode === KEYCODE.ARROW_DOWN) {
      this._handleChange(val + 1);
    }
  };

  Pagination.prototype._changePageSize = function _changePageSize(size) {
    var current = this.state.current;
    var newCurrent = this._calcPage(size);
    current = current > newCurrent ? newCurrent : current;
    if (typeof size === 'number') {
      if (!('pageSize' in this.props)) {
        this.setState({
          pageSize: size
        });
      }
      if (!('current' in this.props)) {
        this.setState({
          current: current,
          _current: current
        });
      }
    }
    this.props.onShowSizeChange(current, size);
  };

  Pagination.prototype._handleChange = function _handleChange(p) {
    var page = p;
    if (this._isValid(page)) {
      if (page > this._calcPage()) {
        page = this._calcPage();
      }

      if (!('current' in this.props)) {
        this.setState({
          current: page,
          _current: page
        });
      }

      this.props.onChange(page);

      return page;
    }

    return this.state.current;
  };

  Pagination.prototype._prev = function _prev() {
    if (this._hasPrev()) {
      this._handleChange(this.state.current - 1);
    }
  };

  Pagination.prototype._next = function _next() {
    if (this._hasNext()) {
      this._handleChange(this.state.current + 1);
    }
  };

  Pagination.prototype._jumpPrev = function _jumpPrev() {
    this._handleChange(Math.max(1, this.state.current - 5));
  };

  Pagination.prototype._jumpNext = function _jumpNext() {
    this._handleChange(Math.min(this._calcPage(), this.state.current + 5));
  };

  Pagination.prototype._hasPrev = function _hasPrev() {
    return this.state.current > 1;
  };

  Pagination.prototype._hasNext = function _hasNext() {
    return this.state.current < this._calcPage();
  };

  Pagination.prototype.render = function render() {
    var props = this.props;
    var locale = this._localeObj;

    var prefixCls = props.prefixCls;
    var allPages = this._calcPage();
    var pagerList = [];
    var jumpPrev = null;
    var jumpNext = null;
    var firstPager = null;
    var lastPager = null;

    var _state = this.state,
        current = _state.current,
        pageSize = _state.pageSize;


    if (props.simple) {
      return React.createElement(
        'ul',
        { className: prefixCls + ' ' + prefixCls + '-simple ' + props.className },
        React.createElement(
          'li',
          {
            title: locale.prev_page,
            onClick: this._prev,
            className: (this._hasPrev() ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-prev'
          },
          React.createElement('a', null)
        ),
        React.createElement(
          'li',
          { title: this.state.current + '/' + allPages, className: prefixCls + '-simple-pager' },
          React.createElement('input', {
            type: 'text',
            value: this.state._current,
            onKeyDown: this._handleKeyDown,
            onKeyUp: this._handleKeyUp,
            onChange: this._handleKeyUp
          }),
          React.createElement(
            'span',
            { className: prefixCls + '-slash' },
            '\uFF0F'
          ),
          allPages
        ),
        React.createElement(
          'li',
          {
            title: locale.next_page,
            onClick: this._next,
            className: (this._hasNext() ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-next'
          },
          React.createElement('a', null)
        )
      );
    }

    if (allPages <= 9) {
      for (var i = 1; i <= allPages; i++) {
        var active = this.state.current === i;
        pagerList.push(React.createElement(Pager, {
          locale: this._localeObj,
          rootPrefixCls: prefixCls,
          onClick: this._handleChange.bind(this, i),
          key: i,
          page: i,
          active: active
        }));
      }
    } else {
      jumpPrev = React.createElement(
        'li',
        {
          title: locale.prev_5,
          key: 'prev',
          onClick: this._jumpPrev,
          className: prefixCls + '-jump-prev'
        },
        React.createElement('a', null)
      );
      jumpNext = React.createElement(
        'li',
        {
          title: locale.next_5,
          key: 'next',
          onClick: this._jumpNext,
          className: prefixCls + '-jump-next'
        },
        React.createElement('a', null)
      );
      lastPager = React.createElement(Pager, {
        locale: this._localeObj,
        last: true,
        rootPrefixCls: prefixCls,
        onClick: this._handleChange.bind(this, allPages),
        key: allPages,
        page: allPages,
        active: false
      });
      firstPager = React.createElement(Pager, {
        locale: this._localeObj,
        rootPrefixCls: prefixCls,
        onClick: this._handleChange.bind(this, 1),
        key: 1,
        page: 1,
        active: false
      });

      var left = Math.max(1, current - 2);
      var right = Math.min(current + 2, allPages);

      if (current - 1 <= 2) {
        right = 1 + 4;
      }

      if (allPages - current <= 2) {
        left = allPages - 4;
      }

      for (var _i = left; _i <= right; _i++) {
        var _active = current === _i;
        pagerList.push(React.createElement(Pager, {
          locale: this._localeObj,
          rootPrefixCls: prefixCls,
          onClick: this._handleChange.bind(this, _i),
          key: _i,
          page: _i,
          active: _active
        }));
      }

      if (current - 1 >= 4) {
        pagerList[0] = React.cloneElement(pagerList[0], {
          className: prefixCls + '-item-after-jump-prev'
        });
        pagerList.unshift(jumpPrev);
      }
      if (allPages - current >= 4) {
        pagerList[pagerList.length - 1] = React.cloneElement(pagerList[pagerList.length - 1], {
          className: prefixCls + '-item-before-jump-next'
        });
        pagerList.push(jumpNext);
      }

      if (left !== 1) {
        pagerList.unshift(firstPager);
      }
      if (right !== allPages) {
        pagerList.push(lastPager);
      }
    }

    var totalText = null;

    if (props.showTotal) {
      totalText = React.createElement(
        'span',
        { className: prefixCls + '-total-text' },
        props.showTotal(props.total, [(current - 1) * pageSize + 1, current * pageSize > props.total ? props.total : current * pageSize])
      );
    }

    return React.createElement(
      'ul',
      {
        className: prefixCls + ' ' + props.className,
        style: props.style,
        unselectable: 'unselectable'
      },
      totalText,
      React.createElement(
        'li',
        {
          title: locale.prev_page,
          onClick: this._prev,
          className: (this._hasPrev() ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-prev'
        },
        React.createElement('a', null)
      ),
      pagerList,
      React.createElement(
        'li',
        {
          title: locale.next_page,
          onClick: this._next,
          className: (this._hasNext() ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-next'
        },
        React.createElement('a', null)
      ),
      React.createElement(Options, {
        locale: this._localeObj,
        rootPrefixCls: prefixCls,
        selectComponentClass: props.selectComponentClass,
        selectPrefixCls: props.selectPrefixCls,
        changeSize: this.props.showSizeChanger ? this._changePageSize.bind(this) : null,
        current: this.state.current,
        pageSize: this.state.pageSize,
        pageSizeOptions: this.props.pageSizeOptions,
        quickGo: this.props.showQuickJumper ? this._handleChange.bind(this) : null
      })
    );
  };

  return Pagination;
}(React.Component);

Pagination.propTypes = {
  current: React.PropTypes.number,
  defaultCurrent: React.PropTypes.number,
  total: React.PropTypes.number,
  pageSize: React.PropTypes.number,
  defaultPageSize: React.PropTypes.number,
  onChange: React.PropTypes.func,
  showSizeChanger: React.PropTypes.bool,
  onShowSizeChange: React.PropTypes.func,
  selectComponentClass: React.PropTypes.func,
  showQuickJumper: React.PropTypes.bool,
  pageSizeOptions: React.PropTypes.arrayOf(React.PropTypes.string),
  showTotal: React.PropTypes.func,
  locale: React.PropTypes.string,
  style: React.PropTypes.object,
  shouldLimitTotal: React.PropTypes.bool
};

Pagination.defaultProps = {
  defaultCurrent: 1,
  total: 0,
  defaultPageSize: 10,
  onChange: noop,
  className: '',
  selectPrefixCls: 'rc-select',
  prefixCls: 'rc-pagination',
  selectComponentClass: null,
  showQuickJumper: false,
  showSizeChanger: false,
  onShowSizeChange: noop,
  locale: DEFAULT_LOCALE,
  style: {},
  shouldLimitTotal: false
};

module.exports = Pagination;