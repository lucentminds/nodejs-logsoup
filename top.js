
/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const time = require( './lib/time' );

var aPeriods = [
   '3ms',
   '1sec',
   '1min',
   '1h',
   '1d',
   '1w',
   '1m',
   '1y'
];

aPeriods.map(function( cPeriod/* , i, a */ ){
   var nDiff = time.calc_rot_time( cPeriod );
   var dRot = new Date( new Date().getTime()+nDiff );
   console.log( cPeriod.concat( ':' ), dRot );
});