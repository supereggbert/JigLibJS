(function(jigLib){
        var PhysicsSystem=jigLib.PhysicsSystem;
	var RigidBody=jigLib.RigidBody;
	
	/**
         * @author bartekd
         */
	var AbstractPhysics=function(speed) {
		if(!speed) speed=5;
		this.inittime=(new Date()).getTime();
		this.speed = speed;
		this.physicsSystem = PhysicsSystem.getInstance();
	}
                
        AbstractPhysics.prototype.addBody=function(body){
		this.physicsSystem.addBody(body);
	}
                
        AbstractPhysics.prototype.removeBody=function(body){
		physicsSystem.removeBody(body);
	}
                
        AbstractPhysics.prototype.get_engine=function(){
		return this.physicsSystem ;
	}
                
        AbstractPhysics.prototype.step=function(){
		var stepTime = (new Date()).getTime();
                deltaTime = ((stepTime - this.initTime) / 1000) * this.speed;
                this.initTime = stepTime;
                this.physicsSystem.integrate(deltaTime);
	}
		
	jigLib.AbstractPhysics=AbstractPhysics;
		
})(jigLib)
		