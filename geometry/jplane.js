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
        var JConfig=jigLib.JConfig;
        var ISkin3D=jigLib.ISkin3D;
        var PhysicsState=jigLib.PhysicsState;
	var RigidBody=jigLib.RigidBody;
	
	var JPlane=function(skin, initNormal){
		this.super(skin);
		if (initNormal == undefined) {
			this._initNormal = new Vector3D(0, 0, -1);
			this._normal = this._initNormal.clone();
		}else{
			this._initNormal = initNormal.clone();
			this._normal = this._initNormal.clone();
		}
                        
		this._distance = 0;
		this._type = "PLANE";
		this._movable=false;
	}
	jigLib.extends(JPlane,jigLib.RigidBody);
	
	JPlane.prototype._initNormal=null;
	JPlane.prototype._normal=null;
	JPlane.prototype._distance=null;

	JPlane.prototype.get_normal=function(){
		return this._normal;
	}

	JPlane.prototype.get_distance=function(){
		return this._distance;
	}

	JPlane.prototype.pointPlaneDistance=function(pt){
		return this._normal.dotProduct(pt) - this._distance;
	}

	JPlane.prototype.segmentIntersect=function(out, seg, state){
		out.fracOut = 0;
		out.posOut = new Vector3D();
		out.normalOut = new Vector3D();

		var frac = 0;

		var t;

		var denom = this._normal.dotProduct(seg.delta);
		if (Math.abs(denom) > JNumber3D.NUM_TINY){
			t = -1 * (this._normal.dotProduct(seg.origin) - this._distance) / denom;

			if (t < 0 || t > 1){
				return false;
			}else{
				frac = t;
				out.fracOut = frac;
				out.posOut = seg.getPoint(frac);
				out.normalOut = this._normal.clone();
				out.normalOut.normalize();
				return true;
			}
		}else{
			return false;
		}
	}

	JPlane.prototype.updateState=function(){
		this.super.updateState();
		this._normal = this._initNormal.clone();
		JMatrix3D.multiplyVector(this._currState.orientation, this._normal);
		//_normal = _currState.orientation.transformVector(new Vector3D(0, 0, -1));
		this._distance = this._currState.position.dotProduct(this._normal);
	}
	
	jigLib.JPlane=JPlane;
	
})(jigLib)
