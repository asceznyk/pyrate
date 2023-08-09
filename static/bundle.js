(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.XXX = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightSyntax = void 0;
const python_1 = require("@lezer/python");
function highlightSyntax(program, renderDiv, lineHeight) {
    function isAlphaNumeric(str) {
        let ascii, i, len;
        for (i = 0, len = str.length; i < len; i++) {
            ascii = str.charCodeAt(i);
            if (!(ascii > 47 && ascii < 58) && // numeric (0-9)
                !(ascii > 64 && ascii < 91) && // upper alpha (A-Z)
                !(ascii > 96 && ascii < 123) // lower alpha (a-z)
            ) {
                return false;
            }
        }
        return true;
    }
    ;
    function createLine() {
        let lDiv = document.createElement("div");
        lDiv.setAttribute('style', `position:relative; height:${lineHeight}px;`);
        renderDiv.appendChild(lDiv);
        return lDiv;
    }
    function fillWhiteSpace(from, to) {
        for (let i = from; i < to; i++) {
            if (program[i] == '\n')
                lineDiv = createLine();
            else if (program[i] == ' ')
                lineDiv.innerHTML += '&nbsp';
        }
    }
    function getKWType(node, clsname, value) {
        cls = clsname.toLowerCase();
        if (cls == value)
            cls = isAlphaNumeric(value) ? "keyword" : "seperator";
        else if (cls.endsWith("op"))
            cls = "operator";
        else if (node._parent != null &&
            node._parent.type.clsname == 'FunctionDefinition' &&
            clsname == 'VariableName')
            cls = "def";
        return cls;
    }
    function fillNodeColor() {
        let [from, to] = [treeCursor.from, treeCursor.to];
        let kw = getKWType(treeCursor.node, treeCursor.name, program.slice(from, to));
        let kwSpan = document.createElement("span");
        kwSpan.classList.add(`py-${kw}`);
        for (let i = from; i < to; i++) {
            if (program[i] == '\n') {
                lineDiv.appendChild(kwSpan);
                kwSpan = document.createElement("span");
                kwSpan.classList.add(`py-${kw}`);
                lineDiv = createLine();
                continue;
            }
            kwSpan.innerHTML += program[i];
        }
        lineDiv.appendChild(kwSpan);
    }
    renderDiv.innerHTML = '';
    let treeCursor = python_1.parser.parse(program).cursor();
    let lineDiv;
    let prevPoint = 0;
    let cls;
    lineDiv = createLine();
    while (treeCursor.next()) {
        if (treeCursor.node.firstChild != null)
            continue;
        fillWhiteSpace(prevPoint, treeCursor.from);
        fillNodeColor();
        prevPoint = treeCursor.to;
    }
}
exports.highlightSyntax = highlightSyntax;

},{"@lezer/python":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const highlight_1 = require("./highlight");
const hscl = 7.83;
const vscl = 16;
const tabStr = "    ";
const code = document.querySelector("#code");
const lines = document.querySelector("#lines");
const capture = document.querySelector("#capture");
const cursor = document.querySelector("#cursor");
(function () {
    function followCursor() {
        let value = capture.value.slice(0, capture.selectionStart);
        let matches = [...value.matchAll(/\n/g)];
        let cy = matches.length;
        let cx = value.length;
        if (cy > 0) {
            cx = value.slice(matches[cy - 1].index, value.length).replace('\n', '').length;
        }
        cursor.setAttribute('style', `top:${cy * vscl}px; left:${(cx + lineOffset + 1) * hscl}px`);
    }
    function isArrow(keycode) {
        return (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40);
    }
    function validateKey(keycode) {
        let valid = (keycode > 47 && keycode < 58) || // number keys
            (keycode == 32 || keycode == 13 || keycode == 8 || keycode == 9) ||
            isArrow(keycode) ||
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223); // [\]' (in order)
        return valid;
    }
    function setLineNums(program) {
        let numLines = program.split('\n').length;
        lineOffset = numLines.toString().length + 1;
        lines.innerHTML = '';
        for (let i = 0; i < numLines; i++) {
            let offLine = '';
            for (let k = 0; k < lineOffset - (i + 1).toString().length; k++)
                offLine += '&nbsp;';
            lines.innerHTML += `<div class='line-num' style='height:${vscl}px;'>${offLine}${i + 1}&nbsp;</div>`;
        }
        let wOff = (lineOffset + 1) * hscl;
        lines.setAttribute('style', `width:${wOff}px`);
        code.setAttribute('style', `width:calc(100% - ${wOff}px); height:${lines.offsetHeight}px;`);
    }
    let lineOffset;
    let initOff = 3 * hscl;
    lines.innerHTML = `<div class='line-num' style='height:${vscl}px'>&nbsp;1&nbsp;</div>`;
    lines.setAttribute('style', `width:${initOff}px`);
    code.setAttribute('style', `width:calc(100% - ${initOff}px)`);
    cursor.setAttribute('style', `left:${initOff}px`);
    code.addEventListener("click", () => {
        capture.focus();
    });
    capture.addEventListener("keyup", (e) => {
        let keycode = e.keyCode;
        if (validateKey(keycode)) {
            if (!isArrow(keycode)) {
                let val = capture.value;
                setLineNums(val);
                (0, highlight_1.highlightSyntax)(val, code, vscl);
            }
        }
        followCursor();
    });
    capture.addEventListener("keydown", (e) => {
        let keycode = e.keyCode;
        if (validateKey(keycode)) {
            if (keycode == 9) {
                e.preventDefault();
                let tgt = e.target;
                let start = tgt.selectionStart;
                let end = tgt.selectionEnd;
                tgt.value = tgt.value.substring(0, start) + tabStr + tgt.value.substring(end);
                tgt.selectionStart = tgt.selectionEnd = start + tabStr.length;
            }
            followCursor();
        }
    });
})();

},{"./highlight":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// FIXME profile adding a per-Tree TreeNode cache, validating it by
// parent pointer
/// The default maximum length of a `TreeBuffer` node.
const DefaultBufferLength = 1024;
let nextPropID = 0;
class Range {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}
/// Each [node type](#common.NodeType) or [individual tree](#common.Tree)
/// can have metadata associated with it in props. Instances of this
/// class represent prop names.
class NodeProp {
    /// Create a new node prop type.
    constructor(config = {}) {
        this.id = nextPropID++;
        this.perNode = !!config.perNode;
        this.deserialize = config.deserialize || (() => {
            throw new Error("This node type doesn't define a deserialize function");
        });
    }
    /// This is meant to be used with
    /// [`NodeSet.extend`](#common.NodeSet.extend) or
    /// [`LRParser.configure`](#lr.ParserConfig.props) to compute
    /// prop values for each node type in the set. Takes a [match
    /// object](#common.NodeType^match) or function that returns undefined
    /// if the node type doesn't get this prop, and the prop's value if
    /// it does.
    add(match) {
        if (this.perNode)
            throw new RangeError("Can't add per-node props to node types");
        if (typeof match != "function")
            match = NodeType.match(match);
        return (type) => {
            let result = match(type);
            return result === undefined ? null : [this, result];
        };
    }
}
/// Prop that is used to describe matching delimiters. For opening
/// delimiters, this holds an array of node names (written as a
/// space-separated string when declaring this prop in a grammar)
/// for the node types of closing delimiters that match it.
NodeProp.closedBy = new NodeProp({ deserialize: str => str.split(" ") });
/// The inverse of [`closedBy`](#common.NodeProp^closedBy). This is
/// attached to closing delimiters, holding an array of node names
/// of types of matching opening delimiters.
NodeProp.openedBy = new NodeProp({ deserialize: str => str.split(" ") });
/// Used to assign node types to groups (for example, all node
/// types that represent an expression could be tagged with an
/// `"Expression"` group).
NodeProp.group = new NodeProp({ deserialize: str => str.split(" ") });
/// The hash of the [context](#lr.ContextTracker.constructor)
/// that the node was parsed in, if any. Used to limit reuse of
/// contextual nodes.
NodeProp.contextHash = new NodeProp({ perNode: true });
/// The distance beyond the end of the node that the tokenizer
/// looked ahead for any of the tokens inside the node. (The LR
/// parser only stores this when it is larger than 25, for
/// efficiency reasons.)
NodeProp.lookAhead = new NodeProp({ perNode: true });
/// This per-node prop is used to replace a given node, or part of a
/// node, with another tree. This is useful to include trees from
/// different languages in mixed-language parsers.
NodeProp.mounted = new NodeProp({ perNode: true });
/// A mounted tree, which can be [stored](#common.NodeProp^mounted) on
/// a tree node to indicate that parts of its content are
/// represented by another tree.
class MountedTree {
    constructor(
    /// The inner tree.
    tree, 
    /// If this is null, this tree replaces the entire node (it will
    /// be included in the regular iteration instead of its host
    /// node). If not, only the given ranges are considered to be
    /// covered by this tree. This is used for trees that are mixed in
    /// a way that isn't strictly hierarchical. Such mounted trees are
    /// only entered by [`resolveInner`](#common.Tree.resolveInner)
    /// and [`enter`](#common.SyntaxNode.enter).
    overlay, 
    /// The parser used to create this subtree.
    parser) {
        this.tree = tree;
        this.overlay = overlay;
        this.parser = parser;
    }
}
const noProps = Object.create(null);
/// Each node in a syntax tree has a node type associated with it.
class NodeType {
    /// @internal
    constructor(
    /// The name of the node type. Not necessarily unique, but if the
    /// grammar was written properly, different node types with the
    /// same name within a node set should play the same semantic
    /// role.
    name, 
    /// @internal
    props, 
    /// The id of this node in its set. Corresponds to the term ids
    /// used in the parser.
    id, 
    /// @internal
    flags = 0) {
        this.name = name;
        this.props = props;
        this.id = id;
        this.flags = flags;
    }
    /// Define a node type.
    static define(spec) {
        let props = spec.props && spec.props.length ? Object.create(null) : noProps;
        let flags = (spec.top ? 1 /* NodeFlag.Top */ : 0) | (spec.skipped ? 2 /* NodeFlag.Skipped */ : 0) |
            (spec.error ? 4 /* NodeFlag.Error */ : 0) | (spec.name == null ? 8 /* NodeFlag.Anonymous */ : 0);
        let type = new NodeType(spec.name || "", props, spec.id, flags);
        if (spec.props)
            for (let src of spec.props) {
                if (!Array.isArray(src))
                    src = src(type);
                if (src) {
                    if (src[0].perNode)
                        throw new RangeError("Can't store a per-node prop on a node type");
                    props[src[0].id] = src[1];
                }
            }
        return type;
    }
    /// Retrieves a node prop for this type. Will return `undefined` if
    /// the prop isn't present on this node.
    prop(prop) { return this.props[prop.id]; }
    /// True when this is the top node of a grammar.
    get isTop() { return (this.flags & 1 /* NodeFlag.Top */) > 0; }
    /// True when this node is produced by a skip rule.
    get isSkipped() { return (this.flags & 2 /* NodeFlag.Skipped */) > 0; }
    /// Indicates whether this is an error node.
    get isError() { return (this.flags & 4 /* NodeFlag.Error */) > 0; }
    /// When true, this node type doesn't correspond to a user-declared
    /// named node, for example because it is used to cache repetition.
    get isAnonymous() { return (this.flags & 8 /* NodeFlag.Anonymous */) > 0; }
    /// Returns true when this node's name or one of its
    /// [groups](#common.NodeProp^group) matches the given string.
    is(name) {
        if (typeof name == 'string') {
            if (this.name == name)
                return true;
            let group = this.prop(NodeProp.group);
            return group ? group.indexOf(name) > -1 : false;
        }
        return this.id == name;
    }
    /// Create a function from node types to arbitrary values by
    /// specifying an object whose property names are node or
    /// [group](#common.NodeProp^group) names. Often useful with
    /// [`NodeProp.add`](#common.NodeProp.add). You can put multiple
    /// names, separated by spaces, in a single property name to map
    /// multiple node names to a single value.
    static match(map) {
        let direct = Object.create(null);
        for (let prop in map)
            for (let name of prop.split(" "))
                direct[name] = map[prop];
        return (node) => {
            for (let groups = node.prop(NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++) {
                let found = direct[i < 0 ? node.name : groups[i]];
                if (found)
                    return found;
            }
        };
    }
}
/// An empty dummy node type to use when no actual type is available.
NodeType.none = new NodeType("", Object.create(null), 0, 8 /* NodeFlag.Anonymous */);
/// A node set holds a collection of node types. It is used to
/// compactly represent trees by storing their type ids, rather than a
/// full pointer to the type object, in a numeric array. Each parser
/// [has](#lr.LRParser.nodeSet) a node set, and [tree
/// buffers](#common.TreeBuffer) can only store collections of nodes
/// from the same set. A set can have a maximum of 2**16 (65536) node
/// types in it, so that the ids fit into 16-bit typed array slots.
class NodeSet {
    /// Create a set with the given types. The `id` property of each
    /// type should correspond to its position within the array.
    constructor(
    /// The node types in this set, by id.
    types) {
        this.types = types;
        for (let i = 0; i < types.length; i++)
            if (types[i].id != i)
                throw new RangeError("Node type ids should correspond to array positions when creating a node set");
    }
    /// Create a copy of this set with some node properties added. The
    /// arguments to this method can be created with
    /// [`NodeProp.add`](#common.NodeProp.add).
    extend(...props) {
        let newTypes = [];
        for (let type of this.types) {
            let newProps = null;
            for (let source of props) {
                let add = source(type);
                if (add) {
                    if (!newProps)
                        newProps = Object.assign({}, type.props);
                    newProps[add[0].id] = add[1];
                }
            }
            newTypes.push(newProps ? new NodeType(type.name, newProps, type.id, type.flags) : type);
        }
        return new NodeSet(newTypes);
    }
}
const CachedNode = new WeakMap(), CachedInnerNode = new WeakMap();
/// Options that control iteration. Can be combined with the `|`
/// operator to enable multiple ones.
exports.IterMode = void 0;
(function (IterMode) {
    /// When enabled, iteration will only visit [`Tree`](#common.Tree)
    /// objects, not nodes packed into
    /// [`TreeBuffer`](#common.TreeBuffer)s.
    IterMode[IterMode["ExcludeBuffers"] = 1] = "ExcludeBuffers";
    /// Enable this to make iteration include anonymous nodes (such as
    /// the nodes that wrap repeated grammar constructs into a balanced
    /// tree).
    IterMode[IterMode["IncludeAnonymous"] = 2] = "IncludeAnonymous";
    /// By default, regular [mounted](#common.NodeProp^mounted) nodes
    /// replace their base node in iteration. Enable this to ignore them
    /// instead.
    IterMode[IterMode["IgnoreMounts"] = 4] = "IgnoreMounts";
    /// This option only applies in
    /// [`enter`](#common.SyntaxNode.enter)-style methods. It tells the
    /// library to not enter mounted overlays if one covers the given
    /// position.
    IterMode[IterMode["IgnoreOverlays"] = 8] = "IgnoreOverlays";
})(exports.IterMode || (exports.IterMode = {}));
/// A piece of syntax tree. There are two ways to approach these
/// trees: the way they are actually stored in memory, and the
/// convenient way.
///
/// Syntax trees are stored as a tree of `Tree` and `TreeBuffer`
/// objects. By packing detail information into `TreeBuffer` leaf
/// nodes, the representation is made a lot more memory-efficient.
///
/// However, when you want to actually work with tree nodes, this
/// representation is very awkward, so most client code will want to
/// use the [`TreeCursor`](#common.TreeCursor) or
/// [`SyntaxNode`](#common.SyntaxNode) interface instead, which provides
/// a view on some part of this data structure, and can be used to
/// move around to adjacent nodes.
class Tree {
    /// Construct a new tree. See also [`Tree.build`](#common.Tree^build).
    constructor(
    /// The type of the top node.
    type, 
    /// This node's child nodes.
    children, 
    /// The positions (offsets relative to the start of this tree) of
    /// the children.
    positions, 
    /// The total length of this tree
    length, 
    /// Per-node [node props](#common.NodeProp) to associate with this node.
    props) {
        this.type = type;
        this.children = children;
        this.positions = positions;
        this.length = length;
        /// @internal
        this.props = null;
        if (props && props.length) {
            this.props = Object.create(null);
            for (let [prop, value] of props)
                this.props[typeof prop == "number" ? prop : prop.id] = value;
        }
    }
    /// @internal
    toString() {
        let mounted = this.prop(NodeProp.mounted);
        if (mounted && !mounted.overlay)
            return mounted.tree.toString();
        let children = "";
        for (let ch of this.children) {
            let str = ch.toString();
            if (str) {
                if (children)
                    children += ",";
                children += str;
            }
        }
        return !this.type.name ? children :
            (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) +
                (children.length ? "(" + children + ")" : "");
    }
    /// Get a [tree cursor](#common.TreeCursor) positioned at the top of
    /// the tree. Mode can be used to [control](#common.IterMode) which
    /// nodes the cursor visits.
    cursor(mode = 0) {
        return new TreeCursor(this.topNode, mode);
    }
    /// Get a [tree cursor](#common.TreeCursor) pointing into this tree
    /// at the given position and side (see
    /// [`moveTo`](#common.TreeCursor.moveTo).
    cursorAt(pos, side = 0, mode = 0) {
        let scope = CachedNode.get(this) || this.topNode;
        let cursor = new TreeCursor(scope);
        cursor.moveTo(pos, side);
        CachedNode.set(this, cursor._tree);
        return cursor;
    }
    /// Get a [syntax node](#common.SyntaxNode) object for the top of the
    /// tree.
    get topNode() {
        return new TreeNode(this, 0, 0, null);
    }
    /// Get the [syntax node](#common.SyntaxNode) at the given position.
    /// If `side` is -1, this will move into nodes that end at the
    /// position. If 1, it'll move into nodes that start at the
    /// position. With 0, it'll only enter nodes that cover the position
    /// from both sides.
    ///
    /// Note that this will not enter
    /// [overlays](#common.MountedTree.overlay), and you often want
    /// [`resolveInner`](#common.Tree.resolveInner) instead.
    resolve(pos, side = 0) {
        let node = resolveNode(CachedNode.get(this) || this.topNode, pos, side, false);
        CachedNode.set(this, node);
        return node;
    }
    /// Like [`resolve`](#common.Tree.resolve), but will enter
    /// [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
    /// pointing into the innermost overlaid tree at the given position
    /// (with parent links going through all parent structure, including
    /// the host trees).
    resolveInner(pos, side = 0) {
        let node = resolveNode(CachedInnerNode.get(this) || this.topNode, pos, side, true);
        CachedInnerNode.set(this, node);
        return node;
    }
    /// Iterate over the tree and its children, calling `enter` for any
    /// node that touches the `from`/`to` region (if given) before
    /// running over such a node's children, and `leave` (if given) when
    /// leaving the node. When `enter` returns `false`, that node will
    /// not have its children iterated over (or `leave` called).
    iterate(spec) {
        let { enter, leave, from = 0, to = this.length } = spec;
        let mode = spec.mode || 0, anon = (mode & exports.IterMode.IncludeAnonymous) > 0;
        for (let c = this.cursor(mode | exports.IterMode.IncludeAnonymous);;) {
            let entered = false;
            if (c.from <= to && c.to >= from && (!anon && c.type.isAnonymous || enter(c) !== false)) {
                if (c.firstChild())
                    continue;
                entered = true;
            }
            for (;;) {
                if (entered && leave && (anon || !c.type.isAnonymous))
                    leave(c);
                if (c.nextSibling())
                    break;
                if (!c.parent())
                    return;
                entered = true;
            }
        }
    }
    /// Get the value of the given [node prop](#common.NodeProp) for this
    /// node. Works with both per-node and per-type props.
    prop(prop) {
        return !prop.perNode ? this.type.prop(prop) : this.props ? this.props[prop.id] : undefined;
    }
    /// Returns the node's [per-node props](#common.NodeProp.perNode) in a
    /// format that can be passed to the [`Tree`](#common.Tree)
    /// constructor.
    get propValues() {
        let result = [];
        if (this.props)
            for (let id in this.props)
                result.push([+id, this.props[id]]);
        return result;
    }
    /// Balance the direct children of this tree, producing a copy of
    /// which may have children grouped into subtrees with type
    /// [`NodeType.none`](#common.NodeType^none).
    balance(config = {}) {
        return this.children.length <= 8 /* Balance.BranchFactor */ ? this :
            balanceRange(NodeType.none, this.children, this.positions, 0, this.children.length, 0, this.length, (children, positions, length) => new Tree(this.type, children, positions, length, this.propValues), config.makeTree || ((children, positions, length) => new Tree(NodeType.none, children, positions, length)));
    }
    /// Build a tree from a postfix-ordered buffer of node information,
    /// or a cursor over such a buffer.
    static build(data) { return buildTree(data); }
}
/// The empty tree
Tree.empty = new Tree(NodeType.none, [], [], 0);
class FlatBufferCursor {
    constructor(buffer, index) {
        this.buffer = buffer;
        this.index = index;
    }
    get id() { return this.buffer[this.index - 4]; }
    get start() { return this.buffer[this.index - 3]; }
    get end() { return this.buffer[this.index - 2]; }
    get size() { return this.buffer[this.index - 1]; }
    get pos() { return this.index; }
    next() { this.index -= 4; }
    fork() { return new FlatBufferCursor(this.buffer, this.index); }
}
/// Tree buffers contain (type, start, end, endIndex) quads for each
/// node. In such a buffer, nodes are stored in prefix order (parents
/// before children, with the endIndex of the parent indicating which
/// children belong to it).
class TreeBuffer {
    /// Create a tree buffer.
    constructor(
    /// The buffer's content.
    buffer, 
    /// The total length of the group of nodes in the buffer.
    length, 
    /// The node set used in this buffer.
    set) {
        this.buffer = buffer;
        this.length = length;
        this.set = set;
    }
    /// @internal
    get type() { return NodeType.none; }
    /// @internal
    toString() {
        let result = [];
        for (let index = 0; index < this.buffer.length;) {
            result.push(this.childString(index));
            index = this.buffer[index + 3];
        }
        return result.join(",");
    }
    /// @internal
    childString(index) {
        let id = this.buffer[index], endIndex = this.buffer[index + 3];
        let type = this.set.types[id], result = type.name;
        if (/\W/.test(result) && !type.isError)
            result = JSON.stringify(result);
        index += 4;
        if (endIndex == index)
            return result;
        let children = [];
        while (index < endIndex) {
            children.push(this.childString(index));
            index = this.buffer[index + 3];
        }
        return result + "(" + children.join(",") + ")";
    }
    /// @internal
    findChild(startIndex, endIndex, dir, pos, side) {
        let { buffer } = this, pick = -1;
        for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
            if (checkSide(side, pos, buffer[i + 1], buffer[i + 2])) {
                pick = i;
                if (dir > 0)
                    break;
            }
        }
        return pick;
    }
    /// @internal
    slice(startI, endI, from) {
        let b = this.buffer;
        let copy = new Uint16Array(endI - startI), len = 0;
        for (let i = startI, j = 0; i < endI;) {
            copy[j++] = b[i++];
            copy[j++] = b[i++] - from;
            let to = copy[j++] = b[i++] - from;
            copy[j++] = b[i++] - startI;
            len = Math.max(len, to);
        }
        return new TreeBuffer(copy, len, this.set);
    }
}
function checkSide(side, pos, from, to) {
    switch (side) {
        case -2 /* Side.Before */: return from < pos;
        case -1 /* Side.AtOrBefore */: return to >= pos && from < pos;
        case 0 /* Side.Around */: return from < pos && to > pos;
        case 1 /* Side.AtOrAfter */: return from <= pos && to > pos;
        case 2 /* Side.After */: return to > pos;
        case 4 /* Side.DontCare */: return true;
    }
}
function enterUnfinishedNodesBefore(node, pos) {
    let scan = node.childBefore(pos);
    while (scan) {
        let last = scan.lastChild;
        if (!last || last.to != scan.to)
            break;
        if (last.type.isError && last.from == last.to) {
            node = scan;
            scan = last.prevSibling;
        }
        else {
            scan = last;
        }
    }
    return node;
}
function resolveNode(node, pos, side, overlays) {
    var _a;
    // Move up to a node that actually holds the position, if possible
    while (node.from == node.to ||
        (side < 1 ? node.from >= pos : node.from > pos) ||
        (side > -1 ? node.to <= pos : node.to < pos)) {
        let parent = !overlays && node instanceof TreeNode && node.index < 0 ? null : node.parent;
        if (!parent)
            return node;
        node = parent;
    }
    let mode = overlays ? 0 : exports.IterMode.IgnoreOverlays;
    // Must go up out of overlays when those do not overlap with pos
    if (overlays)
        for (let scan = node, parent = scan.parent; parent; scan = parent, parent = scan.parent) {
            if (scan instanceof TreeNode && scan.index < 0 && ((_a = parent.enter(pos, side, mode)) === null || _a === void 0 ? void 0 : _a.from) != scan.from)
                node = parent;
        }
    for (;;) {
        let inner = node.enter(pos, side, mode);
        if (!inner)
            return node;
        node = inner;
    }
}
class TreeNode {
    constructor(_tree, from, 
    // Index in parent node, set to -1 if the node is not a direct child of _parent.node (overlay)
    index, _parent) {
        this._tree = _tree;
        this.from = from;
        this.index = index;
        this._parent = _parent;
    }
    get type() { return this._tree.type; }
    get name() { return this._tree.type.name; }
    get to() { return this.from + this._tree.length; }
    nextChild(i, dir, pos, side, mode = 0) {
        for (let parent = this;;) {
            for (let { children, positions } = parent._tree, e = dir > 0 ? children.length : -1; i != e; i += dir) {
                let next = children[i], start = positions[i] + parent.from;
                if (!checkSide(side, pos, start, start + next.length))
                    continue;
                if (next instanceof TreeBuffer) {
                    if (mode & exports.IterMode.ExcludeBuffers)
                        continue;
                    let index = next.findChild(0, next.buffer.length, dir, pos - start, side);
                    if (index > -1)
                        return new BufferNode(new BufferContext(parent, next, i, start), null, index);
                }
                else if ((mode & exports.IterMode.IncludeAnonymous) || (!next.type.isAnonymous || hasChild(next))) {
                    let mounted;
                    if (!(mode & exports.IterMode.IgnoreMounts) &&
                        next.props && (mounted = next.prop(NodeProp.mounted)) && !mounted.overlay)
                        return new TreeNode(mounted.tree, start, i, parent);
                    let inner = new TreeNode(next, start, i, parent);
                    return (mode & exports.IterMode.IncludeAnonymous) || !inner.type.isAnonymous ? inner
                        : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, pos, side);
                }
            }
            if ((mode & exports.IterMode.IncludeAnonymous) || !parent.type.isAnonymous)
                return null;
            if (parent.index >= 0)
                i = parent.index + dir;
            else
                i = dir < 0 ? -1 : parent._parent._tree.children.length;
            parent = parent._parent;
            if (!parent)
                return null;
        }
    }
    get firstChild() { return this.nextChild(0, 1, 0, 4 /* Side.DontCare */); }
    get lastChild() { return this.nextChild(this._tree.children.length - 1, -1, 0, 4 /* Side.DontCare */); }
    childAfter(pos) { return this.nextChild(0, 1, pos, 2 /* Side.After */); }
    childBefore(pos) { return this.nextChild(this._tree.children.length - 1, -1, pos, -2 /* Side.Before */); }
    enter(pos, side, mode = 0) {
        let mounted;
        if (!(mode & exports.IterMode.IgnoreOverlays) && (mounted = this._tree.prop(NodeProp.mounted)) && mounted.overlay) {
            let rPos = pos - this.from;
            for (let { from, to } of mounted.overlay) {
                if ((side > 0 ? from <= rPos : from < rPos) &&
                    (side < 0 ? to >= rPos : to > rPos))
                    return new TreeNode(mounted.tree, mounted.overlay[0].from + this.from, -1, this);
            }
        }
        return this.nextChild(0, 1, pos, side, mode);
    }
    nextSignificantParent() {
        let val = this;
        while (val.type.isAnonymous && val._parent)
            val = val._parent;
        return val;
    }
    get parent() {
        return this._parent ? this._parent.nextSignificantParent() : null;
    }
    get nextSibling() {
        return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4 /* Side.DontCare */) : null;
    }
    get prevSibling() {
        return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4 /* Side.DontCare */) : null;
    }
    cursor(mode = 0) { return new TreeCursor(this, mode); }
    get tree() { return this._tree; }
    toTree() { return this._tree; }
    resolve(pos, side = 0) {
        return resolveNode(this, pos, side, false);
    }
    resolveInner(pos, side = 0) {
        return resolveNode(this, pos, side, true);
    }
    enterUnfinishedNodesBefore(pos) { return enterUnfinishedNodesBefore(this, pos); }
    getChild(type, before = null, after = null) {
        let r = getChildren(this, type, before, after);
        return r.length ? r[0] : null;
    }
    getChildren(type, before = null, after = null) {
        return getChildren(this, type, before, after);
    }
    /// @internal
    toString() { return this._tree.toString(); }
    get node() { return this; }
    matchContext(context) { return matchNodeContext(this, context); }
}
function getChildren(node, type, before, after) {
    let cur = node.cursor(), result = [];
    if (!cur.firstChild())
        return result;
    if (before != null)
        while (!cur.type.is(before))
            if (!cur.nextSibling())
                return result;
    for (;;) {
        if (after != null && cur.type.is(after))
            return result;
        if (cur.type.is(type))
            result.push(cur.node);
        if (!cur.nextSibling())
            return after == null ? result : [];
    }
}
function matchNodeContext(node, context, i = context.length - 1) {
    for (let p = node.parent; i >= 0; p = p.parent) {
        if (!p)
            return false;
        if (!p.type.isAnonymous) {
            if (context[i] && context[i] != p.name)
                return false;
            i--;
        }
    }
    return true;
}
class BufferContext {
    constructor(parent, buffer, index, start) {
        this.parent = parent;
        this.buffer = buffer;
        this.index = index;
        this.start = start;
    }
}
class BufferNode {
    get name() { return this.type.name; }
    get from() { return this.context.start + this.context.buffer.buffer[this.index + 1]; }
    get to() { return this.context.start + this.context.buffer.buffer[this.index + 2]; }
    constructor(context, _parent, index) {
        this.context = context;
        this._parent = _parent;
        this.index = index;
        this.type = context.buffer.set.types[context.buffer.buffer[index]];
    }
    child(dir, pos, side) {
        let { buffer } = this.context;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.context.start, side);
        return index < 0 ? null : new BufferNode(this.context, this, index);
    }
    get firstChild() { return this.child(1, 0, 4 /* Side.DontCare */); }
    get lastChild() { return this.child(-1, 0, 4 /* Side.DontCare */); }
    childAfter(pos) { return this.child(1, pos, 2 /* Side.After */); }
    childBefore(pos) { return this.child(-1, pos, -2 /* Side.Before */); }
    enter(pos, side, mode = 0) {
        if (mode & exports.IterMode.ExcludeBuffers)
            return null;
        let { buffer } = this.context;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], side > 0 ? 1 : -1, pos - this.context.start, side);
        return index < 0 ? null : new BufferNode(this.context, this, index);
    }
    get parent() {
        return this._parent || this.context.parent.nextSignificantParent();
    }
    externalSibling(dir) {
        return this._parent ? null : this.context.parent.nextChild(this.context.index + dir, dir, 0, 4 /* Side.DontCare */);
    }
    get nextSibling() {
        let { buffer } = this.context;
        let after = buffer.buffer[this.index + 3];
        if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length))
            return new BufferNode(this.context, this._parent, after);
        return this.externalSibling(1);
    }
    get prevSibling() {
        let { buffer } = this.context;
        let parentStart = this._parent ? this._parent.index + 4 : 0;
        if (this.index == parentStart)
            return this.externalSibling(-1);
        return new BufferNode(this.context, this._parent, buffer.findChild(parentStart, this.index, -1, 0, 4 /* Side.DontCare */));
    }
    cursor(mode = 0) { return new TreeCursor(this, mode); }
    get tree() { return null; }
    toTree() {
        let children = [], positions = [];
        let { buffer } = this.context;
        let startI = this.index + 4, endI = buffer.buffer[this.index + 3];
        if (endI > startI) {
            let from = buffer.buffer[this.index + 1];
            children.push(buffer.slice(startI, endI, from));
            positions.push(0);
        }
        return new Tree(this.type, children, positions, this.to - this.from);
    }
    resolve(pos, side = 0) {
        return resolveNode(this, pos, side, false);
    }
    resolveInner(pos, side = 0) {
        return resolveNode(this, pos, side, true);
    }
    enterUnfinishedNodesBefore(pos) { return enterUnfinishedNodesBefore(this, pos); }
    /// @internal
    toString() { return this.context.buffer.childString(this.index); }
    getChild(type, before = null, after = null) {
        let r = getChildren(this, type, before, after);
        return r.length ? r[0] : null;
    }
    getChildren(type, before = null, after = null) {
        return getChildren(this, type, before, after);
    }
    get node() { return this; }
    matchContext(context) { return matchNodeContext(this, context); }
}
/// A tree cursor object focuses on a given node in a syntax tree, and
/// allows you to move to adjacent nodes.
class TreeCursor {
    /// Shorthand for `.type.name`.
    get name() { return this.type.name; }
    /// @internal
    constructor(node, 
    /// @internal
    mode = 0) {
        this.mode = mode;
        /// @internal
        this.buffer = null;
        this.stack = [];
        /// @internal
        this.index = 0;
        this.bufferNode = null;
        if (node instanceof TreeNode) {
            this.yieldNode(node);
        }
        else {
            this._tree = node.context.parent;
            this.buffer = node.context;
            for (let n = node._parent; n; n = n._parent)
                this.stack.unshift(n.index);
            this.bufferNode = node;
            this.yieldBuf(node.index);
        }
    }
    yieldNode(node) {
        if (!node)
            return false;
        this._tree = node;
        this.type = node.type;
        this.from = node.from;
        this.to = node.to;
        return true;
    }
    yieldBuf(index, type) {
        this.index = index;
        let { start, buffer } = this.buffer;
        this.type = type || buffer.set.types[buffer.buffer[index]];
        this.from = start + buffer.buffer[index + 1];
        this.to = start + buffer.buffer[index + 2];
        return true;
    }
    yield(node) {
        if (!node)
            return false;
        if (node instanceof TreeNode) {
            this.buffer = null;
            return this.yieldNode(node);
        }
        this.buffer = node.context;
        return this.yieldBuf(node.index, node.type);
    }
    /// @internal
    toString() {
        return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
    }
    /// @internal
    enterChild(dir, pos, side) {
        if (!this.buffer)
            return this.yield(this._tree.nextChild(dir < 0 ? this._tree._tree.children.length - 1 : 0, dir, pos, side, this.mode));
        let { buffer } = this.buffer;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.buffer.start, side);
        if (index < 0)
            return false;
        this.stack.push(this.index);
        return this.yieldBuf(index);
    }
    /// Move the cursor to this node's first child. When this returns
    /// false, the node has no child, and the cursor has not been moved.
    firstChild() { return this.enterChild(1, 0, 4 /* Side.DontCare */); }
    /// Move the cursor to this node's last child.
    lastChild() { return this.enterChild(-1, 0, 4 /* Side.DontCare */); }
    /// Move the cursor to the first child that ends after `pos`.
    childAfter(pos) { return this.enterChild(1, pos, 2 /* Side.After */); }
    /// Move to the last child that starts before `pos`.
    childBefore(pos) { return this.enterChild(-1, pos, -2 /* Side.Before */); }
    /// Move the cursor to the child around `pos`. If side is -1 the
    /// child may end at that position, when 1 it may start there. This
    /// will also enter [overlaid](#common.MountedTree.overlay)
    /// [mounted](#common.NodeProp^mounted) trees unless `overlays` is
    /// set to false.
    enter(pos, side, mode = this.mode) {
        if (!this.buffer)
            return this.yield(this._tree.enter(pos, side, mode));
        return mode & exports.IterMode.ExcludeBuffers ? false : this.enterChild(1, pos, side);
    }
    /// Move to the node's parent node, if this isn't the top node.
    parent() {
        if (!this.buffer)
            return this.yieldNode((this.mode & exports.IterMode.IncludeAnonymous) ? this._tree._parent : this._tree.parent);
        if (this.stack.length)
            return this.yieldBuf(this.stack.pop());
        let parent = (this.mode & exports.IterMode.IncludeAnonymous) ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
        this.buffer = null;
        return this.yieldNode(parent);
    }
    /// @internal
    sibling(dir) {
        if (!this.buffer)
            return !this._tree._parent ? false
                : this.yield(this._tree.index < 0 ? null
                    : this._tree._parent.nextChild(this._tree.index + dir, dir, 0, 4 /* Side.DontCare */, this.mode));
        let { buffer } = this.buffer, d = this.stack.length - 1;
        if (dir < 0) {
            let parentStart = d < 0 ? 0 : this.stack[d] + 4;
            if (this.index != parentStart)
                return this.yieldBuf(buffer.findChild(parentStart, this.index, -1, 0, 4 /* Side.DontCare */));
        }
        else {
            let after = buffer.buffer[this.index + 3];
            if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3]))
                return this.yieldBuf(after);
        }
        return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, 0, 4 /* Side.DontCare */, this.mode)) : false;
    }
    /// Move to this node's next sibling, if any.
    nextSibling() { return this.sibling(1); }
    /// Move to this node's previous sibling, if any.
    prevSibling() { return this.sibling(-1); }
    atLastNode(dir) {
        let index, parent, { buffer } = this;
        if (buffer) {
            if (dir > 0) {
                if (this.index < buffer.buffer.buffer.length)
                    return false;
            }
            else {
                for (let i = 0; i < this.index; i++)
                    if (buffer.buffer.buffer[i + 3] < this.index)
                        return false;
            }
            ({ index, parent } = buffer);
        }
        else {
            ({ index, _parent: parent } = this._tree);
        }
        for (; parent; { index, _parent: parent } = parent) {
            if (index > -1)
                for (let i = index + dir, e = dir < 0 ? -1 : parent._tree.children.length; i != e; i += dir) {
                    let child = parent._tree.children[i];
                    if ((this.mode & exports.IterMode.IncludeAnonymous) ||
                        child instanceof TreeBuffer ||
                        !child.type.isAnonymous ||
                        hasChild(child))
                        return false;
                }
        }
        return true;
    }
    move(dir, enter) {
        if (enter && this.enterChild(dir, 0, 4 /* Side.DontCare */))
            return true;
        for (;;) {
            if (this.sibling(dir))
                return true;
            if (this.atLastNode(dir) || !this.parent())
                return false;
        }
    }
    /// Move to the next node in a
    /// [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
    /// traversal, going from a node to its first child or, if the
    /// current node is empty or `enter` is false, its next sibling or
    /// the next sibling of the first parent node that has one.
    next(enter = true) { return this.move(1, enter); }
    /// Move to the next node in a last-to-first pre-order traveral. A
    /// node is followed by its last child or, if it has none, its
    /// previous sibling or the previous sibling of the first parent
    /// node that has one.
    prev(enter = true) { return this.move(-1, enter); }
    /// Move the cursor to the innermost node that covers `pos`. If
    /// `side` is -1, it will enter nodes that end at `pos`. If it is 1,
    /// it will enter nodes that start at `pos`.
    moveTo(pos, side = 0) {
        // Move up to a node that actually holds the position, if possible
        while (this.from == this.to ||
            (side < 1 ? this.from >= pos : this.from > pos) ||
            (side > -1 ? this.to <= pos : this.to < pos))
            if (!this.parent())
                break;
        // Then scan down into child nodes as far as possible
        while (this.enterChild(1, pos, side)) { }
        return this;
    }
    /// Get a [syntax node](#common.SyntaxNode) at the cursor's current
    /// position.
    get node() {
        if (!this.buffer)
            return this._tree;
        let cache = this.bufferNode, result = null, depth = 0;
        if (cache && cache.context == this.buffer) {
            scan: for (let index = this.index, d = this.stack.length; d >= 0;) {
                for (let c = cache; c; c = c._parent)
                    if (c.index == index) {
                        if (index == this.index)
                            return c;
                        result = c;
                        depth = d + 1;
                        break scan;
                    }
                index = this.stack[--d];
            }
        }
        for (let i = depth; i < this.stack.length; i++)
            result = new BufferNode(this.buffer, result, this.stack[i]);
        return this.bufferNode = new BufferNode(this.buffer, result, this.index);
    }
    /// Get the [tree](#common.Tree) that represents the current node, if
    /// any. Will return null when the node is in a [tree
    /// buffer](#common.TreeBuffer).
    get tree() {
        return this.buffer ? null : this._tree._tree;
    }
    /// Iterate over the current node and all its descendants, calling
    /// `enter` when entering a node and `leave`, if given, when leaving
    /// one. When `enter` returns `false`, any children of that node are
    /// skipped, and `leave` isn't called for it.
    iterate(enter, leave) {
        for (let depth = 0;;) {
            let mustLeave = false;
            if (this.type.isAnonymous || enter(this) !== false) {
                if (this.firstChild()) {
                    depth++;
                    continue;
                }
                if (!this.type.isAnonymous)
                    mustLeave = true;
            }
            for (;;) {
                if (mustLeave && leave)
                    leave(this);
                mustLeave = this.type.isAnonymous;
                if (this.nextSibling())
                    break;
                if (!depth)
                    return;
                this.parent();
                depth--;
                mustLeave = true;
            }
        }
    }
    /// Test whether the current node matches a given context—a sequence
    /// of direct parent node names. Empty strings in the context array
    /// are treated as wildcards.
    matchContext(context) {
        if (!this.buffer)
            return matchNodeContext(this.node, context);
        let { buffer } = this.buffer, { types } = buffer.set;
        for (let i = context.length - 1, d = this.stack.length - 1; i >= 0; d--) {
            if (d < 0)
                return matchNodeContext(this.node, context, i);
            let type = types[buffer.buffer[this.stack[d]]];
            if (!type.isAnonymous) {
                if (context[i] && context[i] != type.name)
                    return false;
                i--;
            }
        }
        return true;
    }
}
function hasChild(tree) {
    return tree.children.some(ch => ch instanceof TreeBuffer || !ch.type.isAnonymous || hasChild(ch));
}
function buildTree(data) {
    var _a;
    let { buffer, nodeSet, maxBufferLength = DefaultBufferLength, reused = [], minRepeatType = nodeSet.types.length } = data;
    let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
    let types = nodeSet.types;
    let contextHash = 0, lookAhead = 0;
    function takeNode(parentStart, minPos, children, positions, inRepeat) {
        let { id, start, end, size } = cursor;
        let lookAheadAtStart = lookAhead;
        while (size < 0) {
            cursor.next();
            if (size == -1 /* SpecialRecord.Reuse */) {
                let node = reused[id];
                children.push(node);
                positions.push(start - parentStart);
                return;
            }
            else if (size == -3 /* SpecialRecord.ContextChange */) { // Context change
                contextHash = id;
                return;
            }
            else if (size == -4 /* SpecialRecord.LookAhead */) {
                lookAhead = id;
                return;
            }
            else {
                throw new RangeError(`Unrecognized record size: ${size}`);
            }
        }
        let type = types[id], node, buffer;
        let startPos = start - parentStart;
        if (end - start <= maxBufferLength && (buffer = findBufferSize(cursor.pos - minPos, inRepeat))) {
            // Small enough for a buffer, and no reused nodes inside
            let data = new Uint16Array(buffer.size - buffer.skip);
            let endPos = cursor.pos - buffer.size, index = data.length;
            while (cursor.pos > endPos)
                index = copyToBuffer(buffer.start, data, index);
            node = new TreeBuffer(data, end - buffer.start, nodeSet);
            startPos = buffer.start - parentStart;
        }
        else { // Make it a node
            let endPos = cursor.pos - size;
            cursor.next();
            let localChildren = [], localPositions = [];
            let localInRepeat = id >= minRepeatType ? id : -1;
            let lastGroup = 0, lastEnd = end;
            while (cursor.pos > endPos) {
                if (localInRepeat >= 0 && cursor.id == localInRepeat && cursor.size >= 0) {
                    if (cursor.end <= lastEnd - maxBufferLength) {
                        makeRepeatLeaf(localChildren, localPositions, start, lastGroup, cursor.end, lastEnd, localInRepeat, lookAheadAtStart);
                        lastGroup = localChildren.length;
                        lastEnd = cursor.end;
                    }
                    cursor.next();
                }
                else {
                    takeNode(start, endPos, localChildren, localPositions, localInRepeat);
                }
            }
            if (localInRepeat >= 0 && lastGroup > 0 && lastGroup < localChildren.length)
                makeRepeatLeaf(localChildren, localPositions, start, lastGroup, start, lastEnd, localInRepeat, lookAheadAtStart);
            localChildren.reverse();
            localPositions.reverse();
            if (localInRepeat > -1 && lastGroup > 0) {
                let make = makeBalanced(type);
                node = balanceRange(type, localChildren, localPositions, 0, localChildren.length, 0, end - start, make, make);
            }
            else {
                node = makeTree(type, localChildren, localPositions, end - start, lookAheadAtStart - end);
            }
        }
        children.push(node);
        positions.push(startPos);
    }
    function makeBalanced(type) {
        return (children, positions, length) => {
            let lookAhead = 0, lastI = children.length - 1, last, lookAheadProp;
            if (lastI >= 0 && (last = children[lastI]) instanceof Tree) {
                if (!lastI && last.type == type && last.length == length)
                    return last;
                if (lookAheadProp = last.prop(NodeProp.lookAhead))
                    lookAhead = positions[lastI] + last.length + lookAheadProp;
            }
            return makeTree(type, children, positions, length, lookAhead);
        };
    }
    function makeRepeatLeaf(children, positions, base, i, from, to, type, lookAhead) {
        let localChildren = [], localPositions = [];
        while (children.length > i) {
            localChildren.push(children.pop());
            localPositions.push(positions.pop() + base - from);
        }
        children.push(makeTree(nodeSet.types[type], localChildren, localPositions, to - from, lookAhead - to));
        positions.push(from - base);
    }
    function makeTree(type, children, positions, length, lookAhead = 0, props) {
        if (contextHash) {
            let pair = [NodeProp.contextHash, contextHash];
            props = props ? [pair].concat(props) : [pair];
        }
        if (lookAhead > 25) {
            let pair = [NodeProp.lookAhead, lookAhead];
            props = props ? [pair].concat(props) : [pair];
        }
        return new Tree(type, children, positions, length, props);
    }
    function findBufferSize(maxSize, inRepeat) {
        // Scan through the buffer to find previous siblings that fit
        // together in a TreeBuffer, and don't contain any reused nodes
        // (which can't be stored in a buffer).
        // If `inRepeat` is > -1, ignore node boundaries of that type for
        // nesting, but make sure the end falls either at the start
        // (`maxSize`) or before such a node.
        let fork = cursor.fork();
        let size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength;
        let result = { size: 0, start: 0, skip: 0 };
        scan: for (let minPos = fork.pos - maxSize; fork.pos > minPos;) {
            let nodeSize = fork.size;
            // Pretend nested repeat nodes of the same type don't exist
            if (fork.id == inRepeat && nodeSize >= 0) {
                // Except that we store the current state as a valid return
                // value.
                result.size = size;
                result.start = start;
                result.skip = skip;
                skip += 4;
                size += 4;
                fork.next();
                continue;
            }
            let startPos = fork.pos - nodeSize;
            if (nodeSize < 0 || startPos < minPos || fork.start < minStart)
                break;
            let localSkipped = fork.id >= minRepeatType ? 4 : 0;
            let nodeStart = fork.start;
            fork.next();
            while (fork.pos > startPos) {
                if (fork.size < 0) {
                    if (fork.size == -3 /* SpecialRecord.ContextChange */)
                        localSkipped += 4;
                    else
                        break scan;
                }
                else if (fork.id >= minRepeatType) {
                    localSkipped += 4;
                }
                fork.next();
            }
            start = nodeStart;
            size += nodeSize;
            skip += localSkipped;
        }
        if (inRepeat < 0 || size == maxSize) {
            result.size = size;
            result.start = start;
            result.skip = skip;
        }
        return result.size > 4 ? result : undefined;
    }
    function copyToBuffer(bufferStart, buffer, index) {
        let { id, start, end, size } = cursor;
        cursor.next();
        if (size >= 0 && id < minRepeatType) {
            let startIndex = index;
            if (size > 4) {
                let endPos = cursor.pos - (size - 4);
                while (cursor.pos > endPos)
                    index = copyToBuffer(bufferStart, buffer, index);
            }
            buffer[--index] = startIndex;
            buffer[--index] = end - bufferStart;
            buffer[--index] = start - bufferStart;
            buffer[--index] = id;
        }
        else if (size == -3 /* SpecialRecord.ContextChange */) {
            contextHash = id;
        }
        else if (size == -4 /* SpecialRecord.LookAhead */) {
            lookAhead = id;
        }
        return index;
    }
    let children = [], positions = [];
    while (cursor.pos > 0)
        takeNode(data.start || 0, data.bufferStart || 0, children, positions, -1);
    let length = (_a = data.length) !== null && _a !== void 0 ? _a : (children.length ? positions[0] + children[0].length : 0);
    return new Tree(types[data.topID], children.reverse(), positions.reverse(), length);
}
const nodeSizeCache = new WeakMap;
function nodeSize(balanceType, node) {
    if (!balanceType.isAnonymous || node instanceof TreeBuffer || node.type != balanceType)
        return 1;
    let size = nodeSizeCache.get(node);
    if (size == null) {
        size = 1;
        for (let child of node.children) {
            if (child.type != balanceType || !(child instanceof Tree)) {
                size = 1;
                break;
            }
            size += nodeSize(balanceType, child);
        }
        nodeSizeCache.set(node, size);
    }
    return size;
}
function balanceRange(
// The type the balanced tree's inner nodes.
balanceType, 
// The direct children and their positions
children, positions, 
// The index range in children/positions to use
from, to, 
// The start position of the nodes, relative to their parent.
start, 
// Length of the outer node
length, 
// Function to build the top node of the balanced tree
mkTop, 
// Function to build internal nodes for the balanced tree
mkTree) {
    let total = 0;
    for (let i = from; i < to; i++)
        total += nodeSize(balanceType, children[i]);
    let maxChild = Math.ceil((total * 1.5) / 8 /* Balance.BranchFactor */);
    let localChildren = [], localPositions = [];
    function divide(children, positions, from, to, offset) {
        for (let i = from; i < to;) {
            let groupFrom = i, groupStart = positions[i], groupSize = nodeSize(balanceType, children[i]);
            i++;
            for (; i < to; i++) {
                let nextSize = nodeSize(balanceType, children[i]);
                if (groupSize + nextSize >= maxChild)
                    break;
                groupSize += nextSize;
            }
            if (i == groupFrom + 1) {
                if (groupSize > maxChild) {
                    let only = children[groupFrom]; // Only trees can have a size > 1
                    divide(only.children, only.positions, 0, only.children.length, positions[groupFrom] + offset);
                    continue;
                }
                localChildren.push(children[groupFrom]);
            }
            else {
                let length = positions[i - 1] + children[i - 1].length - groupStart;
                localChildren.push(balanceRange(balanceType, children, positions, groupFrom, i, groupStart, length, null, mkTree));
            }
            localPositions.push(groupStart + offset - start);
        }
    }
    divide(children, positions, from, to, 0);
    return (mkTop || mkTree)(localChildren, localPositions, length);
}
/// Provides a way to associate values with pieces of trees. As long
/// as that part of the tree is reused, the associated values can be
/// retrieved from an updated tree.
class NodeWeakMap {
    constructor() {
        this.map = new WeakMap();
    }
    setBuffer(buffer, index, value) {
        let inner = this.map.get(buffer);
        if (!inner)
            this.map.set(buffer, inner = new Map);
        inner.set(index, value);
    }
    getBuffer(buffer, index) {
        let inner = this.map.get(buffer);
        return inner && inner.get(index);
    }
    /// Set the value for this syntax node.
    set(node, value) {
        if (node instanceof BufferNode)
            this.setBuffer(node.context.buffer, node.index, value);
        else if (node instanceof TreeNode)
            this.map.set(node.tree, value);
    }
    /// Retrieve value for this syntax node, if it exists in the map.
    get(node) {
        return node instanceof BufferNode ? this.getBuffer(node.context.buffer, node.index)
            : node instanceof TreeNode ? this.map.get(node.tree) : undefined;
    }
    /// Set the value for the node that a cursor currently points to.
    cursorSet(cursor, value) {
        if (cursor.buffer)
            this.setBuffer(cursor.buffer.buffer, cursor.index, value);
        else
            this.map.set(cursor.tree, value);
    }
    /// Retrieve the value for the node that a cursor currently points
    /// to.
    cursorGet(cursor) {
        return cursor.buffer ? this.getBuffer(cursor.buffer.buffer, cursor.index) : this.map.get(cursor.tree);
    }
}

