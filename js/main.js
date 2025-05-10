let canvas, ctx;
let bikeComponents = {
    frame: null,
    fork: null,
    frontWheel: null,
    rearWheel: null,
    shock: null,
    frontDisc: null,
    frontBrake: null,
    rearDisc: null,
    rearBrake: null,
    handlebar:null,
    frontTire: null,
    rearTire: null,
    selle: null,
    drivetrain: null,
    cassette: null
};
let loadedImages = {};
let forkConfigs = null;
let selleConfigs = null;
let wheelConfigs = null;
let discConfigs = null;
let tireConfigs = null;
let wheelRotation = 0;
let wheelAnimationId = null;
let hubSound = null;
let lastTickTime = 0;
const TICK_INTERVAL = 100; // Intervalle minimum entre les ticks en millisecondes
let currentScale = 1;
const SCALE_FACTOR = 1.2;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

// Ajouter cette variable globale pour stocker l'angle de rotation du vélo
let bikeRotation = 0;

// Modifier les constantes du wheeling
let isWheeling = false;
let wheelieAngle = 0;
const MAX_WHEELIE_ANGLE = -Math.PI / 4; // Angle négatif pour monter
const MIN_WHEELIE_ANGLE = 0;
const WHEELIE_SPEED = 0.05;
let wheelieAnimationId = null;

const BIKE_CONFIG = {
    canvas: {
        width: 1000,
        height: 600
    },
    frame: {
        scale: 0.9,
        position: {
            x: 500,
            y: 300
        }
    },
    currentForkIndex: null
};

