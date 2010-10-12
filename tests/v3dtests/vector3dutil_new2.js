(function(jigLib){
	var Vector3DUtilNew2=function(){ throw new Error('Vector3DUtilNew2 is a utility class and should not be instantiated'); };
	
	Vector3DUtilNew2.X_AXIS=[1,0,0,0];
	Vector3DUtilNew2.Y_AXIS=[0,1,0,0];
	Vector3DUtilNew2.Z_AXIS=[0,0,1,0];
	
	Vector3DUtilNew2.math=Math;
	
	Vector3DUtilNew2.add=function(v1,v2){
		var out=v1.clone();
		out.v[0]+=v2.v[0]; out.v[1]+=v2.v[1]; out.v[2]+=v2.v[2]; out.v[3]+=v2.v[3];
		return out;
	};
	
	Vector3DUtilNew2.subtract=function(v1,v2){
		var out=v1.clone();
		out.v[0]-=v2.v[0]; out.v[1]-=v2.v[1]; out.v[2]-=v2.v[2]; out.v[3]-=v2.v[3];
		return out;
	};
	
	Vector3DUtilNew2.decrementBy=function(v1,v2){
		v1.v[0]-=v2.v[0]; v1.v[1]-=v2.v[1]; v1.v[2]-=v2.v[2]; v1.v[3]-=v2.v[3];
	};
	
	Vector3DUtilNew2.IncrementBy=function(v1,v2){
		v1.v[0]+=v2.v[0]; v1.v[1]+=v2.v[1]; v1.v[2]+=v2.v[2]; v1.v[3]+=v2.v[3];
	};
	
	Vector3DUtilNew2.distance=function(v1,v2) {
		var pow=this.math.pow;
		var x=pow(v1.v[0]-v2.v[0], 2);
		var y=pow(v1.v[1]-v2.v[1], 2);
		var z=pow(v1.v[2]-v2.v[2], 2);
		return this.math.sqrt(x+y+z);
	};
	
	Vector3DUtilNew2.dotProduct=function(v1,v2){
		return v1.v[0]*v2.v[0]+v1.v[1]*v2.v[1]+v1.v[2]*v2.v[2];
	};
	
	Vector3DUtilNew2.crossProduct=function(v1,v2){
		return new Vector3D(v1.v[1]*v2.v[2]-v1.v[2]*v2.v[1], v1.v[2]*v2.v[0]-v1.v[0]*v2.v[2], v1.v[0]*v2.v[1]-v1.v[1]*v2.v[0], 0);
	};
	
	Vector3DUtilNew2.get_length=function(v){
		var sq=v.v[0]*v.v[0]+v.v[1]*v.v[1]+v.v[2]*v.v[2];
		return (sq>0) ? this.math.pow(sq,0.5) : 0.0;
	};
		Vector3DUtilNew2.get_lengthSquared=function(v){
		var sq=v.v[0]*v.v[0]+v.v[1]*v.v[1]+v.v[2]*v.v[2];
		return sq;
	};
	
	Vector3DUtilNew2.normalize=function(v){
		f=Vector3DUtilNew2.get_length(v);
		v.v[0]/=f; v.v[1]/=f; v.v[2]/=f;
		return f;
	};
	
	Vector3DUtilNew2.negate=function(v){
		v.v[0]*=-1; v.v[1]*=-1; v.v[2]*=-1;
		return v;
	};
	
	Vector3DUtilNew2.scaleBy=function(v,s){
		v.v[0]*=s; v.v[1]*=s; v.v[2]*=s;
		return;
	};
	
	Vector3DUtilNew2.project=function(v){
		v.v[0]/=v.v[3]; v.v[1]/=v.v[3]; v.v[2]/=v.v[3]; v.v[3]=1;
		return;
	};
	
	Vector3DUtilNew2.angleBetween=function(v1,v2){
		var v1n=v1.clone();
		var v2n=v2.clone();
		Vector3DUtilNew2.normalize(v1n);
		Vector3DUtilNew2.normalize(v2n);
		d=Vector3DUtilNew2.dotProduct(v1n, v2n);
		if (d<-1) d=-1;
		else if (d>1) d=1;

		return Math.acos(d);
	};
	
	Vector3DUtilNew2.equals=function(v1, v2, allFour){
		if(!allFour)
			return (v1.v[0]==v2.v[0] && v1.v[1]==v2.v[1]  && v1.v[2]==v2.v[2]); 
		else
			return (v1.v[0]==v2.v[0] && v1.v[1]==v2.v[1]  && v1.v[2]==v2.v[2] && v1.v[3]==v2.v[3]); 
	};
	
	jigLib.Vector3DUtilNew2=Vector3DUtilNew2;
	
})(jigLib);