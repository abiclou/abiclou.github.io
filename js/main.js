// Variables globales pour le canvas
let canvas, ctx;
let bikeComponents = {
    frame: null,
    fork: null,
    frontWheel: null,
    rearWheel: null
};
let loadedImages = {};
let forkConfigs = null;
let wheelConfigs = null;
let wheelRotation = 0;
let wheelAnimationId = null;
let hubSound = null;
let lastTickTime = 0;
const TICK_INTERVAL = 100; // Intervalle minimum entre les ticks en millisecondes

// Configuration du vélo (style Bikeologi)
const BIKE_CONFIG = {
    canvas: {
        width: 1000,
        height: 600
    },
    frame: {
        scale: 0.9,
        position: {
            x: 500,  // Centre du canvas
            y: 300   // Centre du canvas
        }
    },
    currentForkIndex: null // Start with no fork selected
};

const COMPONENTS = {
    'frames': [
        {
            'id': 'v10',
            'name': 'Santa Cruz V10 Factory',
            'description': 'Cadre en carbone haut de gamme',
            'price': 4299,
            'image': 'v10_2.png'
        },
        {
            'id': 'dreadnought',
            'name': 'Forbidden Dreadnought',
            'description': 'Cadre polyvalent pour toutes les conditions',
            'price': 4399,
            'image': 'dreadnought.png'
        },
        {
            'id': 'v5',
            'name': 'Commencal Supreme DH V5',
            'description': 'Cadre en aluminium hyper resistant',
            'price': 3200,
            'image': 'v5.png'
        }
    ],
    'forks': [
        {
            'id': '0',
            'name': 'Fox 40 Factory',
            'description': 'Fourche Fox 40 Factory GRIP2 200mm',
            'price': 1849,
            'image': 'fork-1.png'
        },
        {
            'id': '1',
            'name': 'Rockshox Boxxer Ultimate',
            'description': 'Fourche Rockshox Boxxer Ultimate 200mm',
            'price': 2279,
            'image': 'fork-2.png'
        },
        {
            'id': '2',
            'name': 'Rockshox ZEB Ultimate',
            'description': 'Fourche Rockshox ZEB Ultimate 180mm',
            'price': 1249,
            'image': 'fork-3.png'
        }
    ],
    'wheels': [
        {
            'id': 'wheels-0',
            'name': 'Hydra Enduro S Carbon',
            'description': 'Roues Industry Nine Hydra',
            'price': 781.20,
            'image': 'hydra-enduro-s-carbon.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'wheels-1',
            'name': 'DT Swiss XRC 1200',
            'description': 'Roues en carbone DT Swiss XRC 1200 29"',
            'price': 2499.99,
            'image': 'wheels-1.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'wheels-2',
            'name': 'DT Swiss XR 1700',
            'description': 'Roues en aluminium DT Swiss XR 1700 29"',
            'price': 899.99,
            'image': 'wheels-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'wheels-3',
            'name': 'DT Swiss X 1900',
            'description': 'Roues en aluminium DT Swiss X 1900 29"',
            'price': 499.99,
            'image': 'wheels-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'handlebars': [
        {
            'id': 'handlebar-1',
            'name': 'Renthal Fatbar Carbon',
            'description': 'Cintre en carbone Renthal Fatbar 800mm',
            'price': 169.99,
            'image': 'handlebar-1.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'handlebar-2',
            'name': 'Race Face Next R',
            'description': 'Cintre en carbone Race Face Next R 780mm',
            'price': 149.99,
            'image': 'handlebar-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'handlebar-3',
            'name': 'Race Face Aeffect R',
            'description': 'Cintre en aluminium Race Face Aeffect R 780mm',
            'price': 79.99,
            'image': 'handlebar-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'brakes': [
        {
            'id': 'brakes-1',
            'name': 'Shimano XTR M9120',
            'description': 'Freins à disque Shimano XTR M9120 4 pistons',
            'price': 599.99,
            'image': 'brakes-1.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'brakes-2',
            'name': 'SRAM Code RSC',
            'description': 'Freins à disque SRAM Code RSC 4 pistons',
            'price': 499.99,
            'image': 'brakes-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'brakes-3',
            'name': 'Shimano XT M8120',
            'description': 'Freins à disque Shimano XT M8120 4 pistons',
            'price': 349.99,
            'image': 'brakes-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'drivetrains': [
        {
            'id': 'drivetrain-1',
            'name': 'Shimano XTR M9100',
            'description': 'Transmission Shimano XTR M9100 12 vitesses',
            'price': 999.99,
            'image': 'drivetrain-1.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'drivetrain-2',
            'name': 'SRAM XX1 Eagle AXS',
            'description': 'Transmission SRAM XX1 Eagle AXS 12 vitesses',
            'price': 1299.99,
            'image': 'drivetrain-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'drivetrain-3',
            'name': 'Shimano XT M8100',
            'description': 'Transmission Shimano XT M8100 12 vitesses',
            'price': 599.99,
            'image': 'drivetrain-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ]
}


// Charger les configurations des fourches
async function loadForkConfigs() {
    try {
        const response = await fetch('configs/configs.json');
        const data = await response.json();
        forkConfigs = data;  // Stocker toute la configuration
        console.log('Configs loaded:', forkConfigs);
    } catch (error) {
        console.error('Error loading configs:', error);
    }
}

// Function to get the current fork configuration
function getCurrentForkConfig() {
    if (BIKE_CONFIG.currentForkIndex === null || !forkConfigs || !forkConfigs.forks) {
        console.warn('No fork selected or configs not loaded');
        return null;
    }
    const config = forkConfigs.forks[BIKE_CONFIG.currentForkIndex];
    console.log('Current fork config:', config);
    return config;
}

// Initialisation du canvas
function initCanvas() {
    canvas = document.getElementById('bike-canvas');
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        const baseWidth = BIKE_CONFIG.canvas.width;
        const baseHeight = BIKE_CONFIG.canvas.height;
        
        const scale = Math.min(
            rect.width / baseWidth,
            rect.height / baseHeight
        );
        
        canvas.width = baseWidth * window.devicePixelRatio;
        canvas.height = baseHeight * window.devicePixelRatio;
        canvas.style.width = `${baseWidth * scale}px`;
        canvas.style.height = `${baseHeight * scale}px`;
        
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        drawBike();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

// Charger une image
function loadImage(src) {
    return new Promise((resolve, reject) => {
        if (loadedImages[src]) {
            resolve(loadedImages[src]);
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            loadedImages[src] = img;
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

// Dessiner le vélo
function drawBike() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les roues en premier
    if (bikeComponents.frontWheel && bikeComponents.rearWheel) {
        const wheelConfig = getCurrentWheelConfig();
        if (wheelConfig) {
            drawComponent('frontWheel', bikeComponents.frontWheel, wheelConfig);
            drawComponent('rearWheel', bikeComponents.rearWheel, wheelConfig);
        }
    }

    // Dessiner la fourche selon son z-index
    const currentConfig = getCurrentForkConfig();
    if (currentConfig) {
        if (currentConfig.zIndex === 0 && bikeComponents.fork) {
            drawComponent('fork', bikeComponents.fork);
        }
    }
    
    // Dessiner le cadre
    if (bikeComponents.frame) {
        drawComponent('frame', bikeComponents.frame);
    }

    // Dessiner la fourche si z-index > 0
    if (currentConfig) {
        if (currentConfig.zIndex > 0 && bikeComponents.fork) {
            drawComponent('fork', bikeComponents.fork);
        }
    }
}

// Fonction auxiliaire pour dessiner un composant
function drawComponent(type, component, config = null) {
    ctx.save();

    if (type === 'frame') {
        const frameConfig = BIKE_CONFIG.frame;
        const frameWidth = component.width * frameConfig.scale;
        const frameHeight = component.height * frameConfig.scale;
        const frameX = frameConfig.position.x - frameWidth / 2;
        const frameY = frameConfig.position.y - frameHeight / 2;
        
        ctx.drawImage(
            component,
            frameX,
            frameY,
            frameWidth,
            frameHeight
        );

        // Calculate head tube position
        const headTubeX = frameX + (frameWidth * 0.82);
        const headTubeY = frameY + (frameHeight * 0.22);

        if (bikeComponents.fork) {
            const forkConfig = getCurrentForkConfig();
            if (forkConfig) {
                forkConfig.scale = (frameHeight * 0.45) / bikeComponents.fork.height;
                forkConfig.anchor.x = headTubeX;
                forkConfig.anchor.y = headTubeY;
            }
        }
    } else if (type === 'fork') {
        const config = getCurrentForkConfig();
        if (!config) return;

        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;

        const forkWidth = baseWidth * config.dimensions.width;
        const forkHeight = baseHeight * config.dimensions.height;

        ctx.translate(config.anchor.x, config.anchor.y);
        
        const positionScale = 5;
        ctx.translate(
            config.offset.x * positionScale,
            config.offset.y * positionScale
        );

        const angleRad = config.rotation * Math.PI / 180;
        ctx.rotate(angleRad);

        const depthScale = positionScale * config.offset.depth;
        const depthX = Math.sin(angleRad) * depthScale;
        const depthY = Math.cos(angleRad) * depthScale;

        ctx.translate(depthX, depthY);

        // Stocker la position de l'axe de la fourche pour la roue avant
        config.axlePosition = {
            x: config.anchor.x + Math.sin(angleRad) * forkHeight * 0.85,
            y: config.anchor.y + Math.cos(angleRad) * forkHeight * 0.85
        };

        ctx.drawImage(
            component,
            -forkWidth / 2,
            -forkHeight / 2,
            forkWidth,
            forkHeight
        );
    } else if (type === 'frontWheel' || type === 'rearWheel') {
        if (!config) return;
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const wheelWidth = baseWidth * config.dimensions.width;
        const wheelHeight = baseHeight * config.dimensions.height;

        // Obtenir les points d'ancrage
        const frameConfig = getCurrentFrameConfig();
        const forkConfig = getCurrentForkConfig();
        if (!frameConfig || !forkConfig) {
            console.warn('No frame or fork config found');
            return;
        }

        // Position différente pour la roue avant et arrière
        const anchor = type === 'frontWheel' ? 
            forkConfig.axle : 
            frameConfig.wheelAnchors.rear;

        if (!anchor) return;

        // 1. Déplacer au point d'ancrage
        ctx.translate(anchor.x, anchor.y);
        
        // 2. Appliquer la rotation autour du centre de la roue
        ctx.rotate(wheelRotation);

        // 3. Dessiner la roue centrée sur son point d'ancrage
        ctx.drawImage(
            component,
            -wheelWidth / 2,  // Centre horizontal
            -wheelHeight / 2, // Centre vertical
            wheelWidth,
            wheelHeight
        );
    }
    
    ctx.restore();
}

// Function to get the current wheel configuration
function getCurrentWheelConfig() {
    if (!selectedComponents.wheels || !forkConfigs || !forkConfigs.wheels) return null;
    const wheelIndex = parseInt(selectedComponents.wheels.id.split('-')[1]);
    if (isNaN(wheelIndex) || wheelIndex >= forkConfigs.wheels.length) return null;
    return forkConfigs.wheels[wheelIndex];
}

// Function to update the component image
async function updateComponentImage(type, component) {
    if (!component) return;
    
    const imageUrl = `images/${type}/${component.image}`;
    
    console.log('Loading image from URL:', imageUrl); // Debugging log
    
    try {
        const img = await loadImage(imageUrl);
        
        switch(type) {
            case 'frames':
            bikeComponents.frame = img;
                break;
            case 'forks':
            bikeComponents.fork = img;
                break;
            case 'wheels':
                bikeComponents.frontWheel = img;
                bikeComponents.rearWheel = img;
                // Démarrer l'animation des roues quand elles sont chargées
                if (wheelAnimationId === null) {
                    animateWheels();
                }
                break;
        }
        
        updateSummary();
        drawBike();
    } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
        if (type === 'forks') {
            bikeComponents.fork = null;
        }
    }
}

let components = {};
let selectedComponents = {
    frames: null,
    forks: null,
    wheels: null,
    handlebars: null,
    brakes: null,
    drivetrains: null
};

// Charger les composants depuis l'API avec animation de chargement
async function loadComponents() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);
    
    try {
        const configsResponse = await fetch('configs/configs.json');
        forkConfigs = await configsResponse.json();  // Stocker toute la configuration

        components = COMPONENTS;
        
        initializeSelects();
        
        // Animer l'entrée des sections de composants
        const sections = document.querySelectorAll('.component-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animate-in');
            }, index * 100);
        });

        // Do not set initial fork configuration here
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showNotification('Erreur de chargement', 'error');
    } finally {
        loader.remove();
    }
}

// Notification système
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialiser les menus déroulants avec animation
function initializeSelects() {
    const selects = {
        frames: document.getElementById('frame-select'),
        forks: document.getElementById('fork-select'),
        wheels: document.getElementById('wheels-select'),
        handlebars: document.getElementById('handlebars-select'),
        brakes: document.getElementById('brakes-select'),
        drivetrains: document.getElementById('drivetrains-select')
    };

    for (const [type, select] of Object.entries(selects)) {
        if (components[type]) {
            populateSelect(select, components[type], `Choisir ${type}`);
            select.classList.add('initialized');
        }
    }
}

// Remplir un menu déroulant avec des options
function populateSelect(select, items, defaultText) {
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    select.appendChild(defaultOption);

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - ${item.price}€`;
        select.appendChild(option);
    });
}

// Mettre à jour la sélection et le résumé avec animation
function updateSelection(event, type) {
    const selectedId = event.target.value;
    if (!selectedId) {
        selectedComponents[type] = null;
        if (type === 'wheels') {
            stopWheelAnimation();
        }
        return;
    }

    const component = components[type].find(c => c.id === selectedId);
    if (component) {
        selectedComponents[type] = component;
        updateComponentImage(type, component);
        updateSummary();
    }
}

// Mettre à jour le résumé et le prix total avec animation
function updateSummary() {
    const summary = document.getElementById('summary');
    if (!summary) return;

    let totalPrice = 0;
    let summaryHTML = '<h3>Résumé de votre configuration</h3><ul>';

    // Ajouter le cadre
    if (selectedComponents.frames) {
        summaryHTML += `<li>${selectedComponents.frames.name} - ${selectedComponents.frames.price}€</li>`;
        totalPrice += selectedComponents.frames.price;
    }

    // Ajouter la fourche
    if (selectedComponents.forks) {
        summaryHTML += `<li>${selectedComponents.forks.name} - ${selectedComponents.forks.price}€</li>`;
        totalPrice += selectedComponents.forks.price;
    }

    // Ajouter les roues
    if (selectedComponents.wheels) {
        summaryHTML += `<li>${selectedComponents.wheels.name} - ${selectedComponents.wheels.price}€</li>`;
        totalPrice += selectedComponents.wheels.price;
    }

    summaryHTML += `</ul><p>Total: ${totalPrice}€</p>`;
    summary.innerHTML = summaryHTML;
}

// Gérer le panier
function handleCart() {
    const addToCartBtn = document.querySelector('.btn-save');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const hasComponents = Object.values(selectedComponents).some(component => component !== null);
            if (hasComponents) {
                showNotification('Configuration ajoutée au panier!', 'success');
                // Ici, vous pouvez ajouter la logique pour sauvegarder dans le panier
            } else {
                showNotification('Veuillez sélectionner au moins un composant', 'error');
            }
        });
    }
}

// Function to switch between fork configurations
function switchForkConfig(index) {
    if (index >= 0 && index < forkConfigs.forks.length) {
        console.log('Switching to fork config index:', index); // Debugging log
        BIKE_CONFIG.currentForkIndex = index;
        updateComponentImage('forks', components.forks[index]); // Ensure correct image is loaded
        drawBike();
    } else {
        console.error('Invalid fork index:', index); // Error log for invalid index
    }
}

// Ajouter une fonction pour obtenir la configuration du cadre actuel
function getCurrentFrameConfig() {
    if (!selectedComponents.frames || !forkConfigs.frames) return null;
    return forkConfigs.frames.find(frame => frame.name === selectedComponents.frames.name);
}

// Ajouter la fonction d'animation des roues
function animateWheels() {
    wheelRotation += 0.02;
    wheelRotation = wheelRotation % (Math.PI * 2);
    
    // Gérer le son du moyeu
    const currentTime = Date.now();
    if (currentTime - lastTickTime >= TICK_INTERVAL) {
        // if (hubSound && selectedComponents.wheels && 
        //     selectedComponents.wheels.name.toLowerCase().includes('hydra')) {
        //     // Créer une nouvelle instance de son pour permettre la superposition
        //     const tickSound = hubSound.cloneNode();
        //     tickSound.volume = Math.min(0.1 + (wheelRotation * 0.05), 0.3); // Volume dynamique
        //     tickSound.play().catch(e => console.log('Sound play prevented:', e));
        // }
        lastTickTime = currentTime;
    }
    
    drawBike();
    wheelAnimationId = requestAnimationFrame(animateWheels);
}

// Ajouter une fonction pour arrêter l'animation si nécessaire
function stopWheelAnimation() {
    if (wheelAnimationId !== null) {
        cancelAnimationFrame(wheelAnimationId);
        wheelAnimationId = null;
    }
}

// Ajouter la fonction d'initialisation du son
function initHubSound() {
    hubSound = new Audio('/static/sounds/hub_tick.mp3');
    hubSound.volume = 0.2; // Réduire le volume à 20%
}

document.addEventListener('DOMContentLoaded', async () => {
    // initHubSound();
    await loadForkConfigs();
    initCanvas();
    loadComponents().then(() => {
        // Set initial fork configuration
        if (components.forks && components.forks.length > 0) {
            BIKE_CONFIG.currentForkIndex = 0; // Set to the first fork by default
            const initialFork = components.forks[0];
            updateComponentImage('forks', initialFork).then(() => {
                const forkConfig = getCurrentForkConfig();
                if (forkConfig) {
                    forkConfig.scale = (BIKE_CONFIG.frame.scale * 0.45) / initialFork.height; // Adjust scale based on frame
                    drawBike();
                }
            });
        }
    });

    // Set up event listener for fork selection
    const forkSelect = document.getElementById('fork-select');
    if (forkSelect) {
        forkSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            console.log('Selected fork value:', selectedValue); // Debugging log
            const selectedIndex = parseInt(selectedValue, 10);
            console.log('Parsed fork index:', selectedIndex); // Debugging log
            if (!isNaN(selectedIndex)) {
                switchForkConfig(selectedIndex);
            } else {
                console.error('Invalid fork index:', selectedIndex); // Error log for invalid index
            }
        });
    }

    // Ajouter les écouteurs d'événements pour les autres sélections
    const selects = {
        frames: document.getElementById('frame-select'),
        wheels: document.getElementById('wheels-select'),
        handlebars: document.getElementById('handlebars-select'),
        brakes: document.getElementById('brakes-select'),
        drivetrains: document.getElementById('drivetrains-select')
    };
    
    Object.entries(selects).forEach(([type, select]) => {
        if (select) {
            select.addEventListener('change', (event) => updateSelection(event, type));
        }
    });
    
    // Initialiser la gestion du panier
    handleCart();
});
