const canvas = document.getElementById('neuralNet');
const ctx = canvas.getContext('2d');
let neurons = [];
let connections = [];
const layers = [5, 10, 8, 5]; 

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
        
        // Use 5% padding on left/right edges, 5% on top/bottom
        const paddingW = window.innerWidth * 0.05;
        const paddingH = window.innerHeight * 0.05; 

        const availW = window.innerWidth - (paddingW * 2);
        const availH = window.innerHeight - (paddingH * 2);

        // Distribute neurons across the FULL screen width (minus padding)
        this.baseX = paddingW + (layer * (availW / (layers.length - 1)));
        this.baseY = paddingH + (availH / (totalInLayer + 1)) * (index + 1);
        
        this.offsetX = Math.random() * Math.PI * 2;
        this.offsetY = Math.random() * Math.PI * 2;
        
        // Floating range for organic movement
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
    
    // Create Neurons
    layers.forEach((count, lIndex) => {
        for (let i = 0; i < count; i++) {
            neurons.push(new Neuron(lIndex, i, count));
        }
    });

    // Create Connections (Limited to 5 per neuron to avoid clutter)
    neurons.forEach(n1 => {
        const nextLayerNeurons = neurons.filter(n2 => n2.layer === n1.layer + 1);
        
        if (nextLayerNeurons.length > 0) {
            // Connect to up to 5 neurons in the next layer
            const targets = nextLayerNeurons.slice(0, Math.min(5, nextLayerNeurons.length)); 
            
            targets.forEach(n2 => {
                connections.push([n1, n2]);
            });
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw connections first (so they appear behind neurons)
    connections.forEach(([n1, n2]) => {
        const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.4)'); 
        grad.addColorStop(1, 'rgba(34, 211, 238, 0.4)');  
        
        ctx.beginPath();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = grad;
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
    });

    // Draw neurons on top of connections
    neurons.forEach(n => {
        n.update();
        n.draw();
    });
    
    requestAnimationFrame(animate);
}

resize();
animate();