(function(jigLib){

	var Vector3D = function(x,y,z,w)
	{
		if (x) this.v[0]=x;
		if (y) this.v[1]=y;
		if (z) this.v[2]=z;
		if (w) this.v[3]=w;
	};
	Vector3D.prototype.v=new Float32Array([0,0,0,0]);
	
	Vector3D.prototype.clone=function() { 
		return new Vector3D(this.v[0],this.v[1],this.v[2],this.v[3]); 
	};

	jigLib.Vector3D = Vector3D;
})(jigLib);