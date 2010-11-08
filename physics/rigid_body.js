/*
   Copyright (c) 2007 Danny Chapman
   http://www.rowlhouse.co.uk

   This software is provided 'as-is', without any express or implied
   warranty. In no event will the authors be held liable for any damages
   arising from the use of this software.
   Permission is granted to anyone to use this software for any purpose,
   including commercial applications, and to alter it and redistribute it
   freely, subject to the following restrictions:
   1. The origin of this software must not be misrepresented; you must not
   claim that you wrote the original software. If you use this software
   in a product, an acknowledgment in the product documentation would be
   appreciated but is not required.
   2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
   3. This notice may not be removed or altered from any source
   distribution.
 */

/**
 * @author Muzer(muzerly@gmail.com)
 * @link http://code.google.com/p/jiglibflash
 */
 
(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	var JConfig=jigLib.JConfig;
	var Matrix3D=jigLib.Matrix3D;
	var JMatrix3D=jigLib.JMatrix3D;
	var JNumber3D=jigLib.JNumber3D;
	var MaterialProperties=jigLib.MaterialProperties;
	var PhysicsState=jigLib.PhysicsState;
	var PhysicsSystem=jigLib.PhysicsSystem;
	var JAABox=jigLib.JAABox;
	
	var RigidBody=function(skin){
		this._useDegrees = (JConfig.rotationType == "DEGREES") ? true : false;
		
		this._id = RigidBody.idCounter++;

		this._skin = skin;
		this._material = new MaterialProperties();

		this._bodyInertia = new Matrix3D();
		this._bodyInvInertia = JMatrix3D.getInverseMatrix(this._bodyInertia);

		this._currState = new PhysicsState();
		this._oldState = new PhysicsState();
		this._storeState = new PhysicsState();
		this._invOrientation = JMatrix3D.getInverseMatrix(this._currState.get_orientation());
		this._currLinVelocityAux = [0,0,0,0];
		this._currRotVelocityAux = [0,0,0,0];

		this._force = [0,0,0,0];
		this._torque = [0,0,0,0];
			
		this._linVelDamping = [0.995, 0.995, 0.995, 0];
		this._rotVelDamping = [0.5, 0.5, 0.5, 0];
		this._maxLinVelocities = 500;
		this._maxRotVelocities = 50;

		this._velChanged = false;
		this._inactiveTime = 0;
		
		this._doShockProcessing = true;

		this.isActive = this._activity = true;
		this._movable = true;
		this._origMovable = true;

		this.collisions = [];
		this._constraints = [];
		this._nonCollidables = [];

		this._storedPositionForActivation = [0,0,0,0];
		this._bodiesToBeActivatedOnMovement = [];
		this._lastPositionForDeactivation = this._currState.position.slice(0);
		this._lastOrientationForDeactivation = this._currState.get_orientation().clone();

		this._type = "Object3D";
		this._boundingSphere = 0;
		this._boundingBox = new JAABox([0,0,0,0], [0,0,0,0]);
		this._boundingBox.clear();
	};
	
	RigidBody.idCounter = 0;
	
	RigidBody.prototype._id=null;
	RigidBody.prototype._skin=null;
	RigidBody.prototype._type=null;
	RigidBody.prototype._boundingSphere=null;
	RigidBody.prototype._boundingBox=null;
	RigidBody.prototype._currState=null;
	RigidBody.prototype._oldState=null;
	RigidBody.prototype._storeState=null;
	RigidBody.prototype._invOrientation=null;
	RigidBody.prototype._currLinVelocityAux=null;
	RigidBody.prototype._currRotVelocityAux=null;

	RigidBody.prototype._mass=null;
	RigidBody.prototype._invMass=null;
	RigidBody.prototype._bodyInertia=null;
	RigidBody.prototype._bodyInvInertia=null;
	RigidBody.prototype._worldInertia=null;
	RigidBody.prototype._worldInvInertia=null;

	RigidBody.prototype._force=null;
	RigidBody.prototype._torque=null;
		
	RigidBody.prototype._linVelDamping=null;
	RigidBody.prototype._rotVelDamping=null;
	RigidBody.prototype._maxLinVelocities=null;
	RigidBody.prototype._maxRotVelocities=null;

	RigidBody.prototype._velChanged=null;
	RigidBody.prototype._activity=null;
	RigidBody.prototype._movable=null;
	RigidBody.prototype._origMovable=null;
	RigidBody.prototype._inactiveTime=null;
	RigidBody.prototype._doShockProcessing=null;

	// The list of bodies that need to be activated when we move away from our stored position
	RigidBody.prototype._bodiesToBeActivatedOnMovement=null;

	RigidBody.prototype._storedPositionForActivation=null;// The position stored when we need to notify other bodies
	RigidBody.prototype._lastPositionForDeactivation=null;// last position for when trying the deactivate
	RigidBody.prototype._lastOrientationForDeactivation=null;// last orientation for when trying to deactivate

	RigidBody.prototype._material=null;

	RigidBody.prototype._rotationX = 0;
	RigidBody.prototype._rotationY = 0;
	RigidBody.prototype._rotationZ = 0;
	RigidBody.prototype._useDegrees=null;

	RigidBody.prototype._nonCollidables=null;
	RigidBody.prototype._constraints=null;
	RigidBody.prototype.collisions=null;
	
	RigidBody.prototype.isActive=null;
	
	RigidBody.prototype.radiansToDegrees=function(rad){
		return rad * 180 / Math.PI;
	};
	
	RigidBody.prototype.degreesToRadians=function(deg){
		return deg * Math.PI / 180;
	};
	
	RigidBody.prototype.get_rotationX=function(){
		return this._rotationX;//(_useDegrees) ? radiansToDegrees(_rotationX) : _rotationX;
	};
	
	RigidBody.prototype.get_rotationY=function(){
		return this._rotationY;//(_useDegrees) ? radiansToDegrees(_rotationY) : _rotationY;
	};

	RigidBody.prototype.get_rotationZ=function(){
		return this._rotationZ;//(_useDegrees) ? radiansToDegrees(_rotationZ) : _rotationZ;
	};
	
	/**
	* px - angle in Radians or Degrees
	*/
	RigidBody.prototype.set_rotationX=function(px){
		//var rad:Number = (_useDegrees) ? degreesToRadians(px) : px;
		this._rotationX = px;
		this.setOrientation(this.createRotationMatrix());
	};

	/**
	* py - angle in Radians or Degrees
	*/
	RigidBody.prototype.set_rotationY=function(py){
		//var rad:Number = (_useDegrees) ? degreesToRadians(py) : py;
		this._rotationY = py;
		this.setOrientation(this.createRotationMatrix());
	};

	/**
	* pz - angle in Radians or Degrees
	*/
	RigidBody.prototype.set_rotationZ=function(pz){
		//var rad:Number = (_useDegrees) ? degreesToRadians(pz) : pz;
		this._rotationZ = pz;
		this.setOrientation(this.createRotationMatrix());
	};
	
	/**
	 * @param vect - [x,y,z] rotation
	 * @returns
	 */
	RigidBody.prototype.setRotation=function(vect){
		this._rotationX=vect[0];
		this._rotationY=vect[1];
		this._rotationZ=vect[2];
		this.setOrientation(this.createRotationMatrix());
	};

	RigidBody.prototype.pitch=function(rot){
		this.setOrientation(JMatrix3D.getAppendMatrix3D(this.get_currentState().orientation, JMatrix3D.getRotationMatrixAxis(rot, Vector3DUtil.X_AXIS)));
	};

	RigidBody.prototype.yaw=function(rot){
		this.setOrientation(JMatrix3D.getAppendMatrix3D(this.get_currentState().orientation, JMatrix3D.getRotationMatrixAxis(rot, Vector3DUtil.Y_AXIS)));
	};

	RigidBody.prototype.roll=function(rot){
		this.setOrientation(JMatrix3D.getAppendMatrix3D(this.get_currentState().orientation, JMatrix3D.getRotationMatrixAxis(rot, Vector3DUtil.Z_AXIS)));
	};
	
	RigidBody.prototype.createRotationMatrix=function(){
		var matrix3D = new Matrix3D();
		matrix3D.appendRotation(this._rotationX, Vector3DUtil.X_AXIS);
		matrix3D.appendRotation(this._rotationY, Vector3DUtil.Y_AXIS);
		matrix3D.appendRotation(this._rotationZ, Vector3DUtil.Z_AXIS);
		return matrix3D;
	};

	RigidBody.prototype.setOrientation=function(orient){
		this._currState.set_orientation(orient.clone());
		this.updateInertia();
		this.updateState();
	};

	RigidBody.prototype.get_position=function(){
		return this._currState.position;
	};

	RigidBody.prototype.get_x=function(){
		return this._currState.position[0];
	};

	RigidBody.prototype.get_y=function(){
		return this._currState.position[1];
	};

	RigidBody.prototype.get_z=function(){
		return _currState.position[2];
	};

	RigidBody.prototype.set_x=function(px){
		this._currState.position[0] = px;
		this.updateState();
	};

	RigidBody.prototype.set_y=function(py){
		this._currState.position[1] = py;
		this.updateState();
	};

	RigidBody.prototype.set_z=function(pz){
		this._currState.position[2] = pz;
		this.updateState();
	};
	
	RigidBody.prototype.moveTo=function(pos){
		this._currState.position = pos.slice(0);
		this.updateState();
	};

	RigidBody.prototype.updateState=function(){
		this._currState.linVelocity = [0,0,0,0];
		this._currState.rotVelocity = [0,0,0,0];
		this.copyCurrentStateToOld();
		this.updateBoundingBox();
	};

	RigidBody.prototype.setVelocity=function(vel){
		this._currState.linVelocity = vel.slice(0);
	};

	RigidBody.prototype.setAngVel=function(angVel){
		this._currState.rotVelocity = angVel.slice(0);
	};

	RigidBody.prototype.setVelocityAux=function(vel){
		this._currLinVelocityAux = vel.slice(0);
	};

	RigidBody.prototype.setAngVelAux=function(angVel){
		this._currRotVelocityAux = angVel.slice(0);
	};

	RigidBody.prototype.addGravity=function(){
		if (!this._movable){
			return;
		}
		this._force = Vector3DUtil.add(this._force, JNumber3D.getScaleVector(jigLib.PhysicsSystem.getInstance().get_gravity(), this._mass));
		this._velChanged = true;
	};
	
	RigidBody.prototype.addExternalForces=function(dt){
		this.addGravity();
	};

	RigidBody.prototype.addWorldTorque=function(t){
		if (!this._movable){
			return;
		}
		this._torque = Vector3DUtil.add(this._torque, t);
		this._velChanged = true;
		this.setActive();
	};

	RigidBody.prototype.addBodyTorque=function(t){
		if (!this._movable){
			return;
		}
		JMatrix3D.multiplyVector(this._currState.get_orientation(), t);
		this.addWorldTorque(t);
	};

	// functions to add forces in the world coordinate frame
	RigidBody.prototype.addWorldForce=function(f, p){
		if (!this._movable){
			return;
		}
		this._force = Vector3DUtil.add(this._force, f);
		this.addWorldTorque(Vector3DUtil.crossProduct(Vector3DUtil.subtract(p, this._currState.position), f));
		this._velChanged = true;
		this.setActive();
	};

	// functions to add forces in the body coordinate frame
	RigidBody.prototype.addBodyForce=function(f, p){
		if (!this._movable){
			return;
		}
		JMatrix3D.multiplyVector(this._currState.get_orientation(), f);
		JMatrix3D.multiplyVector(this._currState.get_orientation(), p);
		this.addWorldForce(f, Vector3DUtil.add(this._currState.position, p));
	};

	// This just sets all forces etc to zero
	RigidBody.prototype.clearForces=function(){
		this._force = [0,0,0,0];
		this._torque = [0,0,0,0];
	};
	

	// functions to add impulses in the world coordinate frame
	RigidBody.prototype.applyWorldImpulse=function(impulse, pos){
		if (!this._movable) return;
		
		this._currState.linVelocity = Vector3DUtil.add(this._currState.linVelocity, JNumber3D.getScaleVector(impulse, this._invMass));

		var rotImpulse = Vector3DUtil.crossProduct(Vector3DUtil.subtract(pos, this._currState.position), impulse);
		JMatrix3D.multiplyVector(this._worldInvInertia, rotImpulse);
		this._currState.rotVelocity = Vector3DUtil.add(this._currState.rotVelocity, rotImpulse);

		this._velChanged = true;
	};

	RigidBody.prototype.applyWorldImpulseAux=function(impulse, pos){
		if (!this._movable) return;
		
		this._currLinVelocityAux = Vector3DUtil.add(this._currLinVelocityAux, JNumber3D.getScaleVector(impulse, this._invMass));

		var rotImpulse = Vector3DUtil.crossProduct(Vector3DUtil.subtract(pos, this._currState.position), impulse);
		JMatrix3D.multiplyVector(this._worldInvInertia, rotImpulse);
		this._currRotVelocityAux = Vector3DUtil.add(this._currRotVelocityAux, rotImpulse);

		this._velChanged = true;
	};

	// functions to add impulses in the body coordinate frame
	RigidBody.prototype.applyBodyWorldImpulse=function(impulse, delta){
		if (!this._movable) return;
		
		this._currState.linVelocity = Vector3DUtil.add(this._currState.linVelocity, JNumber3D.getScaleVector(impulse, this._invMass));
		var rotImpulse = Vector3DUtil.crossProduct(delta, impulse);
		JMatrix3D.multiplyVector(this._worldInvInertia, rotImpulse);
		this._currState.rotVelocity = Vector3DUtil.add(this._currState.rotVelocity, rotImpulse);

		this._velChanged = true;
	};

	RigidBody.prototype.applyBodyWorldImpulseAux=function(impulse, delta){
		if (!this._movable) return;
		
		this._currLinVelocityAux = Vector3DUtil.add(this._currLinVelocityAux, JNumber3D.getScaleVector(impulse, this._invMass));

		var rotImpulse = Vector3DUtil.crossProduct(delta, impulse);
		JMatrix3D.multiplyVector(this._worldInvInertia, rotImpulse);
		this._currRotVelocityAux = Vector3DUtil.add(this._currRotVelocityAux, rotImpulse);

		this._velChanged = true;
	};

	RigidBody.prototype.addConstraint=function(constraint){
		if (!this.findConstraint(constraint)){
			this._constraints.push(constraint);
		}
	};

	RigidBody.prototype.removeConstraint=function(constraint){
		if (this.findConstraint(constraint)){
			this._constraints.splice(this._constraints.indexOf(constraint), 1);
		}
	};

	RigidBody.prototype.removeAllConstraints=function(){
		this._constraints = [];
	};

	RigidBody.prototype.findConstraint=function(constraint){
		for(var i=0, cl=this._constraints.length; i<cl; i++){
			if (constraint == this._constraints[i]){
				return true;
			}
		}
		return false;
	};

	// implementation updates the velocity/angular rotation with the force/torque.
	RigidBody.prototype.updateVelocity=function(dt){
		if (!this._movable || !this._activity){
			return;
		}
		this._currState.linVelocity = Vector3DUtil.add(this._currState.linVelocity, JNumber3D.getScaleVector(this._force, this._invMass * dt));

		var rac = JNumber3D.getScaleVector(this._torque, dt);
		JMatrix3D.multiplyVector(this._worldInvInertia, rac);
		this._currState.rotVelocity = Vector3DUtil.add(this._currState.rotVelocity, rac);
	};
	
	// Updates the position with the auxiliary velocities, and zeros them
	RigidBody.prototype.updatePositionWithAux=function(dt){
		if (!this._movable || !this._activity){
			this._currLinVelocityAux = [0,0,0,0];
			this._currRotVelocityAux = [0,0,0,0];
			return;
		}
		
		var ga = jigLib.PhysicsSystem.getInstance().get_gravityAxis();
		
		if (ga != -1){
			var arr = this._currLinVelocityAux.slice(0);
			arr[(ga + 1) % 3] *= 0.1;
			arr[(ga + 2) % 3] *= 0.1;
			JNumber3D.copyFromArray(this._currLinVelocityAux, arr);
		}

		var angMomBefore = this._currState.rotVelocity.slice(0);
		JMatrix3D.multiplyVector(this._worldInertia, angMomBefore);
		
		this._currState.position = Vector3DUtil.add(this._currState.position, JNumber3D.getScaleVector(Vector3DUtil.add(this._currState.linVelocity, this._currLinVelocityAux), dt));

		var dir = Vector3DUtil.add(this._currState.rotVelocity, this._currRotVelocityAux);
		var ang = Vector3DUtil.get_length(dir) * 180 / Math.PI;
		if (ang > 0){
			Vector3DUtil.normalize(dir);
			ang *= dt;
			var rot = JMatrix3D.getRotationMatrix(dir[0], dir[1], dir[2], ang);
			this._currState.set_orientation(JMatrix3D.getAppendMatrix3D(this._currState.get_orientation(), rot));
				
			this.updateInertia();
		}
		this._currLinVelocityAux = [0,0,0,0];
		this._currRotVelocityAux = [0,0,0,0];
		
		JMatrix3D.multiplyVector(this._worldInvInertia, angMomBefore);
		this._currState.rotVelocity = angMomBefore.slice(0);
			
		this.updateBoundingBox();
	};

	RigidBody.prototype.postPhysics=function(dt){};

	// function provided for the use of Physics system
	RigidBody.prototype.tryToFreeze=function(dt){
		if (!this._movable || !this._activity){
			return;
		}
			
		if (Vector3DUtil.get_length(Vector3DUtil.subtract(this._currState.position, this._lastPositionForDeactivation)) > JConfig.posThreshold){
			this._lastPositionForDeactivation = this._currState.position.slice(0);
			this._inactiveTime = 0;
			return;
		}
		
		var ot = JConfig.orientThreshold;
		var deltaMat = JMatrix3D.getSubMatrix(this._currState.get_orientation(), this._lastOrientationForDeactivation);

		var cols = JMatrix3D.getCols(deltaMat);

		if (Vector3DUtil.get_length(cols[0]) > ot || Vector3DUtil.get_length(cols[1]) > ot || Vector3DUtil.get_length(cols[2]) > ot){
			this._lastOrientationForDeactivation = this._currState.get_orientation().clone();
			this._inactiveTime = 0;
			return;
		}

		if (this.getShouldBeActive()){
			return;
		}

		this._inactiveTime += dt;
		if (this._inactiveTime > JConfig.deactivationTime){
			this._lastPositionForDeactivation = this._currState.position.slice(0);
			this._lastOrientationForDeactivation = this._currState.get_orientation().clone();
			this.setInactive();
		}
	};

	RigidBody.prototype.set_mass=function(m){
		this._mass = m;
		this._invMass = 1 / m;
		this.setInertia(this.getInertiaProperties(m));
	};

	RigidBody.prototype.setInertia=function(matrix3D){
		this._bodyInertia =  matrix3D.clone();
		this._bodyInvInertia = JMatrix3D.getInverseMatrix(this._bodyInertia.clone());
			
		this.updateInertia();
	};
	
	RigidBody.prototype.updateInertia=function(){
		this._invOrientation = JMatrix3D.getTransposeMatrix(this._currState.get_orientation());
			
		this._worldInertia = JMatrix3D.getAppendMatrix3D(
			this._invOrientation,
			JMatrix3D.getAppendMatrix3D(this._currState.get_orientation(), this._bodyInertia)
		);

		this._worldInvInertia = JMatrix3D.getAppendMatrix3D(
			this._invOrientation,
				JMatrix3D.getAppendMatrix3D(this._currState.get_orientation(), this._bodyInvInertia)
			);
	};

	// prevent velocity updates etc 
	RigidBody.prototype.get_movable=function(){
		return this._movable;
	};

	RigidBody.prototype.set_movable=function(mov){
		if (this._type == "PLANE" || this._type == "TERRAIN") 
			return;

		this._movable = mov;
		this.isActive = this._activity = mov;
		this._origMovable = mov;
	};

	RigidBody.prototype.internalSetImmovable=function(){
		if (this._type == "PLANE" || this._type == "TERRAIN") 
			return;
		this._origMovable = this._movable;
		this._movable = false;
	};

	RigidBody.prototype.internalRestoreImmovable=function(){
		if (this._type == "PLANE" || this._type == "TERRAIN") 
			return;
		this._movable = this._origMovable;
	};

	RigidBody.prototype.getVelChanged=function(){
		return this._velChanged;
	};

	RigidBody.prototype.clearVelChanged=function(){
		this._velChanged = false;
	};

	RigidBody.prototype.setActive=function(activityFactor){
		if(!activityFactor) activityFactor=1;
		if (this._movable){
			this.isActive = this._activity = true;
			this._inactiveTime = (1 - activityFactor) * JConfig.deactivationTime;
		}
	};

	RigidBody.prototype.setInactive=function(){
		if (this._movable){
			this.isActive = this._activity = false;
		}
	};

	// Returns the velocity of a point at body-relative position
	RigidBody.prototype.getVelocity=function(relPos){
		return Vector3DUtil.add(this._currState.linVelocity, Vector3DUtil.crossProduct(this._currState.rotVelocity, relPos));
	};

	// As GetVelocity but just uses the aux velocities
	RigidBody.prototype.getVelocityAux=function(relPos){
		return Vector3DUtil.add(this._currLinVelocityAux, Vector3DUtil.crossProduct(this._currRotVelocityAux, relPos));
	};
		

	// indicates if the velocity is above the threshold for freezing
	RigidBody.prototype.getShouldBeActive=function(){
		return ((Vector3DUtil.get_length(this._currState.linVelocity) > JConfig.velThreshold) || (Vector3DUtil.get_length(this._currState.rotVelocity) > JConfig.angVelThreshold));
	};

	RigidBody.prototype.getShouldBeActiveAux=function(){
		return ((Vector3DUtil.get_length(this._currLinVelocityAux) > JConfig.velThreshold) || (Vector3DUtil.get_length(this._currRotVelocityAux) > JConfig.angVelThreshold));
	};

	// damp movement as the body approaches deactivation
	RigidBody.prototype.dampForDeactivation=function(){
		this._currState.linVelocity[0] *= this._linVelDamping[0];
		this._currState.linVelocity[1] *= this._linVelDamping[1];
		this._currState.linVelocity[2] *= this._linVelDamping[2];
		this._currState.rotVelocity[0] *= this._rotVelDamping[0];
		this._currState.rotVelocity[1] *= this._rotVelDamping[1];
		this._currState.rotVelocity[2] *= this._rotVelDamping[2];
			
		this._currLinVelocityAux[0] *= this._linVelDamping[0];
		this._currLinVelocityAux[1] *= this._linVelDamping[1];
		this._currLinVelocityAux[2] *= this._linVelDamping[2];
		this._currRotVelocityAux[0] *= this._rotVelDamping[0];
		this._currRotVelocityAux[1] *= this._rotVelDamping[1];
		this._currRotVelocityAux[2] *= this._rotVelDamping[2];
			
		var r = 0.5;
		var frac = this._inactiveTime / JConfig.deactivationTime;
		if (frac < r){
			return;
		}

		var scale = 1 - ((frac - r) / (1 - r));
		if (scale < 0){
			scale = 0;
		}else if (scale > 1){
			scale = 1;
		}
		this._currState.linVelocity = JNumber3D.getScaleVector(this._currState.linVelocity, scale);
		this._currState.rotVelocity = JNumber3D.getScaleVector(this._currState.rotVelocity, scale);
	};

	// function provided for use of physics system. Activates any
	// body in its list if it's moved more than a certain distance,
	// in which case it also clears its list.
	RigidBody.prototype.doMovementActivations=function(){
		var numBodies = this._bodiesToBeActivatedOnMovement.length;
		if (numBodies == 0 || Vector3DUtil.get_length(Vector3DUtil.subtract(this._currState.position, this._storedPositionForActivation)) < JConfig.posThreshold)
			return;
		
		for (var i = 0; i<numBodies; i++){
			jigLib.PhysicsSystem.getInstance().activateObject(this._bodiesToBeActivatedOnMovement[i]);
		}
		this._bodiesToBeActivatedOnMovement = [];
	};

	// adds the other body to the list of bodies to be activated if
	// this body moves more than a certain distance from either a
	// previously stored position, or the position passed in.
	RigidBody.prototype.addMovementActivation=function(pos, otherBody){
		var len = this._bodiesToBeActivatedOnMovement.length;
		for (var i = 0; i < len; i++){
			if (this._bodiesToBeActivatedOnMovement[i] == otherBody){
				return;
			}
		}
		if (this._bodiesToBeActivatedOnMovement.length == 0){
			this._storedPositionForActivation = pos;
		}
		this._bodiesToBeActivatedOnMovement.push(otherBody);
	};

	// Marks all constraints/collisions as being unsatisfied
	RigidBody.prototype.setConstraintsAndCollisionsUnsatisfied=function(){
		for(var i=0, cl=this._constraints.length; i<cl; i++){
			this._constraints[i].set_satisfied(false);
		}
		for(var i=0, cll=this.collisions.length; i<cll; i++){
			this.collisions[i].satisfied = false;
		}
	};

	RigidBody.prototype.segmentIntersect=function(out, seg, state){
		return false;
	};

	RigidBody.prototype.getInertiaProperties=function(m){
		return new Matrix3D();
	};
		
	RigidBody.prototype.updateBoundingBox=function(){
	};

	RigidBody.prototype.hitTestObject3D=function(obj3D){
		var num1 = Vector3DUtil.get_length(Vector3DUtil.subtract(this._currState.position, obj3D.get_currentState().position));
		var num2 = this._boundingSphere + obj3D.get_boundingSphere();

		if (num1 <= num2){
			return true;
		}

		return false;
	};

	RigidBody.prototype.findNonCollidablesBody=function(body){
		for(var i=0, ncl=this._nonCollidables.length; i<ncl; i++){
			if (body == this._nonCollidables[i])
				return true;
		}
		return false;
	};

	RigidBody.prototype.disableCollisions=function(body){
		if (!this.findNonCollidablesBody(body)){
			this._nonCollidables.push(body);
		}
	};

	RigidBody.prototype.enableCollisions=function(body){
		if (this.findNonCollidablesBody(body)){
			this._nonCollidables.splice(this._nonCollidables.indexOf(body), 1);
		}
	};

	// copies the current position etc to old - normally called only by physicsSystem.
	RigidBody.prototype.copyCurrentStateToOld=function(){
		this._oldState.position = this._currState.position.slice(0);
		this._oldState.set_orientation(this._currState.get_orientation().clone());
		this._oldState.linVelocity = this._currState.linVelocity.slice(0);
		this._oldState.rotVelocity = this._currState.rotVelocity.slice(0);
	};

	// Copy our current state into the stored state
	RigidBody.prototype.storeState=function(){
		this._storeState.position = this._currState.position.slice(0);
		this._storeState.set_orientation(this._currState.get_orientation().clone());
		this._storeState.linVelocity = this._currState.linVelocity.slice(0);
		this._storeState.rotVelocity = this._currState.rotVelocity.slice(0);
	};

	// restore from the stored state into our current state.
	RigidBody.prototype.restoreState=function(){
		this._currState.position = this._storeState.position.slice(0);
		this._currState.set_orientation(this._storeState.get_orientation().clone());
		this._currState.linVelocity = this._storeState.linVelocity.slice(0);
		this._currState.rotVelocity = this._storeState.rotVelocity.slice(0);
	};

	// the "working" state
	RigidBody.prototype.get_currentState=function(){
		return this._currState;
	};

	// the previous state - copied explicitly using copyCurrentStateToOld
	RigidBody.prototype.get_oldState=function(){
		return this._oldState;
	};

	RigidBody.prototype.get_id=function(){
		return this._id;
	};

	RigidBody.prototype.get_type=function(){
		return this._type;
	};

	RigidBody.prototype.get_skin=function(){
		return this._skin;
	};

	RigidBody.prototype.get_boundingSphere=function(){
		return this._boundingSphere;
	};
		
	RigidBody.prototype.get_boundingBox=function(){
		return this._boundingBox;
	};

	// force in world frame
	RigidBody.prototype.get_force=function(){
		return this._force;
	};

	// torque in world frame
	RigidBody.prototype.get_mass=function(){
		return this._mass;
	};

	RigidBody.prototype.get_invMass=function(){
		return this._invMass;
	};

	// inertia tensor in world space
	RigidBody.prototype.get_worldInertia=function(){
		return this._worldInertia;
	};

	// inverse inertia in world frame
	RigidBody.prototype.get_worldInvInertia=function(){
		return this._worldInvInertia;
	};

	RigidBody.prototype.get_nonCollidables=function(){
		return this._nonCollidables;
	};
	
	RigidBody.prototype.get_doShockProcessing=function(){
		return this._doShockProcessing;
	};
	RigidBody.prototype.set_doShockProcessing=function(doShock){
		this._doShockProcessing = doShock;
	};

	//every dimension should be set to 0-1;
	RigidBody.prototype.set_linVelocityDamping=function(vel){
		this._linVelDamping[0] = JNumber3D.getLimiteNumber(vel[0], 0, 1);
		this._linVelDamping[1] = JNumber3D.getLimiteNumber(vel[1], 0, 1);
		this._linVelDamping[2] = JNumber3D.getLimiteNumber(vel[2], 0, 1);
	};
		
	RigidBody.prototype.get_linVelocityDamping=function(){
		return this._linVelDamping;
	};
		
	//every dimension should be set to 0-1;
	RigidBody.prototype.set_rotVelocityDamping=function(vel){
		this._rotVelDamping[0] = JNumber3D.getLimiteNumber(vel[0], 0, 1);
		this._rotVelDamping[1] = JNumber3D.getLimiteNumber(vel[1], 0, 1);
		this._rotVelDamping[2] = JNumber3D.getLimiteNumber(vel[2], 0, 1);
	};
	
	RigidBody.prototype.get_rotVelocityDamping=function(){
		return this._rotVelDamping;
	};
		
	//limit the max value of body's line velocity
	RigidBody.prototype.set_maxLinVelocities=function(vel){
		this._maxLinVelocities = JNumber3D.getLimiteNumber(Math.abs(vel), 0, 500);
	};
	RigidBody.prototype.get_maxLinVelocities=function(){
		return this._maxLinVelocities;
	};

	//limit the max value of body's angle velocity
	RigidBody.prototype.set_maxRotVelocities=function(vel){
		this._maxRotVelocities = JNumber3D.getLimiteNumber(Math.abs(vel), JNumber3D.NUM_TINY, 50);
	};
	
	RigidBody.prototype.get_maxRotVelocities=function(){
		return this._maxRotVelocities;
	};

	RigidBody.prototype.limitVel=function(){
		this._currState.linVelocity[0] = JNumber3D.getLimiteNumber(this._currState.linVelocity[0], -this._maxLinVelocities, this._maxLinVelocities);
		this._currState.linVelocity[1] = JNumber3D.getLimiteNumber(this._currState.linVelocity[1], -this._maxLinVelocities, this._maxLinVelocities);
		this._currState.linVelocity[2] = JNumber3D.getLimiteNumber(this._currState.linVelocity[2], -this._maxLinVelocities, this._maxLinVelocities);
	};

	RigidBody.prototype.limitAngVel=function(){
		var fx = Math.abs(this._currState.rotVelocity[0]) / this._maxRotVelocities;
		var fy = Math.abs(this._currState.rotVelocity[1]) / this._maxRotVelocities;
		var fz = Math.abs(this._currState.rotVelocity[2]) / this._maxRotVelocities;
		var f = Math.max(fx, fy, fz);
		if (f > 1){
			this._currState.rotVelocity = JNumber3D.getDivideVector(this._currState.rotVelocity, f);
		}
	};

	RigidBody.prototype.getTransform=function(){
		if (this._skin != null){
			return this._skin.get_transform();
		}else{
			return null;
		}
	};

	//update skin
	RigidBody.prototype.updateObject3D=function(){
		if (this._skin != null){
			this._skin.set_transform(JMatrix3D.getAppendMatrix3D(this._currState.get_orientation(), JMatrix3D.getTranslationMatrix(this._currState.position[0], this._currState.position[1], this._currState.position[2])));
		}
	};

	RigidBody.prototype.get_material=function(){
		return this._material;
	};

	//coefficient of elasticity
	RigidBody.prototype.get_restitution=function(){
		return this._material.get_restitution();
	};

	RigidBody.prototype.set_restitution=function(restitution){
		this._material.set_restitution(JNumber3D.getLimiteNumber(restitution, 0, 1));
	};

	//coefficient of friction
	RigidBody.prototype.get_friction=function(){
		return this._material.get_friction();
	};

	RigidBody.prototype.set_friction=function(friction){
		this._material.set_friction(JNumber3D.getLimiteNumber(friction, 0, 1));
	};
	
	jigLib.RigidBody=RigidBody;
})(jigLib);