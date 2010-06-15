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
	
	var JCar=function(skin){
		this._chassis = new JChassis(this, skin);
		this._wheels = [];
		this._steerWheels = [];
		this._destSteering = this._destAccelerate = this._steering = this._accelerate = this._HBrake = 0;
		this.setCar();
	}
	
	JCar.prototype._maxSteerAngle=null;
	JCar.prototype._steerRate=null;
	JCar.prototype._driveTorque=null;

	JCar.prototype._destSteering=null;
	JCar.prototype._destAccelerate=null;

	JCar.prototype._steering=null;
	JCar.prototype._accelerate=null;
	JCar.prototype._HBrake=null;

	JCar.prototype._chassis=null;
	JCar.prototype._wheels=null;
	JCar.prototype._steerWheels=null;

	JCar.prototype.setCar=function(maxSteerAngle, steerRate, driveTorque){
		if(maxSteerAngle==null) maxSteerAngle=45;
		if(steerRate==null) steerRate=4;
		if(driveTorque==null) driveTorque=500;
		
		this._maxSteerAngle = maxSteerAngle;
		this._steerRate = steerRate;
		this._driveTorque = driveTorque;
	}

	JCar.prototype.setupWheel=function(_name, pos, wheelSideFriction, wheelFwdFriction, wheelTravel, wheelRadius, wheelRestingFrac, wheelDampingFrac, wheelNumRays){
		if(wheelSideFriction==null) wheelSideFriction=2;
		if(wheelFwdFriction==null) wheelFwdFriction=2;
		if(wheelTravel==null) wheelTravel=3;
		if(wheelRadius==null) wheelRadius=10;
		if(wheelRestingFrac==null) wheelRestingFrac=0.5;
		if(wheelDampingFrac==null) wheelDampingFrac=0.5;
		if(wheelNumRays==null) wheelNumRays=1;
		
		var gravity = PhysicsSystem.getInstance().get_gravity().clone();
		var mass = this._chassis.get_mass();
		var mass4 = mass / _steerRate;
		var gravityLen = gravity.get_length();
                        
		gravity.normalize();
		var axis =JNumber3D.getScaleVector(gravity,-1);
		var spring = mass4 * gravityLen / (wheelRestingFrac * wheelTravel);
		var inertia = 0.5 * wheelRadius * wheelRadius * mass;
		var damping = 2 * Math.sqrt(spring * mass);
		damping /= this._steerRate;
		damping *= wheelDampingFrac;

		this._wheels[_name] = new JWheel(this);
		this._wheels[_name].setup(pos, axis, spring, wheelTravel, inertia, wheelRadius, wheelSideFriction, wheelFwdFriction, damping, wheelNumRays);
	}

	JCar.prototype.get_chassis=function(){
		return this._chassis;
	}

	JCar.prototype.get_wheels=function(){
		return this._wheels;
	}

	JCar.prototype.setAccelerate=function(val){
		this._destAccelerate = val;
	}

	JCar.prototype.setSteer=function(wheels, val){
		this._destSteering = val;
		this._steerWheels = [];
		for (var i in wheels){
			if (this.findWheel(wheels[i])){
				this._steerWheels[wheels[i]] = this._wheels[wheels[i]];
			}
		}
	}

	JCar.prototype.findWheel=function(_name){
		for (var i in _wheels){
			if (i == _name){
				return true;
			}
		}
		return false;
	}

	JCar.prototype.setHBrake=function(val){
		this._HBrake = val;
	}

	JCar.prototype.addExternalForces=function(dt){
		wheels=this.get_wheels();
		for(var i=0;i<wheels.length;i++){
			wheels[i].addForcesToCar(dt);
		}
	}

	// Update stuff at the end of physics
	JCar.prototype.postPhysics=function(dt){
		wheels=this.get_wheels();
		for(var i=0;i<wheels.length;i++){
			wheels[i].update(dt);
		}

		var deltaAccelerate = dt * this._steerRate;
		var deltaSteering = dt * this._steerRate;
		var dAccelerate = this._destAccelerate - this._accelerate;
		if (dAccelerate < -deltaAccelerate){
			dAccelerate = -deltaAccelerate;
		}else if (dAccelerate > deltaAccelerate){
			dAccelerate = deltaAccelerate;
		}
		this._accelerate += dAccelerate;

		var dSteering = _destSteering - this._steering;
		if (dSteering < -deltaSteering){
			dSteering = -deltaSteering;
		}else if (dSteering > deltaSteering){
			dSteering = deltaSteering;
		}
		this._steering += dSteering;

		for(var i=0;i<wheels.length;i++){
			wheels[i].addTorque(this._driveTorque * this._accelerate);
			wheels[i].setLock(this._HBrake > 0.5);
		}

		var alpha = Math.abs(this._maxSteerAngle * this._steering);
		var angleSgn = (this._steering > 0) ? 1 : -1;
		for(var i=0;i<this._steerWheels.length;i++){
			var _steerWheel=this._steerWheels[i];
			_steerWheel.setSteerAngle(angleSgn * alpha);
		}
	}

	JCar.prototype.getNumWheelsOnFloor=function(){
		var count = 0;
		wheels=this.get_wheels();
		for(var i=0;i<wheels.length;i++){
			wheels[i].update(dt);
			if (wheels[i].getOnFloor()){
				count++;
			}
		}
		return count;
	}	
	
	jigLib.JCar=JCar;
	
})(jigLib);

