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
	var JNumber3D=jigLib.JNumber3D;
	
	var JAABox=function(minPos, maxPos) {
		this._minPos = minPos.slice(0);
		this._maxPos = maxPos.slice(0);
	};
	
	JAABox.prototype._minPos=null;
	JAABox.prototype._maxPos=null;

	JAABox.prototype.get_minPos=function(){
		return this._minPos;
	};
	JAABox.prototype.set_minPos=function(pos){
		this._minPos = pos.slice(0);
	};
				
	JAABox.prototype.get_maxPos=function(){
		return this._maxPos;
	};
	
	JAABox.prototype.set_maxPos=function(pos){
		this._maxPos = pos.slice(0);
	};
				
	JAABox.prototype.get_sideLengths=function() {
		var pos = this._maxPos.slice(0);
		Vector3DUtil.subtract(pos, this._minPos);
		return pos;
	};

	JAABox.prototype.get_centrePos=function(){
		var pos = this._minPos.slice(0);
		return JNumber3D.getScaleVector(Vector3DUtil.add(pos, this._maxPos), 0.5);
	};
				
	JAABox.prototype.move=function(delta){
		Vector3DUtil.add(this._minPos, delta);
		Vector3DUtil.add(this._maxPos, delta);
	};

	JAABox.prototype.clear=function(){
		this._minPos = Vector3DUtil.create(JNumber3D.NUM_HUGE, JNumber3D.NUM_HUGE, JNumber3D.NUM_HUGE, 0);
		this._maxPos = Vector3DUtil.create(-JNumber3D.NUM_HUGE, -JNumber3D.NUM_HUGE, -JNumber3D.NUM_HUGE, 0);
	};

	JAABox.prototype.clone=function(){
		return new JAABox(this._minPos, this._maxPos);
	};

	JAABox.prototype.addPoint=function(pos){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		if (pos[0] < _minPos[0]) _minPos[0] = pos[0] - JNumber3D.NUM_TINY;
		if (pos[0] > _maxPos[0]) _maxPos[0] = pos[0] + JNumber3D.NUM_TINY;
		if (pos[1] < _minPos[1]) _minPos[1] = pos[1] - JNumber3D.NUM_TINY;
		if (pos[1] > _maxPos[1]) _maxPos[1] = pos[1] + JNumber3D.NUM_TINY;
		if (pos[2] < _minPos[2]) _minPos[2] = pos[2] - JNumber3D.NUM_TINY;
		if (pos[2] > _maxPos[2]) _maxPos[2] = pos[2] + JNumber3D.NUM_TINY;
	};

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
	};

	JAABox.prototype.addSphere=function(sphere){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		if (sphere.get_currentState().position[0] - sphere.get_radius() < _minPos[0]) 
			_minPos[0] = (sphere.get_currentState().position[0] - sphere.get_radius()) - JNumber3D.NUM_TINY;

		if (sphere.get_currentState().position[0] + sphere.get_radius() > _maxPos[0]) 
			_maxPos[0] = (sphere.get_currentState().position[0] + sphere.get_radius()) + JNumber3D.NUM_TINY;

		if (sphere.get_currentState().position[1] - sphere.get_radius() < _minPos[1]) 
			_minPos[1] = (sphere.get_currentState().position[1] - sphere.get_radius()) - JNumber3D.NUM_TINY;

		if (sphere.get_currentState().position[1] + sphere.get_radius() > _maxPos[1]) 
			_maxPos[1] = (sphere.get_currentState().position[1] + sphere.get_radius()) + JNumber3D.NUM_TINY;

		if (sphere.get_currentState().position[2] - sphere.get_radius() < _minPos[2]) 
			_minPos[2] = (sphere.get_currentState().position[2] - sphere.get_radius()) - JNumber3D.NUM_TINY;

		if (sphere.get_currentState().position[2] + sphere.get_radius() > _maxPos[2]) 
			_maxPos[2] = (sphere.get_currentState().position[2] + sphere.get_radius()) + JNumber3D.NUM_TINY;
	};
				
	JAABox.prototype.addCapsule=function(capsule){
		var pos= capsule.getBottomPos(capsule.get_currentState());
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		if (pos[0] - capsule.get_radius() < _minPos[0]) 
			_minPos[0] = (pos[0] - capsule.get_radius()) - JNumber3D.NUM_TINY;

		if (pos[0] + capsule.get_radius() > _maxPos[0]) 
			_maxPos[0] = (pos[0] + capsule.get_radius()) + JNumber3D.NUM_TINY;

		if (pos[1] - capsule.get_radius() < _minPos[1]) 
			_minPos[1] = (pos[1] - capsule.get_radius()) - JNumber3D.NUM_TINY;

		if (pos[1] + capsule.get_radius() > _maxPos[1]) 
			_maxPos[1] = (pos[1] + capsule.get_radius()) + JNumber3D.NUM_TINY;

		if (pos[2] - capsule.get_radius() < _minPos[2]) 
			_minPos[2] = (pos[2] - capsule.get_radius()) - JNumber3D.NUM_TINY;

		if (pos[2] + capsule.get_radius() > _maxPos[2]) 
			_maxPos[2] = (pos[2] + capsule.get_radius()) + JNumber3D.NUM_TINY;

		pos = capsule.getEndPos(capsule.get_currentState());

		if (pos[0] - capsule.get_radius() < _minPos[0]) 
			_minPos[0] = (pos[0] - capsule.get_radius()) - JNumber3D.NUM_TINY;

		if (pos[0] + capsule.get_radius() > _maxPos[0]) 
			_maxPos[0] = (pos[0] + capsule.get_radius()) + JNumber3D.NUM_TINY;

		if (pos[1] - capsule.get_radius() < _minPos[1]) 
			_minPos[1] = (pos[1] - capsule.get_radius()) - JNumber3D.NUM_TINY;

		if (pos[1] + capsule.get_radius() > _maxPos[1]) 
			_maxPos[1] = (pos[1] + capsule.get_radius()) + JNumber3D.NUM_TINY;

		if (pos[2] - capsule.get_radius() < _minPos[2]) 
			_minPos[2] = (pos[2] - capsule.get_radius()) - JNumber3D.NUM_TINY;

		if (pos[2] + capsule.get_radius() > _maxPos[2]) 
			_maxPos[2] = (pos[2] + capsule.get_radius()) + JNumber3D.NUM_TINY;
	};
				
	JAABox.prototype.addSegment=function(seg){
		this.addPoint(seg.origin);
		this.addPoint(seg.getEnd());
	};

	JAABox.prototype.overlapTest=function(box){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		return (
			(_minPos[2] >= box.get_maxPos()[2]) ||
			(_maxPos[2] <= box.get_minPos()[2]) ||
			(_minPos[1] >= box.get_maxPos()[1]) ||
			(_maxPos[1] <= box.get_minPos()[1]) ||
			(_minPos[0] >= box.get_maxPos()[0]) ||
			(_maxPos[0] <= box.get_minPos()[0]) ) ? false : true;
	};

	JAABox.prototype.isPointInside=function(pos){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		return ((pos[0] >= _minPos[0]) && 
				(pos[0] <= _maxPos[0]) && 
				(pos[1] >= _minPos[1]) && 
				(pos[1] <= _maxPos[1]) && 
				(pos[2] >= _minPos[2]) && 
				(pos[2] <= _maxPos[2]));
	};

	JAABox.prototype.toString=function(){
		var _minPos=this._minPos;
		var _maxPos=this._maxPos;
		return [_minPos[0],_minPos[1],_minPos[2],_maxPos[0],_maxPos[1],_maxPos[2]].toString();
	};

	jigLib.JAABox=JAABox;
	
})(jigLib);
