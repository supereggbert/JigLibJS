(function(jigLib){
	/**
         * Represents a mesh from a 3D engine inside JigLib.
         * Its implementation shold allow to get and set a Matrix3D on
         * the original object.
         *
         * In the implementation, JMatrix3D should be translated into
         * the type proper for a given engine.
         *
         * @author bartekd
         */
	var Matrix3D=jigLib.Matrix3D;
	
	function ISkin3D(){
		this.matrix=new Matrix3D();
	}
	ISkin3D.prototype.get_transform=function(){
		return this.matrix;
	}
	ISkin3D.prototype.set_transform=function(value){
		this.matrix=value;
	}
	
	jigLib.ISkin3D=ISkin3D;
	
})(jigLib)