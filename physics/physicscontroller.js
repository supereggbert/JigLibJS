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
	
	var PhysicsController=function(){
		this._controllerEnabled = false;
	};
	
	PhysicsController.prototype._controllerEnabled=null;
	
	
	 // implement this to apply whatever forces are needed to the objects this controls
	PhysicsController.prototype.updateController=function(dt){
	};

	// register with the physics system
	PhysicsController.prototype.enableController=function(){
		if (this._controllerEnabled){
			return;
		}
		this._controllerEnabled = true;
		jigLib.PhysicsSystem.getInstance().addController(this);
	};

	// deregister from the physics system
	PhysicsController.prototype.disableController=function(){
		if (!this._controllerEnabled){
			return;
		}
		this._controllerEnabled = false;
		jigLib.PhysicsSystem.getInstance().removeController(this);
	};

	// are we registered with the physics system?
	PhysicsController.prototype.get_controllerEnabled=function(){
		return this._controllerEnabled;
	};
	
	jigLib.PhysicsController=PhysicsController;
	
})(jigLib);