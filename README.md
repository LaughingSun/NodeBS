NodeBS
======

Node Browser Support: not as efficient as Browsify or RequireJS, but more compatible AND pure client, no pre processing.

Why would you want to use this?  If you have Node code that doesn't use binding core modules in a browser withyout a rewrite, as a code load manager, or even just to make your code more cross platform.

Usage:
<script src="path_to_NodeBs.js"></script>
<script>
NodeBS( './my_node_script.js' );                    // to load node compatible script files
NodeBS.Exec( 'console.log( "Hello Whirled!" );' );  // to execute a node compatible script
</script>

Although NodeBS will detect it's lib and other dependent folder, you can specifiy the parent folder where they reside with:
<script>
NodeBS.LibPath = './NodeBS/';                         // note, the path must end with a '/'
</script>

By default script files are loaded using AJAX, you can also load them via Injection.  However Injection still will not allow cross domain loading for security reasons.  Turn on injection using:
<script>
NodeBS.UseInjection = true;                           // Load script files using Injecttion
NodeBS.UseInjection = false;                          // Load script files using AJAX
</script>

<script>
NodeBS.Debug = true;                                  // turn on console.Debug messages for NodeBS
NodeBS.Debug = false;                                 // turn off console.Debug messages for NodeBS
</script>

Most of the core modules are supported, however core modules which include binding modules (external modules with binding which are part of NodeJS) you will have to have add or write additional binding module support (native scripts that reside in the ./NodeBS/bindings directory.)

All and all it offers more compatibility then all the popular Browser Node solutions.  It is written with both compatibility and performance in mind, but if you want pure performance you should always role your own. :)

In the future we will add benchmarking and coparison for the module, require and process features.  Plus some examples and extensions to handle some of the core modules that using binding.

the folders / directories are as follow:
lib/   - the code modules directory
bind/  - core binding module hacks
docs/  - usage and reference documents

Oh yeah, if you find something you think is not directly compatible with real NodeJS (keeping in mind this is for client/browser) or you have an idea how it could work be supported; please leave or contribute your suggestions or fork, along with what you think the incompatibility is.

Hope you enjoy this contribution and have a great day!

PS. No, it is not Bullsh!t. It is "Browser Support".  :)
