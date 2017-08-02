webpackJsonp([1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = {
    run: function run() {
        _isIE() ? _swiperOnIE() : _loadSwiper();
    }
};

var timeOut = null;

function _isIE() {
    return !!window.ActiveXObject || "ActiveXObject" in window;
}

function _loadSwiper() {
    __webpack_require__.e/* require.ensure */(0).then((function () {

        __webpack_require__(10);

        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false });
    }).bind(null, __webpack_require__))["catch"](__webpack_require__.oe);
}

function _swiperOnIE() {

    var slideArr = $(".swiper-slide"),
        paginationStr = '';

    for (var i = 0; i < slideArr.length; i++) {
        paginationStr += '<span class="swiper-pagination-bullet" data-index="' + i + '"></span>';
    }

    if (paginationStr !== '') {
        _initBannerDom(paginationStr);

        if (slideArr.length > 1) _slideTimeOut();

        _initMouseEvent();
    }
}

function _initBannerDom(paginationStr) {

    $(".swiper-container").addClass('swiper-container-horizontal');
    $(".swiper-pagination").append(paginationStr);

    $(".swiper-slide").each(function (i, o) {
        i === 0 ? $(o).addClass('swiper-slide-active') : $(o).addClass('hidden');
    });

    $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');
}

function _slideTimeOut() {

    timeOut = setTimeout(function () {

        var nextSlide = $(".swiper-slide-active").next('.swiper-slide');
        $(".swiper-slide-active").removeClass('swiper-slide-active').addClass('hidden');
        nextSlide.length > 0 ? nextSlide.addClass('swiper-slide-active').removeClass('hidden') : $($(".swiper-slide")[0]).addClass('swiper-slide-active').removeClass('hidden');

        var nextBullet = $(".swiper-pagination-bullet-active").next('.swiper-pagination-bullet');
        $(".swiper-pagination-bullet-active").removeClass('swiper-pagination-bullet-active');
        nextBullet.length > 0 ? nextBullet.addClass('swiper-pagination-bullet-active') : $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');

        _slideTimeOut();
    }, 5000);
}

