// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"8wcER":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "5c1b77e3b71e74eb";
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                var oldDeps = modules[asset.id][1];
                for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    var id = oldDeps[dep];
                    var parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    var modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        var deps = modules[id1][1];
        var orphans = [];
        for(var dep in deps){
            var parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach(function(id) {
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    var parents = getParents(module.bundle.root, id);
    var accepted = false;
    while(parents.length > 0){
        var v = parents.shift();
        var a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            var p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push.apply(parents, _toConsumableArray(p));
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"h7u1C":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _georgeMcNeilPng = require("./maps/George-McNeil.png");
var _georgeMcNeilPngDefault = parcelHelpers.interopDefault(_georgeMcNeilPng);
var _particlesRenderable = require("./ParticlesRenderable");
var _particlesRenderableDefault = parcelHelpers.interopDefault(_particlesRenderable);
var _simulationComputable = require("./SimulationComputable");
var _simulationComputableDefault = parcelHelpers.interopDefault(_simulationComputable);
var _utils = require("./utils");
var _textureLoader = require("./utils/TextureLoader");
var _textureLoaderDefault = parcelHelpers.interopDefault(_textureLoader);
var _webGPUCompute = require("./WebGPUCompute");
var _webGPUComputeDefault = parcelHelpers.interopDefault(_webGPUCompute);
var _webGPURenderer = require("./WebGPURenderer");
var _webGPURendererDefault = parcelHelpers.interopDefault(_webGPURenderer);
const ENTITIES_COUNT = window.innerWidth * window.innerHeight;
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
let renderer;
let particlesRenderable;
let computer;
let simulationComputable;
let device;
let uniformBuffer;
const mouse = {
    x: -9999,
    y: -9999
};
let isMouseDown = false;
const createSharedUniformBuffersAndBindGroups = ()=>{
    const uniformBufferSize = 2 * Float32Array.BYTES_PER_ELEMENT + 2 * Float32Array.BYTES_PER_ELEMENT; // resolution, mouse
    const uniformBuffer1 = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const sharedUniformsBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                buffer: {
                    type: "uniform"
                }
            }, 
        ]
    });
    const sharedUniformsBindGroup = device.createBindGroup({
        layout: sharedUniformsBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer1
                }
            }, 
        ]
    });
    return [
        sharedUniformsBindGroupLayout,
        sharedUniformsBindGroup,
        uniformBuffer1, 
    ];
};
const animate = ()=>{
    const uniformsArray = new Float32Array([
        window.innerWidth,
        window.innerHeight,
        mouse.x,
        mouse.y, 
    ]);
    device.queue.writeBuffer(uniformBuffer, 0, uniformsArray);
    computer.compute();
    simulationComputable.swapBindGroups();
    particlesRenderable.simulationSrcBindGroup = simulationComputable.getActiveBindGroup();
    renderer.render();
    requestAnimationFrame(animate);
};
const onMouseDown = ({ clientX , clientY  })=>{
    isMouseDown = true;
    mouse.x = clientX;
    mouse.y = clientY;
};
const onMouseUp = ()=>{
    isMouseDown = false;
    mouse.x = -999999;
    mouse.y = -999999;
};
const onMouseMove = ({ clientX , clientY  })=>{
    if (!isMouseDown) return;
    mouse.x = clientX;
    mouse.y = clientY;
};
const init = async ()=>{
    device = await _utils.requestWebGPU();
    const texture = await new _textureLoaderDefault.default(device).loadTextureFromImageSrc(_georgeMcNeilPngDefault.default);
    renderer = new _webGPURendererDefault.default(device, canvas);
    computer = new _webGPUComputeDefault.default(device);
    const [sharedUniformsBindGroupLayout, sharedUniformsBindGroup, buffer] = createSharedUniformBuffersAndBindGroups();
    uniformBuffer = buffer;
    simulationComputable = new _simulationComputableDefault.default(device, ENTITIES_COUNT, sharedUniformsBindGroupLayout, sharedUniformsBindGroup);
    computer.addComputable(simulationComputable);
    particlesRenderable = new _particlesRenderableDefault.default(device, renderer, ENTITIES_COUNT, sharedUniformsBindGroupLayout, sharedUniformsBindGroup, simulationComputable.getBindGroupLayout(), texture);
    renderer.addRenderable(particlesRenderable);
    requestAnimationFrame(animate);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
};
init();

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./utils/TextureLoader":"blQVX","./WebGPURenderer":"4h10T","./ParticlesRenderable":"bQ6X1","./utils":"6Mk9B","./WebGPUCompute":"kANNZ","./SimulationComputable":"kB5ri","./maps/George-McNeil.png":"adm1N"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"blQVX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class TextureLoader {
    constructor(device){
        this.device = device;
    }
    createTextureFromImageBitmapOrCanvas(src) {
        const texture = this.device.createTexture({
            size: [
                src.width,
                src.height,
                1
            ],
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.device.queue.copyExternalImageToTexture({
            source: src
        }, {
            texture: texture
        }, [
            src.width,
            src.height
        ]);
        return texture;
    }
    async loadTextureFromImageSrc(src) {
        const response = await fetch(src);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        return this.createTextureFromImageBitmapOrCanvas(imageBitmap);
    }
}
exports.default = TextureLoader;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4h10T":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class WebGPURenderer {
    constructor(device, canvas, options = {
    }){
        this.device = device;
        this.canvas = canvas;
        this.renderables = new Set();
        this.depthFormat = "depth24plus-stencil8";
        this.ctx = this.canvas.getContext("webgpu");
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this.ctx.configure({
            device: this.device,
            format: this.presentationFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            alphaMode: "opaque",
            ...options
        });
        const depthTexture = device.createTexture({
            size: {
                width: canvas.width,
                height: canvas.height,
                depthOrArrayLayers: 1
            },
            format: this.depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.ctx.getCurrentTexture().createView(),
                    clearValue: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 1
                    },
                    loadOp: "clear",
                    storeOp: "store"
                }, 
            ],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: "clear",
                depthStoreOp: "store",
                stencilLoadOp: "clear",
                stencilStoreOp: "store"
            }
        };
    }
    addRenderable(renderable) {
        this.renderables.add(renderable);
    }
    removeRenderable(renderable) {
        this.renderables.delete(renderable);
    }
    render() {
        this.renderPassDescriptor.colorAttachments[0].view = this.ctx.getCurrentTexture().createView();
        for (const renderable of this.renderables){
            const commands = renderable.getCommands(this.renderPassDescriptor);
            if (commands) this.device.queue.submit([
                commands
            ]);
        }
    }
}
exports.default = WebGPURenderer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bQ6X1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _drawShaderWgsl = require("bundle-text:./draw-shader.wgsl");
var _drawShaderWgslDefault = parcelHelpers.interopDefault(_drawShaderWgsl);
const createQuad = ()=>{
    return {
        vertexCount: 6,
        bufferSize: 24 * Float32Array.BYTES_PER_ELEMENT,
        bufferData: [
            1,
            1,
            1,
            0,
            1,
            -1,
            1,
            1,
            -1,
            -1,
            0,
            1,
            1,
            1,
            1,
            0,
            -1,
            -1,
            0,
            1,
            -1,
            1,
            0,
            0, 
        ]
    };
};
class ParticlesRenderable {
    constructor(device, renderer, particlesCount, sharedUniformsBindGroupLayout, sharedUniformsBindGroup, simulationBindGroupLayout, texture){
        this.device = device;
        this.renderer = renderer;
        this.particlesCount = particlesCount;
        this.sharedUniformsBindGroupLayout = sharedUniformsBindGroupLayout;
        this.sharedUniformsBindGroup = sharedUniformsBindGroup;
        this.simulationBindGroupLayout = simulationBindGroupLayout;
        this.texture = texture;
        this.createVertexBuffer();
        this.createUniformsBuffersAndBindGroups();
        this.createPipeline();
    }
    createVertexBuffer() {
        const { vertexCount , bufferSize , bufferData  } = createQuad();
        this.vertexCount = vertexCount;
        this.vertexBuffer = this.device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
        });
        new Float32Array(this.vertexBuffer.getMappedRange()).set(bufferData);
        this.vertexBuffer.unmap();
    }
    createUniformsBuffersAndBindGroups() {
        this.uniformsBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                    sampler: {
                        type: "filtering"
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                    texture: {
                        sampleType: "float",
                        multisampled: false,
                        viewDimension: "2d"
                    }
                }, 
            ]
        });
        this.uniformsBindGroup = this.device.createBindGroup({
            layout: this.uniformsBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: this.device.createSampler({
                        magFilter: "linear",
                        minFilter: "linear"
                    })
                },
                {
                    binding: 1,
                    resource: this.texture.createView()
                }, 
            ]
        });
    }
    createPipeline() {
        const shaderModule = this.device.createShaderModule({
            code: _drawShaderWgslDefault.default
        });
        const vertexState = {
            module: shaderModule,
            entryPoint: "vertex_main",
            buffers: [
                {
                    arrayStride: 16,
                    attributes: [
                        {
                            format: "float32x2",
                            offset: 0,
                            shaderLocation: 0
                        },
                        {
                            format: "float32x2",
                            offset: 8,
                            shaderLocation: 1
                        }, 
                    ]
                }, 
            ]
        };
        const fragmentState = {
            module: shaderModule,
            entryPoint: "fragment_main",
            targets: [
                {
                    format: this.renderer.presentationFormat,
                    blend: {
                        color: {
                            operation: "add",
                            srcFactor: "one",
                            dstFactor: "one"
                        },
                        alpha: {
                            operation: "add",
                            srcFactor: "one",
                            dstFactor: "one"
                        }
                    }
                }, 
            ]
        };
        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.simulationBindGroupLayout,
                this.sharedUniformsBindGroupLayout,
                this.uniformsBindGroupLayout, 
            ]
        });
        this.pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: vertexState,
            fragment: fragmentState,
            depthStencil: {
                format: this.renderer.depthFormat,
                depthWriteEnabled: true,
                depthCompare: "less"
            }
        });
    }
    set simulationSrcBindGroup(group) {
        this.simulationBindGroup = group;
    }
    get simulationSrcBindGroup() {
        return this.simulationBindGroup;
    }
    getCommands(renderPassDescriptor) {
        if (!this.simulationSrcBindGroup) return;
        const commandEncoder = this.device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.setPipeline(this.pipeline);
        renderPass.setBindGroup(0, this.simulationSrcBindGroup);
        renderPass.setBindGroup(1, this.sharedUniformsBindGroup);
        renderPass.setBindGroup(2, this.uniformsBindGroup);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.draw(this.vertexCount, this.particlesCount, 0, 0);
        renderPass.end();
        return commandEncoder.finish();
    }
}
exports.default = ParticlesRenderable;

},{"bundle-text:./draw-shader.wgsl":"6HAGK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6HAGK":[function(require,module,exports) {
module.exports = "struct Body {\n  position: vec3<f32>,\n  velocity: vec3<f32>,\n  texture_uv: vec2<f32>,\n  mass: f32,\n}\n\nstruct Uniforms {\n  u_resolution : vec2<f32>,\n  u_mouse : vec2<f32>,\n}\n\n@group(0) @binding(0) var<storage, read> input : array<Body>;\n@group(1) @binding(0) var<uniform> uniforms : Uniforms;\n@group(2) @binding(0) var mySampler: sampler;\n@group(2) @binding(1) var myTexture: texture_2d<f32>;\n\nstruct VertexInput {\n  @location(0) position : vec2<f32>,\n  @location(1) texture_uv : vec2<f32>,\n}\n\nstruct VertexOutput {\n  @builtin(position) position : vec4<f32>,\n  @location(0) texture_uv : vec2<f32>,\n}\n\nfn ball_sdf(position : vec2<f32>, radius : f32, coords : vec2<f32>) -> f32 {\n  var dst : f32 = radius / 2.0 / length(coords - position);\n  return dst;\n}\n\nfn screen_space_to_clip_space(screen_space: vec2<f32>) -> vec2<f32> {\n  var clip_space = ((screen_space / uniforms.u_resolution) * 2.0) - 1.0;\n  clip_space.y = clip_space.y * -1;\n\n  return clip_space;\n}\n\nfn quantize(value: f32, q_step: f32) -> f32 {\n  return round(value / q_step) * q_step;\n}\n\n@vertex\nfn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {\n  var output : VertexOutput;\n  var radius : f32 = 0.5;\n  var entity = input[instance_index];\n\n  var screen_space_coords: vec2<f32> = vert.position.xy * radius + entity.position.xy;\n  output.position = vec4<f32>(screen_space_to_clip_space(screen_space_coords), entity.position.z, 1.0);\n  output.texture_uv = entity.texture_uv;\n  return output;\n}\n\n@fragment\nfn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {\n\n  var color = textureSample(myTexture, mySampler, in.texture_uv);\n  return vec4<f32>(color.rgb, 1.0);\n}";

},{}],"6Mk9B":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "requestWebGPU", ()=>requestWebGPU
);
let device;
const requestWebGPU = async ()=>{
    if (!navigator.gpu) {
        alert("WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags.");
        return;
    }
    if (device) return device;
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.warn("Could not access Adapter");
        return;
    }
    return await adapter.requestDevice();
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kANNZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class WebGPUCompute {
    constructor(device){
        this.device = device;
        this.computables = new Set();
    }
    addComputable(renderable) {
        this.computables.add(renderable);
    }
    removeRenderable(renderable) {
        this.computables.delete(renderable);
    }
    compute() {
        for (const computable of this.computables){
            const commands = computable.getCommands();
            if (commands) this.device.queue.submit([
                commands
            ]);
        }
    }
}
exports.default = WebGPUCompute;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kB5ri":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _computeShaderWgsl = require("bundle-text:./compute-shader.wgsl");
var _computeShaderWgslDefault = parcelHelpers.interopDefault(_computeShaderWgsl);
const createEntityData = (count)=>{
    const stride = 12; // vec3 position + padding, vec3 velocity + padding, vec3 color, float mass + padding
    const size = stride * Float32Array.BYTES_PER_ELEMENT * count;
    const entityData = new Float32Array(new ArrayBuffer(size));
    for(let i = 0; i < count; i++){
        const x = i % window.innerWidth;
        const y = Math.floor(i / window.innerWidth);
        entityData[i * stride + 0] = x; // position.x
        entityData[i * stride + 1] = y; // position.y
        entityData[i * stride + 2] = 0.9; // position.z
        entityData[i * stride + 4] = 0; // velocity.x
        entityData[i * stride + 5] = 0; // velocity.y
        entityData[i * stride + 6] = 0; // velocity.z
        entityData[i * stride + 8] = x / window.innerWidth; // uv.u
        entityData[i * stride + 9] = y / window.innerHeight; // uv.v
        entityData[i * stride + 10] = 0.5 + Math.random(); // mass
    }
    return entityData;
};
class SimulationComputable {
    constructor(device, particlesCount, uniformsBindGroupLayout, uniformsBindGroup){
        this.device = device;
        this.particlesCount = particlesCount;
        this.uniformsBindGroupLayout = uniformsBindGroupLayout;
        this.uniformsBindGroup = uniformsBindGroup;
        this.bindGroupSwapIndex = 0;
        this.entityData = createEntityData(this.particlesCount);
        this.createSimulationBuffersAndBindGroups();
        this.createPipeline();
    }
    createSimulationBuffersAndBindGroups() {
        this.simulationBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
                    buffer: {
                        type: "read-only-storage"
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                }, 
            ]
        });
        const size = this.entityData.byteLength;
        this.simulationBufferA = this.device.createBuffer({
            size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(this.simulationBufferA.getMappedRange()).set([
            ...this.entityData, 
        ]);
        this.simulationBufferA.unmap();
        this.simulationBufferB = this.device.createBuffer({
            size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.simulationBindGroupA = this.device.createBindGroup({
            layout: this.simulationBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.simulationBufferA
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: this.simulationBufferB
                    }
                }, 
            ]
        });
        this.simulationBindGroupB = this.device.createBindGroup({
            layout: this.simulationBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.simulationBufferB
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: this.simulationBufferA
                    }
                }, 
            ]
        });
    }
    createPipeline() {
        const shaderModule = this.device.createShaderModule({
            code: _computeShaderWgslDefault.default
        });
        const bindGroupLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.simulationBindGroupLayout,
                this.uniformsBindGroupLayout, 
            ]
        });
        this.pipeline = this.device.createComputePipeline({
            layout: bindGroupLayout,
            compute: {
                module: shaderModule,
                entryPoint: "main"
            }
        });
    }
    getBindGroupLayout() {
        return this.simulationBindGroupLayout;
    }
    getActiveBindGroup() {
        return this.bindGroupSwapIndex % 2 === 0 ? this.simulationBindGroupA : this.simulationBindGroupB;
    }
    swapBindGroups() {
        this.bindGroupSwapIndex++;
    }
    getCommands() {
        if (!this.getActiveBindGroup()) return;
        const commandEncoder = this.device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.pipeline);
        computePass.setBindGroup(0, this.getActiveBindGroup());
        computePass.setBindGroup(1, this.uniformsBindGroup);
        computePass.dispatchWorkgroups(Math.ceil(this.particlesCount / 64));
        computePass.end();
        return commandEncoder.finish();
    }
}
exports.default = SimulationComputable;

},{"bundle-text:./compute-shader.wgsl":"kiC0K","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kiC0K":[function(require,module,exports) {
module.exports = "struct Body {\n  position: vec3<f32>,\n  velocity: vec3<f32>,\n  texture_uv: vec2<f32>,\n  mass: f32,\n}\n\nstruct Uniforms {\n  u_resolution : vec2<f32>,\n  u_mouse : vec2<f32>,\n}\n\n@group(0) @binding(0) var<storage, read> input : array<Body>;\n@group(0) @binding(1) var<storage, read_write> output : array<Body>;\n@group(1) @binding(0) var<uniform> uniforms : Uniforms;\n\n\nfn calculate_drag(velocity: vec3<f32>, coefficient: f32) -> vec3<f32> {\n  let speed = length(velocity);\n\n  if (speed == 0.0) {\n    return vec3(0);\n  }\n\n  let speed_squared = speed * speed;\n  let direction = normalize(velocity) * -1;\n\n  return coefficient * speed_squared * direction;\n}\n\nfn apply_force(body: Body, acceleration: vec3<f32>, force: vec3<f32>) -> vec3<f32> {\n  return acceleration + (force / body.mass);\n}\n\nfn check_colissions(dst : ptr<function, Body>) {\n  (*dst).position = (*dst).position;\n  (*dst).velocity = (*dst).velocity;\n}\n\n@compute @workgroup_size(64)\nfn main(@builtin(global_invocation_id) global_id : vec3<u32>) {\n  const PI: f32 = 3.14159;\n\n  let radius: f32 = 1;\n  let mouse_radius: f32 = 200;\n  let gravity = vec3<f32>(0, 0, 0);\n  let wind = vec3<f32>(0, 0, 0);\n\n  let bodies_count = arrayLength(&output);\n  let body_index = global_id.x * (global_id.y + 1) * (global_id.z + 1);\n  \n  if(body_index >= bodies_count) {\n    return;\n  }\n\n  var prev_state = input[body_index];\n  let next_state = &output[body_index];\n\n  (*next_state) = prev_state;\n\n  var acceleration = vec3<f32>(0);\n\n\n  // var position_to_mouse: vec3<f32> = (*next_state).position - vec3<f32>(uniforms.u_mouse, 0.0);\n  // var dist = length(position_to_mouse);\n  // if (dist < radius + mouse_radius) {\n  //   let overlap = radius + mouse_radius - dist;\n  //   (*next_state).position = (*next_state).position + normalize(position_to_mouse) * overlap;\n\n  //   var incidence = normalize(position_to_mouse);\n  //   var normal = cross(incidence, vec3<f32>(0, 0, 1));\n  //   (*next_state).velocity = reflect((*next_state).velocity,  normal) * 1.2;\n  // }\n\n  var position_to_mouse: vec3<f32> = (*next_state).position - vec3<f32>(uniforms.u_mouse, 0.0);\n  var dist = length(position_to_mouse);\n  if (dist < mouse_radius) {\n    var repel_direction = normalize(position_to_mouse);\n    var repel_force = 1 - dist / mouse_radius;\n    repel_force = repel_force * repel_force;\n\n    acceleration = apply_force((*next_state), acceleration, repel_direction * repel_force);\n  }\n\n\n  \n  var weight : vec3<f32> = gravity * (*next_state).mass;\n  acceleration = apply_force((*next_state), acceleration, wind);\n  acceleration = apply_force((*next_state), acceleration, weight);\n\n  \n  var drag : vec3<f32> = calculate_drag((*next_state).velocity + acceleration, 0.01);\n  acceleration = apply_force((*next_state), acceleration, drag);\n\n  (*next_state).velocity = (*next_state).velocity + acceleration;\n  (*next_state).position = (*next_state).position + (*next_state).velocity;\n\n  (*next_state).position.z = 0.9 - (step(0.01, length((*next_state).velocity)) * 0.1); // moving pixels render on top\n  \n  // WALLS\n  // TOP\n  if ((*next_state).position.y < 0) {\n    (*next_state).position.y = 0;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));\n  }\n\n  // BOTTOM\n  if ((*next_state).position.y > uniforms.u_resolution.y) {\n    (*next_state).position.y = uniforms.u_resolution.y;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));\n  }\n\n  // LEFT\n  if ((*next_state).position.x > uniforms.u_resolution.x) {\n    (*next_state).position.x = uniforms.u_resolution.x;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(-1, 0, 0));\n  }\n\n  // RIGHT\n  if ((*next_state).position.x < 0) {\n    (*next_state).position.x = 0;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(1, 0, 0));\n  }\n}";

},{}],"adm1N":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('7UhFu') + "George-McNeil.70e06426.png" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"lgJ39":[function(require,module,exports) {
"use strict";
var bundleURL = {
};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return '/';
}
function getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ('' + url).match(/(https?|file|ftp):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}]},["8wcER","h7u1C"], "h7u1C", "parcelRequire94c2")

//# sourceMappingURL=index.b71e74eb.js.map
