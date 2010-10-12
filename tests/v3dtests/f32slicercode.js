function test() {
	var out='testing Float32Array.slice(0)...<br /><br />';
	var a1=new Float32Array(1);
	a1[0]=1;
	var a2=a1.slice(0);
	out+='a1[0]: '+a1[0]+'<br />a2[0]: '+a2[0];
	out+='<br /><br />setting a2[0] to 2...<br /><br />';
	a2[0]=2;
	out+='a1[0]: '+a1[0]+'<br />a2[0]: '+a2[0];

	out+='<hr />testing new Float32Array(oldArray)...<br /><br />';
	a1=new Float32Array(1);
	a1[0]=1;
	a2=new Float32Array(a1);
	out+='a1[0]: '+a1[0]+'<br />a2[0]: '+a2[0];
	out+='<br /><br />setting a2[0] to 2...<br /><br />';
	a2[0]=2;
	out+='a1[0]: '+a1[0]+'<br />a2[0]: '+a2[0];
	
	document.getElementById('debug').innerHTML=out;
}