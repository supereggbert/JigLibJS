(function(jigLib){
	/**
		 * ...
		 * @author Muzer
		 */
	var ITerrain=function(){
	};
	//Min of coordinate horizontally;
		ITerrain.prototype.get_minW=function(){};
				
	//Min of coordinate vertically;
		ITerrain.prototype.get_minH=function(){};
				
	//Max of coordinate horizontally;
		ITerrain.prototype.get_maxW=function(){};
				
	//Max of coordinate vertically;
		ITerrain.prototype.get_maxH=function(){};
				
	//The horizontal length of each segment;
		ITerrain.prototype.get_dw=function(){};
				
	//The vertical length of each segment;
		ITerrain.prototype.get_dh=function(){};
				
	//Number of segments horizontally.
		ITerrain.prototype.get_sw=function(){};
				
	//Number of segments vertically
		ITerrain.prototype.get_sh=function(){};
				
	//the heights of all vertices
		ITerrain.prototype.get_heights=function(){};
		
	jigLib.ITerrain=ITerrain;
})(jigLib);