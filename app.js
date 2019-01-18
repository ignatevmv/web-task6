var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

var figures = [];

function drawBack(ctx, start_color, end_color, width, height){
	ctx.save();
	var g = ctx.createLinearGradient(0, 0, 0, height);
	g.addColorStop(1, start_color);
	g.addColorStop(0, end_color);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, width, height);
	ctx.restore();
}

function drawFigures(ctx){
	for(var i = 0; i < figures.length; i++){
		figures[i].draw(ctx);
	}
}

const TYPE_FIGURE = 0;
const TYPE_BALL = 1;
const TYPE_RECT = 2;
const TYPE_TRIANGLE = 3;

TFigure = new Class({
	posX: 0,
	posY: 0,
	dir: -1,
	type: TYPE_FIGURE,
	color: 'orange',
	initialize: function(_posX, _posY){
		this.posX = _posX;
		this.posY = _posY;
		this.color = 'rgb('+Math.floor(Math.random() * 256)+','+Math.floor(Math.random()*256)
		+','+Math.floor(Math.random() * 256)+')';
	},
	draw: function(ctx){},
	move: function(speed){
		with(this){
			if(dir != -1){
				if(dir == UP) posY -= SPEED;
				else if(dir == DOWN) posY += SPEED;
				else if(dir == LEFT) posX -= SPEED;
				else if(dir == RIGHT) posX += SPEED;
			}
		}
	},
	resize: function(){}
});

TBall = new Class({
	Extends: TFigure,
	type: TYPE_BALL,
	radius: 5,
	initialize: function(_posX, _posY) {
		this.parent(_posX, _posY); 
		this.radius = 5 + Math.random() * 25;
	},
	colorGradient: function(ctx){
		with (this){
			var gradient = ctx.createRadialGradient(posX + radius / 4, posY - radius / 6, radius / 8, posX, posY, radius);
			gradient.addColorStop(0, '#fff');
			gradient.addColorStop(0.85, color);
			return gradient;
		}
	},
	draw: function(ctx){
		with (this){
			ctx.fillStyle = colorGradient(ctx);
			ctx.beginPath();
			ctx.arc(posX, posY, radius, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
		}
	},
	resizeTo: function(max_width, max_height){
		if(width < max_width) width += 3;
		if(height < max_height) height += 3;
	}
});

TRect = new Class({
	Extends: TFigure,
	type: TYPE_RECT,
	width: 50,
	height: 50,
	initialize: function(_posX, _posY, _width, _height){
		this.parent(_posX, _posY);
		this.width = _width;
		this.height = _height;
	},
	colorGradient: function(ctx){
		with (this){
			var gradient = ctx.createLinearGradient(0, 0, 20, 0);
			gradient.addColorStop(0, "#fff");
			gradient.addColorStop(1, color);
			return gradient;
		}
	},
	draw: function(ctx){
		with(this){
			ctx.fillStyle = colorGradient(ctx);
			ctx.fillRect(posX, posY, width, height);
		}
	}
});

TTriangle = new Class({
	Extends: TFigure,
	type: TYPE_TRIANGLE,
	width: 50,
	height: 50,
	points: [],
	initialize: function(_posX, _posY){
		this.points = [
			{x: _posX, y: _posY},
			{x: _posX + 20, y: _posY + 30},
			{x: _posX - 20, y: _posY + 30}
		];
		this.parent(_posX, _posY);
	},
	colorGradient: function(ctx){
		with (this){
			var gradient = ctx.createLinearGradient(0, 0, 20, 0);
			gradient.addColorStop(0, "#fff");
			gradient.addColorStop(1, color);
			return gradient;
		}
	},
	draw: function(ctx){
		with(this){
			ctx.beginPath();
			ctx.fillStyle = colorGradient(ctx);
			ctx.moveTo(posX, posY);
			ctx.lineTo(points[1].x, points[1].y);
			ctx.lineTo(points[2].x, points[2].y);
			ctx.closePath();
			ctx.fill();
		}
	},
	move: function(){
		with(this){
			if(dir == UP){
				posY -= 4;
				points[1].y -= 3;
				points[2].y -= 3;
				points[1].x += 1/2;
				points[2].x -= 1/2;
			}else if(dir == DOWN){
				posY += 3;
				points[1].y += 4;
				points[2].y += 4;
				points[1].x += 1/2;
				points[2].x -= 1/2;
			}else if(dir == LEFT){
				posY -= 2;
				posX -= 3;
				points[1].x -= 2;
				points[2].x -= 4;
				points[1].y += 1/2;
				points[2].y += 1/2;
			}else if(dir == RIGHT){
				posY -= 2;
				posX += 3;
				points[1].x += 4;
				points[2].x += 2;
				points[1].y += 1/2;
				points[2].y += 1/2;
			}
		}
	}
});

function drawOnClick(event){
	var figure;
	var ftype = Math.floor(Math.random() * 3);
	if(ftype == 0){
		figure = new TRect(event.x - 25, event.y - 25, 30, 30);
	}else if(ftype == 1){
		figure = new TBall(event.x, event.y);		
	}else if(ftype == 2){
		figure = new TTriangle(event.x, event.y);		
	}
	figure.draw(ctx);
	figures.push(figure);
}

const SPEED = 3;

function move(dir){
	drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
	for(var i = 0; i < figures.length; i++){
		if(dir < 4){
			figures[i].dir = dir;
		}else if(dir == CHAOS){
			figures[i].dir = Math.floor(Math.random() * 4);
		}
		if(figures[i].type == TYPE_BALL){

			figures[i].radius += 0.25;
			figures[i].move();
			if(figures[i].radius > 30) figures.splice(i, 1);
		}else if(figures[i].type == TYPE_RECT){
			figures[i].width = figures[i].height += 0.5;
			figures[i].move();
			if(figures[i].width > 50) figures.splice(i, 1);
		}else if(figures[i].type == TYPE_TRIANGLE){
			figures[i].move();
			if(figures[i].points[1].x - figures[i].points[2].x > 100) figures.splice(i, 1);
		}
	}
	drawFigures(ctx);
}

var timer;

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const RAND = 4;
const CHAOS = 5;

function start_move(dir){
	clearInterval(timer);
	if(dir == RAND)
	{
		for(var i = 0; i < figures.length; i++){
			figures[i].dir = Math.floor(Math.random() * 4);
		}
	}
	timer = setInterval('move(' + dir + ');', 50);
}

function init(){
	drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
	for(var i = 0; i < 10; i++){
		var ball = new TBall(10 + Math.random() * (canvas.width - 30),
					10 + Math.random() * (canvas.height - 30));
		figures.push(ball);
	}
	drawFigures(ctx);
}

function cancel_move(){

	clearInterval(timer);
}

if(canvas.getContext){
	init();
}