(function(jigLib){
	/**
	 * @author Paul Brunt
	 * 
	 * In an attempt to reduce the overhead of millions of Vector3D objects, I have
	 * pulled all of the methods and constants out into this utility class as static
	 * members. This class should never be instantiated (hence the constructor error).
	 * Note also that all instances of Vector3D have been replaced with simple arrays (e.g. [x,y,z,w])
	 * Jim Sangwine
	 **/
	var Vector3DUtil=function(){ throw new Error('Vector3DUtil is a utility class and should not be instantiated'); };

	Vector3DUtil.X_AXIS=[1,0,0,0];
	Vector3DUtil.Y_AXIS=[0,1,0,0];
	Vector3DUtil.Z_AXIS=[0,0,1,0];

	/**
	 * returns a new 3D vector that is the sum of v1 and v2
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @returns {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.add=function(v1,v2){
		return [v1[0]+v2[0],v1[1]+v2[1],v1[2]+v2[2],v1[3]+v2[3]];
	};

	/**
	 * returns a new 3D vector that is the result of v2 subtracted from v1
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @returns {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.subtract=function(v1,v2){
		return [v1[0]-v2[0],v1[1]-v2[1],v1[2]-v2[2],v1[3]-v2[3]];
	};

	/**
	 * performs an in-place subtraction of v2 from v1 (v1 is modified)
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.decrementBy=function(v1,v2){
		v1[0]-=v2[0];
		v1[1]-=v2[1];
		v1[2]-=v2[2];
		v1[3]-=v2[3];
	};

	/**
	 * performs an in-place addition of v2 to v1 (v1 is modified)
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.IncrementBy=function(v1,v2){
		v1[0]+=v2[0];
		v1[1]+=v2[1];
		v1[2]+=v2[2];
		v1[3]+=v2[3];
	};

	/**
	 * determines the distance between vectors v1 and v2
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.distance=function(v1,v2) {
		var math=Math;
		var pow=math.pow;
		var x=pow(v1[0]-v2[0], 2);
		var y=pow(v1[1]-v2[1], 2);
		var z=pow(v1[2]-v2[2], 2);
		return math.sqrt(x+y+z);
	};

	/**
	 * determines the dot product for two vectors
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.dotProduct=function(v1,v2){
		return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
	};

	/**
	 * determines the cross product for two vectors
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @returns {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.crossProduct=function(v1,v2){
		return [v1[1]*v2[2]-v1[2]*v2[1],v1[2]*v2[0]-v1[0]*v2[2],v1[0]*v2[1]-v1[1]*v2[0],0];
	};

	/**
	 * determines the length of a vector
	 * @param v {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.get_length=function(v){
		var sq=v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
		return(sq>0) ? Math.pow(sq,0.5) : 0.0;
	};

	/**
	 * determines the length squared of a vector
	 * @param v {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.get_lengthSquared=function(v){
		var sq=v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
		return sq;
	};

	/**
	 * performs in-place normalisation of a vector
	 * @param v {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.normalize=function(v){
		f=Vector3DUtil.get_length(v);
		v[0]/=f;
		v[1]/=f;
		v[2]/=f;
		return f;
	};

	/**
	 * performs in-place negation of a vector
	 * @param v {Array} in the format [x,y,z,w]
	 * @returns {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.negate=function(v){
		v[0]*=-1;
		v[1]*=-1;
		v[2]*=-1;
		return v;
	};

	/**
	 * performs in-place scaling of a vector
	 * @param v {Array} in the format [x,y,z,w]
	 * @param s {Number}
	 **/
	Vector3DUtil.scaleBy=function(v,s){
		v[0]*=s;
		v[1]*=s;
		v[2]*=s;
	};

	/**
	 * gets the absolute sum of each value of a given 3D vector
	 * useful for determining the total amount of force acting on a given body for example
	 * @param v {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.getSum=function(v){
		var abs=Math.abs;
		return abs(v[0])+abs(v[1])+abs(v[2]);
	};
	
	/**
	 * scales Vector3D v so that the absolute sum of x,y & z is no greater than s
	 * useful in situations when a force vector must be limited to some maximum total amount of force
	 * @param v {Array} in the format [x,y,z,w]
	 * @param s {Number} the scaling factor
	 **/
	Vector3DUtil.limitSum=function(v,s){
		var abs=Math.abs;
		c=Vector3DUtil.getSum(v);
		if (s>=c) return;
		f=s/c;
		Vector3DUtil.scaleBy(v,f);
	};

	/**
	 * performs in-place projection on a vector
	 * @param v {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.project=function(v){
		v[0]/=v[3];
		v[1]/=v[3];
		v[2]/=v[3];
		v[3]=1;
	};

	/**
	 * determines the angle between two vectors
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @returns {Number}
	 **/
	Vector3DUtil.angleBetween=function(v1,v2){
		var v1n=v1.slice(0);
		var v2n=v2.slice(0);
		Vector3DUtil.normalize(v1n);
		Vector3DUtil.normalize(v2n);
		d=Vector3DUtil.dotProduct(v1n, v2n);
		if (d<-1) d=-1;
		else if (d>1) d=1;

		return Math.acos(d);
	};

	/**
	 * tests two vectors for equality
	 * @param v1 {Array} in the format [x,y,z,w]
	 * @param v2 {Array} in the format [x,y,z,w]
	 * @param allFour {Boolean} whether to test all 4 slots [x,y,z,w] or only the 1st 3 coordinate values [x,y,z]
	 * @returns {Boolean}
	 **/
	Vector3DUtil.equals=function(v1, v2, allFour){
		if(!allFour)
			return (v1[0]==v2[0] && v1[1]==v2[1]  && v1[2]==v2[2]); 
		else
			return (v1[0]==v2[0] && v1[1]==v2[1]  && v1[2]==v2[2] && v1[3]==v2[3]); 
	};

	/**
	 * replacement for the Vector3D constructor - avoids NaN assignments
	 * 
	 * @param x {Number}
	 * @param y {Number}
	 * @param z {Number}
	 * @param w {Number}
	 * @returns {Array} in the format [x,y,z,w]
	 **/
	Vector3DUtil.create=function(x,y,z,w){
		var v3d=[];
		v3d[0] = (x) ? x : 0;
		v3d[1] = (y) ? y : 0;
		v3d[2] = (z) ? z : 0;
		v3d[3] = (w) ? w : 0;
		return v3d;
	};

	jigLib.Vector3DUtil=Vector3DUtil;
	
})(jigLib);