(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	
	/**
	* @author katopz
	*/
	var JMath3D={};
		
	JMath3D.fromNormalAndPoint=function(normal, point){
			var v = Vector3DUtil.create(normal[0], normal[1], normal[2], 0);
			v[3] = -(v[0]*point[0] + v[1]*point[1] + v[2]*point[2]);
			
			return normal;
	};
		
	JMath3D.getIntersectionLine=function(v, v0, v1){
		var d0 = v[0] * v0[0] + v[1] * v0[1] + v[2] * v0[2] - v[3];
		var d1 = v[0] * v1[0] + v[1] * v1[1] + v[2] * v1[2] - v[3];
		var m = d1 / (d1 - d0);
		return [v1[0] + (v0[0] - v1[0]) * m,
				v1[1] + (v0[1] - v1[1]) * m,
				v1[2] + (v0[2] - v1[2]) * m, 
				0];
	};

	JMath3D.unproject=function(matrix3D, focus, zoom, mX, mY){
		var persp = (focus * zoom) / focus;
		var vector = Vector3DUtil.create(mX / persp, -mY / persp, focus, 0);
		return matrix3D.transformVector(vector);
	};
	
})(jigLib);
