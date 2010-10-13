(function(jigLib){
	var Vector3D2 = function(x,y,z,w)
	{
		if (x) this.v[0]=x;
		if (y) this.v[1]=y;
		if (z) this.v[2]=z;
		if (w) this.v[3]=w;
	};
	Vector3D2.prototype.v=new Float32Array([0,0,0,0]);
	
	Vector3D2.prototype.clone=function() { 
		return new Vector3D(this.v[0],this.v[1],this.v[2],this.v[3]); 
	};
	
	Vector3D2.prototype.X_AXIS=[1,0,0,0];
	Vector3D2.prototype.Y_AXIS=[0,1,0,0];
	Vector3D2.prototype.Z_AXIS=[0,0,1,0];
	
	Vector3D2.prototype.math=Math;
	
	Vector3D2.prototype.add=function(v2){
		var out=this.clone();
		out.v[0]+=v2.v[0]; out.v[1]+=v2.v[1]; out.v[2]+=v2.v[2]; out.v[3]+=v2.v[3];
		return out;
	};
	
	Vector3D2.prototype.subtract=function(v2){
		var out=this.clone();
		out.v[0]-=v2.v[0]; out.v[1]-=v2.v[1]; out.v[2]-=v2.v[2]; out.v[3]-=v2.v[3];
		return out;
	};
	
	Vector3D2.prototype.decrementBy=function(v2){
		this.v[0]-=v2.v[0]; this.v[1]-=v2.v[1]; this.v[2]-=v2.v[2]; this.v[3]-=v2.v[3];
	};
	
	Vector3D2.prototype.IncrementBy=function(v2){
		this.v[0]+=v2.v[0]; this.v[1]+=v2.v[1]; this.v[2]+=v2.v[2]; this.v[3]+=v2.v[3];
	};
	
	Vector3D2.prototype.distance=function(v2) {
		var pow=this.math.pow;
		var x=pow(this.v[0]-v2.v[0], 2);
		var y=pow(this.v[1]-v2.v[1], 2);
		var z=pow(this.v[2]-v2.v[2], 2);
		return this.math.sqrt(x+y+z);
	};
	
	Vector3D2.prototype.dotProduct=function(v2){
		return this.v[0]*v2.v[0]+this.v[1]*v2.v[1]+this.v[2]*v2.v[2];
	};
	
	Vector3D2.prototype.crossProduct=function(v2){
		return new Vector3D2(this.v[1]*v2.v[2]-this.v[2]*v2.v[1], this.v[2]*v2.v[0]-this.v[0]*v2.v[2], this.v[0]*v2.v[1]-this.v[1]*v2.v[0], 0);
	};
	
	Vector3D2.prototype.get_length=function(){
		var sq=this.v[0]*this.v[0]+this.v[1]*this.v[1]+this.v[2]*this.v[2];
		return (sq>0) ? this.math.pow(sq,0.5) : 0.0;
	};
		Vector3D2.prototype.get_lengthSquared=function(){
		var sq=this.v[0]*this.v[0]+this.v[1]*this.v[1]+this.v[2]*this.v[2];
		return sq;
	};
	
	Vector3D2.prototype.normalize=function(){
		f=Vector3D2.prototype.get_length(v);
		this.v[0]/=f; this.v[1]/=f; this.v[2]/=f;
		return f;
	};
	
	Vector3D2.prototype.negate=function(){
		this.v[0]*=-1; this.v[1]*=-1; this.v[2]*=-1;
		return v;
	};
	
	Vector3D2.prototype.scaleBy=function(s){
		this.v[0]*=s; this.v[1]*=s; this.v[2]*=s;
		return;
	};
	
	Vector3D2.prototype.project=function(){
		this.v[0]/=this.v[3]; this.v[1]/=this.v[3]; this.v[2]/=this.v[3]; this.v[3]=1;
		return;
	};
	
	Vector3D2.prototype.angleBetween=function(v2){
		var v1n=this.clone();
		var v2n=v2.clone();
		v1n.normalize();
		v2n.normalize();
		d=v1n.dotProduct(v2n);
		if (d<-1) d=-1;
		else if (d>1) d=1;

		return Math.acos(d);
	};
	
	Vector3D2.prototype.equals=function(v2, allFour){
		if(!allFour)
			return (this.v[0]==v2.v[0] && this.v[1]==v2.v[1]  && this.v[2]==v2.v[2]); 
		else
			return (this.v[0]==v2.v[0] && this.v[1]==v2.v[1]  && this.v[2]==v2.v[2] && this.v[3]==v2.v[3]); 
	};

	jigLib.Vector3D2=Vector3D2;
	
})(jigLib);