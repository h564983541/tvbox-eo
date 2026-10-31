var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/stubs/node-fs.js
var node_fs_exports = {};
__export(node_fs_exports, {
  createReadStream: () => createReadStream,
  createWriteStream: () => createWriteStream,
  default: () => node_fs_default,
  existsSync: () => existsSync,
  mkdirSync: () => mkdirSync,
  promises: () => promises,
  readFileSync: () => readFileSync,
  writeFileSync: () => writeFileSync
});
function unavailable(name) {
  return function() {
    throw new Error(`node builtin "${name}" is not available in EdgeOne edge runtime`);
  };
}
var readFileSync, writeFileSync, existsSync, mkdirSync, createReadStream, createWriteStream, promises, node_fs_default;
var init_node_fs = __esm({
  "src/stubs/node-fs.js"() {
    "use strict";
    readFileSync = unavailable("fs");
    writeFileSync = unavailable("fs");
    existsSync = () => false;
    mkdirSync = unavailable("fs");
    createReadStream = unavailable("fs");
    createWriteStream = unavailable("fs");
    promises = {};
    node_fs_default = {};
  }
});

// src/stubs/node-path.js
var node_path_exports = {};
__export(node_path_exports, {
  basename: () => basename,
  default: () => node_path_default,
  dirname: () => dirname,
  extname: () => extname,
  join: () => join,
  resolve: () => resolve,
  sep: () => sep
});
var join, resolve, dirname, basename, extname, sep, node_path_default;
var init_node_path = __esm({
  "src/stubs/node-path.js"() {
    "use strict";
    join = (...parts) => parts.filter(Boolean).join("/");
    resolve = (...parts) => parts.filter(Boolean).join("/");
    dirname = (p) => String(p).split("/").slice(0, -1).join("/") || "/";
    basename = (p) => String(p).split("/").pop() || "";
    extname = (p) => {
      const b = String(p).split("/").pop() || "";
      const i = b.lastIndexOf(".");
      return i > 0 ? b.slice(i) : "";
    };
    sep = "/";
    node_path_default = { join, resolve, dirname, basename, extname, sep };
  }
});

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// src/core/config.ts
var DEFAULT_SPEED_TIMEOUT_MS = 5e3;
var DEFAULT_SITE_TIMEOUT_MS = 3e3;
var DEFAULT_FETCH_TIMEOUT_MS = 5e3;
var KV_MERGED_CONFIG = "merged_config";
var KV_MERGED_CONFIG_FULL = "merged_config_full";
var KV_SOURCE_URLS = "source_urls";
var KV_LAST_UPDATE = "last_update";
var KV_MANUAL_SOURCES = "manual_sources";
var KV_MACCMS_SOURCES = "maccms_sources";
var KV_LIVE_SOURCES = "live_sources";
var LIVE_PROXY_TTL = 7200;
var IMG_PROXY_TTL = 604800;
var KV_BLACKLIST = "blacklist";
var KV_INLINE_PREFIX = "inline_config_";
var KV_NAME_TRANSFORM = "name_transform";
var KV_SOURCE_HEALTH = "source_health";
var KV_SPEED_TEST_ENABLED = "speed_test_enabled";
var TVBOX_UA = "okhttp/3.12.0";
var BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36";
var KV_CRON_INTERVAL = "cron_interval";
var DEFAULT_CRON_INTERVAL = 1440;
var KV_EDGE_PROXIES = "edge_proxies";
var KV_CLOUD_CREDENTIALS = "cloud_credentials";
var KV_CREDENTIAL_POLICY = "credential_policy";
var KV_CREDENTIAL_ENCRYPTION_KEY = "credential_encryption_key";
var KV_SEARCH_QUOTA = "search_quota";
var KV_SEARCH_QUOTA_REPORT = "search_quota_report";
var KV_CHANNEL_SPEED_MAP = "channel_speed_map";
var KV_CHANNEL_PROBE_ENABLED = "channel_probe_enabled";
var KV_CHANNEL_PROBE_STATUS = "channel_probe_status";
var KV_CHANNEL_MERGED_TREE = "channel_merged_tree";
var KV_AGG_LOGS = "agg_logs";
var AGG_LOGS_MAX = 50;
var KV_SITE_SNAPSHOT = "site_snapshot";
var KV_BG_SETTINGS = "bg_settings";
var KV_GROUP_ORDER = "group_order";
var KV_DEDUP_CONFIG = "dedup_config";
var KV_LIVE_DISABLED = "live_disabled";
var BASE_URL_PLACEHOLDER = "{{BASE_URL}}";
var KV_SMART_BASE_URL_ENABLED = "smart_base_url_enabled";
var KV_SITE_HEALTH_MAP = "site_health_map";
var KV_SITE_PROBE_DEPTH = "site_probe_depth";
var KV_SITE_AUTO_CLEAN = "site_auto_clean";
var CHANNEL_PROBE_CONCURRENCY = 50;
var CHANNEL_PROBE_TIMEOUT_MS = 5e3;
var CHANNEL_SPEED_TTL_MS = 7 * 24 * 60 * 60 * 1e3;

// src/core/base-url.ts
function getRequestBaseUrl(c, fallback) {
  const host = c.req.header("Host");
  if (!host) return fallback;
  const proto = c.req.header("X-Forwarded-Proto")?.split(",")[0].trim() || "http";
  return `${proto}://${host}`;
}
function applyBaseUrlPlaceholder(json, baseUrl) {
  return json.replaceAll(BASE_URL_PLACEHOLDER, baseUrl);
}
function stripHostPort(host) {
  if (host.startsWith("[")) {
    const closeIdx = host.indexOf("]");
    if (closeIdx === -1) return host;
    return host.substring(1, closeIdx);
  }
  const firstColonIdx = host.indexOf(":");
  if (firstColonIdx === -1) return host;
  if (host.indexOf(":", firstColonIdx + 1) !== -1) return host;
  return host.substring(0, firstColonIdx);
}
function isLanHost(host) {
  const lower = stripHostPort(host).toLowerCase();
  if (lower === "localhost") return true;
  const ipv4Match = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (a > 255 || Number(ipv4Match[3]) > 255 || Number(ipv4Match[4]) > 255) return false;
    if (a === 127) return true;
    if (a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    return false;
  }
  if (lower === "::1") return true;
  if (lower.startsWith("::ffff:")) return false;
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true;
  if (/^fe[89ab][0-9a-f]:/.test(lower)) return true;
  return false;
}
function assertHostAllowed(actualBase, fallback, dmzEnabled) {
  if (actualBase === fallback) return true;
  if (dmzEnabled) return true;
  try {
    return isLanHost(new URL(actualBase).hostname);
  } catch {
    return false;
  }
}

// src/core/logger.ts
var VERBOSE_TRUE = /* @__PURE__ */ new Set(["1", "true", "yes", "on"]);
function isVerbose() {
  try {
    return VERBOSE_TRUE.has(String(process.env.VERBOSE || "").trim().toLowerCase());
  } catch {
    return false;
  }
}
function formatValue(value) {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
function formatFields(fields) {
  return Object.entries(fields).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => {
    const raw2 = formatValue(value).replace(/\s+/g, " ").trim();
    if (!raw2) return `${key}=""`;
    if (/^[A-Za-z0-9_./:@?&=%+\-[\],]+$/.test(raw2)) return `${key}=${raw2}`;
    return `${key}=${JSON.stringify(raw2)}`;
  }).join(" ");
}
var logger = {
  info(scope, message) {
    console.log(`[${scope}] ${message}`);
  },
  infoFields(scope, event, fields) {
    this.info(scope, `${event} ${formatFields(fields)}`.trim());
  },
  debug(scope, message) {
    if (isVerbose()) console.log(`[${scope}] ${message}`);
  },
  debugFields(scope, event, fields) {
    this.debug(scope, `${event} ${formatFields(fields)}`.trim());
  },
  warn(scope, message) {
    console.warn(`[${scope}] ${message}`);
  },
  warnFields(scope, event, fields) {
    this.warn(scope, `${event} ${formatFields(fields)}`.trim());
  },
  error(scope, message) {
    console.error(`[${scope}] ${message}`);
  },
  errorFields(scope, event, fields) {
    this.error(scope, `${event} ${formatFields(fields)}`.trim());
  },
  security(event, fields) {
    console.warn(`[security] ${event} ${formatFields(fields)}`.trim());
  }
};

// src/core/group-order.ts
var DEFAULT_GROUP_ORDER_CONFIG = {
  rules: [],
  unmatchedPosition: "after",
  enabled: false
};
async function loadGroupOrder(storage) {
  const raw2 = await storage.get(KV_GROUP_ORDER);
  if (!raw2) return { ...DEFAULT_GROUP_ORDER_CONFIG };
  try {
    const parsed = JSON.parse(raw2);
    return {
      rules: parsed.rules || [],
      unmatchedPosition: parsed.unmatchedPosition || "after",
      enabled: parsed.enabled !== false
    };
  } catch {
    return { ...DEFAULT_GROUP_ORDER_CONFIG };
  }
}
async function saveGroupOrder(storage, cfg) {
  await storage.put(KV_GROUP_ORDER, JSON.stringify(cfg));
}
function applyGroupOrder(sites, cfg) {
  if (!cfg.enabled || cfg.rules.length === 0) return sites;
  function getRuleIndex(site) {
    const nameLower = (site.name || "").toLowerCase();
    for (let i = 0; i < cfg.rules.length; i++) {
      const rule = cfg.rules[i];
      const hit = rule.keywords.some((kw) => kw && nameLower.includes(kw.toLowerCase()));
      if (hit) return i;
    }
    return -1;
  }
  const buckets = cfg.rules.map(() => []);
  const unmatched = [];
  for (const site of sites) {
    const idx = getRuleIndex(site);
    if (idx >= 0) {
      buckets[idx].push(site);
    } else {
      unmatched.push(site);
    }
  }
  const ordered = [];
  const matched = buckets.flat();
  if (cfg.unmatchedPosition === "before") {
    ordered.push(...unmatched, ...matched);
  } else {
    ordered.push(...matched, ...unmatched);
  }
  const matchedCount = matched.length;
  const unmatchedCount = unmatched.length;
  console.log(`[group-order] Applied: ${matchedCount} matched (${cfg.rules.length} rules), ${unmatchedCount} unmatched (position: ${cfg.unmatchedPosition})`);
  return ordered;
}

// src/core/decoder.ts
async function decodeConfigResponse(buffer, configKey) {
  const utf8Text = new TextDecoder("utf-8").decode(buffer);
  if (isJson(utf8Text)) {
    return utf8Text;
  }
  const text = new TextDecoder("latin1").decode(buffer);
  const imageDecoded = decodeImageWrapped(text);
  if (imageDecoded !== null) {
    console.log("[decoder] Decoded image-wrapped base64 config");
    return imageDecoded;
  }
  if (text.startsWith("2423")) {
    try {
      const cbcResult = await decryptAesCbc(text);
      if (cbcResult !== null) {
        console.log("[decoder] Decoded AES CBC config");
        return cbcResult;
      }
    } catch (e) {
      console.warn("[decoder] AES CBC decryption failed:", e);
    }
  }
  if (configKey && !isJson(text)) {
    try {
      const ecbResult = await decryptAesEcb(text, configKey);
      if (ecbResult !== null) {
        console.log("[decoder] Decoded AES ECB config");
        return ecbResult;
      }
    } catch (e) {
      console.warn("[decoder] AES ECB decryption failed:", e);
    }
  }
  return utf8Text;
}
function decodeImageWrapped(text) {
  const marker = /[A-Za-z0]{8}\*\*/;
  const match2 = marker.exec(text);
  if (!match2) return null;
  const base64Start = match2.index + 10;
  const base64Data = text.substring(base64Start).trim();
  if (!base64Data) return null;
  try {
    return base64Decode(base64Data);
  } catch {
    return null;
  }
}
async function decryptAesCbc(hexContent) {
  const separatorIndex = hexContent.indexOf("2324");
  if (separatorIndex === -1) return null;
  const data = hexContent.substring(separatorIndex + 4, hexContent.length - 26);
  const fullStr = hexToString(hexContent).toLowerCase();
  const keyStart = fullStr.indexOf("$#");
  const keyEnd = fullStr.indexOf("#$");
  if (keyStart === -1 || keyEnd === -1) return null;
  const key = rightPadding(fullStr.substring(keyStart + 2, keyEnd), "0", 16);
  const iv = rightPadding(fullStr.substring(fullStr.length - 13), "0", 16);
  const cipherBytes = hexToBytes(data);
  const keyBytes = new TextEncoder().encode(key);
  const ivBytes = new TextEncoder().encode(iv);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBytes },
    cryptoKey,
    cipherBytes
  );
  return new TextDecoder("utf-8").decode(decrypted);
}
async function decryptAesEcb(hexContent, key) {
  const paddedKey = rightPadding(key, "0", 16);
  const cipherBytes = hexToBytes(hexContent);
  const keyBytes = new TextEncoder().encode(paddedKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const zeroIv = new Uint8Array(16);
  const blocks = [];
  for (let i = 0; i < cipherBytes.length; i += 16) {
    const block = cipherBytes.slice(i, i + 16);
    if (i + 16 < cipherBytes.length) {
      const paddedBlock = new Uint8Array(32);
      paddedBlock.set(block, 0);
      for (let j = 16; j < 32; j++) paddedBlock[j] = 16;
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: zeroIv },
        cryptoKey,
        paddedBlock
      );
      blocks.push(new Uint8Array(decrypted));
    } else {
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: zeroIv },
        cryptoKey,
        block
      );
      blocks.push(new Uint8Array(decrypted));
    }
  }
  const totalLength = blocks.reduce((sum, b) => sum + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of blocks) {
    result.set(b, offset);
    offset += b.length;
  }
  return new TextDecoder("utf-8").decode(result);
}
function rightPadding(str, pad, length) {
  let result = str;
  while (result.length < length) {
    result += pad;
  }
  return result.substring(0, length);
}
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
function hexToString(hex) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
  }
  return str;
}
function isJson(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}
function base64Decode(data) {
  if (typeof atob === "function") {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  }
  return Buffer.from(data, "base64").toString("utf-8");
}

// src/core/fetcher.ts
var MAX_MULTI_REPO_DEPTH = 3;
async function fetchConfigs(sources, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, proxyConfig) {
  const configs = [];
  const fetchResults = [];
  const seen = /* @__PURE__ */ new Set();
  await expandSources(sources, configs, fetchResults, seen, timeoutMs, 0, proxyConfig);
  console.log(`[fetcher] Fetched ${configs.length} configs from ${sources.length} top-level sources`);
  return { configs, fetchResults };
}
async function expandSources(sources, configs, fetchResults, seen, timeoutMs, depth, proxyConfig) {
  const uniqueSources = sources.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
  if (uniqueSources.length === 0) return;
  const tag = depth === 0 ? "" : ` (depth ${depth})`;
  console.log(`[fetcher] Fetching ${uniqueSources.length} sources${tag}...`);
  const results = await Promise.allSettled(
    uniqueSources.map((source) => fetchSingleConfig(source, timeoutMs, proxyConfig))
  );
  const multiRepoChildren = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const source = uniqueSources[i];
    if (result.status === "fulfilled" && result.value) {
      const { config: fetchedConfig, fetchResult } = result.value;
      fetchResults.push(fetchResult);
      if (fetchResult.status !== "ok") {
        continue;
      }
      if (isMultiRepoConfig(fetchedConfig)) {
        const children = extractMultiRepoEntries(fetchedConfig, fetchResult.name);
        console.log(`[fetcher] Multi-repo: ${source.url} \u2192 ${children.length} sub-sources`);
        if (depth < MAX_MULTI_REPO_DEPTH) {
          multiRepoChildren.push(...children);
        } else {
          console.log(`[fetcher] Max depth reached, skipping expansion of ${source.url}`);
        }
      } else {
        configs.push({
          sourceUrl: source.url,
          sourceName: source.name,
          config: fetchedConfig,
          speedMs: fetchResult.speedMs
        });
      }
    } else if (result.status === "rejected") {
      console.warn(`[fetcher] Failed: ${source.url}: ${result.reason}`);
      fetchResults.push({
        url: source.url,
        name: source.name,
        status: "network_error",
        errorMessage: String(result.reason)
      });
    }
  }
  if (multiRepoChildren.length > 0) {
    await expandSources(multiRepoChildren, configs, fetchResults, seen, timeoutMs, depth + 1, proxyConfig);
  }
}
async function fetchSingleConfig(source, timeoutMs, proxyConfig) {
  const result = await fetchWithUA(source, timeoutMs, TVBOX_UA);
  if (result.config) return result;
  if (result.fetchResult.status === "parse_error" || result.fetchResult.status === "decode_error") {
    console.log(`[fetcher] Retrying ${source.url} with browser UA`);
    const browserResult = await fetchWithUA(source, timeoutMs, BROWSER_UA);
    if (browserResult.config) return browserResult;
  }
  if (proxyConfig?.urls.length && isProxyRetriable(result.fetchResult.status)) {
    for (const proxyUrl of proxyConfig.urls) {
      console.log(`[fetcher] Retrying ${source.url} via proxy ${proxyUrl.substring(0, 40)}...`);
      const proxyResult = await fetchViaProxy(source, timeoutMs, proxyUrl, proxyConfig.token);
      if (proxyResult.config) return proxyResult;
    }
  }
  return result;
}
function isProxyRetriable(status) {
  return status === "timeout" || status === "network_error" || status === "http_error";
}
async function fetchViaProxy(source, timeoutMs, proxyUrl, token) {
  const url = `${proxyUrl}?url=${encodeURIComponent(source.url)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const startTime = Date.now();
    const headers = {
      "Accept": "application/json, text/plain, */*",
      "X-Proxy-UA": TVBOX_UA
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(url, { signal: controller.signal, headers });
    if (!response.ok) {
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "http_error", errorMessage: `Proxy: HTTP ${response.status}` }
      };
    }
    const buffer = await response.arrayBuffer();
    const decoded = await decodeConfigResponse(buffer, source.configKey);
    if (!decoded) {
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "decode_error", errorMessage: "Proxy: Undecodable" }
      };
    }
    const config = parseConfigJson(decoded);
    if (!config) {
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "parse_error", errorMessage: "Proxy: Invalid JSON" }
      };
    }
    const speedMs = Date.now() - startTime;
    console.log(`[fetcher] Proxy success for ${source.url} (${speedMs}ms)`);
    return {
      config,
      fetchResult: { url: source.url, name: source.name, status: "ok", speedMs }
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      config: null,
      fetchResult: { url: source.url, name: source.name, status: "network_error", errorMessage: `Proxy: ${msg}` }
    };
  } finally {
    clearTimeout(timer);
  }
}
async function fetchWithUA(source, timeoutMs, userAgent) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const startTime = Date.now();
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": userAgent
      }
    });
    if (!response.ok) {
      console.warn(`[fetcher] ${source.url} returned ${response.status}`);
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "http_error", errorMessage: `HTTP ${response.status}` }
      };
    }
    const buffer = await response.arrayBuffer();
    const decoded = await decodeConfigResponse(buffer, source.configKey);
    if (!decoded) {
      console.warn(`[fetcher] ${source.url} returned undecodable content`);
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "decode_error", errorMessage: "Undecodable content" }
      };
    }
    const config = parseConfigJson(decoded);
    if (!config) {
      console.warn(`[fetcher] ${source.url} returned invalid JSON after decoding`);
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "parse_error", errorMessage: "Invalid JSON" }
      };
    }
    const speedMs = Date.now() - startTime;
    return {
      config,
      fetchResult: { url: source.url, name: source.name, status: "ok", speedMs }
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("abort")) {
      console.warn(`[fetcher] ${source.url} timed out (${timeoutMs}ms)`);
      return {
        config: null,
        fetchResult: { url: source.url, name: source.name, status: "timeout", errorMessage: `Timeout (${timeoutMs}ms)` }
      };
    }
    return {
      config: null,
      fetchResult: { url: source.url, name: source.name, status: "network_error", errorMessage: msg }
    };
  } finally {
    clearTimeout(timer);
  }
}
function parseConfigJson(text) {
  let cleaned = text.replace(/^\uFEFF/, "");
  cleaned = cleaned.trim();
  const jsonpMatch = cleaned.match(/^\w+\(([\s\S]+)\)$/);
  if (jsonpMatch) {
    cleaned = jsonpMatch[1];
  }
  let parsed = tryParseJson(cleaned);
  if (!parsed) {
    const stripped = stripJsonComments(cleaned);
    parsed = tryParseJson(stripped);
  }
  if (!parsed) return null;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  return parsed;
}
function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
function isMultiRepoConfig(config) {
  const raw2 = config;
  if (Array.isArray(raw2.storeHouse)) return true;
  if (Array.isArray(raw2.urls) && !config.sites) return true;
  return false;
}
function extractMultiRepoEntries(config, parentName) {
  const raw2 = config;
  const entries = [];
  if (Array.isArray(raw2.storeHouse)) {
    for (const item of raw2.storeHouse) {
      const url = item?.sourceUrl;
      if (typeof url === "string" && url.trim()) {
        entries.push({
          name: typeof item.sourceName === "string" ? item.sourceName : parentName,
          url: url.trim()
        });
      }
    }
  } else if (Array.isArray(raw2.urls)) {
    for (const item of raw2.urls) {
      const url = item?.url;
      if (typeof url === "string" && url.trim()) {
        entries.push({
          name: typeof item.name === "string" ? item.name : parentName,
          url: url.trim()
        });
      }
    }
  }
  return entries;
}
function stripJsonComments(text) {
  let result = "";
  let inString = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      result += ch;
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      result += ch;
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (!inString && ch === "/" && text[i + 1] === "/") {
      const newline = text.indexOf("\n", i);
      if (newline === -1) break;
      i = newline - 1;
      continue;
    }
    result += ch;
  }
  return result;
}

// src/core/maccms.ts
async function validateMacCMS(api, timeoutMs) {
  const url = api.includes("?") ? `${api}&ac=list` : `${api}?ac=list`;
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const speedMs = Date.now() - start;
    if (!resp.ok) return { ok: false, speedMs };
    const data = await resp.json();
    const ok = !!(data && (data.class || data.list));
    return { ok, speedMs };
  } catch {
    return { ok: false, speedMs: Date.now() - start };
  }
}
function macCMSToTVBoxSites(entries, proxyBaseUrl, speedMap) {
  return entries.map((entry) => {
    let name = entry.name;
    const speedMs = speedMap?.get(entry.key);
    if (speedMs != null) {
      const seconds = (speedMs / 1e3).toFixed(1);
      name = `${name} [${seconds}s]`;
    }
    return {
      key: entry.key,
      name,
      type: 1,
      api: proxyBaseUrl ? `${proxyBaseUrl.replace(/\/$/, "")}/api/${entry.key}` : entry.api,
      searchable: 1,
      quickSearch: 1,
      filterable: 1
    };
  });
}
async function processMacCMSForLocal(entries, timeoutMs) {
  if (entries.length === 0) return { passed: [], speedMap: /* @__PURE__ */ new Map() };
  console.log(`[maccms] Validating ${entries.length} MacCMS sources...`);
  const results = await Promise.allSettled(
    entries.map(async (entry) => {
      const validation = await validateMacCMS(entry.api, timeoutMs);
      return { entry, validation };
    })
  );
  const passed = [];
  const speedMap = /* @__PURE__ */ new Map();
  for (const result of results) {
    if (result.status === "fulfilled") {
      const { entry, validation } = result.value;
      if (validation.ok) {
        passed.push(entry);
        speedMap.set(entry.key, validation.speedMs);
      } else {
        console.log(`[maccms] Filtered out ${entry.key}: validation failed (${validation.speedMs}ms)`);
      }
    } else {
      console.log(`[maccms] Filtered out unknown: ${result.reason}`);
    }
  }
  console.log(
    `[maccms] ${passed.length}/${entries.length} MacCMS sources passed validation`
  );
  return { passed, speedMap };
}

// src/core/jar-proxy.ts
var KV_JAR_PREFIX = "jar:";
function parseSpiderString(spider) {
  let prefix = "";
  let rest = spider;
  if (rest.startsWith("img+")) {
    prefix = "img+";
    rest = rest.substring(4);
  }
  const md5Idx = rest.indexOf(";md5;");
  if (md5Idx !== -1) {
    const url = rest.substring(0, md5Idx);
    const md52 = rest.substring(md5Idx + 5);
    return { prefix, url, md5: md52, raw: spider };
  }
  return { prefix, url: rest, md5: null, raw: spider };
}
async function urlToKey(url) {
  const data = new TextEncoder().encode(url);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes.slice(0, 8)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function buildRewrittenSpider(spider, workerBaseUrl, urlKeyMap) {
  if (!spider) return null;
  const parsed = parseSpiderString(spider);
  if (!parsed.url.startsWith("http://") && !parsed.url.startsWith("https://")) {
    return null;
  }
  const key = urlKeyMap.get(parsed.url);
  if (!key) return null;
  const proxyUrl = `${workerBaseUrl.replace(/\/$/, "")}/jar/${key}`;
  if (parsed.md5) {
    return `${parsed.prefix}${proxyUrl};md5;${parsed.md5}`;
  }
  return `${parsed.prefix}${proxyUrl}`;
}
async function rewriteJarUrls(config, workerBaseUrl, storage) {
  const uniqueJars = /* @__PURE__ */ new Map();
  if (config.spider) {
    const parsed = parseSpiderString(config.spider);
    if (parsed.url.startsWith("http://") || parsed.url.startsWith("https://")) {
      uniqueJars.set(parsed.url, { md5: parsed.md5 });
    }
  }
  for (const site of config.sites || []) {
    if (site.jar) {
      const parsed = parseSpiderString(site.jar);
      if (parsed.url.startsWith("http://") || parsed.url.startsWith("https://")) {
        if (!uniqueJars.has(parsed.url)) {
          uniqueJars.set(parsed.url, { md5: parsed.md5 });
        }
      }
    }
  }
  if (uniqueJars.size === 0) {
    console.log("[jar-proxy] No JAR URLs to rewrite");
    return config;
  }
  const urlKeyMap = /* @__PURE__ */ new Map();
  for (const [url, { md5: md52 }] of uniqueJars) {
    const key = md52 || await urlToKey(url);
    urlKeyMap.set(url, key);
    await storage.put(`${KV_JAR_PREFIX}${key}`, url);
    console.log(`[jar-proxy] Mapped ${key} \u2192 ${url.substring(0, 60)}...`);
  }
  console.log(`[jar-proxy] Wrote ${urlKeyMap.size} KV mappings`);
  const result = { ...config };
  if (result.spider) {
    const rewritten = buildRewrittenSpider(result.spider, workerBaseUrl, urlKeyMap);
    if (rewritten) result.spider = rewritten;
  }
  if (result.sites) {
    result.sites = result.sites.map((site) => {
      if (!site.jar) return site;
      const rewritten = buildRewrittenSpider(site.jar, workerBaseUrl, urlKeyMap);
      if (rewritten) return { ...site, jar: rewritten };
      return site;
    });
  }
  console.log(`[jar-proxy] Rewrote ${urlKeyMap.size} unique JAR URLs across config`);
  return result;
}
async function lookupJarUrl(key, storage) {
  return storage.get(`${KV_JAR_PREFIX}${key}`);
}
function isMd5Key(key) {
  return /^[0-9a-f]{32}$/i.test(key);
}
function base64ToUint8Array(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// src/core/live-source.ts
var KV_LIVE_PREFIX = "live:";
async function lookupLiveUrl(key, storage) {
  return storage.get(`${KV_LIVE_PREFIX}${key}`);
}

// src/core/shared-styles.ts
var LOCAL_FONT_FACE = `
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/jetbrains-mono-latin-ext.woff2') format('woff2');unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/jetbrains-mono-latin.woff2') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Outfit';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/outfit-latin-ext.woff2') format('woff2');unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Outfit';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/outfit-latin.woff2') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
`;
var CDN_FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700&display=swap');`;
var sharedStylesBody = `

*{margin:0;padding:0;box-sizing:border-box}

:root{
  --bg:#0a0e14;
  --surface:#111720;
  --surface-2:#161d2a;
  --border:#1e2a3a;
  --border-glow:#2a3f5f;
  --green:#00e5a0;
  --green-dim:#00e5a033;
  --green-glow:#00e5a066;
  --amber:#f0a030;
  --amber-dim:#f0a03033;
  --red:#ff4060;
  --red-dim:#ff406033;
  --blue:#4da6ff;
  --blue-dim:#4da6ff33;
  --text:#c8d6e5;
  --text-dim:#5a6d82;
  --text-bright:#fff;
  --mono:'JetBrains Mono',monospace;
  --sans:'Outfit',sans-serif;
}

[data-theme="light"]{
  --bg:#f4f6f9;
  --surface:#ffffff;
  --surface-2:#eef1f5;
  --border:#d4dae3;
  --border-glow:#b8c2d0;
  --green:#008c63;
  --green-dim:#008c6320;
  --green-glow:#008c6340;
  --amber:#b87a10;
  --amber-dim:#b87a1020;
  --red:#d02040;
  --red-dim:#d0204020;
  --blue:#2d7cd6;
  --blue-dim:#2d7cd620;
  --text:#2c3e50;
  --text-dim:#6b7d8f;
  --text-bright:#1a202c;
}

[data-theme="light"] body::before,
[data-theme="light"] body::after{
  opacity:0;
}
[data-theme="light"] body{
  background:linear-gradient(180deg,#f4f6f9 0%,#e8ecf2 40%,#f4f6f9 100%);
}

[data-theme="sunset"]{
  --bg:#1a1208;
  --surface:#221a0d;
  --surface-2:#2a2010;
  --border:#3d2e1a;
  --border-glow:#5a4020;
  --green:#e8a838;
  --green-dim:#e8a83833;
  --green-glow:#e8a83866;
  --amber:#ff6030;
  --amber-dim:#ff603033;
  --red:#ff4060;
  --red-dim:#ff406033;
  --blue:#f0a030;
  --blue-dim:#f0a03033;
  --text:#d4b896;
  --text-dim:#8a7050;
  --text-bright:#fff5e0;
}
[data-theme="sunset"] body::before,
[data-theme="sunset"] body::after{opacity:0}
[data-theme="sunset"] body{
  background:linear-gradient(180deg,#1a1208 0%,#201508 40%,#1a1208 100%);
}

[data-theme="cyber"]{
  --bg:#08000f;
  --surface:#10081a;
  --surface-2:#180c24;
  --border:#2a1040;
  --border-glow:#4020a0;
  --green:#00ffcc;
  --green-dim:#00ffcc33;
  --green-glow:#00ffcc66;
  --amber:#ff00ff;
  --amber-dim:#ff00ff33;
  --red:#ff2060;
  --red-dim:#ff206033;
  --blue:#8080ff;
  --blue-dim:#8080ff33;
  --text:#c0c0ff;
  --text-dim:#6060a0;
  --text-bright:#ffffff;
}
[data-theme="cyber"] body::before,
[data-theme="cyber"] body::after{opacity:0}
[data-theme="cyber"] body{
  background:linear-gradient(180deg,#08000f 0%,#0c0018 40%,#08000f 100%);
}

[data-theme="eyecare"]{
  --bg:#0d1a0d;
  --surface:#122012;
  --surface-2:#182818;
  --border:#243824;
  --border-glow:#306030;
  --green:#40c040;
  --green-dim:#40c04033;
  --green-glow:#40c04066;
  --amber:#a0c040;
  --amber-dim:#a0c04033;
  --red:#c04040;
  --red-dim:#c0404033;
  --blue:#60a0c0;
  --blue-dim:#60a0c033;
  --text:#a0c0a0;
  --text-dim:#507050;
  --text-bright:#d0f0d0;
}
[data-theme="eyecare"] body::before,
[data-theme="eyecare"] body::after{opacity:0}
[data-theme="eyecare"] body{
  background:linear-gradient(180deg,#0d1a0d 0%,#102010 40%,#0d1a0d 100%);
}

[data-theme="violet"]{
  --bg:#140a20;
  --surface:#1a1028;
  --surface-2:#201430;
  --border:#302048;
  --border-glow:#4a3070;
  --green:#a060ff;
  --green-dim:#a060ff33;
  --green-glow:#a060ff66;
  --amber:#ff80c0;
  --amber-dim:#ff80c033;
  --red:#ff4080;
  --red-dim:#ff408033;
  --blue:#8060ff;
  --blue-dim:#8060ff33;
  --text:#c0b0e0;
  --text-dim:#706090;
  --text-bright:#f0e0ff;
}
[data-theme="violet"] body::before,
[data-theme="violet"] body::after{opacity:0}
[data-theme="violet"] body{
  background:linear-gradient(180deg,#140a20 0%,#180c28 40%,#140a20 100%);
}

html{font-size:16px}
body{
  background:var(--bg);
  color:var(--text);
  font-family:var(--sans);
  min-height:100vh;
  overflow-x:hidden;
  position:relative;
}

body::after{
  content:'';
  position:fixed;
  inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
  pointer-events:none;
  z-index:1000;
}

body::before{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, #00e5a008 0%, transparent 70%),
    linear-gradient(rgba(30,42,58,0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30,42,58,0.3) 1px, transparent 1px);
  background-size:100% 100%, 60px 60px, 60px 60px;
  pointer-events:none;
  z-index:0;
}

.container{
  max-width:860px;
  margin:0 auto;
  padding:40px 24px 80px;
  position:relative;
  z-index:1;
}

/* Header */
.header{
  margin-bottom:24px;
  animation:fadeSlideDown 0.6s ease-out;
}

.header-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.header-label{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.2em;
  text-transform:uppercase;
  color:var(--green);
  opacity:0.7;
  margin-bottom:8px;
  display:flex;
  align-items:center;
  gap:8px;
}

.header-label::before{
  content:'';
  display:inline-block;
  width:8px;height:8px;
  background:var(--green);
  border-radius:50%;
  animation:pulse 2s ease-in-out infinite;
}

.header-title{
  font-family:var(--sans);
  font-size:2rem;
  font-weight:700;
  letter-spacing:-0.02em;
  color:var(--text-bright);
  line-height:1.2;
}

.header-title span{color:var(--green)}

.header-nav{
  display:flex;
  gap:12px;
  margin-top:16px;
}

.header-nav a{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:var(--text-dim);
  text-decoration:none;
  padding:4px 10px;
  border:1px solid var(--border);
  border-radius:4px;
  transition:all 0.2s;
}

.header-nav a:hover{
  border-color:var(--text-dim);
  color:var(--text);
}

/* Language toggle */
.lang-toggle{
  font-family:var(--mono);
  font-size:0.65rem;
  font-weight:500;
  padding:4px 10px;
  border:1px solid var(--border);
  border-radius:4px;
  background:transparent;
  color:var(--text-dim);
  cursor:pointer;
  transition:all 0.2s;
  letter-spacing:0.05em;
}

.lang-toggle:hover{
  border-color:var(--text-dim);
  color:var(--text);
}

.theme-toggle{
  font-family:var(--mono);
  font-size:0.65rem;
  font-weight:500;
  padding:4px 10px;
  border:1px solid var(--border);
  border-radius:4px;
  background:transparent;
  color:var(--text-dim);
  cursor:pointer;
  transition:all 0.2s;
  line-height:1;
}
.theme-toggle:hover{
  border-color:var(--text-dim);
  color:var(--text);
}
.theme-dropdown{
  position:relative;
  display:inline-block;
}
.theme-dropdown-menu{
  display:none;
  position:absolute;
  top:100%;
  right:0;
  margin-top:6px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:6px;
  min-width:130px;
  z-index:100;
  box-shadow:0 8px 24px rgba(0,0,0,0.3);
}
.theme-dropdown-menu.open{display:block}
.theme-dropdown-item{
  display:flex;
  align-items:center;
  gap:8px;
  padding:6px 10px;
  border-radius:4px;
  cursor:pointer;
  font-size:0.8rem;
  color:var(--text);
  transition:background 0.15s;
  white-space:nowrap;
}
.theme-dropdown-item:hover{background:var(--surface-2)}
.theme-dropdown-item.active{color:var(--green);font-weight:600}
.theme-dropdown-item .theme-dot{
  width:10px;
  height:10px;
  border-radius:50%;
  border:1px solid var(--border);
  flex-shrink:0;
}
.theme-dropdown-item.active .theme-dot{
  border-color:var(--green);
}

/* Login overlay */
.login-overlay{
  position:fixed;
  inset:0;
  background:var(--bg);
  z-index:900;
  display:flex;
  align-items:center;
  justify-content:center;
}

.login-box{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:40px;
  width:360px;
  max-width:90vw;
  animation:fadeSlideUp 0.4s ease-out;
}

.login-box h2{
  font-family:var(--sans);
  font-size:1.4rem;
  font-weight:700;
  color:var(--text-bright);
  margin-bottom:8px;
}

.login-box p{
  font-family:var(--mono);
  font-size:0.7rem;
  color:var(--text-dim);
  letter-spacing:0.1em;
  text-transform:uppercase;
  margin-bottom:24px;
}

.login-box input{
  width:100%;
  font-family:var(--mono);
  font-size:0.85rem;
  padding:12px 16px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  outline:none;
  margin-bottom:16px;
  transition:border-color 0.2s;
}

.login-box input:focus{border-color:var(--green)}

.login-box .error-msg{
  font-family:var(--mono);
  font-size:0.75rem;
  color:var(--red);
  margin-bottom:12px;
  display:none;
}

/* Buttons */
.btn{
  font-family:var(--mono);
  font-size:0.75rem;
  font-weight:600;
  letter-spacing:0.1em;
  text-transform:uppercase;
  padding:10px 20px;
  background:transparent;
  border:1px solid var(--green);
  color:var(--green);
  border-radius:4px;
  cursor:pointer;
  transition:all 0.3s;
  white-space:nowrap;
}

.btn:hover{
  background:var(--green-dim);
  box-shadow:0 0 20px var(--green-dim);
}

.btn:active{transform:scale(0.97)}

.btn.loading{
  color:var(--amber);
  border-color:var(--amber);
  pointer-events:none;
}

.btn-danger, .btn.danger{
  border-color:var(--red);
  color:var(--red);
}

.btn-danger:hover, .btn.danger:hover{
  background:var(--red-dim);
  box-shadow:0 0 20px var(--red-dim);
}

.btn.secondary{
  border-color:var(--amber);
  color:var(--amber);
}

.btn.secondary:hover{
  background:var(--amber-dim);
  box-shadow:0 0 20px var(--amber-dim);
}

.btn-sm, .btn.sm{
  padding:6px 12px;
  font-size:0.65rem;
}

/* Tabs */
.tabs{
  display:flex;
  gap:0;
  margin-bottom:20px;
  border-bottom:1px solid var(--border);
}

.tab{
  font-family:var(--mono);
  font-size:0.75rem;
  font-weight:500;
  letter-spacing:0.1em;
  text-transform:uppercase;
  padding:12px 20px;
  color:var(--text-dim);
  cursor:pointer;
  border-bottom:2px solid transparent;
  transition:all 0.2s;
  user-select:none;
}

.tab:hover{color:var(--text)}

.tab.active{
  color:var(--green);
  border-bottom-color:var(--green);
}

.tab .badge{
  display:inline-block;
  font-size:0.6rem;
  padding:1px 6px;
  border-radius:8px;
  margin-left:6px;
  background:var(--surface-2);
  color:var(--text-dim);
}

.tab.active .badge{
  background:var(--green-dim);
  color:var(--green);
}

.tab-panel{display:none}
.tab-panel.active{display:block}

/* Search bar */
.search-bar{
  margin-bottom:16px;
  display:flex;
  gap:10px;
}

.search-bar input{
  flex:1;
  font-family:var(--mono);
  font-size:0.8rem;
  padding:10px 14px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  outline:none;
  transition:border-color 0.2s;
}

.search-bar input:focus{border-color:var(--green)}
.search-bar input::placeholder{color:var(--text-dim)}

/* Section cards */
.section{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:24px;
  margin-bottom:20px;
  position:relative;
  overflow:hidden;
}

.section::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg, transparent, var(--green-dim), transparent);
}

.section-title{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.15em;
  text-transform:uppercase;
  color:var(--text-dim);
  margin-bottom:16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.section-title .count{
  font-size:0.75rem;
  color:var(--green);
  font-weight:600;
}

/* Source list */
.source-list{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.source-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 16px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  transition:border-color 0.2s;
}

.source-item:hover{border-color:var(--border-glow)}

.source-tag{
  font-family:var(--mono);
  font-size:0.6rem;
  font-weight:600;
  letter-spacing:0.08em;
  text-transform:uppercase;
  padding:3px 8px;
  border-radius:3px;
  flex-shrink:0;
}

.source-tag.scraped{
  background:var(--blue-dim);
  color:var(--blue);
  border:1px solid var(--blue);
}

.source-tag.manual{
  background:var(--green-dim);
  color:var(--green);
  border:1px solid var(--green);
}

.source-info{
  flex:1;
  min-width:0;
  overflow:hidden;
}

.source-name{
  font-family:var(--sans);
  font-size:0.85rem;
  color:var(--text-bright);
  font-weight:500;
  margin-bottom:2px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.source-url{
  font-family:var(--mono);
  font-size:0.7rem;
  color:var(--text-dim);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.source-actions{flex-shrink:0}

/* Add form */
.add-form{
  display:flex;
  gap:10px;
  margin-bottom:8px;
}

.add-form input{
  flex:1;
  font-family:var(--mono);
  font-size:0.8rem;
  padding:10px 14px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  outline:none;
  transition:border-color 0.2s;
}

.add-form input:focus{border-color:var(--green)}
.add-form input::placeholder{color:var(--text-dim);opacity:0.6}
.add-form .name-input{max-width:160px}

@media(max-width:560px){
  .add-form{flex-wrap:wrap}
  .add-form .name-input{max-width:100%}
}

/* Status bar (header inline) */
.status-bar{
  display:flex;
  align-items:center;
  gap:12px;
  margin-top:16px;
  font-family:var(--mono);
  font-size:0.75rem;
  color:var(--text-dim);
}

.status-indicator{
  display:flex;align-items:center;gap:6px;
  padding:4px 10px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:4px;
}

.status-dot{
  width:6px;height:6px;
  border-radius:50%;
  background:var(--green);
  box-shadow:0 0 6px var(--green-glow);
  animation:pulse 2s ease-in-out infinite;
}

.status-dot.offline{
  background:var(--red);
  box-shadow:0 0 6px var(--red-dim);
  animation:none;
}

/* Empty state */
.empty{
  text-align:center;
  padding:32px 16px;
  font-family:var(--mono);
  font-size:0.8rem;
  color:var(--text-dim);
}

/* Toast */
.toast{
  position:fixed;
  bottom:24px;
  right:24px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:12px 20px;
  border-radius:4px;
  z-index:999;
  animation:fadeSlideUp 0.3s ease-out;
  transition:opacity 0.3s;
}

.toast.success{
  background:var(--green-dim);
  border:1px solid var(--green);
  color:var(--green);
}

.toast.error{
  background:var(--red-dim);
  border:1px solid var(--red);
  color:var(--red);
}

/* Collapsible */
.collapsible-toggle{
  font-family:var(--mono);
  font-size:0.65rem;
  letter-spacing:0.08em;
  color:var(--text-dim);
  cursor:pointer;
  padding:6px 0;
  user-select:none;
  transition:color 0.2s;
}

.collapsible-toggle:hover{color:var(--text)}

.collapsible-toggle::before{
  content:'\\25B6';
  display:inline-block;
  margin-right:6px;
  font-size:0.55rem;
  transition:transform 0.2s;
}

.collapsible-toggle.open::before{transform:rotate(90deg)}

.collapsible-body{
  display:none;
  margin-top:8px;
}

.collapsible-body.open{display:block}

/* Footer */
.footer{
  margin-top:36px;
  padding-top:20px;
  border-top:1px solid var(--border);
  font-family:var(--mono);
  font-size:0.65rem;
  color:var(--text-dim);
  text-align:center;
  letter-spacing:0.05em;
}

/* Loading skeleton */
.skeleton{
  background:linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%);
  background-size:200% 100%;
  animation:shimmer 1.5s infinite;
  border-radius:4px;
  color:transparent !important;
}

/* Animations */
@keyframes fadeSlideDown{
  from{opacity:0;transform:translateY(-12px)}
  to{opacity:1;transform:translateY(0)}
}

@keyframes fadeSlideUp{
  from{opacity:0;transform:translateY(12px)}
  to{opacity:1;transform:translateY(0)}
}

@keyframes pulse{
  0%,100%{opacity:1}
  50%{opacity:0.4}
}

@keyframes loading{
  0%{width:0;left:0}
  50%{width:100%;left:0}
  100%{width:0;left:100%}
}

@keyframes shimmer{
  0%{background-position:200% 0}
  100%{background-position:-200% 0}
}
`;
var isNodeEnv = typeof process !== "undefined" && !!process.versions?.node;
var sharedStyles = (isNodeEnv ? LOCAL_FONT_FACE : CDN_FONT_IMPORT) + sharedStylesBody;

// src/core/shared-ui.ts
var sharedUi = `
const $ = id => document.getElementById(id);

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function getLang() {
  const s = localStorage.getItem('lang');
  if (s === 'en' || s === 'zh') return s;
  return navigator.language?.startsWith('zh') ? 'zh' : 'en';
}

function applyLang(translations, lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    const v = translations[lang]?.[k];
    if (v) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const k = el.dataset.i18nPlaceholder;
    const v = translations[lang]?.[k];
    if (v) el.placeholder = v;
  });
  document.querySelectorAll('[data-i18n-text]').forEach(el => {
    const k = el.dataset.i18nText;
    const v = translations[lang]?.[k];
    if (v) el.textContent = v;
  });
  const toggle = $('langToggle');
  if (toggle) toggle.textContent = lang === 'zh' ? 'EN' : '\u4E2D\u6587';
  document.body.style.opacity = '1';
}

function toast(msg, type) {
  type = type || 'success';
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2500);
}

function initAuth(tokenInputId, errorId, overlayId, contentId, verifyUrl, onSuccess) {
  let token = '';
  const tokenInput = $(tokenInputId);
  const overlay = $(overlayId);
  const content = $(contentId);
  const errorEl = $(errorId);

  function getToken() { return token; }

  function authFetch(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers, { 'Authorization': 'Bearer ' + token });
    return fetch(url, opts);
  }

  function doLogin() {
    token = tokenInput.value.trim();
    if (!token) return;
    fetch(verifyUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(r => {
      if (r.ok) {
        overlay.style.display = 'none';
        content.style.display = 'block';
        sessionStorage.setItem('admin_token', token);
        onSuccess();
      } else {
        errorEl.style.display = 'block';
        tokenInput.value = '';
        tokenInput.focus();
      }
    }).catch(() => {
      errorEl.style.display = 'block';
    });
  }

  tokenInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  // Auto-login from session
  const saved = sessionStorage.getItem('admin_token');
  if (saved) {
    token = saved;
    fetch(verifyUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(r => {
      if (r.ok) {
        overlay.style.display = 'none';
        content.style.display = 'block';
        onSuccess();
      }
    });
  }

  return { doLogin, authFetch, getToken };
}

function toggleCollapsible(toggleEl) {
  toggleEl.classList.toggle('open');
  const body = toggleEl.nextElementSibling;
  if (body) body.classList.toggle('open');
}

function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

var THEMES = [
  { id: 'dark',    icon: '\\u2600\\uFE0F',  label: 'Dark',    dot: '#0a0e14' },
  { id: 'light',   icon: '\\uD83C\\uDF19',  label: 'Light',   dot: '#f4f6f9' },
  { id: 'sunset',  icon: '\\uD83C\\uDF05',  label: 'Sunset',  dot: '#1a1208' },
  { id: 'cyber',   icon: '\\u26A1',         label: 'Cyber',   dot: '#08000f' },
  { id: 'eyecare', icon: '\\uD83C\\uDF3F',  label: 'EyeCare', dot: '#0d1a0d' },
  { id: 'violet',  icon: '\\uD83D\\uDC8E',  label: 'Violet',  dot: '#140a20' }
];

function findTheme(id) {
  for (var i = 0; i < THEMES.length; i++) { if (THEMES[i].id === id) return THEMES[i]; }
  return THEMES[0];
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = findTheme(theme).icon;
  document.querySelectorAll('.theme-dropdown-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.theme === theme);
  });
}

function toggleTheme() {
  var menu = document.getElementById('themeDropdownMenu');
  if (menu) {
    var isOpen = menu.classList.contains('open');
    document.querySelectorAll('.theme-dropdown-menu').forEach(function(m) { m.classList.remove('open'); });
    if (!isOpen) menu.classList.add('open');
    return;
  }
  var list = THEMES.map(function(t) { return t.id; });
  var idx = list.indexOf(getTheme());
  var next = list[(idx + 1) % list.length];
  localStorage.setItem('theme', next);
  applyTheme(next);
}

function selectTheme(themeId) {
  localStorage.setItem('theme', themeId);
  applyTheme(themeId);
  document.querySelectorAll('.theme-dropdown-menu').forEach(function(m) { m.classList.remove('open'); });
}

function initThemeDropdown() {
  var wrap = document.getElementById('themeDropdown');
  if (!wrap) return;
  var cur = findTheme(getTheme());
  var html = '<div class="theme-dropdown" id="themeDropdownWrap">';
  html += '<button class="theme-toggle" id="themeToggle" onclick="toggleTheme()">' + cur.icon + '</button>';
  html += '<div class="theme-dropdown-menu" id="themeDropdownMenu">';
  for (var i = 0; i < THEMES.length; i++) {
    var t = THEMES[i];
    var active = t.id === cur.id ? ' active' : '';
    html += '<div class="theme-dropdown-item' + active + '" data-theme="' + t.id + '" onclick="selectTheme(\\'' + t.id + '\\')">';
    html += '<span class="theme-dot" style="background:' + t.dot + '"></span>';
    html += '<span>' + t.icon + ' ' + t.label + '</span>';
    html += '</div>';
  }
  html += '</div></div>';
  wrap.innerHTML = html;
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.theme-dropdown')) {
    document.querySelectorAll('.theme-dropdown-menu').forEach(function(m) { m.classList.remove('open'); });
  }
});

function loadBgFromServer() {
  fetch('/api/bg-settings').then(function(r) {
    if (!r.ok) return;
    return r.json();
  }).then(function(cfg) {
    if (!cfg) return;
    if (cfg.type === 'image' && cfg.imageUrl) {
      document.body.style.backgroundImage = 'url(' + cfg.imageUrl + ')';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else if (cfg.type === 'solid' && cfg.solidColor) {
      document.body.style.background = cfg.solidColor;
    } else if (cfg.type === 'gradient' && cfg.gradient) {
      document.body.style.background = cfg.gradient;
    }
  }).catch(function() {});
}
`;

// src/core/admin.ts
var adminHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TVBox Aggregator - Admin</title>
<style>
${sharedStyles}

/* Admin-specific: action bar in header */
.agg-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top:16px;
  padding:12px 16px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:6px;
  font-family:var(--mono);
  font-size:0.75rem;
  color:var(--text-dim);
}

.agg-bar .status-text{font-family:var(--mono);font-size:0.75rem;color:var(--text-dim)}
.agg-bar .status-text.success{color:var(--green)}
.agg-bar .status-text.error{color:var(--red)}

/* Inline form label */
.form-label{
  font-family:var(--mono);
  font-size:0.65rem;
  color:var(--text-dim);
  text-transform:uppercase;
  letter-spacing:0.1em;
  display:block;
  margin-bottom:4px;
}

/* Name transform grid */
.nt-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:10px;
}

.nt-input{
  width:100%;
  font-family:var(--mono);
  font-size:0.8rem;
  padding:8px 12px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  outline:none;
  transition:border-color 0.2s;
}

.nt-input:focus{border-color:var(--green)}

.nt-textarea{
  width:100%;
  min-height:60px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:8px 12px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  resize:vertical;
  outline:none;
}

.nt-textarea:focus{border-color:var(--green)}

/* Cloud login cards */
.cloud-card{
  padding:12px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:6px;
  display:flex;
  flex-direction:column;
  gap:8px;
}
.cloud-card-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.cloud-card-name{
  font-weight:600;
  font-size:0.9rem;
  color:var(--text-bright);
}
.cloud-badge{
  font-family:var(--mono);
  font-size:0.65rem;
  padding:2px 8px;
  border-radius:10px;
  text-transform:uppercase;
  letter-spacing:0.05em;
}
.cloud-badge.valid{background:rgba(80,250,123,0.15);color:var(--green)}
.cloud-badge.expired{background:rgba(255,85,85,0.15);color:var(--red)}
.cloud-badge.none{background:rgba(136,136,136,0.15);color:var(--text-dim)}
.cloud-card-actions{display:flex;gap:6px;flex-wrap:wrap}
.cloud-card-time{font-family:var(--mono);font-size:0.7rem;color:var(--text-dim)}

/* Risk badges */
.risk-badge{
  font-family:var(--mono);
  font-size:0.7rem;
  padding:1px 6px;
  border-radius:8px;
}
.risk-badge.safe{background:rgba(80,250,123,0.15);color:var(--green)}
.risk-badge.low{background:rgba(80,250,123,0.1);color:var(--green)}
.risk-badge.high{background:rgba(255,85,85,0.15);color:var(--red)}
.risk-badge.unaudited{background:rgba(241,250,140,0.15);color:var(--yellow)}

/* QR modal */
.qr-modal-overlay{
  position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(0,0,0,0.7);
  display:flex;align-items:center;justify-content:center;
  z-index:1000;
}
.qr-modal{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:24px;
  min-width:300px;
  max-width:400px;
  text-align:center;
}
.qr-modal h3{margin:0 0 16px;color:var(--text-bright);font-size:1rem}
.qr-modal img{
  max-width:250px;
  max-height:250px;
  border-radius:4px;
  background:#fff;
  padding:8px;
}
.qr-status{
  margin-top:12px;
  font-family:var(--mono);
  font-size:0.8rem;
  color:var(--text-dim);
}
.qr-status.scanned{color:var(--yellow)}
.qr-status.confirmed{color:var(--green)}
.qr-status.expired{color:var(--red)}

/* Import textarea */
.import-textarea{
  width:100%;
  min-height:100px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:10px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  resize:vertical;
  margin-bottom:8px;
}

/* Batch textarea */
.batch-textarea{
  width:100%;
  margin-top:8px;
  min-height:120px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:10px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  resize:vertical;
}

/* Source health dot in list items */
.source-health-dot{
  width:8px;height:8px;
  border-radius:50%;
  flex-shrink:0;
  position:relative;
  cursor:default;
}

.source-health-dot.ok{
  background:var(--green);
  box-shadow:0 0 4px var(--green-glow);
}

.source-health-dot.warn{
  background:var(--amber);
  box-shadow:0 0 4px var(--amber-dim);
}

.source-health-dot.error{
  background:var(--red);
  box-shadow:0 0 4px var(--red-dim);
}

.source-health-dot.unknown{
  background:var(--text-dim);
}

.source-health-dot::after{
  content:attr(data-tooltip);
  position:absolute;
  left:50%;
  bottom:calc(100% + 8px);
  transform:translateX(-50%);
  padding:6px 10px;
  background:var(--surface-2);
  border:1px solid var(--border);
  border-radius:4px;
  font-family:var(--mono);
  font-size:0.6rem;
  color:var(--text);
  white-space:nowrap;
  pointer-events:none;
  opacity:0;
  transition:opacity 0.2s;
  z-index:10;
}

.source-health-dot:hover::after{
  opacity:1;
}

@media(max-width:560px){
  .nt-grid{grid-template-columns:1fr}
  .tabs{overflow-x:auto;flex-wrap:nowrap}
  .tab{padding:12px 14px;font-size:0.65rem}
}
</style>
<script>(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)})()</script>
</head>
<body style="opacity:0">

<!-- Login -->
<div class="login-overlay" id="loginOverlay">
  <div class="login-box">
    <h2 data-i18n="loginTitle">Admin Access</h2>
    <p data-i18n="loginSubtitle">TVBox Aggregator Management</p>
    <div class="error-msg" id="loginError" data-i18n="invalidToken">Invalid token</div>
    <input type="password" id="loginInput" placeholder="Enter admin token" data-i18n-placeholder="enterToken" autocomplete="off">
    <button class="btn" style="width:100%" onclick="auth.doLogin()" data-i18n="login">Login</button>
  </div>
</div>

<!-- Main content -->
<div class="container" id="mainContent" style="display:none">
  <header class="header">
    <div class="header-top">
      <div class="header-label" data-i18n="headerLabel">Admin Console</div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="themeDropdown"></span>
        <button class="lang-toggle" id="langToggle" onclick="doToggleLang()">\u4E2D\u6587</button>
      </div>
    </div>
    <h1 class="header-title">Source <span>Manager</span></h1>
    <nav class="header-nav">
      <a href="/admin/config-editor" data-i18n="navConfigEditor">Config Editor</a>
      <a href="/status" data-i18n="navDashboard">Dashboard</a>
    </nav>
    <!-- Aggregation status bar -->
    <div class="agg-bar">
      <span class="status-text" id="aggStatus" data-i18n="loadingStatus">Loading...</span>
      <button class="btn btn-sm" id="refreshBtn" onclick="triggerRefresh()" data-i18n="refresh">Refresh</button>
    </div>
  </header>

  <!-- Tabs -->
  <div class="tabs">
    <div class="tab active" data-tab="sources" onclick="switchTab('sources')"><span data-i18n="tabSources">Sources</span> <span class="badge" id="badgeSources">0</span></div>
    <div class="tab" data-tab="maccms" onclick="switchTab('maccms')"><span data-i18n="tabMacCMS">MacCMS</span> <span class="badge" id="badgeMacCMS">0</span></div>
    <div class="tab" data-tab="live" onclick="switchTab('live')"><span data-i18n="tabLive">Live</span> <span class="badge" id="badgeLive">0</span></div>
    <div class="tab" data-tab="searchQuota" onclick="switchTab('searchQuota')" id="tabSearchQuota" style="display:none"><span data-i18n="tabSearchQuota">Search</span> <span class="badge" id="badgeSearchQuota">0</span></div>
    <div class="tab" data-tab="cloud" onclick="switchTab('cloud')"><span data-i18n="tabCloud">Cloud</span></div>
    <div class="tab" data-tab="settings" onclick="switchTab('settings')"><span data-i18n="tabSettings">Settings</span></div>
    <div class="tab" data-tab="aggLogs" onclick="switchTab('aggLogs')"><span data-i18n="tabAggLogs">Logs</span></div>
  </div>

  <!-- Sources Tab -->
  <div class="tab-panel active" id="panelSources">
    <!-- Add source -->
    <div class="section">
      <div class="section-title" data-i18n="addSource">Add Source</div>
      <div class="add-form">
        <input class="name-input" type="text" id="addName" placeholder="Name (optional)" data-i18n-placeholder="nameOptional">
        <input type="url" id="addUrl" placeholder="TVBox config JSON URL" data-i18n-placeholder="configJsonUrl">
        <input class="name-input" type="text" id="addConfigKey" placeholder="Config Key (optional, for AES ECB)">
        <button class="btn" id="addBtn" onclick="addSource()" data-i18n="add">Add</button>
      </div>
      <!-- Import (collapsible) -->
      <div class="collapsible-toggle" onclick="toggleCollapsible(this)" data-i18n="importConfig">Import Config</div>
      <div class="collapsible-body">
        <textarea id="importInput" class="import-textarea" placeholder="Paste TVBox JSON or URL here..." data-i18n-placeholder="importPlaceholder"></textarea>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn btn-sm" id="importBtn" onclick="importConfig()" data-i18n="import">Import</button>
          <span class="status-text" id="importResult" style="font-family:var(--mono);font-size:0.75rem"></span>
        </div>
      </div>
    </div>

    <!-- Source list -->
    <div class="section">
      <div class="section-title">
        <span data-i18n="sourcesList">Sources</span>
        <span class="count" id="sourceCount">0</span>
      </div>
      <div class="source-list" id="sourceList">
        <div class="empty">Loading sources...</div>
      </div>
    </div>
  </div>

  <!-- MacCMS Tab -->
  <div class="tab-panel" id="panelMaccms">
    <!-- Add MacCMS -->
    <div class="section">
      <div class="section-title" data-i18n="addMacCMS">Add MacCMS Source</div>
      <div class="add-form">
        <input class="name-input" type="text" id="mcKey" placeholder="Key (e.g. hongniuzy)" data-i18n-placeholder="mcKeyPh">
        <input class="name-input" type="text" id="mcName" placeholder="Name" data-i18n-placeholder="mcNamePh">
        <input type="url" id="mcApi" placeholder="MacCMS API URL" data-i18n-placeholder="mcApiPh">
        <button class="btn" id="mcAddBtn" onclick="addMacCMS()" data-i18n="add">Add</button>
      </div>
      <!-- Batch import (collapsible) -->
      <div class="collapsible-toggle" onclick="toggleCollapsible(this)" data-i18n="batchImport">Batch Import</div>
      <div class="collapsible-body">
        <textarea id="mcBatchInput" class="batch-textarea" placeholder='[{"key":"...","name":"...","api":"..."}]'></textarea>
        <button class="btn btn-sm" style="margin-top:8px" id="mcBatchBtn" onclick="batchImportMacCMS()" data-i18n="submitBatch">Submit Batch</button>
      </div>
    </div>

    <!-- MacCMS list -->
    <div class="section">
      <div class="section-title">
        <span data-i18n="macCMSSources">MacCMS Sources</span>
        <span class="count" id="mcCount">0</span>
      </div>
      <div class="source-list" id="mcList">
        <div class="empty">Loading MacCMS sources...</div>
      </div>
    </div>
  </div>

  <!-- Live Tab -->
  <div class="tab-panel" id="panelLive">
    <!-- Add live source -->
    <div class="section">
      <div class="section-title" data-i18n="addLiveSource">Add Live Source</div>
      <div class="add-form">
        <input class="name-input" type="text" id="liveName" placeholder="Name (e.g. iptv365)" data-i18n-placeholder="liveNamePh">
        <input type="url" id="liveUrl" placeholder="m3u/txt URL" data-i18n-placeholder="liveUrlPh">
        <button class="btn" id="liveAddBtn" onclick="addLive()" data-i18n="add">Add</button>
      </div>
    </div>

    <!-- Live list -->
    <div class="section">
      <div class="section-title">
        <span data-i18n="liveSources">Live Sources</span>
        <span class="count" id="liveCount">0</span>
      </div>
      <div class="source-list" id="liveList">
        <div class="empty">Loading live sources...</div>
      </div>
    </div>

    <!-- Channel Probe (Node/Docker only) -->
    <div class="section" id="channelProbeSection">
      <div class="section-title" data-i18n="channelProbeTitle">Channel Speed Probe (Node/Docker)</div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px">
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
          <input type="checkbox" id="channelProbeCheck" onchange="toggleChannelProbe()">
          <span data-i18n="channelProbeEnable">Enable scheduled channel speed test (every 12h)</span>
        </label>
        <button class="btn btn-sm" id="channelProbeTriggerBtn" onclick="triggerChannelProbe()" data-i18n="channelProbeTrigger">Run Now</button>
        <button class="btn btn-sm" onclick="loadChannelProbe()" data-i18n="refresh">Refresh</button>
      </div>
      <div id="channelProbeStatus" style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6"></div>
    </div>

    <!-- Live Disable Toggle -->
    <div class="section">
      <div class="section-title" data-i18n="liveToggleTitle">Live Feature Toggle</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="liveDisabledCheck" onchange="saveLiveDisabled()">
          <span data-i18n="liveToggleLabel">Disable live aggregation (skip live merge, output empty lives)</span>
        </label>
        <span class="status-text" id="liveDisabledStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>
  </div>

  <!-- Search Quota Tab -->
  <div class="tab-panel" id="panelSearchQuota">
    <div class="section">
      <div class="section-title" data-i18n="sqSelected">Active Search Sources</div>
      <div id="sqSelectedInfo" style="margin-bottom:8px;font-size:0.8rem;color:var(--text-secondary)"></div>
      <div id="sqSelectedTable" style="max-height:500px;overflow:auto">
        <div style="color:var(--text-secondary);font-size:0.85rem" data-i18n="sqNoData">Run aggregation to see results</div>
      </div>
    </div>
  </div>

  <!-- Cloud Tab -->
  <div class="tab-panel" id="panelCloud">
    <!-- \u7F51\u76D8\u767B\u5F55 -->
    <div class="section">
      <div class="section-title" data-i18n="cloudLogin">Cloud Login</div>
      <div id="cloudLoginGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">
      </div>
    </div>
    <!-- \u624B\u52A8\u7C98\u8D34\u51ED\u8BC1 -->
    <div class="section">
      <div class="section-title" data-i18n="cloudManualPaste">Manual Credential Paste</div>
      <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
        <div style="flex:0 0 140px">
          <label class="form-label" data-i18n="cloudPlatform">Platform</label>
          <select id="manualPlatform" class="nt-input" style="width:100%"></select>
        </div>
        <div style="flex:1;min-width:200px">
          <label class="form-label" data-i18n="cloudCredentialValue">Credential (cookie / token / JSON)</label>
          <input id="manualCredValue" class="nt-input" style="width:100%" placeholder="cookie=xxx; token=yyy">
        </div>
        <button class="btn btn-sm" onclick="manualPasteCredential()" data-i18n="save">Save</button>
      </div>
      <div id="manualPasteStatus" class="status-text" style="margin-top:6px"></div>
    </div>
    <!-- \u98CE\u9669\u7BA1\u7406 -->
    <div class="section">
      <div class="section-title" data-i18n="cloudRiskManagement">Risk Management</div>
      <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-sm" onclick="loadRiskReport()" data-i18n="cloudLoadReport">Load Risk Report</button>
        <span id="riskSummary" style="font-family:var(--mono);font-size:0.75rem;color:var(--text-dim)"></span>
      </div>
      <div id="riskReportContainer" style="display:none">
        <div style="overflow-x:auto">
          <table class="list-table" style="width:100%;font-size:0.8rem">
            <thead>
              <tr>
                <th data-i18n="cloudRiskName">Name</th>
                <th>Spider</th>
                <th data-i18n="cloudRiskLevel">Risk</th>
                <th data-i18n="cloudRiskPlatforms">Platforms</th>
                <th data-i18n="cloudRiskDomains">3rd Party</th>
                <th data-i18n="cloudRiskAction">Action</th>
              </tr>
            </thead>
            <tbody id="riskReportBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Settings Tab -->
  <div class="tab-panel" id="panelSettings">
    <!-- Cron Interval -->
    <div class="section">
      <div class="section-title" data-i18n="cronInterval">Aggregation Schedule</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <select id="cronSelect" class="nt-input" style="width:auto;min-width:160px">
          <option value="60" data-i18n-text="cronEvery1h">Every 1 hour</option>
          <option value="180" data-i18n-text="cronEvery3h">Every 3 hours</option>
          <option value="360" data-i18n-text="cronEvery6h">Every 6 hours</option>
          <option value="720" data-i18n-text="cronEvery12h">Every 12 hours</option>
          <option value="1440" data-i18n-text="cronEveryDay">Once a day</option>
        </select>
        <button class="btn btn-sm" id="cronSaveBtn" onclick="saveCronInterval()" data-i18n="save">Save</button>
        <span class="status-text" id="cronStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>

    <div class="section">
      <div class="section-title" data-i18n="speedTestToggle">Site Speed Test</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="speedTestCheck" onchange="saveSpeedTest()" checked>
          <span data-i18n="speedTestLabel">Enable site speed test and unreachable filtering</span>
        </label>
        <span class="status-text" id="speedTestStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
      <div style="margin-top:6px;font-size:0.8rem;color:var(--text-secondary)" data-i18n="speedTestDesc">When disabled, all sites are kept without testing reachability</div>
    </div>

    <div class="section">
      <div class="section-title" data-i18n="edgeProxies">Edge Function Proxies</div>
      <div style="margin-bottom:6px;font-size:0.8rem;color:var(--text-secondary)" data-i18n="edgeProxiesDesc">Configure edge function URLs for proxy fallback (fetch retry + image CDN). Local Docker mode only.</div>
      <div class="nt-grid">
        <div>
          <label class="form-label">Cloudflare Worker URL</label>
          <input type="text" id="edgeCfUrl" class="nt-input" placeholder="https://tvbox.example.com">
        </div>
        <div>
          <label class="form-label">Vercel Proxy URL</label>
          <input type="text" id="edgeVercelUrl" class="nt-input" placeholder="https://fetch.example.com">
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
        <button class="btn btn-sm" onclick="saveEdgeProxies()" data-i18n="save">Save</button>
        <span class="status-text" id="edgeProxiesStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>

    <div class="section">
      <div class="section-title" data-i18n="searchQuota">Search Quota</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label class="form-label" style="margin:0" data-i18n="maxSearchable">Max searchable</label>
        <input type="number" id="maxSearchableInput" class="nt-input" style="width:80px" min="0" max="1000" value="0">
        <button class="btn btn-sm" id="searchQuotaSaveBtn" onclick="saveSearchQuota()" data-i18n="save">Save</button>
        <span class="status-text" id="searchQuotaStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
      <div style="margin-top:6px;font-size:0.8rem;color:var(--text-secondary)" data-i18n="searchQuotaDesc">Limit searchable sources to reduce TVBox crashes. 0 = unlimited. JS sources are always excluded. Manage pinned sources in the Search tab.</div>
    </div>

    <div class="section">
      <div class="section-title" data-i18n="nameTransform">Name Transform</div>
      <div class="nt-grid">
        <div>
          <label class="form-label" data-i18n="ntPrefix">Prefix</label>
          <input type="text" id="ntPrefix" class="nt-input" placeholder="e.g. \u3010RioTV\u3011" data-i18n-placeholder="ntPrefixPh">
        </div>
        <div>
          <label class="form-label" data-i18n="ntSuffix">Suffix</label>
          <input type="text" id="ntSuffix" class="nt-input" placeholder="e.g.  \xB7 Curated" data-i18n-placeholder="ntSuffixPh">
        </div>
      </div>
      <div style="margin-bottom:10px">
        <label class="form-label" data-i18n="ntPromoReplace">Promo Replacement (empty = delete)</label>
        <input type="text" id="ntPromoReplace" class="nt-input" placeholder="e.g. Premium" data-i18n-placeholder="ntPromoReplacePh">
      </div>
      <div style="margin-bottom:10px">
        <label class="form-label" data-i18n="ntExtraPatterns">Extra Clean Patterns (one regex per line)</label>
        <textarea id="ntExtraPatterns" class="nt-textarea" placeholder="e.g. sponsor[\uFF1A:]\\S+" data-i18n-placeholder="ntExtraPatternsPh"></textarea>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn" id="ntSaveBtn" onclick="saveNameTransform()" data-i18n="save">Save</button>
        <span class="status-text" id="ntStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>

    <!-- \u76F8\u4F3C\u53BB\u91CD\u914D\u7F6E -->
    <div class="section">
      <div class="section-title" data-i18n="dedupConfigTitle">Similar Name Dedup</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="similarDedupCheck" onchange="saveDedupConfig()" checked>
          <span data-i18n="similarDedupLabel">Enable similar-name dedup (keep fastest)</span>
        </label>
      </div>
      <div style="margin-top:8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label class="form-label" style="margin:0" data-i18n="dedupThreshold">Threshold</label>
        <input type="range" id="dedupThreshold" min="50" max="100" value="85" style="width:120px" oninput="$('dedupThresholdVal').textContent=this.value+'%'">
        <span id="dedupThresholdVal" style="font-family:var(--mono);font-size:0.8rem">85%</span>
        <button class="btn btn-sm" onclick="saveDedupConfig()" data-i18n="save">Save</button>
        <span class="status-text" id="dedupStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>

    <!-- \u5206\u7EC4\u6392\u5E8F -->
    <div class="section">
      <div class="section-title" data-i18n="groupOrderTitle">Site Group Order</div>
      <div style="margin-bottom:10px;display:flex;gap:10px;align-items:center">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="groupOrderEnabled" onchange="saveGroupOrder()">
          <span data-i18n="groupOrderEnabled">Enable group ordering</span>
        </label>
        <select id="groupOrderUnmatched" class="nt-input" style="width:auto;min-width:120px" onchange="saveGroupOrder()">
          <option value="after">Unmatched \u2192 after</option>
          <option value="before">Unmatched \u2192 before</option>
        </select>
        <span class="status-text" id="groupOrderStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
      <div id="groupOrderRules"></div>
      <button class="btn btn-sm" onclick="addGroupRule()" style="margin-top:8px" data-i18n="groupOrderAdd">+ Add Rule</button>
    </div>

    <!-- \u80CC\u666F\u8BBE\u7F6E -->
    <div class="section">
      <div class="section-title" data-i18n="bgSettingsTitle">Background Settings</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
        <select id="bgType" class="nt-input" style="width:auto;min-width:120px" onchange="onBgTypeChange()">
          <option value="default">Default</option>
          <option value="image">Image URL</option>
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>
      <div id="bgImageGroup" style="display:none;margin-bottom:10px">
        <input type="text" id="bgImageUrl" class="nt-input" placeholder="https://example.com/bg.jpg">
      </div>
      <div id="bgSolidGroup" style="display:none;margin-bottom:10px">
        <input type="color" id="bgSolidColor" value="#0a0e14" style="width:50px;height:30px;border:none;cursor:pointer">
      </div>
      <div id="bgGradientGroup" style="display:none;margin-bottom:10px">
        <input type="text" id="bgGradient" class="nt-input" placeholder="linear-gradient(180deg, #0a0e14, #1a2030)">
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-sm" onclick="saveBgSettings()" data-i18n="save">Save</button>
        <span class="status-text" id="bgStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>

    <!-- \u667A\u80FD Base URL -->
    <div class="section">
      <div class="section-title" data-i18n="smartBaseUrlTitle">Smart Base URL</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="smartBaseUrlCheck" onchange="saveSmartBaseUrl()">
          <span data-i18n="smartBaseUrlLabel">Auto-detect client host for JAR/image URLs (LAN only, set DMZ=0 to allow public)</span>
        </label>
        <span class="status-text" id="smartBaseUrlStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
    </div>

    <!-- \u7AD9\u70B9\u9A8C\u6D3B -->
    <div class="section">
      <div class="section-title" data-i18n="siteProbeTitle">Site Probe &amp; Auto Clean</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px">
        <label class="form-label" style="margin:0" data-i18n="probeDepthLabel">Probe depth:</label>
        <select id="probeDepthSelect" class="nt-input" style="width:auto;min-width:140px" onchange="saveProbeDepth()">
          <option value="deep" data-i18n-text="probeDeep">Deep (validate content)</option>
          <option value="shallow" data-i18n-text="probeShallow">Shallow (HTTP only)</option>
        </select>
        <span class="status-text" id="probeDepthStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="autoCleanCheck" onchange="saveAutoClean()">
          <span data-i18n="autoCleanLabel">Auto-blacklist after 5 consecutive failures (max 5/run)</span>
        </label>
        <span class="status-text" id="autoCleanStatus" style="font-family:var(--mono);font-size:0.75rem"></span>
      </div>
      <div style="margin-top:6px;font-size:0.8rem;color:var(--text-dim)" data-i18n="siteProbeDesc">Deep mode checks type0/type1 content validity. Failed sites get [\u26A0] marker after 3 failures.</div>
    </div>
  </div>

  <!-- Agg Logs Tab -->
  <div class="tab-panel" id="panelAggLogs">
    <div class="section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0" data-i18n="aggLogsTitle">Aggregation Logs</div>
        <button class="btn btn-sm" onclick="clearAggLogs()" data-i18n="clearLogs">Clear All</button>
      </div>
      <div id="aggLogsList" style="font-size:0.85rem"></div>
    </div>
  </div>

  <div class="footer">
    <span data-i18n="footer">TVBox Source Aggregator &middot; Admin Console</span>
  </div>
</div>

<script>
${sharedUi}

// --- i18n ---
const translations = {
  en: {
    loginTitle:'Admin Access', loginSubtitle:'TVBox Aggregator Management',
    invalidToken:'Invalid token', enterToken:'Enter admin token', login:'Login',
    connectionFailed:'Connection failed',
    headerLabel:'Admin Console', navConfigEditor:'Config Editor', navDashboard:'Dashboard',
    tabSources:'Sources', tabMacCMS:'MacCMS', tabLive:'Live', tabSettings:'Settings', tabAggLogs:'Logs',
    aggLogsTitle:'Aggregation Logs', clearLogs:'Clear All',
    dedupConfigTitle:'Similar Name Dedup', similarDedupLabel:'Enable similar-name dedup (keep fastest)', dedupThreshold:'Threshold',
    groupOrderTitle:'Site Group Order', groupOrderEnabled:'Enable group ordering', groupOrderAdd:'+ Add Rule',
    bgSettingsTitle:'Background Settings',
    addSource:'Add Source', aggregation:'Aggregation', sourcesList:'Sources',
    addMacCMS:'Add MacCMS Source', macCMSSources:'MacCMS Sources',
    addLiveSource:'Add Live Source', liveSources:'Live Sources',
    nameOptional:'Name (optional)', configJsonUrl:'TVBox config JSON URL',
    mcKeyPh:'Key (e.g. hongniuzy)', mcNamePh:'Name', mcApiPh:'MacCMS API URL',
    liveNamePh:'Name (e.g. iptv365)', liveUrlPh:'m3u/txt URL',
    add:'Add', adding:'Adding...', batchImport:'Batch Import',
    submitBatch:'Submit Batch',
    refresh:'Refresh', running:'Running...', remove:'Remove', test:'Test',
    loadingStatus:'Loading...',
    lastUpdate:'Last update: ', neverUpdated:'Never updated \u2014 click Refresh',
    failedLoadStatus:'Failed to load status',
    noSources:'No sources configured. Add one above.',
    noMacCMS:'No MacCMS sources. Add one above.',
    noLives:'No live sources. Add one above.',
    failedLoad:'Failed to load sources',
    failedLoadMacCMS:'Failed to load MacCMS sources',
    failedLoadLives:'Failed to load live sources',
    sourceAdded:'Source added', sourceRemoved:'Source removed',
    networkError:'Network error', testing:'Testing...',
    valid:'Valid', invalidUnreachable:'Invalid / Unreachable',
    liveSourceAdded:'Live source added', removed:'Removed',
    invalidJson:'Invalid JSON', mustBeArray:'Must be a JSON array',
    allFieldsRequired:'All fields required', importFailed:'Import failed',
    aggregationStarted:'Aggregation started', refreshFailed:'Refresh failed',
    importConfig:'Import Config', import:'Import', importing:'Importing...',
    importPlaceholder:'Paste TVBox JSON or URL here...',
    importMulti:'Multi-repo detected', importSingle:'Single config detected',
    importAdded:'added', importDuplicates:'duplicates', importParseFailed:'Failed to parse',
    nameTransform:'Name Transform', ntPrefix:'Prefix', ntSuffix:'Suffix',
    ntPromoReplace:'Promo Replacement (empty = delete)', ntExtraPatterns:'Extra Clean Patterns (one regex per line)',
    ntPrefixPh:'e.g. \u3010RioTV\u3011', ntSuffixPh:'e.g.  \xB7 Curated',
    ntPromoReplacePh:'e.g. Premium', ntExtraPatternsPh:'e.g. sponsor[\uFF1A:]\\\\S+',
    cronInterval:'Aggregation Schedule',
    speedTestToggle:'Site Speed Test', speedTestLabel:'Enable site speed test and unreachable filtering', speedTestDesc:'When disabled, all sites are kept without testing reachability',
    edgeProxies:'Edge Function Proxies', edgeProxiesDesc:'Configure edge function URLs for proxy fallback (fetch retry + image CDN). Local Docker mode only.',
    refreshing:'Refreshing...', loading:'Loading...',
    cronEvery1h:'Every 1 hour', cronEvery3h:'Every 3 hours', cronEvery6h:'Every 6 hours',
    cronEvery12h:'Every 12 hours', cronEveryDay:'Once a day',
    save:'Save', saving:'Saving...', saved:'Saved', saveFailed:'Save failed',
    noHealthData:'No data yet', healthFails:'Fails',
    healthLastOk:'Last OK',
    searchQuota:'Search Quota',
    maxSearchable:'Max searchable', searchQuotaDesc:'Limit searchable sources to reduce TVBox crashes. 0 = unlimited. Manage pinned sources in the Search tab.',
    tabSearchQuota:'Search',
    sqSelected:'Active Search Sources', sqNoData:'Run aggregation to see results',
    sqKey:'Key', sqName:'Name', sqSource:'Source', sqReason:'Reason', sqAction:'Action',
    sqPin:'Pin', sqUnpin:'Unpin',
    sqPinned:'Pinned', sqPinnedDesc:'Drag to reorder. Top sources are searched first in TVBox.', sqOtherSources:'Other Sources',
    sqHttp:'http', sqMainJar:'main jar', sqIndepJar:'indep jar',
    channelProbeTitle:'Channel Speed Probe (Node/Docker)',
    channelProbeEnable:'Enable scheduled channel speed test (every 12h)',
    channelProbeTrigger:'Run Now',
    channelProbeIdle:'Idle', channelProbeRunning:'Running', channelProbeDone:'Completed', channelProbeError:'Error',
    channelProbeState:'State', channelProbeProgress:'Progress', channelProbeCoverage:'Coverage',
    channelProbeChannels:'Channels', channelProbeDuration:'Duration', channelProbeFinished:'Finished at',
    channelProbeStarted:'Probe started', channelProbeDisabledFirst:'Enable probe first', channelProbeAlreadyRunning:'Already running',
    channelProbeCfOnly:'Only Node/Docker supports channel probing',
    liveToggleTitle:'Live Feature Toggle', liveToggleLabel:'Disable live aggregation (skip live merge, output empty lives)',
    smartBaseUrlTitle:'Smart Base URL', smartBaseUrlLabel:'Auto-detect client host for JAR/image URLs (LAN only, set DMZ=0 to allow public)',
    siteProbeTitle:'Site Probe & Auto Clean', probeDepthLabel:'Probe depth:',
    probeDeep:'Deep (validate content)', probeShallow:'Shallow (HTTP only)',
    autoCleanLabel:'Auto-blacklist after 5 consecutive failures (max 5/run)',
    siteProbeDesc:'Deep mode checks type0/type1 content validity. Failed sites get [\u26A0] marker after 3 failures.',
    footer:'TVBox Source Aggregator &middot; Admin Console',
  },
  zh: {
    loginTitle:'\u7BA1\u7406\u767B\u5F55', loginSubtitle:'TVBox \u805A\u5408\u5668\u7BA1\u7406',
    invalidToken:'\u65E0\u6548\u7684\u4EE4\u724C', enterToken:'\u8BF7\u8F93\u5165\u7BA1\u7406\u4EE4\u724C', login:'\u767B\u5F55',
    connectionFailed:'\u8FDE\u63A5\u5931\u8D25',
    headerLabel:'\u7BA1\u7406\u63A7\u5236\u53F0', navConfigEditor:'\u914D\u7F6E\u7F16\u8F91', navDashboard:'\u4EEA\u8868\u76D8',
    tabSources:'\u6E90', tabMacCMS:'MacCMS', tabLive:'\u76F4\u64AD', tabSettings:'\u8BBE\u7F6E', tabAggLogs:'\u65E5\u5FD7',
    aggLogsTitle:'\u805A\u5408\u65E5\u5FD7', clearLogs:'\u6E05\u7A7A',
    dedupConfigTitle:'\u76F8\u4F3C\u540D\u79F0\u53BB\u91CD', similarDedupLabel:'\u542F\u7528\u76F8\u4F3C\u540D\u79F0\u53BB\u91CD\uFF08\u4FDD\u7559\u6700\u5FEB\uFF09', dedupThreshold:'\u9608\u503C',
    groupOrderTitle:'\u7AD9\u70B9\u5206\u7EC4\u6392\u5E8F', groupOrderEnabled:'\u542F\u7528\u5206\u7EC4\u6392\u5E8F', groupOrderAdd:'+ \u6DFB\u52A0\u89C4\u5219',
    bgSettingsTitle:'\u80CC\u666F\u8BBE\u7F6E',
    addSource:'\u6DFB\u52A0\u6E90', aggregation:'\u805A\u5408', sourcesList:'\u6E90\u5217\u8868',
    addMacCMS:'\u6DFB\u52A0 MacCMS \u6E90', macCMSSources:'MacCMS \u6E90\u5217\u8868',
    addLiveSource:'\u6DFB\u52A0\u76F4\u64AD\u6E90', liveSources:'\u76F4\u64AD\u6E90\u5217\u8868',
    nameOptional:'\u540D\u79F0\uFF08\u53EF\u9009\uFF09', configJsonUrl:'TVBox \u914D\u7F6E JSON \u5730\u5740',
    mcKeyPh:'Key\uFF08\u5982 hongniuzy\uFF09', mcNamePh:'\u540D\u79F0', mcApiPh:'MacCMS API \u5730\u5740',
    liveNamePh:'\u540D\u79F0\uFF08\u5982 iptv365\uFF09', liveUrlPh:'m3u/txt \u5730\u5740',
    add:'\u6DFB\u52A0', adding:'\u6DFB\u52A0\u4E2D...', batchImport:'\u6279\u91CF\u5BFC\u5165',
    submitBatch:'\u63D0\u4EA4\u6279\u91CF',
    refresh:'\u5237\u65B0', running:'\u8FD0\u884C\u4E2D...', remove:'\u5220\u9664', test:'\u6D4B\u8BD5',
    loadingStatus:'\u52A0\u8F7D\u4E2D...',
    lastUpdate:'\u4E0A\u6B21\u66F4\u65B0: ', neverUpdated:'\u4ECE\u672A\u66F4\u65B0 \u2014 \u70B9\u51FB\u5237\u65B0',
    failedLoadStatus:'\u83B7\u53D6\u72B6\u6001\u5931\u8D25',
    noSources:'\u6682\u65E0\u6E90\u3002\u8BF7\u5728\u4E0A\u65B9\u6DFB\u52A0\u3002',
    noMacCMS:'\u6682\u65E0 MacCMS \u6E90\u3002\u8BF7\u5728\u4E0A\u65B9\u6DFB\u52A0\u3002',
    noLives:'\u6682\u65E0\u76F4\u64AD\u6E90\u3002\u8BF7\u5728\u4E0A\u65B9\u6DFB\u52A0\u3002',
    failedLoad:'\u52A0\u8F7D\u6E90\u5931\u8D25',
    failedLoadMacCMS:'\u52A0\u8F7D MacCMS \u6E90\u5931\u8D25',
    failedLoadLives:'\u52A0\u8F7D\u76F4\u64AD\u6E90\u5931\u8D25',
    sourceAdded:'\u6E90\u5DF2\u6DFB\u52A0', sourceRemoved:'\u6E90\u5DF2\u5220\u9664',
    networkError:'\u7F51\u7EDC\u9519\u8BEF', testing:'\u6D4B\u8BD5\u4E2D...',
    valid:'\u6709\u6548', invalidUnreachable:'\u65E0\u6548/\u4E0D\u53EF\u8FBE',
    liveSourceAdded:'\u76F4\u64AD\u6E90\u5DF2\u6DFB\u52A0', removed:'\u5DF2\u5220\u9664',
    invalidJson:'\u65E0\u6548\u7684 JSON', mustBeArray:'\u5FC5\u987B\u662F JSON \u6570\u7EC4',
    allFieldsRequired:'\u6240\u6709\u5B57\u6BB5\u5FC5\u586B', importFailed:'\u5BFC\u5165\u5931\u8D25',
    aggregationStarted:'\u805A\u5408\u5DF2\u5F00\u59CB', refreshFailed:'\u5237\u65B0\u5931\u8D25',
    importConfig:'\u5BFC\u5165\u914D\u7F6E', import:'\u5BFC\u5165', importing:'\u5BFC\u5165\u4E2D...',
    importPlaceholder:'\u7C98\u8D34 TVBox JSON \u5185\u5BB9\u6216 URL...',
    importMulti:'\u68C0\u6D4B\u5230\u591A\u4ED3', importSingle:'\u68C0\u6D4B\u5230\u5355\u4ED3',
    importAdded:'\u5DF2\u6DFB\u52A0', importDuplicates:'\u91CD\u590D\u8DF3\u8FC7', importParseFailed:'\u89E3\u6790\u5931\u8D25',
    nameTransform:'\u540D\u79F0\u5B9A\u5236', ntPrefix:'\u524D\u7F00', ntSuffix:'\u540E\u7F00',
    ntPromoReplace:'\u63A8\u5E7F\u66FF\u6362\u6587\u5B57\uFF08\u7559\u7A7A\u5219\u5220\u9664\uFF09', ntExtraPatterns:'\u989D\u5916\u6E05\u6D17\u6B63\u5219\uFF08\u6BCF\u884C\u4E00\u6761\uFF09',
    ntPrefixPh:'\u5982 \u3010RioTV\u3011', ntSuffixPh:'\u5982  \xB7 \u7CBE\u9009',
    ntPromoReplacePh:'\u5982 \u7CBE\u9009\u63A8\u8350', ntExtraPatternsPh:'\u5982 sponsor[\uFF1A:]\\\\S+',
    cronInterval:'\u805A\u5408\u9891\u7387',
    speedTestToggle:'\u7AD9\u70B9\u6D4B\u901F', speedTestLabel:'\u542F\u7528\u7AD9\u70B9\u6D4B\u901F\u4E0E\u4E0D\u53EF\u8FBE\u5254\u9664', speedTestDesc:'\u5173\u95ED\u540E\u4FDD\u7559\u6240\u6709\u7AD9\u70B9\uFF0C\u4E0D\u8FDB\u884C\u53EF\u8FBE\u6027\u68C0\u6D4B',
    edgeProxies:'\u8FB9\u7F18\u51FD\u6570\u4EE3\u7406', edgeProxiesDesc:'\u914D\u7F6E\u8FB9\u7F18\u51FD\u6570 URL\uFF0C\u7528\u4E8E\u672C\u5730 Docker \u6A21\u5F0F\u7684\u8BF7\u6C42\u4EE3\u7406\u56DE\u9000\u548C\u56FE\u7247 CDN \u52A0\u901F',
    refreshing:'\u5237\u65B0\u4E2D...', loading:'\u52A0\u8F7D\u4E2D...',
    cronEvery1h:'\u6BCF 1 \u5C0F\u65F6', cronEvery3h:'\u6BCF 3 \u5C0F\u65F6', cronEvery6h:'\u6BCF 6 \u5C0F\u65F6',
    cronEvery12h:'\u6BCF 12 \u5C0F\u65F6', cronEveryDay:'\u6BCF\u5929\u4E00\u6B21',
    save:'\u4FDD\u5B58', saving:'\u4FDD\u5B58\u4E2D...', saved:'\u5DF2\u4FDD\u5B58', saveFailed:'\u4FDD\u5B58\u5931\u8D25',
    noHealthData:'\u6682\u65E0\u6570\u636E', healthFails:'\u5931\u8D25',
    healthLastOk:'\u6700\u540E\u6210\u529F',
    searchQuota:'\u641C\u7D22\u914D\u989D',
    maxSearchable:'\u53EF\u641C\u7D22\u6E90\u4E0A\u9650', searchQuotaDesc:'\u9650\u5236\u53EF\u641C\u7D22\u6E90\u6570\u91CF\uFF0C\u51CF\u5C11 TVBox \u641C\u7D22\u5D29\u6E83\u30020 = \u4E0D\u9650\u5236\u3002\u7F6E\u9876\u6E90\u5728\u641C\u7D22\u9875\u7B7E\u7BA1\u7406\u3002',
    tabSearchQuota:'\u641C\u7D22',
    sqSelected:'\u6D3B\u8DC3\u641C\u7D22\u6E90', sqNoData:'\u6267\u884C\u805A\u5408\u540E\u67E5\u770B\u7ED3\u679C',
    sqKey:'Key', sqName:'\u540D\u79F0', sqSource:'\u6765\u6E90', sqReason:'\u539F\u56E0', sqAction:'\u64CD\u4F5C',
    sqPin:'\u7F6E\u9876', sqUnpin:'\u53D6\u6D88\u7F6E\u9876',
    sqPinned:'\u7F6E\u9876\u6E90', sqPinnedDesc:'\u4E0A\u4E0B\u79FB\u52A8\u6392\u5E8F\uFF0C\u6392\u5728\u524D\u9762\u7684\u6E90\u5728 TVBox \u641C\u7D22\u65F6\u4F18\u5148\u6267\u884C', sqOtherSources:'\u5176\u4ED6\u6E90',
    sqHttp:'HTTP', sqMainJar:'\u4E3B JAR', sqIndepJar:'\u72EC\u7ACB JAR',
    channelProbeTitle:'\u9891\u9053\u7EA7\u6D4B\u901F\uFF08\u4EC5 Node/Docker\uFF09',
    channelProbeEnable:'\u542F\u7528\u5B9A\u65F6\u9891\u9053\u6D4B\u901F\uFF08\u6BCF 12 \u5C0F\u65F6\uFF09',
    channelProbeTrigger:'\u7ACB\u5373\u6267\u884C',
    channelProbeIdle:'\u7A7A\u95F2', channelProbeRunning:'\u8FD0\u884C\u4E2D', channelProbeDone:'\u5DF2\u5B8C\u6210', channelProbeError:'\u5931\u8D25',
    channelProbeState:'\u72B6\u6001', channelProbeProgress:'\u8FDB\u5EA6', channelProbeCoverage:'\u8986\u76D6\u7387',
    channelProbeChannels:'\u9891\u9053\u6570', channelProbeDuration:'\u8017\u65F6', channelProbeFinished:'\u5B8C\u6210\u65F6\u95F4',
    channelProbeStarted:'\u6D4B\u901F\u5DF2\u542F\u52A8', channelProbeDisabledFirst:'\u8BF7\u5148\u542F\u7528\u6D4B\u901F', channelProbeAlreadyRunning:'\u5DF2\u5728\u8FD0\u884C',
    channelProbeCfOnly:'\u4EC5 Node/Docker \u652F\u6301\u9891\u9053\u7EA7\u6D4B\u901F',
    liveToggleTitle:'\u76F4\u64AD\u529F\u80FD', liveToggleLabel:'\u7981\u7528\u76F4\u64AD\u805A\u5408\uFF08\u8DF3\u8FC7\u76F4\u64AD\u5408\u5E76\uFF0C\u8F93\u51FA\u7A7A lives\uFF09',
    smartBaseUrlTitle:'\u667A\u80FD\u5730\u5740\u54CD\u5E94', smartBaseUrlLabel:'\u6839\u636E\u5BA2\u6237\u7AEF\u8BBF\u95EE\u5730\u5740\u81EA\u52A8\u751F\u6210\u8D44\u6E90\u94FE\u63A5\uFF08\u4EC5\u5C40\u57DF\u7F51\uFF0C\u8BBE\u7F6E DMZ=0 \u5141\u8BB8\u516C\u7F51\uFF09',
    siteProbeTitle:'\u7AD9\u70B9\u9A8C\u6D3B\u4E0E\u81EA\u52A8\u6E05\u7406', probeDepthLabel:'\u9A8C\u6D3B\u6DF1\u5EA6\uFF1A',
    probeDeep:'\u6DF1\u5EA6\uFF08\u9A8C\u8BC1\u5185\u5BB9\u6709\u6548\u6027\uFF09', probeShallow:'\u6D45\u5C42\uFF08\u4EC5 HTTP \u53EF\u8FBE\uFF09',
    autoCleanLabel:'\u8FDE\u7EED\u5931\u8D25 5 \u6B21\u81EA\u52A8\u5C4F\u853D\uFF08\u6BCF\u6B21\u6700\u591A 5 \u4E2A\uFF09',
    siteProbeDesc:'\u6DF1\u5EA6\u6A21\u5F0F\u4F1A\u68C0\u67E5 type0/type1 \u7AD9\u70B9\u662F\u5426\u8FD4\u56DE\u6709\u6548\u5185\u5BB9\u3002\u8FDE\u7EED\u5931\u8D25 3 \u6B21\u7684\u7AD9\u70B9\u4F1A\u88AB\u6807\u8BB0 [\u26A0]\u3002',
    footer:'TVBox \u6E90\u805A\u5408\u5668 &middot; \u7BA1\u7406\u63A7\u5236\u53F0',
  }
};

function t(key) { const l = getLang(); return translations[l]?.[key] || translations.en[key] || key; }

function doToggleLang() {
  const next = getLang() === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', next);
  applyLang(translations, next);
  loadAll();
}

// --- Auth ---
const auth = initAuth('loginInput', 'loginError', 'loginOverlay', 'mainContent', '/admin/sources', loadAll);

// --- Tab switching ---
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => {
    const id = 'panel' + tab.charAt(0).toUpperCase() + tab.slice(1);
    p.classList.toggle('active', p.id === id);
  });
}

// --- Source health ---
let healthMap = {};

async function loadSourceHealth() {
  try {
    const res = await fetch('/source-status');
    const records = await res.json();
    healthMap = {};
    records.forEach(r => { healthMap[r.url] = r; });
  } catch {
    healthMap = {};
  }
}

// --- Load data ---
async function loadAll() {
  await loadSourceHealth();
  loadSources();
  loadMacCMS();
  loadLives();
  loadStatus();
  loadNameTransform();
  loadCronInterval();
  loadSpeedTest();
  loadEdgeProxies();
  loadSearchQuota();
  loadCloudCredentials();
  loadChannelProbe();
  loadDedupConfig();
  loadGroupOrder();
  loadBgSettings();
  loadAggLogs();
}

async function loadStatus() {
  try {
    const res = await fetch('/status-data');
    const d = await res.json();
    if (d.lastUpdate && d.lastUpdate !== 'never') {
      const date = new Date(d.lastUpdate);
      const fmt = date.toLocaleString('zh-CN', {
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit', second:'2-digit',
        hour12: false
      });
      $('aggStatus').textContent = t('lastUpdate') + fmt + ' | ' + d.sites + ' sites, ' + d.parses + ' parses, ' + d.lives + ' lives' + (d.liveSourceCount ? ', ' + d.liveSourceCount + ' live sources' : '');
      $('aggStatus').className = 'status-text';
    } else {
      $('aggStatus').textContent = t('neverUpdated');
      $('aggStatus').className = 'status-text error';
    }
  } catch {
    $('aggStatus').textContent = t('failedLoadStatus');
    $('aggStatus').className = 'status-text error';
  }
}

async function loadSources() {
  const list = $('sourceList');
  try {
    const res = await auth.authFetch('/admin/sources');
    const sources = await res.json();
    $('sourceCount').textContent = sources.length;
    $('badgeSources').textContent = sources.length;

    if (sources.length === 0) {
      list.innerHTML = '<div class="empty">' + t('noSources') + '</div>';
      return;
    }

    list.innerHTML = sources.map(s => {
      const h = healthMap[s.url];
      const level = !h ? 'unknown'
        : h.consecutiveFailures >= 5 ? 'error'
        : h.consecutiveFailures >= 3 ? 'warn' : 'ok';
      const tip = !h ? t('noHealthData')
        : h.latestStatus + ' | ' + t('healthFails') + ': ' + h.consecutiveFailures +
          (h.lastSuccessTime ? ' | ' + t('healthLastOk') + ': ' + new Date(h.lastSuccessTime).toLocaleString() : '');

      return \`<div class="source-item">
        <span class="source-health-dot \${level}" data-tooltip="\${esc(tip)}"></span>
        <div class="source-info">
          <div class="source-name">\${esc(s.name || 'Unnamed')}\${s.configKey ? ' \u{1F511}' : ''}</div>
          <div class="source-url">\${esc(s.url)}</div>
        </div>
        <div class="source-actions">
          <button class="btn btn-sm btn-danger" onclick="removeSource('\${esc(s.url)}')">\${t('remove')}</button>
        </div>
      </div>\`;
    }).join('');
  } catch {
    list.innerHTML = '<div class="empty">' + t('failedLoad') + '</div>';
  }
}

// --- Add source ---
async function addSource() {
  const url = $('addUrl').value.trim();
  if (!url) { $('addUrl').focus(); return; }
  const name = $('addName').value.trim() || '';
  const configKey = $('addConfigKey').value.trim() || '';

  const btn = $('addBtn');
  btn.textContent = t('adding');
  btn.className = 'btn loading';

  try {
    const payload = { name, url };
    if (configKey) payload.configKey = configKey;
    const res = await auth.authFetch('/admin/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const d = await res.json();
    if (res.ok) {
      toast(t('sourceAdded'));
      $('addUrl').value = '';
      $('addName').value = '';
      $('addConfigKey').value = '';
      loadSources();
    } else {
      toast(d.error || t('failedLoad'), 'error');
    }
  } catch {
    toast(t('networkError'), 'error');
  }

  btn.textContent = t('add');
  btn.className = 'btn';
}

// --- Remove source ---
async function removeSource(url) {
  try {
    const res = await auth.authFetch('/admin/sources', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (res.ok) {
      toast(t('sourceRemoved'));
      loadSources();
    } else {
      const d = await res.json();
      toast(d.error || t('remove'), 'error');
    }
  } catch {
    toast(t('networkError'), 'error');
  }
}

// --- MacCMS ---
async function loadMacCMS() {
  const list = $('mcList');
  try {
    const res = await auth.authFetch('/admin/maccms');
    const sources = await res.json();
    $('mcCount').textContent = sources.length;
    $('badgeMacCMS').textContent = sources.length;

    if (sources.length === 0) {
      list.innerHTML = '<div class="empty">' + t('noMacCMS') + '</div>';
      return;
    }

    list.innerHTML = sources.map(s => \`
      <div class="source-item">
        <span class="source-tag manual">\${esc(s.key)}</span>
        <div class="source-info">
          <div class="source-name">\${esc(s.name)}</div>
          <div class="source-url">\${esc(s.api)}</div>
        </div>
        <div class="source-actions" style="display:flex;gap:6px">
          <button class="btn btn-sm" onclick="validateMC('\${esc(s.api)}')">\${t('test')}</button>
          <button class="btn btn-sm btn-danger" onclick="removeMC('\${esc(s.key)}')">\${t('remove')}</button>
        </div>
      </div>
    \`).join('');
  } catch {
    list.innerHTML = '<div class="empty">' + t('failedLoadMacCMS') + '</div>';
  }
}

async function addMacCMS() {
  const key = $('mcKey').value.trim();
  const name = $('mcName').value.trim();
  const api = $('mcApi').value.trim();
  if (!key || !name || !api) { toast(t('allFieldsRequired'), 'error'); return; }

  const btn = $('mcAddBtn');
  btn.textContent = t('adding');
  btn.className = 'btn loading';

  try {
    const res = await auth.authFetch('/admin/maccms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, name, api })
    });
    const d = await res.json();
    if (res.ok) {
      toast('Added ' + (d.added || 1) + ' MacCMS source(s)');
      $('mcKey').value = '';
      $('mcName').value = '';
      $('mcApi').value = '';
      loadMacCMS();
    } else {
      toast(d.error || 'Failed', 'error');
    }
  } catch { toast(t('networkError'), 'error'); }

  btn.textContent = t('add');
  btn.className = 'btn';
}

async function removeMC(key) {
  try {
    const res = await auth.authFetch('/admin/maccms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    if (res.ok) { toast('Removed'); loadMacCMS(); }
    else { const d = await res.json(); toast(d.error || 'Failed', 'error'); }
  } catch { toast(t('networkError'), 'error'); }
}

async function validateMC(api) {
  toast(t('testing'));
  try {
    const res = await auth.authFetch('/admin/maccms/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api })
    });
    const d = await res.json();
    toast(d.valid ? t('valid') : t('invalidUnreachable'), d.valid ? 'success' : 'error');
  } catch { toast(t('networkError'), 'error'); }
}

async function batchImportMacCMS() {
  const raw = $('mcBatchInput').value.trim();
  if (!raw) return;
  let data;
  try { data = JSON.parse(raw); } catch { toast(t('invalidJson'), 'error'); return; }
  if (!Array.isArray(data)) { toast(t('mustBeArray'), 'error'); return; }

  try {
    const res = await auth.authFetch('/admin/maccms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (res.ok) {
      toast('Imported ' + (d.added || 0) + ' source(s)');
      $('mcBatchInput').value = '';
      loadMacCMS();
    } else {
      toast(d.error || t('importFailed'), 'error');
    }
  } catch { toast(t('networkError'), 'error'); }
}

// --- Live Sources ---
async function loadLives() {
  const list = $('liveList');
  try {
    const res = await auth.authFetch('/admin/lives');
    const entries = await res.json();
    $('liveCount').textContent = entries.length;
    $('badgeLive').textContent = entries.length;

    if (entries.length === 0) {
      list.innerHTML = '<div class="empty">' + t('noLives') + '</div>';
      return;
    }

    list.innerHTML = entries.map(s => \`
      <div class="source-item">
        <span class="source-tag manual">LIVE</span>
        <div class="source-info">
          <div class="source-name">\${esc(s.name || 'Unnamed')}</div>
          <div class="source-url">\${esc(s.url)}</div>
        </div>
        <div class="source-actions">
          <button class="btn btn-sm btn-danger" onclick="removeLive('\${esc(s.url)}')">\${t('remove')}</button>
        </div>
      </div>
    \`).join('');
  } catch {
    list.innerHTML = '<div class="empty">' + t('failedLoadLives') + '</div>';
  }
}

async function addLive() {
  const url = $('liveUrl').value.trim();
  if (!url) { $('liveUrl').focus(); return; }
  const name = $('liveName').value.trim() || '';

  const btn = $('liveAddBtn');
  btn.textContent = t('adding');
  btn.className = 'btn loading';

  try {
    const res = await auth.authFetch('/admin/lives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url })
    });
    const d = await res.json();
    if (res.ok) {
      toast(t('liveSourceAdded'));
      $('liveUrl').value = '';
      $('liveName').value = '';
      loadLives();
    } else {
      toast(d.error || 'Failed to add', 'error');
    }
  } catch {
    toast(t('networkError'), 'error');
  }

  btn.textContent = t('add');
  btn.className = 'btn';
}

async function removeLive(url) {
  try {
    const res = await auth.authFetch('/admin/lives', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (res.ok) { toast(t('removed')); loadLives(); }
    else { const d = await res.json(); toast(d.error || 'Failed', 'error'); }
  } catch { toast(t('networkError'), 'error'); }
}

// --- Import Config ---
async function importConfig() {
  const input = $('importInput').value.trim();
  if (!input) { $('importInput').focus(); return; }

  const btn = $('importBtn');
  const result = $('importResult');
  btn.textContent = t('importing');
  btn.className = 'btn btn-sm loading';
  result.textContent = '';

  try {
    const res = await auth.authFetch('/admin/sources/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const d = await res.json();
    if (res.ok) {
      const typeLabel = d.type === 'multi' ? t('importMulti') : t('importSingle');
      result.textContent = typeLabel + ': ' + d.added + ' ' + t('importAdded') + (d.duplicates > 0 ? ', ' + d.duplicates + ' ' + t('importDuplicates') : '');
      result.className = 'status-text success';
      if (d.added > 0) {
        $('importInput').value = '';
        loadSources();
      }
    } else {
      result.textContent = d.error || t('importParseFailed');
      result.className = 'status-text error';
    }
  } catch {
    result.textContent = t('networkError');
    result.className = 'status-text error';
  }

  btn.textContent = t('import');
  btn.className = 'btn btn-sm';
}

// --- Name Transform ---
async function loadNameTransform() {
  try {
    const res = await auth.authFetch('/admin/name-transform');
    if (!res.ok) return;
    const d = await res.json();
    $('ntPrefix').value = d.prefix || '';
    $('ntSuffix').value = d.suffix || '';
    $('ntPromoReplace').value = d.promoReplacement || '';
    $('ntExtraPatterns').value = (d.extraCleanPatterns || []).join('\\n');
  } catch {}
}

async function saveNameTransform() {
  const btn = $('ntSaveBtn');
  const status = $('ntStatus');
  btn.textContent = t('saving');
  btn.className = 'btn loading';
  status.textContent = '';

  const extraRaw = $('ntExtraPatterns').value.trim();
  const extraCleanPatterns = extraRaw ? extraRaw.split('\\n').map(s => s.trim()).filter(Boolean) : [];

  try {
    const res = await auth.authFetch('/admin/name-transform', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prefix: $('ntPrefix').value || '',
        suffix: $('ntSuffix').value || '',
        promoReplacement: $('ntPromoReplace').value || '',
        extraCleanPatterns
      })
    });
    const d = await res.json();
    if (res.ok) {
      status.textContent = t('saved');
      status.className = 'status-text success';
    } else {
      status.textContent = d.error || t('saveFailed');
      status.className = 'status-text error';
    }
  } catch {
    status.textContent = t('networkError');
    status.className = 'status-text error';
  }

  btn.textContent = t('save');
  btn.className = 'btn';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

// --- Cron Interval ---
async function loadCronInterval() {
  try {
    const res = await auth.authFetch('/admin/cron-interval');
    if (!res.ok) return;
    const d = await res.json();
    $('cronSelect').value = String(d.interval || 1440);
  } catch {}
}

async function saveCronInterval() {
  const btn = $('cronSaveBtn');
  const status = $('cronStatus');
  btn.textContent = t('saving');
  btn.className = 'btn btn-sm loading';
  status.textContent = '';

  try {
    const res = await auth.authFetch('/admin/cron-interval', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interval: parseInt($('cronSelect').value) })
    });
    const d = await res.json();
    if (res.ok) {
      status.textContent = t('saved');
      status.className = 'status-text success';
    } else {
      status.textContent = d.error || t('saveFailed');
      status.className = 'status-text error';
    }
  } catch {
    status.textContent = t('networkError');
    status.className = 'status-text error';
  }

  btn.textContent = t('save');
  btn.className = 'btn btn-sm';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

// --- Speed Test Toggle ---
async function loadSpeedTest() {
  try {
    const res = await auth.authFetch('/admin/speed-test');
    if (res.ok) {
      const d = await res.json();
      $('speedTestCheck').checked = d.enabled;
    }
  } catch {}
}

async function saveSpeedTest() {
  const status = $('speedTestStatus');
  const enabled = $('speedTestCheck').checked;
  status.textContent = '';

  try {
    const res = await auth.authFetch('/admin/speed-test', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
    if (res.ok) {
      status.textContent = t('saved');
      status.className = 'status-text success';
    } else {
      const d = await res.json();
      status.textContent = d.error || t('saveFailed');
      status.className = 'status-text error';
    }
  } catch {
    status.textContent = t('networkError');
    status.className = 'status-text error';
  }

  setTimeout(() => { status.textContent = ''; }, 3000);
}

// --- Channel Probe (Node/Docker) ---
async function loadChannelProbe() {
  const box = $('channelProbeStatus');
  try {
    const res = await auth.authFetch('/admin/channel-probe/status');
    if (res.status === 404) {
      $('channelProbeSection').style.display = 'none';
      return;
    }
    if (!res.ok) {
      box.textContent = t('channelProbeCfOnly');
      return;
    }
    const d = await res.json();
    $('channelProbeCheck').checked = !!d.enabled;
    const s = d.status || {};
    const stateLabel = { idle: t('channelProbeIdle'), running: t('channelProbeRunning'), done: t('channelProbeDone'), error: t('channelProbeError') }[s.state] || s.state || '-';
    const lines = [];
    lines.push(t('channelProbeState') + ': ' + stateLabel + (d.running ? ' \u23F3' : ''));
    if (s.totalUrls) {
      lines.push(t('channelProbeProgress') + ': ' + (s.probed || 0) + ' / ' + s.totalUrls + ' | ' + t('channelProbeCoverage') + ': ' + (s.coverage || 0) + '% | ' + t('channelProbeChannels') + ': ' + (s.totalChannels || 0));
    }
    if (s.durationMs) {
      lines.push(t('channelProbeDuration') + ': ' + (s.durationMs / 1000).toFixed(1) + 's');
    }
    if (s.finishedAt) {
      lines.push(t('channelProbeFinished') + ': ' + new Date(s.finishedAt).toLocaleString());
    }
    if (s.error) {
      lines.push('\u26A0\uFE0F ' + s.error);
    }
    box.innerHTML = lines.map(l => '<div>' + l.replace(/</g,'&lt;') + '</div>').join('');
  } catch {
    box.textContent = t('networkError');
  }
}

async function toggleChannelProbe() {
  const enabled = $('channelProbeCheck').checked;
  try {
    await auth.authFetch('/admin/channel-probe/toggle', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
    toast(t('saved'));
    loadChannelProbe();
  } catch {
    toast(t('networkError'), 'error');
  }
}

async function triggerChannelProbe() {
  const btn = $('channelProbeTriggerBtn');
  btn.disabled = true;
  try {
    const res = await auth.authFetch('/admin/channel-probe/trigger', { method: 'POST' });
    const d = await res.json();
    if (res.ok) {
      toast(t('channelProbeStarted'));
      setTimeout(loadChannelProbe, 500);
    } else {
      toast(d.error || 'Failed', 'error');
    }
  } catch {
    toast(t('networkError'), 'error');
  } finally {
    btn.disabled = false;
  }
}

// --- Edge Proxies ---
async function loadEdgeProxies() {
  try {
    const res = await auth.authFetch('/admin/edge-proxies');
    if (res.ok) {
      const d = await res.json();
      $('edgeCfUrl').value = d.cf || '';
      $('edgeVercelUrl').value = d.vercel || '';
    }
  } catch {}
}

async function saveEdgeProxies() {
  const status = $('edgeProxiesStatus');
  try {
    const res = await auth.authFetch('/admin/edge-proxies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cf: $('edgeCfUrl').value.trim(), vercel: $('edgeVercelUrl').value.trim() })
    });
    if (res.ok) {
      status.textContent = t('saved');
      status.className = 'status-text success';
    } else {
      status.textContent = t('saveFailed');
      status.className = 'status-text error';
    }
  } catch {
    status.textContent = t('networkError');
    status.className = 'status-text error';
  }
  setTimeout(() => { status.textContent = ''; }, 3000);
}


// --- Search Quota ---
let sqPinnedKeys = new Set();

async function loadSearchQuota() {
  try {
    const res = await auth.authFetch('/admin/search-quota');
    if (!res.ok) return;
    const d = await res.json();
    $('maxSearchableInput').value = d.maxSearchable;
    sqPinnedKeys = new Set(d.pinnedKeys || []);
    loadSearchQuotaReport();
  } catch {}
}

async function saveSearchQuota() {
  const status = $('searchQuotaStatus');
  status.textContent = '';
  const data = {
    maxSearchable: parseInt($('maxSearchableInput').value) || 0,
    pinnedKeys: [...sqPinnedKeys],
  };
  try {
    const res = await auth.authFetch('/admin/search-quota', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      status.textContent = t('saved');
      status.className = 'status-text success';
    } else {
      status.textContent = t('saveFailed');
      status.className = 'status-text error';
    }
  } catch {
    status.textContent = t('networkError');
    status.className = 'status-text error';
  }
  setTimeout(() => { status.textContent = ''; }, 3000);
}

async function loadSearchQuotaReport() {
  try {
    const res = await auth.authFetch('/admin/search-quota/report');
    if (!res.ok) return;
    const d = await res.json();
    if (d.searchable == null) return;

    // \u663E\u793A Search \u9875\u7B7E
    $('tabSearchQuota').style.display = '';
    $('sqSelectedInfo').textContent = d.totalSites + ' sites \u2192 ' + d.jsExcluded + ' JS excluded \u2192 ' + d.searchable + ' searchable' + (d.truncated > 0 ? ' (' + d.truncated + ' truncated)' : '') + (d.pinnedCount > 0 ? ', ' + d.pinnedCount + ' pinned' : '');
    $('badgeSearchQuota').textContent = d.searchable;

    // \u52A0\u8F7D\u7AD9\u70B9\u5217\u8868
    const cfgRes = await fetch('/');
    if (!cfgRes.ok) return;
    const cfg = await cfgRes.json();
    const allSites = (cfg.sites || []).filter(s => s.searchable === 1);
    sqAllSites = allSites;
    renderSearchSources();
  } catch {}
}

let sqAllSites = [];

function renderSearchSources() {
  const pinnedArr = [...sqPinnedKeys];
  const siteMap = new Map(sqAllSites.map(s => [s.key, s]));
  let html = '';

  // 1. Pinned \u6E90\uFF08\u6709\u5E8F\uFF0C\u53EF\u6392\u5E8F\uFF09
  if (pinnedArr.length > 0) {
    html += '<div style="margin-bottom:12px"><strong style="color:var(--primary)">' + t('sqPinned') + ' (' + pinnedArr.length + ')</strong>';
    html += ' <span style="font-size:0.75rem;color:var(--text-secondary)">\u2014 ' + t('sqPinnedDesc') + '</span></div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.8rem">';
    pinnedArr.forEach((key, i) => {
      const s = siteMap.get(key);
      const name = s ? (s.name || s.key) : key;
      html += '<tr style="border-bottom:1px solid var(--border);background:var(--bg-hover)">';
      html += '<td style="padding:4px;width:30px;color:var(--text-secondary)">' + (i + 1) + '</td>';
      html += '<td style="padding:4px;font-family:var(--mono);font-size:0.75rem">' + escHtml(key) + '</td>';
      html += '<td style="padding:4px">' + escHtml(name) + '</td>';
      html += '<td style="padding:4px;width:100px;text-align:right;white-space:nowrap">';
      if (i > 0) html += '<button class="btn btn-sm" style="padding:1px 6px;font-size:0.7rem" onclick="movePinned(' + i + ',-1)">\u25B2</button> ';
      if (i < pinnedArr.length - 1) html += '<button class="btn btn-sm" style="padding:1px 6px;font-size:0.7rem" onclick="movePinned(' + i + ',1)">\u25BC</button> ';
      html += '<button class="btn btn-sm" style="padding:1px 6px;font-size:0.7rem;color:var(--red)" onclick="togglePin(&quot;' + escHtml(key) + '&quot;)">' + t('sqUnpin') + '</button>';
      html += '</td></tr>';
    });
    html += '</table>';
  }

  // 2. \u5176\u4ED6\u6E90\uFF08\u53EF pin\uFF09
  const unpinned = sqAllSites.filter(s => !sqPinnedKeys.has(s.key));
  html += '<div style="margin-top:16px;margin-bottom:8px"><strong>' + t('sqOtherSources') + ' (' + unpinned.length + ')</strong></div>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:0.8rem">';
  unpinned.slice(0, 200).forEach(s => {
    html += '<tr style="border-bottom:1px solid var(--border)">';
    html += '<td style="padding:4px;font-family:var(--mono);font-size:0.75rem">' + escHtml(s.key) + '</td>';
    html += '<td style="padding:4px">' + escHtml(s.name || s.key) + '</td>';
    html += '<td style="padding:4px;width:50px;text-align:right"><button class="btn btn-sm" style="padding:1px 6px;font-size:0.7rem" onclick="togglePin(&quot;' + escHtml(s.key) + '&quot;)">' + t('sqPin') + '</button></td>';
    html += '</tr>';
  });
  if (unpinned.length > 200) html += '<tr><td colspan="3" style="padding:4px;color:var(--text-secondary)">... +' + (unpinned.length - 200) + ' more</td></tr>';
  html += '</table>';

  $('sqSelectedTable').innerHTML = html;
}

async function movePinned(index, direction) {
  const arr = [...sqPinnedKeys];
  const target = index + direction;
  if (target < 0 || target >= arr.length) return;
  [arr[index], arr[target]] = [arr[target], arr[index]];
  try {
    const res = await auth.authFetch('/admin/search-quota/pinned', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys: arr }),
    });
    if (res.ok) {
      const d = await res.json();
      sqPinnedKeys = new Set(d.pinnedKeys);
      renderSearchSources();
    }
  } catch {}
}

function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

async function togglePin(key) {
  const isPinned = sqPinnedKeys.has(key);
  try {
    const res = await auth.authFetch('/admin/search-quota/pinned', {
      method: isPinned ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys: [key] }),
    });
    if (res.ok) {
      const d = await res.json();
      sqPinnedKeys = new Set(d.pinnedKeys);
      renderSearchSources();
    }
  } catch {}
}

// --- Refresh ---
async function triggerRefresh() {
  const btn = $('refreshBtn');
  btn.textContent = t('running');
  btn.className = 'btn btn-sm loading';

  try {
    const res = await auth.authFetch('/refresh', { method: 'POST' });
    const d = await res.json();
    if (d.success) {
      toast(t('aggregationStarted'));
      setTimeout(loadStatus, 3000);
    } else {
      toast(t('refreshFailed'), 'error');
    }
  } catch {
    toast(t('networkError'), 'error');
  }

  setTimeout(() => {
    btn.textContent = t('refresh');
    btn.className = 'btn btn-sm';
  }, 3000);
}

// --- Cloud Credentials ---
const PLATFORM_NAMES = {
  aliyun:'\u963F\u91CC\u4E91\u76D8', bilibili:'Bilibili', quark:'\u5938\u514B\u7F51\u76D8', uc:'UC \u7F51\u76D8',
  pan115:'115 \u7F51\u76D8', tianyi:'\u5929\u7FFC\u4E91\u76D8', baidu:'\u767E\u5EA6\u7F51\u76D8', pan123:'123 \u7F51\u76D8',
  thunder:'\u8FC5\u96F7', pikpak:'PikPak'
};
const QR_PLATFORMS = ['bilibili','aliyun','quark','uc','pan115','tianyi','baidu','pan123'];
const PW_PLATFORMS = ['thunder','pikpak'];
let cloudCredentials = {};

async function loadCloudCredentials() {
  try {
    const res = await auth.authFetch('/admin/cloud-credentials');
    if (!res.ok) return;
    const data = await res.json();
    cloudCredentials = data.credentials || {};
    renderCloudCards();
    renderPlatformSelect();
  } catch {}
}

function renderCloudCards() {
  const grid = $('cloudLoginGrid');
  grid.innerHTML = '';
  const allPlatforms = [...QR_PLATFORMS, ...PW_PLATFORMS];

  for (const p of allPlatforms) {
    const cred = cloudCredentials[p];
    const isLoggedIn = cred && cred.hasCredential;
    const statusClass = isLoggedIn ? (cred.status === 'expired' ? 'expired' : 'valid') : 'none';
    const statusText = isLoggedIn ? (cred.status === 'expired' ? 'EXPIRED' : 'ACTIVE') : 'NOT SET';
    const isQR = QR_PLATFORMS.includes(p);
    const timeStr = cred?.obtainedAt ? new Date(cred.obtainedAt).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}) : '';

    const card = document.createElement('div');
    card.className = 'cloud-card';
    card.innerHTML =
      '<div class="cloud-card-header">' +
        '<span class="cloud-card-name">' + (PLATFORM_NAMES[p]||p) + '</span>' +
        '<span class="cloud-badge ' + statusClass + '">' + statusText + '</span>' +
      '</div>' +
      (timeStr ? '<div class="cloud-card-time">' + timeStr + '</div>' : '') +
      '<div class="cloud-card-actions">' +
        (isQR ? '<button class="btn btn-sm" onclick="startQRLogin(\\''+p+'\\')">Scan QR</button>' :
                '<button class="btn btn-sm" onclick="showPasswordLogin(\\''+p+'\\')">Login</button>') +
        (isLoggedIn ? '<button class="btn btn-sm btn-danger" onclick="logoutPlatform(\\''+p+'\\')">Logout</button>' : '') +
      '</div>';
    grid.appendChild(card);
  }
}

function renderPlatformSelect() {
  const sel = $('manualPlatform');
  sel.innerHTML = '';
  for (const [k,v] of Object.entries(PLATFORM_NAMES)) {
    const opt = document.createElement('option');
    opt.value = k; opt.textContent = v;
    sel.appendChild(opt);
  }
}

let qrPollTimer = null;

async function startQRLogin(platform) {
  try {
    const res = await auth.authFetch('/admin/cloud-login/' + platform + '/qr', { method: 'POST' });
    if (!res.ok) { const e = await res.json(); toast(e.error || 'QR failed', 'error'); return; }
    const data = await res.json();
    showQRModal(platform, data.qrUrl, data.token);
  } catch (e) {
    toast('QR generate failed: ' + e.message, 'error');
  }
}

function showQRModal(platform, qrUrl, token) {
  closeQRModal();
  const overlay = document.createElement('div');
  overlay.className = 'qr-modal-overlay';
  overlay.id = 'qrModalOverlay';
  overlay.onclick = function(e) { if(e.target===overlay) closeQRModal(); };

  const qrImgUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(qrUrl);

  overlay.innerHTML =
    '<div class="qr-modal">' +
    '<h3>' + (PLATFORM_NAMES[platform]||platform) + ' - Scan QR</h3>' +
    '<img src="' + qrImgUrl + '" alt="QR Code" onerror="this.alt=\\'QR: '+qrUrl.substring(0,60)+'...\\'">' +
    '<div class="qr-status" id="qrPollStatus">Waiting for scan...</div>' +
    '<div style="margin-top:14px;display:flex;gap:8px;justify-content:center">' +
    '<button class="btn btn-sm" onclick="closeQRModal()">Cancel</button>' +
    '</div></div>';

  document.body.appendChild(overlay);
  startQRPolling(platform, token);
}

function startQRPolling(platform, token) {
  if (qrPollTimer) clearInterval(qrPollTimer);
  let attempts = 0;
  const maxAttempts = 120; // 4 minutes at 2s intervals

  qrPollTimer = setInterval(async () => {
    attempts++;
    if (attempts > maxAttempts) { closeQRModal(); toast('QR expired', 'error'); return; }

    try {
      const res = await auth.authFetch('/admin/cloud-login/' + platform + '/poll?token=' + encodeURIComponent(token));
      const data = await res.json();
      const statusEl = $('qrPollStatus');
      if (!statusEl) { clearInterval(qrPollTimer); return; }

      if (data.status === 'confirmed') {
        statusEl.className = 'qr-status confirmed';
        statusEl.textContent = 'Login successful!';
        clearInterval(qrPollTimer);
        setTimeout(() => { closeQRModal(); loadCloudCredentials(); toast(PLATFORM_NAMES[platform] + ' logged in', 'success'); }, 1000);
      } else if (data.status === 'scanned') {
        statusEl.className = 'qr-status scanned';
        statusEl.textContent = 'Scanned, waiting for confirmation...';
      } else if (data.status === 'expired') {
        statusEl.className = 'qr-status expired';
        statusEl.textContent = 'QR expired. Close and try again.';
        clearInterval(qrPollTimer);
      } else if (data.status === 'error') {
        statusEl.className = 'qr-status expired';
        statusEl.textContent = data.message || 'Error';
        clearInterval(qrPollTimer);
      }
    } catch {}
  }, 2000);
}

function closeQRModal() {
  if (qrPollTimer) { clearInterval(qrPollTimer); qrPollTimer = null; }
  const overlay = $('qrModalOverlay');
  if (overlay) overlay.remove();
}

async function showPasswordLogin(platform) {
  const username = prompt(PLATFORM_NAMES[platform] + ' - Username/Email:');
  if (!username) return;
  const password = prompt(PLATFORM_NAMES[platform] + ' - Password:');
  if (!password) return;

  try {
    const res = await auth.authFetch('/admin/cloud-login/' + platform + '/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      toast(PLATFORM_NAMES[platform] + ' saved', 'success');
      loadCloudCredentials();
    } else {
      toast(data.message || 'Login failed', 'error');
    }
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
}

async function logoutPlatform(platform) {
  if (!confirm('Logout ' + (PLATFORM_NAMES[platform]||platform) + '?')) return;
  try {
    const res = await auth.authFetch('/admin/cloud-credentials/' + platform, { method: 'DELETE' });
    if (res.ok) {
      toast('Logged out', 'success');
      loadCloudCredentials();
    }
  } catch {}
}

async function manualPasteCredential() {
  const platform = $('manualPlatform').value;
  const rawValue = $('manualCredValue').value.trim();
  if (!rawValue) { toast('Please enter credential value', 'error'); return; }

  // \u667A\u80FD\u89E3\u6790\uFF1A\u5C1D\u8BD5 JSON\uFF0C\u5426\u5219\u6309 cookie string \u5904\u7406
  let credential;
  try {
    credential = JSON.parse(rawValue);
    if (typeof credential !== 'object') throw 0;
  } catch {
    // \u8D26\u53F7\u5BC6\u7801\u5E73\u53F0
    if (PW_PLATFORMS.includes(platform) && rawValue.includes(':')) {
      const [u, ...rest] = rawValue.split(':');
      credential = { username: u, password: rest.join(':') };
    } else {
      credential = { cookie: rawValue };
    }
  }

  try {
    const res = await auth.authFetch('/admin/cloud-credentials/' + platform, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    if (res.ok) {
      $('manualCredValue').value = '';
      toast(PLATFORM_NAMES[platform] + ' saved', 'success');
      loadCloudCredentials();
    } else {
      const e = await res.json();
      toast(e.error || 'Save failed', 'error');
    }
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
}

// --- Risk Report ---
async function loadRiskReport() {
  const container = $('riskReportContainer');
  const summary = $('riskSummary');

  try {
    const res = await auth.authFetch('/admin/credential-risk-report');
    if (!res.ok) { const e = await res.json(); toast(e.error || 'Failed', 'error'); return; }
    const data = await res.json();

    summary.textContent = 'Safe: ' + data.summary.safe + ' | Low: ' + data.summary.low +
      ' | High: ' + data.summary.high + ' | Unaudited: ' + data.summary.unaudited;

    const tbody = $('riskReportBody');
    tbody.innerHTML = '';

    // \u53EA\u663E\u793A\u9700\u8981\u51ED\u8BC1\u7684\u6E90\uFF08\u975E safe-A \u7C7B\uFF09
    const relevant = data.assessments.filter(a => a.neededPlatforms.length > 0 || a.riskLevel !== 'safe');
    const allowedSet = new Set(data.policy.allowedHighRiskKeys || []);
    const deniedSet = new Set(data.policy.deniedKeys || []);

    for (const a of relevant) {
      const tr = document.createElement('tr');
      const isAllowed = allowedSet.has(a.siteKey);
      const isDenied = deniedSet.has(a.siteKey);
      const needsAction = a.riskLevel === 'high' || a.riskLevel === 'unaudited';

      tr.innerHTML =
        '<td style="font-size:0.75rem">' + a.siteKey + '</td>' +
        '<td style="font-family:var(--mono);font-size:0.7rem">' + a.api + '</td>' +
        '<td><span class="risk-badge ' + a.riskLevel + '">' + a.riskLevel.toUpperCase() + '</span></td>' +
        '<td style="font-size:0.7rem">' + (a.neededPlatforms||[]).join(', ') + '</td>' +
        '<td style="font-size:0.7rem;color:' + (a.thirdPartyDomains.length ? 'var(--red)' : 'var(--text-dim)') + '">' +
          (a.thirdPartyDomains.join(', ') || '-') + '</td>' +
        '<td>' +
          (needsAction && !isAllowed ? '<button class="btn btn-sm" onclick="allowHighRisk(\\''+a.siteKey+'\\')">Allow</button>' : '') +
          (isAllowed ? '<button class="btn btn-sm btn-danger" onclick="revokeHighRisk(\\''+a.siteKey+'\\')">Revoke</button>' : '') +
          (isDenied ? '<span style="color:var(--red);font-size:0.7rem">DENIED</span>' : '') +
        '</td>';
      tbody.appendChild(tr);
    }

    container.style.display = 'block';
  } catch (e) {
    toast('Load failed: ' + e.message, 'error');
  }
}

async function allowHighRisk(siteKey) {
  if (!confirm('Allow credential injection for "' + siteKey + '"? Your cookies may be sent to third-party servers.')) return;
  try {
    const res = await auth.authFetch('/admin/credential-policy');
    const policy = await res.json();
    if (!policy.allowedHighRiskKeys) policy.allowedHighRiskKeys = [];
    if (!policy.allowedHighRiskKeys.includes(siteKey)) policy.allowedHighRiskKeys.push(siteKey);
    await auth.authFetch('/admin/credential-policy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy),
    });
    loadRiskReport();
    toast('Allowed: ' + siteKey, 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
}

async function revokeHighRisk(siteKey) {
  try {
    const res = await auth.authFetch('/admin/credential-policy');
    const policy = await res.json();
    policy.allowedHighRiskKeys = (policy.allowedHighRiskKeys||[]).filter(k => k !== siteKey);
    await auth.authFetch('/admin/credential-policy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy),
    });
    loadRiskReport();
    toast('Revoked: ' + siteKey, 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
}

// \u2500\u2500\u2500 \u53BB\u91CD\u914D\u7F6E \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadDedupConfig() {
  try {
    const res = await auth.authFetch('/admin/dedup-config');
    const cfg = await res.json();
    $('similarDedupCheck').checked = cfg.similarDedup !== false;
    const pct = Math.round((cfg.similarDedupThreshold || 0.85) * 100);
    $('dedupThreshold').value = pct;
    $('dedupThresholdVal').textContent = pct + '%';
  } catch {}
}
async function saveDedupConfig() {
  try {
    const cfg = {
      similarDedup: $('similarDedupCheck').checked,
      similarDedupThreshold: parseInt($('dedupThreshold').value) / 100,
    };
    const res = await auth.authFetch('/admin/dedup-config', {
      method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(cfg)
    });
    if (res.ok) { $('dedupStatus').textContent = '\u2713'; setTimeout(() => $('dedupStatus').textContent = '', 2000); }
  } catch {}
}

// \u2500\u2500\u2500 \u5206\u7EC4\u6392\u5E8F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let groupRules = [];
async function loadGroupOrder() {
  try {
    const res = await auth.authFetch('/admin/group-order');
    const cfg = await res.json();
    $('groupOrderEnabled').checked = cfg.enabled;
    $('groupOrderUnmatched').value = cfg.unmatchedPosition || 'after';
    groupRules = cfg.rules || [];
    renderGroupRules();
  } catch {}
}
function renderGroupRules() {
  const container = $('groupOrderRules');
  if (groupRules.length === 0) { container.innerHTML = '<div style="color:var(--text-dim);font-size:0.85rem">No rules yet</div>'; return; }
  let html = '';
  groupRules.forEach((rule, i) => {
    html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;padding:6px 8px;background:var(--surface-2);border-radius:4px">';
    html += '<span style="font-family:var(--mono);font-size:0.8rem;min-width:20px;color:var(--text-dim)">#' + (i+1) + '</span>';
    html += '<input type="text" value="' + esc(rule.name) + '" onchange="updateGroupRule(' + i + ',\\'name\\',this.value)" class="nt-input" style="width:80px" placeholder="Name">';
    html += '<input type="text" value="' + esc(rule.keywords.join(',')) + '" onchange="updateGroupRule(' + i + ',\\'keywords\\',this.value)" class="nt-input" style="flex:1" placeholder="Keywords (comma-separated)">';
    if (i > 0) html += '<button class="btn btn-sm" onclick="moveGroupRule(' + i + ',-1)">\u25B2</button>';
    if (i < groupRules.length - 1) html += '<button class="btn btn-sm" onclick="moveGroupRule(' + i + ',1)">\u25BC</button>';
    html += '<button class="btn btn-sm" style="color:var(--red)" onclick="removeGroupRule(' + i + ')">\u2715</button>';
    html += '</div>';
  });
  container.innerHTML = html;
}
function addGroupRule() {
  groupRules.push({ name: '', keywords: [] });
  renderGroupRules();
}
function removeGroupRule(i) { groupRules.splice(i, 1); renderGroupRules(); saveGroupOrder(); }
function moveGroupRule(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= groupRules.length) return;
  [groupRules[i], groupRules[j]] = [groupRules[j], groupRules[i]];
  renderGroupRules(); saveGroupOrder();
}
function updateGroupRule(i, field, value) {
  if (field === 'name') groupRules[i].name = value;
  else if (field === 'keywords') groupRules[i].keywords = value.split(',').map(s => s.trim()).filter(Boolean);
  saveGroupOrder();
}
async function saveGroupOrder() {
  try {
    const cfg = {
      enabled: $('groupOrderEnabled').checked,
      unmatchedPosition: $('groupOrderUnmatched').value,
      rules: groupRules,
    };
    const res = await auth.authFetch('/admin/group-order', {
      method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(cfg)
    });
    if (res.ok) { $('groupOrderStatus').textContent = '\u2713'; setTimeout(() => $('groupOrderStatus').textContent = '', 2000); }
  } catch {}
}

// \u2500\u2500\u2500 \u80CC\u666F\u8BBE\u7F6E \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function onBgTypeChange() {
  const t = $('bgType').value;
  $('bgImageGroup').style.display = t === 'image' ? 'block' : 'none';
  $('bgSolidGroup').style.display = t === 'solid' ? 'block' : 'none';
  $('bgGradientGroup').style.display = t === 'gradient' ? 'block' : 'none';
}
async function loadBgSettings() {
  try {
    const res = await auth.authFetch('/admin/bg-settings');
    if (!res.ok) return;
    const cfg = await res.json();
    $('bgType').value = cfg.type || 'default';
    if (cfg.imageUrl) $('bgImageUrl').value = cfg.imageUrl;
    if (cfg.solidColor) $('bgSolidColor').value = cfg.solidColor;
    if (cfg.gradient) $('bgGradient').value = cfg.gradient;
    onBgTypeChange();
  } catch {}
}
async function saveBgSettings() {
  try {
    const cfg = {
      type: $('bgType').value,
      imageUrl: $('bgImageUrl').value,
      solidColor: $('bgSolidColor').value,
      gradient: $('bgGradient').value,
    };
    const res = await auth.authFetch('/admin/bg-settings', {
      method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(cfg)
    });
    if (res.ok) {
      $('bgStatus').textContent = '\u2713'; setTimeout(() => $('bgStatus').textContent = '', 2000);
      loadBgFromServer();
    }
  } catch {}
}

// \u2500\u2500\u2500 \u805A\u5408\u65E5\u5FD7 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadAggLogs() {
  try {
    const res = await auth.authFetch('/admin/agg-logs?limit=50');
    const data = await res.json();
    const logs = data.logs || [];
    if (logs.length === 0) {
      $('aggLogsList').innerHTML = '<div style="color:var(--text-dim)">No aggregation logs yet.</div>';
      return;
    }
    let html = '';
    logs.forEach(log => {
      const status = log.success ? '<span style="color:var(--green)">\u2713</span>' : '<span style="color:var(--red)">\u2715</span>';
      const time = new Date(log.startTime).toLocaleString();
      const dur = (log.durationMs / 1000).toFixed(1) + 's';
      html += '<div style="padding:8px;margin-bottom:6px;background:var(--surface-2);border-radius:4px;border-left:3px solid ' + (log.success ? 'var(--green)' : 'var(--red)') + '">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<span>' + status + ' ' + time + '</span>';
      html += '<span style="font-family:var(--mono);font-size:0.8rem;color:var(--text-dim)">' + dur + '</span>';
      html += '</div>';
      html += '<div style="font-size:0.8rem;color:var(--text-dim);margin-top:4px">';
      html += 'Sources: ' + log.okSources + '/' + log.totalSources + ' OK';
      html += ' &middot; Sites: ' + log.finalSiteCount + ' &middot; Parses: ' + log.finalParseCount + ' &middot; Lives: ' + log.finalLiveCount;
      html += '</div>';
      if (log.addedSites && log.addedSites.length > 0) {
        html += '<div style="font-size:0.8rem;color:var(--green);margin-top:2px">+ ' + log.addedSites.map(s => s.name || s.key).join(', ') + '</div>';
      }
      if (log.removedSites && log.removedSites.length > 0) {
        html += '<div style="font-size:0.8rem;color:var(--red);margin-top:2px">- ' + log.removedSites.map(s => s.name || s.key).join(', ') + '</div>';
      }
      if (log.failedSources && log.failedSources.length > 0) {
        html += '<div style="font-size:0.75rem;color:var(--amber);margin-top:2px">Failed: ' + log.failedSources.map(s => s.name).join(', ') + '</div>';
      }
      if (log.errorMessage) {
        html += '<div style="font-size:0.75rem;color:var(--red);margin-top:2px">Error: ' + esc(log.errorMessage) + '</div>';
      }
      html += '</div>';
    });
    $('aggLogsList').innerHTML = html;
  } catch {}
}
async function clearAggLogs() {
  if (!confirm('Clear all aggregation logs?')) return;
  await auth.authFetch('/admin/agg-logs', { method: 'DELETE' });
  loadAggLogs();
}

// \u2500\u2500\u2500 \u76F4\u64AD\u7981\u7528 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadLiveDisabled() {
  try {
    const r = await auth.authFetch('/admin/live-disabled');
    const d = await r.json();
    $('liveDisabledCheck').checked = d.disabled;
  } catch {}
}
async function saveLiveDisabled() {
  const disabled = $('liveDisabledCheck').checked;
  await auth.authFetch('/admin/live-disabled', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({disabled}) });
  $('liveDisabledStatus').textContent = '\u2713';
  setTimeout(() => $('liveDisabledStatus').textContent = '', 2000);
}

// \u2500\u2500\u2500 \u667A\u80FD Base URL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadSmartBaseUrl() {
  try {
    const r = await auth.authFetch('/admin/smart-base-url');
    const d = await r.json();
    $('smartBaseUrlCheck').checked = d.enabled;
  } catch {}
}
async function saveSmartBaseUrl() {
  const enabled = $('smartBaseUrlCheck').checked;
  await auth.authFetch('/admin/smart-base-url', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({enabled}) });
  $('smartBaseUrlStatus').textContent = '\u2713';
  setTimeout(() => $('smartBaseUrlStatus').textContent = '', 2000);
}

// \u2500\u2500\u2500 \u9A8C\u6D3B\u6DF1\u5EA6 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadProbeDepth() {
  try {
    const r = await auth.authFetch('/admin/site-probe-depth');
    const d = await r.json();
    $('probeDepthSelect').value = d.depth || 'deep';
  } catch {}
}
async function saveProbeDepth() {
  const depth = $('probeDepthSelect').value;
  await auth.authFetch('/admin/site-probe-depth', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({depth}) });
  $('probeDepthStatus').textContent = '\u2713';
  setTimeout(() => $('probeDepthStatus').textContent = '', 2000);
}

// \u2500\u2500\u2500 \u81EA\u52A8\u6E05\u7406 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadAutoClean() {
  try {
    const r = await auth.authFetch('/admin/site-auto-clean');
    const d = await r.json();
    $('autoCleanCheck').checked = d.enabled;
  } catch {}
}
async function saveAutoClean() {
  const enabled = $('autoCleanCheck').checked;
  await auth.authFetch('/admin/site-auto-clean', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({enabled}) });
  $('autoCleanStatus').textContent = '\u2713';
  setTimeout(() => $('autoCleanStatus').textContent = '', 2000);
}

// \u2500\u2500\u2500 Init new settings \u2500\u2500\u2500\u2500\u2500\u2500\u2500
loadLiveDisabled();
loadSmartBaseUrl();
loadProbeDepth();
loadAutoClean();

applyTheme(getTheme());
initThemeDropdown();
loadBgFromServer();
applyLang(translations, getLang());
</script>
</body>
</html>`;

// src/core/dashboard.ts
var dashboardHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TVBox Source Aggregator</title>
<style>
${sharedStyles}

/* Dashboard-specific */
.header{margin-bottom:48px}

.stats-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:16px;
  margin-bottom:32px;
}

@media(max-width:560px){
  .stats-grid{grid-template-columns:1fr}
}

.stat-card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:24px;
  position:relative;
  overflow:hidden;
  transition:border-color 0.3s, transform 0.2s;
  animation:fadeSlideUp 0.5s ease-out both;
}

.stat-card:nth-child(1){animation-delay:0.1s}
.stat-card:nth-child(2){animation-delay:0.15s}
.stat-card:nth-child(3){animation-delay:0.2s}
.stat-card:nth-child(4){animation-delay:0.25s}

.stat-card:hover{
  border-color:var(--border-glow);
  transform:translateY(-2px);
}

.stat-card::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg, transparent, var(--green-dim), transparent);
}

.stat-label{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.15em;
  text-transform:uppercase;
  color:var(--text-dim);
  margin-bottom:12px;
  display:flex;
  align-items:center;
  gap:6px;
}

.stat-icon{
  width:14px;height:14px;
  opacity:0.5;
}

.stat-value{
  font-family:var(--mono);
  font-size:2.2rem;
  font-weight:700;
  color:var(--text-bright);
  line-height:1;
  letter-spacing:-0.02em;
}

.stat-value .unit{
  font-size:0.8rem;
  font-weight:400;
  color:var(--text-dim);
  margin-left:4px;
}

.stat-card.highlight .stat-value{
  color:var(--green);
  text-shadow:0 0 20px var(--green-dim);
}

/* Update time section */
.update-section{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:20px 24px;
  margin-bottom:32px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  animation:fadeSlideUp 0.5s ease-out 0.3s both;
}

@media(max-width:560px){
  .update-section{flex-direction:column;align-items:flex-start}
}

.update-info{
  display:flex;flex-direction:column;gap:4px;
}

.update-label{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.15em;
  text-transform:uppercase;
  color:var(--text-dim);
}

.update-time{
  font-family:var(--mono);
  font-size:0.95rem;
  color:var(--text-bright);
  font-weight:500;
}

.update-time.stale{color:var(--amber)}
.update-time.never{color:var(--red)}

/* Refresh button - removed */
}

/* Source Health Section */
.health-section{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:20px 24px;
  margin-bottom:32px;
  animation:fadeSlideUp 0.5s ease-out 0.32s both;
}

.health-summary{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  margin-bottom:8px;
}

.health-label{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.15em;
  text-transform:uppercase;
  color:var(--text-dim);
}

.health-counts{
  display:flex;
  gap:16px;
  font-family:var(--mono);
  font-size:0.75rem;
}

.health-count{
  display:flex;
  align-items:center;
  gap:4px;
}

.health-count.ok{color:var(--green)}
.health-count.warn{color:var(--amber)}
.health-count.error{color:var(--red)}

.health-dot{
  width:6px;height:6px;
  border-radius:50%;
  display:inline-block;
}

.health-dot.ok{background:var(--green);box-shadow:0 0 6px var(--green-glow)}
.health-dot.warn{background:var(--amber);box-shadow:0 0 6px var(--amber-dim)}
.health-dot.error{background:var(--red);box-shadow:0 0 6px var(--red-dim)}

.health-table-wrap{
  overflow-x:auto;
  margin-top:12px;
}

.health-table{
  width:100%;
  border-collapse:collapse;
  font-family:var(--mono);
  font-size:0.7rem;
}

.health-table th{
  text-align:left;
  padding:8px 10px;
  font-size:0.6rem;
  letter-spacing:0.12em;
  text-transform:uppercase;
  color:var(--text-dim);
  border-bottom:1px solid var(--border);
  white-space:nowrap;
}

.health-table td{
  padding:8px 10px;
  border-bottom:1px solid var(--border);
  color:var(--text);
  white-space:nowrap;
}

.health-table tr:last-child td{border-bottom:none}

.health-table .url-cell{
  max-width:200px;
  overflow:hidden;
  text-overflow:ellipsis;
  color:var(--text-dim);
}

.health-table .status-ok{color:var(--green)}
.health-table .status-warn{color:var(--amber)}
.health-table .status-error{color:var(--red)}

.health-table tr.row-error td{background:var(--red-dim)}
.health-table tr.row-warn td{background:var(--amber-dim)}

@media(max-width:560px){
  .health-summary{flex-direction:column;align-items:flex-start}
  .health-table{font-size:0.6rem}
  .health-table .url-cell{max-width:120px}
}

/* Config URL section */
.config-section{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:20px 24px;
  animation:fadeSlideUp 0.5s ease-out 0.35s both;
}

.config-label{
  font-family:var(--mono);
  font-size:0.7rem;
  letter-spacing:0.15em;
  text-transform:uppercase;
  color:var(--text-dim);
  margin-bottom:10px;
}

.config-url-row{
  display:flex;
  align-items:center;
  gap:10px;
}

.config-url{
  flex:1;
  font-family:var(--mono);
  font-size:0.8rem;
  color:var(--green);
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  padding:10px 14px;
  overflow-x:auto;
  white-space:nowrap;
  user-select:all;
}

.copy-btn{
  font-family:var(--mono);
  font-size:0.7rem;
  font-weight:500;
  letter-spacing:0.08em;
  text-transform:uppercase;
  padding:10px 16px;
  background:var(--surface-2);
  border:1px solid var(--border);
  color:var(--text-dim);
  border-radius:4px;
  cursor:pointer;
  transition:all 0.2s;
  white-space:nowrap;
}

.copy-btn:hover{
  border-color:var(--text-dim);
  color:var(--text);
}

.copy-btn.copied{
  color:var(--green);
  border-color:var(--green);
}

.warning-banner{
  background:var(--amber-dim);
  border:1px solid var(--amber);
  border-radius:8px;
  padding:12px 16px;
  margin-bottom:20px;
  font-family:var(--mono);
  font-size:0.75rem;
  color:var(--amber);
  line-height:1.6;
}

.footer{margin-top:48px;padding-top:24px}
</style>
<script>(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)})()</script>
</head>
<body style="opacity:0">

<div class="container">
  <header class="header">
    <div class="header-top">
      <div class="header-label" data-i18n="headerLabel">System Monitor</div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="themeDropdown"></span>
        <button class="lang-toggle" id="langToggle" onclick="doToggleLang()">\u4E2D\u6587</button>
      </div>
    </div>
    <h1 class="header-title">TVBox <span>Aggregator</span></h1>
    <div class="status-bar">
      <div class="status-indicator">
        <span class="status-dot" id="statusDot"></span>
        <span id="statusText" data-i18n="connecting">Connecting...</span>
      </div>
    </div>
    <nav class="header-nav">
      <a href="/admin" data-i18n="navAdmin">Admin</a>
      <a href="/admin/config-editor" data-i18n="navConfigEditor">Config Editor</a>
    </nav>
  </header>

  <div id="warningBanner"></div>

  <div class="stats-grid">
    <div class="stat-card highlight">
      <div class="stat-label">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        <span data-i18n="sites">Sites</span>
      </div>
      <div class="stat-value" id="statSites"><span class="skeleton">&nbsp;000&nbsp;</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        <span data-i18n="lives">Lives</span>
      </div>
      <div class="stat-value" id="statLives"><span class="skeleton">&nbsp;00&nbsp;</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span data-i18n="parses">Parses</span>
      </div>
      <div class="stat-value" id="statParses"><span class="skeleton">&nbsp;00&nbsp;</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
        <span data-i18n="sources">Sources</span>
      </div>
      <div class="stat-value" id="statSources"><span class="skeleton">&nbsp;00&nbsp;</span></div>
    </div>
  </div>

  <div class="update-section">
    <div class="update-info">
      <div class="update-label" data-i18n="lastAggregation">Last Aggregation</div>
      <div class="update-time" id="updateTime"><span class="skeleton">&nbsp;Loading...&nbsp;</span></div>
    </div>
  </div>

  <div class="health-section">
    <div class="health-summary">
      <div class="health-label" data-i18n="sourceHealth">Source Health</div>
      <div class="health-counts">
        <span class="health-count ok"><span class="health-dot ok"></span> <span id="healthOk">-</span> OK</span>
        <span class="health-count warn"><span class="health-dot warn"></span> <span id="healthWarn">-</span> WARN</span>
        <span class="health-count error"><span class="health-dot error"></span> <span id="healthError">-</span> ERR</span>
      </div>
    </div>
    <div class="collapsible-toggle" id="healthToggle" onclick="toggleCollapsible(this)" data-i18n="healthDetails">Details</div>
    <div class="collapsible-body" id="healthBody">
      <div class="health-table-wrap">
        <table class="health-table">
          <thead>
            <tr>
              <th></th>
              <th data-i18n="healthName">Name</th>
              <th>URL</th>
              <th data-i18n="healthStatus">Status</th>
              <th data-i18n="healthFails">Fails</th>
              <th data-i18n="healthLastOk">Last OK</th>
            </tr>
          </thead>
          <tbody id="healthTableBody">
            <tr><td colspan="6" class="empty">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="health-section" id="searchQuotaSection" style="display:none">
    <div class="health-summary">
      <div class="health-label" data-i18n="searchQuota">Search Quota</div>
      <div class="health-counts">
        <span class="health-count ok"><span class="health-dot ok"></span> <span id="sqActiveCount">-</span> <span data-i18n="sqActive">active</span></span>
        <span class="health-count error"><span class="health-dot error"></span> <span id="sqExcludedCount">-</span> <span data-i18n="sqExcluded">excluded</span></span>
      </div>
    </div>
    <div class="collapsible-toggle" id="sqToggle" onclick="toggleCollapsible(this)" data-i18n="healthDetails">Details</div>
    <div class="collapsible-body" id="sqBody">
      <div class="health-table-wrap">
        <table class="health-table">
          <thead>
            <tr>
              <th>#</th>
              <th data-i18n="sqName">Name</th>
              <th data-i18n="sqSource">Source</th>
              <th data-i18n="sqReason">Reason</th>
            </tr>
          </thead>
          <tbody id="sqTableBody">
            <tr><td colspan="4" class="empty">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="config-section">
    <div class="config-label" data-i18n="configUrlLabel">TVBox Config URL</div>
    <div class="config-url-row">
      <div class="config-url" id="configUrl"></div>
      <button class="copy-btn" id="copyBtn" onclick="copyUrl('configUrl')" data-i18n="copy">Copy</button>
    </div>
    <div style="margin-top:12px">
      <div class="config-label" data-i18n="liveConfigUrlLabel">Live-Only Config URL</div>
      <div class="config-url-row">
        <div class="config-url" id="liveConfigUrl"></div>
        <button class="copy-btn" id="copyLiveBtn" onclick="copyUrl('liveConfigUrl')" data-i18n="copy">Copy</button>
      </div>
    </div>
  </div>

  <div class="footer">
    <span data-i18n="footer">TVBox Source Aggregator &middot; Cron 05:00 UTC Daily</span>
  </div>
</div>

<script>
${sharedUi}

const translations = {
  en: {
    headerLabel:'System Monitor', connecting:'Connecting...', sites:'Sites', lives:'Lives',
    parses:'Parses', sources:'Sources', lastAggregation:'Last Aggregation',
    configUrlLabel:'TVBox Config URL', liveConfigUrlLabel:'Live-Only Config URL',
    copy:'Copy', copied:'Copied!', copyFailed:'Failed', neverRefresh:'Never',
    fetchError:'Failed to fetch status', noData:'No data',
    sourceHealth:'Source Health', healthDetails:'Details', healthName:'Name',
    healthStatus:'Status', healthFails:'Fails', healthLastOk:'Last OK',
    healthNoData:'No health data yet', healthNever:'--',
    searchQuota:'Search Quota', sqActive:'active', sqExcluded:'excluded',
    sqName:'Name', sqSource:'Source', sqReason:'Reason',
    sqPinned:'pinned', sqHttp:'http', sqMainJar:'main jar', sqIndepJar:'indep jar',
    warnDockerNoBaseUrl:'Docker environment detected without BASE_URL configured. JAR proxy addresses may be unreachable from TVBox clients.<br>Set <b>BASE_URL=http://HOST_IP:PORT</b> in docker-compose.yml',
    footer:'TVBox Source Aggregator &middot; Cron 05:00 UTC Daily',
    navAdmin:'Admin', navConfigEditor:'Config Editor',
  },
  zh: {
    headerLabel:'\u7CFB\u7EDF\u76D1\u63A7', connecting:'\u8FDE\u63A5\u4E2D...', sites:'\u7AD9\u70B9', lives:'\u76F4\u64AD',
    parses:'\u89E3\u6790', sources:'\u6E90', lastAggregation:'\u4E0A\u6B21\u805A\u5408',
    configUrlLabel:'TVBox \u914D\u7F6E\u5730\u5740', liveConfigUrlLabel:'\u76F4\u64AD\u914D\u7F6E\u5730\u5740',
    copy:'\u590D\u5236', copied:'\u5DF2\u590D\u5236!', copyFailed:'\u5931\u8D25', neverRefresh:'\u4ECE\u672A\u66F4\u65B0',
    fetchError:'\u83B7\u53D6\u72B6\u6001\u5931\u8D25', noData:'\u65E0\u6570\u636E',
    sourceHealth:'\u6E90\u5065\u5EB7\u72B6\u6001', healthDetails:'\u8BE6\u60C5', healthName:'\u540D\u79F0',
    healthStatus:'\u72B6\u6001', healthFails:'\u5931\u8D25', healthLastOk:'\u6700\u540E\u6210\u529F',
    healthNoData:'\u6682\u65E0\u5065\u5EB7\u6570\u636E', healthNever:'--',
    searchQuota:'\u641C\u7D22\u914D\u989D', sqActive:'\u6D3B\u8DC3', sqExcluded:'\u6392\u9664',
    sqName:'\u540D\u79F0', sqSource:'\u6765\u6E90', sqReason:'\u539F\u56E0',
    sqPinned:'\u7F6E\u9876', sqHttp:'HTTP', sqMainJar:'\u4E3B JAR', sqIndepJar:'\u72EC\u7ACB JAR',
    warnDockerNoBaseUrl:'\u68C0\u6D4B\u5230 Docker \u73AF\u5883\u4F46\u672A\u914D\u7F6E BASE_URL\uFF0CJAR \u4EE3\u7406\u5730\u5740\u53EF\u80FD\u4E0D\u53EF\u8FBE\u3002<br>\u8BF7\u5728 docker-compose.yml \u4E2D\u8BBE\u7F6E <b>BASE_URL=http://\u5BBF\u4E3B\u673AIP:\u7AEF\u53E3</b>',
    footer:'TVBox \u6E90\u805A\u5408\u5668 &middot; \u6BCF\u65E5 UTC 05:00 \u5B9A\u65F6\u4EFB\u52A1',
    navAdmin:'\u7BA1\u7406', navConfigEditor:'\u914D\u7F6E\u7F16\u8F91',
  }
};

function t(key) { const l = getLang(); return translations[l]?.[key] || translations.en[key] || key; }

function doToggleLang() {
  const next = getLang() === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', next);
  applyLang(translations, next);
  loadStatus();
}

const configUrl = location.origin + '/';
$('configUrl').textContent = configUrl;
$('liveConfigUrl').textContent = location.origin + '/live-config';

async function loadStatus() {
  try {
    const res = await fetch('/status-data');
    const d = await res.json();

    $('statSites').textContent = d.sites ?? '\u2014';
    $('statLives').textContent = d.lives ?? '\u2014';
    $('statParses').textContent = d.parses ?? '\u2014';
    $('statSources').textContent = d.sourceCount ?? '\u2014';

    const dot = $('statusDot');
    const txt = $('statusText');
    const time = $('updateTime');

    if (d.lastUpdate && d.lastUpdate !== 'never') {
      const date = new Date(d.lastUpdate);
      const now = new Date();
      const diffH = (now - date) / 3.6e6;
      const fmt = date.toLocaleString('zh-CN', {
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit', second:'2-digit',
        hour12: false
      });

      time.textContent = fmt;
      time.className = 'update-time' + (diffH > 26 ? ' stale' : '');

      dot.className = 'status-dot';
      txt.textContent = 'Online \xB7 ' + d.sites + ' ' + t('sites').toLowerCase();
    } else {
      time.textContent = t('neverRefresh');
      time.className = 'update-time never';
      dot.className = 'status-dot offline';
      txt.textContent = t('noData');
    }

    // Render warnings
    const banner = $('warningBanner');
    const warnings = d.warnings || [];
    if (warnings.length > 0) {
      const WARN_KEYS = { docker_no_base_url: 'warnDockerNoBaseUrl' };
      banner.innerHTML = warnings.map(w => '<div class="warning-banner">\u26A0 ' + (t(WARN_KEYS[w] || w)) + '</div>').join('');
    } else {
      banner.innerHTML = '';
    }
  } catch (e) {
    $('statusDot').className = 'status-dot offline';
    $('statusText').textContent = t('error');
    $('updateTime').textContent = t('fetchError');
    $('updateTime').className = 'update-time never';
  }
}


function copyUrl(elementId) {
  const text = $(elementId).textContent;
  const btn = $(elementId).parentElement.querySelector('.copy-btn');
  function onOk() {
    btn.textContent = t('copied');
    btn.className = 'copy-btn copied';
    setTimeout(() => { btn.textContent = t('copy'); btn.className = 'copy-btn'; }, 2000);
  }
  function onFail() {
    btn.textContent = t('copyFailed');
    btn.className = 'copy-btn error';
    setTimeout(() => { btn.textContent = t('copy'); btn.className = 'copy-btn'; }, 2000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onOk).catch(() => {
      fallbackCopy(text) ? onOk() : onFail();
    });
  } else {
    fallbackCopy(text) ? onOk() : onFail();
  }
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
  return ok;
}

const STATUS_LABELS = {
  ok:'OK', http_error:'HTTP ERR', decode_error:'DECODE ERR',
  parse_error:'PARSE ERR', timeout:'TIMEOUT', network_error:'NET ERR'
};

async function loadSearchQuotaSummary() {
  try {
    const res = await fetch('/search-quota/summary');
    if (!res.ok) return;
    const d = await res.json();
    if (!d.enabled) {
      $('searchQuotaSection').style.display = 'none';
      return;
    }
    $('searchQuotaSection').style.display = '';
    $('sqActiveCount').textContent = d.searchable || 0;
    $('sqExcludedCount').textContent = (d.jsExcluded || 0) + (d.truncated || 0);

    const tbody = $('sqTableBody');
    let html = '';
    html += '<tr><td>Total</td><td colspan="3">' + (d.totalSites || '-') + ' sites</td></tr>';
    html += '<tr><td>JS excluded</td><td colspan="3">' + (d.jsExcluded || 0) + '</td></tr>';
    html += '<tr><td>Pinned</td><td colspan="3">' + (d.pinnedCount || 0) + '</td></tr>';
    if (d.truncated > 0) html += '<tr><td>Truncated</td><td colspan="3">' + d.truncated + '</td></tr>';
    html += '<tr style="font-weight:600"><td>Searchable</td><td colspan="3">' + (d.searchable || 0) + '</td></tr>';
    tbody.innerHTML = html;
  } catch {}
}
function escDash(s) { const d = document.createElement('div'); d.textContent = s || '-'; return d.innerHTML; }

async function loadSourceHealth() {
  try {
    const res = await fetch('/source-status');
    const records = await res.json();

    let ok = 0, warn = 0, err = 0;
    records.forEach(r => {
      if (r.consecutiveFailures >= 5) err++;
      else if (r.consecutiveFailures >= 3) warn++;
      else ok++;
    });

    $('healthOk').textContent = ok;
    $('healthWarn').textContent = warn;
    $('healthError').textContent = err;

    records.sort((a, b) => b.consecutiveFailures - a.consecutiveFailures);
    renderHealthTable(records);

    // \u667A\u80FD\u6298\u53E0\uFF1A\u6709 error \u7EA7\u522B\u65F6\u81EA\u52A8\u5C55\u5F00
    const toggle = $('healthToggle');
    const body = $('healthBody');
    if (err > 0 && !toggle.classList.contains('open')) {
      toggle.classList.add('open');
      body.classList.add('open');
    }
  } catch {
    $('healthTableBody').innerHTML =
      '<tr><td colspan="6" class="empty">' + t('fetchError') + '</td></tr>';
  }
}

function renderHealthTable(records) {
  if (!records.length) {
    $('healthTableBody').innerHTML =
      '<tr><td colspan="6" class="empty">' + t('healthNoData') + '</td></tr>';
    return;
  }

  $('healthTableBody').innerHTML = records.map(r => {
    const level = r.consecutiveFailures >= 5 ? 'error'
               : r.consecutiveFailures >= 3 ? 'warn' : 'ok';
    const statusLabel = STATUS_LABELS[r.latestStatus] || r.latestStatus;

    const lastOk = r.lastSuccessTime
      ? new Date(r.lastSuccessTime).toLocaleString('zh-CN', {
          month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false
        })
      : t('healthNever');

    return '<tr class="row-' + level + '">' +
      '<td><span class="health-dot ' + level + '"></span></td>' +
      '<td>' + esc(r.name || 'Unnamed') + '</td>' +
      '<td class="url-cell" title="' + esc(r.url) + '">' + esc(r.url) + '</td>' +
      '<td class="status-' + level + '">' + statusLabel + '</td>' +
      '<td>' + r.consecutiveFailures + '</td>' +
      '<td>' + lastOk + '</td>' +
    '</tr>';
  }).join('');
}

applyTheme(getTheme());
initThemeDropdown();
loadBgFromServer();
applyLang(translations, getLang());
loadStatus();
loadSourceHealth();
loadSearchQuotaSummary();
setInterval(loadStatus, 60000);
setInterval(loadSourceHealth, 60000);
</script>
</body>
</html>`;

// src/core/config-editor.ts
var configEditorHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TVBox Aggregator - Config Editor</title>
<style>
${sharedStyles}

/* Config Editor specific */
.container{max-width:960px}

/* Group */
.group{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  margin-bottom:12px;
  overflow:hidden;
}

.group-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 16px;
  cursor:pointer;
  user-select:none;
  transition:background 0.2s;
}

.group-header:hover{background:var(--surface-2)}

.group-title{
  flex:1;
  font-family:var(--mono);
  font-size:0.8rem;
  font-weight:600;
  color:var(--text-bright);
  display:flex;
  align-items:center;
  gap:8px;
}

.group-title .count{
  font-size:0.65rem;
  font-weight:400;
  color:var(--text-dim);
  padding:2px 8px;
  background:var(--surface-2);
  border-radius:10px;
}

.group-arrow{
  font-size:0.7rem;
  color:var(--text-dim);
  transition:transform 0.2s;
}

.group.open .group-arrow{transform:rotate(90deg)}

.group-body{
  display:none;
  border-top:1px solid var(--border);
}

.group.open .group-body{display:block}

/* Item row */
.item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 16px;
  border-bottom:1px solid var(--border);
  transition:background 0.15s;
  font-family:var(--mono);
  font-size:0.75rem;
}

.item:last-child{border-bottom:none}
.item:hover{background:var(--surface-2)}

.item.blocked{opacity:0.4}

.item-name{
  flex:1;
  min-width:0;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:var(--text-bright);
  font-weight:500;
}

.item.blocked .item-name{
  text-decoration:line-through;
  color:var(--text-dim);
}

.item-type{
  position:relative;
  font-size:0.6rem;
  padding:2px 8px;
  border-radius:4px;
  font-weight:600;
  letter-spacing:0.05em;
  text-transform:uppercase;
  cursor:help;
  white-space:nowrap;
}

.item-type.t0{background:var(--blue-dim);color:var(--blue)}
.item-type.t1{background:var(--green-dim);color:var(--green)}
.item-type.t3{background:var(--amber-dim);color:var(--amber)}
.item-type.t4{background:var(--red-dim);color:var(--red)}

/* Tooltip */
.tooltip{
  position:absolute;
  bottom:calc(100% + 8px);
  left:50%;
  transform:translateX(-50%);
  background:var(--surface);
  border:1px solid var(--border-glow);
  border-radius:6px;
  padding:8px 12px;
  font-family:var(--sans);
  font-size:0.75rem;
  font-weight:400;
  color:var(--text);
  white-space:nowrap;
  pointer-events:none;
  opacity:0;
  transition:opacity 0.15s;
  z-index:100;
  text-transform:none;
  letter-spacing:0;
  box-shadow:0 4px 12px rgba(0,0,0,0.3);
}

.tooltip::after{
  content:'';
  position:absolute;
  top:100%;
  left:50%;
  transform:translateX(-50%);
  border:5px solid transparent;
  border-top-color:var(--border-glow);
}

.item-type:hover .tooltip{opacity:1}

.item-api{
  max-width:200px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:var(--text-dim);
  font-size:0.65rem;
}

.item-actions{
  display:flex;
  gap:6px;
  flex-shrink:0;
}

/* Flat list (for parses / lives) */
.flat-list{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  overflow:hidden;
}

/* Stats bar */
.stats{
  display:flex;
  gap:16px;
  margin-bottom:20px;
  font-family:var(--mono);
  font-size:0.7rem;
  color:var(--text-dim);
}

.stats .stat{
  display:flex;
  align-items:center;
  gap:4px;
}

.stats .num{
  color:var(--green);
  font-weight:600;
}

.stats .blocked-num{
  color:var(--red);
  font-weight:600;
}

/* Loading */
.loading-msg{
  text-align:center;
  padding:60px 20px;
  font-family:var(--mono);
  font-size:0.8rem;
  color:var(--text-dim);
}

/* Checkbox */
.item-check,.group-check{
  width:14px;
  height:14px;
  accent-color:var(--green);
  cursor:pointer;
  flex-shrink:0;
}
.group-check{margin-right:4px}
.item.blocked .item-check{display:none}

/* Batch bar */
.batch-bar{
  position:fixed;
  bottom:24px;
  left:50%;
  transform:translateX(-50%);
  background:var(--surface);
  border:1px solid var(--green-dim);
  border-radius:8px;
  padding:10px 20px;
  display:flex;
  align-items:center;
  gap:12px;
  font-family:var(--mono);
  font-size:0.75rem;
  color:var(--text);
  box-shadow:0 4px 16px rgba(0,0,0,0.4);
  z-index:50;
}
.batch-count{color:var(--green);font-weight:600}

.footer{margin-top:48px;padding-top:24px}
</style>
<script>(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)})()</script>
</head>
<body style="opacity:0">

<!-- Login -->
<div class="login-overlay" id="loginOverlay">
  <div class="login-box">
    <h2 data-i18n="loginTitle">Config Editor</h2>
    <p data-i18n="loginSubtitle">Enter admin token</p>
    <div class="error-msg" id="loginError" data-i18n="invalidToken">Invalid token</div>
    <input type="password" id="tokenInput" data-i18n-placeholder="tokenPh" placeholder="Admin Token" autofocus>
    <button class="btn" style="width:100%" data-i18n="login" onclick="auth.doLogin()">Login</button>
  </div>
</div>

<!-- Main -->
<div class="container" id="mainContent" style="display:none">
  <header class="header">
    <div class="header-top">
      <div class="header-label" data-i18n="headerLabel">Config Editor</div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="themeDropdown"></span>
        <button class="lang-toggle" id="langToggle" onclick="doToggleLang()">EN</button>
      </div>
    </div>
    <h1 class="header-title">TVBox <span>Config</span></h1>
    <div class="header-nav">
      <a href="/admin" data-i18n="navAdmin">Admin</a>
      <a href="/status" data-i18n="navDashboard">Dashboard</a>
    </div>
  </header>

  <!-- Tabs -->
  <div class="tabs">
    <div class="tab active" data-tab="sites" onclick="switchTab('sites')"><span data-i18n="sites">Sites</span> <span class="badge" id="badgeSites">0</span></div>
    <div class="tab" data-tab="parses" onclick="switchTab('parses')"><span data-i18n="parses">Parses</span> <span class="badge" id="badgeParses">0</span></div>
    <div class="tab" data-tab="lives" onclick="switchTab('lives')"><span data-i18n="lives">Lives</span> <span class="badge" id="badgeLives">0</span></div>
    <div class="tab" data-tab="regex" onclick="switchTab('regex')"><span data-i18n="regexTab">Regex Rules</span> <span class="badge" id="badgeRegex">0</span></div>
  </div>

  <!-- Search -->
  <div class="search-bar">
    <input type="text" id="searchInput" data-i18n-placeholder="searchPh" placeholder="\u641C\u7D22\u540D\u79F0\u3001API\u3001URL..." oninput="doSearch()">
  </div>

  <!-- Stats -->
  <div class="stats" id="statsBar"></div>

  <!-- Sites panel -->
  <div class="tab-panel active" id="panelSites">
    <div class="loading-msg" id="loadingSites" data-i18n="loading">\u52A0\u8F7D\u4E2D...</div>
  </div>

  <!-- Parses panel -->
  <div class="tab-panel" id="panelParses">
    <div class="loading-msg" id="loadingParses" data-i18n="loading">\u52A0\u8F7D\u4E2D...</div>
  </div>

  <!-- Lives panel -->
  <div class="tab-panel" id="panelLives">
    <div class="loading-msg" id="loadingLives" data-i18n="loading">\u52A0\u8F7D\u4E2D...</div>
  </div>

  <!-- Regex Rules panel -->
  <div class="tab-panel" id="panelRegex">
    <div style="margin-bottom:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <input type="text" id="regexPattern" class="search-bar-input" placeholder="Regex pattern (e.g. \u6D4B\u8BD5|\u5E7F\u544A)" style="flex:1;min-width:180px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text);font-family:var(--mono);font-size:0.85rem">
      <select id="regexField" style="padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text);font-size:0.85rem">
        <option value="name">name</option>
        <option value="api">api</option>
        <option value="key">key</option>
      </select>
      <button class="btn" onclick="addRegexRule()" style="padding:8px 16px">Add</button>
      <button class="btn secondary" onclick="testRegexRule()" style="padding:8px 16px">Test</button>
    </div>
    <div id="regexTestResult" style="font-size:0.85rem;margin-bottom:12px;color:var(--text-dim);display:none"></div>
    <div id="regexRulesList"></div>
    <div class="loading-msg" id="loadingRegex" style="display:none">No regex rules configured</div>
  </div>

  <div class="footer">
    <span data-i18n="footer">TVBox Config Editor &middot; Blacklisted items are excluded from aggregated output</span>
  </div>
</div>

<div class="batch-bar" id="batchBar" style="display:none">
  <span><span class="batch-count" id="batchCount">0</span> <span data-i18n="batchSelected">selected</span></span>
  <button class="btn sm danger" onclick="batchBlock()" data-i18n="batchBlock">Batch Block</button>
  <button class="btn sm secondary" onclick="clearSelection()" data-i18n="batchCancel">Cancel</button>
</div>

<script>
${sharedUi}

// --- i18n ---
const _translations = {
  en: {
    loginTitle:'Config Editor', loginSubtitle:'Enter admin token',
    invalidToken:'Invalid token', tokenPh:'Admin Token', login:'Login',
    networkError:'Network error',
    headerLabel:'Config Editor', navAdmin:'Admin', navConfigEditor:'Config Editor', navDashboard:'Dashboard',
    searchPh:'Search name, API, URL...', loading:'Loading...',
    available:'Available:', blocked:'Blocked:',
    sites:'sites', parses:'parses', lives:'lives',
    restore:'Restore', block:'Block',
    groupOther:'Other', groupRemotePrefix:'Remote: ', groupRemote:'Remote',
    siteType0:'XML site: fetches video data via XML API',
    siteType1:'JSON site (MacCMS): fetches video data via JSON API',
    siteType3:'JAR plugin: fetches data via Java spider plugin, requires spider package',
    siteType4:'Remote site: uses remotely configured site',
    parseType0:'Sniffer parse: extracts video URL by sniffing web pages',
    parseType1:'JSON parse: returns video URL in JSON format directly',
    parseType2:'JSON extended parse: JSON parse with extra parameters',
    parseType3:'Aggregated parse: combines results from multiple parsers',
    parseType4:'Super parse: advanced composite parse mode',
    liveType0:'Live source: M3U/TXT format channel list file',
    liveType3:'Live plugin: fetches channels via JAR/Python plugin',
    selectAll:'Select all',
    batchBlock:'Batch Block', batchSelected:'selected', batchCancel:'Cancel',
    typePrefix:'Type ',
    regexTab:'Regex Rules',
    regexDelete:'Delete', regexNoRules:'No regex rules. Add a pattern above to auto-block matching sites.',
    regexMatches:' sites would be blocked: ', regexNoMatch:'No matches found', regexError:'Error: ',
    regexTesting:'Testing...',
    footer:'TVBox Config Editor &middot; Blacklisted items are excluded from aggregated output',
  },
  zh: {
    loginTitle:'\u914D\u7F6E\u7F16\u8F91\u5668', loginSubtitle:'\u8BF7\u8F93\u5165\u7BA1\u7406\u4EE4\u724C',
    invalidToken:'\u65E0\u6548\u7684\u4EE4\u724C', tokenPh:'\u7BA1\u7406\u4EE4\u724C', login:'\u767B\u5F55',
    networkError:'\u7F51\u7EDC\u9519\u8BEF',
    headerLabel:'\u914D\u7F6E\u7F16\u8F91\u5668', navAdmin:'\u7BA1\u7406', navDashboard:'\u4EEA\u8868\u76D8',
    searchPh:'\u641C\u7D22\u540D\u79F0\u3001API\u3001URL...', loading:'\u52A0\u8F7D\u4E2D...',
    available:'\u53EF\u7528:', blocked:'\u5DF2\u5C4F\u853D:',
    sites:'\u7AD9\u70B9', parses:'\u89E3\u6790', lives:'\u76F4\u64AD',
    restore:'\u6062\u590D', block:'\u5C4F\u853D',
    groupOther:'\u5176\u4ED6', groupRemotePrefix:'\u8FDC\u7A0B: ', groupRemote:'\u8FDC\u7A0B\u6E90',
    siteType0:'XML \u7AD9\u70B9\uFF1A\u901A\u8FC7 XML \u63A5\u53E3\u83B7\u53D6\u5F71\u89C6\u6570\u636E',
    siteType1:'JSON \u7AD9\u70B9\uFF08MacCMS\uFF09\uFF1A\u901A\u8FC7 JSON API \u83B7\u53D6\u5F71\u89C6\u6570\u636E',
    siteType3:'JAR \u63D2\u4EF6\uFF1A\u901A\u8FC7 Java \u722C\u866B\u63D2\u4EF6\u83B7\u53D6\u6570\u636E\uFF0C\u9700\u8981 spider \u5305',
    siteType4:'\u8FDC\u7A0B\u7AD9\u70B9\uFF1A\u4F7F\u7528\u8FDC\u7A0B\u914D\u7F6E\u7684\u7AD9\u70B9',
    parseType0:'\u55C5\u63A2\u89E3\u6790\uFF1A\u901A\u8FC7\u7F51\u9875\u55C5\u63A2\u63D0\u53D6\u89C6\u9891\u5730\u5740',
    parseType1:'JSON \u89E3\u6790\uFF1A\u76F4\u63A5\u8FD4\u56DE JSON \u683C\u5F0F\u7684\u89C6\u9891\u5730\u5740',
    parseType2:'JSON \u6269\u5C55\u89E3\u6790\uFF1A\u5E26\u6269\u5C55\u53C2\u6570\u7684 JSON \u89E3\u6790',
    parseType3:'\u805A\u5408\u89E3\u6790\uFF1A\u5408\u5E76\u591A\u4E2A\u89E3\u6790\u63A5\u53E3\u7684\u7ED3\u679C',
    parseType4:'\u8D85\u7EA7\u89E3\u6790\uFF1A\u9AD8\u7EA7\u590D\u5408\u89E3\u6790\u6A21\u5F0F',
    liveType0:'\u76F4\u64AD\u6E90\uFF1AM3U/TXT \u683C\u5F0F\u7684\u9891\u9053\u5217\u8868\u6587\u4EF6',
    liveType3:'\u76F4\u64AD\u63D2\u4EF6\uFF1A\u901A\u8FC7 JAR/Python \u63D2\u4EF6\u83B7\u53D6\u9891\u9053',
    selectAll:'\u5168\u9009',
    batchBlock:'\u6279\u91CF\u5C4F\u853D', batchSelected:'\u5DF2\u9009', batchCancel:'\u53D6\u6D88',
    typePrefix:'\u7C7B\u578B ',
    regexTab:'\u6B63\u5219\u89C4\u5219',
    regexDelete:'\u5220\u9664', regexNoRules:'\u6682\u65E0\u6B63\u5219\u89C4\u5219\uFF0C\u5728\u4E0A\u65B9\u6DFB\u52A0\u89C4\u5219\u53EF\u6279\u91CF\u81EA\u52A8\u5C4F\u853D\u5339\u914D\u7684\u7AD9\u70B9',
    regexMatches:'\u4E2A\u7AD9\u70B9\u5C06\u88AB\u5C4F\u853D\uFF1A', regexNoMatch:'\u672A\u5339\u914D\u5230\u4EFB\u4F55\u7AD9\u70B9', regexError:'\u9519\u8BEF\uFF1A',
    regexTesting:'\u6D4B\u8BD5\u4E2D...',
    footer:'TVBox \u914D\u7F6E\u7F16\u8F91\u5668 &middot; \u88AB\u5C4F\u853D\u7684\u9879\u76EE\u4E0D\u4F1A\u51FA\u73B0\u5728\u805A\u5408\u8F93\u51FA\u4E2D',
  }
};

function _t(key) { const l = getLang(); return _translations[l]?.[key] || _translations.en[key] || key; }

function doToggleLang() {
  const next = getLang() === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', next);
  applyLang(_translations, next);
  if (DATA) render();
}

let TOKEN = '';
let DATA = null;
let CURRENT_TAB = 'sites';

const auth = initAuth('tokenInput', 'loginError', 'loginOverlay', 'mainContent', '/admin/config-data', function() {
  TOKEN = auth.getToken();
  loadData();
});

const SITE_TYPE_TIPS = {
  0: () => _t('siteType0'),
  1: () => _t('siteType1'),
  3: () => _t('siteType3'),
  4: () => _t('siteType4'),
};

const PARSE_TYPE_TIPS = {
  0: () => _t('parseType0'),
  1: () => _t('parseType1'),
  2: () => _t('parseType2'),
  3: () => _t('parseType3'),
  4: () => _t('parseType4'),
};

const LIVE_TYPE_TIPS = {
  0: () => _t('liveType0'),
  3: () => _t('liveType3'),
};

function groupSites(sites) {
  const groups = new Map();
  for (const s of sites) {
    const api = s.api || '';
    let group = _t('groupOther');
    if (api.startsWith('csp_') || api.startsWith('py_') || api.startsWith('js_')) {
      group = api;
    } else if (api.startsWith('http')) {
      try { group = _t('groupRemotePrefix') + new URL(api).hostname; } catch { group = _t('groupRemote'); }
    }
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(s);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
}

async function loadData() {
  try {
    const res = await fetch('/admin/config-data', {
      headers: { 'Authorization': 'Bearer ' + TOKEN }
    });
    if (res.status === 401) {
      $('loginError').style.display = 'block';
      return;
    }
    DATA = await res.json();
    $('loginOverlay').style.display = 'none';
    $('mainContent').style.display = 'block';
    render();
  } catch (e) {
    $('loginError').textContent = _t('networkError');
    $('loginError').style.display = 'block';
  }
}

function switchTab(tab) {
  CURRENT_TAB = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel' + tab.charAt(0).toUpperCase() + tab.slice(1)));
  $('searchInput').value = '';
  doSearch();
  updateBatchBar();
}

function render() {
  if (!DATA) return;
  $('badgeSites').textContent = DATA.sites.length;
  $('badgeParses').textContent = DATA.parses.length;
  $('badgeLives').textContent = DATA.lives.length;
  renderSites();
  renderParses();
  renderLives();
  updateStats();
  updateBatchBar();
}

function updateStats() {
  if (!DATA) return;
  const bs = DATA.sites.filter(s => s.blocked).length;
  const bp = DATA.parses.filter(p => p.blocked).length;
  const bl = DATA.lives.filter(l => l.blocked).length;
  $('statsBar').innerHTML =
    '<div class="stat">' + _t('available') + ' <span class="num">' + (DATA.sites.length - bs) + '</span> ' + _t('sites') + ', '
    + '<span class="num">' + (DATA.parses.length - bp) + '</span> ' + _t('parses') + ', '
    + '<span class="num">' + (DATA.lives.length - bl) + '</span> ' + _t('lives') + '</div>'
    + (bs + bp + bl > 0 ? '<div class="stat">' + _t('blocked') + ' <span class="blocked-num">' + (bs + bp + bl) + '</span></div>' : '');
}

function typeSpan(type, tips) {
  const t = type ?? 0;
  const tipFn = tips[t];
  const tip = tipFn ? tipFn() : _t('typePrefix') + t;
  return '<span class="item-type t' + t + '">T' + t + '<span class="tooltip">' + tip + '</span></span>';
}

function renderSites() {
  const container = $('panelSites');
  const groups = groupSites(DATA.sites);
  let html = '';
  for (const [groupName, sites] of groups) {
    const hasUnblocked = sites.some(s => !s.blocked);
    html += '<div class="group" data-group="' + groupName + '">'
      + '<div class="group-header" onclick="toggleGroup(this)">'
      + (hasUnblocked ? '<input type="checkbox" class="group-check" onclick="event.stopPropagation();toggleGroupSelect(this)" title="' + _t('selectAll') + '">' : '')
      + '<div class="group-title">' + esc(groupName) + ' <span class="count">' + sites.length + '</span></div>'
      + '<span class="group-arrow">&#9654;</span>'
      + '</div>'
      + '<div class="group-body">';
    for (const s of sites) {
      html += siteRow(s);
    }
    html += '</div></div>';
  }
  container.innerHTML = html;
}

function siteRow(s) {
  const cls = s.blocked ? 'item blocked' : 'item';
  const check = s.blocked ? '' : '<input type="checkbox" class="item-check" onchange="updateBatchBar()">';
  const btn = s.blocked
    ? '<button class="btn sm secondary" onclick="unblock(\\'sites\\',\\'' + s.fingerprint + '\\')">' + _t('restore') + '</button>'
    : '<button class="btn sm danger" onclick="block(\\'sites\\',\\'' + s.fingerprint + '\\')">' + _t('block') + '</button>';
  return '<div class="' + cls + '" data-id="' + esc(s.fingerprint) + '" data-type="sites" data-search="' + esc((s.name||'') + ' ' + s.key + ' ' + s.api) + '">'
    + check
    + '<span class="item-name" title="' + esc(s.key) + '">' + esc(s.name || s.key) + '</span>'
    + typeSpan(s.type, SITE_TYPE_TIPS)
    + '<span class="item-api" title="' + esc(s.api) + '">' + esc(s.api) + '</span>'
    + '<span class="item-actions">' + btn + '</span>'
    + '</div>';
}

function renderParses() {
  const container = $('panelParses');
  let html = '<div class="flat-list">';
  for (const p of DATA.parses) {
    html += parseRow(p);
  }
  html += '</div>';
  container.innerHTML = html;
}

function parseRow(p) {
  const cls = p.blocked ? 'item blocked' : 'item';
  const id = p.url;
  const check = p.blocked ? '' : '<input type="checkbox" class="item-check" onchange="updateBatchBar()">';
  const btn = p.blocked
    ? '<button class="btn sm secondary" onclick="unblock(\\'parses\\',\\'' + esc(id) + '\\')">' + _t('restore') + '</button>'
    : '<button class="btn sm danger" onclick="block(\\'parses\\',\\'' + esc(id) + '\\')">' + _t('block') + '</button>';
  return '<div class="' + cls + '" data-id="' + esc(id) + '" data-type="parses" data-search="' + esc((p.name||'') + ' ' + p.url) + '">'
    + check
    + '<span class="item-name">' + esc(p.name) + '</span>'
    + typeSpan(p.type, PARSE_TYPE_TIPS)
    + '<span class="item-api" title="' + esc(p.url) + '">' + esc(p.url) + '</span>'
    + '<span class="item-actions">' + btn + '</span>'
    + '</div>';
}

function renderLives() {
  const container = $('panelLives');
  let html = '<div class="flat-list">';
  for (const l of DATA.lives) {
    html += liveRow(l);
  }
  html += '</div>';
  container.innerHTML = html;
}

function liveRow(l) {
  const url = l.url || l.api || '';
  const cls = l.blocked ? 'item blocked' : 'item';
  const check = (l.blocked || !url) ? '' : '<input type="checkbox" class="item-check" onchange="updateBatchBar()">';
  const btn = url
    ? (l.blocked
      ? '<button class="btn sm secondary" onclick="unblock(\\'lives\\',\\'' + esc(url) + '\\')">' + _t('restore') + '</button>'
      : '<button class="btn sm danger" onclick="block(\\'lives\\',\\'' + esc(url) + '\\')">' + _t('block') + '</button>')
    : '';
  return '<div class="' + cls + '" data-id="' + esc(url) + '" data-type="lives" data-search="' + esc((l.name||'') + ' ' + url) + '">'
    + check
    + '<span class="item-name">' + esc(l.name || '(unnamed)') + '</span>'
    + typeSpan(l.type, LIVE_TYPE_TIPS)
    + '<span class="item-api" title="' + esc(url) + '">' + esc(url) + '</span>'
    + '<span class="item-actions">' + btn + '</span>'
    + '</div>';
}

function toggleGroup(el) {
  el.parentElement.classList.toggle('open');
}

function doSearch() {
  const q = $('searchInput').value.toLowerCase().trim();
  const panel = document.querySelector('.tab-panel.active');
  if (!panel) return;
  panel.querySelectorAll('.item').forEach(item => {
    const text = (item.dataset.search || '').toLowerCase();
    item.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
  panel.querySelectorAll('.group').forEach(g => {
    const visible = g.querySelectorAll('.item:not([style*="display: none"])').length;
    g.style.display = visible > 0 ? '' : 'none';
  });
}

async function block(type, id) {
  try {
    const res = await fetch('/admin/blacklist', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id })
    });
    if (!res.ok) { alert('Failed: ' + (await res.json()).error); return; }
    if (type === 'sites') {
      const s = DATA.sites.find(s => s.fingerprint === id);
      if (s) s.blocked = true;
    } else if (type === 'parses') {
      const p = DATA.parses.find(p => p.url === id);
      if (p) p.blocked = true;
    } else if (type === 'lives') {
      const l = DATA.lives.find(l => (l.url || l.api || '') === id);
      if (l) l.blocked = true;
    }
    updateItemDom(type, id, true);
    updateStats();
    updateBatchBar();
  } catch (e) { alert('Network error'); }
}

async function unblock(type, id) {
  try {
    const res = await fetch('/admin/blacklist', {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id })
    });
    if (!res.ok) { alert('Failed: ' + (await res.json()).error); return; }
    if (type === 'sites') {
      const s = DATA.sites.find(s => s.fingerprint === id);
      if (s) s.blocked = false;
    } else if (type === 'parses') {
      const p = DATA.parses.find(p => p.url === id);
      if (p) p.blocked = false;
    } else if (type === 'lives') {
      const l = DATA.lives.find(l => (l.url || l.api || '') === id);
      if (l) l.blocked = false;
    }
    updateItemDom(type, id, false);
    updateStats();
  } catch (e) { alert('Network error'); }
}

function updateItemDom(type, id, blocked) {
  const panel = type === 'sites' ? 'panelSites' : type === 'parses' ? 'panelParses' : 'panelLives';
  const el = $(panel).querySelector('[data-id="' + CSS.escape(id) + '"]');
  if (!el) return;
  if (blocked) {
    el.classList.add('blocked');
    const cb = el.querySelector('.item-check');
    if (cb) cb.remove();
    el.querySelector('.item-actions').innerHTML = '<button class="btn sm secondary" onclick="unblock(\\'' + type + '\\',\\'' + esc(id) + '\\')">' + _t('restore') + '</button>';
  } else {
    el.classList.remove('blocked');
    if (!el.querySelector('.item-check')) {
      el.insertAdjacentHTML('afterbegin', '<input type="checkbox" class="item-check" onchange="updateBatchBar()">');
    }
    el.querySelector('.item-actions').innerHTML = '<button class="btn sm danger" onclick="block(\\'' + type + '\\',\\'' + esc(id) + '\\')">' + _t('block') + '</button>';
  }
}

function toggleGroupSelect(checkbox) {
  const group = checkbox.closest('.group');
  group.querySelectorAll('.item:not(.blocked) .item-check').forEach(cb => { cb.checked = checkbox.checked; });
  updateBatchBar();
}

function updateBatchBar() {
  const checked = document.querySelectorAll('.tab-panel.active .item-check:checked');
  const bar = $('batchBar');
  if (checked.length > 0) {
    $('batchCount').textContent = checked.length;
    bar.style.display = 'flex';
  } else {
    bar.style.display = 'none';
  }
}

function clearSelection() {
  document.querySelectorAll('.item-check:checked, .group-check:checked').forEach(cb => { cb.checked = false; });
  updateBatchBar();
}

async function batchBlock() {
  const checked = document.querySelectorAll('.tab-panel.active .item-check:checked');
  if (checked.length === 0) return;
  const byType = {};
  checked.forEach(cb => {
    const item = cb.closest('.item');
    const type = item.dataset.type;
    const id = item.dataset.id;
    if (!byType[type]) byType[type] = [];
    byType[type].push(id);
  });
  try {
    for (const type of Object.keys(byType)) {
      const ids = byType[type];
      const res = await fetch('/admin/blacklist/batch', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ids })
      });
      if (!res.ok) { alert('Failed: ' + (await res.json()).error); return; }
      ids.forEach(id => {
        if (type === 'sites') { const s = DATA.sites.find(s => s.fingerprint === id); if (s) s.blocked = true; }
        else if (type === 'parses') { const p = DATA.parses.find(p => p.url === id); if (p) p.blocked = true; }
        else if (type === 'lives') { const l = DATA.lives.find(l => (l.url || l.api || '') === id); if (l) l.blocked = true; }
        updateItemDom(type, id, true);
      });
    }
    updateStats();
    updateBatchBar();
    document.querySelectorAll('.group-check:checked').forEach(cb => { cb.checked = false; });
  } catch (e) { alert('Network error'); }
}

// \u2500\u2500\u2500 Regex Rules \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadRegexRules() {
  try {
    const r = await fetch('/admin/blacklist/regex', { headers: { 'Authorization': 'Bearer ' + TOKEN } });
    const d = await r.json();
    const el = document.getElementById('regexRulesList');
    const badge = document.getElementById('badgeRegex');
    if (!d.rules || d.rules.length === 0) {
      el.innerHTML = '<div style="color:var(--text-dim);padding:12px">' + _t('regexNoRules') + '</div>';
      badge.textContent = '0';
      return;
    }
    badge.textContent = String(d.rules.length);
    el.innerHTML = d.rules.map(function(rule) {
      var qid = rule.id.replace(/"/g, '&quot;');
      return '<div style="display:flex;gap:8px;align-items:center;padding:8px 12px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px;background:var(--surface)">' +
        '<code style="flex:1;font-size:0.85rem;color:var(--text)">' + esc(rule.pattern) + '</code>' +
        '<span style="font-size:0.75rem;padding:2px 6px;border-radius:4px;background:var(--surface-2);color:var(--text-dim)">' + rule.field + '</span>' +
        '<label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" ' + (rule.enabled?'checked':'') + ' onchange="toggleRegexRule(&quot;' + qid + '&quot;,this.checked)"></label>' +
        '<button class="btn sm secondary" onclick="deleteRegexRule(&quot;' + qid + '&quot;)" style="padding:4px 8px;font-size:0.75rem">' + _t('regexDelete') + '</button>' +
      '</div>';
    }).join('');
  } catch(e) { console.error('loadRegexRules', e); }
}
async function addRegexRule() {
  var pattern = document.getElementById('regexPattern').value.trim();
  var field = document.getElementById('regexField').value;
  if (!pattern) return;
  var r = await fetch('/admin/blacklist/regex', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN}, body: JSON.stringify({pattern:pattern, field:field, enabled:true}) });
  var d = await r.json();
  if (d.error) { alert(d.error); return; }
  document.getElementById('regexPattern').value = '';
  loadRegexRules();
}
async function deleteRegexRule(id) {
  await fetch('/admin/blacklist/regex/' + id, { method:'DELETE', headers:{'Authorization':'Bearer '+TOKEN} });
  loadRegexRules();
}
async function toggleRegexRule(id, enabled) {
  await fetch('/admin/blacklist/regex/' + id, { method:'PUT', headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN}, body: JSON.stringify({enabled:enabled}) });
  loadRegexRules();
}
async function testRegexRule() {
  var pattern = document.getElementById('regexPattern').value.trim();
  var field = document.getElementById('regexField').value;
  if (!pattern) return;
  var el = document.getElementById('regexTestResult');
  el.style.display = 'block';
  el.textContent = _t('regexTesting');
  var r = await fetch('/admin/blacklist/regex/test', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+TOKEN}, body: JSON.stringify({pattern:pattern, field:field}) });
  var d = await r.json();
  if (d.error) { el.textContent = _t('regexError') + d.error; el.style.color = 'var(--red)'; return; }
  el.style.color = 'var(--text-dim)';
  if (!d.matched || d.matched.length === 0) { el.textContent = _t('regexNoMatch'); return; }
  el.textContent = d.matched.length + _t('regexMatches') + d.matched.slice(0,8).map(function(m){return m.name}).join(', ') + (d.matched.length > 8 ? ' ...' : '');
}

// Load regex on tab switch
var _origSwitchTab = switchTab;
switchTab = function(tab) {
  _origSwitchTab(tab);
  if (tab === 'regex') loadRegexRules();
};

applyTheme(getTheme());
initThemeDropdown();
loadBgFromServer();
applyLang(_translations, getLang());
</script>
</body>
</html>`;

// src/core/blacklist.ts
var EMPTY_BLACKLIST = { sites: [], parses: [], lives: [], regexRules: [], regexBlockOverrides: [] };
async function siteFingerprint(site) {
  const ext = typeof site.ext === "string" ? site.ext : JSON.stringify(site.ext || "");
  const raw2 = `${site.api}|${ext}|${site.jar || ""}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw2));
  const arr = new Uint8Array(buf);
  return Array.from(arr.slice(0, 8)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function loadBlacklist(storage) {
  try {
    const raw2 = await storage.get(KV_BLACKLIST);
    if (!raw2) return EMPTY_BLACKLIST;
    const parsed = JSON.parse(raw2);
    if (!Array.isArray(parsed.sites) || !Array.isArray(parsed.parses) || !Array.isArray(parsed.lives)) {
      logger.warn("blacklist", "Invalid structure, skipping");
      return EMPTY_BLACKLIST;
    }
    return {
      sites: parsed.sites,
      parses: parsed.parses,
      lives: parsed.lives,
      regexRules: Array.isArray(parsed.regexRules) ? parsed.regexRules : [],
      regexBlockOverrides: Array.isArray(parsed.regexBlockOverrides) ? parsed.regexBlockOverrides : []
    };
  } catch (e) {
    logger.error("blacklist", `Failed to load, skipping filter: ${e instanceof Error ? e.message : String(e)}`);
    return EMPTY_BLACKLIST;
  }
}
async function saveBlacklist(storage, blacklist) {
  await storage.put(KV_BLACKLIST, JSON.stringify(blacklist));
}
var MAX_PATTERN_LENGTH = 200;
var NESTED_QUANTIFIER_RE = /\([^)]*[+*{][^)]*\)[+*{]/;
function validateRegexRule(pattern) {
  if (!pattern) return { ok: false, error: "Pattern is empty" };
  if (pattern.length > MAX_PATTERN_LENGTH) return { ok: false, error: "Pattern too long (max 200)" };
  if (NESTED_QUANTIFIER_RE.test(pattern)) return { ok: false, error: "Nested quantifier detected (ReDoS risk)" };
  try {
    new RegExp(pattern);
  } catch (e) {
    return { ok: false, error: `Invalid regex: ${e instanceof Error ? e.message : String(e)}` };
  }
  return { ok: true };
}
async function saveRegexRule(storage, blacklist, rule) {
  const updated = { ...blacklist, regexRules: [...blacklist.regexRules, rule] };
  await saveBlacklist(storage, updated);
  return updated;
}
async function deleteRegexRule(storage, blacklist, ruleId) {
  const updated = { ...blacklist, regexRules: blacklist.regexRules.filter((r) => r.id !== ruleId) };
  await saveBlacklist(storage, updated);
  return updated;
}
async function updateRegexRule(storage, blacklist, ruleId, patch) {
  const updated = {
    ...blacklist,
    regexRules: blacklist.regexRules.map((r) => r.id === ruleId ? { ...r, ...patch } : r)
  };
  await saveBlacklist(storage, updated);
  return updated;
}
async function applyBlacklist(config, blacklist) {
  const siteSet = new Set(blacklist.sites);
  const parseSet = new Set(blacklist.parses);
  const liveSet = new Set(blacklist.lives);
  let removedSites = 0;
  let removedParses = 0;
  let removedLives = 0;
  let removedByRegex = 0;
  let sites = config.sites || [];
  if (siteSet.size > 0) {
    const filtered = [];
    for (const site of sites) {
      const fp = await siteFingerprint(site);
      if (siteSet.has(fp)) {
        removedSites++;
      } else {
        filtered.push(site);
      }
    }
    sites = filtered;
  }
  const activeRules = blacklist.regexRules.filter((r) => r.enabled);
  if (activeRules.length > 0) {
    const overrideSet = new Set(blacklist.regexBlockOverrides);
    for (const rule of activeRules) {
      try {
        const re = new RegExp(rule.pattern, "i");
        sites = sites.filter((site) => {
          const value = String(site[rule.field] || "");
          if (re.test(value) && !overrideSet.has(site.name || "")) {
            removedByRegex++;
            return false;
          }
          return true;
        });
      } catch {
      }
    }
  }
  let parses = config.parses || [];
  if (parseSet.size > 0) {
    parses = parses.filter((p) => {
      if (parseSet.has(p.url)) {
        removedParses++;
        return false;
      }
      return true;
    });
  }
  let lives = config.lives || [];
  if (liveSet.size > 0) {
    lives = lives.filter((l) => {
      const url = l.url || l.api || "";
      if (url && liveSet.has(url)) {
        removedLives++;
        return false;
      }
      return true;
    });
  }
  return {
    config: { ...config, sites, parses, lives },
    removedSites,
    removedParses,
    removedLives,
    removedByRegex
  };
}
async function pruneBlacklist(blacklist, currentConfig) {
  const currentSiteFps = /* @__PURE__ */ new Set();
  for (const site of currentConfig.sites || []) {
    currentSiteFps.add(await siteFingerprint(site));
  }
  const currentParseUrls = new Set((currentConfig.parses || []).map((p) => p.url));
  const currentLiveUrls = new Set(
    (currentConfig.lives || []).map((l) => l.url || l.api || "").filter(Boolean)
  );
  const prunedSites = blacklist.sites.filter((fp) => currentSiteFps.has(fp));
  const prunedParses = blacklist.parses.filter((url) => currentParseUrls.has(url));
  const prunedLives = blacklist.lives.filter((url) => currentLiveUrls.has(url));
  const removed = blacklist.sites.length - prunedSites.length + (blacklist.parses.length - prunedParses.length) + (blacklist.lives.length - prunedLives.length);
  if (removed > 0) {
    logger.infoFields("blacklist", "pruned", { removed });
  }
  return { ...blacklist, sites: prunedSites, parses: prunedParses, lives: prunedLives };
}
function testRegexAgainstSites(sites, pattern, field) {
  const matched = [];
  try {
    const re = new RegExp(pattern, "i");
    for (const site of sites) {
      const value = String(site[field] || "");
      if (re.test(value)) {
        matched.push({ key: site.key, name: site.name || site.key, field, value });
      }
    }
  } catch {
  }
  return { matched };
}

// src/core/search-quota.ts
async function loadSearchQuota(storage) {
  const raw2 = await storage.get(KV_SEARCH_QUOTA);
  if (raw2) {
    try {
      return JSON.parse(raw2);
    } catch {
    }
  }
  return { maxSearchable: 0, pinnedKeys: [] };
}
async function saveSearchQuota(storage, config) {
  await storage.put(KV_SEARCH_QUOTA, JSON.stringify(config));
}
function applySearchQuota(sites, config, siteSourceMap) {
  const limit = config.maxSearchable;
  const totalSites = sites.length;
  let jsExcluded = 0;
  sites = sites.map((site) => {
    if (site.type === 3 && site.searchable === 1 && /^https?:\/\//.test(site.api)) {
      jsExcluded++;
      return { ...site, searchable: 0 };
    }
    return site;
  });
  const siteByKey = new Map(sites.map((s) => [s.key, s]));
  const pinned = [];
  for (const key of config.pinnedKeys) {
    const site = siteByKey.get(key);
    if (site) pinned.push(site);
  }
  const pinnedKeySet = new Set(pinned.map((s) => s.key));
  const rest = sites.filter((s) => !pinnedKeySet.has(s.key));
  sites = [...pinned, ...rest];
  let truncated = 0;
  if (limit > 0) {
    let count = 0;
    sites = sites.map((site) => {
      if (site.searchable !== 1) return site;
      count++;
      if (count > limit) {
        truncated++;
        return { ...site, searchable: 0 };
      }
      return site;
    });
  }
  sites = sites.map((site) => {
    if (site.searchable !== 1) return site;
    const sourceName = siteSourceMap.get(site.key);
    if (sourceName && site.name && !site.name.includes("\u300C")) {
      const label = sourceName.length > 6 ? sourceName.substring(0, 6) : sourceName;
      return { ...site, name: `${site.name} \u300C${label}\u300D` };
    }
    return site;
  });
  const searchable = sites.filter((s) => s.searchable === 1).length;
  const pinnedCount = pinned.filter((s) => s.searchable === 1).length;
  return {
    sites,
    quotaReport: { totalSites, jsExcluded, searchable, pinnedCount, truncated }
  };
}

// src/core/credential-store.ts
async function getOrCreateEncryptionKey(storage) {
  const raw2 = await storage.get(KV_CREDENTIAL_ENCRYPTION_KEY);
  if (raw2) {
    const keyData = Uint8Array.from(atob(raw2), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const exported = await crypto.subtle.exportKey("raw", key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  await storage.put(KV_CREDENTIAL_ENCRYPTION_KEY, b64);
  return crypto.subtle.importKey("raw", exported, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function encrypt(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}
async function decrypt(key, encrypted) {
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plainBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(plainBuffer);
}
async function loadCredentials(storage) {
  const map = /* @__PURE__ */ new Map();
  const raw2 = await storage.get(KV_CLOUD_CREDENTIALS);
  if (!raw2) return map;
  try {
    const key = await getOrCreateEncryptionKey(storage);
    const json = await decrypt(key, raw2);
    const arr = JSON.parse(json);
    for (const cred of arr) {
      map.set(cred.platform, cred);
    }
  } catch (err) {
    console.error("[credential-store] Failed to decrypt credentials:", err instanceof Error ? err.message : err);
  }
  return map;
}
async function saveCredential(storage, credential) {
  const existing = await loadCredentials(storage);
  existing.set(credential.platform, credential);
  const key = await getOrCreateEncryptionKey(storage);
  const json = JSON.stringify([...existing.values()]);
  const encrypted = await encrypt(key, json);
  await storage.put(KV_CLOUD_CREDENTIALS, encrypted);
}
async function deleteCredential(storage, platform) {
  const existing = await loadCredentials(storage);
  if (!existing.has(platform)) return;
  existing.delete(platform);
  const key = await getOrCreateEncryptionKey(storage);
  if (existing.size === 0) {
    await storage.put(KV_CLOUD_CREDENTIALS, "");
    return;
  }
  const json = JSON.stringify([...existing.values()]);
  const encrypted = await encrypt(key, json);
  await storage.put(KV_CLOUD_CREDENTIALS, encrypted);
}
var DEFAULT_POLICY = {
  allowedHighRiskKeys: [],
  deniedKeys: []
};
async function loadCredentialPolicy(storage) {
  const raw2 = await storage.get(KV_CREDENTIAL_POLICY);
  if (!raw2) return { ...DEFAULT_POLICY };
  try {
    return JSON.parse(raw2);
  } catch {
    return { ...DEFAULT_POLICY };
  }
}
async function saveCredentialPolicy(storage, policy) {
  await storage.put(KV_CREDENTIAL_POLICY, JSON.stringify(policy));
}

// src/core/cloud-login.ts
var BILI_APPKEY = "4409e2ce8ffd12b8";
var BILI_APPSEC = "59b43e04ad6965f34319062b478f83dd";
async function biliSign(params) {
  const sorted = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const raw2 = sorted + BILI_APPSEC;
  const hash = await md5(raw2);
  return sorted + "&sign=" + hash;
}
async function md5(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("MD5", data).catch(() => null);
  if (hash) {
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return md5Pure(text);
}
function md5Pure(str) {
  const bytes = new TextEncoder().encode(str);
  let h0 = 1732584193, h1 = 4023233417, h2 = 2562383102, h3 = 271733878;
  const k = new Uint32Array(64);
  const s = [
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    7,
    12,
    17,
    22,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    5,
    9,
    14,
    20,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    4,
    11,
    16,
    23,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21,
    6,
    10,
    15,
    21
  ];
  for (let i = 0; i < 64; i++) k[i] = Math.floor(2 ** 32 * Math.abs(Math.sin(i + 1))) >>> 0;
  const bitLen = bytes.length * 8;
  const padded = new Uint8Array(((bytes.length + 8 >> 6) + 1) * 64);
  padded.set(bytes);
  padded[bytes.length] = 128;
  new DataView(padded.buffer).setUint32(padded.length - 8, bitLen, true);
  for (let offset = 0; offset < padded.length; offset += 64) {
    const w = new Uint32Array(16);
    for (let j = 0; j < 16; j++) w[j] = new DataView(padded.buffer).getUint32(offset + j * 4, true);
    let a = h0, b = h1, c = h2, d = h3;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) {
        f = b & c | ~b & d;
        g = i;
      } else if (i < 32) {
        f = d & b | ~d & c;
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = 7 * i % 16;
      }
      const temp = d;
      d = c;
      c = b;
      const x = a + f + k[i] + w[g] >>> 0;
      b = b + (x << s[i] | x >>> 32 - s[i]) >>> 0;
      a = temp;
    }
    h0 = h0 + a >>> 0;
    h1 = h1 + b >>> 0;
    h2 = h2 + c >>> 0;
    h3 = h3 + d >>> 0;
  }
  const hex = (n) => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, n, true);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };
  return hex(h0) + hex(h1) + hex(h2) + hex(h3);
}
var bilibiliHandler = {
  async generateQR() {
    const ts = Math.floor(Date.now() / 1e3).toString();
    const params = { appkey: BILI_APPKEY, local_id: "0", ts };
    const body = await biliSign(params);
    const resp = await fetch("https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await resp.json();
    if (data.code !== 0) throw new Error(data.message || "Bilibili QR generate failed");
    return {
      qrUrl: data.data.url,
      token: data.data.auth_code
    };
  },
  async pollStatus(token) {
    const ts = Math.floor(Date.now() / 1e3).toString();
    const params = { appkey: BILI_APPKEY, auth_code: token, local_id: "0", ts };
    const body = await biliSign(params);
    const resp = await fetch("https://passport.bilibili.com/x/passport-tv-login/qrcode/poll", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await resp.json();
    if (data.code === 0) {
      const cookies = data.data?.cookie_info?.cookies || [];
      const cookieParts = [];
      for (const c of cookies) {
        cookieParts.push(`${c.name}=${c.value}`);
      }
      return {
        status: "confirmed",
        credential: { cookie: cookieParts.join("; ") }
      };
    }
    if (data.code === 86090) return { status: "scanned" };
    if (data.code === 86038) return { status: "expired" };
    return { status: "waiting" };
  }
};
var aliyunHandler = {
  async generateQR() {
    const resp = await fetch("https://passport.aliyundrive.com/newlogin/qrcode/generate.do?appName=aliyun_drive&fromSite=52&appEntrance=web&_bx-v=2.5.6", {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    const content = data?.content?.data;
    if (!content?.codeContent) throw new Error("Aliyun QR generate failed");
    return {
      qrUrl: content.codeContent,
      token: JSON.stringify({ t: content.t, ck: content.ck || "" })
    };
  },
  async pollStatus(token) {
    const { t, ck } = JSON.parse(token);
    const body = new URLSearchParams({
      t: String(t),
      ck: ck || "",
      appName: "aliyun_drive",
      appEntrance: "web",
      fromSite: "52",
      "_bx-v": "2.5.6"
    });
    const resp = await fetch("https://passport.aliyundrive.com/newlogin/qrcode/query.do", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    const data = await resp.json();
    const content = data?.content?.data;
    if (!content) return { status: "error", message: "Invalid response" };
    const qrStatus = content.qrCodeStatus;
    if (qrStatus === "CONFIRMED") {
      try {
        const bizJson = JSON.parse(atob(content.bizExt));
        const loginResult = bizJson.pds_login_result;
        return {
          status: "confirmed",
          credential: {
            refresh_token: loginResult?.refreshToken || "",
            access_token: loginResult?.accessToken || ""
          }
        };
      } catch {
        return { status: "error", message: "Failed to parse login result" };
      }
    }
    if (qrStatus === "SCANED") return { status: "scanned" };
    if (qrStatus === "EXPIRED") return { status: "expired" };
    return { status: "waiting" };
  }
};
var quarkHandler = {
  async generateQR() {
    const requestId = crypto.randomUUID();
    const resp = await fetch(`https://uop.quark.cn/cas/ajax/getTokenForQrcodeLogin?client_id=532&v=1.2&request_id=${requestId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    if (data.status !== 200 || !data.data?.members?.token) {
      throw new Error(data.message || "Quark QR generate failed");
    }
    const token = data.data.members.token;
    return {
      qrUrl: `https://su.quark.cn/4_eMHBJ?token=${token}&client_id=532&ssb=weblogin`,
      token
    };
  },
  async pollStatus(token) {
    const resp = await fetch(`https://uop.quark.cn/cas/ajax/getServiceTicketByQrcodeToken?client_id=532&token=${token}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    const status = data.data?.members?.status;
    if (status === "CONFIRMED") {
      const serviceTicket = data.data?.members?.service_ticket;
      if (!serviceTicket) return { status: "error", message: "No service ticket" };
      try {
        const loginResp = await fetch(`https://pan.quark.cn/account/info?st=${serviceTicket}&lw=scan`, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          redirect: "manual"
        });
        const setCookies = loginResp.headers.getSetCookie?.() || [];
        const cookieParts = [];
        for (const sc of setCookies) {
          const part = sc.split(";")[0];
          if (part) cookieParts.push(part);
        }
        if (cookieParts.length > 0) {
          return { status: "confirmed", credential: { cookie: cookieParts.join("; ") } };
        }
        return { status: "confirmed", credential: { cookie: `__st=${serviceTicket}` } };
      } catch (err) {
        return { status: "error", message: `Cookie exchange failed: ${err}` };
      }
    }
    if (status === "SCANED") return { status: "scanned" };
    if (status === "EXPIRED") return { status: "expired" };
    return { status: "waiting" };
  }
};
var ucHandler = {
  async generateQR() {
    const requestId = crypto.randomUUID();
    const resp = await fetch(`https://api.open.uc.cn/cas/ajax/getTokenForQrcodeLogin?client_id=381&v=1.2&request_id=${requestId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    if (data.status !== 200 || !data.data?.members?.token) {
      throw new Error(data.message || "UC QR generate failed");
    }
    const token = data.data.members.token;
    return {
      qrUrl: `https://su.quark.cn/4_eMHBJ?token=${token}&client_id=381&ssb=weblogin`,
      token
    };
  },
  async pollStatus(token) {
    const resp = await fetch(`https://api.open.uc.cn/cas/ajax/getServiceTicketByQrcodeToken?client_id=381&token=${token}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    const status = data.data?.members?.status;
    if (status === "CONFIRMED") {
      const serviceTicket = data.data?.members?.service_ticket;
      if (!serviceTicket) return { status: "error", message: "No service ticket" };
      try {
        const loginResp = await fetch(`https://drive.uc.cn/account/info?st=${serviceTicket}&lw=scan`, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          redirect: "manual"
        });
        const setCookies = loginResp.headers.getSetCookie?.() || [];
        const cookieParts = [];
        for (const sc of setCookies) {
          const part = sc.split(";")[0];
          if (part) cookieParts.push(part);
        }
        if (cookieParts.length > 0) {
          return { status: "confirmed", credential: { cookie: cookieParts.join("; ") } };
        }
        return { status: "confirmed", credential: { cookie: `__st=${serviceTicket}` } };
      } catch (err) {
        return { status: "error", message: `Cookie exchange failed: ${err}` };
      }
    }
    if (status === "SCANED") return { status: "scanned" };
    if (status === "EXPIRED") return { status: "expired" };
    return { status: "waiting" };
  }
};
var pan115Handler = {
  async generateQR() {
    const resp = await fetch("https://qrcodeapi.115.com/api/1.0/web/1.0/token/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    if (!data?.data?.uid) throw new Error("115 QR generate failed");
    return {
      qrUrl: `https://qrcodeapi.115.com/api/1.0/web/1.0/qrcode?uid=${data.data.uid}`,
      token: JSON.stringify({ uid: data.data.uid, time: data.data.time, sign: data.data.sign })
    };
  },
  async pollStatus(token) {
    const { uid, time, sign } = JSON.parse(token);
    const resp = await fetch(`https://qrcodeapi.115.com/get/status/?uid=${uid}&time=${time}&sign=${sign}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    if (data?.data?.status === 2) {
      try {
        const loginResp = await fetch("https://passportapi.115.com/app/1.0/web/1.0/login/qrcode/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          body: `account=${uid}&app=web`
        });
        const loginData = await loginResp.json();
        const cookie = loginData?.data?.cookie;
        if (cookie) {
          const parts = Object.entries(cookie).map(([k, v]) => `${k}=${v}`).join("; ");
          return { status: "confirmed", credential: { cookie: parts } };
        }
        return { status: "error", message: "No cookie in login response" };
      } catch (err) {
        return { status: "error", message: `Login failed: ${err}` };
      }
    }
    if (data?.data?.status === 1) return { status: "scanned" };
    if (data?.data?.status === -2) return { status: "expired" };
    return { status: "waiting" };
  }
};
var tianyiHandler = {
  async generateQR() {
    const resp = await fetch("https://open.e.189.cn/api/logbox/oauth2/getQrcImg.do", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://open.e.189.cn/"
      },
      body: "appId=8025431004"
    });
    const data = await resp.json();
    if (data?.result !== 0 || !data?.uuid) throw new Error(data?.msg || "Tianyi QR generate failed");
    return {
      qrUrl: `https://open.e.189.cn/api/logbox/oauth2/qrImg.do?uuid=${data.uuid}`,
      token: data.uuid
    };
  },
  async pollStatus(token) {
    const resp = await fetch("https://open.e.189.cn/api/logbox/oauth2/qrcodeLoginState.do", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://open.e.189.cn/"
      },
      body: `uuid=${token}&appId=8025431004`
    });
    const data = await resp.json();
    if (data?.result === 0 && data?.redirectUrl) {
      try {
        const redirectResp = await fetch(data.redirectUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          redirect: "manual"
        });
        const setCookies = redirectResp.headers.getSetCookie?.() || [];
        const cookieParts = [];
        for (const sc of setCookies) {
          const part = sc.split(";")[0];
          if (part) cookieParts.push(part);
        }
        if (cookieParts.length > 0) {
          return { status: "confirmed", credential: { cookie: cookieParts.join("; ") } };
        }
      } catch {
      }
      return { status: "confirmed", credential: { cookie: "" } };
    }
    if (data?.result === 0 && data?.status === 1) return { status: "scanned" };
    if (data?.result === -1 || data?.status === -1) return { status: "expired" };
    return { status: "waiting" };
  }
};
var baiduHandler = {
  async generateQR() {
    const resp = await fetch("https://passport.baidu.com/v2/api/getqrcode?lp=pc&qrloginfrom=pc&gid=" + generateGid(), {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    if (!data?.imgurl || !data?.sign) throw new Error("Baidu QR generate failed");
    return {
      qrUrl: `https://${data.imgurl}`,
      token: data.sign
    };
  },
  async pollStatus(token) {
    const resp = await fetch(`https://passport.baidu.com/channel/unicast?channel_id=${token}&tpl=netdisk&gid=${generateGid()}&apiver=v3`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const data = await resp.json();
    if (data?.errno === 0 && data?.channel_v) {
      try {
        const channelData = JSON.parse(data.channel_v);
        if (channelData.status === 0) {
          const loginResp = await fetch(`https://passport.baidu.com/v3/login/main/qrbdusslogin?bduss=${channelData.v}&loginVersion=v5`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            redirect: "manual"
          });
          const setCookies = loginResp.headers.getSetCookie?.() || [];
          const cookieParts = [];
          for (const sc of setCookies) {
            const part = sc.split(";")[0];
            if (part && (part.includes("BDUSS") || part.includes("STOKEN"))) {
              cookieParts.push(part);
            }
          }
          if (cookieParts.length > 0) {
            return { status: "confirmed", credential: { cookie: cookieParts.join("; ") } };
          }
          return { status: "confirmed", credential: { cookie: `BDUSS=${channelData.v}` } };
        }
        if (channelData.status === 1) return { status: "scanned" };
      } catch {
      }
    }
    if (data?.errno === 1) return { status: "waiting" };
    if (data?.errno === -1) return { status: "expired" };
    return { status: "waiting" };
  }
};
function generateGid() {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : r & 3 | 8).toString(16).toUpperCase();
  });
}
var pan123Handler = {
  async generateQR() {
    const resp = await fetch("https://www.123pan.com/api/user/sign_in/qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Platform": "web"
      },
      body: JSON.stringify({})
    });
    const data = await resp.json();
    if (data?.code !== 0 || !data?.data?.qrCode) throw new Error(data?.message || "123 QR generate failed");
    return {
      qrUrl: data.data.qrCode,
      token: data.data.requestId || data.data.request_id || ""
    };
  },
  async pollStatus(token) {
    const resp = await fetch(`https://www.123pan.com/api/user/sign_in/qr/result?requestId=${token}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Platform": "web"
      }
    });
    const data = await resp.json();
    if (data?.code === 0 && data?.data?.token) {
      return {
        status: "confirmed",
        credential: { token: data.data.token }
      };
    }
    if (data?.data?.status === 1) return { status: "scanned" };
    if (data?.code === 400 || data?.data?.expired) return { status: "expired" };
    return { status: "waiting" };
  }
};
var thunderHandler = {
  async passwordLogin(username, password) {
    if (!username || !password) {
      return { success: false, message: "\u8BF7\u8F93\u5165\u8D26\u53F7\u548C\u5BC6\u7801" };
    }
    return {
      success: true,
      credential: { username, password }
    };
  }
};
var pikpakHandler = {
  async passwordLogin(username, password) {
    if (!username || !password) {
      return { success: false, message: "\u8BF7\u8F93\u5165\u8D26\u53F7\u548C\u5BC6\u7801" };
    }
    try {
      const resp = await fetch("https://user.mypikpak.com/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "YNxT9w7GMdWvEOKa",
          username,
          password
        })
      });
      const data = await resp.json();
      if (data?.access_token) {
        return {
          success: true,
          credential: { username, password }
        };
      }
      return { success: false, message: data?.error_description || "\u767B\u5F55\u5931\u8D25" };
    } catch (err) {
      return {
        success: true,
        credential: { username, password }
      };
    }
  }
};
var HANDLERS = {
  bilibili: bilibiliHandler,
  aliyun: aliyunHandler,
  quark: quarkHandler,
  uc: ucHandler,
  pan115: pan115Handler,
  tianyi: tianyiHandler,
  baidu: baiduHandler,
  pan123: pan123Handler,
  thunder: thunderHandler,
  pikpak: pikpakHandler
};
var PASSWORD_PLATFORMS = ["thunder", "pikpak"];
var QR_PLATFORMS = ["bilibili", "aliyun", "quark", "uc", "pan115", "tianyi", "baidu", "pan123"];
var PLATFORM_NAMES = {
  aliyun: "\u963F\u91CC\u4E91\u76D8",
  bilibili: "Bilibili",
  quark: "\u5938\u514B\u7F51\u76D8",
  uc: "UC \u7F51\u76D8",
  pan115: "115 \u7F51\u76D8",
  tianyi: "\u5929\u7FFC\u4E91\u76D8",
  baidu: "\u767E\u5EA6\u7F51\u76D8",
  pan123: "123 \u7F51\u76D8",
  thunder: "\u8FC5\u96F7",
  pikpak: "PikPak"
};
async function generateQR(platform) {
  const handler = HANDLERS[platform];
  if (!handler?.generateQR) throw new Error(`Platform ${platform} does not support QR login`);
  return handler.generateQR();
}
async function pollQRStatus(platform, token) {
  const handler = HANDLERS[platform];
  if (!handler?.pollStatus) throw new Error(`Platform ${platform} does not support QR login`);
  return handler.pollStatus(token);
}
async function passwordLogin(platform, username, password) {
  const handler = HANDLERS[platform];
  if (!handler?.passwordLogin) throw new Error(`Platform ${platform} does not support password login`);
  return handler.passwordLogin(username, password);
}

// src/core/credential-risk.ts
var COOKIE_FIELD_NAMES = /* @__PURE__ */ new Set([
  "cookie",
  "cookies",
  "token",
  "refresh_token",
  "open_token",
  "quark_cookie",
  "uccookie",
  "tyitoken",
  "dutoken",
  "p123token",
  "tuctoken",
  "bili_cookie",
  "ali_token"
]);
var OFFICIAL_DOMAINS = /* @__PURE__ */ new Set([
  "www.alipan.com",
  "api.alipan.com",
  "open.alipan.com",
  "aliyundrive.com",
  "api.bilibili.com",
  "passport.bilibili.com",
  "drive.quark.cn",
  "uop.quark.cn",
  "drive-pc.quark.cn",
  "pc-api.uc.cn",
  "webapi.115.com",
  "proapi.115.com",
  "qrcodeapi.115.com",
  "cloud.189.cn",
  "api.cloud.189.cn",
  "pan.baidu.com",
  "openapi.baidu.com",
  "www.123pan.com",
  "open-api.123pan.com"
]);
var FIELD_TO_PLATFORM = {
  "cookie": "quark",
  // 默认 cookie 字段通常是夸克（最常见）
  "quark_cookie": "quark",
  "uccookie": "uc",
  "bili_cookie": "bilibili",
  "ali_token": "aliyun",
  "refresh_token": "aliyun",
  "open_token": "aliyun",
  "token": "aliyun",
  "tyitoken": "tianyi",
  "dutoken": "baidu",
  "p123token": "pan123",
  "tuctoken": "thunder"
};
var API_TO_PLATFORMS = {
  "csp_Bili": ["bilibili"],
  "csp_BiliR": ["bilibili"],
  "csp_Wobg": ["aliyun", "quark", "uc", "pan115", "thunder", "pikpak"],
  "csp_Wogg": ["aliyun", "quark", "uc", "pan115", "thunder", "pikpak"],
  "csp_Mogg": ["quark", "aliyun", "uc", "tianyi", "baidu", "pan123", "thunder"],
  "csp_Pan115": ["pan115"]
};
function assessSourceRisk(site) {
  const result = {
    siteKey: site.key,
    api: site.api,
    riskLevel: "safe",
    reason: "",
    neededPlatforms: [],
    thirdPartyDomains: []
  };
  const ext = site.ext;
  if (!ext) {
    result.reason = "A\u7C7B: \u65E0 ext \u5B57\u6BB5";
    return result;
  }
  const { hasCookieFields, cookieFieldNames, thirdPartyDomains, isTokenJsonExt, proxyMode } = analyzeExt(ext, site.api);
  result.thirdPartyDomains = thirdPartyDomains;
  const apiPlatforms = API_TO_PLATFORMS[site.api];
  if (apiPlatforms) {
    result.neededPlatforms = [...apiPlatforms];
  } else {
    const platforms = /* @__PURE__ */ new Set();
    for (const field of cookieFieldNames) {
      const p = FIELD_TO_PLATFORM[field];
      if (p) platforms.add(p);
    }
    result.neededPlatforms = [...platforms];
  }
  if (!hasCookieFields && !isTokenJsonExt) {
    result.reason = "A\u7C7B: ext \u65E0 cookie \u76F8\u5173\u5B57\u6BB5";
    return result;
  }
  if (isTokenJsonExt) {
    if (proxyMode === "noproxy" || proxyMode === "db") {
      result.riskLevel = "low";
      result.reason = `D\u7C7B: token.json + ${proxyMode}\uFF08\u4E0D\u8D70\u4EE3\u7406\uFF09`;
    } else if (proxyMode === "proxy") {
      result.riskLevel = "high";
      result.reason = `D\u7C7B: token.json + proxy\uFF08\u6D41\u91CF\u7ECF\u7B2C\u4E09\u65B9 ${thirdPartyDomains.join(", ")}\uFF09`;
    } else {
      result.riskLevel = "unaudited";
      result.reason = `D\u7C7B: token.json + proxy=${proxyMode || "null"}\uFF08\u672A\u5BA1\u8BA1\uFF09`;
    }
    return result;
  }
  if (hasCookieFields && thirdPartyDomains.length === 0) {
    result.riskLevel = "safe";
    result.reason = "B\u7C7B: \u6709 cookie \u5B57\u6BB5\uFF0C\u76F4\u8FDE\u5B98\u65B9";
    return result;
  }
  if (hasCookieFields && thirdPartyDomains.length > 0) {
    result.riskLevel = "low";
    result.reason = `C\u7C7B: \u6709 cookie + site URL\uFF08${thirdPartyDomains.join(", ")}\uFF09`;
    return result;
  }
  return result;
}
function assessAllSources(sites) {
  return sites.map(assessSourceRisk);
}
function analyzeExt(ext, api) {
  const result = {
    hasCookieFields: false,
    cookieFieldNames: [],
    thirdPartyDomains: [],
    isTokenJsonExt: false,
    proxyMode: null
  };
  if (typeof ext === "string") {
    return analyzeStringExt(ext, api);
  }
  for (const key of Object.keys(ext)) {
    if (COOKIE_FIELD_NAMES.has(key.toLowerCase())) {
      result.hasCookieFields = true;
      result.cookieFieldNames.push(key);
    }
  }
  for (const value of Object.values(ext)) {
    if (typeof value === "string") {
      const domains = extractDomains(value);
      for (const d of domains) {
        if (!OFFICIAL_DOMAINS.has(d)) {
          result.thirdPartyDomains.push(d);
        }
      }
    }
  }
  return result;
}
function analyzeStringExt(ext, api) {
  const result = {
    hasCookieFields: false,
    cookieFieldNames: [],
    thirdPartyDomains: [],
    isTokenJsonExt: false,
    proxyMode: null
  };
  if (ext.includes("token.json") || ext.includes("token_json")) {
    result.isTokenJsonExt = true;
    const segments = ext.split("$$$");
    if (segments.length >= 3) {
      result.proxyMode = segments[2]?.trim() || null;
    }
    if (segments.length >= 2) {
      const siteUrl = segments[1]?.trim();
      if (siteUrl) {
        const domains2 = extractDomains(siteUrl);
        result.thirdPartyDomains = domains2;
      }
    }
    result.hasCookieFields = true;
    return result;
  }
  try {
    const obj = JSON.parse(ext);
    if (typeof obj === "object" && obj !== null) {
      return analyzeExt(obj, api);
    }
  } catch {
  }
  const lower = ext.toLowerCase();
  for (const field of COOKIE_FIELD_NAMES) {
    if (lower.includes(field)) {
      result.hasCookieFields = true;
      result.cookieFieldNames.push(field);
    }
  }
  const domains = extractDomains(ext);
  for (const d of domains) {
    if (!OFFICIAL_DOMAINS.has(d)) {
      result.thirdPartyDomains.push(d);
    }
  }
  return result;
}
function extractDomains(text) {
  const urlRegex = /https?:\/\/([^/\s$]+)/g;
  const domains = [];
  let match2;
  while ((match2 = urlRegex.exec(text)) !== null) {
    const host = match2[1].split(":")[0];
    if (host && !host.includes("localhost") && !host.startsWith("127.") && !host.startsWith("192.168.")) {
      domains.push(host);
    }
  }
  return [...new Set(domains)];
}

// src/core/credential-injector.ts
function parseExt(ext) {
  if (typeof ext !== "string") {
    return { obj: ext || {}, wasString: false, wasJson: false };
  }
  try {
    const parsed = JSON.parse(ext);
    if (typeof parsed === "object" && parsed !== null) {
      return { obj: parsed, wasString: true, wasJson: true };
    }
  } catch {
  }
  return { obj: {}, wasString: true, wasJson: false };
}
function restoreExt(obj, wasString, wasJson) {
  if (!wasString) return obj;
  if (wasJson) return JSON.stringify(obj);
  return obj;
}
function getCredValue(creds, platform, field) {
  return creds.get(platform)?.credential[field] || "";
}
var BUILTIN_RULES = [
  // csp_Bili / csp_BiliR: ext.cookie = bilibili cookie
  {
    apiPattern: /^csp_Bili/,
    platforms: ["bilibili"],
    inject: (ext, creds) => {
      const { obj, wasString, wasJson } = parseExt(ext);
      obj.cookie = getCredValue(creds, "bilibili", "cookie");
      return restoreExt(obj, wasString, wasJson);
    }
  },
  // csp_Wobg / csp_Wogg (token.json 派): 替换 token.json URL
  {
    apiPattern: /^csp_Wo[bg]g$/,
    platforms: ["aliyun", "quark", "uc", "pan115", "thunder", "pikpak"],
    inject: (ext, creds, baseUrl) => {
      if (typeof ext !== "string") return ext;
      if (!baseUrl) return ext;
      return ext.replace(/https?:\/\/[^$\s]+token[_.]?json[^$\s]*/i, `${baseUrl}/credential/token.json`);
    }
  },
  // csp_Mogg: 多字段注入
  {
    apiPattern: "csp_Mogg",
    platforms: ["quark", "aliyun", "uc", "tianyi", "baidu", "pan123", "thunder"],
    inject: (ext, creds) => {
      const { obj, wasString, wasJson } = parseExt(ext);
      if ("cookie" in obj) obj.cookie = getCredValue(creds, "quark", "cookie");
      if ("token" in obj) obj.token = getCredValue(creds, "aliyun", "refresh_token");
      if ("uccookie" in obj) obj.uccookie = getCredValue(creds, "uc", "cookie");
      if ("tyitoken" in obj) obj.tyitoken = getCredValue(creds, "tianyi", "cookie");
      if ("dutoken" in obj) obj.dutoken = getCredValue(creds, "baidu", "cookie");
      if ("p123token" in obj) obj.p123token = getCredValue(creds, "pan123", "token");
      if ("tuctoken" in obj) obj.tuctoken = getCredValue(creds, "thunder", "token");
      return restoreExt(obj, wasString, wasJson);
    }
  },
  // csp_Pan115: ext.cookie = 115 cookie
  {
    apiPattern: "csp_Pan115",
    platforms: ["pan115"],
    inject: (ext, creds) => {
      const { obj, wasString, wasJson } = parseExt(ext);
      obj.cookie = getCredValue(creds, "pan115", "cookie");
      return restoreExt(obj, wasString, wasJson);
    }
  }
];
function matchRule(api, rule) {
  if (typeof rule.apiPattern === "string") {
    return api === rule.apiPattern;
  }
  return rule.apiPattern.test(api);
}
function findMatchingRule(site) {
  for (const rule of BUILTIN_RULES) {
    if (matchRule(site.api, rule)) return rule;
  }
  return null;
}
function injectCredentials(sites, credentials, policy, baseUrl) {
  const report = {
    injected: 0,
    skippedSafe: 0,
    skippedDenied: 0,
    skippedHighRisk: 0,
    skippedUnaudited: 0,
    skippedNoRule: 0,
    skippedNoCredential: 0
  };
  const deniedSet = new Set(policy.deniedKeys);
  const allowedSet = new Set(policy.allowedHighRiskKeys);
  const result = sites.map((site) => {
    const risk = assessSourceRisk(site);
    if (risk.neededPlatforms.length === 0) {
      report.skippedSafe++;
      return site;
    }
    if (deniedSet.has(site.key)) {
      report.skippedDenied++;
      return site;
    }
    if (risk.riskLevel === "high" || risk.riskLevel === "unaudited") {
      if (!allowedSet.has(site.key)) {
        risk.riskLevel === "high" ? report.skippedHighRisk++ : report.skippedUnaudited++;
        return site;
      }
    }
    const rule = findMatchingRule(site);
    if (!rule) {
      report.skippedNoRule++;
      return site;
    }
    const hasAnyCredential = rule.platforms.some((p) => credentials.has(p));
    if (!hasAnyCredential) {
      report.skippedNoCredential++;
      return site;
    }
    const newExt = rule.inject(site.ext, credentials, baseUrl);
    report.injected++;
    return { ...site, ext: newExt };
  });
  return { sites: result, report };
}
function generateTokenJson(credentials, neededPlatforms) {
  const token = {};
  const platforms = neededPlatforms || [...credentials.keys()];
  for (const platform of platforms) {
    const cred = credentials.get(platform);
    if (!cred) continue;
    switch (platform) {
      case "aliyun":
        if (cred.credential.refresh_token) token.refresh_token = cred.credential.refresh_token;
        if (cred.credential.open_token) token.open_token = cred.credential.open_token;
        break;
      case "quark":
        if (cred.credential.cookie) token.quark_cookie = cred.credential.cookie;
        break;
      case "uc":
        if (cred.credential.cookie) token.uc_cookie = cred.credential.cookie;
        break;
      case "pan115":
        if (cred.credential.cookie) token["115_cookie"] = cred.credential.cookie;
        break;
      case "thunder":
        if (cred.credential.username) {
          token.thunder_username = cred.credential.username;
          token.thunder_password = cred.credential.password;
        }
        break;
      case "pikpak":
        if (cred.credential.username) {
          token.pikpak_username = cred.credential.username;
          token.pikpak_password = cred.credential.password;
        }
        break;
      case "bilibili":
        if (cred.credential.cookie) token.bili_cookie = cred.credential.cookie;
        break;
      case "tianyi":
        if (cred.credential.cookie) token.tianyi_cookie = cred.credential.cookie;
        break;
      case "baidu":
        if (cred.credential.cookie) token.baidu_cookie = cred.credential.cookie;
        break;
      case "pan123":
        if (cred.credential.token) token["123_token"] = cred.credential.token;
        break;
    }
  }
  return token;
}

// src/core/live-merger.ts
var TRAD_SIMP_MAP = {
  "\u96FB": "\u7535",
  "\u8996": "\u89C6",
  "\u81FA": "\u53F0",
  "\u983B": "\u9891",
  "\u9053": "\u9053",
  "\u7D9C": "\u7EFC",
  "\u85DD": "\u827A",
  "\u9AD4": "\u4F53",
  "\u80B2": "\u80B2",
  "\u5287": "\u5267",
  "\u7D93": "\u7ECF",
  "\u83EF": "\u534E",
  "\u6771": "\u4E1C",
  "\u897F": "\u897F",
  "\u570B": "\u56FD",
  "\u969B": "\u9645",
  "\u4E9E": "\u4E9A",
  "\u6B50": "\u6B27",
  "\u8CA1": "\u8D22",
  "\u9CF3": "\u51E4"
};
var SUFFIX_PATTERNS = [
  /\s*\[?hd\]?$/i,
  /\s*\[?uhd\]?$/i,
  /\s*\[?fhd\]?$/i,
  /\s*高清$/,
  /\s*超清$/,
  /\s*蓝光$/,
  /\s*藍光$/,
  /\s*4k$/i,
  /\s*1080p?$/i,
  /\s*720p?$/i
];
function normalizeChannelName(raw2) {
  let s = raw2.trim();
  let out = "";
  for (const ch of s) out += TRAD_SIMP_MAP[ch] || ch;
  s = out;
  for (const p of SUFFIX_PATTERNS) s = s.replace(p, "");
  s = s.replace(/\s+/g, "").trim();
  return s || raw2.trim();
}
function parseM3U(content, source, sourceSpeedMs) {
  const lines = content.split(/\r?\n/);
  const out = [];
  let currentName = "";
  let currentGroup = "\u5176\u4ED6";
  let currentLogo;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("#EXTINF")) {
      const grpM = line.match(/group-title="([^"]+)"/i);
      currentGroup = grpM ? grpM[1] : "\u5176\u4ED6";
      const logoM = line.match(/tvg-logo="([^"]+)"/i);
      currentLogo = logoM ? logoM[1] : void 0;
      const commaIdx = line.lastIndexOf(",");
      currentName = commaIdx > 0 ? line.slice(commaIdx + 1).trim() : "";
    } else if (line.startsWith("#")) {
      continue;
    } else if (currentName && /^https?:\/\//i.test(line)) {
      out.push({
        group: currentGroup,
        name: currentName,
        logo: currentLogo,
        url: line,
        source,
        sourceSpeedMs
      });
      currentName = "";
      currentLogo = void 0;
    }
  }
  return out;
}
function parseTxt(content, source, sourceSpeedMs) {
  const lines = content.split(/\r?\n/);
  const out = [];
  let currentGroup = "\u5176\u4ED6";
  for (const raw2 of lines) {
    const line = raw2.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(",");
    if (idx <= 0) continue;
    const left = line.slice(0, idx).trim();
    const right = line.slice(idx + 1).trim();
    if (right === "#genre#") {
      currentGroup = left || "\u5176\u4ED6";
      continue;
    }
    const urls = right.split("#").filter((u) => /^https?:\/\//i.test(u.trim()));
    for (const u of urls) {
      out.push({
        group: currentGroup,
        name: left,
        url: u.trim(),
        source,
        sourceSpeedMs
      });
    }
  }
  return out;
}
function sanitizeTxtLabel(label, fallback) {
  const cleaned = label.replace(/[\r\n]+/g, " ").replace(/,/g, " ").replace(/\s+/g, " ").trim();
  return cleaned || fallback;
}
function formatLiveGroupsAsTxt(groups) {
  const lines = [];
  for (const group of groups) {
    const groupName = sanitizeTxtLabel(group.group || "", "\u5176\u4ED6");
    lines.push(`${groupName},#genre#`);
    for (const channel of group.channels || []) {
      const urls = (channel.urls || []).filter((url) => url.trim());
      if (urls.length === 0) continue;
      const channelName = sanitizeTxtLabel(channel.name || "", "\u672A\u547D\u540D");
      lines.push(`${channelName},${urls.join("#")}`);
    }
  }
  return lines.join("\n");
}
function parseLiveContent(content, source, sourceSpeedMs) {
  if (content.includes("#EXTM3U") || content.includes("#EXTINF")) {
    return parseM3U(content, source, sourceSpeedMs);
  }
  return parseTxt(content, source, sourceSpeedMs);
}
async function downloadLive(input, timeoutMs) {
  const uas = [input.ua || TVBOX_UA, BROWSER_UA];
  for (const ua of uas) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(input.url, {
        signal: controller.signal,
        headers: { "User-Agent": ua, ...input.header || {} }
      });
      clearTimeout(timer);
      if (resp.ok) {
        const text = await resp.text();
        if (text && text.length > 20) return text;
      }
    } catch {
      clearTimeout(timer);
    }
  }
  return null;
}
function scrubTypeLiteral(s) {
  return s.replace(/type/gi, "tp");
}
function scrubUrlType(url) {
  return url.replace(/type/gi, (m) => {
    const hex = m.charCodeAt(0).toString(16).toUpperCase();
    return "%" + hex + m.slice(1);
  });
}
async function mergeLivesToNative(sources, fetchTimeoutMs, channelSpeedMap) {
  if (sources.length === 0) {
    return { groups: [], totalChannels: 0, totalUrls: 0, sourcesDownloaded: 0, sourcesFailed: 0 };
  }
  console.log(`[live-merger] Downloading ${sources.length} live source files...`);
  const downloadResults = await Promise.allSettled(
    sources.map((s) => downloadLive(s, fetchTimeoutMs).then((content) => ({ input: s, content })))
  );
  let sourcesDownloaded = 0;
  let sourcesFailed = 0;
  const allEntries = [];
  for (const r of downloadResults) {
    if (r.status === "fulfilled" && r.value.content) {
      sourcesDownloaded++;
      try {
        const entries = parseLiveContent(r.value.content, r.value.input.name, r.value.input.speedMs);
        allEntries.push(...entries);
      } catch (err) {
        console.warn(`[live-merger] Parse failed for ${r.value.input.name}: ${err}`);
      }
    } else {
      sourcesFailed++;
    }
  }
  console.log(
    `[live-merger] Downloaded ${sourcesDownloaded}/${sources.length} sources, parsed ${allEntries.length} channel entries`
  );
  const channelMap = /* @__PURE__ */ new Map();
  for (const e of allEntries) {
    const normName = normalizeChannelName(e.name);
    if (!normName) continue;
    let agg = channelMap.get(normName);
    if (!agg) {
      agg = {
        group: e.group || "\u5176\u4ED6",
        rawName: e.name,
        logo: e.logo,
        urls: /* @__PURE__ */ new Map()
      };
      channelMap.set(normName, agg);
    }
    if (!agg.urls.has(e.url)) {
      agg.urls.set(e.url, e);
    }
    if (!agg.logo && e.logo) agg.logo = e.logo;
  }
  const groupMap = /* @__PURE__ */ new Map();
  let totalUrls = 0;
  for (const [, agg] of channelMap) {
    const urlList = Array.from(agg.urls.values());
    urlList.sort((a, b) => {
      const sa = channelSpeedMap?.[a.url];
      const sb = channelSpeedMap?.[b.url];
      const fa = sa && sa.kind !== "fail" ? sa.speedMs : void 0;
      const fb = sb && sb.kind !== "fail" ? sb.speedMs : void 0;
      if (fa != null && fb != null) return fa - fb;
      if (fa != null) return -1;
      if (fb != null) return 1;
      const failA = sa?.kind === "fail";
      const failB = sb?.kind === "fail";
      if (failA && !failB) return 1;
      if (!failA && failB) return -1;
      const ssA = a.sourceSpeedMs ?? Infinity;
      const ssB = b.sourceSpeedMs ?? Infinity;
      return ssA - ssB;
    });
    const urlStrs = urlList.map((e) => `${scrubUrlType(e.url)}$${scrubTypeLiteral(e.source)}`);
    totalUrls += urlStrs.length;
    const channel = {
      name: scrubTypeLiteral(agg.rawName),
      urls: urlStrs
    };
    const groupKey = scrubTypeLiteral(agg.group || "\u5176\u4ED6");
    let list = groupMap.get(groupKey);
    if (!list) {
      list = [];
      groupMap.set(groupKey, list);
    }
    list.push(channel);
  }
  const groups = [];
  for (const [group, channels] of groupMap) {
    groups.push({ group, channels });
  }
  let finalJson = JSON.stringify(groups);
  let cleanedGroups = groups;
  if (/"type"\s*:/i.test(finalJson)) {
    console.warn('[live-merger] WARNING: "type" field leaked into output, stripping...');
    finalJson = finalJson.replace(/,\s*"type"\s*:\s*("[^"]*"|[\d.]+|null|true|false)/gi, "").replace(/"type"\s*:\s*("[^"]*"|[\d.]+|null|true|false)\s*,?/gi, "");
    cleanedGroups = JSON.parse(finalJson);
  }
  if (/type/i.test(finalJson)) {
    console.warn('[live-merger] WARNING: "type" substring in value, encoding to %74ype...');
    finalJson = finalJson.replace(/type/gi, (m) => {
      const hex = m.charCodeAt(0).toString(16).toUpperCase();
      return "%" + hex + m.slice(1);
    });
    cleanedGroups = JSON.parse(finalJson);
    return {
      groups: cleanedGroups,
      totalChannels: channelMap.size,
      totalUrls,
      sourcesDownloaded,
      sourcesFailed
    };
  }
  if (cleanedGroups !== groups) {
    return {
      groups: cleanedGroups,
      totalChannels: channelMap.size,
      totalUrls,
      sourcesDownloaded,
      sourcesFailed
    };
  }
  console.log(
    `[live-merger] Merged ${channelMap.size} channels / ${totalUrls} URLs across ${groups.length} groups`
  );
  return {
    groups,
    totalChannels: channelMap.size,
    totalUrls,
    sourcesDownloaded,
    sourcesFailed
  };
}
function extractAllUrls(groups) {
  const set = /* @__PURE__ */ new Set();
  for (const g of groups) {
    for (const ch of g.channels) {
      for (const u of ch.urls) {
        const idx = u.lastIndexOf("$");
        const bare = idx > 0 ? u.slice(0, idx) : u;
        if (bare) set.add(bare);
      }
    }
  }
  return Array.from(set);
}

// src/core/channel-probe.ts
async function isProbeEnabled(storage) {
  const v = await storage.get(KV_CHANNEL_PROBE_ENABLED);
  return v === "true";
}
async function setProbeEnabled(storage, enabled) {
  await storage.put(KV_CHANNEL_PROBE_ENABLED, enabled ? "true" : "false");
}
async function loadStatus(storage) {
  const raw2 = await storage.get(KV_CHANNEL_PROBE_STATUS);
  if (raw2) {
    try {
      return JSON.parse(raw2);
    } catch {
    }
  }
  return {
    state: "idle",
    totalUrls: 0,
    probed: 0,
    success: 0,
    failed: 0,
    totalChannels: 0,
    coverage: 0
  };
}
async function saveStatus(storage, status) {
  await storage.put(KV_CHANNEL_PROBE_STATUS, JSON.stringify(status));
}
async function loadSpeedMap(storage) {
  const raw2 = await storage.get(KV_CHANNEL_SPEED_MAP);
  if (!raw2) return {};
  try {
    return JSON.parse(raw2);
  } catch {
    return {};
  }
}
async function saveSpeedMap(storage, map) {
  await storage.put(KV_CHANNEL_SPEED_MAP, JSON.stringify(map));
}
function pruneExpired(map) {
  const now = Date.now();
  const out = {};
  for (const [url, entry] of Object.entries(map)) {
    const ts = Date.parse(entry.probedAt);
    if (isFinite(ts) && now - ts < CHANNEL_SPEED_TTL_MS) {
      out[url] = entry;
    }
  }
  return out;
}
async function probeSingle(url) {
  const isM3U8 = /\.m3u8(\?|$)/i.test(url);
  const isTs = /\.(ts|flv|mp4)(\?|$)/i.test(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHANNEL_PROBE_TIMEOUT_MS);
  const start = Date.now();
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": TVBOX_UA }
    });
    const ttfb = Date.now() - start;
    if (!resp.ok) {
      clearTimeout(timer);
      return { url, speedMs: 0, kind: "fail" };
    }
    const reader = resp.body?.getReader();
    if (!reader) {
      clearTimeout(timer);
      return { url, speedMs: ttfb, kind: "tcp" };
    }
    try {
      const { value } = await reader.read();
      clearTimeout(timer);
      if (!value) {
        return { url, speedMs: ttfb, kind: "tcp" };
      }
      if (isM3U8) {
        const head = new TextDecoder().decode(value.slice(0, Math.min(1024, value.length)));
        if (head.includes("#EXTM3U")) {
          return { url, speedMs: ttfb, kind: "m3u8" };
        }
        return { url, speedMs: 0, kind: "fail" };
      }
      if (isTs) {
        const end = Math.min(4096, value.length);
        for (let i = 0; i < end; i += 188) {
          if (value[i] === 71) {
            return { url, speedMs: ttfb, kind: "ts" };
          }
        }
        return { url, speedMs: ttfb, kind: "tcp" };
      }
      return { url, speedMs: ttfb, kind: "tcp" };
    } finally {
      reader.cancel().catch(() => {
      });
    }
  } catch {
    clearTimeout(timer);
    return { url, speedMs: 0, kind: "fail" };
  }
}
async function runWithConcurrency(items, limit, fn, onProgress) {
  const results = new Array(items.length);
  let index = 0;
  let done = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      try {
        results[i] = await fn(items[i], i);
      } catch {
        results[i] = { url: String(items[i]), speedMs: 0, kind: "fail" };
      }
      done++;
      if (onProgress && done % 50 === 0) onProgress(done, items.length);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  if (onProgress) onProgress(done, items.length);
  return results;
}
var running = false;
async function runChannelProbe(storage) {
  if (running) {
    console.log("[channel-probe] Already running, skipping");
    return loadStatus(storage);
  }
  if (!await isProbeEnabled(storage)) {
    console.log("[channel-probe] Disabled by user, skipping");
    return loadStatus(storage);
  }
  const treeRaw = await storage.get(KV_CHANNEL_MERGED_TREE);
  if (!treeRaw) {
    console.log("[channel-probe] No merged tree available, skipping (run main aggregation first)");
    const status2 = {
      state: "error",
      totalUrls: 0,
      probed: 0,
      success: 0,
      failed: 0,
      totalChannels: 0,
      coverage: 0,
      error: "No merged channel tree (run main aggregation first)"
    };
    await saveStatus(storage, status2);
    return status2;
  }
  let groups;
  try {
    groups = JSON.parse(treeRaw);
  } catch (err) {
    const status2 = {
      state: "error",
      totalUrls: 0,
      probed: 0,
      success: 0,
      failed: 0,
      totalChannels: 0,
      coverage: 0,
      error: `Parse merged tree failed: ${err}`
    };
    await saveStatus(storage, status2);
    return status2;
  }
  const urls = extractAllUrls(groups);
  const totalChannels = groups.reduce((n, g) => n + g.channels.length, 0);
  if (urls.length === 0) {
    const status2 = {
      state: "done",
      totalUrls: 0,
      probed: 0,
      success: 0,
      failed: 0,
      totalChannels,
      coverage: 0,
      finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      durationMs: 0
    };
    await saveStatus(storage, status2);
    return status2;
  }
  running = true;
  const startedAt = (/* @__PURE__ */ new Date()).toISOString();
  const startMs = Date.now();
  let success = 0;
  let failed = 0;
  const status = {
    state: "running",
    startedAt,
    totalUrls: urls.length,
    probed: 0,
    success: 0,
    failed: 0,
    totalChannels,
    coverage: 0
  };
  await saveStatus(storage, status);
  console.log(`[channel-probe] Started: ${urls.length} URLs, ${totalChannels} channels, concurrency=${CHANNEL_PROBE_CONCURRENCY}`);
  try {
    const oldMap = pruneExpired(await loadSpeedMap(storage));
    const fresh = { ...oldMap };
    const toProbe = urls.filter((u) => !fresh[u]);
    console.log(`[channel-probe] ${toProbe.length} new URLs to probe (${urls.length - toProbe.length} cached)`);
    const results = await runWithConcurrency(
      toProbe,
      CHANNEL_PROBE_CONCURRENCY,
      (url) => probeSingle(url),
      (done, total) => {
        status.probed = done + (urls.length - toProbe.length);
        saveStatus(storage, status).catch(() => {
        });
        if (done % 200 === 0) {
          console.log(`[channel-probe] Progress: ${done}/${total}`);
        }
      }
    );
    const now = (/* @__PURE__ */ new Date()).toISOString();
    for (const r of results) {
      fresh[r.url] = {
        speedMs: r.speedMs,
        probedAt: now,
        kind: r.kind
      };
      if (r.kind === "fail") failed++;
      else success++;
    }
    const cachedSuccess = urls.length - toProbe.length;
    success += cachedSuccess;
    await saveSpeedMap(storage, fresh);
    const durationMs = Date.now() - startMs;
    const coverage = urls.length > 0 ? Math.round(success / urls.length * 100) : 0;
    const finalStatus = {
      state: "done",
      startedAt,
      finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      durationMs,
      totalUrls: urls.length,
      probed: urls.length,
      success,
      failed,
      totalChannels,
      coverage
    };
    await saveStatus(storage, finalStatus);
    console.log(
      `[channel-probe] Done in ${(durationMs / 1e3).toFixed(1)}s: ${success} success, ${failed} failed, coverage=${coverage}%`
    );
    return finalStatus;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const errStatus = {
      state: "error",
      startedAt,
      finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      durationMs: Date.now() - startMs,
      totalUrls: urls.length,
      probed: status.probed,
      success,
      failed,
      totalChannels,
      coverage: 0,
      error: msg
    };
    await saveStatus(storage, errStatus);
    console.error(`[channel-probe] Error: ${msg}`);
    return errStatus;
  } finally {
    running = false;
  }
}
function isRunning() {
  return running;
}

// src/routes/channel-probe-admin.ts
function verifyAdmin(request, config) {
  const token = config.adminToken;
  if (!token) return false;
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${token}`;
}
function mountChannelProbeRoutes(app, deps) {
  const { storage, config } = deps;
  app.get("/admin/channel-probe/status", async (c) => {
    if (!verifyAdmin(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const [enabled, status] = await Promise.all([
      isProbeEnabled(storage),
      loadStatus(storage)
    ]);
    return c.json({
      enabled,
      running: isRunning(),
      status
    });
  });
  app.put("/admin/channel-probe/toggle", async (c) => {
    if (!verifyAdmin(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body.enabled !== "boolean") {
      return c.json({ error: "enabled must be a boolean" }, 400);
    }
    await setProbeEnabled(storage, body.enabled);
    return c.json({ success: true, enabled: body.enabled });
  });
  app.post("/admin/channel-probe/trigger", async (c) => {
    if (!verifyAdmin(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    if (isRunning()) {
      return c.json({ success: false, error: "Already running" }, 409);
    }
    if (!await isProbeEnabled(storage)) {
      return c.json({ success: false, error: "Probe is disabled, enable it first" }, 400);
    }
    runChannelProbe(storage).catch((err) => {
      console.error("[channel-probe-admin] Trigger error:", err);
    });
    return c.json({ success: true, message: "Probe started" });
  });
}

// src/routes.ts
function isNativeLiveGroups(lives) {
  if (!Array.isArray(lives)) return false;
  return lives.every((live) => {
    if (!live || typeof live !== "object") return false;
    const group = live.group;
    const channels = live.channels;
    if (typeof group !== "string" || !Array.isArray(channels)) return false;
    return channels.every((channel) => {
      if (!channel || typeof channel !== "object") return false;
      const name = channel.name;
      const urls = channel.urls;
      return typeof name === "string" && Array.isArray(urls) && urls.every((url) => typeof url === "string");
    });
  });
}
function createApp(deps) {
  const app = new Hono2();
  const { storage, config } = deps;
  if (!config.workerBaseUrl) {
    const FONTS = {
      "jetbrains-mono-latin-ext.woff2": "font/woff2",
      "jetbrains-mono-latin.woff2": "font/woff2",
      "outfit-latin-ext.woff2": "font/woff2",
      "outfit-latin.woff2": "font/woff2"
    };
    app.get("/fonts/:name", async (c) => {
      const name = c.req.param("name");
      const contentType = FONTS[name];
      if (!contentType) return c.text("Not Found", 404);
      try {
        const fs = await Promise.resolve().then(() => (init_node_fs(), node_fs_exports));
        const path = await Promise.resolve().then(() => (init_node_path(), node_path_exports));
        const data = await fs.promises.readFile(path.join(__dirname, "static/fonts", name));
        return c.body(data, 200, {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable"
        });
      } catch {
        return c.text("Not Found", 404);
      }
    });
  }
  async function resolveBaseUrl(c) {
    const smartEnabled = await storage.get(KV_SMART_BASE_URL_ENABLED) === "true";
    const dmzEnabled = process.env.DMZ === "0";
    const fallback = (config.localBaseUrl || "").replace(/\/$/, "");
    if (config.workerBaseUrl) {
      return config.workerBaseUrl.replace(/\/$/, "");
    } else if (smartEnabled) {
      const baseUrl = getRequestBaseUrl(c, fallback);
      if (!assertHostAllowed(baseUrl, fallback, dmzEnabled)) {
        logger.security("host-blocked", { host: baseUrl, fallback });
        return c.json({ error: "Non-LAN access denied. Set DMZ=0 to allow." }, 403);
      }
      return baseUrl;
    }
    return fallback;
  }
  app.get("/", async (c) => {
    let cached = await storage.get(KV_MERGED_CONFIG);
    if (!cached) {
      return c.json(
        { error: "No config available yet. Add sources in /admin and trigger a refresh." },
        503
      );
    }
    const baseUrl = await resolveBaseUrl(c);
    if (baseUrl instanceof Response) return baseUrl;
    cached = applyBaseUrlPlaceholder(cached, baseUrl);
    return c.body(cached, 200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
      "Access-Control-Allow-Origin": "*"
    });
  });
  app.get("/live-config", async (c) => {
    let cached = await storage.get(KV_MERGED_CONFIG);
    if (!cached) {
      return c.json({ error: "No config available yet." }, 503);
    }
    const baseUrl = await resolveBaseUrl(c);
    if (baseUrl instanceof Response) return baseUrl;
    cached = applyBaseUrlPlaceholder(cached, baseUrl);
    try {
      const full = JSON.parse(cached);
      const lives = full.lives || [];
      if (!isNativeLiveGroups(lives)) {
        const liveConfig = { lives };
        return c.body(JSON.stringify(liveConfig), 200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=1800",
          "Access-Control-Allow-Origin": "*"
        });
      }
      return c.body(formatLiveGroupsAsTxt(lives), 200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=1800",
        "Access-Control-Allow-Origin": "*"
      });
    } catch {
      return c.json({ error: "Config parse error" }, 500);
    }
  });
  app.get("/index.json", async (c) => {
    let cached = await storage.get(KV_MERGED_CONFIG);
    if (!cached) {
      return c.json({ error: "No config available yet." }, 503);
    }
    const baseUrl = await resolveBaseUrl(c);
    if (baseUrl instanceof Response) return baseUrl;
    cached = applyBaseUrlPlaceholder(cached, baseUrl);
    return c.body(cached, 200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": 'attachment; filename="tvbox-config.json"'
    });
  });
  app.get("/live.json", async (c) => {
    let cached = await storage.get(KV_MERGED_CONFIG);
    if (!cached) {
      return c.json({ error: "No config available yet." }, 503);
    }
    const baseUrl = await resolveBaseUrl(c);
    if (baseUrl instanceof Response) return baseUrl;
    cached = applyBaseUrlPlaceholder(cached, baseUrl);
    try {
      const full = JSON.parse(cached);
      const liveConfig = { lives: full.lives || [] };
      return c.body(JSON.stringify(liveConfig), 200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=1800",
        "Access-Control-Allow-Origin": "*",
        "Content-Disposition": 'attachment; filename="tvbox-live.json"'
      });
    } catch {
      return c.json({ error: "Config parse error" }, 500);
    }
  });
  app.get("/status", (c) => {
    return c.html(dashboardHtml);
  });
  app.get("/status-data", async (c) => {
    const lastUpdate = await storage.get(KV_LAST_UPDATE);
    const sources = await storage.get(KV_MANUAL_SOURCES);
    const macCMSSources = await storage.get(KV_MACCMS_SOURCES);
    const liveSources = await storage.get(KV_LIVE_SOURCES);
    const cached = await storage.get(KV_MERGED_CONFIG);
    let siteCount = 0;
    let parseCount = 0;
    let liveCount = 0;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        siteCount = parsed.sites?.length || 0;
        parseCount = parsed.parses?.length || 0;
        liveCount = parsed.lives?.length || 0;
      } catch {
      }
    }
    const warnings = [];
    if (config.dockerMissingBaseUrl) {
      warnings.push("docker_no_base_url");
    }
    return c.json({
      lastUpdate: lastUpdate || "never",
      sourceCount: sources ? JSON.parse(sources).length : 0,
      macCMSCount: macCMSSources ? JSON.parse(macCMSSources).length : 0,
      liveSourceCount: liveSources ? JSON.parse(liveSources).length : 0,
      sites: siteCount,
      parses: parseCount,
      lives: liveCount,
      warnings
    });
  });
  app.get("/source-status", async (c) => {
    const raw2 = await storage.get(KV_SOURCE_HEALTH);
    const records = raw2 ? JSON.parse(raw2) : [];
    return c.json(records);
  });
  app.get("/admin", (c) => {
    return c.html(adminHtml);
  });
  app.get("/admin/sources", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_MANUAL_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    return c.json(sources);
  });
  app.post("/admin/sources", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    let url = body.url?.trim() || "";
    if (!url) return c.json({ error: "URL is required" }, 400);
    let configKey = body.configKey?.trim() || "";
    const pkMatch = url.match(/;pk;(.+)$/);
    if (pkMatch) {
      configKey = configKey || pkMatch[1];
      url = url.replace(/;pk;.+$/, "");
    }
    try {
      new URL(url);
    } catch {
      return c.json({ error: "Invalid URL format" }, 400);
    }
    const name = body.name?.trim() || "";
    const raw2 = await storage.get(KV_MANUAL_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    if (sources.some((s) => s.url === url)) {
      return c.json({ error: "Source already exists" }, 409);
    }
    const entry = { name, url };
    if (configKey) entry.configKey = configKey;
    sources.push(entry);
    await storage.put(KV_MANUAL_SOURCES, JSON.stringify(sources));
    return c.json({ success: true });
  });
  app.delete("/admin/sources", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const url = body.url?.trim();
    if (!url) return c.json({ error: "URL is required" }, 400);
    const raw2 = await storage.get(KV_MANUAL_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    const filtered = sources.filter((s) => s.url !== url);
    await storage.put(KV_MANUAL_SOURCES, JSON.stringify(filtered));
    return c.json({ success: true });
  });
  app.post("/admin/sources/import", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const input = body.input?.trim();
    if (!input) return c.json({ error: "input is required" }, 400);
    const isUrl = /^https?:\/\//i.test(input);
    let jsonText;
    let sourceUrl = null;
    let configKey;
    let fetchUrl = input;
    if (isUrl) {
      const pkMatch = input.match(/;pk;(.+)$/);
      if (pkMatch) {
        configKey = pkMatch[1];
        fetchUrl = input.replace(/;pk;.+$/, "");
      }
      sourceUrl = fetchUrl;
      try {
        const resp = await fetch(fetchUrl, {
          headers: { "Accept": "application/json, text/plain, */*", "User-Agent": "okhttp/3.12.0" }
        });
        if (!resp.ok) return c.json({ error: `Fetch failed: HTTP ${resp.status}` }, 502);
        const buffer = await resp.arrayBuffer();
        const decoded = await decodeConfigResponse(buffer, configKey);
        jsonText = decoded || "";
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Fetch failed: ${msg}` }, 502);
      }
    } else {
      jsonText = input;
    }
    const parsed = parseConfigJson(jsonText);
    if (!parsed) return c.json({ error: "Failed to parse JSON" }, 400);
    const raw2 = await storage.get(KV_MANUAL_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    const existingUrls = new Set(sources.map((s) => s.url));
    let added = 0;
    let duplicates = 0;
    const addedSources = [];
    if (isMultiRepoConfig(parsed)) {
      const entries = extractMultiRepoEntries(parsed, "Imported");
      for (const entry of entries) {
        if (existingUrls.has(entry.url)) {
          duplicates++;
        } else {
          sources.push(entry);
          existingUrls.add(entry.url);
          addedSources.push(entry.url);
          added++;
        }
      }
      await storage.put(KV_MANUAL_SOURCES, JSON.stringify(sources));
      return c.json({ type: "multi", added, duplicates, sources: addedSources });
    } else {
      if (sourceUrl) {
        if (existingUrls.has(sourceUrl)) {
          return c.json({ type: "single", added: 0, duplicates: 1, sources: [] });
        }
        const entry = { name: "Imported", url: sourceUrl };
        if (configKey) entry.configKey = configKey;
        sources.push(entry);
        await storage.put(KV_MANUAL_SOURCES, JSON.stringify(sources));
        return c.json({ type: "single", added: 1, duplicates: 0, sources: [sourceUrl] });
      } else {
        const key = `${KV_INLINE_PREFIX}${Date.now()}`;
        await storage.put(key, jsonText);
        const inlineUrl = `inline://${key}`;
        sources.push({ name: "Inline Config", url: inlineUrl });
        await storage.put(KV_MANUAL_SOURCES, JSON.stringify(sources));
        return c.json({ type: "single", added: 1, duplicates: 0, sources: [inlineUrl] });
      }
    }
  });
  app.get("/admin/name-transform", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_NAME_TRANSFORM);
    const transform = raw2 ? JSON.parse(raw2) : {};
    return c.json(transform);
  });
  app.put("/admin/name-transform", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (body.extraCleanPatterns) {
      for (const p of body.extraCleanPatterns) {
        try {
          new RegExp(p);
        } catch {
          return c.json({ error: `Invalid regex: ${p}` }, 400);
        }
      }
    }
    const transform = {
      prefix: body.prefix || void 0,
      suffix: body.suffix || void 0,
      promoReplacement: body.promoReplacement || void 0,
      extraCleanPatterns: body.extraCleanPatterns?.length ? body.extraCleanPatterns : void 0
    };
    await storage.put(KV_NAME_TRANSFORM, JSON.stringify(transform));
    return c.json({ success: true });
  });
  app.get("/admin/cron-interval", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_CRON_INTERVAL);
    const interval = raw2 ? parseInt(raw2) : DEFAULT_CRON_INTERVAL;
    return c.json({ interval });
  });
  app.put("/admin/cron-interval", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const interval = body.interval;
    const validIntervals = [60, 180, 360, 720, 1440];
    if (!interval || !validIntervals.includes(interval)) {
      return c.json({ error: `interval must be one of: ${validIntervals.join(", ")}` }, 400);
    }
    await storage.put(KV_CRON_INTERVAL, String(interval));
    if (deps.onCronIntervalChange) {
      deps.onCronIntervalChange(interval);
    }
    return c.json({ success: true, interval });
  });
  app.get("/admin/speed-test", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_SPEED_TEST_ENABLED);
    return c.json({ enabled: raw2 !== "false" });
  });
  app.put("/admin/speed-test", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body.enabled !== "boolean") {
      return c.json({ error: "enabled must be a boolean" }, 400);
    }
    await storage.put(KV_SPEED_TEST_ENABLED, String(body.enabled));
    return c.json({ success: true, enabled: body.enabled });
  });
  app.get("/admin/edge-proxies", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const raw2 = await storage.get(KV_EDGE_PROXIES);
    return c.json(raw2 ? JSON.parse(raw2) : {});
  });
  app.put("/admin/edge-proxies", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const clean = {
      cf: body.cf?.replace(/\/+$/, "") || void 0,
      vercel: body.vercel?.replace(/\/+$/, "") || void 0
    };
    await storage.put(KV_EDGE_PROXIES, JSON.stringify(clean));
    return c.json({ success: true, ...clean });
  });
  if (config.workerBaseUrl) {
    app.get("/fetch-proxy", async (c) => {
      const auth = c.req.raw.headers.get("Authorization");
      const validTokens = [config.adminToken, config.refreshToken].filter(Boolean);
      if (validTokens.length > 0 && !validTokens.some((t) => auth === `Bearer ${t}`)) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const targetUrl = c.req.query("url");
      if (!targetUrl || !targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        return c.json({ error: "Missing or invalid ?url= parameter" }, 400);
      }
      try {
        const resp = await fetch(targetUrl, {
          headers: {
            "User-Agent": c.req.header("X-Proxy-UA") || "okhttp/3.12.0"
          },
          redirect: "follow"
        });
        return new Response(resp.body, {
          status: resp.status,
          headers: {
            "Content-Type": resp.headers.get("Content-Type") || "application/octet-stream",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return c.json({ error: msg }, 502);
      }
    });
  }
  app.get("/admin/search-quota", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const quota = await loadSearchQuota(storage);
    return c.json(quota);
  });
  app.put("/admin/search-quota", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const current = await loadSearchQuota(storage);
    if (typeof body.maxSearchable === "number") current.maxSearchable = body.maxSearchable;
    if (Array.isArray(body.pinnedKeys)) current.pinnedKeys = body.pinnedKeys;
    await saveSearchQuota(storage, current);
    return c.json({ success: true, ...current });
  });
  app.post("/admin/search-quota/pinned", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (!Array.isArray(body.keys)) return c.json({ error: "keys must be an array" }, 400);
    const current = await loadSearchQuota(storage);
    const set = new Set(current.pinnedKeys);
    for (const key of body.keys) set.add(key);
    current.pinnedKeys = [...set];
    await saveSearchQuota(storage, current);
    return c.json({ success: true, pinnedKeys: current.pinnedKeys });
  });
  app.put("/admin/search-quota/pinned", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (!Array.isArray(body.keys)) return c.json({ error: "keys must be an array" }, 400);
    const current = await loadSearchQuota(storage);
    current.pinnedKeys = body.keys;
    await saveSearchQuota(storage, current);
    return c.json({ success: true, pinnedKeys: current.pinnedKeys });
  });
  app.delete("/admin/search-quota/pinned", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (!Array.isArray(body.keys)) return c.json({ error: "keys must be an array" }, 400);
    const current = await loadSearchQuota(storage);
    const removeSet = new Set(body.keys);
    current.pinnedKeys = current.pinnedKeys.filter((k) => !removeSet.has(k));
    await saveSearchQuota(storage, current);
    return c.json({ success: true, pinnedKeys: current.pinnedKeys });
  });
  app.get("/admin/search-quota/report", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const raw2 = await storage.get(KV_SEARCH_QUOTA_REPORT);
    if (!raw2) return c.json({ error: "No report yet. Run aggregation first." }, 404);
    return c.json(JSON.parse(raw2));
  });
  app.get("/search-quota/summary", async (c) => {
    const raw2 = await storage.get(KV_SEARCH_QUOTA_REPORT);
    if (!raw2) return c.json({ enabled: false });
    return c.json({ enabled: true, ...JSON.parse(raw2) });
  });
  app.get("/admin/cloud-credentials", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const creds = await loadCredentials(storage);
    const result = {};
    for (const [platform, cred] of creds) {
      result[platform] = {
        platform: cred.platform,
        status: cred.status,
        obtainedAt: cred.obtainedAt,
        expiresAt: cred.expiresAt,
        hasCredential: Object.keys(cred.credential).length > 0
      };
    }
    return c.json({ platforms: PLATFORM_NAMES, credentials: result });
  });
  app.delete("/admin/cloud-credentials/:platform", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const platform = c.req.param("platform");
    if (!PLATFORM_NAMES[platform]) return c.json({ error: "Unknown platform" }, 400);
    await deleteCredential(storage, platform);
    return c.json({ success: true });
  });
  app.post("/admin/cloud-credentials/:platform", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const platform = c.req.param("platform");
    if (!PLATFORM_NAMES[platform]) return c.json({ error: "Unknown platform" }, 400);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (!body.credential || typeof body.credential !== "object") {
      return c.json({ error: "credential object is required" }, 400);
    }
    const cred = {
      platform,
      credential: body.credential,
      obtainedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "valid"
    };
    await saveCredential(storage, cred);
    return c.json({ success: true });
  });
  app.post("/admin/cloud-login/:platform/qr", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const platform = c.req.param("platform");
    if (!QR_PLATFORMS.includes(platform)) {
      return c.json({ error: `Platform ${platform} does not support QR login` }, 400);
    }
    try {
      const result = await generateQR(platform);
      return c.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return c.json({ error: msg }, 502);
    }
  });
  app.get("/admin/cloud-login/:platform/poll", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const platform = c.req.param("platform");
    const token = c.req.query("token");
    if (!token) return c.json({ error: "token is required" }, 400);
    try {
      const result = await pollQRStatus(platform, token);
      if (result.status === "confirmed" && result.credential) {
        const cred = {
          platform,
          credential: result.credential,
          obtainedAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "valid"
        };
        await saveCredential(storage, cred);
      }
      return c.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return c.json({ error: msg, status: "error" }, 502);
    }
  });
  app.post("/admin/cloud-login/:platform/password", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const platform = c.req.param("platform");
    if (!PASSWORD_PLATFORMS.includes(platform)) {
      return c.json({ error: `Platform ${platform} does not support password login` }, 400);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    try {
      const result = await passwordLogin(platform, body.username || "", body.password || "");
      if (result.success && result.credential) {
        const cred = {
          platform,
          credential: result.credential,
          obtainedAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "valid"
        };
        await saveCredential(storage, cred);
      }
      return c.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return c.json({ success: false, message: msg }, 502);
    }
  });
  app.get("/admin/credential-policy", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    return c.json(await loadCredentialPolicy(storage));
  });
  app.put("/admin/credential-policy", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const policy = await loadCredentialPolicy(storage);
    if (Array.isArray(body.allowedHighRiskKeys)) policy.allowedHighRiskKeys = body.allowedHighRiskKeys;
    if (Array.isArray(body.deniedKeys)) policy.deniedKeys = body.deniedKeys;
    await saveCredentialPolicy(storage, policy);
    return c.json({ success: true, ...policy });
  });
  app.get("/admin/credential-risk-report", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const configRaw = await storage.get(KV_MERGED_CONFIG_FULL);
    if (!configRaw) return c.json({ error: "No config available. Run aggregation first." }, 404);
    const parsed = JSON.parse(configRaw);
    const sites = parsed.sites || [];
    const assessments = assessAllSources(sites);
    const policy = await loadCredentialPolicy(storage);
    const summary = { safe: 0, low: 0, high: 0, unaudited: 0 };
    for (const a of assessments) {
      summary[a.riskLevel]++;
    }
    return c.json({ summary, assessments, policy });
  });
  app.get("/credential/token.json", async (c) => {
    const creds = await loadCredentials(storage);
    if (creds.size === 0) {
      return c.json({}, 200, { "Access-Control-Allow-Origin": "*" });
    }
    const tokenJson = generateTokenJson(creds);
    return c.json(tokenJson, 200, {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    });
  });
  if (config.workerBaseUrl || config.localBaseUrl) {
    app.all("/api/:key", async (c) => {
      const key = c.req.param("key");
      const raw2 = await storage.get(KV_MACCMS_SOURCES);
      const sources = raw2 ? JSON.parse(raw2) : [];
      const source = sources.find((s) => s.key === key);
      if (!source) {
        return c.json({ error: "Unknown MacCMS source" }, 404);
      }
      const targetUrl = new URL(source.api);
      const reqUrl = new URL(c.req.url);
      reqUrl.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
      const attempts = [];
      if (!config.workerBaseUrl) {
        const edgeRaw = await storage.get(KV_EDGE_PROXIES);
        if (edgeRaw) {
          const edge = JSON.parse(edgeRaw);
          const encoded = encodeURIComponent(targetUrl.toString());
          if (edge.vercel) {
            attempts.push({
              label: "vercel",
              url: `${edge.vercel.replace(/\/$/, "")}/api/proxy?url=${encoded}`,
              headers: {}
            });
          }
          if (edge.cf) {
            attempts.push({
              label: "cf",
              url: `${edge.cf.replace(/\/$/, "")}/fetch-proxy?url=${encoded}`,
              headers: config.adminToken ? { Authorization: `Bearer ${config.adminToken}` } : {}
            });
          }
        }
      }
      attempts.push({ label: "direct", url: targetUrl.toString(), headers: {} });
      let lastError = "";
      for (const { label, url, headers } of attempts) {
        try {
          const resp = await fetch(url, {
            headers: { "User-Agent": "okhttp/3.12.0", ...headers },
            signal: AbortSignal.timeout(8e3)
          });
          if (!resp.ok) {
            lastError = `upstream ${resp.status}`;
            console.log(`[maccms-proxy] ${key} via ${label} fail: ${lastError}`);
            continue;
          }
          const data = await resp.json();
          console.log(`[maccms-proxy] ${key} via ${label} ok`);
          return c.json(data, 200, {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=300"
          });
        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error);
          console.log(`[maccms-proxy] ${key} via ${label} fail: ${lastError}`);
        }
      }
      return c.json({ error: lastError || "All proxies failed" }, 502);
    });
  }
  if (config.workerBaseUrl) {
    app.get("/jar/:key", async (c) => {
      const key = c.req.param("key");
      const cache = caches.default;
      const cacheKey = new Request(c.req.url);
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
      const originalUrl = await lookupJarUrl(key, storage);
      if (!originalUrl) {
        return c.json({ error: "Unknown JAR key" }, 404);
      }
      const ttl = isMd5Key(key) ? 86400 : 21600;
      try {
        const resp = await fetch(originalUrl, {
          headers: { "User-Agent": "okhttp/3.12.0" }
        });
        if (resp.ok) {
          const response = new Response(resp.body, {
            headers: {
              "Content-Type": "application/octet-stream",
              "Cache-Control": `public, max-age=${ttl}`,
              "Access-Control-Allow-Origin": "*"
            }
          });
          c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
          return response;
        }
        console.log(`[jar-proxy] Origin returned ${resp.status} for ${key}, trying KV binary cache`);
      } catch (error) {
        console.log(`[jar-proxy] Origin fetch error for ${key}: ${error instanceof Error ? error.message : error}`);
      }
      const binBase64 = await storage.get("jar_bin:" + key);
      if (binBase64) {
        console.log(`[jar-proxy] Serving ${key} from KV binary cache`);
        const binary = base64ToUint8Array(binBase64);
        const response = new Response(binary, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Cache-Control": `public, max-age=${ttl}`,
            "Access-Control-Allow-Origin": "*"
          }
        });
        c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      }
      return c.json({ error: "JAR unavailable from origin and no binary cache" }, 502);
    });
  } else if (config.localBaseUrl) {
    const fs = (init_node_fs(), __toCommonJS(node_fs_exports));
    const pathMod = (init_node_path(), __toCommonJS(node_path_exports));
    const jarCacheDir = pathMod.resolve(process.env.DATA_DIR || pathMod.join(process.cwd(), "data"), "jars");
    if (!fs.existsSync(jarCacheDir)) fs.mkdirSync(jarCacheDir, { recursive: true });
    const downloadLocks = /* @__PURE__ */ new Map();
    async function fetchAndCacheJar(key, originalUrl) {
      try {
        const resp = await fetch(originalUrl, {
          headers: { "User-Agent": "okhttp/3.12.0" }
        });
        if (!resp.ok) {
          console.log(`[jar-proxy] Origin returned ${resp.status} for ${key}`);
          return null;
        }
        const buf = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(pathMod.join(jarCacheDir, `${key}.jar`), buf);
        console.log(`[jar-proxy] Cached ${key}.jar (${(buf.length / 1024).toFixed(1)} KB)`);
        return buf;
      } catch (error) {
        console.log(`[jar-proxy] Fetch error for ${key}: ${error instanceof Error ? error.message : error}`);
        return null;
      }
    }
    app.get("/jar/:key", async (c) => {
      const key = c.req.param("key");
      const originalUrl = await lookupJarUrl(key, storage);
      if (!originalUrl) {
        return c.json({ error: "Unknown JAR key" }, 404);
      }
      const cachePath = pathMod.join(jarCacheDir, `${key}.jar`);
      if (fs.existsSync(cachePath)) {
        const stat = fs.statSync(cachePath);
        const ttl = isMd5Key(key) ? 864e5 : 216e5;
        if (Date.now() - stat.mtimeMs < ttl) {
          const buf2 = fs.readFileSync(cachePath);
          return new Response(buf2, {
            headers: {
              "Content-Type": "application/octet-stream",
              "Cache-Control": `public, max-age=${ttl / 1e3}`,
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      }
      let downloading = downloadLocks.get(key);
      if (!downloading) {
        downloading = fetchAndCacheJar(key, originalUrl).finally(() => downloadLocks.delete(key));
        downloadLocks.set(key, downloading);
      }
      const buf = await downloading;
      if (buf) {
        return new Response(buf, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Cache-Control": `public, max-age=${isMd5Key(key) ? 86400 : 21600}`,
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return c.json({ error: "JAR unavailable from origin" }, 502);
    });
  }
  if (config.workerBaseUrl) {
    app.get("/live/:key", async (c) => {
      const key = c.req.param("key");
      const cache = caches.default;
      const cacheKey = new Request(c.req.url);
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
      const originalUrl = await lookupLiveUrl(key, storage);
      if (!originalUrl) {
        return c.json({ error: "Unknown live source key" }, 404);
      }
      try {
        const resp = await fetch(originalUrl, {
          headers: { "User-Agent": "okhttp/3.12.0" }
        });
        if (!resp.ok) {
          return c.json({ error: `Origin returned ${resp.status}` }, 502);
        }
        const response = new Response(resp.body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": `public, max-age=${LIVE_PROXY_TTL}`,
            "Access-Control-Allow-Origin": "*"
          }
        });
        c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return c.json({ error: msg }, 502);
      }
    });
  }
  if (config.workerBaseUrl) {
    app.get("/img/*", async (c) => {
      const fullUrl = c.req.url;
      const marker = "/img/";
      const markerIdx = fullUrl.indexOf(marker);
      const originalUrl = fullUrl.substring(markerIdx + marker.length);
      if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
        return c.json({ error: "Invalid image URL" }, 400);
      }
      const cache = caches.default;
      const cacheKey = new Request(c.req.url);
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
      try {
        const resp = await fetch(originalUrl, {
          headers: { "User-Agent": "okhttp/3.12.0" }
        });
        if (!resp.ok) {
          return c.json({ error: `Origin returned ${resp.status}` }, 502);
        }
        const contentType = resp.headers.get("Content-Type") || "image/jpeg";
        const response = new Response(resp.body, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": `public, max-age=${IMG_PROXY_TTL}`,
            "Access-Control-Allow-Origin": "*"
          }
        });
        c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return c.json({ error: msg }, 502);
      }
    });
  }
  app.get("/admin/lives", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_LIVE_SOURCES);
    const entries = raw2 ? JSON.parse(raw2) : [];
    return c.json(entries);
  });
  app.post("/admin/lives", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const url = body.url?.trim();
    if (!url) return c.json({ error: "URL is required" }, 400);
    try {
      new URL(url);
    } catch {
      return c.json({ error: "Invalid URL format" }, 400);
    }
    const name = body.name?.trim() || "";
    const raw2 = await storage.get(KV_LIVE_SOURCES);
    const entries = raw2 ? JSON.parse(raw2) : [];
    if (entries.some((e) => e.url === url)) {
      return c.json({ error: "Live source already exists" }, 409);
    }
    entries.push({ name, url });
    await storage.put(KV_LIVE_SOURCES, JSON.stringify(entries));
    return c.json({ success: true });
  });
  app.delete("/admin/lives", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const url = body.url?.trim();
    if (!url) return c.json({ error: "URL is required" }, 400);
    const raw2 = await storage.get(KV_LIVE_SOURCES);
    const entries = raw2 ? JSON.parse(raw2) : [];
    const filtered = entries.filter((e) => e.url !== url);
    await storage.put(KV_LIVE_SOURCES, JSON.stringify(filtered));
    return c.json({ success: true });
  });
  app.get("/admin/maccms", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_MACCMS_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    return c.json(sources);
  });
  app.post("/admin/maccms", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const newEntries = Array.isArray(body) ? body : [body];
    for (const entry of newEntries) {
      if (!entry.key?.trim() || !entry.name?.trim() || !entry.api?.trim()) {
        return c.json({ error: "Each entry requires key, name, and api" }, 400);
      }
      try {
        new URL(entry.api);
      } catch {
        return c.json({ error: `Invalid URL: ${entry.api}` }, 400);
      }
    }
    const raw2 = await storage.get(KV_MACCMS_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    const existingKeys = new Set(sources.map((s) => s.key));
    let added = 0;
    for (const entry of newEntries) {
      if (!existingKeys.has(entry.key)) {
        sources.push({ key: entry.key.trim(), name: entry.name.trim(), api: entry.api.trim() });
        existingKeys.add(entry.key);
        added++;
      }
    }
    await storage.put(KV_MACCMS_SOURCES, JSON.stringify(sources));
    return c.json({ success: true, added, total: sources.length });
  });
  app.delete("/admin/maccms", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const key = body.key?.trim();
    if (!key) return c.json({ error: "key is required" }, 400);
    const raw2 = await storage.get(KV_MACCMS_SOURCES);
    const sources = raw2 ? JSON.parse(raw2) : [];
    const filtered = sources.filter((s) => s.key !== key);
    await storage.put(KV_MACCMS_SOURCES, JSON.stringify(filtered));
    return c.json({ success: true });
  });
  app.post("/admin/maccms/validate", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const api = body.api?.trim();
    if (!api) return c.json({ error: "api is required" }, 400);
    const ok = await validateMacCMS(api, config.siteTimeoutMs);
    return c.json({ api, valid: ok });
  });
  app.get("/admin/config-editor", (c) => {
    return c.html(configEditorHtml);
  });
  app.get("/admin/config-data", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const full = await storage.get(KV_MERGED_CONFIG_FULL);
    const cached = full || await storage.get(KV_MERGED_CONFIG);
    if (!cached) {
      return c.json({ sites: [], parses: [], lives: [] });
    }
    let parsed;
    try {
      parsed = JSON.parse(cached);
    } catch {
      return c.json({ error: "Config parse error" }, 500);
    }
    const blacklist = await loadBlacklist(storage);
    const siteSet = new Set(blacklist.sites);
    const parseSet = new Set(blacklist.parses);
    const liveSet = new Set(blacklist.lives);
    const sites = [];
    for (const site of parsed.sites || []) {
      const fp = await siteFingerprint(site);
      const api = site.api || "";
      let group = "\u5176\u4ED6";
      if (api.startsWith("csp_") || api.startsWith("py_") || api.startsWith("js_")) {
        group = api;
      } else if (api.startsWith("http")) {
        try {
          group = "\u8FDC\u7A0B: " + new URL(api).hostname;
        } catch {
          group = "\u8FDC\u7A0B\u6E90";
        }
      }
      sites.push({ ...site, fingerprint: fp, blocked: siteSet.has(fp), group });
    }
    const parses = (parsed.parses || []).map((p) => ({
      ...p,
      blocked: parseSet.has(p.url)
    }));
    const lives = (parsed.lives || []).map((l) => ({
      ...l,
      blocked: liveSet.has(l.url || l.api || "")
    }));
    return c.json({ sites, parses, lives });
  });
  app.post("/admin/blacklist", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const { type, id } = body;
    if (!type || !id) return c.json({ error: "type and id are required" }, 400);
    if (!["sites", "parses", "lives"].includes(type)) {
      return c.json({ error: "type must be sites, parses, or lives" }, 400);
    }
    const blacklist = await loadBlacklist(storage);
    const list = blacklist[type];
    if (!list.includes(id)) {
      list.push(id);
    }
    await saveBlacklist(storage, blacklist);
    await patchMergedConfig();
    return c.json({ success: true });
  });
  app.post("/admin/blacklist/batch", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const { type, ids } = body;
    if (!type || !Array.isArray(ids) || ids.length === 0) {
      return c.json({ error: "type and ids[] are required" }, 400);
    }
    if (ids.length > 500) {
      return c.json({ error: "Too many ids (max 500)" }, 400);
    }
    if (!["sites", "parses", "lives"].includes(type)) {
      return c.json({ error: "type must be sites, parses, or lives" }, 400);
    }
    const blacklist = await loadBlacklist(storage);
    const list = blacklist[type];
    let added = 0;
    for (const id of ids) {
      if (typeof id === "string" && !list.includes(id)) {
        list.push(id);
        added++;
      }
    }
    await saveBlacklist(storage, blacklist);
    await patchMergedConfig();
    return c.json({ success: true, added });
  });
  app.delete("/admin/blacklist", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const { type, id } = body;
    if (!type || !id) return c.json({ error: "type and id are required" }, 400);
    if (!["sites", "parses", "lives"].includes(type)) {
      return c.json({ error: "type must be sites, parses, or lives" }, 400);
    }
    const blacklist = await loadBlacklist(storage);
    const key = type;
    blacklist[key] = blacklist[key].filter((v) => v !== id);
    await saveBlacklist(storage, blacklist);
    await patchMergedConfig();
    return c.json({ success: true });
  });
  async function patchMergedConfig() {
    const fullRaw = await storage.get(KV_MERGED_CONFIG_FULL);
    if (!fullRaw) return;
    const blacklist = await loadBlacklist(storage);
    const hasBlacklist = blacklist.sites.length > 0 || blacklist.parses.length > 0 || blacklist.lives.length > 0 || blacklist.regexRules.some((r) => r.enabled);
    if (!hasBlacklist) {
      await storage.put(KV_MERGED_CONFIG, fullRaw);
      return;
    }
    const fullConfig = JSON.parse(fullRaw);
    const { config: filtered } = await applyBlacklist(fullConfig, blacklist);
    await storage.put(KV_MERGED_CONFIG, JSON.stringify(filtered));
  }
  app.get("/admin/blacklist/regex", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const blacklist = await loadBlacklist(storage);
    return c.json({ rules: blacklist.regexRules, overrides: blacklist.regexBlockOverrides });
  });
  app.post("/admin/blacklist/regex", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    if (deps.isSyncing?.()) return c.json({ error: "Aggregation in progress, try later" }, 409);
    const body = await c.req.json();
    if (!body.pattern || !["name", "api", "key"].includes(body.field)) {
      return c.json({ error: "Invalid input: pattern and field (name|api|key) required" }, 400);
    }
    const validation = validateRegexRule(body.pattern);
    if (!validation.ok) return c.json({ error: validation.error }, 400);
    const rule = {
      id: crypto.randomUUID().slice(0, 8),
      pattern: body.pattern,
      field: body.field,
      enabled: body.enabled !== false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const blacklist = await loadBlacklist(storage);
    await saveRegexRule(storage, blacklist, rule);
    await patchMergedConfig();
    return c.json({ success: true, rule });
  });
  app.put("/admin/blacklist/regex/:id", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    if (deps.isSyncing?.()) return c.json({ error: "Aggregation in progress, try later" }, 409);
    const id = c.req.param("id");
    const body = await c.req.json();
    if (body.pattern) {
      const validation = validateRegexRule(body.pattern);
      if (!validation.ok) return c.json({ error: validation.error }, 400);
    }
    if (body.field && !["name", "api", "key"].includes(body.field)) {
      return c.json({ error: "Invalid field" }, 400);
    }
    const blacklist = await loadBlacklist(storage);
    if (!blacklist.regexRules.find((r) => r.id === id)) return c.json({ error: "Rule not found" }, 404);
    await updateRegexRule(storage, blacklist, id, body);
    await patchMergedConfig();
    return c.json({ success: true });
  });
  app.delete("/admin/blacklist/regex/:id", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param("id");
    const blacklist = await loadBlacklist(storage);
    if (!blacklist.regexRules.find((r) => r.id === id)) return c.json({ error: "Rule not found" }, 404);
    await deleteRegexRule(storage, blacklist, id);
    await patchMergedConfig();
    return c.json({ success: true });
  });
  app.post("/admin/blacklist/regex/test", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const body = await c.req.json();
    if (!body.pattern || !["name", "api", "key"].includes(body.field)) {
      return c.json({ error: "Invalid input" }, 400);
    }
    const validation = validateRegexRule(body.pattern);
    if (!validation.ok) return c.json({ error: validation.error }, 400);
    const raw2 = await storage.get(KV_MERGED_CONFIG_FULL);
    if (!raw2) return c.json({ matched: [] });
    const fullConfig = JSON.parse(raw2);
    const result = testRegexAgainstSites(fullConfig.sites || [], body.pattern, body.field);
    return c.json(result);
  });
  app.get("/admin/agg-logs", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_AGG_LOGS);
    const logs = raw2 ? JSON.parse(raw2) : [];
    const limitStr = c.req.query("limit");
    const limit = limitStr ? Math.min(parseInt(limitStr) || 20, 50) : 20;
    const sliced = logs.slice(-limit).reverse();
    return c.json({ total: logs.length, logs: sliced });
  });
  app.delete("/admin/agg-logs", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await storage.put(KV_AGG_LOGS, "[]");
    return c.json({ success: true });
  });
  app.get("/admin/group-order", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const cfg = await loadGroupOrder(storage);
    return c.json(cfg);
  });
  app.put("/admin/group-order", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const cfg = {
      rules: Array.isArray(body.rules) ? body.rules : [],
      unmatchedPosition: body.unmatchedPosition === "before" ? "before" : "after",
      enabled: body.enabled !== false
    };
    await saveGroupOrder(storage, cfg);
    return c.json({ success: true, ...cfg });
  });
  app.get("/admin/dedup-config", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const raw2 = await storage.get(KV_DEDUP_CONFIG);
    if (!raw2) {
      return c.json({ similarDedup: true, similarDedupThreshold: 0.85 });
    }
    try {
      return c.json(JSON.parse(raw2));
    } catch {
      return c.json({ similarDedup: true, similarDedupThreshold: 0.85 });
    }
  });
  app.put("/admin/dedup-config", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const cfg = {
      similarDedup: body.similarDedup !== false,
      similarDedupThreshold: typeof body.similarDedupThreshold === "number" ? Math.max(0.5, Math.min(1, body.similarDedupThreshold)) : 0.85
    };
    await storage.put(KV_DEDUP_CONFIG, JSON.stringify(cfg));
    return c.json({ success: true, ...cfg });
  });
  app.get("/api/bg-settings", async (c) => {
    const raw2 = await storage.get(KV_BG_SETTINGS);
    if (!raw2) return c.json({ type: "default" });
    try {
      return c.json(JSON.parse(raw2));
    } catch {
      return c.json({ type: "default" });
    }
  });
  app.put("/admin/bg-settings", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    const cfg = {
      type: body.type || "default",
      imageUrl: body.imageUrl || "",
      overlay: typeof body.overlay === "number" ? Math.max(0, Math.min(100, body.overlay)) : 85,
      solidColor: body.solidColor || "#0a0e14",
      gradient: body.gradient || ""
    };
    await storage.put(KV_BG_SETTINGS, JSON.stringify(cfg));
    return c.json({ success: true, ...cfg });
  });
  app.post("/refresh", async (c) => {
    if (config.refreshToken || config.adminToken) {
      const auth = c.req.raw.headers.get("Authorization");
      const validTokens = [config.refreshToken, config.adminToken].filter(Boolean);
      if (!validTokens.some((t) => auth === `Bearer ${t}`)) {
        return c.json({ error: "Unauthorized" }, 401);
      }
    }
    try {
      await deps.triggerRefresh();
      return c.json({ success: true, message: "Refresh completed" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return c.json({ success: false, error: msg }, 500);
    }
  });
  app.get("/admin/live-disabled", async (c) => {
    const raw2 = await storage.get(KV_LIVE_DISABLED);
    return c.json({ disabled: raw2 === "true" });
  });
  app.put("/admin/live-disabled", async (c) => {
    if (config.adminToken) {
      const auth = c.req.raw.headers.get("Authorization");
      if (auth !== `Bearer ${config.adminToken}`) return c.json({ error: "Unauthorized" }, 401);
    }
    if (deps.isSyncing?.()) {
      return c.json({ error: "Aggregation in progress, try later" }, 409);
    }
    const body = await c.req.json();
    await storage.put(KV_LIVE_DISABLED, body.disabled ? "true" : "false");
    return c.json({ success: true, disabled: body.disabled });
  });
  app.get("/admin/smart-base-url", async (c) => {
    const raw2 = await storage.get(KV_SMART_BASE_URL_ENABLED);
    return c.json({ enabled: raw2 === "true" });
  });
  app.put("/admin/smart-base-url", async (c) => {
    if (config.adminToken) {
      const auth = c.req.raw.headers.get("Authorization");
      if (auth !== `Bearer ${config.adminToken}`) return c.json({ error: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    await storage.put(KV_SMART_BASE_URL_ENABLED, body.enabled ? "true" : "false");
    return c.json({ success: true, enabled: body.enabled });
  });
  app.get("/admin/site-probe-depth", async (c) => {
    const raw2 = await storage.get(KV_SITE_PROBE_DEPTH);
    return c.json({ depth: raw2 || "deep" });
  });
  app.put("/admin/site-probe-depth", async (c) => {
    if (config.adminToken) {
      const auth = c.req.raw.headers.get("Authorization");
      if (auth !== `Bearer ${config.adminToken}`) return c.json({ error: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    if (!["shallow", "deep"].includes(body.depth)) return c.json({ error: "Invalid depth" }, 400);
    await storage.put(KV_SITE_PROBE_DEPTH, body.depth);
    return c.json({ success: true, depth: body.depth });
  });
  app.get("/admin/site-auto-clean", async (c) => {
    const raw2 = await storage.get(KV_SITE_AUTO_CLEAN);
    return c.json({ enabled: raw2 === "true" });
  });
  app.put("/admin/site-auto-clean", async (c) => {
    if (config.adminToken) {
      const auth = c.req.raw.headers.get("Authorization");
      if (auth !== `Bearer ${config.adminToken}`) return c.json({ error: "Unauthorized" }, 401);
    }
    const body = await c.req.json();
    await storage.put(KV_SITE_AUTO_CLEAN, body.enabled ? "true" : "false");
    return c.json({ success: true, enabled: body.enabled });
  });
  app.get("/admin/site-health", async (c) => {
    if (!verifyAdmin2(c.req.raw, config)) return c.json({ error: "Unauthorized" }, 401);
    const raw2 = await storage.get(KV_SITE_HEALTH_MAP);
    const healthMap = raw2 ? JSON.parse(raw2) : {};
    return c.json(healthMap);
  });
  if (deps.enableChannelProbe) {
    mountChannelProbeRoutes(app, { storage, config });
  }
  app.get("/img-proxy", async (c) => {
    const url = c.req.query("url");
    if (!url) return c.text("missing url", 400);
    const referer = c.req.query("referer") || new URL(url).origin + "/";
    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": referer,
          "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
        }
      });
      if (!resp.ok) return c.body(null, resp.status);
      return new Response(resp.body, {
        headers: {
          "Content-Type": resp.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch {
      return c.body(null, 502);
    }
  });
  app.get("/reader-proxy", async (c) => {
    const url = c.req.query("url");
    if (!url) return c.text("missing url", 400);
    const referer = c.req.query("referer") || new URL(url).origin + "/";
    const cookie = c.req.query("cookie") || "";
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      "Referer": referer,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
    };
    if (cookie) headers["Cookie"] = cookie;
    try {
      const resp = await fetch(url, { headers });
      return new Response(resp.body, {
        status: resp.status,
        headers: {
          "Content-Type": resp.headers.get("content-type") || "text/plain",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch {
      return c.body(null, 502);
    }
  });
  return app;
}
function verifyAdmin2(request, config) {
  const token = config.adminToken;
  if (!token) return false;
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${token}`;
}

// src/storage/eo-kv.ts
var EOKVStorage = class {
  constructor(kv) {
    this.kv = kv;
  }
  async get(key) {
    const v = await this.kv.get(key);
    return v ?? null;
  }
  async put(key, value) {
    await this.kv.put(key, value);
  }
};

// src/core/parser.ts
function normalizeConfig(sourced) {
  const config = sourced.config;
  return {
    ...sourced,
    config: {
      spider: normalizeSpider(config.spider, sourced.sourceUrl),
      sites: normalizeSites(config.sites || [], config.spider, sourced.sourceUrl),
      parses: normalizeParses(config.parses, sourced.sourceUrl),
      lives: normalizeLives(config.lives || [], sourced.sourceUrl),
      hosts: config.hosts || [],
      rules: config.rules || [],
      doh: config.doh || [],
      ads: config.ads || [],
      flags: config.flags || []
    }
  };
}
function normalizeSpider(spider, sourceUrl) {
  if (!spider) return void 0;
  return resolveUrl(spider, sourceUrl);
}
function normalizeSites(sites, globalSpider, sourceUrl) {
  return sites.filter((site) => site.key && site.api !== void 0).map((site) => {
    const normalized = {
      ...site,
      name: site.name || site.key,
      searchable: site.searchable ?? 1,
      quickSearch: site.quickSearch ?? 1,
      filterable: site.filterable ?? 1
    };
    if (site.type === 0 || site.type === 1) {
      normalized.api = resolveUrl(site.api, sourceUrl);
    }
    if (site.type === 3 && isResolvableUrl(site.api)) {
      normalized.api = resolveUrl(site.api, sourceUrl);
    }
    if (site.jar) {
      normalized.jar = resolveUrl(site.jar, sourceUrl);
    }
    if (site.playUrl) {
      normalized.playUrl = resolveUrl(site.playUrl, sourceUrl);
    }
    if (site.ext) {
      normalized.ext = resolveExt(site.ext, sourceUrl);
    }
    return normalized;
  });
}
function resolveExt(ext, sourceUrl) {
  if (typeof ext === "string") {
    return isResolvableUrl(ext) ? resolveUrl(ext, sourceUrl) : ext;
  }
  const resolved = {};
  for (const [key, value] of Object.entries(ext)) {
    if (typeof value === "string" && isResolvableUrl(value)) {
      resolved[key] = resolveUrl(value, sourceUrl);
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}
function resolveUrl(url, baseUrl) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) {
    try {
      const base = new URL(baseUrl);
      return `${base.protocol}${url}`;
    } catch {
      return `https:${url}`;
    }
  }
  if (url.startsWith("./") || url.startsWith("../")) {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }
  if (url.startsWith("csp_") || url.startsWith("py_") || url.startsWith("js_")) {
    return url;
  }
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}
function normalizeParses(parses, sourceUrl) {
  if (!parses) return [];
  return parses.map((parse) => {
    const normalized = { ...parse };
    if (parse.url) {
      normalized.url = resolveUrl(parse.url, sourceUrl);
    }
    if (parse.ext) {
      normalized.ext = resolveExt(parse.ext, sourceUrl);
    }
    return normalized;
  });
}
function normalizeLives(lives, sourceUrl) {
  return lives.map((live) => {
    const normalized = { ...live };
    if (live.url && isResolvableUrl(live.url)) {
      normalized.url = resolveUrl(live.url, sourceUrl);
    }
    if (live.api) {
      normalized.api = resolveUrl(live.api, sourceUrl);
    }
    if (live.jar) {
      normalized.jar = resolveUrl(live.jar, sourceUrl);
    }
    if (live.epg) {
      normalized.epg = resolveUrl(live.epg, sourceUrl);
    }
    if (live.ext) {
      normalized.ext = resolveExt(live.ext, sourceUrl);
    }
    return normalized;
  });
}
function isResolvableUrl(url) {
  if (!url) return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  if (url.startsWith("./") || url.startsWith("../")) return true;
  if (url.startsWith("//")) return true;
  if (url.startsWith("csp_") || url.startsWith("py_") || url.startsWith("js_")) return false;
  return false;
}
function extractSpiderJarUrl(spider) {
  if (!spider) return null;
  const parts = spider.split(";md5;");
  let url = parts[0].trim();
  if (url.startsWith("img+")) {
    url = url.substring(4);
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return null;
  }
  return url;
}

// src/core/dedup.ts
function deduplicateSites(sites) {
  const keyMap = /* @__PURE__ */ new Map();
  const dedupKey = (site) => {
    return `${site.key}|${site.api}`;
  };
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  const usedKeys = /* @__PURE__ */ new Map();
  for (const site of sites) {
    const dk = dedupKey(site);
    if (seen.has(dk)) continue;
    seen.add(dk);
    if (keyMap.has(site.key)) {
      const existing = keyMap.get(site.key);
      if (dedupKey(existing) !== dk) {
        const count = (usedKeys.get(site.key) || 1) + 1;
        usedKeys.set(site.key, count);
        site.key = `${site.key}_${count}`;
        if (site.name) {
          site.name = `${site.name}(${count})`;
        }
      }
    } else {
      keyMap.set(site.key, site);
      usedKeys.set(site.key, 1);
    }
    result.push(site);
  }
  return result;
}
function deduplicateParses(parses) {
  const seen = /* @__PURE__ */ new Set();
  return parses.filter((parse) => {
    const key = `${parse.url}|${parse.type ?? 0}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function deduplicateLives(lives) {
  const seen = /* @__PURE__ */ new Set();
  return lives.filter((live) => {
    const url = live.url || live.api || "";
    if (!url) return true;
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
function deduplicateDoh(dohs) {
  const seen = /* @__PURE__ */ new Set();
  return dohs.filter((doh) => {
    if (seen.has(doh.url)) return false;
    seen.add(doh.url);
    return true;
  });
}
function mergeRules(rules) {
  const hostMap = /* @__PURE__ */ new Map();
  for (const rule of rules) {
    const hostKey = rule.host || (rule.hosts || []).sort().join(",");
    if (!hostKey) {
      hostMap.set(`__anon_${hostMap.size}`, rule);
      continue;
    }
    if (hostMap.has(hostKey)) {
      const existing = hostMap.get(hostKey);
      if (rule.rule) existing.rule = [.../* @__PURE__ */ new Set([...existing.rule || [], ...rule.rule])];
      if (rule.filter) existing.filter = [.../* @__PURE__ */ new Set([...existing.filter || [], ...rule.filter])];
      if (rule.regex) existing.regex = [.../* @__PURE__ */ new Set([...existing.regex || [], ...rule.regex])];
      if (rule.script) existing.script = [.../* @__PURE__ */ new Set([...existing.script || [], ...rule.script])];
    } else {
      hostMap.set(hostKey, { ...rule });
    }
  }
  return [...hostMap.values()];
}
function deduplicateHosts(hosts) {
  const map = /* @__PURE__ */ new Map();
  for (const entry of hosts) {
    const eqIndex = entry.indexOf("=");
    if (eqIndex > 0) {
      const domain = entry.substring(0, eqIndex);
      map.set(domain, entry);
    }
  }
  return [...map.values()];
}
function deduplicateStrings(arr) {
  return [...new Set(arr)];
}
function deduplicateSimilarNames(sites, speedMap, threshold = 0.85) {
  if (sites.length === 0) return sites;
  const parent = sites.map((_, i) => i);
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x, y) {
    parent[find(x)] = find(y);
  }
  for (let i = 0; i < sites.length; i++) {
    for (let j = i + 1; j < sites.length; j++) {
      const na = sites[i].name || sites[i].key;
      const nb = sites[j].name || sites[j].key;
      if (nameSimilarity(na, nb) >= threshold) {
        union(i, j);
      }
    }
  }
  const groups = /* @__PURE__ */ new Map();
  for (let i = 0; i < sites.length; i++) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(i);
  }
  const kept = [];
  let dedupCount = 0;
  for (const [, indices] of groups) {
    if (indices.length === 1) {
      kept.push(sites[indices[0]]);
      continue;
    }
    let bestIdx = indices[0];
    let bestSpeed = speedMap.get(sites[bestIdx].api) ?? Infinity;
    for (let k = 1; k < indices.length; k++) {
      const idx = indices[k];
      const speed = speedMap.get(sites[idx].api) ?? Infinity;
      if (speed < bestSpeed) {
        bestSpeed = speed;
        bestIdx = idx;
      }
    }
    kept.push(sites[bestIdx]);
    dedupCount += indices.length - 1;
    if (indices.length > 1) {
      const names = indices.map((i) => `${sites[i].name || sites[i].key}(${speedMap.get(sites[i].api) ?? "?"}ms)`);
      console.log(`[dedup-similar] Group: ${names.join(" | ")} \u2192 kept: ${sites[bestIdx].name || sites[bestIdx].key}`);
    }
  }
  if (dedupCount > 0) {
    console.log(`[dedup-similar] Removed ${dedupCount} similar-name duplicates (threshold: ${threshold})`);
  }
  const keptKeys = new Set(kept.map((s) => s.key));
  return sites.filter((s) => keptKeys.has(s.key));
}
function nameSimilarity(a, b) {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const normalize = (s) => s.toLowerCase().replace(/[【】\[\]()（）《》「」『』<>\s\-_·•,.，。]/g, "").replace(/\d+/g, "");
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (!na || !nb) return 0;
  const [short, long] = na.length <= nb.length ? [na, nb] : [nb, na];
  let matches = 0;
  let longIdx = 0;
  for (const ch of short) {
    const found = long.indexOf(ch, longIdx);
    if (found >= 0) {
      matches++;
      longIdx = found + 1;
    }
  }
  return matches / long.length;
}

// src/core/merger.ts
function mergeConfigs(sourcedConfigs) {
  const normalized = sourcedConfigs.map(normalizeConfig);
  const siteSourceMap = /* @__PURE__ */ new Map();
  const globalSpider = selectGlobalSpider(normalized);
  const globalSpiderFull = globalSpider ? findFullSpiderString(normalized, globalSpider) : null;
  const allSites = [];
  const allParses = [];
  const allLives = [];
  const allHosts = [];
  const allRules = [];
  const allDoh = [];
  const allAds = [];
  const allFlags = [];
  for (const sourced of normalized) {
    const config = sourced.config;
    if (config.sites) {
      for (const site of config.sites) {
        const siteCopy = { ...site };
        if (site.type === 3 && !site.jar) {
          const spiderJar = extractSpiderJarUrl(config.spider);
          if (spiderJar && spiderJar !== globalSpider) {
            siteCopy.jar = config.spider;
          }
        }
        allSites.push(siteCopy);
      }
    }
    if (config.parses) allParses.push(...config.parses);
    if (config.lives) allLives.push(...config.lives);
    if (config.hosts) allHosts.push(...config.hosts);
    if (config.rules) allRules.push(...config.rules);
    if (config.doh) allDoh.push(...config.doh);
    if (config.ads) allAds.push(...config.ads);
    if (config.flags) allFlags.push(...config.flags);
  }
  const sourceByDedupKey = /* @__PURE__ */ new Map();
  for (const sourced of normalized) {
    for (const site of sourced.config.sites || []) {
      const dk = `${site.key}|${site.api}`;
      if (!sourceByDedupKey.has(dk)) {
        sourceByDedupKey.set(dk, sourced.sourceName);
      }
    }
  }
  const dedupedSites = deduplicateSites(allSites);
  for (const site of dedupedSites) {
    const dk = `${site.key}|${site.api}`;
    const source = sourceByDedupKey.get(dk);
    if (source) {
      siteSourceMap.set(site.key, source);
    } else {
      for (const [mapDk, mapSource] of sourceByDedupKey) {
        if (mapDk.endsWith(`|${site.api}`)) {
          siteSourceMap.set(site.key, mapSource);
          break;
        }
      }
    }
  }
  const merged = {
    sites: dedupedSites,
    parses: deduplicateParses(allParses || []),
    lives: deduplicateLives(allLives || []),
    hosts: deduplicateHosts(allHosts),
    rules: mergeRules(allRules || []),
    doh: deduplicateDoh(allDoh || []),
    ads: deduplicateStrings(allAds),
    flags: deduplicateStrings(allFlags)
  };
  if (globalSpider) {
    merged.spider = globalSpiderFull || globalSpider;
  }
  console.log(
    `[merger] Merged: ${merged.sites?.length} sites, ${merged.parses?.length} parses, ${merged.lives?.length} lives`
  );
  return { config: merged, siteSourceMap };
}
function selectGlobalSpider(configs) {
  const jarCounts = /* @__PURE__ */ new Map();
  for (const sourced of configs) {
    const spiderJar = extractSpiderJarUrl(sourced.config.spider);
    if (!spiderJar) continue;
    const type3Count = (sourced.config.sites || []).filter((s) => s.type === 3 && !s.jar).length;
    if (type3Count > 0) {
      jarCounts.set(spiderJar, (jarCounts.get(spiderJar) || 0) + type3Count);
    }
  }
  if (jarCounts.size === 0) return null;
  let maxJar = null;
  let maxCount = 0;
  for (const [jar, count] of jarCounts) {
    if (count > maxCount) {
      maxCount = count;
      maxJar = jar;
    }
  }
  return maxJar;
}
function findFullSpiderString(configs, jarUrl) {
  for (const sourced of configs) {
    const extracted = extractSpiderJarUrl(sourced.config.spider);
    if (extracted === jarUrl && sourced.config.spider) {
      return sourced.config.spider;
    }
  }
  return null;
}
function cleanEmptyEntries(config) {
  const before = {
    sites: config.sites?.length || 0,
    parses: config.parses?.length || 0,
    lives: config.lives?.length || 0,
    doh: config.doh?.length || 0
  };
  const sites = (config.sites || []).filter((s) => s.key && s.api);
  const parses = (config.parses || []).filter((p) => p.name && p.url);
  const lives = (config.lives || []).filter((l) => l.url || l.api);
  const doh = (config.doh || []).filter((d) => d.name && d.url);
  const removed = before.sites - sites.length + (before.parses - parses.length) + (before.lives - lives.length) + (before.doh - doh.length);
  if (removed > 0) {
    console.log(
      `[cleaner] Removed ${removed} empty entries: ${before.sites - sites.length} sites, ${before.parses - parses.length} parses, ${before.lives - lives.length} lives, ${before.doh - doh.length} doh`
    );
  }
  return { ...config, sites, parses, lives, doh };
}
function cleanLocalRefs(config) {
  const isLocal = (url) => url.includes("127.0.0.1") || url.includes("localhost");
  const sites = (config.sites || []).filter((site) => {
    if (site.api && isLocal(site.api)) {
      console.log(`[cleaner] Removed site ${site.key}: local api ${site.api}`);
      return false;
    }
    if (typeof site.ext === "string" && isLocal(site.ext)) {
      console.log(`[cleaner] Removed site ${site.key}: local ext`);
      return false;
    }
    return true;
  });
  const lives = (config.lives || []).filter((live) => {
    if (live.url && isLocal(live.url)) {
      console.log(`[cleaner] Removed live ${live.name || "unnamed"}: local url ${live.url}`);
      return false;
    }
    return true;
  });
  const removedSites = (config.sites?.length || 0) - sites.length;
  const removedLives = (config.lives?.length || 0) - lives.length;
  if (removedSites > 0 || removedLives > 0) {
    console.log(`[cleaner] Removed ${removedSites} sites, ${removedLives} lives with local refs`);
  }
  return { ...config, sites, lives };
}

// src/core/speedtest.ts
async function siteProbe(url, siteType, timeoutMs, deep) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const start = Date.now();
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": TVBOX_UA }
    });
    const speedMs = Date.now() - start;
    if (!resp.ok) return { speedMs: null, result: "error" };
    const body = await resp.text();
    if (!deep) {
      return { speedMs, result: body.length > 0 ? "ok" : "empty" };
    }
    const valid = validateResponseContent(siteType, body);
    return { speedMs, result: valid ? "ok" : "empty" };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return { speedMs: null, result: "timeout" };
    }
    return { speedMs: null, result: "error" };
  } finally {
    clearTimeout(timer);
  }
}
function validateResponseContent(siteType, body) {
  if (!body || body.length < 10) return false;
  if (siteType === 1) {
    try {
      const json = JSON.parse(body);
      if (Array.isArray(json.list) && json.list.length > 0) return true;
      if (Array.isArray(json.class) && json.class.length > 0) return true;
      return false;
    } catch {
      return false;
    }
  }
  if (siteType === 0) {
    if (body.includes("<list>") || body.includes("<video>") || body.includes("<class>")) return true;
    try {
      const json = JSON.parse(body);
      if (Array.isArray(json.list) && json.list.length > 0) return true;
      if (Array.isArray(json.class) && json.class.length > 0) return true;
      return false;
    } catch {
      return false;
    }
  }
  return body.length > 0;
}
async function batchSiteSpeedTest(sites, timeoutMs, deep = false) {
  const tasks = [];
  for (const site of sites) {
    const url = getTestableUrl(site);
    if (url) {
      tasks.push({ key: site.key, url, type: site.type });
    }
  }
  if (tasks.length === 0) return /* @__PURE__ */ new Map();
  logger.infoFields("speedtest", "batch-start", { sites: tasks.length, deep });
  const results = await Promise.allSettled(
    tasks.map(async ({ key, url, type }) => {
      const probe = await siteProbe(url, type, timeoutMs, deep);
      return { key, ...probe };
    })
  );
  const probeMap = /* @__PURE__ */ new Map();
  for (const result of results) {
    if (result.status === "fulfilled") {
      probeMap.set(result.value.key, result.value);
    }
  }
  const ok = [...probeMap.values()].filter((v) => v.result === "ok").length;
  const empty = [...probeMap.values()].filter((v) => v.result === "empty").length;
  logger.infoFields("speedtest", "batch-done", { ok, empty, error: probeMap.size - ok - empty, total: probeMap.size });
  return probeMap;
}
function appendSpeedToName(sites, speedMap) {
  return sites.map((site) => {
    const probe = speedMap.get(site.key);
    if (!probe || probe.speedMs == null) return site;
    const seconds = (probe.speedMs / 1e3).toFixed(1);
    return { ...site, name: `${site.name || site.key} [${seconds}s]` };
  });
}
function filterUnreachableSites(sites, speedMap) {
  const totalTestable = speedMap.size;
  if (totalTestable === 0) return { sites, filtered: 0 };
  const reachable = [];
  const unreachable = [];
  for (const site of sites) {
    const probe = speedMap.get(site.key);
    if (!probe) {
      reachable.push(site);
    } else if (probe.result === "ok") {
      reachable.push(site);
    } else {
      unreachable.push(site);
    }
  }
  const reachableTestable = reachable.filter((s) => speedMap.has(s.key)).length;
  if (totalTestable > 0 && reachableTestable / totalTestable < 0.1) {
    logger.warn("speedtest", `Safety valve: only ${reachableTestable}/${totalTestable} sites ok (<10%), keeping all`);
    return { sites, filtered: 0 };
  }
  logger.infoFields("speedtest", "filter-done", { filtered: unreachable.length, kept: reachable.length });
  return { sites: reachable, filtered: unreachable.length };
}
function getTestableUrl(site) {
  const api = site.api || "";
  if (site.type === 1) {
    return api.includes("?") ? `${api}&ac=list` : `${api}?ac=list`;
  }
  if (site.type === 0) {
    if (!api.startsWith("http")) return null;
    return api.includes("?") ? `${api}&ac=list` : `${api}?ac=list`;
  }
  if (site.type === 3) {
    if (api.startsWith("http://") || api.startsWith("https://")) return api;
    return null;
  }
  return null;
}

// src/core/cleaner.ts
var DEFAULT_CLEAN_PATTERNS = [
  /关注.*?公众号[：:\s]*[a-zA-Z0-9\u4e00-\u9fa5_-]*/g,
  /公众号[：:\s]*[a-zA-Z0-9\u4e00-\u9fa5_-]+/g,
  /[Vv][Xx][：:\s]*[a-zA-Z0-9_-]+/g,
  /加群[：:\s]*\d+/g,
  /QQ群?[：:\s]*\d+/g,
  /微信[：:\s]*[a-zA-Z0-9_-]+/g,
  /[Tt]elegram[：:\s]*@?[a-zA-Z0-9_]+/g,
  /[Tt][Gg][：:\s]*@?[a-zA-Z0-9_]+/g,
  /免费.*?观看/g,
  /更新.*?地址[：:\s]*\S+/g,
  /最新.*?地址[：:\s]*\S+/g,
  /备用.*?地址[：:\s]*\S+/g
];
var SEPARATOR_TRIM = /^[|｜/／\-—·\s]+|[|｜/／\-—·\s]+$/g;
var SEPARATOR_COLLAPSE = /[|｜/／\-—·]{2,}/g;
function transformSiteNames(config, transform) {
  if (!config.sites || config.sites.length === 0) return config;
  const patterns = buildPatterns(transform.extraCleanPatterns);
  const replacement = transform.promoReplacement || "";
  const sites = config.sites.map((site) => {
    let name = site.name || "";
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      name = name.replace(pattern, replacement);
    }
    name = name.replace(SEPARATOR_COLLAPSE, "|");
    name = name.replace(SEPARATOR_TRIM, "");
    if (transform.prefix) name = transform.prefix + name;
    if (transform.suffix) name = name + transform.suffix;
    if (!name.trim()) name = site.key;
    return { ...site, name };
  });
  return { ...config, sites };
}
function buildPatterns(extraPatterns) {
  const patterns = [...DEFAULT_CLEAN_PATTERNS];
  if (extraPatterns) {
    for (const p of extraPatterns) {
      try {
        patterns.push(new RegExp(p, "g"));
      } catch {
        console.warn(`[cleaner] Invalid extra pattern: ${p}`);
      }
    }
  }
  return patterns;
}

// src/core/source-scraper.ts
var MAX_PAGES = 10;
async function scrapeSourceList(cfg) {
  const allSources = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const html = await fetchPage(cfg, page);
      if (!html || !html.trim()) break;
      const sources = parsePage(html);
      if (sources.length === 0) break;
      allSources.push(...sources);
      console.log(`[source-scraper] Page ${page}: ${sources.length} sources`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[source-scraper] Page ${page} failed: ${msg}`);
      break;
    }
  }
  console.log(`[source-scraper] Total scraped: ${allSources.length} sources`);
  return allSources;
}
async function fetchPage(cfg, page) {
  const postResp = await fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "okhttp/3.12.0",
      "Referer": cfg.referer || cfg.url,
      "X-Requested-With": "XMLHttpRequest"
    },
    body: `action=load&page=source&type=one&paged=${page}`
  });
  if (postResp.ok) return postResp.text();
  if (page > 1) return "";
  const getResp = await fetch(cfg.url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      "Referer": cfg.referer || cfg.url
    }
  });
  if (!getResp.ok) throw new Error(`HTTP ${getResp.status}`);
  return getResp.text();
}
function parsePage(html) {
  const sources = [];
  const seen = /* @__PURE__ */ new Set();
  const nameRegex = /col-form-label">([^<]+)</g;
  const urlRegex = /value="([^"]+)"/g;
  const names = [];
  const urls = [];
  let m;
  while ((m = nameRegex.exec(html)) !== null) names.push(m[1].trim());
  while ((m = urlRegex.exec(html)) !== null) urls.push(m[1].trim());
  for (let i = 0; i < names.length && i < urls.length; i++) {
    const url = urls[i];
    if (url && (url.startsWith("http://") || url.startsWith("https://")) && !seen.has(url)) {
      seen.add(url);
      sources.push({ name: names[i], url });
    }
  }
  if (sources.length === 0) {
    const urlPattern = /https?:\/\/[^\s"'<>]+?\.(json|txt)(?=[^\w]|$)/g;
    while ((m = urlPattern.exec(html)) !== null) {
      let url = m[0];
      if (url.includes("jsonview?url=")) continue;
      if (/\.(css|js|png|jpg|gif|svg|ico)/.test(url)) continue;
      if (!seen.has(url)) {
        seen.add(url);
        const name = decodeURIComponent(url.split("/").pop()?.replace(/\.(json|txt)$/, "") || url.slice(-20));
        sources.push({ name, url });
      }
    }
    const specialPattern = /https?:\/\/[^\s"'<>]+?(?:\/tv|\/api|影视仓)[^\s"'<>]*/g;
    while ((m = specialPattern.exec(html)) !== null) {
      const url = m[0].replace(/["'<>].*$/, "");
      if (!seen.has(url) && !url.includes("jsonview")) {
        seen.add(url);
        const name = decodeURIComponent(url.split("/").pop() || "\u591A\u4ED3");
        sources.push({ name, url });
      }
    }
  }
  return sources;
}
async function scrapeMacCMSSources(cfg) {
  console.log("[maccms-scraper] Fetching from API...");
  const url = `${cfg.apiUrl}?t=${Math.floor(Date.now() / 1e3)}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`MacCMS API HTTP ${resp.status}`);
  }
  const json = await resp.json();
  if (json.code !== 200 || !json.data) {
    throw new Error(`MacCMS API error: code=${json.code}`);
  }
  const decrypted = await decryptData(json.data, cfg.aesKey, cfg.aesIv);
  const parsed = JSON.parse(decrypted);
  if (!parsed.list) {
    throw new Error("Decrypted data has no list field");
  }
  const sections = ["zanzhu", "m3u8"];
  const seen = /* @__PURE__ */ new Map();
  for (const section of sections) {
    const rows = parsed.list[section]?.rows || [];
    for (const row of rows) {
      if (!row.flag || !row.apis || !row.name) continue;
      if (!seen.has(row.flag)) {
        seen.set(row.flag, {
          key: row.flag,
          name: row.name,
          api: row.apis
        });
      }
    }
  }
  const entries = Array.from(seen.values());
  console.log(`[maccms-scraper] Scraped ${entries.length} unique sources`);
  return entries;
}
async function decryptData(base64Data, key, iv) {
  const keyBytes = new TextEncoder().encode(key);
  const ivBytes = new TextEncoder().encode(iv);
  const binaryStr = atob(base64Data);
  const ciphertext = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    ciphertext[i] = binaryStr.charCodeAt(i);
  }
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBytes },
    cryptoKey,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

// src/aggregator.ts
async function runAggregation(storage, config) {
  const startTime = Date.now();
  logger.info("aggregation", "Starting...");
  try {
    await _runAggregation(storage, config, startTime);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    logger.error("aggregation", `FATAL ERROR: ${msg}`);
    logger.error("aggregation", `Stack: ${stack}`);
    await storage.put(KV_LAST_UPDATE, `ERROR @ ${(/* @__PURE__ */ new Date()).toISOString()}: ${msg}`);
    await appendAggLog(storage, {
      id: new Date(startTime).toISOString(),
      startTime: new Date(startTime).toISOString(),
      endTime: (/* @__PURE__ */ new Date()).toISOString(),
      durationMs: Date.now() - startTime,
      success: false,
      errorMessage: msg,
      totalSources: 0,
      okSources: 0,
      failedSources: [],
      addedSites: [],
      removedSites: [],
      finalSiteCount: 0,
      finalParseCount: 0,
      finalLiveCount: 0,
      blacklistRemovedSites: 0,
      blacklistRemovedParses: 0,
      blacklistRemovedLives: 0
    });
  }
}
async function _runAggregation(storage, config, startTime) {
  let logFetchResults = [];
  let logBlacklistRemovedSites = 0;
  let logBlacklistRemovedParses = 0;
  let logBlacklistRemovedLives = 0;
  const snapshotRaw = await storage.get(KV_SITE_SNAPSHOT);
  const prevSiteKeys = snapshotRaw ? new Set(JSON.parse(snapshotRaw)) : /* @__PURE__ */ new Set();
  if (config.scrapeSourceUrl) {
    logger.info("aggregation", "Step 0: Auto-scraping sources...");
    try {
      const scrapeCfg = { url: config.scrapeSourceUrl, referer: config.scrapeSourceReferer || "" };
      const scraped = await scrapeSourceList(scrapeCfg);
      if (scraped.length > 0) {
        const existingRaw = await storage.get(KV_MANUAL_SOURCES);
        const existingSources = existingRaw ? JSON.parse(existingRaw) : [];
        const existingUrls = new Set(existingSources.map((s) => s.url));
        let added = 0;
        for (const source of scraped) {
          if (!existingUrls.has(source.url)) {
            existingSources.push(source);
            existingUrls.add(source.url);
            added++;
          }
        }
        if (added > 0) {
          await storage.put(KV_MANUAL_SOURCES, JSON.stringify(existingSources));
          logger.infoFields("aggregation", "auto-scrape-added", { added, total: existingSources.length });
        } else {
          logger.infoFields("aggregation", "auto-scrape-none-new", { scraped: scraped.length });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn("aggregation", `Auto-scrape failed (non-blocking): ${msg}`);
    }
  }
  if (config.maccmsApiUrl && config.maccmsAesKey && config.maccmsAesIv) {
    logger.info("aggregation", "Step 0.5: Auto-scraping MacCMS sources...");
    try {
      const maccmsCfg = { apiUrl: config.maccmsApiUrl, aesKey: config.maccmsAesKey, aesIv: config.maccmsAesIv };
      const scraped = await scrapeMacCMSSources(maccmsCfg);
      if (scraped.length > 0) {
        await storage.put(KV_MACCMS_SOURCES, JSON.stringify(scraped));
        logger.infoFields("aggregation", "maccms-auto-scraped", { count: scraped.length });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn("aggregation", `MacCMS auto-scrape failed (non-blocking): ${msg}`);
    }
  }
  logger.info("aggregation", "Step 1: Loading sources...");
  const raw2 = await storage.get(KV_MANUAL_SOURCES);
  const sources = raw2 ? JSON.parse(raw2) : [];
  const macCMSRaw = await storage.get(KV_MACCMS_SOURCES);
  const hasMacCMS = macCMSRaw ? JSON.parse(macCMSRaw).length > 0 : false;
  if (sources.length === 0 && !hasMacCMS) {
    logger.warn("aggregation", "No sources configured, nothing to do");
    return;
  }
  logger.infoFields("aggregation", "sources-loaded", { count: sources.length });
  await storage.put(KV_SOURCE_URLS, JSON.stringify(sources));
  logger.info("aggregation", "Step 1.5: Processing MacCMS sources...");
  const macCMSConfigs = await processMacCMSSources(storage, config);
  const remoteSources = sources.filter((s) => !s.url.startsWith("inline://"));
  const inlineSources = sources.filter((s) => s.url.startsWith("inline://"));
  const inlineConfigs = [];
  for (const src of inlineSources) {
    const kvKey = src.url.replace("inline://", "");
    const raw3 = await storage.get(kvKey);
    if (raw3) {
      const parsed = parseConfigJson(raw3);
      if (parsed) {
        inlineConfigs.push({ sourceUrl: src.url, sourceName: src.name || "Inline", config: parsed });
        logger.info("aggregation", `Loaded inline config: ${kvKey}`);
      } else {
        logger.warn("aggregation", `Failed to parse inline config: ${kvKey}`);
      }
    } else {
      logger.warn("aggregation", `Inline config not found in KV: ${kvKey}`);
    }
  }
  logger.info("aggregation", "Step 2: Fetching configs...");
  let proxyConfig;
  if (!config.workerBaseUrl) {
    const edgeRaw2 = await storage.get(KV_EDGE_PROXIES);
    if (edgeRaw2) {
      const edge = JSON.parse(edgeRaw2);
      const urls = [];
      if (edge.cf) urls.push(`${edge.cf}/fetch-proxy`);
      if (edge.vercel) urls.push(`${edge.vercel}/api/proxy`);
      if (urls.length > 0) {
        proxyConfig = { urls, token: config.adminToken };
        logger.info("aggregation", `Edge proxies configured: ${urls.join(", ")}`);
      }
    }
  }
  const { configs: sourcedConfigs, fetchResults } = await fetchConfigs(remoteSources, config.fetchTimeoutMs, proxyConfig);
  logFetchResults = fetchResults;
  await updateSourceHealth(storage, fetchResults);
  if (sourcedConfigs.length === 0 && inlineConfigs.length === 0 && macCMSConfigs.length === 0) {
    logger.warn("aggregation", "No valid configs fetched and no MacCMS/inline sources, keeping previous cache");
    return;
  }
  let filteredConfigs = sourcedConfigs;
  const configsWithSpeed = sourcedConfigs.filter((c) => c.speedMs != null);
  if (configsWithSpeed.length > 0) {
    logger.info("aggregation", "Step 3: Filtering configs by fetch speed...");
    filteredConfigs = sourcedConfigs.filter((c) => {
      if (c.speedMs == null) return true;
      if (c.speedMs <= config.speedTimeoutMs) return true;
      logger.infoFields("aggregation", "speed-filter-removed", { url: c.sourceUrl, speedMs: c.speedMs, threshold: config.speedTimeoutMs });
      return false;
    });
    if (filteredConfigs.length === 0) {
      logger.warn("aggregation", "All configs failed speed filter, using all fetched configs");
      filteredConfigs = sourcedConfigs;
    } else {
      logger.infoFields("aggregation", "speed-filter-passed", { passed: filteredConfigs.length, total: sourcedConfigs.length });
    }
  } else {
    logger.info("aggregation", "Step 3: No speed data available, skipping filter");
  }
  logger.info("aggregation", "Step 4: Merging configs...");
  const allConfigs = [...filteredConfigs, ...inlineConfigs, ...macCMSConfigs];
  const mergeResult = mergeConfigs(allConfigs);
  let merged = mergeResult.config;
  const siteSourceMap = mergeResult.siteSourceMap;
  logger.info("aggregation", "Step 4.5: Applying blacklist...");
  const blacklist = await loadBlacklist(storage);
  const hasBlacklist = blacklist.sites.length > 0 || blacklist.parses.length > 0 || blacklist.lives.length > 0 || blacklist.regexRules.some((r) => r.enabled);
  await storage.put(KV_MERGED_CONFIG_FULL, JSON.stringify(merged));
  if (hasBlacklist) {
    const pruned = await pruneBlacklist(blacklist, merged);
    if (JSON.stringify(pruned) !== JSON.stringify(blacklist)) {
      await saveBlacklist(storage, pruned);
    }
    const { config: filtered, removedSites: removedSites2, removedParses, removedLives, removedByRegex } = await applyBlacklist(merged, pruned);
    merged = filtered;
    logBlacklistRemovedSites = removedSites2;
    logBlacklistRemovedParses = removedParses;
    logBlacklistRemovedLives = removedLives;
    logger.infoFields("aggregation", "blacklist-removed", { sites: removedSites2, parses: removedParses, lives: removedLives, regex: removedByRegex });
  } else {
    logger.info("aggregation", "Step 4.5: No blacklist entries, skipping");
  }
  logger.info("aggregation", "Step 4.6: Cleaning invalid entries...");
  merged = cleanEmptyEntries(merged);
  merged = cleanLocalRefs(merged);
  const quotaConfig = await loadSearchQuota(storage);
  if (merged.sites) {
    const { sites: quotaSites, quotaReport } = applySearchQuota(merged.sites, quotaConfig, siteSourceMap);
    merged.sites = quotaSites;
    logger.infoFields("aggregation", "search-quota", {
      total: quotaReport.totalSites,
      jsExcluded: quotaReport.jsExcluded,
      pinned: quotaReport.pinnedCount,
      truncated: quotaReport.truncated,
      searchable: quotaReport.searchable
    });
    await storage.put(KV_SEARCH_QUOTA_REPORT, JSON.stringify({
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...quotaReport
    }));
  }
  const ntRaw = await storage.get(KV_NAME_TRANSFORM);
  const nameTransform = ntRaw ? JSON.parse(ntRaw) : {};
  const hasTransform = nameTransform.prefix || nameTransform.suffix || nameTransform.promoReplacement || nameTransform.extraCleanPatterns?.length;
  if (hasTransform) {
    logger.info("aggregation", "Step 5.5: Applying name transform...");
    merged = transformSiteNames(merged, nameTransform);
  } else {
    logger.info("aggregation", "Step 5.5: Cleaning promo text from site names...");
    merged = transformSiteNames(merged, {});
  }
  const credentials = await loadCredentials(storage);
  if (credentials.size > 0 && merged.sites && merged.sites.length > 0) {
    logger.info("aggregation", "Step 5.7: Injecting cloud credentials...");
    const credentialPolicy = await loadCredentialPolicy(storage);
    const jarBaseUrl = config.workerBaseUrl || config.localBaseUrl;
    const { sites: injectedSites, report: injReport } = injectCredentials(
      merged.sites,
      credentials,
      credentialPolicy,
      jarBaseUrl
    );
    merged.sites = injectedSites;
    logger.infoFields("aggregation", "credentials-injected", {
      injected: injReport.injected,
      skippedSafe: injReport.skippedSafe,
      highRisk: injReport.skippedHighRisk,
      unaudited: injReport.skippedUnaudited,
      noRule: injReport.skippedNoRule,
      noCredential: injReport.skippedNoCredential
    });
  } else {
    logger.info("aggregation", "Step 5.7: No cloud credentials configured, skipping");
  }
  const speedTestRaw = await storage.get(KV_SPEED_TEST_ENABLED);
  const speedTestEnabled = speedTestRaw !== "false";
  const probeDepthRaw = await storage.get(KV_SITE_PROBE_DEPTH);
  const probeDeep = probeDepthRaw !== "shallow" && !config.workerBaseUrl;
  let siteProbeMap = /* @__PURE__ */ new Map();
  let siteSpeedMap = /* @__PURE__ */ new Map();
  if (!speedTestEnabled) {
    logger.info("aggregation", "Step 6: Speed test disabled, skipping");
  } else if (merged.sites && merged.sites.length > 0) {
    logger.infoFields("aggregation", "Step 6: site probe", { depth: probeDeep ? "deep" : "shallow" });
    siteProbeMap = await batchSiteSpeedTest(merged.sites, config.siteTimeoutMs, probeDeep);
    for (const [key, probe] of siteProbeMap) {
      siteSpeedMap.set(key, probe.speedMs);
    }
    if (siteProbeMap.size > 0) {
      const { sites: filteredSites, filtered } = filterUnreachableSites(merged.sites, siteProbeMap);
      merged.sites = filteredSites;
      if (!config.workerBaseUrl) {
        merged.sites = appendSpeedToName(merged.sites, siteProbeMap);
      }
    }
    await updateSiteHealth(storage, siteProbeMap, merged);
  } else {
    logger.info("aggregation", "Step 6: No sites to test");
  }
  const dedupRaw = await storage.get(KV_DEDUP_CONFIG);
  let similarDedupEnabled = true;
  let similarDedupThreshold = 0.85;
  if (dedupRaw) {
    try {
      const dedupCfg = JSON.parse(dedupRaw);
      similarDedupEnabled = dedupCfg.similarDedup !== false;
      similarDedupThreshold = typeof dedupCfg.similarDedupThreshold === "number" ? dedupCfg.similarDedupThreshold : 0.85;
    } catch {
    }
  }
  if (similarDedupEnabled && merged.sites && merged.sites.length > 0) {
    logger.infoFields("aggregation", "Step 6.2: similar-name-dedup", { threshold: similarDedupThreshold });
    merged.sites = deduplicateSimilarNames(merged.sites, siteSpeedMap, similarDedupThreshold);
    logger.infoFields("aggregation", "similar-dedup-done", { sites: merged.sites.length });
  } else {
    logger.info("aggregation", "Step 6.2: Similar-name dedup disabled, skipping");
  }
  const liveDisabledRaw = await storage.get(KV_LIVE_DISABLED);
  const liveDisabled = liveDisabledRaw === "true";
  if (liveDisabled) {
    logger.info("aggregation", "Step 6.5: Live disabled, skipping");
    merged.lives = [];
  } else if (config.workerBaseUrl) {
    logger.info("aggregation", "Step 6.5: Skipped on CF (subrequest limit, use Docker for channel merging)");
  } else {
    logger.info("aggregation", "Step 6.5: Channel-level live merging...");
    {
      const liveInputs = [];
      for (const l of merged.lives || []) {
        if (l.group && !l.url && !l.api) continue;
        const u = l.url || l.api;
        if (!u || !/^https?:\/\//i.test(u)) continue;
        if (u.includes("127.0.0.1") || u.includes("localhost")) continue;
        liveInputs.push({
          name: l.name || "source",
          url: u,
          ua: l.ua,
          header: l.header
        });
      }
      const liveRaw = await storage.get(KV_LIVE_SOURCES);
      if (liveRaw) {
        try {
          const manual = JSON.parse(liveRaw);
          for (const m of manual) {
            if (!m.url || !/^https?:\/\//i.test(m.url)) continue;
            if (m.url.includes("127.0.0.1") || m.url.includes("localhost")) continue;
            liveInputs.push({ name: m.name || "manual", url: m.url });
          }
        } catch {
        }
      }
      const seen = /* @__PURE__ */ new Set();
      const uniqueInputs = liveInputs.filter((i) => {
        if (seen.has(i.url)) return false;
        seen.add(i.url);
        return true;
      });
      if (uniqueInputs.length === 0) {
        logger.info("aggregation", "Step 6.5: No live sources to merge");
        merged.lives = [];
      } else {
        logger.infoFields("aggregation", "Step 6.5: live-sources", { unique: uniqueInputs.length });
        const channelSpeedMap = await loadSpeedMap(storage);
        const mergeResult2 = await mergeLivesToNative(uniqueInputs, config.fetchTimeoutMs, channelSpeedMap);
        merged.lives = mergeResult2.groups;
        await storage.put(KV_CHANNEL_MERGED_TREE, JSON.stringify(mergeResult2.groups));
        logger.infoFields("aggregation", "live-merge-done", {
          downloaded: mergeResult2.sourcesDownloaded,
          total: uniqueInputs.length,
          groups: mergeResult2.groups.length,
          channels: mergeResult2.totalChannels,
          urls: mergeResult2.totalUrls
        });
      }
    }
  }
  const groupOrderCfg = await loadGroupOrder(storage);
  if (groupOrderCfg.enabled && merged.sites && merged.sites.length > 0) {
    logger.info("aggregation", "Step 6.8: Applying custom group order...");
    merged.sites = applyGroupOrder(merged.sites, groupOrderCfg);
  } else {
    logger.info("aggregation", "Step 6.8: Group order disabled or no rules, skipping");
  }
  logger.infoFields("aggregation", "Step 7: rewriting JAR URLs", { placeholder: BASE_URL_PLACEHOLDER });
  merged = await rewriteJarUrls(merged, BASE_URL_PLACEHOLDER, storage);
  const edgeRaw = await storage.get(KV_EDGE_PROXIES);
  if (edgeRaw) {
    const edge = JSON.parse(edgeRaw);
    if (edge.cf) {
      merged.pic = `${edge.cf.replace(/\/$/, "")}/img/`;
      logger.infoFields("aggregation", "pic-proxy-injected-edge", { pic: merged.pic });
    } else {
      merged.pic = `${BASE_URL_PLACEHOLDER}/img/`;
      logger.infoFields("aggregation", "pic-proxy-placeholder", { pic: merged.pic });
    }
  } else {
    merged.pic = `${BASE_URL_PLACEHOLDER}/img/`;
    logger.infoFields("aggregation", "pic-proxy-placeholder", { pic: merged.pic });
  }
  const mergedJson = JSON.stringify(merged);
  await storage.put(KV_MERGED_CONFIG, mergedJson);
  await storage.put(KV_LAST_UPDATE, (/* @__PURE__ */ new Date()).toISOString());
  const elapsed = ((Date.now() - startTime) / 1e3).toFixed(1);
  logger.infoFields("aggregation", "done", {
    elapsed: `${elapsed}s`,
    sites: merged.sites?.length,
    parses: merged.parses?.length,
    lives: merged.lives?.length
  });
  const nowSiteKeys = new Set((merged.sites || []).map((s) => s.key));
  const siteKeyToName = new Map((merged.sites || []).map((s) => [s.key, s.name || s.key]));
  const addedSites = [];
  for (const key of nowSiteKeys) {
    if (!prevSiteKeys.has(key)) {
      addedSites.push({ key, name: siteKeyToName.get(key) });
    }
  }
  const removedSites = [];
  for (const key of prevSiteKeys) {
    if (!nowSiteKeys.has(key)) {
      removedSites.push({ key });
    }
  }
  const failedSources = logFetchResults.filter((r) => r.status !== "ok").map((r) => ({ url: r.url, name: r.name, status: r.status, errorMessage: r.errorMessage }));
  const aggLog = {
    id: new Date(startTime).toISOString(),
    startTime: new Date(startTime).toISOString(),
    endTime: (/* @__PURE__ */ new Date()).toISOString(),
    durationMs: Date.now() - startTime,
    success: true,
    totalSources: logFetchResults.length,
    okSources: logFetchResults.filter((r) => r.status === "ok").length,
    failedSources,
    addedSites,
    removedSites,
    finalSiteCount: merged.sites?.length || 0,
    finalParseCount: merged.parses?.length || 0,
    finalLiveCount: merged.lives?.length || 0,
    blacklistRemovedSites: logBlacklistRemovedSites,
    blacklistRemovedParses: logBlacklistRemovedParses,
    blacklistRemovedLives: logBlacklistRemovedLives
  };
  await appendAggLog(storage, aggLog);
  await storage.put(KV_SITE_SNAPSHOT, JSON.stringify([...nowSiteKeys]));
  if (addedSites.length > 0 || removedSites.length > 0) {
    logger.infoFields("aggregation", "site-diff", { added: addedSites.length, removed: removedSites.length });
  }
}
async function processMacCMSSources(storage, config) {
  const raw2 = await storage.get(KV_MACCMS_SOURCES);
  const entries = raw2 ? JSON.parse(raw2) : [];
  if (entries.length === 0) {
    logger.info("aggregation", "No MacCMS sources configured");
    return [];
  }
  logger.infoFields("aggregation", "maccms-sources-found", { count: entries.length });
  let validEntries;
  let speedMap;
  const edgeProxiesRaw = !config.workerBaseUrl ? await storage.get(KV_EDGE_PROXIES) : null;
  if (config.workerBaseUrl || edgeProxiesRaw) {
    logger.info("aggregation", `Skipping MacCMS validation (${config.workerBaseUrl ? "CF proxy" : "edge proxy configured"})`);
    validEntries = entries;
  } else {
    logger.info("aggregation", "Local mode (no edge proxy): validating MacCMS sources...");
    const result = await processMacCMSForLocal(entries, config.siteTimeoutMs);
    validEntries = result.passed;
    speedMap = result.speedMap;
  }
  if (validEntries.length === 0) {
    logger.warn("aggregation", "No valid MacCMS sources after processing");
    return [];
  }
  const sites = macCMSToTVBoxSites(validEntries, BASE_URL_PLACEHOLDER, speedMap);
  logger.infoFields("aggregation", "maccms-converted", { sites: sites.length });
  return [{
    sourceUrl: "maccms://builtin",
    sourceName: "MacCMS Sources",
    config: { sites }
  }];
}
async function updateSourceHealth(storage, fetchResults) {
  if (fetchResults.length === 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const raw2 = await storage.get(KV_SOURCE_HEALTH);
  const oldRecords = raw2 ? JSON.parse(raw2) : [];
  const oldMap = new Map(oldRecords.map((r) => [r.url, r]));
  const fetchedUrls = new Set(fetchResults.map((r) => r.url));
  const newRecords = [];
  for (const fr of fetchResults) {
    const old = oldMap.get(fr.url);
    if (fr.status === "ok") {
      newRecords.push({
        url: fr.url,
        name: fr.name,
        latestStatus: "ok",
        consecutiveFailures: 0,
        lastSuccessTime: now,
        lastFailTime: old?.lastFailTime,
        lastFailReason: old?.lastFailReason,
        lastSpeedMs: fr.speedMs
      });
    } else {
      newRecords.push({
        url: fr.url,
        name: fr.name,
        latestStatus: fr.status,
        consecutiveFailures: (old?.consecutiveFailures ?? 0) + 1,
        lastSuccessTime: old?.lastSuccessTime,
        lastFailTime: now,
        lastFailReason: fr.errorMessage,
        lastSpeedMs: old?.lastSpeedMs
      });
    }
  }
  const failCount = newRecords.filter((r) => r.consecutiveFailures > 0).length;
  if (failCount > 0) {
    logger.infoFields("aggregation", "source-health", { ok: newRecords.length - failCount, failing: failCount });
  }
  await storage.put(KV_SOURCE_HEALTH, JSON.stringify(newRecords));
}
async function updateSiteHealth(storage, probeMap, merged) {
  if (probeMap.size === 0) return;
  const raw2 = await storage.get(KV_SITE_HEALTH_MAP);
  const healthMap = raw2 ? JSON.parse(raw2) : {};
  const now = (/* @__PURE__ */ new Date()).toISOString();
  for (const [key, probe] of probeMap) {
    const prev = healthMap[key];
    if (probe.result === "ok") {
      healthMap[key] = { consecutiveFailures: 0, lastProbeTime: now, lastProbeResult: "ok", lastSuccessTime: now };
    } else {
      healthMap[key] = {
        consecutiveFailures: (prev?.consecutiveFailures ?? 0) + 1,
        lastProbeTime: now,
        lastProbeResult: probe.result,
        lastSuccessTime: prev?.lastSuccessTime
      };
    }
  }
  if (merged.sites) {
    for (let i = 0; i < merged.sites.length; i++) {
      const h = healthMap[merged.sites[i].key];
      if (h && h.consecutiveFailures >= 3) {
        const name = merged.sites[i].name || merged.sites[i].key;
        if (!name.includes("[\u26A0]")) {
          merged.sites[i] = { ...merged.sites[i], name: `${name} [\u26A0]` };
        }
      }
    }
  }
  const autoCleanRaw = await storage.get(KV_SITE_AUTO_CLEAN);
  if (autoCleanRaw === "true" && merged.sites) {
    const blacklist = await loadBlacklist(storage);
    let cleaned = 0;
    const MAX_AUTO_CLEAN = 5;
    for (const site of merged.sites) {
      if (cleaned >= MAX_AUTO_CLEAN) break;
      const h = healthMap[site.key];
      if (h && h.consecutiveFailures >= 5) {
        const fp = await siteFingerprint(site);
        if (!blacklist.sites.includes(fp)) {
          blacklist.sites.push(fp);
          cleaned++;
          logger.infoFields("aggregation", "auto-clean-blacklisted", { key: site.key, name: site.name, failures: h.consecutiveFailures });
        }
      }
    }
    if (cleaned > 0) {
      await saveBlacklist(storage, blacklist);
      logger.infoFields("aggregation", "auto-clean-done", { cleaned });
    }
  }
  await storage.put(KV_SITE_HEALTH_MAP, JSON.stringify(healthMap));
}
async function appendAggLog(storage, log) {
  try {
    const raw2 = await storage.get(KV_AGG_LOGS);
    const logs = raw2 ? JSON.parse(raw2) : [];
    logs.push(log);
    while (logs.length > AGG_LOGS_MAX) {
      logs.shift();
    }
    await storage.put(KV_AGG_LOGS, JSON.stringify(logs));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("aggregation", `Failed to write agg log: ${msg}`);
  }
}

// src/eo-entry.ts
if (typeof globalThis.caches === "undefined") {
  globalThis.caches = {
    default: {
      match: async () => void 0,
      put: async () => void 0,
      delete: async () => false
    }
  };
}
function buildConfig(env) {
  return {
    adminToken: env.ADMIN_TOKEN,
    refreshToken: env.REFRESH_TOKEN,
    speedTimeoutMs: parseInt(env.SPEED_TIMEOUT_MS || "") || DEFAULT_SPEED_TIMEOUT_MS,
    siteTimeoutMs: parseInt(env.SITE_TIMEOUT_MS || "") || DEFAULT_SITE_TIMEOUT_MS,
    fetchTimeoutMs: parseInt(env.FETCH_TIMEOUT_MS || "") || DEFAULT_FETCH_TIMEOUT_MS,
    workerBaseUrl: env.WORKER_BASE_URL || void 0
  };
}
async function onRequest(context) {
  const kv = globalThis.TVBOX_KV;
  if (!kv) {
    return new Response("KV binding TVBOX_KV is not configured", { status: 500 });
  }
  const env = context.env || {};
  const storage = new EOKVStorage(kv);
  const config = buildConfig(env);
  const app = createApp({
    storage,
    config,
    triggerRefresh: () => runAggregation(storage, config)
  });
  const executionCtx = {
    waitUntil: (p) => {
      if (typeof context.waitUntil === "function") {
        context.waitUntil(p);
      } else {
        Promise.resolve(p).catch(() => {
        });
      }
    },
    passThroughOnException: () => {
    }
  };
  return app.fetch(context.request, env, executionCtx);
}
export {
  onRequest
};
