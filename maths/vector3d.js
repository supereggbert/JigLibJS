//Vector3d replacement

(function(jigLib){
	/**
	* @author Paul Brunt
	*/
	var Vector3D=function(x,y,z,w){
		if(x) this.x=x;
		if(y) this.y=y;
		if(z) this.z=z;
		if(w)	this.w=w;
	}
	Vector3D.prototype.x=0;
	Vector3D.prototype.y=0;
	Vector3D.prototype.z=0;
	Vector3D.prototype.w=0;
	
	Vector3D.prototype.add=function(v){
		return new Vector3D(this.x+v.x,this.y+v.y,this.z+v.z,this.w+this.w);
	}
	
	Vector3D.prototype.subtract=function(v){
		return new Vector3D(this.x-v.x,this.y-v.y,this.z-v.z,this.w-this.w);
	}
	
	Vector3D.prototype.decrementBy=function(v){
		this.x-=v.x;
		this.y-=v.y;
		this.z-=v.z;
		this.w-=v.w;
	}
	
	Vector3D.prototype.IncrementBy=function(v){
		this.x+=v.x;
		this.y+=v.y;
		this.z+=v.z;
		this.w+=v.w;
	}
	
	Vector3D.prototype.dotProduct=function(v){
		return this.x*v.x+this.y*v.y+this.z*v.z;
	}
	
	Vector3D.prototype.crossProduct=function(v){
		return new Vector3D(this.y*v.z-this.z*v.y,this.z*v.x-this.x*v.z,this.x*v.y-this.y*v.x)
	}
	
	Vector3D.prototype.get_length=function(){
		var a=[this.x,this.y,this.z];
		var sq=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];
		var f=0.0;
		if (sq>0) {
			f=Math.pow(sq,0.5);
		}
		return f
	}
	Vector3D.prototype.get_lengthSquared=function(){		var a=[this.x,this.y,this.z];
		var sq=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];
		return sq
	}
	
	Vector3D.prototype.normalize=function(){
		f=this.get_length();
		this.x/=f;
		this.y/=f;
		this.z/=f;
		return f;
	}
	
	Vector3D.prototype.clone=function(v){
		return new Vector3D(this.x,this.y,this.z,this.w);
	}
	
	Vector3D.prototype.negate=function(v){
		this.x*=-1;
		this.y*=-1;
		this.z*=-1;
		return;
	}
	
	Vector3D.prototype.scaleBy=function(s){
		this.x*=s;
		this.y*=s;
		this.z*=s;
		return;
	}
	
	Vector3D.prototype.project=function(){
		this.x/=this.w;
		this.y/=this.w;
		this.z/=this.w;
		this.w=1;
		return;
	}
	
	Vector3D.angleBetween=function(a,b){
		a=a.clone().normalize();
		b=b.clone().normalize();
		d=a.dotProduct(b);
		if (d<-1)
			d=-1;
		if (d>1)
			d=1;
		return Math.acos(d);
	}
	
	Vector3D.prototype.equals=function(a, allFour){
		if(!allFour){
			return (this.x==a.x && this.y==a.y  && this.z==a.z); 
		}else{
			return (this.x==a.x && this.y==a.y  && this.z==a.z && this.w==a.w); 
		}
	}
    
	Vector3D.prototype.angleBetween=Vector3D.angleBetween;
	
	Vector3D.X_AXIS=new Vector3D(1,0,0);
	Vector3D.Y_AXIS=new Vector3D(0,1,0);
	Vector3D.Z_AXIS=new Vector3D(0,0,1);
	
	Vector3D.prototype.toString=function(){
		return "["+([this.x,this.y,this.z].toString())+"]";
	}
	
	jigLib.Vector3D=Vector3D;
	
})(jigLib)