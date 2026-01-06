// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Fog for depth
scene.fog = new THREE.FogExp2(0x050505, 0.02);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x0aff0a, 2, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00f3ff, 2, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Objects Group
const mainGroup = new THREE.Group();
scene.add(mainGroup);

// Geometries
const createGeometricShape = (type, color, wireframe = true) => {
    let geometry;
    switch(type) {
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(1, 0);
            break;
        case 'torus':
            geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(1.2);
            break;
        case 'box':
            geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 4, 4, 4);
            break;
        case 'sphere':
             geometry = new THREE.SphereGeometry(1, 32, 32);
             break;
    }
    
    const material = new THREE.MeshStandardMaterial({ 
        color: color, 
        wireframe: wireframe,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.5
    });
    
    return new THREE.Mesh(geometry, material);
};

// Create main floating objects
const shape1 = createGeometricShape('icosahedron', 0x0aff0a); // Chatbots/Search
const shape2 = createGeometricShape('torus', 0x00f3ff); // Validation/Security
const shape3 = createGeometricShape('octahedron', 0x0aff0a); // Analytics
const shape4 = createGeometricShape('box', 0x00f3ff); // Deployment
const shape5 = createGeometricShape('sphere', 0xff00ff); // Multimodal

mainGroup.add(shape1);
mainGroup.add(shape2);
mainGroup.add(shape3);
mainGroup.add(shape4);
mainGroup.add(shape5);

// Particles Grid
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.4
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Camera Position
camera.position.z = 5;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Interaction (GSAP)
gsap.registerPlugin(ScrollTrigger);

// Initial positions
shape1.position.set(2, 0, 0);
shape2.position.set(-10, 0, 0);
shape3.position.set(0, -10, 0);
shape4.position.set(0, 10, 0);
shape5.position.set(10, 10, 0);

// --- ANIMATION TIMELINE ---

// 1. Hero -> Chatbots (Show Shape 1)
gsap.to(shape1.position, {
    scrollTrigger: {
        trigger: "#chatbots",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: 1.5,
    y: 0,
    z: 1
});

// 2. Chatbots -> Validation (Show Shape 2)
gsap.to(shape1.position, {
    scrollTrigger: {
        trigger: "#validation",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: 10, 
    opacity: 0
});

gsap.to(shape2.position, {
    scrollTrigger: {
        trigger: "#validation",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: -1.5,
    y: 0,
    z: 2
});

// 3. Validation -> Analytics (Show Shape 3)
gsap.to(shape2.position, {
    scrollTrigger: {
        trigger: "#analytics",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: -10 
});

gsap.to(shape3.position, {
    scrollTrigger: {
        trigger: "#analytics",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: 1.5,
    y: 0,
    z: 1
});

// 4. Analytics -> Search (Reuse Shape 1)
gsap.to(shape3.position, {
    scrollTrigger: {
        trigger: "#search",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    y: -10 
});

gsap.fromTo(shape1.position, 
    { x: -5, y: 5 },
    {
        scrollTrigger: {
            trigger: "#search",
            start: "top bottom",
            end: "center center",
            scrub: 1
        },
        x: -2,
        y: 0,
        z: 0
    }
);

// 5. Search -> Security (Show Shape 2 as Shield)
gsap.to(shape1.position, {
    scrollTrigger: {
        trigger: "#security",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: -10
});

gsap.fromTo(shape2.position,
    { x: 5, y: -5, z: -5 },
    {
        scrollTrigger: {
            trigger: "#security",
            start: "top bottom",
            end: "center center",
            scrub: 1
        },
        x: 2,
        y: 0,
        z: 3,
        scale: 1.5
    }
);

gsap.to(shape2.rotation, {
    scrollTrigger: {
        trigger: "#security",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    x: 0,
    y: Math.PI / 2 
});

// 6. Security -> Deployment (Show Shape 4 Box)
gsap.to(shape2.position, {
    scrollTrigger: {
        trigger: "#deployment",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    y: 10
});

gsap.to(shape4.position, {
    scrollTrigger: {
        trigger: "#deployment",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    x: 0,
    y: 0,
    z: 0
});

// --- NEW GROUNDBREAKING SECTIONS ---

// 7. Horizontal Scroll (Multimodal)
// We need to move the horizontal track 
let panels = gsap.utils.toArray(".h-panel");

gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: "#multimodal",
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: "+=3000" // Length of the horizontal scroll
    }
});

// Animate Shape 5 (Sphere) for Multimodal
gsap.to(shape4.position, {
    scrollTrigger: {
        trigger: "#multimodal",
        start: "top bottom",
        end: "top top",
        scrub: 1
    },
    y: -10
});

gsap.fromTo(shape5.position,
    { x: 10, y: 0 },
    {
        scrollTrigger: {
            trigger: "#multimodal",
            start: "top bottom",
            end: "top top",
            scrub: 1
        },
        x: 0,
        y: 0,
        z: 2
    }
);

// Shape 5 morphs/moves during horizontal scroll
gsap.to(shape5.scale, {
    scrollTrigger: {
        trigger: "#multimodal",
        start: "top top",
        end: "+=1000", // First panel
        scrub: 1
    },
    x: 1.5,
    y: 0.5 // Squish for Vision
});

gsap.to(shape5.scale, {
    scrollTrigger: {
        trigger: "#multimodal",
        start: "+=1000",
        end: "+=2000", // Second panel
        scrub: 1
    },
    x: 0.5,
    y: 1.5 // Stretch for Audio
});

gsap.to(shape5.scale, {
    scrollTrigger: {
        trigger: "#multimodal",
        start: "+=2000",
        end: "+=3000", // Third panel
        scrub: 1
    },
    x: 1,
    y: 1 // Normalize for Lidar
});

// 8. Swarm (All Shapes Converge)
gsap.to(shape5.position, {
    scrollTrigger: {
        trigger: "#swarm",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    y: 10 // Fly away
});

// Bring all shapes back for the Swarm/Finale
const allShapes = [shape1, shape2, shape3, shape4];

allShapes.forEach((s, i) => {
    gsap.to(s.position, {
        scrollTrigger: {
            trigger: "#swarm",
            start: "top bottom",
            end: "center center",
            scrub: 1
        },
        x: Math.cos(i) * 3,
        y: Math.sin(i) * 3,
        z: 0
    });
    
    gsap.to(s.rotation, {
        scrollTrigger: {
            trigger: "#swarm",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.5
        },
        x: Math.PI * 4,
        y: Math.PI * 4
    });
});


// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth rotation based on mouse
    mainGroup.rotation.y += 0.05 * (targetX - mainGroup.rotation.y);
    mainGroup.rotation.x += 0.05 * (targetY - mainGroup.rotation.x);

    // Idle animations
    shape1.rotation.y += 0.005;
    shape2.rotation.x -= 0.005;
    shape3.rotation.z += 0.005;
    shape4.rotation.x += 0.002;
    shape5.rotation.y += 0.01;

    // Wave effect for particles
    particlesMesh.rotation.y = -elapsedTime * 0.02;
    particlesMesh.rotation.x = mouseY * 0.00005;

    renderer.render(scene, camera);
}

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();