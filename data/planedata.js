(function(jigLib){

	var Vector3DUtil=jigLib.Vector3DUtil;
	
	/**
	 * @class ContactData stores information about a contact between 2 objects
	 * @requires Vector3DUtil
	 * @property {array} position the position of the plane expressed as a 3D vector
	 * @property {array} normal the normal direction of the plane expressed as a 3D vector
	 * @property {number} distance the dot product of position and normal
	 * @constructor
	 * @param {array} pos the position of the plane expressed as a 3D vector
	 * @param {nor} the normal direction of the plane expressed as a 3D vector
	 **/
	var PlaneData=function(pos, nor){
		this.position = pos.slice(0);
		this.normal = nor.slice(0);
		this.distance = Vector3DUtil.dotProduct(this.position, this._normal);
	};
	PlaneData.prototype.position=null;
	PlaneData.prototype.normal=null;
	PlaneData.prototype.distance=null;
	
	
	/**
	 * @function pointPlaneDistance determines the distance between a given point and the plane
	 * @belongsTo PlaneData
	 * @param {array} pt a 3D vector
	 * @type number
	 **/
	PlaneData.prototype.pointPlaneDistance=function(pt){
		return Vector3DUtil.dotProduct(normal, pt) - distance;
	};
		
	jigLib.PlaneData=PlaneData;
	
})(jigLib);