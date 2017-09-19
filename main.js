/**
 * 09-13-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const os = require( 'os' );
const RotatingFileStream = require( './lib/RotatingFileStream' );
const ConsoleStream = require( './lib/ConsoleStream' );
const ColorConsoleStream = require( './lib/ColorConsoleStream' );
const StaticFileStream = require( './lib/StaticFileStream' );
const LEVELS = [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ];
const Logsoup = module.exports = {};// /Logsoup()

Logsoup.createLogger = function( oOptions ) {
   var i, l, c;
   var oSettings = Object.assign({
      name: null,
      structure: null,

      streams: [
         Logsoup.stream.Console()
      ]
   }, oOptions );

   var self = {
      setLevel: function( cLevel, oStruct ){
         oStruct = oStruct || oSettings.structure;
         self[ cLevel ] = Logger({
            level: cLevel,
            name: oSettings.name,
            structure: oStruct, 
            streams: oSettings.streams 
         });
      }// /setLevel()
   };// /self{}
   

   for( i = 0, l = LEVELS.length; i < l; i++ ) {
      c = LEVELS[ i ];
      self.setLevel( c );
   }// /for()

   return self;
};// /createLogger()

Logsoup.stream = {};

const Logger = function( oSettings ){
   var cLevel = oSettings.level;
   var cName = oSettings.name;
   var oStruct = oSettings.structure;
   var aStreams = oSettings.streams;

   var oTemplate = Object.assign({
      time: null,
      name: cName,
      level: null,
      host: os.hostname(),
      pid: process.pid,
      msg: ''
   }, oStruct );

   oTemplate.level = cLevel;

   if( !cName ){
      delete oTemplate.name;
   }

   /**
    * Filter out any streams that have a `level` specified and that level does 
    * not match `cLevel`.
    */
   aStreams = aStreams.filter(function( oStream ){
      if( !oStream.level || oStream.level === cLevel ) {
         return true;
      }
   });


   return function( cMsg ){
      var oLog = Object.assign( oTemplate, {
         time: new Date().toISOString(),
         msg: cMsg
      } );

      aStreams.map(function( stream ){
         stream.write( oLog );
      });
   };
};// /Logger()

Logsoup.stream.RotatingFileStream = RotatingFileStream;

Logsoup.stream.Console = ConsoleStream;

Logsoup.stream.StaticFileStream = StaticFileStream;

Logsoup.stream.ColorConsoleStream = ColorConsoleStream;