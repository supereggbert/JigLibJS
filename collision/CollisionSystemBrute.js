(function(jigLib){
	var Vector3DUtil=jigLib.Vector3DUtil;
	var RigidBody=jigLib.RigidBody;
	var CollDetectInfo=jigLib.CollDetectInfo;

	
	var CollisionSystemBrute=function(){
		this.Super();
	}
	jigLib.extend(CollisionSystemBrute,jigLib.CollisionSystemAbstract);
	
	// Detects collisions between the all bodies
	CollisionSystemBrute.prototype.detectAllCollisions=function(bodies, collArr){
		var info;
		var fu;
		var bodyID;
		var bodyType;
		this._numCollisionsChecks = 0;
		
		for(j=0;j<bodies.length;j++){
			var _body=bodies[j];
			if(!_body.isActive) continue;
                                
			bodyID = _body.id;
			bodyType = _body.type;
			for(k=0;k<this.collBody.length;k++){
				var _collBody=this.collBody[k];
				if (_body == _collBody){
					continue;
				}
                                        
				if (_collBody && _collBody.isActive && bodyID > _collBody.id){
					continue;
				}
                                        
				if (this.checkCollidables(_body, _collBody) && this.detectionFunctors[bodyType + "_" + _collBody.type] != undefined){
					info = new CollDetectInfo();
					info.body0 = _body;
					info.body1 = _collBody;
					fu = this.detectionFunctors[info.body0.type + "_" + info.body1.type];
					fu.collDetect(info, collArr);
					this._numCollisionsChecks += 1;
				}
			}
		}
	}
	
	jigLib.CollisionSystemBrute=CollisionSystemBrute;

})(jigLib);	
	
