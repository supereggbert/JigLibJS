(function(jigLib){
	var JEffect=function(){
		this.enabled = true;
	};
	
	JEffect.prototype._eventEnabled=false;
	JEffect.prototype.__defineGetter__('enabled', function() { return this._eventEnabled; });
	JEffect.prototype.__defineSetter__('enabled', 
										function(bool) {
											  				if (bool == this._eventEnabled) return;
											  				this._eventEnabled = bool;
											  				if (bool) jigLib.PhysicsSystem.getInstance().addEvent(this);
											  				else jigLib.PhysicsSystem.getInstance().removeEvent(this);
														});
	
	/**
	 * this should be implemented by the effect to apply force to 
	 * bodies in the physics system as appropriate.
	 * 
	 * @returns
	 */
	JEffect.prototype.Apply=function(){
		return false;
	};
	
	jigLib.JEffect=JEffect;
})(jigLib);