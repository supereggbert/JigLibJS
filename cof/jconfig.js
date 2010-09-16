(function(jigLib){
	jigLib.JConfig={
		solverType: "ACCUMULATED", //allowable value: FAST,NORMAL,ACCUMULATED,SIMPLE								// WAS ACCUMULATED
		boxCollisionsType: "EDGEBASE", //allowable value: EDGEBASE or SORTBASE
		rotationType: "DEGREES", // can be either RADIANS or DEGREES;								// WAS DEGREES
		aabbDetection: true, //if execute the aabb detection;
		allowedPenetration: 0.01, // How much penetration to allow									// WAS 0.01
		collToll: 0.01, // the tolerance for collision detection 									// WAS 0.1
		velThreshold: 1,
		angVelThreshold: 5,
		posThreshold: 0.2,// change for detecting position changes during deactivation
		orientThreshold: 0.2, // change for detecting orientation changes during deactivation.
		deactivationTime: 500, // how long it takes to go from active to frozen when stationary.	// WAS 1
		numPenetrationRelaxationTimesteps: 10, // number of timesteps to resolve penetration over
		numCollisionIterations: 4, // number of collision iterations
		numContactIterations: 4 // number of contact iterations
	};
	 
})(jigLib);
