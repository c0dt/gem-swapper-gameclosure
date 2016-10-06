import ui.View as View;
import ui.TextView as TextView;
import device;


exports = Class(View, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {
        supr(this, 'init', [opts]);
        
        var text = new TextView({
              superview: this,
              x: 0,
              y: 100,
              width: 576,
              height : 300,
              text: 'Gem\nSwapper',
              size: 72,
              color : '#ffffff',
              shadowColor: '#999999',
              wrap : true
            });
        
        var touchtostart = new TextView({
              superview: this,
              x: 0,
              y: 1024 - 200,
              width: 576,
              height : 50,
              text: 'TOUCH TO START',
              size: 48,
              color : '#ffffff',
              shadowColor: '#999999'
        });
        
        var startbutton = new View({
          superview: this,
          x: 0,
          y: 0,
          width: 576,
          height: 1024
        });

        startbutton.on('InputSelect', bind(this, function () {
            this.emit('titlescreen:start');
        }));
    };

});