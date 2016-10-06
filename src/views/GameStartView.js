import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import device;


exports = Class(View, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {
        supr(this, 'init', [opts]);
        
//        var header = new ImageView({
//            superview: this,
//            width : 249,
//            height : 166,
//            image : 'resources/images/ui/header.png'
//        });
        
        var gameOverText = new TextView({
            superview: this,
            horizontalAlign : "center",
            width : 222,
            height : 30,
            x : 13,
            y : 108,
            text : 'Game Over',
            size: 30,
            shadowColor: '#999999',
            color : '#ffffff',
        });
    };
    
    
    this.show = function(goal, score) {

        this.overlay = new View({
            superview: this,
            id: 'overlay',
            width: GC.app.baseWidth,
            height: GC.app.baseHeight,
            opacity: 0,
            backgroundColor: '#000000'
        });

//        this.popup = new ImageView(merge(Config.ui.popup, {
//            layout: 'box',
//            x: GC.app.baseWidth / 2 - Config.ui.popup.width / 2,
//            //y: GC.app.baseHeight / 2 - Config.ui.popup.height / 2
//            y: -Config.ui.popup.height
//        }));

        var title = 'Win!'
        var message = 'Your score is:'
        var numbers = score;

        if (goal > score) {
            title = 'Failed!'
            message = 'Your goal is:'
            numbers = goal;
        }

        new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            fontFamily: 'goonies',
            verticalAlign: 'top',
            text: title,
            offsetY: 60,
            size: 100,
            wrap: true
        });

        new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            offsetY: -60,
            fontFamily: 'goonies',
            text: message,
            size: 40,
            wrap: true
        });

        new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            fontFamily: 'geko',
            offsetY: 10,
            text: numbers,
            size: 70,
            wrap: true
        });

        // Anamate overlay and popup
        animate(this.overlay).now({
            opacity: 0.8
        });

//        animate(this.popup).now({
//            y: GC.app.baseHeight / 2 - Config.ui.popup.height / 2
//        })
    };
    
});