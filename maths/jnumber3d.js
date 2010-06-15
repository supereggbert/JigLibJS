(function(jigLib){
	
	var Vector3D=jigLib.Vector3D;
	
	/**
	* @author katopz
	*/
	var JNumber3D={}
	
	JNumber3D.NUM_TINY = 0.00001;
	JNumber3D.NUM_HUGE = 100000;

	//public static const UP:Vector3D = Vector3D.Y_AXIS;
	//public static const LOOK:Vector3D = Vector3D.Z_AXIS;
	//public static const RIGHT:Vector3D = Vector3D.X_AXIS;
		
	JNumber3D.toArray=function(v){
		return [v.x, v.y, v.z];
	}
	
	JNumber3D.getScaleVector=function(v, s){
		return new Vector3D(v.x*s,v.y*s,v.z*s,v.w);
	}

	JNumber3D.getDivideVector=function(v, w){
		if (w != 0){
			return new Vector3D(v.x / w, v.y / w, v.z / w);
		}else{
			return new Vector3D(0, 0, 0);
		}
	}
	
	JNumber3D.getNormal=function(v0, v1, v2){
		var E = v1.clone();
		var F = v2.clone();
		var N = E.subtract(v0).crossProduct(F.subtract(v1));
		N.normalize();

		return N;
	}

	JNumber3D.copyFromArray=function(v, arr){
		if (arr.length >= 3)
		{
			v.x = arr[0];
			v.y = arr[1];
			v.z = arr[2];
		}
	}

	JNumber3D.getLimiteNumber=function(num, min, max){
		var n = num;
		if (n < min){
			n = min;
		}else if (n > max){
			n = max;
		}
		return n;
	}
	
	jigLib.JNumber3D=JNumber3D;
	
})(jigLib);
