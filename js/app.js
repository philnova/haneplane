//refactor for responsive design??

$(document).click(function(loc) {
  var x = loc.pageX;
  var y = loc.pageY;

  logClicks(x,y);
  player.handleClick();
});

var soundCrash = new Audio('media/smash.wav');
var soundVroom = new Audio('media/vroom.wav');
var soundOuch = new Audio('media/ouch.wav');
var soundDing = new Audio('media/ding.mp3');
var soundYay = new Audio('media/yay.wav');

clickLocations = [];
function logClicks(x,y) {
  clickLocations.push(
    {
      x: x,
      y: y
    }
  );
  //console.log('x location: ' + x + '; y location: ' + y);
}


function getRandomInt (min, max) {
    //inclusive on both max and min
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

////////////////////////////////////
// pipe functions

var PipeDefaults = {
    'minX' : -10,
    'dX' : -5,
    'minY' : 300,
    'maxY' : 500,
    'pipeGap' : 600,
    'image' : 'media/pipe_cropped.png',
    'top_image' : 'media/flippedpipe_cropped.png',
    'minX' : -300,
    'width' : 150,
    'height' : 300,
    'tolerance' : 25,
    'start_position_a' : 1000,
    'start_position_b' : 1700,
    'offset' : 1300, //distance pipes jump to the right once they move off the screen to the left
    'dx_difficulty_boost' : -1,
    'gap_difficulty_boost' : -20
}

var Pipe = function(x,dx) {
    this.gap = PipeDefaults.pipeGap;
    this.image = PipeDefaults.image;
    this.top_image = PipeDefaults.top_image;
    this.x = x;
    this.dx = dx;
    this.y = getRandomInt(PipeDefaults.minY, PipeDefaults.maxY);
    this.topY = this.y - this.gap;
    this.minX = PipeDefaults.minX;
    this.passed = 0; //flag indicating whether this pipe has already been passed by the player
    this.size_x = PipeDefaults.width;
    this.size_y = PipeDefaults.height;
    this.tolerance = PipeDefaults.tolerance;
    this.offset = PipeDefaults.offset;

}


Pipe.prototype.update = function() {
    this.x = this.x + this.dx;
    if (this.x < this.minX) {
        this.x += this.offset;
        this.y = getRandomInt(PipeDefaults.minY, PipeDefaults.maxY);
        this.topY = this.y - PipeDefaults.pipeGap;
        this.passed = 0;
    }
}

Pipe.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y, this.size_x, this.size_y);
    ctx.drawImage(Resources.get(this.top_image), this.x, this.topY, this.size_x, this.size_y);
}

Pipe.prototype.stop = function() {
    this.dx = 0;
}

var checkCollision = function(player, pipe) {
    //is player x overlapping the pipe's x?
    if (player.x + player.size_x >= pipe.x & player.x <= pipe.x + pipe.size_x) {
        //is the player's y overlapping the bottom pipe?
        if (player.y + player.size_y - pipe.tolerance >= pipe.y){
            //crash with bottom pipe
            player.pipeCrash();
        }
        //is the player's y overlapping the top pipe?
        else if (player.y + pipe.tolerance <= pipe.topY + pipe.size_y){
            //crash with top pipe
            player.pipeCrash();
        }
    }
    return 0;
 
}

////////////////////////////////////
// backdrop functions


var BackdropDefaults = {
    "image" : 'media/backdrop1.jpg',
    "startX" : 0,
    "dX" : -5,
    "x_reset" : -2200

}

var Backdrop = function() {
    this.image = BackdropDefaults.image;
    this.startX = BackdropDefaults.startX;
    this.x_reset = BackdropDefaults.x_reset;
    this.x = BackdropDefaults.startX;
    this.dx = BackdropDefaults.dX;
    this.y = 0;
}


Backdrop.prototype.update = function() {
    this.x = this.x + this.dx;
    if (this.x < this.x_reset) {
        this.x = this.startX;
    }
}

Backdrop.prototype.render = function() {
    ctx.drawImage(Resources.get(BackdropDefaults.image), this.x, this.y)
}

Backdrop.prototype.stop = function() {
    this.dx = 0;
}

////////////////////////////////////////////////////////
// player functions

