(function(jigLib){
	var Vector3DUtilNew=function(){ throw new Error('Vector3DUtilNew is a utility class and should not be instantiated'); };
	
	Vector3DUtilNew.math=Math;
	Vector3DUtilNew.arrayType=typeof Float64Array!="undefined"?Float64Array:typeof Float32Array!="undefined"?Float32Array:Array;
	Vector3DUtilNew.array=new Vector3DUtilNew.arrayType(4);
	
	Vector3DUtilNew.add=function(v1,v2){
		var out=v1.slice(0);
		out[0]+=v2[0]; out[1]+=v2[1]; out[2]+=v2[2]; out[3]+=v2[3];
		return out;
	};
	
	Vector3DUtilNew.subtract=function(v1,v2){
		var out=v1.slice(0);
		out[0]-=v2[0]; out[1]-=v2[1]; out[2]-=v2[2]; out[3]-=v2[3];
		return out;
	};
	
	Vector3DUtilNew.decrementBy=function(v1,v2){
		v1[0]-=v2[0]; v1[1]-=v2[1]; v1[2]-=v2[2]; v1[3]-=v2[3];
	};
	
	Vector3DUtilNew.IncrementBy=function(v1,v2){
		v1[0]+=v2[0]; v1[1]+=v2[1]; v1[2]+=v2[2]; v1[3]+=v2[3];
	};
	
	Vector3DUtilNew.distance=function(v1,v2) {
		var pow=this.math.pow;
		var x=pow(v1[0]-v2[0], 2);
		var y=pow(v1[1]-v2[1], 2);
		var z=pow(v1[2]-v2[2], 2);
		return this.math.sqrt(x+y+z);
	};
	
	Vector3DUtilNew.dotProduct=function(v1,v2){
		return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
	};
	
	Vector3DUtilNew.crossProduct=function(v1,v2){
		return new Float32Array([v1[1]*v2[2]-v1[2]*v2[1],v1[2]*v2[0]-v1[0]*v2[2],v1[0]*v2[1]-v1[1]*v2[0],0]);
	};
	
	Vector3DUtilNew.get_length=function(v){
		var sq=v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
		return (sq>0) ? this.math.pow(sq,0.5) : 0.0;
	};
		Vector3DUtilNew.get_lengthSquared=function(v){
		var sq=v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
		return sq;
	};
	
	Vector3DUtilNew.normalize=function(v){
		f=Vector3DUtilNew.get_length(v);
		v[0]/=f; v[1]/=f; v[2]/=f;
		return f;
	};
	
	Vector3DUtilNew.negate=function(v){
		v[0]*=-1; v[1]*=-1; v[2]*=-1;
		return v;
	};
	
	Vector3DUtilNew.scaleBy=function(v,s){
		v[0]*=s; v[1]*=s; v[2]*=s;
		return;
	};
	
	Vector3DUtilNew.project=function(v){
		v[0]/=v[3]; v[1]/=v[3]; v[2]/=v[3]; v[3]=1;
		return;
	};
	
	Vector3DUtilNew.angleBetween=function(v1,v2){
		var v1n=v1.slice(0);
		var v2n=v2.slice(0);
		Vector3DUtilNew.normalize(v1n);
		Vector3DUtilNew.normalize(v2n);
		d=Vector3DUtilNew.dotProduct(v1n, v2n);
		if (d<-1) d=-1;
		else if (d>1) d=1;

		return Math.acos(d);
	};
	
	Vector3DUtilNew.equals=function(v1, v2, allFour){
		if(!allFour)
			return (v1[0]==v2[0] && v1[1]==v2[1]  && v1[2]==v2[2]); 
		else
			return (v1[0]==v2[0] && v1[1]==v2[1]  && v1[2]==v2[2] && v1[3]==v2[3]); 
	};
	
	/**
	 * replacement for the Vector3D constructor - avoids NaN assignments
	 * 
	 * @param x Number
	 * @param y Number
	 * @param z Number
	 * @param w Number
	 * @returns Array
	 */
	Vector3DUtilNew.create=function(x,y,z,w){
		var v3d=this.array.slice(0);
		v3d[0] = (x) ? x : 0;
		v3d[1] = (y) ? y : 0;
		v3d[2] = (z) ? z : 0;
		v3d[3] = (w) ? w : 0;
		return v3d;
	};
	
	Vector3DUtilNew.X_AXIS=Vector3DUtilNew.create(1,0,0,0);
	Vector3DUtilNew.Y_AXIS=Vector3DUtilNew.create(0,1,0,0);
	Vector3DUtilNew.Z_AXIS=Vector3DUtilNew.create(0,0,1,0);
	
	jigLib.Vector3DUtilNew=Vector3DUtilNew;
	
})(jigLib);