/// Tree fragments are used during [incremental
/// parsing](#common.Parser.startParse) to track parts of old trees
/// that can be reused in a new parse. An array of fragments is used
/// to track regions of an old tree whose nodes might be reused in new
/// parses. Use the static
/// [`applyChanges`](#common.TreeFragment^applyChanges) method to
/// update fragments for document changes.
class TreeFragment {
    /// Construct a tree fragment. You'll usually want to use
    /// [`addTree`](#common.TreeFragment^addTree) and
    /// [`applyChanges`](#common.TreeFragment^applyChanges) instead of
    /// calling this directly.
    constructor(
    /// The start of the unchanged range pointed to by this fragment.
    /// This refers to an offset in the _updated_ document (as opposed
    /// to the original tree).
    from, 
    /// The end of the unchanged range.
    to, 
    /// The tree that this fragment is based on.
    tree, 
    /// The offset between the fragment's tree and the document that
    /// this fragment can be used against. Add this when going from
    /// document to tree positions, subtract it to go from tree to
    /// document positions.
    offset, openStart = false, openEnd = false) {
        this.from = from;
        this.to = to;
        this.tree = tree;
        this.offset = offset;
        this.open = (openStart ? 1 /* Open.Start */ : 0) | (openEnd ? 2 /* Open.End */ : 0);
    }
    /// Whether the start of the fragment represents the start of a
    /// parse, or the end of a change. (In the second case, it may not
    /// be safe to reuse some nodes at the start, depending on the
    /// parsing algorithm.)
    get openStart() { return (this.open & 1 /* Open.Start */) > 0; }
    /// Whether the end of the fragment represents the end of a
    /// full-document parse, or the start of a change.
    get openEnd() { return (this.open & 2 /* Open.End */) > 0; }
    /// Create a set of fragments from a freshly parsed tree, or update
    /// an existing set of fragments by replacing the ones that overlap
    /// with a tree with content from the new tree. When `partial` is
    /// true, the parse is treated as incomplete, and the resulting
    /// fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
    /// true.
    static addTree(tree, fragments = [], partial = false) {
        let result = [new TreeFragment(0, tree.length, tree, 0, false, partial)];
        for (let f of fragments)
            if (f.to > tree.length)
                result.push(f);
        return result;
    }
    /// Apply a set of edits to an array of fragments, removing or
    /// splitting fragments as necessary to remove edited ranges, and
    /// adjusting offsets for fragments that moved.
    static applyChanges(fragments, changes, minGap = 128) {
        if (!changes.length)
            return fragments;
        let result = [];
        let fI = 1, nextF = fragments.length ? fragments[0] : null;
        for (let cI = 0, pos = 0, off = 0;; cI++) {
            let nextC = cI < changes.length ? changes[cI] : null;
            let nextPos = nextC ? nextC.fromA : 1e9;
            if (nextPos - pos >= minGap)
                while (nextF && nextF.from < nextPos) {
                    let cut = nextF;
                    if (pos >= cut.from || nextPos <= cut.to || off) {
                        let fFrom = Math.max(cut.from, pos) - off, fTo = Math.min(cut.to, nextPos) - off;
                        cut = fFrom >= fTo ? null : new TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, cI > 0, !!nextC);
                    }
                    if (cut)
                        result.push(cut);
                    if (nextF.to > nextPos)
                        break;
                    nextF = fI < fragments.length ? fragments[fI++] : null;
                }
            if (!nextC)
                break;
            pos = nextC.toA;
            off = nextC.toA - nextC.toB;
        }
        return result;
    }
}
/// A superclass that parsers should extend.
class Parser {
    /// Start a parse, returning a [partial parse](#common.PartialParse)
    /// object. [`fragments`](#common.TreeFragment) can be passed in to
    /// make the parse incremental.
    ///
    /// By default, the entire input is parsed. You can pass `ranges`,
    /// which should be a sorted array of non-empty, non-overlapping
    /// ranges, to parse only those ranges. The tree returned in that
    /// case will start at `ranges[0].from`.
    startParse(input, fragments, ranges) {
        if (typeof input == "string")
            input = new StringInput(input);
        ranges = !ranges ? [new Range(0, input.length)] : ranges.length ? ranges.map(r => new Range(r.from, r.to)) : [new Range(0, 0)];
        return this.createParse(input, fragments || [], ranges);
    }
    /// Run a full parse, returning the resulting tree.
    parse(input, fragments, ranges) {
        let parse = this.startParse(input, fragments, ranges);
        for (;;) {
            let done = parse.advance();
            if (done)
                return done;
        }
    }
}
class StringInput {
    constructor(string) {
        this.string = string;
    }
    get length() { return this.string.length; }
    chunk(from) { return this.string.slice(from); }
    get lineChunks() { return false; }
    read(from, to) { return this.string.slice(from, to); }
}

