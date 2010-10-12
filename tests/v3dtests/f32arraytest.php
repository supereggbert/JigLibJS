<!DOCTYPE html>
<html>
<head>
<title>JigLibJS Tests</title>
<script type="text/javascript" src="sh_main.min.js"></script>
<script type="text/javascript" src="sh_javascript.min.js"></script>
<link type="text/css" rel="stylesheet" href="sh_zellner.min.css">
</head>
<body onload="checkBrowser(); sh_highlightDocument();">
<h3>vanilla arrays vs Float32Arrays</h3>
<script type="text/javascript">
		function toggleDiv(divName) { 
			var div=document.getElementById(divName);
			div.style.display=(div.style.display=='none') ? 'block' : 'none'; 
		}
	</script>
<p><a href="javascript:toggleDiv('code');">show/hide test code</a></p>
<div style="display: none;" id="code"><pre class="sh_javascript"><code><?php echo htmlspecialchars(file_get_contents('f32arraytestcode.js')); ?>"));</code></pre>
</div>

<p>
<button onClick="start(4,1000000);">test 4 slot arrays</button>
<button onClick="start(100,1000000);">test 100 slot arrays</button>
<button onClick="start(10000,10000);">test 10,000 slot arrays</button>
<br />
<button
	onClick="start(document.getElementById('s').value,document.getElementById('i').value);">test</button>
<input type="text" id="s" /> slot arrays over <input type="text" id="i" />
iterations<br />
<button onClick="debug.innerHTML=out='';">clear output</button>
</p>

<div id="debug"></div>

<!-- TEST CODE -->
<script type="text/javascript">
		var out='', debug=document.getElementById('debug');
	
		function checkBrowser() {
			if (typeof(Float32Array)=='undefined') 
				debug.innerHTML = '<h1>your browser does not support the Float32Array typed array - these tests will not work';
		}
	</script>
<script type="text/javascript" src="f32arraytestcode.js"></script>
</body>
</html>
