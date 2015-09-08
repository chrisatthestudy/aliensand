/*
 *  ============================================================================
 *  PixelMap()
 *  ============================================================================
 *  Object for handling the direct pixel manipulation of the canvas. This takes
 *  a section of the canvas (defined by x, y, w, h) and allows the pixels
 *  within it to be set or cleared. Pixel positions within the PixelMap are
 *  defined by the u, v variables.
 *  ----------------------------------------------------------------------------
 */
//{{{
var PixelMap = function( options ) {
    'use strict';
    
    // The actual object representing this function is assigned to 'self', 
    // which is returned from this function so that the returned value is
    // effectively an alias for PixelMap.self.
    var self = {
        
        // setup() performs all the necessary initialisation
        setup: function( options ) {
            debug("PixelMap.setup()", 1);
            try {
                self.x = options.x || 0;
                self.y = options.y || 0;
                self.w = options.w || 8;
                self.h = options.h || 8;
                
                self.context = options.context;

                // Create an internal imageData object  
                self.frame = self.context.createImageData(self.w, self.h);
                self.length = self.frame.data.length / 4;
                debug("PixelMap.length=" + self.length, 1);
            }
            catch(e) {
                debug("PixelMap.setup error: " + e.Message, 1);
            }
        },
        
        update: function( ) {
            debug("PixelMap.update()");
        },

        set: function(u, v, color) {
            try {
                var idx = ((v * self.w) + u) * 4;
                self.frame.data[idx] = color.r;
                self.frame.data[idx + 1] = color.g;
                self.frame.data[idx + 2] = color.b;
                self.frame.data[idx + 3] = color.a || 255;
            }
            catch(e) {
                debug("PixelMap.set error: " + e.Message, 1);
            }
        },
        
        get: function(u, v) {
            try {
                var idx = ((v * self.w) + u) * 4;
                var r = self.frame.data[idx];
                var g = self.frame.data[idx + 1];
                var b = self.frame.data[idx + 2];
                var a = self.frame.data[idx + 3];
                return { r: r, g: g, b: b, a: a };
            }
            catch(e) {
                debug("PixelMap.get error: " + e.Message, 1);
            }
        },
        
        clear: function( color ) {
            try {
                var idx;
                var i;
                for (i = 0; i < self.length; i++) {
                    idx = i * 4;
                    this.frame.data[idx] = color.r;
                    this.frame.data[idx + 1] = color.g;
                    this.frame.data[idx + 2] = color.b;
                    this.frame.data[idx + 3] = color.a;
                }
            }
            catch(e) {
                debug("PixelMap.clear error: " + e.Message, 1);
            }
        },
        
        // draw() renders the object on-screen
        draw: function( ) {
            debug("PixelMap.draw()");
            try {
                // Copy the pixel map to the main canvas  
                self.context.putImageData(self.frame, self.x, self.y);
            }
            catch(e) {
                debug("PixelMap.draw error: " + e.Message, 1);
            }
        }
    };

    // Call our setup() function, passing on any options that were passed to
    // the function
    self.setup( options );
    return self;
};
//}}}
