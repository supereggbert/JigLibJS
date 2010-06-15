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

	var CollPointInfo=function(){
		this.accumulatedFrictionImpulse=new Vector3D();
	}
	CollPointInfo.prototype.initialPenetration=null;
        CollPointInfo.prototype.r0;
        CollPointInfo.prototype.r1;
        CollPointInfo.prototype.position;

        CollPointInfo.prototype.minSeparationVel = 0;
        CollPointInfo.prototype.denominator = 0;

        CollPointInfo.prototype.accumulatedNormalImpulse = 0;
        CollPointInfo.prototype.accumulatedNormalImpulseAux = 0;
        CollPointInfo.prototype.accumulatedFrictionImpulse = null;
	
	jigLib.CollPointInfo=CollPointInfo;
})(jigLib)
