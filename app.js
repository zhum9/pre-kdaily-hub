"use client";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.6";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(
        React,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// app/DailyHub.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var DAILY_FEED_LIMIT = 9;
var FEED_RULE_VERSION = 2;
var GOLD_REQUIRED_DAYS = 3;
var GOLD_REQUIRED_FEEDS = 9;
var TYRANT_REQUIRED_DAYS = 7;
var TYRANT_REQUIRED_FEEDS = 63;
var OK_KING_REQUIRED_DAYS = 10;
var OK_KING_REQUIRED_FEEDS = 90;
var pets = {
  silver: {
    id: "silver",
    name: "\u5C0F\u767D\u94F6",
    species: "\u767D\u94F6\u4EBA\u9A6C",
    code: "NO.034",
    portrait: "/silver-centaur-portrait.webp",
    detail: "/silver-centaur-detail.webp",
    accent: "#78a9c9"
  },
  gold: {
    id: "gold",
    name: "\u95EA\u91D1",
    species: "\u9EC4\u91D1\u4EBA\u9A6C",
    code: "H034-GD",
    portrait: "/gold-centaur-portrait.webp",
    detail: "/gold-centaur-detail.webp",
    accent: "#d59a22"
  },
  tyrant: {
    id: "tyrant",
    name: "\u66B4\u66B4",
    species: "\u66B4\u541B\u4EBA\u9A6C",
    code: "NO.516",
    portrait: "/tyrant-centaur-portrait.webp",
    detail: "/tyrant-centaur-detail.webp",
    accent: "#d63870"
  },
  okking: {
    id: "okking",
    name: "\u5C0FOK\u738B",
    species: "\u53E4\u6817\u6B27\u514B\u738B",
    code: "NO.517",
    portrait: "/ok-king-portrait.webp",
    detail: "/ok-king-detail.webp",
    accent: "#b47b18"
  }
};
var sections = [
  { id: "home", label: "\u4ECA\u65E5\u9996\u9875", icon: "\u2600\uFE0F", color: "#5c9ef5" },
  { id: "pinyin", label: "\u62FC\u97F3\u4E13\u533A", icon: "\u{1F524}", color: "#6e9ff8" },
  { id: "hanzi", label: "\u751F\u5B57\u4E13\u533A", icon: "\u5B57", color: "#ef8e6c" },
  { id: "poem", label: "\u53E4\u8BD7\u4E13\u533A", icon: "\u{1F4DC}", color: "#a782e7" },
  { id: "english", label: "\u82F1\u8BED\u53E3\u8BED", icon: "\u{1F5E3}\uFE0F", color: "#6d8de8" },
  { id: "math", label: "\u6570\u5B66\u4E13\u533A", icon: "\u2795", color: "#45bfa7" },
  { id: "focus", label: "\u4E13\u6CE8\u529B\u8BAD\u7EC3", icon: "\u{1F3AF}", color: "#f3aa45" },
  { id: "games", label: "\u76CA\u667A\u5C0F\u6E38\u620F", icon: "\u{1F9E9}", color: "#d27dd5" },
  { id: "science", label: "\u79D1\u666E\u4E13\u533A", icon: "\u{1F52D}", color: "#53a9d8" },
  { id: "sport", label: "\u524D\u5EAD\u4E13\u6CE8\u529B\u8FD0\u52A8", icon: "\u{1F938}", color: "#f47d85" },
  { id: "recipe", label: "\u5065\u5EB7\u98DF\u8C31", icon: "\u{1F955}", color: "#7bbf59" },
  { id: "chores", label: "\u5BB6\u52A1\u52B3\u52A8", icon: "\u{1F9F9}", color: "#d89b65", hidden: true },
  { id: "pet", label: "\u5C0F\u5BA0\u7269\u4E2D\u5FC3", icon: "\u265E", color: "#6caecb" },
  { id: "calendar", label: "\u65E5\u5386\u6253\u5361", icon: "\u{1F4C5}", color: "#7187d8" }
];
var pinyinBands = [
  [
    ["b\u0101", "b\xE1", "b\u01CE", "b\xE0", "\u516B\uFF5C\u62D4\uFF5C\u628A\uFF5C\u7238"],
    ["m\u0101", "m\xE1", "m\u01CE", "m\xE0", "\u5988\uFF5C\u9EBB\uFF5C\u9A6C\uFF5C\u9A82"],
    ["d\u012B", "d\xED", "d\u01D0", "d\xEC", "\u4F4E\uFF5C\u7B1B\uFF5C\u5E95\uFF5C\u5730"],
    ["t\u016B", "t\xFA", "t\u01D4", "t\xF9", "\u51F8\uFF5C\u56FE\uFF5C\u571F\uFF5C\u5154"],
    ["n\u012B", "n\xED", "n\u01D0", "n\xEC", "\u59AE\uFF5C\u6CE5\uFF5C\u4F60\uFF5C\u9006"],
    ["l\u012B", "l\xED", "l\u01D0", "l\xEC", "\u54E9\uFF5C\u79BB\uFF5C\u91CC\uFF5C\u529B"],
    ["g\u016B", "g\xFA", "g\u01D4", "g\xF9", "\u59D1\uFF5C\u53E4\uFF5C\u6545"],
    ["k\u0113", "k\xE9", "k\u011B", "k\xE8", "\u79D1\uFF5C\u58F3\uFF5C\u53EF\uFF5C\u8BFE"],
    ["h\u016B", "h\xFA", "h\u01D4", "h\xF9", "\u547C\uFF5C\u6E56\uFF5C\u864E\uFF5C\u6237"],
    ["f\u016B", "f\xFA", "f\u01D4", "f\xF9", "\u592B\uFF5C\u798F\uFF5C\u5E9C\uFF5C\u7236"],
    ["p\u014D", "p\xF3", "p\u01D2", "p\xF2", "\u5761\uFF5C\u5A46\uFF5C\u53F5\uFF5C\u7834"],
    ["m\u014D", "m\xF3", "m\u01D2", "m\xF2", "\u6478\uFF5C\u78E8\uFF5C\u62B9\uFF5C\u58A8"]
  ],
  [
    ["j\u012B", "j\xED", "j\u01D0", "j\xEC", "\u9E21\uFF5C\u6025\uFF5C\u6324\uFF5C\u8BB0"],
    ["q\u012B", "q\xED", "q\u01D0", "q\xEC", "\u4E03\uFF5C\u65D7\uFF5C\u8D77\uFF5C\u6C14"],
    ["x\u012B", "x\xED", "x\u01D0", "x\xEC", "\u897F\uFF5C\u4E60\uFF5C\u6D17\uFF5C\u7EC6"],
    ["zh\u012B", "zh\xED", "zh\u01D0", "zh\xEC", "\u77E5\uFF5C\u76F4\uFF5C\u7EB8\uFF5C\u5FD7"],
    ["ch\u012B", "ch\xED", "ch\u01D0", "ch\xEC", "\u5403\uFF5C\u8FDF\uFF5C\u5C3A\uFF5C\u7FC5"],
    ["sh\u012B", "sh\xED", "sh\u01D0", "sh\xEC", "\u5E08\uFF5C\u5341\uFF5C\u4F7F\uFF5C\u662F"],
    ["y\u012B", "y\xED", "y\u01D0", "y\xEC", "\u4E00\uFF5C\u59E8\uFF5C\u4EE5\uFF5C\u610F"],
    ["w\u016B", "w\xFA", "w\u01D4", "w\xF9", "\u5C4B\uFF5C\u65E0\uFF5C\u4E94\uFF5C\u7269"],
    ["z\u0101", "z\xE1", "z\u01CE", "z\xE0", "\u624E\uFF5C\u6742\uFF5C\u548B"],
    ["s\u0101", "s\xE1", "s\u01CE", "s\xE0", "\u6492\uFF5C\u6D12\uFF5C\u98D2"],
    ["r\u0101o", "r\xE1o", "r\u01CEo", "r\xE0o", "\u9976\uFF5C\u6270\uFF5C\u7ED5"],
    ["c\u0101o", "c\xE1o", "c\u01CEo", "c\xE0o", "\u64CD\uFF5C\u66F9\uFF5C\u8349"]
  ],
  [
    ["b\u0101i", "b\xE1i", "b\u01CEi", "b\xE0i", "\u63B0\uFF5C\u767D\uFF5C\u767E\uFF5C\u8D25"],
    ["p\u0113i", "p\xE9i", "p\u011Bi", "p\xE8i", "\u80DA\uFF5C\u966A\uFF5C\u914D"],
    ["m\u0101o", "m\xE1o", "m\u01CEo", "m\xE0o", "\u732B\uFF5C\u6BDB\uFF5C\u536F\uFF5C\u5E3D"],
    ["f\u0113i", "f\xE9i", "f\u011Bi", "f\xE8i", "\u98DE\uFF5C\u80A5\uFF5C\u532A\uFF5C\u8D39"],
    ["d\u014Du", "d\xF3u", "d\u01D2u", "d\xF2u", "\u90FD\uFF5C\u6597\uFF5C\u8C46"],
    ["t\u0101o", "t\xE1o", "t\u01CEo", "t\xE0o", "\u6D9B\uFF5C\u6843\uFF5C\u8BA8\uFF5C\u5957"],
    ["g\u0101i", "g\xE1i", "g\u01CEi", "g\xE0i", "\u8BE5\uFF5C\u6539\uFF5C\u76D6"],
    ["k\u0101i", "k\xE1i", "k\u01CEi", "k\xE0i", "\u5F00\uFF5C\u51EF\uFF5C\u6168"],
    ["h\u0113i", "h\xE9i", "h\u011Bi", "h\xE8i", "\u9ED1\uFF5C\u563F"],
    ["li\u016B", "li\xFA", "li\u01D4", "li\xF9", "\u6E9C\uFF5C\u6D41\uFF5C\u67F3\uFF5C\u516D"],
    ["ji\u0101", "ji\xE1", "ji\u01CE", "ji\xE0", "\u5BB6\uFF5C\u5939\uFF5C\u5047\uFF5C\u67B6"],
    ["xi\u0113", "xi\xE9", "xi\u011B", "xi\xE8", "\u4E9B\uFF5C\u978B\uFF5C\u5199\uFF5C\u8C22"]
  ],
  [
    ["b\u0101n", "b\xE1n", "b\u01CEn", "b\xE0n", "\u73ED\uFF5C\u677F\uFF5C\u534A"],
    ["p\u0113n", "p\xE9n", "p\u011Bn", "p\xE8n", "\u55B7\uFF5C\u76C6"],
    ["m\u012Bn", "m\xEDn", "m\u01D0n", "m\xECn", "\u6C11\uFF5C\u654F"],
    ["f\u0101ng", "f\xE1ng", "f\u01CEng", "f\xE0ng", "\u65B9\uFF5C\u623F\uFF5C\u8BBF\uFF5C\u653E"],
    ["d\u0113ng", "d\xE9ng", "d\u011Bng", "d\xE8ng", "\u706F\uFF5C\u7B49\uFF5C\u51F3"],
    ["t\u0101ng", "t\xE1ng", "t\u01CEng", "t\xE0ng", "\u6C64\uFF5C\u7CD6\uFF5C\u8EBA\uFF5C\u70EB"],
    ["g\u0113n", "g\xE9n", "g\u011Bn", "g\xE8n", "\u6839\uFF5C\u826E"],
    ["k\u014Dng", "k\xF3ng", "k\u01D2ng", "k\xF2ng", "\u7A7A\uFF5C\u5B54\uFF5C\u63A7"],
    ["h\u0113ng", "h\xE9ng", "h\u011Bng", "h\xE8ng", "\u54FC\uFF5C\u6A2A"],
    ["l\u012Bn", "l\xEDn", "l\u01D0n", "l\xECn", "\u62CE\uFF5C\u6797\uFF5C\u51DB\uFF5C\u541D"],
    ["qi\u0101n", "qi\xE1n", "qi\u01CEn", "qi\xE0n", "\u5343\uFF5C\u524D\uFF5C\u6D45\uFF5C\u6B20"],
    ["xi\u0101ng", "xi\xE1ng", "xi\u01CEng", "xi\xE0ng", "\u9999\uFF5C\u8BE6\uFF5C\u60F3\uFF5C\u5411"]
  ],
  [
    ["yu\u0101n", "yu\xE1n", "yu\u01CEn", "yu\xE0n", "\u51A4\uFF5C\u56ED\uFF5C\u8FDC\uFF5C\u9662"],
    ["y\u012Bn", "y\xEDn", "y\u01D0n", "y\xECn", "\u97F3\uFF5C\u94F6\uFF5C\u5F15\uFF5C\u5370"],
    ["y\u012Bng", "y\xEDng", "y\u01D0ng", "y\xECng", "\u9E70\uFF5C\u8FCE\uFF5C\u5F71\uFF5C\u786C"],
    ["w\u0113n", "w\xE9n", "w\u011Bn", "w\xE8n", "\u6E29\uFF5C\u6587\uFF5C\u7A33\uFF5C\u95EE"],
    ["w\u0101ng", "w\xE1ng", "w\u01CEng", "w\xE0ng", "\u6C6A\uFF5C\u738B\uFF5C\u7F51\uFF5C\u671B"],
    ["zh\u0113ng", "zh\xE9ng", "zh\u011Bng", "zh\xE8ng", "\u4E89\uFF5C\u6574\uFF5C\u6B63"],
    ["ch\u014Dng", "ch\xF3ng", "ch\u01D2ng", "ch\xF2ng", "\u51B2\uFF5C\u866B\uFF5C\u5BA0\uFF5C\u94F3"],
    ["sh\u0113n", "sh\xE9n", "sh\u011Bn", "sh\xE8n", "\u8EAB\uFF5C\u795E\uFF5C\u6C88\uFF5C\u751A"],
    ["r\u0113ng", "r\xE9ng", "r\u011Bng", "r\xE8ng", "\u6254\uFF5C\u4ECD"],
    ["z\u014Dng", "z\xF3ng", "z\u01D2ng", "z\xF2ng", "\u5B97\uFF5C\u603B\uFF5C\u7EB5"],
    ["c\u014Dng", "c\xF3ng", "c\u01D2ng", "c\xF2ng", "\u8471\uFF5C\u4ECE\uFF5C\u4E1B"],
    ["s\u014Dng", "s\xF3ng", "s\u01D2ng", "s\xF2ng", "\u677E\uFF5C\u6002\uFF5C\u9001"]
  ],
  [
    ["ju\u0101n", "ju\xE1n", "ju\u01CEn", "ju\xE0n", "\u6350\uFF5C\u5377\uFF5C\u5026"],
    ["qu\u0101n", "qu\xE1n", "qu\u01CEn", "qu\xE0n", "\u5708\uFF5C\u5168\uFF5C\u72AC\uFF5C\u529D"],
    ["xu\u0101n", "xu\xE1n", "xu\u01CEn", "xu\xE0n", "\u5BA3\uFF5C\u65CB\uFF5C\u9009\uFF5C\u70AB"],
    ["bi\u0101n", "bi\xE1n", "bi\u01CEn", "bi\xE0n", "\u8FB9\uFF5C\u6241\uFF5C\u53D8"],
    ["pi\u0101n", "pi\xE1n", "pi\u01CEn", "pi\xE0n", "\u7BC7\uFF5C\u4FBF\uFF5C\u7247"],
    ["mi\u0101o", "mi\xE1o", "mi\u01CEo", "mi\xE0o", "\u55B5\uFF5C\u82D7\uFF5C\u79D2\uFF5C\u5999"],
    ["di\u0101o", "di\xE1o", "di\u01CEo", "di\xE0o", "\u96D5\uFF5C\u9493"],
    ["ti\u0101n", "ti\xE1n", "ti\u01CEn", "ti\xE0n", "\u5929\uFF5C\u7530\uFF5C\u8214"],
    ["ni\u0101n", "ni\xE1n", "ni\u01CEn", "ni\xE0n", "\u852B\uFF5C\u5E74\uFF5C\u637B\uFF5C\u5FF5"],
    ["li\u0101ng", "li\xE1ng", "li\u01CEng", "li\xE0ng", "\u51C9\uFF5C\u4E24\uFF5C\u4EAE\uFF5C\u91CF"],
    ["ji\u014Dng", "ji\xF3ng", "ji\u01D2ng", "ji\xF2ng", "\u70AF\uFF5C\u7A98"],
    ["qi\u014Dng", "qi\xF3ng", "qi\u01D2ng", "qi\xF2ng", "\u7A77\uFF5C\u743C"]
  ]
];
var hanziPool = [
  ["\u4E00", "y\u012B", "\u4E00\u4E2A\u3001\u4E00\u5FC3\u4E00\u610F"],
  ["\u4E8C", "\xE8r", "\u4E8C\u6708\u3001\u4E8C\u4EBA"],
  ["\u4E09", "s\u0101n", "\u4E09\u5929\u3001\u4E09\u5FC3\u4E8C\u610F"],
  ["\u4E0A", "sh\xE0ng", "\u4E0A\u5B66\u3001\u65E9\u4E0A"],
  ["\u53E3", "k\u01D2u", "\u95E8\u53E3\u3001\u5F00\u53E3"],
  ["\u76EE", "m\xF9", "\u76EE\u5149\u3001\u8033\u76EE"],
  ["\u8033", "\u011Br", "\u8033\u6735\u3001\u6728\u8033"],
  ["\u624B", "sh\u01D2u", "\u5C0F\u624B\u3001\u624B\u5FC3"],
  ["\u65E5", "r\xEC", "\u65E5\u5B50\u3001\u751F\u65E5"],
  ["\u7530", "ti\xE1n", "\u7530\u5730\u3001\u6C34\u7530"],
  ["\u79BE", "h\xE9", "\u79BE\u82D7\u3001\u79BE\u7530"],
  ["\u706B", "hu\u01D2", "\u706B\u82D7\u3001\u5927\u706B"],
  ["\u866B", "ch\xF3ng", "\u5C0F\u866B\u3001\u866B\u5B50"],
  ["\u4E91", "y\xFAn", "\u767D\u4E91\u3001\u4E91\u6735"],
  ["\u5C71", "sh\u0101n", "\u5927\u5C71\u3001\u5C71\u6C34"],
  ["\u516B", "b\u0101", "\u516B\u4E2A\u3001\u516B\u6708"],
  ["\u5341", "sh\xED", "\u5341\u4E2A\u3001\u5341\u6708"],
  ["\u4E86", "le", "\u597D\u4E86\u3001\u6765\u4E86"],
  ["\u5B50", "z\u01D0", "\u513F\u5B50\u3001\u5B50\u5973"],
  ["\u4EBA", "r\xE9n", "\u5927\u4EBA\u3001\u4EBA\u6C11"],
  ["\u5927", "d\xE0", "\u5927\u5C0F\u3001\u5927\u5C71"],
  ["\u6708", "yu\xE8", "\u6708\u4EAE\u3001\u6708\u5149"],
  ["\u513F", "\xE9r", "\u513F\u5B50\u3001\u513F\u7AE5"],
  ["\u5934", "t\xF3u", "\u6728\u5934\u3001\u62AC\u5934"],
  ["\u91CC", "l\u01D0", "\u91CC\u9762\u3001\u624B\u91CC"],
  ["\u53EF", "k\u011B", "\u53EF\u4EE5\u3001\u53EF\u662F"],
  ["\u4E1C", "d\u014Dng", "\u4E1C\u65B9\u3001\u4E1C\u897F"],
  ["\u897F", "x\u012B", "\u897F\u8FB9\u3001\u4E1C\u897F"],
  ["\u5929", "ti\u0101n", "\u5929\u7A7A\u3001\u4ECA\u5929"],
  ["\u56DB", "s\xEC", "\u56DB\u4E2A\u3001\u56DB\u65B9"],
  ["\u662F", "sh\xEC", "\u662F\u7684\u3001\u4E0D\u662F"],
  ["\u5973", "n\u01DA", "\u5973\u513F\u3001\u5973\u751F"],
  ["\u5F00", "k\u0101i", "\u5F00\u95E8\u3001\u5F00\u5FC3"],
  ["\u6C34", "shu\u01D0", "\u6C34\u91CC\u3001\u5F00\u6C34"],
  ["\u53BB", "q\xF9", "\u51FA\u53BB\u3001\u56DE\u53BB"],
  ["\u6765", "l\xE1i", "\u56DE\u6765\u3001\u6765\u53BB"],
  ["\u4E0D", "b\xF9", "\u4E0D\u662F\u3001\u4E0D\u597D"],
  ["\u5C0F", "xi\u01CEo", "\u5927\u5C0F\u3001\u5C0F\u624B"],
  ["\u5C11", "sh\u01CEo", "\u591A\u5C11\u3001\u5C11\u89C1"],
  ["\u725B", "ni\xFA", "\u5C0F\u725B\u3001\u725B\u7F8A"],
  ["\u679C", "gu\u01D2", "\u6C34\u679C\u3001\u679C\u5B50"],
  ["\u9E1F", "ni\u01CEo", "\u5C0F\u9E1F\u3001\u9E1F\u513F"],
  ["\u65E9", "z\u01CEo", "\u65E9\u4E0A\u3001\u65E9\u5B89"],
  ["\u4E66", "sh\u016B", "\u4E66\u672C\u3001\u770B\u4E66"],
  ["\u5200", "d\u0101o", "\u5C0F\u5200\u3001\u5200\u53E3"],
  ["\u5C3A", "ch\u01D0", "\u5C3A\u5B50\u3001\u76F4\u5C3A"],
  ["\u672C", "b\u011Bn", "\u4E66\u672C\u3001\u672C\u5B50"],
  ["\u6728", "m\xF9", "\u6728\u5934\u3001\u6811\u6728"],
  ["\u6797", "l\xEDn", "\u6811\u6797\u3001\u7AF9\u6797"],
  ["\u571F", "t\u01D4", "\u571F\u5730\u3001\u6CE5\u571F"],
  ["\u529B", "l\xEC", "\u529B\u6C14\u3001\u7528\u529B"],
  ["\u5FC3", "x\u012Bn", "\u5F00\u5FC3\u3001\u7528\u5FC3"],
  ["\u4E2D", "zh\u014Dng", "\u4E2D\u95F4\u3001\u4E2D\u5FC3"],
  ["\u4E94", "w\u01D4", "\u4E94\u4E2A\u3001\u4E94\u6708"],
  ["\u7ACB", "l\xEC", "\u7ACB\u6B63\u3001\u7AD9\u7ACB"],
  ["\u6B63", "zh\xE8ng", "\u6B63\u5728\u3001\u6B63\u597D"],
  ["\u5728", "z\xE0i", "\u6B63\u5728\u3001\u73B0\u5728"],
  ["\u540E", "h\xF2u", "\u524D\u540E\u3001\u540E\u6765"],
  ["\u6211", "w\u01D2", "\u6211\u4EEC\u3001\u6211\u7684"],
  ["\u597D", "h\u01CEo", "\u597D\u4EBA\u3001\u6B63\u597D"],
  ["\u957F", "ch\xE1ng", "\u957F\u77ED\u3001\u957F\u5927"],
  ["\u6BD4", "b\u01D0", "\u5BF9\u6BD4\u3001\u6BD4\u8D5B"],
  ["\u5DF4", "b\u0101", "\u5C3E\u5DF4\u3001\u5DF4\u58EB"],
  ["\u628A", "b\u01CE", "\u4E00\u628A\u3001\u628A\u624B"],
  ["\u4E0B", "xi\xE0", "\u4E0A\u4E0B\u3001\u4E0B\u96E8"],
  ["\u4E2A", "g\xE8", "\u4E00\u4E2A\u3001\u4E2A\u4EBA"],
  ["\u96E8", "y\u01D4", "\u4E0B\u96E8\u3001\u96E8\u6C34"],
  ["\u4EEC", "men", "\u6211\u4EEC\u3001\u4EBA\u4EEC"],
  ["\u95EE", "w\xE8n", "\u95EE\u597D\u3001\u5B66\u95EE"],
  ["\u6709", "y\u01D2u", "\u6CA1\u6709\u3001\u6709\u7528"],
  ["\u534A", "b\xE0n", "\u4E00\u534A\u3001\u534A\u5929"],
  ["\u4ECE", "c\xF3ng", "\u4ECE\u524D\u3001\u4ECE\u6765"],
  ["\u4F60", "n\u01D0", "\u4F60\u597D\u3001\u4F60\u4EEC"],
  ["\u624D", "c\xE1i", "\u4EBA\u624D\u3001\u521A\u624D"],
  ["\u660E", "m\xEDng", "\u660E\u5929\u3001\u660E\u4EAE"],
  ["\u540C", "t\xF3ng", "\u540C\u5B66\u3001\u5171\u540C"],
  ["\u5B66", "xu\xE9", "\u5B66\u4E60\u3001\u5B66\u751F"],
  ["\u81EA", "z\xEC", "\u81EA\u5DF1\u3001\u81EA\u5728"],
  ["\u5DF1", "j\u01D0", "\u81EA\u5DF1\u3001\u77E5\u5DF1"],
  ["\u8863", "y\u012B", "\u8863\u670D\u3001\u4E0A\u8863"],
  ["\u767D", "b\xE1i", "\u767D\u4E91\u3001\u767D\u5929"],
  ["\u7684", "de", "\u6211\u7684\u3001\u597D\u7684"],
  ["\u53C8", "y\xF2u", "\u53C8\u5927\u53C8\u5706\u3001\u53C8\u662F"],
  ["\u548C", "h\xE9", "\u548C\u597D\u3001\u548C\u5E73"],
  ["\u7AF9", "zh\xFA", "\u7AF9\u5B50\u3001\u7AF9\u6797"],
  ["\u7259", "y\xE1", "\u7259\u9F7F\u3001\u6708\u7259"],
  ["\u9A6C", "m\u01CE", "\u5C0F\u9A6C\u3001\u9A6C\u4E0A"],
  ["\u7528", "y\xF2ng", "\u7528\u529B\u3001\u6709\u7528"],
  ["\u51E0", "j\u01D0", "\u51E0\u4E2A\u3001\u51E0\u5929"],
  ["\u53EA", "zh\u012B", "\u4E00\u53EA\u3001\u53EA\u6709"],
  ["\u77F3", "sh\xED", "\u77F3\u5934\u3001\u77F3\u5B50"],
  ["\u591A", "du\u014D", "\u591A\u5C11\u3001\u5F88\u591A"],
  ["\u51FA", "ch\u016B", "\u51FA\u6765\u3001\u51FA\u95E8"],
  ["\u89C1", "ji\xE0n", "\u770B\u89C1\u3001\u518D\u89C1"],
  ["\u5BF9", "du\xEC", "\u5BF9\u6BD4\u3001\u5BF9\u624B"],
  ["\u5988", "m\u0101", "\u5988\u5988\u3001\u7238\u5988"],
  ["\u5168", "qu\xE1n", "\u5168\u90E8\u3001\u5B8C\u5168"],
  ["\u56DE", "hu\xED", "\u56DE\u6765\u3001\u56DE\u53BB"],
  ["\u5DE5", "g\u014Dng", "\u5DE5\u4EBA\u3001\u624B\u5DE5"],
  ["\u5382", "ch\u01CEng", "\u5DE5\u5382\u3001\u5382\u91CC"]
];
var poems = [
  { title: "\u548F\u9E45", author: "\u9A86\u5BBE\u738B", lines: ["\u9E45\uFF0C\u9E45\uFF0C\u9E45\uFF0C", "\u66F2\u9879\u5411\u5929\u6B4C\u3002", "\u767D\u6BDB\u6D6E\u7EFF\u6C34\uFF0C", "\u7EA2\u638C\u62E8\u6E05\u6CE2\u3002"], note: "\u767D\u9E45\u5F2F\u7740\u957F\u957F\u7684\u8116\u5B50\u5411\u5929\u6B22\u53EB\uFF0C\u6D01\u767D\u7684\u7FBD\u6BDB\u6D6E\u5728\u78A7\u6C34\u4E0A\uFF0C\u7EA2\u7EA2\u7684\u811A\u638C\u62E8\u52A8\u7740\u6E05\u6E05\u7684\u6C34\u6CE2\u3002" },
  { title: "\u9759\u591C\u601D", author: "\u674E\u767D", lines: ["\u5E8A\u524D\u660E\u6708\u5149\uFF0C", "\u7591\u662F\u5730\u4E0A\u971C\u3002", "\u4E3E\u5934\u671B\u660E\u6708\uFF0C", "\u4F4E\u5934\u601D\u6545\u4E61\u3002"], note: "\u660E\u4EAE\u7684\u6708\u5149\u6D12\u5728\u5E8A\u524D\uFF0C\u50CF\u5730\u4E0A\u7684\u767D\u971C\u3002\u8BD7\u4EBA\u62AC\u5934\u671B\u6708\uFF0C\u4F4E\u5934\u60F3\u5FF5\u5BB6\u4E61\u3002" },
  { title: "\u753B", author: "\u738B\u7EF4", lines: ["\u8FDC\u770B\u5C71\u6709\u8272\uFF0C", "\u8FD1\u542C\u6C34\u65E0\u58F0\u3002", "\u6625\u53BB\u82B1\u8FD8\u5728\uFF0C", "\u4EBA\u6765\u9E1F\u4E0D\u60CA\u3002"], note: "\u8FDC\u770B\u5C71\u6709\u989C\u8272\uFF0C\u8FD1\u542C\u6D41\u6C34\u5374\u6CA1\u6709\u58F0\u97F3\uFF1B\u6625\u5929\u8FC7\u53BB\u82B1\u4ECD\u5F00\u653E\uFF0C\u4EBA\u8D70\u8FD1\u9E1F\u4E5F\u4E0D\u98DE\uFF0C\u539F\u6765\u8FD9\u662F\u4E00\u5E45\u753B\u3002" },
  { title: "\u60AF\u519C", author: "\u674E\u7EC5", lines: ["\u9504\u79BE\u65E5\u5F53\u5348\uFF0C", "\u6C57\u6EF4\u79BE\u4E0B\u571F\u3002", "\u8C01\u77E5\u76D8\u4E2D\u9910\uFF0C", "\u7C92\u7C92\u7686\u8F9B\u82E6\u3002"], note: "\u519C\u6C11\u5728\u70C8\u65E5\u4E0B\u8F9B\u52E4\u52B3\u52A8\uFF0C\u6BCF\u4E00\u7C92\u7CAE\u98DF\u90FD\u6765\u4E4B\u4E0D\u6613\uFF0C\u6211\u4EEC\u8981\u73CD\u60DC\u98DF\u7269\u3002" },
  { title: "\u6625\u6653", author: "\u5B5F\u6D69\u7136", lines: ["\u6625\u7720\u4E0D\u89C9\u6653\uFF0C", "\u5904\u5904\u95FB\u557C\u9E1F\u3002", "\u591C\u6765\u98CE\u96E8\u58F0\uFF0C", "\u82B1\u843D\u77E5\u591A\u5C11\u3002"], note: "\u6625\u5929\u7761\u5F97\u9999\u751C\uFF0C\u9192\u6765\u542C\u89C1\u9E1F\u53EB\uFF1B\u60F3\u8D77\u591C\u91CC\u7684\u98CE\u96E8\uFF0C\u4E0D\u77E5\u9053\u5439\u843D\u4E86\u591A\u5C11\u82B1\u3002" },
  { title: "\u6C5F\u5357", author: "\u6C49\u4E50\u5E9C", lines: ["\u6C5F\u5357\u53EF\u91C7\u83B2\uFF0C", "\u83B2\u53F6\u4F55\u7530\u7530\u3002", "\u9C7C\u620F\u83B2\u53F6\u95F4\u3002", "\u9C7C\u620F\u83B2\u53F6\u4E1C\uFF0C\u9C7C\u620F\u83B2\u53F6\u897F\u3002"], note: "\u6C5F\u5357\u6C34\u4E61\u83B2\u53F6\u8302\u76DB\uFF0C\u5C0F\u9C7C\u5728\u83B2\u53F6\u95F4\u81EA\u7531\u81EA\u5728\u5730\u6E38\u6765\u6E38\u53BB\u3002" },
  { title: "\u98CE", author: "\u674E\u5CE4", lines: ["\u89E3\u843D\u4E09\u79CB\u53F6\uFF0C", "\u80FD\u5F00\u4E8C\u6708\u82B1\u3002", "\u8FC7\u6C5F\u5343\u5C3A\u6D6A\uFF0C", "\u5165\u7AF9\u4E07\u7AFF\u659C\u3002"], note: "\u98CE\u80FD\u5439\u843D\u79CB\u53F6\u3001\u5439\u5F00\u6625\u82B1\uFF0C\u4E5F\u80FD\u5728\u6C5F\u9762\u6380\u8D77\u6CE2\u6D6A\uFF0C\u8BA9\u7AF9\u5B50\u5F2F\u4E0B\u8EAB\u5B50\u3002" },
  { title: "\u53E4\u6717\u6708\u884C", author: "\u674E\u767D", lines: ["\u5C0F\u65F6\u4E0D\u8BC6\u6708\uFF0C", "\u547C\u4F5C\u767D\u7389\u76D8\u3002", "\u53C8\u7591\u7476\u53F0\u955C\uFF0C", "\u98DE\u5728\u9752\u4E91\u7AEF\u3002"], note: "\u5C0F\u65F6\u5019\u4E0D\u8BA4\u8BC6\u6708\u4EAE\uFF0C\u628A\u5B83\u53EB\u4F5C\u767D\u7389\u76D8\uFF0C\u53C8\u89C9\u5F97\u5B83\u50CF\u98DE\u5728\u4E91\u7AEF\u7684\u660E\u955C\u3002" }
];
var scienceCards = [
  { title: "\u4E3A\u4EC0\u4E48\u5929\u7A7A\u662F\u84DD\u8272\u7684\uFF1F", body: "\u9633\u5149\u91CC\u6709\u5F88\u591A\u989C\u8272\u3002\u7A7A\u6C14\u4E2D\u7684\u5C0F\u9897\u7C92\u66F4\u5BB9\u6613\u628A\u84DD\u8272\u7684\u5149\u6563\u5411\u56DB\u9762\u516B\u65B9\uFF0C\u6240\u4EE5\u6211\u4EEC\u62AC\u5934\u770B\u89C1\u7684\u5929\u7A7A\u5927\u591A\u662F\u84DD\u8272\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u5728\u900F\u660E\u676F\u4E2D\u88C5\u6C34\uFF0C\u52A0\u5165\u4E00\u5C0F\u6EF4\u725B\u5976\uFF0C\u5173\u706F\u540E\u8BF7\u5BB6\u957F\u7528\u624B\u7535\u4ECE\u4FA7\u9762\u7167\u4E00\u7167\uFF0C\u89C2\u5BDF\u5149\u8DEF\u7684\u989C\u8272\u3002", fact: "\u5B9E\u9A8C\u53EA\u80FD\u7528\u624B\u7535\uFF0C\u4E0D\u76F4\u89C6\u5F3A\u5149\u3002" },
  { title: "\u690D\u7269\u4E5F\u4F1A\u201C\u559D\u6C34\u201D\u5417\uFF1F", body: "\u690D\u7269\u7684\u6839\u4F1A\u5438\u6536\u6C34\u5206\uFF0C\u6C34\u518D\u6CBF\u7740\u830E\u91CC\u7684\u5C0F\u7BA1\u9053\u9001\u5230\u53F6\u5B50\u548C\u82B1\u6735\uFF0C\u5C31\u50CF\u5750\u4E0A\u4E86\u4E00\u90E8\u5C0F\u7535\u68AF\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u8BF7\u5BB6\u957F\u628A\u767D\u83DC\u53F6\u63D2\u8FDB\u6EF4\u6709\u98DF\u7528\u8272\u7D20\u7684\u6C34\u4E2D\uFF0C\u9694\u51E0\u5C0F\u65F6\u89C2\u5BDF\u53F6\u8109\u989C\u8272\u3002", fact: "\u98DF\u7528\u8272\u7D20\u6C34\u53EA\u7528\u4E8E\u89C2\u5BDF\uFF0C\u4E0D\u8981\u996E\u7528\u3002" },
  { title: "\u5F71\u5B50\u4E3A\u4EC0\u4E48\u4F1A\u8DDF\u7740\u6211\u4EEC\uFF1F", body: "\u5149\u6CBF\u76F4\u7EBF\u4F20\u64AD\uFF0C\u8EAB\u4F53\u6321\u4F4F\u4E86\u5149\uFF0C\u540E\u9762\u6CA1\u6709\u88AB\u7167\u4EAE\u7684\u5730\u65B9\u5C31\u5F62\u6210\u5F71\u5B50\u3002\u5149\u7684\u4F4D\u7F6E\u6539\u53D8\uFF0C\u5F71\u5B50\u7684\u65B9\u5411\u548C\u957F\u77ED\u4E5F\u4F1A\u6539\u53D8\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u8BF7\u5BB6\u957F\u7528\u624B\u7535\u7167\u73A9\u5177\uFF0C\u4ECE\u4E0D\u540C\u65B9\u5411\u7167\u5C04\uFF0C\u89C2\u5BDF\u5F71\u5B50\u7684\u53D8\u5316\u3002", fact: "\u4E0D\u628A\u624B\u7535\u7B52\u7167\u5411\u773C\u775B\u3002" },
  { title: "\u51B0\u4E3A\u4EC0\u4E48\u4F1A\u53D8\u6210\u6C34\uFF1F", body: "\u51B0\u5438\u6536\u5468\u56F4\u7684\u70ED\u91CF\u540E\u4F1A\u6162\u6162\u878D\u5316\u6210\u6C34\uFF1B\u6C34\u53D8\u5F97\u8DB3\u591F\u51B7\uFF0C\u53C8\u4F1A\u91CD\u65B0\u7ED3\u6210\u51B0\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u628A\u4E24\u5757\u76F8\u540C\u51B0\u5757\u5206\u522B\u653E\u5728\u9633\u5149\u4E0B\u548C\u9634\u51C9\u5904\uFF0C\u6BD4\u8F83\u8C01\u5148\u878D\u5316\u3002", fact: "\u878D\u5316\u540E\u7684\u6C34\u4E0D\u8981\u996E\u7528\uFF0C\u53CA\u65F6\u64E6\u5E72\u684C\u9762\u3002" },
  { title: "\u58F0\u97F3\u662F\u600E\u6837\u8DD1\u5230\u8033\u6735\u91CC\u7684\uFF1F", body: "\u7269\u4F53\u632F\u52A8\u4F1A\u8BA9\u5468\u56F4\u7A7A\u6C14\u4E5F\u632F\u52A8\uFF0C\u8FD9\u4E9B\u632F\u52A8\u4F20\u5230\u8033\u6735\u91CC\uFF0C\u6211\u4EEC\u5C31\u542C\u5230\u4E86\u58F0\u97F3\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u5728\u7A7A\u7EB8\u76D2\u4E0A\u7EF7\u4E00\u5C42\u4FDD\u9C9C\u819C\uFF0C\u6492\u51E0\u7C92\u7C73\uFF0C\u8BF7\u5BB6\u957F\u5728\u65C1\u8FB9\u8F7B\u8F7B\u62CD\u624B\uFF0C\u89C2\u5BDF\u7C73\u7C92\u3002", fact: "\u58F0\u97F3\u4FDD\u6301\u8F7B\u67D4\uFF0C\u4E0D\u5728\u8033\u8FB9\u5927\u558A\u3002" },
  { title: "\u4E3A\u4EC0\u4E48\u6D17\u624B\u80FD\u8D76\u8D70\u7EC6\u83CC\uFF1F", body: "\u80A5\u7682\u80FD\u5E2E\u52A9\u6C34\u5E26\u8D70\u76AE\u80A4\u4E0A\u7684\u6CB9\u6C61\u548C\u8BB8\u591A\u770B\u4E0D\u89C1\u7684\u5C0F\u5FAE\u751F\u7269\uFF0C\u8BA4\u771F\u6413\u6D17\u53EF\u4EE5\u8BA9\u53CC\u624B\u66F4\u5E72\u51C0\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u5728\u6C34\u9762\u6492\u5C11\u91CF\u80E1\u6912\u7C89\u4EE3\u8868\u6C61\u7269\uFF0C\u7528\u8638\u4E86\u6D17\u6D01\u7CBE\u7684\u68C9\u7B7E\u8F7B\u89E6\u6C34\u9762\u3002", fact: "\u5B9E\u9A8C\u6750\u6599\u4E0D\u5165\u53E3\uFF0C\u7ED3\u675F\u540E\u518D\u6B21\u6D17\u624B\u3002" },
  { title: "\u7A7A\u6C14\u4E5F\u5360\u5730\u65B9\u5417\uFF1F", body: "\u7A7A\u6C14\u867D\u7136\u770B\u4E0D\u89C1\uFF0C\u5374\u4F1A\u5360\u636E\u7A7A\u95F4\u3002\u676F\u5B50\u91CC\u6709\u7A7A\u6C14\u65F6\uFF0C\u6C34\u5C31\u4E0D\u80FD\u4E00\u4E0B\u5B50\u628A\u676F\u5185\u7A7A\u95F4\u5168\u90E8\u5360\u6EE1\u3002", experiment: "\u5B89\u5168\u5C0F\u5B9E\u9A8C\uFF1A\u628A\u7EB8\u56E2\u585E\u5728\u900F\u660E\u676F\u5E95\uFF0C\u676F\u53E3\u671D\u4E0B\u5782\u76F4\u538B\u5165\u6C34\u4E2D\uFF0C\u518D\u53D6\u51FA\u89C2\u5BDF\u7EB8\u56E2\u3002", fact: "\u4F7F\u7528\u4E0D\u6613\u7834\u635F\u7684\u5851\u6599\u676F\uFF0C\u5E76\u7531\u5BB6\u957F\u51C6\u5907\u6C34\u76C6\u3002" }
];
var movementPlans = [
  [["\u2708\uFE0F", "\u5C0F\u98DE\u673A\u5E73\u8861", "\u53CC\u81C2\u5F20\u5F00\uFF0C\u5355\u811A\u7AD9\u7ACB 10 \u79D2\uFF0C\u5DE6\u53F3\u5404 3 \u6B21\u3002", "\u7A33\u5B9A\u8EAB\u4F53 \xB7 \u63D0\u5347\u6CE8\u610F"], ["\u3030\uFE0F", "\u6CBF\u7EBF\u5C0F\u811A\u8D70", "\u6CBF\u5730\u7816\u7F1D\u6162\u6162\u8D70\uFF0C\u811A\u8DDF\u63A5\u811A\u5C16\uFF0C\u5F80\u8FD4 3 \u6B21\u3002", "\u63A7\u5236\u6B65\u4F10 \xB7 \u51CF\u5C11\u5C0F\u52A8\u4F5C"], ["\u{1F64C}", "\u4EA4\u53C9\u62CD\u819D", "\u53F3\u624B\u62CD\u5DE6\u819D\uFF0C\u5DE6\u624B\u62CD\u53F3\u819D\uFF0C\u4EA4\u66FF\u5B8C\u6210 30 \u6B21\u3002", "\u5DE6\u53F3\u534F\u8C03 \xB7 \u6FC0\u6D3B\u4E13\u6CE8"]],
  [["\u{1F333}", "\u5927\u6811\u4E0D\u6447\u6643", "\u53CC\u811A\u524D\u540E\u7AD9\u6210\u4E00\u6761\u7EBF\uFF0C\u53CC\u624B\u53C9\u8170\uFF0C\u575A\u6301 15 \u79D2\u540E\u6362\u811A\u3002", "\u6838\u5FC3\u7A33\u5B9A \xB7 \u8EAB\u4F53\u63A7\u5236"], ["\u{1F980}", "\u8783\u87F9\u6A2A\u7740\u8D70", "\u5C48\u819D\u534A\u8E72\uFF0C\u5411\u5DE6\u548C\u5411\u53F3\u5404\u6A2A\u8D70 8 \u6B65\u3002", "\u524D\u5EAD\u523A\u6FC0 \xB7 \u65B9\u5411\u611F"], ["\u{1F388}", "\u62AC\u5934\u8FFD\u6C14\u7403", "\u5BB6\u957F\u7F13\u6162\u79FB\u52A8\u6C14\u7403\uFF0C\u773C\u775B\u8FFD\u968F\uFF0C\u5934\u90E8\u8F7B\u8F7B\u8F6C\u52A8 1 \u5206\u949F\u3002", "\u89C6\u89C9\u8FFD\u8E2A \xB7 \u4E13\u6CE8\u4FDD\u6301"]],
  [["\u{1F43B}", "\u5C0F\u718A\u6162\u6162\u722C", "\u624B\u811A\u7740\u5730\u5411\u524D\u722C 6 \u7C73\uFF0C\u4F11\u606F\u540E\u5F80\u8FD4 3 \u6B21\u3002", "\u56DB\u80A2\u534F\u8C03 \xB7 \u7A33\u5B9A\u8EAF\u5E72"], ["\u{1F300}", "\u8F6C\u8EAB\u627E\u65B9\u5411", "\u539F\u5730\u6162\u8F6C\u4E00\u5708\u540E\u505C\u7A33\uFF0C\u6307\u51FA\u524D\u540E\u5DE6\u53F3\uFF0C\u5171\u505A 4 \u6B21\u3002", "\u524D\u5EAD\u89C9 \xB7 \u7A7A\u95F4\u65B9\u5411"], ["\u{1F941}", "\u8282\u594F\u8E0F\u6B65", "\u542C\u5BB6\u957F\u62CD\u624B\u8282\u594F\uFF0C\u6309\u5FEB\u6162\u539F\u5730\u8E0F\u6B65 2 \u5206\u949F\u3002", "\u542C\u89C9\u4E13\u6CE8 \xB7 \u52A8\u4F5C\u6291\u5236"]],
  [["\u{1F427}", "\u4F01\u9E45\u5939\u7403\u8D70", "\u53CC\u819D\u5939\u4F4F\u8F6F\u7403\uFF0C\u5C0F\u6B65\u8D70\u5230\u7EC8\u70B9\u518D\u8FD4\u56DE\uFF0C\u5171 4 \u6B21\u3002", "\u4E0B\u80A2\u63A7\u5236 \xB7 \u51CF\u5C11\u4E71\u52A8"], ["\u{1F309}", "\u8FC7\u5C0F\u6865", "\u6CBF\u4E24\u6761\u80F6\u5E26\u4E4B\u95F4\u6162\u8D70\uFF0C\u53CC\u81C2\u5C55\u5F00\u4FDD\u6301\u5E73\u8861\u3002", "\u5E73\u8861\u63A7\u5236 \xB7 \u96C6\u4E2D\u6CE8\u610F"], ["\u{1F44F}", "\u53E3\u4EE4\u62CD\u62CD\u624B", "\u542C\u5230\u52A8\u7269\u540D\u62CD\u624B\uFF0C\u542C\u5230\u6C34\u679C\u540D\u4E0D\u52A8\uFF0C\u5171\u8FDB\u884C 20 \u6B21\u3002", "\u542C\u89C9\u8FA8\u522B \xB7 \u6291\u5236\u63A7\u5236"]]
];
var mealPlans = [
  [["\u{1F963}", "\u5357\u74DC\u5C0F\u7C73\u7CA5"], ["\u{1F373}", "\u867E\u4EC1\u84B8\u86CB"], ["\u{1F966}", "\u6E05\u7092\u897F\u5170\u82B1"], ["\u{1F34E}", "\u82F9\u679C"]],
  [["\u{1F35A}", "\u6742\u7CAE\u8F6F\u996D"], ["\u{1F41F}", "\u6E05\u84B8\u9CD5\u9C7C"], ["\u{1F955}", "\u80E1\u841D\u535C\u7092\u86CB"], ["\u{1F350}", "\u96EA\u68A8"]],
  [["\u{1F35C}", "\u756A\u8304\u9E21\u86CB\u9762"], ["\u{1F969}", "\u5AE9\u725B\u8089\u7247"], ["\u{1F96C}", "\u712F\u9752\u83DC"], ["\u{1F34C}", "\u9999\u8549"]],
  [["\u{1F954}", "\u571F\u8C46\u9E21\u8089\u7116\u996D"], ["\u{1F95A}", "\u6C34\u716E\u86CB"], ["\u{1F33D}", "\u7389\u7C73\u7C92"], ["\u{1F34A}", "\u6A59\u5B50"]],
  [["\u{1F96F}", "\u5168\u9EA6\u5C0F\u9910\u5305"], ["\u{1F95B}", "\u6E29\u725B\u5976"], ["\u{1F952}", "\u9EC4\u74DC\u9E21\u86CB"], ["\u{1F347}", "\u65E0\u7C7D\u8461\u8404"]],
  [["\u{1F372}", "\u5C71\u836F\u7626\u8089\u7CA5"], ["\u{1FAD8}", "\u8C46\u8150\u8089\u672B"], ["\u{1F957}", "\u5F69\u6912\u897F\u5170\u82B1"], ["\u{1F95D}", "\u7315\u7334\u6843"]]
];
var englishLessons = [
  {
    theme: "Hello, friends!",
    emoji: "\u{1F44B}",
    intro: "\u89C1\u9762\u95EE\u597D",
    lines: [
      { en: "Hello!", zh: "\u4F60\u597D\uFF01", hint: "\u5634\u89D2\u653E\u677E\uFF0C\u6E05\u695A\u8BFB\u51FA he-llo" },
      { en: "Good morning!", zh: "\u65E9\u4E0A\u597D\uFF01", hint: "morning \u7684 r \u8F7B\u8F7B\u5377\u820C" },
      { en: "My name is Mario.", zh: "\u6211\u7684\u540D\u5B57\u662F Mario\u3002", hint: "name \u8981\u8BFB\u5F97\u9971\u6EE1" },
      { en: "What is your name?", zh: "\u4F60\u53EB\u4EC0\u4E48\u540D\u5B57\uFF1F", hint: "\u53E5\u5C3E\u8BED\u8C03\u7A0D\u5FAE\u4E0A\u626C" },
      { en: "Nice to meet you.", zh: "\u5F88\u9AD8\u5174\u8BA4\u8BC6\u4F60\u3002", hint: "meet \u62C9\u957F\u4E00\u70B9\u70B9" },
      { en: "See you tomorrow!", zh: "\u660E\u5929\u89C1\uFF01", hint: "tomorrow \u5206\u6210\u4E09\u5C0F\u8282\u8BFB" }
    ]
  },
  {
    theme: "My happy family",
    emoji: "\u{1F3E0}",
    intro: "\u4ECB\u7ECD\u5BB6\u4EBA",
    lines: [
      { en: "This is my family.", zh: "\u8FD9\u662F\u6211\u7684\u5BB6\u4EBA\u3002", hint: "this \u7684\u820C\u5C16\u8F7B\u78B0\u7259\u9F7F" },
      { en: "This is my mom.", zh: "\u8FD9\u662F\u6211\u7684\u5988\u5988\u3002", hint: "mom \u5F20\u5927\u5634\u8BFB" },
      { en: "This is my dad.", zh: "\u8FD9\u662F\u6211\u7684\u7238\u7238\u3002", hint: "dad \u7684\u7ED3\u5C3E\u8F7B\u6536\u4F4F" },
      { en: "I love my family.", zh: "\u6211\u7231\u6211\u7684\u5BB6\u4EBA\u3002", hint: "love \u8BFB\u5F97\u77ED\u4E00\u4E9B" },
      { en: "We eat together.", zh: "\u6211\u4EEC\u4E00\u8D77\u5403\u996D\u3002", hint: "together \u5206\u4E09\u5C0F\u8282" },
      { en: "We are happy.", zh: "\u6211\u4EEC\u5F88\u5FEB\u4E50\u3002", hint: "happy \u7684 a \u50CF\u54A7\u5634\u7B11" }
    ]
  },
  {
    theme: "At school",
    emoji: "\u{1F392}",
    intro: "\u5FEB\u4E50\u4E0A\u5B66",
    lines: [
      { en: "I go to school.", zh: "\u6211\u53BB\u4E0A\u5B66\u3002", hint: "school \u7684\u5F00\u5934\u8FDE\u5728\u4E00\u8D77\u8BFB" },
      { en: "This is my book.", zh: "\u8FD9\u662F\u6211\u7684\u4E66\u3002", hint: "book \u7684 oo \u662F\u77ED\u97F3" },
      { en: "I have a pencil.", zh: "\u6211\u6709\u4E00\u652F\u94C5\u7B14\u3002", hint: "pencil \u5206\u6210 pen-cil" },
      { en: "Please sit down.", zh: "\u8BF7\u5750\u4E0B\u3002", hint: "please \u8981\u8BFB\u5F97\u793C\u8C8C\u3001\u8F7B\u67D4" },
      { en: "Please stand up.", zh: "\u8BF7\u7AD9\u8D77\u6765\u3002", hint: "stand \u548C up \u8FDE\u8D77\u6765" },
      { en: "Thank you, teacher.", zh: "\u8C22\u8C22\u8001\u5E08\u3002", hint: "thank \u7684\u820C\u5C16\u8F7B\u78B0\u7259\u9F7F" }
    ]
  },
  {
    theme: "Colors around me",
    emoji: "\u{1F308}",
    intro: "\u53D1\u73B0\u989C\u8272",
    lines: [
      { en: "It is red.", zh: "\u5B83\u662F\u7EA2\u8272\u7684\u3002", hint: "red \u7684\u7ED3\u5C3E\u8F7B\u8F7B\u6536\u4F4F" },
      { en: "The sky is blue.", zh: "\u5929\u7A7A\u662F\u84DD\u8272\u7684\u3002", hint: "blue \u7684\u58F0\u97F3\u62C9\u957F\u4E00\u70B9" },
      { en: "The grass is green.", zh: "\u8349\u662F\u7EFF\u8272\u7684\u3002", hint: "green \u7684 ee \u662F\u957F\u97F3" },
      { en: "I like yellow.", zh: "\u6211\u559C\u6B22\u9EC4\u8272\u3002", hint: "yellow \u5206\u6210 yel-low" },
      { en: "What color is it?", zh: "\u5B83\u662F\u4EC0\u4E48\u989C\u8272\uFF1F", hint: "\u95EE\u53E5\u7ED3\u5C3E\u5411\u4E0A\u626C" },
      { en: "It is my favorite color.", zh: "\u8FD9\u662F\u6211\u6700\u559C\u6B22\u7684\u989C\u8272\u3002", hint: "favorite \u5206\u4E09\u5C0F\u8282" }
    ]
  },
  {
    theme: "Yummy food",
    emoji: "\u{1F34E}",
    intro: "\u804A\u804A\u98DF\u7269",
    lines: [
      { en: "I like apples.", zh: "\u6211\u559C\u6B22\u82F9\u679C\u3002", hint: "apples \u7684 s \u8981\u8BFB\u51FA\u6765" },
      { en: "I want some water.", zh: "\u6211\u60F3\u559D\u4E00\u4E9B\u6C34\u3002", hint: "water \u7684\u5F00\u5934\u5706\u5507" },
      { en: "This is delicious.", zh: "\u8FD9\u4E2A\u5F88\u597D\u5403\u3002", hint: "delicious \u5206\u6210\u56DB\u5C0F\u8282\u6162\u8BFB" },
      { en: "I am hungry.", zh: "\u6211\u997F\u4E86\u3002", hint: "hungry \u7684 h \u8981\u547C\u6C14" },
      { en: "I am full.", zh: "\u6211\u5403\u9971\u4E86\u3002", hint: "full \u7684\u7ED3\u5C3E\u820C\u5C16\u4E0A\u62AC" },
      { en: "Thank you for the food.", zh: "\u8C22\u8C22\u4F60\u51C6\u5907\u7684\u98DF\u7269\u3002", hint: "\u6574\u53E5\u6162\u6162\u8FDE\u8D77\u6765\u8BFB" }
    ]
  },
  {
    theme: "How do I feel?",
    emoji: "\u{1F60A}",
    intro: "\u8868\u8FBE\u611F\u53D7",
    lines: [
      { en: "I am happy.", zh: "\u6211\u5F88\u5F00\u5FC3\u3002", hint: "happy \u7684 a \u50CF\u54A7\u5634\u7B11" },
      { en: "I am excited.", zh: "\u6211\u5F88\u5174\u594B\u3002", hint: "excited \u5206\u6210\u4E09\u5C0F\u8282" },
      { en: "I feel tired.", zh: "\u6211\u89C9\u5F97\u7D2F\u4E86\u3002", hint: "tired \u4E0D\u8981\u8BFB\u5F97\u592A\u957F" },
      { en: "I need some help.", zh: "\u6211\u9700\u8981\u5E2E\u52A9\u3002", hint: "help \u7684 p \u8981\u8F7B\u8F7B\u7206\u7834" },
      { en: "Are you okay?", zh: "\u4F60\u8FD8\u597D\u5417\uFF1F", hint: "okay \u7684\u7ED3\u5C3E\u5411\u4E0A\u626C" },
      { en: "I feel better now.", zh: "\u6211\u73B0\u5728\u611F\u89C9\u597D\u591A\u4E86\u3002", hint: "better \u7684\u4E24\u4E2A\u97F3\u8282\u8981\u6E05\u695A" }
    ]
  },
  {
    theme: "Little animals",
    emoji: "\u{1F436}",
    intro: "\u8BA4\u8BC6\u52A8\u7269",
    lines: [
      { en: "I see a little dog.", zh: "\u6211\u770B\u89C1\u4E00\u53EA\u5C0F\u72D7\u3002", hint: "little \u5206\u6210 lit-tle" },
      { en: "The cat can jump.", zh: "\u5C0F\u732B\u4F1A\u8DF3\u3002", hint: "jump \u7684\u7ED3\u5C3E\u53CC\u5507\u95ED\u5408" },
      { en: "The bird can fly.", zh: "\u5C0F\u9E1F\u4F1A\u98DE\u3002", hint: "fly \u7684\u5C3E\u97F3\u62C9\u5F00" },
      { en: "The fish can swim.", zh: "\u5C0F\u9C7C\u4F1A\u6E38\u6CF3\u3002", hint: "swim \u7684\u5F00\u5934\u8FDE\u8D77\u6765\u8BFB" },
      { en: "It is very cute.", zh: "\u5B83\u975E\u5E38\u53EF\u7231\u3002", hint: "cute \u7684 u \u662F\u957F\u97F3" },
      { en: "I love animals.", zh: "\u6211\u559C\u6B22\u52A8\u7269\u3002", hint: "animals \u5206\u6210\u4E09\u5C0F\u8282" }
    ]
  }
];
var patternQuestions = [
  { sequence: ["\u{1F534}", "\u{1F535}", "\u{1F534}", "\u{1F535}", "?"], choices: ["\u{1F534}", "\u{1F535}", "\u{1F7E1}"], answer: "\u{1F534}", tip: "\u7EA2\u3001\u84DD\u4EA4\u66FF\u51FA\u73B0\u3002" },
  { sequence: ["\u{1F331}", "\u{1F331}", "\u{1F338}", "\u{1F331}", "\u{1F331}", "?"], choices: ["\u{1F338}", "\u{1F331}", "\u{1F333}"], answer: "\u{1F338}", tip: "\u4E24\u4E2A\u5C0F\u82BD\u540E\u9762\u8DDF\u4E00\u6735\u82B1\u3002" },
  { sequence: ["1", "2", "3", "4", "?"], choices: ["4", "5", "6"], answer: "5", tip: "\u6BCF\u6B21\u589E\u52A01\u3002" },
  { sequence: ["2", "4", "6", "8", "?"], choices: ["9", "10", "12"], answer: "10", tip: "\u6BCF\u6B21\u589E\u52A02\u3002" },
  { sequence: ["\u2B50", "\u{1F319}", "\u{1F319}", "\u2B50", "\u{1F319}", "\u{1F319}", "?"], choices: ["\u2B50", "\u{1F319}", "\u2600\uFE0F"], answer: "\u2B50", tip: "\u4E00\u9897\u661F\u661F\u540E\u9762\u8DDF\u4E24\u4E2A\u6708\u4EAE\u3002" },
  { sequence: ["\u{1F423}", "\u{1F425}", "\u{1F413}", "\u{1F423}", "\u{1F425}", "?"], choices: ["\u{1F423}", "\u{1F425}", "\u{1F413}"], answer: "\u{1F413}", tip: "\u5C0F\u9E21\u7684\u4E09\u4E2A\u6210\u957F\u5F62\u6001\u5FAA\u73AF\u51FA\u73B0\u3002" },
  { sequence: ["10", "20", "30", "40", "?"], choices: ["45", "50", "60"], answer: "50", tip: "\u6BCF\u6B21\u589E\u52A010\u3002" },
  { sequence: ["\u{1F34E}", "\u{1F34C}", "\u{1F350}", "\u{1F34E}", "\u{1F34C}", "?"], choices: ["\u{1F34E}", "\u{1F350}", "\u{1F347}"], answer: "\u{1F350}", tip: "\u4E09\u79CD\u6C34\u679C\u6309\u76F8\u540C\u987A\u5E8F\u5FAA\u73AF\u3002" },
  { sequence: ["\u2B06\uFE0F", "\u27A1\uFE0F", "\u2B07\uFE0F", "\u2B05\uFE0F", "?"], choices: ["\u2B06\uFE0F", "\u27A1\uFE0F", "\u2B07\uFE0F"], answer: "\u2B06\uFE0F", tip: "\u65B9\u5411\u987A\u65F6\u9488\u8F6C\u4E86\u4E00\u5708\u3002" },
  { sequence: ["3", "6", "9", "12", "?"], choices: ["13", "14", "15"], answer: "15", tip: "\u6BCF\u6B21\u589E\u52A03\u3002" },
  { sequence: ["\u{1F53A}", "\u{1F53A}", "\u26AA", "\u{1F53A}", "\u{1F53A}", "?"], choices: ["\u{1F53A}", "\u26AA", "\u{1F535}"], answer: "\u26AA", tip: "\u4E24\u4E2A\u4E09\u89D2\u5F62\u540E\u9762\u8DDF\u4E00\u4E2A\u5706\u5F62\u3002" },
  { sequence: ["1", "3", "5", "7", "?"], choices: ["8", "9", "10"], answer: "9", tip: "\u6BCF\u6B21\u589E\u52A02\uFF0C\u90FD\u662F\u5355\u6570\u3002" },
  { sequence: ["\u{1F31E}", "\u{1F319}", "\u{1F31E}", "\u{1F319}", "?"], choices: ["\u{1F31E}", "\u{1F319}", "\u2B50"], answer: "\u{1F31E}", tip: "\u592A\u9633\u548C\u6708\u4EAE\u8F6E\u6D41\u51FA\u73B0\u3002" },
  { sequence: ["5", "10", "15", "20", "?"], choices: ["21", "25", "30"], answer: "25", tip: "\u6BCF\u6B21\u589E\u52A05\u3002" },
  { sequence: ["\u{1F41F}", "\u{1F41F}", "\u{1F420}", "\u{1F41F}", "\u{1F41F}", "?"], choices: ["\u{1F41F}", "\u{1F420}", "\u{1F421}"], answer: "\u{1F420}", tip: "\u4E24\u6761\u5C0F\u9C7C\u540E\u9762\u8DDF\u4E00\u6761\u5F69\u8272\u9C7C\u3002" },
  { sequence: ["A", "B", "C", "A", "B", "?"], choices: ["A", "C", "D"], answer: "C", tip: "A\u3001B\u3001C \u6309\u987A\u5E8F\u5FAA\u73AF\u3002" }
];
var memoryThemes = [
  ["\u{1F436}", "\u{1F431}", "\u{1F430}", "\u{1F43C}"],
  ["\u{1F34E}", "\u{1F34C}", "\u{1F347}", "\u{1F349}"],
  ["\u{1F697}", "\u{1F6B2}", "\u{1F682}", "\u2708\uFE0F"],
  ["\u26BD", "\u{1F3C0}", "\u{1F3BE}", "\u{1F3D3}"],
  ["\u{1F31E}", "\u{1F319}", "\u2B50", "\u{1F308}"],
  ["\u{1F981}", "\u{1F42F}", "\u{1F418}", "\u{1F992}"],
  ["\u270F\uFE0F", "\u{1F4D5}", "\u{1F4CF}", "\u{1F392}"],
  ["\u{1F955}", "\u{1F966}", "\u{1F33D}", "\u{1F345}"]
];
var oddOneQuestions = [
  { prompt: "\u627E\u51FA\u4E0D\u4E00\u6837\u7684\u4E00\u4F4D", choices: ["\u{1F34E}", "\u{1F34E}", "\u{1F350}", "\u{1F34E}"], answer: "\u{1F350}", tip: "\u53EA\u6709\u68A8\u548C\u5176\u4ED6\u4E09\u4E2A\u4E0D\u540C\u3002" },
  { prompt: "\u8C01\u4E0D\u662F\u4EA4\u901A\u5DE5\u5177\uFF1F", choices: ["\u{1F697}", "\u{1F6B2}", "\u{1F436}", "\u{1F682}"], answer: "\u{1F436}", tip: "\u5C0F\u72D7\u662F\u52A8\u7269\uFF0C\u4E0D\u662F\u4EA4\u901A\u5DE5\u5177\u3002" },
  { prompt: "\u8C01\u4E0D\u4F1A\u98DE\uFF1F", choices: ["\u{1F98B}", "\u{1F426}", "\u{1F41F}", "\u2708\uFE0F"], answer: "\u{1F41F}", tip: "\u5C0F\u9C7C\u751F\u6D3B\u5728\u6C34\u91CC\u3002" },
  { prompt: "\u627E\u51FA\u5F62\u72B6\u4E0D\u540C\u7684", choices: ["\u{1F535}", "\u{1F535}", "\u{1F53A}", "\u{1F535}"], answer: "\u{1F53A}", tip: "\u4E09\u89D2\u5F62\u548C\u5706\u5F62\u4E0D\u540C\u3002" },
  { prompt: "\u8C01\u4E0D\u662F\u5B66\u4E60\u7528\u54C1\uFF1F", choices: ["\u270F\uFE0F", "\u{1F4CF}", "\u{1F349}", "\u{1F4D5}"], answer: "\u{1F349}", tip: "\u897F\u74DC\u662F\u6C34\u679C\u3002" },
  { prompt: "\u627E\u51FA\u65B9\u5411\u4E0D\u540C\u7684", choices: ["\u2B06\uFE0F", "\u2B06\uFE0F", "\u2B07\uFE0F", "\u2B06\uFE0F"], answer: "\u2B07\uFE0F", tip: "\u53EA\u6709\u5B83\u671D\u4E0B\u3002" },
  { prompt: "\u8C01\u4E0D\u662F\u852C\u83DC\uFF1F", choices: ["\u{1F955}", "\u{1F966}", "\u{1F680}", "\u{1F33D}"], answer: "\u{1F680}", tip: "\u706B\u7BAD\u4E0D\u662F\u852C\u83DC\u3002" },
  { prompt: "\u8C01\u751F\u6D3B\u5728\u6C34\u91CC\uFF1F", choices: ["\u{1F431}", "\u{1F430}", "\u{1F42C}", "\u{1F43C}"], answer: "\u{1F42C}", tip: "\u6D77\u8C5A\u751F\u6D3B\u5728\u6C34\u91CC\u3002" }
];
var categoryQuestions = [
  { prompt: "\u628A\u6C34\u679C\u9001\u56DE\u5BB6", choices: ["\u{1F34C}", "\u{1F697}", "\u270F\uFE0F"], answer: "\u{1F34C}", tip: "\u9999\u8549\u5C5E\u4E8E\u6C34\u679C\u3002" },
  { prompt: "\u628A\u52A8\u7269\u9001\u56DE\u5BB6", choices: ["\u{1F4D5}", "\u{1F418}", "\u26BD"], answer: "\u{1F418}", tip: "\u5927\u8C61\u5C5E\u4E8E\u52A8\u7269\u3002" },
  { prompt: "\u627E\u5230\u4EA4\u901A\u5DE5\u5177", choices: ["\u{1F338}", "\u{1F682}", "\u{1F34E}"], answer: "\u{1F682}", tip: "\u706B\u8F66\u53EF\u4EE5\u8F7D\u6211\u4EEC\u53BB\u8FDC\u65B9\u3002" },
  { prompt: "\u627E\u5230\u5B66\u4E60\u7528\u54C1", choices: ["\u{1F4CF}", "\u{1F41F}", "\u{1F349}"], answer: "\u{1F4CF}", tip: "\u5C3A\u5B50\u662F\u5B66\u4E60\u7528\u54C1\u3002" },
  { prompt: "\u627E\u5230\u8FD0\u52A8\u7528\u54C1", choices: ["\u{1F966}", "\u{1F3C0}", "\u{1F431}"], answer: "\u{1F3C0}", tip: "\u7BEE\u7403\u53EF\u4EE5\u7528\u6765\u8FD0\u52A8\u3002" },
  { prompt: "\u627E\u5230\u852C\u83DC", choices: ["\u{1F6B2}", "\u{1F955}", "\u2B50"], answer: "\u{1F955}", tip: "\u80E1\u841D\u535C\u5C5E\u4E8E\u852C\u83DC\u3002" },
  { prompt: "\u627E\u5230\u4F1A\u98DE\u7684\u52A8\u7269", choices: ["\u{1F426}", "\u{1F436}", "\u{1F41F}"], answer: "\u{1F426}", tip: "\u5C0F\u9E1F\u6709\u7FC5\u8180\uFF0C\u4F1A\u98DE\u3002" },
  { prompt: "\u627E\u5230\u5706\u5F62\u7269\u54C1", choices: ["\u26BD", "\u{1F4D5}", "\u{1F4CF}"], answer: "\u26BD", tip: "\u8DB3\u7403\u662F\u5706\u5706\u7684\u3002" }
];
var tasks = [
  { section: "pinyin", icon: "\u{1F524}", title: "\u62FC\u8BFB\u56DB\u58F0", desc: "10 \u7EC4 \xB7 \u7EA6 8 \u5206\u949F", reward: 3, color: "#6e9ff8" },
  { section: "hanzi", icon: "\u5B57", title: "\u8BA4\u8BC6\u751F\u5B57", desc: "15 \u4E2A \xB7 \u7EA6 12 \u5206\u949F", reward: 5, color: "#ef8e6c" },
  { section: "english", icon: "\u{1F5E3}\uFE0F", title: "\u82F1\u8BED\u53E3\u8BED", desc: "6 \u53E5 \xB7 \u542C\u8BF4\u8DDF\u8BFB", reward: 4, color: "#6d8de8" },
  { section: "math", icon: "\u2795", title: "\u53E3\u7B97\u95EF\u5173", desc: "40 \u9898 \xB7 \u81EA\u52A8\u6279\u6539", reward: 5, color: "#45bfa7" },
  { section: "focus", icon: "\u{1F3AF}", title: "\u8212\u5C14\u7279\u65B9\u683C", desc: "5 \u7EC4 \xB7 \u6BCF\u7EC4\u8BA1\u65F6", reward: 4, color: "#f3aa45" },
  { section: "games", icon: "\u{1F9E9}", title: "\u76CA\u667A\u5C0F\u6E38\u620F", desc: "\u6BCF\u65E5 4 \u7C7B \xB7 \u89C2\u5BDF\u601D\u8003", reward: 4, color: "#d27dd5" },
  { section: "sport", icon: "\u{1F938}", title: "\u524D\u5EAD\u5C0F\u8FD0\u52A8", desc: "3 \u4E2A \xB7 \u7EA6 10 \u5206\u949F", reward: 3, color: "#f47d85" },
  { section: "chores", icon: "\u{1F9F9}", title: "\u5BB6\u52A1\u5C0F\u80FD\u624B", desc: "\u6574\u7406\u81EA\u5DF1\u7684\u4E66\u684C", reward: 2, color: "#d89b65", hidden: true }
];
var visibleSections = sections.filter((section) => !section.hidden);
var visibleTasks = tasks.filter((task) => !task.hidden);
function daySeed(d = /* @__PURE__ */ new Date()) {
  return Number(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`);
}
function dateKey(date = /* @__PURE__ */ new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function seededShuffle(items, seed) {
  const result = [...items];
  let x = Math.abs(seed) || 1;
  for (let i = result.length - 1; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280;
    const j = Math.floor(x / 233280 * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function makePinyinLesson(seed, stage) {
  const band = pinyinBands[Math.min(stage, pinyinBands.length - 1)];
  const reviewPool = pinyinBands.slice(0, Math.max(1, stage)).flat();
  const currentCount = stage === 0 ? 10 : 7;
  return [
    ...seededShuffle(band, seed + stage * 31).slice(0, currentCount),
    ...seededShuffle(reviewPool, seed + stage * 79).slice(0, 10 - currentCount)
  ];
}
function makeHanziLesson(seed, stage) {
  const availableCount = Math.min(hanziPool.length, 30 + stage * 14);
  const available = hanziPool.slice(0, availableCount);
  return seededShuffle(available, seed + stage * 113).slice(0, 15);
}
function makeMath(seed, limit, stage) {
  const problems = [];
  const seen = /* @__PURE__ */ new Set();
  let x = Math.abs(seed + stage * 7919) || 1;
  let attempts = 0;
  while (problems.length < 40 && attempts < 1200) {
    attempts++;
    x = (x * 9301 + 49297) % 233280;
    const isAdd = problems.length % 2 === 0;
    const a = Math.floor(x / 233280 * (limit + 1));
    x = (x * 9301 + 49297) % 233280;
    const rawB = Math.floor(x / 233280 * (limit + 1));
    const b = isAdd ? Math.min(rawB, limit - a) : Math.min(rawB, a);
    const key = `${a}${isAdd ? "+" : "-"}${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    problems.push({ a, b, op: isAdd ? "+" : "\u2212", answer: isAdd ? a + b : a - b });
  }
  return problems;
}
var mathGuides = [
  { title: "20\u4EE5\u5185\u51D1\u5341\u6CD5\uFF1A\u5148\u628A10\u51D1\u51FA\u6765", example: "8 + 7 = 15", steps: ["\u628A7\u5206\u62102\u548C5", "8 + 2\u5148\u51D1\u621010", "10 + 5 = 15"], tip: "\u770B\u52308\u60F32\uFF0C\u770B\u52309\u60F31\uFF1B\u51CF\u6CD5\u53EF\u4EE5\u5012\u8FC7\u6765\u68C0\u67E5\u3002" },
  { title: "30\u4EE5\u5185\u62C6\u5206\u6CD5\uFF1A\u5148\u7B97\u4E2A\u4F4D", example: "26 \u2212 4 = 22", steps: ["\u628A26\u770B\u621020\u548C6", "\u5148\u7B976 \u2212 4 = 2", "\u518D\u7B9720 + 2 = 22"], tip: "\u4E2A\u4F4D\u591F\u51CF\u65F6\u5148\u5904\u7406\u4E2A\u4F4D\uFF0C\u6574\u5341\u6570\u4FDD\u6301\u4E0D\u52A8\u3002" },
  { title: "50\u4EE5\u5185\u6574\u5341\u4E0E\u4E2A\u4F4D\u5206\u5F00\u7B97", example: "27 + 12 = 39", steps: ["20 + 10 = 30", "7 + 2 = 9", "30 + 9 = 39"], tip: "\u5341\u4F4D\u548C\u4E2A\u4F4D\u5206\u522B\u8BA1\u7B97\uFF0C\u6700\u540E\u518D\u5408\u8D77\u6765\u3002" },
  { title: "70\u4EE5\u5185\u5206\u6B65\u52A0\u51CF", example: "46 + 18 = 64", steps: ["\u5148\u7B9746 + 10 = 56", "\u518D\u7B9756 + 8 = 64", "\u5206\u4E24\u6B65\u68C0\u67E5\u7B54\u6848"], tip: "\u628A\u7B2C\u4E8C\u4E2A\u6570\u62C6\u6210\u6574\u5341\u548C\u4E2A\u4F4D\uFF0C\u8BA1\u7B97\u66F4\u6E05\u695A\u3002" },
  { title: "90\u4EE5\u5185\u9000\u4F4D\u51CF\u6CD5", example: "72 \u2212 28 = 44", steps: ["\u5148\u7B9772 \u2212 20 = 52", "\u518D\u7B9752 \u2212 8 = 44", "\u752844 + 28\u68C0\u67E5"], tip: "\u5148\u51CF\u6574\u5341\uFF0C\u518D\u51CF\u4E2A\u4F4D\uFF0C\u6700\u540E\u7528\u52A0\u6CD5\u9A8C\u7B97\u3002" },
  { title: "100\u4EE5\u5185\u7EFC\u5408\u8BA1\u7B97\u4E0E\u9A8C\u7B97", example: "86 \u2212 37 = 49", steps: ["\u5148\u7B9786 \u2212 30 = 56", "\u518D\u7B9756 \u2212 7 = 49", "\u752849 + 37 = 86\u9A8C\u7B97"], tip: "\u6570\u53D8\u5927\u540E\u66F4\u8981\u5206\u6B65\u5199\u6E05\u695A\uFF0C\u4E0D\u8FFD\u6C42\u5FEB\uFF0C\u5148\u4FDD\u8BC1\u6B63\u786E\u3002" }
];
function getGreeting(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "\u65E9\u4E0A\u597D";
  if (hour >= 11 && hour < 14) return "\u4E2D\u5348\u597D";
  if (hour >= 14 && hour < 19) return "\u4E0B\u5348\u597D";
  if (hour >= 19 && hour < 23) return "\u665A\u4E0A\u597D";
  return "\u6B22\u8FCE\u56DE\u6765";
}
function shuffle16(seed, group) {
  const result = Array.from({ length: 16 }, (_, i) => i + 1);
  let x = seed + group * 997;
  for (let i = 15; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280;
    const j = Math.floor(x / 233280 * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}
function speakEnglish(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.72;
  const englishVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
}
function speechMatchScore(expected, actual) {
  const normalize = (value) => value.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).filter(Boolean);
  const expectedWords = normalize(expected);
  const actualWords = normalize(actual);
  if (!expectedWords.length || !actualWords.length) return { score: 0, missing: expectedWords, extra: actualWords };
  const distance = Array.from({ length: expectedWords.length + 1 }, () => Array(actualWords.length + 1).fill(0));
  for (let i = 0; i <= expectedWords.length; i += 1) distance[i][0] = i;
  for (let j = 0; j <= actualWords.length; j += 1) distance[0][j] = j;
  for (let i = 1; i <= expectedWords.length; i += 1) {
    for (let j = 1; j <= actualWords.length; j += 1) {
      distance[i][j] = expectedWords[i - 1] === actualWords[j - 1] ? distance[i - 1][j - 1] : 1 + Math.min(distance[i - 1][j], distance[i][j - 1], distance[i - 1][j - 1]);
    }
  }
  const lcs = Array.from({ length: expectedWords.length + 1 }, () => Array(actualWords.length + 1).fill(0));
  for (let i = expectedWords.length - 1; i >= 0; i -= 1) {
    for (let j = actualWords.length - 1; j >= 0; j -= 1) {
      lcs[i][j] = expectedWords[i] === actualWords[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const matchedExpected = /* @__PURE__ */ new Set();
  const matchedActual = /* @__PURE__ */ new Set();
  let expectedIndex = 0;
  let actualIndex = 0;
  while (expectedIndex < expectedWords.length && actualIndex < actualWords.length) {
    if (expectedWords[expectedIndex] === actualWords[actualIndex]) {
      matchedExpected.add(expectedIndex);
      matchedActual.add(actualIndex);
      expectedIndex += 1;
      actualIndex += 1;
    } else if (lcs[expectedIndex + 1][actualIndex] >= lcs[expectedIndex][actualIndex + 1]) {
      expectedIndex += 1;
    } else {
      actualIndex += 1;
    }
  }
  const matchedCount = matchedExpected.size;
  const sequenceScore = Math.max(0, 1 - distance[expectedWords.length][actualWords.length] / Math.max(expectedWords.length, actualWords.length));
  const coverageScore = matchedCount / expectedWords.length;
  const precisionScore = matchedCount / actualWords.length;
  return {
    score: Math.round((sequenceScore * 0.7 + coverageScore * 0.2 + precisionScore * 0.1) * 100),
    missing: expectedWords.filter((_, index) => !matchedExpected.has(index)),
    extra: actualWords.filter((_, index) => !matchedActual.has(index))
  };
}
function DailyHub() {
  const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
  const [active, setActive] = (0, import_react.useState)("home");
  const [completed, setCompleted] = (0, import_react.useState)([]);
  const [stars, setStars] = (0, import_react.useState)(28);
  const [food, setFood] = (0, import_react.useState)(6);
  const [petCareTotal, setPetCareTotal] = (0, import_react.useState)(0);
  const [silverFeedTotal, setSilverFeedTotal] = (0, import_react.useState)(0);
  const [dailyFeedCount, setDailyFeedCount] = (0, import_react.useState)(0);
  const [dailyFeedDate, setDailyFeedDate] = (0, import_react.useState)(() => dateKey());
  const [checkInDates, setCheckInDates] = (0, import_react.useState)([]);
  const [goldUnlocked, setGoldUnlocked] = (0, import_react.useState)(false);
  const [tyrantUnlocked, setTyrantUnlocked] = (0, import_react.useState)(false);
  const [okKingUnlocked, setOkKingUnlocked] = (0, import_react.useState)(false);
  const [activePet, setActivePet] = (0, import_react.useState)("silver");
  const [answers, setAnswers] = (0, import_react.useState)({});
  const [checkedMath, setCheckedMath] = (0, import_react.useState)(false);
  const [focusGroup, setFocusGroup] = (0, import_react.useState)(0);
  const [focusNext, setFocusNext] = (0, import_react.useState)(1);
  const [focusStart, setFocusStart] = (0, import_react.useState)(null);
  const [focusTimes, setFocusTimes] = (0, import_react.useState)([]);
  const [englishPracticed, setEnglishPracticed] = (0, import_react.useState)([]);
  const [englishListening, setEnglishListening] = (0, import_react.useState)(null);
  const [englishFeedback, setEnglishFeedback] = (0, import_react.useState)({});
  const [englishRecordings, setEnglishRecordings] = (0, import_react.useState)({});
  const [patternAnswers, setPatternAnswers] = (0, import_react.useState)({});
  const [oddAnswers, setOddAnswers] = (0, import_react.useState)({});
  const [categoryAnswers, setCategoryAnswers] = (0, import_react.useState)({});
  const [memoryOpen, setMemoryOpen] = (0, import_react.useState)([]);
  const [memoryMatched, setMemoryMatched] = (0, import_react.useState)([]);
  const [memoryMoves, setMemoryMoves] = (0, import_react.useState)(0);
  const [memoryBusy, setMemoryBusy] = (0, import_react.useState)(false);
  const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
  const [petDetailId, setPetDetailId] = (0, import_react.useState)(null);
  const [profileLoaded, setProfileLoaded] = (0, import_react.useState)(false);
  const [pullDistance, setPullDistance] = (0, import_react.useState)(0);
  const [refreshing, setRefreshing] = (0, import_react.useState)(false);
  const [upgradeMessage, setUpgradeMessage] = (0, import_react.useState)("");
  const drawerTouchStart = (0, import_react.useRef)(0);
  const englishRecognitionRef = (0, import_react.useRef)(null);
  const englishTimeoutRef = (0, import_react.useRef)(null);
  const englishRecorderRef = (0, import_react.useRef)(null);
  const englishStreamRef = (0, import_react.useRef)(null);
  const englishRecordingUrlsRef = (0, import_react.useRef)({});
  const englishSessionRef = (0, import_react.useRef)(0);
  const seed = daySeed(now);
  const today = dateKey(now);
  const completedLearningDays = checkInDates.filter((date) => date < today).length;
  const curriculumStage = Math.min(5, Math.floor(completedLearningDays / 7));
  const mathLimit = [20, 30, 50, 70, 90, 100][curriculumStage];
  const pinyinLesson = (0, import_react.useMemo)(() => makePinyinLesson(seed, curriculumStage), [curriculumStage, seed]);
  const hanziLesson = (0, import_react.useMemo)(() => makeHanziLesson(seed, curriculumStage), [curriculumStage, seed]);
  const mathProblems = (0, import_react.useMemo)(() => makeMath(seed, mathLimit, curriculumStage), [curriculumStage, mathLimit, seed]);
  const englishLesson = englishLessons[seed % englishLessons.length];
  const dailyPatterns = (0, import_react.useMemo)(() => seededShuffle(patternQuestions, seed + 149).slice(0, 3), [seed]);
  const dailyOddQuestions = (0, import_react.useMemo)(() => seededShuffle(oddOneQuestions, seed + 271).slice(0, 2), [seed]);
  const dailyCategoryQuestions = (0, import_react.useMemo)(() => seededShuffle(categoryQuestions, seed + 389).slice(0, 2), [seed]);
  const memoryDeck = (0, import_react.useMemo)(() => {
    const theme = memoryThemes[seed % memoryThemes.length];
    return seededShuffle([...theme, ...theme], seed + 503).map((symbol, index) => ({ id: `${symbol}-${index}`, symbol }));
  }, [seed]);
  const grid = (0, import_react.useMemo)(() => shuffle16(seed, focusGroup), [seed, focusGroup]);
  const poem = poems[seed % poems.length];
  const science = scienceCards[seed % scienceCards.length];
  const movementPlan = movementPlans[seed % movementPlans.length];
  const mealPlan = mealPlans[seed % mealPlans.length];
  const mathGuide = mathGuides[curriculumStage];
  const dateLabel = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(now);
  const greeting = getGreeting(now);
  const currentPet = pets[activePet];
  const visibleCompletedCount = completed.filter((id) => visibleTasks.some((task) => task.section === id)).length;
  const patternCorrectCount = dailyPatterns.filter((question, index) => patternAnswers[index] === question.answer).length;
  const oddCorrectCount = dailyOddQuestions.filter((question, index) => oddAnswers[index] === question.answer).length;
  const categoryCorrectCount = dailyCategoryQuestions.filter((question, index) => categoryAnswers[index] === question.answer).length;
  const todayCheckedIn = checkInDates.includes(today) || completed.length >= 3;
  const goldReady = checkInDates.length >= GOLD_REQUIRED_DAYS && silverFeedTotal >= GOLD_REQUIRED_FEEDS;
  const tyrantReady = goldUnlocked && checkInDates.length >= TYRANT_REQUIRED_DAYS && petCareTotal >= TYRANT_REQUIRED_FEEDS;
  const okKingReady = checkInDates.length >= OK_KING_REQUIRED_DAYS && petCareTotal >= OK_KING_REQUIRED_FEEDS;
  const effectiveDailyFeedCount = dailyFeedDate === today ? dailyFeedCount : 0;
  const remainingDailyFeeds = Math.max(0, DAILY_FEED_LIMIT - effectiveDailyFeedCount);
  const isPetUnlocked = (petId) => petId === "silver" || petId === "okking" && okKingUnlocked || petId === "gold" && goldUnlocked || petId === "tyrant" && tyrantUnlocked;
  (0, import_react.useEffect)(() => {
    const refreshClock = () => setNow(/* @__PURE__ */ new Date());
    const timer = window.setInterval(refreshClock, 6e4);
    document.addEventListener("visibilitychange", refreshClock);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshClock);
    };
  }, []);
  (0, import_react.useEffect)(() => {
    const saved = localStorage.getItem(`daily-hub-${seed}`);
    let savedCompleted = [];
    if (saved) {
      const data = JSON.parse(saved);
      savedCompleted = data.completed || [];
    }
    setCompleted(savedCompleted);
    setAnswers({});
    setCheckedMath(false);
    setFocusGroup(0);
    setFocusNext(1);
    setFocusStart(null);
    setFocusTimes([]);
    setEnglishPracticed([]);
    setEnglishListening(null);
    setEnglishFeedback({});
    Object.values(englishRecordingUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    englishRecordingUrlsRef.current = {};
    setEnglishRecordings({});
    setPatternAnswers({});
    setOddAnswers({});
    setCategoryAnswers({});
    setMemoryOpen([]);
    setMemoryMatched([]);
    setMemoryMoves(0);
    setMemoryBusy(false);
    const profile = localStorage.getItem("daily-hub-profile");
    if (profile) {
      const data = JSON.parse(profile);
      setStars(data.stars ?? 28);
      setFood(data.food ?? 6);
      const legacyCare = Math.max(0, Number(data.petLevel ?? 3) - 3);
      setPetCareTotal(data.petCareTotal ?? legacyCare);
      setSilverFeedTotal(Math.min(GOLD_REQUIRED_FEEDS, data.silverFeedTotal ?? legacyCare));
      setDailyFeedDate(today);
      setDailyFeedCount(
        data.feedRuleVersion === FEED_RULE_VERSION && data.dailyFeedDate === today ? Math.min(data.dailyFeedCount ?? 0, DAILY_FEED_LIMIT) : 0
      );
      const storedDates = Array.isArray(data.checkInDates) ? data.checkInDates : [];
      const mergedDates = savedCompleted.length >= 3 && !storedDates.includes(today) ? [...storedDates, today] : storedDates;
      setCheckInDates([...new Set(mergedDates)].sort());
      const hasTyrant = Boolean(data.tyrantUnlocked);
      const hasGold = Boolean(data.goldUnlocked) || hasTyrant;
      const hasOkKing = Boolean(data.okKingUnlocked);
      setGoldUnlocked(hasGold);
      setTyrantUnlocked(hasTyrant);
      setOkKingUnlocked(hasOkKing);
      setActivePet(hasOkKing && data.activePet === "okking" ? "okking" : hasTyrant && data.activePet === "tyrant" ? "tyrant" : hasGold && data.activePet === "gold" ? "gold" : "silver");
    } else if (savedCompleted.length >= 3) {
      setCheckInDates([today]);
    }
    setProfileLoaded(true);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {
    });
  }, [seed, today]);
  (0, import_react.useEffect)(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);
  (0, import_react.useEffect)(() => {
    if (dailyFeedDate === today) return;
    setDailyFeedDate(today);
    setDailyFeedCount(0);
  }, [dailyFeedDate, today]);
  (0, import_react.useEffect)(() => {
    if (!profileLoaded) return;
    localStorage.setItem("daily-hub-profile", JSON.stringify({
      stars,
      food,
      petLevel: petCareTotal + 3,
      petCareTotal,
      silverFeedTotal,
      feedRuleVersion: FEED_RULE_VERSION,
      dailyFeedDate,
      dailyFeedCount,
      checkInDates,
      goldUnlocked,
      tyrantUnlocked,
      okKingUnlocked,
      activePet
    }));
  }, [activePet, checkInDates, dailyFeedCount, dailyFeedDate, food, goldUnlocked, okKingUnlocked, petCareTotal, profileLoaded, silverFeedTotal, stars, tyrantUnlocked]);
  (0, import_react.useEffect)(() => {
    if (!petDetailId) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPetDetailId(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [petDetailId]);
  (0, import_react.useEffect)(() => () => {
    if (englishTimeoutRef.current !== null) window.clearTimeout(englishTimeoutRef.current);
    try {
      englishRecognitionRef.current?.abort();
    } catch {
    }
    if (englishRecorderRef.current?.state === "recording") englishRecorderRef.current.stop();
    englishStreamRef.current?.getTracks().forEach((track) => track.stop());
    Object.values(englishRecordingUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
  }, []);
  (0, import_react.useEffect)(() => {
    if (active === "english") return;
    englishSessionRef.current += 1;
    try {
      englishRecognitionRef.current?.abort();
    } catch {
    }
    englishRecognitionRef.current = null;
    if (englishRecorderRef.current?.state === "recording") englishRecorderRef.current.stop();
    englishRecorderRef.current = null;
    englishStreamRef.current?.getTracks().forEach((track) => track.stop());
    englishStreamRef.current = null;
    if (englishTimeoutRef.current !== null) window.clearTimeout(englishTimeoutRef.current);
    englishTimeoutRef.current = null;
    setEnglishListening(null);
  }, [active]);
  (0, import_react.useEffect)(() => {
    let startY = 0;
    let latestDistance = 0;
    let pulling = false;
    const onTouchStart = (event) => {
      if (window.scrollY > 0 || event.touches.length !== 1 || refreshing || menuOpen) return;
      startY = event.touches[0].clientY;
      latestDistance = 0;
      pulling = true;
    };
    const onTouchMove = (event) => {
      if (!pulling || window.scrollY > 0) return;
      const delta = event.touches[0].clientY - startY;
      if (delta <= 0) {
        latestDistance = 0;
        setPullDistance(0);
        return;
      }
      event.preventDefault();
      latestDistance = Math.min(110, delta * 0.48);
      setPullDistance(latestDistance);
    };
    const onTouchEnd = () => {
      if (!pulling) return;
      pulling = false;
      if (latestDistance >= 72) {
        setRefreshing(true);
        setPullDistance(58);
        let reloadStarted = false;
        const reload = () => {
          if (reloadStarted) return;
          reloadStarted = true;
          window.setTimeout(() => window.location.reload(), 350);
        };
        const reloadFallback = window.setTimeout(reload, 3e3);
        const update = "serviceWorker" in navigator ? navigator.serviceWorker.getRegistration().then((registration) => registration?.update()) : Promise.resolve();
        update.finally(() => {
          window.clearTimeout(reloadFallback);
          reload();
        });
      } else {
        setPullDistance(0);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [menuOpen, refreshing]);
  const complete = (id, reward = 3) => {
    if (completed.includes(id)) return;
    const next = [...completed, id];
    setCompleted(next);
    setStars((v) => v + reward);
    setFood((v) => v + 1);
    if (next.length >= 3 && !checkInDates.includes(today)) {
      setCheckInDates((dates) => [...dates, today].sort());
      speak("\u4ECA\u65E5\u7B7E\u5230\u6210\u529F\uFF01\u5C0F\u767D\u94F6\u7684\u6210\u957F\u8DEF\u7EBF\u53C8\u524D\u8FDB\u4E86\u4E00\u6B65\u3002");
    }
    localStorage.setItem(`daily-hub-${seed}`, JSON.stringify({ completed: next }));
  };
  const go = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const markEnglishPracticed = (index) => {
    setEnglishPracticed((items) => items.includes(index) ? items : [...items, index]);
  };
  const finishEnglishMedia = () => {
    const recorder = englishRecorderRef.current;
    englishRecorderRef.current = null;
    if (recorder?.state === "recording") {
      try {
        recorder.stop();
      } catch {
      }
    }
    englishStreamRef.current?.getTracks().forEach((track) => track.stop());
    englishStreamRef.current = null;
  };
  const finishEnglishRecognition = (recognition) => {
    if (recognition && englishRecognitionRef.current !== recognition) return;
    englishRecognitionRef.current = null;
    if (englishTimeoutRef.current !== null) window.clearTimeout(englishTimeoutRef.current);
    englishTimeoutRef.current = null;
    setEnglishListening(null);
    finishEnglishMedia();
  };
  const stopEnglishPractice = (index) => {
    englishSessionRef.current += 1;
    const recognition = englishRecognitionRef.current;
    finishEnglishRecognition(recognition);
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
        }
      }
    }
    markEnglishPracticed(index);
    setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u2705 \u672C\u6B21\u8DDF\u8BFB\u5DF2\u7ED3\u675F\u3002\u5F55\u97F3\u51C6\u5907\u597D\u540E\uFF0C\u53EF\u4EE5\u542C\u542C\u81EA\u5DF1\u521A\u624D\u600E\u4E48\u8BFB\u3002" }));
  };
  const playEnglishRecording = (index) => {
    const recording = englishRecordings[index];
    if (!recording) return;
    const audio = new Audio(recording);
    audio.play().catch(() => setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u6682\u65F6\u65E0\u6CD5\u64AD\u653E\uFF0C\u8BF7\u518D\u70B9\u4E00\u6B21\u56DE\u653E\u6309\u94AE\u3002" })));
  };
  const startEnglishPractice = async (line, index) => {
    const sessionId = englishSessionRef.current + 1;
    englishSessionRef.current = sessionId;
    setEnglishListening(index);
    setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u6B63\u5728\u7533\u8BF7\u9EA6\u514B\u98CE\u6743\u9650\u2026\u2026" }));
    if (!navigator.mediaDevices?.getUserMedia) {
      setEnglishListening(null);
      setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u5F53\u524D\u6253\u5F00\u65B9\u5F0F\u4E0D\u652F\u6301\u9EA6\u514B\u98CE\u5F55\u97F3\u3002\u8BF7\u5728 Safari \u4E2D\u6253\u5F00\uFF0C\u6216\u91CD\u65B0\u6DFB\u52A0\u5230\u4E3B\u5C4F\u5E55\u540E\u518D\u8BD5\u3002" }));
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
    } catch (error) {
      if (englishSessionRef.current !== sessionId) return;
      setEnglishListening(null);
      const errorName = error instanceof DOMException ? error.name : "";
      const message = errorName === "NotAllowedError" || errorName === "SecurityError" ? "\u9EA6\u514B\u98CE\u6CA1\u6709\u6388\u6743\u3002\u4E3B\u5C4F\u5E55\u7248\u9700\u8981\u5355\u72EC\u5141\u8BB8\uFF1A\u8BF7\u5230\u201C\u8BBE\u7F6E \u2192 \u9690\u79C1\u4E0E\u5B89\u5168\u6027 \u2192 \u9EA6\u514B\u98CE\u201D\u68C0\u67E5 Mario\u6210\u957F\u5C9B\u3002" : errorName === "NotFoundError" ? "\u6CA1\u6709\u627E\u5230\u53EF\u7528\u7684\u9EA6\u514B\u98CE\uFF0C\u8BF7\u68C0\u67E5\u8BBE\u5907\u6216\u8033\u673A\u8FDE\u63A5\u3002" : "\u9EA6\u514B\u98CE\u6682\u65F6\u88AB\u5176\u4ED6\u5E94\u7528\u5360\u7528\uFF0C\u8BF7\u5173\u95ED\u6B63\u5728\u5F55\u97F3\u6216\u901A\u8BDD\u7684\u5E94\u7528\u540E\u518D\u8BD5\u3002";
      setEnglishFeedback((feedback) => ({ ...feedback, [index]: message }));
      return;
    }
    if (englishSessionRef.current !== sessionId) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    englishStreamRef.current = stream;
    if ("MediaRecorder" in window) {
      try {
        const chunks = [];
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        };
        recorder.onstop = () => {
          if (!chunks.length) return;
          const previousUrl = englishRecordingUrlsRef.current[index];
          if (previousUrl) URL.revokeObjectURL(previousUrl);
          const recordingUrl = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || "audio/mp4" }));
          englishRecordingUrlsRef.current[index] = recordingUrl;
          setEnglishRecordings((recordings) => ({ ...recordings, [index]: recordingUrl }));
        };
        recorder.start();
        englishRecorderRef.current = recorder;
      } catch {
      }
    }
    const speechWindow = window;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u{1F399}\uFE0F \u6B63\u5728\u5F55\u97F3\u3002\u5F53\u524D\u7CFB\u7EDF\u4E0D\u652F\u6301\u81EA\u52A8\u6587\u5B57\u8BC6\u522B\uFF0C\u8BFB\u5B8C\u540E\u70B9\u505C\u6B62\uFF0C\u4ECD\u53EF\u4EE5\u56DE\u653E\u81EA\u5DF1\u7684\u58F0\u97F3\u3002" }));
      englishTimeoutRef.current = window.setTimeout(() => {
        if (englishSessionRef.current !== sessionId) return;
        finishEnglishRecognition(null);
        setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u5F55\u97F3\u5DF2\u81EA\u52A8\u7ED3\u675F\uFF0C\u53EF\u4EE5\u56DE\u653E\u542C\u542C\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u6807\u8BB0\u5B8C\u6210\u3002" }));
      }, 12e3);
      return;
    }
    const recognition = new Recognition();
    let receivedResult = false;
    let recognitionFailed = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onresult = (event) => {
      receivedResult = true;
      const alternatives = Array.from({ length: event.results[0].length }, (_, alternativeIndex) => event.results[0][alternativeIndex]);
      const best = alternatives.map((alternative) => ({ ...alternative, assessment: speechMatchScore(line.en, alternative.transcript) })).sort((a, b) => b.assessment.score - a.assessment.score)[0];
      const { score, missing, extra } = best.assessment;
      if (score >= 75) markEnglishPracticed(index);
      const level = score >= 90 ? "\u{1F31F} \u53E5\u5B50\u5F88\u5B8C\u6574\uFF0C\u8BFB\u5F97\u5F88\u68D2\uFF01" : score >= 75 ? "\u{1F44D} \u8BFB\u5F97\u4E0D\u9519\uFF0C\u518D\u7EC3\u4E00\u6B21\u4F1A\u66F4\u6D41\u5229\uFF01" : score >= 50 ? "\u{1F9E9} \u6709\u51E0\u4E2A\u8BCD\u9700\u8981\u518D\u542C\u4E00\u542C\u3002" : "\u{1F442} \u8FD9\u6B21\u6CA1\u6709\u542C\u6E05\u5B8C\u6574\u53E5\u5B50\uFF0C\u8BF7\u6162\u4E00\u70B9\u518D\u8BD5\u3002";
      const missingTip = missing.length ? ` \u9700\u8981\u6CE8\u610F\uFF1A${missing.join("\u3001")}\u3002` : "";
      const extraTip = extra.length ? ` \u8FD8\u8BC6\u522B\u5230\uFF1A${extra.join("\u3001")}\u3002` : "";
      const confidence = typeof best.confidence === "number" && best.confidence > 0 && best.confidence < 1 ? ` \u8BED\u97F3\u8F6C\u5199\u53EF\u4FE1\u5EA6 ${Math.round(best.confidence * 100)}%\u3002` : "";
      setEnglishFeedback((feedback) => ({
        ...feedback,
        [index]: `${level} \u53E5\u5B50\u5339\u914D\u5EA6 ${score}%\u3002\u7CFB\u7EDF\u542C\u5230\uFF1A\u201C${best.transcript}\u201D\u3002${missingTip}${extraTip}${confidence}`
      }));
      finishEnglishRecognition(recognition);
      try {
        recognition.stop();
      } catch {
      }
    };
    recognition.onerror = (event) => {
      recognitionFailed = true;
      const message = event.error === "service-not-allowed" ? "\u9EA6\u514B\u98CE\u5DF2\u7ECF\u53EF\u7528\uFF0C\u4F46\u7CFB\u7EDF\u8BED\u97F3\u8BC6\u522B\u670D\u52A1\u5728\u5F53\u524D\u6253\u5F00\u65B9\u5F0F\u4E0B\u4E0D\u53EF\u7528\u3002\u5F55\u97F3\u4ECD\u4F1A\u4FDD\u7559\uFF0C\u53EF\u56DE\u653E\u540E\u624B\u52A8\u5B8C\u6210\u3002" : event.error === "not-allowed" ? "\u7CFB\u7EDF\u62D2\u7EDD\u4E86\u8BED\u97F3\u8BC6\u522B\u670D\u52A1\u3002\u8BF7\u68C0\u67E5\u9EA6\u514B\u98CE\u6743\u9650\uFF1B\u5F55\u97F3\u4ECD\u53EF\u7528\u4E8E\u56DE\u653E\u3002" : event.error === "no-speech" ? "\u6CA1\u6709\u68C0\u6D4B\u5230\u6E05\u6670\u8BED\u97F3\uFF0C\u672C\u6B21\u5DF2\u7ED3\u675F\u3002\u8BF7\u9760\u8FD1\u4E00\u70B9\u3001\u6162\u6162\u8BFB\u3002" : "\u8BED\u97F3\u8BC6\u522B\u6682\u65F6\u6CA1\u6709\u542C\u6E05\uFF0C\u672C\u6B21\u5F55\u97F3\u4ECD\u53EF\u56DE\u653E\u3002";
      setEnglishFeedback((feedback) => ({ ...feedback, [index]: message }));
      finishEnglishRecognition(recognition);
    };
    recognition.onspeechend = () => {
      try {
        recognition.stop();
      } catch {
      }
    };
    recognition.onend = () => {
      if (!receivedResult && !recognitionFailed && englishRecognitionRef.current === recognition) {
        setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u6536\u542C\u5DF2\u7ECF\u7ED3\u675F\uFF0C\u4F46\u6CA1\u6709\u8BC6\u522B\u5230\u5B8C\u6574\u53E5\u5B50\u3002\u53EF\u4EE5\u56DE\u653E\u540E\u518D\u8BD5\u4E00\u6B21\u3002" }));
      }
      finishEnglishRecognition(recognition);
    };
    englishRecognitionRef.current = recognition;
    setEnglishListening(index);
    setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u{1F399}\uFE0F \u6B63\u5728\u542C\u4F60\u8BFB\uFF0C\u4E5F\u4F1A\u4FDD\u5B58\u672C\u6B21\u5F55\u97F3\u2026\u2026" }));
    try {
      recognition.start();
      englishTimeoutRef.current = window.setTimeout(() => {
        if (englishRecognitionRef.current !== recognition) return;
        recognitionFailed = true;
        setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u672C\u6B21\u6536\u542C\u5DF2\u81EA\u52A8\u7ED3\u675F\uFF0C\u53EF\u4EE5\u56DE\u653E\u542C\u542C\uFF0C\u518D\u91CD\u65B0\u8DDF\u8BFB\u3002" }));
        finishEnglishRecognition(recognition);
        try {
          recognition.stop();
        } catch {
          try {
            recognition.abort();
          } catch {
          }
        }
      }, 12e3);
    } catch {
      englishRecognitionRef.current = null;
      setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u5F55\u97F3\u5DF2\u7ECF\u5F00\u59CB\uFF0C\u4F46\u5F53\u524D\u7CFB\u7EDF\u65E0\u6CD5\u542F\u52A8\u81EA\u52A8\u8BC6\u522B\u3002\u8BFB\u5B8C\u540E\u70B9\u505C\u6B62\uFF0C\u4ECD\u53EF\u56DE\u653E\u5E76\u624B\u52A8\u5B8C\u6210\u3002" }));
      englishTimeoutRef.current = window.setTimeout(() => {
        if (englishSessionRef.current !== sessionId) return;
        finishEnglishRecognition(null);
        setEnglishFeedback((feedback) => ({ ...feedback, [index]: "\u5F55\u97F3\u5DF2\u81EA\u52A8\u7ED3\u675F\uFF0C\u53EF\u4EE5\u56DE\u653E\u540E\u624B\u52A8\u5B8C\u6210\u3002" }));
      }, 12e3);
    }
  };
  const openMemoryCard = (index) => {
    if (memoryBusy || memoryOpen.includes(index) || memoryMatched.includes(index)) return;
    if (memoryOpen.length === 0) {
      setMemoryOpen([index]);
      return;
    }
    const first = memoryOpen[0];
    const nextOpen = [first, index];
    setMemoryOpen(nextOpen);
    setMemoryMoves((moves) => moves + 1);
    if (memoryDeck[first].symbol === memoryDeck[index].symbol) {
      const nextMatched = [...memoryMatched, first, index];
      setMemoryMatched(nextMatched);
      setMemoryOpen([]);
      if (nextMatched.length === memoryDeck.length) speak("\u8BB0\u5FC6\u914D\u5BF9\u5168\u90E8\u5B8C\u6210\uFF01\u4F60\u7684\u89C2\u5BDF\u529B\u771F\u68D2\uFF01");
      return;
    }
    setMemoryBusy(true);
    window.setTimeout(() => {
      setMemoryOpen([]);
      setMemoryBusy(false);
    }, 720);
  };
  const feedPet = () => {
    if (!food) return;
    const currentDailyCount = dailyFeedDate === today ? dailyFeedCount : 0;
    if (currentDailyCount >= DAILY_FEED_LIMIT) {
      setUpgradeMessage(`\u{1F963} \u4ECA\u5929\u5DF2\u7ECF\u6295\u5582 ${DAILY_FEED_LIMIT} \u6B21\uFF0C\u660E\u5929\u4F1A\u81EA\u52A8\u6062\u590D`);
      speak(`\u4ECA\u5929\u5DF2\u7ECF\u6295\u5582${DAILY_FEED_LIMIT}\u6B21\u5566\uFF0C\u660E\u5929\u518D\u6765\u7167\u6599${currentPet.name}\u5427\u3002`);
      window.setTimeout(() => setUpgradeMessage(""), 3e3);
      return;
    }
    if (dailyFeedDate !== today) setDailyFeedDate(today);
    setFood((value) => value - 1);
    setDailyFeedCount(currentDailyCount + 1);
    setPetCareTotal((value) => value + 1);
    if (!goldUnlocked && activePet === "silver") {
      setSilverFeedTotal((value) => Math.min(GOLD_REQUIRED_FEEDS, value + 1));
    }
    if (currentDailyCount + 1 === DAILY_FEED_LIMIT) {
      setUpgradeMessage(`\u{1F963} \u4ECA\u5929\u7B2C ${DAILY_FEED_LIMIT} \u6B21\u6295\u5582\u5B8C\u6210\uFF0C\u660E\u5929\u4F1A\u81EA\u52A8\u6062\u590D`);
      window.setTimeout(() => setUpgradeMessage(""), 3e3);
    }
    speak(`${currentPet.name}\u5403\u5F97\u9971\u9971\u7684\uFF0C\u6D3B\u529B\u53C8\u589E\u52A0\u5566\uFF01`);
  };
  const claimGold = () => {
    if (!goldReady || goldUnlocked) return;
    setGoldUnlocked(true);
    setActivePet("gold");
    setUpgradeMessage("\u2728 \u95EA\u91D1\u5DF2\u52A0\u5165\u6210\u957F\u5C9B\uFF01");
    speak("\u606D\u559C\uFF01\u5C0F\u767D\u94F6\u5B8C\u6210\u6210\u957F\u8BD5\u70BC\uFF0C\u9EC4\u91D1\u8FDB\u9636\u5F62\u6001\u95EA\u91D1\u5DF2\u7ECF\u89E3\u9501\uFF01");
    window.setTimeout(() => setUpgradeMessage(""), 3600);
  };
  const claimTyrant = () => {
    if (!tyrantReady || tyrantUnlocked) return;
    setTyrantUnlocked(true);
    setActivePet("tyrant");
    setUpgradeMessage("\u{1F525} \u66B4\u66B4\u5DF2\u52A0\u5165\u6210\u957F\u5C9B\uFF01");
    speak("\u592A\u68D2\u4E86\uFF01\u95EA\u91D1\u5B8C\u6210\u4E00\u5468\u6210\u957F\u8BD5\u70BC\uFF0C\u7EC8\u6781\u8FDB\u9636\u5F62\u6001\u66B4\u66B4\u5DF2\u7ECF\u89E3\u9501\uFF01");
    window.setTimeout(() => setUpgradeMessage(""), 3600);
  };
  const claimOkKing = () => {
    if (!okKingReady || okKingUnlocked) return;
    setOkKingUnlocked(true);
    setActivePet("okking");
    setUpgradeMessage("\u{1F409} \u5C0FOK\u738B\u5DF2\u52A0\u5165\u6210\u957F\u5C9B\uFF01");
    speak("\u592A\u68D2\u4E86\uFF01\u4F60\u5B8C\u6210\u4E86\u72EC\u7ACB\u4F19\u4F34\u8BD5\u70BC\uFF0C\u5C0FOK\u738B\u6B63\u5F0F\u52A0\u5165\u6210\u957F\u5C9B\uFF01");
    window.setTimeout(() => setUpgradeMessage(""), 3600);
  };
  const current = sections.find((s) => s.id === active);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "app-shell", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: `pull-refresh ${pullDistance > 0 || refreshing ? "visible" : ""} ${pullDistance >= 72 ? "ready" : ""}`,
        style: { transform: `translate(-50%, ${Math.max(-58, pullDistance - 58)}px)` },
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: refreshing ? "\u21BB" : pullDistance >= 72 ? "\u2191" : "\u2193" }),
          refreshing ? "\u6B63\u5728\u68C0\u67E5\u65B0\u7248\u2026" : pullDistance >= 72 ? "\u677E\u5F00\u5237\u65B0" : "\u4E0B\u62C9\u5237\u65B0"
        ]
      }
    ),
    upgradeMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "upgrade-toast", role: "status", children: upgradeMessage }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `mobile-menu ${menuOpen ? "menu-open" : ""}`, onClick: () => setMenuOpen(true), "aria-label": "\u6253\u5F00\u5B66\u4E60\u5BFC\u822A", "aria-expanded": menuOpen, children: "\u2630" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `drawer-backdrop ${menuOpen ? "visible" : ""}`, onClick: () => setMenuOpen(false), "aria-label": "\u5173\u95ED\u5B66\u4E60\u5BFC\u822A", tabIndex: menuOpen ? 0 : -1 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "aside",
      {
        className: `sidebar ${menuOpen ? "open" : ""}`,
        onTouchStart: (event) => {
          drawerTouchStart.current = event.touches[0].clientX;
        },
        onTouchEnd: (event) => {
          if (event.changedTouches[0].clientX - drawerTouchStart.current < -55) setMenuOpen(false);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "drawer-head", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "brand", onClick: () => go("home"), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "brand-logo", src: "/icon-192.png", alt: "Mario\u6210\u957F\u5C9B" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mario\u6210\u957F\u5C9B" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6BCF\u5929\u8FDB\u6B65\u4E00\u70B9\u70B9" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "drawer-close", onClick: () => setMenuOpen(false), "aria-label": "\u5173\u95ED\u5B66\u4E60\u5BFC\u822A", children: "\xD7" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: visibleSections.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: active === item.id ? "active" : "", onClick: () => go(item.id), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "nav-icon", style: { background: `${item.color}1c`, color: item.color }, children: item.icon }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })
          ] }, item.id)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pet-mini", onClick: () => go("pet"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: currentPet.portrait, alt: "" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                currentPet.name,
                " \xB7 Lv.",
                Math.floor(petCareTotal / 4) + 1
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u4ECA\u5929\u4E5F\u8981\u52A0\u6CB9\u5440\uFF01" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "topbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dateLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: active === "home" ? `${greeting}\uFF0C\u5C0F\u5C0F\u63A2\u7D22\u5BB6\uFF01` : current.label })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stats", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u2B50" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stars }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6210\u957F\u661F" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F963}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: food }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u5BA0\u7269\u9972\u6599" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "avatar", "aria-label": "Mario \u7684\u5934\u50CF", children: "M" })
        ] })
      ] }),
      active === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "hero", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "eyebrow", children: "\u4ECA\u65E5\u6210\u957F\u8BA1\u5212" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
              "\u5B8C\u6210 ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: visibleCompletedCount }),
              " / ",
              visibleTasks.length,
              " \u9879\u4EFB\u52A1"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u5B66\u4E60\u50CF\u79CD\u5C0F\u6811\uFF0C\u6BCF\u5929\u8BA4\u771F\u6D47\u4E00\u70B9\u6C34\uFF0C\u5C31\u4F1A\u957F\u5F97\u53C8\u9AD8\u53C8\u58EE\u3002" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "progress", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${visibleCompletedCount / visibleTasks.length * 100}%` } }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
              "\u518D\u5B8C\u6210 ",
              Math.max(0, visibleTasks.length - visibleCompletedCount),
              " \u9879\uFF0C\u5C31\u80FD\u5B8C\u6210\u5168\u90E8\u6210\u957F\u4EFB\u52A1 \u2600\uFE0F"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "hero-art", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u2601\uFE0F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u{1F331}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "\u{1F308}" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "section-title", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u4ECA\u5929\u7684\u4EFB\u52A1" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u6309\u81EA\u5DF1\u7684\u8282\u594F\u6765\uFF0C\u8BA4\u771F\u5B8C\u6210\u66F4\u91CD\u8981" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak("\u4ECA\u5929\u6709\u62FC\u97F3\u3001\u751F\u5B57\u3001\u82F1\u8BED\u53E3\u8BED\u3001\u6570\u5B66\u3001\u4E13\u6CE8\u529B\u3001\u76CA\u667A\u6E38\u620F\u548C\u524D\u5EAD\u8FD0\u52A8\u4EFB\u52A1\u3002\u52A0\u6CB9\uFF01"), children: "\u{1F50A} \u542C\u542C\u4ECA\u65E5\u5B89\u6392" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "task-grid", children: visibleTasks.map((task) => {
          const done = completed.includes(task.section);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: `task-card ${done ? "done" : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "task-icon", style: { background: `${task.color}19`, color: task.color }, children: done ? "\u2713" : task.icon }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: task.title }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: task.section === "math" ? `${mathLimit}\u4EE5\u5185 \xB7 40\u9898` : task.desc }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
                "\u5B8C\u6210\u5F97 \u2B50 ",
                task.reward,
                " + \u{1F963} 1"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => go(task.section), children: [
              done ? "\u518D\u7EC3\u4E00\u6B21" : "\u5F00\u59CB\u5B66\u4E60",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u203A" })
            ] })
          ] }, task.section);
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "daily-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "daily-poem", onClick: () => go("poem"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4DC}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6BCF\u65E5\u53E4\u8BD7" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
                "\u300A",
                poem.title,
                "\u300B"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: poem.lines.slice(0, 2).join(" ") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u53BB\u6717\u8BFB \u203A" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "pet-banner", onClick: () => go("pet"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "pet-face", src: currentPet.portrait, alt: currentPet.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u5C0F\u5BA0\u7269\u4E2D\u5FC3" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
                currentPet.name,
                "\u5728\u7B49\u4F60"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: activePet === "okking" ? "\u72EC\u7ACB\u4F19\u4F34\u5C0FOK\u738B\u5DF2\u52A0\u5165\uFF0C\u4ECA\u5929\u4E5F\u6765\u966A\u5B83\u5B66\u4E60\u5427" : tyrantUnlocked ? "\u66B4\u66B4\u5DF2\u7ECF\u89E3\u9501\uFF0C\u7EE7\u7EED\u966A\u5B83\u5FEB\u4E50\u6210\u957F" : goldUnlocked ? `\u7EC8\u6781\u8BD5\u70BC\uFF1A\u7B7E\u5230 ${Math.min(checkInDates.length, TYRANT_REQUIRED_DAYS)}/${TYRANT_REQUIRED_DAYS} \u5929 \xB7 \u6295\u5582 ${Math.min(petCareTotal, TYRANT_REQUIRED_FEEDS)}/${TYRANT_REQUIRED_FEEDS} \u6B21` : `\u6210\u957F\u8BD5\u70BC\uFF1A\u7B7E\u5230 ${Math.min(checkInDates.length, GOLD_REQUIRED_DAYS)}/${GOLD_REQUIRED_DAYS} \u5929 \xB7 \u6295\u5582 ${silverFeedTotal}/${GOLD_REQUIRED_FEEDS} \u6B21` })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u53BB\u7167\u6599 \u203A" })
          ] })
        ] })
      ] }),
      active === "pinyin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: `\u7B2C ${curriculumStage + 1} \u9636\u6BB5 \xB7 \u6BCF\u5929 10 \u7EC4\u6807\u51C6\u56DB\u58F0\u62FC\u8BFB\uFF0C\u5176\u4E2D\u5305\u542B\u65B0\u5185\u5BB9\u548C\u95F4\u9694\u590D\u4E60\u3002`, speakText: "\u4E00\u58F0\u5E73\uFF0C\u4E8C\u58F0\u626C\uFF0C\u4E09\u58F0\u62D0\u5F2F\uFF0C\u56DB\u58F0\u964D\u3002\u4ECA\u5929\u7684\u65B0\u5185\u5BB9\u548C\u590D\u4E60\u5185\u5BB9\u90FD\u8981\u5927\u58F0\u8BFB\u3002", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pinyin-grid", children: pinyinLesson.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "pinyin-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            "\u7B2C ",
            i + 1,
            " \u7EC4"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: row.slice(0, 4).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: x }, x)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row[4] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${row.slice(0, 4).join("\uFF0C")}\u3002${row[4].replaceAll("\uFF5C", "\uFF0C")}`), children: "\u{1F50A} \u8DDF\u8BFB" })
        ] }, `${row[0]}-${i}`)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("pinyin"), onClick: () => complete("pinyin", 3) })
      ] }),
      active === "hanzi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: `\u90E8\u7F16\u7248\u4E00\u5E74\u7EA7\u4E0A\u518C\u57FA\u7840\u751F\u5B57 \xB7 \u7B2C ${curriculumStage + 1} \u9636\u6BB5\uFF0C\u6BCF\u5929 15 \u4E2A\u5E76\u7A7F\u63D2\u590D\u4E60\u3002`, speakText: "\u8BA4\u771F\u89C2\u5BDF\u6BCF\u4E2A\u5B57\u5728\u7530\u5B57\u683C\u91CC\u7684\u4F4D\u7F6E\uFF0C\u8DDF\u7740\u8BFB\u97F3\uFF0C\u518D\u8BD5\u7740\u7EC4\u8BCD\u3002\u4ECA\u5929\u7684\u5185\u5BB9\u548C\u6628\u5929\u4E0D\u4E00\u6837\uFF0C\u4E5F\u4F1A\u9047\u89C1\u5B66\u8FC7\u7684\u5B57\u3002", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hanzi-grid", children: hanziLesson.map(([char, py, words]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tian", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: char }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: py }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: words }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${char}\uFF0C${py}\uFF0C${words}`), children: "\u{1F50A} \u542C\u8BFB\u97F3" })
          ] })
        ] }, char)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("hanzi"), onClick: () => complete("hanzi", 5) })
      ] }),
      active === "poem" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u6BCF\u65E5\u4E00\u9996\u5165\u95E8\u53E4\u8BD7\uFF0C\u542C\u4E00\u542C\u3001\u8BFB\u4E00\u8BFB\u3001\u60F3\u4E00\u60F3\u753B\u9762\u3002", speakText: `${poem.title}\uFF0C${poem.author}\u3002${poem.lines.join("")}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "poem-sheet", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u4ECA\u65E5\u53E4\u8BD7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: poem.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            "\u3014\u5510\u3015",
            poem.author
          ] }),
          poem.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: l }, l)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${poem.title}\u3002${poem.lines.join("")}`), children: "\u{1F50A} \u5B8C\u6574\u6717\u8BFB" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "meaning", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u{1F4A1} \u8BD7\u610F\u5C0F\u7A97" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: poem.note })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("poem"), onClick: () => complete("poem", 3) })
      ] }),
      active === "english" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: `\u6BCF\u65E5\u82F1\u8BED\u53E3\u8BED \xB7 ${englishLesson.intro}\u3002\u5148\u542C\u6807\u51C6\u53D1\u97F3\uFF0C\u518D\u5927\u58F0\u8DDF\u8BFB\u3002`, speakText: `\u4ECA\u5929\u7684\u82F1\u8BED\u4E3B\u9898\u662F${englishLesson.intro}\u3002\u5148\u542C\u4E00\u542C\uFF0C\u518D\u52C7\u6562\u5F00\u53E3\u8BF4\u3002`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "english-hero", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: englishLesson.emoji }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "TODAY'S ENGLISH" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: englishLesson.theme }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              "\u5DF2\u5B8C\u6210\u8DDF\u8BFB ",
              englishPracticed.length,
              " / ",
              englishLesson.lines.length,
              " \u53E5"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speakEnglish(englishLesson.lines.map((line) => line.en).join(" ")), children: "\u{1F50A} \u8FDE\u7EED\u542C\u4E00\u904D" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "english-grid", children: englishLesson.lines.map((line, index) => {
          const practiced = englishPracticed.includes(index);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: `english-card ${practiced ? "practiced" : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "english-number", children: practiced ? "\u2713" : index + 1 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "english-copy", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: line.en }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line.zh }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
                "\u53D1\u97F3\u63D0\u793A\uFF1A",
                line.hint
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "english-actions", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speakEnglish(line.en), children: "\u{1F50A} \u542C\u4E00\u542C" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: englishListening === index ? "listening" : "", onClick: () => englishListening === index ? stopEnglishPractice(index) : startEnglishPractice(line, index), disabled: englishListening !== null && englishListening !== index, children: englishListening === index ? "\u23F9\uFE0F \u8BFB\u5B8C\u4E86\uFF0C\u505C\u6B62" : "\u{1F399}\uFE0F \u8DDF\u8BFB\u8BC6\u522B" }),
              englishRecordings[index] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "replay-button", onClick: () => playEnglishRecording(index), disabled: englishListening !== null, children: "\u25B6\uFE0F \u542C\u542C\u6211\u7684\u58F0\u97F3" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => englishListening === index ? stopEnglishPractice(index) : markEnglishPracticed(index), children: practiced ? "\u2713 \u5DF2\u8BFB\u5B8C" : "\u6211\u8BFB\u5B8C\u4E86" })
            ] }),
            englishFeedback[index] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "english-feedback", children: englishFeedback[index] })
          ] }, line.en);
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "microphone-note", children: "Safari \u9875\u9762\u548C\u4E3B\u5C4F\u5E55\u7248\u4F1A\u5206\u522B\u7533\u8BF7\u9EA6\u514B\u98CE\u6743\u9650\u3002\u8BC4\u5206\u8868\u793A\u201C\u8BC6\u522B\u53E5\u5B50\u5339\u914D\u5EA6\u201D\uFF0C\u5F55\u97F3\u4EC5\u4FDD\u5B58\u5728\u672C\u673A\u5F53\u524D\u9875\u9762\uFF0C\u4E0D\u4F1A\u4E0A\u4F20\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("english"), onClick: () => complete("english", 4) })
      ] }),
      active === "math" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: `\u4ECA\u65E5\u4E3A ${mathLimit} \u4EE5\u5185\u52A0\u51CF\u6CD5\uFF0C\u5171 40 \u9898\u3002\u96BE\u5EA6\u4F1A\u968F\u6709\u6548\u5B66\u4E60\u5929\u6570\u9010\u6B65\u63D0\u9AD8\uFF0C\u6700\u9AD8\u4E0D\u8D85\u8FC7 50\u3002`, speakText: `${mathGuide.title}\u3002${mathGuide.steps.join("\u3002")}\u3002${mathGuide.tip}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "math-coach", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "math-coach-head", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
                "\u7B2C ",
                curriculumStage + 1,
                " \u9636\u6BB5 \xB7 \u5148\u5B66\u65B9\u6CD5\u518D\u505A\u9898"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: mathGuide.title })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: mathGuide.example })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "math-steps", children: mathGuide.steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: step })
          ] }, step)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "math-tip", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4A1}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mathGuide.tip }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${mathGuide.title}\u3002${mathGuide.steps.join("\u3002")}\u3002${mathGuide.tip}`), children: "\u{1F50A} \u542C\u8001\u5E08\u8BB2" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "math-toolbar", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            "\u23F1\uFE0F \u5EFA\u8BAE\u7528\u65F6 ",
            curriculumStage < 2 ? 10 : 12,
            " \u5206\u949F \xB7 \u672C\u9636\u6BB5 ",
            mathLimit,
            " \u4EE5\u5185"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
            Object.keys(answers).length,
            " / 40 \u5DF2\u5B8C\u6210"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "math-grid", children: mathProblems.map((q, i) => {
          const correct = checkedMath && Number(answers[i]) === q.answer;
          const wrong = checkedMath && answers[i] !== void 0 && !correct;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: correct ? "correct" : wrong ? "wrong" : "", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: i + 1 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
              q.a,
              " ",
              q.op,
              " ",
              q.b,
              " ="
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { inputMode: "numeric", maxLength: 3, value: answers[i] ?? "", onChange: (e) => setAnswers({ ...answers, [i]: e.target.value.replace(/\D/g, "") }) }),
            wrong && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: q.answer })
          ] }, i);
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary-action", onClick: () => {
          setCheckedMath(true);
          if (mathProblems.every((q, i) => Number(answers[i]) === q.answer)) complete("math", 5);
        }, children: "\u2713 \u81EA\u52A8\u6279\u6539" })
      ] }),
      active === "focus" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u5171 5 \u7EC4 4\xD74 \u8212\u5C14\u7279\u65B9\u683C\u3002\u6309 1 \u5230 16 \u987A\u5E8F\u70B9\u51FB\uFF0C\u6BCF\u7EC4\u72EC\u7ACB\u8BA1\u65F6\u3002", speakText: "\u773C\u775B\u770B\u65B9\u683C\u4E2D\u5FC3\uFF0C\u7528\u4F59\u5149\u5BFB\u627E\u6570\u5B57\uFF0C\u4ECE\u4E00\u5F00\u59CB\u6309\u987A\u5E8F\u70B9\u51FB\u5230\u5341\u516D\u3002", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "focus-status", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            "\u7B2C ",
            focusGroup + 1,
            " / 5 \u7EC4"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: focusNext === 1 ? "\u70B9\u51FB 1 \u5F00\u59CB\u8BA1\u65F6" : `\u4E0B\u4E00\u4E2A\uFF1A${focusNext}` })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "schulte", children: grid.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: n < focusNext ? "hit" : "", onClick: () => {
          if (n !== focusNext) return;
          if (n === 1) setFocusStart(Date.now());
          if (n === 16 && focusStart) {
            const newTimes = [...focusTimes, Math.round((Date.now() - focusStart) / 100) / 10];
            setFocusTimes(newTimes);
            if (focusGroup === 4) complete("focus", 4);
          }
          setFocusNext(n + 1);
        }, children: n }, n)) }),
        focusNext === 17 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary-action", onClick: () => {
          if (focusGroup < 4) {
            setFocusGroup(focusGroup + 1);
            setFocusNext(1);
            setFocusStart(null);
          }
        }, children: focusGroup === 4 ? "\u4ECA\u5929 5 \u7EC4\u5B8C\u6210\u5566\uFF01" : `\u672C\u7EC4 ${focusTimes.at(-1)} \u79D2 \xB7 \u5F00\u59CB\u4E0B\u4E00\u7EC4` }),
        !!focusTimes.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "result-line", children: [
          "\u4ECA\u65E5\u6210\u7EE9\uFF1A",
          focusTimes.map((t, i) => `\u7B2C${i + 1}\u7EC4 ${t}\u79D2`).join("\u3000")
        ] })
      ] }),
      active === "games" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u6BCF\u5929\u56DB\u79CD\u76CA\u667A\u6311\u6218\uFF1A\u627E\u89C4\u5F8B\u3001\u8BB0\u5FC6\u914D\u5BF9\u3001\u627E\u4E0D\u540C\u548C\u5206\u7C7B\u5C0F\u8FBE\u4EBA\uFF0C\u5185\u5BB9\u6BCF\u65E5\u8F6E\u6362\u3002", speakText: "\u5148\u9759\u9759\u89C2\u5BDF\uFF0C\u518D\u505A\u9009\u62E9\u3002\u7B54\u9519\u6CA1\u5173\u7CFB\uFF0C\u8BA4\u771F\u601D\u8003\u5C31\u662F\u8FDB\u6B65\u3002", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "game-layout", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "pattern-game", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "game-heading", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6E38\u620F\u4E00" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u{1F50D} \u627E\u89C4\u5F8B" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                patternCorrectCount,
                " / ",
                dailyPatterns.length
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pattern-list", children: dailyPatterns.map((question, index) => {
              const selected = patternAnswers[index];
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pattern-sequence", children: question.sequence.map((item, itemIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item }, `${item}-${itemIndex}`)) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pattern-choices", children: question.choices.map((choice) => {
                  const stateClass = selected === choice ? choice === question.answer ? "correct" : "wrong" : "";
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: stateClass, disabled: selected === question.answer, onClick: () => setPatternAnswers((answers2) => ({ ...answers2, [index]: choice })), children: choice }, choice);
                }) }),
                selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: selected === question.answer ? "right-tip" : "wrong-tip", children: [
                  selected === question.answer ? "\u7B54\u5BF9\u5566\uFF01" : "\u518D\u89C2\u5BDF\u4E00\u6B21\uFF1A",
                  " ",
                  question.tip
                ] })
              ] }, `${question.answer}-${index}`);
            }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "memory-game", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "game-heading", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6E38\u620F\u4E8C" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u{1F9E0} \u8BB0\u5FC6\u914D\u5BF9" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                memoryMoves,
                " \u6B65"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "memory-instruction", children: "\u6BCF\u6B21\u7FFB\u5F00\u4E24\u5F20\u5361\u7247\uFF0C\u627E\u5230\u56DB\u7EC4\u76F8\u540C\u56FE\u6848\u3002" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "memory-grid", children: memoryDeck.map((card, index) => {
              const visible = memoryOpen.includes(index) || memoryMatched.includes(index);
              return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `${visible ? "open" : ""} ${memoryMatched.includes(index) ? "matched" : ""}`, "aria-label": visible ? card.symbol : `\u7B2C${index + 1}\u5F20\u8BB0\u5FC6\u5361`, onClick: () => openMemoryCard(index), disabled: memoryBusy || memoryMatched.includes(index), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: visible ? card.symbol : "?" }) }, card.id);
            }) }),
            memoryMatched.length === memoryDeck.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "memory-success", children: [
              "\u{1F389} \u5168\u90E8\u914D\u5BF9\u6210\u529F\uFF01\u4ECA\u5929\u7528\u4E86 ",
              memoryMoves,
              " \u6B65\u3002"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "mini-choice-game odd-game", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "game-heading", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6E38\u620F\u4E09" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u{1F440} \u627E\u4E0D\u540C" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                oddCorrectCount,
                " / ",
                dailyOddQuestions.length
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mini-puzzle-list", children: dailyOddQuestions.map((question, index) => {
              const selected = oddAnswers[index];
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: question.prompt }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mini-puzzle-choices", children: question.choices.map((choice, choiceIndex) => {
                  const stateClass = selected === choice ? choice === question.answer ? "correct" : "wrong" : "";
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: stateClass, disabled: selected === question.answer, onClick: () => setOddAnswers((answers2) => ({ ...answers2, [index]: choice })), children: choice }, `${choice}-${choiceIndex}`);
                }) }),
                selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: selected === question.answer ? "right-tip" : "wrong-tip", children: [
                  selected === question.answer ? "\u627E\u5230\u4E86\uFF01" : "\u518D\u770B\u4E00\u770B\uFF1A",
                  " ",
                  question.tip
                ] })
              ] }, `${question.prompt}-${index}`);
            }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "mini-choice-game category-game", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "game-heading", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u6E38\u620F\u56DB" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u{1F9FA} \u5206\u7C7B\u5C0F\u8FBE\u4EBA" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                categoryCorrectCount,
                " / ",
                dailyCategoryQuestions.length
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mini-puzzle-list", children: dailyCategoryQuestions.map((question, index) => {
              const selected = categoryAnswers[index];
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: question.prompt }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mini-puzzle-choices", children: question.choices.map((choice, choiceIndex) => {
                  const stateClass = selected === choice ? choice === question.answer ? "correct" : "wrong" : "";
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: stateClass, disabled: selected === question.answer, onClick: () => setCategoryAnswers((answers2) => ({ ...answers2, [index]: choice })), children: choice }, `${choice}-${choiceIndex}`);
                }) }),
                selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: selected === question.answer ? "right-tip" : "wrong-tip", children: [
                  selected === question.answer ? "\u5206\u7C7B\u6B63\u786E\uFF01" : "\u518D\u60F3\u4E00\u60F3\uFF1A",
                  " ",
                  question.tip
                ] })
              ] }, `${question.prompt}-${index}`);
            }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("games"), onClick: () => complete("games", 4) })
      ] }),
      active === "science" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u4E00\u4E2A\u751F\u6D3B\u77E5\u8BC6\uFF0C\u52A0\u4E00\u4E2A\u5B89\u5168\u5C45\u5BB6\u5C0F\u5B9E\u9A8C\u3002\u5B9E\u9A8C\u8BF7\u5BB6\u957F\u966A\u540C\u3002", speakText: `${science.title}${science.body}${science.experiment}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "science-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u4ECA\u65E5\u4E3A\u4EC0\u4E48" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: science.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: science.body })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "experiment", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "\u{1F9EA}" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u5C45\u5BB6\u5C0F\u5B9E\u9A8C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: science.experiment }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              "\u{1F6E1}\uFE0F ",
              science.fact,
              " \u8BF7\u5BB6\u957F\u5168\u7A0B\u966A\u540C\u3002"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("science"), onClick: () => complete("science", 3) })
      ] }),
      active === "sport" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u524D\u5EAD\u611F\u7EDF\u4E13\u6CE8\u529B\u8BAD\u7EC3\u6BCF\u5929\u81EA\u52A8\u8F6E\u6362\uFF0C\u6BCF\u6B21\u7EA6 10 \u5206\u949F\u3002\u5468\u56F4\u7559\u51FA\u7A7A\u95F4\uFF0C\u5BB6\u957F\u966A\u540C\u3002", speakText: `\u4ECA\u5929\u505A${movementPlan.map((item) => item[1]).join("\u3001")}\u3002\u52A8\u4F5C\u6162\u4E00\u70B9\uFF0C\u4FDD\u6301\u8EAB\u4F53\u7A33\u5B9A\u3002`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "movement-grid", children: movementPlan.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x[0] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            "\u52A8\u4F5C ",
            i + 1
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: x[1] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: x[2] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: x[3] })
        ] }, x[1])) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("sport"), onClick: () => complete("sport", 3) })
      ] }),
      active === "recipe" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u642D\u914D\u4E3B\u98DF\u3001\u86CB\u767D\u8D28\u3001\u852C\u83DC\u548C\u6C34\u679C\uFF0C\u6BCF\u5929\u66F4\u6362\u4E00\u7EC4\u5BB6\u5EAD\u9910\u5355\u3002", speakText: `\u4ECA\u5929\u63A8\u8350${mealPlan.map((item) => item[1]).join("\u3001")}\u3002`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "meal", children: mealPlan.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "plate", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item[0] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item[1] })
        ] }, item[1])) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "parent-note", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u7ED9\u5BB6\u957F\u7684\u5C0F\u63D0\u793A" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u5C11\u76D0\u5C11\u6CB9\u3001\u98DF\u6750\u5207\u5C0F\uFF1B\u4E0D\u5F3A\u8FEB\u8FDB\u98DF\u3002\u82E5\u5B69\u5B50\u5BF9\u867E\u3001\u86CB\u7B49\u98DF\u6750\u8FC7\u654F\uFF0C\u8BF7\u66FF\u6362\u4E3A\u5B89\u5168\u98DF\u6750\u3002" })
        ] })
      ] }),
      active === "chores" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: "\u81EA\u5DF1\u7684\u4E8B\u60C5\u81EA\u5DF1\u505A\u3002\u4ECA\u5929\u53EA\u7EC3\u4E00\u4EF6\u5C0F\u4E8B\uFF1A\u6574\u7406\u4E66\u684C\u3002", speakText: "\u5148\u628A\u5783\u573E\u4E22\u6389\uFF0C\u518D\u628A\u4E66\u672C\u6309\u5927\u5C0F\u6392\u597D\uFF0C\u6587\u5177\u653E\u56DE\u7B14\u7B52\uFF0C\u6700\u540E\u64E6\u4E00\u64E6\u684C\u9762\u3002", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "steps", children: ["\u628A\u7EB8\u5C51\u548C\u5783\u573E\u653E\u8FDB\u5783\u573E\u6876", "\u4E66\u672C\u6309\u4ECE\u5927\u5230\u5C0F\u6446\u6574\u9F50", "\u94C5\u7B14\u3001\u6A61\u76AE\u56DE\u5230\u81EA\u5DF1\u7684\u5BB6", "\u7528\u5C0F\u62B9\u5E03\u64E6\u5E72\u51C0\u684C\u9762"].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })
        ] }, s)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteButton, { done: completed.includes("chores"), onClick: () => complete("chores", 2) })
      ] }),
      active === "pet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LearningPage, { intro: `\u5B8C\u6210\u6BCF\u65E5\u4EFB\u52A1\u83B7\u5F97\u9972\u6599\uFF0C\u6BCF\u5929\u6700\u591A\u6295\u5582 ${DAILY_FEED_LIMIT} \u6B21\u3002\u4EBA\u9A6C\u4F19\u4F34\u53EF\u4EE5\u6210\u957F\u8FDB\u9636\uFF0C\u72EC\u7ACB\u4F19\u4F34\u9700\u8981\u5B8C\u6210\u81EA\u5DF1\u7684\u7B7E\u5230\u6295\u5582\u8BD5\u70BC\u3002`, speakText: activePet === "okking" ? `\u4F60\u597D\u5440\uFF0C\u6211\u662F\u5C0FOK\u738B\u3002\u6211\u662F\u72EC\u7ACB\u4F19\u4F34\uFF0C\u4ECA\u5929\u8FD8\u53EF\u4EE5\u6295\u5582${remainingDailyFeeds}\u6B21\u3002` : `\u4F60\u597D\u5440\uFF0C\u6211\u662F${currentPet.name}\u3002\u4ECA\u5929\u8FD8\u53EF\u4EE5\u6295\u5582${remainingDailyFeeds}\u6B21\u3002${tyrantUnlocked ? "\u66B4\u66B4\u5DF2\u7ECF\u6210\u529F\u52A0\u5165\u6210\u957F\u5C9B\u3002" : goldUnlocked ? `\u8DDD\u79BB\u66B4\u66B4\u8FD8\u9700\u8981\u7D2F\u8BA1\u7B7E\u5230${Math.max(0, TYRANT_REQUIRED_DAYS - checkInDates.length)}\u5929\uFF0C\u6295\u5582${Math.max(0, TYRANT_REQUIRED_FEEDS - petCareTotal)}\u6B21\u3002` : `\u5C0F\u767D\u94F6\u7D2F\u8BA1\u7B7E\u5230${checkInDates.length}\u5929\uFF0C\u6295\u5582${silverFeedTotal}\u6B21\u3002`}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pet-dashboard", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: `pet-room pet-room-${activePet}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pet-day-badges", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: todayCheckedIn ? "done" : "", children: [
                "\u{1F4C5} ",
                todayCheckedIn ? "\u4ECA\u65E5\u5DF2\u7B7E\u5230" : "\u5B8C\u6210 3 \u9879\u4EFB\u52A1\u7B7E\u5230"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: effectiveDailyFeedCount >= DAILY_FEED_LIMIT ? "done" : "", children: [
                "\u{1F963} \u4ECA\u65E5\u6295\u5582 ",
                effectiveDailyFeedCount,
                "/",
                DAILY_FEED_LIMIT
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "pet-portrait-button", onClick: () => setPetDetailId(activePet), "aria-label": `\u67E5\u770B${currentPet.name}\u7684${currentPet.species}\u56FE\u9274`, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "big-pet-image", src: currentPet.portrait, alt: `${currentPet.name}\uFF0C${currentPet.species}\u5BA0\u7269` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u70B9\u51FB\u67E5\u770B\u56FE\u9274" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { className: "pet-species", style: { color: currentPet.accent }, children: [
              currentPet.species,
              " \xB7 ",
              currentPet.code
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: currentPet.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              "\u7167\u6599\u7B49\u7EA7 Lv.",
              Math.floor(petCareTotal / 4) + 1,
              " \xB7 \u6D3B\u529B ",
              Math.min(100, 45 + petCareTotal * 4),
              "%"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pet-progress", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${petCareTotal % 4 * 25}%` } }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "feed-rule-note", children: [
              "\u9972\u6599\u5E93\u5B58 ",
              food,
              " \u4EFD \xB7 \u4ECA\u65E5\u8FD8\u53EF\u6295\u5582 ",
              remainingDailyFeeds,
              " \u6B21"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: feedPet, disabled: !food, children: !food ? "\u4ECA\u5929\u6CA1\u6709\u9972\u6599\u5566" : effectiveDailyFeedCount >= DAILY_FEED_LIMIT ? `\u{1F963} \u4ECA\u65E5\u5DF2\u6295\u5582 ${DAILY_FEED_LIMIT} \u6B21\uFF08\u660E\u5929\u6062\u590D\uFF09` : `\u{1F963} \u5582${currentPet.name}\u4E00\u4EFD\u9972\u6599\uFF08\u8FD8\u6709 ${food} \u4EFD\uFF09` })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "growth-route", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "growth-route-head", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u4E00\u5468\u6210\u957F\u8DEF\u7EBF" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u5C0F\u767D\u94F6 \u2192 \u95EA\u91D1 \u2192 \u66B4\u66B4" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tyrantUnlocked ? "\u5168\u5F62\u6001\u89E3\u9501" : `${Math.min(checkInDates.length, TYRANT_REQUIRED_DAYS)}/${TYRANT_REQUIRED_DAYS} \u5929` })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "evolution-track evolution-track-three", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: `evolution-stage owned ${activePet === "silver" ? "selected" : ""}`, onClick: () => setPetDetailId("silver"), "aria-label": "\u9884\u89C8\u5C0F\u767D\u94F6\u5B8C\u6574\u5F62\u6001", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: pets.silver.portrait, alt: "" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u521D\u59CB\u5F62\u6001" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u5C0F\u767D\u94F6" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: activePet === "silver" ? "\u4F7F\u7528\u4E2D \xB7 \u70B9\u51FB\u9884\u89C8" : "\u5DF2\u62E5\u6709 \xB7 \u70B9\u51FB\u9884\u89C8" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "evolution-arrow", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3\u5929 \xB7 9\u6B21" }),
                "\u2192"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: `evolution-stage gold-stage ${goldUnlocked ? "owned" : "locked"} ${activePet === "gold" ? "selected" : ""}`, onClick: () => setPetDetailId("gold"), "aria-label": "\u9884\u89C8\u95EA\u91D1\u5B8C\u6574\u5F62\u6001", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: pets.gold.portrait, alt: "" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u9EC4\u91D1\u8FDB\u9636" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u95EA\u91D1" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: goldUnlocked ? activePet === "gold" ? "\u4F7F\u7528\u4E2D \xB7 \u70B9\u51FB\u9884\u89C8" : "\u5DF2\u62E5\u6709 \xB7 \u70B9\u51FB\u9884\u89C8" : "\u5F85\u89E3\u9501 \xB7 \u53EF\u9884\u89C8" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "evolution-arrow", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u518D4\u5929 \xB7 \u517163\u6B21" }),
                "\u2192"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: `evolution-stage tyrant-stage ${tyrantUnlocked ? "owned" : "locked"} ${activePet === "tyrant" ? "selected" : ""}`, onClick: () => setPetDetailId("tyrant"), "aria-label": "\u9884\u89C8\u66B4\u66B4\u5B8C\u6574\u5F62\u6001", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: pets.tyrant.portrait, alt: "" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u7EC8\u6781\u8FDB\u9636" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u66B4\u66B4" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: tyrantUnlocked ? activePet === "tyrant" ? "\u4F7F\u7528\u4E2D \xB7 \u70B9\u51FB\u9884\u89C8" : "\u5DF2\u62E5\u6709 \xB7 \u70B9\u51FB\u9884\u89C8" : "\u5F85\u89E3\u9501 \xB7 \u53EF\u9884\u89C8" })
              ] })
            ] }),
            !goldUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "unlock-requirement", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4C5} \u6709\u6548\u7B7E\u5230" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                    Math.min(checkInDates.length, GOLD_REQUIRED_DAYS),
                    " / ",
                    GOLD_REQUIRED_DAYS,
                    " \u5929"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.min(100, checkInDates.length / GOLD_REQUIRED_DAYS * 100)}%` } }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F963} \u7D2F\u8BA1\u6295\u5582\u5C0F\u767D\u94F6" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                    silverFeedTotal,
                    " / ",
                    GOLD_REQUIRED_FEEDS,
                    " \u6B21"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.min(100, silverFeedTotal / GOLD_REQUIRED_FEEDS * 100)}%` } }) })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "unlock-tip", children: goldReady ? "\u6210\u957F\u6761\u4EF6\u5DF2\u7ECF\u5B8C\u6210\uFF0C\u5FEB\u9886\u53D6\u95EA\u91D1\u5427\uFF01" : `\u8FD8\u9700 ${Math.max(0, GOLD_REQUIRED_DAYS - checkInDates.length)} \u4E2A\u7B7E\u5230\u65E5\u548C ${Math.max(0, GOLD_REQUIRED_FEEDS - silverFeedTotal)} \u6B21\u6295\u5582` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: `claim-pet ${goldReady ? "ready" : ""}`, onClick: claimGold, disabled: !goldReady, children: [
                "\u2728 ",
                goldReady ? "\u5347\u7EA7\u9886\u53D6\u95EA\u91D1" : "\u5B8C\u6210\u6761\u4EF6\u540E\u9886\u53D6\u95EA\u91D1"
              ] })
            ] }) : !tyrantUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "unlock-requirement tyrant-requirement", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4C5} \u4E00\u5468\u6709\u6548\u7B7E\u5230\uFF08\u95EA\u91D1\u540E\u518D\u575A\u63014\u5929\uFF09" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                    Math.min(checkInDates.length, TYRANT_REQUIRED_DAYS),
                    " / ",
                    TYRANT_REQUIRED_DAYS,
                    " \u5929"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.min(100, checkInDates.length / TYRANT_REQUIRED_DAYS * 100)}%` } }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F963} \u4E00\u5468\u7D2F\u8BA1\u6295\u5582" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                    Math.min(petCareTotal, TYRANT_REQUIRED_FEEDS),
                    " / ",
                    TYRANT_REQUIRED_FEEDS,
                    " \u6B21"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.min(100, petCareTotal / TYRANT_REQUIRED_FEEDS * 100)}%` } }) })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "unlock-tip", children: tyrantReady ? "\u7EC8\u6781\u6210\u957F\u6761\u4EF6\u5DF2\u7ECF\u5B8C\u6210\uFF0C\u5FEB\u9886\u53D6\u66B4\u66B4\u5427\uFF01" : `\u8FD8\u9700 ${Math.max(0, TYRANT_REQUIRED_DAYS - checkInDates.length)} \u4E2A\u7B7E\u5230\u65E5\u548C ${Math.max(0, TYRANT_REQUIRED_FEEDS - petCareTotal)} \u6B21\u6295\u5582` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: `claim-pet tyrant-claim ${tyrantReady ? "ready" : ""}`, onClick: claimTyrant, disabled: !tyrantReady, children: [
                "\u{1F525} ",
                tyrantReady ? "\u7EC8\u6781\u5347\u7EA7\u9886\u53D6\u66B4\u66B4" : "\u5B8C\u6210\u4E00\u5468\u8BD5\u70BC\u540E\u9886\u53D6\u66B4\u66B4"
              ] })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "gold-unlocked-card tyrant-unlocked-card", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F3C6}" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u4E09\u79CD\u6210\u957F\u5F62\u6001\u5168\u90E8\u89E3\u9501" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u5C0F\u767D\u94F6\u3001\u95EA\u91D1\u548C\u66B4\u66B4\u90FD\u53EF\u4EE5\u968F\u65F6\u9884\u89C8\u5E76\u5207\u6362\u4F7F\u7528\u3002" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "independent-pets", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u72EC\u7ACB\u4F19\u4F34\u8BD5\u70BC" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u575A\u6301\u5B66\u4E60\uFF0C\u9886\u53D6\u5C0FOK\u738B" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u5C0FOK\u738B\u62E5\u6709\u72EC\u7ACB\u5F62\u6001\uFF0C\u4E0D\u53C2\u4E0E\u201C\u5C0F\u767D\u94F6 \u2192 \u95EA\u91D1 \u2192 \u66B4\u66B4\u201D\u6210\u957F\u8DEF\u7EBF\uFF1B\u89E3\u9501\u524D\u53EF\u4EE5\u9884\u89C8\u56FE\u9274\u3002" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: `${okKingUnlocked ? "owned" : "locked"} ${activePet === "okking" ? "selected" : ""}`, onClick: () => setPetDetailId("okking"), "aria-label": "\u9884\u89C8\u5C0FOK\u738B", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: pets.okking.portrait, alt: "\u5C0FOK\u738B\uFF0C\u53E4\u6817\u6B27\u514B\u738B\u72EC\u7ACB\u5BA0\u7269" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u5C0FOK\u738B" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: okKingUnlocked ? activePet === "okking" ? "\u4F7F\u7528\u4E2D \xB7 \u70B9\u51FB\u67E5\u770B\u56FE\u9274" : "\u5DF2\u62E5\u6709 \xB7 \u70B9\u51FB\u9884\u89C8\u9009\u62E9" : "\u5F85\u89E3\u9501 \xB7 \u53EF\u4EE5\u9884\u89C8\u56FE\u9274" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: okKingUnlocked ? "\u72EC\u7ACB\u5F62\u6001" : "\u8BD5\u70BC\u4E2D" })
          ] }),
          !okKingUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "independent-unlock", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4C5} \u7D2F\u8BA1\u7B7E\u5230" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                Math.min(checkInDates.length, OK_KING_REQUIRED_DAYS),
                " / ",
                OK_KING_REQUIRED_DAYS,
                " \u5929"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.min(100, checkInDates.length / OK_KING_REQUIRED_DAYS * 100)}%` } }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F963} \u7D2F\u8BA1\u6295\u5582\u4EFB\u610F\u5BA0\u7269" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
                Math.min(petCareTotal, OK_KING_REQUIRED_FEEDS),
                " / ",
                OK_KING_REQUIRED_FEEDS,
                " \u6B21"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { style: { width: `${Math.min(100, petCareTotal / OK_KING_REQUIRED_FEEDS * 100)}%` } }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: okKingReady ? "ready" : "", onClick: claimOkKing, disabled: !okKingReady, children: okKingReady ? "\u{1F409} \u9886\u53D6\u5C0FOK\u738B" : `\u8FD8\u9700 ${Math.max(0, OK_KING_REQUIRED_DAYS - checkInDates.length)} \u5929\u7B7E\u5230 \xB7 ${Math.max(0, OK_KING_REQUIRED_FEEDS - petCareTotal)} \u6B21\u6295\u5582` })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "independent-owned", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F409}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u5C0FOK\u738B\u5DF2\u89E3\u9501\uFF0C\u53EF\u4EE5\u968F\u65F6\u5207\u6362\u966A\u4F34\u5B66\u4E60" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pet-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${currentPet.name}\u6D17\u5F97\u4EAE\u6676\u6676\uFF0C\u5F00\u5FC3\u5730\u6447\u4E86\u6447\u8EAB\u4F53\u3002`), children: "\u{1F6C1} \u6D17\u9999\u9999" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${currentPet.name}\u5F00\u5FC3\u5730\u8FFD\u7740\u5F69\u7403\uFF0C\u73A9\u5F97\u771F\u5F00\u5FC3\u3002`), children: "\u{1F3BE} \u73A9\u5F69\u7403" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(`${currentPet.name}\u8DB4\u8FDB\u8F6F\u8F6F\u7684\u5C0F\u7A9D\uFF0C\u505A\u4E86\u4E00\u4E2A\u751C\u751C\u7684\u68A6\u3002`), children: "\u{1F319} \u54C4\u7761\u89C9" })
        ] })
      ] }),
      active === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningPage, { intro: "\u6BCF\u5929\u5B8C\u6210\u81F3\u5C11 3 \u9879\u4EFB\u52A1\uFF0C\u5C31\u80FD\u70B9\u4EAE\u4E00\u4E2A\u771F\u5B9E\u7B7E\u5230\u65E5\u3002\u7B7E\u5230\u8BB0\u5F55\u4E5F\u4F1A\u63A8\u52A8\u5BA0\u7269\u6210\u957F\u3002", speakText: `\u4F60\u5DF2\u7ECF\u7D2F\u8BA1\u7B7E\u5230${checkInDates.length}\u5929\u3002\u6BCF\u5929\u8FDB\u6B65\u4E00\u70B9\u70B9\uFF0C\u5C31\u662F\u6700\u68D2\u7684\u6210\u957F\u3002`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { checkInDates, completedToday: completed.length >= 3 }) })
    ] }),
    petDetailId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pet-detail-backdrop", role: "presentation", onClick: () => setPetDetailId(null), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: `pet-detail-modal pet-detail-${petDetailId}`, role: "dialog", "aria-modal": "true", "aria-label": `${pets[petDetailId].name}\u7684${pets[petDetailId].species}\u5BA0\u7269\u56FE\u9274`, onClick: (event) => event.stopPropagation(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pet-detail-bar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            pets[petDetailId].name,
            "\u7684\u5BA0\u7269\u56FE\u9274 \xB7 ",
            pets[petDetailId].code
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: pets[petDetailId].species })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setPetDetailId(null), "aria-label": `\u5173\u95ED${pets[petDetailId].name}\u8BE6\u60C5`, children: "\xD7" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: pets[petDetailId].detail, alt: `${pets[petDetailId].name}\u7684${pets[petDetailId].species}\u8BE6\u7EC6\u56FE\u9274\uFF0C\u5305\u542B\u5C5E\u6027\u3001\u6280\u80FD\u548C\u7B80\u4ECB` }),
      !isPetUnlocked(petDetailId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pet-preview-lock", children: [
        petDetailId === "gold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F512} \u95EA\u91D1\u5C1A\u672A\u89E3\u9501" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
            "\u7B7E\u5230 ",
            Math.min(checkInDates.length, GOLD_REQUIRED_DAYS),
            "/",
            GOLD_REQUIRED_DAYS,
            " \u5929 \xB7 \u6295\u5582 ",
            silverFeedTotal,
            "/",
            GOLD_REQUIRED_FEEDS,
            " \u6B21"
          ] })
        ] }) : petDetailId === "okking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F512} \u5C0FOK\u738B\u5C1A\u672A\u89E3\u9501" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
            "\u7B7E\u5230 ",
            Math.min(checkInDates.length, OK_KING_REQUIRED_DAYS),
            "/",
            OK_KING_REQUIRED_DAYS,
            " \u5929 \xB7 \u7D2F\u8BA1\u6295\u5582 ",
            Math.min(petCareTotal, OK_KING_REQUIRED_FEEDS),
            "/",
            OK_KING_REQUIRED_FEEDS,
            " \u6B21"
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F512} \u66B4\u66B4\u5C1A\u672A\u89E3\u9501" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
            "\u4E00\u5468\u7B7E\u5230 ",
            Math.min(checkInDates.length, TYRANT_REQUIRED_DAYS),
            "/",
            TYRANT_REQUIRED_DAYS,
            " \u5929 \xB7 \u7D2F\u8BA1\u6295\u5582 ",
            Math.min(petCareTotal, TYRANT_REQUIRED_FEEDS),
            "/",
            TYRANT_REQUIRED_FEEDS,
            " \u6B21"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: true, children: "\u8FBE\u5230\u6210\u957F\u6761\u4EF6\u540E\u53EF\u4F7F\u7528" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          className: "pet-select-button",
          disabled: activePet === petDetailId,
          onClick: () => {
            setActivePet(petDetailId);
            setPetDetailId(null);
          },
          children: activePet === petDetailId ? `\u2713 ${pets[petDetailId].name}\u6B63\u5728\u4F7F\u7528` : `\u8BBE\u4E3A\u5F53\u524D\u5BA0\u7269\uFF1A${pets[petDetailId].name}`
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pet-detail-close", onClick: () => setPetDetailId(null), children: "\u770B\u5B8C\u5566\uFF0C\u8FD4\u56DE\u5BA0\u7269\u4E2D\u5FC3" })
    ] }) })
  ] });
}
function LearningPage({ intro, speakText, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "learning-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "learning-intro", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u4ECA\u5929\u5B66\u4EC0\u4E48\uFF1F" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: intro })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => speak(speakText), children: "\u{1F50A} \u4E00\u952E\u8BED\u97F3\u8BB2\u89E3" })
    ] }),
    children
  ] });
}
function CompleteButton({ done, onClick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `complete-button ${done ? "done" : ""}`, onClick, children: done ? "\u2713 \u4ECA\u65E5\u5DF2\u6253\u5361" : "\u5B8C\u6210\u5B66\u4E60\uFF0C\u6253\u5361\u9886\u5956\u52B1" });
}
function Calendar({ completedToday, checkInDates }) {
  const now = /* @__PURE__ */ new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const checked = new Set(checkInDates);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "calendar-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "calendar-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
          now.getFullYear(),
          " \u5E74"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
          now.getMonth() + 1,
          " \u6708\u6210\u957F\u65E5\u5386"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
        "\u{1F525} \u7D2F\u8BA1\u7B7E\u5230 ",
        checkInDates.length,
        " \u5929"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "week", children: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, d)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dates", children: [
      Array.from({ length: start }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}, `e${i}`)),
      Array.from({ length: days }, (_, i) => i + 1).map((d) => {
        const key = dateKey(new Date(now.getFullYear(), now.getMonth(), d));
        const isChecked = checked.has(key) || d === now.getDate() && completedToday;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `${d === now.getDate() ? "today " : ""}${isChecked ? "checked" : ""}`.trim(), children: [
          d,
          isChecked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\u2713" }) : null
        ] }, d);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "calendar-rule", children: "\u6BCF\u5929\u5B8C\u6210\u81F3\u5C11 3 \u9879\u4EFB\u52A1\uFF0C\u5373\u53EF\u70B9\u4EAE\u5F53\u5929\u7B7E\u5230\u3002" })
  ] });
}
export {
  DailyHub as default
};
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
