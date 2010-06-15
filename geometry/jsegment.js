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
	 
	var Vector3D=jigLib.Vector3D;
        var JNumber3D=jigLib.JNumber3D;
	var PhysicsState=jigLib.PhysicsState;
	var JRay=jigLib.JRay;
	 
	 
	var JSegment=function(origin, delta){
		this._origin = origin;
		this._delta = delta;
	}
	JSegment.prototype._origin=null;
	JSegment.prototype._delta=null;
	
	
	JSegment.prototype.set_origin=function(ori){
		this._origin = ori;
	}

	JSegment.prototype.get_origin=function(){
		return this._origin;
	}

	JSegment.prototype.set_delta=function(del){
		this._delta = del;
	}

	JSegment.prototype.get_delta=function(){
		return this._delta;
	}

	JSegment.prototype.getPoint=function(t){
		return this._origin.add(JNumber3D.getScaleVector(this._delta, t));
	}

	JSegment.prototype.getEnd=function(){
		return this._origin.add(this._delta);
	}

	JSegment.prototype.clone=function(){
		return new JSegment(this._origin, this._delta);
	}
	
	JSegment.prototype.segmentSegmentDistanceSq=function(out, seg){
		out.t0 = 0;
		out.t1 = 0;

		var kDiff = this._origin.subtract(seg.get_origin());
		var fA00 = this._delta.get_lengthSquared();
		var fA01 = -this._delta.dotProduct(seg.get_delta());
		var fA11 = seg.get_delta().get_lengthSquared();
		var fB0 = kDiff.dotProduct(this._delta);
		var fC = kDiff.get_lengthSquared();
		var fDet = Math.abs(fA00 * fA11 - fA01 * fA01);
		var fB1;
		var fS;
		var fT;
		var fSqrDist;
		var fTmp;

		if (fDet >= JNumber3D.NUM_TINY){
			fB1 = -kDiff.dotProduct(seg.get_delta());
			fS = fA01 * fB1 - fA11 * fB0;
			fT = fA01 * fB0 - fA00 * fB1;

			if (fS >= 0){
				if (fS <= fDet){
					if (fT >= 0){
						if (fT <= fDet){
							var fInvDet = 1 / fDet;
							fS *= fInvDet;
							fT *= fInvDet;
							fSqrDist = fS * (fA00 * fS + fA01 * fT + 2 * fB0) + fT * (fA01 * fS + fA11 * fT + 2 * fB1) + fC;
						}else{
							fT = 1;
							fTmp = fA01 + fB0;
							if (fTmp >= 0){
								fS = 0;
								fSqrDist = fA11 + 2 * fB1 + fC;
							}else if (-fTmp >= fA00){
								fS = 1;
								fSqrDist = fA00 + fA11 + fC + 2 * (fB1 + fTmp);
							}else{
								fS = -fTmp / fA00;
								fSqrDist = fTmp * fS + fA11 + 2 * fB1 + fC;
							}
						}
					}else{
						fT = 0;
						if (fB0 >= 0){
							fS = 0;
							fSqrDist = fC;
						}else if (-fB0 >= fA00){
							fS = 1;
							fSqrDist = fA00 + 2 * fB0 + fC;
						}else{
							fS = -fB0 / fA00;
							fSqrDist = fB0 * fS + fC;
						}
					}
				}else{
					if (fT >= 0){
						if (fT <= fDet){
							fS = 1;
							fTmp = fA01 + fB1;
							if (fTmp >= 0){
								fT = 0;
								fSqrDist = fA00 + 2 * fB0 + fC;
							}else if (-fTmp >= fA11){
								fT = 1;
								fSqrDist = fA00 + fA11 + fC + 2 * (fB0 + fTmp);
							}else{
								fT = -fTmp / fA11;
								fSqrDist = fTmp * fT + fA00 + 2 * fB0 + fC;
							}
						}else{
							fTmp = fA01 + fB0;
							if (-fTmp <= fA00){
								fT = 1;
								if (fTmp >= 0){
									fS = 0;
									fSqrDist = fA11 + 2 * fB1 + fC;
								}else{
									fS = -fTmp / fA00;
									fSqrDist = fTmp * fS + fA11 + 2 * fB1 + fC;
								}
							}else{
								fS = 1;
								fTmp = fA01 + fB1;
								if (fTmp >= 0){
									fT = 0;
									fSqrDist = fA00 + 2 * fB0 + fC;
								}else if (-fTmp >= fA11){
									fT = 1;
									fSqrDist = fA00 + fA11 + fC + 2 * (fB0 + fTmp);
								}else{
									fT = -fTmp / fA11;
									fSqrDist = fTmp * fT + fA00 + 2 * fB0 + fC;
								}
							}
						}
					}else{
						if (-fB0 < fA00){
							fT = 0;
							if (fB0 >= 0){
								fS = 0;
								fSqrDist = fC;
							}else{
								fS = -fB0 / fA00;
								fSqrDist = fB0 * fS + fC;
							}
						}else{
							fS = 1;
							fTmp = fA01 + fB1;
							if (fTmp >= 0){
								fT = 0;
								fSqrDist = fA00 + 2 * fB0 + fC;
							}else if (-fTmp >= fA11){
								fT = 1;
								fSqrDist = fA00 + fA11 + fC + 2 * (fB0 + fTmp);
							}else{
								fT = -fTmp / fA11;
								fSqrDist = fTmp * fT + fA00 + 2 * fB0 + fC;
							}
						}
					}
				}
			}else{
				if (fT >= 0){
					if (fT <= fDet){
						fS = 0;
						if (fB1 >= 0){
							fT = 0;
							fSqrDist = fC;
						}else if (-fB1 >= fA11){
							fT = 1;
							fSqrDist = fA11 + 2 * fB1 + fC;
						}else{
							fT = -fB1 / fA11;
							fSqrDist = fB1 * fT + fC;
						}
					}else{
						fTmp = fA01 + fB0;
						if (fTmp < 0){
							fT = 1;
							if (-fTmp >= fA00){
								fS = 1;
								fSqrDist = fA00 + fA11 + fC + 2 * (fB1 + fTmp);
							}else{
								fS = -fTmp / fA00;
								fSqrDist = fTmp * fS + fA11 + 2 * fB1 + fC;
							}
						}else{
							fS = 0;
							if (fB1 >= 0){
								fT = 0;
								fSqrDist = fC;
							}else if (-fB1 >= fA11){
								fT = 1;
								fSqrDist = fA11 + 2 * fB1 + fC;
							}else{
								fT = -fB1 / fA11;
								fSqrDist = fB1 * fT + fC;
							}
						}
					}
				}else{
					if (fB0 < 0){
						fT = 0;
						if (-fB0 >= fA00){
							fS = 1;
							fSqrDist = fA00 + 2 * fB0 + fC;
						}else{
							fS = -fB0 / fA00;
							fSqrDist = fB0 * fS + fC;
						}
					}else{
						fS = 0;
						if (fB1 >= 0){
							fT = 0;
							fSqrDist = fC;
						}else if (-fB1 >= fA11){
							fT = 1;
							fSqrDist = fA11 + 2 * fB1 + fC;
						}else{
							fT = -fB1 / fA11;
							fSqrDist = fB1 * fT + fC;
						}
					}
				}
			}
		}else{
			if (fA01 > 0){
				if (fB0 >= 0){
					fS = 0;
					fT = 0;
					fSqrDist = fC;
				}else if (-fB0 <= fA00){
					fS = -fB0 / fA00;
					fT = 0;
					fSqrDist = fB0 * fS + fC;
				}else{
					fB1 = -kDiff.dotProduct(seg.get_delta());
					fS = 1;
					fTmp = fA00 + fB0;
					if (-fTmp >= fA01){
						fT = 1;
						fSqrDist = fA00 + fA11 + fC + 2 * (fA01 + fB0 + fB1);
					}else{
						fT = -fTmp / fA01;
						fSqrDist = fA00 + 2 * fB0 + fC + fT * (fA11 * fT + 2 * (fA01 + fB1));
					}
				}
			}else{
				if (-fB0 >= fA00){
					fS = 1;
					fT = 0;
					fSqrDist = fA00 + 2 * fB0 + fC;
				}else if (fB0 <= 0) {
					fS = -fB0 / fA00;
					fT = 0;
					fSqrDist = fB0 * fS + fC;
				}else{
					fB1 = -kDiff.dotProduct(seg.get_delta());
					fS = 0;
					if (fB0 >= -fA01){
						fT = 1;
						fSqrDist = fA11 + 2 * fB1 + fC;
					}else{
						fT = -fB0 / fA01;
						fSqrDist = fC + fT * (2 * fB1 + fA11 * fT);
					}
				}
			}
		}

		out.t0 = fS;
		out.t1 = fT;
		return Math.abs(fSqrDist);
	}
	 
	
	JSegment.prototype.pointSegmentDistanceSq=function(out, pt){
		out.t = 0;

		var kDiff = pt.subtract( this._origin);
		var fT = kDiff.dotProduct(this._delta);

		if (fT <= 0){
			fT = 0;
		}else{
			var fSqrLen = this._delta.get_lengthSquared();
			if (fT >= fSqrLen){
				fT = 1;
				kDiff = kDiff.subtract(this._delta);
			}else{
				fT /= fSqrLen;
				kDiff = kDiff.subtract(JNumber3D.getScaleVector(this._delta, fT));
			}
		}

		out.t = fT;
		return kDiff.get_lengthSquared();
	}

	JSegment.prototype.segmentBoxDistanceSq=function(out, rkBox, boxState){
		out.pfLParam = 0;
		out.pfLParam0 = 0;
		out.pfLParam1 = 0;
		out.pfLParam2 = 0;

		var obj = {};
		var kRay = new JRay(this._origin, this._delta);
		var fSqrDistance = this.sqrDistanceLine(obj, kRay, rkBox, boxState);
		if (obj.num >= 0){
			if (obj.num <= 1){
				out.pfLParam = obj.num;
				out.pfLParam0 = obj.num0;
				out.pfLParam1 = obj.num1;
				out.pfLParam2 = obj.num2;
				return Math.max(fSqrDistance, 0);
			}else{
				fSqrDistance = this.sqrDistancePoint(out, this._origin.add(this._delta), rkBox, boxState);
				out.pfLParam = 1;
				return Math.max(fSqrDistance, 0);
			}
		}else{
			fSqrDistance = this.sqrDistancePoint(out, this._origin, rkBox, boxState);
			out.pfLParam = 0;
			return Math.max(fSqrDistance, 0);
		}
	}

	JSegment.prototype.sqrDistanceLine=function(out, rkLine, rkBox, boxState){
		var orientationCols = boxState.getOrientationCols();
		out.num = 0;
		out.num0 = 0;
		out.num1 = 0;
		out.num2 = 0;

		var kDiff = rkLine.origin.subtract(boxState.position);
		var kPnt = new Vector3D(kDiff.dotProduct(orientationCols[0]),
			kDiff.dotProduct(orientationCols[1]),
			kDiff.dotProduct(orientationCols[2]));

		var kDir = new Vector3D(rkLine.dir.dotProduct(orientationCols[0]),
			rkLine.dir.dotProduct(orientationCols[1]),
			rkLine.dir.dotProduct(orientationCols[2]));
                        
		var kPntArr = JNumber3D.toArray(kPnt);
		var kDirArr = JNumber3D.toArray(kDir);
                        
		var bReflect = [1,1,1];
		for (var i = 0; i < 3; i++){
			if (kDirArr[i] < 0){
				kPntArr[i] = -kPntArr[i];
				kDirArr[i] = -kDirArr[i];
				bReflect[i] = true;
			}else{
				bReflect[i] = false;
			}
		}

		JNumber3D.copyFromArray(kPnt, kPntArr);
		JNumber3D.copyFromArray(kDir, kDirArr);
                        
		var obj = {};
		obj.rkPnt = kPnt.clone();
		obj.pfLParam = 0;
		obj.rfSqrDistance = 0;

		if (kDir.x > 0){
			if (kDir.y > 0){
				if (kDir.z > 0){
					this.caseNoZeros(obj, kDir, rkBox);
					out.num = obj.pfLParam;
				}else{
					this.case0(obj, 0, 1, 2, kDir, rkBox);
					out.num = obj.pfLParam;
				}
			}else{
				if (kDir.z > 0){
					this.case0(obj, 0, 2, 1, kDir, rkBox);
					out.num = obj.pfLParam;
				}else{
					this.case00(obj, 0, 1, 2, kDir, rkBox);
					out.num = obj.pfLParam;
				}
			}
		}else{
			if (kDir.y > 0){
				if (kDir.z > 0){
					this.case0(obj, 1, 2, 0, kDir, rkBox);
					out.num = obj.pfLParam;
				}else{
					this.case00(obj, 1, 0, 2, kDir, rkBox);
					out.num = obj.pfLParam;
				}
			}else{
				if (kDir.z > 0){
					this.case00(obj, 2, 0, 1, kDir, rkBox);
					out.num = obj.pfLParam;
				}else{
					this.case000(obj, rkBox);
					out.num = 0;
				}
			}
		}

		kPntArr = JNumber3D.toArray(obj.rkPnt);
		for (i = 0; i < 3; i++){
			if (bReflect[i]) kPntArr[i] = -kPntArr[i];
		}
		JNumber3D.copyFromArray(obj.rkPnt, kPntArr);

		out.num0 = obj.rkPnt.x;
		out.num1 = obj.rkPnt.y;
		out.num2 = obj.rkPnt.z;

		return Math.max(obj.rfSqrDistance, 0);
	}
	

	JSegment.prototype.sqrDistancePoint=function(out, rkPoint, rkBox, boxState){
		var orientationVector = boxState.getOrientationCols();
		var kDiff = rkPoint.subtract(boxState.position);
		var kClosest = new Vector3D(kDiff.dotProduct(orientationVector[0]),
			kDiff.dotProduct(orientationVector[1]),
			kDiff.dotProduct(orientationVector[2]));

		var fSqrDistance = 0;
		var fDelta;
		var boxHalfSide = rkBox.getHalfSideLengths();

		if (kClosest.x < -boxHalfSide.x){
			fDelta = kClosest.x + boxHalfSide.x;
			fSqrDistance += (fDelta * fDelta);
			kClosest.x = -boxHalfSide.x;
		}else if (kClosest.x > boxHalfSide.x){
			fDelta = kClosest.x - boxHalfSide.x;
			fSqrDistance += (fDelta * fDelta);
			kClosest.x = boxHalfSide.x;
		}

		if (kClosest.y < -boxHalfSide.y){
			fDelta = kClosest.y + boxHalfSide.y;
			fSqrDistance += (fDelta * fDelta);
			kClosest.y = -boxHalfSide.y;
		}else if (kClosest.y > boxHalfSide.y){
			fDelta = kClosest.y - boxHalfSide.y;
			fSqrDistance += (fDelta * fDelta);
			kClosest.y = boxHalfSide.y;
		}

		if (kClosest.z < -boxHalfSide.z){
			fDelta = kClosest.z + boxHalfSide.z;
			fSqrDistance += (fDelta * fDelta);
			kClosest.z = -boxHalfSide.z;
		}else if (kClosest.z > boxHalfSide.z){
			fDelta = kClosest.z - boxHalfSide.z;
			fSqrDistance += (fDelta * fDelta);
			kClosest.z = boxHalfSide.z;
		}

		out.pfLParam0 = kClosest.x;
		out.pfLParam1 = kClosest.y;
		out.pfLParam2 = kClosest.z;

		return Math.max(fSqrDistance, 0);
	}

	JSegment.prototype.face=function(out, i0, i1, i2, rkDir, rkBox, rkPmE){
		var kPpE = new Vector3D();
		var fLSqr;
		var fInv;
		var fTmp;
		var fParam;
		var fT;
		var fDelta;

		var boxHalfSide = rkBox.getHalfSideLengths();
		var boxHalfArr = JNumber3D.toArray(boxHalfSide);
		var rkPntArr = JNumber3D.toArray(out.rkPnt);
		var rkDirArr = JNumber3D.toArray(rkDir);
		var kPpEArr = JNumber3D.toArray(kPpE);
		var rkPmEArr = JNumber3D.toArray(rkPmE);

		kPpEArr[i1] = rkPntArr[i1] + boxHalfArr[i1];
		kPpEArr[i2] = rkPntArr[i2] + boxHalfArr[i2];
		JNumber3D.copyFromArray(rkPmE, kPpEArr);

		if (rkDirArr[i0] * kPpEArr[i1] >= rkDirArr[i1] * rkPmEArr[i0]){
			if (rkDirArr[i0] * kPpEArr[i2] >= rkDirArr[i2] * rkPmEArr[i0]){
				rkPntArr[i0] = boxHalfArr[i0];
				fInv = 1 / rkDirArr[i0];
				rkPntArr[i1] -= (rkDirArr[i1] * rkPmEArr[i0] * fInv);
				rkPntArr[i2] -= (rkDirArr[i2] * rkPmEArr[i0] * fInv);
				out.pfLParam = -rkPmEArr[i0] * fInv;
				JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
			}else{
				fLSqr = rkDirArr[i0] * rkDirArr[i0] + rkDirArr[i2] * rkDirArr[i2];
				fTmp = fLSqr * kPpEArr[i1] - rkDirArr[i1] * (rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i2] * kPpEArr[i2]);
				if (fTmp <= 2 * fLSqr * boxHalfArr[i1]){
					fT = fTmp / fLSqr;
					fLSqr += (rkDirArr[i1] * rkDirArr[i1]);
					fTmp = kPpEArr[i1] - fT;
					fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * fTmp + rkDirArr[i2] * kPpEArr[i2];
					fParam = -fDelta / fLSqr;
					out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + fTmp * fTmp + kPpEArr[i2] * kPpEArr[i2] + fDelta * fParam);

					out.pfLParam = fParam;
					rkPntArr[i0] = boxHalfArr[i0];
					rkPntArr[i1] = fT - boxHalfArr[i1];
					rkPntArr[i2] = -boxHalfArr[i2];
					JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
				}else{
					fLSqr += (rkDirArr[i1] * rkDirArr[i1]);
					fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * rkPmEArr[i1] + rkDirArr[i2] * kPpEArr[i2];
					fParam = -fDelta / fLSqr;
					out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + rkPmEArr[i1] * rkPmEArr[i1] + kPpEArr[i2] * kPpEArr[i2] + fDelta * fParam);

					out.pfLParam = fParam;
					rkPntArr[i0] = boxHalfArr[i0];
					rkPntArr[i1] = boxHalfArr[i1];
					rkPntArr[i2] = -boxHalfArr[i2];
					JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
				}
			}
		}else{
			if (rkDirArr[i0] * kPpEArr[i2] >= rkDirArr[i2] * rkPmEArr[i0])
			{
				fLSqr = rkDirArr[i0] * rkDirArr[i0] + rkDirArr[i1] * rkDirArr[i1];
				fTmp = fLSqr * kPpEArr[i2] - rkDirArr[i2] * (rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1]);
				if (fTmp <= 2 * fLSqr * boxHalfArr[i2]){
					fT = fTmp / fLSqr;
					fLSqr += (rkDirArr[i2] * rkDirArr[i2]);
					fTmp = kPpEArr[i2] - fT;
					fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1] + rkDirArr[i2] * fTmp;
					fParam = -fDelta / fLSqr;
					out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + kPpEArr[i1] * kPpEArr[i1] + fTmp * fTmp + fDelta * fParam);

					out.pfLParam = fParam;
					rkPntArr[i0] = boxHalfArr[i0];
					rkPntArr[i1] = -boxHalfArr[i1];
					rkPntArr[i2] = fT - boxHalfArr[i2];
					JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
				}else{
					fLSqr += (rkDirArr[i2] * rkDirArr[i2]);
					fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1] + rkDirArr[i2] * rkPmEArr[i2];
					fParam = -fDelta / fLSqr;
					out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + kPpEArr[i1] * kPpEArr[i1] + rkPmEArr[i2] * rkPmEArr[i2] + fDelta * fParam);

					out.pfLParam = fParam;
					rkPntArr[i0] = boxHalfArr[i0];
					rkPntArr[i1] = -boxHalfArr[i1];
					rkPntArr[i2] = boxHalfArr[i2];
					JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
				}
			}else{
				fLSqr = rkDirArr[i0] * rkDirArr[i0] + rkDirArr[i2] * rkDirArr[i2];
				fTmp = fLSqr * kPpEArr[i1] - rkDirArr[i1] * (rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i2] * kPpEArr[i2]);
				if (fTmp >= 0){
					if (fTmp <= 2 * fLSqr * boxHalfArr[i1]){
						fT = fTmp / fLSqr;
						fLSqr += (rkDirArr[i1] * rkDirArr[i1]);
						fTmp = kPpEArr[i1] - fT;
						fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * fTmp + rkDirArr[i2] * kPpEArr[i2];
						fParam = -fDelta / fLSqr;
						out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + fTmp * fTmp + kPpEArr[i2] * kPpEArr[i2] + fDelta * fParam);

						out.pfLParam = fParam;
						rkPntArr[i0] = boxHalfArr[i0];
						rkPntArr[i1] = fT - boxHalfArr[i1];
						rkPntArr[i2] = -boxHalfArr[i2];
						JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
					}else{
						fLSqr += (rkDirArr[i1] * rkDirArr[i1]);
						fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * rkPmEArr[i1] + rkDirArr[i2] * kPpEArr[i2];
						fParam = -fDelta / fLSqr;
						out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + rkPmEArr[i1] * rkPmEArr[i1] + kPpEArr[i2] * kPpEArr[i2] + fDelta * fParam);

						out.pfLParam = fParam;
						rkPntArr[i0] = boxHalfArr[i0];
						rkPntArr[i1] = boxHalfArr[i1];
						rkPntArr[i2] = -boxHalfArr[i2];
						JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
					}
					return;
				}

				fLSqr = rkDirArr[i0] * rkDirArr[i0] + rkDirArr[i1] * rkDirArr[i1];
				fTmp = fLSqr * kPpEArr[i2] - rkDirArr[i2] * (rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1]);
				if (fTmp >= 0){
					if (fTmp <= 2 * fLSqr * boxHalfArr[i2]){
						fT = fTmp / fLSqr;
						fLSqr += (rkDirArr[i2] * rkDirArr[i2]);
						fTmp = kPpEArr[i2] - fT;
						fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1] + rkDirArr[i2] * fTmp;
						fParam = -fDelta / fLSqr;
						out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + kPpEArr[i1] * kPpEArr[i1] + fTmp * fTmp + fDelta * fParam);

						out.pfLParam = fParam;
						rkPntArr[i0] = boxHalfArr[i0];
						rkPntArr[i1] = -boxHalfArr[i1];
						rkPntArr[i2] = fT - boxHalfArr[i2];
						JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
					}else{
						fLSqr += (rkDirArr[i2] * rkDirArr[i2]);
						fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1] + rkDirArr[i2] * rkPmEArr[i2];
						fParam = -fDelta / fLSqr;
						out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + kPpEArr[i1] * kPpEArr[i1] + rkPmEArr[i2] * rkPmEArr[i2] + fDelta * fParam);

						out.pfLParam = fParam;
						rkPntArr[i0] = boxHalfArr[i0];
						rkPntArr[i1] = -boxHalfArr[i1];
						rkPntArr[i2] = boxHalfArr[i2];
						JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
					}
					return;
				}

				fLSqr += (rkDirArr[i2] * rkDirArr[i2]);
				fDelta = rkDirArr[i0] * rkPmEArr[i0] + rkDirArr[i1] * kPpEArr[i1] + rkDirArr[i2] * kPpEArr[i2];
				fParam = -fDelta / fLSqr;
				out.rfSqrDistance += (rkPmEArr[i0] * rkPmEArr[i0] + kPpEArr[i1] * kPpEArr[i1] + kPpEArr[i2] * kPpEArr[i2] + fDelta * fParam);

				out.pfLParam = fParam;
				rkPntArr[i0] = boxHalfArr[i0];
				rkPntArr[i1] = -boxHalfArr[i1];
				rkPntArr[i2] = -boxHalfArr[i2];
				JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
			}
		}
	}
	
	JSegment.prototype.caseNoZeros=function(out, rkDir, rkBox){
		var boxHalfSide = rkBox.getHalfSideLengths();
		var kPmE = new Vector3D(out.rkPnt.x - boxHalfSide.x, out.rkPnt.y - boxHalfSide.y, out.rkPnt.z - boxHalfSide.z);

		var fProdDxPy = rkDir.x * kPmE.y;
		var fProdDyPx = rkDir.y * kPmE.x;
		var fProdDzPx;
		var fProdDxPz;
		var fProdDzPy;
		var fProdDyPz;

		if (fProdDyPx >= fProdDxPy){
			fProdDzPx = rkDir.z * kPmE.x;
			fProdDxPz = rkDir.x * kPmE.z;
			if (fProdDzPx >= fProdDxPz){
				this.face(out, 0, 1, 2, rkDir, rkBox, kPmE);
			}else{
				this.face(out, 2, 0, 1, rkDir, rkBox, kPmE);
			}
		}else{
			fProdDzPy = rkDir.z * kPmE.y;
			fProdDyPz = rkDir.y * kPmE.z;
			if (fProdDzPy >= fProdDyPz){
				this.face(out, 1, 2, 0, rkDir, rkBox, kPmE);
			}else{
				this.face(out, 2, 0, 1, rkDir, rkBox, kPmE);
			}
		}
	}

	JSegment.prototype.case0=function(out, i0, i1, i2, rkDir, rkBox){
		var boxHalfSide = rkBox.getHalfSideLengths();
		var boxHalfArr = JNumber3D.toArray(boxHalfSide);
		var rkPntArr = JNumber3D.toArray(out.rkPnt);
		var rkDirArr = JNumber3D.toArray(rkDir);
		var fPmE0 = rkPntArr[i0] - boxHalfArr[i0];
		var fPmE1 = rkPntArr[i1] - boxHalfArr[i1];
		var fProd0 = rkDirArr[i1] * fPmE0;
		var fProd1 = rkDirArr[i0] * fPmE1;
		var fDelta;
		var fInvLSqr;
		var fInv;

		if (fProd0 >= fProd1){
			rkPntArr[i0] = boxHalfArr[i0];

			var fPpE1 = rkPntArr[i1] + boxHalfArr[i1];
			fDelta = fProd0 - rkDirArr[i0] * fPpE1;
			if (fDelta >= 0){
				fInvLSqr = 1 / (rkDirArr[i0] * rkDirArr[i0] + rkDirArr[i1] * rkDirArr[i1]);
				out.rfSqrDistance += (fDelta * fDelta * fInvLSqr);

				rkPntArr[i1] = -boxHalfArr[i1];
				out.pfLParam = -(rkDirArr[i0] * fPmE0 + rkDirArr[i1] * fPpE1) * fInvLSqr;
			}else{
				fInv = 1 / rkDirArr[i0];
				rkPntArr[i1] -= (fProd0 * fInv);
				out.pfLParam = -fPmE0 * fInv;
			}
			JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
		}else{
			rkPntArr[i1] = boxHalfArr[i1];

			var fPpE0 = rkPntArr[i0] + boxHalfArr[i0];
			fDelta = fProd1 - rkDirArr[i1] * fPpE0;
			if (fDelta >= 0){
				fInvLSqr = 1 / (rkDirArr[i0] * rkDirArr[i0] + rkDirArr[i1] * rkDirArr[i1]);
				out.rfSqrDistance += (fDelta * fDelta * fInvLSqr);

				rkPntArr[i0] = -boxHalfArr[i0];
				out.pfLParam = -(rkDirArr[i0] * fPpE0 + rkDirArr[i1] * fPmE1) * fInvLSqr;
			}else{
				fInv = 1 / rkDirArr[i1];
				rkPntArr[i0] -= (fProd1 * fInv);
				out.pfLParam = -fPmE1 * fInv;
			}
			JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
		}

		if (rkPntArr[i2] < -boxHalfArr[i2]){
			fDelta = rkPntArr[i2] + boxHalfArr[i2];
			out.rfSqrDistance += (fDelta * fDelta);
			rkPntArr[i2] = -boxHalfArr[i2];
		}else if (rkPntArr[i2] > boxHalfArr[i2]){
			fDelta = rkPntArr[i2] - boxHalfArr[i2];
			out.rfSqrDistance += (fDelta * fDelta);
			rkPntArr[i2] = boxHalfArr[i2];
		}
		JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
	}

	JSegment.prototype.case00=function(out, i0, i1, i2, rkDir, rkBox){
		var fDelta = 0;
		var boxHalfSide = rkBox.getHalfSideLengths();
		var boxHalfArr = JNumber3D.toArray(boxHalfSide);
		var rkPntArr = JNumber3D.toArray(out.rkPnt);
		var rkDirArr = JNumber3D.toArray(rkDir);
		out.pfLParam = (boxHalfArr[i0] - rkPntArr[i0]) / rkDirArr[i0];

		rkPntArr[i0] = boxHalfArr[i0];

		if (rkPntArr[i1] < -boxHalfArr[i1]){
			fDelta = rkPntArr[i1] + boxHalfArr[i1];
			out.rfSqrDistance += (fDelta * fDelta);
			rkPntArr[i1] = -boxHalfArr[i1];
		}else if (rkPntArr[i1] > boxHalfArr[i1]) {
			fDelta = rkPntArr[i1] - boxHalfArr[i1];
			out.rfSqrDistance += (fDelta * fDelta);
			rkPntArr[i1] = boxHalfArr[i1];
		}

		if (rkPntArr[i2] < -boxHalfArr[i2]){
			fDelta = rkPntArr[i2] + boxHalfArr[i2];
			out.rfSqrDistance += (fDelta * fDelta);
			rkPntArr[i2] = -boxHalfArr[i2];
		}else if (rkPntArr[i2] > boxHalfArr[i2]){
			fDelta = rkPntArr[i2] - boxHalfArr[i2];
			out.rfSqrDistance += (fDelta * fDelta);
			rkPntArr[i2] = boxHalfArr[i2];
		}

		JNumber3D.copyFromArray(out.rkPnt, rkPntArr);
	}

	JSegment.prototype.case000=function(out, rkBox){
		var fDelta = 0;
		var boxHalfSide = rkBox.getHalfSideLengths();

		if (out.rkPnt.x < -boxHalfSide.x){
			fDelta = out.rkPnt.x + boxHalfSide.x;
			out.rfSqrDistance += (fDelta * fDelta);
			out.rkPnt.x = -boxHalfSide.x;
		}else if (out.rkPnt.x > boxHalfSide.x){
			fDelta = out.rkPnt.x - boxHalfSide.x;
			out.rfSqrDistance += (fDelta * fDelta);
			out.rkPnt.x = boxHalfSide.x;
		}

		if (out.rkPnt.y < -boxHalfSide.y){
			fDelta = out.rkPnt.y + boxHalfSide.y;
			out.rfSqrDistance += (fDelta * fDelta);
			out.rkPnt.y = -boxHalfSide.y;
		}else if (out.rkPnt.y > boxHalfSide.y){
			fDelta = out.rkPnt.y - boxHalfSide.y;
			out.rfSqrDistance += (fDelta * fDelta);
			out.rkPnt.y = boxHalfSide.y;
		}

		if (out.rkPnt.z < -boxHalfSide.z){
			fDelta = out.rkPnt.z + boxHalfSide.z;
			out.rfSqrDistance += (fDelta * fDelta);
			out.rkPnt.z = -boxHalfSide.z;
		}else if (out.rkPnt.z > boxHalfSide.z){
			fDelta = out.rkPnt.z - boxHalfSide.z;
			out.rfSqrDistance += (fDelta * fDelta);
			out.rkPnt.z = boxHalfSide.z;
		}
	}
	
	
	jigLib.JSegment=JSegment;
	
 })(jigLib)
