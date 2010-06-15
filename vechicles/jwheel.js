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
	var Vector3D=jigLib.Vector3D;
	var JMatrix3D=jigLib.JMatrix3D;
        var JNumber3D=jigLib.JNumber3D;
        var JSegment=jigLib.JSegment;
	
	var JWheel=function(car){
		this._car = car;
	}
	
	JWheel.prototype.noslipVel = 0.2;
	JWheel.prototype.slipVel = 0.4;
	JWheel.prototype.slipFactor = 0.7;
	JWheel.prototype.smallVel = 3;

	JWheel.prototype._car=null;
	JWheel.prototype._pos=null;
	JWheel.prototype._axisUp=null;
	JWheel.prototype._spring=null;
 	JWheel.prototype._travel=null;
	JWheel.prototype._inertia=null;
	JWheel.prototype._radius=null;
	JWheel.prototype._sideFriction=null;
	JWheel.prototype._fwdFriction=null;
	JWheel.prototype._damping=null;
	JWheel.prototype._numRays=null;

	JWheel.prototype._angVel=null;
	JWheel.prototype._steerAngle=null;
	JWheel.prototype._torque=null;
	JWheel.prototype._driveTorque=null;
	JWheel.prototype._axisAngle=null;
	JWheel.prototype._displacement=null;
	JWheel.prototype._upSpeed=null;
	JWheel.prototype._rotDamping=null;

	JWheel.prototype._locked=null;
	JWheel.prototype._lastDisplacement=null;
	JWheel.prototype._lastOnFloor=null;
	JWheel.prototype._angVelForGrip=null;

	JWheel.prototype.worldPos=null;
	JWheel.prototype.worldAxis=null;
	JWheel.prototype.wheelFwd=null;
	JWheel.prototype.wheelUp=null;
	JWheel.prototype.wheelLeft=null;
	JWheel.prototype.wheelRayEnd=null;
	JWheel.prototype.wheelRay=null;
	JWheel.prototype.groundUp=null;
	JWheel.prototype.groundLeft=null;
	JWheel.prototype.groundFwd=null;
	JWheel.prototype.wheelPointVel=null;
	JWheel.prototype.rimVel=null;
	JWheel.prototype.worldVel=null;
	JWheel.prototype.wheelCentreVel=null;
	
	/*
	* pos: position relative to car, in car's space
	* axisUp: in car's space
	* spring: force per suspension offset
	* travel: suspension travel upwards
	* inertia: inertia about the axel
	* radius: wheel radius
	*/
	JWheel.prototype.setup=function(pos, axisUp, spring, travel, inertia, radius, sideFriction, fwdFriction, damping, numRays){
		if(spring==null) spring=0;
		if(travel==null) travel=0;
		if(inertia==null) inertia=0;
		if(radius==null) radius=0;
		if(sideFriction==null) sideFriction=0;
		if(fwdFriction==null) fwdFriction=0;
		if(damping==null) damping=0;
		if(numRays==null) numRays=0;
		
		this._pos = pos;
		this._axisUp = axisUp;
		this._spring = spring;
		this._travel = travel;
		this._inertia = inertia;
		this._radius = radius;
		this._sideFriction = sideFriction;
		this._fwdFriction = fwdFriction;
		this._damping = damping;
		this._numRays = numRays;
		this.reset();
	}

	// power
	JWheel.prototype.addTorque=function(torque){
		this._driveTorque += torque;
	}

	// lock/unlock the wheel
	JWheel.prototype.setLock=function(lock){
		this._locked = lock;
	}

	JWheel.prototype.setSteerAngle=function(steer){
		this._steerAngle = steer;
	}

	// get steering angle in degrees
	JWheel.prototype.getSteerAngle=function(){
		return this._steerAngle;
	}

	JWheel.prototype.getPos=function(){
		return this._pos;
	}
	

	// the suspension axis in the car's frame
	JWheel.prototype.getLocalAxisUp=function(){
		return this._axisUp;
	}

	JWheel.prototype.getActualPos=function(){
		return this._pos.add(JNumber3D.getScaleVector(this._axisUp, this._displacement));
	}

	// wheel radius
	JWheel.prototype.getRadius=function(){
		return this._radius;
	}

	// the displacement along our up axis
	JWheel.prototype.getDisplacement=function(){
		return this._displacement;
	}

	JWheel.prototype.getAxisAngle=function(){
		return this._axisAngle;
	}

	JWheel.prototype.getRollAngle=function(){
		return 0.1 * this._angVel * 180 / Math.PI;
	}

	JWheel.prototype.setRotationDamping=function(vel){
		this._rotDamping = vel;
	}
	JWheel.prototype.getRotationDamping=function(){
		return this._rotDamping;
	}
                
	//if it's on the ground.
	JWheel.prototype.getOnFloor=function(){
		return this._lastOnFloor;
	}

	// Adds the forces die to this wheel to the parent. Return value indicates if it's on the ground.
	JWheel.prototype.addForcesToCar=function(dt){
		var force = new Vector3D();
		this._lastDisplacement = this._displacement;
		this._displacement = 0;

		var carBody = this._car.get_chassis();
		worldPos = this._pos.clone();
		JMatrix3D.multiplyVector(carBody.get_currentState().get_orientation(), worldPos);
		worldPos = carBody.get_currentState().position.add(worldPos);
		worldAxis = _axisUp.clone();
		JMatrix3D.multiplyVector(carBody.get_currentState().get_orientation(), worldAxis);

		wheelFwd = carBody.get_currentState().getOrientationCols()[2].clone();
		JMatrix3D.multiplyVector(JMatrix3D.getRotationMatrix(worldAxis.x, worldAxis.y, worldAxis.z, this._steerAngle), wheelFwd);
		wheelUp = worldAxis;
		wheelLeft = wheelUp.crossProduct(wheelFwd);
		wheelLeft.normalize();

		var rayLen = 2 * this._radius + this._travel;
		wheelRayEnd = worldPos.subtract(JNumber3D.getScaleVector(worldAxis, this._radius));
		wheelRay = new JSegment(wheelRayEnd.add(JNumber3D.getScaleVector(worldAxis, rayLen)), JNumber3D.getScaleVector(worldAxis, -rayLen));

		var collSystem = PhysicsSystem.getInstance().getCollisionSystem();

		var maxNumRays = 10;
		var numRays = Math.min(this._numRays, maxNumRays);

		var objArr = [];
		var segments = [];

		var deltaFwd = (2 * this._radius) / (numRays + 1);
		var deltaFwdStart = deltaFwd;

		this._lastOnFloor = false;

		var distFwd;
		var yOffset;
		var bestIRay = 0;
		var iRay = 0;
		for (iRay = 0; iRay < numRays; iRay++){
			objArr[iRay] = {};
			distFwd = (deltaFwdStart + iRay * deltaFwd) - this._radius;
			yOffset = this._radius * (1 - Math.cos(90 * (distFwd / this._radius) * Math.PI / 180));
			segments[iRay] = wheelRay.clone();
			segments[iRay].set_origin(segments[iRay].get_origin().add(JNumber3D.getScaleVector(wheelFwd, distFwd).add(JNumber3D.getScaleVector(wheelUp, yOffset))));
			if (collSystem.segmentIntersect(objArr[iRay], segments[iRay], carBody)) {
				this._lastOnFloor = true;
				if (objArr[iRay].fracOut < objArr[bestIRay].fracOut){
					bestIRay = iRay;
				}
			}
		}

		if (!this._lastOnFloor){
			return false;
		}

		var frac= objArr[bestIRay].fracOut;
		var groundPos = objArr[bestIRay].posOut;
		var otherBody = objArr[bestIRay].bodyOut;

		var groundNormal = worldAxis.clone();
		if (numRays > 1){
			for (iRay = 0; iRay < numRays; iRay++){
				if (objArr[iRay].fracOut <= 1){
					groundNormal = groundNormal.add(JNumber3D.getScaleVector(worldPos.subtract(segments[iRay].getEnd()), 1 - objArr[iRay].fracOut));
				}
			}
			groundNormal.normalize();
		}else{
			groundNormal = objArr[bestIRay].normalOut;
		}

		this._displacement = rayLen * (1 - frac);
		if (this._displacement < 0){
			this._displacement = 0;
		}else if (this._displacement > this._travel){
			this._displacement = this._travel;
		}

		var displacementForceMag = this._displacement * this._spring;
		displacementForceMag *= groundNormal.dotProduct(worldAxis);

		var dampingForceMag = this._upSpeed * this._damping;
		var totalForceMag = displacementForceMag + dampingForceMag;
		if (totalForceMag < 0){
			totalForceMag = 0;
		}
		var extraForce = JNumber3D.getScaleVector(worldAxis, totalForceMag);
		force = force.add(extraForce);

		groundUp = groundNormal;
		groundLeft = groundNormal.crossProduct(wheelFwd);
		groundLeft.normalize();
		groundFwd = groundLeft.crossProduct(groundUp);

		var tempv = this._pos.clone();
		JMatrix3D.multiplyVector(carBody.get_currentState().get_orientation(), tempv);
		wheelPointVel = carBody.get_currentState().linVelocity.add(carBody.get_currentState().rotVelocity.crossProduct(tempv));

		rimVel = JNumber3D.getScaleVector(wheelLeft.crossProduct(groundPos.subtract(worldPos)), this._angVel);
		wheelPointVel = wheelPointVel.add(rimVel);

		if (otherBody.movable){
			worldVel = otherBody.get_currentState().linVelocity.add(otherBody.get_currentState().rotVelocity.crossProduct(groundPos.subtract(otherBody.get_currentState().position)));
			wheelPointVel = wheelPointVel.subtract(worldVel);
		}

		var friction = this._sideFriction;
		var sideVel = wheelPointVel.dotProduct(groundLeft);
		if ((sideVel > slipVel) || (sideVel < -slipVel)){
			friction *= slipFactor;
		}else if ((sideVel > noslipVel) || (sideVel < -noslipVel)){
			friction *= (1 - (1 - slipFactor) * (Math.abs(sideVel) - noslipVel) / (slipVel - noslipVel));
		}
		if (sideVel < 0){
			friction *= -1;
		}
		if (Math.abs(sideVel) < smallVel){
			friction *= Math.abs(sideVel) / smallVel;
		}

		var sideForce= -friction * totalForceMag;
		extraForce = JNumber3D.getScaleVector(groundLeft, sideForce);
		force = force.add(extraForce);

		friction = this._fwdFriction;
		var fwdVel = wheelPointVel.dotProduct(groundFwd);
		if ((fwdVel > slipVel) || (fwdVel < -slipVel)){
			friction *= slipFactor;
		}else if ((fwdVel > noslipVel) || (fwdVel < -noslipVel)){
			friction *= (1 - (1 - slipFactor) * (Math.abs(fwdVel) - noslipVel) / (slipVel - noslipVel));
		}
		if (fwdVel < 0){
			friction *= -1;
		}
		if (Math.abs(fwdVel) < smallVel){
			friction *= (Math.abs(fwdVel) / smallVel);
		}
		var fwdForce = -friction * totalForceMag;
		extraForce = JNumber3D.getScaleVector(groundFwd, fwdForce);
		force = force.add(extraForce);

		wheelCentreVel = carBody.get_currentState().linVelocity.add(carBody.get_currentState().rotVelocity.crossProduct(tempv));
		this._angVelForGrip = wheelCentreVel.dotProduct(groundFwd) / this._radius;
		this._torque += (-fwdForce * this._radius);

		carBody.addWorldForce(force, groundPos);
		if (otherBody.movable){
			var maxOtherBodyAcc = 500;
			var maxOtherBodyForce = maxOtherBodyAcc * otherBody.get_mass();
			if (force.get_lengthSquared() > maxOtherBodyForce * maxOtherBodyForce){
				force = JNumber3D.getScaleVector(force, maxOtherBodyForce / force.get_length());
			}
			otherBody.addWorldForce(JNumber3D.getScaleVector(force, -1), groundPos);
		}
		return true;
	}

	// Updates the rotational state etc
	JWheel.prototype.update=function(dt){
		if (dt <= 0){
			return;
		}
		var origAngVel = this._angVel;
		this._upSpeed = (this._displacement - this._lastDisplacement) / Math.max(dt, JNumber3D.NUM_TINY);

		if (this._locked){
			this._angVel = 0;
			this._torque = 0;
		}else{
			this._angVel += (this._torque * dt / this._inertia);
			this._torque = 0;

			if (((origAngVel > this._angVelForGrip) && (this._angVel < this._angVelForGrip)) || ((origAngVel < this._angVelForGrip) && (this._angVel > this._angVelForGrip))){
				this._angVel = this._angVelForGrip;
			}

			this._angVel += this._driveTorque * dt / this._inertia;
			this._driveTorque = 0;

			if (this._angVel < -100){
				this._angVel = -100;
			}else if (this._angVel > 100){
				this._angVel = 100;
			}
			this._angVel *= _rotDamping;
			this._axisAngle += (this._angVel * dt * 180 / Math.PI);
		}

	}

	JWheel.prototype.reset=function(){
		this._angVel = 0;
		this._steerAngle = 0;
		this._torque = 0;
		this._driveTorque = 0;
		this._axisAngle = 0;
		this._displacement = 0;
		this._upSpeed = 0;
		this._locked = false;
		this._lastDisplacement = 0;
		this._lastOnFloor = false;
		this._angVelForGrip = 0;
		this._rotDamping = 0.99;
	}
	
	jigLib.JWheel=JWheel;
	
})(jigLib)
	