function _initMouseEvent() {
    $(".swiper-pagination-bullet").on('click', function () {

        $(".swiper-pagination-bullet").removeClass('swiper-pagination-bullet-active');
        $(this).addClass('swiper-pagination-bullet-active');

        var index = $(this).attr('data-index');
        var img = $('.swiper-slide')[index];
        $('.swiper-slide').addClass('hidden');
        $(img).removeClass('hidden');

        clearTimeout(timeOut);
        _slideTimeOut();
    });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = {
    run: function run() {
        _loadAds();
    }
};

var hotSalesT = __webpack_require__(15);

var hotSeasonD = __webpack_require__(12);

function _loadAds() {
    if (hotSeasonD.returnCode === 1) {
        $("#hotSalesWrap").html(hotSalesT({ arr: hotSeasonD.data }));
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = {
    run: function run() {
        _loadInternalAds();

        _initNationSwithClick();
    }
};

var internalRecommandsT = __webpack_require__(16);

var internalRecommandsD = __webpack_require__(13);

function _loadInternalAds() {
    if (internalRecommandsD.returnCode === 1) {
        $("#internalRecommandsWrap").html(internalRecommandsT({ arr: internalRecommandsD.data.gnAds }));
    }
}

function _initNationSwithClick() {
    $(".ads-title-item").on('click', function () {
        var _this = $(this);
        if (_this.hasClass('current')) return;

        _this.parent().find('.ads-title-item').removeClass('current');
        _this.addClass('current');

        var target = _this.attr('data-for');
        var arr = _this.closest('.ads-wrap').find('.toggle-show');
        arr.addClass('hidden');
        arr.filter(function (i, o) {
            return $(o).attr('data-target') == target;
        }).removeClass('hidden');
    });
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {


module.exports = {
	run: function run() {
		_initSearchTypeSwithClick();
	}
};

function _initSearchTypeSwithClick() {
	$("li.s-tab-item").on('click', function () {
		var _this = $(this);
		if (_this.hasClass('current')) return;

		_this.parent().find('.s-tab-item').removeClass('current');
		_this.addClass('current');

		var target = _this.attr('data-for');
		var arr = $('.s-box-wrap .s-box');
		arr.removeClass('current');
		arr.filter(function (i, o) {
			return $(o).attr('data-target') == target;
		}).addClass('current');
	});
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(19);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));
//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17), __webpack_require__(18)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


window.Promise = __webpack_require__(4);

__webpack_require__(6);
__webpack_require__(5);
__webpack_require__(9);
__webpack_require__(7);

__webpack_require__(0).run();
__webpack_require__(3).run();
__webpack_require__(1).run();
__webpack_require__(2).run();

/***/ }),
/* 12 */
/***/ (function(module, exports) {



var j = {
    "returnCode": 1,
    "returnMsg": "请求成功！",
    "data": [{
        "adId": 931,
        "channel": 1,
        "channelName": "房掌柜首页",
        "block": 5,
        "blockName": "当季热销",
        "sort": 0,
        "adTitle": "Wyndham Sao Paulo Berrini Hotel",
        "adImg": "http://image.jladmin.cn/real_1497853531821.jpg",
        "adLink": "/biz/hotel/internalhotel/roomTypeDetailIn.jsp?hotelId=1828&checkin=2017-06-27&checkout=2017-06-28",
        "adEffect": 1,
        "startTime": "2017-06-01 00:00:00",
        "endTime": "2018-06-19 00:00:00",
        "hotelId": 1828,
        "active": 0,
        "createTime": "2017-06-26 11:49:28",
        "createBy": "qingjian",
        "updateTime": "2017-06-26 11:49:28",
        "updateBy": "qingjian"
    }, {
        "adId": 932,
        "channel": 1,
        "channelName": "房掌柜首页",
        "block": 5,
        "blockName": "当季热销",
        "sort": 1,
        "adTitle": "佛山南海名都大酒店",
        "adImg": "http://image.jladmin.cn/real_1497855797519.jpg",
        "adLink": "/biz/hotel/internalhotel/roomTypeDetailIn.jsp?hotelId=455&checkin=2017-06-27&checkout=2017-06-28",
        "adEffect": 1,
        "startTime": "2017-06-01 00:00:00",
        "endTime": "2018-07-08 00:00:00",
        "hotelId": 455,
        "active": 0,
        "createTime": "2017-06-26 11:49:04",
        "createBy": "qingjian",
        "updateTime": "2017-06-26 11:49:04",
        "updateBy": "qingjian"
    }, {
        "adId": 932,
        "channel": 1,
        "channelName": "房掌柜首页",
        "block": 5,
        "blockName": "当季热销",
        "sort": 1,
        "adTitle": "佛山南海名都大酒店",
        "adImg": "http://image.jladmin.cn/real_1497855797519.jpg",
        "adLink": "/biz/hotel/internalhotel/roomTypeDetailIn.jsp?hotelId=455&checkin=2017-06-27&checkout=2017-06-28",
        "adEffect": 1,
        "startTime": "2017-06-01 00:00:00",
        "endTime": "2018-07-08 00:00:00",
        "hotelId": 455,
        "active": 0,
        "createTime": "2017-06-26 11:49:04",
        "createBy": "qingjian",
        "updateTime": "2017-06-26 11:49:04",
        "updateBy": "qingjian"
    }, {
        "adId": 932,
        "channel": 1,
        "channelName": "房掌柜首页",
        "block": 5,
        "blockName": "当季热销",
        "sort": 1,
        "adTitle": "佛山南海名都大酒店",
        "adImg": "http://image.jladmin.cn/real_1497855797519.jpg",
        "adLink": "/biz/hotel/internalhotel/roomTypeDetailIn.jsp?hotelId=455&checkin=2017-06-27&checkout=2017-06-28",
        "adEffect": 1,
        "startTime": "2017-06-01 00:00:00",
        "endTime": "2018-07-08 00:00:00",
        "hotelId": 455,
        "active": 0,
        "createTime": "2017-06-26 11:49:04",
        "createBy": "qingjian",
        "updateTime": "2017-06-26 11:49:04",
        "updateBy": "qingjian"
    }, {
        "adId": 932,
        "channel": 1,
        "channelName": "房掌柜首页",
        "block": 5,
        "blockName": "当季热销",
        "sort": 1,
        "adTitle": "佛山南海名都大酒店",
        "adImg": "http://image.jladmin.cn/real_1497855797519.jpg",
        "adLink": "/biz/hotel/internalhotel/roomTypeDetailIn.jsp?hotelId=455&checkin=2017-06-27&checkout=2017-06-28",
        "adEffect": 1,
        "startTime": "2017-06-01 00:00:00",
        "endTime": "2018-07-08 00:00:00",
        "hotelId": 455,
        "active": 0,
        "createTime": "2017-06-26 11:49:04",
        "createBy": "qingjian",
        "updateTime": "2017-06-26 11:49:04",
        "updateBy": "qingjian"
    }, {
        "adId": 932,
        "channel": 1,
        "channelName": "房掌柜首页",
        "block": 5,
        "blockName": "当季热销",
        "sort": 1,
        "adTitle": "佛山南海名都大酒店",
        "adImg": "http://image.jladmin.cn/real_1497855797519.jpg",
        "adLink": "/biz/hotel/internalhotel/roomTypeDetailIn.jsp?hotelId=455&checkin=2017-06-27&checkout=2017-06-28",
        "adEffect": 1,
        "startTime": "2017-06-01 00:00:00",
        "endTime": "2018-07-08 00:00:00",
        "hotelId": 455,
        "active": 0,
        "createTime": "2017-06-26 11:49:04",
        "createBy": "qingjian",
        "updateTime": "2017-06-26 11:49:04",
        "updateBy": "qingjian"
    }]
};

module.exports = j;

/***/ }),
/* 13 */
/***/ (function(module, exports) {


module.exports = {
    "dataList": null,
    "returnCode": 1,
    "returnMsg": "请求成功！",
    "data": {
        "gnTitle": [""],
        "gnAds": [{
            "adId": 943,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 3,
            "adTitle": "深圳金茂JW万豪酒店",
            "adImg": "http://image.jladmin.cn/real_1498546153063.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=35419&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-11-23 00:00:00",
            "hotelId": 35419,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:49:21",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:49:21",
            "updateBy": "qingjian"
        }, {
            "adId": 944,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 4,
            "adTitle": "维也纳酒店(深圳松岗万兆广场店)",
            "adImg": "http://image.jladmin.cn/real_1498546181802.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=72144&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-10-18 00:00:00",
            "hotelId": 72144,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:49:47",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:49:47",
            "updateBy": "qingjian"
        }, {
            "adId": 942,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 4,
            "adTitle": "佛山南海名都大酒店",
            "adImg": "http://image.jladmin.cn/real_1498544866130.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=455&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-10-18 00:00:00",
            "hotelId": 455,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:27:52",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:27:52",
            "updateBy": "qingjian"
        }, {
            "adId": 945,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 5,
            "adTitle": "深圳皇轩酒店",
            "adImg": "http://image.jladmin.cn/real_1498546208882.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=84&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-20 00:00:00",
            "endTime": "2017-12-22 00:00:00",
            "hotelId": 84,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:50:14",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:50:14",
            "updateBy": "qingjian"
        }, {
            "adId": 946,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 6,
            "adTitle": "深圳绿景锦江酒店",
            "adImg": "http://image.jladmin.cn/real_1498546238001.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=90&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-12-28 00:00:00",
            "hotelId": 90,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:50:44",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:50:44",
            "updateBy": "qingjian"
        }, {
            "adId": 947,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 7,
            "adTitle": "深圳华强广场酒店",
            "adImg": "http://image.jladmin.cn/real_1498546257602.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=35701&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-12-27 00:00:00",
            "hotelId": 35701,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:51:03",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:51:03",
            "updateBy": "qingjian"
        }, {
            "adId": 948,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 8,
            "adTitle": "深圳大中华喜来登酒店",
            "adImg": "http://image.jladmin.cn/real_1498546277653.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=81&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-12-27 00:00:00",
            "hotelId": 81,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:51:22",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:51:22",
            "updateBy": "qingjian"
        }, {
            "adId": 949,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 9,
            "adTitle": "深圳东华假日酒店",
            "adImg": "http://image.jladmin.cn/real_1498546304316.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=676&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-12-27 00:00:00",
            "hotelId": 676,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:51:51",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:51:51",
            "updateBy": "qingjian"
        }, {
            "adId": 950,
            "channel": 1,
            "channelName": "房掌柜首页",
            "block": 6,
            "blockName": "国内酒店",
            "sort": 10,
            "adTitle": "深圳中洲万豪酒店",
            "adImg": "http://image.jladmin.cn/real_1498546373572.jpg",
            "adLink": "/roomTypeDetail/queryHotelBaseInfo.do?hotelId=35680&checkin=2017-06-27&checkout=2017-06-28",
            "adEffect": 1,
            "startTime": "2017-06-27 00:00:00",
            "endTime": "2017-12-30 00:00:00",
            "hotelId": 35680,
            "hotelType": 0,
            "active": 0,
            "createTime": "2017-06-27 14:52:55",
            "createBy": "qingjian",
            "updateTime": "2017-06-27 14:52:55",
            "updateBy": "qingjian"
        }]
    }
};

/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--当季热销模板-->\r\n';
 for(var i = 0; i < 5; i++) {;
__p += '\r\n    <li class="ad-one-wrap ' +
((__t = ( (i % 5 == 4 ? 'last-child' : '') )) == null ? '' : __t) +
'" data-src="' +
((__t = ( arr[i].adLink )) == null ? '' : __t) +
'">\r\n        <img src="' +
((__t = ( arr[i].adImg )) == null ? '' : __t) +
'" class="too-width" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">' +
((__t = ( arr[i].adTitle )) == null ? '' : __t) +
'</p>\r\n    </li>\r\n';
 } ;


}
return __p
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!--房掌柜首页，国内酒店模板-->\r\n';
 for(var i = 0; i < 9; i++) {;
__p += '\r\n<li class="ad-one-wrap ' +
((__t = ( (i % 9 === 8 ? 'last-child' : '' ) )) == null ? '' : __t) +
'" data-src="' +
((__t = ( arr[i].adLink )) == null ? '' : __t) +
'">\r\n    <img src="' +
((__t = ( arr[i].adImg )) == null ? '' : __t) +
'" class="too-width">\r\n    <div class="ad-one-shadow"></div>\r\n    <p class="ad-one-text">' +
((__t = ( arr[i].adTitle )) == null ? '' : __t) +
'</p>\r\n</li>\r\n';
 } ;
__p += '\r\n';

}
return __p
}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 18 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
],[11]);
//# sourceMappingURL=index.d66909f9b479c31aab89.js.map