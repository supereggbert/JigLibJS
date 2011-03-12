(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	var CollOutBodyData=jigLib.CollOutBodyData;
	var JAABox=jigLib.JAABox;
	var JSegment=jigLib.JSegment;
	var JMath3D=jigLib.JMath3D;
	var JNumber3D=jigLib.JNumber3D;
	var RigidBody=jigLib.RigidBody;
	var CollisionSystemGridEntry=jigLib.CollisionSystemGridEntry;
	var CollDetectInfo=jigLib.CollDetectInfo;

	
	/*
	* Initializes a new CollisionSystem which uses a grid to speed up collision detection.
	* Use this system for larger scenes with many objects.
	*
	* @param nx Number of GridEntries in X Direction.
	* @param ny Number of GridEntries in Y Direction.
	* @param nz Number of GridEntries in Z Direction.
	* @param dx Size of a single GridEntry in X Direction.
	* @param dy Size of a single GridEntry in Y Direction.
	* @param dz Size of a single GridEntry in Z Direction.
	*/
	var CollisionSystemGrid=function(nx, ny, nz, dx, dy, dz){
		this.Super();

		this.nx = nx; this.ny = ny; this.nz = nz;
		this.dx = dx; this.dy = dy; this.dz = dz;
		this.sizeX = nx * dx;
		this.sizeY = ny * dy;
		this.sizeZ = nz * dz;
		this.minDelta = Math.min(dx, dy, dz);
                        
		this.gridEntries = [];
		//gridBoxes = new Vector.<JAABox>(nx*ny*nz,true);
                        
		var len=gridEntries.length;
		for (var j = 0; j < len; ++j){
			var gridEntry = new CollisionSystemGridEntry(null);
			gridEntry.gridIndex = j;
			gridEntries[j]=gridEntry;
		}
                        
		this.overflowEntries = new CollisionSystemGridEntry(null);
		this.overflowEntries.gridIndex = -1;
	}
	
	jigLib.extend(CollisionSystemGrid,jigLib.CollisionSystemAbstract);
	
	CollisionSystemGrid.prototype.gridEntries=null;            
	//private var gridBoxes:Vector.<JAABox>;
                
	CollisionSystemGrid.prototype.overflowEntries=null;
                
        CollisionSystemGrid.prototype.nx=0;
        CollisionSystemGrid.prototype.ny=0;
        CollisionSystemGrid.prototype.nz=0;
	
        CollisionSystemGrid.prototype.dx=0;
        CollisionSystemGrid.prototype.dy=0;
        CollisionSystemGrid.prototype.dz=0;
	
        CollisionSystemGrid.prototype.sizeX=0;
        CollisionSystemGrid.prototype.sizeY=0;
        CollisionSystemGrid.prototype.sizeZ=0;
	
        CollisionSystemGrid.prototype.minDelta=0;

        CollisionSystemGrid.prototype.calcIndex=function(i, j, k){
		var _i = i % nx;
		var _j = j % ny;
		var _k = k % nz;
                        
		return (_i + nx * _j + (nx + ny) * _k);
	};

                
        CollisionSystemGrid.prototype.calcGridForSkin3=function(colBody){
		var i;var j;var k;
		var sides = colBody.get_boundingBox().get_sideLengths();
                        
		if ((sides[0] > dx) || (sides[1] > dy) || (sides[2] > dz)){
			//trace("calcGridForSkin3 -- Rigidbody to big for gridsystem - putting it into overflow list (lengths,type,id):", sides.x,sides.y,sides.z,colBody.type,colBody.id,colBody.boundingBox.minPos,colBody.boundingBox.maxPos);
			i = j = k = -1;
			return new [i,j,k];
		}
		//trace(sides.x,sides.y,sides.z);
                        
		var min = colBody.get_boundingBox().get_minPos();
		min[0] = JMath3D.wrap(min[0], 0, sizeX);
		min[1] = JMath3D.wrap(min[1], 0, sizeY);
		min[2] = JMath3D.wrap(min[2], 0, sizeZ);
                        
		i = int( (min.x / dx) % nx);
		j = int( (min.y / dy) % ny);
		k = int( (min.z / dz) % nz);
                        
		return [i,j,k];
	};

	
	CollisionSystemGrid.prototype.calcGridForSkin6=function(colBody){
		var tempStoreObject = {};
		var i;var j;var k;
		var fi;var fj;var fk;
                        
		var sides = colBody.get_boundingBox().get_sideLengths();
                        
		if ((sides[0] > dx) || (sides[1] > dy) || (sides[2] > dz)){
			//trace("calcGridForSkin6 -- Rigidbody to big for gridsystem - putting it into overflow list (lengths,type,id):", sides.x,sides.y,sides.z,colBody.type,colBody.id,colBody.boundingBox.minPos,colBody.boundingBox.maxPos);
			i = j = k = -1;
			fi = fj = fk = 0.0;
			tempStoreObject.i = i; tempStoreObject.j = j; tempStoreObject.k = k; tempStoreObject.fi = fi; tempStoreObject.fj = fj; tempStoreObject.fk = fk;
			return tempStoreObject;
		}
                        
		var min = colBody.get_boundingBox().get_minPos();

		min[0] = JMath3D.wrap(min[0], 0, sizeX);
		min[1] = JMath3D.wrap(min[1], 0, sizeY);
		min[2] = JMath3D.wrap(min[2], 0, sizeZ);
                        
		fi = min[0] / dx;
		fj = min[1] / dy;
		fk = min[2] / dz;
                        
		i = fi;
		j = fj;
		k = fk;
                        
		if (i < 0) { i = 0; fi = 0.0; }
		else if (i >= nx) { i = 0; fi = 0.0; }
		else fi -= i;
                        
		if (j < 0) { j = 0; fj = 0.0; }
		else if (j >= ny) { j = 0; fj = 0.0; }
		else fj -= j;
                        
		if (k < 0) { k = 0; fk = 0.0; }
		else if (k >= nz) { k = 0; fk = 0.0; }
		else fk -= k;
                        
		tempStoreObject.i = i; tempStoreObject.j = j; tempStoreObject.k = k; tempStoreObject.fi = fi; tempStoreObject.fj = fj; tempStoreObject.fk = fk;
		//trace(i,j,k,fi,fj,fk);
		//trace(colBody.x,colBody.y,colBody.z);
		return tempStoreObject;
	};

                
	CollisionSystemGrid.prototype.calcGridIndexForBody=function(colBody){
		var tempStoreVector = this.calcGridForSkin3(colBody);
                        //trace(tempStoreVector.x,tempStoreVector.y,tempStoreVector.z);
		if (tempStoreVector.x == -1) return -1;
		return this.calcIndex(tempStoreVector[0], tempStoreVector[1], tempStoreVector[2]);
	};
	
	
	CollisionSystemGrid.prototype.addCollisionBody=function(body){
		if (!this.findBody(body)) this.collBody.push(body);
                        
		body.collisionSystem = this;

		// also do the grid stuff - for now put it on the overflow list
		var entry = new CollisionSystemGridEntry(body);
		body.externalData = entry;
                        
		// add entry to the start of the list
		CollisionSystemGridEntry.insertGridEntryAfter(entry, this.overflowEntries);
		this.collisionSkinMoved(body);
	};
                        
	CollisionSystemGrid.prototype.removeCollisionBody=function(body){
		if (body.externalData != null){
			body.externalData.collisionBody = null;
			CollisionSystemGridEntry.removeGridEntry(body.externalData);
			body.externalData = null;
		}

		if (this.findBody(body))
			this.collBody.splice(this.collBody.indexOf(body), 1);
	};
                
	CollisionSystemGrid.prototype.removeAllCollisionBodies=function(){
		for(var i=0;i<this.collBody.length;i++){
			var body=this.collBody[i];
			if (body.externalData != null){
				body.externalData.collisionBody = null;
				CollisionSystemGridEntry.removeGridEntry(body.externalData);
			}
		}
		collBody=[];
	};
	
	
	// todo: only call when really moved, make it override public add into abstract ?
	CollisionSystemGrid.prototype.collisionSkinMoved=function(colBody){
		var entry = colBody.externalData;
		if (entry == null){
                                //trace("Warning rigidbody has grid entry null!");
			return;
		}
                        
		var gridIndex = this.calcGridIndexForBody(colBody);
                                                
		// see if it's moved grid
		if (gridIndex == entry.gridIndex)
			return;

		//trace(gridIndex);
		var start;
		//if (gridIndex >= 0**)
		if (gridEntries.length-1 > gridIndex && gridIndex >=0) // check if it's outside the gridspace, if so add to overflow
			start = gridEntries[gridIndex];
		else
			start = overflowEntries;
                        
		CollisionSystemGridEntry.removeGridEntry(entry);
		CollisionSystemGridEntry.insertGridEntryAfter(entry, start);
	};
	
        CollisionSystemGrid.prototype.getListsToCheck=function(colBody){
		var entries = []; 
                        
		var entry = colBody.externalData;
		if (entry == null){
			//trace("Warning skin has grid entry null!");
			return null;
		}
                        
		// todo - work back from the mGridIndex rather than calculating it again...
		var i; var j; var k;
		var fi; var fj; var fk;
		var tempStoreObject = this.calcGridForSkin6(colBody);
		i = tempStoreObject.i; j = tempStoreObject.j; k = tempStoreObject.k; fi = tempStoreObject.fi; fj = tempStoreObject.fj; fk = tempStoreObject.fk;
                        
		if (i == -1){
			//trace("ADD ALL!");
			entries=this.gridEntries.concat();
			entries.push(this.overflowEntries);
			return entries;
		}
                        
		// always add the overflow
		entries.push(this.overflowEntries);
                        
		var delta = colBody.get_boundingBox().get_sideLengths(); // skin.WorldBoundingBox.Max - skin.WorldBoundingBox.Min;
		var maxI = 1, maxJ = 1, maxK = 1;
		if (fi + (delta.x / dx) < 1)
			maxI = 0;
		if (fj + (delta.y / dy) < 1)
			maxJ = 0;
		if (fk + (delta.z / dz) < 1)
			maxK = 0;
                        
		// now add the contents of all grid boxes - their contents may extend beyond the bounds
		for (var di = -1; di <= maxI; ++di){
			for (var dj = -1; dj <= maxJ; ++dj){
				for (var dk = -1; dk <= maxK; ++dk){
					var thisIndex = this.calcIndex(nx + i + di, ny + j + dj, nz + k + dk); // + ((nx*ny*nz)*0.5);
					//trace("ge", gridEntries.length);
					if (this.gridEntries.length-1 > thisIndex && thisIndex >=0) {
						var start = this.gridEntries[thisIndex];
                                                
						//trace(thisIndex,gridEntries.length);
						if (start != null && start.next != null){
							entries.push(start);
						}
					}
				}
			}
		}
		return entries;
	}
	
	
        CollisionSystemGrid.prototype.detectAllCollisions=function(bodies, collArr) {
		var info;
		var fu;
		var bodyID;
		var bodyType;
		this._numCollisionsChecks = 0;
                        
		for(var j=0;j<bodies.length;j++){
			var body=bodies[j];
			if (!body.isActive) continue;

			bodyID = body.id;
			bodyType = body.type;
                                
			var lists=this.getListsToCheck(body);
                                
			for(var k=0;k<lists.length;k++){
				var entry=lists[k];                                      
				for (entry = entry.next; entry != null; entry = entry.next){
					if (body == entry.collisionBody) continue;
                                                
					if (entry.collisionBody && entry.collisionBody.isActive && bodyID > entry.collisionBody.id)
						continue;
                                                
					if (this.checkCollidables(body, entry.collisionBody) && this.detectionFunctors[bodyType + "_" + entry.collisionBody.type] != undefined){
						info = new CollDetectInfo();
						info.body0 = body;
						info.body1 = entry.collisionBody;
						fu = this.detectionFunctors[info.body0.type + "_" + info.body1.type];
						fu.collDetect(info, collArr);
						this._numCollisionsChecks += 1;
					} //check collidables
				}// loop over entries
			} // loop over lists
		} // loop over bodies
	}
	
	jigLib.CollisionSystemGrid=CollisionSystemGrid;

})(jigLib);	