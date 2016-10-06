import ui.View as View;
import ui.ImageView as ImageView;
import src.views.BoardView as BoardView;
import src.views.ScorePanel as ScorePanel;
import src.views.GameOverView as GameOverView;
import ui.ParticleEngine as ParticleEngine;
import device;


exports = Class(View, function(supr) {
    //max move limit
    this.maxMove = 5;
    //current score goal
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
        
        this.pEngine = new ParticleEngine({
            superview: this,
            width: 1,
            height: 1,
            initCount: 40
        });
        
        this.gameOverView = new GameOverView({
            width : 576,
            height : 1024
        });
        
        this.board.on('BoardView:moveCountChange', this.onMoveCountChange.bind(this));
        this.board.on('BoardView:scoreChange', this.onScoreChange.bind(this));
        this.board.on('BoardView:swapFinish', this.onSwapFinish.bind(this));
        this.board.on('BoardView:gemsClear',this.doSomeParticle.bind(this));
        
        this.gameOverView.on('gameoverview:restart', this.onGameOverRestart.bind(this));
    };
    
    //when any touch at game over screen
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
    
    //score change
    this.onScoreChange = function(){
        this.score.updateScoreText(this.board.score, this.scoreGoals);
    };
    
    //move count change
    this.onMoveCountChange = function(){
        var moveRemains = this.maxMove - this.board.moveCount;
        this.score.updateMoveText(moveRemains);
    };
    
    
    this.doSomeParticle = function(points) {
        for(var i = 0; i < points.length; i++) {
            var particleObjects = this.pEngine.obtainParticleArray(10);
            var point = points[i];
            for (var j = 0; j < 10; j++) {
                var pObj = particleObjects[j];
                var ttl = Math.random() * 300 + 200;
                pObj.ttl = ttl;
                pObj.x = point.x + this.board.style.x;
                pObj.y = point.y + this.board.style.y;
                pObj.dx = Math.random() * 100 - 50;
                pObj.dy = Math.random() * 100;
                pObj.width = 50;
                pObj.height = 50;
                pObj.dwidth = 10;
                pObj.dheight = 10;
                pObj.opacity = 0.5;
				pObj.dopacity = 4000 / ttl;
				pObj.ddopacity = -4 * pObj.dopacity;
                pObj.image = 'resources/images/particles/gleam_white.png';
            }
            this.pEngine.emitParticles(particleObjects);
        }

    }
    
    this.tick = function(dt) {
        // .. tick logic ..
        this.pEngine.runTick(dt);
        // .. more tick logic ..
    };

});