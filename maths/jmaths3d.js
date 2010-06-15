(function(jigLib){
	var Vector3D=jigLib.Vector3D;
	var Matrix3D=jigLib.Matrix3D;
	
	/**
	* @author katopz
	*/
	var JMath3D={};
		
	JMath3D.fromNormalAndPoint=function(normal, point){
                var v = new Vector3D(normal.x, normal.y, normal.z);
                v.w = -(v.x*point.x + v.y*point.y + v.z*point.z);
                
                return normal;
        }
        
	JMath3D.getIntersectionLine=function(v, v0, v1){
		var d0 = v.x * v0.x + v.y * v0.y + v.z * v0.z - v.w;
		var d1 = v.x * v1.x + v.y * v1.y + v.z * v1.z - v.w;
		var m = d1 / (d1 - d0);
		return new Vector3D(
                                v1.x + (v0.x - v1.x) * m,
                                v1.y + (v0.y - v1.y) * m,
                                v1.z + (v0.z - v1.z) * m);
	}

	JMath3D.unproject=function(matrix3D, focus, zoom, mX, mY){
		var persp = (focus * zoom) / focus;
		var vector = new Vector3D(mX / persp, -mY / persp, focus);
		return matrix3D.transformVector(vector);
	}
	
})(jigLib);
