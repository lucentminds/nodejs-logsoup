/**
 * 09-14-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const REG_ROT_PERIOD = /^([1-9][0-9]*)([hdwmy]|ms|sec|min)$/;
const time = module.exports = {};

time.top_of_year = function( nOffset ){
   var d = new Date();

   d.setUTCFullYear( d.getUTCFullYear() + ( 1 * nOffset ) );
   d.setUTCMonth( 0 );
   d.setUTCDate( 1 );
   d.setUTCHours( 0 );
   d.setUTCMinutes( 0 );
   d.setUTCSeconds( 0 );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_year()

time.top_of_month = function( nOffset ){
   var d = new Date();

   d.setUTCMonth( d.getUTCMonth() + nOffset );
   d.setUTCDate( 1 );
   d.setUTCHours( 0 );
   d.setUTCMinutes( 0 );
   d.setUTCSeconds( 0 );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_month()

time.top_of_week = function( nOffset ){
   var d = new Date();

   // next Sunday
   d.setUTCDate( d.getUTCDate() - ( d.getUTCDay()%7 ) + 7 + nOffset );
   d.setUTCHours( 0 );
   d.setUTCMinutes( 0 );
   d.setUTCSeconds( 0 );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_week()

time.top_of_day = function( nOffset ){
   var d = new Date();

   // next midnight
   d.setUTCDate( d.getUTCDate() + ( 1 * nOffset ) );
   d.setUTCHours( 0 );
   d.setUTCMinutes( 0 );
   d.setUTCSeconds( 0 );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_day()

time.top_of_hour = function( nOffset ){
   var d = new Date();

   d.setUTCHours( d.getUTCHours() + ( 1 * nOffset ) );
   d.setUTCMinutes( 0 );
   d.setUTCSeconds( 0 );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_hour()

time.top_of_minute = function( nOffset ){
   var d = new Date();

   d.setUTCMinutes( d.getUTCMinutes() + ( 1 * nOffset ) );
   d.setUTCSeconds( 0 );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_minute()

time.top_of_second = function( nOffset ){
   var d = new Date();

   d.setUTCSeconds( d.getUTCSeconds() + ( 1 * nOffset ) );
   d.setUTCMilliseconds( 0 );

   return d;
};// /top_of_second()

time.get_period = function( cPeriod ) {
   var aMatch = REG_ROT_PERIOD.exec(cPeriod);

   if( !aMatch ) {
      throw new Error( `Invalid rot period "${cPeriod}"` );
      //return null;
   }

   return {
      offset: parseInt( aMatch[ 1 ], 10 ),
      scope: aMatch[ 2 ]
   };
};// /get_period()

/**
 * Returns the number of milliseconds until a time period rots or decays in UTC
 * time.
 * @param {string} cPeriod 
 */
time.calc_rot_time = function( cPeriod ){
   // <number><scope> where scope is:
   //    ms    milliseconds (every millisecond)
   //    sec   seconds (at the start of the second)
   //    min   minutes (at the start of the minute)
   //    h     hours (at the start of the hour)
   //    d     days (at the start of the day, i.e. just after midnight)
   //    w     weeks (at the start of Sunday)
   //    m     months (on the first of the month)
   //    y     years (at the start of Jan 1st)
   // with special values 'hourly' (1h), 'daily' (1d), "weekly" (1w),
   // 'monthly' (1m) and 'yearly' (1y)
   var cScope, nOffset, nDiff, dRot;
   var aMatch = REG_ROT_PERIOD.exec(cPeriod);

   if( !aMatch ) {
      throw new Error( `Invalid rot period "${cPeriod}"` );
      //return null;
   }


   cScope = aMatch[ 2 ];
   nOffset = parseInt( aMatch[ 1 ], 10 );

   // if( cScope === 'ms' ){
   //    return nOffset;
   // }

   // Determine scope.
   switch( cScope ){
   case 'ms':
   console.log( new Date().getTime() );
      dRot = new Date( new Date().getTime()+nOffset );
      break;

   case 'sec':
      dRot = time.top_of_second( nOffset );
      break;

   case 'min':
      dRot = time.top_of_minute( nOffset );
      break;

   case 'h':
      dRot = time.top_of_hour( nOffset );
      break;

   case 'd':
      dRot = time.top_of_day( nOffset );
      break;

   case 'w':
      // Top of week is on Sunday.
      dRot = time.top_of_week( nOffset );
      break;

   case 'm':
      dRot = time.top_of_month( nOffset );
      break;

   case 'y':
      dRot = time.top_of_year( nOffset );
      break;

   default:
      throw new Error( `Invalid rot time scope "${cScope}"` );
   }// /switch()
   
   nDiff = dRot - new Date();
   return nDiff;
   
   //return new Date( new Date().getTime()+nDiff );

};// /calc_rot_time()