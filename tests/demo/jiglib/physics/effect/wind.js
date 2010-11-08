(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	/**
	 * @author Jim Sangwine
	 * 
	 * This effect has global influence - All objects that are movable in the scene will be affected, apart from those
	 * added to the exclusions array. 
	 * 
	 * This effect will be applied continuously as long as this.enabled == true.
	 * 
	 * This effect accepts a vector to define it's direction of influence.
	 * 
	 * @param {Array}	direction	vector array in the format [x,y,z] defines the force of the effect in each direction
	 * @param {Array}	exclusions	optional - a list of bodies that should be excluded from the effect 
	 **/
	var Wind=function(_direction, _exclusions) {
		this.Super();
		this.direction=_direction;
		if (_exclusions) this.exclusions=_exclusions;
	};
	jigLib.extend(Wind,jigLib.JEffect);

	Wind.prototype.direction = null;
	Wind.prototype.exclusions = [];
	
	/**
	 * Searches exclusions for a given body
	 */
	Wind.prototype.isExcluded = function(body) {
		var i=this.exclusions.length;
		while (i--) { if (this.exclusions[i] == body) return true; }
		return false;
	};
	
	/**
	 * Applies the effect to the relevant bodies.
	 * Typically called by PhysicsSystem.handleAllEffects. 
	 * 
	 * @returns
	 */
	Wind.prototype.Apply = function() {
		var system=jigLib.PhysicsSystem.getInstance();
		var bodies=system.get_bodies();
		var i=bodies.length;
		var curBody;
		
		this._affectedBodies=[];
		while(i--) {
			curBody=bodies[i];
			if (!curBody.get_movable() || this.isExcluded(curBody)) continue;
			system.activateObject(curBody);
			curBody.applyWorldImpulse(this.direction, curBody.get_position());
		}
	};
	
	jigLib.Wind=Wind;
})(jigLib);