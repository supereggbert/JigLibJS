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
        var ISkin3D=jigLib.ISkin3D;
        var PhysicsState=jigLib.PhysicsState;
	var RigidBody=jigLib.RigidBody;
	var JSegment=jigLib.JSegment;
	
	var JCapsule=function(skin, r, l) {
		this.super(skin);
		this._type = "CAPSULE";
		this._radius = r;
		this._length = l;
		this._boundingSphere = this.getBoundingSphere(r, l);
		this.set_mass(1);
		this.updateBoundingBox();
	}
	jigLib.extends(JCapsule,jigLib.RigidBody);
	
	JCapsule.prototype._length=null;
	JCapsule.prototype._radius=null;
	
	JCapsule.prototype.set_radius=function(r){
		this._radius = r;
		this._boundingSphere = getBoundingSphere(this._radius, this._length);
		this.setInertia(this.getInertiaProperties(this.get_mass()));
		this.updateBoundingBox();
		this.setActive();
	}
	
	JCapsule.prototype.get_radius=function(){
		return this._radius;
	}
                 
	JCapsule.prototype.set_length=function(l){
		this._length = l;
		this._boundingSphere = getBoundingSphere(this._radius, this._length);
		this.setInertia(this.getInertiaProperties(this.get_mass()));
		this.updateBoundingBox();
		this.setActive();
	}
	
	JCapsule.prototype.get_length=function(){
		return this._length;
	}
	
	JCapsule.prototype.getBottomPos=function(state){
		var temp = state.getOrientationCols()[1];
		//temp.normalize();
		return state.position.add(JNumber3D.getScaleVector(temp, -this._length / 2 - this._radius));
	}
                 
	JCapsule.prototype.getEndPos=function(state){
		var temp = state.getOrientationCols()[1];
		//temp.normalize();
		return state.position.add(JNumber3D.getScaleVector(temp, this._length / 2 + this._radius));
	}
                 
	JCapsule.prototype.segmentIntersect=function(out, seg, state){
		out.fracOut = 0;
		out.posOut = new Vector3D();
		out.normalOut = new Vector3D();
                        
		var Ks = seg.delta;
		var kss = Ks.dotProduct(Ks);
		var radiusSq = this._radius * this._radius;
                        
		var cols = state.getOrientationCols();
		var cylinderAxis = new JSegment(getBottomPos(state), cols[1]);
		var Ke = cylinderAxis.get_delta();
		var Kg = cylinderAxis.get_origin().subtract(seg.get_origin());
		var kee = Ke.dotProduct(Ke);
		if (Math.abs(kee) < JNumber3D.NUM_TINY) {
			return false;
		}
                        
		var kes = Ke.dotProduct(Ks);
		var kgs = Kg.dotProduct(Ks);
		var keg = Ke.dotProduct(Kg);
		var kgg = Kg.dotProduct(Kg);
                        
		var distSq = Kg.subtract(JNumber3D.getDivideVector(JNumber3D.getScaleVector(Ke, keg), kee)).get_lengthSquared();
		if (distSq < radiusSq) {
			out.fracOut = 0;
			out.posOut = seg.get_origin().clone();
			out.normalOut = out.posOut.subtract(getBottomPos(state));
			out.normalOut = out.normalOut.subtract(JNumber3D.getScaleVector(cols[1], out.normalOut.dotProduct(cols[1])));
			out.normalOut.normalize();
			return true;
		}
                        
		var ar = kee * kss - (kes * kes);
		if (Math.abs(a) < JNumber3D.NUM_TINY) {
			return false;
		}
		var b = 2 * (keg * kes - kee * kgs);
		var c = kee * (kgg - radiusSq) - (keg * keg);
		var blah = (b * b) - 4 * a * c;
		if (blah < 0) {
			return false;
		}
		var t = ( -b - Math.sqrt(blah)) / (2 * a);
		if (t < 0 || t > 1) {
			return false;
		}
		out.fracOut = t;
		out.posOut = seg.getPoint(t);
		out.normalOut = out.posOut.subtract(getBottomPos(state));
		out.normalOut = out.normalOut.subtract(JNumber3D.getScaleVector(cols[1], out.normalOut.dotProduct(cols[1])));
		out.normalOut.normalize();
		return true;
	}
	

	JCapsule.prototype.getInertiaProperties=function(m){
		var cylinderMass = m * Math.PI * this._radius * this._radius * this._length / this.getVolume();
		var Ixx = 0.25 * cylinderMass * this._radius * this._radius + (1 / 12) * cylinderMass * this._length * this._length;
		var Iyy = 0.5 * cylinderMass * this._radius * this._radius;
		var Izz= Ixx;
                         
		var endMass = m - cylinderMass;
		Ixx += (0.4 * endMass * this._radius * this._radius + endMass * Math.pow(0.5 * this._length, 2));
		Iyy += (0.2 * endMass * this._radius * this._radius);
		Izz += (0.4 * endMass * this._radius * this._radius + endMass * Math.pow(0.5 * this._length, 2));
                        
                         /*
                        var inertiaTensor:JMatrix3D = new JMatrix3D();
                        inertiaTensor.n11 = Ixx;
                        inertiaTensor.n22 = Iyy;
                        inertiaTensor.n33 = Izz;
                        */
                        
		return JMatrix3D.getScaleMatrix(Ixx, Iyy, Izz);
	}
                
	JCapsule.prototype.updateBoundingBox=function(){
		this._boundingBox.clear();
		this._boundingBox.addCapsule(this);
	}
                
	JCapsule.prototype.getBoundingSphere=function(r, l){
		return Math.sqrt(Math.pow(l / 2, 2) + r * r) + r;
	}
                
	JCapsule.prototype.getVolume=function(){
		return (4 / 3) * Math.PI * this._radius * this._radius * this._radius + this._length * Math.PI * this._radius * this._radius;
	}
	
	jigLib.JCapsule=JCapsule;
	
})(jigLib)
