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

	// pointOnBody is in body coords
	var JConstraintWorldPoint=function(body, pointOnBody, worldPosition) {
		this.super();
		this._body = body;
		this._pointOnBody = pointOnBody;
		this._worldPosition = worldPosition;
		body.addConstraint(this);
	}
	jigLib.extends(JConstraintWorldPoint,jigLib.JConstraint);

	JConstraintWorldPoint.prototype.minVelForProcessing = 0.001;
	JConstraintWorldPoint.prototype.allowedDeviation = 0.01;
	JConstraintWorldPoint.prototype.timescale = 4;
                
	JConstraintWorldPoint.prototype._body=null;
	JConstraintWorldPoint.prototype._pointOnBody=null;
	JConstraintWorldPoint.prototype._worldPosition=null;
	

	JConstraintWorldPoint.prototype.set_worldPosition=function(pos){
		this._worldPosition = pos;
	}
                
	JConstraintWorldPoint.prototype.get_worldPosition=function(){
		return this._worldPosition;
	}
                
	JConstraintWorldPoint.prototype.apply=function(dt){
		this.set_satisfied(true);

		var worldPos = this._pointOnBody.clone();
		JMatrix3D.multiplyVector(this._body.get_currentState().get_orientation(), worldPos);
		worldPos = worldPos.add(this._body.get_currentState().position);
		var R = worldPos.subtract(this._body.get_currentState().position);
		var currentVel = this._body.get_currentState().linVelocity.add(this._body.get_currentState().rotVelocity.crossProduct(R));
                        
		var desiredVel;
		var deviationDir;
		var deviation= worldPos.subtract(this._worldPosition);
		var deviationDistance = deviation.get_length();
		if (deviationDistance > allowedDeviation) {
			deviationDir = JNumber3D.getDivideVector(deviation, deviationDistance);
			desiredVel = JNumber3D.getScaleVector(deviationDir, (this.allowedDeviation - deviationDistance) / (this.timescale * dt));
		} else {
			desiredVel = new Vector3D();
		}
                        
		var N = currentVel.subtract(desiredVel);
		var normalVel = N.get_length();
		if (normalVel < minVelForProcessing) {
			return false;
		}
		N = JNumber3D.getDivideVector(N, normalVel);
                        
		var tempV = R.crossProduct(N);
		JMatrix3D.multiplyVector(this._body.get_worldInvInertia(), tempV);
		var denominator= this._body.get_invMass() + N.dotProduct(tempV.crossProduct(R));
                         
		if (denominator < JNumber3D.NUM_TINY) {
			return false;
		}
                         
		var normalImpulse = -normalVel / denominator;
                        
		this._body.applyWorldImpulse(JNumber3D.getScaleVector(N, normalImpulse), worldPos);
                        
		this._body.setConstraintsAndCollisionsUnsatisfied();
		this.set_satisfied(true);
                        
		return true;
	}
	
	jigLib.JConstraintWorldPoint=JConstraintWorldPoint;
	
})(jigLib)
