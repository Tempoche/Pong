$(document).ready(function(){
	//set up canvas
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	var gameOver = true;

	//setting up constants
	const PI = Math.PI;
	const HEIGHT = canvas.height;
	const WIDTH = canvas.width;
	const upKey = 38, downKey = 40;

	//user input
	var keyPressed = null;

	//set up game objects
	var player = {
		x: null,
		y: null,
		width: 20,
		height: 100,
		update:function(){
			if (keyPressed == upKey && this.y > 0){
				this.y-=10
			}
			if (keyPressed == downKey && this.y < HEIGHT-this.height){
				this.y+=10
			}
		},
		draw:function(){
			context.fillRect(this.x,this.y,this.width,this.height);
		} 
	}

	var ai = {
		x: null,
		y: null,
		width: 20,
		height: 100,
		update:function(){
			if (ball.y < this.y + this.height/2 && this.y > 0){
				this.y-=10
			}
			if (ball.y > this.y + this.height/2 && this.y < HEIGHT - this.height){
				this.y+=10
			}
		},
		draw:function(){
			context.fillRect(this.x,this.y,this.width,this.height);
		} 
	}

	var ball = {
		x: null,
		y: null,
		size: 20,
		speedx: null,
		speedy: null,
		speed: 10,
		update:function(){
			this.x += this.speedx
			this.y += this.speedy
			if (this.y + this.size >= HEIGHT || this.y < 0){
				this.speedy*=-1
				if (this.y + this.size >= HEIGHT && this.speedy>0){
					this.y -= 10
				}
				if (this.y < 0 && this.speedy<0){
					this.y += 10
				}
			}

			let other = ball.speedx < 0? player: ai;
			let collided = checkCollision(ball,other)

			if (collided){
				let n = (this.y + this.size - other.y) / (other.height + this.size);
				let phi = 0.25*PI*(2*n-1)
				this.speedx = this.speed * Math.cos(phi)
				this.speedy = this.speed * Math.sin(phi)
				if (other == ai) this.speedx *= -1
			}
			if (this.x + this.size < 0 || this.x > WIDTH){
				gameOver = true
				$("button").fadeIn();
				if (this.x + this.size < 0){
					$("h1").html('You Lose!')
				} else {
					$("h1").html('You Win!')
				}
			}
		},
		draw:function(){
			context.fillRect(this.x,this.y,this.size,this.size);
		} 
	}

	function checkCollision(a,b) {

		return(
			a.x < b.x + b.width &&
			a.y < b.y + b.height &&
			b.x < a.x + a.size &&
			b.y < a.y + a.size
		)
	}

	function main(){
		init();

		var loop = function(){
			update();
			draw();
			window.requestAnimationFrame(loop,canvas);
		}
		window.requestAnimationFrame(loop,canvas);
	}

	function init(){
		gameOver = false;
		$('h1').html('Pong')

		// move player and ai to middle

		player.x = 20;
		player.y = (HEIGHT - player.height) / 2
		ai.x = (WIDTH - ai.width - 20)
		ai.y = (HEIGHT - ai.height) / 2

		// set up ball in middle

		ball.x = (WIDTH - ball.size) / 2
		ball.y = (HEIGHT - ball.size) / 2

		ball.speedx = ball.speed

		// random direction
		if (Math.round(Math.random())) {
			ball.speedx*=-1
		}
		ball.speedy=0;
	}

	function update(){
		player.update()
		ai.update()
		if (gameOver == false){
			ball.update()
		}

	}

	function draw(){
		context.fillStyle = "black";
		context.fillRect(0,0,WIDTH,HEIGHT);
		context.save;
		context.fillStyle = "white";
		player.draw();
		ai.draw();
		ball.draw();

		//draw line
		let w = 4;
		let x = (WIDTH - w)/2;
		let y = 0;
		let step = HEIGHT/15;
		while(y<HEIGHT){
			context.fillRect(x,y+step*0.25,w,step*0.5)
			y+=step;
		}

		context.restore();
		console.log("test");
	}

	//recognize key event
	$(document).on("keyup", function(){
		keyPressed=null;
	});

	$(document).on("keydown", function(e){
		keyPressed = e.which;
	});

	$("button").on('click', function(){
		$(this).hide();
		init()
	})

	//call main function
	main();
})