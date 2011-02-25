(function(a){if(typeof Float32Array!="undefined"){glMatrixArrayType=Float32Array;}else{if(typeof WebGLFloatArray!="undefined"){glMatrixArrayType=WebGLFloatArray;}else{glMatrixArrayType=Array;}}var d={};d.create=function(f){var e=new glMatrixArrayType(3);if(f){e[0]=f[0];e[1]=f[1];e[2]=f[2];}return e;};d.set=function(f,e){e[0]=f[0];e[1]=f[1];e[2]=f[2];return e;};d.add=function(f,g,e){if(!e||f==e){f[0]+=g[0];f[1]+=g[1];f[2]+=g[2];return f;}e[0]=f[0]+g[0];e[1]=f[1]+g[1];e[2]=f[2]+g[2];return e;};d.subtract=function(f,g,e){if(!e||f==e){f[0]-=g[0];f[1]-=g[1];f[2]-=g[2];return f;}e[0]=f[0]-g[0];e[1]=f[1]-g[1];e[2]=f[2]-g[2];return e;};d.negate=function(f,e){if(!e){e=f;}e[0]=-f[0];e[1]=-f[1];e[2]=-f[2];return e;};d.scale=function(f,g,e){if(!e||f==e){f[0]*=g;f[1]*=g;f[2]*=g;return f;}e[0]=f[0]*g;e[1]=f[1]*g;e[2]=f[2]*g;return e;};d.normalize=function(h,g){if(!g){g=h;}var f=h[0],j=h[1],i=h[2];var e=Math.sqrt(f*f+j*j+i*i);if(!e){g[0]=0;g[1]=0;g[2]=0;return g;}else{if(e==1){g[0]=f;g[1]=j;g[2]=i;return g;}}e=1/e;g[0]=f*e;g[1]=j*e;g[2]=i*e;return g;};d.cross=function(f,h,m){if(!m){m=f;}var l=f[0],j=f[1],i=f[2];var e=h[0],k=h[1],g=h[2];m[0]=j*g-i*k;m[1]=i*e-l*g;m[2]=l*k-j*e;return m;};d.length=function(f){var e=f[0],h=f[1],g=f[2];return Math.sqrt(e*e+h*h+g*g);};d.dot=function(e,f){return e[0]*f[0]+e[1]*f[1]+e[2]*f[2];};d.direction=function(h,i,g){if(!g){g=h;}var f=h[0]-i[0];var k=h[1]-i[1];var j=h[2]-i[2];var e=Math.sqrt(f*f+k*k+j*j);if(!e){g[0]=0;g[1]=0;g[2]=0;return g;}e=1/e;g[0]=f*e;g[1]=k*e;g[2]=j*e;return g;};d.str=function(e){return"["+e[0]+", "+e[1]+", "+e[2]+"]";};var c={};c.create=function(f){var e=new glMatrixArrayType(9);if(f){e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];e[4]=f[4];e[5]=f[5];e[6]=f[6];e[7]=f[7];e[8]=f[8];e[9]=f[9];}return e;};c.set=function(f,e){e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];e[4]=f[4];e[5]=f[5];e[6]=f[6];e[7]=f[7];e[8]=f[8];return e;};c.identity=function(e){e[0]=1;e[1]=0;e[2]=0;e[3]=0;e[4]=1;e[5]=0;e[6]=0;e[7]=0;e[8]=1;return e;};c.toMat4=function(f,e){if(!e){e=b.create();}e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=0;e[4]=f[3];e[5]=f[4];e[6]=f[5];e[7]=0;e[8]=f[6];e[9]=f[7];e[10]=f[8];e[11]=0;e[12]=0;e[13]=0;e[14]=0;e[15]=1;return e;};c.str=function(e){return"["+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+"]";};var b={};b.create=function(f){var e=new glMatrixArrayType(16);if(f){e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];e[4]=f[4];e[5]=f[5];e[6]=f[6];e[7]=f[7];e[8]=f[8];e[9]=f[9];e[10]=f[10];e[11]=f[11];e[12]=f[12];e[13]=f[13];e[14]=f[14];e[15]=f[15];}return e;};b.set=function(f,e){e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];e[4]=f[4];e[5]=f[5];e[6]=f[6];e[7]=f[7];e[8]=f[8];e[9]=f[9];e[10]=f[10];e[11]=f[11];e[12]=f[12];e[13]=f[13];e[14]=f[14];e[15]=f[15];return e;};b.identity=function(e){e[0]=1;e[1]=0;e[2]=0;e[3]=0;e[4]=0;e[5]=1;e[6]=0;e[7]=0;e[8]=0;e[9]=0;e[10]=1;e[11]=0;e[12]=0;e[13]=0;e[14]=0;e[15]=1;return e;};b.transpose=function(h,g){if(!g||h==g){var l=h[1],j=h[2],i=h[3];var e=h[6],k=h[7];var f=h[11];h[1]=h[4];h[2]=h[8];h[3]=h[12];h[4]=l;h[6]=h[9];h[7]=h[13];h[8]=j;h[9]=e;h[11]=h[14];h[12]=i;h[13]=k;h[14]=f;return h;}g[0]=h[0];g[1]=h[4];g[2]=h[8];g[3]=h[12];g[4]=h[1];g[5]=h[5];g[6]=h[9];g[7]=h[13];g[8]=h[2];g[9]=h[6];g[10]=h[10];g[11]=h[14];g[12]=h[3];g[13]=h[7];g[14]=h[11];g[15]=h[15];return g;};b.determinant=function(s){var l=s[0],k=s[1],i=s[2],g=s[3];var u=s[4],t=s[5],r=s[6],q=s[7];var p=s[8],o=s[9],n=s[10],m=s[11];var j=s[12],h=s[13],f=s[14],e=s[15];return j*o*r*g-p*h*r*g-j*t*n*g+u*h*n*g+p*t*f*g-u*o*f*g-j*o*i*q+p*h*i*q+j*k*n*q-l*h*n*q-p*k*f*q+l*o*f*q+j*t*i*m-u*h*i*m-j*k*r*m+l*h*r*m+u*k*f*m-l*t*f*m-p*t*i*e+u*o*i*e+p*k*r*e-l*o*r*e-u*k*n*e+l*t*n*e;};b.inverse=function(z,o){if(!o){o=z;}var G=z[0],E=z[1],D=z[2],B=z[3];var h=z[4],g=z[5],f=z[6],e=z[7];var w=z[8],v=z[9],u=z[10],t=z[11];var I=z[12],H=z[13],F=z[14],C=z[15];var s=G*g-E*h;var r=G*f-D*h;var q=G*e-B*h;var p=E*f-D*g;var n=E*e-B*g;var m=D*e-B*f;var l=w*H-v*I;var k=w*F-u*I;var j=w*C-t*I;var i=v*F-u*H;var A=v*C-t*H;var y=u*C-t*F;var x=1/(s*y-r*A+q*i+p*j-n*k+m*l);o[0]=(g*y-f*A+e*i)*x;o[1]=(-E*y+D*A-B*i)*x;o[2]=(H*m-F*n+C*p)*x;o[3]=(-v*m+u*n-t*p)*x;o[4]=(-h*y+f*j-e*k)*x;o[5]=(G*y-D*j+B*k)*x;o[6]=(-I*m+F*q-C*r)*x;o[7]=(w*m-u*q+t*r)*x;o[8]=(h*A-g*j+e*l)*x;o[9]=(-G*A+E*j-B*l)*x;o[10]=(I*n-H*q+C*s)*x;o[11]=(-w*n+v*q-t*s)*x;o[12]=(-h*i+g*k-f*l)*x;o[13]=(G*i-E*k+D*l)*x;o[14]=(-I*p+H*r-F*s)*x;o[15]=(w*p-v*r+u*s)*x;return o;};b.toRotationMat=function(f,e){if(!e){e=b.create();}e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];e[4]=f[4];e[5]=f[5];e[6]=f[6];e[7]=f[7];e[8]=f[8];e[9]=f[9];e[10]=f[10];e[11]=f[11];e[12]=0;e[13]=0;e[14]=0;e[15]=1;return e;};b.toMat3=function(f,e){if(!e){e=c.create();}e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[4];e[4]=f[5];e[5]=f[6];e[6]=f[8];e[7]=f[9];e[8]=f[10];return e;};b.toInverseMat3=function(r,p){var i=r[0],h=r[1],g=r[2];var t=r[4],s=r[5],q=r[6];var m=r[8],l=r[9],k=r[10];var j=k*s-q*l;var f=-k*t+q*m;var o=l*t-s*m;var n=i*j+h*f+g*o;if(!n){return null;}var e=1/n;if(!p){p=c.create();}p[0]=j*e;p[1]=(-k*h+g*l)*e;p[2]=(q*h-g*s)*e;p[3]=f*e;p[4]=(k*i-g*m)*e;p[5]=(-q*i+g*t)*e;p[6]=o*e;p[7]=(-l*i+h*m)*e;p[8]=(s*i-h*t)*e;return p;};b.multiply=function(D,m,n){if(!n){n=D;}var K=D[0],J=D[1],H=D[2],F=D[3];var l=D[4],k=D[5],j=D[6],i=D[7];var z=D[8],y=D[9],x=D[10],w=D[11];var M=D[12],L=D[13],I=D[14],G=D[15];var u=m[0],s=m[1],q=m[2],o=m[3];var E=m[4],C=m[5],B=m[6],A=m[7];var h=m[8],g=m[9],f=m[10],e=m[11];var v=m[12],t=m[13],r=m[14],p=m[15];n[0]=u*K+s*l+q*z+o*M;n[1]=u*J+s*k+q*y+o*L;n[2]=u*H+s*j+q*x+o*I;n[3]=u*F+s*i+q*w+o*G;n[4]=E*K+C*l+B*z+A*M;n[5]=E*J+C*k+B*y+A*L;n[6]=E*H+C*j+B*x+A*I;n[7]=E*F+C*i+B*w+A*G;n[8]=h*K+g*l+f*z+e*M;n[9]=h*J+g*k+f*y+e*L;n[10]=h*H+g*j+f*x+e*I;n[11]=h*F+g*i+f*w+e*G;n[12]=v*K+t*l+r*z+p*M;n[13]=v*J+t*k+r*y+p*L;n[14]=v*H+t*j+r*x+p*I;n[15]=v*F+t*i+r*w+p*G;return n;};b.multiplyVec3=function(h,g,f){if(!f){f=g;}var e=g[0],j=g[1],i=g[2];f[0]=h[0]*e+h[4]*j+h[8]*i+h[12];f[1]=h[1]*e+h[5]*j+h[9]*i+h[13];f[2]=h[2]*e+h[6]*j+h[10]*i+h[14];return f;};b.multiplyVec4=function(i,h,g){if(!g){g=h;}var e=h[0],k=h[1],j=h[2],f=h[3];g[0]=i[0]*e+i[4]*k+i[8]*j+i[12]*f;g[1]=i[1]*e+i[5]*k+i[9]*j+i[13]*f;g[2]=i[2]*e+i[6]*k+i[10]*j+i[14]*f;g[4]=i[4]*e+i[7]*k+i[11]*j+i[15]*f;return g;};b.translate=function(r,m,k){var l=m[0],j=m[1],i=m[2];if(!k||r==k){r[12]=r[0]*l+r[4]*j+r[8]*i+r[12];r[13]=r[1]*l+r[5]*j+r[9]*i+r[13];r[14]=r[2]*l+r[6]*j+r[10]*i+r[14];r[15]=r[3]*l+r[7]*j+r[11]*i+r[15];return r;}var v=r[0],u=r[1],t=r[2],s=r[3];var h=r[4],g=r[5],f=r[6],e=r[7];var q=r[8],p=r[9],o=r[10],n=r[11];k[0]=v;k[1]=u;k[2]=t;k[3]=s;k[4]=h;k[5]=g;k[6]=f;k[7]=e;k[8]=q;k[9]=p;k[10]=o;k[11]=n;k[12]=v*l+h*j+q*i+r[12];k[13]=u*l+g*j+p*i+r[13];k[14]=t*l+f*j+o*i+r[14];k[15]=s*l+e*j+n*i+r[15];return k;};b.scale=function(h,g,f){var e=g[0],j=g[1],i=g[2];if(!f||h==f){h[0]*=e;h[1]*=e;h[2]*=e;h[3]*=e;h[4]*=j;h[5]*=j;h[6]*=j;h[7]*=j;h[8]*=i;h[9]*=i;h[10]*=i;h[11]*=i;return h;}f[0]=h[0]*e;f[1]=h[1]*e;f[2]=h[2]*e;f[3]=h[3]*e;f[4]=h[4]*j;f[5]=h[5]*j;f[6]=h[6]*j;f[7]=h[7]*j;f[8]=h[8]*i;f[9]=h[9]*i;f[10]=h[10]*i;f[11]=h[11]*i;f[12]=h[12];f[13]=h[13];f[14]=h[14];f[15]=h[15];return f;};b.rotate=function(I,G,e,o){var p=e[0],n=e[1],m=e[2];var E=Math.sqrt(p*p+n*n+m*m);if(!E){return null;}if(E!=1){E=1/E;p*=E;n*=E;m*=E;}var w=Math.sin(G);var K=Math.cos(G);var v=1-K;var O=I[0],N=I[1],M=I[2],L=I[3];var l=I[4],k=I[5],j=I[6],i=I[7];var D=I[8],C=I[9],B=I[10],A=I[11];var u=p*p*v+K,r=n*p*v+m*w,q=m*p*v-n*w;var J=p*n*v-m*w,H=n*n*v+K,F=m*n*v+p*w;var h=p*m*v+n*w,g=n*m*v-p*w,f=m*m*v+K;if(!o){o=I;}else{if(I!=o){o[12]=I[12];o[13]=I[13];o[14]=I[14];o[15]=I[15];}}o[0]=O*u+l*r+D*q;o[1]=N*u+k*r+C*q;o[2]=M*u+j*r+B*q;o[3]=L*u+i*r+A*q;o[4]=O*J+l*H+D*F;o[5]=N*J+k*H+C*F;o[6]=M*J+j*H+B*F;o[7]=L*J+i*H+A*F;o[8]=O*h+l*g+D*f;o[9]=N*h+k*g+C*f;o[10]=M*h+j*g+B*f;o[11]=L*h+i*g+A*f;return o;};b.rotateX=function(n,e,l){var q=Math.sin(e);var j=Math.cos(e);var p=n[4],o=n[5],m=n[6],k=n[7];var i=n[8],h=n[9],g=n[10],f=n[11];if(!l){l=n;}else{if(n!=l){l[0]=n[0];l[1]=n[1];l[2]=n[2];l[3]=n[3];l[12]=n[12];l[13]=n[13];l[14]=n[14];l[15]=n[15];}}l[4]=p*j+i*q;l[5]=o*j+h*q;l[6]=m*j+g*q;l[7]=k*j+f*q;l[8]=p*-q+i*j;l[9]=o*-q+h*j;l[10]=m*-q+g*j;l[11]=k*-q+f*j;return l;};b.rotateY=function(p,h,o){var q=Math.sin(h);var n=Math.cos(h);var i=p[0],g=p[1],f=p[2],e=p[3];var m=p[8],l=p[9],k=p[10],j=p[11];if(!o){o=p;}else{if(p!=o){o[4]=p[4];o[5]=p[5];o[6]=p[6];o[7]=p[7];o[12]=p[12];o[13]=p[13];o[14]=p[14];o[15]=p[15];}}o[0]=i*n+m*-q;o[1]=g*n+l*-q;o[2]=f*n+k*-q;o[3]=e*n+j*-q;o[8]=i*q+m*n;o[9]=g*q+l*n;o[10]=f*q+k*n;o[11]=e*q+j*n;return o;};b.rotateZ=function(o,h,l){var q=Math.sin(h);var j=Math.cos(h);var i=o[0],g=o[1],f=o[2],e=o[3];var p=o[4],n=o[5],m=o[6],k=o[7];if(!l){l=o;}else{if(o!=l){l[8]=o[8];l[9]=o[9];l[10]=o[10];l[11]=o[11];l[12]=o[12];l[13]=o[13];l[14]=o[14];l[15]=o[15];}}l[0]=i*j+p*q;l[1]=g*j+n*q;l[2]=f*j+m*q;l[3]=e*j+k*q;l[4]=i*-q+p*j;l[5]=g*-q+n*j;l[6]=f*-q+m*j;l[7]=e*-q+k*j;return l;};b.frustum=function(f,n,e,l,i,h,m){if(!m){m=b.create();}var j=(n-f);var g=(l-e);var k=(h-i);m[0]=(i*2)/j;m[1]=0;m[2]=0;m[3]=0;m[4]=0;m[5]=(i*2)/g;m[6]=0;m[7]=0;m[8]=(n+f)/j;m[9]=(l+e)/g;m[10]=-(h+i)/k;m[11]=-1;m[12]=0;m[13]=0;m[14]=-(h*i*2)/k;m[15]=0;return m;};b.perspective=function(g,f,j,e,h){var k=j*Math.tan(g*Math.PI/360);var i=k*f;return b.frustum(-i,i,-k,k,j,e,h);};b.ortho=function(f,n,e,l,i,h,m){if(!m){m=b.create();}var j=(n-f);var g=(l-e);var k=(h-i);m[0]=2/j;m[1]=0;m[2]=0;m[3]=0;m[4]=0;m[5]=2/g;m[6]=0;m[7]=0;m[8]=0;m[9]=0;m[10]=-2/k;m[11]=0;m[12]=-(f+n)/j;m[13]=-(l+e)/g;m[14]=-(h+i)/k;m[15]=1;return m;};b.lookAt=function(z,A,l,k){if(!k){k=b.create();}var x=z[0],v=z[1],s=z[2],j=l[0],i=l[1],h=l[2],r=A[0],q=A[1],p=A[2];if(x==r&&v==q&&s==p){return b.identity(k);}var o,n,m,y,w,u,g,f,e,t;o=x-A[0];n=v-A[1];m=s-A[2];t=1/Math.sqrt(o*o+n*n+m*m);o*=t;n*=t;m*=t;y=i*m-h*n;w=h*o-j*m;u=j*n-i*o;t=Math.sqrt(y*y+w*w+u*u);if(!t){y=0;w=0;u=0;}else{t=1/t;y*=t;w*=t;u*=t;}g=n*u-m*w;f=m*y-o*u;e=o*w-n*y;t=Math.sqrt(g*g+f*f+e*e);if(!t){g=0;f=0;e=0;}else{t=1/t;g*=t;f*=t;e*=t;}k[0]=y;k[1]=g;k[2]=o;k[3]=0;k[4]=w;k[5]=f;k[6]=n;k[7]=0;k[8]=u;k[9]=e;k[10]=m;k[11]=0;k[12]=-(y*x+w*v+u*s);k[13]=-(g*x+f*v+e*s);k[14]=-(o*x+n*v+m*s);k[15]=1;return k;};b.str=function(e){return"["+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+", "+e[9]+", "+e[10]+", "+e[11]+", "+e[12]+", "+e[13]+", "+e[14]+", "+e[15]+"]";};quat4={};quat4.create=function(f){var e=new glMatrixArrayType(4);if(f){e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];}return e;};quat4.set=function(f,e){e[0]=f[0];e[1]=f[1];e[2]=f[2];e[3]=f[3];return e;};quat4.calculateW=function(g,f){var e=g[0],i=g[1],h=g[2];if(!f||g==f){g[3]=-Math.sqrt(Math.abs(1-e*e-i*i-h*h));return g;}f[0]=e;f[1]=i;f[2]=h;f[3]=-Math.sqrt(Math.abs(1-e*e-i*i-h*h));return f;};quat4.inverse=function(f,e){if(!e||f==e){f[0]*=1;f[1]*=1;f[2]*=1;return f;}e[0]=-f[0];e[1]=-f[1];e[2]=-f[2];e[3]=f[3];return e;};quat4.length=function(g){var e=g[0],i=g[1],h=g[2],f=g[3];return Math.sqrt(e*e+i*i+h*h+f*f);};quat4.normalize=function(i,h){if(!h){h=i;}var f=i[0],k=i[1],j=i[2],g=i[3];var e=Math.sqrt(f*f+k*k+j*j+g*g);if(e==0){h[0]=0;h[1]=0;h[2]=0;h[3]=0;return h;}e=1/e;h[0]=f*e;h[1]=k*e;h[2]=j*e;h[3]=g*e;return h;};quat4.multiply=function(f,h,o){if(!o){o=f;}var m=f[0],l=f[1],k=f[2],n=f[3];var i=h[0],g=h[1],e=h[2],j=h[3];o[0]=m*j+n*i+l*e-k*g;o[1]=l*j+n*g+k*i-m*e;o[2]=k*j+n*e+m*g-l*i;o[3]=n*j-m*i-l*g-k*e;return o;};quat4.multiplyVec3=function(f,h,r){if(!r){r=h;}var q=h[0],p=h[1],o=h[2];var m=f[0],l=f[1],k=f[2],n=f[3];var i=n*q+l*o-k*p;var g=n*p+k*q-m*o;var e=n*o+m*p-l*q;var j=-m*q-l*p-k*o;r[0]=i*n+j*-m+g*-k-e*-l;r[1]=g*n+j*-l+e*-m-i*-k;r[2]=e*n+j*-k+i*-l-g*-m;return r;};quat4.toMat3=function(e,l){if(!l){l=c.create();}var m=e[0],k=e[1],j=e[2],n=e[3];var r=m+m;var f=k+k;var o=j+j;var i=m*r;var h=m*f;var g=m*o;var q=k*f;var p=k*o;var u=j*o;var v=n*r;var t=n*f;var s=n*o;l[0]=1-(q+u);l[1]=h-s;l[2]=g+t;l[3]=h+s;l[4]=1-(i+u);l[5]=p-v;l[6]=g-t;l[7]=p+v;l[8]=1-(i+q);return l;};quat4.toMat4=function(e,l){if(!l){l=b.create();}var m=e[0],k=e[1],j=e[2],n=e[3];var r=m+m;var f=k+k;var o=j+j;var i=m*r;var h=m*f;var g=m*o;var q=k*f;var p=k*o;var u=j*o;var v=n*r;var t=n*f;var s=n*o;l[0]=1-(q+u);l[1]=h-s;l[2]=g+t;l[3]=0;l[4]=h+s;l[5]=1-(i+u);l[6]=p-v;l[7]=0;l[8]=g-t;l[9]=p+v;l[10]=1-(i+q);l[11]=0;l[12]=0;l[13]=0;l[14]=0;l[15]=1;return l;};quat4.str=function(e){return"["+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+"]";};a.GLMatrix=b;})(jigLib);