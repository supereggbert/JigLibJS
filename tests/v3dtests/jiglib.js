jigLib={};
	
jigLib.extend=function(dest,source){
	for(proto in source.prototype){
		dest.prototype[proto]=source.prototype[proto];
	}
	dest.prototype.super=source;
};