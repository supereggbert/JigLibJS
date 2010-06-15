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
	
	var JConstraint=function(){
		this._constraintEnabled = false;
		this.enableConstraint();
	}
	JConstraint.prototype._satisfied=null;
	JConstraint.prototype._constraintEnabled=null;

	JConstraint.prototype.set_satisfied=function(s){
		this._satisfied = s;
	}

	JConstraint.prototype.get_satisfied=function(){
		return this._satisfied;
	}

	// prepare for applying constraints - the subsequent calls to
	// apply will all occur with a constant position i.e. precalculate
	// everything possible
	JConstraint.prototype.preApply=function(dt){
		this._satisfied = false;
	}

	// apply the constraint by adding impulses. Return value
	// indicates if any impulses were applied. If impulses were applied
	// the derived class should call SetConstraintsUnsatisfied() on each
	// body that is involved.
	JConstraint.prototype.apply=function(dt){
		return false;
	}

	// register with the physics system
	JConstraint.prototype.enableConstraint=function(){
		if (this._constraintEnabled){
			return;
		}
		this._constraintEnabled = true;
		jigLib.PhysicsSystem.getInstance().addConstraint(this);
	}

	// deregister from the physics system
	JConstraint.prototype.disableConstraint=function(){
		if (!this._constraintEnabled){
			return;
		}
		this._constraintEnabled = false;
		jigLib.PhysicsSystem.getInstance().removeConstraint(this);
	}

	// are we registered with the physics system?
	JConstraint.prototype.get_constraintEnabled=function(){
		return this._constraintEnabled;
	}
	
	jigLib.JConstraint=JConstraint;
	
})(jigLib)