/// Create a parse wrapper that, after the inner parse completes,
/// scans its tree for mixed language regions with the `nest`
/// function, runs the resulting [inner parses](#common.NestedParse),
/// and then [mounts](#common.NodeProp^mounted) their results onto the
/// tree.
function parseMixed(nest) {
    return (parse, input, fragments, ranges) => new MixedParse(parse, nest, input, fragments, ranges);
}
class InnerParse {
    constructor(parser, parse, overlay, target, ranges) {
        this.parser = parser;
        this.parse = parse;
        this.overlay = overlay;
        this.target = target;
        this.ranges = ranges;
        if (!ranges.length || ranges.some(r => r.from >= r.to))
            throw new RangeError("Invalid inner parse ranges given: " + JSON.stringify(ranges));
    }
}
class ActiveOverlay {
    constructor(parser, predicate, mounts, index, start, target, prev) {
        this.parser = parser;
        this.predicate = predicate;
        this.mounts = mounts;
        this.index = index;
        this.start = start;
        this.target = target;
        this.prev = prev;
        this.depth = 0;
        this.ranges = [];
    }
}
const stoppedInner = new NodeProp({ perNode: true });
class MixedParse {
    constructor(base, nest, input, fragments, ranges) {
        this.nest = nest;
        this.input = input;
        this.fragments = fragments;
        this.ranges = ranges;
        this.inner = [];
        this.innerDone = 0;
        this.baseTree = null;
        this.stoppedAt = null;
        this.baseParse = base;
    }
    advance() {
        if (this.baseParse) {
            let done = this.baseParse.advance();
            if (!done)
                return null;
            this.baseParse = null;
            this.baseTree = done;
            this.startInner();
            if (this.stoppedAt != null)
                for (let inner of this.inner)
                    inner.parse.stopAt(this.stoppedAt);
        }
        if (this.innerDone == this.inner.length) {
            let result = this.baseTree;
            if (this.stoppedAt != null)
                result = new Tree(result.type, result.children, result.positions, result.length, result.propValues.concat([[stoppedInner, this.stoppedAt]]));
            return result;
        }
        let inner = this.inner[this.innerDone], done = inner.parse.advance();
        if (done) {
            this.innerDone++;
            // This is a somewhat dodgy but super helpful hack where we
            // patch up nodes created by the inner parse (and thus
            // presumably not aliased anywhere else) to hold the information
            // about the inner parse.
            let props = Object.assign(Object.create(null), inner.target.props);
            props[NodeProp.mounted.id] = new MountedTree(done, inner.overlay, inner.parser);
            inner.target.props = props;
        }
        return null;
    }
    get parsedPos() {
        if (this.baseParse)
            return 0;
        let pos = this.input.length;
        for (let i = this.innerDone; i < this.inner.length; i++) {
            if (this.inner[i].ranges[0].from < pos)
                pos = Math.min(pos, this.inner[i].parse.parsedPos);
        }
        return pos;
    }
    stopAt(pos) {
        this.stoppedAt = pos;
        if (this.baseParse)
            this.baseParse.stopAt(pos);
        else
            for (let i = this.innerDone; i < this.inner.length; i++)
                this.inner[i].parse.stopAt(pos);
    }
    startInner() {
        let fragmentCursor = new FragmentCursor(this.fragments);
        let overlay = null;
        let covered = null;
        let cursor = new TreeCursor(new TreeNode(this.baseTree, this.ranges[0].from, 0, null), exports.IterMode.IncludeAnonymous | exports.IterMode.IgnoreMounts);
        scan: for (let nest, isCovered; this.stoppedAt == null || cursor.from < this.stoppedAt;) {
            let enter = true, range;
            if (fragmentCursor.hasNode(cursor)) {
                if (overlay) {
                    let match = overlay.mounts.find(m => m.frag.from <= cursor.from && m.frag.to >= cursor.to && m.mount.overlay);
                    if (match)
                        for (let r of match.mount.overlay) {
                            let from = r.from + match.pos, to = r.to + match.pos;
                            if (from >= cursor.from && to <= cursor.to && !overlay.ranges.some(r => r.from < to && r.to > from))
                                overlay.ranges.push({ from, to });
                        }
                }
                enter = false;
            }
            else if (covered && (isCovered = checkCover(covered.ranges, cursor.from, cursor.to))) {
                enter = isCovered != 2 /* Cover.Full */;
            }
            else if (!cursor.type.isAnonymous && cursor.from < cursor.to && (nest = this.nest(cursor, this.input))) {
                if (!cursor.tree)
                    materialize(cursor);
                let oldMounts = fragmentCursor.findMounts(cursor.from, nest.parser);
                if (typeof nest.overlay == "function") {
                    overlay = new ActiveOverlay(nest.parser, nest.overlay, oldMounts, this.inner.length, cursor.from, cursor.tree, overlay);
                }
                else {
                    let ranges = punchRanges(this.ranges, nest.overlay || [new Range(cursor.from, cursor.to)]);
                    if (ranges.length)
                        this.inner.push(new InnerParse(nest.parser, nest.parser.startParse(this.input, enterFragments(oldMounts, ranges), ranges), nest.overlay ? nest.overlay.map(r => new Range(r.from - cursor.from, r.to - cursor.from)) : null, cursor.tree, ranges));
                    if (!nest.overlay)
                        enter = false;
                    else if (ranges.length)
                        covered = { ranges, depth: 0, prev: covered };
                }
            }
            else if (overlay && (range = overlay.predicate(cursor))) {
                if (range === true)
                    range = new Range(cursor.from, cursor.to);
                if (range.from < range.to)
                    overlay.ranges.push(range);
            }
            if (enter && cursor.firstChild()) {
                if (overlay)
                    overlay.depth++;
                if (covered)
                    covered.depth++;
            }
            else {
                for (;;) {
                    if (cursor.nextSibling())
                        break;
                    if (!cursor.parent())
                        break scan;
                    if (overlay && !--overlay.depth) {
                        let ranges = punchRanges(this.ranges, overlay.ranges);
                        if (ranges.length)
                            this.inner.splice(overlay.index, 0, new InnerParse(overlay.parser, overlay.parser.startParse(this.input, enterFragments(overlay.mounts, ranges), ranges), overlay.ranges.map(r => new Range(r.from - overlay.start, r.to - overlay.start)), overlay.target, ranges));
                        overlay = overlay.prev;
                    }
                    if (covered && !--covered.depth)
                        covered = covered.prev;
                }
            }
        }
    }
}
function checkCover(covered, from, to) {
    for (let range of covered) {
        if (range.from >= to)
            break;
        if (range.to > from)
            return range.from <= from && range.to >= to ? 2 /* Cover.Full */ : 1 /* Cover.Partial */;
    }
    return 0 /* Cover.None */;
}
// Take a piece of buffer and convert it into a stand-alone
// TreeBuffer.
function sliceBuf(buf, startI, endI, nodes, positions, off) {
    if (startI < endI) {
        let from = buf.buffer[startI + 1];
        nodes.push(buf.slice(startI, endI, from));
        positions.push(from - off);
    }
}
// This function takes a node that's in a buffer, and converts it, and
// its parent buffer nodes, into a Tree. This is again acting on the
// assumption that the trees and buffers have been constructed by the
// parse that was ran via the mix parser, and thus aren't shared with
// any other code, making violations of the immutability safe.
function materialize(cursor) {
    let { node } = cursor, depth = 0;
    // Scan up to the nearest tree
    do {
        cursor.parent();
        depth++;
    } while (!cursor.tree);
    // Find the index of the buffer in that tree
    let i = 0, base = cursor.tree, off = 0;
    for (;; i++) {
        off = base.positions[i] + cursor.from;
        if (off <= node.from && off + base.children[i].length >= node.to)
            break;
    }
    let buf = base.children[i], b = buf.buffer;
    // Split a level in the buffer, putting the nodes before and after
    // the child that contains `node` into new buffers.
    function split(startI, endI, type, innerOffset, length) {
        let i = startI;
        while (b[i + 2] + off <= node.from)
            i = b[i + 3];
        let children = [], positions = [];
        sliceBuf(buf, startI, i, children, positions, innerOffset);
        let from = b[i + 1], to = b[i + 2];
        let isTarget = from + off == node.from && to + off == node.to && b[i] == node.type.id;
        children.push(isTarget ? node.toTree() : split(i + 4, b[i + 3], buf.set.types[b[i]], from, to - from));
        positions.push(from - innerOffset);
        sliceBuf(buf, b[i + 3], endI, children, positions, innerOffset);
        return new Tree(type, children, positions, length);
    }
    base.children[i] = split(0, b.length, NodeType.none, 0, buf.length);
    // Move the cursor back to the target node
    for (let d = 0; d <= depth; d++)
        cursor.childAfter(node.from);
}
class StructureCursor {
    constructor(root, offset) {
        this.offset = offset;
        this.done = false;
        this.cursor = root.cursor(exports.IterMode.IncludeAnonymous | exports.IterMode.IgnoreMounts);
    }
    // Move to the first node (in pre-order) that starts at or after `pos`.
    moveTo(pos) {
        let { cursor } = this, p = pos - this.offset;
        while (!this.done && cursor.from < p) {
            if (cursor.to >= pos && cursor.enter(p, 1, exports.IterMode.IgnoreOverlays | exports.IterMode.ExcludeBuffers)) ;
            else if (!cursor.next(false))
                this.done = true;
        }
    }
    hasNode(cursor) {
        this.moveTo(cursor.from);
        if (!this.done && this.cursor.from + this.offset == cursor.from && this.cursor.tree) {
            for (let tree = this.cursor.tree;;) {
                if (tree == cursor.tree)
                    return true;
                if (tree.children.length && tree.positions[0] == 0 && tree.children[0] instanceof Tree)
                    tree = tree.children[0];
                else
                    break;
            }
        }
        return false;
    }
}
class FragmentCursor {
    constructor(fragments) {
        var _a;
        this.fragments = fragments;
        this.curTo = 0;
        this.fragI = 0;
        if (fragments.length) {
            let first = this.curFrag = fragments[0];
            this.curTo = (_a = first.tree.prop(stoppedInner)) !== null && _a !== void 0 ? _a : first.to;
            this.inner = new StructureCursor(first.tree, -first.offset);
        }
        else {
            this.curFrag = this.inner = null;
        }
    }
    hasNode(node) {
        while (this.curFrag && node.from >= this.curTo)
            this.nextFrag();
        return this.curFrag && this.curFrag.from <= node.from && this.curTo >= node.to && this.inner.hasNode(node);
    }
    nextFrag() {
        var _a;
        this.fragI++;
        if (this.fragI == this.fragments.length) {
            this.curFrag = this.inner = null;
        }
        else {
            let frag = this.curFrag = this.fragments[this.fragI];
            this.curTo = (_a = frag.tree.prop(stoppedInner)) !== null && _a !== void 0 ? _a : frag.to;
            this.inner = new StructureCursor(frag.tree, -frag.offset);
        }
    }
    findMounts(pos, parser) {
        var _a;
        let result = [];
        if (this.inner) {
            this.inner.cursor.moveTo(pos, 1);
            for (let pos = this.inner.cursor.node; pos; pos = pos.parent) {
                let mount = (_a = pos.tree) === null || _a === void 0 ? void 0 : _a.prop(NodeProp.mounted);
                if (mount && mount.parser == parser) {
                    for (let i = this.fragI; i < this.fragments.length; i++) {
                        let frag = this.fragments[i];
                        if (frag.from >= pos.to)
                            break;
                        if (frag.tree == this.curFrag.tree)
                            result.push({
                                frag,
                                pos: pos.from - frag.offset,
                                mount
                            });
                    }
                }
            }
        }
        return result;
    }
}
function punchRanges(outer, ranges) {
    let copy = null, current = ranges;
    for (let i = 1, j = 0; i < outer.length; i++) {
        let gapFrom = outer[i - 1].to, gapTo = outer[i].from;
        for (; j < current.length; j++) {
            let r = current[j];
            if (r.from >= gapTo)
                break;
            if (r.to <= gapFrom)
                continue;
            if (!copy)
                current = copy = ranges.slice();
            if (r.from < gapFrom) {
                copy[j] = new Range(r.from, gapFrom);
                if (r.to > gapTo)
                    copy.splice(j + 1, 0, new Range(gapTo, r.to));
            }
            else if (r.to > gapTo) {
                copy[j--] = new Range(gapTo, r.to);
            }
            else {
                copy.splice(j--, 1);
            }
        }
    }
    return current;
}
function findCoverChanges(a, b, from, to) {
    let iA = 0, iB = 0, inA = false, inB = false, pos = -1e9;
    let result = [];
    for (;;) {
        let nextA = iA == a.length ? 1e9 : inA ? a[iA].to : a[iA].from;
        let nextB = iB == b.length ? 1e9 : inB ? b[iB].to : b[iB].from;
        if (inA != inB) {
            let start = Math.max(pos, from), end = Math.min(nextA, nextB, to);
            if (start < end)
                result.push(new Range(start, end));
        }
        pos = Math.min(nextA, nextB);
        if (pos == 1e9)
            break;
        if (nextA == pos) {
            if (!inA)
                inA = true;
            else {
                inA = false;
                iA++;
            }
        }
        if (nextB == pos) {
            if (!inB)
                inB = true;
            else {
                inB = false;
                iB++;
            }
        }
    }
    return result;
}
// Given a number of fragments for the outer tree, and a set of ranges
// to parse, find fragments for inner trees mounted around those
// ranges, if any.
function enterFragments(mounts, ranges) {
    let result = [];
    for (let { pos, mount, frag } of mounts) {
        let startPos = pos + (mount.overlay ? mount.overlay[0].from : 0), endPos = startPos + mount.tree.length;
        let from = Math.max(frag.from, startPos), to = Math.min(frag.to, endPos);
        if (mount.overlay) {
            let overlay = mount.overlay.map(r => new Range(r.from + pos, r.to + pos));
            let changes = findCoverChanges(ranges, overlay, from, to);
            for (let i = 0, pos = from;; i++) {
                let last = i == changes.length, end = last ? to : changes[i].from;
                if (end > pos)
                    result.push(new TreeFragment(pos, end, mount.tree, -startPos, frag.from >= pos || frag.openStart, frag.to <= end || frag.openEnd));
                if (last)
                    break;
                pos = changes[i].to;
            }
        }
        else {
            result.push(new TreeFragment(from, to, mount.tree, -startPos, frag.from >= startPos || frag.openStart, frag.to <= endPos || frag.openEnd));
        }
    }
    return result;
}

exports.DefaultBufferLength = DefaultBufferLength;
exports.MountedTree = MountedTree;
exports.NodeProp = NodeProp;
exports.NodeSet = NodeSet;
exports.NodeType = NodeType;
exports.NodeWeakMap = NodeWeakMap;
exports.Parser = Parser;
exports.Tree = Tree;
exports.TreeBuffer = TreeBuffer;
exports.TreeCursor = TreeCursor;
exports.TreeFragment = TreeFragment;
exports.parseMixed = parseMixed;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('@lezer/common');

let nextTagID = 0;
/// Highlighting tags are markers that denote a highlighting category.
/// They are [associated](#highlight.styleTags) with parts of a syntax
/// tree by a language mode, and then mapped to an actual CSS style by
/// a [highlighter](#highlight.Highlighter).
///
/// Because syntax tree node types and highlight styles have to be
/// able to talk the same language, CodeMirror uses a mostly _closed_
/// [vocabulary](#highlight.tags) of syntax tags (as opposed to
/// traditional open string-based systems, which make it hard for
/// highlighting themes to cover all the tokens produced by the
/// various languages).
///
/// It _is_ possible to [define](#highlight.Tag^define) your own
/// highlighting tags for system-internal use (where you control both
/// the language package and the highlighter), but such tags will not
/// be picked up by regular highlighters (though you can derive them
/// from standard tags to allow highlighters to fall back to those).
class Tag {
    /// @internal
    constructor(
    /// The set of this tag and all its parent tags, starting with
    /// this one itself and sorted in order of decreasing specificity.
    set, 
    /// The base unmodified tag that this one is based on, if it's
    /// modified @internal
    base, 
    /// The modifiers applied to this.base @internal
    modified) {
        this.set = set;
        this.base = base;
        this.modified = modified;
        /// @internal
        this.id = nextTagID++;
    }
    /// Define a new tag. If `parent` is given, the tag is treated as a
    /// sub-tag of that parent, and
    /// [highlighters](#highlight.tagHighlighter) that don't mention
    /// this tag will try to fall back to the parent tag (or grandparent
    /// tag, etc).
    static define(parent) {
        if (parent === null || parent === void 0 ? void 0 : parent.base)
            throw new Error("Can not derive from a modified tag");
        let tag = new Tag([], null, []);
        tag.set.push(tag);
        if (parent)
            for (let t of parent.set)
                tag.set.push(t);
        return tag;
    }
    /// Define a tag _modifier_, which is a function that, given a tag,
    /// will return a tag that is a subtag of the original. Applying the
    /// same modifier to a twice tag will return the same value (`m1(t1)
    /// == m1(t1)`) and applying multiple modifiers will, regardless or
    /// order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
    ///
    /// When multiple modifiers are applied to a given base tag, each
    /// smaller set of modifiers is registered as a parent, so that for
    /// example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
    /// `m1(m3(t1)`, and so on.
    static defineModifier() {
        let mod = new Modifier;
        return (tag) => {
            if (tag.modified.indexOf(mod) > -1)
                return tag;
            return Modifier.get(tag.base || tag, tag.modified.concat(mod).sort((a, b) => a.id - b.id));
        };
    }
}
let nextModifierID = 0;
class Modifier {
    constructor() {
        this.instances = [];
        this.id = nextModifierID++;
    }
    static get(base, mods) {
        if (!mods.length)
            return base;
        let exists = mods[0].instances.find(t => t.base == base && sameArray(mods, t.modified));
        if (exists)
            return exists;
        let set = [], tag = new Tag(set, base, mods);
        for (let m of mods)
            m.instances.push(tag);
        let configs = powerSet(mods);
        for (let parent of base.set)
            if (!parent.modified.length)
                for (let config of configs)
                    set.push(Modifier.get(parent, config));
        return tag;
    }
}
function sameArray(a, b) {
    return a.length == b.length && a.every((x, i) => x == b[i]);
}
function powerSet(array) {
    let sets = [[]];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0, e = sets.length; j < e; j++) {
            sets.push(sets[j].concat(array[i]));
        }
    }
    return sets.sort((a, b) => b.length - a.length);
}
/// This function is used to add a set of tags to a language syntax
/// via [`NodeSet.extend`](#common.NodeSet.extend) or
/// [`LRParser.configure`](#lr.LRParser.configure).
///
/// The argument object maps node selectors to [highlighting
/// tags](#highlight.Tag) or arrays of tags.
///
/// Node selectors may hold one or more (space-separated) node paths.
/// Such a path can be a [node name](#common.NodeType.name), or
/// multiple node names (or `*` wildcards) separated by slash
/// characters, as in `"Block/Declaration/VariableName"`. Such a path
/// matches the final node but only if its direct parent nodes are the
/// other nodes mentioned. A `*` in such a path matches any parent,
/// but only a single level—wildcards that match multiple parents
/// aren't supported, both for efficiency reasons and because Lezer
/// trees make it rather hard to reason about what they would match.)
///
/// A path can be ended with `/...` to indicate that the tag assigned
/// to the node should also apply to all child nodes, even if they
/// match their own style (by default, only the innermost style is
/// used).
///
/// When a path ends in `!`, as in `Attribute!`, no further matching
/// happens for the node's child nodes, and the entire node gets the
/// given style.
///
/// In this notation, node names that contain `/`, `!`, `*`, or `...`
/// must be quoted as JSON strings.
///
/// For example:
///
/// ```javascript
/// parser.withProps(
///   styleTags({
///     // Style Number and BigNumber nodes
///     "Number BigNumber": tags.number,
///     // Style Escape nodes whose parent is String
///     "String/Escape": tags.escape,
///     // Style anything inside Attributes nodes
///     "Attributes!": tags.meta,
///     // Add a style to all content inside Italic nodes
///     "Italic/...": tags.emphasis,
///     // Style InvalidString nodes as both `string` and `invalid`
///     "InvalidString": [tags.string, tags.invalid],
///     // Style the node named "/" as punctuation
///     '"/"': tags.punctuation
///   })
/// )
/// ```
function styleTags(spec) {
    let byName = Object.create(null);
    for (let prop in spec) {
        let tags = spec[prop];
        if (!Array.isArray(tags))
            tags = [tags];
        for (let part of prop.split(" "))
            if (part) {
                let pieces = [], mode = 2 /* Mode.Normal */, rest = part;
                for (let pos = 0;;) {
                    if (rest == "..." && pos > 0 && pos + 3 == part.length) {
                        mode = 1 /* Mode.Inherit */;
                        break;
                    }
                    let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
                    if (!m)
                        throw new RangeError("Invalid path: " + part);
                    pieces.push(m[0] == "*" ? "" : m[0][0] == '"' ? JSON.parse(m[0]) : m[0]);
                    pos += m[0].length;
                    if (pos == part.length)
                        break;
                    let next = part[pos++];
                    if (pos == part.length && next == "!") {
                        mode = 0 /* Mode.Opaque */;
                        break;
                    }
                    if (next != "/")
                        throw new RangeError("Invalid path: " + part);
                    rest = part.slice(pos);
                }
                let last = pieces.length - 1, inner = pieces[last];
                if (!inner)
                    throw new RangeError("Invalid path: " + part);
                let rule = new Rule(tags, mode, last > 0 ? pieces.slice(0, last) : null);
                byName[inner] = rule.sort(byName[inner]);
            }
    }
    return ruleNodeProp.add(byName);
}
const ruleNodeProp = new common.NodeProp();
class Rule {
    constructor(tags, mode, context, next) {
        this.tags = tags;
        this.mode = mode;
        this.context = context;
        this.next = next;
    }
    get opaque() { return this.mode == 0 /* Mode.Opaque */; }
    get inherit() { return this.mode == 1 /* Mode.Inherit */; }
    sort(other) {
        if (!other || other.depth < this.depth) {
            this.next = other;
            return this;
        }
        other.next = this.sort(other.next);
        return other;
    }
    get depth() { return this.context ? this.context.length : 0; }
}
Rule.empty = new Rule([], 2 /* Mode.Normal */, null);
/// Define a [highlighter](#highlight.Highlighter) from an array of
/// tag/class pairs. Classes associated with more specific tags will
/// take precedence.
function tagHighlighter(tags, options) {
    let map = Object.create(null);
    for (let style of tags) {
        if (!Array.isArray(style.tag))
            map[style.tag.id] = style.class;
        else
            for (let tag of style.tag)
                map[tag.id] = style.class;
    }
    let { scope, all = null } = options || {};
    return {
        style: (tags) => {
            let cls = all;
            for (let tag of tags) {
                for (let sub of tag.set) {
                    let tagClass = map[sub.id];
                    if (tagClass) {
                        cls = cls ? cls + " " + tagClass : tagClass;
                        break;
                    }
                }
            }
            return cls;
        },
        scope
    };
}
function highlightTags(highlighters, tags) {
    let result = null;
    for (let highlighter of highlighters) {
        let value = highlighter.style(tags);
        if (value)
            result = result ? result + " " + value : value;
    }
    return result;
}
/// Highlight the given [tree](#common.Tree) with the given
/// [highlighter](#highlight.Highlighter).
function highlightTree(tree, highlighter, 
/// Assign styling to a region of the text. Will be called, in order
/// of position, for any ranges where more than zero classes apply.
/// `classes` is a space separated string of CSS classes.
putStyle, 
/// The start of the range to highlight.
from = 0, 
/// The end of the range.
to = tree.length) {
    let builder = new HighlightBuilder(from, Array.isArray(highlighter) ? highlighter : [highlighter], putStyle);
    builder.highlightRange(tree.cursor(), from, to, "", builder.highlighters);
    builder.flush(to);
}
class HighlightBuilder {
    constructor(at, highlighters, span) {
        this.at = at;
        this.highlighters = highlighters;
        this.span = span;
        this.class = "";
    }
    startSpan(at, cls) {
        if (cls != this.class) {
            this.flush(at);
            if (at > this.at)
                this.at = at;
            this.class = cls;
        }
    }
    flush(to) {
        if (to > this.at && this.class)
            this.span(this.at, to, this.class);
    }
    highlightRange(cursor, from, to, inheritedClass, highlighters) {
        let { type, from: start, to: end } = cursor;
        if (start >= to || end <= from)
            return;
        if (type.isTop)
            highlighters = this.highlighters.filter(h => !h.scope || h.scope(type));
        let cls = inheritedClass;
        let rule = getStyleTags(cursor) || Rule.empty;
        let tagCls = highlightTags(highlighters, rule.tags);
        if (tagCls) {
            if (cls)
                cls += " ";
            cls += tagCls;
            if (rule.mode == 1 /* Mode.Inherit */)
                inheritedClass += (inheritedClass ? " " : "") + tagCls;
        }
        this.startSpan(cursor.from, cls);
        if (rule.opaque)
            return;
        let mounted = cursor.tree && cursor.tree.prop(common.NodeProp.mounted);
        if (mounted && mounted.overlay) {
            let inner = cursor.node.enter(mounted.overlay[0].from + start, 1);
            let innerHighlighters = this.highlighters.filter(h => !h.scope || h.scope(mounted.tree.type));
            let hasChild = cursor.firstChild();
            for (let i = 0, pos = start;; i++) {
                let next = i < mounted.overlay.length ? mounted.overlay[i] : null;
                let nextPos = next ? next.from + start : end;
                let rangeFrom = Math.max(from, pos), rangeTo = Math.min(to, nextPos);
                if (rangeFrom < rangeTo && hasChild) {
                    while (cursor.from < rangeTo) {
                        this.highlightRange(cursor, rangeFrom, rangeTo, inheritedClass, highlighters);
                        this.startSpan(Math.min(rangeTo, cursor.to), cls);
                        if (cursor.to >= nextPos || !cursor.nextSibling())
                            break;
                    }
                }
                if (!next || nextPos > to)
                    break;
                pos = next.to + start;
                if (pos > from) {
                    this.highlightRange(inner.cursor(), Math.max(from, next.from + start), Math.min(to, pos), inheritedClass, innerHighlighters);
                    this.startSpan(pos, cls);
                }
            }
            if (hasChild)
                cursor.parent();
        }
        else if (cursor.firstChild()) {
            do {
                if (cursor.to <= from)
                    continue;
                if (cursor.from >= to)
                    break;
                this.highlightRange(cursor, from, to, inheritedClass, highlighters);
                this.startSpan(Math.min(to, cursor.to), cls);
            } while (cursor.nextSibling());
            cursor.parent();
        }
    }
}
/// Match a syntax node's [highlight rules](#highlight.styleTags). If
/// there's a match, return its set of tags, and whether it is
/// opaque (uses a `!`) or applies to all child nodes (`/...`).
function getStyleTags(node) {
    let rule = node.type.prop(ruleNodeProp);
    while (rule && rule.context && !node.matchContext(rule.context))
        rule = rule.next;
    return rule || null;
}
const t = Tag.define;
const comment = t(), name = t(), typeName = t(name), propertyName = t(name), literal = t(), string = t(literal), number = t(literal), content = t(), heading = t(content), keyword = t(), operator = t(), punctuation = t(), bracket = t(punctuation), meta = t();
/// The default set of highlighting [tags](#highlight.Tag).
///
/// This collection is heavily biased towards programming languages,
/// and necessarily incomplete. A full ontology of syntactic
/// constructs would fill a stack of books, and be impractical to
/// write themes for. So try to make do with this set. If all else
/// fails, [open an
/// issue](https://github.com/codemirror/codemirror.next) to propose a
/// new tag, or [define](#highlight.Tag^define) a local custom tag for
/// your use case.
///
/// Note that it is not obligatory to always attach the most specific
/// tag possible to an element—if your grammar can't easily
/// distinguish a certain type of element (such as a local variable),
/// it is okay to style it as its more general variant (a variable).
/// 
/// For tags that extend some parent tag, the documentation links to
/// the parent.
const tags = {
    /// A comment.
    comment,
    /// A line [comment](#highlight.tags.comment).
    lineComment: t(comment),
    /// A block [comment](#highlight.tags.comment).
    blockComment: t(comment),
    /// A documentation [comment](#highlight.tags.comment).
    docComment: t(comment),
    /// Any kind of identifier.
    name,
    /// The [name](#highlight.tags.name) of a variable.
    variableName: t(name),
    /// A type [name](#highlight.tags.name).
    typeName: typeName,
    /// A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
    tagName: t(typeName),
    /// A property or field [name](#highlight.tags.name).
    propertyName: propertyName,
    /// An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
    attributeName: t(propertyName),
    /// The [name](#highlight.tags.name) of a class.
    className: t(name),
    /// A label [name](#highlight.tags.name).
    labelName: t(name),
    /// A namespace [name](#highlight.tags.name).
    namespace: t(name),
    /// The [name](#highlight.tags.name) of a macro.
    macroName: t(name),
    /// A literal value.
    literal,
    /// A string [literal](#highlight.tags.literal).
    string,
    /// A documentation [string](#highlight.tags.string).
    docString: t(string),
    /// A character literal (subtag of [string](#highlight.tags.string)).
    character: t(string),
    /// An attribute value (subtag of [string](#highlight.tags.string)).
    attributeValue: t(string),
    /// A number [literal](#highlight.tags.literal).
    number,
    /// An integer [number](#highlight.tags.number) literal.
    integer: t(number),
    /// A floating-point [number](#highlight.tags.number) literal.
    float: t(number),
    /// A boolean [literal](#highlight.tags.literal).
    bool: t(literal),
    /// Regular expression [literal](#highlight.tags.literal).
    regexp: t(literal),
    /// An escape [literal](#highlight.tags.literal), for example a
    /// backslash escape in a string.
    escape: t(literal),
    /// A color [literal](#highlight.tags.literal).
    color: t(literal),
    /// A URL [literal](#highlight.tags.literal).
    url: t(literal),
    /// A language keyword.
    keyword,
    /// The [keyword](#highlight.tags.keyword) for the self or this
    /// object.
    self: t(keyword),
    /// The [keyword](#highlight.tags.keyword) for null.
    null: t(keyword),
    /// A [keyword](#highlight.tags.keyword) denoting some atomic value.
    atom: t(keyword),
    /// A [keyword](#highlight.tags.keyword) that represents a unit.
    unit: t(keyword),
    /// A modifier [keyword](#highlight.tags.keyword).
    modifier: t(keyword),
    /// A [keyword](#highlight.tags.keyword) that acts as an operator.
    operatorKeyword: t(keyword),
    /// A control-flow related [keyword](#highlight.tags.keyword).
    controlKeyword: t(keyword),
    /// A [keyword](#highlight.tags.keyword) that defines something.
    definitionKeyword: t(keyword),
    /// A [keyword](#highlight.tags.keyword) related to defining or
    /// interfacing with modules.
    moduleKeyword: t(keyword),
    /// An operator.
    operator,
    /// An [operator](#highlight.tags.operator) that dereferences something.
    derefOperator: t(operator),
    /// Arithmetic-related [operator](#highlight.tags.operator).
    arithmeticOperator: t(operator),
    /// Logical [operator](#highlight.tags.operator).
    logicOperator: t(operator),
    /// Bit [operator](#highlight.tags.operator).
    bitwiseOperator: t(operator),
    /// Comparison [operator](#highlight.tags.operator).
    compareOperator: t(operator),
    /// [Operator](#highlight.tags.operator) that updates its operand.
    updateOperator: t(operator),
    /// [Operator](#highlight.tags.operator) that defines something.
    definitionOperator: t(operator),
    /// Type-related [operator](#highlight.tags.operator).
    typeOperator: t(operator),
    /// Control-flow [operator](#highlight.tags.operator).
    controlOperator: t(operator),
    /// Program or markup punctuation.
    punctuation,
    /// [Punctuation](#highlight.tags.punctuation) that separates
    /// things.
    separator: t(punctuation),
    /// Bracket-style [punctuation](#highlight.tags.punctuation).
    bracket,
    /// Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
    /// tokens).
    angleBracket: t(bracket),
    /// Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
    /// tokens).
    squareBracket: t(bracket),
    /// Parentheses (usually `(` and `)` tokens). Subtag of
    /// [bracket](#highlight.tags.bracket).
    paren: t(bracket),
    /// Braces (usually `{` and `}` tokens). Subtag of
    /// [bracket](#highlight.tags.bracket).
    brace: t(bracket),
    /// Content, for example plain text in XML or markup documents.
    content,
    /// [Content](#highlight.tags.content) that represents a heading.
    heading,
    /// A level 1 [heading](#highlight.tags.heading).
    heading1: t(heading),
    /// A level 2 [heading](#highlight.tags.heading).
    heading2: t(heading),
    /// A level 3 [heading](#highlight.tags.heading).
    heading3: t(heading),
    /// A level 4 [heading](#highlight.tags.heading).
    heading4: t(heading),
    /// A level 5 [heading](#highlight.tags.heading).
    heading5: t(heading),
    /// A level 6 [heading](#highlight.tags.heading).
    heading6: t(heading),
    /// A prose separator (such as a horizontal rule).
    contentSeparator: t(content),
    /// [Content](#highlight.tags.content) that represents a list.
    list: t(content),
    /// [Content](#highlight.tags.content) that represents a quote.
    quote: t(content),
    /// [Content](#highlight.tags.content) that is emphasized.
    emphasis: t(content),
    /// [Content](#highlight.tags.content) that is styled strong.
    strong: t(content),
    /// [Content](#highlight.tags.content) that is part of a link.
    link: t(content),
    /// [Content](#highlight.tags.content) that is styled as code or
    /// monospace.
    monospace: t(content),
    /// [Content](#highlight.tags.content) that has a strike-through
    /// style.
    strikethrough: t(content),
    /// Inserted text in a change-tracking format.
    inserted: t(),
    /// Deleted text.
    deleted: t(),
    /// Changed text.
    changed: t(),
    /// An invalid or unsyntactic element.
    invalid: t(),
    /// Metadata or meta-instruction.
    meta,
    /// [Metadata](#highlight.tags.meta) that applies to the entire
    /// document.
    documentMeta: t(meta),
    /// [Metadata](#highlight.tags.meta) that annotates or adds
    /// attributes to a given syntactic element.
    annotation: t(meta),
    /// Processing instruction or preprocessor directive. Subtag of
    /// [meta](#highlight.tags.meta).
    processingInstruction: t(meta),
    /// [Modifier](#highlight.Tag^defineModifier) that indicates that a
    /// given element is being defined. Expected to be used with the
    /// various [name](#highlight.tags.name) tags.
    definition: Tag.defineModifier(),
    /// [Modifier](#highlight.Tag^defineModifier) that indicates that
    /// something is constant. Mostly expected to be used with
    /// [variable names](#highlight.tags.variableName).
    constant: Tag.defineModifier(),
    /// [Modifier](#highlight.Tag^defineModifier) used to indicate that
    /// a [variable](#highlight.tags.variableName) or [property
    /// name](#highlight.tags.propertyName) is being called or defined
    /// as a function.
    function: Tag.defineModifier(),
    /// [Modifier](#highlight.Tag^defineModifier) that can be applied to
    /// [names](#highlight.tags.name) to indicate that they belong to
    /// the language's standard environment.
    standard: Tag.defineModifier(),
    /// [Modifier](#highlight.Tag^defineModifier) that indicates a given
    /// [names](#highlight.tags.name) is local to some scope.
    local: Tag.defineModifier(),
    /// A generic variant [modifier](#highlight.Tag^defineModifier) that
    /// can be used to tag language-specific alternative variants of
    /// some common tag. It is recommended for themes to define special
    /// forms of at least the [string](#highlight.tags.string) and
    /// [variable name](#highlight.tags.variableName) tags, since those
    /// come up a lot.
    special: Tag.defineModifier()
};
/// This is a highlighter that adds stable, predictable classes to
/// tokens, for styling with external CSS.
///
/// The following tags are mapped to their name prefixed with `"tok-"`
/// (for example `"tok-comment"`):
///
/// * [`link`](#highlight.tags.link)
/// * [`heading`](#highlight.tags.heading)
/// * [`emphasis`](#highlight.tags.emphasis)
/// * [`strong`](#highlight.tags.strong)
/// * [`keyword`](#highlight.tags.keyword)
/// * [`atom`](#highlight.tags.atom)
/// * [`bool`](#highlight.tags.bool)
/// * [`url`](#highlight.tags.url)
/// * [`labelName`](#highlight.tags.labelName)
/// * [`inserted`](#highlight.tags.inserted)
/// * [`deleted`](#highlight.tags.deleted)
/// * [`literal`](#highlight.tags.literal)
/// * [`string`](#highlight.tags.string)
/// * [`number`](#highlight.tags.number)
/// * [`variableName`](#highlight.tags.variableName)
/// * [`typeName`](#highlight.tags.typeName)
/// * [`namespace`](#highlight.tags.namespace)
/// * [`className`](#highlight.tags.className)
/// * [`macroName`](#highlight.tags.macroName)
/// * [`propertyName`](#highlight.tags.propertyName)
/// * [`operator`](#highlight.tags.operator)
/// * [`comment`](#highlight.tags.comment)
/// * [`meta`](#highlight.tags.meta)
/// * [`punctuation`](#highlight.tags.punctuation)
/// * [`invalid`](#highlight.tags.invalid)
///
/// In addition, these mappings are provided:
///
/// * [`regexp`](#highlight.tags.regexp),
///   [`escape`](#highlight.tags.escape), and
///   [`special`](#highlight.tags.special)[`(string)`](#highlight.tags.string)
///   are mapped to `"tok-string2"`
/// * [`special`](#highlight.tags.special)[`(variableName)`](#highlight.tags.variableName)
///   to `"tok-variableName2"`
/// * [`local`](#highlight.tags.local)[`(variableName)`](#highlight.tags.variableName)
///   to `"tok-variableName tok-local"`
/// * [`definition`](#highlight.tags.definition)[`(variableName)`](#highlight.tags.variableName)
///   to `"tok-variableName tok-definition"`
/// * [`definition`](#highlight.tags.definition)[`(propertyName)`](#highlight.tags.propertyName)
///   to `"tok-propertyName tok-definition"`
const classHighlighter = tagHighlighter([
    { tag: tags.link, class: "tok-link" },
    { tag: tags.heading, class: "tok-heading" },
    { tag: tags.emphasis, class: "tok-emphasis" },
    { tag: tags.strong, class: "tok-strong" },
    { tag: tags.keyword, class: "tok-keyword" },
    { tag: tags.atom, class: "tok-atom" },
    { tag: tags.bool, class: "tok-bool" },
    { tag: tags.url, class: "tok-url" },
    { tag: tags.labelName, class: "tok-labelName" },
    { tag: tags.inserted, class: "tok-inserted" },
    { tag: tags.deleted, class: "tok-deleted" },
    { tag: tags.literal, class: "tok-literal" },
    { tag: tags.string, class: "tok-string" },
    { tag: tags.number, class: "tok-number" },
    { tag: [tags.regexp, tags.escape, tags.special(tags.string)], class: "tok-string2" },
    { tag: tags.variableName, class: "tok-variableName" },
    { tag: tags.local(tags.variableName), class: "tok-variableName tok-local" },
    { tag: tags.definition(tags.variableName), class: "tok-variableName tok-definition" },
    { tag: tags.special(tags.variableName), class: "tok-variableName2" },
    { tag: tags.definition(tags.propertyName), class: "tok-propertyName tok-definition" },
    { tag: tags.typeName, class: "tok-typeName" },
    { tag: tags.namespace, class: "tok-namespace" },
    { tag: tags.className, class: "tok-className" },
    { tag: tags.macroName, class: "tok-macroName" },
    { tag: tags.propertyName, class: "tok-propertyName" },
    { tag: tags.operator, class: "tok-operator" },
    { tag: tags.comment, class: "tok-comment" },
    { tag: tags.meta, class: "tok-meta" },
    { tag: tags.invalid, class: "tok-invalid" },
    { tag: tags.punctuation, class: "tok-punctuation" }
]);

