webpackJsonp([3],[
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
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
    var vertx = __webpack_require__(7);
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(6)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {


var timeOut = null;

var bannerT = __webpack_require__(42);

function loadBannerImg() {
    $("#bannerWrap").html(bannerT());
}

function isIE() {
    return !!window.ActiveXObject || "ActiveXObject" in window;
}

function loadSwiper() {
    __webpack_require__.e/* require.ensure */(1).then((function () {

        __webpack_require__(57);

        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false });
    }).bind(null, __webpack_require__))["catch"](__webpack_require__.oe);
}

function swiperOnIE() {

    var slideArr = $(".swiper-slide"),
        paginationStr = '';

    for (var i = 0; i < slideArr.length; i++) {
        paginationStr += '<span class="swiper-pagination-bullet" data-index="' + i + '"></span>';
    }

    if (paginationStr !== '') {
        initBannerDom(paginationStr);

        if (slideArr.length > 1) slideTimeOut();

        initMouseEvent();
    }
}

function initBannerDom(paginationStr) {

    $(".swiper-container").addClass('swiper-container-horizontal');
    $(".swiper-pagination").append(paginationStr);

    $(".swiper-slide").each(function (i, o) {
        i === 0 ? $(o).addClass('swiper-slide-active') : $(o).addClass('hidden');
    });

    $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');
}

function slideTimeOut() {

    timeOut = setTimeout(function () {

        var nextSlide = $(".swiper-slide-active").next('.swiper-slide');
        $(".swiper-slide-active").removeClass('swiper-slide-active').addClass('hidden');
        nextSlide.length > 0 ? nextSlide.addClass('swiper-slide-active').removeClass('hidden') : $($(".swiper-slide")[0]).addClass('swiper-slide-active').removeClass('hidden');

        var nextBullet = $(".swiper-pagination-bullet-active").next('.swiper-pagination-bullet');
        $(".swiper-pagination-bullet-active").removeClass('swiper-pagination-bullet-active');
        nextBullet.length > 0 ? nextBullet.addClass('swiper-pagination-bullet-active') : $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');

        slideTimeOut();
    }, 5000);
}

function initMouseEvent() {
    $(".swiper-pagination-bullet").on('click', function () {

        $(".swiper-pagination-bullet").removeClass('swiper-pagination-bullet-active');
        $(this).addClass('swiper-pagination-bullet-active');

        var index = $(this).attr('data-index');
        var img = $('.swiper-slide')[index];
        $('.swiper-slide').addClass('hidden');
        $(img).removeClass('hidden');

        clearTimeout(timeOut);
        slideTimeOut();
    });
}

module.exports = {
    run: function run() {
        loadBannerImg();

        isIE() ? swiperOnIE() : loadSwiper();
    }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


var hotSalesT = __webpack_require__(43);

var hotSeasonD = __webpack_require__(33);

function loadAds() {
    if (hotSeasonD.returnCode === 1) {
        $("#hotSalesWrap").html(hotSalesT({ arr: hotSeasonD.data }));
    }
}

module.exports = {
    run: function run() {
        loadAds();
    }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {


var hotelRecommands = __webpack_require__(44);

var internalRecommandsD = __webpack_require__(34);

function loadInternalAds() {
    if (internalRecommandsD.returnCode === 1) {
        $("#hotelRecommands").html(hotelRecommands({ arr: internalRecommandsD.data.gnAds }));
    }
}

function initNationSwithClick() {
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

module.exports = {
    run: function run() {
        loadInternalAds();

        initNationSwithClick();
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


var promotionT = __webpack_require__(45);

function initPromotion() {
    $("#promotion").html(promotionT());
}

module.exports = {
    run: function run() {
        initPromotion();
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


var searchT = __webpack_require__(46);

var selectCity = __webpack_require__(30);

function fillSearchHtml() {
    $("#searchWrap").html(searchT());
}

function initSearchTypeSwithClick() {
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

    $('.s-h-item').on('click', function () {
        $('.aim-city').val("");

        $(this).addClass('current').siblings().removeClass('current');

        var isAbroad = $(this).text();
        if (isAbroad == '国内酒店') {
            selectCity.run(false);
        } else {
            selectCity.run(true);
        }
    });
}

module.exports = {
    run: function run() {
        fillSearchHtml();

        initSearchTypeSwithClick();

        selectCity.run(false);
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


var ticketT = __webpack_require__(47);

function initTicketItems() {
    $("#ticketWrap").html(ticketT());
}

module.exports = {
    run: function run() {
        initTicketItems();
    }
};

/***/ }),
/* 20 */,
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 27 */,
/* 28 */
/***/ (function(module, exports) {

var citys = [{
	"w": "A",
	"t": "0",
	"n": "阿坝州",
	"i": "30001304"
}, {
	"w": "A",
	"t": "0",
	"n": "阿尔山",
	"i": "30001189"
}, {
	"w": "A",
	"t": "0",
	"n": "阿合奇县",
	"i": "30001334"
}, {
	"w": "A",
	"t": "0",
	"n": "安吉",
	"i": "30000164"
}, {
	"w": "A",
	"t": "0",
	"n": "安康",
	"i": "30001314"
}, {
	"w": "A",
	"t": "0",
	"n": "阿克苏",
	"i": "30001308"
}, {
	"w": "A",
	"t": "0",
	"n": "阿里",
	"i": "30000585"
}, {
	"w": "A",
	"t": "0",
	"n": "阿拉善盟",
	"i": "30001001"
}, {
	"w": "A",
	"t": "0",
	"n": "阿勒泰",
	"i": "161"
}, {
	"w": "G",
	"t": "0",
	"n": "安龙县",
	"i": "30001218"
}, {
	"w": "A",
	"t": "0",
	"n": "安庆",
	"i": "70072"
}, {
	"w": "G",
	"t": "0",
	"n": "安顺",
	"i": "30001217"
}, {
	"w": "A",
	"t": "0",
	"n": "安顺",
	"i": "30000068"
}, {
	"w": "A",
	"t": "0",
	"n": "鞍山",
	"i": "70125"
}, {
	"w": "A",
	"t": "0",
	"n": "安图",
	"i": "30000457"
}, {
	"w": "A",
	"t": "0",
	"n": "安阳",
	"i": "30000188"
}, {
	"w": "B",
	"t": "0",
	"n": "博鳌",
	"i": "70031"
}, {
	"w": "B",
	"t": "0",
	"n": "蚌埠",
	"i": "70133"
}, {
	"w": "B",
	"t": "0",
	"n": "白城",
	"i": "30001394"
}, {
	"w": "B",
	"t": "0",
	"n": "保定",
	"i": "70092"
}, {
	"w": "B",
	"t": "0",
	"n": "北戴河",
	"i": "70090"
}, {
	"w": "B",
	"t": "0",
	"n": "布尔津县",
	"i": "30001309"
}, {
	"w": "B",
	"t": "0",
	"n": "布尔津",
	"i": "30000581"
}, {
	"w": "B",
	"t": "0",
	"n": "博尔塔拉",
	"i": "30001310"
}, {
	"w": "B",
	"t": "0",
	"n": "白沟",
	"i": "30001389"
}, {
	"w": "B",
	"t": "0",
	"n": "北海",
	"i": "70134"
}, {
	"w": "B",
	"t": "0",
	"n": "毕节",
	"i": "30000887"
}, {
	"w": "B",
	"t": "0",
	"n": "宝鸡",
	"i": "70048"
}, {
	"w": "B",
	"t": "0",
	"n": "北京",
	"i": "70082"
}, {
	"w": "B",
	"t": "0",
	"n": "博乐",
	"i": "30001339"
}, {
	"w": "B",
	"t": "0",
	"n": "巴马",
	"i": "30001335"
}, {
	"w": "B",
	"t": "0",
	"n": "百色",
	"i": "30000838"
}, {
	"w": "B",
	"t": "0",
	"n": "白沙",
	"i": "30000981"
}, {
	"w": "B",
	"t": "0",
	"n": "保山",
	"i": "30001283"
}, {
	"w": "B",
	"t": "0",
	"n": "坝上",
	"i": "30001388"
}, {
	"w": "B",
	"t": "0",
	"n": "白山",
	"i": "30001243"
}, {
	"w": "B",
	"t": "0",
	"n": "保亭",
	"i": "30000199"
}, {
	"w": "B",
	"t": "0",
	"n": "北屯市",
	"i": "30001338"
}, {
	"w": "B",
	"t": "0",
	"n": "包头",
	"i": "70107"
}, {
	"w": "B",
	"t": "0",
	"n": "本溪",
	"i": "30000178"
}, {
	"w": "B",
	"t": "0",
	"n": "白银",
	"i": "30001205"
}, {
	"w": "B",
	"t": "0",
	"n": "巴音郭楞",
	"i": "30001336"
}, {
	"w": "B",
	"t": "0",
	"n": "巴彦淖尔",
	"i": "30001262"
}, {
	"w": "B",
	"t": "0",
	"n": "巴中",
	"i": "30001337"
}, {
	"w": "B",
	"t": "0",
	"n": "霸州",
	"i": "30001197"
}, {
	"w": "B",
	"t": "0",
	"n": "滨州",
	"i": "30000657"
}, {
	"w": "C",
	"t": "0",
	"n": "赤壁",
	"i": "30001005"
}, {
	"w": "C",
	"t": "0",
	"n": "长白山",
	"i": "30000973"
}, {
	"w": "C",
	"t": "0",
	"n": "长白山池北",
	"i": "30001241"
}, {
	"w": "C",
	"t": "0",
	"n": "长白山池西",
	"i": "30001242"
}, {
	"w": "C",
	"t": "0",
	"n": "长春",
	"i": "70114"
}, {
	"w": "C",
	"t": "0",
	"n": "常德",
	"i": "30000698"
}, {
	"w": "C",
	"t": "0",
	"n": "成都",
	"i": "70038"
}, {
	"w": "C",
	"t": "0",
	"n": "昌都",
	"i": "30001319"
}, {
	"w": "C",
	"t": "0",
	"n": "承德",
	"i": "70091"
}, {
	"w": "C",
	"t": "0",
	"n": "赤峰",
	"i": "30000777"
}, {
	"w": "C",
	"t": "0",
	"n": "澄海",
	"i": "70148"
}, {
	"w": "C",
	"t": "0",
	"n": "巢湖",
	"i": "30000156"
}, {
	"w": "C",
	"t": "0",
	"n": "昌江",
	"i": "30000982"
}, {
	"w": "C",
	"t": "0",
	"n": "昌吉",
	"i": "30001307"
}, {
	"w": "C",
	"t": "0",
	"n": "查济",
	"i": "30001384"
}, {
	"w": "C",
	"t": "0",
	"n": "昌黎",
	"i": "30000420"
}, {
	"w": "C",
	"t": "0",
	"n": "澄迈县",
	"i": "30000978"
}, {
	"w": "C",
	"t": "0",
	"n": "长沙",
	"i": "70025"
}, {
	"w": "C",
	"t": "0",
	"n": "赤水",
	"i": "30000991"
}, {
	"w": "C",
	"t": "0",
	"n": "常熟",
	"i": "30000149"
}, {
	"w": "C",
	"t": "0",
	"n": "楚雄",
	"i": "30000194"
}, {
	"w": "C",
	"t": "0",
	"n": "慈溪",
	"i": "30000240"
}, {
	"w": "C",
	"t": "0",
	"n": "长兴",
	"i": "30001273"
}, {
	"w": "C",
	"t": "0",
	"n": "潮阳",
	"i": "30000075"
}, {
	"w": "C",
	"t": "0",
	"n": "朝阳",
	"i": "30000964"
}, {
	"w": "C",
	"t": "0",
	"n": "潮州",
	"i": "70135"
}, {
	"w": "C",
	"t": "0",
	"n": "郴州",
	"i": "30000697"
}, {
	"w": "C",
	"t": "0",
	"n": "常州",
	"i": "70154"
}, {
	"w": "C",
	"t": "0",
	"n": "滁州",
	"i": "30000158"
}, {
	"w": "C",
	"t": "0",
	"n": "池州",
	"i": "30000992"
}, {
	"w": "C",
	"t": "0",
	"n": "沧州",
	"i": "30000990"
}, {
	"w": "C",
	"t": "0",
	"n": "长治",
	"i": "30001145"
}, {
	"w": "C",
	"t": "0",
	"n": "川主寺",
	"i": "30001306"
}, {
	"w": "D",
	"t": "0",
	"n": "定安县",
	"i": "30000897"
}, {
	"w": "D",
	"t": "0",
	"n": "德保县",
	"i": "30001340"
}, {
	"w": "D",
	"t": "0",
	"n": "丹巴县",
	"i": "30001301"
}, {
	"w": "D",
	"t": "0",
	"n": "东莞",
	"i": "70007"
}, {
	"w": "D",
	"t": "0",
	"n": "丹东",
	"i": "70126"
}, {
	"w": "D",
	"t": "0",
	"n": "登封",
	"i": "30000778"
}, {
	"w": "D",
	"t": "0",
	"n": "东方",
	"i": "30000976"
}, {
	"w": "D",
	"t": "0",
	"n": "东港",
	"i": "30001259"
}, {
	"w": "D",
	"t": "0",
	"n": "敦煌",
	"i": "70057"
}, {
	"w": "D",
	"t": "0",
	"n": "敦化",
	"i": "30001244"
}, {
	"w": "D",
	"t": "0",
	"n": "德宏州",
	"i": "30001278"
}, {
	"w": "D",
	"t": "0",
	"n": "都江堰",
	"i": "30000337"
}, {
	"w": "D",
	"t": "0",
	"n": "大理",
	"i": "70034"
}, {
	"w": "D",
	"t": "0",
	"n": "大连",
	"i": "70120"
}, {
	"w": "D",
	"t": "0",
	"n": "德令哈",
	"i": "30001323"
}, {
	"w": "D",
	"t": "0",
	"n": "德清",
	"i": "30000165"
}, {
	"w": "D",
	"t": "0",
	"n": "大庆",
	"i": "70111"
}, {
	"w": "D",
	"t": "0",
	"n": "迪庆州",
	"i": "30001276"
}, {
	"w": "D",
	"t": "0",
	"n": "大石桥",
	"i": "30001257"
}, {
	"w": "G",
	"t": "0",
	"n": "独山县",
	"i": "30001220"
}, {
	"w": "D",
	"t": "0",
	"n": "大同",
	"i": "70104"
}, {
	"w": "D",
	"t": "0",
	"n": "定西市",
	"i": "30001207"
}, {
	"w": "D",
	"t": "0",
	"n": "大兴安岭",
	"i": "30000994"
}, {
	"w": "D",
	"t": "0",
	"n": "都匀",
	"i": "30000890"
}, {
	"w": "D",
	"t": "0",
	"n": "大邑",
	"i": "30001344"
}, {
	"w": "D",
	"t": "0",
	"n": "德阳",
	"i": "30000577"
}, {
	"w": "D",
	"t": "0",
	"n": "东阳",
	"i": "30001272"
}, {
	"w": "D",
	"t": "0",
	"n": "东营",
	"i": "30000498"
}, {
	"w": "D",
	"t": "0",
	"n": "儋州",
	"i": "30000977"
}, {
	"w": "D",
	"t": "0",
	"n": "达州",
	"i": "30000989"
}, {
	"w": "D",
	"t": "0",
	"n": "邓州",
	"i": "30001226"
}, {
	"w": "D",
	"t": "0",
	"n": "德州",
	"i": "30000185"
}, {
	"w": "E",
	"t": "0",
	"n": "鄂尔多斯",
	"i": "30000237"
}, {
	"w": "E",
	"t": "0",
	"n": "额济纳旗",
	"i": "30001263"
}, {
	"w": "E",
	"t": "0",
	"n": "二连浩特",
	"i": "30001264"
}, {
	"w": "E",
	"t": "0",
	"n": "峨眉山",
	"i": "30000141"
}, {
	"w": "E",
	"t": "0",
	"n": "恩平",
	"i": "70017"
}, {
	"w": "E",
	"t": "0",
	"n": "恩施",
	"i": "30000542"
}, {
	"w": "E",
	"t": "0",
	"n": "鄂州",
	"i": "30001232"
}, {
	"w": "F",
	"t": "0",
	"n": "丰城",
	"i": "30001254"
}, {
	"w": "F",
	"t": "0",
	"n": "凤城",
	"i": "30001258"
}, {
	"w": "F",
	"t": "0",
	"n": "防城港",
	"i": "30000840"
}, {
	"w": "F",
	"t": "0",
	"n": "防城港",
	"i": "30001386"
}, {
	"w": "F",
	"t": "0",
	"n": "福鼎",
	"i": "30000231"
}, {
	"w": "F",
	"t": "0",
	"n": "奉化",
	"i": "30000071"
}, {
	"w": "F",
	"t": "0",
	"n": "凤凰县",
	"i": "30000438"
}, {
	"w": "F",
	"t": "0",
	"n": "阜康市",
	"i": "30001311"
}, {
	"w": "F",
	"t": "0",
	"n": "佛山",
	"i": "70004"
}, {
	"w": "F",
	"t": "0",
	"n": "凤山县",
	"i": "30001387"
}, {
	"w": "F",
	"t": "0",
	"n": "抚顺",
	"i": "70124"
}, {
	"w": "F",
	"t": "0",
	"n": "富藴县",
	"i": "30001312"
}, {
	"w": "F",
	"t": "0",
	"n": "阜新",
	"i": "70123"
}, {
	"w": "F",
	"t": "0",
	"n": "富阳",
	"i": "30000152"
}, {
	"w": "F",
	"t": "0",
	"n": "阜阳",
	"i": "30000157"
}, {
	"w": "F",
	"t": "0",
	"n": "抚州",
	"i": "30000797"
}, {
	"w": "F",
	"t": "0",
	"n": "福州",
	"i": "70078"
}, {
	"w": "G",
	"t": "0",
	"n": "广安",
	"i": "30000319"
}, {
	"w": "G",
	"t": "0",
	"n": "贵德县",
	"i": "30001325"
}, {
	"w": "G",
	"t": "0",
	"n": "格尔木",
	"i": "30000974"
}, {
	"w": "G",
	"t": "0",
	"n": "贵港",
	"i": "30000699"
}, {
	"w": "G",
	"t": "0",
	"n": "共和县",
	"i": "30001322"
}, {
	"w": "G",
	"t": "0",
	"n": "桂林",
	"i": "70020"
}, {
	"w": "G",
	"t": "0",
	"n": "果洛藏族自治州",
	"i": "30001341"
}, {
	"w": "G",
	"t": "0",
	"n": "甘南",
	"i": "30001206"
}, {
	"w": "G",
	"t": "0",
	"n": "贵阳",
	"i": "70036"
}, {
	"w": "G",
	"t": "0",
	"n": "广元",
	"i": "30000322"
}, {
	"w": "G",
	"t": "0",
	"n": "固原",
	"i": "30001284"
}, {
	"w": "G",
	"t": "0",
	"n": "广州",
	"i": "70011"
}, {
	"w": "G",
	"t": "0",
	"n": "赣州",
	"i": "70077"
}, {
	"w": "G",
	"t": "0",
	"n": "甘孜州",
	"i": "30001302"
}, {
	"w": "H",
	"t": "0",
	"n": "淮安",
	"i": "30000221"
}, {
	"w": "H",
	"t": "0",
	"n": "淮北",
	"i": "30000159"
}, {
	"w": "H",
	"t": "0",
	"n": "鹤壁",
	"i": "30000540"
}, {
	"w": "H",
	"t": "0",
	"n": "海北",
	"i": "30001326"
}, {
	"w": "H",
	"t": "0",
	"n": "河池",
	"i": "30000892"
}, {
	"w": "H",
	"t": "0",
	"n": "韩城",
	"i": "30000618"
}, {
	"w": "H",
	"t": "0",
	"n": "珲春",
	"i": "30001246"
}, {
	"w": "H",
	"t": "0",
	"n": "海城",
	"i": "70128"
}, {
	"w": "H",
	"t": "0",
	"n": "横店",
	"i": "30001271"
}, {
	"w": "H",
	"t": "0",
	"n": "邯郸",
	"i": "70094"
}, {
	"w": "H",
	"t": "0",
	"n": "海东市",
	"i": "30001324"
}, {
	"w": "H",
	"t": "0",
	"n": "洪洞县",
	"i": "30001313"
}, {
	"w": "H",
	"t": "0",
	"n": "哈尔滨",
	"i": "70108"
}, {
	"w": "H",
	"t": "0",
	"n": "合肥",
	"i": "70070"
}, {
	"w": "H",
	"t": "0",
	"n": "黄冈",
	"i": "30001233"
}, {
	"w": "H",
	"t": "0",
	"n": "鹤岗",
	"i": "30000183"
}, {
	"w": "H",
	"t": "0",
	"n": "怀化",
	"i": "30000883"
}, {
	"w": "H",
	"t": "0",
	"n": "黑河",
	"i": "30000659"
}, {
	"w": "H",
	"t": "0",
	"n": "呼和浩特",
	"i": "70106"
}, {
	"w": "H",
	"t": "0",
	"n": "红河州",
	"i": "30001275"
}, {
	"w": "H",
	"t": "0",
	"n": "和静县",
	"i": "30001342"
}, {
	"w": "H",
	"t": "0",
	"n": "杭锦后旗",
	"i": "30001393"
}, {
	"w": "H",
	"t": "0",
	"n": "海口",
	"i": "70029"
}, {
	"w": "H",
	"t": "0",
	"n": "贺兰县",
	"i": "30001343"
}, {
	"w": "H",
	"t": "0",
	"n": "海林",
	"i": "30001249"
}, {
	"w": "H",
	"t": "0",
	"n": "和龙",
	"i": "30001247"
}, {
	"w": "H",
	"t": "0",
	"n": "呼伦贝尔",
	"i": "30000999"
}, {
	"w": "H",
	"t": "0",
	"n": "葫芦岛",
	"i": "70122"
}, {
	"w": "H",
	"t": "0",
	"n": "海拉尔",
	"i": "30000557"
}, {
	"w": "H",
	"t": "0",
	"n": "海螺沟",
	"i": "30000323"
}, {
	"w": "H",
	"t": "0",
	"n": "和林格尔",
	"i": "30001390"
}, {
	"w": "W",
	"t": "0",
	"n": "乌拉特中旗",
	"i": "30001391"
}, {
	"w": "H",
	"t": "0",
	"n": "哈密",
	"i": "30001300"
}, {
	"w": "H",
	"t": "0",
	"n": "海宁",
	"i": "30000248"
}, {
	"w": "H",
	"t": "0",
	"n": "淮南",
	"i": "30000160"
}, {
	"w": "H",
	"t": "0",
	"n": "黄南藏族自治州",
	"i": "30001327"
}, {
	"w": "H",
	"t": "0",
	"n": "海南藏族自治州",
	"i": "30001328"
}, {
	"w": "H",
	"t": "0",
	"n": "鹤山",
	"i": "30000074"
}, {
	"w": "H",
	"t": "0",
	"n": "黄石",
	"i": "30000962"
}, {
	"w": "H",
	"t": "0",
	"n": "黄山",
	"i": "70071"
}, {
	"w": "H",
	"t": "0",
	"n": "衡水",
	"i": "30000537"
}, {
	"w": "H",
	"t": "0",
	"n": "和田",
	"i": "30001299"
}, {
	"w": "H",
	"t": "0",
	"n": "呼图壁县",
	"i": "30001298"
}, {
	"w": "H",
	"t": "0",
	"n": "海西蒙古族自治州",
	"i": "30001329"
}, {
	"w": "H",
	"t": "0",
	"n": "河源",
	"i": "70137"
}, {
	"w": "H",
	"t": "0",
	"n": "衡阳",
	"i": "70027"
}, {
	"w": "H",
	"t": "0",
	"n": "海晏",
	"i": "30001330"
}, {
	"w": "H",
	"t": "0",
	"n": "海盐",
	"i": "30000249"
}, {
	"w": "H",
	"t": "0",
	"n": "海阳",
	"i": "30001196"
}, {
	"w": "H",
	"t": "0",
	"n": "惠州",
	"i": "70136"
}, {
	"w": "H",
	"t": "0",
	"n": "贺州",
	"i": "30000839"
}, {
	"w": "h",
	"t": "0",
	"n": "汉中",
	"i": "30000640"
}, {
	"w": "H",
	"t": "0",
	"n": "湖州",
	"i": "30000146"
}, {
	"w": "H",
	"t": "0",
	"n": "杭州",
	"i": "70059"
}, {
	"w": "H",
	"t": "0",
	"n": "亳州",
	"i": "30000975"
}, {
	"w": "H",
	"t": "0",
	"n": "菏泽",
	"i": "30000968"
}, {
	"w": "J",
	"t": "0",
	"n": "吉安",
	"i": "30000519"
}, {
	"w": "J",
	"t": "0",
	"n": "集安",
	"i": "30001245"
}, {
	"w": "J",
	"t": "0",
	"n": "金昌",
	"i": "30001209"
}, {
	"w": "J",
	"t": "0",
	"n": "晋城",
	"i": "30000480"
}, {
	"w": "J",
	"t": "0",
	"n": "建德",
	"i": "30000229"
}, {
	"w": "J",
	"t": "0",
	"n": "江都",
	"i": "30000238"
}, {
	"w": "J",
	"t": "0",
	"n": "景德镇",
	"i": "70075"
}, {
	"w": "J",
	"t": "0",
	"n": "井冈山",
	"i": "30000218"
}, {
	"w": "J",
	"t": "0",
	"n": "金华",
	"i": "30000145"
}, {
	"w": "J",
	"t": "0",
	"n": "九华山",
	"i": "70073"
}, {
	"w": "J",
	"t": "0",
	"n": "九江",
	"i": "70076"
}, {
	"w": "J",
	"t": "0",
	"n": "晋江",
	"i": "30000153"
}, {
	"w": "J",
	"t": "0",
	"n": "吉林",
	"i": "70115"
}, {
	"w": "J",
	"t": "0",
	"n": "江门",
	"i": "70009"
}, {
	"w": "J",
	"t": "0",
	"n": "荆门",
	"i": "30000278"
}, {
	"w": "J",
	"t": "0",
	"n": "即墨",
	"i": "30000658"
}, {
	"w": "J",
	"t": "0",
	"n": "佳木斯",
	"i": "70112"
}, {
	"w": "J",
	"t": "0",
	"n": "济南",
	"i": "70095"
}, {
	"w": "J",
	"t": "0",
	"n": "济宁",
	"i": "30000638"
}, {
	"w": "J",
	"t": "0",
	"n": "镜泊湖",
	"i": "30001250"
}, {
	"w": "L",
	"t": "0",
	"n": "酒泉",
	"i": "30001212"
}, {
	"w": "J",
	"t": "0",
	"n": "吉首",
	"i": "30001185"
}, {
	"w": "J",
	"t": "0",
	"n": "嘉善",
	"i": "30000167"
}, {
	"w": "J",
	"t": "0",
	"n": "金坛",
	"i": "30000222"
}, {
	"w": "J",
	"t": "0",
	"n": "嘉兴",
	"i": "30000143"
}, {
	"w": "J",
	"t": "0",
	"n": "鸡西",
	"i": "30000996"
}, {
	"w": "J",
	"t": "0",
	"n": "揭阳",
	"i": "30000966"
}, {
	"w": "J",
	"t": "0",
	"n": "江油",
	"i": "30000341"
}, {
	"w": "J",
	"t": "0",
	"n": "缙云",
	"i": "30000588"
}, {
	"w": "J",
	"t": "0",
	"n": "江阴",
	"i": "30000148"
}, {
	"w": "J",
	"t": "0",
	"n": "济源",
	"i": "30001229"
}, {
	"w": "J",
	"t": "0",
	"n": "嘉峪关",
	"i": "30001208"
}, {
	"w": "L",
	"t": "0",
	"n": "临夏",
	"i": "30001210"
}, {
	"w": "L",
	"t": "0",
	"n": "陇南",
	"i": "30001211"
}, {
	"w": "J",
	"t": "0",
	"n": "荆州",
	"i": "30000477"
}, {
	"w": "J",
	"t": "0",
	"n": "焦作",
	"i": "30000639"
}, {
	"w": "J",
	"t": "0",
	"n": "晋中",
	"i": "30000478"
}, {
	"w": "J",
	"t": "0",
	"n": "锦州",
	"i": "70129"
}, {
	"w": "J",
	"t": "0",
	"n": "九寨沟",
	"i": "70044"
}, {
	"w": "K",
	"t": "0",
	"n": "库尔勒",
	"i": "30000578"
}, {
	"w": "K",
	"t": "0",
	"n": "开封",
	"i": "70086"
}, {
	"w": "K",
	"t": "0",
	"n": "凯里",
	"i": "30000841"
}, {
	"w": "K",
	"t": "0",
	"n": "克拉玛依",
	"i": "30000583"
}, {
	"w": "K",
	"t": "0",
	"n": "昆明",
	"i": "70032"
}, {
	"w": "K",
	"t": "0",
	"n": "喀纳斯",
	"i": "30000582"
}, {
	"w": "K",
	"t": "0",
	"n": "开平",
	"i": "70016"
}, {
	"w": "K",
	"t": "0",
	"n": "喀什",
	"i": "30000580"
}, {
	"w": "K",
	"t": "0",
	"n": "昆山",
	"i": "30000138"
}, {
	"w": "K",
	"t": "0",
	"n": "奎屯",
	"i": "30001297"
}, {
	"w": "K",
	"t": "0",
	"n": "开元",
	"i": "30000195"
}, {
	"w": "K",
	"t": "0",
	"n": "克孜勒苏柯尔克孜",
	"i": "30001296"
}, {
	"w": "L",
	"t": "0",
	"n": "临安",
	"i": "30000677"
}, {
	"w": "L",
	"t": "0",
	"n": "六安",
	"i": "30001007"
}, {
	"w": "H",
	"t": "0",
	"n": "来宾",
	"i": "30001240"
}, {
	"w": "L",
	"t": "0",
	"n": "临沧",
	"i": "30001281"
}, {
	"w": "L",
	"t": "0",
	"n": "连城",
	"i": "30000232"
}, {
	"w": "L",
	"t": "0",
	"n": "聊城",
	"i": "30000970"
}, {
	"w": "L",
	"t": "0",
	"n": "娄底",
	"i": "30000880"
}, {
	"w": "L",
	"t": "0",
	"n": "乐东",
	"i": "30000983"
}, {
	"w": "L",
	"t": "0",
	"n": "廊坊",
	"i": "30000418"
}, {
	"w": "L",
	"t": "0",
	"n": "临汾",
	"i": "30000190"
}, {
	"w": "L",
	"t": "0",
	"n": "泸沽湖",
	"i": "30001282"
}, {
	"w": "L",
	"t": "0",
	"n": "临高县",
	"i": "30000980"
}, {
	"w": "L",
	"t": "0",
	"n": "临海",
	"i": "30000239"
}, {
	"w": "L",
	"t": "0",
	"n": "漯河",
	"i": "30000397"
}, {
	"w": "L",
	"t": "0",
	"n": "丽江",
	"i": "70033"
}, {
	"w": "L",
	"t": "0",
	"n": "吕梁",
	"i": "30001147"
}, {
	"w": "L",
	"t": "0",
	"n": "乐平",
	"i": "30001255"
}, {
	"w": "L",
	"t": "0",
	"n": "滦平",
	"i": "30000421"
}, {
	"w": "L",
	"t": "0",
	"n": "六盘水",
	"i": "30000888"
}, {
	"w": "L",
	"t": "0",
	"n": "乐清",
	"i": "30000250"
}, {
	"w": "L",
	"t": "0",
	"n": "陵水",
	"i": "30000197"
}, {
	"w": "L",
	"t": "0",
	"n": "乐山",
	"i": "70043"
}, {
	"w": "L",
	"t": "0",
	"n": "拉萨",
	"i": "70052"
}, {
	"w": "L",
	"t": "0",
	"n": "丽水",
	"i": "30000163"
}, {
	"w": "L",
	"t": "0",
	"n": "庐山",
	"i": "30000220"
}, {
	"w": "L",
	"t": "0",
	"n": "凉山州",
	"i": "30001305"
}, {
	"w": "L",
	"t": "0",
	"n": "轮台县",
	"i": "30001295"
}, {
	"w": "L",
	"t": "0",
	"n": "灵武",
	"i": "30001285"
}, {
	"w": "L",
	"t": "0",
	"n": "莱芜",
	"i": "30001041"
}, {
	"w": "L",
	"t": "0",
	"n": "兰溪",
	"i": "30000258"
}, {
	"w": "L",
	"t": "0",
	"n": "龙游",
	"i": "30000251"
}, {
	"w": "L",
	"t": "0",
	"n": "溧阳",
	"i": "30000223"
}, {
	"w": "L",
	"t": "0",
	"n": "龙岩",
	"i": "30000154"
}, {
	"w": "L",
	"t": "0",
	"n": "洛阳",
	"i": "70085"
}, {
	"w": "L",
	"t": "0",
	"n": "临沂",
	"i": "30000497"
}, {
	"w": "L",
	"t": "0",
	"n": "辽源",
	"i": "30000180"
}, {
	"w": "L",
	"t": "0",
	"n": "辽阳",
	"i": "30000179"
}, {
	"w": "L",
	"t": "0",
	"n": "连云港",
	"i": "70066"
}, {
	"w": "L",
	"t": "0",
	"n": "柳州",
	"i": "70019"
}, {
	"w": "L",
	"t": "0",
	"n": "泸州",
	"i": "30000324"
}, {
	"w": "L",
	"t": "0",
	"n": "林芝",
	"i": "30001190"
}, {
	"w": "L",
	"t": "0",
	"n": "兰州",
	"i": "70056"
}, {
	"w": "M",
	"t": "0",
	"n": "马鞍山",
	"i": "30000965"
}, {
	"w": "M",
	"t": "0",
	"n": "牡丹江",
	"i": "70110"
}, {
	"w": "M",
	"t": "0",
	"n": "漠河",
	"i": "30001251"
}, {
	"w": "M",
	"t": "0",
	"n": "梅河口",
	"i": "30000986"
}, {
	"w": "G",
	"t": "0",
	"n": "麻江县",
	"i": "30001222"
}, {
	"w": "M",
	"t": "0",
	"n": "木垒县",
	"i": "30001346"
}, {
	"w": "M",
	"t": "0",
	"n": "茂名",
	"i": "30000957"
}, {
	"w": "M",
	"t": "0",
	"n": "米泉",
	"i": "30001345"
}, {
	"w": "M",
	"t": "0",
	"n": "芒市",
	"i": "30001595"
}, {
	"w": "M",
	"t": "0",
	"n": "眉山市",
	"i": "30001156"
}, {
	"w": "M",
	"t": "0",
	"n": "绵阳",
	"i": "70039"
}, {
	"w": "M",
	"t": "0",
	"n": "梅州",
	"i": "30000899"
}, {
	"w": "M",
	"t": "0",
	"n": "满洲里",
	"i": "30000757"
}, {
	"w": "N",
	"t": "0",
	"n": "宁波",
	"i": "70060"
}, {
	"w": "N",
	"t": "0",
	"n": "南充",
	"i": "30000325"
}, {
	"w": "N",
	"t": "0",
	"n": "南昌",
	"i": "70074"
}, {
	"w": "N",
	"t": "0",
	"n": "宁城",
	"i": "30001265"
}, {
	"w": "N",
	"t": "0",
	"n": "宁德",
	"i": "30000233"
}, {
	"w": "N",
	"t": "0",
	"n": "南戴河",
	"i": "30000419"
}, {
	"w": "N",
	"t": "0",
	"n": "宁海",
	"i": "30000252"
}, {
	"w": "N",
	"t": "0",
	"n": "怒江",
	"i": "30001279"
}, {
	"w": "N",
	"t": "0",
	"n": "内江",
	"i": "30000340"
}, {
	"w": "N",
	"t": "0",
	"n": "南京",
	"i": "70063"
}, {
	"w": "N",
	"t": "0",
	"n": "尼勒克县",
	"i": "30001347"
}, {
	"w": "N",
	"t": "0",
	"n": "南宁",
	"i": "70018"
}, {
	"w": "N",
	"t": "0",
	"n": "南平",
	"i": "30000877"
}, {
	"w": "N",
	"t": "0",
	"n": "那曲",
	"i": "30001320"
}, {
	"w": "N",
	"t": "0",
	"n": "南通",
	"i": "70141"
}, {
	"w": "N",
	"t": "0",
	"n": "南阳",
	"i": "30000539"
}, {
	"w": "P",
	"t": "0",
	"n": "磐安",
	"i": "30001270"
}, {
	"w": "P",
	"t": "0",
	"n": "平顶山",
	"i": "30001228"
}, {
	"w": "P",
	"t": "0",
	"n": "普洱",
	"i": "30001280"
}, {
	"w": "P",
	"t": "0",
	"n": "平湖",
	"i": "30000253"
}, {
	"w": "P",
	"t": "0",
	"n": "浦江",
	"i": "30001269"
}, {
	"w": "P",
	"t": "0",
	"n": "盘锦",
	"i": "70121"
}, {
	"w": "L",
	"t": "0",
	"n": "平凉",
	"i": "30001214"
}, {
	"w": "P",
	"t": "0",
	"n": "蓬莱",
	"i": "70100"
}, {
	"w": "P",
	"t": "0",
	"n": "普宁",
	"i": "70142"
}, {
	"w": "P",
	"t": "0",
	"n": "平山县",
	"i": "30000717"
}, {
	"w": "P",
	"t": "0",
	"n": "莆田",
	"i": "30000236"
}, {
	"w": "P",
	"t": "0",
	"n": "萍乡",
	"i": "30000518"
}, {
	"w": "P",
	"t": "0",
	"n": "濮阳",
	"i": "30000597"
}, {
	"w": "P",
	"t": "0",
	"n": "平遥",
	"i": "70105"
}, {
	"w": "P",
	"t": "0",
	"n": "攀枝花",
	"i": "70042"
}, {
	"w": "Q",
	"t": "0",
	"n": "丘北",
	"i": "30001348"
}, {
	"w": "Q",
	"t": "0",
	"n": "启东",
	"i": "30000586"
}, {
	"w": "Q",
	"t": "0",
	"n": "青岛",
	"i": "70096"
}, {
	"w": "Q",
	"t": "0",
	"n": "千岛湖",
	"i": "30000230"
}, {
	"w": "G",
	"t": "0",
	"n": "黔东南",
	"i": "30001221"
}, {
	"w": "Q",
	"t": "0",
	"n": "曲阜",
	"i": "261"
}, {
	"w": "Q",
	"t": "0",
	"n": "琼海",
	"i": "30000196"
}, {
	"w": "Q",
	"t": "0",
	"n": "秦皇岛",
	"i": "70089"
}, {
	"w": "Q",
	"t": "0",
	"n": "青海湖",
	"i": "30001331"
}, {
	"w": "G",
	"t": "0",
	"n": "千户苗寨",
	"i": "30001224"
}, {
	"w": "Q",
	"t": "0",
	"n": "潜江",
	"i": "30001234"
}, {
	"w": "Q",
	"t": "0",
	"n": "潜江",
	"i": "30001385"
}, {
	"w": "Q",
	"t": "0",
	"n": "曲靖",
	"i": "30000191"
}, {
	"w": "Q",
	"t": "0",
	"n": "祁连县",
	"i": "30001332"
}, {
	"w": "G",
	"t": "0",
	"n": "黔南州",
	"i": "30001219"
}, {
	"w": "Q",
	"t": "0",
	"n": "齐齐哈尔",
	"i": "70109"
}, {
	"w": "Q",
	"t": "0",
	"n": "七台河",
	"i": "30001396"
}, {
	"w": "Q",
	"t": "0",
	"n": "奇台县",
	"i": "30001294"
}, {
	"w": "Q",
	"t": "0",
	"n": "七仙岭",
	"i": "30001349"
}, {
	"w": "G",
	"t": "0",
	"n": "黔西南州",
	"i": "30001223"
}, {
	"w": "Q",
	"t": "0",
	"n": "清远",
	"i": "70145"
}, {
	"w": "L",
	"t": "0",
	"n": "庆阳",
	"i": "30001213"
}, {
	"w": "Q",
	"t": "0",
	"n": "钦州",
	"i": "30000891"
}, {
	"w": "Q",
	"t": "0",
	"n": "琼中",
	"i": "30000984"
}, {
	"w": "Q",
	"t": "0",
	"n": "衢州",
	"i": "30000589"
}, {
	"w": "Q",
	"t": "0",
	"n": "泉州",
	"i": "70081"
}, {
	"w": "R",
	"t": "0",
	"n": "瑞安",
	"i": "30000144"
}, {
	"w": "R",
	"t": "0",
	"n": "瑞金",
	"i": "30001256"
}, {
	"w": "R",
	"t": "0",
	"n": "日喀则",
	"i": "30000584"
}, {
	"w": "R",
	"t": "0",
	"n": "瑞丽",
	"i": "30001183"
}, {
	"w": "R",
	"t": "0",
	"n": "任丘",
	"i": "30000538"
}, {
	"w": "R",
	"t": "0",
	"n": "日照",
	"i": "70102"
}, {
	"w": "S",
	"t": "0",
	"n": "顺德",
	"i": "30001352"
}, {
	"w": "S",
	"t": "0",
	"n": "绥芬河",
	"i": "70113"
}, {
	"w": "S",
	"t": "0",
	"n": "韶关",
	"i": "70013"
}, {
	"w": "S",
	"t": "0",
	"n": "寿光",
	"i": "30000737"
}, {
	"w": "S",
	"t": "0",
	"n": "上海",
	"i": "70058"
}, {
	"w": "S",
	"t": "0",
	"n": "三河",
	"i": "30000422"
}, {
	"w": "S",
	"t": "0",
	"n": "绥化",
	"i": "30000184"
}, {
	"w": "S",
	"t": "0",
	"n": "双辽",
	"i": "30000972"
}, {
	"w": "S",
	"t": "0",
	"n": "宿州",
	"i": "30001204"
}, {
	"w": "S",
	"t": "0",
	"n": "石家庄",
	"i": "70087"
}, {
	"w": "A",
	"t": "0",
	"n": "商洛",
	"i": "30001316"
}, {
	"w": "S",
	"t": "0",
	"n": "神农架",
	"i": "30001238"
}, {
	"w": "S",
	"t": "0",
	"n": "神木",
	"i": "30000617"
}, {
	"w": "S",
	"t": "0",
	"n": "三明",
	"i": "30000878"
}, {
	"w": "S",
	"t": "0",
	"n": "三门峡",
	"i": "30000619"
}, {
	"w": "S",
	"t": "0",
	"n": "遂宁",
	"i": "30000326"
}, {
	"w": "S",
	"t": "0",
	"n": "山南",
	"i": "30001321"
}, {
	"w": "S",
	"t": "0",
	"n": "松潘",
	"i": "30000339"
}, {
	"w": "S",
	"t": "0",
	"n": "四平",
	"i": "30000181"
}, {
	"w": "S",
	"t": "0",
	"n": "宿迁",
	"i": "30000225"
}, {
	"w": "S",
	"t": "0",
	"n": "商丘",
	"i": "30000959"
}, {
	"w": "S",
	"t": "0",
	"n": "上饶",
	"i": "30000517"
}, {
	"w": "S",
	"t": "0",
	"n": "韶山",
	"i": "30000437"
}, {
	"w": "S",
	"t": "0",
	"n": "三沙市",
	"i": "30001350"
}, {
	"w": "S",
	"t": "0",
	"n": "石狮",
	"i": "30000234"
}, {
	"w": "S",
	"t": "0",
	"n": "鄯善县",
	"i": "30001293"
}, {
	"w": "S",
	"t": "0",
	"n": "汕头",
	"i": "70001"
}, {
	"w": "S",
	"t": "0",
	"n": "汕尾",
	"i": "30000961"
}, {
	"w": "S",
	"t": "0",
	"n": "沙湾县",
	"i": "30001351"
}, {
	"w": "S",
	"t": "0",
	"n": "绍兴",
	"i": "70062"
}, {
	"w": "S",
	"t": "0",
	"n": "十堰",
	"i": "70024"
}, {
	"w": "S",
	"t": "0",
	"n": "邵阳",
	"i": "30000881"
}, {
	"w": "S",
	"t": "0",
	"n": "三亚",
	"i": "70030"
}, {
	"w": "S",
	"t": "0",
	"n": "上虞",
	"i": "30000254"
}, {
	"w": "S",
	"t": "0",
	"n": "松原",
	"i": "30001003"
}, {
	"w": "S",
	"t": "0",
	"n": "沈阳",
	"i": "70119"
}, {
	"w": "S",
	"t": "0",
	"n": "双鸭山",
	"i": "30001395"
}, {
	"w": "S",
	"t": "0",
	"n": "深圳",
	"i": "70002"
}, {
	"w": "S",
	"t": "0",
	"n": "随州",
	"i": "30001184"
}, {
	"w": "S",
	"t": "0",
	"n": "嵊州",
	"i": "30000255"
}, {
	"w": "S",
	"t": "0",
	"n": "苏州",
	"i": "70068"
}, {
	"w": "S",
	"t": "0",
	"n": "朔州",
	"i": "30001146"
}, {
	"w": "S",
	"t": "0",
	"n": "绥中",
	"i": "30001260"
}, {
	"w": "S",
	"t": "0",
	"n": "石嘴山",
	"i": "30001286"
}, {
	"w": "T",
	"t": "0",
	"n": "泰安",
	"i": "70101"
}, {
	"w": "T",
	"t": "0",
	"n": "腾冲",
	"i": "30000967"
}, {
	"w": "A",
	"t": "0",
	"n": "铜川",
	"i": "30001317"
}, {
	"w": "T",
	"t": "0",
	"n": "塔城",
	"i": "30001292"
}, {
	"w": "T",
	"t": "0",
	"n": "太仓",
	"i": "70069"
}, {
	"w": "T",
	"t": "0",
	"n": "屯昌县",
	"i": "30000979"
}, {
	"w": "T",
	"t": "0",
	"n": "通化",
	"i": "30000971"
}, {
	"w": "T",
	"t": "0",
	"n": "天津",
	"i": "70083"
}, {
	"w": "X",
	"t": "0",
	"n": "特克斯县",
	"i": "30001353"
}, {
	"w": "T",
	"t": "0",
	"n": "桐庐",
	"i": "30000241"
}, {
	"w": "T",
	"t": "0",
	"n": "同里",
	"i": "30000224"
}, {
	"w": "T",
	"t": "0",
	"n": "铜陵",
	"i": "30000993"
}, {
	"w": "T",
	"t": "0",
	"n": "通辽",
	"i": "30001040"
}, {
	"w": "T",
	"t": "0",
	"n": "铁岭",
	"i": "70131"
}, {
	"w": "T",
	"t": "0",
	"n": "台山",
	"i": "70015"
}, {
	"w": "T",
	"t": "0",
	"n": "通什",
	"i": "30000198"
}, {
	"w": "L",
	"t": "0",
	"n": "天水",
	"i": "30001215"
}, {
	"w": "T",
	"t": "0",
	"n": "泰顺",
	"i": "30000256"
}, {
	"w": "T",
	"t": "0",
	"n": "唐山",
	"i": "70088"
}, {
	"w": "T",
	"t": "0",
	"n": "天台",
	"i": "30000257"
}, {
	"w": "T",
	"t": "0",
	"n": "吐鲁番",
	"i": "30000277"
}, {
	"w": "T",
	"t": "0",
	"n": "铜仁",
	"i": "30000886"
}, {
	"w": "T",
	"t": "0",
	"n": "桐乡",
	"i": "30000242"
}, {
	"w": "T",
	"t": "0",
	"n": "太原",
	"i": "70103"
}, {
	"w": "T",
	"t": "0",
	"n": "台州",
	"i": "30000096"
}, {
	"w": "T",
	"t": "0",
	"n": "泰州",
	"i": "30000137"
}, {
	"w": "T",
	"t": "0",
	"n": "通州",
	"i": "30000587"
}, {
	"w": "T",
	"t": "0",
	"n": "天柱山",
	"i": "30000217"
}, {
	"w": "W",
	"t": "0",
	"n": "文昌",
	"i": "30000958"
}, {
	"w": "W",
	"t": "0",
	"n": "五大连池",
	"i": "30001252"
}, {
	"w": "W",
	"t": "0",
	"n": "潍坊",
	"i": "70127"
}, {
	"w": "W",
	"t": "0",
	"n": "武汉",
	"i": "70021"
}, {
	"w": "W",
	"t": "0",
	"n": "芜湖",
	"i": "30000155"
}, {
	"w": "W",
	"t": "0",
	"n": "威海",
	"i": "70098"
}, {
	"w": "W",
	"t": "0",
	"n": "乌海",
	"i": "30001191"
}, {
	"w": "W",
	"t": "0",
	"n": "吴江",
	"i": "30000147"
}, {
	"w": "W",
	"t": "0",
	"n": "五家渠",
	"i": "30001291"
}, {
	"w": "W",
	"t": "0",
	"n": "卧龙",
	"i": "30001354"
}, {
	"w": "W",
	"t": "0",
	"n": "温岭",
	"i": "30000166"
}, {
	"w": "W",
	"t": "0",
	"n": "乌兰浩特",
	"i": "30001002"
}, {
	"w": "W",
	"t": "0",
	"n": "乌鲁木齐",
	"i": "70051"
}, {
	"w": "W",
	"t": "0",
	"n": "万宁",
	"i": "30000073"
}, {
	"w": "A",
	"t": "0",
	"n": "渭南",
	"i": "30001318"
}, {
	"w": "W",
	"t": "0",
	"n": "乌兰察布",
	"i": "30001266"
}, {
	"w": "A",
	"t": "0",
	"n": "渭南华阴市",
	"i": "30001315"
}, {
	"w": "W",
	"t": "0",
	"n": "汪清县",
	"i": "30000759"
}, {
	"w": "W",
	"t": "0",
	"n": "文山",
	"i": "30001277"
}, {
	"w": "X",
	"t": "0",
	"n": "乌苏市",
	"i": "30001355"
}, {
	"w": "W",
	"t": "0",
	"n": "五台山",
	"i": "101"
}, {
	"w": "L",
	"t": "0",
	"n": "武威",
	"i": "30001216"
}, {
	"w": "W",
	"t": "0",
	"n": "无锡",
	"i": "70065"
}, {
	"w": "W",
	"t": "0",
	"n": "武义",
	"i": "30000243"
}, {
	"w": "W",
	"t": "0",
	"n": "婺源",
	"i": "30001188"
}, {
	"w": "W",
	"t": "0",
	"n": "武夷山",
	"i": "70080"
}, {
	"w": "W",
	"t": "0",
	"n": "梧州",
	"i": "283"
}, {
	"w": "W",
	"t": "0",
	"n": "吴忠",
	"i": "30001287"
}, {
	"w": "W",
	"t": "0",
	"n": "乌镇",
	"i": "30001186"
}, {
	"w": "W",
	"t": "0",
	"n": "温州",
	"i": "70061"
}, {
	"w": "W",
	"t": "0",
	"n": "五指山",
	"i": "30000963"
}, {
	"w": "X",
	"t": "0",
	"n": "西安",
	"i": "70046"
}, {
	"w": "X",
	"t": "0",
	"n": "兴安盟",
	"i": "30001267"
}, {
	"w": "X",
	"t": "0",
	"n": "西昌",
	"i": "30000321"
}, {
	"w": "X",
	"t": "0",
	"n": "新昌",
	"i": "30000245"
}, {
	"w": "X",
	"t": "0",
	"n": "宣城",
	"i": "30001006"
}, {
	"w": "X",
	"t": "0",
	"n": "许昌",
	"i": "30000541"
}, {
	"w": "X",
	"t": "0",
	"n": "兴城",
	"i": "30001261"
}, {
	"w": "X",
	"t": "0",
	"n": "襄樊",
	"i": "70023"
}, {
	"w": "X",
	"t": "0",
	"n": "孝感",
	"i": "30001236"
}, {
	"w": "X",
	"t": "0",
	"n": "香格里拉",
	"i": "30000192"
}, {
	"w": "X",
	"t": "0",
	"n": "新会",
	"i": "70149"
}, {
	"w": "X",
	"t": "0",
	"n": "兴隆",
	"i": "30001356"
}, {
	"w": "X",
	"t": "0",
	"n": "锡林郭勒盟",
	"i": "30001268"
}, {
	"w": "X",
	"t": "0",
	"n": "锡林浩特",
	"i": "30001000"
}, {
	"w": "X",
	"t": "0",
	"n": "厦门",
	"i": "70079"
}, {
	"w": "X",
	"t": "0",
	"n": "咸宁",
	"i": "30001004"
}, {
	"w": "X",
	"t": "0",
	"n": "西宁",
	"i": "70055"
}, {
	"w": "X",
	"t": "0",
	"n": "象山",
	"i": "30000244"
}, {
	"w": "X",
	"t": "0",
	"n": "西双版纳",
	"i": "70035"
}, {
	"w": "X",
	"t": "0",
	"n": "仙桃",
	"i": "30001237"
}, {
	"w": "X",
	"t": "0",
	"n": "湘潭",
	"i": "30000140"
}, {
	"w": "X",
	"t": "0",
	"n": "西塘",
	"i": "30001187"
}, {
	"w": "X",
	"t": "0",
	"n": "邢台",
	"i": "30000758"
}, {
	"w": "X",
	"t": "0",
	"n": "修武",
	"i": "30001231"
}, {
	"w": "X",
	"t": "0",
	"n": "湘西",
	"i": "30000882"
}, {
	"w": "X",
	"t": "0",
	"n": "新乡",
	"i": "30000187"
}, {
	"w": "X",
	"t": "0",
	"n": "雪乡",
	"i": "30001253"
}, {
	"w": "X",
	"t": "0",
	"n": "襄阳",
	"i": "30001235"
}, {
	"w": "X",
	"t": "0",
	"n": "兴义",
	"i": "30000889"
}, {
	"w": "X",
	"t": "0",
	"n": "咸阳",
	"i": "70049"
}, {
	"w": "X",
	"t": "0",
	"n": "新余",
	"i": "30000799"
}, {
	"w": "X",
	"t": "0",
	"n": "信阳",
	"i": "30001225"
}, {
	"w": "X",
	"t": "0",
	"n": "徐州",
	"i": "30000116"
}, {
	"w": "X",
	"t": "0",
	"n": "忻州",
	"i": "30000479"
}, {
	"w": "Y",
	"t": "0",
	"n": "雅安",
	"i": "30000338"
}, {
	"w": "Y",
	"t": "0",
	"n": "延安",
	"i": "70047"
}, {
	"w": "Y",
	"t": "0",
	"n": "永安",
	"i": "30000760"
}, {
	"w": "Y",
	"t": "0",
	"n": "宜宾",
	"i": "30000320"
}, {
	"w": "Y",
	"t": "0",
	"n": "亚布力",
	"i": "30000182"
}, {
	"w": "Y",
	"t": "0",
	"n": "宜昌",
	"i": "70022"
}, {
	"w": "Y",
	"t": "0",
	"n": "银川",
	"i": "70155"
}, {
	"w": "Y",
	"t": "0",
	"n": "盐城",
	"i": "30000226"
}, {
	"w": "Y",
	"t": "0",
	"n": "宜春",
	"i": "30000219"
}, {
	"w": "Y",
	"t": "0",
	"n": "运城",
	"i": "30000189"
}, {
	"w": "Y",
	"t": "0",
	"n": "伊春",
	"i": "30000995"
}, {
	"w": "Y",
	"t": "0",
	"n": "雁荡山",
	"i": "30000246"
}, {
	"w": "Y",
	"t": "0",
	"n": "云浮",
	"i": "30000142"
}, {
	"w": "Y",
	"t": "0",
	"n": "阳江",
	"i": "70014"
}, {
	"w": "Y",
	"t": "0",
	"n": "永嘉",
	"i": "30000247"
}, {
	"w": "Y",
	"t": "0",
	"n": "延吉",
	"i": "30000458"
}, {
	"w": "Y",
	"t": "0",
	"n": "永康",
	"i": "30000162"
}, {
	"w": "Y",
	"t": "0",
	"n": "营口",
	"i": "70132"
}, {
	"w": "Y",
	"t": "0",
	"n": "玉林",
	"i": "30000837"
}, {
	"w": "Y",
	"t": "0",
	"n": "榆林",
	"i": "70050"
}, {
	"w": "Y",
	"t": "0",
	"n": "伊犁",
	"i": "30001290"
}, {
	"w": "Y",
	"t": "0",
	"n": "伊宁",
	"i": "30000579"
}, {
	"w": "Y",
	"t": "0",
	"n": "洋浦",
	"i": "30000985"
}, {
	"w": "Y",
	"t": "0",
	"n": "阳泉",
	"i": "30001144"
}, {
	"w": "Y",
	"t": "0",
	"n": "阳朔",
	"i": "30000161"
}, {
	"w": "Y",
	"t": "0",
	"n": "榆树",
	"i": "30001248"
}, {
	"w": "Y",
	"t": "0",
	"n": "玉树藏族自治州",
	"i": "30001333"
}, {
	"w": "Y",
	"t": "0",
	"n": "鹰潭",
	"i": "30000798"
}, {
	"w": "Y",
	"t": "0",
	"n": "烟台",
	"i": "70097"
}, {
	"w": "Y",
	"t": "0",
	"n": "义乌",
	"i": "30000072"
}, {
	"w": "Y",
	"t": "0",
	"n": "玉溪",
	"i": "30000193"
}, {
	"w": "Y",
	"t": "0",
	"n": "宜兴",
	"i": "30000150"
}, {
	"w": "Y",
	"t": "0",
	"n": "岳阳",
	"i": "70151"
}, {
	"w": "Y",
	"t": "0",
	"n": "益阳",
	"i": "30000879"
}, {
	"w": "Y",
	"t": "0",
	"n": "元阳",
	"i": "30001157"
}, {
	"w": "Y",
	"t": "0",
	"n": "余姚",
	"i": "30000069"
}, {
	"w": "Y",
	"t": "0",
	"n": "永州",
	"i": "30000884"
}, {
	"w": "Y",
	"t": "0",
	"n": "扬州",
	"i": "70150"
}, {
	"w": "Y",
	"t": "0",
	"n": "仪征",
	"i": "30000227"
}, {
	"w": "Z",
	"t": "0",
	"n": "淄博",
	"i": "30000186"
}, {
	"w": "Z",
	"t": "0",
	"n": "中甸",
	"i": "70153"
}, {
	"w": "Z",
	"t": "0",
	"n": "自贡",
	"i": "70041"
}, {
	"w": "Z",
	"t": "0",
	"n": "珠海",
	"i": "70003"
}, {
	"w": "Z",
	"t": "0",
	"n": "湛江",
	"i": "70005"
}, {
	"w": "Z",
	"t": "0",
	"n": "诸暨",
	"i": "30000168"
}, {
	"w": "Z",
	"t": "0",
	"n": "镇江",
	"i": "70064"
}, {
	"w": "Z",
	"t": "0",
	"n": "张家界",
	"i": "70028"
}, {
	"w": "Z",
	"t": "0",
	"n": "张家港",
	"i": "30000117"
}, {
	"w": "Z",
	"t": "0",
	"n": "张家口",
	"i": "70093"
}, {
	"w": "Z",
	"t": "0",
	"n": "周口",
	"i": "30001227"
}, {
	"w": "Z",
	"t": "0",
	"n": "扎鲁特旗",
	"i": "30001392"
}, {
	"w": "Z",
	"t": "0",
	"n": "驻马店",
	"i": "30001230"
}, {
	"w": "W",
	"t": "0",
	"n": "中宁县",
	"i": "30001289"
}, {
	"w": "Z",
	"t": "0",
	"n": "肇庆",
	"i": "70006"
}, {
	"w": "C",
	"t": "0",
	"n": "重庆",
	"i": "70045"
}, {
	"w": "Z",
	"t": "0",
	"n": "中山",
	"i": "70008"
}, {
	"w": "Z",
	"t": "0",
	"n": "舟山",
	"i": "70143"
}, {
	"w": "Z",
	"t": "0",
	"n": "昭通",
	"i": "30001274"
}, {
	"w": "W",
	"t": "0",
	"n": "中卫",
	"i": "30001288"
}, {
	"w": "Z",
	"t": "0",
	"n": "遵义",
	"i": "70037"
}, {
	"w": "Z",
	"t": "0",
	"n": "资阳",
	"i": "30001303"
}, {
	"w": "Z",
	"t": "0",
	"n": "张掖",
	"i": "30000637"
}, {
	"w": "E",
	"t": "0",
	"n": "崇左",
	"i": "30001239"
}, {
	"w": "Z",
	"t": "0",
	"n": "株洲",
	"i": "70026"
}, {
	"w": "Z",
	"t": "0",
	"n": "周庄",
	"i": "30000228"
}, {
	"w": "Z",
	"t": "0",
	"n": "漳州",
	"i": "30000235"
}, {
	"w": "Z",
	"t": "0",
	"n": "郑州",
	"i": "70116"
}, {
	"w": "Z",
	"t": "0",
	"n": "枣庄",
	"i": "30000969"
}, {
	"w": "X",
	"t": "1",
	"n": "新加坡",
	"i": "30000908"
}, {
	"w": "S",
	"t": "1",
	"n": "首尔",
	"i": "30001043"
}, {
	"w": "M",
	"t": "1",
	"n": "曼谷",
	"i": "30001045"
}, {
	"w": "J",
	"t": "1",
	"n": "吉隆坡",
	"i": "30001049"
}, {
	"w": "D",
	"t": "1",
	"n": "东京",
	"i": "30001050"
}, {
	"w": "Q",
	"t": "1",
	"n": "清迈",
	"i": "30001051"
}, {
	"w": "O",
	"t": "1",
	"n": "大阪",
	"i": "30001055"
}, {
	"w": "H",
	"t": "1",
	"n": "河内",
	"i": "30001059"
}, {
	"w": "H",
	"t": "1",
	"n": "胡志明市",
	"i": "30001060"
}, {
	"w": "D",
	"t": "1",
	"n": "迪拜",
	"i": "30001065"
}, {
	"w": "J",
	"t": "1",
	"n": "京都",
	"i": "30001068"
}, {
	"w": "J",
	"t": "1",
	"n": "甲米",
	"i": "30001162"
}, {
	"w": "L",
	"t": "1",
	"n": "伦敦",
	"i": "30001100"
}, {
	"w": "B",
	"t": "1",
	"n": "巴黎",
	"i": "30001101"
}, {
	"w": "F",
	"t": "1",
	"n": "法兰克福",
	"i": "30001102"
}, {
	"w": "M",
	"t": "1",
	"n": "慕尼黑",
	"i": "30001103"
}, {
	"w": "M",
	"t": "1",
	"n": "米兰",
	"i": "30001104"
}, {
	"w": "L",
	"t": "1",
	"n": "罗马",
	"i": "30001105"
}, {
	"w": "M",
	"t": "1",
	"n": "马德里",
	"i": "30001107"
}, {
	"w": "B",
	"t": "1",
	"n": "巴塞罗那",
	"i": "30001108"
}, {
	"w": "W",
	"t": "1",
	"n": "维也纳",
	"i": "30001109"
}, {
	"w": "B",
	"t": "1",
	"n": "布拉格",
	"i": "30001111"
}, {
	"w": "M",
	"t": "1",
	"n": "莫斯科",
	"i": "30001113"
}, {
	"w": "A",
	"t": "1",
	"n": "阿姆斯特丹",
	"i": "30001114"
}, {
	"w": "M",
	"t": "1",
	"n": "马绍尔群岛",
	"i": "30000939"
}, {
	"w": "M",
	"t": "1",
	"n": "毛里求斯",
	"i": "30000941"
}, {
	"w": "J",
	"t": "1",
	"n": "济州岛",
	"i": "30001044"
}, {
	"w": "P",
	"t": "1",
	"n": "普吉岛",
	"i": "30001047"
}, {
	"w": "C",
	"t": "1",
	"n": "冲绳县",
	"i": "30001056"
}, {
	"w": "B",
	"t": "1",
	"n": "巴厘岛",
	"i": "30001058"
}, {
	"w": "P",
	"t": "1",
	"n": "皮皮岛",
	"i": "30001061"
}, {
	"w": "C",
	"t": "1",
	"n": "长滩岛",
	"i": "30001063"
}, {
	"w": "S",
	"t": "1",
	"n": "沙美岛",
	"i": "30001078"
}, {
	"w": "M",
	"t": "1",
	"n": "民丹岛",
	"i": "30001082"
}, {
	"w": "S",
	"t": "1",
	"n": "塞班岛",
	"i": "30001192"
}, {
	"w": "T",
	"t": "1",
	"n": "天宁岛",
	"i": "30001193"
}, {
	"w": "G",
	"t": "1",
	"n": "关岛",
	"i": "30001194"
}, {
	"w": "Z",
	"t": "1",
	"n": "芝加哥",
	"i": "30000960"
}, {
	"w": "N",
	"t": "1",
	"n": "纽约市",
	"i": "30001085"
}, {
	"w": "J",
	"t": "1",
	"n": "旧金山",
	"i": "30001087"
}, {
	"w": "L",
	"t": "1",
	"n": "洛杉矶",
	"i": "30001088"
}, {
	"w": "B",
	"t": "1",
	"n": "波士顿",
	"i": "30001089"
}, {
	"w": "L",
	"t": "1",
	"n": "拉斯维加斯",
	"i": "30001090"
}, {
	"w": "X",
	"t": "1",
	"n": "西雅图",
	"i": "30001092"
}, {
	"w": "W",
	"t": "1",
	"n": "温哥华",
	"i": "30001093"
}, {
	"w": "D",
	"t": "1",
	"n": "多伦多",
	"i": "30001094"
}, {
	"w": "M",
	"t": "1",
	"n": "蒙特利尔",
	"i": "30001095"
}, {
	"w": "X",
	"t": "1",
	"n": "新加坡",
	"i": "30000908"
}, {
	"w": "S",
	"t": "1",
	"n": "首尔",
	"i": "30001043"
}, {
	"w": "J",
	"t": "1",
	"n": "济州岛",
	"i": "30001044"
}, {
	"w": "M",
	"t": "1",
	"n": "曼谷",
	"i": "30001045"
}, {
	"w": "B",
	"t": "1",
	"n": "芭堤雅",
	"i": "30001046"
}, {
	"w": "J",
	"t": "1",
	"n": "吉隆坡",
	"i": "30001049"
}, {
	"w": "D",
	"t": "1",
	"n": "东京",
	"i": "30001050"
}, {
	"w": "Q",
	"t": "1",
	"n": "清迈",
	"i": "30001051"
}, {
	"w": "L",
	"t": "1",
	"n": "兰卡威",
	"i": "30001053"
}, {
	"w": "O",
	"t": "1",
	"n": "大阪",
	"i": "30001055"
}, {
	"w": "H",
	"t": "1",
	"n": "华欣",
	"i": "30001072"
}, {
	"w": "J",
	"t": "1",
	"n": "甲米",
	"i": "30001162"
}];

module.exports = citys;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

var hotCitys = [{
	"w": "B",
	"t": "0",
	"n": "北京",
	"i": "70082"
}, {
	"w": "S",
	"t": "0",
	"n": "上海",
	"i": "70058"
}, {
	"w": "T",
	"t": "0",
	"n": "天津",
	"i": "70083"
}, {
	"w": "C",
	"t": "0",
	"n": "重庆",
	"i": "70045"
}, {
	"w": "D",
	"t": "0",
	"n": "大连",
	"i": "70120"
}, {
	"w": "Q",
	"t": "0",
	"n": "青岛",
	"i": "70096"
}, {
	"w": "X",
	"t": "0",
	"n": "西安",
	"i": "70046"
}, {
	"w": "N",
	"t": "0",
	"n": "南京",
	"i": "70063"
}, {
	"w": "S",
	"t": "0",
	"n": "苏州",
	"i": "70068"
}, {
	"w": "H",
	"t": "0",
	"n": "杭州",
	"i": "70059"
}, {
	"w": "X",
	"t": "0",
	"n": "厦门",
	"i": "70079"
}, {
	"w": "C",
	"t": "0",
	"n": "成都",
	"i": "70038"
}, {
	"w": "S",
	"t": "0",
	"n": "深圳",
	"i": "70002"
}, {
	"w": "G",
	"t": "0",
	"n": "广州",
	"i": "70011"
}, {
	"w": "S",
	"t": "0",
	"n": "三亚",
	"i": "70030"
}];

module.exports = hotCitys;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {


var inlandCityTemplate = __webpack_require__(41);

var citys = __webpack_require__(28);
var inlandHotCitys = __webpack_require__(29);

var arr1 = [],
    arr2 = [],
    letterArr = ['ABCD', 'EFGHI', 'JKLM', 'NOPQRS', 'TUVWX', 'YZ'];

function groupByLetter(arr) {
    for (var i = 0; i < arr.length; i++) {

        var o = arr[i];
        var index = o.w.toUpperCase();

        if (+o.t === 0) {
            !arr1[index] ? arr1[index] = [o] : arr1[index].push(o);
        } else if (+o.t === 1) {
            !arr2[index] ? arr2[index] = [o] : arr2[index].push(o);
        }
    }
}

function groupByArr(arr, inputArr) {

    var tmpArr = {};

    for (var i = 0; i < inputArr.length; i++) {

        var iStr = inputArr[i];
        var cArr = iStr.toUpperCase().split('');

        for (var j = 0; j < cArr.length; j++) {

            for (key in arr) {
                if (key === cArr[j]) {
                    var obj = {
                        w: key,
                        item: arr[key]
                    };
                    !tmpArr[iStr] ? tmpArr[iStr] = [obj] : tmpArr[iStr].push(obj);
                }
            }
        }
    }

    return tmpArr;
}

function showCitySelect() {
    $('.select-city-box').show();
}

function hideCitySelect() {
    $('.select-city-box').hide();
}

function switchCityGroup(_this) {
    if (_this.hasClass('active')) return;

    $(".select-city-mid li").removeClass('active');
    _this.addClass('active');

    var key = _this.html();
    var cGroup = $('.city-group li');
    for (var i = 0; i < cGroup.length; i++) {
        var o = cGroup[i];
        if ($(o).attr('data-key') === key) {
            $(o).addClass('active');
        } else {
            $(o).removeClass('active');
        }
    }
}

function setSelectCity(_this) {

    var cityInput = $('.aim-city');

    cityInput.attr('data-citytype', _this.attr('data-citytype')).attr('data-cityid', _this.attr('data-cityid')).val(_this.html());
}

function initCitySelectEvents() {
    $('.aim-city').on('focus', function () {
        showCitySelect();
    });

    $('.del-select-city').click(function () {
        hideCitySelect();
    });

    $(".s-city-title").on('click', function () {
        switchCityGroup($(this));
    });

    $(".city-item").on('click', function () {
        setSelectCity($(this));
        hideCitySelect();
    });

    $(document).click(function (e) {
        hideCitySelect();
    });

    $('.s-h-i-input').click(function (e) {
        e.stopPropagation();
    });
}

module.exports = {
    run: function run() {
        groupByLetter(citys);

        arr1 = groupByArr(arr1, letterArr);
        arr2 = groupByArr(arr2, letterArr);

        var arr = {
            citys: arr1,
            inlandHotCitys: inlandHotCitys
        };

        $(".select-city").html(inlandCityTemplate({ arr: arr }));

        initCitySelectEvents();
    }
};

/***/ }),
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {


window.Promise = __webpack_require__(2);

__webpack_require__(1);
__webpack_require__(4);
__webpack_require__(3);
__webpack_require__(26);
__webpack_require__(21);

__webpack_require__(14).run();
__webpack_require__(18).run();
__webpack_require__(15).run();
__webpack_require__(16).run();
__webpack_require__(19).run();
__webpack_require__(17).run();

/***/ }),
/* 33 */
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
/* 34 */
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
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="select-city-box">\n	<div class="select-city-top">\n		<p>支持中文/拼音/简拼输入</p>\n		<i class="del-select-city">X</i>\n	</div>\n	<div class="select-city-mid">\n		<ul>\n			<li class="s-city-title hot-city active">热门</li>\n			';
 for(key in arr.citys){ ;
__p += '\n			<li class="s-city-title">' +
((__t = ( key )) == null ? '' : __t) +
'</li>\n			';
 } ;
__p += '\n		</ul>\n	</div>\n	<div class="select-city-bot clearfix">\n		<ul class="city-group">\n			<!-- 热门城市模板 -->\n			<li class="select-city-item hot-city active" data-key="热门">\n				<ul>\n					';
 for(var i = 0; i < arr.inlandHotCitys.length; i++){ var item = arr.inlandHotCitys[i]   ;
__p += '\n					<li class="city-item" data-citytype="' +
((__t = ( item.t )) == null ? '' : __t) +
'" data-cityid="' +
((__t = ( item.i )) == null ? '' : __t) +
'">' +
((__t = ( item.n )) == null ? '' : __t) +
'</li>\n					';
 } ;
__p += '\n				</ul>\n			</li>\n\n			<!-- 其他城市模板，下面定义的 block 表示的是如 ‘ABCD’、‘EFGHI’、‘JKLM’ 这样的块... -->\n			';
 for(key in arr.citys){ var block = arr.citys[key] ;
__p += '\n			<li class="select-city-item" data-key="' +
((__t = ( key )) == null ? '' : __t) +
'">\n				';
 for(var i = 0; i < block.length; i++){ ;
__p += '\n				<span>' +
((__t = ( block[i].w )) == null ? '' : __t) +
'</span>\n				<ul>\n					';
 for(var j = 0; j < block[i].item.length; j++){ var cItem = block[i].item[j]   ;
__p += '\n					<li class="city-item" data-citytype="' +
((__t = ( cItem.t )) == null ? '' : __t) +
'" data-cityid="' +
((__t = ( cItem.i )) == null ? '' : __t) +
'">' +
((__t = ( cItem.n )) == null ? '' : __t) +
'</li>\n					';
 } ;
__p += '\n				</ul>\n				';
 } ;
__p += '\n			</li>\n			';
 } ;
__p += '\n		</ul>\n		\n	</div>\n</div>';

}
return __p
}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '\r\n<!--该文件为首页banner轮播图区域（不包含浮在它上面的搜索框）-->\r\n<!-- banner轮播区域 -->\r\n<div class="swiper-container">\r\n    <div class="swiper-wrapper">\r\n        <div class="swiper-slide">\r\n            <a href="javascript:void;"><img alt="" src="../static/img/index/tmp_banner.jpg"></a>\r\n        </div>\r\n        <div class="swiper-slide">\r\n            <a href="javascript:void;"><img alt="" src="../static/img/index/tmp_banner.jpg"></a>\r\n        </div>\r\n        <div class="swiper-slide">\r\n            <a href="javascript:void;"><img alt="" src="../static/img/index/tmp_banner.jpg"></a>\r\n        </div>\r\n    </div>\r\n    <div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets"></div>\r\n</div>';

}
return __p
}

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\r\n<!--当季热销-->\r\n\r\n<div class="ads-wrap">\r\n    <div class="ads-title-wrap">\r\n        <div class="ads-title-bline"></div>\r\n        <ul>\r\n            <li class="ads-title-item current">当季热销<i></i></li>\r\n        </ul>\r\n        <div class="ads-more-wrap">\r\n            <div>更多</div>\r\n            <div class="ads-more-icon"></div>\r\n        </div>\r\n    </div>\r\n\r\n    <ul class="ads-inner-wrap hot-sales">\r\n        ';
 for(var i = 0; i < 5; i++) {;
__p += '\r\n        <li class="ad-one-wrap ' +
((__t = ( (i % 5 == 4 ? 'last-child' : '') )) == null ? '' : __t) +
'" data-src="' +
((__t = ( arr[i].adLink )) == null ? '' : __t) +
'">\r\n            <img src="' +
((__t = ( arr[i].adImg )) == null ? '' : __t) +
'" class="too-width" alt="">\r\n            <div class="ad-one-shadow"></div>\r\n            <p class="ad-one-text">' +
((__t = ( arr[i].adTitle )) == null ? '' : __t) +
'</p>\r\n        </li>\r\n        ';
 } ;
__p += '\r\n    </ul>\r\n</div>';

}
return __p
}

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\r\n<!--国内酒店、国际酒店（酒店推荐）-->\r\n\r\n<!--顶部tab切换-->\r\n<div class="ads-title-wrap">\r\n    <div class="ads-title-bline"></div>\r\n    <ul>\r\n        <li class="ads-title-item current" data-for="internal">国内酒店<i></i></li>\r\n        <li class="ads-title-item" data-for="external">国际酒店<i></i></li>\r\n    </ul>\r\n    <div class="ads-more-wrap">\r\n        <div>更多</div>\r\n        <div class="ads-more-icon"></div>\r\n    </div>\r\n</div>\r\n\r\n<!--国内酒店-->\r\n<div class="toggle-show" data-target="internal">\r\n    <ul class="ads-sub-title-wrap">\r\n        <li class="ads-sub-title-item current">深圳</li>\r\n        <li class="ads-sub-title-item">珠海</li>\r\n        <li class="ads-sub-title-item">香港</li>\r\n        <li class="ads-sub-title-item">东莞</li>\r\n        <li class="ads-sub-title-item">上海</li>\r\n        <li class="ads-sub-title-item">中山</li>\r\n    </ul>\r\n\r\n    <ul id="internalRecommandsWrap" class="ads-inner-wrap hotel-recommands">\r\n        ';
 for(var i = 0; i < 9; i++) {;
__p += '\r\n        <li class="ad-one-wrap ' +
((__t = ( (i % 9 === 8 ? 'last-child' : '' ) )) == null ? '' : __t) +
'" data-src="' +
((__t = ( arr[i].adLink )) == null ? '' : __t) +
'">\r\n            <img src="' +
((__t = ( arr[i].adImg )) == null ? '' : __t) +
'" class="too-width">\r\n            <div class="ad-one-shadow"></div>\r\n            <p class="ad-one-text">' +
((__t = ( arr[i].adTitle )) == null ? '' : __t) +
'</p>\r\n        </li>\r\n        ';
 } ;
__p += '\r\n    </ul>\r\n</div>\r\n\r\n<!--国际酒店-->\r\n<div class="toggle-show hidden" data-target="external">\r\n    \r\n    <ul class="ads-sub-title-wrap"></ul>\r\n\r\n    <ul id="externalRecommandsWrap" class="ads-inner-wrap hotel-recommands"></ul>\r\n</div>';

}
return __p
}

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '\r\n<!--促销特卖、本月热销-->\r\n\r\n<!--顶部tab切换-->\r\n<div class="ads-title-wrap">\r\n    <div class="ads-title-bline"></div>\r\n    <ul>\r\n        <li class="ads-title-item current">促销特卖<i></i></li>\r\n    </ul>\r\n    <div class="ads-more-wrap">\r\n        <div>更多</div>\r\n        <div class="ads-more-icon"></div>\r\n    </div>\r\n</div>\r\n\r\n<ul class="ads-inner-wrap promotion">\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h18.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">桂林</p>\r\n                <p class="text-2">桂林山水甲天下</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h19.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">厦门</p>\r\n                <p class="text-2">海厦文艺小城</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h20.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">丽江</p>\r\n                <p class="text-2">水乡艳遇之都</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h21.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">三亚</p>\r\n                <p class="text-2">被称为“东方夏威夷”</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h18.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">桂林</p>\r\n                <p class="text-2">桂林山水甲天下</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h19.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">厦门</p>\r\n                <p class="text-2">海厦文艺小城</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h20.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">丽江</p>\r\n                <p class="text-2">水乡艳遇之都</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h21.jpg" alt="">\r\n        <div class="ad-mask">\r\n            <div class="ad-text-above-mask">\r\n                <p class="text-1">三亚</p>\r\n                <p class="text-2">被称为“东方夏威夷”</p>\r\n            </div>\r\n        </div>\r\n    </li>\r\n</ul>\r\n\r\n<div class="ads-inner-wrap top-sales">\r\n    <p class="m-hot-sale-title">本月热销</p>\r\n    <ul class="m-hot-sale-wrap">\r\n        <li class="m-hot-sale-item">\r\n            <div class="m-hot-sale-img">\r\n                <img src="../static/img/index/h22.jpg" alt="">\r\n                <div class="hot-sales-flag">\r\n                    <p class="hot-sales-rank">1</p>\r\n                </div>\r\n            </div>\r\n            <p class="m-hot-sale-text">广州长隆旅游度假区广州长隆旅游度假区</p>\r\n        </li>\r\n        <li class="m-hot-sale-item">\r\n            <div class="m-hot-sale-img">\r\n                <img src="../static/img/index/h23.jpg" alt="">\r\n                <div class="hot-sales-flag">\r\n                    <p class="hot-sales-rank">2</p>\r\n                </div>\r\n            </div>\r\n            <p class="m-hot-sale-text">广州长隆旅游度假区</p>\r\n        </li>\r\n        <li class="m-hot-sale-item">\r\n            <div class="m-hot-sale-img">\r\n                <img src="../static/img/index/h24.jpg" alt="">\r\n                <div class="hot-sales-flag">\r\n                    <p class="hot-sales-rank">3</p>\r\n                </div>\r\n            </div>\r\n            <p class="m-hot-sale-text">广州长隆旅游度假区</p>\r\n        </li>\r\n    </ul>\r\n</div>';

}
return __p
}

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<!--该文件为首页搜索框部分（不包括它下面的banner轮播区）-->\n\n<div class="search-box">\n	<ul class="s-tab">\n		<li class="s-tab-item current" data-for="s-hotel">\n			<div class="sprites sp-jiudian"></div>\n			<div class="s-tab-text">酒店</div>\n		</li>\n		<li class="s-tab-item" data-for="s-ticket">\n			<div class="sprites sp-menpiao"></div>\n			<div class="s-tab-text">门票</div>\n		</li>\n		<li class="s-tab-item" data-for="s-wx">\n			<div class="sprites sp-shoujiban"></div>\n			<div class="s-tab-text">手机版</div>\n		</li>\n		<li class="p-h"></li>\n	</ul>\n	<div class="s-box-wrap">\n		<!--酒店搜索框-->\n		<div class="s-box current" data-target="s-hotel">\n			<div class="sbox-hotel">\n				<div class="sbox-hotel-tab">\n					<div class="s-h-bline"></div>\n					<div class="s-h-item current">国内酒店<i></i></div>\n					<div class="s-h-item">国际酒店<i></i></div>\n				</div>\n				<div class="sbox-hotel-item">\n					<div class="s-h-i-title">目的地</div>\n					<div class="s-h-i-input">\n						<input class="aim-city" type="text" value="深圳市">\n						<div class="select-city"></div>\n					</div>\n				</div>\n				<div class="sbox-hotel-item">\n					<div class="s-h-i-title">入住</div>\n					<div class="s-h-i-input date">\n						<input class="start" type="text" value="2017-06-18">\n						<div class="sprites sp-rili"></div>\n					</div>\n					<div class="s-h-i-title">退房</div>\n					<div class="s-h-i-input date">\n						<input class="end" type="text" value="2017-06-19">\n						<div class="sprites sp-rili"></div>\n					</div>\n				</div>\n				<div class="sbox-hotel-item">\n					<div class="s-h-i-title">关键字</div>\n					<div class="s-h-i-input">\n						<input type="text" placeholder="位置 / 酒店名 / 品牌">\n					</div>\n				</div>\n				<div class="sbox-hotel-item">\n					<div class="s-h-i-title"></div>\n					<div class="s-h-i-input">\n						<div class="s-h-submit">\n							<div class="sprites sp-sousuo"></div>\n							搜索\n						</div>\n					</div>\n				</div>\n			</div>\n		</div>\n\n		<!--门票搜索框-->\n		<div class="s-box" data-target="s-ticket"></div>\n\n		<!--手机二维码显示框-->\n		<div class="s-box" data-target="s-wx">\n			<div class="sbox-wx">\n				<div class="sbox-erweima-wrap">\n					<div class="border b1"></div>\n					<div class="border b2"></div>\n					<div class="border b3"></div>\n					<div class="border b4"></div>\n					<div class="sbox-erweima"></div>\n				</div>\n\n				<div class="sbox-wx-text">手机预订更方便、更快捷</div>\n\n				<div class="sbox-wx-bg"></div>\n			</div>\n		</div>\n	</div>\n</div>\n';

}
return __p
}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '\r\n<!--景点门票-->\r\n\r\n<!--顶部tab切换-->\r\n<div class="ads-title-wrap">\r\n    <div class="ads-title-bline"></div>\r\n    <ul>\r\n        <li class="ads-title-item current">景点门票<i></i></li>\r\n    </ul>\r\n    <div class="ads-more-wrap">\r\n        <div>更多</div>\r\n        <div class="ads-more-icon"></div>\r\n    </div>\r\n</div>\r\n\r\n<ul class="ads-sub-title-wrap">\r\n    <li class="ads-sub-title-item current">深圳</li>\r\n    <li class="ads-sub-title-item">珠海</li>\r\n    <li class="ads-sub-title-item">香港</li>\r\n    <li class="ads-sub-title-item">东莞</li>\r\n    <li class="ads-sub-title-item">上海</li>\r\n    <li class="ads-sub-title-item">中山</li>\r\n</ul>\r\n\r\n<ul class="ads-inner-wrap ticket">\r\n    <li class="ad-one-wrap first-child">\r\n        <img src="../static/img/index/h13.jpg" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">香港愉景湾</p>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h10.jpg" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">香港愉景湾</p>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h11.jpg" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">广州白天鹅酒店</p>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h14.jpg" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">澳门JW万豪酒店</p>\r\n    </li>\r\n    <li class="ad-one-wrap">\r\n        <img src="../static/img/index/h15.jpg" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">香港愉景湾</p>\r\n    </li>\r\n    <li class="ad-one-wrap last-child">\r\n        <img src="../static/img/index/h12.jpg" alt="">\r\n        <div class="ad-one-shadow"></div>\r\n        <p class="ad-one-text">香港愉景湾</p>\r\n    </li>\r\n</ul>\r\n   ';

}
return __p
}

/***/ })
],[32]);
//# sourceMappingURL=index.24d99ffa13ad26b47441.js.map