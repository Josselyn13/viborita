window.onload = () => {

	const canvasWidth            	    = 900;
	const canvasHeight                  = 600;
	const blockSize               	    = 30;
	const canvas                  	    = document.createElement('canvas');
	const ctx                           = canvas.getContext('2d');
	const widthInBlocks 				= canvasWidth/blockSize;
	const heightInBlocks                = canvasHeight/blockSize;
	const centreX    		                = canvasWidth / 2;
	const centreY			                = canvasHeight / 2;
	let delay;
	let snakee;
	let applee;
	let score;
	let timeout;
								
const init = () => {
		canvas.width                    = canvasWidth;
		canvas.height                   = canvasHeight;
		canvas.style.border             = "30px solid #879ed4";
		canvas.style.margin             = "50px auto";
		canvas.style.display            = "block";
		canvas.style.backgroundColor    = "#f7f086";
		document.body.appendChild(canvas); 
		launch();
}

const launch = () => {

		snakee                          = new Snake([[6,4],[5,4],[4,4]] , "right");
		applee                          = new Apple([10,10]);
		score = 0;
		clearTimeout(timeout);
		delay = 200;
		refreshCanvas();

}

const refreshCanvas = () => {

		snakee.advance();
		if(snakee.checkCollision()){ 
			gameOver ();
		} else { 																						
			if(snakee.isEatingApple(applee)){															
			   score++;																
			   snakee.eatApple          = true;
			   do {
					applee.setNewPosition();
			   }
			   while(applee.isOnSnake(snakee));	

			   if(score % 5 == 0){
			   		speedUp();
			   }
			}
			ctx.clearRect(0,0,canvasWidth, canvasHeight); 
			drawScore();
			snakee.draw();
			applee.draw();
			timeout                     = setTimeout(refreshCanvas,delay);
		}
							
}

const speedUp = () => {
		delay /= 2;
}	

const gameOver = () => {

		ctx.save();
		ctx.font                        = "bold 70px sans-serif";
		ctx.fillStyle                   = "white";
		ctx.textAlign                   = "center";
		ctx.textBaseline                = "middle";
		ctx.strokeStyle                 = "#";
		ctx.lineWidth                   = 5;
		ctx.strokeText("Game Over", centreX,centreY -180);
		ctx.fillText("Game Over",centreX,centreY -180);
		ctx.font                        = "bold 30px sans-serif";
		ctx.strokeText("Presiona la barra espaciadora para volver a jugar", centreX,centreY -120);
		ctx.fillText("Presiona la barra espaciadora para volver a jugar",centreX,centreY -120);
		ctx.restore();
}

const drawScore = () => {

		ctx.save();
		ctx.font                        = "bold 200px sans-serif";
		ctx.fillStyle                   = "#5663f0";
		ctx.textAlign                   = "center";
		ctx.textBaseline                = "middle";
		ctx.fillText(score.toString(),centreX,centreY);
		ctx.restore();
}

const drawBlock = (ctx, position) => {

	const x 	                            = position[0] * blockSize;
	const y   	                        = position[1] * blockSize;
		ctx.fillRect(x,y,blockSize,blockSize);
}

class Snake {
	constructor(body, direction){
	this.body                       = body; 
	this.direction                  = direction;
	this.ateApple				    = false;
	}
		
	draw(){
		ctx.save();
		ctx.fillStyle                   = "#33d42a"; 
		for(let i= 0; i < this.body.length; i++) {
			drawBlock(ctx, this.body[i]); 
		}				
		ctx.restore(); 
	};
	advance(){
		const nextPosition                = this.body[0].slice();
		switch(this.direction){
			case "left":
			nextPosition[0]            -= 1;
			break;
			case "right":
			nextPosition[0]            += 1;
			break;
			case "down":
			nextPosition[1]            += 1;
			break;
			case "up":
			nextPosition[1]            -= 1;
			break;
			default:
			throw("Invalid Direction"); 
		}						
		this.body.unshift(nextPosition);
		if(!this.eatApple)
			this.body.pop();
		else
			this.eatApple               = false;
	};
	setDirection(newDirection){
	let allowedDirections;
		switch(this.direction){
			case "left": 
			case "right": 
			allowedDirections           = ["up", "down"];
			break;
			case "down": 
			case "up": 
			allowedDirections           = ["left", "right"];
			break;
			default:
			throw("Invalid Direction");
		}
		if(allowedDirections.indexOf(newDirection) > -1){
			this.direction              = newDirection;
		}
							
	};

	checkCollision(){
	let wallCollision        	        = false;
	let snakeCollision        	        = false;
	const head                  	    = this.body[0];
	const rest                  	    = this.body.slice(1);
	const snakeX                	    = head[0];
	const snakeY                	    = head[1];
	const minX                          = 0;
	const minY     	                    = 0;
	const maxX           	            = widthInBlocks -1;
	const maxY            	            = heightInBlocks -1;
	const isNotBetweenHorizontalWalls	    = snakeX < minX || snakeX > maxX;
	const isNotBetweenVerticalWalls  	    = snakeY < minY || snakeY > maxY;
							
		if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
			wallCollision               = true;
		}				
		for (let i= 0; i < rest.length; i++) {
			if (snakeX === rest[i][0] && snakeY === rest[i][1]){
				snakeCollision      	= true;	
			}
		}
		return wallCollision || snakeCollision;
	};

	isEatingApple(appleToEat){
	const head                        	= this.body[0];
		if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
		return true;
		else
		return false; 
	}
							
} 

class Apple{
	constructor(position){
	this.position                   	= position;
}

	draw(){
	const radius                   	    = blockSize/2;
	const x                     	    = this.position[0]*blockSize + radius;
	const y                      	    = this.position[1]*blockSize + radius;
		ctx.save();
		ctx.fillStyle    			    = "#db2c2c";
		ctx.beginPath();
		ctx.arc(x,y, radius, 0, Math.PI*2, true);
		ctx.fill();
		ctx.restore();
	};
	setNewPosition(){
	const newX                       	    = Math.round(Math.random() * (widthInBlocks -1));
	const newY                        	= Math.round(Math.random() * (heightInBlocks -1));
	this.position                  	    = [newX, newY];
	};

	isOnSnake(snakeToCheck){
	let isOnSnake                  	    = false;
		for(let i = 0; i < snakeToCheck.body.length; i++){
			if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
					isOnSnake       	= true;
			}
		}
		return isOnSnake;
	};

}	

	document.onkeydown =(e) => {
	const key                             = e.keyCode;
	let newDirection;
		switch(key){
			case 37:
			newDirection                    = "left";
			break;
			case 38:
			newDirection                    = "up";
			break;
			case 39:
			newDirection                    = "right";
			break;
			case 40:
			newDirection                    = "down";
			break;
			case 32:
			launch();
			return;
			default:
			return;
		}
		snakee.setDirection(newDirection);
	};
	
	init();
	
}