exports.Tag = Tag;
exports.classHighlighter = classHighlighter;
exports.getStyleTags = getStyleTags;
exports.highlightTree = highlightTree;
exports.styleTags = styleTags;
exports.tagHighlighter = tagHighlighter;
exports.tags = tags;

},{"@lezer/common":4}],6:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('@lezer/common');

/// A parse stack. These are used internally by the parser to track
/// parsing progress. They also provide some properties and methods
/// that external code such as a tokenizer can use to get information
/// about the parse state.
class Stack {
    /// @internal
    constructor(
    /// The parse that this stack is part of @internal
    p, 
    /// Holds state, input pos, buffer index triplets for all but the
    /// top state @internal
    stack, 
    /// The current parse state @internal
    state, 
    // The position at which the next reduce should take place. This
    // can be less than `this.pos` when skipped expressions have been
    // added to the stack (which should be moved outside of the next
    // reduction)
    /// @internal
    reducePos, 
    /// The input position up to which this stack has parsed.
    pos, 
    /// The dynamic score of the stack, including dynamic precedence
    /// and error-recovery penalties
    /// @internal
    score, 
    // The output buffer. Holds (type, start, end, size) quads
    // representing nodes created by the parser, where `size` is
    // amount of buffer array entries covered by this node.
    /// @internal
    buffer, 
    // The base offset of the buffer. When stacks are split, the split
    // instance shared the buffer history with its parent up to
    // `bufferBase`, which is the absolute offset (including the
    // offset of previous splits) into the buffer at which this stack
    // starts writing.
    /// @internal
    bufferBase, 
    /// @internal
    curContext, 
    /// @internal
    lookAhead = 0, 
    // A parent stack from which this was split off, if any. This is
    // set up so that it always points to a stack that has some
    // additional buffer content, never to a stack with an equal
    // `bufferBase`.
    /// @internal
    parent) {
        this.p = p;
        this.stack = stack;
        this.state = state;
        this.reducePos = reducePos;
        this.pos = pos;
        this.score = score;
        this.buffer = buffer;
        this.bufferBase = bufferBase;
        this.curContext = curContext;
        this.lookAhead = lookAhead;
        this.parent = parent;
    }
    /// @internal
    toString() {
        return `[${this.stack.filter((_, i) => i % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
    }
    // Start an empty stack
    /// @internal
    static start(p, state, pos = 0) {
        let cx = p.parser.context;
        return new Stack(p, [], state, pos, pos, 0, [], 0, cx ? new StackContext(cx, cx.start) : null, 0, null);
    }
    /// The stack's current [context](#lr.ContextTracker) value, if
    /// any. Its type will depend on the context tracker's type
    /// parameter, or it will be `null` if there is no context
    /// tracker.
    get context() { return this.curContext ? this.curContext.context : null; }
    // Push a state onto the stack, tracking its start position as well
    // as the buffer base at that point.
    /// @internal
    pushState(state, start) {
        this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
        this.state = state;
    }
    // Apply a reduce action
    /// @internal
    reduce(action) {
        let depth = action >> 19 /* Action.ReduceDepthShift */, type = action & 65535 /* Action.ValueMask */;
        let { parser } = this.p;
        let dPrec = parser.dynamicPrecedence(type);
        if (dPrec)
            this.score += dPrec;
        if (depth == 0) {
            this.pushState(parser.getGoto(this.state, type, true), this.reducePos);
            // Zero-depth reductions are a special case—they add stuff to
            // the stack without popping anything off.
            if (type < parser.minRepeatTerm)
                this.storeNode(type, this.reducePos, this.reducePos, 4, true);
            this.reduceContext(type, this.reducePos);
            return;
        }
        // Find the base index into `this.stack`, content after which will
        // be dropped. Note that with `StayFlag` reductions we need to
        // consume two extra frames (the dummy parent node for the skipped
        // expression and the state that we'll be staying in, which should
        // be moved to `this.state`).
        let base = this.stack.length - ((depth - 1) * 3) - (action & 262144 /* Action.StayFlag */ ? 6 : 0);
        let start = base ? this.stack[base - 2] : 0, size = this.reducePos - start;
        // This is a kludge to try and detect overly deep left-associative
        // trees, which will not increase the parse stack depth and thus
        // won't be caught by the regular stack-depth limit check.
        if (size >= 2000 /* Recover.MinBigReduction */) {
            if (start == this.p.lastBigReductionStart) {
                this.p.bigReductionCount++;
                this.p.lastBigReductionSize = size;
            }
            else if (this.p.lastBigReductionSize < size) {
                this.p.bigReductionCount = 1;
                this.p.lastBigReductionStart = start;
                this.p.lastBigReductionSize = size;
            }
        }
        let bufferBase = base ? this.stack[base - 1] : 0, count = this.bufferBase + this.buffer.length - bufferBase;
        // Store normal terms or `R -> R R` repeat reductions
        if (type < parser.minRepeatTerm || (action & 131072 /* Action.RepeatFlag */)) {
            let pos = parser.stateFlag(this.state, 1 /* StateFlag.Skipped */) ? this.pos : this.reducePos;
            this.storeNode(type, start, pos, count + 4, true);
        }
        if (action & 262144 /* Action.StayFlag */) {
            this.state = this.stack[base];
        }
        else {
            let baseStateID = this.stack[base - 3];
            this.state = parser.getGoto(baseStateID, type, true);
        }
        while (this.stack.length > base)
            this.stack.pop();
        this.reduceContext(type, start);
    }
    // Shift a value into the buffer
    /// @internal
    storeNode(term, start, end, size = 4, isReduce = false) {
        if (term == 0 /* Term.Err */ &&
            (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
            // Try to omit/merge adjacent error nodes
            let cur = this, top = this.buffer.length;
            if (top == 0 && cur.parent) {
                top = cur.bufferBase - cur.parent.bufferBase;
                cur = cur.parent;
            }
            if (top > 0 && cur.buffer[top - 4] == 0 /* Term.Err */ && cur.buffer[top - 1] > -1) {
                if (start == end)
                    return;
                if (cur.buffer[top - 2] >= start) {
                    cur.buffer[top - 2] = end;
                    return;
                }
            }
        }
        if (!isReduce || this.pos == end) { // Simple case, just append
            this.buffer.push(term, start, end, size);
        }
        else { // There may be skipped nodes that have to be moved forward
            let index = this.buffer.length;
            if (index > 0 && this.buffer[index - 4] != 0 /* Term.Err */)
                while (index > 0 && this.buffer[index - 2] > end) {
                    // Move this record forward
                    this.buffer[index] = this.buffer[index - 4];
                    this.buffer[index + 1] = this.buffer[index - 3];
                    this.buffer[index + 2] = this.buffer[index - 2];
                    this.buffer[index + 3] = this.buffer[index - 1];
                    index -= 4;
                    if (size > 4)
                        size -= 4;
                }
            this.buffer[index] = term;
            this.buffer[index + 1] = start;
            this.buffer[index + 2] = end;
            this.buffer[index + 3] = size;
        }
    }
    // Apply a shift action
    /// @internal
    shift(action, next, nextEnd) {
        let start = this.pos;
        if (action & 131072 /* Action.GotoFlag */) {
            this.pushState(action & 65535 /* Action.ValueMask */, this.pos);
        }
        else if ((action & 262144 /* Action.StayFlag */) == 0) { // Regular shift
            let nextState = action, { parser } = this.p;
            if (nextEnd > this.pos || next <= parser.maxNode) {
                this.pos = nextEnd;
                if (!parser.stateFlag(nextState, 1 /* StateFlag.Skipped */))
                    this.reducePos = nextEnd;
            }
            this.pushState(nextState, start);
            this.shiftContext(next, start);
            if (next <= parser.maxNode)
                this.buffer.push(next, start, nextEnd, 4);
        }
        else { // Shift-and-stay, which means this is a skipped token
            this.pos = nextEnd;
            this.shiftContext(next, start);
            if (next <= this.p.parser.maxNode)
                this.buffer.push(next, start, nextEnd, 4);
        }
    }
    // Apply an action
    /// @internal
    apply(action, next, nextEnd) {
        if (action & 65536 /* Action.ReduceFlag */)
            this.reduce(action);
        else
            this.shift(action, next, nextEnd);
    }
    // Add a prebuilt (reused) node into the buffer.
    /// @internal
    useNode(value, next) {
        let index = this.p.reused.length - 1;
        if (index < 0 || this.p.reused[index] != value) {
            this.p.reused.push(value);
            index++;
        }
        let start = this.pos;
        this.reducePos = this.pos = start + value.length;
        this.pushState(next, start);
        this.buffer.push(index, start, this.reducePos, -1 /* size == -1 means this is a reused value */);
        if (this.curContext)
            this.updateContext(this.curContext.tracker.reuse(this.curContext.context, value, this, this.p.stream.reset(this.pos - value.length)));
    }
    // Split the stack. Due to the buffer sharing and the fact
    // that `this.stack` tends to stay quite shallow, this isn't very
    // expensive.
    /// @internal
    split() {
        let parent = this;
        let off = parent.buffer.length;
        // Because the top of the buffer (after this.pos) may be mutated
        // to reorder reductions and skipped tokens, and shared buffers
        // should be immutable, this copies any outstanding skipped tokens
        // to the new buffer, and puts the base pointer before them.
        while (off > 0 && parent.buffer[off - 2] > parent.reducePos)
            off -= 4;
        let buffer = parent.buffer.slice(off), base = parent.bufferBase + off;
        // Make sure parent points to an actual parent with content, if there is such a parent.
        while (parent && base == parent.bufferBase)
            parent = parent.parent;
        return new Stack(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, buffer, base, this.curContext, this.lookAhead, parent);
    }
    // Try to recover from an error by 'deleting' (ignoring) one token.
    /// @internal
    recoverByDelete(next, nextEnd) {
        let isNode = next <= this.p.parser.maxNode;
        if (isNode)
            this.storeNode(next, this.pos, nextEnd, 4);
        this.storeNode(0 /* Term.Err */, this.pos, nextEnd, isNode ? 8 : 4);
        this.pos = this.reducePos = nextEnd;
        this.score -= 190 /* Recover.Delete */;
    }
    /// Check if the given term would be able to be shifted (optionally
    /// after some reductions) on this stack. This can be useful for
    /// external tokenizers that want to make sure they only provide a
    /// given token when it applies.
    canShift(term) {
        for (let sim = new SimulatedStack(this);;) {
            let action = this.p.parser.stateSlot(sim.state, 4 /* ParseState.DefaultReduce */) || this.p.parser.hasAction(sim.state, term);
            if (action == 0)
                return false;
            if ((action & 65536 /* Action.ReduceFlag */) == 0)
                return true;
            sim.reduce(action);
        }
    }
    // Apply up to Recover.MaxNext recovery actions that conceptually
    // inserts some missing token or rule.
    /// @internal
    recoverByInsert(next) {
        if (this.stack.length >= 300 /* Recover.MaxInsertStackDepth */)
            return [];
        let nextStates = this.p.parser.nextStates(this.state);
        if (nextStates.length > 4 /* Recover.MaxNext */ << 1 || this.stack.length >= 120 /* Recover.DampenInsertStackDepth */) {
            let best = [];
            for (let i = 0, s; i < nextStates.length; i += 2) {
                if ((s = nextStates[i + 1]) != this.state && this.p.parser.hasAction(s, next))
                    best.push(nextStates[i], s);
            }
            if (this.stack.length < 120 /* Recover.DampenInsertStackDepth */)
                for (let i = 0; best.length < 4 /* Recover.MaxNext */ << 1 && i < nextStates.length; i += 2) {
                    let s = nextStates[i + 1];
                    if (!best.some((v, i) => (i & 1) && v == s))
                        best.push(nextStates[i], s);
                }
            nextStates = best;
        }
        let result = [];
        for (let i = 0; i < nextStates.length && result.length < 4 /* Recover.MaxNext */; i += 2) {
            let s = nextStates[i + 1];
            if (s == this.state)
                continue;
            let stack = this.split();
            stack.pushState(s, this.pos);
            stack.storeNode(0 /* Term.Err */, stack.pos, stack.pos, 4, true);
            stack.shiftContext(nextStates[i], this.pos);
            stack.score -= 200 /* Recover.Insert */;
            result.push(stack);
        }
        return result;
    }
    // Force a reduce, if possible. Return false if that can't
    // be done.
    /// @internal
    forceReduce() {
        let reduce = this.p.parser.stateSlot(this.state, 5 /* ParseState.ForcedReduce */);
        if ((reduce & 65536 /* Action.ReduceFlag */) == 0)
            return false;
        let { parser } = this.p;
        if (!parser.validAction(this.state, reduce)) {
            let depth = reduce >> 19 /* Action.ReduceDepthShift */, term = reduce & 65535 /* Action.ValueMask */;
            let target = this.stack.length - depth * 3;
            if (target < 0 || parser.getGoto(this.stack[target], term, false) < 0)
                return false;
            this.storeNode(0 /* Term.Err */, this.reducePos, this.reducePos, 4, true);
            this.score -= 100 /* Recover.Reduce */;
        }
        this.reducePos = this.pos;
        this.reduce(reduce);
        return true;
    }
    /// @internal
    forceAll() {
        while (!this.p.parser.stateFlag(this.state, 2 /* StateFlag.Accepting */)) {
            if (!this.forceReduce()) {
                this.storeNode(0 /* Term.Err */, this.pos, this.pos, 4, true);
                break;
            }
        }
        return this;
    }
    /// Check whether this state has no further actions (assumed to be a direct descendant of the
    /// top state, since any other states must be able to continue
    /// somehow). @internal
    get deadEnd() {
        if (this.stack.length != 3)
            return false;
        let { parser } = this.p;
        return parser.data[parser.stateSlot(this.state, 1 /* ParseState.Actions */)] == 65535 /* Seq.End */ &&
            !parser.stateSlot(this.state, 4 /* ParseState.DefaultReduce */);
    }
    /// Restart the stack (put it back in its start state). Only safe
    /// when this.stack.length == 3 (state is directly below the top
    /// state). @internal
    restart() {
        this.state = this.stack[0];
        this.stack.length = 0;
    }
    /// @internal
    sameState(other) {
        if (this.state != other.state || this.stack.length != other.stack.length)
            return false;
        for (let i = 0; i < this.stack.length; i += 3)
            if (this.stack[i] != other.stack[i])
                return false;
        return true;
    }
    /// Get the parser used by this stack.
    get parser() { return this.p.parser; }
    /// Test whether a given dialect (by numeric ID, as exported from
    /// the terms file) is enabled.
    dialectEnabled(dialectID) { return this.p.parser.dialect.flags[dialectID]; }
    shiftContext(term, start) {
        if (this.curContext)
            this.updateContext(this.curContext.tracker.shift(this.curContext.context, term, this, this.p.stream.reset(start)));
    }
    reduceContext(term, start) {
        if (this.curContext)
            this.updateContext(this.curContext.tracker.reduce(this.curContext.context, term, this, this.p.stream.reset(start)));
    }
    /// @internal
    emitContext() {
        let last = this.buffer.length - 1;
        if (last < 0 || this.buffer[last] != -3)
            this.buffer.push(this.curContext.hash, this.reducePos, this.reducePos, -3);
    }
    /// @internal
    emitLookAhead() {
        let last = this.buffer.length - 1;
        if (last < 0 || this.buffer[last] != -4)
            this.buffer.push(this.lookAhead, this.reducePos, this.reducePos, -4);
    }
    updateContext(context) {
        if (context != this.curContext.context) {
            let newCx = new StackContext(this.curContext.tracker, context);
            if (newCx.hash != this.curContext.hash)
                this.emitContext();
            this.curContext = newCx;
        }
    }
    /// @internal
    setLookAhead(lookAhead) {
        if (lookAhead > this.lookAhead) {
            this.emitLookAhead();
            this.lookAhead = lookAhead;
        }
    }
    /// @internal
    close() {
        if (this.curContext && this.curContext.tracker.strict)
            this.emitContext();
        if (this.lookAhead > 0)
            this.emitLookAhead();
    }
}
class StackContext {
    constructor(tracker, context) {
        this.tracker = tracker;
        this.context = context;
        this.hash = tracker.strict ? tracker.hash(context) : 0;
    }
}
var Recover;
(function (Recover) {
    Recover[Recover["Insert"] = 200] = "Insert";
    Recover[Recover["Delete"] = 190] = "Delete";
    Recover[Recover["Reduce"] = 100] = "Reduce";
    Recover[Recover["MaxNext"] = 4] = "MaxNext";
    Recover[Recover["MaxInsertStackDepth"] = 300] = "MaxInsertStackDepth";
    Recover[Recover["DampenInsertStackDepth"] = 120] = "DampenInsertStackDepth";
    Recover[Recover["MinBigReduction"] = 2000] = "MinBigReduction";
})(Recover || (Recover = {}));
// Used to cheaply run some reductions to scan ahead without mutating
// an entire stack
class SimulatedStack {
    constructor(start) {
        this.start = start;
        this.state = start.state;
        this.stack = start.stack;
        this.base = this.stack.length;
    }
    reduce(action) {
        let term = action & 65535 /* Action.ValueMask */, depth = action >> 19 /* Action.ReduceDepthShift */;
        if (depth == 0) {
            if (this.stack == this.start.stack)
                this.stack = this.stack.slice();
            this.stack.push(this.state, 0, 0);
            this.base += 3;
        }
        else {
            this.base -= (depth - 1) * 3;
        }
        let goto = this.start.p.parser.getGoto(this.stack[this.base - 3], term, true);
        this.state = goto;
    }
}
// This is given to `Tree.build` to build a buffer, and encapsulates
// the parent-stack-walking necessary to read the nodes.
class StackBufferCursor {
    constructor(stack, pos, index) {
        this.stack = stack;
        this.pos = pos;
        this.index = index;
        this.buffer = stack.buffer;
        if (this.index == 0)
            this.maybeNext();
    }
    static create(stack, pos = stack.bufferBase + stack.buffer.length) {
        return new StackBufferCursor(stack, pos, pos - stack.bufferBase);
    }
    maybeNext() {
        let next = this.stack.parent;
        if (next != null) {
            this.index = this.stack.bufferBase - next.bufferBase;
            this.stack = next;
            this.buffer = next.buffer;
        }
    }
    get id() { return this.buffer[this.index - 4]; }
    get start() { return this.buffer[this.index - 3]; }
    get end() { return this.buffer[this.index - 2]; }
    get size() { return this.buffer[this.index - 1]; }
    next() {
        this.index -= 4;
        this.pos -= 4;
        if (this.index == 0)
            this.maybeNext();
    }
    fork() {
        return new StackBufferCursor(this.stack, this.pos, this.index);
    }
}

// See lezer-generator/src/encode.ts for comments about the encoding
// used here
function decodeArray(input, Type = Uint16Array) {
    if (typeof input != "string")
        return input;
    let array = null;
    for (let pos = 0, out = 0; pos < input.length;) {
        let value = 0;
        for (;;) {
            let next = input.charCodeAt(pos++), stop = false;
            if (next == 126 /* Encode.BigValCode */) {
                value = 65535 /* Encode.BigVal */;
                break;
            }
            if (next >= 92 /* Encode.Gap2 */)
                next--;
            if (next >= 34 /* Encode.Gap1 */)
                next--;
            let digit = next - 32 /* Encode.Start */;
            if (digit >= 46 /* Encode.Base */) {
                digit -= 46 /* Encode.Base */;
                stop = true;
            }
            value += digit;
            if (stop)
                break;
            value *= 46 /* Encode.Base */;
        }
        if (array)
            array[out++] = value;
        else
            array = new Type(value);
    }
    return array;
}

class CachedToken {
    constructor() {
        this.start = -1;
        this.value = -1;
        this.end = -1;
        this.extended = -1;
        this.lookAhead = 0;
        this.mask = 0;
        this.context = 0;
    }
}
const nullToken = new CachedToken;
/// [Tokenizers](#lr.ExternalTokenizer) interact with the input
/// through this interface. It presents the input as a stream of
/// characters, tracking lookahead and hiding the complexity of
/// [ranges](#common.Parser.parse^ranges) from tokenizer code.
class InputStream {
    /// @internal
    constructor(
    /// @internal
    input, 
    /// @internal
    ranges) {
        this.input = input;
        this.ranges = ranges;
        /// @internal
        this.chunk = "";
        /// @internal
        this.chunkOff = 0;
        /// Backup chunk
        this.chunk2 = "";
        this.chunk2Pos = 0;
        /// The character code of the next code unit in the input, or -1
        /// when the stream is at the end of the input.
        this.next = -1;
        /// @internal
        this.token = nullToken;
        this.rangeIndex = 0;
        this.pos = this.chunkPos = ranges[0].from;
        this.range = ranges[0];
        this.end = ranges[ranges.length - 1].to;
        this.readNext();
    }
    /// @internal
    resolveOffset(offset, assoc) {
        let range = this.range, index = this.rangeIndex;
        let pos = this.pos + offset;
        while (pos < range.from) {
            if (!index)
                return null;
            let next = this.ranges[--index];
            pos -= range.from - next.to;
            range = next;
        }
        while (assoc < 0 ? pos > range.to : pos >= range.to) {
            if (index == this.ranges.length - 1)
                return null;
            let next = this.ranges[++index];
            pos += next.from - range.to;
            range = next;
        }
        return pos;
    }
    /// @internal
    clipPos(pos) {
        if (pos >= this.range.from && pos < this.range.to)
            return pos;
        for (let range of this.ranges)
            if (range.to > pos)
                return Math.max(pos, range.from);
        return this.end;
    }
    /// Look at a code unit near the stream position. `.peek(0)` equals
    /// `.next`, `.peek(-1)` gives you the previous character, and so
    /// on.
    ///
    /// Note that looking around during tokenizing creates dependencies
    /// on potentially far-away content, which may reduce the
    /// effectiveness incremental parsing—when looking forward—or even
    /// cause invalid reparses when looking backward more than 25 code
    /// units, since the library does not track lookbehind.
    peek(offset) {
        let idx = this.chunkOff + offset, pos, result;
        if (idx >= 0 && idx < this.chunk.length) {
            pos = this.pos + offset;
            result = this.chunk.charCodeAt(idx);
        }
        else {
            let resolved = this.resolveOffset(offset, 1);
            if (resolved == null)
                return -1;
            pos = resolved;
            if (pos >= this.chunk2Pos && pos < this.chunk2Pos + this.chunk2.length) {
                result = this.chunk2.charCodeAt(pos - this.chunk2Pos);
            }
            else {
                let i = this.rangeIndex, range = this.range;
                while (range.to <= pos)
                    range = this.ranges[++i];
                this.chunk2 = this.input.chunk(this.chunk2Pos = pos);
                if (pos + this.chunk2.length > range.to)
                    this.chunk2 = this.chunk2.slice(0, range.to - pos);
                result = this.chunk2.charCodeAt(0);
            }
        }
        if (pos >= this.token.lookAhead)
            this.token.lookAhead = pos + 1;
        return result;
    }
    /// Accept a token. By default, the end of the token is set to the
    /// current stream position, but you can pass an offset (relative to
    /// the stream position) to change that.
    acceptToken(token, endOffset = 0) {
        let end = endOffset ? this.resolveOffset(endOffset, -1) : this.pos;
        if (end == null || end < this.token.start)
            throw new RangeError("Token end out of bounds");
        this.token.value = token;
        this.token.end = end;
    }
    getChunk() {
        if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
            let { chunk, chunkPos } = this;
            this.chunk = this.chunk2;
            this.chunkPos = this.chunk2Pos;
            this.chunk2 = chunk;
            this.chunk2Pos = chunkPos;
            this.chunkOff = this.pos - this.chunkPos;
        }
        else {
            this.chunk2 = this.chunk;
            this.chunk2Pos = this.chunkPos;
            let nextChunk = this.input.chunk(this.pos);
            let end = this.pos + nextChunk.length;
            this.chunk = end > this.range.to ? nextChunk.slice(0, this.range.to - this.pos) : nextChunk;
            this.chunkPos = this.pos;
            this.chunkOff = 0;
        }
    }
    readNext() {
        if (this.chunkOff >= this.chunk.length) {
            this.getChunk();
            if (this.chunkOff == this.chunk.length)
                return this.next = -1;
        }
        return this.next = this.chunk.charCodeAt(this.chunkOff);
    }
    /// Move the stream forward N (defaults to 1) code units. Returns
    /// the new value of [`next`](#lr.InputStream.next).
    advance(n = 1) {
        this.chunkOff += n;
        while (this.pos + n >= this.range.to) {
            if (this.rangeIndex == this.ranges.length - 1)
                return this.setDone();
            n -= this.range.to - this.pos;
            this.range = this.ranges[++this.rangeIndex];
            this.pos = this.range.from;
        }
        this.pos += n;
        if (this.pos >= this.token.lookAhead)
            this.token.lookAhead = this.pos + 1;
        return this.readNext();
    }
    setDone() {
        this.pos = this.chunkPos = this.end;
        this.range = this.ranges[this.rangeIndex = this.ranges.length - 1];
        this.chunk = "";
        return this.next = -1;
    }
    /// @internal
    reset(pos, token) {
        if (token) {
            this.token = token;
            token.start = pos;
            token.lookAhead = pos + 1;
            token.value = token.extended = -1;
        }
        else {
            this.token = nullToken;
        }
        if (this.pos != pos) {
            this.pos = pos;
            if (pos == this.end) {
                this.setDone();
                return this;
            }
            while (pos < this.range.from)
                this.range = this.ranges[--this.rangeIndex];
            while (pos >= this.range.to)
                this.range = this.ranges[++this.rangeIndex];
            if (pos >= this.chunkPos && pos < this.chunkPos + this.chunk.length) {
                this.chunkOff = pos - this.chunkPos;
            }
            else {
                this.chunk = "";
                this.chunkOff = 0;
            }
            this.readNext();
        }
        return this;
    }
    /// @internal
    read(from, to) {
        if (from >= this.chunkPos && to <= this.chunkPos + this.chunk.length)
            return this.chunk.slice(from - this.chunkPos, to - this.chunkPos);
        if (from >= this.chunk2Pos && to <= this.chunk2Pos + this.chunk2.length)
            return this.chunk2.slice(from - this.chunk2Pos, to - this.chunk2Pos);
        if (from >= this.range.from && to <= this.range.to)
            return this.input.read(from, to);
        let result = "";
        for (let r of this.ranges) {
            if (r.from >= to)
                break;
            if (r.to > from)
                result += this.input.read(Math.max(r.from, from), Math.min(r.to, to));
        }
        return result;
    }
}
/// @internal
class TokenGroup {
    constructor(data, id) {
        this.data = data;
        this.id = id;
    }
    token(input, stack) {
        let { parser } = stack.p;
        readToken(this.data, input, stack, this.id, parser.data, parser.tokenPrecTable);
    }
}
TokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
/// @hide
class LocalTokenGroup {
    constructor(data, precTable, elseToken) {
        this.precTable = precTable;
        this.elseToken = elseToken;
        this.data = typeof data == "string" ? decodeArray(data) : data;
    }
    token(input, stack) {
        let start = input.pos, cur;
        for (;;) {
            cur = input.pos;
            readToken(this.data, input, stack, 0, this.data, this.precTable);
            if (input.token.value > -1)
                break;
            if (this.elseToken == null)
                return;
            if (input.next < 0)
                break;
            input.advance();
            input.reset(cur + 1, input.token);
        }
        if (cur > start) {
            input.reset(start, input.token);
            input.acceptToken(this.elseToken, cur - start);
        }
    }
}
LocalTokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
/// `@external tokens` declarations in the grammar should resolve to
/// an instance of this class.
class ExternalTokenizer {
    /// Create a tokenizer. The first argument is the function that,
    /// given an input stream, scans for the types of tokens it
    /// recognizes at the stream's position, and calls
    /// [`acceptToken`](#lr.InputStream.acceptToken) when it finds
    /// one.
    constructor(
    /// @internal
    token, options = {}) {
        this.token = token;
        this.contextual = !!options.contextual;
        this.fallback = !!options.fallback;
        this.extend = !!options.extend;
    }
}
// Tokenizer data is stored a big uint16 array containing, for each
// state:
//
//  - A group bitmask, indicating what token groups are reachable from
//    this state, so that paths that can only lead to tokens not in
//    any of the current groups can be cut off early.
//
//  - The position of the end of the state's sequence of accepting
//    tokens
//
//  - The number of outgoing edges for the state
//
//  - The accepting tokens, as (token id, group mask) pairs
//
//  - The outgoing edges, as (start character, end character, state
//    index) triples, with end character being exclusive
//
// This function interprets that data, running through a stream as
// long as new states with the a matching group mask can be reached,
// and updating `input.token` when it matches a token.
function readToken(data, input, stack, group, precTable, precOffset) {
    let state = 0, groupMask = 1 << group, { dialect } = stack.p.parser;
    scan: for (;;) {
        if ((groupMask & data[state]) == 0)
            break;
        let accEnd = data[state + 1];
        // Check whether this state can lead to a token in the current group
        // Accept tokens in this state, possibly overwriting
        // lower-precedence / shorter tokens
        for (let i = state + 3; i < accEnd; i += 2)
            if ((data[i + 1] & groupMask) > 0) {
                let term = data[i];
                if (dialect.allows(term) &&
                    (input.token.value == -1 || input.token.value == term ||
                        overrides(term, input.token.value, precTable, precOffset))) {
                    input.acceptToken(term);
                    break;
                }
            }
        let next = input.next, low = 0, high = data[state + 2];
        // Special case for EOF
        if (input.next < 0 && high > low && data[accEnd + high * 3 - 3] == 65535 /* Seq.End */ && data[accEnd + high * 3 - 3] == 65535 /* Seq.End */) {
            state = data[accEnd + high * 3 - 1];
            continue scan;
        }
        // Do a binary search on the state's edges
        for (; low < high;) {
            let mid = (low + high) >> 1;
            let index = accEnd + mid + (mid << 1);
            let from = data[index], to = data[index + 1] || 0x10000;
            if (next < from)
                high = mid;
            else if (next >= to)
                low = mid + 1;
            else {
                state = data[index + 2];
                input.advance();
                continue scan;
            }
        }
        break;
    }
}
function findOffset(data, start, term) {
    for (let i = start, next; (next = data[i]) != 65535 /* Seq.End */; i++)
        if (next == term)
            return i - start;
    return -1;
}
function overrides(token, prev, tableData, tableOffset) {
    let iPrev = findOffset(tableData, tableOffset, prev);
    return iPrev < 0 || findOffset(tableData, tableOffset, token) < iPrev;
}

// Environment variable used to control console output
const verbose = typeof process != "undefined" && process.env && /\bparse\b/.test(process.env.LOG);
let stackIDs = null;
var Safety;
(function (Safety) {
    Safety[Safety["Margin"] = 25] = "Margin";
})(Safety || (Safety = {}));
function cutAt(tree, pos, side) {
    let cursor = tree.cursor(common.IterMode.IncludeAnonymous);
    cursor.moveTo(pos);
    for (;;) {
        if (!(side < 0 ? cursor.childBefore(pos) : cursor.childAfter(pos)))
            for (;;) {
                if ((side < 0 ? cursor.to < pos : cursor.from > pos) && !cursor.type.isError)
                    return side < 0 ? Math.max(0, Math.min(cursor.to - 1, pos - 25 /* Safety.Margin */))
                        : Math.min(tree.length, Math.max(cursor.from + 1, pos + 25 /* Safety.Margin */));
                if (side < 0 ? cursor.prevSibling() : cursor.nextSibling())
                    break;
                if (!cursor.parent())
                    return side < 0 ? 0 : tree.length;
            }
    }
}
class FragmentCursor {
    constructor(fragments, nodeSet) {
        this.fragments = fragments;
        this.nodeSet = nodeSet;
        this.i = 0;
        this.fragment = null;
        this.safeFrom = -1;
        this.safeTo = -1;
        this.trees = [];
        this.start = [];
        this.index = [];
        this.nextFragment();
    }
    nextFragment() {
        let fr = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
        if (fr) {
            this.safeFrom = fr.openStart ? cutAt(fr.tree, fr.from + fr.offset, 1) - fr.offset : fr.from;
            this.safeTo = fr.openEnd ? cutAt(fr.tree, fr.to + fr.offset, -1) - fr.offset : fr.to;
            while (this.trees.length) {
                this.trees.pop();
                this.start.pop();
                this.index.pop();
            }
            this.trees.push(fr.tree);
            this.start.push(-fr.offset);
            this.index.push(0);
            this.nextStart = this.safeFrom;
        }
        else {
            this.nextStart = 1e9;
        }
    }
    // `pos` must be >= any previously given `pos` for this cursor
    nodeAt(pos) {
        if (pos < this.nextStart)
            return null;
        while (this.fragment && this.safeTo <= pos)
            this.nextFragment();
        if (!this.fragment)
            return null;
        for (;;) {
            let last = this.trees.length - 1;
            if (last < 0) { // End of tree
                this.nextFragment();
                return null;
            }
            let top = this.trees[last], index = this.index[last];
            if (index == top.children.length) {
                this.trees.pop();
                this.start.pop();
                this.index.pop();
                continue;
            }
            let next = top.children[index];
            let start = this.start[last] + top.positions[index];
            if (start > pos) {
                this.nextStart = start;
                return null;
            }
            if (next instanceof common.Tree) {
                if (start == pos) {
                    if (start < this.safeFrom)
                        return null;
                    let end = start + next.length;
                    if (end <= this.safeTo) {
                        let lookAhead = next.prop(common.NodeProp.lookAhead);
                        if (!lookAhead || end + lookAhead < this.fragment.to)
                            return next;
                    }
                }
                this.index[last]++;
                if (start + next.length >= Math.max(this.safeFrom, pos)) { // Enter this node
                    this.trees.push(next);
                    this.start.push(start);
                    this.index.push(0);
                }
            }
            else {
                this.index[last]++;
                this.nextStart = start + next.length;
            }
        }
    }
}
class TokenCache {
    constructor(parser, stream) {
        this.stream = stream;
        this.tokens = [];
        this.mainToken = null;
        this.actions = [];
        this.tokens = parser.tokenizers.map(_ => new CachedToken);
    }
    getActions(stack) {
        let actionIndex = 0;
        let main = null;
        let { parser } = stack.p, { tokenizers } = parser;
        let mask = parser.stateSlot(stack.state, 3 /* ParseState.TokenizerMask */);
        let context = stack.curContext ? stack.curContext.hash : 0;
        let lookAhead = 0;
        for (let i = 0; i < tokenizers.length; i++) {
            if (((1 << i) & mask) == 0)
                continue;
            let tokenizer = tokenizers[i], token = this.tokens[i];
            if (main && !tokenizer.fallback)
                continue;
            if (tokenizer.contextual || token.start != stack.pos || token.mask != mask || token.context != context) {
                this.updateCachedToken(token, tokenizer, stack);
                token.mask = mask;
                token.context = context;
            }
            if (token.lookAhead > token.end + 25 /* Safety.Margin */)
                lookAhead = Math.max(token.lookAhead, lookAhead);
            if (token.value != 0 /* Term.Err */) {
                let startIndex = actionIndex;
                if (token.extended > -1)
                    actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
                actionIndex = this.addActions(stack, token.value, token.end, actionIndex);
                if (!tokenizer.extend) {
                    main = token;
                    if (actionIndex > startIndex)
                        break;
                }
            }
        }
        while (this.actions.length > actionIndex)
            this.actions.pop();
        if (lookAhead)
            stack.setLookAhead(lookAhead);
        if (!main && stack.pos == this.stream.end) {
            main = new CachedToken;
            main.value = stack.p.parser.eofTerm;
            main.start = main.end = stack.pos;
            actionIndex = this.addActions(stack, main.value, main.end, actionIndex);
        }
        this.mainToken = main;
        return this.actions;
    }
    getMainToken(stack) {
        if (this.mainToken)
            return this.mainToken;
        let main = new CachedToken, { pos, p } = stack;
        main.start = pos;
        main.end = Math.min(pos + 1, p.stream.end);
        main.value = pos == p.stream.end ? p.parser.eofTerm : 0 /* Term.Err */;
        return main;
    }
    updateCachedToken(token, tokenizer, stack) {
        let start = this.stream.clipPos(stack.pos);
        tokenizer.token(this.stream.reset(start, token), stack);
        if (token.value > -1) {
            let { parser } = stack.p;
            for (let i = 0; i < parser.specialized.length; i++)
                if (parser.specialized[i] == token.value) {
                    let result = parser.specializers[i](this.stream.read(token.start, token.end), stack);
                    if (result >= 0 && stack.p.parser.dialect.allows(result >> 1)) {
                        if ((result & 1) == 0 /* Specialize.Specialize */)
                            token.value = result >> 1;
                        else
                            token.extended = result >> 1;
                        break;
                    }
                }
        }
        else {
            token.value = 0 /* Term.Err */;
            token.end = this.stream.clipPos(start + 1);
        }
    }
    putAction(action, token, end, index) {
        // Don't add duplicate actions
        for (let i = 0; i < index; i += 3)
            if (this.actions[i] == action)
                return index;
        this.actions[index++] = action;
        this.actions[index++] = token;
        this.actions[index++] = end;
        return index;
    }
    addActions(stack, token, end, index) {
        let { state } = stack, { parser } = stack.p, { data } = parser;
        for (let set = 0; set < 2; set++) {
            for (let i = parser.stateSlot(state, set ? 2 /* ParseState.Skip */ : 1 /* ParseState.Actions */);; i += 3) {
                if (data[i] == 65535 /* Seq.End */) {
                    if (data[i + 1] == 1 /* Seq.Next */) {
                        i = pair(data, i + 2);
                    }
                    else {
                        if (index == 0 && data[i + 1] == 2 /* Seq.Other */)
                            index = this.putAction(pair(data, i + 2), token, end, index);
                        break;
                    }
                }
                if (data[i] == token)
                    index = this.putAction(pair(data, i + 1), token, end, index);
            }
        }
        return index;
    }
}
var Rec;
(function (Rec) {
    Rec[Rec["Distance"] = 5] = "Distance";
    Rec[Rec["MaxRemainingPerStep"] = 3] = "MaxRemainingPerStep";
    // When two stacks have been running independently long enough to
    // add this many elements to their buffers, prune one.
    Rec[Rec["MinBufferLengthPrune"] = 500] = "MinBufferLengthPrune";
    Rec[Rec["ForceReduceLimit"] = 10] = "ForceReduceLimit";
    // Once a stack reaches this depth (in .stack.length) force-reduce
    // it back to CutTo to avoid creating trees that overflow the stack
    // on recursive traversal.
    Rec[Rec["CutDepth"] = 15000] = "CutDepth";
    Rec[Rec["CutTo"] = 9000] = "CutTo";
    Rec[Rec["MaxLeftAssociativeReductionCount"] = 300] = "MaxLeftAssociativeReductionCount";
    // The maximum number of non-recovering stacks to explore (to avoid
    // getting bogged down with exponentially multiplying stacks in
    // ambiguous content)
    Rec[Rec["MaxStackCount"] = 12] = "MaxStackCount";
})(Rec || (Rec = {}));
class Parse {
    constructor(parser, input, fragments, ranges) {
        this.parser = parser;
        this.input = input;
        this.ranges = ranges;
        this.recovering = 0;
        this.nextStackID = 0x2654; // ♔, ♕, ♖, ♗, ♘, ♙, ♠, ♡, ♢, ♣, ♤, ♥, ♦, ♧
        this.minStackPos = 0;
        this.reused = [];
        this.stoppedAt = null;
        this.lastBigReductionStart = -1;
        this.lastBigReductionSize = 0;
        this.bigReductionCount = 0;
        this.stream = new InputStream(input, ranges);
        this.tokens = new TokenCache(parser, this.stream);
        this.topTerm = parser.top[1];
        let { from } = ranges[0];
        this.stacks = [Stack.start(this, parser.top[0], from)];
        this.fragments = fragments.length && this.stream.end - from > parser.bufferLength * 4
            ? new FragmentCursor(fragments, parser.nodeSet) : null;
    }
    get parsedPos() {
        return this.minStackPos;
    }
    // Move the parser forward. This will process all parse stacks at
    // `this.pos` and try to advance them to a further position. If no
    // stack for such a position is found, it'll start error-recovery.
    //
    // When the parse is finished, this will return a syntax tree. When
    // not, it returns `null`.
    advance() {
        let stacks = this.stacks, pos = this.minStackPos;
        // This will hold stacks beyond `pos`.
        let newStacks = this.stacks = [];
        let stopped, stoppedTokens;
        // If a large amount of reductions happened with the same start
        // position, force the stack out of that production in order to
        // avoid creating a tree too deep to recurse through.
        // (This is an ugly kludge, because unfortunately there is no
        // straightforward, cheap way to check for this happening, due to
        // the history of reductions only being available in an
        // expensive-to-access format in the stack buffers.)
        if (this.bigReductionCount > 300 /* Rec.MaxLeftAssociativeReductionCount */ && stacks.length == 1) {
            let [s] = stacks;
            while (s.forceReduce() && s.stack.length && s.stack[s.stack.length - 2] >= this.lastBigReductionStart) { }
            this.bigReductionCount = this.lastBigReductionSize = 0;
        }
        // Keep advancing any stacks at `pos` until they either move
        // forward or can't be advanced. Gather stacks that can't be
        // advanced further in `stopped`.
        for (let i = 0; i < stacks.length; i++) {
            let stack = stacks[i];
            for (;;) {
                this.tokens.mainToken = null;
                if (stack.pos > pos) {
                    newStacks.push(stack);
                }
                else if (this.advanceStack(stack, newStacks, stacks)) {
                    continue;
                }
                else {
                    if (!stopped) {
                        stopped = [];
                        stoppedTokens = [];
                    }
                    stopped.push(stack);
                    let tok = this.tokens.getMainToken(stack);
                    stoppedTokens.push(tok.value, tok.end);
                }
                break;
            }
        }
        if (!newStacks.length) {
            let finished = stopped && findFinished(stopped);
            if (finished)
                return this.stackToTree(finished);
            if (this.parser.strict) {
                if (verbose && stopped)
                    console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none"));
                throw new SyntaxError("No parse at " + pos);
            }
            if (!this.recovering)
                this.recovering = 5 /* Rec.Distance */;
        }
        if (this.recovering && stopped) {
            let finished = this.stoppedAt != null && stopped[0].pos > this.stoppedAt ? stopped[0]
                : this.runRecovery(stopped, stoppedTokens, newStacks);
            if (finished)
                return this.stackToTree(finished.forceAll());
        }
        if (this.recovering) {
            let maxRemaining = this.recovering == 1 ? 1 : this.recovering * 3 /* Rec.MaxRemainingPerStep */;
            if (newStacks.length > maxRemaining) {
                newStacks.sort((a, b) => b.score - a.score);
                while (newStacks.length > maxRemaining)
                    newStacks.pop();
            }
            if (newStacks.some(s => s.reducePos > pos))
                this.recovering--;
        }
        else if (newStacks.length > 1) {
            // Prune stacks that are in the same state, or that have been
            // running without splitting for a while, to avoid getting stuck
            // with multiple successful stacks running endlessly on.
            outer: for (let i = 0; i < newStacks.length - 1; i++) {
                let stack = newStacks[i];
                for (let j = i + 1; j < newStacks.length; j++) {
                    let other = newStacks[j];
                    if (stack.sameState(other) ||
                        stack.buffer.length > 500 /* Rec.MinBufferLengthPrune */ && other.buffer.length > 500 /* Rec.MinBufferLengthPrune */) {
                        if (((stack.score - other.score) || (stack.buffer.length - other.buffer.length)) > 0) {
                            newStacks.splice(j--, 1);
                        }
                        else {
                            newStacks.splice(i--, 1);
                            continue outer;
                        }
                    }
                }
            }
            if (newStacks.length > 12 /* Rec.MaxStackCount */)
                newStacks.splice(12 /* Rec.MaxStackCount */, newStacks.length - 12 /* Rec.MaxStackCount */);
        }
        this.minStackPos = newStacks[0].pos;
        for (let i = 1; i < newStacks.length; i++)
            if (newStacks[i].pos < this.minStackPos)
                this.minStackPos = newStacks[i].pos;
        return null;
    }
    stopAt(pos) {
        if (this.stoppedAt != null && this.stoppedAt < pos)
            throw new RangeError("Can't move stoppedAt forward");
        this.stoppedAt = pos;
    }
    // Returns an updated version of the given stack, or null if the
    // stack can't advance normally. When `split` and `stacks` are
    // given, stacks split off by ambiguous operations will be pushed to
    // `split`, or added to `stacks` if they move `pos` forward.
    advanceStack(stack, stacks, split) {
        let start = stack.pos, { parser } = this;
        let base = verbose ? this.stackID(stack) + " -> " : "";
        if (this.stoppedAt != null && start > this.stoppedAt)
            return stack.forceReduce() ? stack : null;
        if (this.fragments) {
            let strictCx = stack.curContext && stack.curContext.tracker.strict, cxHash = strictCx ? stack.curContext.hash : 0;
            for (let cached = this.fragments.nodeAt(start); cached;) {
                let match = this.parser.nodeSet.types[cached.type.id] == cached.type ? parser.getGoto(stack.state, cached.type.id) : -1;
                if (match > -1 && cached.length && (!strictCx || (cached.prop(common.NodeProp.contextHash) || 0) == cxHash)) {
                    stack.useNode(cached, match);
                    if (verbose)
                        console.log(base + this.stackID(stack) + ` (via reuse of ${parser.getName(cached.type.id)})`);
                    return true;
                }
                if (!(cached instanceof common.Tree) || cached.children.length == 0 || cached.positions[0] > 0)
                    break;
                let inner = cached.children[0];
                if (inner instanceof common.Tree && cached.positions[0] == 0)
                    cached = inner;
                else
                    break;
            }
        }
        let defaultReduce = parser.stateSlot(stack.state, 4 /* ParseState.DefaultReduce */);
        if (defaultReduce > 0) {
            stack.reduce(defaultReduce);
            if (verbose)
                console.log(base + this.stackID(stack) + ` (via always-reduce ${parser.getName(defaultReduce & 65535 /* Action.ValueMask */)})`);
            return true;
        }
        if (stack.stack.length >= 15000 /* Rec.CutDepth */) {
            while (stack.stack.length > 9000 /* Rec.CutTo */ && stack.forceReduce()) { }
        }
        let actions = this.tokens.getActions(stack);
        for (let i = 0; i < actions.length;) {
            let action = actions[i++], term = actions[i++], end = actions[i++];
            let last = i == actions.length || !split;
            let localStack = last ? stack : stack.split();
            localStack.apply(action, term, end);
            if (verbose)
                console.log(base + this.stackID(localStack) + ` (via ${(action & 65536 /* Action.ReduceFlag */) == 0 ? "shift"
                    : `reduce of ${parser.getName(action & 65535 /* Action.ValueMask */)}`} for ${parser.getName(term)} @ ${start}${localStack == stack ? "" : ", split"})`);
            if (last)
                return true;
            else if (localStack.pos > start)
                stacks.push(localStack);
            else
                split.push(localStack);
        }
        return false;
    }
    // Advance a given stack forward as far as it will go. Returns the
    // (possibly updated) stack if it got stuck, or null if it moved
    // forward and was given to `pushStackDedup`.
    advanceFully(stack, newStacks) {
        let pos = stack.pos;
        for (;;) {
            if (!this.advanceStack(stack, null, null))
                return false;
            if (stack.pos > pos) {
                pushStackDedup(stack, newStacks);
                return true;
            }
        }
    }
    runRecovery(stacks, tokens, newStacks) {
        let finished = null, restarted = false;
        for (let i = 0; i < stacks.length; i++) {
            let stack = stacks[i], token = tokens[i << 1], tokenEnd = tokens[(i << 1) + 1];
            let base = verbose ? this.stackID(stack) + " -> " : "";
            if (stack.deadEnd) {
                if (restarted)
                    continue;
                restarted = true;
                stack.restart();
                if (verbose)
                    console.log(base + this.stackID(stack) + " (restarted)");
                let done = this.advanceFully(stack, newStacks);
                if (done)
                    continue;
            }
            let force = stack.split(), forceBase = base;
            for (let j = 0; force.forceReduce() && j < 10 /* Rec.ForceReduceLimit */; j++) {
                if (verbose)
                    console.log(forceBase + this.stackID(force) + " (via force-reduce)");
                let done = this.advanceFully(force, newStacks);
                if (done)
                    break;
                if (verbose)
                    forceBase = this.stackID(force) + " -> ";
            }
            for (let insert of stack.recoverByInsert(token)) {
                if (verbose)
                    console.log(base + this.stackID(insert) + " (via recover-insert)");
                this.advanceFully(insert, newStacks);
            }
            if (this.stream.end > stack.pos) {
                if (tokenEnd == stack.pos) {
                    tokenEnd++;
                    token = 0 /* Term.Err */;
                }
                stack.recoverByDelete(token, tokenEnd);
                if (verbose)
                    console.log(base + this.stackID(stack) + ` (via recover-delete ${this.parser.getName(token)})`);
                pushStackDedup(stack, newStacks);
            }
            else if (!finished || finished.score < stack.score) {
                finished = stack;
            }
        }
        return finished;
    }
    // Convert the stack's buffer to a syntax tree.
    stackToTree(stack) {
        stack.close();
        return common.Tree.build({ buffer: StackBufferCursor.create(stack),
            nodeSet: this.parser.nodeSet,
            topID: this.topTerm,
            maxBufferLength: this.parser.bufferLength,
            reused: this.reused,
            start: this.ranges[0].from,
            length: stack.pos - this.ranges[0].from,
            minRepeatType: this.parser.minRepeatTerm });
    }
    stackID(stack) {
        let id = (stackIDs || (stackIDs = new WeakMap)).get(stack);
        if (!id)
            stackIDs.set(stack, id = String.fromCodePoint(this.nextStackID++));
        return id + stack;
    }
}
function pushStackDedup(stack, newStacks) {
    for (let i = 0; i < newStacks.length; i++) {
        let other = newStacks[i];
        if (other.pos == stack.pos && other.sameState(stack)) {
            if (newStacks[i].score < stack.score)
                newStacks[i] = stack;
            return;
        }
    }
    newStacks.push(stack);
}
class Dialect {
    constructor(source, flags, disabled) {
        this.source = source;
        this.flags = flags;
        this.disabled = disabled;
    }
    allows(term) { return !this.disabled || this.disabled[term] == 0; }
}
const id = x => x;
/// Context trackers are used to track stateful context (such as
/// indentation in the Python grammar, or parent elements in the XML
/// grammar) needed by external tokenizers. You declare them in a
/// grammar file as `@context exportName from "module"`.
///
/// Context values should be immutable, and can be updated (replaced)
/// on shift or reduce actions.
///
/// The export used in a `@context` declaration should be of this
/// type.
class ContextTracker {
    /// Define a context tracker.
    constructor(spec) {
        this.start = spec.start;
        this.shift = spec.shift || id;
        this.reduce = spec.reduce || id;
        this.reuse = spec.reuse || id;
        this.hash = spec.hash || (() => 0);
        this.strict = spec.strict !== false;
    }
}
/// Holds the parse tables for a given grammar, as generated by
/// `lezer-generator`, and provides [methods](#common.Parser) to parse
/// content with.
class LRParser extends common.Parser {
    /// @internal
    constructor(spec) {
        super();
        /// @internal
        this.wrappers = [];
        if (spec.version != 14 /* File.Version */)
            throw new RangeError(`Parser version (${spec.version}) doesn't match runtime version (${14 /* File.Version */})`);
        let nodeNames = spec.nodeNames.split(" ");
        this.minRepeatTerm = nodeNames.length;
        for (let i = 0; i < spec.repeatNodeCount; i++)
            nodeNames.push("");
        let topTerms = Object.keys(spec.topRules).map(r => spec.topRules[r][1]);
        let nodeProps = [];
        for (let i = 0; i < nodeNames.length; i++)
            nodeProps.push([]);
        function setProp(nodeID, prop, value) {
            nodeProps[nodeID].push([prop, prop.deserialize(String(value))]);
        }
        if (spec.nodeProps)
            for (let propSpec of spec.nodeProps) {
                let prop = propSpec[0];
                if (typeof prop == "string")
                    prop = common.NodeProp[prop];
                for (let i = 1; i < propSpec.length;) {
                    let next = propSpec[i++];
                    if (next >= 0) {
                        setProp(next, prop, propSpec[i++]);
                    }
                    else {
                        let value = propSpec[i + -next];
                        for (let j = -next; j > 0; j--)
                            setProp(propSpec[i++], prop, value);
                        i++;
                    }
                }
            }
        this.nodeSet = new common.NodeSet(nodeNames.map((name, i) => common.NodeType.define({
            name: i >= this.minRepeatTerm ? undefined : name,
            id: i,
            props: nodeProps[i],
            top: topTerms.indexOf(i) > -1,
            error: i == 0,
            skipped: spec.skippedNodes && spec.skippedNodes.indexOf(i) > -1
        })));
        if (spec.propSources)
            this.nodeSet = this.nodeSet.extend(...spec.propSources);
        this.strict = false;
        this.bufferLength = common.DefaultBufferLength;
        let tokenArray = decodeArray(spec.tokenData);
        this.context = spec.context;
        this.specializerSpecs = spec.specialized || [];
        this.specialized = new Uint16Array(this.specializerSpecs.length);
        for (let i = 0; i < this.specializerSpecs.length; i++)
            this.specialized[i] = this.specializerSpecs[i].term;
        this.specializers = this.specializerSpecs.map(getSpecializer);
        this.states = decodeArray(spec.states, Uint32Array);
        this.data = decodeArray(spec.stateData);
        this.goto = decodeArray(spec.goto);
        this.maxTerm = spec.maxTerm;
        this.tokenizers = spec.tokenizers.map(value => typeof value == "number" ? new TokenGroup(tokenArray, value) : value);
        this.topRules = spec.topRules;
        this.dialects = spec.dialects || {};
        this.dynamicPrecedences = spec.dynamicPrecedences || null;
        this.tokenPrecTable = spec.tokenPrec;
        this.termNames = spec.termNames || null;
        this.maxNode = this.nodeSet.types.length - 1;
        this.dialect = this.parseDialect();
        this.top = this.topRules[Object.keys(this.topRules)[0]];
    }
    createParse(input, fragments, ranges) {
        let parse = new Parse(this, input, fragments, ranges);
        for (let w of this.wrappers)
            parse = w(parse, input, fragments, ranges);
        return parse;
    }
    /// Get a goto table entry @internal
    getGoto(state, term, loose = false) {
        let table = this.goto;
        if (term >= table[0])
            return -1;
        for (let pos = table[term + 1];;) {
            let groupTag = table[pos++], last = groupTag & 1;
            let target = table[pos++];
            if (last && loose)
                return target;
            for (let end = pos + (groupTag >> 1); pos < end; pos++)
                if (table[pos] == state)
                    return target;
            if (last)
                return -1;
        }
    }
    /// Check if this state has an action for a given terminal @internal
    hasAction(state, terminal) {
        let data = this.data;
        for (let set = 0; set < 2; set++) {
            for (let i = this.stateSlot(state, set ? 2 /* ParseState.Skip */ : 1 /* ParseState.Actions */), next;; i += 3) {
                if ((next = data[i]) == 65535 /* Seq.End */) {
                    if (data[i + 1] == 1 /* Seq.Next */)
                        next = data[i = pair(data, i + 2)];
                    else if (data[i + 1] == 2 /* Seq.Other */)
                        return pair(data, i + 2);
                    else
                        break;
                }
                if (next == terminal || next == 0 /* Term.Err */)
                    return pair(data, i + 1);
            }
        }
        return 0;
    }
    /// @internal
    stateSlot(state, slot) {
        return this.states[(state * 6 /* ParseState.Size */) + slot];
    }
    /// @internal
    stateFlag(state, flag) {
        return (this.stateSlot(state, 0 /* ParseState.Flags */) & flag) > 0;
    }
    /// @internal
    validAction(state, action) {
        if (action == this.stateSlot(state, 4 /* ParseState.DefaultReduce */))
            return true;
        for (let i = this.stateSlot(state, 1 /* ParseState.Actions */);; i += 3) {
            if (this.data[i] == 65535 /* Seq.End */) {
                if (this.data[i + 1] == 1 /* Seq.Next */)
                    i = pair(this.data, i + 2);
                else
                    return false;
            }
            if (action == pair(this.data, i + 1))
                return true;
        }
    }
    /// Get the states that can follow this one through shift actions or
    /// goto jumps. @internal
    nextStates(state) {
        let result = [];
        for (let i = this.stateSlot(state, 1 /* ParseState.Actions */);; i += 3) {
            if (this.data[i] == 65535 /* Seq.End */) {
                if (this.data[i + 1] == 1 /* Seq.Next */)
                    i = pair(this.data, i + 2);
                else
                    break;
            }
            if ((this.data[i + 2] & (65536 /* Action.ReduceFlag */ >> 16)) == 0) {
                let value = this.data[i + 1];
                if (!result.some((v, i) => (i & 1) && v == value))
                    result.push(this.data[i], value);
            }
        }
        return result;
    }
    /// Configure the parser. Returns a new parser instance that has the
    /// given settings modified. Settings not provided in `config` are
    /// kept from the original parser.
    configure(config) {
        // Hideous reflection-based kludge to make it easy to create a
        // slightly modified copy of a parser.
        let copy = Object.assign(Object.create(LRParser.prototype), this);
        if (config.props)
            copy.nodeSet = this.nodeSet.extend(...config.props);
        if (config.top) {
            let info = this.topRules[config.top];
            if (!info)
                throw new RangeError(`Invalid top rule name ${config.top}`);
            copy.top = info;
        }
        if (config.tokenizers)
            copy.tokenizers = this.tokenizers.map(t => {
                let found = config.tokenizers.find(r => r.from == t);
                return found ? found.to : t;
            });
        if (config.specializers) {
            copy.specializers = this.specializers.slice();
            copy.specializerSpecs = this.specializerSpecs.map((s, i) => {
                let found = config.specializers.find(r => r.from == s.external);
                if (!found)
                    return s;
                let spec = Object.assign(Object.assign({}, s), { external: found.to });
                copy.specializers[i] = getSpecializer(spec);
                return spec;
            });
        }
        if (config.contextTracker)
            copy.context = config.contextTracker;
        if (config.dialect)
            copy.dialect = this.parseDialect(config.dialect);
        if (config.strict != null)
            copy.strict = config.strict;
        if (config.wrap)
            copy.wrappers = copy.wrappers.concat(config.wrap);
        if (config.bufferLength != null)
            copy.bufferLength = config.bufferLength;
        return copy;
    }
    /// Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
    /// are registered for this parser.
    hasWrappers() {
        return this.wrappers.length > 0;
    }
    /// Returns the name associated with a given term. This will only
    /// work for all terms when the parser was generated with the
    /// `--names` option. By default, only the names of tagged terms are
    /// stored.
    getName(term) {
        return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.nodeSet.types[term].name || term);
    }
    /// The eof term id is always allocated directly after the node
    /// types. @internal
    get eofTerm() { return this.maxNode + 1; }
    /// The type of top node produced by the parser.
    get topNode() { return this.nodeSet.types[this.top[1]]; }
    /// @internal
    dynamicPrecedence(term) {
        let prec = this.dynamicPrecedences;
        return prec == null ? 0 : prec[term] || 0;
    }
    /// @internal
    parseDialect(dialect) {
        let values = Object.keys(this.dialects), flags = values.map(() => false);
        if (dialect)
            for (let part of dialect.split(" ")) {
                let id = values.indexOf(part);
                if (id >= 0)
                    flags[id] = true;
            }
        let disabled = null;
        for (let i = 0; i < values.length; i++)
            if (!flags[i]) {
                for (let j = this.dialects[values[i]], id; (id = this.data[j++]) != 65535 /* Seq.End */;)
                    (disabled || (disabled = new Uint8Array(this.maxTerm + 1)))[id] = 1;
            }
        return new Dialect(dialect, flags, disabled);
    }
    /// Used by the output of the parser generator. Not available to
    /// user code. @hide
    static deserialize(spec) {
        return new LRParser(spec);
    }
}
function pair(data, off) { return data[off] | (data[off + 1] << 16); }
function findFinished(stacks) {
    let best = null;
    for (let stack of stacks) {
        let stopped = stack.p.stoppedAt;
        if ((stack.pos == stack.p.stream.end || stopped != null && stack.pos > stopped) &&
            stack.p.parser.stateFlag(stack.state, 2 /* StateFlag.Accepting */) &&
            (!best || best.score < stack.score))
            best = stack;
    }
    return best;
}
function getSpecializer(spec) {
    if (spec.external) {
        let mask = spec.extend ? 1 /* Specialize.Extend */ : 0 /* Specialize.Specialize */;
        return (value, stack) => (spec.external(value, stack) << 1) | mask;
    }
    return spec.get;
}

