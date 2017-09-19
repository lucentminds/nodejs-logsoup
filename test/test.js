/**
 * 09-13-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const path = require( 'path' );
const Logsoup = require( '../main' );
const time = require( '../lib/time' );

(function(){
   console.log( '\n-------------\nTest: simple' );

   var log = Logsoup.createLogger({ name:'test1' });

   log.setLevel( 'access' );
   log.trace( 'trace' );
   log.debug( 'debug' );
   log.info( 'info' );
   log.warn( 'warn' );
   log.error( 'error' );
   log.fatal( 'fatal' );
   log.access( 'access' );
   console.log( '\n' );
}());

(function(){
   console.log( '\n-------------\nTest: colors' );

   var log = Logsoup.createLogger({ 
      name: 'test2',
      streams: [
         Logsoup.stream.ColorConsoleStream({
            colors: {
               access: 'green'
            }
            //level: 'access'
         })
      ]
   });

   log.setLevel( 'access' );
   log.trace( 'trace' );
   log.debug( 'debug' );
   log.info( 'info' );
   log.warn( 'warn' );
   log.error( 'error' );
   log.fatal( 'fatal' );
   log.access( 'access' );
   console.log( '\n' );
}());

(function(){
   console.log( '\n-------------\nTest: static file' );

   var log = Logsoup.createLogger({ 
      name: 'test3',
      streams: [
         Logsoup.stream.StaticFileStream({
            path: path.resolve( __dirname, './logs/test.log' )
         })
      ]
   });

   log.setLevel( 'access' );
   log.trace( 'trace' );
   log.debug( 'debug' );
   log.info( 'info' );
   log.warn( 'warn' );
   log.error( 'error' );
   log.fatal( 'fatal' );
   log.access( 'access' );
   console.log( '\n' );
}());

process.exit();

var log = Logsoup({
   streams: [
      // Logsoup.stream.StaticFile({}),
      Logsoup.stream.ColorConsoleStream({
         colors: {
            access: 'green'
         }
         //level: 'access'
      }),
      // Logsoup.stream.RotatingFileStream({
      //    level: 'access',
      //    period: '1sec',
      //    count: 5
      // })
   ]
});

//console.log( log );
log.setLevel( 'access' );

log.trace( 'trace' );
log.debug( 'debug' );
log.info( 'info' );
log.warn( 'warn' );
log.error( 'error' );
log.fatal( 'fatal' );
log.access( 'access' );

// console.log( 'Top of UTC year:', time.top_of_year( 1 ) );
// console.log( 'Top of UTC month:', time.top_of_month( 1 ) );
// console.log( 'Top of UTC week:', time.top_of_week( 1 ) );
// console.log( 'Top of UTC day:', time.top_of_day( 1 ) );
// console.log( 'Top of UTC hour:', time.top_of_hour( 1 ) );
// console.log( 'Top of UTC minute:', time.top_of_minute( 1 ) );
// console.log( 'Top of UTC second:', time.top_of_second( 1 ) );
// console.log( ' ' );

// setInterval(function(){
//    log.access( 'test' );
//    console.log( '/n/n*****************/n/n' );
// }, 5000 );