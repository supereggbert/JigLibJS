(function(jigLib){
	
	
	var Matrix3D=jigLib.Matrix3D;
	var JMaths3D=jigLib.JMaths3D;
	var JMatrix3D=jigLib.JMatrix3D;
	var JNumber3D=jigLib.JNumber3D;
	
	/**
	 * @author katopz
	 * Devin Reimer (blog.almostlogical.com)
	 */
	var PhysicsState=function(){
		this.position = [0,0,0,0];
		this._orientation = new Matrix3D();
		this.linVelocity = [0,0,0,0];
		this.rotVelocity = [0,0,0,0];
		this.orientationCols= [];
		this.orientationCols[0] = [0,0,0,0];
		this.orientationCols[1] = [0,0,0,0];
		this.orientationCols[2] = [0,0,0,0];
	};
	
	PhysicsState.prototype.get_orientation=function(){ return this._orientation; };
	
	PhysicsState.prototype.set_orientation=function(val){
		this._orientation = val;			 
		var _rawData = this._orientation.glmatrix;
						
		this.orientationCols[0][0] = _rawData[0];
		this.orientationCols[0][1] = _rawData[1];
		this.orientationCols[0][2] = _rawData[2];
		
		this.orientationCols[1][0] = _rawData[4];
		this.orientationCols[1][1] = _rawData[5];
		this.orientationCols[1][2] = _rawData[6];
		
		this.orientationCols[2][0] = _rawData[8];
		this.orientationCols[2][1] = _rawData[9];
		this.orientationCols[2][2] = _rawData[10];
	};
		
	//here for backwards compatibility should use public function instead unless you need a clone
	PhysicsState.prototype.getOrientationCols=function(){
		return JMatrix3D.getCols(this._orientation);
	};
	
	jigLib.PhysicsState=PhysicsState;
	
})(jigLib);