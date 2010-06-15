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
        var JConstraint=jigLib.JConstraint;
	var RigidBody=jigLib.RigidBody;

	var JConstraintMaxDistance=function(body0, body0Pos, body1, body1Pos, maxDistance){
		if(!maxDistance) maxDistance=1;
		this.super();
		this._body0 = body0;
		this._body0Pos = body0Pos;
		this._body1 = body1;
		this._body1Pos = body1Pos;
		this._maxDistance = maxDistance;
		body0.addConstraint(this);
		body1.addConstraint(this);
	}
	jigLib.extends(JConstraintMaxDistance,jigLib.JConstraint);
	
	JConstraintMaxDistance.prototype._maxVelMag = 20;
	JConstraintMaxDistance.prototype._minVelForProcessing = 0.01;

	JConstraintMaxDistance.prototype._body0=null;
	JConstraintMaxDistance.prototype._body1=null;
	JConstraintMaxDistance.prototype._body0Pos=null;
	JConstraintMaxDistance.prototype._body1Pos=null;
	JConstraintMaxDistance.prototype._maxDistance=null;

	JConstraintMaxDistance.prototype.r0=null;
	JConstraintMaxDistance.prototype.r1=null;
	JConstraintMaxDistance.prototype._worldPos=null;
	JConstraintMaxDistance.prototype._currentRelPos0=null;
	
	JConstraintMaxDistance.prototype.preApply=function(dt){
		this.set_satisfied(false);
		
		this.r0 = this._body0Pos.clone();
		JMatrix3D.multiplyVector(this._body0.get_currentState().get_orientation(), this.r0);
		this.r1 = this._body1Pos.clone();
		JMatrix3D.multiplyVector(this._body1.get_currentState().get_orientation(), this.r1);

		var worldPos0 = this._body0.get_currentState().position.add(this.r0);
		var worldPos1 = this._body1.get_currentState().position.add(this.r1);
		this._worldPos = JNumber3D.getScaleVector(worldPos0.add(worldPos1), 0.5);

		this._currentRelPos0 = worldPos0.subtract(worldPos1);
	}

	JConstraintMaxDistance.prototype.apply=function(dt){
		this.set_satisfied(true);

		if (!this._body0.isActive && !this._body1.isActive){
			return false;
		}
		
		var currentVel0 = this._body0.getVelocity(this.r0);
		var currentVel1 = this._body1.getVelocity(this.r1);

		var predRelPos0 = this._currentRelPos0.add(JNumber3D.getScaleVector(currentVel0.subtract(currentVel1), dt));
		var clampedRelPos0 = predRelPos0.clone();
		var clampedRelPos0Mag = clampedRelPos0.get_length();
		if (clampedRelPos0Mag <= JNumber3D.NUM_TINY){
			return false;
		}
		if (clampedRelPos0Mag > this._maxDistance){
			clampedRelPos0 = JNumber3D.getScaleVector(clampedRelPos0, this._maxDistance / clampedRelPos0Mag);
		}

		var desiredRelVel0 = JNumber3D.getDivideVector(clampedRelPos0.subtract(this._currentRelPos0), dt);
		var Vr = currentVel0.subtract(currentVel1).subtract(desiredRelVel0);

		var normalVel = Vr.get_length();
		if (normalVel > this._maxVelMag){
			Vr = JNumber3D.getScaleVector(Vr,this. _maxVelMag / normalVel);
			normalVel = this._maxVelMag;
		}else if (normalVel < this._minVelForProcessing){
			return false;
		}

		var N = JNumber3D.getDivideVector(Vr, normalVel);
		var tempVec1 = this.r0.crossProduct(N);
		JMatrix3D.multiplyVector(this._body0.get_worldInvInertia(), tempVec1);
		var tempVec2 = this.r1.crossProduct(N);
		JMatrix3D.multiplyVector(this._body1.get_worldInvInertia(), tempVec2);
		var denominator = this._body0.get_invMass() + this._body1.get_invMass() + N.dotProduct(tempVec1.crossProduct(this.r0)) + N.dotProduct(tempVec2.crossProduct(this.r1));
		if (denominator < JNumber3D.NUM_TINY){
			return false;
		}

		var normalImpulse = JNumber3D.getScaleVector(N, -normalVel / denominator);
		this._body0.applyWorldImpulse(normalImpulse, this._worldPos);
		this._body1.applyWorldImpulse(JNumber3D.getScaleVector(normalImpulse, -1), this._worldPos);

		this._body0.setConstraintsAndCollisionsUnsatisfied();
		this._body1.setConstraintsAndCollisionsUnsatisfied();
		this.set_satisfied(true);
		return true;
	}
	
	jigLib.JConstraintMaxDistance=JConstraintMaxDistance;
	
})(jigLib)
