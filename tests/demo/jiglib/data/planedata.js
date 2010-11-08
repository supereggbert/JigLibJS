(function(jigLib){

	var Vector3DUtil=jigLib.Vector3DUtil;
	
	var PlaneData=function(pos, nor){
		this.position = pos.slice(0);
		this.normal = nor.slice(0);
		this.distance = Vector3DUtil.dotProduct(this.position, this._normal);
	};
	
	PlaneData.prototype.pointPlaneDistance=function(pt){
		return Vector3DUtil.dotProduct(normal, pt) - distance;
	};
		
	jigLib.PlaneData=PlaneData;
	
})(jigLib);