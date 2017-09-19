/**
 * 09-14-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const color = require( '../lib/color' );
const LEVELS = {
   trace: 'magenta',
	debug: 'bgGreen',
	info: 'cyan',
	warn: 'yellow',
   error: 'red',
   fatal: 'bgRed'
};// /LEVELS()


const ColorConsole = module.exports = function( oOptions ){ // jshint ignore:line
   const oLevels = Object.assign( {}, LEVELS, oOptions.colors );

   

   var self = Object.assign({
      write: function( oLog ){
         var cColor = oLevels[ oLog.level ];
         var cTime = oLog.time;
         var cMsg = oLog.msg;

         var cOutput = ''.concat(
            '[',color( 'gray', cTime ),'] ',
            color( cColor, cMsg ) );
         
         process.stdout.write( cOutput+'\n' );

      }// /write()
   }, oOptions );
   
   return self;

};// /ColorConsole()