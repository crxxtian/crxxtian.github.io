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
    renderer.setClearColor(0x000000, 0);
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
        fragmentShader: `
            #define MAX_ITER 30
            #define BAILOUT 4.0

            uniform float time;
            uniform float zoom;
            uniform vec3 offset;
            uniform vec3 rotation;
            uniform vec2 resolution;

            vec3 rotate(vec3 v, vec3 r) {
                vec3 s = sin(r);
                vec3 c = cos(r);
                return mat3(
                    c.y * c.z, -s.z * c.y, s.y,
                    s.z, c.x * c.z + s.x * s.y * s.z, -s.x * c.z + c.x * s.y * s.z,
                    -s.y * c.z, s.x * c.y, c.x * c.y
                ) * v;
            }

            float mandelbulb(vec3 c) {
                vec3 z = c;
                float dr = 1.0;
                float r = 0.0;
                for (int i = 0; i < MAX_ITER; i++) {
                    r = length(z);
                    if (r > BAILOUT) break;

                    float zr = z.x;
                    float zi = z.y;
                    float zj = z.z;

                    float a = atan(sqrt(zr * zr + zi * zi), zj);
                    float b = 8.0 * a;
                    float r_n = pow(r, 8.0);

                    z = r_n * vec3(
                        sin(b) * cos(8.0 * atan(zi, zr)),
                        sin(b) * sin(8.0 * atan(zi, zr)),
                        cos(b)
                    );
                    z += c;
                    dr = 8.0 * pow(r, 7.0) * dr + 1.0;
                }
                return smoothstep(3.0, BAILOUT, r);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
                vec3 rayDir = normalize(vec3(uv, -1.0));
                vec3 rayOrigin = vec3(0.0, 0.0, -1.5 * zoom + offset.z);

                rayDir = rotate(rayDir, rotation);

                float t = 0.0;
                vec3 p = rayOrigin;
                float depth = 0.0;

                for (int i = 0; i < 60; i++) {
                    vec3 translatedP = (p - offset) / zoom;
                    float dist = (BAILOUT - length(translatedP)) * mandelbulb(translatedP);
                    if (abs(dist) < 0.001) {
                        depth = float(i) / 60.0;
                        break;
                    }
                    t += dist * 0.8;
                    p = rayOrigin + rayDir * t;
                }

                vec3 color = vec3(0.0);
                if (depth > 0.0) {
                    float normalizedDepth = depth * 2.0;
                    vec3 oliveGreen = vec3(0.16, 0.49, 0.35);   // #2e7d32
                    vec3 darkGreen = vec3(0.10, 0.24, 0.20);    // #1a3c34
                    color = mix(darkGreen, oliveGreen, normalizedDepth);

                    vec3 normal = normalize(vec3(
                        mandelbulb((p - offset + vec3(0.001, 0.0, 0.0)) / zoom) - mandelbulb((p - offset - vec3(0.001, 0.0, 0.0)) / zoom),
                        mandelbulb((p - offset + vec3(0.0, 0.001, 0.0)) / zoom) - mandelbulb((p - offset - vec3(0.0, 0.001, 0.0)) / zoom),
                        mandelbulb((p - offset + vec3(0.0, 0.0, 0.001)) / zoom) - mandelbulb((p - offset - vec3(0.0, 0.0, 0.001)) / zoom)
                    ));
                    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                    float diffuse = max(0.1, dot(normal, lightDir));
                    color *= diffuse * 1.2;
                }

                gl_FragColor = vec4(color, 1.0);
            }
        `
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
