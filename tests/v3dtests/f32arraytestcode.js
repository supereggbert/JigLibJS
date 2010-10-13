function start(slots, iterations) {
	out+='STARTING test with '+slots+' slots over '+iterations+' iterations...<br /><br />';
	debug.innerHTML=out;
	testA_read(slots, iterations);
}

function testA_read(s, i) {
	var d, ss=s-1, ii=i-1, v=[];
	do { v[ss]=0.1234567890123456; } while(ss--);
	var dts=new Date();
	do {
		ss=s-1;
		do { d=v[ss]; } while (ss--);
	} while (ii--);
	out+='Array, read: '+(new Date()-dts)+'<br />';
	debug.innerHTML=out;
	v=null;
	setTimeout('testF32_read('+s+','+i+')', 500);
}

function testF32_read(s,i) {
	var d, ii=i-1, ss=s-1, v=new Float32Array(s);
	do { v[ss]=0.1234567890123456; } while(ss--);
	var dts=new Date();
	do {
		ss=s-1;
		do { d=v[ss]; } while (ss--);
	} while (ii--);
	out+='Float32Array, read: '+(new Date()-dts)+'<br /><br />';
	debug.innerHTML=out;
	v=null;
	setTimeout('testA_write('+s+','+i+')', 500);
}

function testA_write(s,i) {
	var ii=i-1, ss, v=[], dts=new Date();
	do {
		ss=s-1;
		do { v[ss]=0.1234567890123456; } while(ss--);
	} while (ii--);
	out+='Array, write: '+(new Date()-dts)+'<br />';
	debug.innerHTML=out;
	v=null;
	setTimeout('testF32_write('+s+','+i+')', 500);
}

function testF32_write(s,i) {
	var ii=i-1, ss, v=new Float32Array(s), dts=new Date();
	do {
		ss=s-1;
		do { v[ss]=0.1234567890123456; } while(ss--);
	} while (ii--);
	out+='Float32Array, write: '+(new Date()-dts)+'<br /><br />';
	debug.innerHTML=out;
	v=null;
	setTimeout('testA_slice('+s+','+i+')', 500);
}

function testA_slice(s,i) {
	var ss=s-1, ii=i-1, v=[], v2=[];
	do { v[ss]=0.1234567890123456; } while (ss--);
	var dts=new Date();
	do { v2=v.slice(0); } while (ii--);
	out+='Array, slice copy: '+(new Date()-dts)+'<br />';
	debug.innerHTML=out;
	v=v2=null;
	setTimeout('testF32_slice('+s+','+i+')', 500);
}

function testF32_slice(s,i) {
	var ii=i-1, ss=s-1, v=new Float32Array(s), v2=new Float32Array(s);
	do { v[ss]=0.1234567890123456; } while (ss--);
	var dts=new Date();
	do { v2=v.slice(0); } while (ii--);
	out+='Float32Array, slice copy: '+(new Date()-dts)+'<br /><br />';
	debug.innerHTML=out;
	v=v2=null;
	setTimeout('finished('+s+','+i+')', 500);
}

function finished(slots,iterations) {
	out+='FINISHED test with '+slots+' slots over '+iterations+' iterations<br />-----------------------------------<br />';
	debug.innerHTML=out;
}