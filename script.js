const canvas = document.getElementById('neuralNet');
const ctx = canvas.getContext('2d');
let neurons = [];
let connections = [];
const layers = [5, 5]; // Left side: 5 neurons, Right side: 5 neurons
let gradientOffset = 0; 

function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    init();
}
window.addEventListener('resize', resize);

class Neuron {
    constructor(layer, index, totalInLayer) {
        this.layer = layer;
        this.index = index;
        
        const paddingW = window.innerWidth * 0.05;
        const paddingH = window.innerHeight * 0.01; 

        const availW = window.innerWidth - (paddingW * 2);
        const availH = window.innerHeight - (paddingH * 2);

        this.baseX = paddingW + (layer * (availW / (layers.length - 1)));
        this.baseY = paddingH + (availH / (totalInLayer + 1)) * (index + 1);
        
        this.offsetX = Math.random() * Math.PI * 2;
        this.offsetY = Math.random() * Math.PI * 2;
        
        this.range = 45; 
        this.speed = 0.0007 + Math.random() * 0.0005;
    }
    
    update() {
        this.offsetX += this.speed;
        this.offsetY += this.speed;
        this.x = this.baseX + Math.sin(this.offsetX) * this.range;
        this.y = this.baseY + Math.cos(this.offsetY) * this.range;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#a78bfa'; 
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8b5cf6';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function init() {
    neurons = [];
    connections = [];
    
    layers.forEach((count, lIndex) => {
        for (let i = 0; i < count; i++) {
            neurons.push(new Neuron(lIndex, i, count));
        }
    });

    // Initialize all neuron positions before creating connections
    neurons.forEach(n => {
        n.x = n.baseX;
        n.y = n.baseY;
    });

    neurons.forEach(n1 => {
        const nextLayerNeurons = neurons.filter(n2 => n2.layer === n1.layer + 1);
        
        if (nextLayerNeurons.length > 0) {
            // Randomly select 5 neurons to create a web-like pattern with overlapping lines
            const shuffled = [...nextLayerNeurons].sort(() => Math.random() - 0.5);
            const targets = shuffled.slice(0, Math.min(5, shuffled.length)); 
            
            targets.forEach(n2 => {
                connections.push([n1, n2]);
            });
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Update gradient offset for slow color transitions
    gradientOffset += 0.0003;
    
    connections.forEach(([n1, n2], index) => {
        // Each line gets its own random offset for varied color transitions
        const lineOffset = (gradientOffset + index * 0.1) % 1;
        
        // Slowly transition between purple and cyan (more similar colors)
        const colorMix = (Math.sin(lineOffset * Math.PI * 2) + 1) / 2; // Oscillates between 0 and 1
        
        // Interpolate between more similar purple and cyan shades
        // Purple: (139, 92, 246) -> lighter purple (120, 100, 220)
        // Cyan: (34, 211, 238) -> more purple-ish cyan (100, 180, 230)
        const r = Math.floor(120 + (100 - 120) * colorMix);
        const g = Math.floor(100 + (180 - 100) * colorMix);
        const b = Math.floor(220 + (230 - 220) * colorMix);
        
        const opacity = 0.3 + colorMix * 0.3;
        
        ctx.beginPath();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
    });

    neurons.forEach(n => {
        n.update();
        n.draw();
    });
    
    requestAnimationFrame(animate);
}

resize();
animate();