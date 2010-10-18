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
	var JMatrix3D=jigLib.JMatrix3D;
	var JNumber3D=jigLib.JNumber3D;
	var JConstraint=jigLib.JConstraint;
	var RigidBody=jigLib.RigidBody;
	
	// Constraints a point on one body to be fixed to a point on another body

	/// allowed_distance indicated how much the points are allowed to deviate.
	/// timescale indicates the timescale over which deviation is eliminated
	/// (suggest a few times dt - be careful if there's a variable timestep!)
	/// if timescale < 0 then the value indicates the number of dts
	var JConstraintPoint=function(body0, body0Pos, body1, body1Pos, allowedDistance, timescale)
	{
		this.Super();
		this._body0 = body0;
		this._body0Pos = body0Pos;
		this._body1 = body1;
		this._body1Pos = body1Pos;
		this._allowedDistance = (allowedDistance) ? allowedDistance : 1;
		this._timescale = (timescale) ? timescale : 1;
		if (this._timescale < JNumber3D.NUM_TINY) _timescale = JNumber3D.NUM_TINY;
		body0.addConstraint(this);
		body1.addConstraint(this);
	};
	jigLib.extend(JConstraintPoint,jigLib.JConstraint);
	
	JConstraintPoint.prototype._maxVelMag = 20;
	JConstraintPoint.prototype._minVelForProcessing = 0.01;

	JConstraintPoint.prototype._body0=null;
	JConstraintPoint.prototype._body1=null;
	JConstraintPoint.prototype._body0Pos=null;
	JConstraintPoint.prototype._body1Pos=null;

	JConstraintPoint.prototype._timescale=null;
	JConstraintPoint.prototype._allowedDistance=null;

	JConstraintPoint.prototype.r0=null;
	JConstraintPoint.prototype.r1=null;
	JConstraintPoint.prototype._worldPos=null;
	JConstraintPoint.prototype._vrExtra=null;
	
	JConstraintPoint.prototype.preApply=function(dt)
	{
		this.set_satisfied(false);
		
		/*
		this.r0 = this._body0Pos.slice(0);
		JMatrix3D.multiplyVector(this._body0.get_currentState().get_orientation(), this.r0);
		this.r1 = this._body1Pos.slice(0);
		JMatrix3D.multiplyVector(this._body1.get_currentState().get_orientation(), this.r1);
		*/
		
		this.r0 = this._body0.get_currentState().get_orientation().transformVector(this._body0Pos);
		this.r1 = this._body1.get_currentState().get_orientation().transformVector(this._body1Pos);

		var worldPos0 = Vector3DUtil.add(this._body0.get_currentState().position, this.r0);
		var worldPos1 = Vector3DUtil.add(this._body1.get_currentState().position, this.r1);
		this._worldPos = JNumber3D.getScaleVector(Vector3DUtil.add(worldPos0, worldPos1), 0.5);

		var deviation = Vector3DUtil.subtract(worldPos0, worldPos1);
		var deviationAmount = Vector3DUtil.get_length(deviation);
		
		if (deviationAmount > this._allowedDistance)
			this._vrExtra = JNumber3D.getScaleVector(deviation, (deviationAmount - this._allowedDistance) / (deviationAmount * Math.max(this._timescale, dt)));
		else
			this._vrExtra = [0,0,0,0];
	};

	JConstraintPoint.prototype.apply=function(dt)
	{
		this.set_satisfied(true);

		if (!this._body0.isActive && !this._body1.isActive)
			return false;

		var currentVel0 = this._body0.getVelocity(this.r0);
		var currentVel1 = this._body1.getVelocity(this.r1);
		var Vr = Vector3DUtil.add(this._vrExtra, Vector3DUtil.subtract(currentVel0, currentVel1));

		var normalVel = Vector3DUtil.get_length(Vr);
		if (normalVel < this._minVelForProcessing)
			return false;

		if (normalVel > this._maxVelMag){
			Vr = JNumber3D.getScaleVector(Vr, this._maxVelMag / normalVel);
			normalVel = this._maxVelMag;
		}
		
		var N = JNumber3D.getDivideVector(Vr, normalVel);
		var tempVec1 = Vector3DUtil.crossProduct(this.r0, N);
		//JMatrix3D.multiplyVector(this._body0.get_worldInvInertia(), tempVec1);
		tempVec1 = this._body0.get_worldInvInertia().transformVector(tempVec1);
		var tempVec2 = Vector3DUtil.crossProduct(this.r1, N);
		//JMatrix3D.multiplyVector(this._body1.get_worldInvInertia(), tempVec2);
		tempVec2 = this._body1.get_worldInvInertia().transformVector(tempVec2);
		
		var denominator = this._body0.get_invMass() 
						+ this._body1.get_invMass() 
						+ Vector3DUtil.dotProduct(N, Vector3DUtil.crossProduct(tempVec1, this.r0)) 
						+ Vector3DUtil.dotProduct(N, Vector3DUtil.crossProduct(tempVec2, this.r1));

		
		if (denominator < JNumber3D.NUM_TINY)
			return false;

		var normalImpulse = JNumber3D.getScaleVector(N, -normalVel / denominator);
		this._body0.applyWorldImpulse(normalImpulse, this._worldPos);
		this._body1.applyWorldImpulse(JNumber3D.getScaleVector(normalImpulse, -1), this._worldPos);
		
		this._body0.setConstraintsAndCollisionsUnsatisfied();
		this._body1.setConstraintsAndCollisionsUnsatisfied();
		this.set_satisfied(true);
		
		return true;
	};
	
	jigLib.JConstraintPoint=JConstraintPoint;
	
})(jigLib);