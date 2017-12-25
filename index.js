if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
}

var container, stats;
var camera, scene, renderer;
var materialHDR, quad;
var sign = 1, rate = 1;
var clock = new THREE.Clock();

init();

animate();

function init() {
	container = document.getElementById('container');
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 900;
	scene = new THREE.Scene();
	var texture = new THREE.TextureLoader().load( "./img/IMG_6265.JPG" );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.NearestFilter;
	materialHDR = new THREE.ShaderMaterial( {
		uniforms: {
			tDiffuse:  { value: texture },
			exposure:  { value: 0.125 },
			brightMax: { value: 0.5 }
			},
		vertexShader: getText( 'vs-hdr' ),
		fragmentShader: getText( 'fs-hdr' )
	} );
	var plane = new THREE.PlaneBufferGeometry( 512, 768 );
	quad = new THREE.Mesh( plane, materialHDR );
	quad.position.z = -100;
	scene.add( quad );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	// stats = new Stats();
	// container.appendChild( stats.dom );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function getText( id ) {
	return document.getElementById( id ).textContent;
}

//

function animate() {
	requestAnimationFrame( animate );
	render();
	// stats.update();
}

function render() {
	var delta = clock.getDelta() * 5;
	if ( materialHDR.uniforms.exposure.value > 0 || materialHDR.uniforms.exposure.value < 1 ) {
		rate = 0.25;
	} else {
		rate = 1;
	}
	if ( materialHDR.uniforms.exposure.value > 5 || materialHDR.uniforms.exposure.value <= 0 ) {
		sign *= -1;
	}
	materialHDR.uniforms.exposure.value += sign * rate * delta;
	renderer.render( scene, camera );
}
