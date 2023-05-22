var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n2) {
  if (n2.__esModule)
    return n2;
  var f = n2.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        var args = [null];
        args.push.apply(args, arguments);
        var Ctor = Function.bind.apply(f, args);
        return new Ctor();
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k2) {
    var d = Object.getOwnPropertyDescriptor(n2, k2);
    Object.defineProperty(a, k2, d.get ? d : {
      enumerable: true,
      get: function() {
        return n2[k2];
      }
    });
  });
  return a;
}
var reactExports = {};
var react = {
  get exports() {
    return reactExports;
  },
  set exports(v2) {
    reactExports = v2;
  }
};
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r$1 = Symbol.for("react.profiler"), t$1 = Symbol.for("react.provider"), u$1 = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a)
    return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e2) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e2 || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a)
    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e2) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e2 || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e2) {
  var d, c = {}, k2 = null, h2 = null;
  if (null != b)
    for (d in void 0 !== b.ref && (h2 = b.ref), void 0 !== b.key && (k2 = "" + b.key), b)
      J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g)
    c.children = e2;
  else if (1 < g) {
    for (var f = Array(g), m2 = 0; m2 < g; m2++)
      f[m2] = arguments[m2 + 2];
    c.children = f;
  }
  if (a && a.defaultProps)
    for (d in g = a.defaultProps, g)
      void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h2, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e2, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2)
    a = null;
  var h2 = false;
  if (null === a)
    h2 = true;
  else
    switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l$1:
          case n$1:
            h2 = true;
        }
    }
  if (h2)
    return h2 = a, c = c(h2), a = "" === d ? "." + Q$1(h2, 0) : d, I$1(c) ? (e2 = "", null != a && (e2 = a.replace(P$1, "$&/") + "/"), R$1(c, b, e2, "", function(a2) {
      return a2;
    })) : null != c && (O$1(c) && (c = N$1(c, e2 + (!c.key || h2 && h2.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h2 = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a))
    for (var g = 0; g < a.length; g++) {
      k2 = a[g];
      var f = d + Q$1(k2, g);
      h2 += R$1(k2, b, e2, f, c);
    }
  else if (f = A$1(a), "function" === typeof f)
    for (a = f.call(a), g = 0; !(k2 = a.next()).done; )
      k2 = k2.value, f = d + Q$1(k2, g++), h2 += R$1(k2, b, e2, f, c);
  else if ("object" === k2)
    throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h2;
}
function S$1(a, b, e2) {
  if (null == a)
    return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e2, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status)
        a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status)
        a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status)
    return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
react_production_min.Children = { map: S$1, forEach: function(a, b, e2) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e2);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a))
    throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r$1;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.cloneElement = function(a, b, e2) {
  if (null === a || void 0 === a)
    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h2 = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h2 = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps)
      var g = a.type.defaultProps;
    for (f in b)
      J.call(b, f) && !L$1.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
  }
  var f = arguments.length - 2;
  if (1 === f)
    d.children = e2;
  else if (1 < f) {
    g = Array(f);
    for (var m2 = 0; m2 < f; m2++)
      g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h2 };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u$1, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t$1, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = function() {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e2) {
  return U$1.current.useImperativeHandle(a, b, e2);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e2) {
  return U$1.current.useReducer(a, b, e2);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e2) {
  return U$1.current.useSyncExternalStore(a, b, e2);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.2.0";
(function(module) {
  {
    module.exports = react_production_min;
  }
})(react);
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
var reactDomExports = {};
var reactDom = {
  get exports() {
    return reactDomExports;
  },
  set exports(v2) {
    reactDomExports = v2;
  }
};
var reactDom_production_min = {};
var schedulerExports = {};
var scheduler = {
  get exports() {
    return schedulerExports;
  },
  set exports(v2) {
    schedulerExports = v2;
  }
};
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f(a, b) {
    var c = a.length;
    a.push(b);
    a:
      for (; 0 < c; ) {
        var d = c - 1 >>> 1, e2 = a[d];
        if (0 < g(e2, b))
          a[d] = b, a[c] = e2, c = d;
        else
          break a;
      }
  }
  function h2(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length)
      return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a:
        for (var d = 0, e2 = a.length, w2 = e2 >>> 1; d < w2; ) {
          var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
          if (0 > g(C2, c))
            n2 < e2 && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
          else if (n2 < e2 && 0 > g(x2, c))
            a[d] = x2, a[n2] = c, d = n2;
          else
            break a;
        }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h2(t2); null !== b; ) {
      if (null === b.callback)
        k2(t2);
      else if (b.startTime <= a)
        k2(t2), b.sortIndex = b.expirationTime, f(r2, b);
      else
        break;
      b = h2(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2)
      if (null !== h2(r2))
        A2 = true, I2(J2);
      else {
        var b = h2(t2);
        null !== b && K2(H2, b.startTime - a);
      }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e2 = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
          G2(b);
        } else
          k2(r2);
        v2 = h2(r2);
      }
      if (null !== v2)
        var w2 = true;
      else {
        var m2 = h2(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else
      N2 = false;
  }
  var S2;
  if ("function" === typeof F2)
    S2 = function() {
      F2(R2);
    };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else
    S2 = function() {
      D2(R2, 0);
    };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h2(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e2 = -1;
        break;
      case 2:
        e2 = 250;
        break;
      case 5:
        e2 = 1073741823;
        break;
      case 4:
        e2 = 1e4;
        break;
      default:
        e2 = 5e3;
    }
    e2 = c + e2;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e2, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f(t2, a), null === h2(r2) && a === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e2, f(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
(function(module) {
  {
    module.exports = scheduler_production_min;
  }
})(scheduler);
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p$1(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
    b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++)
    da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a))
    return true;
  if (ja.call(la, a))
    return false;
  if (ka.test(a))
    return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type)
    return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d)
        return false;
      if (null !== c)
        return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d))
    return true;
  if (d)
    return false;
  if (null !== c)
    switch (c.type) {
      case 3:
        return !b;
      case 4:
        return false === b;
      case 5:
        return isNaN(b);
      case 6:
        return isNaN(b) || 1 > b;
    }
  return false;
}
function v(a, b, c, d, e2, f, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e2;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e2 = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e2 ? 0 !== e2.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1])
    qa(b, c, e2, d) && (c = null), d || null === e2 ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e2.mustUseProperty ? a[e2.propertyName] = null === c ? 3 === e2.type ? false : "" : c : (b = e2.attributeName, d = e2.attributeNamespace, null === c ? a.removeAttribute(b) : (e2 = e2.type, c = 3 === e2 || 4 === e2 && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a)
    return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La)
    try {
      throw Error();
    } catch (c) {
      var b = c.stack.trim().match(/\n( *(at )?)/);
      La = b && b[1] || "";
    }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na)
    return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b)
      if (b = function() {
        throw Error();
      }, Object.defineProperty(b.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b, []);
        } catch (l2) {
          var d = l2;
        }
        Reflect.construct(a, [], b);
      } else {
        try {
          b.call();
        } catch (l2) {
          d = l2;
        }
        a.call(b.prototype);
      }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e2 = l2.stack.split("\n"), f = d.stack.split("\n"), g = e2.length - 1, h2 = f.length - 1; 1 <= g && 0 <= h2 && e2[g] !== f[h2]; )
        h2--;
      for (; 1 <= g && 0 <= h2; g--, h2--)
        if (e2[g] !== f[h2]) {
          if (1 !== g || 1 !== h2) {
            do
              if (g--, h2--, 0 > h2 || e2[g] !== f[h2]) {
                var k2 = "\n" + e2[g].replace(" at new ", " at ");
                a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
                return k2;
              }
            while (1 <= g && 0 <= h2);
          }
          break;
        }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a)
    return null;
  if ("function" === typeof a)
    return a.displayName || a.name || null;
  if ("string" === typeof a)
    return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a)
    switch (a.$$typeof) {
      case Ca:
        return (a.displayName || "Context") + ".Consumer";
      case Ba:
        return (a._context.displayName || "Context") + ".Provider";
      case Da:
        var b = a.render;
        a = a.displayName;
        a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Ga:
        return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
      case Ha:
        b = a._payload;
        a = a._init;
        try {
          return Qa(a(b));
        } catch (c) {
        }
    }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b)
        return b.displayName || b.name || null;
      if ("string" === typeof b)
        return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e2 = c.get, f = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e2.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a)
    return false;
  var b = a._valueTracker;
  if (!b)
    return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a)
    return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c)
    if ("number" === d) {
      if (0 === c && "" === a.value || a.value != c)
        a.value = "" + c;
    } else
      a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value))
      return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a)
    null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e2 = 0; e2 < c.length; e2++)
      b["$" + c[e2]] = true;
    for (c = 0; c < a.length; c++)
      e2 = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e2 && (a[c].selected = e2), e2 && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e2 = 0; e2 < a.length; e2++) {
      if (a[e2].value === c) {
        a[e2].selected = true;
        d && (a[e2].defaultSelected = true);
        return;
      }
      null !== b || a[e2].disabled || (b = a[e2]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML)
    throw Error(p$1(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b)
        throw Error(p$1(92));
      if (eb(c)) {
        if (1 < c.length)
          throw Error(p$1(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e2) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e2);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a)
    a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; )
      a.removeChild(a.firstChild);
    for (; b.firstChild; )
      a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b)
    if (b.hasOwnProperty(c)) {
      var d = 0 === c.indexOf("--"), e2 = rb(c, b[c], d);
      "float" === c && (c = "cssFloat");
      d ? a.setProperty(c, e2) : a[c] = e2;
    }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML))
      throw Error(p$1(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children)
        throw Error(p$1(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML))
        throw Error(p$1(61));
    }
    if (null != b.style && "object" !== typeof b.style)
      throw Error(p$1(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-"))
    return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb)
      throw Error(p$1(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b)
      for (a = 0; a < b.length; a++)
        Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib)
    return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab)
      Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c)
    return null;
  var d = Db(c);
  if (null === d)
    return null;
  c = d[b];
  a:
    switch (b) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
        a = !d;
        break a;
      default:
        a = false;
    }
  if (a)
    return null;
  if (c && "function" !== typeof c)
    throw Error(p$1(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia)
  try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a) {
    Lb = false;
  }
function Nb(a, b, c, d, e2, f, g, h2, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e2, f, g, h2, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e2, f, g, h2, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else
      throw Error(p$1(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate)
    for (; b.return; )
      b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b)
      return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a)
    throw Error(p$1(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b)
      throw Error(p$1(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e2 = c.return;
    if (null === e2)
      break;
    var f = e2.alternate;
    if (null === f) {
      d = e2.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e2.child === f.child) {
      for (f = e2.child; f; ) {
        if (f === c)
          return Xb(e2), a;
        if (f === d)
          return Xb(e2), b;
        f = f.sibling;
      }
      throw Error(p$1(188));
    }
    if (c.return !== d.return)
      c = e2, d = f;
    else {
      for (var g = false, h2 = e2.child; h2; ) {
        if (h2 === c) {
          g = true;
          c = e2;
          d = f;
          break;
        }
        if (h2 === d) {
          g = true;
          d = e2;
          c = f;
          break;
        }
        h2 = h2.sibling;
      }
      if (!g) {
        for (h2 = f.child; h2; ) {
          if (h2 === c) {
            g = true;
            c = f;
            d = e2;
            break;
          }
          if (h2 === d) {
            g = true;
            d = f;
            c = e2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g)
          throw Error(p$1(189));
      }
    }
    if (c.alternate !== d)
      throw Error(p$1(190));
  }
  if (3 !== c.tag)
    throw Error(p$1(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag)
    return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b)
      return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot)
    try {
      lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
    } catch (b) {
    }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c)
    return 0;
  var d = 0, e2 = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h2 = g & ~e2;
    0 !== h2 ? d = tc(h2) : (f &= g, 0 !== f && (d = tc(f)));
  } else
    g = c & ~e2, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
  if (0 === d)
    return 0;
  if (0 !== b && b !== d && 0 === (b & e2) && (e2 = d & -d, f = b & -b, e2 >= f || 16 === e2 && 0 !== (f & 4194240)))
    return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b)
    for (a = a.entanglements, b &= d; 0 < b; )
      c = 31 - oc(b), e2 = 1 << c, d |= a[c], b &= ~e2;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e2 = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
    var g = 31 - oc(f), h2 = 1 << g, k2 = e2[g];
    if (-1 === k2) {
      if (0 === (h2 & c) || 0 !== (h2 & d))
        e2[g] = vc(h2, b);
    } else
      k2 <= b && (a.expiredLanes |= h2);
    f &= ~h2;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++)
    b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e2 = 31 - oc(c), f = 1 << e2;
    b[e2] = 0;
    d[e2] = -1;
    a[e2] = -1;
    c &= ~f;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e2 = 1 << d;
    e2 & b | a[d] & b && (a[d] |= b);
    c &= ~e2;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e2, f) {
  if (null === a || a.nativeEvent !== f)
    return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e2] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e2 && -1 === b.indexOf(e2) && b.push(e2);
  return a;
}
function Uc(a, b, c, d, e2) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e2), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e2), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e2), true;
    case "pointerover":
      var f = e2.pointerId;
      Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e2));
      return true;
    case "gotpointercapture":
      return f = e2.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e2)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn)
    return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else
      return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++)
    d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); )
    Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e2 = C, f = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e2, cd.transition = f;
  }
}
function gd(a, b, c, d) {
  var e2 = C, f = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e2, cd.transition = f;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e2 = Yc(a, b, c, d);
    if (null === e2)
      hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e2, a, b, c, d))
      d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e2; ) {
        var f = Cb(e2);
        null !== f && Ec(f);
        f = Yc(a, b, c, d);
        null === f && hd(a, b, d, id, c);
        if (f === e2)
          break;
        e2 = f;
      }
      null !== e2 && d.stopPropagation();
    } else
      hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a)
    if (b = Vb(a), null === b)
      a = null;
    else if (c = b.tag, 13 === c) {
      a = Wb(b);
      if (null !== a)
        return a;
      a = null;
    } else if (3 === c) {
      if (b.stateNode.current.memoizedState.isDehydrated)
        return 3 === b.tag ? b.stateNode.containerInfo : null;
      a = null;
    } else
      b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md)
    return md;
  var a, b = ld, c = b.length, d, e2 = "value" in kd ? kd.value : kd.textContent, f = e2.length;
  for (a = 0; a < c && b[a] === e2[a]; a++)
    ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e2[f - d]; d++)
    ;
  return md = e2.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e2, f, g) {
    this._reactName = b2;
    this._targetInst = e2;
    this.type = d;
    this.nativeEvent = f;
    this.target = g;
    this.currentTarget = null;
    for (var c in a)
      a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
    this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a)
    return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b)
      return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae$1 = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae$1 || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which)
        return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie)
    return "compositionend" === a || !ae$1 && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length)
          return b.char;
        if (b.which)
          return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b))
    return a;
}
function ve(a, b) {
  if ("change" === a)
    return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else
    xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a)
    return te(qe);
}
function Ee(a, b) {
  if ("click" === a)
    return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a)
    return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b))
    return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b)
    return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length)
    return false;
  for (d = 0; d < c.length; d++) {
    var e2 = c[d];
    if (!ja.call(b, e2) || !He(a[e2], b[e2]))
      return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; )
    a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b)
        return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c)
      a = b.contentWindow;
    else
      break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c)
        c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e2 = c.textContent.length, f = Math.min(d.start, e2);
        d = void 0 === d.end ? f : Math.min(d.end, e2);
        !a.extend && f > d && (e2 = d, d = f, f = e2);
        e2 = Ke(c, f);
        var g = Ke(
          c,
          d
        );
        e2 && g && (1 !== a.rangeCount || a.anchorNode !== e2.node || a.anchorOffset !== e2.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e2.node, e2.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; )
      1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++)
      a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a])
    return Xe[a];
  if (!We[a])
    return a;
  var b = We[a], c;
  for (c in b)
    if (b.hasOwnProperty(c) && c in Ye)
      return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e2 = d.event;
    d = d.listeners;
    a: {
      var f = void 0;
      if (b)
        for (var g = d.length - 1; 0 <= g; g--) {
          var h2 = d[g], k2 = h2.instance, l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f && e2.isPropagationStopped())
            break a;
          nf(e2, h2, l2);
          f = k2;
        }
      else
        for (g = 0; g < d.length; g++) {
          h2 = d[g];
          k2 = h2.instance;
          l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f && e2.isPropagationStopped())
            break a;
          nf(e2, h2, l2);
          f = k2;
        }
    }
  }
  if (Qb)
    throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e2 = ed;
      break;
    case 4:
      e2 = gd;
      break;
    default:
      e2 = fd;
  }
  c = e2.bind(null, b, c, a);
  e2 = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e2 = true);
  d ? void 0 !== e2 ? a.addEventListener(b, c, { capture: true, passive: e2 }) : a.addEventListener(b, c, true) : void 0 !== e2 ? a.addEventListener(b, c, { passive: e2 }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e2) {
  var f = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d)
    a:
      for (; ; ) {
        if (null === d)
          return;
        var g = d.tag;
        if (3 === g || 4 === g) {
          var h2 = d.stateNode.containerInfo;
          if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2)
            break;
          if (4 === g)
            for (g = d.return; null !== g; ) {
              var k2 = g.tag;
              if (3 === k2 || 4 === k2) {
                if (k2 = g.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2)
                  return;
              }
              g = g.return;
            }
          for (; null !== h2; ) {
            g = Wc(h2);
            if (null === g)
              return;
            k2 = g.tag;
            if (5 === k2 || 6 === k2) {
              d = f = g;
              continue a;
            }
            h2 = h2.parentNode;
          }
        }
        d = d.return;
      }
  Jb(function() {
    var d2 = f, e3 = xb(c), g2 = [];
    a: {
      var h3 = df.get(a);
      if (void 0 !== h3) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c))
              break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button)
              break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2)
            break;
          w2 = w2.return;
        }
        0 < t2.length && (h3 = new k3(h3, n2, null, c, e3), g2.push({ event: h3, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h3 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h3 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf]))
          break a;
        if (k3 || h3) {
          h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag))
              n2 = null;
          } else
            k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a)
              t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h3 : ue(k3);
            u2 = null == n2 ? h3 : ue(n2);
            h3 = new t2(F2, w2 + "leave", k3, c, e3);
            h3.target = J2;
            h3.relatedTarget = u2;
            F2 = null;
            Wc(e3) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2)
              b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2))
                  w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2))
                  u2++;
                for (; 0 < w2 - u2; )
                  t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; )
                  x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate)
                    break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
            else
              t2 = null;
            null !== k3 && wf(g2, h3, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h3 = d2 ? ue(d2) : window;
        k3 = h3.nodeName && h3.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h3.type)
          var na = ve;
        else if (me(h3))
          if (we)
            na = Fe;
          else {
            na = De;
            var xa = Ce;
          }
        else
          (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e3);
          break a;
        }
        xa && xa(a, h3, d2);
        "focusout" === a && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable)
            Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e3);
          break;
        case "selectionchange":
          if (Pe)
            break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e3);
      }
      var $a;
      if (ae$1)
        b: {
          switch (a) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
      else
        ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e3), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c))
        d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c, e3), g2.push({ event: e3, listeners: d2 }), e3.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e2 = a, f = e2.stateNode;
    5 === e2.tag && null !== f && (e2 = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e2)), f = Kb(a, b), null != f && d.push(tf(a, f, e2)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a)
    return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e2) {
  for (var f = b._reactName, g = []; null !== c && c !== d; ) {
    var h2 = c, k2 = h2.alternate, l2 = h2.stateNode;
    if (null !== k2 && k2 === d)
      break;
    5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c, f), null != k2 && g.unshift(tf(c, k2, h2))) : e2 || (k2 = Kb(c, f), null != k2 && g.push(tf(c, k2, h2))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c)
    throw Error(p$1(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e2 = c.nextSibling;
    a.removeChild(c);
    if (e2 && 8 === e2.nodeType)
      if (c = e2.data, "/$" === c) {
        if (0 === d) {
          a.removeChild(e2);
          bd(b);
          return;
        }
        d--;
      } else
        "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e2;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b)
      break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b)
        break;
      if ("/$" === b)
        return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b)
          return a;
        b--;
      } else
        "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b)
    return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child)
        for (a = Mf(a); null !== a; ) {
          if (c = a[Of])
            return c;
          a = Mf(a);
        }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag)
    return a.stateNode;
  throw Error(p$1(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c)
    return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b)
    return d.__reactInternalMemoizedMaskedChildContext;
  var e2 = {}, f;
  for (f in c)
    e2[f] = b[f];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e2);
  return e2;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf)
    throw Error(p$1(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext)
    return c;
  d = d.getChildContext();
  for (var e2 in d)
    if (!(e2 in b))
      throw Error(p$1(108, Ra(a) || "Unknown", e2));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d)
    throw Error(p$1(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e2) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e2;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e2 = 32 - oc(d) - 1;
  d &= ~(1 << e2);
  c += 1;
  var f = 32 - oc(b) + e2;
  if (30 < f) {
    var g = e2 - e2 % 5;
    f = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e2 -= g;
    rg = 1 << 32 - oc(b) + e2 | c << e2 | d;
    sg = f + a;
  } else
    rg = 1 << f | c << e2 | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; )
    mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; )
    qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a))
          throw Error(p$1(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a))
        throw Error(p$1(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; )
    a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg)
    return false;
  if (!I)
    return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a))
      throw Hg(), Error(p$1(418));
    for (; b; )
      Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a)
      throw Error(p$1(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else
            "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else
    yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; )
    a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a)
      void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
var Mg = Uf(null), Ng = null, Og = null, Pg = null;
function Qg() {
  Pg = Og = Ng = null;
}
function Rg(a) {
  var b = Mg.current;
  E(Mg);
  a._currentValue = b;
}
function Sg(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c)
      break;
    a = a.return;
  }
}
function Tg(a, b) {
  Ng = a;
  Pg = Og = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (Ug = true), a.firstContext = null);
}
function Vg(a) {
  var b = a._currentValue;
  if (Pg !== a)
    if (a = { context: a, memoizedValue: b, next: null }, null === Og) {
      if (null === Ng)
        throw Error(p$1(308));
      Og = a;
      Ng.dependencies = { lanes: 0, firstContext: a };
    } else
      Og = Og.next = a;
  return b;
}
var Wg = null;
function Xg(a) {
  null === Wg ? Wg = [a] : Wg.push(a);
}
function Yg(a, b, c, d) {
  var e2 = b.interleaved;
  null === e2 ? (c.next = c, Xg(b)) : (c.next = e2.next, e2.next = c);
  b.interleaved = c;
  return Zg(a, d);
}
function Zg(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; )
    a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var $g = false;
function ah(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function bh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function ch(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function dh(a, b, c) {
  var d = a.updateQueue;
  if (null === d)
    return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e2 = d.pending;
    null === e2 ? b.next = b : (b.next = e2.next, e2.next = b);
    d.pending = b;
    return Zg(a, c);
  }
  e2 = d.interleaved;
  null === e2 ? (b.next = b, Xg(d)) : (b.next = e2.next, e2.next = b);
  d.interleaved = b;
  return Zg(a, c);
}
function eh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function fh(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e2 = null, f = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f ? e2 = f = g : f = f.next = g;
        c = c.next;
      } while (null !== c);
      null === f ? e2 = f = b : f = f.next = b;
    } else
      e2 = f = b;
    c = { baseState: d.baseState, firstBaseUpdate: e2, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function gh(a, b, c, d) {
  var e2 = a.updateQueue;
  $g = false;
  var f = e2.firstBaseUpdate, g = e2.lastBaseUpdate, h2 = e2.shared.pending;
  if (null !== h2) {
    e2.shared.pending = null;
    var k2 = h2, l2 = k2.next;
    k2.next = null;
    null === g ? f = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f) {
    var q2 = e2.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h2 = f;
    do {
      var r2 = h2.lane, y2 = h2.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h2.tag,
          payload: h2.payload,
          callback: h2.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h2;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2)
                break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              $g = true;
          }
        }
        null !== h2.callback && 0 !== h2.lane && (a.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
      } else
        y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h2 = h2.next;
      if (null === h2)
        if (h2 = e2.shared.pending, null === h2)
          break;
        else
          r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e2.baseState = k2;
    e2.firstBaseUpdate = l2;
    e2.lastBaseUpdate = m2;
    b = e2.shared.interleaved;
    if (null !== b) {
      e2 = b;
      do
        g |= e2.lane, e2 = e2.next;
      while (e2 !== b);
    } else
      null === f && (e2.shared.lanes = 0);
    hh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function ih(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a)
    for (b = 0; b < a.length; b++) {
      var d = a[b], e2 = d.callback;
      if (null !== e2) {
        d.callback = null;
        d = c;
        if ("function" !== typeof e2)
          throw Error(p$1(191, e2));
        e2.call(d);
      }
    }
}
var jh = new aa.Component().refs;
function kh(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var nh = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = L(), e2 = lh(a), f = ch(d, e2);
  f.payload = b;
  void 0 !== c && null !== c && (f.callback = c);
  b = dh(a, f, e2);
  null !== b && (mh(b, a, e2, d), eh(b, a, e2));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = L(), e2 = lh(a), f = ch(d, e2);
  f.tag = 1;
  f.payload = b;
  void 0 !== c && null !== c && (f.callback = c);
  b = dh(a, f, e2);
  null !== b && (mh(b, a, e2, d), eh(b, a, e2));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = L(), d = lh(a), e2 = ch(c, d);
  e2.tag = 2;
  void 0 !== b && null !== b && (e2.callback = b);
  b = dh(a, e2, d);
  null !== b && (mh(b, a, d, c), eh(b, a, d));
} };
function oh(a, b, c, d, e2, f, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e2, f) : true;
}
function ph(a, b, c) {
  var d = false, e2 = Vf;
  var f = b.contextType;
  "object" === typeof f && null !== f ? f = Vg(f) : (e2 = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e2) : Vf);
  b = new b(c, f);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = nh;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e2, a.__reactInternalMemoizedMaskedChildContext = f);
  return b;
}
function qh(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && nh.enqueueReplaceState(b, b.state, null);
}
function rh(a, b, c, d) {
  var e2 = a.stateNode;
  e2.props = c;
  e2.state = a.memoizedState;
  e2.refs = jh;
  ah(a);
  var f = b.contextType;
  "object" === typeof f && null !== f ? e2.context = Vg(f) : (f = Zf(b) ? Xf : H.current, e2.context = Yf(a, f));
  e2.state = a.memoizedState;
  f = b.getDerivedStateFromProps;
  "function" === typeof f && (kh(a, b, f, c), e2.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b !== e2.state && nh.enqueueReplaceState(e2, e2.state, null), gh(a, c, e2, d), e2.state = a.memoizedState);
  "function" === typeof e2.componentDidMount && (a.flags |= 4194308);
}
function sh(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag)
          throw Error(p$1(309));
        var d = c.stateNode;
      }
      if (!d)
        throw Error(p$1(147, a));
      var e2 = d, f = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f)
        return b.ref;
      b = function(a2) {
        var b2 = e2.refs;
        b2 === jh && (b2 = e2.refs = {});
        null === a2 ? delete b2[f] : b2[f] = a2;
      };
      b._stringRef = f;
      return b;
    }
    if ("string" !== typeof a)
      throw Error(p$1(284));
    if (!c._owner)
      throw Error(p$1(290, a));
  }
  return a;
}
function th(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p$1(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function uh(a) {
  var b = a._init;
  return b(a._payload);
}
function vh(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a)
      return null;
    for (; null !== d2; )
      b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; )
      null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e2(a2, b2) {
    a2 = wh(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f(b2, c2, d2) {
    b2.index = d2;
    if (!a)
      return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2)
      return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h2(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag)
      return b2 = xh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e2(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f2 = c2.type;
    if (f2 === ya)
      return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && uh(f2) === b2.type))
      return d2 = e2(b2, c2.props), d2.ref = sh(a2, b2, c2), d2.return = a2, d2;
    d2 = yh(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = sh(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation)
      return b2 = zh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e2(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f2) {
    if (null === b2 || 7 !== b2.tag)
      return b2 = Ah(c2, a2.mode, d2, f2), b2.return = a2, b2;
    b2 = e2(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2)
      return b2 = xh("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = yh(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = sh(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = zh(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2))
        return b2 = Ah(b2, a2.mode, c2, null), b2.return = a2, b2;
      th(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e3 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2)
      return null !== e3 ? null : h2(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e3 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e3 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e3 = c2._init, r2(
            a2,
            b2,
            e3(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2))
        return null !== e3 ? null : m2(a2, b2, c2, d2, null);
      th(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e3) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2)
      return a2 = a2.get(c2) || null, h2(b2, a2, "" + d2, e3);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e3);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e3);
        case Ha:
          var f2 = d2._init;
          return y2(a2, b2, c2, f2(d2._payload), e3);
      }
      if (eb(d2) || Ka(d2))
        return a2 = a2.get(c2) || null, m2(b2, a2, d2, e3, null);
      th(b2, d2);
    }
    return null;
  }
  function n2(e3, g2, h3, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e3, u2, h3[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e3, u2);
      g2 = f(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h3.length)
      return c(e3, u2), I && tg(e3, w2), l3;
    if (null === u2) {
      for (; w2 < h3.length; w2++)
        u2 = q2(e3, h3[w2], k3), null !== u2 && (g2 = f(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e3, w2);
      return l3;
    }
    for (u2 = d(e3, u2); w2 < h3.length; w2++)
      x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e3, a2);
    });
    I && tg(e3, w2);
    return l3;
  }
  function t2(e3, g2, h3, k3) {
    var l3 = Ka(h3);
    if ("function" !== typeof l3)
      throw Error(p$1(150));
    h3 = l3.call(h3);
    if (null == h3)
      throw Error(p$1(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e3, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e3, m3);
      g2 = f(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done)
      return c(
        e3,
        m3
      ), I && tg(e3, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h3.next())
        n3 = q2(e3, n3.value, k3), null !== n3 && (g2 = f(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e3, w2);
      return l3;
    }
    for (m3 = d(e3, m3); !n3.done; w2++, n3 = h3.next())
      n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e3, a2);
    });
    I && tg(e3, w2);
    return l3;
  }
  function J2(a2, d2, f2, h3) {
    "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
    if ("object" === typeof f2 && null !== f2) {
      switch (f2.$$typeof) {
        case va:
          a: {
            for (var k3 = f2.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f2.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e2(l3, f2.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && uh(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e2(l3, f2.props);
                  d2.ref = sh(a2, l3, f2);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else
                b(a2, l3);
              l3 = l3.sibling;
            }
            f2.type === ya ? (d2 = Ah(f2.props.children, a2.mode, h3, f2.key), d2.return = a2, a2 = d2) : (h3 = yh(f2.type, f2.key, f2.props, null, a2.mode, h3), h3.ref = sh(a2, d2, f2), h3.return = a2, a2 = h3);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f2.key; null !== d2; ) {
              if (d2.key === l3)
                if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                  c(a2, d2.sibling);
                  d2 = e2(d2, f2.children || []);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                } else {
                  c(a2, d2);
                  break;
                }
              else
                b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = zh(f2, a2.mode, h3);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f2._init, J2(a2, d2, l3(f2._payload), h3);
      }
      if (eb(f2))
        return n2(a2, d2, f2, h3);
      if (Ka(f2))
        return t2(a2, d2, f2, h3);
      th(a2, f2);
    }
    return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e2(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = xh(f2, a2.mode, h3), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Bh = vh(true), Ch = vh(false), Dh = {}, Eh = Uf(Dh), Fh = Uf(Dh), Gh = Uf(Dh);
function Hh(a) {
  if (a === Dh)
    throw Error(p$1(174));
  return a;
}
function Ih(a, b) {
  G(Gh, b);
  G(Fh, a);
  G(Eh, Dh);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(Eh);
  G(Eh, b);
}
function Jh() {
  E(Eh);
  E(Fh);
  E(Gh);
}
function Kh(a) {
  Hh(Gh.current);
  var b = Hh(Eh.current);
  var c = lb(b, a.type);
  b !== c && (G(Fh, a), G(Eh, c));
}
function Lh(a) {
  Fh.current === a && (E(Eh), E(Fh));
}
var M = Uf(0);
function Mh(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data))
        return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128))
        return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a)
      break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a)
        return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Nh = [];
