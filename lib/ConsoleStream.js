/**
 * 09-14-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const Console = module.exports = function( oOptions ){ // jshint ignore:line
   var self = Object.assign({
      write: function( oLog ){
         var cLog = JSON.stringify( oLog );
         
         process.stdout.write( cLog+'\n' );

      }// /write()
   }, oOptions );
   
   return self;

};// /Console()