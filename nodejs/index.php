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
}
menu {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    margin: 0;
    border: 0px none;
    z-index: 10;
    background-color: lightcyan;
}
#test-container {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    margin: 0;
    border: 0px none;
    background-color: lightgoldenrodyellow;
}
code {
    display: block;
}
        </style>
    </head>
    <body>
        <menu>
            <div> LEARN YOU THE NODE.JS FOR MUCH WIN!</div>
            <div>Select an exercise and hit Enter to begin</div>
            <hr/>
<?php
$dirpath = './';
$dpl = strlen( $dirpath );
foreach ( glob($dirpath . '*', GLOB_ONLYDIR | GLOB_NOESCAPE ) as $dir ) {
    $name = substr( $dir, $dpl );
    echo <<<__HTML__
<button onclick="dotest('{$dir}')">{$name}</button>
__HTML__;
}
?></menu>
        <pre id="test-container"></pre>
    </body>
</html>