const COMPONENTS = {
    'frames': [
        {
            'id': 'v10',
            'name': 'Santa Cruz V10 Factory',
            'description': 'Cadre en carbone haut de gamme',
            'price': 3700,
            'weight': 3.2,  // kg
            'image': 'v10_3.png'
        },
        {
            'id': 'v5',
            'name': 'Commencal Supreme DH V5',
            'description': 'Cadre en aluminium hyper resistant',
            'price': 3200,
            'weight': 2.5,  // kg
            'image': 'v5.png'
        },
        {
            'id': 'frs',
            'name': 'Commencal FRS',
            'description': 'Cadre en aluminium hyper resistant',
            'price': 1669.99,
            'weight': 2.5,  // kg
            'image': 'frs.png'
        },
        {
            'id': 'frsspe',
            'name': 'Specialized frs',
            'description': 'Cadre en carbonne hyper resistant',
            'price': 3200,
            'weight': 2.5,  // kg
            'image': 'frsspe.png'
        },
        {
            'id': 'dreadnought',
            'name': 'Forbidden Dreadnought',
            'description': 'Cadre polyvalent pour toutes les conditions',
            'price': 4399,
            'weight': 3.5,  // kg
            'image': 'dreadnought.png'
        },
        {
            'id': 'rocky',
            'name': 'Rocky Mountain Altitude C50',
            'description': 'Cadre en carbonne haut de gamme',
            'price': 3629,
            'weight': 3.0,  // kg
            'image': 'rocky.png'
        }
    ],
    'forks': [
        {
            'id': '0',
            'name': 'Fox 40 Factory',
            'description': 'Fourche Fox 40 Factory GRIP2 200mm',
            'price': 1849,
            'weight': 2.7,  // kg
            'image': 'fork-1.png'
        },
        {
            'id': '1',
            'name': 'Rockshox Boxxer Ultimate',
            'description': 'Fourche Rockshox Boxxer Ultimate 200mm',
            'price': 2279,
            'weight': 2.9,  // kg
            'image': 'fork-2.png'
        },
        {
            'id': '2',
            'name': 'Rockshox ZEB Ultimate',
            'description': 'Fourche Rockshox ZEB Ultimate 180mm',
            'price': 1249,
            'weight': 2.5,  // kg
            'image': 'fork-3.png'
        },
        {
            'id': '3',
            'name': 'EXT Ferro',
            'description': 'Fourche EXT Ferro 205mm',
            'price': 2459,
            'weight': 2.5,  // kg
            'image': 'fork-4.png'
        }
    ],
    'wheels': [
        {
            'id': 'wheels-0',
            'name': 'Hydra Enduro S Carbon',
            'description': 'Roues Industry Nine Hydra',
            'price': 781.20,
            'weight': 1.8,  // kg par roue
            'image': 'hydra-enduro-s-carbon.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'wheels-1',
            'name': 'Mavic Deemax',
            'description': 'Roues en carbone DT Swiss XRC 1200 29"',
            'price': 649.99,
            'weight': 2.0,  // kg
            'image': 'mavic-deemax.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'wheels-2',
            'name': 'DT Swiss XR 1700',
            'description': 'Roues en aluminium DT Swiss XR 1700 29"',
            'price': 899.99,
            'weight': 1.9,  // kg
            'image': 'wheels-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'wheels-3',
            'name': 'DT Swiss X 1900',
            'description': 'Roues en aluminium DT Swiss X 1900 29"',
            'price': 499.99,
            'weight': 1.7,  // kg
            'image': 'wheels-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'handlebars': [
        {
            'id': 'handlebars-0',
            'name': 'Renthal Fatbar Carbon',
            'description': 'Cintre en carbone Renthal Fatbar 800mm',
            'price': 169.99,
            'weight': 0.5,  // kg
            'scale': 1.0,
            "image": "v10cable.png",
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'handlebar-2',
            'name': 'Race Face Next R',
            'description': 'Cintre en carbone Race Face Next R 780mm',
            'price': 149.99,
            'weight': 0.4,  // kg
            'image': 'handlebar-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'handlebar-3',
            'name': 'Race Face Aeffect R',
            'description': 'Cintre en aluminium Race Face Aeffect R 780mm',
            'price': 79.99,
            'weight': 0.3,  // kg
            'image': 'handlebar-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'brakes': [
        {
            'id': 'brakes-0',
            'name': 'Shimano XTR M9120',
            'description': 'Freins à disque Shimano XTR M9120 4 pistons',
            'price': 599.99,
            'weight': 1.0,  // kg
            'image': 'xtdisque.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'brakes-1',
            'name': 'SRAM Code RSC',
            'description': 'Freins à disque SRAM Code RSC 4 pistons',
            'price': 499.99,
            'weight': 0.9,  // kg
            'image': 'brakes-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'brakes-2',
            'name': 'Shimano XT M8120',
            'description': 'Freins à disque Shimano XT M8120 4 pistons',
            'price': 349.99,
            'weight': 0.8,  // kg
            'image': 'brakes-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'tires': [
        {
            'id': 'tires-0',
            'name': 'Shwalbe Dirty Dan',
            'description': 'Freins à disque Shimano XTR M9120 4 pistons',
            'price': 99.99,
            'weight': 1.0,  // kg
            'image': 'shwalbe.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'tires-1',
            'name': 'Michelin DH Mud',
            'description': 'Freins à disque Shimano XTR M9120 4 pistons',
            'price': 99.99,
            'weight': 1.0,  // kg
            'image': 'dh-michelin-mud.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'tires-2',
            'name': 'Pirelli Scorpion',
            'description': 'Freins à disque Shimano XTR M9120 4 pistons',
            'price': 99.99,
            'weight': 1.0,  // kg
            'image': 'dh-scorpion.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'drivetrains': [
        {
            'id': 'drivetrain-0',
            'name': 'Shimano XTR M9100',
            'description': 'Transmission Shimano XTR M9100 12 vitesses',
            'price': 999.99,
            'weight': 1.5,  // kg
            'image': 'shimano-xtr.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'drivetrain-2',
            'name': 'SRAM XX1 Eagle AXS',
            'description': 'Transmission SRAM XX1 Eagle AXS 12 vitesses',
            'price': 1299.99,
            'weight': 1.8,  // kg
            'image': 'drivetrain-2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'drivetrain-3',
            'name': 'Shimano XT M8100',
            'description': 'Transmission Shimano XT M8100 12 vitesses',
            'price': 599.99,
            'weight': 1.2,  // kg
            'image': 'drivetrain-3.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'cassettes': [
        {
            'id': 'cassette-0',
            'name': 'Shimano Box 7V',
            'description': 'Transmission Shimano XTR M9100 12 vitesses',
            'price': 43.13,
            'weight': 1.5,  // kg
            'image': 'shimano-box-components.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        }
    ],
    'selles': [
        {
            'id': 'selle-0',
            'name': 'Selle Reverse Nico Vink',
            'description': 'Selle Reverse Nico Vink Shovel &amp; Shred noir/blanc ',
            'price': 57.90,
            'weight': 0.26,  // kg
            'image': 'selle-niko-vink.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'selle-1',
            'name': 'Selle Reverse',
            'description': 'Selle Reverse Nico Vink Shovel &amp; Shred noir/blanc ',
            'price': 57.90,
            'weight': 0.26,  // kg
            'image': 'selle-reverse.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
    ],
    'shocks': [
        {
            'id': 'shock-0',
            'name': 'Fox DHX2 Factory',
            'description': 'Amortisseur Fox DHX2 Factory 250x75',
            'price': 899.99,
            'weight': 0.95,  // kg
            'image': 'dhx2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'shock-1',
            'name': 'Fox Float X2 Factory',
            'description': 'Amortisseur Fox Float X2 Factory 250x75',
            'price': 899.99,
            'weight': 0.95,  // kg
            'image': 'floatx2.png',
            'scale': 1.0,
            'position': {'top': '50%', 'left': '50%'}
        },
        {
            'id': 'shock-2',
            'name': 'RockShox Super Deluxe Coil',
            'description': 'Amortisseur RockShox Vivid Ultimate 250x75',
            'price': 399.99,
            'weight': 0.8,  // kg
            'image': 'super-deluxe-coil.png'
        },
        {
            'id': 'shock-3',
            'name': 'RockShox Vivid Ultimate',
            'description': 'Amortisseur RockShox Vivid Ultimate 250x75',
            'price': 699.99,
            'weight': 0.8,  // kg
            'image': 'vivid.png'
        },
        {
            'id': 'shock-4',
            'name': 'EXT Arma',
            'description': 'Amortisseur EXT Arma 250x75',
            'price': 1199.99,
            'weight': 1.0,  // kg
            'image': 'ext.png'
        }
        // {
        //     'id': 'shock-3',
        //     'name': 'Öhlins TTX22M',
        //     'description': 'Amortisseur Öhlins TTX22M 250x75',
        //     'price': 999.99,
        //     'weight': 1.0,  // kg
        //     'image': 'shock-3.png'
        // }
    ]
}


// Charger les configurations des fourches
async function loadForkConfigs() {
    try {
        const response = await fetch('configs/configs.json');
        const data = await response.json();
        forkConfigs = data;  // Stocker toute la configuration
        // console.log('Configs loaded:', forkConfigs);
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
    // console.log('Current fork config:', config);
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
    
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Appliquer le zoom
    ctx.translate(centerX, centerY);
    ctx.scale(currentScale, currentScale);
    ctx.translate(-centerX, -centerY);

    // Obtenir le point d'ancrage de la roue arrière
    const frameConfig = getCurrentFrameConfig();
    if (frameConfig && frameConfig.wheelAnchors && frameConfig.wheelAnchors.rear) {
        const rearWheel = frameConfig.wheelAnchors.rear;
        
        // Appliquer la rotation du wheeling autour de la roue arrière
        ctx.translate(rearWheel.x, rearWheel.y);
        ctx.rotate(wheelieAngle);
        ctx.translate(-rearWheel.x, -rearWheel.y);
    }

    // Calculer et appliquer la rotation du vélo
    bikeRotation = calculateBikeRotation();
    if (bikeRotation !== 0) {
        ctx.translate(centerX, centerY);
        ctx.rotate(bikeRotation);
        ctx.translate(-centerX, -centerY);
    }

    // Créer un tableau de tous les composants à dessiner
    const componentsToDraw = [];

    // Ajouter tous les composants actifs avec leur z-index
    Object.entries(bikeComponents).forEach(([type, component]) => {
        if (!component) return;

        let config = null;
        switch(type) {
            case 'frame':
                config = getCurrentFrameConfig();
                break;
            case 'fork':
                config = getCurrentForkConfig();
                break;
            case 'frontWheel':
            case 'rearWheel':
                config = getCurrentWheelConfig();
                break;
            case 'shock':
                config = getCurrentShockConfig();
                break;
            case 'handlebar':
                config = getCurrentHandlebarConfig();
                break;
            case 'frontDisc':
            case 'rearDisc':
                config = getCurrentDiscConfig();
                break;
            case 'frontTire':
            case 'rearTire':
                config = getCurrentTireConfig();
                break;
            case 'selle':
                config = getCurrentSelleConfig();
                break;
            case 'drivetrain':
                config = getCurrentDriveConfig();
                break;
            case 'cassette':
                config = getCurrentCassetteConfig();
                break;
        }

        if (config) {
            componentsToDraw.push({
                type,
                component,
                config,
                zIndex: config.zIndex || 0
            });
        }
    });

    // Trier les composants par z-index
    componentsToDraw.sort((a, b) => a.zIndex - b.zIndex);

    // Dessiner les composants dans l'ordre
    componentsToDraw.forEach(({ type, component, config }) => {
        drawComponent(type, component, config);
    });

    ctx.restore();
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
    }else if (type === 'drivetrain') {
        config = getCurrentDriveConfig();
        if (!config) {
            console.warn('No drivetrain config provided');
            return;
        }
        
        const frameConfig = getCurrentFrameConfig();
        if (!frameConfig || !frameConfig.driveMount) {
            console.warn('No frame config or selle mount found');
            return;
        }

        // console.log('Drawing shock with config:', config);
        // console.log('Frame shock mount:', frameConfig.shockMount);
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const driveWidth = baseWidth * config.dimensions.width;
        const driveHeight = baseHeight * config.dimensions.height;

        // Déplacer au point de montage
        ctx.translate(frameConfig.driveMount.x, frameConfig.driveMount.y);
        
        // Appliquer la rotation
        if (frameConfig.driveMount.rotation) {
            const angleRad = frameConfig.driveMount.rotation * Math.PI / 180;
            ctx.rotate(angleRad);
        }

        // Dessiner l'amortisseur centré sur son point de rotation
        ctx.drawImage(
            component,
            -driveWidth / 2,
            -driveHeight / 2,
            driveWidth,
            driveHeight
        );
    }else if (type === 'cassette') {
        config = getCurrentCassetteConfig();
        if (!config) {
            console.warn('No cassette config provided');
            return;
        }
        
        const frameConfig = getCurrentFrameConfig();
        if (!frameConfig || !frameConfig.cassetteMount) {
            console.warn('No frame config or cassette mount found');
            return;
        }

        // console.log('Drawing shock with config:', config);
        // console.log('Frame shock mount:', frameConfig.shockMount);
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const cassetteWidth = baseWidth * config.dimensions.width;
        const cassetteHeight = baseHeight * config.dimensions.height;

        // Déplacer au point de montage
        ctx.translate(frameConfig.cassetteMount.x, frameConfig.cassetteMount.y);
        
        // Appliquer la rotation
        ctx.rotate(wheelRotation);

        // Dessiner l'amortisseur centré sur son point de rotation
        ctx.drawImage(
            component,
            -cassetteWidth / 2,
            -cassetteHeight / 2,
            cassetteWidth,
            cassetteHeight
        );
    }else if (type === 'selle') {
        config = getCurrentSelleConfig();
        if (!config) {
            console.warn('No selle config provided');
            return;
        }
        
        const frameConfig = getCurrentFrameConfig();
        if (!frameConfig || !frameConfig.selleMount) {
            console.warn('No frame config or selle mount found');
            return;
        }

        // console.log('Drawing shock with config:', config);
        // console.log('Frame shock mount:', frameConfig.shockMount);
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const selleWidth = baseWidth * config.dimensions.width;
        const selleHeight = baseHeight * config.dimensions.height;

        // Déplacer au point de montage
        ctx.translate(frameConfig.selleMount.x, frameConfig.selleMount.y);
        
        // Appliquer la rotation
        if (frameConfig.selleMount.rotation) {
            const angleRad = frameConfig.selleMount.rotation * Math.PI / 180;
            ctx.rotate(angleRad);
        }

        // Dessiner l'amortisseur centré sur son point de rotation
        ctx.drawImage(
            component,
            -selleWidth / 2,
            -selleHeight / 2,
            selleWidth,
            selleHeight
        );
    }else if (type === 'frontDisc' || type === 'rearDisc') {
        if (!config) return;
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const discWidth = baseWidth * config.dimensions.width;
        const discHeight = baseHeight * config.dimensions.height;

        // Obtenir les points d'ancrage
        const frameConfig = getCurrentFrameConfig();
        const forkConfig = getCurrentForkConfig();
        if (!frameConfig || !forkConfig) {
            console.warn('No frame or fork config found');
            return;
        }

        // Position différente pour la roue avant et arrière
        const anchor = type === 'frontDisc' ? 
            forkConfig.axle : 
            frameConfig.diskAnchors.rear;

        if (!anchor) return;

        // 1. Déplacer au point d'ancrage
        ctx.translate(anchor.x, anchor.y);
        
        // 2. Appliquer la rotation autour du centre de la roue
        ctx.rotate(wheelRotation);

        // 3. Dessiner la roue centrée sur son point d'ancrage
        ctx.drawImage(
            component,
            -discWidth / 2,  // Centre horizontal
            -discHeight / 2, // Centre vertical
            discWidth,
            discHeight
        );
    }else if (type === 'frontTire' || type === 'rearTire') {
        if (!config) return;
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const tireWidth = baseWidth * config.dimensions.width;
        const tireHeight = baseHeight * config.dimensions.height;

        // Obtenir les points d'ancrage
        const frameConfig = getCurrentFrameConfig();
        const forkConfig = getCurrentForkConfig();
        if (!frameConfig || !forkConfig) {
            console.warn('No frame or fork config found');
            return;
        }

        // Position différente pour la roue avant et arrière
        const anchor = type === 'frontTire' ? 
            forkConfig.axle : 
            frameConfig.tireAnchors.rear;

        if (!anchor) return;

        // 1. Déplacer au point d'ancrage
        ctx.translate(anchor.x, anchor.y);
        
        // 2. Appliquer la rotation autour du centre de la roue
        ctx.rotate(wheelRotation);

        // 3. Dessiner la roue centrée sur son point d'ancrage
        ctx.drawImage(
            component,
            -tireWidth / 2,  // Centre horizontal
            -tireHeight / 2, // Centre vertical
            tireWidth,
            tireHeight
        );
    } else if (type === 'shock') {
        if (!config) {
            console.warn('No shock config provided');
            return;
        }
        
        const frameConfig = getCurrentFrameConfig();
        if (!frameConfig || !frameConfig.shockMount) {
            console.warn('No frame config or shock mount found');
            return;
        }

        // console.log('Drawing shock with config:', config);
        // console.log('Frame shock mount:', frameConfig.shockMount);
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const shockWidth = baseWidth * config.dimensions.width;
        const shockHeight = baseHeight * config.dimensions.height;

        // Déplacer au point de montage
        ctx.translate(frameConfig.shockMount.x, frameConfig.shockMount.y);
        
        // Appliquer la rotation
        if (frameConfig.shockMount.rotation) {
            const angleRad = frameConfig.shockMount.rotation * Math.PI / 180;
            ctx.rotate(angleRad);
        }

        // Dessiner l'amortisseur centré sur son point de rotation
        ctx.drawImage(
            component,
            -shockWidth / 2,
            -shockHeight / 2,
            shockWidth,
            shockHeight
        );
    }else if (type === 'handlebar') {
        if (!config) {
            console.warn('No shock config provided');
            return;
        }
        
        const frameConfig = getCurrentFrameConfig();
        if (!frameConfig || !frameConfig.handlebarMount) {
            console.warn('No frame config or shock mount found');
            return;
        }

        console.log('Drawing handle with config:', config);
        // console.log('Frame shock mount:', frameConfig.shockMount);
        
        const baseWidth = component.width * config.scale;
        const baseHeight = component.height * config.scale;
        const shockWidth = baseWidth * config.dimensions.width;
        const shockHeight = baseHeight * config.dimensions.height;

        // Déplacer au point de montage
        ctx.translate(frameConfig.handlebarMount.x, frameConfig.handlebarMount.y);
        
        // Appliquer la rotation
        if (frameConfig.handlebarMount.rotation) {
            const angleRad = frameConfig.handlebarMount.rotation * Math.PI / 180;
            ctx.rotate(angleRad);
        }

        // Dessiner l'amortisseur centré sur son point de rotation
        ctx.drawImage(
            component,
            -shockWidth / 2,
            -shockHeight / 2,
            shockWidth,
            shockHeight
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

function getCurrentDiscConfig() {
    console.log(forkConfigs)
    if (!selectedComponents.brakes || !forkConfigs || !forkConfigs.brakes) return null;
    const discIndex = parseInt(selectedComponents.brakes.id.split('-')[1]);
    if (isNaN(discIndex) || discIndex >= forkConfigs.brakes.length) return null;
    return forkConfigs.brakes[discIndex];
}

function getCurrentTireConfig() {
    console.log(forkConfigs)
    if (!selectedComponents.tires || !forkConfigs || !forkConfigs.tires) return null;
    const tiresIndex = parseInt(selectedComponents.tires.id.split('-')[1]);
    if (isNaN(tiresIndex) || tiresIndex >= forkConfigs.tires.length) return null;
    return forkConfigs.tires[tiresIndex];
}

// Function to update the component image
async function updateComponentImage(type, component) {
    if (!component) return;
    
    const imageUrl = `images/${type}/${component.image}`;
    
    console.log('Loading image from URL:', imageUrl);
    
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
                if (wheelAnimationId === null) {
                    // animateWheels();
                }
                break;
            case 'shocks':  // Nouveau cas
                bikeComponents.shock = img;
                break;
            case 'handlebars':  // Nouveau cas
                bikeComponents.handlebar = img;
                break;
            case 'brakes':
                bikeComponents.frontDisc = img;
                bikeComponents.rearDisc = img;
                if (wheelAnimationId === null) {
                    // animateWheels();
                }
                break;
            case 'tires':
                bikeComponents.frontTire = img;
                bikeComponents.rearTire = img;
                if (wheelAnimationId === null) {
                    //animateWheels();
                }
                break;
            case 'selles':  // Nouveau cas
                bikeComponents.selle = img;
                break;
            case 'drivetrains':  // Nouveau cas
                bikeComponents.drivetrain = img;
                break;
            case 'cassettes':  // Nouveau cas
                bikeComponents.cassette = img;
                break;
        }
        
        updateSummary();
        drawBike();
    } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
        if (type === 'forks') {
            bikeComponents.fork = null;
        } else if (type === 'shocks') {
            bikeComponents.shock = null;
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
    drivetrains: null,
    shocks: null,
    tires: null, 
    selles: null,
    cassettes: null
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
        drivetrains: document.getElementById('drivetrains-select'),
        shocks: document.getElementById('shocks-select'),
        tires: document.getElementById('tires-select'),
        selles: document.getElementById('selles-select'),
        cassettes: document.getElementById('cassettes-select')
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
    } else {
        const component = components[type].find(c => c.id === selectedId);
        if (component) {
            selectedComponents[type] = component;
            updateComponentImage(type, component);
        }
    }
    
    updateTotals();
    updateSummary();
}

// Mettre à jour le résumé et le prix total avec animation
function updateSummary() {
    const summary = document.getElementById('summary');
    if (!summary) return;

    let totalPrice = 0;
    let totalWeight = 0;
    let summaryHTML = '<h3>Résumé de votre configuration</h3><ul>';

    // Ajouter le cadre
    if (selectedComponents.frames) {
        summaryHTML += `<li>${selectedComponents.frames.name} - ${selectedComponents.frames.price}€</li>`;
        totalPrice += selectedComponents.frames.price;
        totalWeight += selectedComponents.frames.weight;
    }

    // Ajouter la fourche
    if (selectedComponents.forks) {
        summaryHTML += `<li>${selectedComponents.forks.name} - ${selectedComponents.forks.price}€</li>`;
        totalPrice += selectedComponents.forks.price;
        totalWeight += selectedComponents.forks.weight;
    }

    // Ajouter les roues
    if (selectedComponents.wheels) {
        summaryHTML += `<li>${selectedComponents.wheels.name} - ${selectedComponents.wheels.price}€</li>`;
        totalPrice += selectedComponents.wheels.price;
        totalWeight += selectedComponents.wheels.weight;
    }

    // Ajouter l'amortisseur
    if (selectedComponents.shocks) {
        summaryHTML += `<li>${selectedComponents.shocks.name} - ${selectedComponents.shocks.price}€</li>`;
        totalPrice += selectedComponents.shocks.price;
        totalWeight += selectedComponents.shocks.weight;
    }

    if (selectedComponents.tires) {
        summaryHTML += `<li>${selectedComponents.tires.name} - ${selectedComponents.tires.price}€</li>`;
        totalPrice += selectedComponents.tires.price;
        totalWeight += selectedComponents.tires.weight;
    }

    summaryHTML += `</ul><p>Total: ${totalPrice.toFixed(2)}€</p>`;
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
    const config = forkConfigs.frames.find(frame => frame.name === selectedComponents.frames.name);
    if (config) {
        // Ajouter l'angle de rotation au config
        config.rotation = bikeRotation;
    }
    return config;
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
// Get current handlebar configuration
function getCurrentHandlebarConfig() {
    if (!selectedComponents.handlebars || !forkConfigs || !forkConfigs.handlebars) {
        return null;
    }
    
    const handlebarIndex = parseInt(selectedComponents.handlebars.id.split('-')[1]);
    
    if (isNaN(handlebarIndex) || handlebarIndex >= forkConfigs.handlebars.length) {
        return null;
    }
    
    return forkConfigs.handlebars[handlebarIndex];
}

// Modifier la fonction getCurrentShockConfig
function getCurrentShockConfig() {
    if (!selectedComponents.shocks || !forkConfigs || !forkConfigs.shocks) {
        console.warn('Missing shock components or configs');
        return null;
    }
    
    const shockIndex = parseInt(selectedComponents.shocks.id.split('-')[1]);
    
    if (isNaN(shockIndex) || shockIndex >= forkConfigs.shocks.length) {
        console.warn('Invalid shock index:', shockIndex);
        return null;
    }
    
    const config = forkConfigs.shocks[shockIndex];
    return config;
}

function getCurrentSelleConfig() {
    if (!selectedComponents.selles) {
        console.warn('Missing shock components or configs');
        return null;
    }
    
    const selleIndex = parseInt(selectedComponents.selles.id.split('-')[1]);
    
    if (isNaN(selleIndex) || selleIndex >= forkConfigs.selles.length) {
        console.warn('Invalid shock index:', selleIndex);
        return null;
    }
    
    const config = forkConfigs.selles[selleIndex];
    return config;
}

function getCurrentCassetteConfig() {
    if (!selectedComponents.cassettes) {
        console.warn('Missing shock components or configs');
        return null;
    }
    
    const cassetteIndex = parseInt(selectedComponents.cassettes.id.split('-')[1]);
    
    if (isNaN(cassetteIndex) || cassetteIndex >= forkConfigs.cassettes.length) {
        console.warn('Invalid shock index:', cassetteIndex);
        return null;
    }
    
    const config = forkConfigs.cassettes[cassetteIndex];
    return config;
}

function getCurrentDriveConfig() {
    if (!selectedComponents.drivetrains) {
        console.warn('Missing shock components or configs');
        return null;
    }
    
    const driveIndex = parseInt(selectedComponents.drivetrains.id.split('-')[1]);
    
    if (isNaN(driveIndex) || driveIndex >= forkConfigs.drivetrains.length) {
        console.warn('Invalid shock index:', driveIndex);
        return null;
    }
    
    const config = forkConfigs.drivetrains[driveIndex];
    return config;
}

function initHubSound() {
    hubSound = new Audio('/static/sounds/hub_tick.mp3');
    hubSound.volume = 0.2; // Réduire le volume à 20%
}

// Modifier la fonction getCurrentShockConfig
function getCurrentShockConfig() {
    if (!selectedComponents.shocks || !forkConfigs || !forkConfigs.shocks) {
        console.warn('Missing shock components or configs');
        return null;
    }
    
    // Récupérer l'index depuis l'ID (par exemple 'shock-0' -> 0)
    const shockIndex = parseInt(selectedComponents.shocks.id.split('-')[1]);
    // console.log('Shock index:', shockIndex);
    // console.log('Selected shock:', selectedComponents.shocks);
    // console.log('Available shock configs:', forkConfigs.shocks);
    
    if (isNaN(shockIndex) || shockIndex >= forkConfigs.shocks.length) {
        console.warn('Invalid shock index:', shockIndex);
        return null;
    }
    
    const config = forkConfigs.shocks[shockIndex];
    // console.log('Selected shock config:', config);
    return config;
}

// Ajouter la fonction de zoom
function handleZoom(zoomIn) {
    const newScale = zoomIn ? 
        currentScale * SCALE_FACTOR : 
        currentScale / SCALE_FACTOR;
    
    // Vérifier les limites
    if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
        currentScale = newScale;
        const canvas = document.getElementById('bike-canvas');
        const container = document.getElementById('bike-image-container');
        
        // Ajuster la taille du canvas
        canvas.style.transform = `scale(${currentScale})`;
        drawBike();
    }
}

// Ajouter la fonction de capture d'écran
function captureScreenshot() {
    const canvas = document.getElementById('bike-canvas');
    
    try {
        // Créer un lien temporaire
        const link = document.createElement('a');
        link.download = 'dreambike.png';
        link.href = canvas.toDataURL('image/png');
        
        // Déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Image sauvegardée !', 'success');
    } catch (error) {
        console.error('Erreur lors de la capture:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

// Ajouter la fonction de calcul du total
function updateTotals() {
    let totalPrice = 0;
    let totalWeight = 0;

    // Calculer les totaux pour chaque composant sélectionné
    Object.values(selectedComponents).forEach(component => {
        if (component) {
            totalPrice += component.price;
            totalWeight += component.weight;
        }
    });

    // Ajouter le poids de la deuxième roue si des roues sont sélectionnées
    if (selectedComponents.wheels) {
        totalWeight += selectedComponents.wheels.weight;
    }

    // Mettre à jour l'affichage
    const totalPriceElement = document.getElementById('total-price');
    const totalWeightElement = document.getElementById('total-weight');
    
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} €`;
    }
    
    if (totalWeightElement) {
        totalWeightElement.textContent = `${totalWeight.toFixed(2)} kg`;
    }
}

// Ajouter la gestion des favoris
function handleFavorites() {
    const favBtn = document.querySelector('.btn-save');
    if (!favBtn) return;

    // Charger les favoris existants
    let favorites = JSON.parse(localStorage.getItem('bikeFavorites') || '[]');

    favBtn.addEventListener('click', () => {
        const hasComponents = Object.values(selectedComponents).some(component => component !== null);
        
        if (!hasComponents) {
            showNotification('Veuillez sélectionner au moins un composant', 'error');
            return;
        }

        // Créer un objet configuration
        const config = {
            id: Date.now(),
            date: new Date().toISOString(),
            components: {},
            totalPrice: parseFloat(document.getElementById('total-price').textContent),
            totalWeight: parseFloat(document.getElementById('total-weight').textContent)
        };

        // Sauvegarder les composants sélectionnés
        Object.entries(selectedComponents).forEach(([type, component]) => {
            if (component) {
                config.components[type] = {
                    id: component.id,
                    name: component.name,
                    price: component.price,
                    weight: component.weight
                };
            }
        });

        // Ajouter aux favoris
        favorites.push(config);
        localStorage.setItem('bikeFavorites', JSON.stringify(favorites));

        showNotification('Configuration ajoutée aux favoris !', 'success');
        
        // Mettre à jour le badge des favoris si existant
        const favCount = document.getElementById('fav-count');
        if (favCount) {
            favCount.textContent = favorites.length;
        }
    });
}

// Ajouter la fonction de chargement des configurations
function handleLoadConfig() {
    const loadBtn = document.querySelector('.btn-load');
    const modal = new bootstrap.Modal(document.getElementById('loadModal'));
    
    if (!loadBtn) return;
    
    loadBtn.addEventListener('click', () => {
        displaySavedConfigs();
        modal.show();
    });
}

// Fonction pour afficher les configurations sauvegardées
function displaySavedConfigs() {
    const configsContainer = document.getElementById('savedConfigs');
    const favorites = JSON.parse(localStorage.getItem('bikeFavorites') || '[]');
    
    if (favorites.length === 0) {
        configsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open fa-3x mb-3"></i>
                <p>Aucune configuration sauvegardée</p>
            </div>
        `;
        return;
    }
    
    configsContainer.innerHTML = favorites.map((config, index) => `
        <div class="config-card" data-config-id="${config.id}">
            <button class="delete-btn" onclick="deleteConfig(${config.id})">
                <i class="fas fa-trash"></i>
            </button>
            <div class="date">
                Sauvegardé le ${new Date(config.date).toLocaleString()}
            </div>
            <div class="components">
                ${Object.entries(config.components).map(([type, comp]) => `
                    <div>${comp.name}</div>
                `).join('')}
            </div>
            <div class="totals">
                <span>Prix: ${config.totalPrice} €</span>
                <span>Poids: ${config.totalWeight} kg</span>
            </div>
        </div>
    `).join('');
    
    // Ajouter les écouteurs d'événements pour le chargement
    configsContainer.querySelectorAll('.config-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                loadConfig(card.dataset.configId);
            }
        });
    });
}

// Fonction pour supprimer une configuration
function deleteConfig(configId) {
    const favorites = JSON.parse(localStorage.getItem('bikeFavorites') || '[]');
    const newFavorites = favorites.filter(c => c.id !== configId);
    localStorage.setItem('bikeFavorites', JSON.stringify(newFavorites));
    
    // Mettre à jour l'affichage
    displaySavedConfigs();
    
    // Mettre à jour le badge
    const favCount = document.getElementById('fav-count');
    if (favCount) {
        favCount.textContent = newFavorites.length;
    }
    
    showNotification('Configuration supprimée', 'success');
}

// Modifier la fonction loadConfig pour corriger le chargement des composants
function loadConfig(configId) {
    const favorites = JSON.parse(localStorage.getItem('bikeFavorites') || '[]');
    const config = favorites.find(c => c.id === parseInt(configId));
    
    if (!config) return;
    
    // Réinitialiser le canvas
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Réinitialiser les sélections actuelles
    Object.keys(selectedComponents).forEach(type => {
        selectedComponents[type] = null;
    });
    
    // Charger chaque composant
    Object.entries(config.components).forEach(([type, component]) => {
        // Trouver le composant complet dans COMPONENTS
        const fullComponent = COMPONENTS[type]?.find(c => c.id === component.id);
        if (fullComponent) {
            selectedComponents[type] = fullComponent;
            const select = document.getElementById(`${type}-select`);
            if (select) {
                select.value = fullComponent.id;
            }
            updateComponentImage(type, fullComponent);
        }
    });
    
    // Mettre à jour l'affichage
    updateTotals();
    updateSummary();
    drawBike();
    
    // Fermer la modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('loadModal'));
    if (modal) modal.hide();
    
    showNotification('Configuration chargée !', 'success');
}

// Ajouter une fonction pour initialiser le compteur de favoris au chargement
function initializeFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('bikeFavorites') || '[]');
    const favCount = document.getElementById('fav-count');
    if (favCount) {
        favCount.textContent = favorites.length;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Ajouter le bouton de wheeling avec une construction HTML plus sûre
    const wheelieBtn = document.createElement('button');
    wheelieBtn.className = 'btn btn-control';
    wheelieBtn.id = 'wheelie';
    wheelieBtn.setAttribute('data-tooltip', 'Wheeling');
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-angle-double-up';
    wheelieBtn.appendChild(icon);
    
    const viewerControls = document.querySelector('.viewer-controls');
    if (viewerControls) {
        viewerControls.appendChild(wheelieBtn);
    }

    // Gérer les événements du bouton de wheeling
    wheelieBtn.addEventListener('mousedown', () => {
        isWheeling = true;
        if (!wheelieAnimationId) {
            animateWheelie();
        }
    });

    wheelieBtn.addEventListener('mouseup', () => {
        isWheeling = false;
    });

    wheelieBtn.addEventListener('mouseleave', () => {
        isWheeling = false;
    });

    // Gérer les événements tactiles
    wheelieBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isWheeling = true;
        if (!wheelieAnimationId) {
            animateWheelie();
        }
    });

    wheelieBtn.addEventListener('touchend', () => {
        isWheeling = false;
    });

    // Initialiser les autres composants
    initializeComponents();
});

// Déplacer l'initialisation dans une fonction séparée pour plus de clarté
function initializeComponents() {
    // initHubSound();
    loadForkConfigs().then(() => {
        initCanvas();
        return loadComponents();
    }).then(() => {
        if (components.forks && components.forks.length > 0) {
            BIKE_CONFIG.currentForkIndex = null;
            const initialFork = components.forks[0];
            return updateComponentImage('forks', initialFork);
        }
    }).then(() => {
        setupEventListeners();
        handleFavorites();
        handleLoadConfig();
        initializeFavoritesCount();
        updateTotals();
    }).catch(error => {
        console.error('Error initializing components:', error);
    });
}

// Regrouper la configuration des écouteurs d'événements
function setupEventListeners() {
    // Configuration des sélecteurs
    const forkSelect = document.getElementById('fork-select');
    if (forkSelect) {
        forkSelect.addEventListener('change', (event) => {
            const selectedIndex = parseInt(event.target.value, 10);
            if (!isNaN(selectedIndex)) {
                switchForkConfig(selectedIndex);
            }
        });
    }

    // Configuration des autres sélecteurs
    const selects = {
        frames: document.getElementById('frame-select'),
        wheels: document.getElementById('wheels-select'),
        handlebars: document.getElementById('handlebars-select'),
        brakes: document.getElementById('brakes-select'),
        drivetrains: document.getElementById('drivetrains-select'),
        shocks: document.getElementById('shocks-select'),
        tires: document.getElementById('tires-select'),
        selles: document.getElementById('selles-select'),
        cassettes: document.getElementById('cassettes-select')
    };

    Object.entries(selects).forEach(([type, select]) => {
        if (select) {
            select.addEventListener('change', (event) => updateSelection(event, type));
        }
    });

    // Configuration des boutons de contrôle
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const screenshotBtn = document.getElementById('screenshot');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => handleZoom(true));
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => handleZoom(false));
    }
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', captureScreenshot);
    }

    handleCart();
}

