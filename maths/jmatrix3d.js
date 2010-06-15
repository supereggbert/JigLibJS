	
(function(jigLib){
	var Matrix3D=jigLib.Matrix3D;
	var Vector3D=jigLib.Vector3D;

	/**
	* @author katopz
	*/
	var JMatrix3D={};
	
        JMatrix3D.getTranslationMatrix=function(x, y, z){
		var matrix3D = new Matrix3D();
		matrix3D.appendTranslation(x, y, z);
		return matrix3D;
	}
	
	JMatrix3D.getScaleMatrix=function(x, y, z){
		var matrix3D = new Matrix3D();
		matrix3D.prependScale(x, y, z);
		return matrix3D;
	}
                
	JMatrix3D.getRotationMatrix=function(x, y, z, degree, pivotPoint){
		var matrix3D = new Matrix3D();
		matrix3D.appendRotation(degree, new Vector3D(x,y,z),pivotPoint);
		return matrix3D;
	}
                
	JMatrix3D.getInverseMatrix=function(m){
		var matrix3D = m.clone();
		matrix3D.invert();
		return matrix3D;
	}
	
	JMatrix3D.getTransposeMatrix=function(m){
		var matrix3D = m.clone();
		matrix3D.transpose();
		return matrix3D;
	}

	JMatrix3D.getAppendMatrix3D=function(a, b){
		var matrix3D = a.clone();
		matrix3D.append(b);
		return matrix3D;
	}

	JMatrix3D.getPrependMatrix=function(a, b){
		var matrix3D = a.clone();
		matrix3D.prepend(b);
		return matrix3D;
	}
                
	JMatrix3D.getSubMatrix=function(a, b){
		var num = [16];
		for (var i = 0; i < 16; i++ ) {
			num[i] = a.rawData[i] - b.rawData[i];
		}
		return new Matrix3D(num);
	}
	
	JMatrix3D.getRotationMatrixAxis=function(degree, rotateAxis){
                var matrix3D = new Matrix3D();
                matrix3D.appendRotation(degree, rotateAxis?rotateAxis:Vector3D.X_AXIS);
                return matrix3D;
	}
                
	JMatrix3D.getCols=function(matrix3D){
		var _rawData =  matrix3D.rawData;
		var cols = [];
                        
		/*cols[0] = new Vector3D(_rawData[0], _rawData[1], _rawData[2]);
		cols[1] = new Vector3D(_rawData[4], _rawData[5], _rawData[6]);
		cols[2] = new Vector3D(_rawData[8], _rawData[9], _rawData[10]);
		*/
		cols[0] = new Vector3D(_rawData[0], _rawData[4], _rawData[8]);
		cols[1] = new Vector3D(_rawData[1], _rawData[5], _rawData[9]);
		cols[2] = new Vector3D(_rawData[2], _rawData[6], _rawData[10]);
                        
		return cols;
	}

	JMatrix3D.multiplyVector=function(matrix3D, v){
		var vx = v.x;
		var vy = v.y;
		var vz = v.z;

		if (vx == 0 && vy == 0 && vz == 0) { return; }
                        
		var _rawData =  matrix3D.rawData;
                        
		/*
		How did this work in AS3? it looks wrong!
		v.x = vx * _rawData[0] + vy * _rawData[4] + vz * _rawData[8]  + _rawData[12];
		v.y = vx * _rawData[1] + vy * _rawData[5] + vz * _rawData[9]  + _rawData[13];
		v.z = vx * _rawData[2] + vy * _rawData[6] + vz * _rawData[10] + _rawData[14];
		*/
		v.x = vx * _rawData[0] + vy * _rawData[1] + vz * _rawData[2]  + _rawData[3];
		v.y = vx * _rawData[4] + vy * _rawData[5] + vz * _rawData[6]  + _rawData[7];
		v.z = vx * _rawData[8] + vy * _rawData[9] + vz * _rawData[10] + _rawData[11];
	}
	
	jigLib.JMatrix3D=JMatrix3D;
	
})(jigLib)
	