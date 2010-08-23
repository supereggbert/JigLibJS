(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	/**
	 * @author Jim Sangwine
	 * 
	 * @param {Array}	location	starting coordinates in the format {x,y,z}
	 * @param {Number}	radius		radius of effect - at [radius] distance, gravity effect will be 0
	 * @param {Number}	force		the force of gravity at 0 distance, objects will accelerate at [force] rate
	 * @param {int}		solver		optional - one of GravityField.DETAILED or GravityField.FAST - defaults to DETAILED
	 * @param {Object}	parent		optional - a RigidBody that the gravitational field will follow - excluded from effect 
	 **/
	var GravityField=function(_location, _radius, _force, _parent, _solver) {
		this.super();
		this.location=_location;
		this.radius=_radius;
		this.force=_force;
		if (typeof(_solver) != "undefined") this.solver=_solver;
		if (_parent) this.parent=_parent;
	};
	jigLib.extends(GravityField,jigLib.JEffect);
	
	//	solver mode constants
	GravityField.prototype.DETAILED = 0;	//	operates on individual vertices
	GravityField.prototype.FAST = 1;		//	operates only on whole RigidBody objects
	
	GravityField.prototype.location = null;
	GravityField.prototype.radius = null;
	GravityField.prototype.force = null;
	GravityField.prototype.solver = 1;
	GravityField.prototype.parent = null;
	GravityField.prototype._affectedBodies = null;
	GravityField.prototype._affectedPoints = null;
	
	GravityField.prototype.PreApply = function() {
		var bodies=jigLib.PhysicsSystem.getInstance().get_bodies();
		var i=bodies.length-1;
		var distance;
		
		if (this.parent)
			this.location = this.parent.get_position();
		
		switch (this.solver)
		{
			case this.FAST:
				this._affectedBodies=[];
				var curBody;
				//	collect bodies that are within the area of effect
				do {
					curBody=bodies[i];
					if (!curBody.get_movable() || (this.parent && curBody == this.parent)) continue;

					distance=Vector3DUtil.distance(curBody.get_position(), this.location);
					if (distance < this.radius)
						this._affectedBodies.push({body:curBody, distance:distance});
				} while(i--);
				break;
			
			case this.DETAILED:
				this._affectedPoints=[];
				//	collect affected points
				var points, point, ii;
				do {
					points=bodies[i]._points;
					if (points && points.length > 0)
					{
						ii=points.length-1;
						do {
							point=points[ii];
							distance=Vector3DUtil.distance(point,this.location);
							if (distance < this.radius)
								this._affectedPoints.push({point:point, distance:distance});
						} while(ii--);
					}
				} while(i--);
				break;
		}
	};
	
	GravityField.prototype.Apply = function() {
		switch (this.solver)
		{
			case this.FAST:
				var i=this._affectedBodies.length-1;
				if (i<0) return;
				
				var force, forceV, angle, body;
				do {
					body=this._affectedBodies[i];
					forceV=Vector3DUtil.subtract(body.body.get_position(), this.location);
					force=(1-(body.distance / this.radius)) * this.force;
					Vector3DUtil.scaleBy(forceV, force);
					Vector3DUtil.negate(forceV);
					body.body.addWorldForce(forceV, this.location);
				} while (i--);
				break;
			
			case this.DETAILED:
				
				break;
		}
	};
	
	jigLib.GravityField=GravityField;
})(jigLib);