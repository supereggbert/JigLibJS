(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	var GLMatrix=jigLib.GLMatrix;
	
	/**
	 * @author Jim Sangwine
	 * 
	 * I have rewritten this class to use GLMatrix (http://code.google.com/p/glmatrix/)
	 */
	var Matrix3D=function(v){
		this.glmatrix=GLMatrix.create();
		if(v) GLMatrix.set(v,this.glmatrix);
		else GLMatrix.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],this.glmatrix);
	};
	Matrix3D.prototype.glmatrix=null;
	
	Matrix3D.prototype.get_determinant=function() {
		return GLMatrix.determinant(this.glmatrix);
	};

	Matrix3D.prototype.prepend=function(m){
		GLMatrix.multiply(m.glmatrix, this.glmatrix, this.glmatrix);
		return;
	};
	
	Matrix3D.prototype.append=function(m){
		GLMatrix.multiply(this.glmatrix, m.glmatrix);
		return;
	};
	
	Matrix3D.prototype.angleAxis=function(angle, axis) {
		var xmx,ymy,zmz,xmy,ymz,zmx,xms,yms,zms;

		//convert from degress to radians
		angle=angle/(3.14159*2);

		var x = axis[0];
		var y = axis[1];
		var z = axis[2];

		var cos = Math.cos(angle);
		var cosi = 1.0 - cos;
		var sin = Math.sin(angle);

		xms = x * sin;yms = y * sin;zms = z * sin;
		xmx = x * x;ymy = y * y;zmz = z * z;
		xmy = x * y;ymz = y * z;zmx = z * x;

		var matrix=[(cosi * xmx) + cos,(cosi * xmy) - zms,(cosi * zmx) + yms,0,
					(cosi * xmy) + zms,(cosi * ymy) + cos,(cosi * ymz) - xms,0,
					(cosi * zmx) - yms,(cosi * ymz) + xms,(cosi * zmz) + cos,0,
					0,0,0,1];

		return new Matrix3D(matrix);
	};
	
	Matrix3D.prototype.rotate=function(angle, axis) {
		var mat=this.clone();
		GLMatrix.rotate(mat.glmatrix,angle,axis);
		return mat;
	};
	
	Matrix3D.prototype.translateMatrix=function(v){
		return new Matrix3D([
		         			1,0,0,v[0],
		         			0,1,0,v[1],
		         			0,0,1,v[2],
		         			0,0,0,1
		         			]);
	};
	
	Matrix3D.prototype.scaleMatrix=function(v){
		return new Matrix3D([
		         			v[0],0,0,0,
		         			0,v[1],0,0,
		         			0,0,v[2],0,
		         			0,0,0,1
		         			]);
	};
	
	Matrix3D.prototype.appendRotation=function(angle,axis,pivot){
		angle=angle/(3.14159*2);
		Vector3DUtil.negate(axis);
		
		if (pivot)
		{
			var npivot=Vector3DUtil.negate(pivot.slice(0));
			this.appendTranslation(npivot[0], npivot[1], npivot[2]);
		}

		GLMatrix.rotate(this.glmatrix, angle, axis);

		if (pivot)
			this.appendTranslation(pivot[0], pivot[1], pivot[2]);
	};

	Matrix3D.prototype.prependRotation=function(angle,axis,pivot){
		if(pivot)
			this.prepend(this.translateMatrix(Vector3DUtil.negate(pivot.slice(0))));

		this.prepend(this.angleAxis(angle,axis));
		if(pivot)
			this.prepend(this.translateMatrix(pivot));
	};
	
	Matrix3D.prototype.appendScale=function(x,y,z){
		GLMatrix.scale(this.glmatrix, [x,y,z]);
	};
	
	Matrix3D.prototype.prependScale=function(x,y,z){
		this.prepend(this.scaleMatrix([x,y,z]));
	};
	
	Matrix3D.prototype.appendTranslation=function(x,y,z){
		this.append(this.translateMatrix([x,y,z]));
	};
	
	Matrix3D.prototype.prependTranslation=function(x,y,z){
		this.prepend(this.translateMatrix([x,y,z]));
	};
	
	Matrix3D.prototype.identity=function(){
		GLMatrix.identity(this.glmatrix);
		return;
	};
	
	Matrix3D.prototype.transpose=function(){
		GLMatrix.transpose(this.glmatrix);
	};
	
	Matrix3D.prototype.invert=function(){
		GLMatrix.inverse(this.glmatrix);
		return;
	};
	
	Matrix3D.prototype.clone=function(){
		return new Matrix3D(this.glmatrix);
	};
	
	jigLib.Matrix3D=Matrix3D;
	
})(jigLib);