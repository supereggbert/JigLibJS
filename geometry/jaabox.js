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
        var JNumber3D=jigLib.JNumber3D;
	
	var JAABox=function(minPos, maxPos) {
		this._minPos = minPos.clone();
		this._maxPos = maxPos.clone();
	}
	
	JAABox.prototype._minPos=null;
	JAABox.prototype._maxPos=null;

	JAABox.prototype.get_minPos=function(){
		return this._minPos;
	}
	JAABox.prototype.set_minPos=function(pos){
		this._minPos = pos.clone();
	}
                
	JAABox.prototype.get_maxPos=function(){
		return this._maxPos;
	}
	
	JAABox.prototype.set_maxPos=function(pos){
		this._maxPos = pos.clone();
	}
                
	JAABox.prototype.get_sideLengths=function() {
		var pos = this._maxPos.clone();
		pos.subtract(this._minPos);
		return pos;
	}
                
	JAABox.prototype.get_centrePos=function(){
		var pos = this._minPos.clone();
		return JNumber3D.getScaleVector(pos.add(this._maxPos), 0.5);
	}
                
	JAABox.prototype.move=function(delta){
		this._minPos.add(delta);
		this._maxPos.add(delta);
	}
                
	JAABox.prototype.clear=function(){
		this._minPos = new Vector3D(JNumber3D.NUM_HUGE, JNumber3D.NUM_HUGE, JNumber3D.NUM_HUGE);
		this._maxPos = new Vector3D( -JNumber3D.NUM_HUGE, -JNumber3D.NUM_HUGE, -JNumber3D.NUM_HUGE);
	}
                
	JAABox.prototype.clone=function(){
		return new JAABox(this._minPos, this._maxPos);
	}
	
    
	JAABox.prototype.addPoint=function(pos){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		if (pos.x < _minPos.x) _minPos.x = pos.x - JNumber3D.NUM_TINY;
		if (pos.x > _maxPos.x) _maxPos.x = pos.x + JNumber3D.NUM_TINY;
		if (pos.y < _minPos.y) _minPos.y = pos.y - JNumber3D.NUM_TINY;
		if (pos.y > _maxPos.y) _maxPos.y = pos.y + JNumber3D.NUM_TINY;
		if (pos.z < _minPos.z) _minPos.z = pos.z - JNumber3D.NUM_TINY;
		if (pos.z > _maxPos.z) _maxPos.z = pos.z + JNumber3D.NUM_TINY;
	}
                
	JAABox.prototype.addBox=function(box){
		var pts = box.getCornerPoints(box.get_currentState());
		this.addPoint(pts[0]);
		this.addPoint(pts[1]);
		this.addPoint(pts[2]);
		this.addPoint(pts[3]);
		this.addPoint(pts[4]);
		this.addPoint(pts[5]);
		this.addPoint(pts[6]);
		this.addPoint(pts[7]);
	}
                
	JAABox.prototype.addSphere=function(sphere){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		if (sphere.get_currentState().position.x - sphere.get_radius() < _minPos.x) {
			_minPos.x = (sphere.get_currentState().position.x - sphere.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (sphere.get_currentState().position.x + sphere.get_radius() > _maxPos.x) {
			_maxPos.x = (sphere.get_currentState().position.x + sphere.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		if (sphere.get_currentState().position.y - sphere.get_radius() < _minPos.y) {
			_minPos.y = (sphere.get_currentState().position.y - sphere.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (sphere.get_currentState().position.y + sphere.get_radius() > _maxPos.y) {
			_maxPos.y = (sphere.get_currentState().position.y + sphere.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		if (sphere.get_currentState().position.z - sphere.get_radius() < _minPos.z) {
			_minPos.z = (sphere.get_currentState().position.z - sphere.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (sphere.get_currentState().position.z + sphere.get_radius() > _maxPos.z) {
			_maxPos.z = (sphere.get_currentState().position.z + sphere.get_radius()) + JNumber3D.NUM_TINY;
		}
	}
                
	JAABox.prototype.addCapsule=function(capsule){
		var pos= capsule.getBottomPos(capsule.get_currentState());
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		if (pos.x - capsule.get_radius() < _minPos.x) {
			_minPos.x = (pos.x - capsule.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (pos.x + capsule.get_radius() > _maxPos.x) {
			_maxPos.x = (pos.x + capsule.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		if (pos.y - capsule.get_radius() < _minPos.y) {
			_minPos.y = (pos.y - capsule.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (pos.y + capsule.get_radius() > _maxPos.y) {
			_maxPos.y = (pos.y + capsule.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		if (pos.z - capsule.get_radius() < _minPos.z) {
			_minPos.z = (pos.z - capsule.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (pos.z + capsule.get_radius() > _maxPos.z) {
			_maxPos.z = (pos.z + capsule.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		pos = capsule.getEndPos(capsule.get_currentState());
		if (pos.x - capsule.get_radius() < _minPos.x) {
			_minPos.x = (pos.x - capsule.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (pos.x + capsule.get_radius() > _maxPos.x) {
			_maxPos.x = (pos.x + capsule.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		if (pos.y - capsule.get_radius() < _minPos.y) {
			_minPos.y = (pos.y - capsule.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (pos.y + capsule.get_radius() > _maxPos.y) {
			_maxPos.y = (pos.y + capsule.get_radius()) + JNumber3D.NUM_TINY;
		}
                        
		if (pos.z - capsule.get_radius() < _minPos.z) {
			_minPos.z = (pos.z - capsule.get_radius()) - JNumber3D.NUM_TINY;
		}
		if (pos.z + capsule.get_radius() > _maxPos.z) {
			_maxPos.z = (pos.z + capsule.get_radius()) + JNumber3D.NUM_TINY;
		}
	}
                
	JAABox.prototype.addSegment=function(seg){
		this.addPoint(seg.get_origin());
		this.addPoint(seg.getEnd());
	}
                
	JAABox.prototype.overlapTest=function(box){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		return (
			(_minPos.z >= box.get_maxPos().z) ||
			(_maxPos.z <= box.get_minPos().z) ||
			(_minPos.y >= box.get_maxPos().y) ||
			(_maxPos.y <= box.get_minPos().y) ||
			(_minPos.x >= box.get_maxPos().x) ||
			(_maxPos.x <= box.get_minPos().x) ) ? false : true;
	}
                
	JAABox.prototype.isPointInside=function(pos){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		return ((pos.x >= _minPos.x) && 
				(pos.x <= _maxPos.x) && 
				(pos.y >= _minPos.y) && 
				(pos.y <= _maxPos.y) && 
				(pos.z >= _minPos.z) && 
				(pos.z <= _maxPos.z));
	}
	
	JAABox.prototype.toString=function(){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		return [_minPos.x,_minPos.y,_minPos.z,_maxPos.x,_maxPos.y,_maxPos.z].toString();
	}
	
	jigLib.JAABox=JAABox;
	
})(jigLib)
