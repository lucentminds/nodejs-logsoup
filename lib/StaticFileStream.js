/**
 * 09-14-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const fs = require( 'fs' );
const path = require( 'path' );
const getWriteStream = require( './getWriteStream' );

const StaticFileStream = module.exports = function( oOptions ){ // jshint ignore:line
   var oSettings = Object.assign({
      path: './logsoup.log',


      // Determines the full path of the log directory.
      _path_dir: null,

      // Determines the full path of the log file.
      _path_file: null,
   }, oOptions );

   oSettings._path_file = path.resolve( oSettings.path );
   oSettings._path_dir = path.dirname( oSettings._path_file );

   if( !lstatSync( oSettings._path_dir ) ){
      throw new Error( `Static log file directory ${oSettings._path_dir} does not exist.` );
   }

   var self = Object.assign({
      write: function( oLog ){
         var cLog = JSON.stringify( oLog );
         var stream = getWriteStream( oSettings._path_file );

         stream.write( cLog.concat( '\n' ) );

      }// /write()
   }, oOptions );
   
   return self;

};// /StaticFileStream()

const lstatSync = function( cPath ){
   var oStats = null, oResult;

   try {
      oResult = fs.lstatSync( cPath );
      oStats = { 
         path: cPath,
         ctime: oResult.ctime
      };
   }
   catch( e ) {
      if( process.env.NODE_ENV === 'dev' && process.env.DEBUG === '*' ) {
         console.log( 'STATIC_DEBUG', e );
      }
   }

   return oStats;
};// /lstatSync()