exports.ContextTracker = ContextTracker;
exports.ExternalTokenizer = ExternalTokenizer;
exports.InputStream = InputStream;
exports.LRParser = LRParser;
exports.LocalTokenGroup = LocalTokenGroup;
exports.Stack = Stack;

}).call(this)}).call(this,require('_process'))
},{"@lezer/common":4,"_process":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lr = require('@lezer/lr');
var highlight = require('@lezer/highlight');

// This file was generated by lezer-generator. You probably shouldn't edit it.
const printKeyword = 1,
  indent = 196,
  dedent = 197,
  newline$1 = 198,
  blankLineStart = 199,
  newlineBracketed = 200,
  eof = 201,
  formatString1Content = 202,
  formatString1Brace = 2,
  formatString1End = 203,
  formatString2Content = 204,
  formatString2Brace = 3,
  formatString2End = 205,
  formatString1lContent = 206,
  formatString1lBrace = 4,
  formatString1lEnd = 207,
  formatString2lContent = 208,
  formatString2lBrace = 5,
  formatString2lEnd = 209,
  ParenL = 26,
  ParenthesizedExpression = 27,
  TupleExpression = 51,
  ComprehensionExpression = 52,
  BracketL = 57,
  ArrayExpression = 58,
  ArrayComprehensionExpression = 59,
  BraceL = 61,
  DictionaryExpression = 62,
  DictionaryComprehensionExpression = 63,
  SetExpression = 64,
  SetComprehensionExpression = 65,
  ArgList = 67,
  subscript = 246,
  FormatString = 74,
  importList = 265,
  ParamList = 129,
  SequencePattern = 150,
  MappingPattern = 151,
  PatternArgList = 154;

const newline = 10, carriageReturn = 13, space = 32, tab = 9, hash = 35, parenOpen = 40, dot = 46,
      braceOpen = 123, singleQuote = 39, doubleQuote = 34, backslash = 92;

const bracketed = new Set([
  ParenthesizedExpression, TupleExpression, ComprehensionExpression, importList, ArgList, ParamList,
  ArrayExpression, ArrayComprehensionExpression, subscript,
  SetExpression, SetComprehensionExpression, FormatString,
  DictionaryExpression, DictionaryComprehensionExpression,
  SequencePattern, MappingPattern, PatternArgList
]);

function isLineBreak(ch) {
  return ch == newline || ch == carriageReturn
}

const newlines = new lr.ExternalTokenizer((input, stack) => {
  let prev;
  if (input.next < 0) {
    input.acceptToken(eof);
  } else if (stack.context.depth < 0) {
    if (isLineBreak(input.next)) input.acceptToken(newlineBracketed, 1);
  } else if (((prev = input.peek(-1)) < 0 || isLineBreak(prev)) &&
             stack.canShift(blankLineStart)) {
    let spaces = 0;
    while (input.next == space || input.next == tab) { input.advance(); spaces++; }
    if (input.next == newline || input.next == carriageReturn || input.next == hash)
      input.acceptToken(blankLineStart, -spaces);
  } else if (isLineBreak(input.next)) {
    input.acceptToken(newline$1, 1);
  }
}, {contextual: true});

const indentation = new lr.ExternalTokenizer((input, stack) => {
  let cDepth = stack.context.depth;
  if (cDepth < 0) return
  let prev = input.peek(-1);
  if (prev == newline || prev == carriageReturn) {
    let depth = 0, chars = 0;
    for (;;) {
      if (input.next == space) depth++;
      else if (input.next == tab) depth += 8 - (depth % 8);
      else break
      input.advance();
      chars++;
    }
    if (depth != cDepth &&
        input.next != newline && input.next != carriageReturn && input.next != hash) {
      if (depth < cDepth) input.acceptToken(dedent, -chars);
      else input.acceptToken(indent);
    }
  }
});

function IndentLevel(parent, depth) {
  this.parent = parent;
  // -1 means this is not an actual indent level but a set of brackets
  this.depth = depth;
  this.hash = (parent ? parent.hash + parent.hash << 8 : 0) + depth + (depth << 4);
}

const topIndent = new IndentLevel(null, 0);

function countIndent(space) {
  let depth = 0;
  for (let i = 0; i < space.length; i++)
    depth += space.charCodeAt(i) == tab ? 8 - (depth % 8) : 1;
  return depth
}

const trackIndent = new lr.ContextTracker({
  start: topIndent,
  reduce(context, term) {
    return context.depth < 0 && bracketed.has(term) ? context.parent : context
  },
  shift(context, term, stack, input) {
    if (term == indent) return new IndentLevel(context, countIndent(input.read(input.pos, stack.pos)))
    if (term == dedent) return context.parent
    if (term == ParenL || term == BracketL || term == BraceL) return new IndentLevel(context, -1)
    return context
  },
  hash(context) { return context.hash }
});

const legacyPrint = new lr.ExternalTokenizer(input => {
  for (let i = 0; i < 5; i++) {
    if (input.next != "print".charCodeAt(i)) return
    input.advance();
  }
  if (/\w/.test(String.fromCharCode(input.next))) return
  for (let off = 0;; off++) {
    let next = input.peek(off);
    if (next == space || next == tab) continue
    if (next != parenOpen && next != dot && next != newline && next != carriageReturn && next != hash)
      input.acceptToken(printKeyword);
    return
  }
});

function formatString(quote, len, content, brace, end) {
  return new lr.ExternalTokenizer(input => {
    let start = input.pos;
    for (;;) {
      if (input.next < 0) {
        break
      } else if (input.next == braceOpen) {
        if (input.peek(1) == braceOpen) {
          input.advance(2);
        } else {
          if (input.pos == start) {
            input.acceptToken(brace, 1);
            return
          }
          break
        }
      } else if (input.next == backslash) {
        input.advance();
        if (input.next >= 0) input.advance();
      } else if (input.next == quote && (len == 1 || input.peek(1) == quote && input.peek(2) == quote)) {
        if (input.pos == start) {
          input.acceptToken(end, len);
          return
        }
        break
      } else {
        input.advance();
      }
    }
    if (input.pos > start) input.acceptToken(content);
  })
}

const formatString1 = formatString(singleQuote, 1, formatString1Content, formatString1Brace, formatString1End);
const formatString2 = formatString(doubleQuote, 1, formatString2Content, formatString2Brace, formatString2End);
const formatString1l = formatString(singleQuote, 3, formatString1lContent, formatString1lBrace, formatString1lEnd);
const formatString2l = formatString(doubleQuote, 3, formatString2lContent, formatString2lBrace, formatString2lEnd);

const pythonHighlighting = highlight.styleTags({
  "async \"*\" \"**\" FormatConversion FormatSpec": highlight.tags.modifier,
  "for while if elif else try except finally return raise break continue with pass assert await yield match case": highlight.tags.controlKeyword,
  "in not and or is del": highlight.tags.operatorKeyword,
  "from def class global nonlocal lambda": highlight.tags.definitionKeyword,
  import: highlight.tags.moduleKeyword,
  "with as print": highlight.tags.keyword,
  Boolean: highlight.tags.bool,
  None: highlight.tags.null,
  VariableName: highlight.tags.variableName,
  "CallExpression/VariableName": highlight.tags.function(highlight.tags.variableName),
  "FunctionDefinition/VariableName": highlight.tags.function(highlight.tags.definition(highlight.tags.variableName)),
  "ClassDefinition/VariableName": highlight.tags.definition(highlight.tags.className),
  PropertyName: highlight.tags.propertyName,
  "CallExpression/MemberExpression/PropertyName": highlight.tags.function(highlight.tags.propertyName),
  Comment: highlight.tags.lineComment,
  Number: highlight.tags.number,
  String: highlight.tags.string,
  FormatString: highlight.tags.special(highlight.tags.string),
  UpdateOp: highlight.tags.updateOperator,
  "ArithOp!": highlight.tags.arithmeticOperator,
  BitOp: highlight.tags.bitwiseOperator,
  CompareOp: highlight.tags.compareOperator,
  AssignOp: highlight.tags.definitionOperator,
  Ellipsis: highlight.tags.punctuation,
  At: highlight.tags.meta,
  "( )": highlight.tags.paren,
  "[ ]": highlight.tags.squareBracket,
  "{ }": highlight.tags.brace,
  ".": highlight.tags.derefOperator,
  ", ;": highlight.tags.separator
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const spec_identifier = {__proto__:null,await:48, or:58, and:60, in:64, not:66, is:68, if:74, else:76, lambda:80, yield:98, from:100, async:106, for:108, None:168, True:170, False:170, del:184, pass:188, break:192, continue:196, return:200, raise:208, import:212, as:214, global:218, nonlocal:220, assert:224, elif:234, while:238, try:244, except:246, finally:248, with:252, def:256, class:266, match:277, case:283};
const parser = lr.LRParser.deserialize({
  version: 14,
  states: "#!OO`Q#yOOP$_OSOOO%hQ&nO'#H^OOQS'#Cq'#CqOOQS'#Cr'#CrO'WQ#xO'#CpO(yQ&nO'#H]OOQS'#H^'#H^OOQS'#DW'#DWOOQS'#H]'#H]O)gQ#xO'#DaO)zQ#xO'#DhO*[Q#xO'#DlOOQS'#Dw'#DwO*oO,UO'#DwO*wO7[O'#DwO+POWO'#DxO+[O`O'#DxO+gOpO'#DxO+rO!bO'#DxO-tQ&nO'#G}OOQS'#G}'#G}O'WQ#xO'#G|O/WQ&nO'#G|OOQS'#Ee'#EeO/oQ#xO'#EfOOQS'#G{'#G{O/yQ#xO'#GzOOQV'#Gz'#GzO0UQ#xO'#FXOOQS'#G`'#G`O0ZQ#xO'#FWOOQV'#IS'#ISOOQV'#Gy'#GyOOQV'#Fp'#FpQ`Q#yOOO'WQ#xO'#CsO0iQ#xO'#DPO0pQ#xO'#DTO1OQ#xO'#HbO1`Q&nO'#EYO'WQ#xO'#EZOOQS'#E]'#E]OOQS'#E_'#E_OOQS'#Ea'#EaO1tQ#xO'#EcO2[Q#xO'#EgO0UQ#xO'#EiO2oQ&nO'#EiO0UQ#xO'#ElO/oQ#xO'#EoO/oQ#xO'#EsO/oQ#xO'#EvO2zQ#xO'#ExO3RQ#xO'#E}O3^Q#xO'#EyO/oQ#xO'#E}O0UQ#xO'#FPO0UQ#xO'#FUO3cQ#xO'#FZP3jO#xO'#GxPOOO)CBl)CBlOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Ck'#CkOOQS'#Cl'#ClOOQS'#Cn'#CnO'WQ#xO,59QO'WQ#xO,59QO'WQ#xO,59QO'WQ#xO,59QO'WQ#xO,59QO'WQ#xO,59QO3uQ#xO'#DqOOQS,5:[,5:[O4YQ#xO'#HlOOQS,5:_,5:_O4gQMlO,5:_O4lQ&nO,59[O0iQ#xO,59dO0iQ#xO,59dO0iQ#xO,59dO7[Q#xO,59dO7aQ#xO,59dO7hQ#xO,59lO7oQ#xO'#H]O8uQ#xO'#H[OOQS'#H['#H[OOQS'#D^'#D^O9^Q#xO,59cO'WQ#xO,59cO9lQ#xO,59cOOQS,59{,59{O9qQ#xO,5:TO'WQ#xO,5:TOOQS,5:S,5:SO:PQ#xO,5:SO:UQ#xO,5:ZO'WQ#xO,5:ZO'WQ#xO,5:XOOQS,5:W,5:WO:gQ#xO,5:WO:lQ#xO,5:YOOOO'#Fx'#FxO:qO,UO,5:cOOQS,5:c,5:cOOOO'#Fy'#FyO:yO7[O,5:cO;RQ#xO'#DyOOOW'#Fz'#FzO;cOWO,5:dOOQS,5:d,5:dO;RQ#xO'#D}OOO`'#F}'#F}O;nO`O,5:dO;RQ#xO'#EOOOOp'#GO'#GOO;yOpO,5:dO;RQ#xO'#EPOOO!b'#GP'#GPO<UO!bO,5:dOOQS'#GQ'#GQO<aQ&nO,5:lO?RQ&nO,5=hO?lQ!LUO,5=hO@]Q&nO,5=hOOQS,5;Q,5;QO@tQ#yO'#GYOBTQ#xO,5;]OOQV,5=f,5=fOB`Q&nO'#IOOBwQ#xO,5;sOOQS-E:^-E:^OOQV,5;r,5;rO3XQ#xO'#FPOOQV-E9n-E9nOCPQ&nO,59_OEWQ&nO,59kOEqQ#xO'#H_OE|Q#xO'#H_O0UQ#xO'#H_OFXQ#xO'#DVOFaQ#xO,59oOFfQ#xO'#HcO'WQ#xO'#HcO/oQ#xO,5=|OOQS,5=|,5=|O/oQ#xO'#EUOOQS'#EV'#EVOGTQ#xO'#GSOGeQ#xO,59OOGeQ#xO,59OO)mQ#xO,5:rOGsQ&nO'#HeOOQS,5:u,5:uOOQS,5:},5:}OHWQ#xO,5;ROHiQ#xO,5;TOOQS'#GV'#GVOHwQ&nO,5;TOIVQ#xO,5;TOI[Q#xO'#IROOQS,5;W,5;WOIjQ#xO'#H}OOQS,5;Z,5;ZO3^Q#xO,5;_O3^Q#xO,5;bOI{Q&nO'#ITO'WQ#xO'#ITOJVQ#xO,5;dO2zQ#xO,5;dO/oQ#xO,5;iO0UQ#xO,5;kOJ[Q#yO'#EtOKeQ#{O,5;eONvQ#xO'#IUO3^Q#xO,5;iO! RQ#xO,5;kO! WQ#xO,5;pO! `Q&nO,5;uO'WQ#xO,5;uPOOO,5=d,5=dP! gOSO,5=dP! lO#xO,5=dO!$aQ&nO1G.lO!$hQ&nO1G.lO!'XQ&nO1G.lO!'cQ&nO1G.lO!)|Q&nO1G.lO!*aQ&nO1G.lO!*tQ#xO'#HkO!+SQ&nO'#G}O/oQ#xO'#HkO!+^Q#xO'#HjOOQS,5:],5:]O!+fQ#xO,5:]O!+kQ#xO'#HmO!+vQ#xO'#HmO!,ZQ#xO,5>WOOQS'#Du'#DuOOQS1G/y1G/yOOQS1G/O1G/OO!-ZQ&nO1G/OO!-bQ&nO1G/OO0iQ#xO1G/OO!-}Q#xO1G/WOOQS'#D]'#D]O/oQ#xO,59vOOQS1G.}1G.}O!.UQ#xO1G/gO!.fQ#xO1G/gO!.nQ#xO1G/hO'WQ#xO'#HdO!.sQ#xO'#HdO!.xQ&nO1G.}O!/YQ#xO,59kO!0`Q#xO,5>SO!0pQ#xO,5>SO!0xQ#xO1G/oO!0}Q&nO1G/oOOQS1G/n1G/nO!1_Q#xO,5=}O!2UQ#xO,5=}O/oQ#xO1G/sO!2sQ#xO1G/uO!2xQ&nO1G/uO!3YQ&nO1G/sOOQS1G/r1G/rOOQS1G/t1G/tOOOO-E9v-E9vOOQS1G/}1G/}OOOO-E9w-E9wO!3jQ#xO'#HwO/oQ#xO'#HwO!3xQ#xO,5:eOOOW-E9x-E9xOOQS1G0O1G0OO!4TQ#xO,5:iOOO`-E9{-E9{O!4`Q#xO,5:jOOOp-E9|-E9|O!4kQ#xO,5:kOOO!b-E9}-E9}OOQS-E:O-E:OO!4vQ!LUO1G3SO!5gQ&nO1G3SO'WQ#xO,5<mOOQS,5<m,5<mOOQS-E:P-E:POOQS,5<t,5<tOOQS-E:W-E:WOOQV1G0w1G0wO0UQ#xO'#GUO!6OQ&nO,5>jOOQS1G1_1G1_O!6gQ#xO1G1_OOQS'#DX'#DXO/oQ#xO,5=yOOQS,5=y,5=yO!6lQ#xO'#FqO!6wQ#xO,59qO!7PQ#xO1G/ZO!7ZQ&nO,5=}OOQS1G3h1G3hOOQS,5:p,5:pO!7zQ#xO'#G|OOQS,5<n,5<nOOQS-E:Q-E:QO!8]Q#xO1G.jOOQS1G0^1G0^O!8kQ#xO,5>PO!8{Q#xO,5>PO/oQ#xO1G0mO/oQ#xO1G0mO0UQ#xO1G0oOOQS-E:T-E:TO!9^Q#xO1G0oO!9iQ#xO1G0oO!9nQ#xO,5>mO!9|Q#xO,5>mO!:[Q#xO,5>iO!:rQ#xO,5>iO!;TQ#{O1G0yO!>cQ#{O1G0|O!AnQ#xO,5>oO!AxQ#xO,5>oO!BQQ&nO,5>oO/oQ#xO1G1OO!B[Q#xO1G1OO3^Q#xO1G1TO! RQ#xO1G1VOOQV,5;`,5;`O!BaQ#zO,5;`O!BfQ#{O1G1PO!EwQ#xO'#G]O3^Q#xO1G1PO3^Q#xO1G1PO!FUQ#xO,5>pO!FcQ#xO,5>pO0UQ#xO,5>pOOQV1G1T1G1TO!FkQ#xO'#FRO!F|QMlO1G1VOOQV1G1[1G1[O3^Q#xO1G1[O!GUQ#xO'#F]OOQV1G1a1G1aO! `Q&nO1G1aPOOO1G3O1G3OP!GZOSO1G3OOOQS,5>V,5>VOOQS'#Dr'#DrO/oQ#xO,5>VO!G`Q#xO,5>UO!GsQ#xO,5>UOOQS1G/w1G/wO!G{Q#xO,5>XO!H]Q#xO,5>XO!HeQ#xO,5>XO!HxQ#xO,5>XO!IYQ#xO,5>XOOQS1G3r1G3rOOQS7+$j7+$jO!7PQ#xO7+$rO!J{Q#xO1G/OO!KSQ#xO1G/OOOQS1G/b1G/bOOQS,5<_,5<_O'WQ#xO,5<_OOQS7+%R7+%RO!KZQ#xO7+%ROOQS-E9q-E9qOOQS7+%S7+%SO!KkQ#xO,5>OO'WQ#xO,5>OOOQS7+$i7+$iO!KpQ#xO7+%RO!KxQ#xO7+%SO!K}Q#xO1G3nOOQS7+%Z7+%ZO!L_Q#xO1G3nO!LgQ#xO7+%ZOOQS,5<^,5<^O'WQ#xO,5<^O!LlQ#xO1G3iOOQS-E9p-E9pO!McQ#xO7+%_OOQS7+%a7+%aO!MqQ#xO1G3iO!N`Q#xO7+%aO!NeQ#xO1G3oO!NuQ#xO1G3oO!N}Q#xO7+%_O# SQ#xO,5>cO# jQ#xO,5>cO# jQ#xO,5>cO# xO$ISO'#D{O#!TO#tO'#HxOOOW1G0P1G0PO#!YQ#xO1G0POOO`1G0T1G0TO#!bQ#xO1G0TOOOp1G0U1G0UO#!jQ#xO1G0UOOO!b1G0V1G0VO#!rQ#xO1G0VO#!zQ!LUO7+(nO##kQ&nO1G2XP#$UQ#xO'#GROOQS,5<p,5<pOOQS-E:S-E:SOOQS7+&y7+&yOOQS1G3e1G3eOOQS,5<],5<]OOQS-E9o-E9oOOQS7+$u7+$uO#$cQ#xO,5=hO#$|Q#xO,5=hO#%_Q&nO,5<`O#%rQ#xO1G3kOOQS-E9r-E9rOOQS7+&X7+&XO#&SQ#xO7+&XOOQS7+&Z7+&ZO#&bQ#xO'#IQO0UQ#xO'#IPO#&vQ#xO7+&ZOOQS,5<s,5<sO#'RQ#xO1G4XOOQS-E:V-E:VOOQS,5<o,5<oO#'aQ#xO1G4TOOQS-E:R-E:RO#'wQ#{O7+&eO!EwQ#xO'#GZO3^Q#xO7+&eO3^Q#xO7+&hO#+VQ&nO,5<vO'WQ#xO,5<vO#+aQ#xO1G4ZOOQS-E:Y-E:YO#+kQ#xO1G4ZO3^Q#xO7+&jO/oQ#xO7+&jOOQV7+&o7+&oO!F|QMlO7+&qO`Q#yO1G0zOOQV-E:Z-E:ZO3^Q#xO7+&kO3^Q#xO7+&kOOQV,5<w,5<wO#+sQ#xO,5<wOOQV7+&k7+&kO#,OQ#{O7+&kO#/ZQ#xO,5<xO#/fQ#xO1G4[OOQS-E:[-E:[O#/sQ#xO1G4[O#/{Q#xO'#IWO#0ZQ#xO'#IWO0UQ#xO'#IWOOQS'#IW'#IWO#0fQ#xO'#IVOOQS,5;m,5;mO#0nQ#xO,5;mO/oQ#xO'#FTOOQV7+&q7+&qO3^Q#xO7+&qOOQV7+&v7+&vO#0sQ#zO,5;wOOQV7+&{7+&{POOO7+(j7+(jOOQS1G3q1G3qOOQS,5<b,5<bO#0xQ#xO1G3pOOQS-E9t-E9tO#1]Q#xO,5<cO#1hQ#xO,5<cO#1{Q#xO1G3sOOQS-E9u-E9uO#2]Q#xO1G3sO#2eQ#xO1G3sO#2uQ#xO1G3sO#2]Q#xO1G3sOOQS<<H^<<H^O#3QQ&nO1G1yOOQS<<Hm<<HmP#3_Q#xO'#FsO7hQ#xO1G3jO#3lQ#xO1G3jO#3qQ#xO<<HmOOQS<<Hn<<HnO#4RQ#xO7+)YOOQS<<Hu<<HuO#4cQ&nO1G1xP#5SQ#xO'#FrO#5aQ#xO7+)ZO#5qQ#xO7+)ZO#5yQ#xO<<HyO#6OQ#xO7+)TOOQS<<H{<<H{O#6uQ#xO,5<aO'WQ#xO,5<aOOQS-E9s-E9sOOQS<<Hy<<HyOOQS,5<g,5<gO/oQ#xO,5<gO#6zQ#xO1G3}OOQS-E9y-E9yO#7bQ#xO1G3}O;RQ#xO'#D|OOOO'#F|'#F|O#7pO$ISO,5:gOOO#l,5>d,5>dOOOW7+%k7+%kOOO`7+%o7+%oOOOp7+%p7+%pOOO!b7+%q7+%qO#7{Q#xO1G3SO#8fQ#xO1G3SP'WQ#xO'#FtO/oQ#xO<<IsO#8wQ#xO,5>lO#9YQ#xO,5>lO0UQ#xO,5>lO#9kQ#xO,5>kOOQS<<Iu<<IuP0UQ#xO'#GXP/oQ#xO'#GTOOQV-E:X-E:XO3^Q#xO<<JPOOQV,5<u,5<uO3^Q#xO,5<uOOQV<<JP<<JPOOQV<<JS<<JSO#9pQ&nO1G2bP#9zQ#xO'#G[O#:RQ#xO7+)uO#:]Q#{O<<JUO3^Q#xO<<JUOOQV<<J]<<J]O3^Q#xO<<J]O#=hQ#{O7+&fOOQV<<JV<<JVO#=rQ#{O<<JVOOQV1G2c1G2cO0UQ#xO1G2cO3^Q#xO<<JVO0UQ#xO1G2dP/oQ#xO'#G^O#@}Q#xO7+)vO#A[Q#xO7+)vOOQS'#FS'#FSO/oQ#xO,5>rO#AdQ#xO,5>rOOQS,5>r,5>rO#AoQ#xO,5>qO#BQQ#xO,5>qOOQS1G1X1G1XOOQS,5;o,5;oO#BYQ#xO1G1cP#B_Q#xO'#FvO#BoQ#xO1G1}O#CSQ#xO1G1}O#CdQ#xO1G1}P#CoQ#xO'#FwO#C|Q#xO7+)_O#D^Q#xO7+)_O#D^Q#xO7+)_O#DfQ#xO7+)_O#DvQ#xO7+)UO7hQ#xO7+)UOOQSAN>XAN>XO#EaQ#xO<<LuOOQSAN>eAN>eO/oQ#xO1G1{O#EqQ&nO1G1{P#E{Q#xO'#FuOOQS1G2R1G2RP#FYQ#xO'#F{O#FgQ#xO7+)iO#F}Q#xO,5:hOOOO-E9z-E9zO#GYQ#xO7+(nOOQSAN?_AN?_O#GsQ#xO,5<rO#HXQ#xO1G4WOOQS-E:U-E:UO#HjQ#xO1G4WOOQS1G4V1G4VOOQVAN?kAN?kOOQV1G2a1G2aO3^Q#xOAN?pO#H{Q#{OAN?pOOQVAN?wAN?wOOQV<<JQ<<JQO3^Q#xOAN?qO3^Q#xO7+'}OOQVAN?qAN?qOOQS7+(O7+(OO#LWQ#xO<<MbOOQS1G4^1G4^O/oQ#xO1G4^OOQS,5<y,5<yO#LeQ#xO1G4]OOQS-E:]-E:]OOQU'#Ga'#GaO#LvQ#zO7+&}O#MRQ#xO'#F^O#MyQ#xO7+'iO#NZQ#xO7+'iOOQS7+'i7+'iO#NfQ#xO<<LyO#NvQ#xO<<LyO#NvQ#xO<<LyO$ OQ#xO'#HfOOQS<<Lp<<LpO$ YQ#xO<<LpOOQS7+'g7+'gOOOO1G0S1G0SO$ sQ#xO1G0SO0UQ#xO1G2^P0UQ#xO'#GWO$ {Q#xO7+)rO$!^Q#xO7+)rOOQVG25[G25[O3^Q#xOG25[OOQVG25]G25]OOQV<<Ki<<KiOOQS7+)x7+)xP$!oQ#xO'#G_OOQU-E:_-E:_OOQV<<Ji<<JiO$#cQ&nO'#F`OOQS'#Fb'#FbO$#sQ#xO'#FaO$$eQ#xO'#FaOOQS'#Fa'#FaO$$jQ#xO'#IYO#MRQ#xO'#FhO#MRQ#xO'#FhO$%RQ#xO'#FiO#MRQ#xO'#FjO$%YQ#xO'#IZOOQS'#IZ'#IZO$%wQ#xO,5;xOOQS<<KT<<KTO$&PQ#xO<<KTO$&aQ#xOANBeO$&qQ#xOANBeO$&yQ#xO'#HgOOQS'#Hg'#HgO0pQ#xO'#DeO$'dQ#xO,5>QOOQSANB[ANB[OOOO7+%n7+%nOOQS7+'x7+'xO$'{Q#xO<<M^OOQVLD*vLD*vO4gQMlO'#GcO$(^Q&nO,5<RO#MRQ#xO'#FlOOQS,5<V,5<VOOQS'#Fc'#FcO$)OQ#xO,5;{O$)TQ#xO,5;{OOQS'#Ff'#FfO#MRQ#xO'#GbO$)uQ#xO,5<PO$*aQ#xO,5>tO$*qQ#xO,5>tO0UQ#xO,5<OO$+SQ#xO,5<SO$+XQ#xO,5<SO#MRQ#xO'#I[O$+^Q#xO'#I[O$+cQ#xO,5<TOOQS,5<U,5<UO'WQ#xO'#FoOOQU1G1d1G1dO3^Q#xO1G1dOOQSAN@oAN@oO$+hQ#xOG28PO$+xQ#xO,5:POOQS1G3l1G3lOOQS,5<},5<}OOQS-E:a-E:aO$+}Q&nO'#F`O$,UQ#xO'#I]O$,dQ#xO'#I]O$,lQ#xO,5<WOOQS1G1g1G1gO$,qQ#xO1G1gO$,vQ#xO,5<|OOQS-E:`-E:`O$-bQ#xO,5=QO$-yQ#xO1G4`OOQS-E:d-E:dOOQS1G1j1G1jOOQS1G1n1G1nO$.ZQ#xO,5>vO#MRQ#xO,5>vOOQS1G1o1G1oO$.iQ&nO,5<ZOOQU7+'O7+'OO$ OQ#xO1G/kO#MRQ#xO,5<XO$.pQ#xO,5>wO$.wQ#xO,5>wOOQS1G1r1G1rOOQS7+'R7+'RP#MRQ#xO'#GfO$/PQ#xO1G4bO$/ZQ#xO1G4bO$/cQ#xO1G4bOOQS7+%V7+%VO$/qQ#xO1G1sO$0PQ&nO'#F`O$0WQ#xO,5=POOQS,5=P,5=PO$0fQ#xO1G4cOOQS-E:c-E:cO#MRQ#xO,5=OO$0mQ#xO,5=OO$0rQ#xO7+)|OOQS-E:b-E:bO$0|Q#xO7+)|O#MRQ#xO,5<YP#MRQ#xO'#GeO$1UQ#xO1G2jO#MRQ#xO1G2jP$1dQ#xO'#GdO$1kQ#xO<<MhO$1uQ#xO1G1tO$2TQ#xO7+(UO7hQ#xO'#DPO7hQ#xO,59dO7hQ#xO,59dO7hQ#xO,59dO$2cQ&nO,5=hO7hQ#xO1G/OO/oQ#xO1G/ZO/oQ#xO7+$rP$2vQ#xO'#GRO'WQ#xO'#G|O$3TQ#xO,59dO$3YQ#xO,59dO$3aQ#xO,59oO$3fQ#xO1G/WO0pQ#xO'#DTO7hQ#xO,59l",
  stateData: "$3w~O%kOS%`OSUOS%_PQ~OPiOXfOhtOjYOquOu!TOxvO!RwO!S!QO!V!WO!W!VO!ZZO!_[O!jeO!ueO!veO!weO#OyO#QzO#S{O#U|O#W}O#[!OO#^!PO#a!RO#b!RO#d!SO#k!UO#n!XO#r!YO#t!ZO#y![O#|mO$O!]O%wRO%xRO%|SO%}WO&c]O&d^O&g_O&j`O&naO&obO&pcO~O%_!^O~OX!eOa!eOc!fOj!mO!Z!oO!h!qO%r!`O%s!aO%t!bO%u!cO%v!cO%w!dO%x!dO%y!eO%z!eO%{!eO~Om&QXn&QXo&QXp&QXq&QXr&QXu&QX|&QX}&QX!{&QX#f&QX%^&QX%a&QX&S&QXi&QX!V&QX!W&QX&T&QX!Y&QX!^&QX!S&QX#_&QXv&QX!n&QX~P$dOhtOjYO!ZZO!_[O!jeO!ueO!veO!weO%wRO%xRO%|SO%}WO&c]O&d^O&g_O&j`O&naO&obO&pcO~O|&PX}&PX#f&PX%^&PX%a&PX&S&PX~Om!tOn!uOo!sOp!sOq!vOr!wOu!xO!{&PX~P(eOX#OOi#QOq0VOx0eO!RwO~P'WOX#SOq0VOx0eO!Y#TO~P'WOX#WOc#XOq0VOx0eO!^#YO~P'WO&e#]O&f#_O~O&h#`O&i#_O~OQ#bO%b#cO%c#eO~OR#fO%d#gO%e#eO~OS#iO%f#jO%g#eO~OT#lO%h#mO%i#eO~OX%qXa%qXc%qXj%qXm%qXn%qXo%qXp%qXq%qXr%qXu%qX|%qX!Z%qX!h%qX%r%qX%s%qX%t%qX%u%qX%v%qX%w%qX%x%qX%y%qX%z%qX%{%qXi%qX!V%qX!W%qX~O&c]O&d^O&g_O&j`O&naO&obO&pcO}%qX!{%qX#f%qX%^%qX%a%qX&S%qX&T%qX!Y%qX!^%qX!S%qX#_%qXv%qX!n%qX~P+}O|#rO}%pX!{%pX#f%pX%^%pX%a%pX&S%pX~Oq0VOx0eO~P'WO#f#uO%^#wO%a#wO~O%}WO~O!V#|O#t!ZO#y![O#|mO~OquO~P'WOX$ROc$SO%}WO}yP~OX$WOq0VOx0eO!S$XO~P'WO}$ZO!{$`O&S$[O#f!|X%^!|X%a!|X~OX$WOq0VOx0eO#f#VX%^#VX%a#VX~P'WOq0VOx0eO#f#ZX%^#ZX%a#ZX~P'WO!h$fO!u$fO%}WO~OX$pO~P'WO!W$rO#r$sO#t$tO~O}$uO~OX$|O~P'WOU%OO%^$}O%k%PO~OX%YOc%YOi%[Oq0VOx0eO~P'WOq0VOx0eO}%_O~P'WO&b%aO~Oc!fOj!mO!Z!oO!h!qOXdaadamdandaodapdaqdardauda|da}da!{da#fda%^da%ada%rda%sda%tda%uda%vda%wda%xda%yda%zda%{da&Sdaida!Vda!Wda&Tda!Yda!^da!Sda#_davda!nda~Op%fO~Oq%fO~P'WOq0VO~P'WOm0XOn0YOo0WOp0WOq0aOr0bOu0fOi&PX!V&PX!W&PX&T&PX!Y&PX!^&PX!S&PX#_&PX!n&PX~P(eO&T%hOi&OX|&OX!V&OX!W&OX!Y&OX}&OX~Oi%jO|%kO!V%oO!W%nO~Oi%jO~O|%rO!V%oO!W%nO!Y&[X~O!Y%vO~O|%wO}%yO!V%oO!W%nO!^&VX~O!^%}O~O!^&OO~O&e#]O&f&QO~O&h#`O&i&QO~OX&TOq0VOx0eO!RwO~P'WOQ#bO%b#cO%c&WO~OR#fO%d#gO%e&WO~OS#iO%f#jO%g&WO~OT#lO%h#mO%i&WO~OX!taa!tac!taj!tam!tan!tao!tap!taq!tar!tau!ta|!ta}!ta!Z!ta!h!ta!{!ta#f!ta%^!ta%a!ta%r!ta%s!ta%t!ta%u!ta%v!ta%w!ta%x!ta%y!ta%z!ta%{!ta&S!tai!ta!V!ta!W!ta&T!ta!Y!ta!^!ta!S!ta#_!tav!ta!n!ta~P#vO|&`O}%pa!{%pa#f%pa%^%pa%a%pa&S%pa~P$dOX&bOquOxvO}%pa!{%pa#f%pa%^%pa%a%pa&S%pa~P'WO|&`O}%pa!{%pa#f%pa%^%pa%a%pa&S%pa~OPiOXfOquOxvO!RwO!S!QO#OyO#QzO#S{O#U|O#W}O#[!OO#^!PO#a!RO#b!RO#d!SO#f$|X%^$|X%a$|X~P'WO#f#uO%^&gO%a&gO~O!h&hOj&rX%^&rX#_&rX#f&rX%a&rX#^&rX~Oj!mO%^&jO~Omgangaogapgaqgargauga|ga}ga!{ga#fga%^ga%aga&Sgaiga!Vga!Wga&Tga!Yga!^ga!Sga#_gavga!nga~P$dOusa|sa}sa#fsa%^sa%asa&Ssa~Om!tOn!uOo!sOp!sOq!vOr!wO!{sa~PDoO&S&lO|&RX}&RX~O%}WO|&RX}&RX~O|&oO}yX~O}&qO~O|%wO#f&VX%^&VX%a&VXi&VX}&VX!^&VX!n&VX&S&VX~OX0`Oq0VOx0eO!RwO~P'WO&S$[O#fWa%^Wa%aWa~O|&zO#f&XX%^&XX%a&XXp&XX~P$dO|&}O!S&|O#f#Za%^#Za%a#Za~O#_'OO#f#]a%^#]a%a#]a~O!h$fO!u$fO#^'QO%}WO~O#^'QO~O|'SO#f&uX%^&uX%a&uX~O|'UO#f&qX%^&qX%a&qX}&qX~O|'YOp&wX~P$dOp']O~OPiOXfOquOxvO!RwO!S!QO#OyO#QzO#S{O#U|O#W}O#[!OO#^!PO#a!RO#b!RO#d!SO%^'bO~P'WOv'fO#o'dO#p'eOP#maX#mah#maj#maq#mau#max#ma!R#ma!S#ma!V#ma!W#ma!Z#ma!_#ma!j#ma!u#ma!v#ma!w#ma#O#ma#Q#ma#S#ma#U#ma#W#ma#[#ma#^#ma#a#ma#b#ma#d#ma#k#ma#n#ma#r#ma#t#ma#y#ma#|#ma$O#ma%Z#ma%w#ma%x#ma%|#ma%}#ma&c#ma&d#ma&g#ma&j#ma&n#ma&o#ma&p#ma%]#ma%a#ma~O|'gO#_'iO}&xX~Oj'kO~Oj!mO}$uO~O}'oO~P$dO%^'rO~OU'sO%^'rO~OX!eOa!eOc!fOj!mO!Z!oO!h!qO%t!bO%u!cO%v!cO%w!dO%x!dO%y!eO%z!eO%{!eOmYinYioYipYiqYirYiuYi|Yi}Yi!{Yi#fYi%^Yi%aYi%rYi&SYiiYi!VYi!WYi&TYi!YYi!^Yi!SYi#_YivYi!nYi~O%s!aO~P! tO%sYi~P! tOX!eOa!eOc!fOj!mO!Z!oO!h!qO%w!dO%x!dO%y!eO%z!eO%{!eOmYinYioYipYiqYirYiuYi|Yi}Yi!{Yi#fYi%^Yi%aYi%rYi%sYi%tYi&SYiiYi!VYi!WYi&TYi!YYi!^Yi!SYi#_YivYi!nYi~O%u!cO%v!cO~P!$oO%uYi%vYi~P!$oOc!fOj!mO!Z!oO!h!qOmYinYioYipYiqYirYiuYi|Yi}Yi!{Yi#fYi%^Yi%aYi%rYi%sYi%tYi%uYi%vYi%wYi%xYi&SYiiYi!VYi!WYi&TYi!YYi!^Yi!SYi#_YivYi!nYi~OX!eOa!eO%y!eO%z!eO%{!eO~P!'mOXYiaYi%yYi%zYi%{Yi~P!'mO!V%oO!W%nOi&_X|&_X~O&S'uO&T'uO~P+}O|'wOi&^X~Oi'yO~O|'zO}'|O!Y&aX~Oq0VOx0eO|'zO}'}O!Y&aX~P'WO!Y(PO~Oo!sOp!sOq!vOr!wOmliuli|li}li!{li#fli%^li%ali&Sli~On!uO~P!,`Onli~P!,`Om0XOn0YOo0WOp0WOq0aOr0bO~Ov(RO~P!-iOX(WOi(XOq0VOx0eO~P'WOi(XO|(YO~Oi([O~O!W(^O~Oi(_O|(YO!V%oO!W%nO~P$dOm0XOn0YOo0WOp0WOq0aOr0bOisa!Vsa!Wsa&Tsa!Ysa!^sa!Ssa#_savsa!nsa~PDoOX(WOq0VOx0eO!Y&[a~P'WO|(bO!Y&[a~O!Y(cO~O|(bO!V%oO!W%nO!Y&[a~P$dOX(gOq0VOx0eO!^&Va#f&Va%^&Va%a&Vai&Va}&Va!n&Va&S&Va~P'WO|(hO!^&Va#f&Va%^&Va%a&Vai&Va}&Va!n&Va&S&Va~O!^(kO~O|(hO!V%oO!W%nO!^&Va~P$dO|(nO!V%oO!W%nO!^&]a~P$dO|(qO}&kX!^&kX!n&kX~O}(tO!^(vO!n(wO~O}(tO!^(xO!n(yO~O}(tO!^(zO!n({O~O}(tO!^(|O!n(}O~OX&bOquOxvO}%pi!{%pi#f%pi%^%pi%a%pi&S%pi~P'WO|)OO}%pi!{%pi#f%pi%^%pi%a%pi&S%pi~O!h&hOj&ra%^&ra#_&ra#f&ra%a&ra#^&ra~O%^)TO~OX$ROc$SO%}WO~O|&oO}ya~OquOxvO~P'WO|(hO#f&Va%^&Va%a&Vai&Va}&Va!^&Va!n&Va&S&Va~P$dO|)YO#f%pX%^%pX%a%pX&S%pX~O&S$[O#fWi%^Wi%aWi~O#f&Xa%^&Xa%a&Xap&Xa~P'WO|)]O#f&Xa%^&Xa%a&Xap&Xa~OX)aOj)cO%}WO~O#^)dO~O%}WO#f&ua%^&ua%a&ua~O|)fO#f&ua%^&ua%a&ua~Oq0VOx0eO#f&qa%^&qa%a&qa}&qa~P'WO|)iO#f&qa%^&qa%a&qa}&qa~Ov)mO#i)lOP#giX#gih#gij#giq#giu#gix#gi!R#gi!S#gi!V#gi!W#gi!Z#gi!_#gi!j#gi!u#gi!v#gi!w#gi#O#gi#Q#gi#S#gi#U#gi#W#gi#[#gi#^#gi#a#gi#b#gi#d#gi#k#gi#n#gi#r#gi#t#gi#y#gi#|#gi$O#gi%Z#gi%w#gi%x#gi%|#gi%}#gi&c#gi&d#gi&g#gi&j#gi&n#gi&o#gi&p#gi%]#gi%a#gi~Ov)nOP#jiX#jih#jij#jiq#jiu#jix#ji!R#ji!S#ji!V#ji!W#ji!Z#ji!_#ji!j#ji!u#ji!v#ji!w#ji#O#ji#Q#ji#S#ji#U#ji#W#ji#[#ji#^#ji#a#ji#b#ji#d#ji#k#ji#n#ji#r#ji#t#ji#y#ji#|#ji$O#ji%Z#ji%w#ji%x#ji%|#ji%}#ji&c#ji&d#ji&g#ji&j#ji&n#ji&o#ji&p#ji%]#ji%a#ji~OX)pOp&wa~P'WO|)qOp&wa~O|)qOp&wa~P$dOp)uO~O%[)xO~Ov){O#o'dO#p)zOP#miX#mih#mij#miq#miu#mix#mi!R#mi!S#mi!V#mi!W#mi!Z#mi!_#mi!j#mi!u#mi!v#mi!w#mi#O#mi#Q#mi#S#mi#U#mi#W#mi#[#mi#^#mi#a#mi#b#mi#d#mi#k#mi#n#mi#r#mi#t#mi#y#mi#|#mi$O#mi%Z#mi%w#mi%x#mi%|#mi%}#mi&c#mi&d#mi&g#mi&j#mi&n#mi&o#mi&p#mi%]#mi%a#mi~Oq0VOx0eO}$uO~P'WOq0VOx0eO}&xa~P'WO|*RO}&xa~OX*VOc*WOi*ZO%y*XO%}WO~O}$uO&{*]O~O%^*aO~O%^*cO~OX%YOc%YOq0VOx0eOi&^a~P'WO|*fOi&^a~Oq0VOx0eO}*iO!Y&aa~P'WO|*jO!Y&aa~Oq0VOx0eO|*jO}*mO!Y&aa~P'WOq0VOx0eO|*jO!Y&aa~P'WO|*jO}*mO!Y&aa~Oo0WOp0WOq0aOr0bOilimliuli|li!Vli!Wli&Tli!Yli}li!^li#fli%^li%ali!Sli#_livli!nli&Sli~On0YO~P!IeOnli~P!IeOX(WOi*rOq0VOx0eO~P'WOp*tO~Oi*rO|*vO~Oi*wO~OX(WOq0VOx0eO!Y&[i~P'WO|*xO!Y&[i~O!Y*yO~OX(gOq0VOx0eO!^&Vi#f&Vi%^&Vi%a&Vii&Vi}&Vi!n&Vi&S&Vi~P'WO|*|O!V%oO!W%nO!^&]i~O|+PO!^&Vi#f&Vi%^&Vi%a&Vii&Vi}&Vi!n&Vi&S&Vi~O!^+QO~Oc+SOq0VOx0eO!^&]i~P'WO|*|O!^&]i~O!^+UO~OX+WOq0VOx0eO}&ka!^&ka!n&ka~P'WO|+XO}&ka!^&ka!n&ka~O!_+[O&m+]O!^!oX~O!^+_O~O}(tO!^+`O~O}(tO!^+aO~O}(tO!^+bO~O}(tO!^+cO~OX&bOquOxvO}%pq!{%pq#f%pq%^%pq%a%pq&S%pq~P'WO|$ui}$ui!{$ui#f$ui%^$ui%a$ui&S$ui~P$dOX&bOquOxvO~P'WOX&bOq0VOx0eO#f%pa%^%pa%a%pa&S%pa~P'WO|+dO#f%pa%^%pa%a%pa&S%pa~O|$ha#f$ha%^$ha%a$hap$ha~P$dO#f&Xi%^&Xi%a&Xip&Xi~P'WO|+gO#f#Zq%^#Zq%a#Zq~O|+hO#_+jO#f&tX%^&tX%a&tXi&tX~OX+lOj)cO%}WO~O%}WO#f&ui%^&ui%a&ui~Oq0VOx0eO#f&qi%^&qi%a&qi}&qi~P'WOv+pO#i)lOP#gqX#gqh#gqj#gqq#gqu#gqx#gq!R#gq!S#gq!V#gq!W#gq!Z#gq!_#gq!j#gq!u#gq!v#gq!w#gq#O#gq#Q#gq#S#gq#U#gq#W#gq#[#gq#^#gq#a#gq#b#gq#d#gq#k#gq#n#gq#r#gq#t#gq#y#gq#|#gq$O#gq%Z#gq%w#gq%x#gq%|#gq%}#gq&c#gq&d#gq&g#gq&j#gq&n#gq&o#gq&p#gq%]#gq%a#gq~Op%Oa|%Oa~P$dOX)pOp&wi~P'WO|+wOp&wi~O|,QO}$uO#_,QO~O#p,ROP#mqX#mqh#mqj#mqq#mqu#mqx#mq!R#mq!S#mq!V#mq!W#mq!Z#mq!_#mq!j#mq!u#mq!v#mq!w#mq#O#mq#Q#mq#S#mq#U#mq#W#mq#[#mq#^#mq#a#mq#b#mq#d#mq#k#mq#n#mq#r#mq#t#mq#y#mq#|#mq$O#mq%Z#mq%w#mq%x#mq%|#mq%}#mq&c#mq&d#mq&g#mq&j#mq&n#mq&o#mq&p#mq%]#mq%a#mq~O#_,SO|%Qa}%Qa~Oq0VOx0eO}&xi~P'WO|,UO}&xi~O}$ZO&S,WOi&zX|&zX~O%}WOi&zX|&zX~O|,[Oi&yX~Oi,^O~O%[,`O~OX%YOc%YOq0VOx0eOi&^i~P'WO},bO|$ka!Y$ka~Oq0VOx0eO},cO|$ka!Y$ka~P'WOq0VOx0eO}*iO!Y&ai~P'WO|,fO!Y&ai~Oq0VOx0eO|,fO!Y&ai~P'WO|,fO},iO!Y&ai~Oi$gi|$gi!Y$gi~P$dOX(WOq0VOx0eO~P'WOp,kO~OX(WOi,lOq0VOx0eO~P'WOX(WOq0VOx0eO!Y&[q~P'WO|$fi!^$fi#f$fi%^$fi%a$fii$fi}$fi!n$fi&S$fi~P$dOX(gOq0VOx0eO~P'WOc+SOq0VOx0eO!^&]q~P'WO|,mO!^&]q~O!^,nO~OX(gOq0VOx0eO!^&Vq#f&Vq%^&Vq%a&Vqi&Vq}&Vq!n&Vq&S&Vq~P'WO},oO~OX+WOq0VOx0eO}&ki!^&ki!n&ki~P'WO|,tO}&ki!^&ki!n&ki~O!_+[O&m+]O!^!oa~OX&bOq0VOx0eO#f%pi%^%pi%a%pi&S%pi~P'WO|,wO#f%pi%^%pi%a%pi&S%pi~O%}WO#f&ta%^&ta%a&tai&ta~O|,zO#f&ta%^&ta%a&tai&ta~Oi,}O~Op%Oi|%Oi~P$dOX)pO~P'WOX)pOp&wq~P'WOv-QOP#lyX#lyh#lyj#lyq#lyu#lyx#ly!R#ly!S#ly!V#ly!W#ly!Z#ly!_#ly!j#ly!u#ly!v#ly!w#ly#O#ly#Q#ly#S#ly#U#ly#W#ly#[#ly#^#ly#a#ly#b#ly#d#ly#k#ly#n#ly#r#ly#t#ly#y#ly#|#ly$O#ly%Z#ly%w#ly%x#ly%|#ly%}#ly&c#ly&d#ly&g#ly&j#ly&n#ly&o#ly&p#ly%]#ly%a#ly~O%]-TO%a-TO~P`O#p-UOP#myX#myh#myj#myq#myu#myx#my!R#my!S#my!V#my!W#my!Z#my!_#my!j#my!u#my!v#my!w#my#O#my#Q#my#S#my#U#my#W#my#[#my#^#my#a#my#b#my#d#my#k#my#n#my#r#my#t#my#y#my#|#my$O#my%Z#my%w#my%x#my%|#my%}#my&c#my&d#my&g#my&j#my&n#my&o#my&p#my%]#my%a#my~Oq0VOx0eO}&xq~P'WO|-YO}&xq~O&S,WOi&za|&za~OX*VOc*WO%y*XO%}WOi&ya~O|-^Oi&ya~O$R-bO~OX%YOc%YOq0VOx0eO~P'WOq0VOx0eO}-cO|$ki!Y$ki~P'WOq0VOx0eO|$ki!Y$ki~P'WO}-cO|$ki!Y$ki~Oq0VOx0eO}*iO~P'WOq0VOx0eO}*iO!Y&aq~P'WO|-fO!Y&aq~Oq0VOx0eO|-fO!Y&aq~P'WOu-iO!V%oO!W%nOi&Wq!Y&Wq!^&Wq|&Wq~P!-iOc+SOq0VOx0eO!^&]y~P'WO|$ii!^$ii~P$dOc+SOq0VOx0eO~P'WOX+WOq0VOx0eO~P'WOX+WOq0VOx0eO}&kq!^&kq!n&kq~P'WO}(tO!^-mO!n-nO~OX&bOq0VOx0eO#f%pq%^%pq%a%pq&S%pq~P'WO#_-oO|$za#f$za%^$za%a$zai$za~O%}WO#f&ti%^&ti%a&tii&ti~O|-qO#f&ti%^&ti%a&tii&ti~Ov-tOP#l!RX#l!Rh#l!Rj#l!Rq#l!Ru#l!Rx#l!R!R#l!R!S#l!R!V#l!R!W#l!R!Z#l!R!_#l!R!j#l!R!u#l!R!v#l!R!w#l!R#O#l!R#Q#l!R#S#l!R#U#l!R#W#l!R#[#l!R#^#l!R#a#l!R#b#l!R#d#l!R#k#l!R#n#l!R#r#l!R#t#l!R#y#l!R#|#l!R$O#l!R%Z#l!R%w#l!R%x#l!R%|#l!R%}#l!R&c#l!R&d#l!R&g#l!R&j#l!R&n#l!R&o#l!R&p#l!R%]#l!R%a#l!R~Oq0VOx0eO}&xy~P'WOX*VOc*WO%y*XO%}WOi&yi~O$R-bO%]-zO%a-zO~OX.UOj.SO!Z.RO!_.TO!j-}O!v.PO!w.PO%x-|O%}WO&c]O&d^O&g_O~Oq0VOx0eO|$kq!Y$kq~P'WO}.ZO|$kq!Y$kq~Oq0VOx0eO}*iO!Y&ay~P'WO|.[O!Y&ay~Oq0VOx.`O~P'WOu-iO!V%oO!W%nOi&Wy!Y&Wy!^&Wy|&Wy~P!-iO}(tO!^.cO~O%}WO#f&tq%^&tq%a&tqi&tq~O|.eO#f&tq%^&tq%a&tqi&tq~OX*VOc*WO%y*XO%}WO~Oj.iO!h.gO|$SX#_$SX%r$SXi$SX~Ou$SX}$SX!Y$SX!^$SX~P$!}O%w.kO%x.kOu$TX|$TX}$TX#_$TX%r$TX!Y$TXi$TX!^$TX~O!j.mO~O|.qO#_.sO%r.nOu&|X}&|X!Y&|Xi&|X~Oc.vO~P#M_Oj.iOu&}X|&}X}&}X#_&}X%r&}X!Y&}Xi&}X!^&}X~Ou.zO}$uO~Oq0VOx0eO|$ky!Y$ky~P'WOq0VOx0eO}*iO!Y&a!R~P'WO|/OO!Y&a!R~Oi&ZXu&ZX!V&ZX!W&ZX!Y&ZX!^&ZX|&ZX~P!-iOu-iO!V%oO!W%nOi&Ya!Y&Ya!^&Ya|&Ya~O%}WO#f&ty%^&ty%a&tyi&ty~O!h.gOj$Zau$Za|$Za}$Za#_$Za%r$Za!Y$Zai$Za!^$Za~O!j/XO~O%w.kO%x.kOu$Ta|$Ta}$Ta#_$Ta%r$Ta!Y$Tai$Ta!^$Ta~O%r.nOu$Xa|$Xa}$Xa#_$Xa!Y$Xai$Xa!^$Xa~Ou&|a}&|a!Y&|ai&|a~P#MRO|/^Ou&|a}&|a!Y&|ai&|a~O!Y/aO~Oi/aO~O}/cO~O!^/dO~Oq0VOx0eO}*iO!Y&a!Z~P'WO}/gO~O&S/hO~P$!}O|/iO#_.sO%r.nOi'PX~O|/iOi'PX~Oi/kO~O!j/lO~O#_.sOu%Ua|%Ua}%Ua%r%Ua!Y%Uai%Ua!^%Ua~O#_.sO%r.nOu%Ya|%Ya}%Ya!Y%Yai%Ya~Ou&|i}&|i!Y&|ii&|i~P#MRO|/nO#_.sO%r.nO!^'Oa~O}$ca~P$dOi'Pa~P#MRO|/vOi'Pa~Oc/xO!^'Oi~P#M_O|/zO!^'Oi~O|/zO#_.sO%r.nO!^'Oi~O#_.sO%r.nOi$ai|$ai~O&S/}O~P$!}O#_.sO%r.nOi%Xa|%Xa~Oi'Pi~P#MRO}0QO~Oc/xO!^'Oq~P#M_O|0SO!^'Oq~O#_.sO%r.nO|%Wi!^%Wi~Oc/xO~P#M_Oc/xO!^'Oy~P#M_O#_.sO%r.nOi$bi|$bi~O#_.sO%r.nO|%Wq!^%Wq~O|+dO#f%pa%^%pa%a%pa&S%pa~P$dOX&bOq0VOx0eO~P'WOp0[O~Oq0[O~P'WO}0]O~Ov0^O~P!-iO&d&g&o&p&c&j&n%}&c~",
  goto: "!<w'QPPPPPPPP'RP'Z*s+]+v,b,}-kP.YP'Z.y.y'ZPPP'Z2cPPPPPP2c5VPP5VP7g7p=pPP=s>e>hPP'Z'ZPP?QPP'Z'ZPP'Z'Z'Z'Z'Z?U?{'ZP@OP@UD]GyPG}HZH_HcHg'ZPPPHkHq'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RPHwPIOIUPIOPIOIOPPPIOPKTPK^KdKjKTPIOKpPIOPKwK}PLRLgMUMoLRLRMuNSLRLRLRLRNhNnNqNvNy! T! Z! g! y!!P!!Z!!a!!}!#T!#Z!#a!#k!#q!#w!#}!$T!$Z!$m!$w!$}!%T!%Z!%e!%k!%q!%w!&R!&X!&c!&i!&r!&x!'X!'a!'k!'rPPPPPPPPPPPPPPPPP!'x!'{!(R!([!(f!(qPPPPPPPPPPPP!-e!.y!2s!6TPP!6]!6o!6x!7n!7e!7w!7}!8Q!8T!8W!8`!9PPPPPPPPPP!9S!9cPPPP!:R!:_!:k!:q!:z!:}!;T!;Z!;a!;dP!;l!;u!<q!<t]jOs#u$u)x+|'}eOTYZ[fistuwy}!O!S!T!U!V!Y!]!g!h!i!j!k!l!m!o!s!t!u!w!x#O#S#W#X#b#f#i#l#r#u$W$X$Z$]$`$p$r$s$u$|%Y%_%f%i%k%n%r%w%y&T&`&b&m&q&z&|&}'U'Y']'d'g'v'w'z'|'}(R(W(Y(^(b(g(h(n(q)O)Q)Y)])i)l)p)q)u)x*R*]*f*i*j*m*s*t*v*x*{*|+P+S+W+X+[+d+f+g+n+v+w+|,T,U,X,a,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[.z/O/g0V0W0X0Y0[0]0^0_0`0b0f}!gQ#q$O$a$o${%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z!P!hQ#q$O$a$o${%Q%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z!R!iQ#q$O$a$o${%Q%R%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z!T!jQ#q$O$a$o${%Q%R%S%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z!V!kQ#q$O$a$o${%Q%R%S%T%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z!X!lQ#q$O$a$o${%Q%R%S%T%U%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z!]!lQ!r#q$O$a$o${%Q%R%S%T%U%V%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0Z'}TOTYZ[fistuwy}!O!S!T!U!V!Y!]!g!h!i!j!k!l!m!o!s!t!u!w!x#O#S#W#X#b#f#i#l#r#u$W$X$Z$]$`$p$r$s$u$|%Y%_%f%i%k%n%r%w%y&T&`&b&m&q&z&|&}'U'Y']'d'g'v'w'z'|'}(R(W(Y(^(b(g(h(n(q)O)Q)Y)])i)l)p)q)u)x*R*]*f*i*j*m*s*t*v*x*{*|+P+S+W+X+[+d+f+g+n+v+w+|,T,U,X,a,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[.z/O/g0V0W0X0Y0[0]0^0_0`0b0f&cVOYZ[isuw}!O!S!T!U!Y!m!o!s!t!u!w!x#b#f#i#l#r#u$X$Z$]$`$s$u%Y%_%f%i%k%r%w%y&T&`&m&q&|&}'U']'d'g'v'w'z'|'}(R(Y(b(h(n(q)O)Q)Y)i)l)u)x*R*]*f*i*j*m*s*t*v*x*{*|+P+W+X+[+d+g+n+|,T,U,X,a,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[/O/g0V0W0X0Y0[0]0^0_0b0f%mXOYZ[isw}!O!S!T!U!Y!m!o#b#f#i#l#r#u$X$Z$]$`$s$u%Y%_%i%k%r%w%y&T&`&m&q&|&}'U']'d'g'v'w'z'|'}(R(Y(b(h(n(q)O)Q)Y)i)l)u)x*R*]*f*i*j*m*s*v*x*{*|+P+W+X+[+d+g+n+|,T,U,X,a,b,c,e,f,i,m,o,q,s,t,w-Y-[-c-f.Z.[/O0]0^0_Q$UvQ/P.`R0c0e'teOTYZ[fistuwy}!O!S!T!U!V!Y!]!g!h!i!j!k!l!o!s!t!u!w!x#O#S#W#X#b#f#i#l#r#u$W$X$Z$]$`$p$r$s$u$|%Y%_%f%i%k%n%r%w%y&T&`&b&m&q&z&|&}'U'Y']'d'g'v'z'|'}(R(W(Y(^(b(g(h(n(q)O)Q)Y)])i)l)p)q)u)x*R*]*i*j*m*s*t*v*x*{*|+P+S+W+X+[+d+f+g+n+v+w+|,T,U,X,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[.z/O/g0V0W0X0Y0[0]0^0_0`0b0fW#xm!P!Q$gW$Qv&o.`0eQ$i!RQ$y!ZQ$z![W%X!m'w*f,aS&n$R$SQ'`$tQ)R&hQ)a'OU)b'Q)c)dU)e'S)f+mQ*T'iW*U'k,[-^-xS,Z*V*WY,y+h,z-p-q.eQ,|+jQ-V,QQ-X,Sl-{-b.R.S.U.o.q.v/^/c/h/m/x/}0QQ.d-oQ.w.TQ/T.iQ/`.sU/s/i/v0OX/y/n/z0R0SR&m$Q!_!{YZ!T!U!o%_%k%r'z'|'}(Y(b)l*i*j*m*s*v*x,b,c,e,f,i-c-f.Z.[/OR%i!zQ#PYQ&U#bQ&X#fQ&Z#iQ&]#lQ&v$]Q&y$`R,u+[T._-i/g![!nQ!r#q$O$a$o${%Q%R%S%T%U%V%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0ZQ&k#yR'n$zR'v%XQ%b!qR/R.g'|dOTYZ[fistuwy}!O!S!T!U!V!Y!]!g!h!i!j!k!l!m!o!s!t!u!w!x#O#S#W#X#b#f#i#l#r#u$W$X$Z$]$`$p$r$s$u$|%Y%_%f%i%k%n%r%w%y&T&`&b&m&q&z&|&}'U'Y']'d'g'v'w'z'|'}(R(W(Y(^(b(g(h(n(q)O)Q)Y)])i)l)p)q)u)x*R*]*f*i*j*m*s*t*v*x*{*|+P+S+W+X+[+d+f+g+n+v+w+|,T,U,X,a,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[.z/O/g0V0W0X0Y0[0]0^0_0`0b0fS#od#p!P.P-b.R.S.T.U.i.o.q.v/^/c/h/i/m/n/v/x/z/}0O0Q0R0S'|dOTYZ[fistuwy}!O!S!T!U!V!Y!]!g!h!i!j!k!l!m!o!s!t!u!w!x#O#S#W#X#b#f#i#l#r#u$W$X$Z$]$`$p$r$s$u$|%Y%_%f%i%k%n%r%w%y&T&`&b&m&q&z&|&}'U'Y']'d'g'v'w'z'|'}(R(W(Y(^(b(g(h(n(q)O)Q)Y)])i)l)p)q)u)x*R*]*f*i*j*m*s*t*v*x*{*|+P+S+W+X+[+d+f+g+n+v+w+|,T,U,X,a,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[.z/O/g0V0W0X0Y0[0]0^0_0`0b0fT#od#pT#c`#de(u&U&X&Z&](w(y({(},u-nT+](t+^T#ga#hT#jb#kT#mc#nQ$_xR,Y*UX$]x$^$_&xZlOs$u)x+|XpOs)x+|Q$v!XQ'W$mQ'X$nQ'j$xQ'm$zQ)v'_Q)|'dQ*O'eQ*P'fQ*^'lQ*`'nQ+q)lQ+s)mQ+t)nQ+x)tS+z)w*_Q+})zQ,O){Q,P)}Q-O+pQ-P+rQ-R+yQ-S+{Q-W,RQ-s-QQ-u-UQ-v-VQ.f-tQ.{.XR/f.|WpOs)x+|R#{oQ'l$yR)w'`Q,X*UR-[,YQ*_'lR+{)wZnOos)x+|Q'p${R*b'qT-`,`-au.W-b.R.S.U.i.o.q.v/^/c/h/i/m/v/x/}0O0Qt.W-b.R.S.U.i.o.q.v/^/c/h/i/m/v/x/}0O0QQ.w.TX/y/n/z0R0S!P.O-b.R.S.T.U.i.o.q.v/^/c/h/i/m/n/v/x/z/}0O0Q0R0SQ.l-}R/Y.mg.o.Q.p/U/]/b/p/r/t0P0T0Uu.V-b.R.S.U.i.o.q.v/^/c/h/i/m/v/x/}0O0QX.j-{.V/T/sR/V.iV/u/i/v0OR.|.XQsOS#}s+|R+|)xQ&p$TR)W&pS%x#V$VS(i%x(lT(l%{&rQ%l!}Q%s#RW(Z%l%s(`(dQ(`%pR(d%uQ&{$aR)^&{Q(o%|Q*}(jT+T(o*}Q'x%ZR*g'xS'{%^%_Y*k'{*l,g-g.]U*l'|'}(OU,g*m*n*oS-g,h,iR.]-hQ#^^R&P#^Q#a_R&R#aQ#d`R&V#dQ(r&SS+Y(r+ZR+Z(sQ+^(tR,v+^Q#haR&Y#hQ#kbR&[#kQ#ncR&^#nQ#pdR&_#pQ#sgQ&a#qW&d#s&a)Z+eQ)Z&uR+e0ZQ$^xS&w$^&xR&x$_Q'V$kR)j'VQ&i#xR)S&iQ$g!QR'P$gQ+i)bS,{+i-rR-r,|Q'T$iR)g'TQ#vkR&f#vQ)k'WR+o)kQ'Z$oS)r'Z)sR)s'[Q'c$vR)y'cQ'h$wS*S'h,VR,V*TQ,]*YR-_,]WoOs)x+|R#zoQ-a,`R-y-ad.p.Q/U/]/b/p/r/t0P0T0UR/[.pU.h-{/T/sR/S.hQ/o/bS/{/o/|R/|/pS/j/U/VR/w/jQ.r.QR/_.rR!_PXrOs)x+|WqOs)x+|R'a$uYkOs$u)x+|R&e#u[xOs#u$u)x+|R&v$]&bQOYZ[isuw}!O!S!T!U!Y!m!o!s!t!u!w!x#b#f#i#l#r#u$X$Z$]$`$s$u%Y%_%f%i%k%r%w%y&T&`&m&q&|&}'U']'d'g'v'w'z'|'}(R(Y(b(h(n(q)O)Q)Y)i)l)u)x*R*]*f*i*j*m*s*t*v*x*{*|+P+W+X+[+d+g+n+|,T,U,X,a,b,c,e,f,i,k,m,o,q,s,t,w-Y-[-c-f-i.Z.[/O/g0V0W0X0Y0[0]0^0_0b0fQ!rTQ#qfQ$OtU$ay%n(^S$o!V$rQ${!]Q%Q!gQ%R!hQ%S!iQ%T!jQ%U!kQ%V!lQ%p#OQ%u#SQ%{#WQ%|#XQ&r$WQ'[$pQ'q$|Q)P&bU)[&z)]+fW)o'Y)q+v+wQ*q(WQ*z(gQ+u)pQ,p+SQ/e.zR0Z0`Q!}YQ#RZQ$m!TQ$n!UQ%^!oQ(O%_^(V%k%r(Y(b*s*v*x^*h'z*j,e,f-f.[/OQ*n'|Q*o'}Q+r)lQ,d*iQ,h*mQ-d,bQ-e,cQ-h,iQ.Y-cR.}.Z[gOs#u$u)x+|!^!zYZ!T!U!o%_%k%r'z'|'}(Y(b)l*i*j*m*s*v*x,b,c,e,f,i-c-f.Z.[/OQ#V[Q#tiS$Vw}Q$d!OW$k!S$`'])uS$w!Y$sW%W!m'w*f,aY&S#b#f#i#l+[`&c#r&`)O)Q)Y+d,w0_Q&s$XQ&t$ZQ&u$]Q't%YQ(U%iW(f%w(h*{+PQ(j%yQ(s&TQ)U&mS)X&q0]Q)_&|Q)`&}U)h'U)i+nQ)}'dY*Q'g*R,T,U-YQ*d'vS*p(R0^W+R(n*|,m,qW+V(q+X,s,tQ,_*]Q,r+WQ,x+gQ-Z,XQ-l,oR-w-[hUOs#r#u$u&`&q(R)O)Q)x+|%S!yYZ[iw}!O!S!T!U!Y!m!o#b#f#i#l$X$Z$]$`$s%Y%_%i%k%r%w%y&T&m&|&}'U']'d'g'v'w'z'|'}(Y(b(h(n(q)Y)i)l)u*R*]*f*i*j*m*s*v*x*{*|+P+W+X+[+d+g+n,T,U,X,a,b,c,e,f,i,m,o,q,s,t,w-Y-[-c-f.Z.[/O0]0^0_Q$PuW%c!s!w0W0bQ%d!tQ%e!uQ%g!xQ%q0VS(Q%f0[Q(S0XQ(T0YQ,j*tQ-k,kS.^-i/gR0d0fU$Tv.`0eR)V&o[hOs#u$u)x+|a!|Y#b#f#i#l$]$`+[Q#[[Q$YwR$c}Q%m!}Q%t#RQ%z#VQ't%WQ(a%pQ(e%uQ(m%{Q(p%|Q+O(jQ-j,jQ.b-kR/Q.aQ$byQ(]%nR*u(^Q.a-iR/q/gR#UZR#Z[R%]!mQ%Z!mV*e'w*f,a!]!pQ!r#q$O$a$o${%Q%R%S%T%U%V%p%u%{%|&r'['q)P)[)o*q*z+u,p/e0ZR%`!oQ&U#bQ&X#fQ&Z#iQ&]#lR,u+[Q(v&UQ(x&XQ(z&ZQ(|&]Q+`(wQ+a(yQ+b({Q+c(}Q-m,uR.c-nQ$l!SQ&y$`Q)t']R+y)uQ#ymQ$e!PQ$h!QR'R$gQ)a'QR+l)dQ)a'QQ+k)cR+l)dR$j!RXqOs)x+|Q$q!VR'^$rQ$x!YR'_$sR*['kQ*Y'kV-],[-^-xQ.X-bQ.t.RR.u.SU.Q-b.R.SQ.y.UQ/U.iQ/Z.oU/].q/^/mQ/b.vQ/p/cQ/r/hU/t/i/v0OQ0P/xQ0T/}R0U0QR.x.TR/W.i",
  nodeNames: "⚠ print { { { { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatConversion FormatSpec FormatReplacement FormatReplacement FormatReplacement FormatReplacement ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
  maxTerm: 277,
  context: trackIndent,
  nodeProps: [
    ["group", -14,8,88,90,91,93,95,97,99,101,102,103,105,108,111,"Statement Statement",-22,10,20,23,27,42,51,52,58,59,62,63,64,65,66,69,72,73,74,82,83,84,85,"Expression",-10,113,115,118,120,121,125,127,132,134,137,"Statement",-9,142,143,146,147,149,150,151,152,153,"Pattern"],
    ["openedBy", 25,"(",56,"[",60,"{"],
    ["closedBy", 26,")",57,"]",61,"}"]
  ],
  propSources: [pythonHighlighting],
  skippedNodes: [0,6],
  repeatNodeCount: 37,
  tokenData: "%-W#sR!`OX%TXY=|Y[%T[]=|]p%Tpq=|qr@_rsDOst!+|tu%Tuv!Nnvw#!|wx#$Wxy#:Uyz#;Yz{#<^{|#>x|}#@S}!O#AW!O!P#Ci!P!Q#N_!Q!R$!y!R![$&w![!]$1e!]!^$3s!^!_$4w!_!`$7c!`!a$8m!a!b%T!b!c$;U!c!d$<b!d!e$>W!e!h$<b!h!i$H[!i!t$<b!t!u%#r!u!w$<b!w!x$Fl!x!}$<b!}#O%%z#O#P?d#P#Q%'O#Q#R%(S#R#S$<b#S#T%T#T#U$<b#U#V$>W#V#Y$<b#Y#Z$H[#Z#f$<b#f#g%#r#g#i$<b#i#j$Fl#j#o$<b#o#p%)^#p#q%*S#q#r%+^#r#s%,S#s$g%T$g;'S$<b;'S;=`$>Q<%lO$<b!n%^]&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!n&^]&m!b&eSOr%Trs'Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!n'^]&m!b&eSOr%Trs(Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!f(^Z&m!b&eSOw(Vwx)Px#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V!f)UZ&m!bOw(Vwx)wx#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V!f)|Z&m!bOw(Vwx*ox#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V!b*tT&m!bO#o*o#p#q*o#r;'S*o;'S;=`+T<%lO*o!b+WP;=`<%l*o!f+`W&m!bO#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`.d;=`<%l+x<%lO(VS+}V&eSOw+xwx,dx#O+x#O#P-c#P;'S+x;'S;=`.^<%lO+xS,gVOw+xwx,|x#O+x#O#P-c#P;'S+x;'S;=`.^<%lO+xS-PUOw+xx#O+x#O#P-c#P;'S+x;'S;=`.^<%lO+xS-fRO;'S+x;'S;=`-o;=`O+xS-tW&eSOw+xwx,dx#O+x#O#P-c#P;'S+x;'S;=`.^;=`<%l+x<%lO+xS.aP;=`<%l+x!f.iW&eSOw+xwx,dx#O+x#O#P-c#P;'S+x;'S;=`.^;=`<%l(V<%lO+x!f/UP;=`<%l(V!n/`]&m!b&hWOr%Trs&Vsw%Twx0Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!n0`]&m!b&hWOr%Trs&Vsw%Twx1Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!j1`Z&m!b&hWOr1Xrs2Rs#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X!j2WZ&m!bOr1Xrs2ys#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X!j3OZ&m!bOr1Xrs*os#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X!j3vW&m!bO#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`6z;=`<%l4`<%lO1XW4eV&hWOr4`rs4zs#O4`#O#P5y#P;'S4`;'S;=`6t<%lO4`W4}VOr4`rs5ds#O4`#O#P5y#P;'S4`;'S;=`6t<%lO4`W5gUOr4`s#O4`#O#P5y#P;'S4`;'S;=`6t<%lO4`W5|RO;'S4`;'S;=`6V;=`O4`W6[W&hWOr4`rs4zs#O4`#O#P5y#P;'S4`;'S;=`6t;=`<%l4`<%lO4`W6wP;=`<%l4`!j7PW&hWOr4`rs4zs#O4`#O#P5y#P;'S4`;'S;=`6t;=`<%l1X<%lO4`!j7lP;=`<%l1X!n7tW&m!bO#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=P;=`<%l8^<%lO%T[8eX&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^[9VX&eSOr8^rs9rsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^[9wX&eSOr8^rs+xsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^[:iX&hWOr8^rs9Qsw8^wx;Ux#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^[;ZX&hWOr8^rs9Qsw8^wx4`x#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^[;yRO;'S8^;'S;=`<S;=`O8^[<ZY&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y;=`<%l8^<%lO8^[<|P;=`<%l8^!n=WY&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y;=`<%l%T<%lO8^!n=yP;=`<%l%T#s>Xc&m!b&eS&hW%k!TOX%TXY=|Y[%T[]=|]p%Tpq=|qr%Trs&Vsw%Twx/Xx#O%T#O#P?d#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#s?i[&m!bOY%TYZ=|Z]%T]^=|^#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=P;=`<%l8^<%lO%T!q@hd&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`Av!`#O%T#O#P7o#P#T%T#T#UBz#U#f%T#f#gBz#g#hBz#h#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!qBR]oR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!qCV]!nR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#cDXa&m!b&eS&csOYE^YZ%TZ]E^]^%T^rE^rs!)|swE^wxGpx#OE^#O#P!!u#P#oE^#o#p!#d#p#qE^#q#r!#d#r;'SE^;'S;=`!)v<%lOE^#cEia&m!b&eS&hW&csOYE^YZ%TZ]E^]^%T^rE^rsFnswE^wxGpx#OE^#O#P!!u#P#oE^#o#p!#d#p#qE^#q#r!#d#r;'SE^;'S;=`!)v<%lOE^#cFw]&m!b&eS&csOr%Trs'Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#cGya&m!b&hW&csOYE^YZ%TZ]E^]^%T^rE^rsFnswE^wxIOx#OE^#O#P!!u#P#oE^#o#p!#d#p#qE^#q#r!#d#r;'SE^;'S;=`!)v<%lOE^#cIXa&m!b&hW&csOYE^YZ%TZ]E^]^%T^rE^rsFnswE^wxJ^x#OE^#O#P!!u#P#oE^#o#p!#d#p#qE^#q#r!#d#r;'SE^;'S;=`!)v<%lOE^#_Jg_&m!b&hW&csOYJ^YZ1XZ]J^]^1X^rJ^rsKfs#OJ^#O#PL`#P#oJ^#o#pL}#p#qJ^#q#rL}#r;'SJ^;'S;=`!!o<%lOJ^#_KmZ&m!b&csOr1Xrs2ys#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X#_LeW&m!bO#oJ^#o#pL}#p#qJ^#q#rL}#r;'SJ^;'S;=`! r;=`<%lL}<%lOJ^{MUZ&hW&csOYL}YZ4`Z]L}]^4`^rL}rsMws#OL}#O#PNc#P;'SL};'S;=`! l<%lOL}{M|V&csOr4`rs5ds#O4`#O#P5y#P;'S4`;'S;=`6t<%lO4`{NfRO;'SL};'S;=`No;=`OL}{Nv[&hW&csOYL}YZ4`Z]L}]^4`^rL}rsMws#OL}#O#PNc#P;'SL};'S;=`! l;=`<%lL}<%lOL}{! oP;=`<%lL}#_! y[&hW&csOYL}YZ4`Z]L}]^4`^rL}rsMws#OL}#O#PNc#P;'SL};'S;=`! l;=`<%lJ^<%lOL}#_!!rP;=`<%lJ^#c!!zW&m!bO#oE^#o#p!#d#p#qE^#q#r!#d#r;'SE^;'S;=`!(q;=`<%l!#d<%lOE^!P!#m]&eS&hW&csOY!#dYZ8^Z]!#d]^8^^r!#drs!$fsw!#dwx!%Yx#O!#d#O#P!'Y#P;'S!#d;'S;=`!(k<%lO!#d!P!$mX&eS&csOr8^rs9rsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^!P!%a]&hW&csOY!#dYZ8^Z]!#d]^8^^r!#drs!$fsw!#dwx!&Yx#O!#d#O#P!'Y#P;'S!#d;'S;=`!(k<%lO!#d!P!&a]&hW&csOY!#dYZ8^Z]!#d]^8^^r!#drs!$fsw!#dwxL}x#O!#d#O#P!'Y#P;'S!#d;'S;=`!(k<%lO!#d!P!']RO;'S!#d;'S;=`!'f;=`O!#d!P!'o^&eS&hW&csOY!#dYZ8^Z]!#d]^8^^r!#drs!$fsw!#dwx!%Yx#O!#d#O#P!'Y#P;'S!#d;'S;=`!(k;=`<%l!#d<%lO!#d!P!(nP;=`<%l!#d#c!(z^&eS&hW&csOY!#dYZ8^Z]!#d]^8^^r!#drs!$fsw!#dwx!%Yx#O!#d#O#P!'Y#P;'S!#d;'S;=`!(k;=`<%lE^<%lO!#d#c!)yP;=`<%lE^#c!*V]&m!b&eS&csOr%Trs!+Osw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c!+ZZ&iW&m!b&eS&gsOw(Vwx)Px#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V#s!,XaU!T&m!b&eS&hWOY!+|YZ%TZ]!+|]^%T^r!+|rs!-^sw!+|wx!:hx#O!+|#O#P!FW#P#o!+|#o#p!GT#p#q!+|#q#r!GT#r;'S!+|;'S;=`!Nh<%lO!+|#s!-gaU!T&m!b&eSOY!+|YZ%TZ]!+|]^%T^r!+|rs!.lsw!+|wx!:hx#O!+|#O#P!FW#P#o!+|#o#p!GT#p#q!+|#q#r!GT#r;'S!+|;'S;=`!Nh<%lO!+|#s!.uaU!T&m!b&eSOY!+|YZ%TZ]!+|]^%T^r!+|rs!/zsw!+|wx!:hx#O!+|#O#P!FW#P#o!+|#o#p!GT#p#q!+|#q#r!GT#r;'S!+|;'S;=`!Nh<%lO!+|#k!0T_U!T&m!b&eSOY!/zYZ(VZ]!/z]^(V^w!/zwx!1Sx#O!/z#O#P!4z#P#o!/z#o#p!5w#p#q!/z#q#r!5w#r;'S!/z;'S;=`!:b<%lO!/z#k!1Z_U!T&m!bOY!/zYZ(VZ]!/z]^(V^w!/zwx!2Yx#O!/z#O#P!4z#P#o!/z#o#p!5w#p#q!/z#q#r!5w#r;'S!/z;'S;=`!:b<%lO!/z#k!2a_U!T&m!bOY!/zYZ(VZ]!/z]^(V^w!/zwx!3`x#O!/z#O#P!4z#P#o!/z#o#p!5w#p#q!/z#q#r!5w#r;'S!/z;'S;=`!:b<%lO!/z#g!3gZU!T&m!bOY!3`YZ*oZ]!3`]^*o^#o!3`#o#p!4Y#p#q!3`#q#r!4Y#r;'S!3`;'S;=`!4t<%lO!3`!T!4_TU!TOY!4YZ]!4Y^;'S!4Y;'S;=`!4n<%lO!4Y!T!4qP;=`<%l!4Y#g!4wP;=`<%l!3`#k!5R[U!T&m!bOY!/zYZ(VZ]!/z]^(V^#o!/z#o#p!5w#p#q!/z#q#r!5w#r;'S!/z;'S;=`!9s;=`<%l+x<%lO!/z!X!6OZU!T&eSOY!5wYZ+xZ]!5w]^+x^w!5wwx!6qx#O!5w#O#P!8a#P;'S!5w;'S;=`!9m<%lO!5w!X!6vZU!TOY!5wYZ+xZ]!5w]^+x^w!5wwx!7ix#O!5w#O#P!8a#P;'S!5w;'S;=`!9m<%lO!5w!X!7nZU!TOY!5wYZ+xZ]!5w]^+x^w!5wwx!4Yx#O!5w#O#P!8a#P;'S!5w;'S;=`!9m<%lO!5w!X!8fWU!TOY!5wYZ+xZ]!5w]^+x^;'S!5w;'S;=`!9O;=`<%l+x<%lO!5w!X!9TW&eSOw+xwx,dx#O+x#O#P-c#P;'S+x;'S;=`.^;=`<%l!5w<%lO+x!X!9pP;=`<%l!5w#k!9xW&eSOw+xwx,dx#O+x#O#P-c#P;'S+x;'S;=`.^;=`<%l!/z<%lO+x#k!:eP;=`<%l!/z#s!:qaU!T&m!b&hWOY!+|YZ%TZ]!+|]^%T^r!+|rs!-^sw!+|wx!;vx#O!+|#O#P!FW#P#o!+|#o#p!GT#p#q!+|#q#r!GT#r;'S!+|;'S;=`!Nh<%lO!+|#s!<PaU!T&m!b&hWOY!+|YZ%TZ]!+|]^%T^r!+|rs!-^sw!+|wx!=Ux#O!+|#O#P!FW#P#o!+|#o#p!GT#p#q!+|#q#r!GT#r;'S!+|;'S;=`!Nh<%lO!+|#o!=__U!T&m!b&hWOY!=UYZ1XZ]!=U]^1X^r!=Urs!>^s#O!=U#O#P!@j#P#o!=U#o#p!Ag#p#q!=U#q#r!Ag#r;'S!=U;'S;=`!FQ<%lO!=U#o!>e_U!T&m!bOY!=UYZ1XZ]!=U]^1X^r!=Urs!?ds#O!=U#O#P!@j#P#o!=U#o#p!Ag#p#q!=U#q#r!Ag#r;'S!=U;'S;=`!FQ<%lO!=U#o!?k_U!T&m!bOY!=UYZ1XZ]!=U]^1X^r!=Urs!3`s#O!=U#O#P!@j#P#o!=U#o#p!Ag#p#q!=U#q#r!Ag#r;'S!=U;'S;=`!FQ<%lO!=U#o!@q[U!T&m!bOY!=UYZ1XZ]!=U]^1X^#o!=U#o#p!Ag#p#q!=U#q#r!Ag#r;'S!=U;'S;=`!Ec;=`<%l4`<%lO!=U!]!AnZU!T&hWOY!AgYZ4`Z]!Ag]^4`^r!Agrs!Bas#O!Ag#O#P!DP#P;'S!Ag;'S;=`!E]<%lO!Ag!]!BfZU!TOY!AgYZ4`Z]!Ag]^4`^r!Agrs!CXs#O!Ag#O#P!DP#P;'S!Ag;'S;=`!E]<%lO!Ag!]!C^ZU!TOY!AgYZ4`Z]!Ag]^4`^r!Agrs!4Ys#O!Ag#O#P!DP#P;'S!Ag;'S;=`!E]<%lO!Ag!]!DUWU!TOY!AgYZ4`Z]!Ag]^4`^;'S!Ag;'S;=`!Dn;=`<%l4`<%lO!Ag!]!DsW&hWOr4`rs4zs#O4`#O#P5y#P;'S4`;'S;=`6t;=`<%l!Ag<%lO4`!]!E`P;=`<%l!Ag#o!EhW&hWOr4`rs4zs#O4`#O#P5y#P;'S4`;'S;=`6t;=`<%l!=U<%lO4`#o!FTP;=`<%l!=U#s!F_[U!T&m!bOY!+|YZ%TZ]!+|]^%T^#o!+|#o#p!GT#p#q!+|#q#r!GT#r;'S!+|;'S;=`!Mq;=`<%l8^<%lO!+|!a!G^]U!T&eS&hWOY!GTYZ8^Z]!GT]^8^^r!GTrs!HVsw!GTwx!JVx#O!GT#O#P!LV#P;'S!GT;'S;=`!Mk<%lO!GT!a!H^]U!T&eSOY!GTYZ8^Z]!GT]^8^^r!GTrs!IVsw!GTwx!JVx#O!GT#O#P!LV#P;'S!GT;'S;=`!Mk<%lO!GT!a!I^]U!T&eSOY!GTYZ8^Z]!GT]^8^^r!GTrs!5wsw!GTwx!JVx#O!GT#O#P!LV#P;'S!GT;'S;=`!Mk<%lO!GT!a!J^]U!T&hWOY!GTYZ8^Z]!GT]^8^^r!GTrs!HVsw!GTwx!KVx#O!GT#O#P!LV#P;'S!GT;'S;=`!Mk<%lO!GT!a!K^]U!T&hWOY!GTYZ8^Z]!GT]^8^^r!GTrs!HVsw!GTwx!Agx#O!GT#O#P!LV#P;'S!GT;'S;=`!Mk<%lO!GT!a!L[WU!TOY!GTYZ8^Z]!GT]^8^^;'S!GT;'S;=`!Lt;=`<%l8^<%lO!GT!a!L{Y&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y;=`<%l!GT<%lO8^!a!MnP;=`<%l!GT#s!MxY&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y;=`<%l!+|<%lO8^#s!NkP;=`<%l!+|#b!Ny_%zQ&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#b#!T]!{r&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#b##X_%tQ&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#$aa&m!b&hW&csOY#%fYZ%TZ]#%f]^%T^r#%frs#&vsw#%fwx#8Ux#O#%f#O#P#0}#P#o#%f#o#p#1l#p#q#%f#q#r#1l#r;'S#%f;'S;=`#8O<%lO#%f#c#%qa&m!b&eS&hW&csOY#%fYZ%TZ]#%f]^%T^r#%frs#&vsw#%fwx#/{x#O#%f#O#P#0}#P#o#%f#o#p#1l#p#q#%f#q#r#1l#r;'S#%f;'S;=`#8O<%lO#%f#c#'Pa&m!b&eS&csOY#%fYZ%TZ]#%f]^%T^r#%frs#(Usw#%fwx#/{x#O#%f#O#P#0}#P#o#%f#o#p#1l#p#q#%f#q#r#1l#r;'S#%f;'S;=`#8O<%lO#%f#c#(_a&m!b&eS&csOY#%fYZ%TZ]#%f]^%T^r#%frs#)dsw#%fwx#/{x#O#%f#O#P#0}#P#o#%f#o#p#1l#p#q#%f#q#r#1l#r;'S#%f;'S;=`#8O<%lO#%f#Z#)m_&m!b&eS&csOY#)dYZ(VZ]#)d]^(V^w#)dwx#*lx#O#)d#O#P#+f#P#o#)d#o#p#,T#p#q#)d#q#r#,T#r;'S#)d;'S;=`#/u<%lO#)d#Z#*sZ&m!b&csOw(Vwx)wx#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V#Z#+kW&m!bO#o#)d#o#p#,T#p#q#)d#q#r#,T#r;'S#)d;'S;=`#.x;=`<%l#,T<%lO#)dw#,[Z&eS&csOY#,TYZ+xZ]#,T]^+x^w#,Twx#,}x#O#,T#O#P#-i#P;'S#,T;'S;=`#.r<%lO#,Tw#-SV&csOw+xwx,|x#O+x#O#P-c#P;'S+x;'S;=`.^<%lO+xw#-lRO;'S#,T;'S;=`#-u;=`O#,Tw#-|[&eS&csOY#,TYZ+xZ]#,T]^+x^w#,Twx#,}x#O#,T#O#P#-i#P;'S#,T;'S;=`#.r;=`<%l#,T<%lO#,Tw#.uP;=`<%l#,T#Z#/P[&eS&csOY#,TYZ+xZ]#,T]^+x^w#,Twx#,}x#O#,T#O#P#-i#P;'S#,T;'S;=`#.r;=`<%l#)d<%lO#,T#Z#/xP;=`<%l#)d#c#0U]&m!b&hW&csOr%Trs&Vsw%Twx0Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#1SW&m!bO#o#%f#o#p#1l#p#q#%f#q#r#1l#r;'S#%f;'S;=`#6y;=`<%l#1l<%lO#%f!P#1u]&eS&hW&csOY#1lYZ8^Z]#1l]^8^^r#1lrs#2nsw#1lwx#4nx#O#1l#O#P#5b#P;'S#1l;'S;=`#6s<%lO#1l!P#2u]&eS&csOY#1lYZ8^Z]#1l]^8^^r#1lrs#3nsw#1lwx#4nx#O#1l#O#P#5b#P;'S#1l;'S;=`#6s<%lO#1l!P#3u]&eS&csOY#1lYZ8^Z]#1l]^8^^r#1lrs#,Tsw#1lwx#4nx#O#1l#O#P#5b#P;'S#1l;'S;=`#6s<%lO#1l!P#4uX&hW&csOr8^rs9Qsw8^wx;Ux#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^!P#5eRO;'S#1l;'S;=`#5n;=`O#1l!P#5w^&eS&hW&csOY#1lYZ8^Z]#1l]^8^^r#1lrs#2nsw#1lwx#4nx#O#1l#O#P#5b#P;'S#1l;'S;=`#6s;=`<%l#1l<%lO#1l!P#6vP;=`<%l#1l#c#7S^&eS&hW&csOY#1lYZ8^Z]#1l]^8^^r#1lrs#2nsw#1lwx#4nx#O#1l#O#P#5b#P;'S#1l;'S;=`#6s;=`<%l#%f<%lO#1l#c#8RP;=`<%l#%f#c#8_]&m!b&hW&csOr%Trs&Vsw%Twx#9Wx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#9cZ&fS&m!b&hW&dsOr1Xrs2Rs#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X#c#:a]js&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!q#;e]iR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#<iaXs&m!b&eS&hWOr%Trs&Vsw%Twx/Xxz%Tz{#=n{!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#=y_cR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#?T_%ws&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!q#@_]|R&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#s#Ac`%xs&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`!a#Be!a#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#O#Bp]&{`&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#Cta!hQ&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!O%T!O!P#Dy!P!Q%T!Q![#GV![#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#ES_&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!O%T!O!P#FR!P#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#F^]!us&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a#Gbi!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q![#GV![!g%T!g!h#IP!h!l%T!l!m#MZ!m#O%T#O#P7o#P#R%T#R#S#GV#S#X%T#X#Y#IP#Y#^%T#^#_#MZ#_#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a#IYc&m!b&eS&hWOr%Trs&Vsw%Twx/Xx{%T{|#Je|}%T}!O#Je!O!Q%T!Q![#Km![#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a#Jn_&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q![#Km![#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a#Kxe!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q![#Km![!l%T!l!m#MZ!m#O%T#O#P7o#P#R%T#R#S#Km#S#^%T#^#_#MZ#_#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a#Mf]!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c#Nja%yR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!P%T!P!Q$ o!Q!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#b$ z_%{Q&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$#Uw!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!O%T!O!P$%o!P!Q%T!Q![$&w![!d%T!d!e$(w!e!g%T!g!h#IP!h!l%T!l!m#MZ!m!q%T!q!r$+m!r!z%T!z!{$.]!{#O%T#O#P7o#P#R%T#R#S$&w#S#U%T#U#V$(w#V#X%T#X#Y#IP#Y#^%T#^#_#MZ#_#c%T#c#d$+m#d#l%T#l#m$.]#m#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$%x_&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q![#GV![#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$'Sk!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!O%T!O!P$%o!P!Q%T!Q![$&w![!g%T!g!h#IP!h!l%T!l!m#MZ!m#O%T#O#P7o#P#R%T#R#S$&w#S#X%T#X#Y#IP#Y#^%T#^#_#MZ#_#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$)Qb&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q!R$*Y!R!S$*Y!S#O%T#O#P7o#P#R%T#R#S$*Y#S#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$*eb!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q!R$*Y!R!S$*Y!S#O%T#O#P7o#P#R%T#R#S$*Y#S#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$+va&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q!Y$,{!Y#O%T#O#P7o#P#R%T#R#S$,{#S#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$-Wa!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q!Y$,{!Y#O%T#O#P7o#P#R%T#R#S$,{#S#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$.fe&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q![$/w![!c%T!c!i$/w!i#O%T#O#P7o#P#R%T#R#S$/w#S#T%T#T#Z$/w#Z#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a$0Se!jq&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!Q%T!Q![$/w![!c%T!c!i$/w!i#O%T#O#P7o#P#R%T#R#S$/w#S#T%T#T#Z$/w#Z#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#s$1p_}!T&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`$2o!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!q$2z]&TR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$4O]#fs&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$5SaoR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!^%T!^!_$6X!_!`Av!`!aAv!a#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#b$6d_%uQ&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$7n_&Ss&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`Av!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$8x`oR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`Av!`!a$9z!a#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#b$:V_%vQ&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$;c_aQ#|P&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#s$<oe&m!b&eS&hW&b`%}sOr%Trs&Vsw%Twx/Xx!Q%T!Q![$<b![!c%T!c!}$<b!}#O%T#O#P7o#P#R%T#R#S$<b#S#T%T#T#o$<b#o#p8^#p#q%T#q#r8^#r$g%T$g;'S$<b;'S;=`$>Q<%lO$<b#s$>TP;=`<%l$<b#s$>ei&m!b&eS&hW&b`%}sOr%Trs$@Ssw%Twx$C`x!Q%T!Q![$<b![!c%T!c!t$<b!t!u$Fl!u!}$<b!}#O%T#O#P7o#P#R%T#R#S$<b#S#T%T#T#f$<b#f#g$Fl#g#o$<b#o#p8^#p#q%T#q#r8^#r$g%T$g;'S$<b;'S;=`$>Q<%lO$<b#c$@]a&m!b&eS&csOYE^YZ%TZ]E^]^%T^rE^rs$AbswE^wxGpx#OE^#O#P!!u#P#oE^#o#p!#d#p#qE^#q#r!#d#r;'SE^;'S;=`!)v<%lOE^#c$Ak]&m!b&eS&csOr%Trs$Bdsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#Z$BmZ&m!b&eS&gsOw(Vwx)Px#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V#c$Cia&m!b&hW&csOY#%fYZ%TZ]#%f]^%T^r#%frs#&vsw#%fwx$Dnx#O#%f#O#P#0}#P#o#%f#o#p#1l#p#q#%f#q#r#1l#r;'S#%f;'S;=`#8O<%lO#%f#c$Dw]&m!b&hW&csOr%Trs&Vsw%Twx$Epx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#_$EyZ&m!b&hW&dsOr1Xrs2Rs#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X#s$Fye&m!b&eS&hW&b`%}sOr%Trs$@Ssw%Twx$C`x!Q%T!Q![$<b![!c%T!c!}$<b!}#O%T#O#P7o#P#R%T#R#S$<b#S#T%T#T#o$<b#o#p8^#p#q%T#q#r8^#r$g%T$g;'S$<b;'S;=`$>Q<%lO$<b#s$Hii&m!b&eS&hW&b`%}sOr%Trs$JWsw%Twx$MUx!Q%T!Q![$<b![!c%T!c!t$<b!t!u%!S!u!}$<b!}#O%T#O#P7o#P#R%T#R#S$<b#S#T%T#T#f$<b#f#g%!S#g#o$<b#o#p8^#p#q%T#q#r8^#r$g%T$g;'S$<b;'S;=`$>Q<%lO$<b#c$Ja]&m!b&eS&nsOr%Trs$KYsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$Ka]&m!b&eSOr%Trs$LYsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#Z$LcZ&m!b&eS&psOw(Vwx)Px#O(V#O#P+Z#P#o(V#o#p+x#p#q(V#q#r+x#r;'S(V;'S;=`/R<%lO(V#c$M_]&m!b&hW&jsOr%Trs&Vsw%Twx$NWx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#c$N_]&m!b&hWOr%Trs&Vsw%Twx% Wx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#_% aZ&m!b&hW&osOr1Xrs2Rs#O1X#O#P3q#P#o1X#o#p4`#p#q1X#q#r4`#r;'S1X;'S;=`7i<%lO1X#s%!ae&m!b&eS&hW&b`%}sOr%Trs$JWsw%Twx$MUx!Q%T!Q![$<b![!c%T!c!}$<b!}#O%T#O#P7o#P#R%T#R#S$<b#S#T%T#T#o$<b#o#p8^#p#q%T#q#r8^#r$g%T$g;'S$<b;'S;=`$>Q<%lO$<b#s%$Pm&m!b&eS&hW&b`%}sOr%Trs$@Ssw%Twx$C`x!Q%T!Q![$<b![!c%T!c!h$<b!h!i%!S!i!t$<b!t!u$Fl!u!}$<b!}#O%T#O#P7o#P#R%T#R#S$<b#S#T%T#T#U$<b#U#V$Fl#V#Y$<b#Y#Z%!S#Z#o$<b#o#p8^#p#q%T#q#r8^#r$g%T$g;'S$<b;'S;=`$>Q<%lO$<b#c%&V]!Zs&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!q%'Z]!YR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#b%(__%sQ&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T#a%)gX!_#T&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^#c%*__%rR&m!b&eS&hWOr%Trs&Vsw%Twx/Xx!_%T!_!`# x!`#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T!q%+gX!^!e&eS&hWOr8^rs9Qsw8^wx:dx#O8^#O#P;v#P;'S8^;'S;=`<y<%lO8^#a%,_]%|q&m!b&eS&hWOr%Trs&Vsw%Twx/Xx#O%T#O#P7o#P#o%T#o#p8^#p#q%T#q#r8^#r;'S%T;'S;=`=v<%lO%T",
  tokenizers: [legacyPrint, indentation, newlines, formatString1, formatString2, formatString1l, formatString2l, 0, 1, 2, 3, 4, 5, 6],
  topRules: {"Script":[0,7]},
  specialized: [{term: 229, get: value => spec_identifier[value] || -1}],
  tokenPrec: 7205
});

exports.parser = parser;

},{"@lezer/highlight":5,"@lezer/lr":6}]},{},[2,3])(3)
});
