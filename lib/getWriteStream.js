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

const getWriteStream = module.exports = function( cFilePath ) { // jshint ignore:line
	console.log( 'getWriteStream' );
	var writeStream;
	var cStreamBuffer = '';
	var lDrained = true;
	var writer = {
		write: function( data ) {
			if ( !lDrained ) {
				cStreamBuffer = cStreamBuffer.concat( data );
				return;
			}
			this.writeNow( data );
		},// /write()
	
		writeNow: function( data ) {
			if( !writeStream.write( data ) ){
				lDrained = false;
			}
		}// /writeNow()
	};// /writer{}
	
	cFilePath = path.resolve( cFilePath );
	
	writeStream = fs.createWriteStream( cFilePath, {
		flags: 'a',
		encoding: 'ascii',
		defaultEncoding: 'ascii',
		fs: null,
		mode: 0666
		//highWaterMark: Math.pow(2,16)
	})
	.on( 'drain', function(){
		var cBuffer;
	
		lDrained = true;
		console.log( '********************************' );
		console.log( 'Stream drained: "'.concat( cFilePath, '"' ) );
		console.log( 'Buffer length:', cStreamBuffer.length );
		//process.exit();
	
	
		if ( cStreamBuffer.length > 0 ) {
			cBuffer = cStreamBuffer;
			cStreamBuffer = '';
			writer.writeNow( cBuffer );
		}
	})
	.on( 'error', function( err ){
		console.log( 'stream error' );
		console.log( err );
		console.log( '************' );
		process.exit( 1 );
	})
	.on( 'finish', function(){
		console.log( 'stream finish' );
		console.log( '************' );
		//process.exit();
	})
	.on( 'open', function(){
		console.log( 'open' );
		console.log( '************' );
		//process.exit();
	});
	
	return writer;
};// /getWriteStream()