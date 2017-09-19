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
const time = require( './time' );
const TIME_TOKEN = '{{time}}';

const RotatingFileStream = module.exports = function( oOptions ){ // jshint ignore:line
   /* var oPath, nRotms; */
   var oSettings = Object.assign({
      path: './logsoup.log',
      
      name_rotate: null,

      // Determines how often to rotate the log file.
      period: null,

      // Determines how many rotated copies to keep.
      count: 0,
      
      // Determines how many milliseconds to wait before rotating the log files.
      _rot: null,

      // Determines the full path of the log directory.
      _path_dir: null,

      // Determines the regex pattern to match rotated log files.
      _name_pattern: null,

      // Determines the full path of the rotated files with name.
      _path_rotate: null
   }, oOptions );

   // Resolve the path to the final log file.
   oSettings.path = path.resolve( oSettings.path );

   // Make sure count is a positive integer
   oSettings.count = Math.max( 0, parseInt( oSettings.count, 10 ) );

   if( !oSettings.name_rotate ) {
      oSettings._path_rotate = generate_rotate_name( oSettings.path );
   }
   else {
      oSettings._path_rotate = path.resolve( oSettings.name_rotate );
   }

   // Resolve the path to the rotated log file.
   oSettings.path = path.resolve( oSettings.path );

   // Resolve the full path to the log directory.
   oSettings._path_dir = path.dirname( oSettings.path );

   oSettings._name_pattern = create_file_regex( path.basename( oSettings._path_rotate ) );

   // Convert settings
   var self = Object.assign({
      write: function( oLog ){
         var cLog = JSON.stringify( oLog );
         var stream = getWriteStream( oSettings.path );

         stream.write( cLog.concat( '\n' ) );

      }// /write()
   }, oOptions );

   // Determines how many milliseconds to wait before rotating the log files.
   oSettings._rot = time.calc_rot_time( oSettings.period );
   setTimeout( rotate_log, oSettings._rot, oSettings );
   
   return self;
};// /RotatingFile()

const create_file_regex = function( cFilename ){
   var aParts = cFilename.replace( /\./g, '\\.' ).split( TIME_TOKEN );
   var regex = new RegExp( '^'+aParts[0]+'.*'+aParts[1]+'$' );
  
   return regex;

};// /create_file_regex()

const rotate_log = function( oSettings ){
   var regex = oSettings._name_pattern;

   // Clear out old files.
   readdir( oSettings._path_dir )
   .then(function( aAllFiles ){
      var aFiles;
      
      if( oSettings.count > 0 ) {
         // Delete all files that count greater than `count`.

         aFiles = aAllFiles

         // Filter out filenames that do not match our rotated file pattern.
         .filter( function( cFile ){
            return regex.test( cFile );
         } )

         // Get the full path and creation time of each rotated log file.
         .map( function( cFile ){
            return lstatSync( path.join( oSettings._path_dir, cFile ) );
         } );
         
         // Sort files from latest to earliest.
         aFiles.sort( function( a, b ){
            var da = new Date( a.ctime );
            var db = new Date( b.ctime );
            
            return db - da;
         } );
         

         if( aFiles.length >= oSettings.count ) {
            // Deleted the older files counted above `count`.

            aFiles.slice( oSettings.count )

            // Delete each superfluous rotated log file.
            .map( function( oFile ){
               try {
                  fs.unlinkSync( oFile.path );
               }
               catch( e ) {
                  if( process.env.NODE_ENV === 'dev' && process.env.DEBUG === '*' ) {
                     console.log( 'ROTATE_DEBUG', e );
                  }
               }
            } );
         }

      }// /if()

      // Fetch root log file stats.
      return lstatSync( oSettings.path );
   })
   .then(function( oRootFileStats ){
      var cPathNew, cTime;

      if( oRootFileStats ){
         cTime = get_time_name( oRootFileStats.ctime, oSettings.period );

         // Rotate log file.
         cPathNew = oSettings._path_rotate.replace( TIME_TOKEN, cTime );
         
         return rename( oSettings.path, cPathNew );
      }
   })
   .catch(function( err ){
      console.log( err );
      process.exit( 1 );
   });
   
   setTimeout( rotate_log, oSettings._rot, oSettings );
};// /rotate_log()

const readdir = function( cDir ){
  return new Promise(function( resolve, reject ){
     fs.readdir( cDir, function( err, aFiles ){
         if( err ){
            return reject( err );
         }

         return resolve( aFiles );
     });
  });
};// /readdir()

const rename = function( cPathOld, cPathNew ){
  return new Promise(function( resolve, reject ){
     fs.rename( cPathOld, cPathNew, function( err, aFiles ){
         if( err ){
            return reject( err );
         }

         return resolve( aFiles );
     });
  });
};// /rename()

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
         console.log( 'ROTATE_DEBUG', e );
      }
   }

   return oStats;
};// /lstatSync()

const get_time_name = function( cTime, cPeriod ){
   var cName, cScope = time.get_period( cPeriod ).scope;
   var oDate = new Date( cTime );
   var d = {
      y: oDate.getUTCFullYear(),
      m: lpad( oDate.getUTCMonth()+1 ),
      w: oDate.getUTCDay(),
      d: lpad( oDate.getUTCDate() ),
      h: lpad( oDate.getUTCHours() ),
      min: lpad( oDate.getUTCMinutes() ),
      sec: lpad( oDate.getUTCSeconds() ),
      ms: lpad( oDate.getUTCMilliseconds() ),
   };

   // Determine scope.
   switch( cScope ){
   case 'ms':
      cName = [d.y, d.m, d.d].join( '-' ).concat( '_', [d.h, d.min, d.sec].join( '-' ), '.', d.ms );
      break;

   case 'sec':
      cName = [d.y, d.m, d.d].join( '-' ).concat( '_', [d.h, d.min, d.sec].join( '-' ) );
      break;

   case 'min':
      cName = [d.y, d.m, d.d].join( '-' ).concat( '_', [d.h, d.min].join( '-' ) );
      break;

   case 'h':
      cName = [d.y, d.m, d.d].join( '-' ).concat( '_', [d.h].join( '-' ) );
      break;

   case 'd':
      cName = [d.y, d.m, d.d].join( '-' );
      break;

   case 'w':
      // 0 = Sunday.
      cName = [d.y, d.m].join( '-' ).concat( '.', d.w );
      break;

   case 'm':
      cName = [d.y, d.m].join( '-' );
      break;

   case 'y':
      cName = d.y;
      break;

   default:
      throw new Error( `Invalid rot time scope "${cScope}"` );
   }// /switch()

  return cName;
};// /get_time_name()

const generate_rotate_name = function( cPath ) {
   var oPath = path.parse( cPath );

   oPath.base = oPath.name.concat( '_', TIME_TOKEN, oPath.ext );
   oPath.name = oPath.name.concat( '_', TIME_TOKEN );
   
   return path.format( oPath );
};// /generate_rotate_name()
   
const lpad = function (n) {
   var w = 2;
   
   n = n + '';

   return n.length >= w ?n :new Array(w - n.length + 1).join('0') + n;
};// /lpad()