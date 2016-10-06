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
        
        var header = new ImageView({
            superview: this,
            width : 249,
            height : 166,
            image : 'resources/images/ui/header.png'
        });
        
        this.moveText = new TextView({
            superview: this,
            verticalAlign : 'right',
            horizontalAlign : 'center',
            width : 222,
            height : 35,
            x : 13,
            y : 73,
            text : 'Move : 10',
            size: 30,
            shadowColor: '#999999',
            color : '#ffffff'
        });
        
        this.scoreText = new TextView({
            superview: this,
            horizontalAlign : "center",
            width : 222,
            height : 30,
            x : 13,
            y : 108,
            text : '0/99999',
            size: 30,
            shadowColor: '#999999',
            color : '#ffffff',
        });
    };

    this.updateMoveText = function(move) {
        this.moveText.setText('Move : ' + move);
    }
    
    this.updateScoreText = function(score, targetscore) {
        this.scoreText.setText( score + '/' + targetscore);
    }
});