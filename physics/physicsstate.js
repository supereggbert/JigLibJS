(function(jigLib){
	
	var Vector3D=jigLib.Vector3D;
	var Matrix3D=jigLib.Matrix3D;
	var JMaths3D=jigLib.JMaths3D;
	var JMatrix3D=jigLib.JMatrix3D;
	var JNumber3D=jigLib.JNumber3D;
	
	/**
         * @author katopz
         *                 Devin Reimer (blog.almostlogical.com)
         */
	var PhysicsState=function(){
		this.position = new Vector3D();
		this._orientation = new Matrix3D();
		this.linVelocity = new Vector3D();
		this.rotVelocity = new Vector3D();
		this.orientationCols= [];
		this.orientationCols[0] = new Vector3D();
		this.orientationCols[1] = new Vector3D();
		this.orientationCols[2] = new Vector3D();
	}
	
	PhysicsState.prototype.get_orientation=function(){ return this._orientation; }
	
	PhysicsState.prototype.set_orientation=function(val){
		this._orientation = val;             
		var _rawData = this._orientation.rawData;
                        
		this.orientationCols[0].x = _rawData[0];
                this.orientationCols[0].y = _rawData[1];
                this.orientationCols[0].z = _rawData[2];
                        
                this.orientationCols[1].x = _rawData[4];
                this.orientationCols[1].y = _rawData[5];
                this.orientationCols[1].z = _rawData[6];
                        
                this.orientationCols[2].x = _rawData[8];
		this.orientationCols[2].y = _rawData[9];
		this.orientationCols[2].z = _rawData[10];
	}
        
	//here for backwards compatibility should use public function instead unless you need a clone
	PhysicsState.prototype.getOrientationCols=function(){
		return JMatrix3D.getCols(this._orientation);
	}
	
	jigLib.PhysicsState=PhysicsState;
	
})(jigLib)