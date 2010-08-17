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
	
	var JMatrix3D=jigLib.JMatrix3D;
	var JNumber3D=jigLib.JNumber3D;
	var JBox=jigLib.JBox;

	var JChassis=function(car, skin, width, depth, height){
		if(width==null) width=40;
		if(depth==null) depth=70;
		if(height==null) height=30;
		
		this.super(skin, width, depth, height);

		this._car = car;
	};
	jigLib.extends(JChassis,jigLib.JBox);
	
	JChassis.prototype._car=null;
	
	JChassis.prototype.get_car=function(){
		return this._car;
	};

	JChassis.prototype.addExternalForces=function(dt){
		this.clearForces();
		this.addGravity();
		this._car.addExternalForces(dt);
	};

	JChassis.prototype.postPhysics=function(dt){
		this._car.postPhysics(dt);
	};
	
	jigLib.JChassis=JChassis;
	
})(jigLib);
	