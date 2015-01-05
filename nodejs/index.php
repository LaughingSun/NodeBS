<!DOCTYPE html>
<!--
The MIT License

Copyright 2015 Erich.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->
<html>
    <head>
        <title>NodeJS Tests</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="../NodeBS.js"></script>
        <script>
NodeBS.UseInjection = false;
NodeBS.Debug = false;

console.log = function ( content ) {
    var testContainer = document.querySelector( '#test-container' );
    var line = document.createElement( 'code' );
    line.textContent = content;
    testContainer.appendChild( line );
}

window.addEventListener('load', function (evt) {
    var _resize = function () {
            var w = pageContainer.offsetWidth,
                h = pageContainer.offsetHeight;
            rule.style.width = w + 'px';
            rule.style.height = h + 'px';
        },
        pageContainer,
        rule;
    pageContainer= document.querySelector( '#page-container' );
    // find style rule for .page
    _resize();
    window.addEventListener('resize', _resize, false);
}, false);

function dotest( path ) {
    var testContainer = document.querySelector( '#test-container' );
    testContainer.textContent = '';
    NodeBS( path + '/index.js' );
}
        </script>
        <style>
root, html, body {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: 0px none;
    overflow: hidden;
}

#page-container,
#test-container {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0px;
    box-sizing: border-box;
    padding: 50px 0px;
    margin: 0;
    border: 0px none;
    overflow: hidden;
}

#page-container {
    left: 0px;
    padding: 50px 0px;
    background-color: lightcyan;
    color: darkblue;
}

#test-container {
    right: 0px;
    padding: 5px 10px;
    background-color: lightgoldenrodyellow;
    color: darkgoldenrod;
}

.page {
    position: relative;
    box-sizing: border-box;
    padding: 5px;
    margin: 0;
    border: 0px none;
    overflow: hidden;
    background-color: paleturquoise;
}

#menu-container menu#page-menu {
    padding: 0;
    margin: 0;
}

#page-container header,
#page-container footer {
    position: absolute;
    width: 100%;
    height: 50px;
    left: 0px;
    box-sizing: border-box;
    margin: 0px;
    padding: 5px;
    overflow: hidden;
}

#page-container header {
    top: 0px;
}

#page-container footer {
    bottom: 0px;
}

#menu-container footer button {
    width: 24%;
    height: 40px;
    box-sizing: border-box;
    margin: 0px;
}

#menu-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    border: 0px none;
    z-index: 10;
    background-color: lightcyan;
    color: midnightblue;
}

menu#page-menu>li {
    padding: 2px 5px;
    cursor: pointer;
}
menu#page-menu>li:hover {
    background-color: midnightblue;
    color: lightcyan;
}
menu#page-menu>li button {
    border: 0px none;
    background-color: transparent;
    color: inherit;
    cursor: inherit;
}
menu#page-menu>li .status {
    position: absolute;
    display: inline-block;
    width: 120px;
    right: 5px;
    text-align: right;
    padding: 0px 5px;
}

code {
    display: block;
}
        </style>
    </head>
    <body><section id="page-container"><div class="page"><menu id="menu-main"><?php
$dirpath = './pages/';
$dpl = strlen( $dirpath );
foreach ( glob($dirpath . '*', GLOB_ONLYDIR | GLOB_NOESCAPE ) as $dir ) {
    $name = substr( $dir, $dpl );
    echo <<<__HTML__
<li onclick="dotest('{$dir}')"><button>{$name}</button><div class="status">Complete</div></li>
__HTML__;
}
?></menu></div><header>
                <div> LEARN YOU THE NODE.JS FOR MUCH WIN!</div>
                <div>Select an exercise and hit Enter to begin</div>
        </header><footer>
                <button>Back</button>
                <button>Help</button>
                <button>Credits</button>
                <button>Exit</button>
            </footer></section>
        <pre id="test-container"></pre></body>
</html>
