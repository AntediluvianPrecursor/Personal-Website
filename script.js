// ============================
// ASYMMETRICAL ULTRON BACKGROUND
// ============================

const canvas = document.getElementById('vortexCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Ultron effect parameters
let time = 0;
let audioReactivity = 1;

// Create chaotic particle swarms
const swarms = [];
const numSwarms = 8;

function initUltron() {
    swarms.length = 0;
    for (let s = 0; s < numSwarms; s++) {
        const swarm = {
            centerX: Math.random() * canvas.width * 0.8,
            centerY: Math.random() * canvas.height * 0.8,
            baseX: Math.random() * canvas.width * 0.8,
            baseY: Math.random() * canvas.height * 0.8,
            rotation: Math.random() * Math.PI * 2,
            scale: 0.5 + Math.random() * 1.5,
            particles: [],
            pulsePhase: Math.random() * Math.PI * 2,
            asymmetry: Math.random() * 0.5 + 0.5
        };

        // Create particles for this swarm
        const particlesPerSwarm = 80;
        for (let i = 0; i < particlesPerSwarm; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 200;
            const size = Math.random() * 2 + 0.5;
            
            swarm.particles.push({
                angle: angle,
                radius: radius,
                size: size,
                brightness: Math.random() * 0.5 + 0.3,
                x: 0,
                y: 0,
                offsetX: (Math.random() - 0.5) * 100,
                offsetY: (Math.random() - 0.5) * 100
            });
        }

        swarms.push(swarm);
    }
}

initUltron();

// Draw Ultron effect
function drawUltron() {
    // Clear canvas with very slight trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time += 0.3;

    // Draw each swarm
    swarms.forEach((swarm, swarmIndex) => {
        // Asymmetrical movement - swarms move chaotically (slowed down)
        const chaosX = Math.sin(time * 0.005 + swarmIndex) * 300 + 
                      Math.sin(time * 0.0015 + swarmIndex * 2) * 200;
        const chaosY = Math.cos(time * 0.006 + swarmIndex * 1.5) * 300 + 
                      Math.cos(time * 0.002 + swarmIndex * 3) * 250;

        swarm.centerX = swarm.baseX + chaosX;
        swarm.centerY = swarm.baseY + chaosY;

        // Chaotic rotation
        swarm.rotation += (Math.random() - 0.5) * 0.1 + 0.01;
        swarm.pulsePhase += 0.02;

        // Draw particles
        swarm.particles.forEach(particle => {
            // Chaotic movement within swarm
            const particleNoise = Math.sin(time * 0.02 + particle.angle) * particle.radius * 0.3;
            const radiusPulse = particle.radius * (0.7 + Math.sin(swarm.pulsePhase + particle.angle) * 0.3);
            
            // Asymmetrical offset
            const offsetMultiplier = Math.sin(time * 0.01 + swarmIndex) * swarm.asymmetry;
            const effectiveX = swarm.centerX + 
                              Math.cos(particle.angle + swarm.rotation) * radiusPulse + 
                              particle.offsetX * offsetMultiplier;
            const effectiveY = swarm.centerY + 
                              Math.sin(particle.angle + swarm.rotation) * radiusPulse + 
                              particle.offsetY * offsetMultiplier;

            particle.x = effectiveX;
            particle.y = effectiveY;

            // Size and brightness vary
            const sizeFactor = 0.7 + audioReactivity * 0.6;
            const brightnessFactor = particle.brightness * (0.5 + Math.sin(time * 0.03 + particle.angle) * 0.5);
            const finalBrightness = brightnessFactor * audioReactivity;

            ctx.fillStyle = `rgba(255, 255, 255, ${finalBrightness})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * sizeFactor, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw connecting lines within swarm for coherence
        ctx.strokeStyle = `rgba(255, 255, 255, 0.08)`;
        ctx.lineWidth = 0.5;

        for (let i = 0; i < Math.min(swarm.particles.length, 20); i++) {
            const particle1 = swarm.particles[i];
            const particle2 = swarm.particles[(i + 1) % swarm.particles.length];

            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
        }
    });

    // Draw network connections between swarms - broken network effect
    ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
    ctx.lineWidth = 1;

    for (let i = 0; i < swarms.length; i++) {
        for (let j = i + 1; j < swarms.length; j++) {
            const swarm1 = swarms[i];
            const swarm2 = swarms[j];

            // Calculate distance between swarm centers
            const dx = swarm2.centerX - swarm1.centerX;
            const dy = swarm2.centerY - swarm1.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only draw if relatively close
            if (distance < 800) {
                // Broken network effect - lines flicker and distort
                const flickerAmount = Math.sin(time * 0.05 + i * j) * 20;
                const distortionX = Math.cos(time * 0.02 + i) * 15;
                const distortionY = Math.sin(time * 0.025 + j) * 15;

                // Connection opacity based on distance and audio
                const connectionAlpha = (1 - distance / 800) * audioReactivity * 0.2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${connectionAlpha})`;

                // Draw main connection line
                ctx.beginPath();
                ctx.moveTo(swarm1.centerX, swarm1.centerY);
                ctx.lineTo(swarm2.centerX + distortionX, swarm2.centerY + distortionY);
                ctx.stroke();

                // Draw additional broken/damaged segments
                if (Math.random() > 0.7) {
                    const midX = (swarm1.centerX + swarm2.centerX) / 2;
                    const midY = (swarm1.centerY + swarm2.centerY) / 2;
                    
                    ctx.strokeStyle = `rgba(255, 255, 255, ${connectionAlpha * 0.6})`;
                    ctx.setLineDash([5, 5]);
                    
                    ctx.beginPath();
                    ctx.moveTo(swarm1.centerX, swarm1.centerY);
                    ctx.lineTo(midX + flickerAmount, midY + flickerAmount);
                    ctx.stroke();
                    
                    ctx.setLineDash([]);
                }
            }
        }
    }

    // Add chaotic glow pulses at random locations
    for (let i = 0; i < 3; i++) {
        const glowX = Math.sin(time * 0.015 + i * 2) * canvas.width * 0.4 + canvas.width * 0.5;
        const glowY = Math.cos(time * 0.018 + i * 2.5) * canvas.height * 0.4 + canvas.height * 0.5;
        const glowSize = 100 + Math.sin(time * 0.02 + i) * 50;
        const glowBrightness = audioReactivity * 0.15;

        const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowSize);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${glowBrightness * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(glowX - glowSize, glowY - glowSize, glowSize * 2, glowSize * 2);
    }

    requestAnimationFrame(drawUltron);
}

drawUltron();

// ============================
// GLOBE NETWORK ANIMATION
// ============================

const globeCanvas = document.getElementById('globeNetworkCanvas');
let globeCtx = null;
let globeAnimationId = null;

if (globeCanvas) {
    globeCtx = globeCanvas.getContext('2d');
    
    // Set canvas resolution
    const resizeGlobeCanvas = () => {
        const rect = globeCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        globeCanvas.width = rect.width * dpr;
        globeCanvas.height = rect.height * dpr;
        globeCtx.scale(dpr, dpr);
    };
    
    resizeGlobeCanvas();
    window.addEventListener('resize', resizeGlobeCanvas);
    
    // Globe parameters
    const globeState = {
        nodes: [],
        branches: [],
        time: 0,
        rotationX: 0.4,
        rotationY: 0.5,
        rotationZ: 0.2,
        velocityX: 0.0005,
        velocityY: 0.001,
        velocityZ: 0.0003,
        noiseOffsets: { x: 0, y: 0, z: 0 }
    };
    
    // Perlin-like noise function for unpredictable movement
    function noise(seed) {
        return Math.sin(seed) * 0.5 + 0.5;
    }
    
    // Initialize nodes in a sphere
    function initGlobeNodes() {
        globeState.nodes = [];
        globeState.branches = [];
        
        // Reduce node count on mobile for better performance
        const numNodes = isMobile ? 25 : 40;
        const sphereRadius = 60;
        
        // Create nodes arranged in a sphere
        for (let i = 0; i < numNodes; i++) {
            const phi = Math.acos(-1 + (2 * i) / numNodes);
            const theta = Math.sqrt(numNodes * Math.PI) * phi;
            
            const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
            const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
            const z = sphereRadius * Math.cos(phi);
            
            const node = {
                x: x,
                y: y,
                z: z,
                originalX: x,
                originalY: y,
                originalZ: z,
                brightness: Math.random() * 0.5 + 0.5,
                size: Math.random() * 1.5 + 1,
                noisePhase: Math.random() * Math.PI * 2,
                branchProbability: 0.15
            };
            
            globeState.nodes.push(node);
        }
        
        // Create branching connections (reduce on mobile)
        globeState.nodes.forEach((node, idx) => {
            if (Math.random() < (isMobile ? 0.2 : 0.3)) {
                const branchCount = Math.floor(Math.random() * (isMobile ? 2 : 3)) + 1;
                for (let b = 0; b < branchCount; b++) {
                    globeState.branches.push({
                        fromNode: idx,
                        angle: Math.random() * Math.PI * 2,
                        length: 40 + Math.random() * 60,
                        life: 1,
                        maxLife: 1,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }
        });
    }
    
    // 3D rotation matrix
    function rotate3D(point, rx, ry, rz) {
        let x = point.x, y = point.y, z = point.z;
        
        // Rotation around X axis
        let y1 = y * Math.cos(rx) - z * Math.sin(rx);
        let z1 = y * Math.sin(rx) + z * Math.cos(rx);
        
        // Rotation around Y axis
        let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
        let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
        
        // Rotation around Z axis
        let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
        let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
        
        return { x: x3, y: y3, z: z2 };
    }
    
    // Project 3D to 2D
    function project(point, width, height) {
        const scale = 300 / (point.z + 120);
        return {
            x: width / 2 + point.x * scale,
            y: height / 2 + point.y * scale,
            z: point.z,
            scale: scale
        };
    }
    
    function drawGlobeNetwork() {
        const width = globeCanvas.width / (window.devicePixelRatio || 1);
        const height = globeCanvas.height / (window.devicePixelRatio || 1);
        
        // Clear canvas
        globeCtx.fillStyle = 'transparent';
        globeCtx.clearRect(0, 0, width, height);
        
        // Update rotation angles with unpredictable noise
        globeState.time += 0.005;
        
        // Add noise-based velocity modulation
        globeState.noiseOffsets.x += 0.02;
        globeState.noiseOffsets.y += 0.015;
        globeState.noiseOffsets.z += 0.018;
        
        const noiseFactor = 0.8;
        const nX = noise(globeState.noiseOffsets.x) - 0.5;
        const nY = noise(globeState.noiseOffsets.y) - 0.5;
        const nZ = noise(globeState.noiseOffsets.z) - 0.5;
        
        globeState.rotationX += 0.0005 + nX * noiseFactor * 0.0003;
        globeState.rotationY += 0.001 + nY * noiseFactor * 0.0004;
        globeState.rotationZ += 0.0003 + nZ * noiseFactor * 0.0002;
        
        // Rotate and project all nodes
        const projectedNodes = [];
        
        globeState.nodes.forEach((node, idx) => {
            // Add oscillating offset to nodes based on their phase
            const offsetMagnitude = 15 * Math.sin(globeState.time + node.noisePhase);
            const offsetAngle = globeState.time + node.noisePhase;
            
            const offsetX = Math.cos(offsetAngle) * offsetMagnitude;
            const offsetY = Math.sin(offsetAngle) * offsetMagnitude;
            const offsetZ = Math.cos(offsetAngle + 1) * offsetMagnitude * 0.5;
            
            const oscillatingNode = {
                x: node.originalX + offsetX,
                y: node.originalY + offsetY,
                z: node.originalZ + offsetZ
            };
            
            const rotated = rotate3D(oscillatingNode, globeState.rotationX, globeState.rotationY, globeState.rotationZ);
            const projected = project(rotated, width, height);
            
            projectedNodes.push({
                ...node,
                ...projected,
                rotated: rotated,
                idx: idx
            });
        });
        
        // Sort by depth (painter's algorithm)
        projectedNodes.sort((a, b) => a.z - b.z);
        
        // Draw branching connections
        globeState.branches.forEach((branch, bIdx) => {
            const fromNode = projectedNodes[branch.fromNode];
            if (!fromNode || fromNode.z < -90) return;
            
            // Animate branch length and opacity based on life
            const branchLength = branch.length * (0.3 + Math.sin(globeState.time * 2 + branch.phase) * 0.7);
            const branchAngle = branch.angle + Math.sin(globeState.time + bIdx) * 0.5;
            
            // Branch endpoint
            const endX = fromNode.x + Math.cos(branchAngle) * branchLength;
            const endY = fromNode.y + Math.sin(branchAngle) * branchLength;
            
            // Draw branch line with glow
            const branchAlpha = 0.3 * (0.5 + Math.sin(globeState.time + bIdx * 0.3) * 0.5);
            globeCtx.strokeStyle = `rgba(180, 220, 255, ${branchAlpha})`;
            globeCtx.lineWidth = 1.5;
            
            globeCtx.beginPath();
            globeCtx.moveTo(fromNode.x, fromNode.y);
            globeCtx.lineTo(endX, endY);
            globeCtx.stroke();
            
            // Draw branch endpoint
            const endPointAlpha = 0.6 * (0.4 + Math.sin(globeState.time * 1.5 + bIdx) * 0.6);
            globeCtx.fillStyle = `rgba(200, 230, 255, ${endPointAlpha})`;
            globeCtx.beginPath();
            globeCtx.arc(endX, endY, 2, 0, Math.PI * 2);
            globeCtx.fill();
            
            // Occasionally create sub-branches from branch endpoints
            if (Math.random() < 0.05 && globeState.branches.length < 50) {
                const subBranchAngle = branchAngle + (Math.random() - 0.5) * Math.PI;
                const newBranch = {
                    fromNode: branch.fromNode,
                    angle: subBranchAngle,
                    length: branchLength * 0.6,
                    life: 1,
                    maxLife: 1,
                    phase: Math.random() * Math.PI * 2
                };
                // Don't add too many branches
                if (Math.random() < 0.3) {
                    globeState.branches.push(newBranch);
                }
            }
        });
        
        // Draw main network connections between nearby nodes
        globeCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        globeCtx.lineWidth = 0.8;
        
        for (let i = 0; i < projectedNodes.length; i++) {
            for (let j = i + 1; j < projectedNodes.length; j++) {
                const node1 = projectedNodes[i];
                const node2 = projectedNodes[j];
                
                const dx = node2.rotated.x - node1.rotated.x;
                const dy = node2.rotated.y - node1.rotated.y;
                const dz = node2.rotated.z - node1.rotated.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // Only connect nearby nodes
                if (dist < 100) {
                    const alpha = (1 - dist / 100) * 0.25;
                    globeCtx.strokeStyle = `rgba(200, 200, 220, ${alpha})`;
                    
                    globeCtx.beginPath();
                    globeCtx.moveTo(node1.x, node1.y);
                    globeCtx.lineTo(node2.x, node2.y);
                    globeCtx.stroke();
                }
            }
        }
        
        // Draw nodes
        projectedNodes.forEach((node, nodeIdx) => {
            if (node.z > -90) {
                const brightness = node.brightness * (0.5 + Math.sin(globeState.time + node.brightness) * 0.5);
                const size = node.size * Math.max(0.3, node.scale);
                
                // Glow effect
                const gradient = globeCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 2);
                gradient.addColorStop(0, `rgba(200, 200, 255, ${brightness * 0.4})`);
                gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
                
                globeCtx.fillStyle = gradient;
                globeCtx.fillRect(node.x - size * 2, node.y - size * 2, size * 4, node.y + size * 4);
                
                // Core node
                globeCtx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                globeCtx.beginPath();
                globeCtx.arc(node.x, node.y, size, 0, Math.PI * 2);
                globeCtx.fill();
                
                // Occasional bright pulses from nodes
                if (Math.random() < 0.08) {
                    const pulseSize = size + 3 + Math.random() * 2;
                    globeCtx.strokeStyle = `rgba(255, 255, 255, ${0.2 * brightness})`;
                    globeCtx.lineWidth = 1;
                    globeCtx.beginPath();
                    globeCtx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                    globeCtx.stroke();
                }
            }
        });
        
        // Draw a subtle purple accent sphere outline inside
        const centerX = width / 2;
        const centerY = height / 2;
        const sphereOutlineSize = 70 + Math.sin(globeState.time * 0.5) * 5;
        
        const gradient = globeCtx.createRadialGradient(centerX, centerY, sphereOutlineSize - 5, centerX, centerY, sphereOutlineSize + 5);
        gradient.addColorStop(0, 'rgba(180, 100, 220, 0)');
        gradient.addColorStop(0.5, 'rgba(180, 100, 220, 0.15)');
        gradient.addColorStop(1, 'rgba(180, 100, 220, 0)');
        
        globeCtx.strokeStyle = gradient;
        globeCtx.lineWidth = 2;
        globeCtx.beginPath();
        globeCtx.arc(centerX, centerY, sphereOutlineSize, 0, Math.PI * 2);
        globeCtx.stroke();
        
        globeAnimationId = requestAnimationFrame(drawGlobeNetwork);
    }
    
    initGlobeNodes();
    drawGlobeNetwork();
}

// ============================
// SMOOTH NAVIGATION & ACTIVE LINK
// ============================

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================
// HAMBURGER MENU
// ============================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ============================
// CONTACT FORM - EMAIL BACKEND
// ============================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const data = {
            from_name: contactForm.querySelector('input[name="from_name"]').value,
            from_email: contactForm.querySelector('input[name="from_email"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        // Show loading state
        const button = contactForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '📤 Sending...';
        button.disabled = true;

        // Send email using formspree (free service)
        fetch('https://formspree.io/f/xqawkbzr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.from_name,
                email: data.from_email,
                message: data.message
            })
        })
        .then((response) => {
            if (response.ok) {
                console.log('Email sent successfully');
                
                // Reset form
                contactForm.reset();
                
                // Show success feedback
                button.textContent = '✓ Message Sent!';
                button.style.background = 'linear-gradient(135deg, #00d4ff, #00d4ff)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    button.disabled = false;
                }, 3000);
            } else {
                throw new Error('Email delivery failed');
            }
        })
        .catch((error) => {
            console.error('Failed to send email:', error);
            
            // Show error feedback
            button.textContent = '✗ Failed to Send';
            button.style.background = 'linear-gradient(135deg, #ff4444, #ff4444)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        });
    });
}

