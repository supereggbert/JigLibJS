(function(jigLib){

        var PlaneData=function(pos, nor){
		this.position = pos.clone();
		this.normal = nor.clone();
		this.distance = this.position.dotProduct(this._normal);
	}
	
	PlaneData.prototype.pointPlaneDistance=function(pt){
		return normal.dotProduct(pt) - distance;
	}
		
	jigLib.PlaneData=PlaneData;
	
})(jigLib)