var high_score = 0;

var PlayerDefaults = {
    "X" : 100,
    "startY" : 50,
    "minY" : 0,
    "maxY" : 450,
    "velocity" : 0,
    "acceleration" : 0.4,
    "sprite" : 'media/happy_plane.png',
    "sadSprite" : 'media/sad_plane.png',
    "soundDing" : 'media/ding.mp3',
    "soundVroom" : 'media/vroom.wav',
    "soundSmash" : 'media/smash.wav',
    "sizeX" : 200,
    "sizeY" : 150,
    "clickJump" : -7.5
}

// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.crashed = 0; //flag to determine whether player is active
    this.pipeCrashed = 0;
    this.groundCrashed = 0;
    this.sprite = 0;
    this.x = PlayerDefaults.X;
    this.y = PlayerDefaults.startY;
    this.velocity = PlayerDefaults.velocity;
    this.acceleration = PlayerDefaults.acceleration;
    this.score = 0;
    this.size_x = PlayerDefaults.sizeX;
    this.size_y = PlayerDefaults.sizeY;
    this.max_y = PlayerDefaults.maxY;
    this.click_jump = PlayerDefaults.clickJump;
    this.difficulty = 0;
};

Player.prototype.update = function() {
    this.y = this.y + this.velocity;
    if (this.y > this.max_y) {
        this.groundCrash();
    }

    this.velocity = this.velocity + this.acceleration;
};

Player.prototype.pipeCrash = function() {
    if (this.pipeCrashed == 0){
        this.crash();
        this.pipeCrashed = 1;
        gameCrash();
        soundOuch.play();
    }
}

Player.prototype.groundCrash = function() {
    if (this.groundCrashed == 0){
        this.groundCrashed = 1;
        this.crash();
        gameCrash();
        soundCrash.play();
        this.velocity = 0;
        this.acceleration = 0;
    }
}


Player.prototype.crash = function() {
    this.crashed = 1;
}


Player.prototype.detectCollision = function(other) {
    return detectCollisions(player, other);
}

Player.prototype.render = function() {
    if (this.crashed == 0){
        ctx.drawImage(Resources.get(PlayerDefaults.sprite), this.x, this.y, this.size_x, this.size_y);
    }
    else if (this.crashed == 1){
        ctx.drawImage(Resources.get(PlayerDefaults.sadSprite), this.x, this.y, this.size_x, this.size_y)
    }
};

Player.prototype.handleClick = function() {
    if (this.crashed == 0){
        this.velocity = this.click_jump;
        soundVroom.play();
    }
    else if (this.crashed == 1){
        gameReset();
    }
};

////////////////////////////////////////////////////////
// helper functions

var gameCrash = function() {
    backdrop.stop();
    for (var i = 0; i < pipeArray.length; i++){
        pipeArray[i].stop();
    }

}

var updateDifficulty = function(player, pipe){
    if (player.crashed == 0) {
        if (player.difficulty < 5) {
        offset = player.difficulty;
    }
    else {
        offset = 5;
    }
    pipe.dx = PipeDefaults.dX + (PipeDefaults.dx_difficulty_boost * offset);
    pipe.gap = PipeDefaults.pipeGap + (PipeDefaults.gap_difficulty_boost * offset);
    }
    
}

var updateScore = function(player, pipe) {
    if (player.x > pipe.x & pipe.passed == 0) {
        player.score += 1;
        if (player.score % 5 == 0) {
            player.difficulty += 1;
        }
        //console.log(player.difficulty);
        //soundDing.play();
        soundYay.play();
        pipe.passed = 1;
    }
    if (player.score > high_score){
        high_score = player.score;
    }
}

var gameReset = function() {
    player = new Player();
    backdrop = new Backdrop();
    pipeArray = [new Pipe(PipeDefaults.start_position_a, PipeDefaults.dX), new Pipe(PipeDefaults.start_position_b, PipeDefaults.dX)];
}

////////////////////////////////////////////////////////
// instantiate objects

var player = new Player();
var backdrop = new Backdrop();
var pipeArray = [new Pipe(PipeDefaults.start_position_a, PipeDefaults.dX), new Pipe(PipeDefaults.start_position_b, PipeDefaults.dX)];


