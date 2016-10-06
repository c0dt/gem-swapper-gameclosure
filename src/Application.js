// devkit imports
import device;
import ui.StackView as StackView;
// user imports
import src.screens.TitleScreen as TitleScreen;
import src.screens.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

  this.initUI = function () {
                     
    var titlescreen = new TitleScreen();
    var gamescreen = new GameScreen();
      
    this.view.style.backgroundColor = '#000000';
      
    this.baseWidth = 576;
    this.baseheight = 1024;

    var rootView = new StackView({
      superview: this,
      x: 0,
      y: 0,
      width: 576,
      height: 1024,
      clip: true,
      scale: device.width / 576
    });
    
    rootView.push(titlescreen);
    
    titlescreen.on('titlescreen:start', function () {
      rootView.push(gamescreen);
      gamescreen.emit('app:start');
    });
      
    gamescreen.on('gamescreen:end', function () {
      rootView.pop();
    });
      
  };
  
  this.launchUI = function () {};
});
