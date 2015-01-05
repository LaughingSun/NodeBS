/* 
 * The MIT License
 *
 * NodeBS - Copyright 2015 Erich.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function (){
    "use strict";
    var _NAME_ = 'NodeBS',
        _ArrayProto = Array.prototype,
        _ArraySlice = _ArrayProto.slice,
        _ArraySplice = _ArrayProto.splice,
        _ArrayPush = _ArrayProto.push,
        _ArrayForEach = _ArrayProto.forEach,
        _Ajax = function ( filename, options ) {
            var xhr = new XMLHttpRequest,
                async = (options || (options = {})).async == null ? true : options.async,
                i, t;
            xhr.open( options.method || 'get', filename, async );
            if ( (t = options.props) instanceof Object ) {
                for ( i in t )
                    xhr[i]= t[i]
            }
            if ( (t = options.events) instanceof Object ) {
                for ( i in t )
                    xhr.addEventListener( i, t[i] )
            }
            xhr.send(options.reqData || null);
            return xhr;
        },
        _Inject = function ( content, options ) {
            var sel, pel,
                i, t;
            if ( options instanceof HTMLElement ) {
                sel = options
            } else {
                sel = document.createElement( (options || (options = {})).tagName || 'script' );
                if ( (t = options.attrs) instanceof Object ) {
                    for ( i in t )
                        sel.setAttribute(i, t[i]);
                }
                if ( (t = options.events) instanceof Object ) {
                    for ( i in t )
                        sel.addEventListener( i, t[i] )
                }
                pel = ((t = options.parentElement) instanceof HTMLElement)
                        ? t
                        : (t ? document.body : document.head);
            }
            sel.textContent = content;
            if ( pel )
                pel.appendChild( sel );
            return sel;
        },
        _AbsPath = function ( path ) {
            var r = path.replace( /\/(?:\.?\/|[^\/\.]+\/\.\.\/)/g, '/' ),
                t;
            while ( r != (t = r.replace( /\/[^\/\.]+\/\.\.\//g, '/' )) )
                r = t;
            return r
        },
        _DirName = function ( path ) {
            return path.match( /^((?:[^\/]*\/)*)/ )[1]
        },
        _UniqueIndex = 0,
        _UseInjection = false,
        _$HOME = location.href.match( /^\w+:\/\/[^\/]+((?:\/~[^\/]+)?\/)/ )[1],
        _$PREFIX = location.href.match( /^\w+:\/\/[^\/]+((?:\/~[^\/]+)?\/(?:[^\/]+\/)*)/ )[1],
        _$NODEBS = document.querySelector( 'script[src$="NodeBS.js"]' ).src.slice(0,-9)
                || _$HOME + 'NodeBS/',
        _COREDIR_ = _$NODEBS + 'lib/',
        _BINDDIR_ = _$NODEBS + 'bind/',
        _JSNArgs = 'module,require,__dirname,__filename,process',
        _JSNFPre = '"use strict";\nvar global=self,exports=module.exports;',
        _JSNFPost= ';return module.exports',
        _ModuleCache = {},
        _BindCache = {},
        _CoreModules = {
            assert: 'assert.js', buffer: 'buffer.js', child_process: 'child_process.js', cluster: 'cluster.js', console: 'console.js', constants: 'constants.js', crypto: 'crypto.js', dgram: 'dgram.js', dns: 'dns.js', domain: 'domain.js', events: 'events.js', freelist: 'freelist.js', fs: 'fs.js', http: 'http.js', https: 'https.js', module: 'module.js', net: 'net.js', os: 'os.js', path: 'path.js', punycode: 'punycode.js', querystring: 'querystring.js', readline: 'readline.js', repl: 'repl.js', smalloc: 'smalloc.js', stream: 'stream.js', string_decoder: 'string_decoder.js', sys: 'sys.js', timers: 'timers.js', tls: 'tls.js', tracing: 'tracing.js', tty: 'tty.js', url: 'url.js', util: 'util.js', vm: 'vm.js', zlib: 'zlib.js', _debugger: '_debugger.js', _http_agent: '_http_agent.js', _http_client: '_http_client.js', _http_common: '_http_common.js', _http_incoming: '_http_incoming.js', _http_outgoing: '_http_outgoing.js', _http_server: '_http_server.js', _linklist: '_linklist.js', _stream_duplex: '_stream_duplex.js', _stream_passthrough: '_stream_passthrough.js', _stream_readable: '_stream_readable.js', _stream_transform: '_stream_transform.js', _stream_writable: '_stream_writable.js', _tls_common: '_tls_common.js', _tls_legacy: '_tls_legacy.js', _tls_wrap: '_tls_wrap.js'
        },
        _FileCache = {},
        _MIMECache = {},
        _QueryMIMEOptions = {
            method: 'HEAD',
            async: false,
        },
        _QueryMIME = function ( path ) {
            var t;
            if ( (t = _MIMECache[path]) == null ) {
                if ( (t = _Ajax( path, _QueryMIMEOptions ))
                        && t.readyState >= 2 ) {
//                    console.log( t, t.getAllResponseHeaders() );
                    if ( t.status == 200 ) {
                        if ( t.getResponseHeader('Content-Length') ) {
                            _MIMECache[path] = t.getResponseHeader('Content-Type') || '';
                        } else {
                            _MIMECache[path] = 'text/directory';
                        }
                    } else if  ( t.status == 404 ) {
                        _MIMECache[path] = false;
                    }
                }
            }
            return _MIMECache[path]
        },
        /* To get the exact filename that will be loaded when require() is 
         * called, use the require.resolve() function.
         * Putting together all of the above, here is the high-level 
         * algorithm in pseudocode of what require.resolve does:
         *
         * require(name) from module at path
         * 1. If name is a core module,
         *    a. return the core module
         *    b. STOP
         * 2. If name begins with './' or '/' or '../'
         *    a. LOAD_AS_FILE(path + name)
         *    b. LOAD_AS_DIRECTORY(path + name)
         * 3. LOAD_NODE_MODULES(name, dirname(path))
         * 4. THROW "not found"
         *
         * LOAD_AS_FILE(name)
         * 1. If name is a file, load name as JavaScript text.  STOP
         * 2. If name.js is a file, load name.js as JavaScript text.  STOP
         * 3. If name.json is a file, parse name.json to a JavaScript Object.  STOP
         * 4. If name.node is a file, load name.node as binary addon.  STOP
         *
         * LOAD_AS_DIRECTORY(name)
         * 1. If name/package.json is a file,
         *    a. Parse name/package.json, and look for "main" field.
         *    b. let M = name + (json main field)
         *    c. LOAD_AS_FILE(M)
         * 2. If name/index.js is a file, load name/index.js as JavaScript text.  STOP
         * 3. If name/index.json is a file, parse name/index.json to a JavaScript object. STOP
         * 4. If name/index.node is a file, load name/index.node as binary addon.  STOP
         *
         * LOAD_NODE_MODULES(name, START)
         * 1. let DIRS=NODE_MODULES_PATHS(START)
         * 2. for each DIR in DIRS:
         *    a. LOAD_AS_FILE(DIR/name)
         *    b. LOAD_AS_DIRECTORY(DIR/name)
         *
         * NODE_MODULES_PATHS(START)
         * 1. let PARTS = path split(START)
         * 2. let I = count of PARTS - 1
         * 3. let DIRS = []
         * 4. while I >= 0,
         *    a. if PARTS[I] = "node_modules" CONTINUE
         *    c. DIR = path join(PARTS[0 .. I] + "node_modules")
         *    b. DIRS = DIRS + DIR
         *    c. let I = I - 1
         * 5. return DIRS
         */
        _LoadAjaxOptions = { async: false },
        _LoadAsBinding = function ( name, machine ) {
            var p, xhr, script;
            if ( _BindCache[name] )
                return _BindCache[name];
            if ( (script = ( (xhr = _Ajax( p = _BINDDIR_ + name + '.js', _LoadAjaxOptions ))
                    && xhr.getResponseHeader('Content-Type') === 'application/javascript'
                    && (_FileCache[p] = xhr.responseText) )) ) {
                return _BindCache[name] = _LoadAsModule( p, script, machine );
            }
            throw "No such binding " + name;
        },
        _LoadAsFile = function ( filepath, machine, parent ) {
            var t, p, xhr, script;
            // 1 & 2. If name OR name.js is a file, load name as JavaScript text.  STOP
            if ( (t = _QueryMIME( p = filepath )) === ''
                    || t === 'application/javascript'
                    || (t = _QueryMIME( p = filepath + '.js' )) === 'application/javascript' ) {
                NodeBS.Debug && console.debug( p, t );
                if ( _ModuleCache[p] )
                    return _ModuleCache[p];
                if ( (script = _FileCache[p]
                        || ( (xhr = _Ajax( p, _LoadAjaxOptions )) && (_FileCache[p] = xhr.responseText) )) )
                    return _LoadAsModule( p, script, machine, parent );
                throw "Load error on " + p;
            }
            // 3. If name.json is a file, parse name.json to a JavaScript Object.  STOP
            if ( (t = _QueryMIME( p = filepath + '.json' )) === 'application/json' ) {
                NodeBS.Debug && console.debug( p, t );
                if ( _ModuleCache[p] )
                    return _ModuleCache[p];
                if ( (script = _FileCache[p]
                        || ( (xhr = _Ajax( p, _LoadAjaxOptions )) && (_FileCache[p] = xhr.responseText) )) )
                    return _LoadAsObject( p, script, machine, parent );
                throw "Load error on " + p;
            }
            // 4. If name.node is a file, load name.node as binary addon.  STOP */
            if ( (t = _QueryMIME( filepath + '.node' )) === '' ) {
                NodeBS.Debug && console.debug( p, t );
                throw "node extensions are unsupported in browsers";
            }
            return false
        },
        _LoadAsDir = function ( filepath, machine, parent ) {
            var t, p, xhr, script;
            // 1. If name/package.json is a file,
            if ( (t = _QueryMIME( p = filepath + '/package.json' )) === 'application/json' ) {
                NodeBS.Debug && console.debug( p, t );
                // a. Parse name/package.json, and look for "main" field.
                if ( ! (script = _FileCache[p]
                        || ( (xhr = _Ajax( p, _LoadAjaxOptions )) && (_FileCache[p] = xhr.responseText) )) )
                    throw "Load error on " + p;
                if ( ! (t = JSON.parse( script )) )
                    throw "Parse error on " + p;
                // b. let M = name + (json main field)
                if ( ! t.main )
                    throw 'Missing "main" on ' + p;
                if ( _ModuleCache[p = filepath + '/' + t.main] )
                    return _ModuleCache[p];
                if ( (script = _FileCache[p]
                        || ( (xhr = _Ajax( p, _LoadAjaxOptions )) && (_FileCache[p] = xhr.responseText) )) )
                    return _LoadAsModule( p, script, machine, parent );
                throw "Load error on " + p;
                // c. LOAD_AS_FILE(M)
            }
            // 2. If name/index.js is a file, load name/index.js as JavaScript text.  STOP
            if ( (t = _QueryMIME( p = filepath + '/index.js' )) === 'application/javascript' ) {
                NodeBS.Debug && console.debug( p, t );
                if ( _ModuleCache[p] )
                    return _ModuleCache[p];
                if ( (script = _FileCache[p]
                        || ( (xhr = _Ajax( p, _LoadAjaxOptions )) && (_FileCache[p] = xhr.responseText) )) )
                    return _LoadAsModule( p, script, machine, parent );
                throw "Load error on " + p;
            }
            // 3. If name/index.json is a file, parse name/index.json to a JavaScript object. STOP
            if ( (t = _QueryMIME( p = filepath + '/index.json' )) === 'application/json' ) {
                NodeBS.Debug && console.debug( filepath, t );
                if ( _ModuleCache[p] )
                    return _ModuleCache[p];
                if ( (script = _FileCache[p]
                        || ( (xhr = _Ajax( p, _LoadAjaxOptions )) && (_FileCache[p] = xhr.responseText) )) )
                    return _LoadAsObject( p, script, machine, parent );
                throw "Load error on " + p;
            }
            // 4. If name/index.node is a file, load name/index.node as binary addon.  STOP
            if ( (t = _QueryMIME( p = filepath + '/index.node' )) === '' ) {
                NodeBS.Debug && console.debug( filepath, t );
                throw "node extensions are unsupported in browsers";
            }
            return false
        },
        _NodeModulesPaths = function ( start ) {
            // 1. let PARTS = path split(START)
            // 2. let I = count of PARTS
            // 3. let DIRS = []
            var parts = start.split( '/' ),
                i = parts.length,
                dirs = [];
            // 4. while I-- >= 0,
            while ( i-- ) {
                // a. if PARTS[I] = '.node_modules' CONTINUE
                if ( parts[i] === '.node_modules' )
                    continue;
                // c. DIR = path join(PARTS[0 .. I] + '.node_modules')
                // b. DIRS = DIRS + DIR
                dirs.push( parts.slice( 0, i ).join( '/' ) + '/.node_modules' );
            }
            // 5. return DIRS
            return dirs
        },
        _LoadNodeModules = function ( name, start, machine, parent ) {
            // 1. let DIRS=NODE_MODULES_PATHS(START)
            // 2. for each DIR in DIRS:
            var dirs = _NodeModulesPaths( start ),
                i = -1,
                n = dirs.length,
                t, r;
            while ( ++i < n ) {
                //    a. LOAD_AS_FILE(DIR/name)
                //    b. LOAD_AS_DIRECTORY(DIR/name)
                if ( (r = _LoadAsFile(t = dirs[i] + '/' + name, machine, parent))
                        || (r = _LoadAsDir( t, machine, parent )) ) {
                    return r
                }
                
            }
            return false
        },
        _LoadAsModule = function ( fullpath, script, machine, parent ) {
            var _loaded = false,
                _children = [],
                _dirname = _DirName( fullpath ),
                _exports = {},
                _module = Object.defineProperties( {}, {
                    exports: {
                        get: function () {
                            return _exports
                        },
                        set: function ( f ) {
                            _exports = f;
//                            var n;
//                            if ( f instanceof Function ) {
//                                if ( (n = f.name || ((n=f.toString().match(/function\s+(\w+)/m))&&n[1])) )
//                                    _exports[n] = f;
//                                else
//                                    throw "cannot export an anonymous function";
//                            } else if ( f instanceof Object ) {
//                                for ( n in f )
//                                    _exports[n] = f[n];
//                            } else
//                                throw "cannot export a non object";
                        }
                    },
                    id: { value: fullpath },
                    filename: { value: fullpath },
                    loaded: { get: function () { return _loaded } },
                    parent: { get: function () { return parent || null } },
                    children: { get: function () { return _children } },
                    require: { value: function ( id ) {} }
                } ),
                _require = function ( name ) {
                    var fn = _Load( name, _dirname, machine, _module );
                    if ( fn instanceof Function ) {
                        return fn( machine.process );
                    }
                    return fn
                };
            if ( _UseInjection ) {
                _Inject( _NAME_ + ".Cache['" + fullpath.replace( /'/g, "\\'" ) + "'] = function (" + _JSNArgs + ') {' + _JSNFPre + script + _JSNFPost + '}', { attrs: { async: 'false' } } );
                _ModuleCache[fullpath] = _ModuleCache[fullpath].bind( null, _module, _require, _dirname, fullpath );
            } else {
                _ModuleCache[fullpath] = new Function( _JSNArgs, _JSNFPre + script + _JSNFPost ).bind( null, _module, _require, _dirname, fullpath );
            }
            _loaded = true;
            return _ModuleCache[fullpath];
        },
        _LoadAsObject = function ( fullpath, script, machine, parent ) {
            return _ModuleCache[fullpath] = JSON.parse( script );
        },
        _Load = function ( name, path, machine, parent ) {
            var t, r;
            if ( (r = _CoreModules[name]) ) {
                if ( typeof r === 'string' ) {
                    if ( ! (r = _LoadAsFile( (t = _COREDIR_ + r), machine, parent )) )
                        throw "Failed to load core module " + name;
                    _CoreModules[name] = r;
                }
                return r
            } else if ( name.match( /^(\.{0,2}\/)/ ) ) {
                if ( (r = _LoadAsFile( (t = _AbsPath(( name[0] === '/' ) ? _$PREFIX + name : path + name)), machine, parent ))
                        || (r = _LoadAsDir( t, machine, parent )) ) {
                    return r
                }
            } else if ( (r = _LoadNodeModules( name, _DirName( path ), machine, parent )) ) {
                return r
            }
            return null
        },
        _ResolveId = function ( filename ) {
            var m = filename.match( /(\w+)(?:\.js)?$/i );
            return m && m[1]
        },
        _Exec = function ( script ) {
            var argv = ['nodebs', null],
                machine = { process: { argv: argv } },
                fn = _LoadAsModule( '#script' + ++_UniqueIndex, script, machine );
            _ArrayPush.apply( argv, arguments );
            
            if ( fn instanceof Function ) {
                return fn( machine.process );
            }
            return fn
        },
        NodeBS = function ( file ) {
            var argv = ['nodebs'],
                machine = {
                    process: {
                        argv: argv,
                        binding: function ( name ) {
                            var fn = _LoadAsBinding( name, machine );
                            if ( fn instanceof Function ) {
                                return fn( machine.process );
                            }
                            return fn
                        }
                    }
                },
                fn = _Load( file, _$PREFIX, machine );
            _ArrayPush.apply( argv, arguments );
            
            if ( fn instanceof Function ) {
                return fn( machine.process );
            }
            return fn
        };
    NodeBS.Debug = false;
    self[_NAME_] = Object.defineProperties( NodeBS, {
        UseInjection: { get: function ( ) { return _UseInjection }, set: function ( b ) { _UseInjection = !! b } },
        Cache: { value: _ModuleCache },
        Exec: { value: _Exec }
    } );
})()

