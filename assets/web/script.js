// Florence Nightingale's Coxcomb Diagram - 3D Visualization
class FlorenceNightingale3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.bars = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isRotating = false;
        this.rotationSpeed = 0.005;
        this.currentFilter = 'all';
        this.wireframeMode = false;
        this.font = null;
        
        // Arrow key controls for orbit center
        this.keys = {};
        
        // Color scheme as requested
        this.colors = {
            disease: 0x20b2aa,  // Blue-green
            wounds: 0xdc143c,   // Red
            other: 0x2c2c2c,   // Black
            total: 0xffa500    // Orange
        };
        
        // Load real data from CSV
        this.data = [];
        
        this.loadDataAndInit();
    }
    
    async loadDataAndInit() {
        this.data = await this.loadRealData();
        await this.loadFont();
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    async loadFont() {
        return new Promise((resolve) => {
            const loader = new THREE.FontLoader();
            // Use a simple built-in font for text rendering
            const fontData = {
                "glyphs": {},
                "familyName": "Arial",
                "ascender": 896,
                "descender": -128,
                "underlinePosition": -100,
                "underlineThickness": 50,
                "boundingBox": {
                    "xMin": -100,
                    "yMin": -100,
                    "xMax": 100,
                    "yMax": 100
                },
                "resolution": 1000,
                "original_font_information": {}
            };
            
            // Create a simple font for basic text rendering
            this.font = new THREE.Font(fontData);
            resolve();
        });
    }
    
    createText(text, size = 0.5, color = 0xffffff) {
        // Create simple text using basic geometry since FontLoader might not work in all environments
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // No background - transparent
        context.clearRect(0, 0, 256, 64);
        
        // Convert hex color to RGB for canvas fillStyle
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 1.0
        });
        
        const geometry = new THREE.PlaneGeometry(size * 4, size);
        const textMesh = new THREE.Mesh(geometry, material);
        
        return textMesh;
    }
    
    handleArrowKeyMovement() {
        const moveSpeed = 0.5;
        const target = this.controls.target;
        
        // Get camera direction vectors
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        
        this.camera.getWorldDirection(forward);
        right.crossVectors(forward, this.camera.up).normalize();
        up.copy(this.camera.up);
        
        // Arrow key movements - up/down for vertical, left/right for horizontal
        if (this.keys['ArrowUp']) {
            target.add(up.clone().multiplyScalar(moveSpeed)); // Move orbit center up
        }
        if (this.keys['ArrowDown']) {
            target.add(up.clone().multiplyScalar(-moveSpeed)); // Move orbit center down
        }
        if (this.keys['ArrowLeft']) {
            target.add(right.clone().multiplyScalar(-moveSpeed)); // Move orbit center left
        }
        if (this.keys['ArrowRight']) {
            target.add(right.clone().multiplyScalar(moveSpeed)); // Move orbit center right
        }
        
        // Update controls target
        this.controls.target.copy(target);
    }
    
    async loadRealData() {
        try {
            const response = await fetch('nightingale.csv');
            const csvText = await response.text();
            const lines = csvText.split('\n');
            
            // Skip header row and last summary row
            const dataLines = lines.slice(1, -1);
            
            const data = [];
            
            dataLines.forEach((line, index) => {
                if (line.trim()) {
                    const columns = line.split(',');
                    const month = columns[2]; // Month column
                    const year = columns[3]; // Year column
                    const disease = parseInt(columns[5]) || 0; // Disease column
                    const wounds = parseInt(columns[6]) || 0; // Wounds column
                    const other = parseInt(columns[7]) || 0; // Other column
                    
                    const total = disease + wounds + other;
                    data.push({
                        month: `${month} ${year}`,
                        monthIndex: index,
                        deaths: {
                            disease: disease,
                            wounds: wounds,
                            other: other,
                            total: total
                        }
                    });
                }
            });
            
            return data;
        } catch (error) {
            console.error('Error loading CSV data:', error);
            // Fallback to sample data if CSV loading fails
            return this.generateSampleData();
        }
    }
    
    generateSampleData() {
        // Fallback sample data if CSV loading fails
        const months = [
            'Apr 1854', 'May 1854', 'Jun 1854', 'Jul 1854', 'Aug 1854', 'Sep 1854',
            'Oct 1854', 'Nov 1854', 'Dec 1854', 'Jan 1855', 'Feb 1855', 'Mar 1855',
            'Apr 1855', 'May 1855', 'Jun 1855', 'Jul 1855', 'Aug 1855', 'Sep 1855',
            'Oct 1855', 'Nov 1855', 'Dec 1855', 'Jan 1856', 'Feb 1856', 'Mar 1856'
        ];
        
        const data = [];
        
        months.forEach((month, monthIndex) => {
            // Simulate realistic death counts based on historical patterns
            const diseaseDeaths = Math.floor(Math.random() * 2000) + 500;
            const woundDeaths = Math.floor(Math.random() * 200) + 50;
            const otherDeaths = Math.floor(Math.random() * 100) + 20;
            
            const totalDeaths = diseaseDeaths + woundDeaths + otherDeaths;
            data.push({
                month: month,
                monthIndex: monthIndex,
                deaths: {
                    disease: diseaseDeaths,
                    wounds: woundDeaths,
                    other: otherDeaths,
                    total: totalDeaths
                }
            });
        });
        
        return data;
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(30, 20, 30);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.panSpeed = 1.0;
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.0;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 100;
        this.controls.screenSpacePanning = false;
        this.controls.target.set(0, 0, 0);
        
        // Add lighting
        this.setupLighting();
        
        // Create the 3D chart
        this.createChart();
        
        // Hide loading
        document.getElementById('loading').style.display = 'none';
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for better illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(-30, 30, -30);
        this.scene.add(pointLight);
    }
    
    createChart() {
        // Clear existing bars
        this.bars.forEach(bar => {
            this.scene.remove(bar);
        });
        this.bars = [];
        
        const barWidth = 0.8;
        const barDepth = 0.8;
        const spacing = 1.2;
        
        // Create bars for each month
        this.data.forEach((monthData, monthIndex) => {
            const x = monthIndex * spacing - (this.data.length * spacing) / 2;
            
            // Create bars for each death type
            const deathTypes = ['disease', 'wounds', 'other', 'total'];
            deathTypes.forEach((deathType, typeIndex) => {
                const deathCount = monthData.deaths[deathType];
                
                // Don't create bars for zero deaths
                if (deathCount === 0) {
                    return;
                }
                
                // More accurate scaling - find max deaths across all data for proper proportions
                const maxDeaths = Math.max(...this.data.flatMap(d => Object.values(d.deaths)));
                const barHeight = Math.max((deathCount / maxDeaths) * 20, 0.1); // Scale to max 20 units height
                
                const geometry = new THREE.BoxGeometry(barWidth, barHeight, barDepth);
                const material = new THREE.MeshLambertMaterial({ 
                    color: this.colors[deathType],
                    transparent: true,
                    opacity: deathType === 'total' ? 0.3 : 0.8 // Make total bars more transparent
                });
                
                const bar = new THREE.Mesh(geometry, material);
                
                // Position total bars furthest from viewer (behind all other bars)
                let zPosition;
                if (deathType === 'total') {
                    zPosition = -3.6; // Furthest back
                } else {
                    zPosition = typeIndex * spacing - spacing;
                }
                
                bar.position.set(x, barHeight / 2, zPosition);
                bar.castShadow = true;
                bar.receiveShadow = true;
                
                // Store metadata
                bar.userData = {
                    month: monthData.month,
                    deathType: deathType,
                    deathCount: deathCount,
                    monthIndex: monthIndex,
                    typeIndex: typeIndex
                };
                
                this.scene.add(bar);
                this.bars.push(bar);
            });
        });
        
        // Add axes labels
        this.addAxesLabels();
        
        // Add axis lines
        this.addAxisLines();
    }
    
    addAxesLabels() {
        // X-axis label (Time)
        const xAxisLabel = this.createText('TIME', 1, 0x000000);
        xAxisLabel.position.set(0, 0, 4);
        xAxisLabel.rotation.x = -Math.PI / 2;
        this.scene.add(xAxisLabel);
        
        // Y-axis label (Death Count)
        const yAxisLabel = this.createText('DEATH COUNT', 1, 0x000000);
        yAxisLabel.position.set(-18, 10, 1.6);
        yAxisLabel.rotation.z = Math.PI / 2;
        this.scene.add(yAxisLabel);
        
        // Z-axis label (Disease Type)
        const zAxisLabel = this.createText('DISEASE TYPE', 1, 0x000000);
        zAxisLabel.position.set(-18, 0, 0);
        zAxisLabel.rotation.x = -Math.PI / 2;
        zAxisLabel.rotation.z = Math.PI / 2;
        this.scene.add(zAxisLabel);
        
        // Add month labels
        this.data.forEach((monthData, index) => {
            if (index % 2 === 0) { // Show every 2nd month to avoid clutter
                const monthLabel = this.createText(monthData.month, 0.6, 0x000000);
                monthLabel.position.set(
                    index * 1.2 - (this.data.length * 1.2) / 2,
                    0,
                    3
                );
                monthLabel.rotation.x = -Math.PI / 2;
                this.scene.add(monthLabel);
            }
        });
        
        // Add disease type labels
        const diseaseTypes = ['Disease', 'Wounds', 'Other'];
        diseaseTypes.forEach((type, index) => {
            const typeLabel = this.createText(type, 0.5, this.colors[type.toLowerCase()]);
            typeLabel.position.set(
                -16,
                0,
                index * 1.2 - 1.2
            );
            typeLabel.rotation.x = -Math.PI / 2;
            typeLabel.rotation.z = Math.PI / 2;
            this.scene.add(typeLabel);
        });
        
        // Add total deaths label (positioned furthest back)
        const totalLabel = this.createText('Total', 0.5, this.colors['total']);
        totalLabel.position.set(
            -16,
            0,
            -3.6
        );
        totalLabel.rotation.x = -Math.PI / 2;
        totalLabel.rotation.z = Math.PI / 2;
        this.scene.add(totalLabel);
        
        // Add death count labels for y-axis (every 500 counts)
        const maxDeaths = Math.max(...this.data.flatMap(d => Object.values(d.deaths)));
        const chartWidth = this.data.length * 1.2;
        const maxLabelCount = Math.floor(maxDeaths / 500) * 500; // Round up to nearest 500
        
        for (let count = 0; count <= maxLabelCount; count += 500) {
            // Calculate y position: (count / maxDeaths) * 20 (max bar height)
            const yPosition = (count / maxDeaths) * 20;
            
            // Create label
            const countLabel = this.createText(count.toString(), 0.4, 0x000000);
            countLabel.position.set(
                -chartWidth/2 - 0.6, // Slightly to the left of the y-axis line
                yPosition,
                1.6 // Same z as the y-axis line
            );
            this.scene.add(countLabel);
        }
    }
    
    
    addAxisLines() {
        const maxDeaths = Math.max(...this.data.flatMap(d => Object.values(d.deaths)));
        const chartWidth = this.data.length * 1.2;
        const chartDepth = 3 * 1.2;
        
        // X-axis line (Time)
        const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-chartWidth/2-0.4, 0, 1.6),
            new THREE.Vector3(chartWidth/2, 0, 1.6)
        ]);
        const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
        const xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
        this.scene.add(xAxisLine);
        
        // Y-axis line (Death Count)
        const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-chartWidth/2-0.4, 0, 1.6),
            new THREE.Vector3(-chartWidth/2-0.4, 20, 1.6)
        ]);
        const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
        const yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
        this.scene.add(yAxisLine);
        
        // Z-axis line (Disease Type)
        const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-chartWidth/2-0.4, 0, 1.6),
            new THREE.Vector3(-chartWidth/2-0.4, 0, -10)
        ]);
        const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
        const zAxisLine = new THREE.Line(zAxisGeometry, zAxisMaterial);
        this.scene.add(zAxisLine);
    }
    
    setupEventListeners() {
        // Arrow key controls for orbit center
        // document.addEventListener('keydown', (event) => {
        //     this.keys[event.code] = true;
        // });
        
        // document.addEventListener('keyup', (event) => {
        //     this.keys[event.code] = false;
        // });
        
        // Mouse move for hover effects - use the canvas element instead of window
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.handleMouseMove();
        });
        
        // Mouse leave to clear hover effects
        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.bars.forEach(bar => {
                bar.material.emissive.setHex(0x000000);
            });
            const infoPanel = document.getElementById('info-panel');
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
        
        // Toggle controls panel
        document.getElementById('toggleControls').addEventListener('click', () => {
            const controlsPanel = document.getElementById('controls');
            const toggleButton = document.getElementById('toggleControls');
            
            if (controlsPanel.classList.contains('minimized')) {
                controlsPanel.classList.remove('minimized');
                toggleButton.textContent = '−';
            } else {
                controlsPanel.classList.add('minimized');
                toggleButton.textContent = '+';
            }
        });
        
        // Control event listeners
        document.getElementById('rotationSpeed').addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
        });
        
        document.getElementById('zoomLevel').addEventListener('input', (e) => {
            const zoom = parseFloat(e.target.value);
            const currentDistance = this.camera.position.distanceTo(this.controls.target);
            const newDistance = currentDistance / zoom;
            const direction = this.camera.position.clone().sub(this.controls.target).normalize();
            this.camera.position.copy(this.controls.target).add(direction.multiplyScalar(newDistance));
        });
        
        document.getElementById('toggleRotation').addEventListener('click', () => {
            this.isRotating = !this.isRotating;
            const button = document.getElementById('toggleRotation');
            button.textContent = this.isRotating ? 'Pause Rotation' : 'Start Rotation';
        });
        
        document.getElementById('resetView').addEventListener('click', () => {
            this.camera.position.set(30, 20, 30);
            this.controls.reset();
        });
        
        document.getElementById('toggleWireframe').addEventListener('click', () => {
            this.wireframeMode = !this.wireframeMode;
            this.bars.forEach(bar => {
                bar.material.wireframe = this.wireframeMode;
            });
            const button = document.getElementById('toggleWireframe');
            button.textContent = this.wireframeMode ? 'Solid' : 'Wireframe';
        });
        // Filter buttons
        document.getElementById('filterAll').addEventListener('click', () => {
            this.setFilter('all');
        });
        
        document.getElementById('filterDisease').addEventListener('click', () => {
            this.setFilter('disease');
        });
        
        document.getElementById('filterWounds').addEventListener('click', () => {
            this.setFilter('wounds');
        });
        
        document.getElementById('filterOther').addEventListener('click', () => {
            this.setFilter('other');
        });
        
        document.getElementById('filterTotal').addEventListener('click', () => {
            this.setFilter('total');
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update button states
        document.querySelectorAll('[id^="filter"]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');
        
        // Update bar visibility
        this.bars.forEach(bar => {
            if (filter === 'all' || bar.userData.deathType === filter) {
                bar.visible = true;
                // Set appropriate opacity based on bar type
                bar.material.opacity = bar.userData.deathType === 'total' ? 0.3 : 0.8;
            } else {
                bar.visible = false;
            }
        });
    }
    
    handleMouseMove() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Only check visible bars for intersection
        const visibleBars = this.bars.filter(bar => bar.visible);
        const intersects = this.raycaster.intersectObjects(visibleBars);
        
        if (intersects.length > 0) {
            const intersected = intersects[0].object;
            const info = intersected.userData;
            
            // Highlight the bar
            intersected.material.emissive.setHex(0x333333);
            
            // Show info panel
            const infoPanel = document.getElementById('info-panel');
            const infoTitle = document.getElementById('info-title');
            const infoContent = document.getElementById('info-content');
            
            if (infoPanel && infoTitle && infoContent) {
                infoTitle.textContent = `${info.month} - ${info.deathType.charAt(0).toUpperCase() + info.deathType.slice(1)}`;
                infoContent.textContent = `Deaths: ${info.deathCount.toLocaleString()}`;
                infoPanel.style.display = 'block';
            }
        } else {
            // Reset all bars
            this.bars.forEach(bar => {
                bar.material.emissive.setHex(0x000000);
            });
            
            // Hide info panel
            const infoPanel = document.getElementById('info-panel');
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Handle arrow key movement
        // this.handleArrowKeyMovement();
        
        if (this.isRotating) {
            this.scene.rotation.y += this.rotationSpeed;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    // Method to update data (will be used when integrating spreadsheet data)
    updateData(newData) {
        this.data = newData;
        this.createChart();
    }
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new FlorenceNightingale3D();
});
