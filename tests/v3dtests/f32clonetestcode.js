var out, debugDiv;

function start(arr, _out, _debugDiv) {
	if (!out || !debugDiv) out=_out, debugDiv=_debugDiv;
	out += 'starting...<br /><br />';
	dump();
	var func = (arr==32) ? 'sliceF32()' : 'sliceF64()';
	setTimeout(func, 400);
}

function sliceF32() {
	if (typeof(Float32Array)=='undefined') {
		out+='<h1>your browser does not support Float32Array'; dump(); return; 
	}
	var i, ii, v2, start;
	i = ii = 9999;
	var v1 = new Float32Array(i);
	do { v1[i] = 0.1234567890123456; } while(i--);
	start=new Date();
	do { v2=v1.slice(0); } while(ii--);
	out+='Float32Array - slice: '+(new Date() - start)+'<br />';
	dump();
	setTimeout('constructF32()', 400);
}

function constructF32() {
	var i, ii, v2, start;
	i = ii = 9999;
	var v1 = new Float32Array(i);
	do { v1[i] = 0.1234567890123456; } while(i--);
	start=new Date();
	do { v2=new Float32Array(v1); } while(ii--);
	out+='Float32Array - construct: '+(new Date() - start)+'<br />';
	dump();
	setTimeout('finish()', 400);
}

function sliceF64() {
	if (typeof(Float64Array)=='undefined') {
		out+='<h1>your browser does not support Float64Array'; dump(); return; 
	}
	var i, ii, v2, start;
	i = ii = 9999;
	var v1 = new Float64Array(i);
	do { v1[i] = 0.1234567890123456; } while(i--);
	start=new Date();
	do { v2=v1.slice(0); } while(ii--);
	out+='Float64Array - slice: '+(new Date() - start)+'<br />';
	dump();
	setTimeout('constructF32()', 400);
}

function constructF64() {
	var i, ii, v2, start;
	i = ii = 9999;
	var v1 = new Float64Array(i);
	do { v1[i] = 0.1234567890123456; } while(i--);
	start=new Date();
	do { v2=new Float64Array(v1); } while(ii--);
	out+='Float64Array - construct: '+(new Date() - start)+'<br />';
	dump();
	setTimeout('finish()', 400);
}

function prec() {
	var v1=new Float32Array([0.1234567890123456]);
	var v2=new Float64Array([0.1234567890123456]);
	alert('f32: '+v1[0]+'\nf64: '+v2[0]);
}

function finish() {
	out+='<br />finished<br /><br />';
	dump();
}

function dump() {
	debugDiv.innerHTML = out;
}