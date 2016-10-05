import ui.ImageView as ImageView;
import device;


exports = Class(ImageView, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {
        opts = merge(opts, {
            x : 0,
            y : 0,
            image : "resources/images/ui/background.png"
        });

        supr(this, 'init', [opts]);
    };

});