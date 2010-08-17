(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	
	/**
	 * @author katopz
	 */
	var JNumber3D={};
	
	JNumber3D.NUM_TINY = 0.00001;
	JNumber3D.NUM_HUGE = 100000;

	JNumber3D.toArray=function(v){
		return [v[0], v[1], v[2]];
	};
	
	JNumber3D.getScaleVector=function(v, s){
		return [v[0]*s,v[1]*s,v[2]*s,v[3]];
	};

	JNumber3D.getDivideVector=function(v, w){
		return (w) ? [v[0] / w, v[1] / w, v[2] / w, 0] : [0, 0, 0, 0];
	};
	
	JNumber3D.getNormal=function(v0, v1, v2){
		var E = v1.slice(0);
		var F = v2.slice(0);
		var N = Vector3DUtil.crossProduct(Vector3DUtil.subtract(E, v0), Vector3DUtil.subtract(F, v1));
		Vector3DUtil.normalize(N);

		return N;
	};

	JNumber3D.copyFromArray=function(v, arr){
		if (arr.length >= 3)
		{
			v[0] = arr[0];
			v[1] = arr[1];
			v[2] = arr[2];
		}
	};

	JNumber3D.getLimiteNumber=function(num, min, max){
		var n = num;
		if (n < min){
			n = min;
		}else if (n > max){
			n = max;
		}
		return n;
	};
	
	jigLib.JNumber3D=JNumber3D;
	
})(jigLib);
