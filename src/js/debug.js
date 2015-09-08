/*
 *  ============================================================================
 *  debug()
 *  ============================================================================
 *  Simple function for outputting a message to the console. Switch on by
 *  setting DEBUG to true, switch it off by setting DEBUG to false.
 *  ----------------------------------------------------------------------------
 */
var DEBUG = false;
var DEBUG_SET = 2;
var debug = function( msg, set ) {
    'use strict';
    set = set || 0;
    if (DEBUG && ((set === DEBUG_SET) || (DEBUG_SET === -1))) {
        console.log( msg );
    }
};