function Oh() {
  for (var a = 0; a < Nh.length; a++)
    Nh[a]._workInProgressVersionPrimary = null;
  Nh.length = 0;
}
var Ph = ua.ReactCurrentDispatcher, Qh = ua.ReactCurrentBatchConfig, Rh = 0, N = null, O = null, P = null, Sh = false, Th = false, Uh = 0, Vh = 0;
function Q() {
  throw Error(p$1(321));
}
function Wh(a, b) {
  if (null === b)
    return false;
  for (var c = 0; c < b.length && c < a.length; c++)
    if (!He(a[c], b[c]))
      return false;
  return true;
}
function Xh(a, b, c, d, e2, f) {
  Rh = f;
  N = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Ph.current = null === a || null === a.memoizedState ? Yh : Zh;
  a = c(d, e2);
  if (Th) {
    f = 0;
    do {
      Th = false;
      Uh = 0;
      if (25 <= f)
        throw Error(p$1(301));
      f += 1;
      P = O = null;
      b.updateQueue = null;
      Ph.current = $h;
      a = c(d, e2);
    } while (Th);
  }
  Ph.current = ai;
  b = null !== O && null !== O.next;
  Rh = 0;
  P = O = N = null;
  Sh = false;
  if (b)
    throw Error(p$1(300));
  return a;
}
function bi() {
  var a = 0 !== Uh;
  Uh = 0;
  return a;
}
function ci() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === P ? N.memoizedState = P = a : P = P.next = a;
  return P;
}
function di() {
  if (null === O) {
    var a = N.alternate;
    a = null !== a ? a.memoizedState : null;
  } else
    a = O.next;
  var b = null === P ? N.memoizedState : P.next;
  if (null !== b)
    P = b, O = a;
  else {
    if (null === a)
      throw Error(p$1(310));
    O = a;
    a = { memoizedState: O.memoizedState, baseState: O.baseState, baseQueue: O.baseQueue, queue: O.queue, next: null };
    null === P ? N.memoizedState = P = a : P = P.next = a;
  }
  return P;
}
function ei(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function fi(a) {
  var b = di(), c = b.queue;
  if (null === c)
    throw Error(p$1(311));
  c.lastRenderedReducer = a;
  var d = O, e2 = d.baseQueue, f = c.pending;
  if (null !== f) {
    if (null !== e2) {
      var g = e2.next;
      e2.next = f.next;
      f.next = g;
    }
    d.baseQueue = e2 = f;
    c.pending = null;
  }
  if (null !== e2) {
    f = e2.next;
    d = d.baseState;
    var h2 = g = null, k2 = null, l2 = f;
    do {
      var m2 = l2.lane;
      if ((Rh & m2) === m2)
        null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h2 = k2 = q2, g = d) : k2 = k2.next = q2;
        N.lanes |= m2;
        hh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f);
    null === k2 ? g = d : k2.next = h2;
    He(d, b.memoizedState) || (Ug = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e2 = a;
    do
      f = e2.lane, N.lanes |= f, hh |= f, e2 = e2.next;
    while (e2 !== a);
  } else
    null === e2 && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function gi(a) {
  var b = di(), c = b.queue;
  if (null === c)
    throw Error(p$1(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e2 = c.pending, f = b.memoizedState;
  if (null !== e2) {
    c.pending = null;
    var g = e2 = e2.next;
    do
      f = a(f, g.action), g = g.next;
    while (g !== e2);
    He(f, b.memoizedState) || (Ug = true);
    b.memoizedState = f;
    null === b.baseQueue && (b.baseState = f);
    c.lastRenderedState = f;
  }
  return [f, d];
}
function hi() {
}
function ii(a, b) {
  var c = N, d = di(), e2 = b(), f = !He(d.memoizedState, e2);
  f && (d.memoizedState = e2, Ug = true);
  d = d.queue;
  ji(ki.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f || null !== P && P.memoizedState.tag & 1) {
    c.flags |= 2048;
    li(9, mi.bind(null, c, d, e2, b), void 0, null);
    if (null === R)
      throw Error(p$1(349));
    0 !== (Rh & 30) || ni(c, b, e2);
  }
  return e2;
}
function ni(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = N.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function mi(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  oi(b) && pi(a);
}
function ki(a, b, c) {
  return c(function() {
    oi(b) && pi(a);
  });
}
function oi(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function pi(a) {
  var b = Zg(a, 1);
  null !== b && mh(b, a, 1, -1);
}
function qi(a) {
  var b = ci();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ei, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ri.bind(null, N, a);
  return [b.memoizedState, a];
}
function li(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = N.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function si() {
  return di().memoizedState;
}
function ti(a, b, c, d) {
  var e2 = ci();
  N.flags |= a;
  e2.memoizedState = li(1 | b, c, void 0, void 0 === d ? null : d);
}
function ui(a, b, c, d) {
  var e2 = di();
  d = void 0 === d ? null : d;
  var f = void 0;
  if (null !== O) {
    var g = O.memoizedState;
    f = g.destroy;
    if (null !== d && Wh(d, g.deps)) {
      e2.memoizedState = li(b, c, f, d);
      return;
    }
  }
  N.flags |= a;
  e2.memoizedState = li(1 | b, c, f, d);
}
function vi(a, b) {
  return ti(8390656, 8, a, b);
}
function ji(a, b) {
  return ui(2048, 8, a, b);
}
function wi(a, b) {
  return ui(4, 2, a, b);
}
function xi(a, b) {
  return ui(4, 4, a, b);
}
function yi(a, b) {
  if ("function" === typeof b)
    return a = a(), b(a), function() {
      b(null);
    };
  if (null !== b && void 0 !== b)
    return a = a(), b.current = a, function() {
      b.current = null;
    };
}
function zi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ui(4, 4, yi.bind(null, b, a), c);
}
function Ai() {
}
function Bi(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1]))
    return d[0];
  c.memoizedState = [a, b];
  return a;
}
function Ci(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1]))
    return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function Di(a, b, c) {
  if (0 === (Rh & 21))
    return a.baseState && (a.baseState = false, Ug = true), a.memoizedState = c;
  He(c, b) || (c = yc(), N.lanes |= c, hh |= c, a.baseState = true);
  return b;
}
function Ei(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Qh.transition;
  Qh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Qh.transition = d;
  }
}
function Fi() {
  return di().memoizedState;
}
function Gi(a, b, c) {
  var d = lh(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a))
    Ii(b, c);
  else if (c = Yg(a, b, c, d), null !== c) {
    var e2 = L();
    mh(c, a, d, e2);
    Ji(c, b, d);
  }
}
function ri(a, b, c) {
  var d = lh(a), e2 = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a))
    Ii(b, e2);
  else {
    var f = a.alternate;
    if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f))
      try {
        var g = b.lastRenderedState, h2 = f(g, c);
        e2.hasEagerState = true;
        e2.eagerState = h2;
        if (He(h2, g)) {
          var k2 = b.interleaved;
          null === k2 ? (e2.next = e2, Xg(b)) : (e2.next = k2.next, k2.next = e2);
          b.interleaved = e2;
          return;
        }
      } catch (l2) {
      } finally {
      }
    c = Yg(a, b, e2, d);
    null !== c && (e2 = L(), mh(c, a, d, e2), Ji(c, b, d));
  }
}
function Hi(a) {
  var b = a.alternate;
  return a === N || null !== b && b === N;
}
function Ii(a, b) {
  Th = Sh = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Ji(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var ai = { readContext: Vg, useCallback: Q, useContext: Q, useEffect: Q, useImperativeHandle: Q, useInsertionEffect: Q, useLayoutEffect: Q, useMemo: Q, useReducer: Q, useRef: Q, useState: Q, useDebugValue: Q, useDeferredValue: Q, useTransition: Q, useMutableSource: Q, useSyncExternalStore: Q, useId: Q, unstable_isNewReconciler: false }, Yh = { readContext: Vg, useCallback: function(a, b) {
  ci().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: Vg, useEffect: vi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ti(
    4194308,
    4,
    yi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ti(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ti(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = ci();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = ci();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = Gi.bind(null, N, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = ci();
  a = { current: a };
  return b.memoizedState = a;
}, useState: qi, useDebugValue: Ai, useDeferredValue: function(a) {
  return ci().memoizedState = a;
}, useTransition: function() {
  var a = qi(false), b = a[0];
  a = Ei.bind(null, a[1]);
  ci().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = N, e2 = ci();
  if (I) {
    if (void 0 === c)
      throw Error(p$1(407));
    c = c();
  } else {
    c = b();
    if (null === R)
      throw Error(p$1(349));
    0 !== (Rh & 30) || ni(d, b, c);
  }
  e2.memoizedState = c;
  var f = { value: c, getSnapshot: b };
  e2.queue = f;
  vi(ki.bind(
    null,
    d,
    f,
    a
  ), [a]);
  d.flags |= 2048;
  li(9, mi.bind(null, d, f, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = ci(), b = R.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Uh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else
    c = Vh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Zh = {
  readContext: Vg,
  useCallback: Bi,
  useContext: Vg,
  useEffect: ji,
  useImperativeHandle: zi,
  useInsertionEffect: wi,
  useLayoutEffect: xi,
  useMemo: Ci,
  useReducer: fi,
  useRef: si,
  useState: function() {
    return fi(ei);
  },
  useDebugValue: Ai,
  useDeferredValue: function(a) {
    var b = di();
    return Di(b, O.memoizedState, a);
  },
  useTransition: function() {
    var a = fi(ei)[0], b = di().memoizedState;
    return [a, b];
  },
  useMutableSource: hi,
  useSyncExternalStore: ii,
  useId: Fi,
  unstable_isNewReconciler: false
}, $h = { readContext: Vg, useCallback: Bi, useContext: Vg, useEffect: ji, useImperativeHandle: zi, useInsertionEffect: wi, useLayoutEffect: xi, useMemo: Ci, useReducer: gi, useRef: si, useState: function() {
  return gi(ei);
}, useDebugValue: Ai, useDeferredValue: function(a) {
  var b = di();
  return null === O ? b.memoizedState = a : Di(b, O.memoizedState, a);
}, useTransition: function() {
  var a = gi(ei)[0], b = di().memoizedState;
  return [a, b];
}, useMutableSource: hi, useSyncExternalStore: ii, useId: Fi, unstable_isNewReconciler: false };
function Ki(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e2 = c;
  } catch (f) {
    e2 = "\nError generating stack: " + f.message + "\n" + f.stack;
  }
  return { value: a, source: b, stack: e2, digest: null };
}
function Li(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Mi(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Ni = "function" === typeof WeakMap ? WeakMap : Map;
function Oi(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Pi || (Pi = true, Qi = d);
    Mi(a, b);
  };
  return c;
}
function Ri(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e2 = b.value;
    c.payload = function() {
      return d(e2);
    };
    c.callback = function() {
      Mi(a, b);
    };
  }
  var f = a.stateNode;
  null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
    Mi(a, b);
    "function" !== typeof d && (null === Si ? Si = /* @__PURE__ */ new Set([this]) : Si.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Ti(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Ni();
    var e2 = /* @__PURE__ */ new Set();
    d.set(b, e2);
  } else
    e2 = d.get(b), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d.set(b, e2));
  e2.has(c) || (e2.add(c), a = Ui.bind(null, a, b, c), b.then(a, a));
}
function Vi(a) {
  do {
    var b;
    if (b = 13 === a.tag)
      b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b)
      return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Wi(a, b, c, d, e2) {
  if (0 === (a.mode & 1))
    return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = ch(-1, 1), b.tag = 2, dh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e2;
  return a;
}
var Xi = ua.ReactCurrentOwner, Ug = false;
function Yi(a, b, c, d) {
  b.child = null === a ? Ch(b, null, c, d) : Bh(b, a.child, c, d);
}
function Zi(a, b, c, d, e2) {
  c = c.render;
  var f = b.ref;
  Tg(b, e2);
  d = Xh(a, b, c, d, f, e2);
  c = bi();
  if (null !== a && !Ug)
    return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e2, $i(a, b, e2);
  I && c && vg(b);
  b.flags |= 1;
  Yi(a, b, d, e2);
  return b.child;
}
function aj(a, b, c, d, e2) {
  if (null === a) {
    var f = c.type;
    if ("function" === typeof f && !bj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps)
      return b.tag = 15, b.type = f, cj(a, b, f, d, e2);
    a = yh(c.type, null, d, b, b.mode, e2);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f = a.child;
  if (0 === (a.lanes & e2)) {
    var g = f.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref)
      return $i(a, b, e2);
  }
  b.flags |= 1;
  a = wh(f, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function cj(a, b, c, d, e2) {
  if (null !== a) {
    var f = a.memoizedProps;
    if (Ie(f, d) && a.ref === b.ref)
      if (Ug = false, b.pendingProps = d = f, 0 !== (a.lanes & e2))
        0 !== (a.flags & 131072) && (Ug = true);
      else
        return b.lanes = a.lanes, $i(a, b, e2);
  }
  return dj(a, b, c, d, e2);
}
function ej(a, b, c) {
  var d = b.pendingProps, e2 = d.children, f = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode)
    if (0 === (b.mode & 1))
      b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(fj, gj), gj |= c;
    else {
      if (0 === (c & 1073741824))
        return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(fj, gj), gj |= a, null;
      b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d = null !== f ? f.baseLanes : c;
      G(fj, gj);
      gj |= d;
    }
  else
    null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(fj, gj), gj |= d;
  Yi(a, b, e2, c);
  return b.child;
}
function hj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c)
    b.flags |= 512, b.flags |= 2097152;
}
function dj(a, b, c, d, e2) {
  var f = Zf(c) ? Xf : H.current;
  f = Yf(b, f);
  Tg(b, e2);
  c = Xh(a, b, c, d, f, e2);
  d = bi();
  if (null !== a && !Ug)
    return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e2, $i(a, b, e2);
  I && d && vg(b);
  b.flags |= 1;
  Yi(a, b, c, e2);
  return b.child;
}
function ij(a, b, c, d, e2) {
  if (Zf(c)) {
    var f = true;
    cg(b);
  } else
    f = false;
  Tg(b, e2);
  if (null === b.stateNode)
    jj(a, b), ph(b, c, d), rh(b, c, d, e2), d = true;
  else if (null === a) {
    var g = b.stateNode, h2 = b.memoizedProps;
    g.props = h2;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = Vg(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h2 !== d || k2 !== l2) && qh(b, g, d, l2);
    $g = false;
    var r2 = b.memoizedState;
    g.state = r2;
    gh(b, d, g, e2);
    k2 = b.memoizedState;
    h2 !== d || r2 !== k2 || Wf.current || $g ? ("function" === typeof m2 && (kh(b, c, m2, d), k2 = b.memoizedState), (h2 = $g || oh(b, c, h2, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h2) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    bh(a, b);
    h2 = b.memoizedProps;
    l2 = b.type === b.elementType ? h2 : Lg(b.type, h2);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = Vg(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && qh(b, g, d, k2);
    $g = false;
    r2 = b.memoizedState;
    g.state = r2;
    gh(b, d, g, e2);
    var n2 = b.memoizedState;
    h2 !== q2 || r2 !== n2 || Wf.current || $g ? ("function" === typeof y2 && (kh(b, c, y2, d), n2 = b.memoizedState), (l2 = $g || oh(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return kj(a, b, c, d, f, e2);
}
function kj(a, b, c, d, e2, f) {
  hj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g)
    return e2 && dg(b, c, false), $i(a, b, f);
  d = b.stateNode;
  Xi.current = b;
  var h2 = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Bh(b, a.child, null, f), b.child = Bh(b, null, h2, f)) : Yi(a, b, h2, f);
  b.memoizedState = d.state;
  e2 && dg(b, c, true);
  return b.child;
}
function lj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  Ih(a, b.containerInfo);
}
function mj(a, b, c, d, e2) {
  Ig();
  Jg(e2);
  b.flags |= 256;
  Yi(a, b, c, d);
  return b.child;
}
var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
function oj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function pj(a, b, c) {
  var d = b.pendingProps, e2 = M.current, f = false, g = 0 !== (b.flags & 128), h2;
  (h2 = g) || (h2 = null !== a && null === a.memoizedState ? false : 0 !== (e2 & 2));
  if (h2)
    f = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState)
    e2 |= 1;
  G(M, e2 & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a))
      return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = qj(g, d, 0, null), a = Ah(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = oj(c), b.memoizedState = nj, a) : rj(b, g);
  }
  e2 = a.memoizedState;
  if (null !== e2 && (h2 = e2.dehydrated, null !== h2))
    return sj(a, b, g, d, h2, e2, c);
  if (f) {
    f = d.fallback;
    g = b.mode;
    e2 = a.child;
    h2 = e2.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e2 ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = wh(e2, k2), d.subtreeFlags = e2.subtreeFlags & 14680064);
    null !== h2 ? f = wh(h2, f) : (f = Ah(f, g, c, null), f.flags |= 2);
    f.return = b;
    d.return = b;
    d.sibling = f;
    b.child = d;
    d = f;
    f = b.child;
    g = a.child.memoizedState;
    g = null === g ? oj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f.memoizedState = g;
    f.childLanes = a.childLanes & ~c;
    b.memoizedState = nj;
    return d;
  }
  f = a.child;
  a = f.sibling;
  d = wh(f, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function rj(a, b) {
  b = qj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function tj(a, b, c, d) {
  null !== d && Jg(d);
  Bh(b, a.child, null, c);
  a = rj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function sj(a, b, c, d, e2, f, g) {
  if (c) {
    if (b.flags & 256)
      return b.flags &= -257, d = Li(Error(p$1(422))), tj(a, b, g, d);
    if (null !== b.memoizedState)
      return b.child = a.child, b.flags |= 128, null;
    f = d.fallback;
    e2 = b.mode;
    d = qj({ mode: "visible", children: d.children }, e2, 0, null);
    f = Ah(f, e2, g, null);
    f.flags |= 2;
    d.return = b;
    f.return = b;
    d.sibling = f;
    b.child = d;
    0 !== (b.mode & 1) && Bh(b, a.child, null, g);
    b.child.memoizedState = oj(g);
    b.memoizedState = nj;
    return f;
  }
  if (0 === (b.mode & 1))
    return tj(a, b, g, null);
  if ("$!" === e2.data) {
    d = e2.nextSibling && e2.nextSibling.dataset;
    if (d)
      var h2 = d.dgst;
    d = h2;
    f = Error(p$1(419));
    d = Li(f, d, void 0);
    return tj(a, b, g, d);
  }
  h2 = 0 !== (g & a.childLanes);
  if (Ug || h2) {
    d = R;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e2 = 2;
          break;
        case 16:
          e2 = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e2 = 32;
          break;
        case 536870912:
          e2 = 268435456;
          break;
        default:
          e2 = 0;
      }
      e2 = 0 !== (e2 & (d.suspendedLanes | g)) ? 0 : e2;
      0 !== e2 && e2 !== f.retryLane && (f.retryLane = e2, Zg(a, e2), mh(d, a, e2, -1));
    }
    uj();
    d = Li(Error(p$1(421)));
    return tj(a, b, g, d);
  }
  if ("$?" === e2.data)
    return b.flags |= 128, b.child = a.child, b = vj.bind(null, a), e2._reactRetry = b, null;
  a = f.treeContext;
  yg = Lf(e2.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = rj(b, d.children);
  b.flags |= 4096;
  return b;
}
function wj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  Sg(a.return, b, c);
}
function xj(a, b, c, d, e2) {
  var f = a.memoizedState;
  null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e2 } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e2);
}
function yj(a, b, c) {
  var d = b.pendingProps, e2 = d.revealOrder, f = d.tail;
  Yi(a, b, d.children, c);
  d = M.current;
  if (0 !== (d & 2))
    d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128))
      a:
        for (a = b.child; null !== a; ) {
          if (13 === a.tag)
            null !== a.memoizedState && wj(a, c, b);
          else if (19 === a.tag)
            wj(a, c, b);
          else if (null !== a.child) {
            a.child.return = a;
            a = a.child;
            continue;
          }
          if (a === b)
            break a;
          for (; null === a.sibling; ) {
            if (null === a.return || a.return === b)
              break a;
            a = a.return;
          }
          a.sibling.return = a.return;
          a = a.sibling;
        }
    d &= 1;
  }
  G(M, d);
  if (0 === (b.mode & 1))
    b.memoizedState = null;
  else
    switch (e2) {
      case "forwards":
        c = b.child;
        for (e2 = null; null !== c; )
          a = c.alternate, null !== a && null === Mh(a) && (e2 = c), c = c.sibling;
        c = e2;
        null === c ? (e2 = b.child, b.child = null) : (e2 = c.sibling, c.sibling = null);
        xj(b, false, e2, c, f);
        break;
      case "backwards":
        c = null;
        e2 = b.child;
        for (b.child = null; null !== e2; ) {
          a = e2.alternate;
          if (null !== a && null === Mh(a)) {
            b.child = e2;
            break;
          }
          a = e2.sibling;
          e2.sibling = c;
          c = e2;
          e2 = a;
        }
        xj(b, true, c, null, f);
        break;
      case "together":
        xj(b, false, null, null, void 0);
        break;
      default:
        b.memoizedState = null;
    }
  return b.child;
}
function jj(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function $i(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  hh |= b.lanes;
  if (0 === (c & b.childLanes))
    return null;
  if (null !== a && b.child !== a.child)
    throw Error(p$1(153));
  if (null !== b.child) {
    a = b.child;
    c = wh(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; )
      a = a.sibling, c = c.sibling = wh(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function zj(a, b, c) {
  switch (b.tag) {
    case 3:
      lj(b);
      Ig();
      break;
    case 5:
      Kh(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      Ih(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e2 = b.memoizedProps.value;
      G(Mg, d._currentValue);
      d._currentValue = e2;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated)
          return G(M, M.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes))
          return pj(a, b, c);
        G(M, M.current & 1);
        a = $i(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(M, M.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d)
          return yj(a, b, c);
        b.flags |= 128;
      }
      e2 = b.memoizedState;
      null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
      G(M, M.current);
      if (d)
        break;
      else
        return null;
    case 22:
    case 23:
      return b.lanes = 0, ej(a, b, c);
  }
  return $i(a, b, c);
}
var Aj, Bj, Cj, Dj;
Aj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag)
      a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b)
      break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b)
        return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Bj = function() {
};
Cj = function(a, b, c, d) {
  var e2 = a.memoizedProps;
  if (e2 !== d) {
    a = b.stateNode;
    Hh(Eh.current);
    var f = null;
    switch (c) {
      case "input":
        e2 = Ya(a, e2);
        d = Ya(a, d);
        f = [];
        break;
      case "select":
        e2 = A({}, e2, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f = [];
        break;
      case "textarea":
        e2 = gb(a, e2);
        d = gb(a, d);
        f = [];
        break;
      default:
        "function" !== typeof e2.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e2)
      if (!d.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2])
        if ("style" === l2) {
          var h2 = e2[l2];
          for (g in h2)
            h2.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
        } else
          "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f || (f = []) : (f = f || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h2 = null != e2 ? e2[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2))
        if ("style" === l2)
          if (h2) {
            for (g in h2)
              !h2.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
            for (g in k2)
              k2.hasOwnProperty(g) && h2[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
          } else
            c || (f || (f = []), f.push(
              l2,
              c
            )), c = k2;
        else
          "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f = f || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f = f || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f || h2 === k2 || (f = [])) : (f = f || []).push(l2, k2));
    }
    c && (f = f || []).push("style", c);
    var l2 = f;
    if (b.updateQueue = l2)
      b.flags |= 4;
  }
};
Dj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Ej(a, b) {
  if (!I)
    switch (a.tailMode) {
      case "hidden":
        b = a.tail;
        for (var c = null; null !== b; )
          null !== b.alternate && (c = b), b = b.sibling;
        null === c ? a.tail = null : c.sibling = null;
        break;
      case "collapsed":
        c = a.tail;
        for (var d = null; null !== c; )
          null !== c.alternate && (d = c), c = c.sibling;
        null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
    }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b)
    for (var e2 = a.child; null !== e2; )
      c |= e2.lanes | e2.childLanes, d |= e2.subtreeFlags & 14680064, d |= e2.flags & 14680064, e2.return = a, e2 = e2.sibling;
  else
    for (e2 = a.child; null !== e2; )
      c |= e2.lanes | e2.childLanes, d |= e2.subtreeFlags, d |= e2.flags, e2.return = a, e2 = e2.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Fj(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      Jh();
      E(Wf);
      E(H);
      Oh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child)
        Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Gj(zg), zg = null));
      Bj(a, b);
      S(b);
      return null;
    case 5:
      Lh(b);
      var e2 = Hh(Gh.current);
      c = b.type;
      if (null !== a && null != b.stateNode)
        Cj(a, b, c, d, e2), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode)
            throw Error(p$1(166));
          S(b);
          return null;
        }
        a = Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e2 = 0; e2 < lf.length; e2++)
                D(lf[e2], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f), D("invalid", d);
          }
          ub(c, f);
          e2 = null;
          for (var g in f)
            if (f.hasOwnProperty(g)) {
              var h2 = f[g];
              "children" === g ? "string" === typeof h2 ? d.textContent !== h2 && (true !== f.suppressHydrationWarning && Af(d.textContent, h2, a), e2 = ["children", h2]) : "number" === typeof h2 && d.textContent !== "" + h2 && (true !== f.suppressHydrationWarning && Af(
                d.textContent,
                h2,
                a
              ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g) && null != h2 && "onScroll" === g && D("scroll", d);
            }
          switch (c) {
            case "input":
              Va(d);
              db(d, f, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f.onClick && (d.onclick = Bf);
          }
          d = e2;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e2.nodeType ? e2 : e2.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          Aj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e2 = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e2 = d;
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++)
                  D(lf[e2], a);
                e2 = d;
                break;
              case "source":
                D("error", a);
                e2 = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e2 = d;
                break;
              case "details":
                D("toggle", a);
                e2 = d;
                break;
              case "input":
                Za(a, d);
                e2 = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e2 = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e2 = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e2 = gb(a, d);
                D("invalid", a);
                break;
              default:
                e2 = d;
            }
            ub(c, e2);
            h2 = e2;
            for (f in h2)
              if (h2.hasOwnProperty(f)) {
                var k2 = h2[f];
                "style" === f ? sb(a, k2) : "dangerouslySetInnerHTML" === f ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k2 && "onScroll" === f && D("scroll", a) : null != k2 && ta(a, f, k2, g));
              }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f = d.value;
                null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e2.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode)
        Dj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode)
          throw Error(p$1(166));
        c = Hh(Gh.current);
        Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f = d.nodeValue !== c) {
            if (a = xg, null !== a)
              switch (a.tag) {
                case 3:
                  Af(d.nodeValue, c, 0 !== (a.mode & 1));
                  break;
                case 5:
                  true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
              }
          }
          f && (b.flags |= 4);
        } else
          d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(M);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128))
          Hg(), Ig(), b.flags |= 98560, f = false;
        else if (f = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f)
              throw Error(p$1(318));
            f = b.memoizedState;
            f = null !== f ? f.dehydrated : null;
            if (!f)
              throw Error(p$1(317));
            f[Of] = b;
          } else
            Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f = false;
        } else
          null !== zg && (Gj(zg), zg = null), f = true;
        if (!f)
          return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128))
        return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (M.current & 1) ? 0 === T && (T = 3) : uj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return Jh(), Bj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return Rg(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(M);
      f = b.memoizedState;
      if (null === f)
        return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f.rendering;
      if (null === g)
        if (d)
          Ej(f, false);
        else {
          if (0 !== T || null !== a && 0 !== (a.flags & 128))
            for (a = b.child; null !== a; ) {
              g = Mh(a);
              if (null !== g) {
                b.flags |= 128;
                Ej(f, false);
                d = g.updateQueue;
                null !== d && (b.updateQueue = d, b.flags |= 4);
                b.subtreeFlags = 0;
                d = c;
                for (c = b.child; null !== c; )
                  f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                G(M, M.current & 1 | 2);
                return b.child;
              }
              a = a.sibling;
            }
          null !== f.tail && B() > Hj && (b.flags |= 128, d = true, Ej(f, false), b.lanes = 4194304);
        }
      else {
        if (!d)
          if (a = Mh(g), null !== a) {
            if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Ej(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I)
              return S(b), null;
          } else
            2 * B() - f.renderingStartTime > Hj && 1073741824 !== c && (b.flags |= 128, d = true, Ej(f, false), b.lanes = 4194304);
        f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
      }
      if (null !== f.tail)
        return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = M.current, G(M, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Ij(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (gj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p$1(156, b.tag));
}
function Jj(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return Jh(), E(Wf), E(H), Oh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Lh(b), null;
    case 13:
      E(M);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate)
          throw Error(p$1(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(M), null;
    case 4:
      return Jh(), null;
    case 10:
      return Rg(b.type._context), null;
    case 22:
    case 23:
      return Ij(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Kj = false, U = false, Lj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Mj(a, b) {
  var c = a.ref;
  if (null !== c)
    if ("function" === typeof c)
      try {
        c(null);
      } catch (d) {
        W(a, b, d);
      }
    else
      c.current = null;
}
function Nj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Oj = false;
function Pj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a)
      var c = { start: a.selectionStart, end: a.selectionEnd };
    else
      a: {
        c = (c = a.ownerDocument) && c.defaultView || window;
        var d = c.getSelection && c.getSelection();
        if (d && 0 !== d.rangeCount) {
          c = d.anchorNode;
          var e2 = d.anchorOffset, f = d.focusNode;
          d = d.focusOffset;
          try {
            c.nodeType, f.nodeType;
          } catch (F2) {
            c = null;
            break a;
          }
          var g = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
          b:
            for (; ; ) {
              for (var y2; ; ) {
                q2 !== c || 0 !== e2 && 3 !== q2.nodeType || (h2 = g + e2);
                q2 !== f || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
                3 === q2.nodeType && (g += q2.nodeValue.length);
                if (null === (y2 = q2.firstChild))
                  break;
                r2 = q2;
                q2 = y2;
              }
              for (; ; ) {
                if (q2 === a)
                  break b;
                r2 === c && ++l2 === e2 && (h2 = g);
                r2 === f && ++m2 === d && (k2 = g);
                if (null !== (y2 = q2.nextSibling))
                  break;
                q2 = r2;
                r2 = q2.parentNode;
              }
              q2 = y2;
            }
          c = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
        } else
          c = null;
      }
    c = c || { start: 0, end: 0 };
  } else
    c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; )
    if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a)
      a.return = b, V = a;
    else
      for (; null !== V; ) {
        b = V;
        try {
          var n2 = b.alternate;
          if (0 !== (b.flags & 1024))
            switch (b.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n2) {
                  var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Lg(b.type, t2), J2);
                  x2.__reactInternalSnapshotBeforeUpdate = w2;
                }
                break;
              case 3:
                var u2 = b.stateNode.containerInfo;
                1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p$1(163));
            }
        } catch (F2) {
          W(b, b.return, F2);
        }
        a = b.sibling;
        if (null !== a) {
          a.return = b.return;
          V = a;
          break;
        }
        V = b.return;
      }
  n2 = Oj;
  Oj = false;
  return n2;
}
function Qj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e2 = d = d.next;
    do {
      if ((e2.tag & a) === a) {
        var f = e2.destroy;
        e2.destroy = void 0;
        void 0 !== f && Nj(b, c, f);
      }
      e2 = e2.next;
    } while (e2 !== d);
  }
}
function Rj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Sj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Tj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Tj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Uj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Vj(a) {
  a:
    for (; ; ) {
      for (; null === a.sibling; ) {
        if (null === a.return || Uj(a.return))
          return null;
        a = a.return;
      }
      a.sibling.return = a.return;
      for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
        if (a.flags & 2)
          continue a;
        if (null === a.child || 4 === a.tag)
          continue a;
        else
          a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2))
        return a.stateNode;
    }
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d)
    a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a))
    for (Wj(a, b, c), a = a.sibling; null !== a; )
      Wj(a, b, c), a = a.sibling;
}
function Xj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d)
    a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a))
    for (Xj(a, b, c), a = a.sibling; null !== a; )
      Xj(a, b, c), a = a.sibling;
}
var X = null, Yj = false;
function Zj(a, b, c) {
  for (c = c.child; null !== c; )
    ak(a, b, c), c = c.sibling;
}
function ak(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount)
    try {
      lc.onCommitFiberUnmount(kc, c);
    } catch (h2) {
    }
  switch (c.tag) {
    case 5:
      U || Mj(c, b);
    case 6:
      var d = X, e2 = Yj;
      X = null;
      Zj(a, b, c);
      X = d;
      Yj = e2;
      null !== X && (Yj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Yj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e2 = Yj;
      X = c.stateNode.containerInfo;
      Yj = true;
      Zj(a, b, c);
      X = d;
      Yj = e2;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e2 = d = d.next;
        do {
          var f = e2, g = f.destroy;
          f = f.tag;
          void 0 !== g && (0 !== (f & 2) ? Nj(c, b, g) : 0 !== (f & 4) && Nj(c, b, g));
          e2 = e2.next;
        } while (e2 !== d);
      }
      Zj(a, b, c);
      break;
    case 1:
      if (!U && (Mj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount))
        try {
          d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
        } catch (h2) {
          W(c, b, h2);
        }
      Zj(a, b, c);
      break;
    case 21:
      Zj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Zj(a, b, c), U = d) : Zj(a, b, c);
      break;
    default:
      Zj(a, b, c);
  }
}
function bk(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Lj());
    b.forEach(function(b2) {
      var d = ck.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function dk(a, b) {
  var c = b.deletions;
  if (null !== c)
    for (var d = 0; d < c.length; d++) {
      var e2 = c[d];
      try {
        var f = a, g = b, h2 = g;
        a:
          for (; null !== h2; ) {
            switch (h2.tag) {
              case 5:
                X = h2.stateNode;
                Yj = false;
                break a;
              case 3:
                X = h2.stateNode.containerInfo;
                Yj = true;
                break a;
              case 4:
                X = h2.stateNode.containerInfo;
                Yj = true;
                break a;
            }
            h2 = h2.return;
          }
        if (null === X)
          throw Error(p$1(160));
        ak(f, g, e2);
        X = null;
        Yj = false;
        var k2 = e2.alternate;
        null !== k2 && (k2.return = null);
        e2.return = null;
      } catch (l2) {
        W(e2, b, l2);
      }
    }
  if (b.subtreeFlags & 12854)
    for (b = b.child; null !== b; )
      ek(b, a), b = b.sibling;
}
function ek(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      dk(b, a);
      fk(a);
      if (d & 4) {
        try {
          Qj(3, a, a.return), Rj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Qj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      break;
    case 5:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      if (a.flags & 32) {
        var e2 = a.stateNode;
        try {
          ob(e2, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e2 = a.stateNode, null != e2)) {
        var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h2 = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2)
          try {
            "input" === h2 && "radio" === f.type && null != f.name && ab(e2, f);
            vb(h2, g);
            var l2 = vb(h2, f);
            for (g = 0; g < k2.length; g += 2) {
              var m2 = k2[g], q2 = k2[g + 1];
              "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
            }
            switch (h2) {
              case "input":
                bb(e2, f);
                break;
              case "textarea":
                ib(e2, f);
                break;
              case "select":
                var r2 = e2._wrapperState.wasMultiple;
                e2._wrapperState.wasMultiple = !!f.multiple;
                var y2 = f.value;
                null != y2 ? fb(e2, !!f.multiple, y2, false) : r2 !== !!f.multiple && (null != f.defaultValue ? fb(
                  e2,
                  !!f.multiple,
                  f.defaultValue,
                  true
                ) : fb(e2, !!f.multiple, f.multiple ? [] : "", false));
            }
            e2[Pf] = f;
          } catch (t2) {
            W(a, a.return, t2);
          }
      }
      break;
    case 6:
      dk(b, a);
      fk(a);
      if (d & 4) {
        if (null === a.stateNode)
          throw Error(p$1(162));
        e2 = a.stateNode;
        f = a.memoizedProps;
        try {
          e2.nodeValue = f;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      dk(b, a);
      fk(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated)
        try {
          bd(b.containerInfo);
        } catch (t2) {
          W(a, a.return, t2);
        }
      break;
    case 4:
      dk(b, a);
      fk(a);
      break;
    case 13:
      dk(b, a);
      fk(a);
      e2 = a.child;
      e2.flags & 8192 && (f = null !== e2.memoizedState, e2.stateNode.isHidden = f, !f || null !== e2.alternate && null !== e2.alternate.memoizedState || (gk = B()));
      d & 4 && bk(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, dk(b, a), U = l2) : dk(b, a);
      fk(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1))
          for (V = a, m2 = a.child; null !== m2; ) {
            for (q2 = V = m2; null !== V; ) {
              r2 = V;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Qj(4, r2, r2.return);
                  break;
                case 1:
                  Mj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d = r2;
                    c = r2.return;
                    try {
                      b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W(d, c, t2);
                    }
                  }
                  break;
                case 5:
                  Mj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    hk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V = y2) : hk(q2);
            }
            m2 = m2.sibling;
          }
        a:
          for (m2 = null, q2 = a; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e2 = q2.stateNode, l2 ? (f = e2.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g));
                } catch (t2) {
                  W(a, a.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2)
                try {
                  q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                } catch (t2) {
                  W(a, a.return, t2);
                }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a)
              break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a)
                break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
      }
      break;
    case 19:
      dk(b, a);
      fk(a);
      d & 4 && bk(a);
      break;
    case 21:
      break;
    default:
      dk(
        b,
        a
      ), fk(a);
  }
}
function fk(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Uj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p$1(160));
      }
      switch (d.tag) {
        case 5:
          var e2 = d.stateNode;
          d.flags & 32 && (ob(e2, ""), d.flags &= -33);
          var f = Vj(a);
          Xj(a, f, e2);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h2 = Vj(a);
          Wj(a, h2, g);
          break;
        default:
          throw Error(p$1(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function ik(a, b, c) {
  V = a;
  jk(a);
}
function jk(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e2 = V, f = e2.child;
    if (22 === e2.tag && d) {
      var g = null !== e2.memoizedState || Kj;
      if (!g) {
        var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U;
        h2 = Kj;
        var l2 = U;
        Kj = g;
        if ((U = k2) && !l2)
          for (V = e2; null !== V; )
            g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? kk(e2) : null !== k2 ? (k2.return = g, V = k2) : kk(e2);
        for (; null !== f; )
          V = f, jk(f), f = f.sibling;
        V = e2;
        Kj = h2;
        U = l2;
      }
      lk(a);
    } else
      0 !== (e2.subtreeFlags & 8772) && null !== f ? (f.return = e2, V = f) : lk(a);
  }
}
function lk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772))
          switch (b.tag) {
            case 0:
            case 11:
            case 15:
              U || Rj(5, b);
              break;
            case 1:
              var d = b.stateNode;
              if (b.flags & 4 && !U)
                if (null === c)
                  d.componentDidMount();
                else {
                  var e2 = b.elementType === b.type ? c.memoizedProps : Lg(b.type, c.memoizedProps);
                  d.componentDidUpdate(e2, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                }
              var f = b.updateQueue;
              null !== f && ih(b, f, d);
              break;
            case 3:
              var g = b.updateQueue;
              if (null !== g) {
                c = null;
                if (null !== b.child)
                  switch (b.child.tag) {
                    case 5:
                      c = b.child.stateNode;
                      break;
                    case 1:
                      c = b.child.stateNode;
                  }
                ih(b, g, c);
              }
              break;
            case 5:
              var h2 = b.stateNode;
              if (null === c && b.flags & 4) {
                c = h2;
                var k2 = b.memoizedProps;
                switch (b.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c.focus();
                    break;
                  case "img":
                    k2.src && (c.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b.memoizedState) {
                var l2 = b.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p$1(163));
          }
        U || b.flags & 512 && Sj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function hk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Rj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e2 = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e2, k2);
            }
          }
          var f = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W(b, f, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h2 = b.sibling;
    if (null !== h2) {
      h2.return = b.return;
      V = h2;
      break;
    }
    V = b.return;
  }
}
var mk = Math.ceil, nk = ua.ReactCurrentDispatcher, ok = ua.ReactCurrentOwner, pk = ua.ReactCurrentBatchConfig, K = 0, R = null, Y = null, Z = 0, gj = 0, fj = Uf(0), T = 0, qk = null, hh = 0, rk = 0, sk = 0, tk = null, uk = null, gk = 0, Hj = Infinity, vk = null, Pi = false, Qi = null, Si = null, wk = false, xk = null, yk = 0, zk = 0, Ak = null, Bk = -1, Ck = 0;
function L() {
  return 0 !== (K & 6) ? B() : -1 !== Bk ? Bk : Bk = B();
}
function lh(a) {
  if (0 === (a.mode & 1))
    return 1;
  if (0 !== (K & 2) && 0 !== Z)
    return Z & -Z;
  if (null !== Kg.transition)
    return 0 === Ck && (Ck = yc()), Ck;
  a = C;
  if (0 !== a)
    return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function mh(a, b, c, d) {
  if (50 < zk)
    throw zk = 0, Ak = null, Error(p$1(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== R)
    a === R && (0 === (K & 2) && (rk |= c), 4 === T && Dk(a, Z)), Ek(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Hj = B() + 500, fg && jg());
}
function Ek(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === R ? Z : 0);
  if (0 === d)
    null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b)
      0 === a.tag ? ig(Fk.bind(null, a)) : hg(Fk.bind(null, a)), Jf(function() {
        0 === (K & 6) && jg();
      }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Gk(c, Hk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Hk(a, b) {
  Bk = -1;
  Ck = 0;
  if (0 !== (K & 6))
    throw Error(p$1(327));
  var c = a.callbackNode;
  if (Ik() && a.callbackNode !== c)
    return null;
  var d = uc(a, a === R ? Z : 0);
  if (0 === d)
    return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b)
    b = Jk(a, d);
  else {
    b = d;
    var e2 = K;
    K |= 2;
    var f = Kk();
    if (R !== a || Z !== b)
      vk = null, Hj = B() + 500, Lk(a, b);
    do
      try {
        Mk();
        break;
      } catch (h2) {
        Nk(a, h2);
      }
    while (1);
    Qg();
    nk.current = f;
    K = e2;
    null !== Y ? b = 0 : (R = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e2 = xc(a), 0 !== e2 && (d = e2, b = Ok(a, e2)));
    if (1 === b)
      throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B()), c;
    if (6 === b)
      Dk(a, d);
    else {
      e2 = a.current.alternate;
      if (0 === (d & 30) && !Pk(e2) && (b = Jk(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Ok(a, f))), 1 === b))
        throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B()), c;
      a.finishedWork = e2;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p$1(345));
        case 2:
          Qk(a, uk, vk);
          break;
        case 3:
          Dk(a, d);
          if ((d & 130023424) === d && (b = gk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0))
              break;
            e2 = a.suspendedLanes;
            if ((e2 & d) !== d) {
              L();
              a.pingedLanes |= a.suspendedLanes & e2;
              break;
            }
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), b);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 4:
          Dk(a, d);
          if ((d & 4194240) === d)
            break;
          b = a.eventTimes;
          for (e2 = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f = 1 << g;
            g = b[g];
            g > e2 && (e2 = g);
            d &= ~f;
          }
          d = e2;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * mk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), d);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 5:
          Qk(a, uk, vk);
          break;
        default:
          throw Error(p$1(329));
      }
    }
  }
  Ek(a, B());
  return a.callbackNode === c ? Hk.bind(null, a) : null;
}
function Ok(a, b) {
  var c = tk;
  a.current.memoizedState.isDehydrated && (Lk(a, b).flags |= 256);
  a = Jk(a, b);
  2 !== a && (b = uk, uk = c, null !== b && Gj(b));
  return a;
}
function Gj(a) {
  null === uk ? uk = a : uk.push.apply(uk, a);
}
function Pk(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c))
        for (var d = 0; d < c.length; d++) {
          var e2 = c[d], f = e2.getSnapshot;
          e2 = e2.value;
          try {
            if (!He(f(), e2))
              return false;
          } catch (g) {
            return false;
          }
        }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c)
      c.return = b, b = c;
    else {
      if (b === a)
        break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a)
          return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Dk(a, b) {
  b &= ~sk;
  b &= ~rk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Fk(a) {
  if (0 !== (K & 6))
    throw Error(p$1(327));
  Ik();
  var b = uc(a, 0);
  if (0 === (b & 1))
    return Ek(a, B()), null;
  var c = Jk(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Ok(a, d));
  }
  if (1 === c)
    throw c = qk, Lk(a, 0), Dk(a, b), Ek(a, B()), c;
  if (6 === c)
    throw Error(p$1(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Qk(a, uk, vk);
  Ek(a, B());
  return null;
}
function Rk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Hj = B() + 500, fg && jg());
  }
}
function Sk(a) {
  null !== xk && 0 === xk.tag && 0 === (K & 6) && Ik();
  var b = K;
  K |= 1;
  var c = pk.transition, d = C;
  try {
    if (pk.transition = null, C = 1, a)
      return a();
  } finally {
    C = d, pk.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Ij() {
  gj = fj.current;
  E(fj);
}
function Lk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y)
    for (c = Y.return; null !== c; ) {
      var d = c;
      wg(d);
      switch (d.tag) {
        case 1:
          d = d.type.childContextTypes;
          null !== d && void 0 !== d && $f();
          break;
        case 3:
          Jh();
          E(Wf);
          E(H);
          Oh();
          break;
        case 5:
          Lh(d);
          break;
        case 4:
          Jh();
          break;
        case 13:
          E(M);
          break;
        case 19:
          E(M);
          break;
        case 10:
          Rg(d.type._context);
          break;
        case 22:
        case 23:
          Ij();
      }
      c = c.return;
    }
  R = a;
  Y = a = wh(a.current, null);
  Z = gj = b;
  T = 0;
  qk = null;
  sk = rk = hh = 0;
  uk = tk = null;
  if (null !== Wg) {
    for (b = 0; b < Wg.length; b++)
      if (c = Wg[b], d = c.interleaved, null !== d) {
        c.interleaved = null;
        var e2 = d.next, f = c.pending;
        if (null !== f) {
          var g = f.next;
          f.next = e2;
          d.next = g;
        }
        c.pending = d;
      }
    Wg = null;
  }
  return a;
}
function Nk(a, b) {
  do {
    var c = Y;
    try {
      Qg();
      Ph.current = ai;
      if (Sh) {
        for (var d = N.memoizedState; null !== d; ) {
          var e2 = d.queue;
          null !== e2 && (e2.pending = null);
          d = d.next;
        }
        Sh = false;
      }
      Rh = 0;
      P = O = N = null;
      Th = false;
      Uh = 0;
      ok.current = null;
      if (null === c || null === c.return) {
        T = 1;
        qk = b;
        Y = null;
        break;
      }
      a: {
        var f = a, g = c.return, h2 = c, k2 = b;
        b = Z;
        h2.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h2, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Vi(g);
          if (null !== y2) {
            y2.flags &= -257;
            Wi(y2, g, h2, f, b);
            y2.mode & 1 && Ti(f, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else
              n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Ti(f, l2, b);
              uj();
              break a;
            }
            k2 = Error(p$1(426));
          }
        } else if (I && h2.mode & 1) {
          var J2 = Vi(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Wi(J2, g, h2, f, b);
            Jg(Ki(k2, h2));
            break a;
          }
        }
        f = k2 = Ki(k2, h2);
        4 !== T && (T = 2);
        null === tk ? tk = [f] : tk.push(f);
        f = g;
        do {
          switch (f.tag) {
            case 3:
              f.flags |= 65536;
              b &= -b;
              f.lanes |= b;
              var x2 = Oi(f, k2, b);
              fh(f, x2);
              break a;
            case 1:
              h2 = k2;
              var w2 = f.type, u2 = f.stateNode;
              if (0 === (f.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Si || !Si.has(u2)))) {
                f.flags |= 65536;
                b &= -b;
                f.lanes |= b;
                var F2 = Ri(f, h2, b);
                fh(f, F2);
                break a;
              }
          }
          f = f.return;
        } while (null !== f);
      }
      Tk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Kk() {
  var a = nk.current;
  nk.current = ai;
  return null === a ? ai : a;
}
function uj() {
  if (0 === T || 3 === T || 2 === T)
    T = 4;
  null === R || 0 === (hh & 268435455) && 0 === (rk & 268435455) || Dk(R, Z);
}
function Jk(a, b) {
  var c = K;
  K |= 2;
  var d = Kk();
  if (R !== a || Z !== b)
    vk = null, Lk(a, b);
  do
    try {
      Uk();
      break;
    } catch (e2) {
      Nk(a, e2);
    }
  while (1);
  Qg();
  K = c;
  nk.current = d;
  if (null !== Y)
    throw Error(p$1(261));
  R = null;
  Z = 0;
  return T;
}
function Uk() {
  for (; null !== Y; )
    Vk(Y);
}
function Mk() {
  for (; null !== Y && !cc(); )
    Vk(Y);
}
function Vk(a) {
  var b = Wk(a.alternate, a, gj);
  a.memoizedProps = a.pendingProps;
  null === b ? Tk(a) : Y = b;
  ok.current = null;
}
function Tk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Fj(c, b, gj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Jj(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a)
        a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Qk(a, b, c) {
  var d = C, e2 = pk.transition;
  try {
    pk.transition = null, C = 1, Xk(a, b, c, d);
  } finally {
    pk.transition = e2, C = d;
  }
  return null;
}
function Xk(a, b, c, d) {
  do
    Ik();
  while (null !== xk);
  if (0 !== (K & 6))
    throw Error(p$1(327));
  c = a.finishedWork;
  var e2 = a.finishedLanes;
  if (null === c)
    return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current)
    throw Error(p$1(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f = c.lanes | c.childLanes;
  Bc(a, f);
  a === R && (Y = R = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || wk || (wk = true, Gk(hc, function() {
    Ik();
    return null;
  }));
  f = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f) {
    f = pk.transition;
    pk.transition = null;
    var g = C;
    C = 1;
    var h2 = K;
    K |= 4;
    ok.current = null;
    Pj(a, c);
    ek(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    ik(c);
    dc();
    K = h2;
    C = g;
    pk.transition = f;
  } else
    a.current = c;
  wk && (wk = false, xk = a, yk = e2);
  f = a.pendingLanes;
  0 === f && (Si = null);
  mc(c.stateNode);
  Ek(a, B());
  if (null !== b)
    for (d = a.onRecoverableError, c = 0; c < b.length; c++)
      e2 = b[c], d(e2.value, { componentStack: e2.stack, digest: e2.digest });
  if (Pi)
    throw Pi = false, a = Qi, Qi = null, a;
  0 !== (yk & 1) && 0 !== a.tag && Ik();
  f = a.pendingLanes;
  0 !== (f & 1) ? a === Ak ? zk++ : (zk = 0, Ak = a) : zk = 0;
  jg();
  return null;
}
function Ik() {
  if (null !== xk) {
    var a = Dc(yk), b = pk.transition, c = C;
    try {
      pk.transition = null;
      C = 16 > a ? 16 : a;
      if (null === xk)
        var d = false;
      else {
        a = xk;
        xk = null;
        yk = 0;
        if (0 !== (K & 6))
          throw Error(p$1(331));
        var e2 = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f = V, g = f.child;
          if (0 !== (V.flags & 16)) {
            var h2 = f.deletions;
            if (null !== h2) {
              for (var k2 = 0; k2 < h2.length; k2++) {
                var l2 = h2[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(8, m2, f);
                  }
                  var q2 = m2.child;
                  if (null !== q2)
                    q2.return = m2, V = q2;
                  else
                    for (; null !== V; ) {
                      m2 = V;
                      var r2 = m2.sibling, y2 = m2.return;
                      Tj(m2);
                      if (m2 === l2) {
                        V = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V = r2;
                        break;
                      }
                      V = y2;
                    }
                }
              }
              var n2 = f.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f;
            }
          }
          if (0 !== (f.subtreeFlags & 2064) && null !== g)
            g.return = f, V = g;
          else
            b:
              for (; null !== V; ) {
                f = V;
                if (0 !== (f.flags & 2048))
                  switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, f, f.return);
                  }
                var x2 = f.sibling;
                if (null !== x2) {
                  x2.return = f.return;
                  V = x2;
                  break b;
                }
                V = f.return;
              }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2)
            u2.return = g, V = u2;
          else
            b:
              for (g = w2; null !== V; ) {
                h2 = V;
                if (0 !== (h2.flags & 2048))
                  try {
                    switch (h2.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Rj(9, h2);
                    }
                  } catch (na) {
                    W(h2, h2.return, na);
                  }
                if (h2 === g) {
                  V = null;
                  break b;
                }
                var F2 = h2.sibling;
                if (null !== F2) {
                  F2.return = h2.return;
                  V = F2;
                  break b;
                }
                V = h2.return;
              }
        }
        K = e2;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot)
          try {
            lc.onPostCommitFiberRoot(kc, a);
          } catch (na) {
          }
        d = true;
      }
      return d;
    } finally {
      C = c, pk.transition = b;
    }
  }
  return false;
}
function Yk(a, b, c) {
  b = Ki(c, b);
  b = Oi(a, b, 1);
  a = dh(a, b, 1);
  b = L();
  null !== a && (Ac(a, 1, b), Ek(a, b));
}
function W(a, b, c) {
  if (3 === a.tag)
    Yk(a, a, c);
  else
    for (; null !== b; ) {
      if (3 === b.tag) {
        Yk(b, a, c);
        break;
      } else if (1 === b.tag) {
        var d = b.stateNode;
        if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Si || !Si.has(d))) {
          a = Ki(c, a);
          a = Ri(b, a, 1);
          b = dh(b, a, 1);
          a = L();
          null !== b && (Ac(b, 1, a), Ek(b, a));
          break;
        }
      }
      b = b.return;
    }
}
function Ui(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = L();
  a.pingedLanes |= a.suspendedLanes & c;
  R === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - gk ? Lk(a, 0) : sk |= c);
  Ek(a, b);
}
function Zk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = L();
  a = Zg(a, b);
  null !== a && (Ac(a, b, c), Ek(a, c));
}
function vj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Zk(a, c);
}
function ck(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e2 = a.memoizedState;
      null !== e2 && (c = e2.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p$1(314));
  }
  null !== d && d.delete(b);
  Zk(a, c);
}
var Wk;
Wk = function(a, b, c) {
  if (null !== a)
    if (a.memoizedProps !== b.pendingProps || Wf.current)
      Ug = true;
    else {
      if (0 === (a.lanes & c) && 0 === (b.flags & 128))
        return Ug = false, zj(a, b, c);
      Ug = 0 !== (a.flags & 131072) ? true : false;
    }
  else
    Ug = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      jj(a, b);
      a = b.pendingProps;
      var e2 = Yf(b, H.current);
      Tg(b, c);
      e2 = Xh(null, b, d, a, e2, c);
      var f = bi();
      b.flags |= 1;
      "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, ah(b), e2.updater = nh, b.stateNode = e2, e2._reactInternals = b, rh(b, d, a, c), b = kj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Yi(null, b, e2, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        jj(a, b);
        a = b.pendingProps;
        e2 = d._init;
        d = e2(d._payload);
        b.type = d;
        e2 = b.tag = $k(d);
        a = Lg(d, a);
        switch (e2) {
          case 0:
            b = dj(null, b, d, a, c);
            break a;
          case 1:
            b = ij(null, b, d, a, c);
            break a;
          case 11:
            b = Zi(null, b, d, a, c);
            break a;
          case 14:
            b = aj(null, b, d, Lg(d.type, a), c);
            break a;
        }
        throw Error(p$1(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), dj(a, b, d, e2, c);
    case 1:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), ij(a, b, d, e2, c);
    case 3:
      a: {
        lj(b);
        if (null === a)
          throw Error(p$1(387));
        d = b.pendingProps;
        f = b.memoizedState;
        e2 = f.element;
        bh(a, b);
        gh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f.isDehydrated)
          if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
            e2 = Ki(Error(p$1(423)), b);
            b = mj(a, b, d, c, e2);
            break a;
          } else if (d !== e2) {
            e2 = Ki(Error(p$1(424)), b);
            b = mj(a, b, d, c, e2);
            break a;
          } else
            for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Ch(b, null, d, c), b.child = c; c; )
              c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e2) {
            b = $i(a, b, c);
            break a;
          }
          Yi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Kh(b), null === a && Eg(b), d = b.type, e2 = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e2.children, Ef(d, e2) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), hj(a, b), Yi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return pj(a, b, c);
    case 4:
      return Ih(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Bh(b, null, d, c) : Yi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), Zi(a, b, d, e2, c);
    case 7:
      return Yi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e2 = b.pendingProps;
        f = b.memoizedProps;
        g = e2.value;
        G(Mg, d._currentValue);
        d._currentValue = g;
        if (null !== f)
          if (He(f.value, g)) {
            if (f.children === e2.children && !Wf.current) {
              b = $i(a, b, c);
              break a;
            }
          } else
            for (f = b.child, null !== f && (f.return = b); null !== f; ) {
              var h2 = f.dependencies;
              if (null !== h2) {
                g = f.child;
                for (var k2 = h2.firstContext; null !== k2; ) {
                  if (k2.context === d) {
                    if (1 === f.tag) {
                      k2 = ch(-1, c & -c);
                      k2.tag = 2;
                      var l2 = f.updateQueue;
                      if (null !== l2) {
                        l2 = l2.shared;
                        var m2 = l2.pending;
                        null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                        l2.pending = k2;
                      }
                    }
                    f.lanes |= c;
                    k2 = f.alternate;
                    null !== k2 && (k2.lanes |= c);
                    Sg(
                      f.return,
                      c,
                      b
                    );
                    h2.lanes |= c;
                    break;
                  }
                  k2 = k2.next;
                }
              } else if (10 === f.tag)
                g = f.type === b.type ? null : f.child;
              else if (18 === f.tag) {
                g = f.return;
                if (null === g)
                  throw Error(p$1(341));
                g.lanes |= c;
                h2 = g.alternate;
                null !== h2 && (h2.lanes |= c);
                Sg(g, c, b);
                g = f.sibling;
              } else
                g = f.child;
              if (null !== g)
                g.return = f;
              else
                for (g = f; null !== g; ) {
                  if (g === b) {
                    g = null;
                    break;
                  }
                  f = g.sibling;
                  if (null !== f) {
                    f.return = g.return;
                    g = f;
                    break;
                  }
                  g = g.return;
                }
              f = g;
            }
        Yi(a, b, e2.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e2 = b.type, d = b.pendingProps.children, Tg(b, c), e2 = Vg(e2), d = d(e2), b.flags |= 1, Yi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e2 = Lg(d, b.pendingProps), e2 = Lg(d.type, e2), aj(a, b, d, e2, c);
    case 15:
      return cj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), jj(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, Tg(b, c), ph(b, d, e2), rh(b, d, e2, c), kj(null, b, d, true, a, c);
    case 19:
      return yj(a, b, c);
    case 22:
      return ej(a, b, c);
  }
  throw Error(p$1(156, b.tag));
};
function Gk(a, b) {
  return ac(a, b);
}
function al(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new al(a, b, c, d);
}
function bj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function $k(a) {
  if ("function" === typeof a)
    return bj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da)
      return 11;
    if (a === Ga)
      return 14;
  }
  return 2;
}
function wh(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function yh(a, b, c, d, e2, f) {
  var g = 2;
  d = a;
  if ("function" === typeof a)
    bj(a) && (g = 1);
  else if ("string" === typeof a)
    g = 5;
  else
    a:
      switch (a) {
        case ya:
          return Ah(c.children, e2, f, b);
        case za:
          g = 8;
          e2 |= 8;
          break;
        case Aa:
          return a = Bg(12, c, b, e2 | 2), a.elementType = Aa, a.lanes = f, a;
        case Ea:
          return a = Bg(13, c, b, e2), a.elementType = Ea, a.lanes = f, a;
        case Fa:
          return a = Bg(19, c, b, e2), a.elementType = Fa, a.lanes = f, a;
        case Ia:
          return qj(c, e2, f, b);
        default:
          if ("object" === typeof a && null !== a)
            switch (a.$$typeof) {
              case Ba:
                g = 10;
                break a;
              case Ca:
                g = 9;
                break a;
              case Da:
                g = 11;
                break a;
              case Ga:
                g = 14;
                break a;
              case Ha:
                g = 16;
                d = null;
                break a;
            }
          throw Error(p$1(130, null == a ? a : typeof a, ""));
      }
  b = Bg(g, c, b, e2);
  b.elementType = a;
  b.type = d;
  b.lanes = f;
  return b;
}
function Ah(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function qj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function xh(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function zh(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function bl(a, b, c, d, e2) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e2;
  this.mutableSourceEagerHydrationData = null;
}
function cl(a, b, c, d, e2, f, g, h2, k2) {
  a = new bl(a, b, c, h2, k2);
  1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
  f = Bg(3, null, null, b);
  a.current = f;
  f.stateNode = a;
  f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  ah(f);
  return a;
}
function dl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function el(a) {
  if (!a)
    return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag)
      throw Error(p$1(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p$1(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c))
      return bg(a, c, b);
  }
  return b;
}
function fl(a, b, c, d, e2, f, g, h2, k2) {
  a = cl(c, d, true, a, e2, f, g, h2, k2);
  a.context = el(null);
  c = a.current;
  d = L();
  e2 = lh(c);
  f = ch(d, e2);
  f.callback = void 0 !== b && null !== b ? b : null;
  dh(c, f, e2);
  a.current.lanes = e2;
  Ac(a, e2, d);
  Ek(a, d);
  return a;
}
function gl(a, b, c, d) {
  var e2 = b.current, f = L(), g = lh(e2);
  c = el(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = ch(f, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = dh(e2, b, g);
  null !== a && (mh(a, e2, g, f), eh(a, e2, g));
  return g;
}
function hl(a) {
  a = a.current;
  if (!a.child)
    return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function il(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function jl(a, b) {
  il(a, b);
  (a = a.alternate) && il(a, b);
}
function kl() {
  return null;
}
var ll = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ml(a) {
  this._internalRoot = a;
}
nl.prototype.render = ml.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b)
    throw Error(p$1(409));
  gl(a, b, null, null);
};
nl.prototype.unmount = ml.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Sk(function() {
      gl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function nl(a) {
  this._internalRoot = a;
}
nl.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++)
      ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function pl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function ql() {
}
function rl(a, b, c, d, e2) {
  if (e2) {
    if ("function" === typeof d) {
      var f = d;
      d = function() {
        var a2 = hl(g);
        f.call(a2);
      };
    }
    var g = fl(b, d, a, 0, null, false, false, "", ql);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Sk();
    return g;
  }
  for (; e2 = a.lastChild; )
    a.removeChild(e2);
  if ("function" === typeof d) {
    var h2 = d;
    d = function() {
      var a2 = hl(k2);
      h2.call(a2);
    };
  }
  var k2 = cl(a, 0, false, null, null, false, false, "", ql);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Sk(function() {
    gl(b, k2, c, d);
  });
  return k2;
}
function sl(a, b, c, d, e2) {
  var f = c._reactRootContainer;
  if (f) {
    var g = f;
    if ("function" === typeof e2) {
      var h2 = e2;
      e2 = function() {
        var a2 = hl(g);
        h2.call(a2);
      };
    }
    gl(b, g, a, e2);
  } else
    g = rl(c, b, a, e2, d);
  return hl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Ek(b, B()), 0 === (K & 6) && (Hj = B() + 500, jg()));
      }
      break;
    case 13:
      Sk(function() {
        var b2 = Zg(a, 1);
        if (null !== b2) {
          var c2 = L();
          mh(b2, a, 1, c2);
        }
      }), jl(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = Zg(a, 134217728);
    if (null !== b) {
      var c = L();
      mh(b, a, 134217728, c);
    }
    jl(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = lh(a), c = Zg(a, b);
    if (null !== c) {
      var d = L();
      mh(c, a, b, d);
    }
    jl(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; )
          c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e2 = Db(d);
            if (!e2)
              throw Error(p$1(90));
            Wa(d);
            bb(d, e2);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Rk;
Hb = Sk;
var tl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Rk] }, ul = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" };
var vl = { bundleType: ul.bundleType, version: ul.version, rendererPackageName: ul.rendererPackageName, rendererConfig: ul.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: ul.findFiberByHostInstance || kl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!wl.isDisabled && wl.supportsFiber)
    try {
      kc = wl.inject(vl), lc = wl;
    } catch (a) {
    }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!ol(b))
    throw Error(p$1(200));
  return dl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!ol(a))
    throw Error(p$1(299));
  var c = false, d = "", e2 = ll;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e2 = b.onRecoverableError));
  b = cl(a, 1, false, null, null, c, false, d, e2);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ml(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a)
    return null;
  if (1 === a.nodeType)
    return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render)
      throw Error(p$1(188));
    a = Object.keys(a).join(",");
    throw Error(p$1(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Sk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!pl(b))
    throw Error(p$1(200));
  return sl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!ol(a))
    throw Error(p$1(405));
  var d = null != c && c.hydratedSources || null, e2 = false, f = "", g = ll;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e2 = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = fl(b, null, a, 1, null != c ? c : null, e2, false, f, g);
  a[uf] = b.current;
  sf(a);
  if (d)
    for (a = 0; a < d.length; a++)
      c = d[a], e2 = c._getVersion, e2 = e2(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e2] : b.mutableSourceEagerHydrationData.push(
        c,
        e2
      );
  return new nl(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!pl(b))
    throw Error(p$1(200));
  return sl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!pl(a))
    throw Error(p$1(40));
  return a._reactRootContainer ? (Sk(function() {
    sl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!pl(c))
    throw Error(p$1(200));
  if (null == a || void 0 === a._reactInternals)
    throw Error(p$1(38));
  return sl(a, b, c, false, d);
};
reactDom_production_min.version = "18.2.0-next-9e3b772b8-20220608";
(function(module) {
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    module.exports = reactDom_production_min;
  }
})(reactDom);
const ae = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
class Subscribable {
  constructor() {
    this.listeners = [];
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.push(listener);
    this.onSubscribe();
    return () => {
      this.listeners = this.listeners.filter((x2) => x2 !== listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.length > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
}
const isServer = typeof window === "undefined" || "Deno" in window;
function noop() {
  return void 0;
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function parseQueryArgs(arg1, arg2, arg3) {
  if (!isQueryKey(arg1)) {
    return arg1;
  }
  if (typeof arg2 === "function") {
    return {
      ...arg3,
      queryKey: arg1,
      queryFn: arg2
    };
  }
  return {
    ...arg2,
    queryKey: arg1
  };
}
function parseMutationArgs(arg1, arg2, arg3) {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === "function") {
      return {
        ...arg3,
        mutationKey: arg1,
        mutationFn: arg2
      };
    }
    return {
      ...arg2,
      mutationKey: arg1
    };
  }
  if (typeof arg1 === "function") {
    return {
      ...arg2,
      mutationFn: arg1
    };
  }
  return {
    ...arg1
  };
}
function parseFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [{
    ...arg2,
    queryKey: arg1
  }, arg3] : [arg1 || {}, arg2];
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (isQueryKey(queryKey)) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const {
    exact,
    fetching,
    predicate,
    mutationKey
  } = filters;
  if (isQueryKey(mutationKey)) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (typeof fetching === "boolean" && mutation.state.status === "loading" !== fetching) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
  return hashFn(queryKey);
}
function hashQueryKey(queryKey) {
  return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
function partialMatchKey(a, b) {
  return partialDeepEqual(a, b);
}
function partialDeepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return !Object.keys(b).some((key) => !partialDeepEqual(a[key], b[key]));
  }
  return false;
}
function replaceEqualDeep(a, b) {
  if (a === b) {
    return a;
  }
  const array = isPlainArray(a) && isPlainArray(b);
  if (array || isPlainObject(a) && isPlainObject(b)) {
    const aSize = array ? a.length : Object.keys(a).length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;
    for (let i = 0; i < bSize; i++) {
      const key = array ? i : bItems[i];
      copy[key] = replaceEqualDeep(a[key], b[key]);
      if (copy[key] === a[key]) {
        equalItems++;
      }
    }
    return aSize === bSize && equalItems === aSize ? a : copy;
  }
  return b;
}
function shallowEqualObjects(a, b) {
  if (a && !b || b && !a) {
    return false;
  }
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isQueryKey(value) {
  return Array.isArray(value);
}
function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
function scheduleMicrotask(callback) {
  sleep(0).then(callback);
}
function getAbortController() {
  if (typeof AbortController === "function") {
    return new AbortController();
  }
  return;
}
function replaceData(prevData, data, options) {
  if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
    return prevData;
  } else if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
class FocusManager extends Subscribable {
  constructor() {
    super();
    this.setup = (onFocus) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        window.addEventListener("focus", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
          window.removeEventListener("focus", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;
      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = void 0;
    }
  }
  setEventListener(setup) {
    var _this$cleanup2;
    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    this.focused = focused;
    if (focused) {
      this.onFocus();
    }
  }
  onFocus() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
  isFocused() {
    if (typeof this.focused === "boolean") {
      return this.focused;
    }
    if (typeof document === "undefined") {
      return true;
    }
    return [void 0, "visible", "prerender"].includes(document.visibilityState);
  }
}
const focusManager = new FocusManager();
class OnlineManager extends Subscribable {
  constructor() {
    super();
    this.setup = (onOnline) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onOnline();
        window.addEventListener("online", listener, false);
        window.addEventListener("offline", listener, false);
        return () => {
          window.removeEventListener("online", listener);
          window.removeEventListener("offline", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;
      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = void 0;
    }
  }
  setEventListener(setup) {
    var _this$cleanup2;
    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup((online) => {
      if (typeof online === "boolean") {
        this.setOnline(online);
      } else {
        this.onOnline();
      }
    });
  }
  setOnline(online) {
    this.online = online;
    if (online) {
      this.onOnline();
    }
  }
  onOnline() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
  isOnline() {
    if (typeof this.online === "boolean") {
      return this.online;
    }
    if (typeof navigator === "undefined" || typeof navigator.onLine === "undefined") {
      return true;
    }
    return navigator.onLine;
  }
}
const onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode != null ? networkMode : "online") === "online" ? onlineManager.isOnline() : true;
}
class CancelledError {
  constructor(options) {
    this.revert = options == null ? void 0 : options.revert;
    this.silent = options == null ? void 0 : options.silent;
  }
}
function isCancelledError(value) {
  return value instanceof CancelledError;
}
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let isResolved = false;
  let continueFn;
  let promiseResolve;
  let promiseReject;
  const promise = new Promise((outerResolve, outerReject) => {
    promiseResolve = outerResolve;
    promiseReject = outerReject;
  });
  const cancel = (cancelOptions) => {
    if (!isResolved) {
      reject(new CancelledError(cancelOptions));
      config.abort == null ? void 0 : config.abort();
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const shouldPause = () => !focusManager.isFocused() || config.networkMode !== "always" && !onlineManager.isOnline();
  const resolve = (value) => {
    if (!isResolved) {
      isResolved = true;
      config.onSuccess == null ? void 0 : config.onSuccess(value);
      continueFn == null ? void 0 : continueFn();
      promiseResolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved) {
      isResolved = true;
      config.onError == null ? void 0 : config.onError(value);
      continueFn == null ? void 0 : continueFn();
      promiseReject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        const canContinue = isResolved || !shouldPause();
        if (canContinue) {
          continueResolve(value);
        }
        return canContinue;
      };
      config.onPause == null ? void 0 : config.onPause();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved) {
        config.onContinue == null ? void 0 : config.onContinue();
      }
    });
  };
  const run = () => {
    if (isResolved) {
      return;
    }
    let promiseOrValue;
    try {
      promiseOrValue = config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      var _config$retry, _config$retryDelay;
      if (isResolved) {
        return;
      }
      const retry = (_config$retry = config.retry) != null ? _config$retry : 3;
      const retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
      const delay2 = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail == null ? void 0 : config.onFail(failureCount, error);
      sleep(delay2).then(() => {
        if (shouldPause()) {
          return pause();
        }
        return;
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  if (canFetch(config.networkMode)) {
    run();
  } else {
    pause().then(run);
  }
  return {
    promise,
    cancel,
    continue: () => {
      const didContinue = continueFn == null ? void 0 : continueFn();
      return didContinue ? promise : Promise.resolve();
    },
    cancelRetry,
    continueRetry
  };
}
const defaultLogger = console;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  const batch = (callback) => {
    let result;
    transactions++;
    try {
      result = callback();
    } finally {
      transactions--;
      if (!transactions) {
        flush();
      }
    }
    return result;
  };
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleMicrotask(() => {
        notifyFn(callback);
      });
    }
  };
  const batchCalls = (callback) => {
    return (...args) => {
      schedule(() => {
        callback(...args);
      });
    };
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleMicrotask(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  const setNotifyFunction = (fn) => {
    notifyFn = fn;
  };
  const setBatchNotifyFunction = (fn) => {
    batchNotifyFn = fn;
  };
  return {
    batch,
    batchCalls,
    schedule,
    setNotifyFunction,
    setBatchNotifyFunction
  };
}
const notifyManager = createNotifyManager();
class Removable {
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.cacheTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.cacheTime);
    }
  }
  updateCacheTime(newCacheTime) {
    this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : isServer ? Infinity : 5 * 60 * 1e3);
  }
  clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = void 0;
    }
  }
}
class Query extends Removable {
  constructor(config) {
    super();
    this.abortSignalConsumed = false;
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.cache = config.cache;
    this.logger = config.logger || defaultLogger;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.initialState = config.state || getDefaultState$1(this.options);
    this.state = this.initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  setOptions(options) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.dispatch({
      data,
      type: "success",
      dataUpdatedAt: options == null ? void 0 : options.updatedAt,
      manual: options == null ? void 0 : options.manual
    });
    return data;
  }
  setState(state, setStateOptions) {
    this.dispatch({
      type: "setState",
      state,
      setStateOptions
    });
  }
  cancel(options) {
    var _this$retryer;
    const promise = this.promise;
    (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({
      silent: true
    });
  }
  reset() {
    this.destroy();
    this.setState(this.initialState);
  }
  isActive() {
    return this.observers.some((observer) => observer.options.enabled !== false);
  }
  isDisabled() {
    return this.getObserversCount() > 0 && !this.isActive();
  }
  isStale() {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some((observer) => observer.getCurrentResult().isStale);
  }
  isStaleByTime(staleTime = 0) {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    var _this$retryer2;
    const observer = this.observers.find((x2) => x2.shouldFetchOnWindowFocus());
    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    }
    (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
  }
  onOnline() {
    var _this$retryer3;
    const observer = this.observers.find((x2) => x2.shouldFetchOnReconnect());
    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    }
    (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
  }
  addObserver(observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.cache.notify({
        type: "observerAdded",
        query: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    if (this.observers.indexOf(observer) !== -1) {
      this.observers = this.observers.filter((x2) => x2 !== observer);
      if (!this.observers.length) {
        if (this.retryer) {
          if (this.abortSignalConsumed) {
            this.retryer.cancel({
              revert: true
            });
          } else {
            this.retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.cache.notify({
        type: "observerRemoved",
        query: this,
        observer
      });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.dispatch({
        type: "invalidate"
      });
    }
  }
  fetch(options, fetchOptions) {
    var _this$options$behavio, _context$fetchOptions;
    if (this.state.fetchStatus !== "idle") {
      if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
        this.cancel({
          silent: true
        });
      } else if (this.promise) {
        var _this$retryer4;
        (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry();
        return this.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x2) => x2.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    if (!Array.isArray(this.options.queryKey))
      ;
    const abortController = getAbortController();
    const queryFnContext = {
      queryKey: this.queryKey,
      pageParam: void 0,
      meta: this.meta
    };
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          if (abortController) {
            this.abortSignalConsumed = true;
            return abortController.signal;
          }
          return void 0;
        }
      });
    };
    addSignalProperty(queryFnContext);
    const fetchFn = () => {
      if (!this.options.queryFn) {
        return Promise.reject("Missing queryFn");
      }
      this.abortSignalConsumed = false;
      return this.options.queryFn(queryFnContext);
    };
    const context = {
      fetchOptions,
      options: this.options,
      queryKey: this.queryKey,
      state: this.state,
      fetchFn
    };
    addSignalProperty(context);
    (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context);
    this.revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
      var _context$fetchOptions2;
      this.dispatch({
        type: "fetch",
        meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
      });
    }
    const onError = (error) => {
      if (!(isCancelledError(error) && error.silent)) {
        this.dispatch({
          type: "error",
          error
        });
      }
      if (!isCancelledError(error)) {
        var _this$cache$config$on, _this$cache$config, _this$cache$config$on2, _this$cache$config2;
        (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);
        (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, this.state.data, error, this);
      }
      if (!this.isFetchingOptimistic) {
        this.scheduleGc();
      }
      this.isFetchingOptimistic = false;
    };
    this.retryer = createRetryer({
      fn: context.fetchFn,
      abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
      onSuccess: (data) => {
        var _this$cache$config$on3, _this$cache$config3, _this$cache$config$on4, _this$cache$config4;
        if (typeof data === "undefined") {
          onError(new Error("undefined"));
          return;
        }
        this.setData(data);
        (_this$cache$config$on3 = (_this$cache$config3 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on3.call(_this$cache$config3, data, this);
        (_this$cache$config$on4 = (_this$cache$config4 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on4.call(_this$cache$config4, data, this.state.error, this);
        if (!this.isFetchingOptimistic) {
          this.scheduleGc();
        }
        this.isFetchingOptimistic = false;
      },
      onError,
      onFail: (failureCount, error) => {
        this.dispatch({
          type: "failed",
          failureCount,
          error
        });
      },
      onPause: () => {
        this.dispatch({
          type: "pause"
        });
      },
      onContinue: () => {
        this.dispatch({
          type: "continue"
        });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode
    });
    this.promise = this.retryer.promise;
    return this.promise;
  }
  dispatch(action) {
    const reducer = (state) => {
      var _action$meta, _action$dataUpdatedAt;
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
            fetchStatus: canFetch(this.options.networkMode) ? "fetching" : "paused",
            ...!state.dataUpdatedAt && {
              error: null,
              status: "loading"
            }
          };
        case "success":
          return {
            ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
            error: null,
            isInvalidated: false,
            status: "success",
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
        case "error":
          const error = action.error;
          if (isCancelledError(error) && error.revert && this.revertState) {
            return {
              ...this.revertState
            };
          }
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error"
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate(action);
      });
      this.cache.notify({
        query: this,
        type: "updated",
        action
      });
    });
  }
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = typeof data !== "undefined";
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "loading",
    fetchStatus: "idle"
  };
}
class QueryCache extends Subscribable {
  constructor(config) {
    super();
    this.config = config || {};
    this.queries = [];
    this.queriesMap = {};
  }
  build(client, options, state) {
    var _options$queryHash;
    const queryKey = options.queryKey;
    const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        cache: this,
        logger: client.getLogger(),
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.queriesMap[query.queryHash]) {
      this.queriesMap[query.queryHash] = query;
      this.queries.push(query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.queriesMap[query.queryHash];
    if (queryInMap) {
      query.destroy();
      this.queries = this.queries.filter((x2) => x2 !== query);
      if (queryInMap === query) {
        delete this.queriesMap[query.queryHash];
      }
      this.notify({
        type: "removed",
        query
      });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.queries.forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.queriesMap[queryHash];
  }
  getAll() {
    return this.queries;
  }
  find(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    if (typeof filters.exact === "undefined") {
      filters.exact = true;
    }
    return this.queries.find((query) => matchQuery(filters, query));
  }
  findAll(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    return Object.keys(filters).length > 0 ? this.queries.filter((query) => matchQuery(filters, query)) : this.queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.queries.forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.queries.forEach((query) => {
        query.onOnline();
      });
    });
  }
}
class Mutation extends Removable {
  constructor(config) {
    super();
    this.defaultOptions = config.defaultOptions;
    this.mutationId = config.mutationId;
    this.mutationCache = config.mutationCache;
    this.logger = config.logger || defaultLogger;
    this.observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }
  get meta() {
    return this.options.meta;
  }
  setState(state) {
    this.dispatch({
      type: "setState",
      state
    });
  }
  addObserver(observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.observers = this.observers.filter((x2) => x2 !== observer);
    this.scheduleGc();
    this.mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.observers.length) {
      if (this.state.status === "loading") {
        this.scheduleGc();
      } else {
        this.mutationCache.remove(this);
      }
    }
  }
  continue() {
    var _this$retryer$continu, _this$retryer;
    return (_this$retryer$continu = (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.continue()) != null ? _this$retryer$continu : this.execute();
  }
  async execute() {
    const executeMutation = () => {
      var _this$options$retry;
      this.retryer = createRetryer({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject("No mutationFn found");
          }
          return this.options.mutationFn(this.state.variables);
        },
        onFail: (failureCount, error) => {
          this.dispatch({
            type: "failed",
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: "pause"
          });
        },
        onContinue: () => {
          this.dispatch({
            type: "continue"
          });
        },
        retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode
      });
      return this.retryer.promise;
    };
    const restored = this.state.status === "loading";
    try {
      var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onSettl, _this$options3;
      if (!restored) {
        var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;
        this.dispatch({
          type: "loading",
          variables: this.options.variables
        });
        await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
        const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));
        if (context !== this.state.context) {
          this.dispatch({
            type: "loading",
            context,
            variables: this.state.variables
          });
        }
      }
      const data = await executeMutation();
      await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
      await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context));
      await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, data, null, this.state.variables, this.state.context, this));
      await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
      this.dispatch({
        type: "success",
        data
      });
      return data;
    } catch (error) {
      try {
        var _this$mutationCache$c7, _this$mutationCache$c8, _this$options$onError, _this$options4, _this$mutationCache$c9, _this$mutationCache$c10, _this$options$onSettl2, _this$options5;
        await ((_this$mutationCache$c7 = (_this$mutationCache$c8 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c7.call(_this$mutationCache$c8, error, this.state.variables, this.state.context, this));
        if (false)
          ;
        await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context));
        await ((_this$mutationCache$c9 = (_this$mutationCache$c10 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c9.call(_this$mutationCache$c10, void 0, error, this.state.variables, this.state.context, this));
        await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, void 0, error, this.state.variables, this.state.context));
        throw error;
      } finally {
        this.dispatch({
          type: "error",
          error
        });
      }
    }
  }
  dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "loading":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: !canFetch(this.options.networkMode),
            status: "loading",
            variables: action.variables
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
}
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0
  };
}
class MutationCache extends Subscribable {
  constructor(config) {
    super();
    this.config = config || {};
    this.mutations = [];
    this.mutationId = 0;
  }
  build(client, options, state) {
    const mutation = new Mutation({
      mutationCache: this,
      logger: client.getLogger(),
      mutationId: ++this.mutationId,
      options: client.defaultMutationOptions(options),
      state,
      defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : void 0
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.mutations.push(mutation);
    this.notify({
      type: "added",
      mutation
    });
  }
  remove(mutation) {
    this.mutations = this.mutations.filter((x2) => x2 !== mutation);
    this.notify({
      type: "removed",
      mutation
    });
  }
  clear() {
    notifyManager.batch(() => {
      this.mutations.forEach((mutation) => {
        this.remove(mutation);
      });
    });
  }
  getAll() {
    return this.mutations;
  }
  find(filters) {
    if (typeof filters.exact === "undefined") {
      filters.exact = true;
    }
    return this.mutations.find((mutation) => matchMutation(filters, mutation));
  }
  findAll(filters) {
    return this.mutations.filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    var _this$resuming;
    this.resuming = ((_this$resuming = this.resuming) != null ? _this$resuming : Promise.resolve()).then(() => {
      const pausedMutations = this.mutations.filter((x2) => x2.state.isPaused);
      return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
    }).then(() => {
      this.resuming = void 0;
    });
    return this.resuming;
  }
}
function infiniteQueryBehavior() {
  return {
    onFetch: (context) => {
      context.fetchFn = () => {
        var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;
        const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
        const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
        const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
        const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === "forward";
        const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === "backward";
        const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
        const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
        let newPageParams = oldPageParams;
        let cancelled = false;
        const addSignalProperty = (object) => {
          Object.defineProperty(object, "signal", {
            enumerable: true,
            get: () => {
              var _context$signal;
              if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                cancelled = true;
              } else {
                var _context$signal2;
                (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener("abort", () => {
                  cancelled = true;
                });
              }
              return context.signal;
            }
          });
        };
        const queryFn = context.options.queryFn || (() => Promise.reject("Missing queryFn"));
        const buildNewPages = (pages, param, page, previous) => {
          newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
          return previous ? [page, ...pages] : [...pages, page];
        };
        const fetchPage = (pages, manual, param, previous) => {
          if (cancelled) {
            return Promise.reject("Cancelled");
          }
          if (typeof param === "undefined" && !manual && pages.length) {
            return Promise.resolve(pages);
          }
          const queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param,
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const queryFnResult = queryFn(queryFnContext);
          const promise2 = Promise.resolve(queryFnResult).then((page) => buildNewPages(pages, param, page, previous));
          return promise2;
        };
        let promise;
        if (!oldPages.length) {
          promise = fetchPage([]);
        } else if (isFetchingNextPage) {
          const manual = typeof pageParam !== "undefined";
          const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param);
        } else if (isFetchingPreviousPage) {
          const manual = typeof pageParam !== "undefined";
          const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param, true);
        } else {
          newPageParams = [];
          const manual = typeof context.options.getNextPageParam === "undefined";
          const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true;
          promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
          for (let i = 1; i < oldPages.length; i++) {
            promise = promise.then((pages) => {
              const shouldFetchNextPage = refetchPage && oldPages[i] ? refetchPage(oldPages[i], i, oldPages) : true;
              if (shouldFetchNextPage) {
                const param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                return fetchPage(pages, manual, param);
              }
              return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
            });
          }
        }
        const finalPromise = promise.then((pages) => ({
          pages,
          pageParams: newPageParams
        }));
        return finalPromise;
      };
    }
  };
}
function getNextPageParam(options, pages) {
  return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
}
function getPreviousPageParam(options, pages) {
  return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
}
function hasNextPage(options, pages) {
  if (options.getNextPageParam && Array.isArray(pages)) {
    const nextPageParam = getNextPageParam(options, pages);
    return typeof nextPageParam !== "undefined" && nextPageParam !== null && nextPageParam !== false;
  }
  return;
}
function hasPreviousPage(options, pages) {
  if (options.getPreviousPageParam && Array.isArray(pages)) {
    const previousPageParam = getPreviousPageParam(options, pages);
    return typeof previousPageParam !== "undefined" && previousPageParam !== null && previousPageParam !== false;
  }
  return;
}
class QueryClient {
  constructor(config = {}) {
    this.queryCache = config.queryCache || new QueryCache();
    this.mutationCache = config.mutationCache || new MutationCache();
    this.logger = config.logger || defaultLogger;
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = [];
    this.mutationDefaults = [];
    this.mountCount = 0;
  }
  mount() {
    this.mountCount++;
    if (this.mountCount !== 1)
      return;
    this.unsubscribeFocus = focusManager.subscribe(() => {
      if (focusManager.isFocused()) {
        this.resumePausedMutations();
        this.queryCache.onFocus();
      }
    });
    this.unsubscribeOnline = onlineManager.subscribe(() => {
      if (onlineManager.isOnline()) {
        this.resumePausedMutations();
        this.queryCache.onOnline();
      }
    });
  }
  unmount() {
    var _this$unsubscribeFocu, _this$unsubscribeOnli;
    this.mountCount--;
    if (this.mountCount !== 0)
      return;
    (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
    this.unsubscribeFocus = void 0;
    (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
    this.unsubscribeOnline = void 0;
  }
  isFetching(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    filters.fetchStatus = "fetching";
    return this.queryCache.findAll(filters).length;
  }
  isMutating(filters) {
    return this.mutationCache.findAll({
      ...filters,
      fetching: true
    }).length;
  }
  getQueryData(queryKey, filters) {
    var _this$queryCache$find;
    return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
  }
  ensureQueryData(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    const cachedData = this.getQueryData(parsedOptions.queryKey);
    return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
  }
  getQueriesData(queryKeyOrFilters) {
    return this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey,
      state
    }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const query = this.queryCache.find(queryKey);
    const prevData = query == null ? void 0 : query.state.data;
    const data = functionalUpdate(updater, prevData);
    if (typeof data === "undefined") {
      return void 0;
    }
    const parsedOptions = parseQueryArgs(queryKey);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions);
    return this.queryCache.build(this, defaultedOptions).setData(data, {
      ...options,
      manual: true
    });
  }
  setQueriesData(queryKeyOrFilters, updater, options) {
    return notifyManager.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey
    }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
  }
  getQueryState(queryKey, filters) {
    var _this$queryCache$find2;
    return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
  }
  removeQueries(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    const queryCache = this.queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(arg1, arg2, arg3) {
    const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
    const queryCache = this.queryCache;
    const refetchFilters = {
      type: "active",
      ...filters
    };
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(refetchFilters, options);
    });
  }
  cancelQueries(arg1, arg2, arg3) {
    const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
    if (typeof cancelOptions.revert === "undefined") {
      cancelOptions.revert = true;
    }
    const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map((query) => query.cancel(cancelOptions)));
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(arg1, arg2, arg3) {
    const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
    return notifyManager.batch(() => {
      var _ref, _filters$refetchType;
      this.queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters.refetchType === "none") {
        return Promise.resolve();
      }
      const refetchFilters = {
        ...filters,
        type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : "active"
      };
      return this.refetchQueries(refetchFilters, options);
    });
  }
  refetchQueries(arg1, arg2, arg3) {
    const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
    const promises = notifyManager.batch(() => this.queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
      var _options$cancelRefetc;
      return query.fetch(void 0, {
        ...options,
        cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
        meta: {
          refetchPage: filters.refetchPage
        }
      });
    }));
    let promise = Promise.all(promises).then(noop);
    if (!(options != null && options.throwOnError)) {
      promise = promise.catch(noop);
    }
    return promise;
  }
  fetchQuery(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions);
    if (typeof defaultedOptions.retry === "undefined") {
      defaultedOptions.retry = false;
    }
    const query = this.queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(arg1, arg2, arg3) {
    return this.fetchQuery(arg1, arg2, arg3).then(noop).catch(noop);
  }
  fetchInfiniteQuery(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    parsedOptions.behavior = infiniteQueryBehavior();
    return this.fetchQuery(parsedOptions);
  }
  prefetchInfiniteQuery(arg1, arg2, arg3) {
    return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop).catch(noop);
  }
  resumePausedMutations() {
    return this.mutationCache.resumePausedMutations();
  }
  getQueryCache() {
    return this.queryCache;
  }
  getMutationCache() {
    return this.mutationCache;
  }
  getLogger() {
    return this.logger;
  }
  getDefaultOptions() {
    return this.defaultOptions;
  }
  setDefaultOptions(options) {
    this.defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    const result = this.queryDefaults.find((x2) => hashQueryKey(queryKey) === hashQueryKey(x2.queryKey));
    if (result) {
      result.defaultOptions = options;
    } else {
      this.queryDefaults.push({
        queryKey,
        defaultOptions: options
      });
    }
  }
  getQueryDefaults(queryKey) {
    if (!queryKey) {
      return void 0;
    }
    const firstMatchingDefaults = this.queryDefaults.find((x2) => partialMatchKey(queryKey, x2.queryKey));
    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }
  setMutationDefaults(mutationKey, options) {
    const result = this.mutationDefaults.find((x2) => hashQueryKey(mutationKey) === hashQueryKey(x2.mutationKey));
    if (result) {
      result.defaultOptions = options;
    } else {
      this.mutationDefaults.push({
        mutationKey,
        defaultOptions: options
      });
    }
  }
  getMutationDefaults(mutationKey) {
    if (!mutationKey) {
      return void 0;
    }
    const firstMatchingDefaults = this.mutationDefaults.find((x2) => partialMatchKey(mutationKey, x2.mutationKey));
    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }
  defaultQueryOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.defaultOptions.queries,
      ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
    }
    if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (typeof defaultedOptions.useErrorBoundary === "undefined") {
      defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }
    return {
      ...this.defaultOptions.mutations,
      ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.queryCache.clear();
    this.mutationCache.clear();
  }
}
class QueryObserver extends Subscribable {
  constructor(client, options) {
    super();
    this.client = client;
    this.options = options;
    this.trackedProps = /* @__PURE__ */ new Set();
    this.selectError = null;
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.remove = this.remove.bind(this);
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.length === 1) {
      this.currentQuery.addObserver(this);
      if (shouldFetchOnMount(this.currentQuery, this.options)) {
        this.executeFetch();
      }
      this.updateTimers();
    }
  }
  onUnsubscribe() {
    if (!this.listeners.length) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnReconnect);
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
  }
  destroy() {
    this.listeners = [];
    this.clearStaleTimeout();
    this.clearRefetchInterval();
    this.currentQuery.removeObserver(this);
  }
  setOptions(options, notifyOptions) {
    const prevOptions = this.options;
    const prevQuery = this.currentQuery;
    this.options = this.client.defaultQueryOptions(options);
    if (!shallowEqualObjects(prevOptions, this.options)) {
      this.client.getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: this.currentQuery,
        observer: this
      });
    }
    if (typeof this.options.enabled !== "undefined" && typeof this.options.enabled !== "boolean") {
      throw new Error("Expected enabled to be a boolean");
    }
    if (!this.options.queryKey) {
      this.options.queryKey = prevOptions.queryKey;
    }
    this.updateQuery();
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(this.currentQuery, prevQuery, this.options, prevOptions)) {
      this.executeFetch();
    }
    this.updateResult(notifyOptions);
    if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || this.options.staleTime !== prevOptions.staleTime)) {
      this.updateStaleTimeout();
    }
    const nextRefetchInterval = this.computeRefetchInterval();
    if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || nextRefetchInterval !== this.currentRefetchInterval)) {
      this.updateRefetchInterval(nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = this.client.getQueryCache().build(this.client, options);
    return this.createResult(query, options);
  }
  getCurrentResult() {
    return this.currentResult;
  }
  trackResult(result) {
    const trackedResult = {};
    Object.keys(result).forEach((key) => {
      Object.defineProperty(trackedResult, key, {
        configurable: false,
        enumerable: true,
        get: () => {
          this.trackedProps.add(key);
          return result[key];
        }
      });
    });
    return trackedResult;
  }
  getCurrentQuery() {
    return this.currentQuery;
  }
  remove() {
    this.client.getQueryCache().remove(this.currentQuery);
  }
  refetch({
    refetchPage,
    ...options
  } = {}) {
    return this.fetch({
      ...options,
      meta: {
        refetchPage
      }
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = this.client.defaultQueryOptions(options);
    const query = this.client.getQueryCache().build(this.client, defaultedOptions);
    query.isFetchingOptimistic = true;
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    var _fetchOptions$cancelR;
    return this.executeFetch({
      ...fetchOptions,
      cancelRefetch: (_fetchOptions$cancelR = fetchOptions.cancelRefetch) != null ? _fetchOptions$cancelR : true
    }).then(() => {
      this.updateResult();
      return this.currentResult;
    });
  }
  executeFetch(fetchOptions) {
    this.updateQuery();
    let promise = this.currentQuery.fetch(this.options, fetchOptions);
    if (!(fetchOptions != null && fetchOptions.throwOnError)) {
      promise = promise.catch(noop);
    }
    return promise;
  }
  updateStaleTimeout() {
    this.clearStaleTimeout();
    if (isServer || this.currentResult.isStale || !isValidTimeout(this.options.staleTime)) {
      return;
    }
    const time = timeUntilStale(this.currentResult.dataUpdatedAt, this.options.staleTime);
    const timeout = time + 1;
    this.staleTimeoutId = setTimeout(() => {
      if (!this.currentResult.isStale) {
        this.updateResult();
      }
    }, timeout);
  }
  computeRefetchInterval() {
    var _this$options$refetch;
    return typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.currentResult.data, this.currentQuery) : (_this$options$refetch = this.options.refetchInterval) != null ? _this$options$refetch : false;
  }
  updateRefetchInterval(nextInterval) {
    this.clearRefetchInterval();
    this.currentRefetchInterval = nextInterval;
    if (isServer || this.options.enabled === false || !isValidTimeout(this.currentRefetchInterval) || this.currentRefetchInterval === 0) {
      return;
    }
    this.refetchIntervalId = setInterval(() => {
      if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
        this.executeFetch();
      }
    }, this.currentRefetchInterval);
  }
  updateTimers() {
    this.updateStaleTimeout();
    this.updateRefetchInterval(this.computeRefetchInterval());
  }
  clearStaleTimeout() {
    if (this.staleTimeoutId) {
      clearTimeout(this.staleTimeoutId);
      this.staleTimeoutId = void 0;
    }
  }
  clearRefetchInterval() {
    if (this.refetchIntervalId) {
      clearInterval(this.refetchIntervalId);
      this.refetchIntervalId = void 0;
    }
  }
  createResult(query, options) {
    const prevQuery = this.currentQuery;
    const prevOptions = this.options;
    const prevResult = this.currentResult;
    const prevResultState = this.currentResultState;
    const prevResultOptions = this.currentResultOptions;
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : this.currentQueryInitialState;
    const prevQueryResult = queryChange ? this.currentResult : this.previousQueryResult;
    const {
      state
    } = query;
    let {
      dataUpdatedAt,
      error,
      errorUpdatedAt,
      fetchStatus,
      status
    } = state;
    let isPreviousData = false;
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        fetchStatus = canFetch(query.options.networkMode) ? "fetching" : "paused";
        if (!dataUpdatedAt) {
          status = "loading";
        }
      }
      if (options._optimisticResults === "isRestoring") {
        fetchStatus = "idle";
      }
    }
    if (options.keepPreviousData && !state.dataUpdatedAt && prevQueryResult != null && prevQueryResult.isSuccess && status !== "error") {
      data = prevQueryResult.data;
      dataUpdatedAt = prevQueryResult.dataUpdatedAt;
      status = prevQueryResult.status;
      isPreviousData = true;
    } else if (options.select && typeof state.data !== "undefined") {
      if (prevResult && state.data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === this.selectFn) {
        data = this.selectResult;
      } else {
        try {
          this.selectFn = options.select;
          data = options.select(state.data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          this.selectResult = data;
          this.selectError = null;
        } catch (selectError) {
          this.selectError = selectError;
        }
      }
    } else {
      data = state.data;
    }
    if (typeof options.placeholderData !== "undefined" && typeof data === "undefined" && status === "loading") {
      let placeholderData;
      if (prevResult != null && prevResult.isPlaceholderData && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData() : options.placeholderData;
        if (options.select && typeof placeholderData !== "undefined") {
          try {
            placeholderData = options.select(placeholderData);
            this.selectError = null;
          } catch (selectError) {
            this.selectError = selectError;
          }
        }
      }
      if (typeof placeholderData !== "undefined") {
        status = "success";
        data = replaceData(prevResult == null ? void 0 : prevResult.data, placeholderData, options);
        isPlaceholderData = true;
      }
    }
    if (this.selectError) {
      error = this.selectError;
      data = this.selectResult;
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = fetchStatus === "fetching";
    const isLoading = status === "loading";
    const isError = status === "error";
    const result = {
      status,
      fetchStatus,
      isLoading,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading && isFetching,
      data,
      dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: state.fetchFailureCount,
      failureReason: state.fetchFailureReason,
      errorUpdateCount: state.errorUpdateCount,
      isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
      isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount || state.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isLoading,
      isLoadingError: isError && state.dataUpdatedAt === 0,
      isPaused: fetchStatus === "paused",
      isPlaceholderData,
      isPreviousData,
      isRefetchError: isError && state.dataUpdatedAt !== 0,
      isStale: isStale(query, options),
      refetch: this.refetch,
      remove: this.remove
    };
    return result;
  }
  updateResult(notifyOptions) {
    const prevResult = this.currentResult;
    const nextResult = this.createResult(this.currentQuery, this.options);
    this.currentResultState = this.currentQuery.state;
    this.currentResultOptions = this.options;
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    this.currentResult = nextResult;
    const defaultNotifyOptions = {
      cache: true
    };
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const {
        notifyOnChangeProps
      } = this.options;
      if (notifyOnChangeProps === "all" || !notifyOnChangeProps && !this.trackedProps.size) {
        return true;
      }
      const includedProps = new Set(notifyOnChangeProps != null ? notifyOnChangeProps : this.trackedProps);
      if (this.options.useErrorBoundary) {
        includedProps.add("error");
      }
      return Object.keys(this.currentResult).some((key) => {
        const typedKey = key;
        const changed = this.currentResult[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    if ((notifyOptions == null ? void 0 : notifyOptions.listeners) !== false && shouldNotifyListeners()) {
      defaultNotifyOptions.listeners = true;
    }
    this.notify({
      ...defaultNotifyOptions,
      ...notifyOptions
    });
  }
  updateQuery() {
    const query = this.client.getQueryCache().build(this.client, this.options);
    if (query === this.currentQuery) {
      return;
    }
    const prevQuery = this.currentQuery;
    this.currentQuery = query;
    this.currentQueryInitialState = query.state;
    this.previousQueryResult = this.currentResult;
    if (this.hasListeners()) {
      prevQuery == null ? void 0 : prevQuery.removeObserver(this);
      query.addObserver(this);
    }
  }
  onQueryUpdate(action) {
    const notifyOptions = {};
    if (action.type === "success") {
      notifyOptions.onSuccess = !action.manual;
    } else if (action.type === "error" && !isCancelledError(action.error)) {
      notifyOptions.onError = true;
    }
    this.updateResult(notifyOptions);
    if (this.hasListeners()) {
      this.updateTimers();
    }
  }
  notify(notifyOptions) {
    notifyManager.batch(() => {
      if (notifyOptions.onSuccess) {
        var _this$options$onSucce, _this$options, _this$options$onSettl, _this$options2;
        (_this$options$onSucce = (_this$options = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options, this.currentResult.data);
        (_this$options$onSettl = (_this$options2 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options2, this.currentResult.data, null);
      } else if (notifyOptions.onError) {
        var _this$options$onError, _this$options3, _this$options$onSettl2, _this$options4;
        (_this$options$onError = (_this$options3 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options3, this.currentResult.error);
        (_this$options$onSettl2 = (_this$options4 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options4, void 0, this.currentResult.error);
      }
      if (notifyOptions.listeners) {
        this.listeners.forEach((listener) => {
          listener(this.currentResult);
        });
      }
      if (notifyOptions.cache) {
        this.client.getQueryCache().notify({
          query: this.currentQuery,
          type: "observerResultsUpdated"
        });
      }
    });
  }
}
function shouldLoadOnMount(query, options) {
  return options.enabled !== false && !query.state.dataUpdatedAt && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.dataUpdatedAt > 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (options.enabled !== false) {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return options.enabled !== false && (query !== prevQuery || prevOptions.enabled === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return query.isStaleByTime(options.staleTime);
}
var shimExports = {};
var shim = {
  get exports() {
    return shimExports;
  },
  set exports(v2) {
    shimExports = v2;
  }
};
var useSyncExternalStoreShim_production_min = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e = reactExports;
function h(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var k = "function" === typeof Object.is ? Object.is : h, l = e.useState, m = e.useEffect, n = e.useLayoutEffect, p = e.useDebugValue;
function q(a, b) {
  var d = b(), f = l({ inst: { value: d, getSnapshot: b } }), c = f[0].inst, g = f[1];
  n(function() {
    c.value = d;
    c.getSnapshot = b;
    r(c) && g({ inst: c });
  }, [a, d, b]);
  m(function() {
    r(c) && g({ inst: c });
    return a(function() {
      r(c) && g({ inst: c });
    });
  }, [a]);
  p(d);
  return d;
}
function r(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var d = b();
    return !k(a, d);
  } catch (f) {
    return true;
  }
}
function t(a, b) {
  return b();
}
var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
(function(module) {
  {
    module.exports = useSyncExternalStoreShim_production_min;
  }
})(shim);
const useSyncExternalStore = shimExports.useSyncExternalStore;
const defaultContext = /* @__PURE__ */ reactExports.createContext(void 0);
const QueryClientSharingContext = /* @__PURE__ */ reactExports.createContext(false);
function getQueryClientContext(context, contextSharing) {
  if (context) {
    return context;
  }
  if (contextSharing && typeof window !== "undefined") {
    if (!window.ReactQueryClientContext) {
      window.ReactQueryClientContext = defaultContext;
    }
    return window.ReactQueryClientContext;
  }
  return defaultContext;
}
const useQueryClient = ({
  context
} = {}) => {
  const queryClient2 = reactExports.useContext(getQueryClientContext(context, reactExports.useContext(QueryClientSharingContext)));
  if (!queryClient2) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return queryClient2;
};
const QueryClientProvider = ({
  client,
  children,
  context,
  contextSharing = false
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  const Context = getQueryClientContext(context, contextSharing);
  return /* @__PURE__ */ reactExports.createElement(QueryClientSharingContext.Provider, {
    value: !context && contextSharing
  }, /* @__PURE__ */ reactExports.createElement(Context.Provider, {
    value: client
  }, children));
};
const IsRestoringContext = /* @__PURE__ */ reactExports.createContext(false);
const useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
const QueryErrorResetBoundaryContext = /* @__PURE__ */ reactExports.createContext(createValue());
const useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
function shouldThrowError(_useErrorBoundary, params) {
  if (typeof _useErrorBoundary === "function") {
    return _useErrorBoundary(...params);
  }
  return !!_useErrorBoundary;
}
const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
  if (options.suspense || options.useErrorBoundary) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
const useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
const getHasError = ({
  result,
  errorResetBoundary,
  useErrorBoundary,
  query
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && shouldThrowError(useErrorBoundary, [result.error, query]);
};
const ensureStaleTime = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    if (typeof defaultedOptions.staleTime !== "number") {
      defaultedOptions.staleTime = 1e3;
    }
  }
};
const willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
const shouldSuspend = (defaultedOptions, result, isRestoring) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && willFetch(result, isRestoring);
const fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).then(({
  data
}) => {
  defaultedOptions.onSuccess == null ? void 0 : defaultedOptions.onSuccess(data);
  defaultedOptions.onSettled == null ? void 0 : defaultedOptions.onSettled(data, null);
}).catch((error) => {
  errorResetBoundary.clearReset();
  defaultedOptions.onError == null ? void 0 : defaultedOptions.onError(error);
  defaultedOptions.onSettled == null ? void 0 : defaultedOptions.onSettled(void 0, error);
});
function useBaseQuery(options, Observer) {
  const queryClient2 = useQueryClient({
    context: options.context
  });
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const defaultedOptions = queryClient2.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  if (defaultedOptions.onError) {
    defaultedOptions.onError = notifyManager.batchCalls(defaultedOptions.onError);
  }
  if (defaultedOptions.onSuccess) {
    defaultedOptions.onSuccess = notifyManager.batchCalls(defaultedOptions.onSuccess);
  }
  if (defaultedOptions.onSettled) {
    defaultedOptions.onSettled = notifyManager.batchCalls(defaultedOptions.onSettled);
  }
  ensureStaleTime(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary);
  useClearResetErrorBoundary(errorResetBoundary);
  const [observer] = reactExports.useState(() => new Observer(queryClient2, defaultedOptions));
  const result = observer.getOptimisticResult(defaultedOptions);
  useSyncExternalStore(reactExports.useCallback((onStoreChange) => isRestoring ? () => void 0 : observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions, {
      listeners: false
    });
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result, isRestoring)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    useErrorBoundary: defaultedOptions.useErrorBoundary,
    query: observer.getCurrentQuery()
  })) {
    throw result.error;
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(arg1, arg2, arg3) {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  return useBaseQuery(parsedOptions, QueryObserver);
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var sprintf = {};
(function(exports) {
  !function() {
    var re2 = {
      not_string: /[^s]/,
      not_bool: /[^t]/,
      not_type: /[^T]/,
      not_primitive: /[^v]/,
      number: /[diefg]/,
      numeric_arg: /[bcdiefguxX]/,
      json: /[j]/,
      not_json: /[^j]/,
      text: /^[^\x25]+/,
      modulo: /^\x25{2}/,
      placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
      key: /^([a-z_][a-z_\d]*)/i,
      key_access: /^\.([a-z_][a-z_\d]*)/i,
      index_access: /^\[(\d+)\]/,
      sign: /^[+-]/
    };
    function sprintf2(key) {
      return sprintf_format(sprintf_parse(key), arguments);
    }
    function vsprintf(fmt, argv) {
      return sprintf2.apply(null, [fmt].concat(argv || []));
    }
    function sprintf_format(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, arg, output = "", i, k2, ph2, pad, pad_character, pad_length, is_positive, sign;
      for (i = 0; i < tree_length; i++) {
        if (typeof parse_tree[i] === "string") {
          output += parse_tree[i];
        } else if (typeof parse_tree[i] === "object") {
          ph2 = parse_tree[i];
          if (ph2.keys) {
            arg = argv[cursor];
            for (k2 = 0; k2 < ph2.keys.length; k2++) {
              if (arg == void 0) {
                throw new Error(sprintf2('[sprintf] Cannot access property "%s" of undefined value "%s"', ph2.keys[k2], ph2.keys[k2 - 1]));
              }
              arg = arg[ph2.keys[k2]];
            }
          } else if (ph2.param_no) {
            arg = argv[ph2.param_no];
          } else {
            arg = argv[cursor++];
          }
          if (re2.not_type.test(ph2.type) && re2.not_primitive.test(ph2.type) && arg instanceof Function) {
            arg = arg();
          }
          if (re2.numeric_arg.test(ph2.type) && (typeof arg !== "number" && isNaN(arg))) {
            throw new TypeError(sprintf2("[sprintf] expecting number but found %T", arg));
          }
          if (re2.number.test(ph2.type)) {
            is_positive = arg >= 0;
          }
          switch (ph2.type) {
            case "b":
              arg = parseInt(arg, 10).toString(2);
              break;
            case "c":
              arg = String.fromCharCode(parseInt(arg, 10));
              break;
            case "d":
            case "i":
              arg = parseInt(arg, 10);
              break;
            case "j":
              arg = JSON.stringify(arg, null, ph2.width ? parseInt(ph2.width) : 0);
              break;
            case "e":
              arg = ph2.precision ? parseFloat(arg).toExponential(ph2.precision) : parseFloat(arg).toExponential();
              break;
            case "f":
              arg = ph2.precision ? parseFloat(arg).toFixed(ph2.precision) : parseFloat(arg);
              break;
            case "g":
              arg = ph2.precision ? String(Number(arg.toPrecision(ph2.precision))) : parseFloat(arg);
              break;
            case "o":
              arg = (parseInt(arg, 10) >>> 0).toString(8);
              break;
            case "s":
              arg = String(arg);
              arg = ph2.precision ? arg.substring(0, ph2.precision) : arg;
              break;
            case "t":
              arg = String(!!arg);
              arg = ph2.precision ? arg.substring(0, ph2.precision) : arg;
              break;
            case "T":
              arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
              arg = ph2.precision ? arg.substring(0, ph2.precision) : arg;
              break;
            case "u":
              arg = parseInt(arg, 10) >>> 0;
              break;
            case "v":
              arg = arg.valueOf();
              arg = ph2.precision ? arg.substring(0, ph2.precision) : arg;
              break;
            case "x":
              arg = (parseInt(arg, 10) >>> 0).toString(16);
              break;
            case "X":
              arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
              break;
          }
          if (re2.json.test(ph2.type)) {
            output += arg;
          } else {
            if (re2.number.test(ph2.type) && (!is_positive || ph2.sign)) {
              sign = is_positive ? "+" : "-";
              arg = arg.toString().replace(re2.sign, "");
            } else {
              sign = "";
            }
            pad_character = ph2.pad_char ? ph2.pad_char === "0" ? "0" : ph2.pad_char.charAt(1) : " ";
            pad_length = ph2.width - (sign + arg).length;
            pad = ph2.width ? pad_length > 0 ? pad_character.repeat(pad_length) : "" : "";
            output += ph2.align ? sign + arg + pad : pad_character === "0" ? sign + pad + arg : pad + sign + arg;
          }
        }
      }
      return output;
    }
    var sprintf_cache = /* @__PURE__ */ Object.create(null);
    function sprintf_parse(fmt) {
      if (sprintf_cache[fmt]) {
        return sprintf_cache[fmt];
      }
      var _fmt = fmt, match, parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = re2.text.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        } else if ((match = re2.modulo.exec(_fmt)) !== null) {
          parse_tree.push("%");
        } else if ((match = re2.placeholder.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = re2.key.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                if ((field_match = re2.key_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else if ((field_match = re2.index_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else {
                  throw new SyntaxError("[sprintf] failed to parse named argument key");
                }
              }
            } else {
              throw new SyntaxError("[sprintf] failed to parse named argument key");
            }
            match[2] = field_list;
          } else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
          }
          parse_tree.push(
            {
              placeholder: match[0],
              param_no: match[1],
              keys: match[2],
              sign: match[3],
              pad_char: match[4],
              align: match[5],
              width: match[6],
              precision: match[7],
              type: match[8]
            }
          );
        } else {
          throw new SyntaxError("[sprintf] unexpected placeholder");
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return sprintf_cache[fmt] = parse_tree;
    }
    {
      exports["sprintf"] = sprintf2;
      exports["vsprintf"] = vsprintf;
    }
    if (typeof window !== "undefined") {
      window["sprintf"] = sprintf2;
      window["vsprintf"] = vsprintf;
    }
  }();
})(sprintf);
var PRECEDENCE, OPENERS, TERMINATORS, PATTERN;
PRECEDENCE = {
  "(": 9,
  "!": 8,
  "*": 7,
  "/": 7,
  "%": 7,
  "+": 6,
  "-": 6,
  "<": 5,
  "<=": 5,
  ">": 5,
  ">=": 5,
  "==": 4,
  "!=": 4,
  "&&": 3,
  "||": 2,
  "?": 1,
  "?:": 1
};
OPENERS = ["(", "?"];
TERMINATORS = {
  ")": ["("],
  ":": ["?", "?:"]
};
PATTERN = /<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;
function postfix(expression) {
  var terms = [], stack = [], match, operator, term, element;
  while (match = expression.match(PATTERN)) {
    operator = match[0];
    term = expression.substr(0, match.index).trim();
    if (term) {
      terms.push(term);
    }
    while (element = stack.pop()) {
      if (TERMINATORS[operator]) {
        if (TERMINATORS[operator][0] === element) {
          operator = TERMINATORS[operator][1] || operator;
          break;
        }
      } else if (OPENERS.indexOf(element) >= 0 || PRECEDENCE[element] < PRECEDENCE[operator]) {
        stack.push(element);
        break;
      }
      terms.push(element);
    }
    if (!TERMINATORS[operator]) {
      stack.push(operator);
    }
    expression = expression.substr(match.index + operator.length);
  }
  expression = expression.trim();
  if (expression) {
    terms.push(expression);
  }
  return terms.concat(stack.reverse());
}
var OPERATORS = {
  "!": function(a) {
    return !a;
  },
  "*": function(a, b) {
    return a * b;
  },
  "/": function(a, b) {
    return a / b;
  },
  "%": function(a, b) {
    return a % b;
  },
  "+": function(a, b) {
    return a + b;
  },
  "-": function(a, b) {
    return a - b;
  },
  "<": function(a, b) {
    return a < b;
  },
  "<=": function(a, b) {
    return a <= b;
  },
  ">": function(a, b) {
    return a > b;
  },
  ">=": function(a, b) {
    return a >= b;
  },
  "==": function(a, b) {
    return a === b;
  },
  "!=": function(a, b) {
    return a !== b;
  },
  "&&": function(a, b) {
    return a && b;
  },
  "||": function(a, b) {
    return a || b;
  },
  "?:": function(a, b, c) {
    if (a) {
      throw b;
    }
    return c;
  }
};
function evaluate(postfix2, variables) {
  var stack = [], i, j, args, getOperatorResult, term, value;
  for (i = 0; i < postfix2.length; i++) {
    term = postfix2[i];
    getOperatorResult = OPERATORS[term];
    if (getOperatorResult) {
      j = getOperatorResult.length;
      args = Array(j);
      while (j--) {
        args[j] = stack.pop();
      }
      try {
        value = getOperatorResult.apply(null, args);
      } catch (earlyReturn) {
        return earlyReturn;
      }
    } else if (variables.hasOwnProperty(term)) {
      value = variables[term];
    } else {
      value = +term;
    }
    stack.push(value);
  }
  return stack[0];
}
function compile(expression) {
  var terms = postfix(expression);
  return function(variables) {
    return evaluate(terms, variables);
  };
}
function pluralForms(expression) {
  var evaluate2 = compile(expression);
  return function(n2) {
    return +evaluate2({ n: n2 });
  };
}
var DEFAULT_OPTIONS = {
  contextDelimiter: "",
  onMissingKey: null
};
function getPluralExpression(pf2) {
  var parts, i, part;
  parts = pf2.split(";");
  for (i = 0; i < parts.length; i++) {
    part = parts[i].trim();
    if (part.indexOf("plural=") === 0) {
      return part.substr(7);
    }
  }
}
function Tannin(data, options) {
  var key;
  this.data = data;
  this.pluralForms = {};
  this.options = {};
  for (key in DEFAULT_OPTIONS) {
    this.options[key] = options !== void 0 && key in options ? options[key] : DEFAULT_OPTIONS[key];
  }
}
Tannin.prototype.getPluralForm = function(domain, n2) {
  var getPluralForm = this.pluralForms[domain], config, plural, pf2;
  if (!getPluralForm) {
    config = this.data[domain][""];
    pf2 = config["Plural-Forms"] || config["plural-forms"] || // Ignore reason: As known, there's no way to document the empty
    // string property on a key to guarantee this as metadata.
    // @ts-ignore
    config.plural_forms;
    if (typeof pf2 !== "function") {
      plural = getPluralExpression(
        config["Plural-Forms"] || config["plural-forms"] || // Ignore reason: As known, there's no way to document the empty
        // string property on a key to guarantee this as metadata.
        // @ts-ignore
        config.plural_forms
      );
      pf2 = pluralForms(plural);
    }
    getPluralForm = this.pluralForms[domain] = pf2;
  }
  return getPluralForm(n2);
};
Tannin.prototype.dcnpgettext = function(domain, context, singular, plural, n2) {
  var index, key, entry;
  if (n2 === void 0) {
    index = 0;
  } else {
    index = this.getPluralForm(domain, n2);
  }
  key = singular;
  if (context) {
    key = context + this.options.contextDelimiter + singular;
  }
  entry = this.data[domain][key];
  if (entry && entry[index]) {
    return entry[index];
  }
  if (this.options.onMissingKey) {
    this.options.onMissingKey(singular, domain);
  }
  return index === 0 ? singular : plural;
};
const DEFAULT_LOCALE_DATA = {
  "": {
    /** @param {number} n */
    plural_forms(n2) {
      return n2 === 1 ? 0 : 1;
    }
  }
};
const I18N_HOOK_REGEXP = /^i18n\.(n?gettext|has_translation)(_|$)/;
const createI18n = (initialData, initialDomain, hooks) => {
  const tannin = new Tannin({});
  const listeners = /* @__PURE__ */ new Set();
  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };
  const subscribe = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };
  const getLocaleData = function() {
    let domain = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "default";
    return tannin.data[domain];
  };
  const doSetLocaleData = function(data) {
    var _tannin$data$domain;
    let domain = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "default";
    tannin.data[domain] = {
      ...tannin.data[domain],
      ...data
    };
    tannin.data[domain][""] = {
      ...DEFAULT_LOCALE_DATA[""],
      ...(_tannin$data$domain = tannin.data[domain]) === null || _tannin$data$domain === void 0 ? void 0 : _tannin$data$domain[""]
    };
    delete tannin.pluralForms[domain];
  };
  const setLocaleData = (data, domain) => {
    doSetLocaleData(data, domain);
    notifyListeners();
  };
  const addLocaleData = function(data) {
    var _tannin$data$domain2;
    let domain = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "default";
    tannin.data[domain] = {
      ...tannin.data[domain],
      ...data,
      // Populate default domain configuration (supported locale date which omits
      // a plural forms expression).
      "": {
        ...DEFAULT_LOCALE_DATA[""],
        ...(_tannin$data$domain2 = tannin.data[domain]) === null || _tannin$data$domain2 === void 0 ? void 0 : _tannin$data$domain2[""],
        ...data === null || data === void 0 ? void 0 : data[""]
      }
    };
    delete tannin.pluralForms[domain];
    notifyListeners();
  };
  const resetLocaleData = (data, domain) => {
    tannin.data = {};
    tannin.pluralForms = {};
    setLocaleData(data, domain);
  };
  const dcnpgettext = function() {
    let domain = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "default";
    let context = arguments.length > 1 ? arguments[1] : void 0;
    let single = arguments.length > 2 ? arguments[2] : void 0;
    let plural = arguments.length > 3 ? arguments[3] : void 0;
    let number = arguments.length > 4 ? arguments[4] : void 0;
    if (!tannin.data[domain]) {
      doSetLocaleData(void 0, domain);
    }
    return tannin.dcnpgettext(domain, context, single, plural, number);
  };
  const getFilterDomain = function() {
    let domain = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "default";
    return domain;
  };
  const __ = (text, domain) => {
    let translation = dcnpgettext(domain, void 0, text);
    if (!hooks) {
      return translation;
    }
    translation = /** @type {string} */
    /** @type {*} */
    hooks.applyFilters("i18n.gettext", translation, text, domain);
    return (
      /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.gettext_" + getFilterDomain(domain), translation, text, domain)
    );
  };
  const _x = (text, context, domain) => {
    let translation = dcnpgettext(domain, context, text);
    if (!hooks) {
      return translation;
    }
    translation = /** @type {string} */
    /** @type {*} */
    hooks.applyFilters("i18n.gettext_with_context", translation, text, context, domain);
    return (
      /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.gettext_with_context_" + getFilterDomain(domain), translation, text, context, domain)
    );
  };
  const _n = (single, plural, number, domain) => {
    let translation = dcnpgettext(domain, void 0, single, plural, number);
    if (!hooks) {
      return translation;
    }
    translation = /** @type {string} */
    /** @type {*} */
    hooks.applyFilters("i18n.ngettext", translation, single, plural, number, domain);
    return (
      /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.ngettext_" + getFilterDomain(domain), translation, single, plural, number, domain)
    );
  };
  const _nx = (single, plural, number, context, domain) => {
    let translation = dcnpgettext(domain, context, single, plural, number);
    if (!hooks) {
      return translation;
    }
    translation = /** @type {string} */
    /** @type {*} */
    hooks.applyFilters("i18n.ngettext_with_context", translation, single, plural, number, context, domain);
    return (
      /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.ngettext_with_context_" + getFilterDomain(domain), translation, single, plural, number, context, domain)
    );
  };
  const isRTL = () => {
    return "rtl" === _x("ltr", "text direction");
  };
  const hasTranslation = (single, context, domain) => {
    var _tannin$data, _tannin$data2;
    const key = context ? context + "" + single : single;
    let result = !!((_tannin$data = tannin.data) !== null && _tannin$data !== void 0 && (_tannin$data2 = _tannin$data[domain !== null && domain !== void 0 ? domain : "default"]) !== null && _tannin$data2 !== void 0 && _tannin$data2[key]);
    if (hooks) {
      result = /** @type { boolean } */
      /** @type {*} */
      hooks.applyFilters("i18n.has_translation", result, single, context, domain);
      result = /** @type { boolean } */
      /** @type {*} */
      hooks.applyFilters("i18n.has_translation_" + getFilterDomain(domain), result, single, context, domain);
    }
    return result;
  };
  if (initialData) {
    setLocaleData(initialData, initialDomain);
  }
  if (hooks) {
    const onHookAddedOrRemoved = (hookName) => {
      if (I18N_HOOK_REGEXP.test(hookName)) {
        notifyListeners();
      }
    };
    hooks.addAction("hookAdded", "core/i18n", onHookAddedOrRemoved);
    hooks.addAction("hookRemoved", "core/i18n", onHookAddedOrRemoved);
  }
  return {
    getLocaleData,
    setLocaleData,
    addLocaleData,
    resetLocaleData,
    subscribe,
    __,
    _x,
    _n,
    _nx,
    isRTL,
    hasTranslation
  };
};
function validateNamespace(namespace) {
  if ("string" !== typeof namespace || "" === namespace) {
    console.error("The namespace must be a non-empty string.");
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(namespace)) {
    console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes.");
    return false;
  }
  return true;
}
function validateHookName(hookName) {
  if ("string" !== typeof hookName || "" === hookName) {
    console.error("The hook name must be a non-empty string.");
    return false;
  }
  if (/^__/.test(hookName)) {
    console.error("The hook name cannot begin with `__`.");
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(hookName)) {
    console.error("The hook name can only contain numbers, letters, dashes, periods and underscores.");
    return false;
  }
  return true;
}
function createAddHook(hooks, storeKey) {
  return function addHook(hookName, namespace, callback) {
    let priority = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 10;
    const hooksStore = hooks[storeKey];
    if (!validateHookName(hookName)) {
      return;
    }
    if (!validateNamespace(namespace)) {
      return;
    }
    if ("function" !== typeof callback) {
      console.error("The hook callback must be a function.");
      return;
    }
    if ("number" !== typeof priority) {
      console.error("If specified, the hook priority must be a number.");
      return;
    }
    const handler = {
      callback,
      priority,
      namespace
    };
    if (hooksStore[hookName]) {
      const handlers = hooksStore[hookName].handlers;
      let i;
      for (i = handlers.length; i > 0; i--) {
        if (priority >= handlers[i - 1].priority) {
          break;
        }
      }
      if (i === handlers.length) {
        handlers[i] = handler;
      } else {
        handlers.splice(i, 0, handler);
      }
      hooksStore.__current.forEach((hookInfo) => {
        if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
          hookInfo.currentIndex++;
        }
      });
    } else {
      hooksStore[hookName] = {
        handlers: [handler],
        runs: 0
      };
    }
    if (hookName !== "hookAdded") {
      hooks.doAction("hookAdded", hookName, namespace, callback, priority);
    }
  };
}
function createRemoveHook(hooks, storeKey) {
  let removeAll = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  return function removeHook(hookName, namespace) {
    const hooksStore = hooks[storeKey];
    if (!validateHookName(hookName)) {
      return;
    }
    if (!removeAll && !validateNamespace(namespace)) {
      return;
    }
    if (!hooksStore[hookName]) {
      return 0;
    }
    let handlersRemoved = 0;
    if (removeAll) {
      handlersRemoved = hooksStore[hookName].handlers.length;
      hooksStore[hookName] = {
        runs: hooksStore[hookName].runs,
        handlers: []
      };
    } else {
      const handlers = hooksStore[hookName].handlers;
      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].namespace === namespace) {
          handlers.splice(i, 1);
          handlersRemoved++;
          hooksStore.__current.forEach((hookInfo) => {
            if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
              hookInfo.currentIndex--;
            }
          });
        }
      }
    }
    if (hookName !== "hookRemoved") {
      hooks.doAction("hookRemoved", hookName, namespace);
    }
    return handlersRemoved;
  };
}
function createHasHook(hooks, storeKey) {
  return function hasHook(hookName, namespace) {
    const hooksStore = hooks[storeKey];
    if ("undefined" !== typeof namespace) {
      return hookName in hooksStore && hooksStore[hookName].handlers.some((hook) => hook.namespace === namespace);
    }
    return hookName in hooksStore;
  };
}
function createRunHook(hooks, storeKey) {
  let returnFirstArg = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  return function runHooks(hookName) {
    const hooksStore = hooks[storeKey];
    if (!hooksStore[hookName]) {
      hooksStore[hookName] = {
        handlers: [],
        runs: 0
      };
    }
    hooksStore[hookName].runs++;
    const handlers = hooksStore[hookName].handlers;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (!handlers || !handlers.length) {
      return returnFirstArg ? args[0] : void 0;
    }
    const hookInfo = {
      name: hookName,
      currentIndex: 0
    };
    hooksStore.__current.push(hookInfo);
    while (hookInfo.currentIndex < handlers.length) {
      const handler = handlers[hookInfo.currentIndex];
      const result = handler.callback.apply(null, args);
      if (returnFirstArg) {
        args[0] = result;
      }
      hookInfo.currentIndex++;
    }
    hooksStore.__current.pop();
    if (returnFirstArg) {
      return args[0];
    }
  };
}
function createCurrentHook(hooks, storeKey) {
  return function currentHook() {
    var _hooksStore$__current, _hooksStore$__current2;
    const hooksStore = hooks[storeKey];
    return (_hooksStore$__current = (_hooksStore$__current2 = hooksStore.__current[hooksStore.__current.length - 1]) === null || _hooksStore$__current2 === void 0 ? void 0 : _hooksStore$__current2.name) !== null && _hooksStore$__current !== void 0 ? _hooksStore$__current : null;
  };
}
function createDoingHook(hooks, storeKey) {
  return function doingHook(hookName) {
    const hooksStore = hooks[storeKey];
    if ("undefined" === typeof hookName) {
      return "undefined" !== typeof hooksStore.__current[0];
    }
    return hooksStore.__current[0] ? hookName === hooksStore.__current[0].name : false;
  };
}
function createDidHook(hooks, storeKey) {
  return function didHook(hookName) {
    const hooksStore = hooks[storeKey];
    if (!validateHookName(hookName)) {
      return;
    }
    return hooksStore[hookName] && hooksStore[hookName].runs ? hooksStore[hookName].runs : 0;
  };
}
class _Hooks {
  constructor() {
    this.actions = /* @__PURE__ */ Object.create(null);
    this.actions.__current = [];
    this.filters = /* @__PURE__ */ Object.create(null);
    this.filters.__current = [];
    this.addAction = createAddHook(this, "actions");
    this.addFilter = createAddHook(this, "filters");
    this.removeAction = createRemoveHook(this, "actions");
    this.removeFilter = createRemoveHook(this, "filters");
    this.hasAction = createHasHook(this, "actions");
    this.hasFilter = createHasHook(this, "filters");
    this.removeAllActions = createRemoveHook(this, "actions", true);
    this.removeAllFilters = createRemoveHook(this, "filters", true);
    this.doAction = createRunHook(this, "actions");
    this.applyFilters = createRunHook(this, "filters", true);
    this.currentAction = createCurrentHook(this, "actions");
    this.currentFilter = createCurrentHook(this, "filters");
    this.doingAction = createDoingHook(this, "actions");
    this.doingFilter = createDoingHook(this, "filters");
    this.didAction = createDidHook(this, "actions");
    this.didFilter = createDidHook(this, "filters");
  }
}
function createHooks() {
  return new _Hooks();
}
const defaultHooks = createHooks();
const i18n = createI18n(void 0, void 0, defaultHooks);
i18n.getLocaleData.bind(i18n);
i18n.setLocaleData.bind(i18n);
i18n.resetLocaleData.bind(i18n);
i18n.subscribe.bind(i18n);
i18n.__.bind(i18n);
i18n._x.bind(i18n);
i18n._n.bind(i18n);
i18n._nx.bind(i18n);
i18n.isRTL.bind(i18n);
i18n.hasTranslation.bind(i18n);
function makeContextValue(i18n2) {
  return {
    __: i18n2.__.bind(i18n2),
    _x: i18n2._x.bind(i18n2),
    _n: i18n2._n.bind(i18n2),
    _nx: i18n2._nx.bind(i18n2),
    isRTL: i18n2.isRTL.bind(i18n2),
    hasTranslation: i18n2.hasTranslation.bind(i18n2)
  };
}
const I18nContext = reactExports.createContext(makeContextValue(i18n));
const useI18n = () => reactExports.useContext(I18nContext);
function withI18n(InnerComponent) {
  const EnhancedComponent = (props) => {
    const i18nProps = useI18n();
    return reactExports.createElement(InnerComponent, _extends({}, props, i18nProps));
  };
  const innerComponentName = InnerComponent.displayName || InnerComponent.name || "Component";
  EnhancedComponent.displayName = `WithI18n(${innerComponentName})`;
  return EnhancedComponent;
}
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db2) => callback(db2.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function update(key, updater, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => (
    // Need to create the promise manually.
    // If I try to chain promises, the transaction closes in browsers
    // that use a promise polyfill (IE10/11).
    new Promise((resolve, reject) => {
      store.get(key).onsuccess = function() {
        try {
          store.put(updater(this.result), key);
          resolve(promisifyRequest(store.transaction));
        } catch (err) {
          reject(err);
        }
      };
    })
  ));
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
async function fetchData(slug) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    if (result.ok) {
      return await result.json();
    }
    return void 0;
  } catch (error) {
    return false;
  }
}
async function postFetch(slug, object) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include",
      body: JSON.stringify(object)
    });
    return result;
  } catch (error) {
    return false;
  }
}
async function setModule(slug, object) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1/module/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include",
      body: JSON.stringify(object)
    });
    return result;
  } catch (error) {
    return false;
  }
}
async function fetchSettings(slug) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1/settings/${slug}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    return await result.json();
  } catch (error) {
    return false;
  }
}
async function setSettings(slug, object) {
  try {
    const result = await fetch(wpApiSettings.root + `urlslab/v1/settings/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include",
      body: JSON.stringify(object)
    });
    return result;
  } catch (error) {
    return false;
  }
}
const urlInTextRegex = /(((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#?]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?)/;
const renameModule = (moduleId) => {
  if (moduleId) {
    const name = moduleId.replace("urlslab", "");
    return name.replace(/-(\w)|^(\w)/g, (char) => char.replace("-", "").toUpperCase());
  }
};
const delay = (fn, ms) => {
  let timer = 0;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
};
const parseURL = (string) => {
  if (string.length) {
    return string.replace(urlInTextRegex, '<a href="$1" target="_blank">$1</a>');
  }
};
const langName = (langcode) => {
  const lang = new Intl.DisplayNames(["en"], { type: "language" });
  if (langcode) {
    return lang.of(langcode);
  }
  return null;
};
const getParamsChar = () => {
  if (wpApiSettings.root.indexOf("?") > -1) {
    return "&";
  }
  return "?";
};
async function fetchLangs() {
  const langPairs = {};
  try {
    const response = await fetch(wpApiSettings.root + "urlslab/v1/language" + getParamsChar() + "rows_per_page=1000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include"
    });
    if (response.ok) {
      const langs = await response.json();
      if (langs == null ? void 0 : langs.length) {
        langs.forEach((lang) => {
          langPairs[lang.code] = langName(lang.code);
        });
        return langPairs;
      }
    }
  } catch (error) {
    return false;
  }
}
const HeaderHeightContext = reactExports.createContext({
  headerTopHeight: 58,
  setHeaderTopHeight: () => {
  },
  headerBottomHeight: 51.5,
  setHeaderBottomHeight: () => {
  }
});
function hexToHSL(H2) {
  let r2 = 0, g = 0, b = 0;
  if ((H2 == null ? void 0 : H2.length) === 4) {
    r2 = "0x" + H2[1] + H2[1];
    g = "0x" + H2[2] + H2[2];
    b = "0x" + H2[3] + H2[3];
  } else if ((H2 == null ? void 0 : H2.length) === 7) {
    r2 = "0x" + H2[1] + H2[2];
    g = "0x" + H2[3] + H2[4];
    b = "0x" + H2[5] + H2[6];
  }
  r2 /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r2, g, b);
  const cmax = Math.max(r2, g, b);
  const delta = cmax - cmin;
  let h2 = 0, s = 0, l2 = 0;
  if (delta === 0) {
    h2 = 0;
  } else if (cmax === r2) {
    h2 = (g - b) / delta % 6;
  } else if (cmax === g) {
    h2 = (b - r2) / delta + 2;
  } else {
    h2 = (r2 - g) / delta + 4;
  }
  h2 = Math.round(h2 * 60);
  if (h2 < 0) {
    h2 += 360;
  }
  l2 = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l2 - 1));
  s = +(s * 100).toFixed(1);
  l2 = +(l2 * 100).toFixed(1);
  return { hsl: "hsl(" + h2 + "," + s + "%," + l2 + "%)", hue: h2, saturation: s, lightness: l2 };
}
const SvgArrowSimple = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 7 12", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M1.707,11.707L6.707,6.707C7.098,6.317 7.098,5.683 6.707,5.293L1.707,0.293C1.317,-0.097 0.683,-0.097 0.293,0.293C-0.097,0.683 -0.097,1.317 0.293,1.707L4.586,6C4.586,6 0.293,10.293 0.293,10.293C-0.097,10.683 -0.097,11.317 0.293,11.707C0.683,12.097 1.317,12.097 1.707,11.707Z" }));
const SvgMenuIconModules = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", null, /* @__PURE__ */ reactExports.createElement("path", { d: "M3.7,2.2C3.325,2.2 2.935,2.365 2.65,2.65C2.365,2.935 2.2,3.325 2.2,3.7L2.2,9.4C2.2,9.775 2.365,10.165 2.65,10.45C2.935,10.735 3.325,10.9 3.7,10.9C3.7,10.9 7.6,10.9 7.6,10.9C7.975,10.9 8.365,10.735 8.65,10.45C8.935,10.165 9.1,9.775 9.1,9.4L9.1,3.7C9.1,3.259 8.922,2.896 8.687,2.65L8.687,2.65C8.466,2.418 8.135,2.2 7.6,2.2L3.7,2.2ZM4.2,4.2L4.2,8.9L7.1,8.9L7.1,4.2L4.2,4.2Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M12.4,9.1C12.025,9.1 11.635,9.265 11.35,9.55C11.066,9.835 10.9,10.225 10.9,10.6L10.9,16.3C10.9,16.675 11.066,17.065 11.35,17.35C11.635,17.635 12.025,17.8 12.4,17.8L16.3,17.8C16.676,17.8 17.066,17.635 17.35,17.35C17.635,17.065 17.8,16.675 17.8,16.3L17.8,10.6C17.8,10.225 17.635,9.835 17.35,9.55C17.066,9.265 16.676,9.1 16.3,9.1L12.4,9.1ZM12.9,11.1L12.9,15.8L15.8,15.8L15.8,11.1L12.9,11.1Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M12.4,2.2C12.025,2.2 11.635,2.365 11.35,2.65C11.066,2.935 10.9,3.325 10.9,3.7L10.9,5.9C10.9,6.275 11.066,6.665 11.35,6.95C11.635,7.235 12.025,7.4 12.4,7.4L16.3,7.4C16.676,7.4 17.066,7.235 17.35,6.95C17.635,6.665 17.8,6.275 17.8,5.9L17.8,3.7C17.8,3.325 17.635,2.935 17.35,2.65C17.066,2.365 16.676,2.2 16.3,2.2L12.4,2.2ZM12.9,4.2L12.9,5.4L15.8,5.4L15.8,4.2L12.9,4.2Z" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M3.7,12.6C3.325,12.6 2.935,12.765 2.65,13.05C2.365,13.334 2.2,13.724 2.2,14.1L2.2,16.3C2.2,16.675 2.365,17.065 2.65,17.35C2.935,17.634 3.325,17.8 3.7,17.8C3.7,17.8 7.6,17.8 7.6,17.8C7.975,17.8 8.365,17.634 8.65,17.35C8.935,17.065 9.1,16.675 9.1,16.3C9.1,16.3 9.1,14.1 9.1,14.1C9.1,13.659 8.922,13.295 8.688,13.05L8.688,13.05C8.466,12.818 8.135,12.6 7.6,12.6L3.7,12.6ZM4.2,14.6L4.2,15.8L7.1,15.8L7.1,14.6L4.2,14.6Z" })));
const SvgMenuIconSettings = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", null, /* @__PURE__ */ reactExports.createElement("g", null, /* @__PURE__ */ reactExports.createElement("path", { d: "M6.687,3.536C6.472,3.647 6.263,3.768 6.061,3.9L4.491,3.268C4.485,3.266 4.479,3.263 4.473,3.261C4.159,3.142 3.814,3.137 3.498,3.248C3.182,3.358 2.915,3.577 2.744,3.865L1.067,6.765C0.901,7.053 0.84,7.391 0.897,7.72C0.954,8.049 1.125,8.348 1.38,8.564L2.743,9.635C2.736,9.754 2.732,9.876 2.732,9.999L2.749,10.371L1.41,11.422C1.403,11.428 1.397,11.433 1.39,11.439C1.131,11.653 0.956,11.953 0.897,12.285C0.838,12.616 0.898,12.958 1.067,13.249C1.066,13.247 2.737,16.137 2.737,16.137C2.739,16.141 2.741,16.144 2.743,16.147C2.914,16.435 3.181,16.654 3.497,16.764C3.814,16.874 4.159,16.869 4.472,16.75L6.058,16.112C6.261,16.245 6.471,16.368 6.687,16.48L6.922,18.152C6.925,18.173 6.928,18.194 6.933,18.214C6.998,18.534 7.171,18.821 7.422,19.029C7.672,19.237 7.987,19.354 8.312,19.359L11.692,19.359C12.024,19.352 12.343,19.23 12.595,19.014C12.847,18.797 13.016,18.501 13.073,18.174L13.314,16.464C13.529,16.353 13.737,16.232 13.94,16.1L15.51,16.732C15.516,16.734 15.522,16.737 15.529,16.739C15.842,16.858 16.186,16.863 16.503,16.752C16.819,16.642 17.086,16.423 17.257,16.135L18.933,13.235C19.101,12.945 19.162,12.604 19.102,12.273C19.043,11.941 18.869,11.642 18.61,11.427L17.254,10.364C17.261,10.245 17.265,10.125 17.265,10.006L17.249,9.631L18.591,8.578C18.597,8.572 18.604,8.567 18.611,8.561C18.87,8.346 19.045,8.047 19.104,7.715C19.163,7.384 19.102,7.042 18.933,6.751C18.934,6.754 17.264,3.863 17.264,3.863C17.262,3.859 17.26,3.856 17.258,3.852C17.087,3.565 16.819,3.346 16.503,3.236C16.187,3.126 15.842,3.131 15.529,3.25L13.943,3.888C13.74,3.755 13.53,3.632 13.314,3.52L13.079,1.848C13.076,1.827 13.072,1.806 13.068,1.785C13.002,1.466 12.83,1.179 12.579,0.971C12.328,0.763 12.014,0.646 11.688,0.641L8.308,0.641C7.976,0.648 7.657,0.77 7.405,0.986C7.405,0.986 7.405,0.986 7.405,0.986C7.153,1.203 6.985,1.5 6.927,1.827L6.687,3.536ZM8.832,2.64L11.171,2.641L11.361,3.997C11.399,4.263 11.503,4.515 11.662,4.731C11.821,4.947 12.031,5.12 12.273,5.235C12.512,5.351 12.746,5.488 12.968,5.643C12.969,5.644 12.969,5.644 12.97,5.645C13.192,5.798 13.447,5.895 13.715,5.925C13.983,5.955 14.254,5.919 14.505,5.818L15.786,5.302L16.952,7.321L15.861,8.177C15.648,8.345 15.481,8.564 15.374,8.813C15.373,8.813 15.373,8.813 15.373,8.814C15.266,9.063 15.223,9.335 15.248,9.605L15.266,9.997C15.264,10.223 15.247,10.448 15.216,10.672C15.166,11.025 15.308,11.379 15.589,11.599L16.951,12.668L15.784,14.686L14.503,14.17C14.502,14.17 14.501,14.169 14.499,14.169C14.249,14.069 13.978,14.033 13.71,14.064C13.442,14.095 13.186,14.192 12.965,14.346C12.744,14.498 12.507,14.637 12.26,14.756C12.259,14.756 12.259,14.757 12.258,14.757C12.019,14.873 11.812,15.047 11.655,15.262C11.499,15.478 11.397,15.729 11.361,15.993L11.169,17.36L8.83,17.359L8.639,16.002C8.601,15.737 8.498,15.485 8.339,15.269C8.339,15.269 8.339,15.269 8.339,15.269C8.179,15.053 7.969,14.88 7.727,14.764C7.489,14.649 7.255,14.512 7.033,14.357C7.032,14.357 7.032,14.356 7.031,14.356C6.81,14.202 6.553,14.105 6.285,14.075C6.017,14.045 5.746,14.081 5.496,14.182L4.215,14.698L3.048,12.679L4.142,11.82C4.354,11.652 4.521,11.433 4.627,11.184C4.733,10.935 4.776,10.663 4.75,10.393C4.739,10.267 4.732,10.133 4.732,9.999L4.751,9.601C4.774,9.332 4.729,9.062 4.622,8.815C4.622,8.815 4.622,8.815 4.622,8.815C4.514,8.568 4.347,8.351 4.135,8.185L3.049,7.333L4.216,5.314L5.497,5.83C5.499,5.83 5.5,5.831 5.501,5.831C5.752,5.931 6.023,5.967 6.291,5.936C6.558,5.905 6.814,5.808 7.035,5.654C7.257,5.502 7.494,5.363 7.741,5.244C7.742,5.243 7.742,5.243 7.742,5.243C7.982,5.127 8.189,4.953 8.346,4.738C8.346,4.737 8.346,4.737 8.346,4.737C8.502,4.522 8.603,4.271 8.64,4.007L8.832,2.64ZM10.346,6.517C10.345,6.517 10.345,6.517 10.344,6.517C9.626,6.446 8.904,6.599 8.276,6.954C7.648,7.31 7.145,7.851 6.837,8.503C6.528,9.155 6.428,9.887 6.552,10.598C6.675,11.309 7.015,11.965 7.525,12.475C7.525,12.475 7.525,12.475 7.525,12.475C8.036,12.985 8.691,13.325 9.402,13.448C10.113,13.572 10.845,13.472 11.497,13.164C12.149,12.855 12.69,12.352 13.046,11.725C13.046,11.725 13.046,11.724 13.046,11.724C13.401,11.097 13.554,10.374 13.483,9.656C13.483,9.655 13.483,9.655 13.483,9.654C13.402,8.85 13.046,8.098 12.474,7.526C11.902,6.954 11.15,6.598 10.346,6.517ZM10.147,8.507C10.492,8.542 10.815,8.695 11.06,8.94C11.06,8.94 11.06,8.94 11.06,8.94C11.305,9.186 11.458,9.508 11.493,9.853C11.523,10.161 11.458,10.47 11.306,10.739C11.153,11.008 10.921,11.224 10.642,11.356C10.642,11.356 10.642,11.356 10.642,11.356C10.362,11.488 10.049,11.531 9.744,11.478C9.744,11.478 9.744,11.478 9.744,11.478C9.439,11.425 9.158,11.279 8.94,11.061C8.721,10.842 8.575,10.561 8.522,10.256C8.522,10.256 8.522,10.256 8.522,10.256C8.47,9.952 8.512,9.638 8.644,9.359C8.644,9.358 8.644,9.358 8.644,9.358C8.777,9.079 8.992,8.847 9.261,8.695C9.261,8.695 9.261,8.695 9.261,8.695C9.53,8.542 9.84,8.477 10.147,8.507L10.147,8.507Z" }))));
const _MainMenu = "";
function MainMenu({ activeModule, modules, activePage, module }) {
  const { __ } = useI18n();
  const mainmenu = reactExports.useRef();
  const [activeId, setActive] = reactExports.useState(module || "urlslab-modules");
  const activeModules = (modules == null ? void 0 : modules.length) ? modules.filter((mod) => mod.active) : [];
  const handleMainMenu = () => {
    const menuState = mainmenu.current.classList.contains("open");
    if (menuState) {
      del("urlslab-mainmenu").then(() => {
        mainmenu.current.classList.remove("open");
      });
    }
    if (!menuState) {
      set("urlslab-mainmenu", "open").then(() => {
        mainmenu.current.classList.add("open");
      });
    }
  };
  const activator = (moduleId) => {
    if (!moduleId) {
      return "";
    }
    if (moduleId === activeId || moduleId === activeModule) {
      return "active";
    }
  };
  const handleActive = (mod) => {
    setActive(mod);
    if (activePage) {
      activePage(mod);
    }
  };
  reactExports.useEffect(() => {
    get("urlslab-mainmenu").then(
      (val) => {
        if (val === "open" || window.matchMedia("(min-width: 1600px)").matches) {
          mainmenu.current.classList.add("open");
        }
      }
    );
  });
  return /* @__PURE__ */ React.createElement("nav", { className: `urlslab-mainmenu`, ref: mainmenu }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: (event) => handleMainMenu(),
      className: "urlslab-mainmenu-title"
    },
    /* @__PURE__ */ React.createElement("div", { className: "inn" }, /* @__PURE__ */ React.createElement(SvgArrowSimple, null), __("Menu"))
  ), /* @__PURE__ */ React.createElement("div", { className: "urlslab-mainmenu-main flex" }, /* @__PURE__ */ React.createElement("ul", { className: "urlslab-mainmenu-menu" }, /* @__PURE__ */ React.createElement(
    "li",
    {
      key: "urlslab-modules-main",
      className: `urlslab-mainmenu-item urlslab-modules has-icon ${activator("urlslab-modules")}`
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn has-icon",
        onClick: () => handleActive("urlslab-modules")
      },
      /* @__PURE__ */ React.createElement(SvgMenuIconModules, null),
      /* @__PURE__ */ React.createElement("span", null, __("Modules"))
    )
  ), /* @__PURE__ */ React.createElement("li", { className: "urlslab-mainmenu-item submenu" }, /* @__PURE__ */ React.createElement("ul", { className: "urlslab-mainmenu-submenu", style: { "--activeModules": activeModules.length + 1 } }, /* @__PURE__ */ React.createElement(
    "li",
    {
      key: "urlslab-modules",
      className: `urlslab-mainmenu-item ${activator("urlslab-modules")}`
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn",
        onClick: () => handleActive("urlslab-modules")
      },
      /* @__PURE__ */ React.createElement("span", null, __("All modules"))
    )
  ), modules.length ? modules.map((modul) => {
    return modul.active ? /* @__PURE__ */ React.createElement("li", { key: modul.id, className: `urlslab-mainmenu-item ${activator(modul.id)}` }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn",
        onClick: () => handleActive(modul.id)
      },
      /* @__PURE__ */ React.createElement("span", null, modul.title)
    )) : "";
  }) : "")), /* @__PURE__ */ React.createElement(
    "li",
    {
      key: "urlslab-settings-main",
      className: `urlslab-mainmenu-item urlslab-settings has-icon ${activator("urlslab-settings")}`
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn has-icon",
        onClick: () => handleActive("urlslab-settings")
      },
      /* @__PURE__ */ React.createElement(SvgMenuIconSettings, null),
      /* @__PURE__ */ React.createElement("span", null, __("Settings"))
    )
  ), /* @__PURE__ */ React.createElement("li", { className: "urlslab-mainmenu-item submenu" }, /* @__PURE__ */ React.createElement("ul", { className: "urlslab-mainmenu-submenu" }, /* @__PURE__ */ React.createElement(
    "li",
    {
      key: "urlslab-settings",
      className: `urlslab-mainmenu-item ${activator("urlslab-settings")}`
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn",
        onClick: () => handleActive("urlslab-settings")
      },
      /* @__PURE__ */ React.createElement("span", null, __("General settings"))
    )
  ), /* @__PURE__ */ React.createElement(
    "li",
    {
      key: "urlslab-schedule",
      className: `urlslab-mainmenu-item ${activator("urlslab-schedule")}`
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn",
        onClick: () => handleActive("urlslab-schedule")
      },
      /* @__PURE__ */ React.createElement("span", null, __("Schedules"))
    )
  ), /* @__PURE__ */ React.createElement(
    "li",
    {
      key: "TagsLabels",
      className: `urlslab-mainmenu-item ${activator("TagsLabels")}`
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "urlslab-mainmenu-btn",
        onClick: () => handleActive("TagsLabels")
      },
      /* @__PURE__ */ React.createElement("span", null, __("Tags"))
    )
  ))))));
}
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep, importerUrl);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v2 = glob[path];
  if (v2) {
    return typeof v2 === "function" ? v2() : Promise.resolve(v2);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    if (this.state.errorInfo) {
      return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, this.props.__("Something went wrong.")), /* @__PURE__ */ React.createElement("details", { style: { whiteSpace: "pre-wrap" } }, this.state.error && this.state.error.toString(), /* @__PURE__ */ React.createElement("br", null), this.state.errorInfo.componentStack));
    }
    return this.props.children;
  }
}
const ErrorBoundary$1 = withI18n(ErrorBoundary);
const SvgAjaxLoader = (props) => /* @__PURE__ */ reactExports.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", width: "48px", height: "48px", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", ...props }, /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(79,50)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(0)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 1 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.875s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.875s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(70.50609665440987,70.50609665440987)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(45)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.875 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.75s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.75s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(50,79)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(90)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.75 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.625s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.625s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(29.493903345590123,70.50609665440987)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(135)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.625 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.5s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.5s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(21,50)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(180)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.5 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.375s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.375s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(29.493903345590116,29.493903345590123)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(225)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.375 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.25s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.25s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(49.99999999999999,21)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(270)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.25 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.125s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "-0.125s" })))), /* @__PURE__ */ reactExports.createElement("g", { transform: "translate(70.50609665440987,29.493903345590116)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "rotate(315)" }, /* @__PURE__ */ reactExports.createElement("circle", { cx: 0, cy: 0, r: 6, fill: "#000000", fillOpacity: 0.125 }, /* @__PURE__ */ reactExports.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "0s", values: "1.12 1.12;1 1", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" }), /* @__PURE__ */ reactExports.createElement("animate", { attributeName: "fill-opacity", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite", values: "1;0", begin: "0s" })))));
const _Loader = "";
function Loader({ children, className }) {
  const { __ } = useI18n();
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-loader ${className || ""}` }, /* @__PURE__ */ React.createElement(SvgAjaxLoader, { className: "urlslab-loader-anim" }), /* @__PURE__ */ React.createElement("span", { className: "urlslab-loader-text" }, children ? children : __("Loading…")));
}
const _DynamicModule = "";
function DynamicModule({ modules, moduleId, activePage }) {
  const importPath = __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../modules/Cache.jsx": () => __vitePreload(() => import("./assets/Cache-5r8qef65wm.js"), true ? ["./assets/Cache-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/CssOptimizer.jsx": () => __vitePreload(() => import("./assets/CssOptimizer-5r8qef65wm.js"), true ? ["./assets/CssOptimizer-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Generator.jsx": () => __vitePreload(() => import("./assets/Generator-5r8qef65wm.js"), true ? ["./assets/Generator-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/ImageAltAttribute.jsx": () => __vitePreload(() => import("./assets/ImageAltAttribute-5r8qef65wm.js"), true ? ["./assets/ImageAltAttribute-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/KeywordsLinks.jsx": () => __vitePreload(() => import("./assets/KeywordsLinks-5r8qef65wm.js"), true ? ["./assets/KeywordsLinks-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/LazyLoading.jsx": () => __vitePreload(() => import("./assets/LazyLoading-5r8qef65wm.js"), true ? ["./assets/LazyLoading-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/LinkEnhancer.jsx": () => __vitePreload(() => import("./assets/LinkEnhancer-5r8qef65wm.js"), true ? ["./assets/LinkEnhancer-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/MediaOffloader.jsx": () => __vitePreload(() => import("./assets/MediaOffloader-5r8qef65wm.js"), true ? ["./assets/MediaOffloader-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/MetaTag.jsx": () => __vitePreload(() => import("./assets/MetaTag-5r8qef65wm.js"), true ? ["./assets/MetaTag-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Modules.jsx": () => __vitePreload(() => import("./assets/Modules-5r8qef65wm.js"), true ? ["./assets/Modules-5r8qef65wm.js","./assets/Switch-5r8qef65wm.js","./assets/Switch-5r8qef65wm.css","./assets/MultiSelectMenu-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/MultiSelectMenu-5r8qef65wm.css","./assets/Modules-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Optimize.jsx": () => __vitePreload(() => import("./assets/Optimize-5r8qef65wm.js"), true ? ["./assets/Optimize-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Redirects.jsx": () => __vitePreload(() => import("./assets/Redirects-5r8qef65wm.js"), true ? ["./assets/Redirects-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/RelatedResources.jsx": () => __vitePreload(() => import("./assets/RelatedResources-5r8qef65wm.js"), true ? ["./assets/RelatedResources-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Schedule.jsx": () => __vitePreload(() => import("./assets/Schedule-5r8qef65wm.js"), true ? ["./assets/Schedule-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Screenshot.jsx": () => __vitePreload(() => import("./assets/Screenshot-5r8qef65wm.js"), true ? ["./assets/Screenshot-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css","./assets/icon-edit-5r8qef65wm.js"] : void 0, import.meta.url), "../modules/SearchAndReplace.jsx": () => __vitePreload(() => import("./assets/SearchAndReplace-5r8qef65wm.js"), true ? ["./assets/SearchAndReplace-5r8qef65wm.js","./assets/ModuleViewHeader-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/ModuleViewHeader-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/Settings.jsx": () => __vitePreload(() => import("./assets/Settings-5r8qef65wm.js"), true ? ["./assets/Settings-5r8qef65wm.js","./assets/datepicker-5r8qef65wm.js","./assets/MultiSelectMenu-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/MultiSelectMenu-5r8qef65wm.css","./assets/datepicker-5r8qef65wm.css","./assets/Switch-5r8qef65wm.js","./assets/Switch-5r8qef65wm.css","./assets/Settings-5r8qef65wm.css"] : void 0, import.meta.url), "../modules/TagsLabels.jsx": () => __vitePreload(() => import("./assets/TagsLabels-5r8qef65wm.js"), true ? ["./assets/TagsLabels-5r8qef65wm.js","./assets/ModuleViewHeaderBottom-5r8qef65wm.js","./assets/datepicker-5r8qef65wm.js","./assets/MultiSelectMenu-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.js","./assets/Checkbox-5r8qef65wm.css","./assets/MultiSelectMenu-5r8qef65wm.css","./assets/datepicker-5r8qef65wm.css","./assets/ModuleViewHeaderBottom-5r8qef65wm.css","./assets/icon-edit-5r8qef65wm.js","./assets/TagsLabels-5r8qef65wm.css","./assets/_ModuleViewHeader-5r8qef65wm.css"] : void 0, import.meta.url) }), `../modules/${renameModule(moduleId)}.jsx`);
  const Module = reactExports.lazy(() => importPath);
  const { headerTopHeight, headerBottomHeight } = reactExports.useContext(HeaderHeightContext);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-DynamicModule", style: { "--headerTopHeight": `${headerTopHeight}px`, "--headerMenuHeight": "52px", "--headerBottomHeight": `${headerBottomHeight}px` } }, /* @__PURE__ */ React.createElement(ErrorBoundary$1, null, /* @__PURE__ */ React.createElement(reactExports.Suspense, { fallback: /* @__PURE__ */ React.createElement(Loader, null) }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-DynamicModule-inn fadeInto" }, /* @__PURE__ */ React.createElement(
    Module,
    {
      modules,
      activePage,
      settingId: "general",
      moduleId
    }
  )))));
}
function useResizeObserver(callback) {
  const ref = reactExports.useRef(null);
  reactExports.useLayoutEffect(() => {
    const element = ref == null ? void 0 : ref.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      callback(element, entries[0]);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [callback, ref]);
  return ref;
}
function useCheckApiKey() {
  const queryClient2 = useQueryClient();
  const settingsLoaded = queryClient2.getQueryData(["general"]);
  const [apiKeySet, setHasApiKey] = reactExports.useState();
  reactExports.useEffect(() => {
    get("apiKeySet").then((val) => {
      if (val === false) {
        setHasApiKey(false);
      }
    });
  });
  return { settingsLoaded, apiKeySet };
}
const _Button = "";
function Button({
  active,
  danger,
  type,
  className,
  disabled,
  onClick,
  href,
  target,
  children
}) {
  return href ? /* @__PURE__ */ React.createElement(
    "a",
    {
      className: `urlslab-button ${className || ""} ${active && "active"} ${danger && "danger"}`,
      href,
      disabled,
      onClick: onClick || null,
      target: target || null
    },
    children
  ) : /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `urlslab-button ${className || ""} ${active && "active"} ${danger && "danger"}`,
      type: type || "button",
      disabled,
      onClick: onClick || null
    },
    children
  );
}
const _NoAPIkey = "";
function NoAPIkey() {
  const { __ } = useI18n();
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  return settingsLoaded && apiKeySet === false && /* @__PURE__ */ React.createElement("div", { className: "urslab-no-apikey" }, /* @__PURE__ */ React.createElement("h3", null, __("No API Key added")), /* @__PURE__ */ React.createElement("p", null, __("You can only retrieve data for a homepage of any domain without an API key. Input an API key to unlock all URLs.")), /* @__PURE__ */ React.createElement(Button, { href: "https://www.urlslab.com", target: "_blank", active: true }, __("Get API key")));
}
const _ProgressBar = "";
const _Notifications = "";
const _NotificationsPanel = "";
function NotificationsPanel({ children, className, active }) {
  return active ? /* @__PURE__ */ React.createElement("div", { className: `urlslab-notifications-panel urlslab-panel ${className || ""} ${active && "active"} fadeInto` }, children) : null;
}
let timeoutId;
async function cronAll(runCron, controller, cronTasks, onError) {
  controller = new AbortController();
  if (!runCron.current) {
    timeoutId = null;
    controller.abort();
    return false;
  }
  try {
    if (runCron.current) {
      timeoutId = setTimeout(() => controller.abort(), 6e4);
    }
    const response = await fetch(wpApiSettings.root + "urlslab/v1/cron/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce
      },
      credentials: "include",
      signal: controller.signal
    });
    if (runCron.current) {
      clearTimeout(timeoutId);
    }
    if (response.ok) {
      const result = await response.json();
      const okResult = result == null ? void 0 : result.filter((task) => task.exec_time >= 5);
      if ((okResult == null ? void 0 : okResult.length) && !controller.signal.aborted) {
        cronTasks(result);
        cronAll(runCron, controller, cronTasks, onError);
      }
      if (!(okResult == null ? void 0 : okResult.length)) {
        setTimeout(() => cronAll(runCron, controller, cronTasks, onError), 5e3);
      }
    }
    if (!response.ok) {
      onError("error");
      return false;
    }
    return response;
  } catch (err) {
    timeoutId = null;
    onError("error");
    return false;
  }
}
function cronReducer(state, action) {
  switch (action.type) {
    case "setCronRun":
      return {
        ...state,
        cronRunning: action.cronRunning
      };
    case "setCronTasks":
      return {
        ...state,
        cronTasksResult: action.cronTasksResult
      };
    case "setCronPanelActive":
      return {
        ...state,
        cronPanelActive: action.cronPanelActive
      };
    case "setCronPanelError":
      return {
        ...state,
        cronPanelError: action.cronPanelError
      };
    default:
      return state;
  }
}
const _Tooltip = "";
function Tooltip({ active, center, className, style: style2, children }) {
  return children ? /* @__PURE__ */ React.createElement("div", { className: `urlslab-tooltip fadeInto ${className || ""} ${center ? "align-center" : ""} ${active ? "active" : ""}`, style: style2 }, children) : null;
}
const SvgIconCronSpeedup = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.37143,0,0,1.37143,-5.48571,-4.11429)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,0.75,-0.25)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M20.75,12C20.75,7.169 16.831,3.25 12,3.25C7.169,3.25 3.25,7.169 3.25,12C3.25,16.831 7.169,20.75 12,20.75C16.831,20.75 20.75,16.831 20.75,12ZM19.25,12C19.25,16.003 16.003,19.25 12,19.25C7.997,19.25 4.75,16.003 4.75,12C4.75,7.997 7.997,4.75 12,4.75C16.003,4.75 19.25,7.997 19.25,12Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1,0,0,1,0.75,-0.25)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M10.117,16.313C9.973,16.312 9.832,16.275 9.707,16.203C9.426,16.044 9.251,15.734 9.251,15.399L9.251,8.602C9.251,8.265 9.426,7.956 9.707,7.797C9.835,7.723 9.98,7.686 10.128,7.688C10.275,7.689 10.419,7.731 10.545,7.808L16.354,11.285C16.476,11.361 16.575,11.466 16.645,11.591C16.714,11.716 16.75,11.857 16.75,12C16.75,12.143 16.714,12.283 16.645,12.408C16.575,12.533 16.476,12.639 16.354,12.714L10.545,16.192C10.416,16.27 10.268,16.312 10.117,16.313Z", style: {
  fillRule: "nonzero"
} }))), /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(0.932783,0,0,1.04917,3.41627,2.63916)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: -3.662, y: -2.515, width: 25.729, height: 22.875, style: {
  fill: "none"
} })));
const SvgIconCronStop = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.14286,0,0,1.14286,-1.42857,-1.42857)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M18.75,10C18.75,5.169 14.831,1.25 10,1.25C5.169,1.25 1.25,5.169 1.25,10C1.25,14.831 5.169,18.75 10,18.75C14.831,18.75 18.75,14.831 18.75,10ZM17.25,10C17.25,14.003 14.003,17.25 10,17.25C5.997,17.25 2.75,14.003 2.75,10C2.75,5.997 5.997,2.75 10,2.75C14.003,2.75 17.25,5.997 17.25,10Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.14286,0,0,1.14286,-1.42857,-1.42857)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M6.267,7.267L6.267,12.733C6.267,13.285 6.714,13.733 7.267,13.733L12.733,13.733C13.285,13.733 13.733,13.285 13.733,12.733L13.733,7.267C13.733,6.714 13.285,6.267 12.733,6.267C12.733,6.267 7.267,6.267 7.267,6.267C6.714,6.267 6.267,6.714 6.267,7.267Z" })));
const _CronRunner = "";
function CronRunner() {
  var _a, _b;
  const { __ } = useI18n();
  const runCron = reactExports.useRef(false);
  const [state, dispatch] = reactExports.useReducer(cronReducer, { cronRunning: false, cronTasksResult: [], cronPanelActive: false, cronPanelError: false });
  const handleCronRunner = () => {
    let controller;
    dispatch({ type: "setCronRun", cronRunning: !state.cronRunning });
    runCron.current = !runCron.current;
    if (runCron.current) {
      dispatch({ type: "setCronPanelError", cronPanelError: false });
      cronAll(runCron, controller, (cronTasksResult) => dispatch({ type: "setCronTasks", cronTasksResult }), handleCronError);
    }
  };
  function handleCronError() {
    runCron.current = false;
    dispatch({ type: "setCronPanelError", cronPanelError: true });
    dispatch({ type: "setCronRun", cronRunning: false });
    setTimeout(handleCronRunner, 6e4);
  }
  reactExports.useEffect(() => {
    var _a2;
    if ((_a2 = state.cronTasksResult) == null ? void 0 : _a2.length) {
      dispatch({ type: "setCronPanelError", cronPanelError: false });
      dispatch({ type: "setCronPanelActive", cronPanelActive: true });
      setTimeout(() => {
        dispatch({ type: "setCronPanelActive", cronPanelActive: false });
        dispatch({ type: "setCronTasks", cronTasksResult: [] });
      }, 4e3);
    }
  }, [state.cronPanelActive, state.cronTasksResult]);
  return /* @__PURE__ */ React.createElement("button", { className: "urlslab-cronrunner pos-relative small", onClick: handleCronRunner }, !state.cronRunning ? /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(SvgIconCronSpeedup, { className: "urlslab-cronrunner-icon" }), /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover align-left xxxl" }, __("Speed Up Tasks Execution"))) : /* @__PURE__ */ React.createElement("span", { className: "c-saturated-red" }, /* @__PURE__ */ React.createElement(SvgIconCronStop, { className: "urlslab-cronrunner-icon" }), /* @__PURE__ */ React.createElement(Tooltip, { className: "showOnHover align-left xxxl" }, __("Stop Tasks Execution"))), /* @__PURE__ */ React.createElement(NotificationsPanel, { className: `${state.cronPanelError ? "error" : "dark"} wide`, active: ((_a = state.cronTasksResult) == null ? void 0 : _a.length) > 0 && state.cronPanelActive || state.cronPanelError }, !state.cronPanelError ? (_b = state.cronTasksResult) == null ? void 0 : _b.map((task) => /* @__PURE__ */ React.createElement("div", { className: "message", key: task.task }, task.description)) : /* @__PURE__ */ React.createElement("div", { className: "message", key: "cronError" }, __("Error has occured. Will run again in 1 min."))));
}
const SvgIconClose = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 10 10", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(0.941462,0,0,0.904724,-2.8617,-3.21412)" }, /* @__PURE__ */ reactExports.createElement("rect", { x: 3.04, y: 3.553, width: 9.814, height: 10.219, style: {
  fill: "none"
} }), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.06218,0,0,1.10531,-0.532301,-0.732545)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M11.576,4.076L3.576,12.076C3.342,12.31 3.342,12.69 3.576,12.924C3.81,13.158 4.19,13.158 4.424,12.924L12.424,4.924C12.658,4.69 12.658,4.31 12.424,4.076C12.19,3.842 11.81,3.842 11.576,4.076Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(1.06218,0,0,1.10531,-0.532301,-0.732545)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M3.576,4.924L11.576,12.924C11.81,13.158 12.19,13.158 12.424,12.924C12.658,12.69 12.658,12.31 12.424,12.076L4.424,4.076C4.19,3.842 3.81,3.842 3.576,4.076C3.342,4.31 3.342,4.69 3.576,4.924Z" }))));
const _Tag = "";
function Tag({ props, type, autoTextColor, lightnessTreshold, fullSize, className, children, style: style2, shape, fill, size, onClick, onDelete }) {
  const setTextColor = () => {
    const { hue, saturation, lightness } = autoTextColor ? hexToHSL(autoTextColor) : {};
    if (!lightness) {
      return "";
    }
    if (lightness < (lightnessTreshold || 75)) {
      return "#fff";
    }
  };
  return type === "button" ? /* @__PURE__ */ React.createElement("button", { ...props, onClick, className: `urlslab-tag ${fullSize ? "fullSize" : ""} ${className ? className : ""} ${size ? size : ""} ${shape ? shape : ""} ${fill && "fill"}`, style: { ...style2, color: setTextColor() } }, children, onDelete && /* @__PURE__ */ React.createElement(SvgIconClose, { onClick: onDelete, className: "urlslab-tag-close" })) : /* @__PURE__ */ React.createElement("span", { ...props, className: `urlslab-tag ${fullSize ? "fullSize" : ""} ${className ? className : ""} ${size ? size : ""} ${shape ? shape : ""} ${fill && "fill"}`, style: { ...style2, color: setTextColor() } }, children, onDelete && /* @__PURE__ */ React.createElement(SvgIconClose, { onClick: onDelete, className: "urlslab-tag-close" }));
}
const SvgUrlslabLogo = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: 139, height: 34, viewBox: "0 0 139 34", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M49.92 24.108C48.78 24.108 47.772 23.874 46.896 23.406C46.032 22.938 45.354 22.296 44.862 21.48C44.37 20.652 44.124 19.722 44.124 18.69V11.382H46.842V18.564C46.842 19.152 46.974 19.68 47.238 20.148C47.514 20.616 47.88 20.988 48.336 21.264C48.804 21.54 49.332 21.678 49.92 21.678C50.52 21.678 51.054 21.54 51.522 21.264C52.002 20.988 52.38 20.616 52.656 20.148C52.932 19.68 53.07 19.152 53.07 18.564V11.382H55.698V18.69C55.698 19.722 55.452 20.652 54.96 21.48C54.468 22.296 53.784 22.938 52.908 23.406C52.044 23.874 51.048 24.108 49.92 24.108ZM60.0703 24V11.4H66.3343C67.1743 11.4 67.9183 11.574 68.5663 11.922C69.2263 12.258 69.7363 12.732 70.0963 13.344C70.4683 13.944 70.6543 14.628 70.6543 15.396C70.6543 16.164 70.4623 16.86 70.0783 17.484C69.6943 18.108 69.1663 18.606 68.4943 18.978C67.8343 19.338 67.1023 19.518 66.2983 19.518H62.6803V24H60.0703ZM68.1163 24L64.4803 18.312L67.2883 17.862L71.2843 24.018L68.1163 24ZM62.6803 17.322H66.1003C66.4603 17.322 66.7783 17.244 67.0543 17.088C67.3303 16.932 67.5463 16.716 67.7023 16.44C67.8583 16.164 67.9363 15.852 67.9363 15.504C67.9363 15.156 67.8463 14.85 67.6663 14.586C67.4983 14.322 67.2583 14.118 66.9463 13.974C66.6463 13.818 66.2923 13.74 65.8843 13.74H62.6803V17.322ZM74.9414 24V11.4H77.6414V21.57H84.3554V24H74.9414ZM91.584 24.18C90.564 24.18 89.652 24.036 88.848 23.748C88.044 23.448 87.39 23.016 86.886 22.452L88.488 21.048C88.884 21.456 89.358 21.762 89.91 21.966C90.462 22.17 91.05 22.272 91.674 22.272C91.89 22.272 92.1 22.254 92.304 22.218C92.52 22.182 92.706 22.128 92.862 22.056C93.018 21.972 93.144 21.87 93.24 21.75C93.336 21.63 93.384 21.492 93.384 21.336C93.384 21.072 93.222 20.862 92.898 20.706C92.694 20.634 92.43 20.556 92.106 20.472C91.794 20.388 91.44 20.31 91.044 20.238C90.372 20.094 89.784 19.932 89.28 19.752C88.776 19.572 88.356 19.35 88.02 19.086C87.756 18.834 87.552 18.552 87.408 18.24C87.264 17.928 87.192 17.568 87.192 17.16C87.192 16.728 87.3 16.332 87.516 15.972C87.732 15.612 88.038 15.312 88.434 15.072C88.83 14.82 89.28 14.628 89.784 14.496C90.3 14.352 90.846 14.28 91.422 14.28C91.974 14.28 92.514 14.34 93.042 14.46C93.582 14.568 94.092 14.73 94.572 14.946C95.052 15.162 95.466 15.432 95.814 15.756L94.482 17.304C94.218 17.1 93.912 16.914 93.564 16.746C93.216 16.566 92.85 16.428 92.466 16.332C92.094 16.224 91.728 16.17 91.368 16.17C91.152 16.17 90.936 16.188 90.72 16.224C90.516 16.248 90.336 16.296 90.18 16.368C90.024 16.44 89.898 16.53 89.802 16.638C89.718 16.746 89.676 16.878 89.676 17.034C89.676 17.166 89.706 17.286 89.766 17.394C89.838 17.49 89.934 17.574 90.054 17.646C90.234 17.766 90.492 17.874 90.828 17.97C91.164 18.054 91.578 18.15 92.07 18.258C92.766 18.402 93.366 18.57 93.87 18.762C94.386 18.942 94.8 19.17 95.112 19.446C95.364 19.638 95.556 19.878 95.688 20.166C95.82 20.442 95.886 20.754 95.886 21.102C95.886 21.714 95.694 22.254 95.31 22.722C94.938 23.178 94.428 23.538 93.78 23.802C93.144 24.054 92.412 24.18 91.584 24.18ZM99.252 24V11.4H101.952V21.57H108.666V24H99.252ZM115.775 24.18C114.839 24.18 114.011 23.97 113.291 23.55C112.583 23.118 112.025 22.53 111.617 21.786C111.221 21.042 111.023 20.184 111.023 19.212C111.023 18.252 111.227 17.406 111.635 16.674C112.055 15.93 112.625 15.348 113.345 14.928C114.077 14.496 114.917 14.28 115.865 14.28C116.417 14.28 116.927 14.352 117.395 14.496C117.863 14.64 118.271 14.838 118.619 15.09C118.967 15.33 119.249 15.6 119.465 15.9C119.693 16.188 119.837 16.494 119.897 16.818L119.321 16.8V14.478H121.841V24H119.285V21.57L119.825 21.624C119.753 21.936 119.603 22.242 119.375 22.542C119.147 22.842 118.847 23.118 118.475 23.37C118.115 23.61 117.701 23.808 117.233 23.964C116.777 24.108 116.291 24.18 115.775 24.18ZM116.459 21.966C117.035 21.966 117.539 21.852 117.971 21.624C118.415 21.396 118.757 21.078 118.997 20.67C119.237 20.25 119.357 19.764 119.357 19.212C119.357 18.684 119.237 18.216 118.997 17.808C118.757 17.4 118.415 17.076 117.971 16.836C117.539 16.596 117.035 16.476 116.459 16.476C115.883 16.476 115.379 16.596 114.947 16.836C114.515 17.076 114.173 17.4 113.921 17.808C113.681 18.216 113.561 18.684 113.561 19.212C113.561 19.764 113.681 20.25 113.921 20.67C114.173 21.078 114.515 21.396 114.947 21.624C115.379 21.852 115.883 21.966 116.459 21.966ZM132.191 24.18C131.675 24.18 131.189 24.114 130.733 23.982C130.277 23.85 129.863 23.676 129.491 23.46C129.131 23.232 128.831 22.98 128.591 22.704C128.363 22.416 128.213 22.14 128.141 21.876L128.861 21.732L128.753 23.964H126.341V10.68H128.897V16.71L128.249 16.584C128.333 16.308 128.489 16.032 128.717 15.756C128.945 15.48 129.233 15.234 129.581 15.018C129.941 14.79 130.343 14.61 130.787 14.478C131.231 14.346 131.699 14.28 132.191 14.28C133.115 14.28 133.937 14.496 134.657 14.928C135.389 15.348 135.965 15.93 136.385 16.674C136.805 17.418 137.015 18.27 137.015 19.23C137.015 20.19 136.805 21.042 136.385 21.786C135.977 22.53 135.407 23.118 134.675 23.55C133.943 23.97 133.115 24.18 132.191 24.18ZM131.651 21.984C132.227 21.984 132.731 21.87 133.163 21.642C133.595 21.402 133.931 21.078 134.171 20.67C134.411 20.25 134.531 19.77 134.531 19.23C134.531 18.69 134.411 18.21 134.171 17.79C133.931 17.37 133.595 17.046 133.163 16.818C132.731 16.59 132.227 16.476 131.651 16.476C131.063 16.476 130.553 16.59 130.121 16.818C129.689 17.046 129.347 17.37 129.095 17.79C128.855 18.21 128.735 18.69 128.735 19.23C128.735 19.77 128.855 20.25 129.095 20.67C129.347 21.078 129.689 21.402 130.121 21.642C130.553 21.87 131.063 21.984 131.651 21.984Z", fill: "#050505" }), /* @__PURE__ */ reactExports.createElement("g", { clipPath: "url(#clip0_672_18363)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M0 8C0 3.58172 3.58172 0 8 0H21C28.1797 0 34 5.8203 34 13V26C34 30.4183 30.4183 34 26 34H13C5.8203 34 0 28.1797 0 21V8Z", fill: "#3D4148" }), /* @__PURE__ */ reactExports.createElement("path", { d: "M22.8277 22.3183C22.8277 25.532 20.2135 28.1463 16.9998 28.1463C13.7861 28.1463 11.1718 25.532 11.1718 22.3183C11.1693 21.5404 11.3237 20.7699 11.626 20.053C11.9282 19.3361 12.3719 18.6876 12.9307 18.1462C13.125 17.9612 13.3845 17.8602 13.6529 17.8651C13.9212 17.8701 14.1768 17.9806 14.3642 18.1728C14.5516 18.3649 14.6557 18.6232 14.6539 18.8915C14.6522 19.1599 14.5448 19.4168 14.3549 19.6065C13.8157 20.1324 13.4455 20.8071 13.2917 21.5445C13.1378 22.2818 13.2073 23.0483 13.4912 23.7459C13.7751 24.4436 14.2605 25.0408 14.8855 25.4612C15.5105 25.8816 16.2466 26.1061 16.9998 26.1061C17.753 26.1061 18.4891 25.8816 19.1141 25.4612C19.739 25.0408 20.2245 24.4436 20.5084 23.7459C20.7923 23.0483 20.8617 22.2818 20.7079 21.5445C20.554 20.8071 20.1838 20.1324 19.6446 19.6065C19.4548 19.4168 19.3474 19.1599 19.3456 18.8915C19.3439 18.6232 19.448 18.3649 19.6354 18.1728C19.8228 17.9806 20.0784 17.8701 20.3467 17.8651C20.615 17.8602 20.8745 17.9612 21.0689 18.1462C21.6276 18.6876 22.0714 19.3361 22.3736 20.053C22.6758 20.7699 22.8303 21.5404 22.8277 22.3183ZM18.0198 20.7346V13.2662C18.0198 12.9957 17.9123 12.7362 17.721 12.5449C17.5297 12.3537 17.2703 12.2462 16.9998 12.2462C16.7293 12.2462 16.4698 12.3537 16.2785 12.5449C16.0872 12.7362 15.9798 12.9957 15.9798 13.2662V20.7346C15.9798 21.0052 16.0872 21.2646 16.2785 21.4559C16.4698 21.6472 16.7293 21.7546 16.9998 21.7546C17.2703 21.7546 17.5297 21.6472 17.721 21.4559C17.9123 21.2646 18.0198 21.0052 18.0198 20.7346ZM23.7294 8.40453C23.6398 8.24938 23.511 8.12055 23.3558 8.03102C23.2006 7.94149 23.0246 7.89442 22.8454 7.89453L11.1535 7.89453C10.9744 7.89442 10.7984 7.94146 10.6432 8.03094C10.4881 8.12042 10.3592 8.24917 10.2696 8.40425C10.18 8.55933 10.1328 8.73527 10.1328 8.91437C10.1328 9.09347 10.1799 9.26942 10.2695 9.42453L12.7593 13.7364C12.8946 13.9709 13.1174 14.142 13.3788 14.2121C13.6403 14.2823 13.9188 14.2457 14.1533 14.1104C14.3877 13.9752 14.5589 13.7523 14.629 13.4909C14.6991 13.2294 14.6626 12.9509 14.5273 12.7164L12.9198 9.93453H21.0798L19.4733 12.7164C19.4063 12.8325 19.3629 12.9606 19.3454 13.0935C19.328 13.2264 19.3369 13.3614 19.3716 13.4909C19.4063 13.6203 19.4662 13.7417 19.5478 13.848C19.6294 13.9543 19.7312 14.0434 19.8473 14.1104C19.9634 14.1774 20.0915 14.2208 20.2244 14.2383C20.3573 14.2557 20.4923 14.2468 20.6217 14.2121C20.7512 14.1774 20.8725 14.1175 20.9788 14.0359C21.0851 13.9543 21.1743 13.8525 21.2413 13.7364L23.7308 9.42487C23.8202 9.26965 23.8671 9.09363 23.8668 8.91452C23.8666 8.7354 23.8192 8.55951 23.7294 8.40453Z", fill: "white" })), /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement("clipPath", { id: "clip0_672_18363" }, /* @__PURE__ */ reactExports.createElement("rect", { width: 34, height: 34, fill: "white" }))));
function Header({ pageTitle }) {
  var _a;
  const { __ } = useI18n();
  const queryClient2 = useQueryClient();
  const didMountRef = reactExports.useRef(false);
  const { headerTopHeight, setHeaderTopHeight } = reactExports.useContext(HeaderHeightContext);
  const handleHeaderHeight = reactExports.useCallback((elem) => {
    const headerHeight = elem == null ? void 0 : elem.getBoundingClientRect().height;
    if (headerHeight && headerHeight !== headerTopHeight) {
      setHeaderTopHeight(headerHeight);
    }
  }, [headerTopHeight, setHeaderTopHeight]);
  const headerTop = useResizeObserver(handleHeaderHeight);
  reactExports.useEffect(() => {
    async function getCredits() {
      return await queryClient2.fetchQuery({
        queryKey: ["credits"],
        queryFn: async () => {
          const credits2 = await postFetch(`billing/credits`, { rows_per_page: 50 });
          return credits2.json();
        },
        refetchOnWindowFocus: false
      });
    }
    if (!didMountRef.current) {
      getCredits();
    }
    didMountRef.current = true;
  }, []);
  const credits = (_a = queryClient2.getQueryData(["credits"])) == null ? void 0 : _a.credits;
  return /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement("header", { ref: headerTop, className: "urlslab-header" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, /* @__PURE__ */ React.createElement(SvgUrlslabLogo, { className: "urlslab-header-logo" }), /* @__PURE__ */ React.createElement(Tag, { className: "bg-saturated-orange c-white ml-s" }, "beta"), /* @__PURE__ */ React.createElement("span", { className: "urlslab-header-slash" }, "/"), /* @__PURE__ */ React.createElement("h1", { className: "urlslab-header-title ma-right" }, pageTitle), credits && /* @__PURE__ */ React.createElement("small", { className: "fadeInto flex flex-align-center mr-m" }, __("Remaining credits: "), /* @__PURE__ */ React.createElement("strong", { className: "ml-s" }, credits)), /* @__PURE__ */ React.createElement(Button, { className: "mr-m", active: true, href: "https://www.urlslab.com/dashboard/" }, __("Buy credits")), /* @__PURE__ */ React.createElement(CronRunner, null)), /* @__PURE__ */ React.createElement(NoAPIkey, null)));
}
const style = "";
function App() {
  const { __ } = useI18n();
  const queryClient2 = useQueryClient();
  const [module, setModule2] = reactExports.useState("urlslab-modules");
  const [prefetch, setPrefetch] = reactExports.useState(true);
  const [headerTopHeight, setHeaderTopHeight] = reactExports.useState(58);
  const [headerBottomHeight, setHeaderBottomHeight] = reactExports.useState(51.5);
  const value = { headerTopHeight, setHeaderTopHeight, headerBottomHeight, setHeaderBottomHeight };
  reactExports.useEffect(() => {
    if (prefetch) {
      update("apiKeySet", () => true);
      async function getApiKey() {
        const generalData = await queryClient2.fetchQuery({
          queryKey: ["general"],
          queryFn: () => fetchSettings("general").then((data2) => data2),
          refetchOnWindowFocus: false
        });
        const isApiObject = generalData == null ? void 0 : generalData.filter((dataset) => dataset.id === "api")[0];
        const hasApiKey = isApiObject == null ? void 0 : isApiObject.options["urlslab-api-key"].value;
        if (!hasApiKey) {
          update("apiKeySet", () => false);
        }
      }
      getApiKey();
      queryClient2.prefetchQuery({
        queryKey: ["languages"],
        queryFn: async () => await fetchLangs(),
        refetchOnWindowFocus: false
      });
      queryClient2.prefetchQuery({
        queryKey: ["routes"],
        queryFn: async () => await fetchData(),
        refetchOnWindowFocus: false
      });
      queryClient2.prefetchQuery({
        queryKey: ["label", "menu"],
        queryFn: async () => {
          const tags = await postFetch("label", { rows_per_page: 500 });
          const tagsArray = await tags.json();
          tagsArray == null ? void 0 : tagsArray.map((tag) => {
            const { lightness } = hexToHSL(tag.bgcolor);
            if (lightness < 70) {
              return tag.className = "dark";
            }
            return tag;
          });
          return tagsArray;
        },
        refetchOnWindowFocus: false
      });
      queryClient2.prefetchQuery({
        queryKey: ["label", "modules"],
        queryFn: async () => await fetchData("label/modules"),
        refetchOnWindowFocus: false
      });
      setPrefetch(false);
    }
  }, []);
  const { data } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      if (prefetch) {
        return await fetchData("module").then((ModuleData) => ModuleData);
      }
    },
    refetchOnWindowFocus: false
  });
  const fetchedModules = reactExports.useMemo(() => {
    data == null ? true : delete data.general;
    return data;
  }, [data]);
  const [pageTitle, setTitle] = reactExports.useState(__("Modules"));
  const handleModulePage = (selectedModule) => {
    setModule2(selectedModule);
    if (selectedModule === "urlslab-modules") {
      setTitle(__("Modules"));
    }
    if (selectedModule === "urlslab-settings") {
      setTitle(__("Settings"));
    }
    if (selectedModule === "urlslab-schedule") {
      setTitle(__("Schedules"));
    }
    if (selectedModule === "TagsLabels") {
      setTitle(__("Tags"));
    }
    if (selectedModule !== "urlslab-modules" && selectedModule !== "urlslab-settings" && selectedModule !== "urlslab-schedule" && selectedModule !== "TagsLabels") {
      setTitle(fetchedModules[selectedModule].title);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-app flex" }, fetchedModules && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(
    MainMenu,
    {
      modules: !fetchedModules || Object.values(fetchedModules),
      activePage: handleModulePage,
      activeModule: module
    }
  )), /* @__PURE__ */ React.createElement(HeaderHeightContext.Provider, { value }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-app-main" }, /* @__PURE__ */ React.createElement(Header, { pageTitle: !pageTitle || pageTitle }), /* @__PURE__ */ React.createElement(
    DynamicModule,
    {
      modules: !fetchedModules || Object.values(fetchedModules),
      moduleId: module,
      activePage: handleModulePage
    }
  ))));
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1e3 * 60 * 60 * 24
      // 24 hours
    }
  }
});
reactDomExports.createRoot(document.getElementById("urlslab-root")).render(
  /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(QueryClientProvider, { client: queryClient }, /* @__PURE__ */ React.createElement(App, null)))
);
export {
  infiniteQueryBehavior as A,
  Button as B,
  hasNextPage as C,
  hasPreviousPage as D,
  parseQueryArgs as E,
  useBaseQuery as F,
  postFetch as G,
  langName as H,
  SvgIconClose as I,
  HeaderHeightContext as J,
  useResizeObserver as K,
  Loader as L,
  QueryObserver as Q,
  React as R,
  Subscribable as S,
  Tag as T,
  __vitePreload as _,
  useQueryClient as a,
  useCheckApiKey as b,
  update as c,
  delay as d,
  setSettings as e,
  fetchData as f,
  get as g,
  useQuery as h,
  Tooltip as i,
  fetchSettings as j,
  hexToHSL as k,
  getAugmentedNamespace as l,
  getParamsChar as m,
  commonjsGlobal as n,
  shallowEqualObjects as o,
  parseURL as p,
  getDefaultState as q,
  reactExports as r,
  setModule as s,
  notifyManager as t,
  useI18n as u,
  parseMutationArgs as v,
  useSyncExternalStore as w,
  shouldThrowError as x,
  reactDomExports as y,
  ae as z
};
