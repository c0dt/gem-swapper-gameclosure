import ui.View as View;
import ui.ImageView as ImageView;
import src.views.BoardView as BoardView;
import src.views.ScorePanel as ScorePanel;
import src.views.GameOverView as GameOverView;
import device;


exports = Class(View, function(supr) {

    this.maxMove = 3;
    this.scoreGoals = 1000;
    /**
     * init
     */
    this.init = function(opts) {
        supr(this, 'init', [opts]);
        
        var background = new ImageView({
            superview: this,
            x : 0,
            y : 0,
            width : 576,
            height : 1024,
            image : "resources/images/ui/background.png"
        });
        
        this.board = new BoardView({
            x : 20,
            y : 318,
            superview: this
        });
        
        this.score = new ScorePanel({   
            superview: this,
            layout : 'box',
            centerX : true,
            width : 249,
            height : 166
        });
        
        this.gameOverView = new GameOverView({
            width : 576,
            height : 1024
        });
        
        this.board.on('BoardView:moveCountChange', this.onMoveCountChange.bind(this));
        this.board.on('BoardView:scoreChange', this.onScoreChange.bind(this));
        this.board.on('BoardView:swapFinish', this.onSwapFinish.bind(this));
        
        this.gameOverView.on('gameoverview:restart', this.onGameOverRestart.bind(this));
    };
    
    this.onGameOverRestart = function(){
        this.gameOverView.hide();
        this.board.newgame();
        this.onScoreChange();
        this.onMoveCountChange();
    };
    
    this.showGameOver = function() {
        this.gameOverView.show(this.scoreGoals, this.board.score, this);
    }
    
    this.onSwapFinish = function() {
        var moveRemains = this.maxMove - this.board.moveCount;
        this.onScoreChange();
        this.onMoveCountChange();
        if(this.board.score >= this.scoreGoals || moveRemains <= 0) {
            this.showGameOver();
        }
    }
                 
    this.onScoreChange = function(){
        this.score.updateScoreText(this.board.score, this.scoreGoals);
    };
    
    this.onMoveCountChange = function(){
        var moveRemains = this.maxMove - this.board.moveCount;
        this.score.updateMoveText(moveRemains);
    };

});