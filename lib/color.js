/**
 * 09-13-2017
 * ~~ Scott Johnson
 */

/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const COLORS = {
   normal: '\x1b[0m',
   cyan: '\x1b[36m',
   yellow: '\x1b[33m',
   green: '\x1b[32m',
   lightgreen: '\x1b[92m',
   blue: '\x1b[34m',
   magenta: '\x1b[35m',
   red: '\x1b[31m',
   white: '\x1b[37m',

   bgBlack: '\x1b[40m',
   bgRed: '\x1b[41m\x1b[30m',
   bgGreen: '\x1b[42m\x1b[30m',
   bgYellow: '\x1b[43m\x1b[90m',
   bgBlue: '\x1b[44m',
   bgMagenta: '\x1b[45m',
   bgCyan: '\x1b[46m',
   bgWhite: '\x1b[47m',

   reset: '\x1b[0m',
   bright: '\x1b[1m',
   
   dim: '\x1b[90m', //'\x1b[2m',
   gray: '\x1b[90m',
   grey: '\x1b[90m',

   underscore: '\x1b[4m',
   blink: '\x1b[5m',
   reverse: '\x1b[7m',
   hidden: '\x1b[8m'
};// /COLORS{}

const color = module.exports = function (cColor) { // jshint ignore:line
   var rest = [].slice.call(arguments, 1);

   cColor = cColor || 'reset';

   return ''.concat(COLORS[cColor], rest.join(' '), COLORS.reset);
};// /color()