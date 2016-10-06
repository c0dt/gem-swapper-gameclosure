import ui.View as View;
import ui.ImageView as ImageView;
import ui.ViewPool as ViewPool;
import math.geom.Point as Point;
import animate;

import device;

//gem swap board main logic
exports = Class(View, function(supr) {
    this.imageViewPool;
    this.moveCount = 0;
    this.score = 0;
    
    this.gemPrototypes = [
        {
            image : "resources/images/gems/gem_01.png"
        },
        {
            image : "resources/images/gems/gem_02.png"
        },
        {
            image : "resources/images/gems/gem_03.png"
        },
        {
            image : "resources/images/gems/gem_04.png"
        },
        {
            image : "resources/images/gems/gem_05.png"
        }
    ];
    
    //touch swap session
    this.swapSession = undefined;
    
    // gems data holder
    this.gems = [];
    
    //
    this.onInputStart = function(event, point){
        this.startpoint = point;
    };
    
    this.onInputMove = function(event, point){
            
        if(this.moving || this.startpoint == undefined) {
            return;
        }

        var delta = new Point(point.x,point.y).subtract(this.startpoint);

        if(delta.getSquaredMagnitude() > this.MOVE_DELTA) {
            this.moving = true;

            var from = this.pixelToBoardPosition(this.startpoint);
            var to = this.pixelToBoardPositionWithDirection(this.startpoint, delta);

            this.startpoint = undefined;
            this.swapSession = {
                from : from,
                to : to
            };
            this.swap(from,to);
        }
    };
    
    this.onInputSelect = function(event, point){
        this.startpoint = undefined;
    };
    
    /**
     * init
     */
    this.init = function(opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 536,
            height: 536,
            clip : true
          });
        
        this.dirty = true;
        this.MAX_COLUMN = 8;
        this.MAX_ROW = 8;
        this.moving = false;
        this.GemWidth = 66;
        this.GemHeight = 66;
        this.Gap = 1;
        
        this.MOVE_DELTA = (this.GemWidth / 2) * (this.GemWidth / 2);
        
        supr(this, 'init', [opts]);
        
        for(var i = 0; i < this.MAX_ROW; i++) {
            for(var j = 0; j < this.MAX_COLUMN; j++) {
                this.gems.push(undefined);
            }
        }
        
        this.on("InputStart", this.onInputStart.bind(this));
        
        this.on("InputMove", this.onInputMove.bind(this));
        
        this.on("InputSelect", this.onInputSelect.bind(this));
        
        this.imageViewPool = new ViewPool({
			ctor: ImageView,
			initCount: 64,
			initOpts: {
				superview: this,
				width: this.GemWidth,
				height: this.GemHeight,
				image: "resources/images/gems/gem_01.png"
			}
		});
        
        this.newgame();
    };
    
    this.obtainGemFromPool = function(x,y,image) {
        var view = this.imageViewPool.obtainView();
        view.updateOpts({
            superview: this,
            x: x,
            y: y,
            width: this.GemWidth,
            height: this.GemHeight,
            visible: true
        });
        view.setImage(image);
        return view;
    }
    
    //convert board coordinates to pixel coordinates
    this.boardToPixelPosition = function(x,y) {
        var point = new Point(x * (this.GemWidth + this.Gap), y * (this.GemHeight + this.Gap));
        return point;
    }
    
    //convert pixel coordinates to board coordinates
    this.pixelToBoardPosition = function(point) {
        return new Point(Math.floor(point.x / (this.GemWidth + this.Gap)), Math.floor(point.y / (this.GemHeight + this.Gap)));
    }
    
    //convert pixel coordinates to board coordinates with direction
    this.pixelToBoardPositionWithDirection = function(point, direciton) {
        var f = Math.atan2 (direciton.y, direciton.x);
        
        var PIdiv14 = Math.PI / 4;
		var PIdiv34 = 3 * Math.PI / 4;
		var dir = new Point(0,0);
        
		if (f > -PIdiv14 && f < PIdiv14) {
			dir.x = 1;
		} else if (f > PIdiv14 && f < PIdiv34) {
			dir.y = 1;
		} else if (f > -PIdiv34 && f < -PIdiv14) {
			dir.y = -1;
		} else if (f > PIdiv34 || f < -PIdiv34) {
			dir.x = -1;
		}

		return this.pixelToBoardPosition (point).translate(dir);
    }
    
    //swap action
    this.swap = function(from, to) {
        this.fromGem = this.getGem(from);
        var toGem = this.getGem(to);

        this.swapGem(from, to);
        var t = 300;

        //keep touched gem alway in front
        this.fromGem.view.style.zIndex = 10;

        animate(this.fromGem.view, "gemSwapAnimation").now({x: toGem.view.style.x, y : toGem.view.style.y},t,animate.easeOutQuad);
        animate(toGem.view, "gemSwapAnimation").now({x: this.fromGem.view.style.x, y : this.fromGem.view.style.y},t,animate.easeOutQuad);
        animate.getGroup("gemSwapAnimation").on("Finish", function(){

            this.fromGem.view.style.zIndex = 0;
            this.moving = false;
            this.dirty = true;

        }.bind(this));
    }
    
    //swap data
    this.swapGem = function(p1, p2) {
        var index1 = p1.x + p1.y * this.MAX_COLUMN;
        var index2 = p2.x + p2.y * this.MAX_COLUMN;
        
        var tmp = this.gems[index1];
        this.gems[index1] = this.gems[index2];
        this.gems[index2] = tmp;
        
        this.gems[index1].point = p1;
        this.gems[index2].point = p2;
    }
    
    //get gem data
    this.getGem = function(point) {
        return this.gems[point.x + point.y * this.MAX_COLUMN]
    }
    
    //set gem data
    this.setGem = function(gem, point) {
        if(gem != undefined) {
            gem.point = point; 
        }
       this.gems[point.x + point.y * this.MAX_COLUMN] = gem; 
    }
    
    //get matches gems
    this.getMatches = function(gem) {
        var point = gem.point;
        
        var xmatches = [];
        
        xmatches.push(gem);
        
        for(var i = point.x - 1; i >=0; i-- ) {
			var p = new Point (i, point.y);
			var newGem = this.getGem(p);

			if (newGem == undefined || newGem.data != gem.data) {
				break;
			} else {
                newGem.checked = true;
				xmatches.push(newGem);
			}
		}
        
        for(var i = point.x + 1; i < this.MAX_COLUMN; i++) {
			var p = new Point (i, point.y);
			var newGem = this.getGem(p);
			if (newGem == undefined || newGem.data != gem.data) {
				break;
			} else {
                newGem.checked = true;
				xmatches.push(newGem);
			}
		}
        
        if(xmatches.length < 3) {
            xmatches = [];
        }
        
        var ymatches = [];
        ymatches.push(gem);
        
        for(var i = point.y - 1; i >=0; i-- ) {
            var p = new Point (point.x, i);
            var newGem = this.getGem(p);
            if (newGem == undefined || newGem.data != gem.data) {
                break;
            } else {
                newGem.checked = true;
				ymatches.push(newGem);
            }
        }

        for(var i = point.y + 1; i < this.MAX_ROW; i++) {
            var p = new Point (point.x, i);
            var newGem = this.getGem(p);
            if (newGem == undefined || newGem.data != gem.data) {
                break;
            } else {
                newGem.checked = true;
				ymatches.push(newGem);
            }
        }

        
        if(ymatches.length < 3) {
            ymatches = [];
        }
        
        return xmatches.concat(ymatches);
    }
    
    //clear matched gems
    this.clearGems = function() {
		var allCount = 0;
        
		for (var j = 0; j < this.MAX_ROW; j++) {
			for (var i = 0; i < this.MAX_COLUMN; i++) {
				var gem = this.getGem(new Point(i,j));
				if (gem != undefined && !gem.checked) {
					gem.checked = true;
					var gems = this.getMatches (gem);
					var count = gems.length;
					if (count > 0) {
						allCount += count;
						for(var gemIndex in gems) {
                            this.addScore(gems.length);
                            var toRemove = gems[gemIndex];
                            toRemove.view.style.visible = false;
                            toRemove.view.removeFromSuperview();
                            this.imageViewPool.releaseView(toRemove.view);
							this.setGem (undefined, toRemove.point);
						}
					}
				}
			}
		}

		for (var j = 0; j < this.MAX_ROW; j++) {
			for (var i = 0; i < this.MAX_COLUMN; i++) {
                var gem = this.getGem(new Point(i,j));
				if (gem != undefined) {
					gem.checked = false;
				}
			}
		}

		return allCount;
	}
    
    this.addScore = function(count) {
        this.emit('BoardView:scoreChange');
        this.score += count * 10;
    }
    
    //drop gems
    this.dropGems = function() {
        var dropCountMax = 0;
		for (var i = 0; i < this.MAX_COLUMN; i++) {
			var dropCount = 0;
			for (var j = this.MAX_ROW - 1; j >= 0; j--) {
                var point = new Point(i,j);
				var gem = this.getGem(point);
				if (gem == undefined) {
					dropCount++;
				} else if (dropCount > 0) {
                    this.setGem (undefined, point);
					var position = new Point (i, j + dropCount);
					this.setGem (gem, position);
                    
					this.tweenGem (gem.view, position, 1);

					dropCountMax = Math.max(dropCount, dropCountMax);
				}

				if (gem) {
					gem.checked = false;
				}
			}
		}

		return dropCountMax;
    }
    
    //refill gems
    this.refillGems = function() {
        var dropCountMax = 0;
		for (var i = 0; i < this.MAX_COLUMN; i++) {
			var dropCount = 0;
			for (var j = 0; j < this.MAX_ROW; j++) {
                var to = new Point (i, j);
				var gem = this.getGem(to);
				if (gem == undefined) {
					dropCount++;
					
					var from = new Point (i, j - dropCount);
                    
                    var index = Math.floor(Math.random() * 5);
                    var prototype = this.gemPrototypes[index];
                    
					var position = this.boardToPixelPosition (from.x,from.y);
                    
                    var view = this.obtainGemFromPool(position.x,position.y, prototype.image);
                    //zIndex : dropCount
                    this.setGem({
                        data : index,
                        view : view,
                        checked : false
                    }, to)
                    
					this.tweenGem (view, to, 1);
				}
			}
		}

		return dropCountMax;
    }
    
    //tween move gem
    this.tweenGem = function(view, point, t) {
        var to = this.boardToPixelPosition(point.x,point.y);
        animate(view, "dropAnimation").now({x: to.x, y : to.y},t * 1000);
    }
    
    //check board
    this.check = function() {
        var count = this.clearGems();
        
        if(count > 0) {
            if(this.swapSession != undefined) {
                this.moveCount++;
                this.emit('BoardView:moveCountChange');
            }
            this.swapSession = undefined;
            this.moving = true;
            this.dropGems();
            this.refillGems();
            
            animate.getGroup("dropAnimation").on("Finish", function(){
                this.moving = false;
            }.bind(this));
            
        } else {
            if(this.swapSession != undefined) {
                this.swap(this.swapSession.to,this.swapSession.from);
                this.swapSession = undefined;
            } else {
                this.emit('BoardView:swapFinish');
            }
            
            this.dirty = false;
            
        }
    }
    
    this.newgame = function() {
        
        this.removeAllSubviews();
        this.imageViewPool.releaseAllViews();
        
        for(var i = 0; i < this.gems.length; i++) {
            var toRemove = this.gems[i];
            if(toRemove != undefined) {
                toRemove.view.style.visible = false;
                this.imageViewPool.releaseView(toRemove.view);
                this.setGem (undefined, toRemove.point);  
            }
        }
        
        this.moveCount = 0;
        this.score = 0;
        
        for(var i = 0; i < this.MAX_ROW; i++) {
            for(var j = 0; j < this.MAX_COLUMN; j++) {
                var ok = false;
                while(!ok) {
                    var index = Math.floor(Math.random() * 5);
                    var prototype = this.gemPrototypes[index];
                    var p = this.boardToPixelPosition(j,i);
                    var gem = this.obtainGemFromPool(p.x,p.y,prototype.image);
                    var newGem = {
                        point : new Point(j,i),
                        data : index,
                        view : gem,
                        checked : false
                    };

                    var matches = this.getMatches(newGem);

                    if(matches.length == 0) {
                        this.setGem (newGem, newGem.point);
                        ok = true;
                    } else {
                        this.imageViewPool.releaseView(gem);
                    }
                }

            }
        }
    }
    
    //update
    this.tick = function(dt) {
        if(!this.moving && this.dirty) {
            this.check();
        }
    }
});