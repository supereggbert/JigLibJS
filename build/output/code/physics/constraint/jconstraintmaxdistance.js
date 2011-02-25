(function(b){var e=b.Vector3DUtil;var a=b.JMatrix3D;var c=b.JNumber3D;var d=function(h,i,f,g,j){if(!j){j=1;}this.Super();this._body0=h;this._body0Pos=i;this._body1=f;this._body1Pos=g;this._maxDistance=j;h.addConstraint(this);f.addConstraint(this);};b.extend(d,b.JConstraint);d.prototype._maxVelMag=20;d.prototype._minVelForProcessing=0.01;d.prototype._body0=null;d.prototype._body1=null;d.prototype._body0Pos=null;d.prototype._body1Pos=null;d.prototype._maxDistance=null;d.prototype.r0=null;d.prototype.r1=null;d.prototype._worldPos=null;d.prototype._currentRelPos0=null;d.prototype.preApply=function(h){this.set_satisfied(false);this.r0=this._body0Pos.slice(0);this.r1=this._body1Pos.slice(0);a.multiplyVector(this._body0.get_currentState().get_orientation(),this.r0);a.multiplyVector(this._body1.get_currentState().get_orientation(),this.r1);var g=e.add(this._body0.get_currentState().position,this.r0);var f=e.add(this._body1.get_currentState().position,this.r1);this._worldPos=c.getScaleVector(e.add(g,f),0.5);this._currentRelPos0=e.subtract(g,f);};d.prototype.apply=function(g){this.set_satisfied(true);if(!this._body0.isActive&&!this._body1.isActive){return false;}var l=this._body0.getVelocity(this.r0);var k=this._body1.getVelocity(this.r1);var n=e.add(this._currentRelPos0,c.getScaleVector(e.subtract(l,k),g));var m=n.slice(0);var s=e.get_length(m);if(s<=c.NUM_TINY){return false;}if(s>this._maxDistance){m=c.getScaleVector(m,this._maxDistance/s);}var q=c.getDivideVector(e.subtract(m,this._currentRelPos0),g);var f=e.subtract(e.subtract(l,k),q);var j=e.get_length(f);if(j>this._maxVelMag){f=c.getScaleVector(f,this._maxVelMag/j);j=this._maxVelMag;}else{if(j<this._minVelForProcessing){return false;}}var p=c.getDivideVector(f,j);var r=e.crossProduct(this.r0,p);a.multiplyVector(this._body0.get_worldInvInertia(),r);var o=e.crossProduct(this.r1,p);a.multiplyVector(this._body1.get_worldInvInertia(),o);var i=this._body0.get_invMass()+this._body1.get_invMass()+e.dotProduct(p,e.crossProduct(r,this.r0))+e.dotProduct(p,e.crossProduct(o,this.r1));if(i<c.NUM_TINY){return false;}var h=c.getScaleVector(p,-j/i);this._body0.applyWorldImpulse(h,this._worldPos);this._body1.applyWorldImpulse(c.getScaleVector(h,-1),this._worldPos);this._body0.setConstraintsAndCollisionsUnsatisfied();this._body1.setConstraintsAndCollisionsUnsatisfied();this.set_satisfied(true);return true;};b.JConstraintMaxDistance=d;})(jigLib);