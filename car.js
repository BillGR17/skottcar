class Car{
	constructor(x,y,width,height,key,maxSpeed=3){
		this.x= x;
		this.y=y;
		this.width=width;
		this.height=height;
		

		this.speed=0;
		this.acceleration = 0.2;
		this.maxSpeed= maxSpeed;
		this.friction = 0.05;
		this.angle= 0;
		this.damaged=false;


		if(key!="DUMMY"){
			this.sensor = new Sensor(this);
		}
		
		this.controls= new Controls(key);

	}
	//frames updates

	update(roadBorders,traffic){
		if(!this.damaged){
			
			this.#move();
			this.polygon = this.#createPolygon();
			this.damaged= this.#assessDamage(roadBorders,traffic);
		}
		/*
		if(this.key){
			this.sensor.update(roadBorders)
		}
		*/
		if(this.sensor){
			this.sensor.update(roadBorders,traffic);
		}
		
		
	}

	#assessDamage(roadBorders,traffic){
		//console.log("here")
		for(let i = 0; i<roadBorders.length;i++){
			if(polyIntersect(this.polygon,roadBorders[i])){
				return true;
			}
		}
		for(let i = 0; i<traffic.length;i++){
			if(polyIntersect(this.polygon,traffic[i].polygon)){
				return true;
			}
		}
		return false;
	}

	#createPolygon(){

		const points=[];
		const rad = Math.hypot(this.width,this.height)/2;
		const alpha = Math.atan2(this.width,this.height);
		points.push({
			x:this.x-Math.sin(this.angle-alpha)*rad*1.1,
			y:this.y-Math.cos(this.angle-alpha)*rad*1.1
		});
		points.push({
			x:this.x-Math.sin(this.angle+alpha)*rad*1.1,
			y:this.y-Math.cos(this.angle+alpha)*rad*1.1
		});
		points.push({
			x:this.x-Math.sin(Math.PI/2+this.angle+alpha)*rad,
			y:this.y-Math.cos(Math.PI/2+this.angle+alpha)*rad
		});
		points.push({
			x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
			y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
		});
		points.push({
			x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
			y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
		});
		points.push({
			x:this.x-Math.sin(-Math.PI/2+this.angle-alpha)*rad,
			y:this.y-Math.cos(-Math.PI/2+this.angle-alpha)*rad
		});
		
		return points;

	}



	#move(){
		//for linear momentum
		if(this.controls.forward){
			this.speed += this.acceleration;
		}
		if(this.controls.reverse){
			this.speed -= this.acceleration;

		}
		
		if(this.speed>this.maxSpeed){
			this.speed=this.maxSpeed;
		}
		if(this.speed<-this.maxSpeed/2){
			this.speed=-this.maxSpeed/2;
		}
		if(this.speed>0){
			this.speed-=this.friction;
		}
		if(this.speed<0){
			this.speed+=this.friction;
		}
		if(Math.abs(this.speed)<this.friction){
			this.speed=0;
		}
		
		//angular momentum

		if(this.speed!=0){
			const flip = this.speed>0?1:-1;
			
			if(this.controls.left){
				this.angle+=0.03*flip;
			}
			if(this.controls.right){
				this.angle-=0.03*flip;
			}
			}

		this.x -= Math.sin(this.angle)*this.speed;
		this.y -= Math.cos(this.angle)*this.speed;
		//this.y-=this.speed;
	}

	draw(ctx,colour){
		if(this.damaged){
			ctx.fillStyle="red";
		}else{
			ctx.fillStyle=colour;
		}
		ctx.beginPath();
		ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
		for(let i=1;i<this.polygon.length;i++){
			ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
		}
		ctx.fill();

		if(this.sensor){
			this.sensor.draw(ctx);
		}
		

	}
}