/* 
 *  Danger, Will Robinson -- (sorry, wrong show...) -- crufty code ahead! 
 */
var Tardis = function(context, x, y, scale) {

    var self = {

        setup: function(context, x, y, scale)
        {
            self.context = context;
            self.start_x = x;
            self.start_y = y;
            self.scale = scale;
            self.alpha = 0.0;
        },
    
        update: function()
        {
        },
    
        draw: function(alpha)
        {
            self.alpha = alpha;
            var x = self.start_x;
            var y = self.start_y;
            
            var filldarkblue = 'rgba(0, 0, 128, ' + self.alpha + ')';
            var fillglass = 'rgba(127, 127, 200,' + self.alpha + ')';
            var fillwhite = 'rgba(200, 200, 200, ' + self.alpha + ')';
            var fillblack = 'rgba(0, 0, 0, ' + self.alpha + ')';
            self.context.strokeStyle = fillblack;
    
            var mid = x + (22 * self.scale);
    
            self.context.font = (self.scale * 2) + "px Arial";
    
            self.context.beginPath();
    
            // Light
            w = 2.25 * self.scale;
            h = 0.25 * self.scale;
            x = mid - (w / 2);
            // y = 2 * self.scale;
            self.context.fillStyle = filldarkblue;
            self.context.fillRect(x, y, w, h);
            self.context.rect(x, y, w, h);
            self.context.stroke();
    
            y = y + h;
            w = 2.00 * self.scale;
            h = 2.25 * self.scale;
            x = x + (0.125 * self.scale);
            self.context.fillStyle = fillglass;
            self.context.fillRect(x, y, w, h);
            self.context.rect(x, y, w, h);
            self.context.stroke();
    
            y = y + h;
            w = 2.25 * self.scale;
            h = 0.5 * self.scale;
            x = mid - (w / 2);
            self.context.fillStyle = filldarkblue;
            self.context.fillRect(x, y, w, h);
            self.context.rect(x, y, w, h);
            self.context.stroke();
    
            // Roof
            y = y + h;
            w = 18.25 * self.scale;
            h = 1.5 * self.scale;
            x = mid - (w / 2);
            self.context.fillRect(x, y, w, h);
            self.context.rect(x, y, w, h);
            self.context.stroke();
    
            y = y + h
            w = 22.00 * self.scale;
            h = 1.5 * self.scale;
            x = mid - (w / 2);
            self.context.fillRect(x, y, w, h);
            self.context.rect(x, y, w, h);
            self.context.stroke();
    
            // Main box
            var y1 = y + h
            w = 23.75 * self.scale;
            h = 44.00 * self.scale;
            x = mid - (w / 2);
            self.context.fillRect(x, y1, w, h);
            self.context.rect(x, y1, w, h);
            self.context.stroke();
    
            // Sign box
            y = y1 + (0.5 * self.scale)
            w = 22.00 * self.scale;
            h = 3.00 * self.scale;
            x = mid - (w / 2) - (2 * self.scale);
            self.context.fillRect(x, y, w + (4 * self.scale), h);
            self.context.rect(x, y, w + (4 * self.scale), h);
            self.context.stroke(); 
    
            // Sign
            x = mid - (w / 2);
            var bw = w - ((2.5 * self.scale) * 2);
            var bh = h - ((0.25 * self.scale) * 2);
            self.context.fillStyle = fillblack;
            self.context.fillRect(x + (2.5 * self.scale), y + (0.25 * self.scale), bw, bh); 
    
            self.context.fillStyle = fillwhite;
            self.context.fillText(" POLICE   BOX", x + (3.0 * self.scale), y + (2.25 * self.scale));
    
            self.context.fillStyle = filldarkblue;
            var doorTop = y + h + (1.5 * self.scale);
    
            var door = function()
            {
                w = 9.00 * self.scale;
                h = 38.00 * self.scale;
                self.context.fillStyle = filldarkblue;
                self.context.fillRect(x, y, w, h);
                self.context.rect(x, y, w, h);
                self.context.stroke();
        
                // Window Panel
                y = y + (1.5 * self.scale);
                x = x + (1.5 * self.scale);
                w = 6.0 * self.scale;
                h = 7.75 * self.scale;
                self.context.fillStyle = fillglass;
                self.context.fillRect(x, y, w, h);
                self.context.rect(x, y, w, h);
                self.context.stroke();
        
                // Window cross-pieces
                self.context.beginPath();
                var ly = y + 1;
                var lx = x + (2.0 * self.scale);
                var lh = h - 2;
                var lw = w - 2;
        
                // -- vertical
                self.context.moveTo(lx, ly);
                self.context.lineTo(lx, ly + lh);
        
                lx = lx + (2.0 * self.scale);
                self.context.moveTo(lx, ly);
                self.context.lineTo(lx, ly + lh);
        
                // -- horizontal
                lx = x + 1;
                ly = ly + (2.0 * self.scale);
                self.context.moveTo(lx, ly);
                self.context.lineTo(lx + lw, ly);
        
                ly = ly + (3.0 * self.scale);
                self.context.moveTo(lx, ly);
                self.context.lineTo(lx + lw, ly);
        
                self.context.strokeStyle = fillwhite;
                self.context.lineWidth = 0.5 * self.scale;
                self.context.stroke();
        
                self.context.beginPath();
                self.context.lineWidth = (1.0 * self.scale);
                self.context.strokeStyle = fillblack;
        
                // Inset panels
                for (var i = 0; i < 3; i++)
                {
                    y = y + h + (1.5 * self.scale);
                    self.context.fillStyle = filldarkblue;
                    self.context.fillRect(x, y, w, h);
                    self.context.rect(x, y, w, h);
                    self.context.stroke();
                }
            }
    
            // Left door
            x = mid - (9.00 * self.scale);
            y = doorTop;
            door(mid - (9.00 * self.scale), doorTop);
    
            // Right door
            x = mid;
            y = doorTop;
            door(mid, doorTop);
    
            // Base
            y = doorTop + (39.0 * self.scale);
            w = 27.0 * self.scale;
            h = 0.75 * self.scale;
            x = mid - (w / 2);
            self.context.fillRect(x, y, w, h);
            self.context.rect(x, y, w, h);
            self.context.stroke();
        }
    };
    self.setup(context, x, y, scale);
    return self;
}
