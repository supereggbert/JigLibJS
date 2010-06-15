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
        var JConfig=jigLib.JConfig;
        var JCapsule=jigLib.JCapsule;
        var JSegment=jigLib.JSegment;
	var MaterialProperties=jigLib.MaterialProperties;
	var RigidBody=jigLib.RigidBody;
	var CollPointInfo=jigLib.CollPointInfo;
	var CollisionInfo=jigLib.CollisionInfo;

        var CollDetectCapsuleCapsule=function(){
		this.name = "CapsuleCapsule";
		this.type0 = "CAPSULE";
		this.type1 = "CAPSULE";
	}
	jigLib.extends(CollDetectCapsuleCapsule,jigLib.CollDetectFunctor);

	CollDetectCapsuleCapsule.prototype.collDetect=function(info, collArr){
		var capsule0 = info.body0;
		var capsule1 = info.body1;

		if (!capsule0.hitTestObject3D(capsule1)) {
			return;
		}
                        
		if (JConfig.aabbDetection && !capsule0.get_boundingBox().overlapTest(capsule1.get_boundingBox())) {
			return;
		}

		var collPts = [];
		var cpInfo;

		var averageNormal = new Vector3D();
		var oldSeg0= new JSegment(capsule0.getEndPos(capsule0.get_oldState()), JNumber3D.getScaleVector(capsule0.get_oldState().getOrientationCols()[1], -capsule0.get_length()));
		var newSeg0= new JSegment(capsule0.getEndPos(capsule0.get_currentState()), JNumber3D.getScaleVector(capsule0.get_currentState().getOrientationCols()[1], -capsule0.get_length()));
		var oldSeg1= new JSegment(capsule1.getEndPos(capsule1.get_oldState()), JNumber3D.getScaleVector(capsule1.get_oldState().getOrientationCols()[1], -capsule1.get_length()));
		var newSeg1 = new JSegment(capsule1.getEndPos(capsule1.get_currentState()), JNumber3D.getScaleVector(capsule1.get_currentState().getOrientationCols()[1], -capsule1.get_length()));

		var radSum = capsule0.get_radius() + capsule1.get_radius();

		var oldObj = {};
		var oldDistSq = oldSeg0.segmentSegmentDistanceSq(oldObj, oldSeg1);
		var newObj = {};
		var newDistSq = newSeg0.segmentSegmentDistanceSq(oldObj, newSeg1);

		if (Math.min(oldDistSq, newDistSq) < Math.pow(radSum + JConfig.collToll, 2)){
			var pos0 = oldSeg0.getPoint(oldObj.t0);
			var pos1 = oldSeg1.getPoint(oldObj.t1);

			var delta = pos0.subtract(pos1);
			var dist = Math.sqrt(oldDistSq);
			var depth = radSum - dist;

			if (dist > JNumber3D.NUM_TINY){
				delta = JNumber3D.getDivideVector(delta, dist);
			}else{
				delta = Vector3D.Y_AXIS;
				JMatrix3D.multiplyVector(JMatrix3D.getRotationMatrix(0, 0, 1, 360 * Math.random()), delta);
			}

			var worldPos = pos1.add(JNumber3D.getScaleVector(delta, capsule1.get_radius() - 0.5 * depth));
			averageNormal = averageNormal.add(delta);

			cpInfo = new CollPointInfo();
			cpInfo.r0 = worldPos.subtract(capsule0.get_oldState().position);
			cpInfo.r1 = worldPos.subtract(capsule1.get_oldState().position);
			cpInfo.initialPenetration = depth;
			collPts.push(cpInfo);
		}

		oldSeg0 = new JSegment(capsule0.getBottomPos(capsule0.get_oldState()), JNumber3D.getScaleVector(capsule0.get_oldState().getOrientationCols()[1], capsule0.get_length()));
		newSeg0 = new JSegment(capsule0.getBottomPos(capsule0.get_currentState()), JNumber3D.getScaleVector(capsule0.get_currentState().getOrientationCols()[1], capsule0.get_length()));
		oldSeg1 = new JSegment(capsule1.getBottomPos(capsule1.get_oldState()), JNumber3D.getScaleVector(capsule1.get_oldState().getOrientationCols()[1], capsule1.get_length()));
		newSeg1 = new JSegment(capsule1.getBottomPos(capsule1.get_currentState()), JNumber3D.getScaleVector(capsule1.get_currentState().getOrientationCols()[1], capsule1.get_length()));

		oldObj = {};
		oldDistSq = oldSeg0.segmentSegmentDistanceSq(oldObj, oldSeg1);
		newObj = {};
		newDistSq = newSeg0.segmentSegmentDistanceSq(oldObj, newSeg1);

		if (Math.min(oldDistSq, newDistSq) < Math.pow(radSum + JConfig.collToll, 2)){
			pos0 = oldSeg0.getPoint(oldObj.t0);
			pos1 = oldSeg1.getPoint(oldObj.t1);

			delta = pos0.subtract(pos1);
			dist = Math.sqrt(oldDistSq);
			depth = radSum - dist;

			if (dist > JNumber3D.NUM_TINY){
				delta = JNumber3D.getDivideVector(delta, dist);
			}else{
				delta = Vector3D.Y_AXIS;
				JMatrix3D.multiplyVector(JMatrix3D.getRotationMatrix(0, 0, 1, 360 * Math.random()), delta);
			}

			worldPos = pos1.add(JNumber3D.getScaleVector(delta, capsule1.get_radius() - 0.5 * depth));
			averageNormal = averageNormal.add(delta);

			cpInfo = new CollPointInfo();
			cpInfo.r0 = worldPos.subtract(capsule0.get_oldState().position);
			cpInfo.r1 = worldPos.subtract(capsule1.get_oldState().position);
			cpInfo.initialPenetration = depth;
			collPts.push(cpInfo);

		}

		if (collPts.length > 0){
			averageNormal.normalize();
			var collInfo = new CollisionInfo();
			collInfo.objInfo = info;
			collInfo.dirToBody = averageNormal;
			collInfo.pointInfo = collPts;

			var mat = new MaterialProperties();
			mat.set_restitution(Math.sqrt(capsule0.get_material().get_restitution() * capsule1.get_material().get_restitution()));
			mat.set_friction(Math.sqrt(capsule0.get_material().get_friction() * capsule1.get_material().get_friction()));
			collInfo.mat = mat;
			collArr.push(collInfo);

			info.body0.collisions.push(collInfo);
			info.body1.collisions.push(collInfo);
		}
	}
	
	jigLib.CollDetectCapsuleCapsule=CollDetectCapsuleCapsule;
	
})(jigLib)
