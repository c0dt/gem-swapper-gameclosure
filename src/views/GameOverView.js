import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import device;
import animate;

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
        
        this.overlay = new View({
            superview: this,
            width: 576,
            height: 1024,
            opacity: 0,
            backgroundColor: '#000000'
        });
        
        this.titleText = new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            fontFamily: 'goonies',
            verticalAlign: 'top',
            text: '',
            offsetY: 150,
            size: 100,
            wrap: true
        });

        this.messageText = new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            offsetY: -60,
            fontFamily: 'goonies',
            text: '',
            size: 40,
            wrap: true
        });

        this.scoreText = new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            //fontFamily: 'geko',
            offsetY: 10,
            text: '',
            size: 70,
            wrap: true
        });
        
        
        this.on('InputSelect', bind(this, function () {
            if(this.showOk) {
                this.emit('gameoverview:restart');    
            }
        }));
    };
    
    
    this.show = function(goal, score, parent) {

        parent.addSubview(this);
        
        this.showOk = false;
        
        var title = 'You Win!'
        var message = 'Your score is:'
        var numbers = score;

        if (goal > score) {
            title = 'Failed!'
            message = 'Your goal is:'
            numbers = goal;
        }

        this.titleText.setText(title);
        this.messageText.setText(message);
        this.scoreText.setText(numbers);

        // Anamate overlay
        animate(this.overlay).now({
            opacity: 0.8
        }).then(function(){
            this.showOk = true;
        }.bind(this));
    };
    
    this.hide = function() {
        // Anamate overlay
        animate(this.overlay).now({
            opacity: 0
        }).then(function(){
            this.removeFromSuperview ();
        }.bind(this));
    }
    
});