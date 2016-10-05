import ui.View as View;
import src.views.BoardView as BoardView;
import device;


exports = Class(View, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {
        supr(this, 'init', [opts]);
        
        var board = new BoardView({
            superview: this
        });
        
    };

});