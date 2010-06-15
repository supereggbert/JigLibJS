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
	var Matrix3D=jigLib.Matrix3D;
	var JMatrix3D=jigLib.JMatrix3D;
        var JNumber3D=jigLib.JNumber3D;
        var PhysicsController=jigLib.PhysicsController;
	var JConstraintMaxDistance=jigLib.JConstraintMaxDistance;
	var JConstraintPoint=jigLib.JConstraintPoint;

	var HingeJoint=function(body0, body1,hingeAxis, hingePosRel0,hingeHalfWidth, hingeFwdAngle,hingeBckAngle, sidewaysSlack, damping){
		this._body0 = body0;
		this._body1 = body1;
		this._hingeAxis = hingeAxis.clone();
		this._hingePosRel0 = hingePosRel0.clone();
		this._usingLimit = false;
		this._hingeEnabled = false;
		this._broken = false;
		this._damping = damping;
		this._extraTorque = 0;

		this._hingeAxis.normalize();
		var _hingePosRel1 = this._body0.get_currentState().position.add(this._hingePosRel0.subtract(this._body1.get_currentState().position));

		var relPos0a = this._hingePosRel0.add(JNumber3D.getScaleVector(this._hingeAxis, hingeHalfWidth));
		var relPos0b = this._hingePosRel0.subtract(JNumber3D.getScaleVector(this._hingeAxis, hingeHalfWidth));

		var relPos1a = _hingePosRel1.add(JNumber3D.getScaleVector(this._hingeAxis, hingeHalfWidth));
		var relPos1b = _hingePosRel1.subtract(JNumber3D.getScaleVector(this._hingeAxis, hingeHalfWidth));

		var timescale = 1 / 20;
		var allowedDistanceMid = 0.005;
		var allowedDistanceSide = sidewaysSlack * hingeHalfWidth;

		this.sidePointConstraints = [];
		this.sidePointConstraints[0] = new JConstraintMaxDistance(this._body0, relPos0a, this._body1, relPos1a, allowedDistanceSide);
		this.sidePointConstraints[1] = new JConstraintMaxDistance(this._body0, relPos0b, this._body1, relPos1b, allowedDistanceSide);

		this.midPointConstraint = new JConstraintPoint(this._body0, this._hingePosRel0, this._body1, _hingePosRel1, allowedDistanceMid, timescale);

		if (hingeFwdAngle <= this.MAX_HINGE_ANGLE_LIMIT){
			var perpDir = Vector3D.Y_AXIS;
			if (perpDir.dotProduct(this._hingeAxis) > 0.1){
				perpDir.x = 1;
				perpDir.y = 0;
				perpDir.z = 0;
			}
			var sideAxis = this._hingeAxis.crossProduct(perpDir);
			perpDir = sideAxis.crossProduct(this._hingeAxis);
			perpDir.normalize();

			var len = 10 * hingeHalfWidth;
			var hingeRelAnchorPos0 = JNumber3D.getScaleVector(perpDir, len);
			var angleToMiddle = 0.5 * (hingeFwdAngle - hingeBckAngle);
			var hingeRelAnchorPos1 = hingeRelAnchorPos0.clone();
			JMatrix3D.multiplyVector(JMatrix3D.getRotationMatrix(this._hingeAxis.x, this._hingeAxis.y, this._hingeAxis.z, -angleToMiddle), hingeRelAnchorPos1);

			var hingeHalfAngle = 0.5 * (hingeFwdAngle + hingeBckAngle);
			var allowedDistance = len * 2 * Math.sin(0.5 * hingeHalfAngle * Math.PI / 180);

			var hingePos = this._body1.get_currentState().position.add(this._hingePosRel0);
			var relPos0c = hingePos.add(hingeRelAnchorPos0.subtract(this._body0.get_currentState().position));
			var relPos1c = hingePos.add(hingeRelAnchorPos1.subtract(this._body1.get_currentState().position));

			this.maxDistanceConstraint = new JConstraintMaxDistance(this._body0, relPos0c, this._body1, relPos1c, allowedDistance);
			this._usingLimit = true;
		}
		if (this._damping <= 0){
			this._damping = -1;
		}else{
			this._damping = JNumber3D.getLimiteNumber(this._damping, 0, 1);
		}

		this.enableHinge();
	}
	jigLib.extends(HingeJoint,jigLib.PhysicsController);
	
	HingeJoint.prototype.MAX_HINGE_ANGLE_LIMIT = 150;
	HingeJoint.prototype._hingeAxis = null;
	HingeJoint.prototype._hingePosRel0 = null;
	HingeJoint.prototype._body0 = null;
	HingeJoint.prototype._body1 = null;
	HingeJoint.prototype._usingLimit = null;
	HingeJoint.prototype._hingeEnabled = null;
	HingeJoint.prototype._broken = null;
	HingeJoint.prototype._damping = null;
	HingeJoint.prototype._extraTorque = null;
	
	HingeJoint.prototype.sidePointConstraints = null;
	HingeJoint.prototype.midPointConstraint = null;
	HingeJoint.prototype.maxDistanceConstraint = null;

	HingeJoint.prototype.enableHinge=function(){
		if (this._hingeEnabled){
			return;
		}
		this.midPointConstraint.enableConstraint();
		this.sidePointConstraints[0].enableConstraint();
		this.sidePointConstraints[1].enableConstraint();
		if (this._usingLimit && !this._broken){
			this.maxDistanceConstraint.enableConstraint();
                        }
                        this.enableController();
                        this._hingeEnabled = true;
                }

	HingeJoint.prototype.disableHinge=function(){
		if (!this._hingeEnabled){
			return;
		}
		this.midPointConstraint.disableConstraint();
		this.sidePointConstraints[0].disableConstraint();
		this.sidePointConstraints[1].disableConstraint();
		if (this._usingLimit && !this._broken){
			this.maxDistanceConstraint.disableConstraint();
		}
		this.disableController();
		this._hingeEnabled = false;
	}

	HingeJoint.prototype.breakHinge=function(){
		if (this._broken){
			return;
		}
		if (this._usingLimit){
			this.maxDistanceConstraint.disableConstraint();
		}
		this._broken = true;
	}

	HingeJoint.prototype.mendHinge=function(){
		if (!this._broken){
			return;
		}
		if (this._usingLimit){
			this.maxDistanceConstraint.enableConstraint();
		}
		this._broken = false;
	}

	HingeJoint.prototype.setExtraTorque=function(torque){
		this._extraTorque = torque;
	}

	HingeJoint.prototype.getHingeEnabled=function(){
		return this._hingeEnabled;
	}

	HingeJoint.prototype.isBroken=function(){
		return this._broken;
	}

	HingeJoint.prototype.getHingePosRel0=function(){
		return this._hingePosRel0;
	}

	HingeJoint.prototype.updateController=function(dt){
		if (this._damping > 0){
			var hingeAxis = this._body1.get_currentState().rotVelocity.subtract(this._body0.get_currentState().rotVelocity);
			hingeAxis.normalize();

			var angRot1 = this._body0.get_currentState().rotVelocity.dotProduct(hingeAxis);
			var angRot2 = this._body1.get_currentState().rotVelocity.dotProduct(hingeAxis);

			var avAngRot = 0.5 * (angRot1 + angRot2);
			var frac = 1 - this._damping;
			var newAngRot1= avAngRot + (angRot1 - avAngRot) * frac;
			var newAngRot2= avAngRot + (angRot2 - avAngRot) * frac;

			var newAngVel1 = this._body0.get_currentState().rotVelocity.add(JNumber3D.getScaleVector(hingeAxis, newAngRot1 - angRot1));
			var newAngVel2 = this._body1.get_currentState().rotVelocity.add(JNumber3D.getScaleVector(hingeAxis, newAngRot2 - angRot2));

			this._body0.setAngVel(newAngVel1);
			this._body1.setAngVel(newAngVel2);
		}

		if (this._extraTorque != 0){
			var torque1 = this._hingeAxis.clone();
			JMatrix3D.multiplyVector(this._body0.get_currentState().get_orientation(), torque1);
			torque1 = JNumber3D.getScaleVector(torque1, this._extraTorque);

			this._body0.addWorldTorque(torque1);
			this._body1.addWorldTorque(JNumber3D.getScaleVector(torque1, -1));
		}
	}
	
	jigLib.HingeJoint=HingeJoint;
	
})(jigLib)
