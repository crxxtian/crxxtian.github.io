import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export function initMandelbulb(containerId = 'mandelbulb-bg') {
    let scene, camera, renderer, mandelbulbMaterial, mesh;
    let mouseX = 0, mouseY = 0;
    let zoomFactor = 1.0;
    let targetZoomFactor = 1.0;
    const zoomSpeed = 0.05;
    let offsetX = 0, offsetY = 0;
    let targetOffsetX = 0, targetOffsetY = 0;
    const panSpeed = 0.005;
    let rotationX = 0, rotationY = 0;
    const rotationSpeed = 0.3;

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container "${containerId}" not found.`);
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = -1.5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // transparent background
    container.appendChild(renderer.domElement);

    mandelbulbMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            zoom: { value: zoomFactor },
            offset: { value: new THREE.Vector3(offsetX, offsetY, 0.0) },
            rotation: { value: new THREE.Vector3(rotationY, rotationX, 0.0) },
            resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
        },
        vertexShader: `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `/* unchanged fragmentShader, same as before */` // You can keep the same shader here
    });

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(planeGeometry, mandelbulbMaterial);
    scene.add(mesh);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('wheel', onMouseWheel);
    window.addEventListener('resize', onResize);

    function onResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        mandelbulbMaterial.uniforms.resolution.value.set(width, height);
    }

    function onMouseMove(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetOffsetX = mouseX * 0.5;
        targetOffsetY = mouseY * 0.5;
        rotationY = mouseX * rotationSpeed;
        rotationX = mouseY * rotationSpeed;
    }

    function onMouseWheel(e) {
        targetZoomFactor += e.deltaY * -0.001 * targetZoomFactor;
        targetZoomFactor = Math.max(0.1, targetZoomFactor);
    }

    function animate() {
        requestAnimationFrame(animate);
        const now = performance.now() / 1000;
        mandelbulbMaterial.uniforms.time.value = now;

        zoomFactor += (targetZoomFactor - zoomFactor) * zoomSpeed;
        offsetX += (targetOffsetX - offsetX) * panSpeed;
        offsetY += (targetOffsetY - offsetY) * panSpeed;

        mandelbulbMaterial.uniforms.zoom.value = zoomFactor;
        mandelbulbMaterial.uniforms.offset.value.set(offsetX, offsetY, 0.0);
        mandelbulbMaterial.uniforms.rotation.value.set(rotationY, rotationX, now * 0.01);

        renderer.render(scene, camera);
    }

    animate();
}
