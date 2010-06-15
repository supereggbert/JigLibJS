(function(jigLib){
	jigLib.JConfig={
		solverType: "ACCUMULATED", //allowable value: FAST,NORMAL,ACCUMULATED
                boxCollisionsType: "EDGEBASE", //allowable value: EDGEBASE or SORTBASE
                rotationType: "DEGREES", // can be either RADIANS or DEGREES;
                aabbDetection: true, //if execute the aabb detection;
                allowedPenetration: 0.01, // How much penetration to allow
                collToll: 0.1, // the tolerance for collision detection 
                velThreshold: 1,
                angVelThreshold: 5,
                posThreshold: 0.2,// change for detecting position changes during deactivation
                orientThreshold: 0.2, // change for detecting orientation changes during deactivation.
                deactivationTime: 1, // how long it takes to go from active to frozen when stationary.
                numPenetrationRelaxationTimesteps: 10, // number of timesteps to resolve penetration over
                numCollisionIterations: 4, // number of collision iterations
                numContactIterations: 4 // number of contact iteratrions
	}
	 
})(jigLib)
