//Vector3d replacement

(function(jigLib){
	/**
	* @author Paul Brunt
	*/
	var Vector3D=function(x,y,z,w){ 
		var n = arguments.length;
		if (n==0) return;
		else if (n>=3) { this[0]=x; this[1]=y; this[2]=z; }
		if (n==4) this[3]=w;
	};
	
	Vector3D.X_AXIS=new Vector3D(1,0,0);
	Vector3D.Y_AXIS=new Vector3D(0,1,0);
	Vector3D.Z_AXIS=new Vector3D(0,0,1);
	
	Vector3D.prototype[0]=0;
	Vector3D.prototype[1]=0;
	Vector3D.prototype[2]=0;
	Vector3D.prototype[3]=0;
	
	Vector3D.prototype.add=function(v){
		return new Vector3D(this[0]+v[0],this[1]+v[1],this[2]+v[2],this[3]+this[3]);
	};
	
	Vector3D.prototype.subtract=function(v){
		return new Vector3D(this[0]-v[0],this[1]-v[1],this[2]-v[2],this[3]-this[3]);
	};
	
	Vector3D.prototype.decrementBy=function(v){
		this[0]-=v[0];
		this[1]-=v[1];
		this[2]-=v[2];
		this[3]-=v[3];
	};
	
	Vector3D.prototype.IncrementBy=function(v){
		this[0]+=v[0];
		this[1]+=v[1];
		this[2]+=v[2];
		this[3]+=v[3];
	};
	
	Vector3D.prototype.dotProduct=function(v){
		return this[0]*v[0]+this[1]*v[1]+this[2]*v[2];
	};
	
	Vector3D.prototype.crossProduct=function(v){
		return new Vector3D(this[1]*v[2]-this[2]*v[1],this[2]*v[0]-this[0]*v[2],this[0]*v[1]-this[1]*v[0]);
	};
	
	Vector3D.prototype.get_length=function(){
		var a=[this[0],this[1],this[2]];
		var sq=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];
		var f=0.0;
		if (sq>0) 
			f=Math.pow(sq,0.5);

		return f;
	};
	
	Vector3D.prototype.get_lengthSquared=function(){		var a=[this[0],this[1],this[2]];
		var sq=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];
		return sq;
	};
	
	Vector3D.prototype.normalize=function(){
		f=this.get_length();
		this[0]/=f;
		this[1]/=f;
		this[2]/=f;
		return f;
	};
	
	Vector3D.prototype.clone=function(v){
		return new Vector3D(this[0],this[1],this[2],this[3]);
	};
	
	Vector3D.prototype.negate=function(v){
		this[0]*=-1;
		this[1]*=-1;
		this[2]*=-1;
		return;
	};
	
	Vector3D.prototype.scaleBy=function(s){
		this[0]*=s;
		this[1]*=s;
		this[2]*=s;
		return;
	};
	
	Vector3D.prototype.project=function(){
		this[0]/=this[3];
		this[1]/=this[3];
		this[2]/=this[3];
		this[3]=1;
		return;
	};
	
	Vector3D.angleBetween=function(a,b){
		a=a.clone().normalize();
		b=b.clone().normalize();
		d=a.dotProduct(b);
		if (d<-1) d=-1;
		else if (d>1) d=1;
		return Math.acos(d);
	};
	
	Vector3D.prototype.equals=function(a, allFour){
		var out = (this[0]==a[0] && this[1]==a[1]  && this[2]==a[2]);
		if (!out) return false;
		if (allFour) return this[3]==a[3];
		return true;
	};
	
	Vector3D.prototype.angleBetween=Vector3D.angleBetween;
	
	Vector3D.prototype.toString=function(){
		return "["+([this[0],this[1],this[2]].toString())+"]";
	};
	
	jigLib.Vector3D=Vector3D;
	
})(jigLib);