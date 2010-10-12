<!DOCTYPE html>
<html>
<head>
<title>JigLibJS Tests</title>
<script type="text/javascript" src="sh_main.min.js"></script>
<script type="text/javascript" src="sh_javascript.min.js"></script>
<link type="text/css" rel="stylesheet" href="sh_zellner.min.css">
</head>
<body onload="sh_highlightDocument();">
<h3>cloning method performance test: Float32Array and Float64Array</h3>
<script type="text/javascript">
		function toggleDiv(divName) { 
			var div=document.getElementById(divName);
			div.style.display=(div.style.display=='none') ? 'block' : 'none'; 
		}
	</script>
<p><a href="javascript:toggleDiv('code');">show/hide test code</a></p>
<div style="display: none;" id="code"><pre class="sh_javascript"><code><?php echo htmlspecialchars(file_get_contents('f32clonetestcode.js')); ?>"));</code></pre>
</div>

<p>
<button onClick="start(32, out, debug);">start the Float32Array
test</button>
<button onClick="start(64, out, debug);">start the Float64Array
test</button>
<button onClick="prec();">precision test</button>
<button onClick="debug.innerHTML=out='';">clear output</button>
</p>

<div id="debug"></div>

<!-- TEST CODE -->
<script type="text/javascript" src="f32clonetestcode.js"></script>
<script type="text/javascript">
		var out='', debug=document.getElementById('debug');
	</script>
</body>
</html>