// Ajouter cette fonction après la fonction calculateBikeRotation
function animateWheelie() {
    if (!isWheeling) {
        // Retour à la position normale (0)
        wheelieAngle = Math.min(MIN_WHEELIE_ANGLE, wheelieAngle + WHEELIE_SPEED);
    } else {
        // Monter la roue avant (angle négatif)
        wheelieAngle = Math.max(MAX_WHEELIE_ANGLE, wheelieAngle - WHEELIE_SPEED);
    }

    // Lancer l'animation des roues pendant le wheeling
    if (wheelAnimationId === null) {
        animateWheels();
    }

    // Continuer l'animation tant que nécessaire
    if (wheelieAngle < 0 || isWheeling) {
        drawBike();
        wheelieAnimationId = requestAnimationFrame(animateWheelie);
    } else {
        wheelieAnimationId = null;
        // Arrêter l'animation des roues si on n'est pas en train de rouler
        if (i === 0) {
            stopWheelAnimation();
        }
    }
}

// Ajouter cette fonction pour calculer l'angle du vélo
function calculateBikeRotation() {
    const frameConfig = getCurrentFrameConfig();
    const forkConfig = getCurrentForkConfig();
    
    if (!frameConfig || !forkConfig) return 0;

    // Obtenir les positions des axes des roues
    const frontAxle = forkConfig.axle;
    const rearAxle = frameConfig.wheelAnchors.rear;

    if (!frontAxle || !rearAxle) return 0;

    // Calculer la différence de hauteur
    const deltaY = frontAxle.y - rearAxle.y;
    const deltaX = frontAxle.x - rearAxle.x;

    // Calculer l'angle en radians
    const angle = Math.atan2(deltaY, deltaX);

    // Convertir en degrés et retourner l'angle négatif pour la correction
    return -angle;
}

var i = 0;

$("#play").click(function(){
    if(i === 0){
        $(this).children().remove();
        $(this).html(`<i class="fas fa-stop"></i>`);
        i=1;
        animateWheels();
    }else{
        $(this).children().remove();
        $(this).html(`<i class="fas fa-play"></i>`);
        i=0;
        stopWheelAnimation();
    }
})
