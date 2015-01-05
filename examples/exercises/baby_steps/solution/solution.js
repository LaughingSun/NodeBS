console.log( module.exports );
module.exports = { 'name': 'Erich' };
require( '../../../printenv' );
console.log( module.exports );

console.log(process.argv);
var result = 0;
for (var i = 2; i < process.argv.length; i++)
  result += Number(process.argv[i]) || 0;

console.log(result);

console.log( module.exports );
