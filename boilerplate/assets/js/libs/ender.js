/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://enderjs.com)
  * Build: ender build underscore domready qwery bonzo bean
  * Packages: ender-core@2.0.0 ender-commonjs@1.0.7 underscore@1.6.0 domready@1.0.4 qwery@4.0.0 bonzo@2.0.0 bean@1.0.6
  * =============================================================
  */

(function () {

  /*!
    * Ender: open module JavaScript framework (client-lib)
    * http://enderjs.com
    * License MIT
    */
  
  /**
   * @constructor
   * @param  {*=}      item      selector|node|collection|callback|anything
   * @param  {Object=} root      node(s) from which to base selector queries
   */
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length
  
    if (typeof item == 'string')
      // start with strings so the result parlays into the other checks
      // the .selector prop only applies to strings
      item = ender._select(this['selector'] = item, root)
  
    if (null == item) return this // Do not wrap null|undefined
  
    if (typeof item == 'function') ender._closure(item, root)
  
    // DOM node | scalar | not array-like
    else if (typeof item != 'object' || item.nodeType || (i = item.length) !== +i || item == item.window)
      this[this.length++] = item
  
    // array-like - bitwise ensures integer length
    else for (this.length = i = (i > 0 ? ~~i : 0); i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }
  
  
  /**
   * @expose
   * sync the prototypes for jQuery compatibility
   */
  ender.fn = ender.prototype = Ender.prototype
  
  /**
   * @enum {number}  protects local symbols from being overwritten
   */
  ender._reserved = {
    reserved: 1,
    ender: 1,
    expose: 1,
    noConflict: 1,
    fn: 1
  }
  
  /**
   * @expose
   * handy reference to self
   */
  Ender.prototype.$ = ender
  
  /**
   * @expose
   * make webkit dev tools pretty-print ender instances like arrays
   */
  Ender.prototype.splice = function () { throw new Error('Not implemented') }
  
  /**
   * @expose
   * @param   {function(*, number, Ender)}  fn
   * @param   {object=}                     scope
   * @return  {Ender}
   */
  Ender.prototype.forEach = function (fn, scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }
  
  /**
   * @expose
   * @param {object|function} o
   * @param {boolean=}        chain
   */
  ender.ender = function (o, chain) {
    var o2 = chain ? Ender.prototype : ender
    for (var k in o) !(k in ender._reserved) && (o2[k] = o[k])
    return o2
  }
  
  /**
   * @expose
   * @param {string}  s
   * @param {Node=}   r
   */
  ender._select = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }
  
  /**
   * @expose
   * @param {function} fn
   */
  ender._closure = function (fn) {
    fn.call(document, ender)
  }
  
  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  var $ = ender
  
  /**
   * @expose
   * @param {string} name
   * @param {*}      value
   */
  ender.expose = function (name, value) {
    ender.expose.old[name] = window[name]
    window[name] = value
  }
  
  /**
   * @expose
   */
  ender.expose.old = {}
  
  /**
   * @expose
   * @param {boolean} all   restore only $ or all ender globals
   */
  ender.noConflict = function (all) {
    window['$'] = ender.expose.old['$']
    if (all) for (var k in ender.expose.old) window[k] = ender.expose.old[k]
    return this
  }
  
  ender.expose('$', ender)
  ender.expose('ender', ender); // uglify needs this semi-colon between concating files
  
  /*!
    * Ender: open module JavaScript framework (module-lib)
    * http://enderjs.com
    * License MIT
    */
  
  var global = this
  
  /**
   * @param  {string}  id   module id to load
   * @return {object}
   */
  function require(id) {
    if ('$' + id in require._cache)
      return require._cache['$' + id]
    if ('$' + id in require._modules)
      return (require._cache['$' + id] = require._modules['$' + id]._load())
    if (id in window)
      return window[id]
  
    throw new Error('Requested module "' + id + '" has not been defined.')
  }
  
  /**
   * @param  {string}  id       module id to provide to require calls
   * @param  {object}  exports  the exports object to be returned
   */
  function provide(id, exports) {
    return (require._cache['$' + id] = exports)
  }
  
  /**
   * @expose
   * @dict
   */
  require._cache = {}
  
  /**
   * @expose
   * @dict
   */
  require._modules = {}
  
  /**
   * @constructor
   * @param  {string}                                          id   module id for this module
   * @param  {function(Module, object, function(id), object)}  fn   module definition
   */
  function Module(id, fn) {
    this.id = id
    this.fn = fn
    require._modules['$' + id] = this
  }
  
  /**
   * @expose
   * @param  {string}  id   module id to load from the local module context
   * @return {object}
   */
  Module.prototype.require = function (id) {
    var parts, i
  
    if (id.charAt(0) == '.') {
      parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')
  
      while (~(i = parts.indexOf('.')))
        parts.splice(i, 1)
  
      while ((i = parts.lastIndexOf('..')) > 0)
        parts.splice(i - 1, 2)
  
      id = parts.join('/')
    }
  
    return require(id)
  }
  
  /**
   * @expose
   * @return {object}
   */
  Module.prototype._load = function () {
    var m = this
  
    if (!m._loaded) {
      m._loaded = true
  
      /**
       * @expose
       */
      m.exports = {}
      m.fn.call(global, m, m.exports, function (id) { return m.require(id) }, global)
    }
  
    return m.exports
  }
  
  /**
   * @expose
   * @param  {string}                     id        main module id
   * @param  {Object.<string, function>}  modules   mapping of module ids to definitions
   * @param  {string}                     main      the id of the main module
   */
  Module.createPackage = function (id, modules, main) {
    var path, m
  
    for (path in modules) {
      new Module(id + '/' + path, modules[path])
      if (m = path.match(/^(.+)\/index$/)) new Module(id + '/' + m[1], modules[path])
    }
  
    if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
  }
  
  if (ender && ender.expose) {
    /*global global,require,provide,Module */
    ender.expose('global', global)
    ender.expose('require', require)
    ender.expose('provide', provide)
    ender.expose('Module', Module)
  }
  
  Module.createPackage('underscore', {
    'underscore': function (module, exports, require, global) {
      //     Underscore.js 1.6.0
      //     http://underscorejs.org
      //     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
      //     Underscore may be freely distributed under the MIT license.
      
      (function() {
      
        // Baseline setup
        // --------------
      
        // Establish the root object, `window` in the browser, or `exports` on the server.
        var root = this;
      
        // Save the previous value of the `_` variable.
        var previousUnderscore = root._;
      
        // Establish the object that gets returned to break out of a loop iteration.
        var breaker = {};
      
        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
      
        // Create quick reference variables for speed access to core prototypes.
        var
          push             = ArrayProto.push,
          slice            = ArrayProto.slice,
          concat           = ArrayProto.concat,
          toString         = ObjProto.toString,
          hasOwnProperty   = ObjProto.hasOwnProperty;
      
        // All **ECMAScript 5** native function implementations that we hope to use
        // are declared here.
        var
          nativeForEach      = ArrayProto.forEach,
          nativeMap          = ArrayProto.map,
          nativeReduce       = ArrayProto.reduce,
          nativeReduceRight  = ArrayProto.reduceRight,
          nativeFilter       = ArrayProto.filter,
          nativeEvery        = ArrayProto.every,
          nativeSome         = ArrayProto.some,
          nativeIndexOf      = ArrayProto.indexOf,
          nativeLastIndexOf  = ArrayProto.lastIndexOf,
          nativeIsArray      = Array.isArray,
          nativeKeys         = Object.keys,
          nativeBind         = FuncProto.bind;
      
        // Create a safe reference to the Underscore object for use below.
        var _ = function(obj) {
          if (obj instanceof _) return obj;
          if (!(this instanceof _)) return new _(obj);
          this._wrapped = obj;
        };
      
        // Export the Underscore object for **Node.js**, with
        // backwards-compatibility for the old `require()` API. If we're in
        // the browser, add `_` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode.
        if (typeof exports !== 'undefined') {
          if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
          }
          exports._ = _;
        } else {
          root._ = _;
        }
      
        // Current version.
        _.VERSION = '1.6.0';
      
        // Collection Functions
        // --------------------
      
        // The cornerstone, an `each` implementation, aka `forEach`.
        // Handles objects with the built-in `forEach`, arrays, and raw objects.
        // Delegates to **ECMAScript 5**'s native `forEach` if available.
        var each = _.each = _.forEach = function(obj, iterator, context) {
          if (obj == null) return obj;
          if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
          } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
              if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
          } else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
              if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
          }
          return obj;
        };
      
        // Return the results of applying the iterator to each element.
        // Delegates to **ECMAScript 5**'s native `map` if available.
        _.map = _.collect = function(obj, iterator, context) {
          var results = [];
          if (obj == null) return results;
          if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
          each(obj, function(value, index, list) {
            results.push(iterator.call(context, value, index, list));
          });
          return results;
        };
      
        var reduceError = 'Reduce of empty array with no initial value';
      
        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
        _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
          var initial = arguments.length > 2;
          if (obj == null) obj = [];
          if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
          }
          each(obj, function(value, index, list) {
            if (!initial) {
              memo = value;
              initial = true;
            } else {
              memo = iterator.call(context, memo, value, index, list);
            }
          });
          if (!initial) throw new TypeError(reduceError);
          return memo;
        };
      
        // The right-associative version of reduce, also known as `foldr`.
        // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
        _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
          var initial = arguments.length > 2;
          if (obj == null) obj = [];
          if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
          }
          var length = obj.length;
          if (length !== +length) {
            var keys = _.keys(obj);
            length = keys.length;
          }
          each(obj, function(value, index, list) {
            index = keys ? keys[--length] : --length;
            if (!initial) {
              memo = obj[index];
              initial = true;
            } else {
              memo = iterator.call(context, memo, obj[index], index, list);
            }
          });
          if (!initial) throw new TypeError(reduceError);
          return memo;
        };
      
        // Return the first value which passes a truth test. Aliased as `detect`.
        _.find = _.detect = function(obj, predicate, context) {
          var result;
          any(obj, function(value, index, list) {
            if (predicate.call(context, value, index, list)) {
              result = value;
              return true;
            }
          });
          return result;
        };
      
        // Return all the elements that pass a truth test.
        // Delegates to **ECMAScript 5**'s native `filter` if available.
        // Aliased as `select`.
        _.filter = _.select = function(obj, predicate, context) {
          var results = [];
          if (obj == null) return results;
          if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
          each(obj, function(value, index, list) {
            if (predicate.call(context, value, index, list)) results.push(value);
          });
          return results;
        };
      
        // Return all the elements for which a truth test fails.
        _.reject = function(obj, predicate, context) {
          return _.filter(obj, function(value, index, list) {
            return !predicate.call(context, value, index, list);
          }, context);
        };
      
        // Determine whether all of the elements match a truth test.
        // Delegates to **ECMAScript 5**'s native `every` if available.
        // Aliased as `all`.
        _.every = _.all = function(obj, predicate, context) {
          predicate || (predicate = _.identity);
          var result = true;
          if (obj == null) return result;
          if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
          each(obj, function(value, index, list) {
            if (!(result = result && predicate.call(context, value, index, list))) return breaker;
          });
          return !!result;
        };
      
        // Determine if at least one element in the object matches a truth test.
        // Delegates to **ECMAScript 5**'s native `some` if available.
        // Aliased as `any`.
        var any = _.some = _.any = function(obj, predicate, context) {
          predicate || (predicate = _.identity);
          var result = false;
          if (obj == null) return result;
          if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
          each(obj, function(value, index, list) {
            if (result || (result = predicate.call(context, value, index, list))) return breaker;
          });
          return !!result;
        };
      
        // Determine if the array or object contains a given value (using `===`).
        // Aliased as `include`.
        _.contains = _.include = function(obj, target) {
          if (obj == null) return false;
          if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
          return any(obj, function(value) {
            return value === target;
          });
        };
      
        // Invoke a method (with arguments) on every item in a collection.
        _.invoke = function(obj, method) {
          var args = slice.call(arguments, 2);
          var isFunc = _.isFunction(method);
          return _.map(obj, function(value) {
            return (isFunc ? method : value[method]).apply(value, args);
          });
        };
      
        // Convenience version of a common use case of `map`: fetching a property.
        _.pluck = function(obj, key) {
          return _.map(obj, _.property(key));
        };
      
        // Convenience version of a common use case of `filter`: selecting only objects
        // containing specific `key:value` pairs.
        _.where = function(obj, attrs) {
          return _.filter(obj, _.matches(attrs));
        };
      
        // Convenience version of a common use case of `find`: getting the first object
        // containing specific `key:value` pairs.
        _.findWhere = function(obj, attrs) {
          return _.find(obj, _.matches(attrs));
        };
      
        // Return the maximum element or (element-based computation).
        // Can't optimize arrays of integers longer than 65,535 elements.
        // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
        _.max = function(obj, iterator, context) {
          if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.max.apply(Math, obj);
          }
          var result = -Infinity, lastComputed = -Infinity;
          each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed > lastComputed) {
              result = value;
              lastComputed = computed;
            }
          });
          return result;
        };
      
        // Return the minimum element (or element-based computation).
        _.min = function(obj, iterator, context) {
          if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.min.apply(Math, obj);
          }
          var result = Infinity, lastComputed = Infinity;
          each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed < lastComputed) {
              result = value;
              lastComputed = computed;
            }
          });
          return result;
        };
      
        // Shuffle an array, using the modern version of the
        // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
        _.shuffle = function(obj) {
          var rand;
          var index = 0;
          var shuffled = [];
          each(obj, function(value) {
            rand = _.random(index++);
            shuffled[index - 1] = shuffled[rand];
            shuffled[rand] = value;
          });
          return shuffled;
        };
      
        // Sample **n** random values from a collection.
        // If **n** is not specified, returns a single random element.
        // The internal `guard` argument allows it to work with `map`.
        _.sample = function(obj, n, guard) {
          if (n == null || guard) {
            if (obj.length !== +obj.length) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
          }
          return _.shuffle(obj).slice(0, Math.max(0, n));
        };
      
        // An internal function to generate lookup iterators.
        var lookupIterator = function(value) {
          if (value == null) return _.identity;
          if (_.isFunction(value)) return value;
          return _.property(value);
        };
      
        // Sort the object's values by a criterion produced by an iterator.
        _.sortBy = function(obj, iterator, context) {
          iterator = lookupIterator(iterator);
          return _.pluck(_.map(obj, function(value, index, list) {
            return {
              value: value,
              index: index,
              criteria: iterator.call(context, value, index, list)
            };
          }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
              if (a > b || a === void 0) return 1;
              if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
          }), 'value');
        };
      
        // An internal function used for aggregate "group by" operations.
        var group = function(behavior) {
          return function(obj, iterator, context) {
            var result = {};
            iterator = lookupIterator(iterator);
            each(obj, function(value, index) {
              var key = iterator.call(context, value, index, obj);
              behavior(result, key, value);
            });
            return result;
          };
        };
      
        // Groups the object's values by a criterion. Pass either a string attribute
        // to group by, or a function that returns the criterion.
        _.groupBy = group(function(result, key, value) {
          _.has(result, key) ? result[key].push(value) : result[key] = [value];
        });
      
        // Indexes the object's values by a criterion, similar to `groupBy`, but for
        // when you know that your index values will be unique.
        _.indexBy = group(function(result, key, value) {
          result[key] = value;
        });
      
        // Counts instances of an object that group by a certain criterion. Pass
        // either a string attribute to count by, or a function that returns the
        // criterion.
        _.countBy = group(function(result, key) {
          _.has(result, key) ? result[key]++ : result[key] = 1;
        });
      
        // Use a comparator function to figure out the smallest index at which
        // an object should be inserted so as to maintain order. Uses binary search.
        _.sortedIndex = function(array, obj, iterator, context) {
          iterator = lookupIterator(iterator);
          var value = iterator.call(context, obj);
          var low = 0, high = array.length;
          while (low < high) {
            var mid = (low + high) >>> 1;
            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
          }
          return low;
        };
      
        // Safely create a real, live array from anything iterable.
        _.toArray = function(obj) {
          if (!obj) return [];
          if (_.isArray(obj)) return slice.call(obj);
          if (obj.length === +obj.length) return _.map(obj, _.identity);
          return _.values(obj);
        };
      
        // Return the number of elements in an object.
        _.size = function(obj) {
          if (obj == null) return 0;
          return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
        };
      
        // Array Functions
        // ---------------
      
        // Get the first element of an array. Passing **n** will return the first N
        // values in the array. Aliased as `head` and `take`. The **guard** check
        // allows it to work with `_.map`.
        _.first = _.head = _.take = function(array, n, guard) {
          if (array == null) return void 0;
          if ((n == null) || guard) return array[0];
          if (n < 0) return [];
          return slice.call(array, 0, n);
        };
      
        // Returns everything but the last entry of the array. Especially useful on
        // the arguments object. Passing **n** will return all the values in
        // the array, excluding the last N. The **guard** check allows it to work with
        // `_.map`.
        _.initial = function(array, n, guard) {
          return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
        };
      
        // Get the last element of an array. Passing **n** will return the last N
        // values in the array. The **guard** check allows it to work with `_.map`.
        _.last = function(array, n, guard) {
          if (array == null) return void 0;
          if ((n == null) || guard) return array[array.length - 1];
          return slice.call(array, Math.max(array.length - n, 0));
        };
      
        // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
        // Especially useful on the arguments object. Passing an **n** will return
        // the rest N values in the array. The **guard**
        // check allows it to work with `_.map`.
        _.rest = _.tail = _.drop = function(array, n, guard) {
          return slice.call(array, (n == null) || guard ? 1 : n);
        };
      
        // Trim out all falsy values from an array.
        _.compact = function(array) {
          return _.filter(array, _.identity);
        };
      
        // Internal implementation of a recursive `flatten` function.
        var flatten = function(input, shallow, output) {
          if (shallow && _.every(input, _.isArray)) {
            return concat.apply(output, input);
          }
          each(input, function(value) {
            if (_.isArray(value) || _.isArguments(value)) {
              shallow ? push.apply(output, value) : flatten(value, shallow, output);
            } else {
              output.push(value);
            }
          });
          return output;
        };
      
        // Flatten out an array, either recursively (by default), or just one level.
        _.flatten = function(array, shallow) {
          return flatten(array, shallow, []);
        };
      
        // Return a version of the array that does not contain the specified value(s).
        _.without = function(array) {
          return _.difference(array, slice.call(arguments, 1));
        };
      
        // Split an array into two arrays: one whose elements all satisfy the given
        // predicate, and one whose elements all do not satisfy the predicate.
        _.partition = function(array, predicate) {
          var pass = [], fail = [];
          each(array, function(elem) {
            (predicate(elem) ? pass : fail).push(elem);
          });
          return [pass, fail];
        };
      
        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // Aliased as `unique`.
        _.uniq = _.unique = function(array, isSorted, iterator, context) {
          if (_.isFunction(isSorted)) {
            context = iterator;
            iterator = isSorted;
            isSorted = false;
          }
          var initial = iterator ? _.map(array, iterator, context) : array;
          var results = [];
          var seen = [];
          each(initial, function(value, index) {
            if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
              seen.push(value);
              results.push(array[index]);
            }
          });
          return results;
        };
      
        // Produce an array that contains the union: each distinct element from all of
        // the passed-in arrays.
        _.union = function() {
          return _.uniq(_.flatten(arguments, true));
        };
      
        // Produce an array that contains every item shared between all the
        // passed-in arrays.
        _.intersection = function(array) {
          var rest = slice.call(arguments, 1);
          return _.filter(_.uniq(array), function(item) {
            return _.every(rest, function(other) {
              return _.contains(other, item);
            });
          });
        };
      
        // Take the difference between one array and a number of other arrays.
        // Only the elements present in just the first array will remain.
        _.difference = function(array) {
          var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
          return _.filter(array, function(value){ return !_.contains(rest, value); });
        };
      
        // Zip together multiple lists into a single array -- elements that share
        // an index go together.
        _.zip = function() {
          var length = _.max(_.pluck(arguments, 'length').concat(0));
          var results = new Array(length);
          for (var i = 0; i < length; i++) {
            results[i] = _.pluck(arguments, '' + i);
          }
          return results;
        };
      
        // Converts lists into objects. Pass either a single array of `[key, value]`
        // pairs, or two parallel arrays of the same length -- one of keys, and one of
        // the corresponding values.
        _.object = function(list, values) {
          if (list == null) return {};
          var result = {};
          for (var i = 0, length = list.length; i < length; i++) {
            if (values) {
              result[list[i]] = values[i];
            } else {
              result[list[i][0]] = list[i][1];
            }
          }
          return result;
        };
      
        // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
        // we need this function. Return the position of the first occurrence of an
        // item in an array, or -1 if the item is not included in the array.
        // Delegates to **ECMAScript 5**'s native `indexOf` if available.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
        _.indexOf = function(array, item, isSorted) {
          if (array == null) return -1;
          var i = 0, length = array.length;
          if (isSorted) {
            if (typeof isSorted == 'number') {
              i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
            } else {
              i = _.sortedIndex(array, item);
              return array[i] === item ? i : -1;
            }
          }
          if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
          for (; i < length; i++) if (array[i] === item) return i;
          return -1;
        };
      
        // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
        _.lastIndexOf = function(array, item, from) {
          if (array == null) return -1;
          var hasIndex = from != null;
          if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
            return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
          }
          var i = (hasIndex ? from : array.length);
          while (i--) if (array[i] === item) return i;
          return -1;
        };
      
        // Generate an integer Array containing an arithmetic progression. A port of
        // the native Python `range()` function. See
        // [the Python documentation](http://docs.python.org/library/functions.html#range).
        _.range = function(start, stop, step) {
          if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
          }
          step = arguments[2] || 1;
      
          var length = Math.max(Math.ceil((stop - start) / step), 0);
          var idx = 0;
          var range = new Array(length);
      
          while(idx < length) {
            range[idx++] = start;
            start += step;
          }
      
          return range;
        };
      
        // Function (ahem) Functions
        // ------------------
      
        // Reusable constructor function for prototype setting.
        var ctor = function(){};
      
        // Create a function bound to a given object (assigning `this`, and arguments,
        // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
        // available.
        _.bind = function(func, context) {
          var args, bound;
          if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
          if (!_.isFunction(func)) throw new TypeError;
          args = slice.call(arguments, 2);
          return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor;
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
          };
        };
      
        // Partially apply a function by creating a version that has had some of its
        // arguments pre-filled, without changing its dynamic `this` context. _ acts
        // as a placeholder, allowing any combination of arguments to be pre-filled.
        _.partial = function(func) {
          var boundArgs = slice.call(arguments, 1);
          return function() {
            var position = 0;
            var args = boundArgs.slice();
            for (var i = 0, length = args.length; i < length; i++) {
              if (args[i] === _) args[i] = arguments[position++];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return func.apply(this, args);
          };
        };
      
        // Bind a number of an object's methods to that object. Remaining arguments
        // are the method names to be bound. Useful for ensuring that all callbacks
        // defined on an object belong to it.
        _.bindAll = function(obj) {
          var funcs = slice.call(arguments, 1);
          if (funcs.length === 0) throw new Error('bindAll must be passed function names');
          each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
          return obj;
        };
      
        // Memoize an expensive function by storing its results.
        _.memoize = function(func, hasher) {
          var memo = {};
          hasher || (hasher = _.identity);
          return function() {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
          };
        };
      
        // Delays a function for the given number of milliseconds, and then calls
        // it with the arguments supplied.
        _.delay = function(func, wait) {
          var args = slice.call(arguments, 2);
          return setTimeout(function(){ return func.apply(null, args); }, wait);
        };
      
        // Defers a function, scheduling it to run after the current call stack has
        // cleared.
        _.defer = function(func) {
          return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
        };
      
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        _.throttle = function(func, wait, options) {
          var context, args, result;
          var timeout = null;
          var previous = 0;
          options || (options = {});
          var later = function() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
          };
          return function() {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
              clearTimeout(timeout);
              timeout = null;
              previous = now;
              result = func.apply(context, args);
              context = args = null;
            } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
        };
      
        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        _.debounce = function(func, wait, immediate) {
          var timeout, args, context, timestamp, result;
      
          var later = function() {
            var last = _.now() - timestamp;
            if (last < wait) {
              timeout = setTimeout(later, wait - last);
            } else {
              timeout = null;
              if (!immediate) {
                result = func.apply(context, args);
                context = args = null;
              }
            }
          };
      
          return function() {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) {
              timeout = setTimeout(later, wait);
            }
            if (callNow) {
              result = func.apply(context, args);
              context = args = null;
            }
      
            return result;
          };
        };
      
        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        _.once = function(func) {
          var ran = false, memo;
          return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
          };
        };
      
        // Returns the first function passed as an argument to the second,
        // allowing you to adjust arguments, run code before and after, and
        // conditionally execute the original function.
        _.wrap = function(func, wrapper) {
          return _.partial(wrapper, func);
        };
      
        // Returns a function that is the composition of a list of functions, each
        // consuming the return value of the function that follows.
        _.compose = function() {
          var funcs = arguments;
          return function() {
            var args = arguments;
            for (var i = funcs.length - 1; i >= 0; i--) {
              args = [funcs[i].apply(this, args)];
            }
            return args[0];
          };
        };
      
        // Returns a function that will only be executed after being called N times.
        _.after = function(times, func) {
          return function() {
            if (--times < 1) {
              return func.apply(this, arguments);
            }
          };
        };
      
        // Object Functions
        // ----------------
      
        // Retrieve the names of an object's properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`
        _.keys = function(obj) {
          if (!_.isObject(obj)) return [];
          if (nativeKeys) return nativeKeys(obj);
          var keys = [];
          for (var key in obj) if (_.has(obj, key)) keys.push(key);
          return keys;
        };
      
        // Retrieve the values of an object's properties.
        _.values = function(obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var values = new Array(length);
          for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
          }
          return values;
        };
      
        // Convert an object into a list of `[key, value]` pairs.
        _.pairs = function(obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var pairs = new Array(length);
          for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
          }
          return pairs;
        };
      
        // Invert the keys and values of an object. The values must be serializable.
        _.invert = function(obj) {
          var result = {};
          var keys = _.keys(obj);
          for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
          }
          return result;
        };
      
        // Return a sorted list of the function names available on the object.
        // Aliased as `methods`
        _.functions = _.methods = function(obj) {
          var names = [];
          for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
          }
          return names.sort();
        };
      
        // Extend a given object with all the properties in passed-in object(s).
        _.extend = function(obj) {
          each(slice.call(arguments, 1), function(source) {
            if (source) {
              for (var prop in source) {
                obj[prop] = source[prop];
              }
            }
          });
          return obj;
        };
      
        // Return a copy of the object only containing the whitelisted properties.
        _.pick = function(obj) {
          var copy = {};
          var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
          each(keys, function(key) {
            if (key in obj) copy[key] = obj[key];
          });
          return copy;
        };
      
         // Return a copy of the object without the blacklisted properties.
        _.omit = function(obj) {
          var copy = {};
          var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
          for (var key in obj) {
            if (!_.contains(keys, key)) copy[key] = obj[key];
          }
          return copy;
        };
      
        // Fill in a given object with default properties.
        _.defaults = function(obj) {
          each(slice.call(arguments, 1), function(source) {
            if (source) {
              for (var prop in source) {
                if (obj[prop] === void 0) obj[prop] = source[prop];
              }
            }
          });
          return obj;
        };
      
        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function(obj) {
          if (!_.isObject(obj)) return obj;
          return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };
      
        // Invokes interceptor with the obj, and then returns obj.
        // The primary purpose of this method is to "tap into" a method chain, in
        // order to perform operations on intermediate results within the chain.
        _.tap = function(obj, interceptor) {
          interceptor(obj);
          return obj;
        };
      
        // Internal recursive comparison function for `isEqual`.
        var eq = function(a, b, aStack, bStack) {
          // Identical objects are equal. `0 === -0`, but they aren't identical.
          // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
          if (a === b) return a !== 0 || 1 / a == 1 / b;
          // A strict comparison is necessary because `null == undefined`.
          if (a == null || b == null) return a === b;
          // Unwrap any wrapped objects.
          if (a instanceof _) a = a._wrapped;
          if (b instanceof _) b = b._wrapped;
          // Compare `[[Class]]` names.
          var className = toString.call(a);
          if (className != toString.call(b)) return false;
          switch (className) {
            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
              // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
              // equivalent to `new String("5")`.
              return a == String(b);
            case '[object Number]':
              // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
              // other numeric values.
              return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
            case '[object Date]':
            case '[object Boolean]':
              // Coerce dates and booleans to numeric primitive values. Dates are compared by their
              // millisecond representations. Note that invalid dates with millisecond representations
              // of `NaN` are not equivalent.
              return +a == +b;
            // RegExps are compared by their source patterns and flags.
            case '[object RegExp]':
              return a.source == b.source &&
                     a.global == b.global &&
                     a.multiline == b.multiline &&
                     a.ignoreCase == b.ignoreCase;
          }
          if (typeof a != 'object' || typeof b != 'object') return false;
          // Assume equality for cyclic structures. The algorithm for detecting cyclic
          // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
          var length = aStack.length;
          while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] == a) return bStack[length] == b;
          }
          // Objects with different constructors are not equivalent, but `Object`s
          // from different frames are.
          var aCtor = a.constructor, bCtor = b.constructor;
          if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                                   _.isFunction(bCtor) && (bCtor instanceof bCtor))
                              && ('constructor' in a && 'constructor' in b)) {
            return false;
          }
          // Add the first object to the stack of traversed objects.
          aStack.push(a);
          bStack.push(b);
          var size = 0, result = true;
          // Recursively compare objects and arrays.
          if (className == '[object Array]') {
            // Compare array lengths to determine if a deep comparison is necessary.
            size = a.length;
            result = size == b.length;
            if (result) {
              // Deep compare the contents, ignoring non-numeric properties.
              while (size--) {
                if (!(result = eq(a[size], b[size], aStack, bStack))) break;
              }
            }
          } else {
            // Deep compare objects.
            for (var key in a) {
              if (_.has(a, key)) {
                // Count the expected number of properties.
                size++;
                // Deep compare each member.
                if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
              }
            }
            // Ensure that both objects contain the same number of properties.
            if (result) {
              for (key in b) {
                if (_.has(b, key) && !(size--)) break;
              }
              result = !size;
            }
          }
          // Remove the first object from the stack of traversed objects.
          aStack.pop();
          bStack.pop();
          return result;
        };
      
        // Perform a deep comparison to check if two objects are equal.
        _.isEqual = function(a, b) {
          return eq(a, b, [], []);
        };
      
        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        _.isEmpty = function(obj) {
          if (obj == null) return true;
          if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
          for (var key in obj) if (_.has(obj, key)) return false;
          return true;
        };
      
        // Is a given value a DOM element?
        _.isElement = function(obj) {
          return !!(obj && obj.nodeType === 1);
        };
      
        // Is a given value an array?
        // Delegates to ECMA5's native Array.isArray
        _.isArray = nativeIsArray || function(obj) {
          return toString.call(obj) == '[object Array]';
        };
      
        // Is a given variable an object?
        _.isObject = function(obj) {
          return obj === Object(obj);
        };
      
        // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
        each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
          _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
          };
        });
      
        // Define a fallback version of the method in browsers (ahem, IE), where
        // there isn't any inspectable "Arguments" type.
        if (!_.isArguments(arguments)) {
          _.isArguments = function(obj) {
            return !!(obj && _.has(obj, 'callee'));
          };
        }
      
        // Optimize `isFunction` if appropriate.
        if (typeof (/./) !== 'function') {
          _.isFunction = function(obj) {
            return typeof obj === 'function';
          };
        }
      
        // Is a given object a finite number?
        _.isFinite = function(obj) {
          return isFinite(obj) && !isNaN(parseFloat(obj));
        };
      
        // Is the given value `NaN`? (NaN is the only number which does not equal itself).
        _.isNaN = function(obj) {
          return _.isNumber(obj) && obj != +obj;
        };
      
        // Is a given value a boolean?
        _.isBoolean = function(obj) {
          return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        };
      
        // Is a given value equal to null?
        _.isNull = function(obj) {
          return obj === null;
        };
      
        // Is a given variable undefined?
        _.isUndefined = function(obj) {
          return obj === void 0;
        };
      
        // Shortcut function for checking if an object has a given property directly
        // on itself (in other words, not on a prototype).
        _.has = function(obj, key) {
          return hasOwnProperty.call(obj, key);
        };
      
        // Utility Functions
        // -----------------
      
        // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
        // previous owner. Returns a reference to the Underscore object.
        _.noConflict = function() {
          root._ = previousUnderscore;
          return this;
        };
      
        // Keep the identity function around for default iterators.
        _.identity = function(value) {
          return value;
        };
      
        _.constant = function(value) {
          return function () {
            return value;
          };
        };
      
        _.property = function(key) {
          return function(obj) {
            return obj[key];
          };
        };
      
        // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
        _.matches = function(attrs) {
          return function(obj) {
            if (obj === attrs) return true; //avoid comparing an object to itself.
            for (var key in attrs) {
              if (attrs[key] !== obj[key])
                return false;
            }
            return true;
          }
        };
      
        // Run a function **n** times.
        _.times = function(n, iterator, context) {
          var accum = Array(Math.max(0, n));
          for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
          return accum;
        };
      
        // Return a random integer between min and max (inclusive).
        _.random = function(min, max) {
          if (max == null) {
            max = min;
            min = 0;
          }
          return min + Math.floor(Math.random() * (max - min + 1));
        };
      
        // A (possibly faster) way to get the current timestamp as an integer.
        _.now = Date.now || function() { return new Date().getTime(); };
      
        // List of HTML entities for escaping.
        var entityMap = {
          escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
          }
        };
        entityMap.unescape = _.invert(entityMap.escape);
      
        // Regexes containing the keys and values listed immediately above.
        var entityRegexes = {
          escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
          unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
        };
      
        // Functions for escaping and unescaping strings to/from HTML interpolation.
        _.each(['escape', 'unescape'], function(method) {
          _[method] = function(string) {
            if (string == null) return '';
            return ('' + string).replace(entityRegexes[method], function(match) {
              return entityMap[method][match];
            });
          };
        });
      
        // If the value of the named `property` is a function then invoke it with the
        // `object` as context; otherwise, return it.
        _.result = function(object, property) {
          if (object == null) return void 0;
          var value = object[property];
          return _.isFunction(value) ? value.call(object) : value;
        };
      
        // Add your own custom functions to the Underscore object.
        _.mixin = function(obj) {
          each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
              var args = [this._wrapped];
              push.apply(args, arguments);
              return result.call(this, func.apply(_, args));
            };
          });
        };
      
        // Generate a unique integer id (unique within the entire client session).
        // Useful for temporary DOM ids.
        var idCounter = 0;
        _.uniqueId = function(prefix) {
          var id = ++idCounter + '';
          return prefix ? prefix + id : id;
        };
      
        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        _.templateSettings = {
          evaluate    : /<%([\s\S]+?)%>/g,
          interpolate : /<%=([\s\S]+?)%>/g,
          escape      : /<%-([\s\S]+?)%>/g
        };
      
        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /(.)^/;
      
        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
          "'":      "'",
          '\\':     '\\',
          '\r':     'r',
          '\n':     'n',
          '\t':     't',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        };
      
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
      
        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        _.template = function(text, data, settings) {
          var render;
          settings = _.defaults({}, settings, _.templateSettings);
      
          // Combine delimiters into one regular expression via alternation.
          var matcher = new RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
          ].join('|') + '|$', 'g');
      
          // Compile the template source, escaping string literals appropriately.
          var index = 0;
          var source = "__p+='";
          text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
              .replace(escaper, function(match) { return '\\' + escapes[match]; });
      
            if (escape) {
              source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            }
            if (interpolate) {
              source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
              source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
          });
          source += "';\n";
      
          // If a variable is not specified, place data values in local scope.
          if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
      
          source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";
      
          try {
            render = new Function(settings.variable || 'obj', '_', source);
          } catch (e) {
            e.source = source;
            throw e;
          }
      
          if (data) return render(data, _);
          var template = function(data) {
            return render.call(this, data, _);
          };
      
          // Provide the compiled function source as a convenience for precompilation.
          template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
      
          return template;
        };
      
        // Add a "chain" function, which will delegate to the wrapper.
        _.chain = function(obj) {
          return _(obj).chain();
        };
      
        // OOP
        // ---------------
        // If Underscore is called as a function, it returns a wrapped object that
        // can be used OO-style. This wrapper holds altered versions of all the
        // underscore functions. Wrapped objects may be chained.
      
        // Helper function to continue chaining intermediate results.
        var result = function(obj) {
          return this._chain ? _(obj).chain() : obj;
        };
      
        // Add all of the Underscore functions to the wrapper object.
        _.mixin(_);
      
        // Add all mutator Array functions to the wrapper.
        each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
          var method = ArrayProto[name];
          _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
            return result.call(this, obj);
          };
        });
      
        // Add all accessor Array functions to the wrapper.
        each(['concat', 'join', 'slice'], function(name) {
          var method = ArrayProto[name];
          _.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
          };
        });
      
        _.extend(_.prototype, {
      
          // Start chaining a wrapped Underscore object.
          chain: function() {
            this._chain = true;
            return this;
          },
      
          // Extracts the result from a wrapped and chained object.
          value: function() {
            return this._wrapped;
          }
      
        });
      
        // AMD registration happens at the end for compatibility with AMD loaders
        // that may not enforce next-turn semantics on modules. Even though general
        // practice for AMD registration is to be anonymous, underscore registers
        // as a named module because, like jQuery, it is a base library that is
        // popular enough to be bundled in a third party lib, but not be part of
        // an AMD load request. Those cases could generate an error when an
        // anonymous define() is called outside of a loader request.
        if (typeof define === 'function' && define.amd) {
          define('underscore', [], function() {
            return _;
          });
        }
      }).call(this);
      
    },
    'underscore-min': function (module, exports, require, global) {
      //     Underscore.js 1.6.0
      //     http://underscorejs.org
      //     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
      //     Underscore may be freely distributed under the MIT license.
      (function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?void(this._wrapped=n):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.6.0";var A=j.each=j.forEach=function(n,t,e){if(null==n)return n;if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return;return n};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var O="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},j.find=j.detect=function(n,t,r){var e;return k(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var k=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:k(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,j.property(t))},j.where=function(n,t){return j.filter(n,j.matches(t))},j.findWhere=function(n,t){return j.find(n,j.matches(t))},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);var e=-1/0,u=-1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;o>u&&(e=n,u=o)}),e},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);var e=1/0,u=1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;u>o&&(e=n,u=o)}),e},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=j.values(n)),n[j.random(n.length-1)]):j.shuffle(n).slice(0,Math.max(0,t))};var E=function(n){return null==n?j.identity:j.isFunction(n)?n:j.property(n)};j.sortBy=function(n,t,r){return t=E(t),j.pluck(j.map(n,function(n,e,u){return{value:n,index:e,criteria:t.call(r,n,e,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=E(r),A(t,function(i,a){var o=r.call(e,i,a,t);n(u,o,i)}),u}};j.groupBy=F(function(n,t,r){j.has(n,t)?n[t].push(r):n[t]=[r]}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=E(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.partition=function(n,t){var r=[],e=[];return A(n,function(n){(t(n)?r:e).push(n)}),[r,e]},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.contains(t,n)})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===j&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:j.now(),a=null,i=n.apply(e,u),e=u=null};return function(){var l=j.now();o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u),e=u=null):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o,c=function(){var l=j.now()-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u),i=u=null))};return function(){i=this,u=arguments,a=j.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u),i=u=null),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return j.partial(t,n)},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=function(n){if(!j.isObject(n))return[];if(w)return w(n);var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o)&&"constructor"in n&&"constructor"in t)return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.constant=function(n){return function(){return n}},j.property=function(n){return function(t){return t[n]}},j.matches=function(n){return function(t){if(t===n)return!0;for(var r in n)if(n[r]!==t[r])return!1;return!0}},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},j.now=Date.now||function(){return(new Date).getTime()};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};T.unescape=j.invert(T.escape);var I={escape:new RegExp("["+j.keys(T.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(T.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(I[n],function(t){return T[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof define&&define.amd&&define("underscore",[],function(){return j})}).call(this);
      //# sourceMappingURL=underscore-min.map
    }
  }, 'underscore');

  Module.createPackage('domready', {
    'ready': function (module, exports, require, global) {
      /*!
        * domready (c) Dustin Diaz 2014 - License MIT
        */
      !function (name, definition) {
      
        if (typeof module != 'undefined') module.exports = definition()
        else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
        else this[name] = definition()
      
      }('domready', function () {
      
        var fns = [], listener
          , doc = document
          , domContentLoaded = 'DOMContentLoaded'
          , loaded = /^loaded|^i|^c/.test(doc.readyState)
      
        if (!loaded)
        doc.addEventListener(domContentLoaded, listener = function () {
          doc.removeEventListener(domContentLoaded, listener)
          loaded = 1
          while (listener = fns.shift()) listener()
        })
      
        return function (fn) {
          loaded ? fn() : fns.push(fn)
        }
      
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
        var ready = require('domready')
        $.ender({domReady: ready})
        $.ender({
          ready: function (f) {
            ready(f)
            return this
          }
        }, true)
      }(ender);
    }
  }, 'ready');

  Module.createPackage('qwery', {
    'qwery': function (module, exports, require, global) {
      /*!
        * @preserve Qwery - A selector engine
        * https://github.com/ded/qwery
        * (c) Dustin Diaz 2014 | License MIT
        */
      
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('qwery', this, function () {
      
        var classOnly = /^\.([\w\-]+)$/
          , doc = document
          , win = window
          , html = doc.documentElement
          , nodeType = 'nodeType'
        var isAncestor = 'compareDocumentPosition' in html ?
          function (element, container) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (element, container) {
            container = container == doc || container == window ? html : container
            return container !== element && container.contains(element)
          }
      
        function toArray(ar) {
          return [].slice.call(ar, 0)
        }
      
        function isNode(el) {
          var t
          return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 || t == 9)
        }
      
        function arrayLike(o) {
          return (typeof o === 'object' && isFinite(o.length))
        }
      
        function flatten(ar) {
          for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
          return r
        }
      
        function uniq(ar) {
          var a = [], i, j
          label:
          for (i = 0; i < ar.length; i++) {
            for (j = 0; j < a.length; j++) {
              if (a[j] == ar[i]) {
                continue label
              }
            }
            a[a.length] = ar[i]
          }
          return a
        }
      
      
        function normalizeRoot(root) {
          if (!root) return doc
          if (typeof root == 'string') return qwery(root)[0]
          if (!root[nodeType] && arrayLike(root)) return root[0]
          return root
        }
      
        /**
         * @param {string|Array.<Element>|Element|Node} selector
         * @param {string|Array.<Element>|Element|Node=} opt_root
         * @return {Array.<Element>}
         */
        function qwery(selector, opt_root) {
          var m, root = normalizeRoot(opt_root)
          if (!root || !selector) return []
          if (selector === win || isNode(selector)) {
            return !opt_root || (selector !== win && isNode(root) && isAncestor(selector, root)) ? [selector] : []
          }
          if (selector && arrayLike(selector)) return flatten(selector)
      
      
          if (doc.getElementsByClassName && selector == 'string' && (m = selector.match(classOnly))) {
            return toArray((root).getElementsByClassName(m[1]))
          }
          // using duck typing for 'a' window or 'a' document (not 'the' window || document)
          if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
            return !opt_root ? [selector] : []
          }
          return toArray((root).querySelectorAll(selector))
        }
      
        qwery.uniq = uniq
      
        return qwery
      }, this);
      
    },
    'src/ender': function (module, exports, require, global) {
      (function ($) {
        var q = require('qwery')
      
        $._select = function (s, r) {
          // detect if sibling module 'bonzo' is available at run-time
          // rather than load-time since technically it's not a dependency and
          // can be loaded in any order
          // hence the lazy function re-definition
          return ($._select = (function () {
            var b
            if (typeof $.create == 'function') return function (s, r) {
              return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
            }
            try {
              b = require('bonzo')
              return function (s, r) {
                return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
              }
            } catch (e) { }
            return q
          })())(s, r)
        }
      
        $.ender({
            find: function (s) {
              var r = [], i, l, j, k, els
              for (i = 0, l = this.length; i < l; i++) {
                els = q(s, this[i])
                for (j = 0, k = els.length; j < k; j++) r.push(els[j])
              }
              return $(q.uniq(r))
            }
          , and: function (s) {
              var plus = $(s)
              for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
                this[i] = plus[j]
              }
              this.length += plus.length
              return this
            }
        }, true)
      }(ender));
      
    }
  }, 'qwery');

  Module.createPackage('bonzo', {
    'bonzo': function (module, exports, require, global) {
      /*!
        * Bonzo: DOM Utility (c) Dustin Diaz 2012
        * https://github.com/ded/bonzo
        * License MIT
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bonzo', this, function() {
        var win = window
          , doc = win.document
          , html = doc.documentElement
          , parentNode = 'parentNode'
          , specialAttributes = /^(checked|value|selected|disabled)$/i
            // tags that we have trouble inserting *into*
          , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
          , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
          , table = ['<table>', '</table>', 1]
          , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
          , option = ['<select>', '</select>', 1]
          , noscope = ['_', '', 0, 1]
          , tagMap = { // tags that we have trouble *inserting*
                thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
              , tr: ['<table><tbody>', '</tbody></table>', 2]
              , th: td , td: td
              , col: ['<table><colgroup>', '</colgroup></table>', 2]
              , fieldset: ['<form>', '</form>', 1]
              , legend: ['<form><fieldset>', '</fieldset></form>', 2]
              , option: option, optgroup: option
              , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
            }
          , stateAttributes = /^(checked|selected|disabled)$/
          , hasClass, addClass, removeClass
          , uidMap = {}
          , uuids = 0
          , digit = /^-?[\d\.]+$/
          , dattr = /^data-(.+)$/
          , px = 'px'
          , setAttribute = 'setAttribute'
          , getAttribute = 'getAttribute'
          , features = function() {
              var e = doc.createElement('p')
              return {
                transform: function () {
                  var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
                  for (i = 0; i < props.length; i++) {
                    if (props[i] in e.style) return props[i]
                  }
                }()
              , classList: 'classList' in e
              }
            }()
          , whitespaceRegex = /\s+/
          , toString = String.prototype.toString
          , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
          , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      
      
        function getStyle(el, property) {
          var value = null
            , computed = doc.defaultView.getComputedStyle(el, '')
          computed && (value = computed[property])
          return el.style[property] || value
        }
      
      
        function isNode(node) {
          return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
        }
      
      
        function normalize(node, host, clone) {
          var i, l, ret
          if (typeof node == 'string') return bonzo.create(node)
          if (isNode(node)) node = [ node ]
          if (clone) {
            ret = [] // don't change original array
            for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
            return ret
          }
          return node
        }
      
        /**
         * @param {string} c a class name to test
         * @return {boolean}
         */
        function classReg(c) {
          return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @param {boolean=} opt_rev
         * @return {Bonzo|Array}
         */
        function each(ar, fn, opt_scope, opt_rev) {
          var ind, i = 0, l = ar.length
          for (; i < l; i++) {
            ind = opt_rev ? ar.length - i - 1 : i
            fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
          }
          return ar
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {Bonzo|Array}
         */
        function deepEach(ar, fn, opt_scope) {
          for (var i = 0, l = ar.length; i < l; i++) {
            if (isNode(ar[i])) {
              deepEach(ar[i].childNodes, fn, opt_scope)
              fn.call(opt_scope || ar[i], ar[i], i, ar)
            }
          }
          return ar
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function camelize(s) {
          return s.replace(/-(.)/g, function (m, m1) {
            return m1.toUpperCase()
          })
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function decamelize(s) {
          return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
        }
      
      
        /**
         * @param {Element} el
         * @return {*}
         */
        function data(el) {
          el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
          var uid = el[getAttribute]('data-node-uid')
          return uidMap[uid] || (uidMap[uid] = {})
        }
      
      
        /**
         * removes the data associated with an element
         * @param {Element} el
         */
        function clearData(el) {
          var uid = el[getAttribute]('data-node-uid')
          if (uid) delete uidMap[uid]
        }
      
      
        function dataValue(d) {
          var f
          try {
            return (d === null || d === undefined) ? undefined :
              d === 'true' ? true :
                d === 'false' ? false :
                  d === 'null' ? null :
                    (f = parseFloat(d)) == d ? f : d;
          } catch(e) {}
          return undefined
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {boolean} whether `some`thing was found
         */
        function some(ar, fn, opt_scope) {
          for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
          return false
        }
      
      
        /**
         * this could be a giant enum of CSS properties
         * but in favor of file size sans-closure deadcode optimizations
         * we're just asking for any ol string
         * then it gets transformed into the appropriate style property for JS access
         * @param {string} p
         * @return {string}
         */
        function styleProperty(p) {
            (p == 'transform' && (p = features.transform)) ||
              (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin'))
            return p ? camelize(p) : null
        }
      
        // this insert method is intense
        function insert(target, host, fn, rev) {
          var i = 0, self = host || this, r = []
            // target nodes could be a css selector if it's a string and a selector engine is present
            // otherwise, just use target
            , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
          // normalize each node in case it's still a string and we need to create nodes on the fly
          each(normalize(nodes), function (t, j) {
            each(self, function (el) {
              fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
            }, null, rev)
          }, this, rev)
          self.length = i
          each(r, function (e) {
            self[--i] = e
          }, null, !rev)
          return self
        }
      
      
        /**
         * sets an element to an explicit x/y position on the page
         * @param {Element} el
         * @param {?number} x
         * @param {?number} y
         */
        function xy(el, x, y) {
          var $el = bonzo(el)
            , style = $el.css('position')
            , offset = $el.offset()
            , rel = 'relative'
            , isRel = style == rel
            , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
      
          if (style == 'static') {
            $el.css('position', rel)
            style = rel
          }
      
          isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
          isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
      
          x != null && (el.style.left = x - offset.left + delta[0] + px)
          y != null && (el.style.top = y - offset.top + delta[1] + px)
      
        }
      
        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        if (features.classList) {
          hasClass = function (el, c) {
            return el.classList.contains(c)
          }
          addClass = function (el, c) {
            el.classList.add(c)
          }
          removeClass = function (el, c) {
            el.classList.remove(c)
          }
        }
        else {
          hasClass = function (el, c) {
            return classReg(c).test(el.className)
          }
          addClass = function (el, c) {
            el.className = (el.className + ' ' + c).trim()
          }
          removeClass = function (el, c) {
            el.className = (el.className.replace(classReg(c), ' ')).trim()
          }
        }
      
      
        /**
         * this allows method calling for setting values
         *
         * @example
         * bonzo(elements).css('color', function (el) {
         *   return el.getAttribute('data-original-color')
         * })
         *
         * @param {Element} el
         * @param {function (Element)|string} v
         * @return {string}
         */
        function setter(el, v) {
          return typeof v == 'function' ? v.call(el, el) : v
        }
      
        function scroll(x, y, type) {
          var el = this[0]
          if (!el) return this
          if (x == null && y == null) {
            return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
          }
          if (isBody(el)) {
            win.scrollTo(x, y)
          } else {
            x != null && (el.scrollLeft = x)
            y != null && (el.scrollTop = y)
          }
          return this
        }
      
        /**
         * @constructor
         * @param {Array.<Element>|Element|Node|string} elements
         */
        function Bonzo(elements) {
          this.length = 0
          if (elements) {
            elements = typeof elements !== 'string' &&
              !elements.nodeType &&
              typeof elements.length !== 'undefined' ?
                elements :
                [elements]
            this.length = elements.length
            for (var i = 0; i < elements.length; i++) this[i] = elements[i]
          }
        }
      
        Bonzo.prototype = {
      
            /**
             * @param {number} index
             * @return {Element|Node}
             */
            get: function (index) {
              return this[index] || null
            }
      
            // itetators
            /**
             * @param {function(Element|Node)} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , each: function (fn, opt_scope) {
              return each(this, fn, opt_scope)
            }
      
            /**
             * @param {Function} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , deepEach: function (fn, opt_scope) {
              return deepEach(this, fn, opt_scope)
            }
      
      
            /**
             * @param {Function} fn
             * @param {Function=} opt_reject
             * @return {Array}
             */
          , map: function (fn, opt_reject) {
              var m = [], n, i
              for (i = 0; i < this.length; i++) {
                n = fn.call(this, this[i], i)
                opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
              }
              return m
            }
      
          // text and html inserters!
      
          /**
           * @param {string} h the HTML to insert
           * @param {boolean=} opt_text whether to set or get text content
           * @return {Bonzo|string}
           */
          , html: function (h, opt_text) {
              var method = opt_text
                    ? 'textContent'
                    : 'innerHTML'
                , that = this
                , append = function (el, i) {
                    each(normalize(h, that, i), function (node) {
                      el.appendChild(node)
                    })
                  }
                , updateElement = function (el, i) {
                    try {
                      if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                        return el[method] = h
                      }
                    } catch (e) {}
                    append(el, i)
                  }
              return typeof h != 'undefined'
                ? this.empty().each(updateElement)
                : this[0] ? this[0][method] : ''
            }
      
            /**
             * @param {string=} opt_text the text to set, otherwise this is a getter
             * @return {Bonzo|string}
             */
          , text: function (opt_text) {
              return this.html(opt_text, true)
            }
      
            // more related insertion methods
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , append: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el.appendChild(i)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , prepend: function (node) {
              var that = this
              return this.each(function (el, i) {
                var first = el.firstChild
                each(normalize(node, that, i), function (i) {
                  el.insertBefore(i, first)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , appendTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.appendChild(el)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , prependTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.insertBefore(el, t.firstChild)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , before: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , after: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el.nextSibling)
                }, null, 1)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertBefore: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t[parentNode].insertBefore(el, t)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertAfter: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                var sibling = t.nextSibling
                sibling ?
                  t[parentNode].insertBefore(el, sibling) :
                  t[parentNode].appendChild(el)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , replaceWith: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode] && el[parentNode].replaceChild(i, el)
                })
              })
            }
      
            /**
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , clone: function (opt_host) {
              var ret = [] // don't change original array
                , l, i
              for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
              return bonzo(ret)
            }
      
            // class management
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , addClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                // we `each` here so you can do $el.addClass('foo bar')
                each(c, function (c) {
                  if (c && !hasClass(el, setter(el, c)))
                    addClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , removeClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c && hasClass(el, setter(el, c)))
                    removeClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {boolean}
             */
          , hasClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return some(this, function (el) {
                return some(c, function (c) {
                  return c && hasClass(el, c)
                })
              })
            }
      
      
            /**
             * @param {string} c classname to toggle
             * @param {boolean=} opt_condition whether to add or remove the class straight away
             * @return {Bonzo}
             */
          , toggleClass: function (c, opt_condition) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c) {
                    typeof opt_condition !== 'undefined' ?
                      opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                      hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
                  }
                })
              })
            }
      
            // display togglers
      
            /**
             * @param {string=} opt_type useful to set back to anything other than an empty string
             * @return {Bonzo}
             */
          , show: function (opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : ''
              return this.each(function (el) {
                el.style.display = opt_type
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , hide: function () {
              return this.each(function (el) {
                el.style.display = 'none'
              })
            }
      
      
            /**
             * @param {Function=} opt_callback
             * @param {string=} opt_type
             * @return {Bonzo}
             */
          , toggle: function (opt_callback, opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : '';
              typeof opt_callback != 'function' && (opt_callback = null)
              return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
                opt_callback && opt_callback.call(el)
              })
            }
      
      
            // DOM Walkers & getters
      
            /**
             * @return {Element|Node}
             */
          , first: function () {
              return bonzo(this.length ? this[0] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , last: function () {
              return bonzo(this.length ? this[this.length - 1] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , next: function () {
              return this.related('nextSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , previous: function () {
              return this.related('previousSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , parent: function() {
              return this.related(parentNode)
            }
      
      
            /**
             * @private
             * @param {string} method the directional DOM method
             * @return {Element|Node}
             */
          , related: function (method) {
              return bonzo(this.map(
                function (el) {
                  el = el[method]
                  while (el && el.nodeType !== 1) {
                    el = el[method]
                  }
                  return el || 0
                },
                function (el) {
                  return el
                }
              ))
            }
      
      
            /**
             * @return {Bonzo}
             */
          , focus: function () {
              this.length && this[0].focus()
              return this
            }
      
      
            /**
             * @return {Bonzo}
             */
          , blur: function () {
              this.length && this[0].blur()
              return this
            }
      
            // style getter setter & related methods
      
            /**
             * @param {Object|string} o
             * @param {string=} opt_v
             * @return {Bonzo|string}
             */
          , css: function (o, opt_v) {
              var p, iter = o
              // is this a request for just getting a style?
              if (opt_v === undefined && typeof o == 'string') {
                // repurpose 'v'
                opt_v = this[0]
                if (!opt_v) return null
                if (opt_v === doc || opt_v === win) {
                  p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
                  return o == 'width' ? p.width : o == 'height' ? p.height : ''
                }
                return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
              }
      
              if (typeof o == 'string') {
                iter = {}
                iter[o] = opt_v
              }
      
              function fn(el, p, v) {
                for (var k in iter) {
                  if (iter.hasOwnProperty(k)) {
                    v = iter[k];
                    // change "5" to "5px" - unless you're line-height, which is allowed
                    (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                    try { el.style[p] = setter(el, v) } catch(e) {}
                  }
                }
              }
              return this.each(fn)
            }
      
      
            /**
             * @param {number=} opt_x
             * @param {number=} opt_y
             * @return {Bonzo|number}
             */
          , offset: function (opt_x, opt_y) {
              if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
                return this.each(function (el) {
                  xy(el, opt_x.left, opt_x.top)
                })
              } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
                return this.each(function (el) {
                  xy(el, opt_x, opt_y)
                })
              }
              if (!this[0]) return {
                  top: 0
                , left: 0
                , height: 0
                , width: 0
              }
              var el = this[0]
                , de = el.ownerDocument.documentElement
                , bcr = el.getBoundingClientRect()
                , scroll = getWindowScroll()
                , width = el.offsetWidth
                , height = el.offsetHeight
                , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
                , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
      
              return {
                  top: top
                , left: left
                , height: height
                , width: width
              }
            }
      
      
            /**
             * @return {number}
             */
          , dim: function () {
              if (!this.length) return { height: 0, width: 0 }
              var el = this[0]
                , de = el.nodeType == 9 && el.documentElement // document
                , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
                   // el isn't visible, can't be measured properly, so fix that
                   function (t) {
                     var s = {
                         position: el.style.position || ''
                       , visibility: el.style.visibility || ''
                       , display: el.style.display || ''
                     }
                     t.first().css({
                         position: 'absolute'
                       , visibility: 'hidden'
                       , display: 'block'
                     })
                     return s
                  }(this) : null
                , width = de
                    ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                    : el.offsetWidth
                , height = de
                    ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                    : el.offsetHeight
      
              orig && this.first().css(orig)
              return {
                  height: height
                , width: width
              }
            }
      
            // attributes are hard. go shopping
      
            /**
             * @param {string} k an attribute to get or set
             * @param {string=} opt_v the value to set
             * @return {Bonzo|string}
             */
          , attr: function (k, opt_v) {
              var el = this[0]
                , n
      
              if (typeof k != 'string' && !(k instanceof String)) {
                for (n in k) {
                  k.hasOwnProperty(n) && this.attr(n, k[n])
                }
                return this
              }
      
              return typeof opt_v == 'undefined' ?
                !el ? null : specialAttributes.test(k) ?
                  stateAttributes.test(k) && typeof el[k] == 'string' ?
                    true : el[k] :  el[getAttribute](k) :
                this.each(function (el) {
                  specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
                })
            }
      
      
            /**
             * @param {string} k
             * @return {Bonzo}
             */
          , removeAttr: function (k) {
              return this.each(function (el) {
                stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
              })
            }
      
      
            /**
             * @param {string=} opt_s
             * @return {Bonzo|string}
             */
          , val: function (s) {
              return (typeof s == 'string' || typeof s == 'number') ?
                this.attr('value', s) :
                this.length ? this[0].value : null
            }
      
            // use with care and knowledge. this data() method uses data attributes on the DOM nodes
            // to do this differently costs a lot more code. c'est la vie
            /**
             * @param {string|Object=} opt_k the key for which to get or set data
             * @param {Object=} opt_v
             * @return {Bonzo|Object}
             */
          , data: function (opt_k, opt_v) {
              var el = this[0], o, m
              if (typeof opt_v === 'undefined') {
                if (!el) return null
                o = data(el)
                if (typeof opt_k === 'undefined') {
                  each(el.attributes, function (a) {
                    (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
                  })
                  return o
                } else {
                  if (typeof o[opt_k] === 'undefined')
                    o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
                  return o[opt_k]
                }
              } else {
                return this.each(function (el) { data(el)[opt_k] = opt_v })
              }
            }
      
            // DOM detachment & related
      
            /**
             * @return {Bonzo}
             */
          , remove: function () {
              this.deepEach(clearData)
              return this.detach()
            }
      
      
            /**
             * @return {Bonzo}
             */
          , empty: function () {
              return this.each(function (el) {
                deepEach(el.childNodes, clearData)
      
                while (el.firstChild) {
                  el.removeChild(el.firstChild)
                }
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , detach: function () {
              return this.each(function (el) {
                el[parentNode] && el[parentNode].removeChild(el)
              })
            }
      
            // who uses a mouse anyway? oh right.
      
            /**
             * @param {number} y
             */
          , scrollTop: function (y) {
              return scroll.call(this, null, y, 'y')
            }
      
      
            /**
             * @param {number} x
             */
          , scrollLeft: function (x) {
              return scroll.call(this, x, null, 'x')
            }
      
        }
      
      
        function cloneNode(host, el) {
          var c = el.cloneNode(true)
            , cloneElems
            , elElems
            , i
      
          // check for existence of an event cloner
          // preferably https://github.com/fat/bean
          // otherwise Bonzo won't do this for you
          if (host.$ && typeof host.cloneEvents == 'function') {
            host.$(c).cloneEvents(el)
      
            // clone events from every child node
            cloneElems = host.$(c).find('*')
            elElems = host.$(el).find('*')
      
            for (i = 0; i < elElems.length; i++)
              host.$(cloneElems[i]).cloneEvents(elElems[i])
          }
          return c
        }
      
        function isBody(element) {
          return element === win || (/^(?:body|html)$/i).test(element.tagName)
        }
      
        function getWindowScroll() {
          return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
        }
      
        function createScriptFromHtml(html) {
          var scriptEl = document.createElement('script')
            , matches = html.match(simpleScriptTagRe)
          scriptEl.src = matches[1]
          return scriptEl
        }
      
        /**
         * @param {Array.<Element>|Element|Node|string} els
         * @return {Bonzo}
         */
        function bonzo(els) {
          return new Bonzo(els)
        }
      
        bonzo.setQueryEngine = function (q) {
          query = q;
          delete bonzo.setQueryEngine
        }
      
        bonzo.aug = function (o, target) {
          // for those standalone bonzo users. this love is for you.
          for (var k in o) {
            o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
          }
        }
      
        bonzo.create = function (node) {
          // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
          return typeof node == 'string' && node !== '' ?
            function () {
              if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
              var tag = node.match(/^\s*<([^\s>]+)/)
                , el = doc.createElement('div')
                , els = []
                , p = tag ? tagMap[tag[1].toLowerCase()] : null
                , dep = p ? p[2] + 1 : 1
                , ns = p && p[3]
                , pn = parentNode
      
              el.innerHTML = p ? (p[0] + node + p[1]) : node
              while (dep--) el = el.firstChild
              // for IE NoScope, we may insert cruft at the begining just to get it to work
              if (ns && el && el.nodeType !== 1) el = el.nextSibling
              do {
                if (!tag || el.nodeType == 1) {
                  els.push(el)
                }
              } while (el = el.nextSibling)
              // IE < 9 gives us a parentNode which messes up insert() check for cloning
              // `dep` > 1 can also cause problems with the insert() check (must do this last)
              each(els, function(el) { el[pn] && el[pn].removeChild(el) })
              return els
            }() : isNode(node) ? [node.cloneNode(true)] : []
        }
      
        bonzo.doc = function () {
          var vp = bonzo.viewport()
          return {
              width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
            , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
          }
        }
      
        bonzo.firstChild = function (el) {
          for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
            if (c[i].nodeType === 1) e = c[j = i]
          }
          return e
        }
      
        bonzo.viewport = function () {
          return {
              width: win.innerWidth
            , height: win.innerHeight
          }
        }
      
        bonzo.isAncestor = 'compareDocumentPosition' in html ?
          function (container, element) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (container, element) {
            return container !== element && container.contains(element);
          }
      
        return bonzo
      }); // the only line we care about using a semi-colon. placed here for concatenation tools
      
    },
    'src/ender': function (module, exports, require, global) {
      (function ($) {
      
        var b = require('bonzo')
        b.setQueryEngine($)
        $.ender(b)
        $.ender(b(), true)
        $.ender({
          create: function (node) {
            return $(b.create(node))
          }
        })
      
        $.id = function (id) {
          return $([document.getElementById(id)])
        }
      
        function indexOf(ar, val) {
          for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
          return -1
        }
      
        function uniq(ar) {
          var r = [], i = 0, j = 0, k, item, inIt
          for (; item = ar[i]; ++i) {
            inIt = false
            for (k = 0; k < r.length; ++k) {
              if (r[k] === item) {
                inIt = true; break
              }
            }
            if (!inIt) r[j++] = item
          }
          return r
        }
      
        $.ender({
          parents: function (selector, closest) {
            if (!this.length) return this
            if (!selector) selector = '*'
            var collection = $(selector), j, k, p, r = []
            for (j = 0, k = this.length; j < k; j++) {
              p = this[j]
              while (p = p.parentNode) {
                if (~indexOf(collection, p)) {
                  r.push(p)
                  if (closest) break;
                }
              }
            }
            return $(uniq(r))
          }
      
        , parent: function() {
            return $(uniq(b(this).parent()))
          }
      
        , closest: function (selector) {
            return this.parents(selector, true)
          }
      
        , first: function () {
            return $(this.length ? this[0] : this)
          }
      
        , last: function () {
            return $(this.length ? this[this.length - 1] : [])
          }
      
        , next: function () {
            return $(b(this).next())
          }
      
        , previous: function () {
            return $(b(this).previous())
          }
      
        , related: function (t) {
            return $(b(this).related(t))
          }
      
        , appendTo: function (t) {
            return b(this.selector).appendTo(t, this)
          }
      
        , prependTo: function (t) {
            return b(this.selector).prependTo(t, this)
          }
      
        , insertAfter: function (t) {
            return b(this.selector).insertAfter(t, this)
          }
      
        , insertBefore: function (t) {
            return b(this.selector).insertBefore(t, this)
          }
      
        , clone: function () {
            return $(b(this).clone(this))
          }
      
        , siblings: function () {
            var i, l, p, r = []
            for (i = 0, l = this.length; i < l; i++) {
              p = this[i]
              while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
              p = this[i]
              while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
            }
            return $(r)
          }
      
        , children: function () {
            var i, l, el, r = []
            for (i = 0, l = this.length; i < l; i++) {
              if (!(el = b.firstChild(this[i]))) continue;
              r.push(el)
              while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
            }
            return $(uniq(r))
          }
      
        , height: function (v) {
            return dimension.call(this, 'height', v)
          }
      
        , width: function (v) {
            return dimension.call(this, 'width', v)
          }
        }, true)
      
        /**
         * @param {string} type either width or height
         * @param {number=} opt_v becomes a setter instead of a getter
         * @return {number}
         */
        function dimension(type, opt_v) {
          return typeof opt_v == 'undefined'
            ? b(this).dim()[type]
            : this.css(type, opt_v)
        }
      }(ender));
    }
  }, 'bonzo');

  Module.createPackage('bean', {
    'bean': function (module, exports, require, global) {
      /*!
        * Bean - copyright (c) Jacob Thornton 2011-2012
        * https://github.com/fat/bean
        * MIT license
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bean', this, function (name, context) {
        name    = name    || 'bean'
        context = context || this
      
        var win            = window
          , old            = context[name]
          , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
          , nameRegex      = /\..*/
          , addEvent       = 'addEventListener'
          , removeEvent    = 'removeEventListener'
          , doc            = document || {}
          , root           = doc.documentElement || {}
          , W3C_MODEL      = root[addEvent]
          , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
          , ONE            = {} // singleton for quick matching making add() do one()
      
          , slice          = Array.prototype.slice
          , str2arr        = function (s, d) { return s.split(d || ' ') }
          , isString       = function (o) { return typeof o == 'string' }
          , isFunction     = function (o) { return typeof o == 'function' }
      
            // events that we consider to be 'native', anything not in this list will
            // be treated as a custom event
          , standardNativeEvents =
              'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
              'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
              'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
              'keydown keypress keyup '                                        + // keyboard
              'orientationchange '                                             + // mobile
              'focus blur change reset select submit '                         + // form elements
              'load unload beforeunload resize move DOMContentLoaded '         + // window
              'readystatechange message '                                      + // window
              'error abort scroll '                                              // misc
            // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
            // that doesn't actually exist, so make sure we only do these on newer browsers
          , w3cNativeEvents =
              'show '                                                          + // mouse buttons
              'input invalid '                                                 + // form elements
              'touchstart touchmove touchend touchcancel '                     + // touch
              'gesturestart gesturechange gestureend '                         + // gesture
              'textinput'                                                      + // TextEvent
              'readystatechange pageshow pagehide popstate '                   + // window
              'hashchange offline online '                                     + // window
              'afterprint beforeprint '                                        + // printing
              'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
              'loadstart progress suspend emptied stalled loadmetadata '       + // media
              'loadeddata canplay canplaythrough playing waiting seeking '     + // media
              'seeked ended durationchange timeupdate play pause ratechange '  + // media
              'volumechange cuechange '                                        + // media
              'checking noupdate downloading cached updateready obsolete '       // appcache
      
            // convert to a hash for quick lookups
          , nativeEvents = (function (hash, events, i) {
              for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
              return hash
            }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))
      
            // custom events are events that we *fake*, they are not provided natively but
            // we can use native events to generate them
          , customEvents = (function () {
              var isAncestor = 'compareDocumentPosition' in root
                    ? function (element, container) {
                        return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                      }
                    : 'contains' in root
                      ? function (element, container) {
                          container = container.nodeType === 9 || container === window ? root : container
                          return container !== element && container.contains(element)
                        }
                      : function (element, container) {
                          while (element = element.parentNode) if (element === container) return 1
                          return 0
                        }
                , check = function (event) {
                    var related = event.relatedTarget
                    return !related
                      ? related == null
                      : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                          && !isAncestor(related, this))
                  }
      
              return {
                  mouseenter: { base: 'mouseover', condition: check }
                , mouseleave: { base: 'mouseout', condition: check }
                , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
              }
            }())
      
            // we provide a consistent Event object across browsers by taking the actual DOM
            // event object and generating a new one from its properties.
          , Event = (function () {
                  // a whitelist of properties (for different event types) tells us what to check for and copy
              var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
                    'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
                    'srcElement target timeStamp type view which propertyName')
                , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
                    'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
                , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
                    'axis')) // 'axis' is FF specific
                , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
                    'keyLocation location'))
                , textProps    = commonProps.concat(str2arr('data'))
                , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
                , messageProps = commonProps.concat(str2arr('data origin source'))
                , stateProps   = commonProps.concat(str2arr('state'))
                , overOutRegex = /over|out/
                  // some event types need special handling and some need special properties, do that all here
                , typeFixers   = [
                      { // key events
                          reg: /key/i
                        , fix: function (event, newEvent) {
                            newEvent.keyCode = event.keyCode || event.which
                            return keyProps
                          }
                      }
                    , { // mouse events
                          reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                        , fix: function (event, newEvent, type) {
                            newEvent.rightClick = event.which === 3 || event.button === 2
                            newEvent.pos = { x: 0, y: 0 }
                            if (event.pageX || event.pageY) {
                              newEvent.clientX = event.pageX
                              newEvent.clientY = event.pageY
                            } else if (event.clientX || event.clientY) {
                              newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                              newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                            }
                            if (overOutRegex.test(type)) {
                              newEvent.relatedTarget = event.relatedTarget
                                || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                            }
                            return mouseProps
                          }
                      }
                    , { // mouse wheel events
                          reg: /mouse.*(wheel|scroll)/i
                        , fix: function () { return mouseWheelProps }
                      }
                    , { // TextEvent
                          reg: /^text/i
                        , fix: function () { return textProps }
                      }
                    , { // touch and gesture events
                          reg: /^touch|^gesture/i
                        , fix: function () { return touchProps }
                      }
                    , { // message events
                          reg: /^message$/i
                        , fix: function () { return messageProps }
                      }
                    , { // popstate events
                          reg: /^popstate$/i
                        , fix: function () { return stateProps }
                      }
                    , { // everything else
                          reg: /.*/
                        , fix: function () { return commonProps }
                      }
                  ]
                , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism
      
                , Event = function (event, element, isNative) {
                    if (!arguments.length) return
                    event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
                    this.originalEvent = event
                    this.isNative       = isNative
                    this.isBean         = true
      
                    if (!event) return
      
                    var type   = event.type
                      , target = event.target || event.srcElement
                      , i, l, p, props, fixer
      
                    this.target = target && target.nodeType === 3 ? target.parentNode : target
      
                    if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                      fixer = typeFixerMap[type]
                      if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                        for (i = 0, l = typeFixers.length; i < l; i++) {
                          if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                            typeFixerMap[type] = fixer = typeFixers[i].fix
                            break
                          }
                        }
                      }
      
                      props = fixer(event, this, type)
                      for (i = props.length; i--;) {
                        if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                      }
                    }
                  }
      
              // preventDefault() and stopPropagation() are a consistent interface to those functions
              // on the DOM, stop() is an alias for both of them together
              Event.prototype.preventDefault = function () {
                if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
                else this.originalEvent.returnValue = false
              }
              Event.prototype.stopPropagation = function () {
                if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
                else this.originalEvent.cancelBubble = true
              }
              Event.prototype.stop = function () {
                this.preventDefault()
                this.stopPropagation()
                this.stopped = true
              }
              // stopImmediatePropagation() has to be handled internally because we manage the event list for
              // each element
              // note that originalElement may be a Bean#Event object in some situations
              Event.prototype.stopImmediatePropagation = function () {
                if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
                this.isImmediatePropagationStopped = function () { return true }
              }
              Event.prototype.isImmediatePropagationStopped = function () {
                return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
              }
              Event.prototype.clone = function (currentTarget) {
                //TODO: this is ripe for optimisation, new events are *expensive*
                // improving this will speed up delegated events
                var ne = new Event(this, this.element, this.isNative)
                ne.currentTarget = currentTarget
                return ne
              }
      
              return Event
            }())
      
            // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
          , targetElement = function (element, isNative) {
              return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
            }
      
            /**
              * Bean maintains an internal registry for event listeners. We don't touch elements, objects
              * or functions to identify them, instead we store everything in the registry.
              * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
              */
          , RegEntry = (function () {
              // each handler is wrapped so we can handle delegation and custom events
              var wrappedHandler = function (element, fn, condition, args) {
                  var call = function (event, eargs) {
                        return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                      }
                    , findTarget = function (event, eventElement) {
                        return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                      }
                    , handler = condition
                        ? function (event) {
                            var target = findTarget(event, this) // deleated event
                            if (condition.apply(target, arguments)) {
                              if (event) event.currentTarget = target
                              return call(event, arguments)
                            }
                          }
                        : function (event) {
                            if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                            return call(event, arguments)
                          }
                  handler.__beanDel = fn.__beanDel
                  return handler
                }
      
              , RegEntry = function (element, type, handler, original, namespaces, args, root) {
                  var customType     = customEvents[type]
                    , isNative
      
                  if (type == 'unload') {
                    // self clean-up
                    handler = once(removeListener, element, type, handler, original)
                  }
      
                  if (customType) {
                    if (customType.condition) {
                      handler = wrappedHandler(element, handler, customType.condition, args)
                    }
                    type = customType.base || type
                  }
      
                  this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
                  this.customType    = !W3C_MODEL && !isNative && type
                  this.element       = element
                  this.type          = type
                  this.original      = original
                  this.namespaces    = namespaces
                  this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
                  this.target        = targetElement(element, isNative)
                  this[eventSupport] = !!this.target[eventSupport]
                  this.root          = root
                  this.handler       = wrappedHandler(element, handler, null, args)
                }
      
              // given a list of namespaces, is our entry in any of them?
              RegEntry.prototype.inNamespaces = function (checkNamespaces) {
                var i, j, c = 0
                if (!checkNamespaces) return true
                if (!this.namespaces) return false
                for (i = checkNamespaces.length; i--;) {
                  for (j = this.namespaces.length; j--;) {
                    if (checkNamespaces[i] == this.namespaces[j]) c++
                  }
                }
                return checkNamespaces.length === c
              }
      
              // match by element, original fn (opt), handler fn (opt)
              RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
                return this.element === checkElement &&
                  (!checkOriginal || this.original === checkOriginal) &&
                  (!checkHandler || this.handler === checkHandler)
              }
      
              return RegEntry
            }())
      
          , registry = (function () {
              // our map stores arrays by event type, just because it's better than storing
              // everything in a single array.
              // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
              // rootListeners so we can look them up fast
              var map = {}
      
                // generic functional search of our registry for matching listeners,
                // `fn` returns false to break out of the loop
                , forAll = function (element, type, original, handler, root, fn) {
                    var pfx = root ? 'r' : '$'
                    if (!type || type == '*') {
                      // search the whole registry
                      for (var t in map) {
                        if (t.charAt(0) == pfx) {
                          forAll(element, t.substr(1), original, handler, root, fn)
                        }
                      }
                    } else {
                      var i = 0, l, list = map[pfx + type], all = element == '*'
                      if (!list) return
                      for (l = list.length; i < l; i++) {
                        if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                      }
                    }
                  }
      
                , has = function (element, type, original, root) {
                    // we're not using forAll here simply because it's a bit slower and this
                    // needs to be fast
                    var i, list = map[(root ? 'r' : '$') + type]
                    if (list) {
                      for (i = list.length; i--;) {
                        if (!list[i].root && list[i].matches(element, original, null)) return true
                      }
                    }
                    return false
                  }
      
                , get = function (element, type, original, root) {
                    var entries = []
                    forAll(element, type, original, null, root, function (entry) {
                      return entries.push(entry)
                    })
                    return entries
                  }
      
                , put = function (entry) {
                    var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                      , key = (entry.root ? 'r' : '$') + entry.type
                    ;(map[key] || (map[key] = [])).push(entry)
                    return has
                  }
      
                , del = function (entry) {
                    forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                      list.splice(i, 1)
                      entry.removed = true
                      if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                      return false
                    })
                  }
      
                  // dump all entries, used for onunload
                , entries = function () {
                    var t, entries = []
                    for (t in map) {
                      if (t.charAt(0) == '$') entries = entries.concat(map[t])
                    }
                    return entries
                  }
      
              return { has: has, get: get, put: put, del: del, entries: entries }
            }())
      
            // we need a selector engine for delegated events, use querySelectorAll if it exists
            // but for older browsers we need Qwery, Sizzle or similar
          , selectorEngine
          , setSelectorEngine = function (e) {
              if (!arguments.length) {
                selectorEngine = doc.querySelectorAll
                  ? function (s, r) {
                      return r.querySelectorAll(s)
                    }
                  : function () {
                      throw new Error('Bean: No selector engine installed') // eeek
                    }
              } else {
                selectorEngine = e
              }
            }
      
            // we attach this listener to each DOM event that we need to listen to, only once
            // per event type per DOM element
          , rootListener = function (event, type) {
              if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return
      
              var listeners = registry.get(this, type || event.type, null, false)
                , l = listeners.length
                , i = 0
      
              event = new Event(event, this, true)
              if (type) event.type = type
      
              // iterate through all handlers registered for this type, calling them unless they have
              // been removed by a previous handler or stopImmediatePropagation() has been called
              for (; i < l && !event.isImmediatePropagationStopped(); i++) {
                if (!listeners[i].removed) listeners[i].handler.call(this, event)
              }
            }
      
            // add and remove listeners to DOM elements
          , listener = W3C_MODEL
              ? function (element, type, add) {
                  // new browsers
                  element[add ? addEvent : removeEvent](type, rootListener, false)
                }
              : function (element, type, add, custom) {
                  // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
                  // to simulate event bubbling etc.
                  var entry
                  if (add) {
                    registry.put(entry = new RegEntry(
                        element
                      , custom || type
                      , function (event) { // handler
                          rootListener.call(element, event, custom)
                        }
                      , rootListener
                      , null
                      , null
                      , true // is root
                    ))
                    if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
                    entry.target.attachEvent('on' + entry.eventType, entry.handler)
                  } else {
                    entry = registry.get(element, custom || type, rootListener, true)[0]
                    if (entry) {
                      entry.target.detachEvent('on' + entry.eventType, entry.handler)
                      registry.del(entry)
                    }
                  }
                }
      
          , once = function (rm, element, type, fn, originalFn) {
              // wrap the handler in a handler that does a remove as well
              return function () {
                fn.apply(this, arguments)
                rm(element, type, originalFn)
              }
            }
      
          , removeListener = function (element, orgType, handler, namespaces) {
              var type     = orgType && orgType.replace(nameRegex, '')
                , handlers = registry.get(element, type, null, false)
                , removed  = {}
                , i, l
      
              for (i = 0, l = handlers.length; i < l; i++) {
                if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
                  // TODO: this is problematic, we have a registry.get() and registry.del() that
                  // both do registry searches so we waste cycles doing this. Needs to be rolled into
                  // a single registry.forAll(fn) that removes while finding, but the catch is that
                  // we'll be splicing the arrays that we're iterating over. Needs extra tests to
                  // make sure we don't screw it up. @rvagg
                  registry.del(handlers[i])
                  if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
                    removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
                }
              }
              // check each type/element for removed listeners and remove the rootListener where it's no longer needed
              for (i in removed) {
                if (!registry.has(element, removed[i].t, null, false)) {
                  // last listener of this type, remove the rootListener
                  listener(element, removed[i].t, false, removed[i].c)
                }
              }
            }
      
            // set up a delegate helper using the given selector, wrap the handler function
          , delegate = function (selector, fn) {
              //TODO: findTarget (therefore $) is called twice, once for match and once for
              // setting e.currentTarget, fix this so it's only needed once
              var findTarget = function (target, root) {
                    var i, array = isString(selector) ? selectorEngine(selector, root) : selector
                    for (; target && target !== root; target = target.parentNode) {
                      for (i = array.length; i--;) {
                        if (array[i] === target) return target
                      }
                    }
                  }
                , handler = function (e) {
                    var match = findTarget(e.target, this)
                    if (match) fn.apply(match, arguments)
                  }
      
              // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
              handler.__beanDel = {
                  ft       : findTarget // attach it here for customEvents to use too
                , selector : selector
              }
              return handler
            }
      
          , fireListener = W3C_MODEL ? function (isNative, type, element) {
              // modern browsers, do a proper dispatchEvent()
              var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
              evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
              element.dispatchEvent(evt)
            } : function (isNative, type, element) {
              // old browser use onpropertychange, just increment a custom property to trigger the event
              element = targetElement(element, isNative)
              isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
            }
      
            /**
              * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
              */
      
            /**
              * off(element[, eventType(s)[, handler ]])
              */
          , off = function (element, typeSpec, fn) {
              var isTypeStr = isString(typeSpec)
                , k, type, namespaces, i
      
              if (isTypeStr && typeSpec.indexOf(' ') > 0) {
                // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
                typeSpec = str2arr(typeSpec)
                for (i = typeSpec.length; i--;)
                  off(element, typeSpec[i], fn)
                return element
              }
      
              type = isTypeStr && typeSpec.replace(nameRegex, '')
              if (type && customEvents[type]) type = customEvents[type].base
      
              if (!typeSpec || isTypeStr) {
                // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
                if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
                removeListener(element, type, fn, namespaces)
              } else if (isFunction(typeSpec)) {
                // off(el, fn)
                removeListener(element, null, typeSpec)
              } else {
                // off(el, { t1: fn1, t2, fn2 })
                for (k in typeSpec) {
                  if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
                }
              }
      
              return element
            }
      
            /**
              * on(element, eventType(s)[, selector], handler[, args ])
              */
          , on = function(element, events, selector, fn) {
              var originalFn, type, types, i, args, entry, first
      
              //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
              if (selector === undefined && typeof events == 'object') {
                //TODO: this can't handle delegated events
                for (type in events) {
                  if (events.hasOwnProperty(type)) {
                    on.call(this, element, type, events[type])
                  }
                }
                return
              }
      
              if (!isFunction(selector)) {
                // delegated event
                originalFn = fn
                args       = slice.call(arguments, 4)
                fn         = delegate(selector, originalFn, selectorEngine)
              } else {
                args       = slice.call(arguments, 3)
                fn         = originalFn = selector
              }
      
              types = str2arr(events)
      
              // special case for one(), wrap in a self-removing handler
              if (this === ONE) {
                fn = once(off, element, events, fn, originalFn)
              }
      
              for (i = types.length; i--;) {
                // add new handler to the registry and check if it's the first for this element/type
                first = registry.put(entry = new RegEntry(
                    element
                  , types[i].replace(nameRegex, '') // event type
                  , fn
                  , originalFn
                  , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
                  , args
                  , false // not root
                ))
                if (entry[eventSupport] && first) {
                  // first event of this type on this element, add root listener
                  listener(element, entry.eventType, true, entry.customType)
                }
              }
      
              return element
            }
      
            /**
              * add(element[, selector], eventType(s), handler[, args ])
              *
              * Deprecated: kept (for now) for backward-compatibility
              */
          , add = function (element, events, fn, delfn) {
              return on.apply(
                  null
                , !isString(fn)
                    ? slice.call(arguments)
                    : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
              )
            }
      
            /**
              * one(element, eventType(s)[, selector], handler[, args ])
              */
          , one = function () {
              return on.apply(ONE, arguments)
            }
      
            /**
              * fire(element, eventType(s)[, args ])
              *
              * The optional 'args' argument must be an array, if no 'args' argument is provided
              * then we can use the browser's DOM event system, otherwise we trigger handlers manually
              */
          , fire = function (element, type, args) {
              var types = str2arr(type)
                , i, j, l, names, handlers
      
              for (i = types.length; i--;) {
                type = types[i].replace(nameRegex, '')
                if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
                if (!names && !args && element[eventSupport]) {
                  fireListener(nativeEvents[type], type, element)
                } else {
                  // non-native event, either because of a namespace, arguments or a non DOM element
                  // iterate over all listeners and manually 'fire'
                  handlers = registry.get(element, type, null, false)
                  args = [false].concat(args)
                  for (j = 0, l = handlers.length; j < l; j++) {
                    if (handlers[j].inNamespaces(names)) {
                      handlers[j].handler.apply(element, args)
                    }
                  }
                }
              }
              return element
            }
      
            /**
              * clone(dstElement, srcElement[, eventType ])
              *
              * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
              */
          , clone = function (element, from, type) {
              var handlers = registry.get(from, type, null, false)
                , l = handlers.length
                , i = 0
                , args, beanDel
      
              for (; i < l; i++) {
                if (handlers[i].original) {
                  args = [ element, handlers[i].type ]
                  if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
                  args.push(handlers[i].original)
                  on.apply(null, args)
                }
              }
              return element
            }
      
          , bean = {
                'on'                : on
              , 'add'               : add
              , 'one'               : one
              , 'off'               : off
              , 'remove'            : off
              , 'clone'             : clone
              , 'fire'              : fire
              , 'Event'             : Event
              , 'setSelectorEngine' : setSelectorEngine
              , 'noConflict'        : function () {
                  context[name] = old
                  return this
                }
            }
      
        // for IE, clean up on unload to avoid leaks
        if (win.attachEvent) {
          var cleanup = function () {
            var i, entries = registry.entries()
            for (i in entries) {
              if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
            }
            win.detachEvent('onunload', cleanup)
            win.CollectGarbage && win.CollectGarbage()
          }
          win.attachEvent('onunload', cleanup)
        }
      
        // initialize selector engine to internal default (qSA or throw Error)
        setSelectorEngine()
      
        return bean
      });
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
        var b = require('bean')
      
          , integrate = function (method, type, method2) {
              var _args = type ? [type] : []
              return function () {
                for (var i = 0, l = this.length; i < l; i++) {
                  if (!arguments.length && method == 'on' && type) method = 'fire'
                  b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
                }
                return this
              }
            }
      
          , add   = integrate('add')
          , on    = integrate('on')
          , one   = integrate('one')
          , off   = integrate('off')
          , fire  = integrate('fire')
          , clone = integrate('clone')
      
          , hover = function (enter, leave, i) { // i for internal
              for (i = this.length; i--;) {
                b['on'].call(this, this[i], 'mouseenter', enter)
                b['on'].call(this, this[i], 'mouseleave', leave)
              }
              return this
            }
      
          , methods = {
                'on'             : on
              , 'addListener'    : on
              , 'bind'           : on
              , 'listen'         : on
              , 'delegate'       : add // jQuery compat, same arg order as add()
      
              , 'one'            : one
      
              , 'off'            : off
              , 'unbind'         : off
              , 'unlisten'       : off
              , 'removeListener' : off
              , 'undelegate'     : off
      
              , 'emit'           : fire
              , 'trigger'        : fire
      
              , 'cloneEvents'    : clone
      
              , 'hover'          : hover
            }
      
          , shortcuts =
               ('blur change click dblclick error focus focusin focusout keydown keypress '
              + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
              + 'mousemove resize scroll select submit unload').split(' ')
      
        for (var i = shortcuts.length; i--;) {
          methods[shortcuts[i]] = integrate('on', shortcuts[i])
        }
      
        b['setSelectorEngine']($)
      
        $.ender(methods, true)
      }(ender);
    }
  }, 'bean');

  require('underscore');
  require('domready');
  require('domready/src/ender');
  require('qwery');
  require('qwery/src/ender');
  require('bonzo');
  require('bonzo/src/ender');
  require('bean');
  require('bean/src/ender');

}.call(window));
//# sourceMappingURL=ender.js.map
