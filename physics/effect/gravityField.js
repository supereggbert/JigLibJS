(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	/**
	 * @author Jim Sangwine
	 * 
	 * This effect has a radius within which it will either attract or repel bodies depending on the defined force 
	 * (positive values attract, negative repel) and their distance (the closer the object, the stronger the effect).
	 * 
	 * This effect will be applied continuously as long as this.enabled == true
	 * 
	 * This effect can either be placed at an arbitrary location in the scene, or it can be attached to a parent object.
	 * 
	 * @param {Array}	location	vector array in the format [x,y,z]
	 * @param {Number}	radius		radius of effect - at [radius] distance, gravity effect will be 0
	 * @param {Number}	force		the force of gravity at 0 distance (impulse will be force/distance)
	 * @param {Object}	parent		optional - a RigidBody that the gravitational field will follow - excluded from effect 
	 **/
	var GravityField=function(_location, _radius, _force, _parent) {
		this.super();
		this.location=_location;
		this.radius=_radius;
		this.force=_force;
		if (_parent) this.parent=_parent;
	};
	jigLib.extends(GravityField,jigLib.JEffect);

	GravityField.prototype.location = null;
	GravityField.prototype.radius = null;
	GravityField.prototype.force = null;
	GravityField.prototype.parent = null;
	
	/**
	 * Applies the effect to the relevant bodies.
	 * Typically called by PhysicsSystem.handleAllEffects. 
	 * 
	 * @returns
	 */
	GravityField.prototype.Apply = function() {
		var bodies=jigLib.PhysicsSystem.getInstance().get_bodies();
		var i=bodies.length-1;
		var curBody, distance, force, forceV;
		
		if (this.parent)
			this.location = this.parent.get_position();
		
		this._affectedBodies=[];
		do {
			curBody=bodies[i];
			if (!curBody.get_movable() || (this.parent && curBody == this.parent)) continue;

			distance=Vector3DUtil.distance(curBody.get_position(), this.location);
			if (distance < this.radius)
			{
				forceV=Vector3DUtil.subtract(curBody.get_position(), this.location);
				force=(1-(distance / this.radius)) * this.force;
				Vector3DUtil.scaleBy(forceV, force);
				Vector3DUtil.negate(forceV);
				curBody.addWorldForce(forceV, this.location);
			}
		} while(i--);
	};
	
	jigLib.GravityField=GravityField;
})(jigLib);