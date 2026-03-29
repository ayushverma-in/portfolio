/* ═══════════════════════════════════════════════════════════
   Ayush Verma — Portfolio  |  threejs-bg.js
   4000 tiny star particles — deep background — cursor parallax
   + rotating nebula rings
═══════════════════════════════════════════════════════════ */

(function () {
  var canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── SCENE ──
  var scene  = new THREE.Scene();
  var W = window.innerWidth, H = window.innerHeight;
  var camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 3000);
  camera.position.z = 8;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  // ── MOUSE (raw + smoothed) ──
  var mouseRaw = { x: 0, y: 0 };
  var mouseSmooth = { x: 0, y: 0 };
  document.addEventListener('mousemove', function (e) {
    mouseRaw.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseRaw.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── PALETTE ──
  var palette = [
    new THREE.Color(0xc4b5fd),
    new THREE.Color(0xf9a8d4),
    new THREE.Color(0x5eead4),
    new THREE.Color(0xffffff),
    new THREE.Color(0xe0e7ff),
    new THREE.Color(0xfde68a),
    new THREE.Color(0xa5f3fc),
  ];

  // ── LAYER 1: FAR STARS (2500, very tiny, very deep) ──
  var FAR = 2500;
  var farGeo = new THREE.BufferGeometry();
  var farPos = new Float32Array(FAR * 3);
  var farCol = new Float32Array(FAR * 3);
  for (var i = 0; i < FAR; i++) {
    farPos[i*3]   = (Math.random() - 0.5) * 2400;
    farPos[i*3+1] = (Math.random() - 0.5) * 2400;
    farPos[i*3+2] = -200 - Math.random() * 2000;
    var c = palette[Math.floor(Math.random() * palette.length)];
    farCol[i*3] = c.r; farCol[i*3+1] = c.g; farCol[i*3+2] = c.b;
  }
  farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
  farGeo.setAttribute('color',    new THREE.BufferAttribute(farCol, 3));
  var farMat = new THREE.PointsMaterial({
    size: 0.55, vertexColors: true, transparent: true, opacity: 0.7,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  var farStars = new THREE.Points(farGeo, farMat);
  scene.add(farStars);

  // ── LAYER 2: MID STARS (1200, medium depth) ──
  var MID = 1200;
  var midGeo = new THREE.BufferGeometry();
  var midPos = new Float32Array(MID * 3);
  var midCol = new Float32Array(MID * 3);
  for (var j = 0; j < MID; j++) {
    midPos[j*3]   = (Math.random() - 0.5) * 800;
    midPos[j*3+1] = (Math.random() - 0.5) * 800;
    midPos[j*3+2] = -80 - Math.random() * 400;
    var mc = palette[Math.floor(Math.random() * palette.length)];
    midCol[j*3] = mc.r; midCol[j*3+1] = mc.g; midCol[j*3+2] = mc.b;
  }
  midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
  midGeo.setAttribute('color',    new THREE.BufferAttribute(midCol, 3));
  var midMat = new THREE.PointsMaterial({
    size: 0.35, vertexColors: true, transparent: true, opacity: 0.55,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  var midStars = new THREE.Points(midGeo, midMat);
  scene.add(midStars);

  // ── LAYER 3: CLOSE DUST (300, closest, tiniest) ──
  var CLOSE = 300;
  var closeGeo = new THREE.BufferGeometry();
  var closePos = new Float32Array(CLOSE * 3);
  var closeCol = new Float32Array(CLOSE * 3);
  for (var k = 0; k < CLOSE; k++) {
    closePos[k*3]   = (Math.random() - 0.5) * 30;
    closePos[k*3+1] = (Math.random() - 0.5) * 30;
    closePos[k*3+2] = -5 - Math.random() * 40;
    var cc = palette[Math.floor(Math.random() * palette.length)];
    closeCol[k*3] = cc.r; closeCol[k*3+1] = cc.g; closeCol[k*3+2] = cc.b;
  }
  closeGeo.setAttribute('position', new THREE.BufferAttribute(closePos, 3));
  closeGeo.setAttribute('color',    new THREE.BufferAttribute(closeCol, 3));
  var closeMat = new THREE.PointsMaterial({
    size: 0.12, vertexColors: true, transparent: true, opacity: 0.35,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  var closeStars = new THREE.Points(closeGeo, closeMat);
  scene.add(closeStars);

  // ── NEBULA RINGS (deep background) ──
  function makeRing(inner, outer, color, opacity, rx, rz, z) {
    var geo = new THREE.RingGeometry(inner, outer, 128);
    var mat = new THREE.MeshBasicMaterial({
      color: color, side: THREE.DoubleSide, transparent: true,
      opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = rx; mesh.rotation.z = rz; mesh.position.z = z;
    return mesh;
  }
  var ring1 = makeRing(18, 18.5, 0x7c3aed, 0.12, Math.PI*0.3,   0.2,  -60);
  var ring2 = makeRing(26, 26.6, 0xec4899, 0.09, Math.PI*0.5,  -0.3,  -80);
  var ring3 = makeRing(34, 34.4, 0x14b8a6, 0.07, Math.PI*0.2,   0.5,  -100);
  var ring4 = makeRing(12, 12.3, 0xfbbf24, 0.10, Math.PI*0.65, -0.15, -50);
  var ring5 = makeRing(42, 42.4, 0x9b5cf6, 0.05, Math.PI*0.4,   0.35, -120);
  var ringGroup = new THREE.Group();
  ringGroup.add(ring1, ring2, ring3, ring4, ring5);
  scene.add(ringGroup);

  // ── LIGHT THEME ──
  var darkOpacities  = [0.7, 0.55, 0.35, 0.12, 0.09, 0.07, 0.10, 0.05];
  var lightOpacities = [0.2, 0.15, 0.10, 0.03, 0.03, 0.02, 0.03, 0.02];
  function applyTheme() {
    var light = document.body.classList.contains('light-theme');
    var o = light ? lightOpacities : darkOpacities;
    farMat.opacity   = o[0];
    midMat.opacity   = o[1];
    closeMat.opacity = o[2];
    [ring1,ring2,ring3,ring4,ring5].forEach(function(r,i){ r.material.opacity = o[3+i]; });
  }
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', function(){ setTimeout(applyTheme, 50); });

  // ── RESIZE ──
  window.addEventListener('resize', function () {
    W = window.innerWidth; H = window.innerHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  // ── ANIMATE ──
  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // Smooth mouse lerp
    mouseSmooth.x += (mouseRaw.x - mouseSmooth.x) * 0.035;
    mouseSmooth.y += (mouseRaw.y - mouseSmooth.y) * 0.035;

    // Parallax per layer (far moves least, close moves most)
    farStars.position.x   = mouseSmooth.x * 0.8;
    farStars.position.y   = mouseSmooth.y * 0.8;
    midStars.position.x   = mouseSmooth.x * 2.0;
    midStars.position.y   = mouseSmooth.y * 2.0;
    closeStars.position.x = mouseSmooth.x * 4.5;
    closeStars.position.y = mouseSmooth.y * 4.5;
    ringGroup.position.x  = mouseSmooth.x * 1.2;
    ringGroup.position.y  = mouseSmooth.y * 1.2;

    // Background drift rotation (always moving, independent of cursor)
    farStars.rotation.z = t * 0.006;
    midStars.rotation.z = t * 0.010;
    midStars.rotation.x = t * 0.003;

    // Rings rotate at different speeds and directions
    ring1.rotation.z =  t * 0.06;
    ring2.rotation.z = -t * 0.04;
    ring3.rotation.z =  t * 0.025;
    ring4.rotation.z = -t * 0.09;
    ring5.rotation.z =  t * 0.015;
    ringGroup.rotation.y = t * 0.018;

    renderer.render(scene, camera);
  }

  applyTheme();
  animate();

})();
