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
var _computeShaderWgsl = require("bundle-text:./compute-shader.wgsl");
var _computeShaderWgslDefault = parcelHelpers.interopDefault(_computeShaderWgsl);
var _drawShaderWgsl = require("bundle-text:./draw-shader.wgsl");
var _drawShaderWgslDefault = parcelHelpers.interopDefault(_drawShaderWgsl);
var _img0481Png = require("./IMG_0481.png");
var _img0481PngDefault = parcelHelpers.interopDefault(_img0481Png);
/// <reference types="@webgpu/types" />
console.log("Hello world!");
// TODO — Uniforms and texture on different bind group!
// SECTION ON ALIGNMENT...
// https://surma.dev/things/webgpu/
// you have to pad a vec3 because of alignment
const VERTEX_COUNT = 6;
const ENTITIES_COUNT = window.innerWidth * window.innerHeight;
// const ENTITIES_COUNT = 2_000_000;
const STRIDE = 12; // vec3 position + padding, vec3 velocity + padding, vec3 color, float mass + padding
const BUFFER_SIZE = STRIDE * Float32Array.BYTES_PER_ELEMENT * ENTITIES_COUNT;
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
let ctx;
let presentationFormat;
let device;
let simulationBufferA, simulationBufferB, vertexDataBuffer;
let simulationBindGroupLayout, simulationBindGroupA, simulationBindGroupB;
let uniformBuffer, uniformsBindGroupLayout, uniformsBindGroup, cubeTexture;
let shaderModule, computePipeline;
let renderPipeline;
let renderPassDesc;
let loops = 0;
const mouse = {
    x: -9999,
    y: -9999
};
let isMouseDown = false;
let entityData = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
for(let entity = 0; entity < ENTITIES_COUNT; entity++){
    const x = entity % window.innerWidth;
    const y = Math.floor(entity / window.innerWidth);
    entityData[entity * STRIDE + 0] = x; // position.x
    entityData[entity * STRIDE + 1] = y; // position.y
    entityData[entity * STRIDE + 2] = 0; // position.z
    entityData[entity * STRIDE + 4] = 0; // velocity.x
    entityData[entity * STRIDE + 5] = 0; // velocity.y
    entityData[entity * STRIDE + 6] = 0; // velocity.z
    entityData[entity * STRIDE + 8] = x / window.innerWidth; // uv.u
    entityData[entity * STRIDE + 9] = y / window.innerHeight; // uv.v
    entityData[entity * STRIDE + 10] = 0.5 + Math.random(); // mass
}
const requestWebGPU = async ()=>{
    if (device) return device;
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.warn("Could not access Adapter");
        return;
    }
    device = await adapter.requestDevice();
    return device;
};
const setupCanvasCtx = ()=>{
    ctx = canvas.getContext("webgpu");
    presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    ctx.configure({
        device,
        format: presentationFormat,
        alphaMode: "opaque",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
};
const createBuffers = ()=>{
    simulationBufferA = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    });
    new Float32Array(simulationBufferA.getMappedRange()).set([
        ...entityData
    ]);
    simulationBufferA.unmap();
    simulationBufferB = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    vertexDataBuffer = device.createBuffer({
        size: VERTEX_COUNT * 4 * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true
    });
    // prettier-ignore
    new Float32Array(vertexDataBuffer.getMappedRange()).set([
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
    ]);
    vertexDataBuffer.unmap();
    const uniformBufferSize = 2 * Float32Array.BYTES_PER_ELEMENT + 2 * Float32Array.BYTES_PER_ELEMENT; // resolution, mouse
    uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
};
const createBindGroups = ()=>{
    // A bind group layout defines the input/output interface expected by a shader
    const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear"
    });
    simulationBindGroupLayout = device.createBindGroupLayout({
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
    // A bind group represents the actual input/output data for a shader.
    simulationBindGroupA = device.createBindGroup({
        layout: simulationBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: simulationBufferA
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: simulationBufferB
                }
            }, 
        ]
    });
    simulationBindGroupB = device.createBindGroup({
        layout: simulationBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: simulationBufferB
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: simulationBufferA
                }
            }, 
        ]
    });
    uniformsBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                buffer: {
                    type: "uniform"
                }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                sampler: {
                    type: "filtering"
                }
            },
            {
                binding: 2,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                texture: {
                    sampleType: "float",
                    multisampled: false,
                    viewDimension: "2d"
                }
            }, 
        ]
    });
    uniformsBindGroup = device.createBindGroup({
        layout: uniformsBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer
                }
            },
            {
                binding: 1,
                resource: sampler
            },
            {
                binding: 2,
                resource: cubeTexture.createView()
            }, 
        ]
    });
};
const createComputePipeline = ()=>{
    shaderModule = device.createShaderModule({
        code: _computeShaderWgslDefault.default
    });
    computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [
                simulationBindGroupLayout,
                uniformsBindGroupLayout
            ]
        }),
        compute: {
            module: shaderModule,
            entryPoint: "main"
        }
    });
};
const createComputeCommands = (activeSimulationBindGroup)=>{
    const commandEncoder = device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, activeSimulationBindGroup);
    computePass.setBindGroup(1, uniformsBindGroup);
    computePass.dispatchWorkgroups(Math.ceil(ENTITIES_COUNT / 64));
    computePass.end();
    return commandEncoder.finish();
};
const compute = ()=>{
    performance.mark("compute.start");
    device.queue.submit([
        createComputeCommands(loops % 2 === 0 ? simulationBindGroupA : simulationBindGroupB), 
    ]);
    performance.mark("compute.end");
// console.log(
//   "COMPUTE",
//   performance.measure("compute.duration", "compute.start", "compute.end")
//     .duration
// );
};
const createRenderPipeline = async ()=>{
    // Setup shader modules
    const shaderModule1 = device.createShaderModule({
        code: _drawShaderWgslDefault.default
    });
    await shaderModule1.compilationInfo();
    const vertexState = {
        module: shaderModule1,
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
        module: shaderModule1,
        entryPoint: "fragment_main",
        targets: [
            {
                format: presentationFormat,
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
    const depthFormat = "depth24plus-stencil8";
    const depthTexture = device.createTexture({
        size: {
            width: canvas.width,
            height: canvas.height,
            depthOrArrayLayers: 1
        },
        format: depthFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    renderPipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [
                simulationBindGroupLayout,
                uniformsBindGroupLayout
            ]
        }),
        vertex: vertexState,
        fragment: fragmentState,
        depthStencil: {
            format: depthFormat,
            depthWriteEnabled: true,
            depthCompare: "less"
        }
    });
    renderPassDesc = {
        colorAttachments: [
            {
                view: ctx.getCurrentTexture().createView(),
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
};
const render = ()=>{
    performance.mark("render.start");
    renderPassDesc.colorAttachments[0].view = ctx.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDesc);
    renderPass.setPipeline(renderPipeline);
    renderPass.setBindGroup(0, loops % 2 === 0 ? simulationBindGroupB : simulationBindGroupA);
    renderPass.setBindGroup(1, uniformsBindGroup);
    renderPass.setVertexBuffer(0, vertexDataBuffer);
    renderPass.draw(VERTEX_COUNT, ENTITIES_COUNT, 0, 0);
    renderPass.end();
    device.queue.submit([
        commandEncoder.finish()
    ]);
    performance.mark("render.end");
// console.log(
//   "RENDER",
//   performance.measure("render.duration", "render.start", "render.end")
//     .duration
// );
};
const animate = ()=>{
    const uniformsArray = new Float32Array([
        window.innerWidth,
        window.innerHeight,
        mouse.x,
        mouse.y, 
    ]);
    device.queue.writeBuffer(uniformBuffer, 0, uniformsArray);
    compute();
    render();
    loops++;
    performance.clearMarks();
    performance.clearMeasures();
    requestAnimationFrame(animate);
};
const loadTexture = async ()=>{
    const img = document.createElement("img");
    img.src = _img0481PngDefault.default;
    await img.decode();
    const imageBitmap = await createImageBitmap(img);
    cubeTexture = device.createTexture({
        size: [
            imageBitmap.width,
            imageBitmap.height,
            1
        ],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    device.queue.copyExternalImageToTexture({
        source: imageBitmap
    }, {
        texture: cubeTexture
    }, [
        imageBitmap.width,
        imageBitmap.height
    ]);
};
(async ()=>{
    if (!navigator.gpu) {
        alert("WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags.");
        return;
    }
    // setupDOMRenderer();
    await requestWebGPU();
    await loadTexture();
    setupCanvasCtx();
    createBuffers();
    createBindGroups();
    createComputePipeline();
    await createRenderPipeline();
    requestAnimationFrame(animate);
    window.addEventListener("mousedown", ({ clientX , clientY  })=>{
        mouse.x = clientX;
        mouse.y = clientY;
        isMouseDown = true;
    });
    window.addEventListener("mouseup", ()=>{
        isMouseDown = false;
    });
    window.addEventListener("mousemove", ({ clientX , clientY  })=>{
        if (isMouseDown) {
            mouse.x = clientX;
            mouse.y = clientY;
        } else {
            mouse.x = -9999;
            mouse.y = -9999;
        }
    });
})();

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","bundle-text:./compute-shader.wgsl":"4NDR6","bundle-text:./draw-shader.wgsl":"l4wa9","./IMG_0481.png":"gkfcK"}],"gkKU3":[function(require,module,exports) {
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

},{}],"4NDR6":[function(require,module,exports) {
module.exports = "struct Body {\n  position: vec3<f32>,\n  velocity: vec3<f32>,\n  texture_uv: vec2<f32>,\n  mass: f32,\n}\n\nstruct Uniforms {\n  u_resolution : vec2<f32>,\n  u_mouse : vec2<f32>,\n}\n\n@group(0) @binding(0) var<storage, read> input : array<Body>;\n@group(0) @binding(1) var<storage, read_write> output : array<Body>;\n@group(1) @binding(0) var<uniform> uniforms : Uniforms;\n\n\nfn calculate_drag(velocity: vec3<f32>, coefficient: f32) -> vec3<f32> {\n  let speed = length(velocity);\n\n  if (speed == 0.0) {\n    return vec3(0);\n  }\n\n  let speed_squared = speed * speed;\n  let direction = normalize(velocity) * -1;\n\n  return coefficient * speed_squared * direction;\n}\n\nfn apply_force(body: Body, acceleration: vec3<f32>, force: vec3<f32>) -> vec3<f32> {\n  return acceleration + (force / body.mass);\n}\n\nfn check_colissions(dst : ptr<function, Body>) {\n  (*dst).position = (*dst).position;\n  (*dst).velocity = (*dst).velocity;\n}\n\n@compute @workgroup_size(64)\nfn main(@builtin(global_invocation_id) global_id : vec3<u32>) {\n  const PI: f32 = 3.14159;\n\n  let radius: f32 = 1;\n  let mouse_radius: f32 = 200;\n  let gravity = vec3<f32>(0, 0, 0);\n  let wind = vec3<f32>(0, 0, 0);\n\n  let bodies_count = arrayLength(&output);\n  let body_index = global_id.x * (global_id.y + 1) * (global_id.z + 1);\n  \n  if(body_index >= bodies_count) {\n    return;\n  }\n\n  var prev_state = input[body_index];\n  let next_state = &output[body_index];\n\n  (*next_state) = prev_state;\n\n  var acceleration = vec3<f32>(0);\n\n\n  // var position_to_mouse: vec3<f32> = (*next_state).position - vec3<f32>(uniforms.u_mouse, 0.0);\n  // var dist = length(position_to_mouse);\n  // if (dist < radius + mouse_radius) {\n  //   let overlap = radius + mouse_radius - dist;\n  //   (*next_state).position = (*next_state).position + normalize(position_to_mouse) * overlap;\n\n  //   var incidence = normalize(position_to_mouse);\n  //   var normal = cross(incidence, vec3<f32>(0, 0, 1));\n  //   (*next_state).velocity = reflect((*next_state).velocity,  normal) * 1.2;\n  // }\n\n  var position_to_mouse: vec3<f32> = (*next_state).position - vec3<f32>(uniforms.u_mouse, 0.0);\n  var dist = length(position_to_mouse);\n  if (dist < mouse_radius) {\n    var repel_direction = normalize(position_to_mouse);\n    var repel_force = 1 - dist / mouse_radius;\n    repel_force = repel_force * repel_force;\n\n    acceleration = apply_force((*next_state), acceleration, repel_direction * repel_force);\n  }\n\n\n  \n  var weight : vec3<f32> = gravity * (*next_state).mass;\n  acceleration = apply_force((*next_state), acceleration, wind);\n  acceleration = apply_force((*next_state), acceleration, weight);\n\n  \n  var drag : vec3<f32> = calculate_drag((*next_state).velocity + acceleration, 0.01);\n  acceleration = apply_force((*next_state), acceleration, drag);\n\n  (*next_state).velocity = (*next_state).velocity + acceleration;\n  (*next_state).position = (*next_state).position + (*next_state).velocity;\n  \n  // WALLS\n  // TOP\n  if ((*next_state).position.y < 0) {\n    (*next_state).position.y = 0;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));\n  }\n\n  // BOTTOM\n  if ((*next_state).position.y > uniforms.u_resolution.y) {\n    (*next_state).position.y = uniforms.u_resolution.y;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));\n  }\n\n  // LEFT\n  if ((*next_state).position.x > uniforms.u_resolution.x) {\n    (*next_state).position.x = uniforms.u_resolution.x;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(-1, 0, 0));\n  }\n\n  // RIGHT\n  if ((*next_state).position.x < 0) {\n    (*next_state).position.x = 0;\n    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(1, 0, 0));\n  }\n}";

},{}],"l4wa9":[function(require,module,exports) {
module.exports = "struct Body {\n  position: vec3<f32>,\n  velocity: vec3<f32>,\n  texture_uv: vec2<f32>,\n  mass: f32,\n}\n\nstruct Uniforms {\n  u_resolution : vec2<f32>,\n  u_mouse : vec2<f32>,\n}\n\n@group(0) @binding(0) var<storage, read> input : array<Body>;\n@group(1) @binding(0) var<uniform> uniforms : Uniforms;\n@group(1) @binding(1) var mySampler: sampler;\n@group(1) @binding(2) var myTexture: texture_2d<f32>;\n\nstruct VertexInput {\n  @location(0) position : vec2<f32>,\n  @location(1) texture_uv : vec2<f32>,\n}\n\nstruct VertexOutput {\n  @builtin(position) position : vec4<f32>,\n  @location(0) texture_uv : vec2<f32>,\n}\n\nfn ball_sdf(position : vec2<f32>, radius : f32, coords : vec2<f32>) -> f32 {\n  var dst : f32 = radius / 2.0 / length(coords - position);\n  return dst;\n}\n\nfn screen_space_to_clip_space(screen_space: vec2<f32>) -> vec2<f32> {\n  var clip_space = ((screen_space / uniforms.u_resolution) * 2.0) - 1.0;\n  clip_space.y = clip_space.y * -1;\n\n  return clip_space;\n}\n\nfn quantize(value: f32, q_step: f32) -> f32 {\n  return round(value / q_step) * q_step;\n}\n\n@vertex\nfn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {\n  var output : VertexOutput;\n  var radius : f32 = 0.5;\n  var entity = input[instance_index];\n\n  var screen_space_coords: vec2<f32> = vert.position.xy * radius + entity.position.xy;\n  output.position = vec4<f32>(screen_space_to_clip_space(screen_space_coords), 0, 1.0);\n  output.texture_uv = entity.texture_uv;\n  return output;\n}\n\n@fragment\nfn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {\n\n  var color = textureSample(myTexture, mySampler, in.texture_uv);\n  return vec4<f32>(color.rgb, 1.0);\n}";

},{}],"gkfcK":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('7UhFu') + "IMG_0481.12df7d47.png" + "?" + Date.now();

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
