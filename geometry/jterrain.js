


(function(jigLib){
	var Vector3D=jigLib.Vector3D;
	var Matrix3D=jigLib.Matrix3D;
	var JMatrix3D=jigLib.JMatrix3D;
        var JNumber3D=jigLib.JNumber3D;
        var ISkin3D=jigLib.ISkin3D;
        var PhysicsState=jigLib.PhysicsState;
	var RigidBody=jigLib.RigidBody;
	var ITerrain=jigLib.ITerrain;
	
	/**
	* ...
	* @author Muzer
	*/
	
	var JTerrain=function(tr){
		this.super(null);
		this._terrain = tr;
		this.set_movable(false);
		this._type = "TERRAIN";
	}
	jigLib.extends(JTerrain,jigLib.RigidBody);
	JTerrain.prototype._terrain=null;
	
	JTerrain.prototype.get_terrainMesh=function(){
		return this._terrain;
	}
                
	JTerrain.prototype.getHeightByIndex=function(i, j){
		i = this.limiteInt(i, 0, _terrain.sw);
		j = this.limiteInt(j, 0, _terrain.sh);
		return _terrain.heights[i][j];
	}
	
	JTerrain.prototype.getHeightAndNormalByPoint=function(point){
		var w = this.limiteInt(point.x, this._terrain.minW, this._terrain.maxW);
		var h = this.limiteInt(point.z, this._terrain.minH, this._terrain.maxH);
                        
		var i0 = ((w - _terrain.minW) / this._terrain.dw)|0;
		var j0 = ((h - _terrain.minH) / this._terrain.dh)|0;
		i0 = this.limiteInt(i0, 0, this._terrain.sw);
		j0 = this.limiteInt(j0, 0, this._terrain.sh);
		
		var i1 = i0 + 1;
		var j1 = j0 + 1;
		i1 = this.limiteInt(i1, 0, this._terrain.sw);
		j1 = this.limiteInt(j1, 0, this._terrain.sh);
                        
		var iFrac = 1 - (w - (i0 * this._terrain.dw + this._terrain.minW)) / this._terrain.dw;
		var jFrac = (h - (j0 * this._terrain.dh + this._terrain.minH)) / this._terrain.dh;
		iFrac = JNumber3D.getLimiteNumber(iFrac, 0, 1);
		jFrac = JNumber3D.getLimiteNumber(jFrac, 0, 1);
                        
		var h00 = this._terrain.heights[i0][j0];
		var h01 = this._terrain.heights[i0][j1];
		var h10 = this._terrain.heights[i1][j0];
		var h11 = this._terrain.heights[i1][j1];
                        
		var obj = { };
		obj.height = 0;
		obj.normal = new Vector3D();
		var plane;
		if (iFrac < jFrac || i0==i1 || j0 == j1){
			obj.normal = new Vector3D(0, h11 - h10, this._terrain.dh).crossProduct(new Vector3D(this._terrain.dw, h11 - h01, 0));
			obj.normal.normalize();
                                
			plane = new PlaneData(new Vector3D((i1 * this._terrain.dw + this._terrain.minW), h11, (j1 * this._terrain.dh + this._terrain.minH)), obj.normal);
			obj.height = plane.pointPlaneDistance(point);
		}else{
			obj.normal = new Vector3D(0, h01 - h00, this._terrain.dh).crossProduct(new Vector3D(this._terrain.dw, h10 - h00, 0));
			obj.normal.normalize();
                                
			plane = new PlaneData(new Vector3D((i0 * this._terrain.dw + this._terrain.minW), h00, (j0 * this._terrain.dh + this._terrain.minH)), obj.normal);
			obj.height = plane.pointPlaneDistance(point);
		}
		return obj;
	}
                
	JTerrain.prototype.getHeightByPoint=function(point){
		return this.getHeightAndNormalByPoint(point).height;
	}
                
	JTerrain.prototype.getNormalByPoint=function(point){
		return this.getHeightAndNormalByPoint(point).normal;
	}
                
	JTerrain.prototype.getSurfacePosByPoint=function(point){
		return new Vector3D(point.x, this.getHeightAndNormalByPoint(point).height, point.z);
	}
	
       
	JTerrain.prototype.segmentIntersect=function(out, seg, state){
		out.fracOut = 0;
		out.posOut = new Vector3D();
		out.normalOut = new Vector3D();
                        
		if (seg.delta.y > -JNumber3D.NUM_TINY) {
			return false;
		}
		var obj1 = this.getHeightAndNormalByPoint(seg.get_origin());
		if (obj1.height < 0) {
			return false;
		}
		var obj2 = getHeightAndNormalByPoint(seg.getEnd());
		if (obj2.height > 0) {
			return false;
		}
                        
		var depthEnd = -obj2.height;
		var weightStart = 1 / (JNumber3D.NUM_TINY + obj1.height);
		var weightEnd = 1 / (JNumber3D.NUM_TINY + obj2.height);
                        
		obj1.normal.scaleBy(weightStart);
		obj2.normal.scaleBy(weightEnd);
		out.normalOut = obj1.normal.add(obj2.normal);
		out.normalOut.scaleBy(1 / (weightStart + weightEnd));
                        
		out.fracOut = obj1.height / (obj1.height + depthEnd + JNumber3D.NUM_TINY);
		out.posOut = seg.getPoint(out.fracOut);
                        
		return true;
	}
                
	JTerrain.prototype.limiteInt=function(num,min,max){
		var n = num;
		if (n < min){
			n = min;
		}else if (n > max){
			n = max;
		}
		return n;
	}
	
	jigLib.JTerrain=JTerrain;
	
})(jigLib)

