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
        var JConstraint=jigLib.JConstraint;
        var JConfig=jigLib.JConfig;
        var JSphere=jigLib.JSphere;	var MaterialProperties=jigLib.MaterialProperties;	var CollPointInfo=jigLib.CollPointInfo;	var CollisionInfo=jigLib.CollisionInfo;
	 
	var CollDetectSphereSphere=function(){
		this.name = "SphereSphere";
		this.type0 = "SPHERE";
		this.type1 = "SPHERE";
	}
	jigLib.extends(CollDetectSphereSphere,jigLib.CollDetectFunctor);
	
	CollDetectSphereSphere.prototype.collDetect=function(info, collArr){
		var sphere0 = info.body0;
		var sphere1 = info.body1;
		var oldDelta = sphere0.get_oldState().position.subtract(sphere1.get_oldState().position);
		var newDelta = sphere0.get_currentState().position.subtract(sphere1.get_currentState().position);

		var oldDistSq = oldDelta.get_lengthSquared();
		var newDistSq = newDelta.get_lengthSquared();
		var radSum = sphere0.get_radius() + sphere1.get_radius();

		if (Math.min(oldDistSq, newDistSq) < Math.pow(radSum + JConfig.collToll, 2)){
			var oldDist = Math.sqrt(oldDistSq);
			var depth = radSum - oldDist;
			if (oldDist > JNumber3D.NUM_TINY){
				oldDelta = JNumber3D.getDivideVector(oldDelta, oldDist);
			}else{
				oldDelta = Vector3D.Y_AXIS;
				JMatrix3D.multiplyVector(JMatrix3D.getRotationMatrix(0, 0, 1, 360 * Math.random()), oldDelta);
			}

			var worldPos = sphere1.get_oldState().position.add(JNumber3D.getScaleVector(oldDelta, sphere1.get_radius() - 0.5 * depth));

			var collPts = [];
			var cpInfo = new CollPointInfo();
			cpInfo.r0 = worldPos.subtract(sphere0.get_oldState().position);
			cpInfo.r1 = worldPos.subtract(sphere1.get_oldState().position);
			cpInfo.initialPenetration = depth;
			collPts.push(cpInfo);

			var collInfo = new CollisionInfo();
			collInfo.objInfo = info;
			collInfo.dirToBody = oldDelta;
			collInfo.pointInfo = collPts;

			var mat = new MaterialProperties();
			mat.set_restitution(Math.sqrt(sphere0.get_material().get_restitution() * sphere1.get_material().get_restitution()));
			mat.set_friction(Math.sqrt(sphere0.get_material().get_friction() * sphere1.get_material().get_friction()));
			collInfo.mat = mat;
			collArr.push(collInfo);

			info.body0.collisions.push(collInfo);
			info.body1.collisions.push(collInfo);
		}
	}
	
	jigLib.CollDetectSphereSphere=CollDetectSphereSphere;
	
})(jigLib)