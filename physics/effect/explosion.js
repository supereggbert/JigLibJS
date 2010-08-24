(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	/**
	 * @author Jim Sangwine
	 * 
	 * This effect has a radius within which it will repel bodies depending on the defined force 
	 * and their distance (the closer the object, the stronger the effect). 
	 * 
	 * This effect will only be applied during a single cycle of the PhysicsSystem, imparting a sudden impulse.
	 * 
	 * This effect can either be placed at an arbitrary location in the scene, or it can be attached to a parent object.
	 * 
	 * @param {Array}	location	vector array in the format [x,y,z]
	 * @param {Number}	radius		radius of effect - at [radius] distance, gravity effect will be 0
	 * @param {Number}	force		the force of the explosion at 0 distance (impulse will be force/distance)
	 * @param {Object}	parent		optional - a RigidBody that the gravitational field will follow - excluded from effect 
	 **/
	var Explosion=function(_location, _radius, _force, _parent) {
		this.super();
		this.location=_location;
		this.radius=_radius;
		this.force=_force;
		if (_parent) this.parent=_parent;
		// set to NOT fire instantly...
		this.enabled = false;
	};
	jigLib.extends(Explosion,jigLib.JEffect);

	Explosion.prototype.location = null;
	Explosion.prototype.radius = null;
	Explosion.prototype.force = null;
	Explosion.prototype.parent = null;

	/**
	 * Sets the effect to fire the next time Apply() is called
	 * 
	 * @returns
	 */
	Explosion.prototype.explode = function() {
		this.enabled = true;
	};
	
	/**
	 * Applies the effect to the relevant bodies.
	 * Typically called by PhysicsSystem.handleAllEffects. 
	 * 
	 * @returns
	 */
	Explosion.prototype.Apply = function() {
		this.enabled = false;
		
		var bodies=jigLib.PhysicsSystem.getInstance().get_bodies();
		var i=bodies.length;
		var curBody, distance, force, forceV;
		
		if (this.parent)
			this.location = this.parent.get_position();
		
		this._affectedBodies=[];
		while(i--) {
			curBody=bodies[i];
			if (!curBody.get_movable() || (this.parent && curBody == this.parent)) continue;

			distance=Vector3DUtil.distance(curBody.get_position(), this.location);
			if (distance < this.radius)
			{
				forceV=Vector3DUtil.subtract(curBody.get_position(), this.location);
				force=(1-(distance / this.radius)) * this.force;
				Vector3DUtil.scaleBy(forceV, force);
				curBody.addWorldForce(forceV, this.location);
			}
		}
	};
	
	jigLib.Explosion=Explosion;
})(jigLib);