// ============================
// SCROLL ANIMATIONS
// ============================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and elements
document.querySelectorAll('.project-card, .skill-category, .stat, .contact-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================
// PARALLAX EFFECT
// ============================

// Detect if device is mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Parallax effect for globe canvas (minor mouse interaction) - disabled on mobile
const globeCanvasElement = document.getElementById('globeNetworkCanvas');

if (!isMobile && globeCanvasElement && globeCtx) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 5;
        const y = (e.clientY / window.innerHeight) * 5;
        globeCanvasElement.style.transform = `translateX(calc(${x}px)) translateY(calc(${y}px))`;
    });
}

// ============================
// SMOOTH SCROLL FOR BUTTONS
// ============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================
// NAVBAR SCROLL EFFECT
// ============================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(255, 255, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================
// TYPING ANIMATION (Optional Enhancement)
// ============================

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let index = 0;

    const typeText = () => {
        if (index < text.length) {
            heroTitle.textContent += text[index];
            index++;
            setTimeout(typeText, 30);
        }
    };

    // Start typing animation when page loads
    window.addEventListener('load', () => {
        setTimeout(typeText, 500);
    });
}

// ============================
// PAGE LOAD ANIMATION
// ============================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in';
}, 100);

// ============================
// SCROLL TO TOP BUTTON
// ============================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
document.body.appendChild(scrollTopBtn);

const scrollTopStyle = document.createElement('style');
scrollTopStyle.textContent = `
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #ffffff, #cccccc);
        border: none;
        border-radius: 50%;
        color: #000000;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        transition: all 0.3s ease;
        font-weight: bold;
    }

    .scroll-top-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
    }

    .scroll-top-btn.show {
        display: flex;
    }
`;
document.head.appendChild(scrollTopStyle);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
