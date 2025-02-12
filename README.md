<div align="center">
  <img src="images/logo.png" alt="Abiclou Logo" width="200"/>
  
  # 🚲 Abiclou
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)](https://github.com/yourusername/abiclou)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
  
  *Un configurateur de vélos nouvelle génération, conçu pour les passionnés.*
</div>

<p align="center">
  <img src="images/demo.gif" alt="Abiclou Demo" width="600"/>
</p>

## ✨ Caractéristiques

<div align="center">

| 🎨 Design | 🛠️ Technique | 💡 Innovation |
|-----------|--------------|---------------|
| Interface sombre élégante | Canvas HTML5 | Prévisualisation en temps réel |
| Animations fluides | JavaScript ES6+ | Sauvegarde des configurations |
| Thème cohérent | Architecture modulaire | Rotation & zoom dynamiques |
| Responsive design | Bootstrap 5 | Capture d'écran intégrée |

</div>

## 🚀 Composants Disponibles

### Cadres
- Santa Cruz V10 Factory
- Forbidden Dreadnought
- Commencal Supreme DH V5
- Rocky Mountain Altitude C50

### Fourches
- Fox 40 Factory
- RockShox Boxxer Ultimate
- RockShox ZEB Ultimate

### Amortisseurs
- Fox DHX2 Factory
- Fox Float X2 Factory
- RockShox Super Deluxe Ultimate
- Öhlins TTX22M

### Roues
- Hydra Enduro S Carbon
- DT Swiss XRC 1200
- DT Swiss XR 1700
- DT Swiss X 1900

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/yourusername/abiclou.git

# Se déplacer dans le dossier
cd abiclou

# Lancer avec un serveur local (Python)
python -m http.server 8080

# Ou avec PHP
php -S localhost:8080

# Ou avec Node.js
npx serve
```

## 💻 Technologies Utilisées

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white"/>
</div>

## 📱 Interface

<div align="center">
  <img src="images/interface1.png" width="30%" />
  <img src="images/interface2.png" width="30%" />
  <img src="images/interface3.png" width="30%" />
</div>

## 🌟 Fonctionnalités

### Configuration Visuelle
- Prévisualisation en temps réel des modifications
- Rotation 360° du vélo
- Zoom avant/arrière
- Capture d'écran de la configuration

### Gestion des Configurations
- Sauvegarde des configurations favorites
- Chargement des configurations sauvegardées
- Calcul automatique du prix total
- Estimation du poids total

### Interface Utilisateur
- Design moderne et épuré
- Thème sombre élégant
- Animations fluides
- Navigation intuitive

## 🎯 Utilisation

1. **Sélection des Composants**
   - Choisissez un cadre dans le menu de gauche
   - Ajoutez les composants souhaités
   - Visualisez en temps réel les changements

2. **Personnalisation**
   - Utilisez les contrôles de visualisation
   - Ajustez l'angle de vue
   - Zoomez sur les détails

3. **Sauvegarde**
   - Enregistrez vos configurations favorites
   - Exportez une capture d'écran
   - Consultez le résumé détaillé

## 📈 Roadmap

- [ ] Support du mode tactile
- [ ] Comparaison de configurations
- [ ] Export PDF des configurations
- [ ] Plus de composants
- [ ] Animations de suspension

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Développement initial* - [VotreGitHub](https://github.com/votre-username)

---

<div align="center">
  <sub>Built with ❤️ by bike enthusiasts for bike enthusiasts</sub>
  
  [![Stargazers](https://img.shields.io/github/stars/yourusername/abiclou?style=social)](https://github.com/yourusername/abiclou/stargazers)
  [![Forks](https://img.shields.io/github/forks/yourusername/abiclou?style=social)](https://github.com/yourusername/abiclou/network/members)
</div>

## 🎮 Utilisation

1. **Sélectionner un cadre**  
   ![Cadres](images/frames.gif) <!-- Ajouter un GIF -->
   - Choisissez parmi 15+ cadres haut de gamme
   - Ajustez la position et l'angle

2. **Configurer les composants**  
   ```javascript
   // Exemple de configuration
   {
       "frame": "Santa Cruz V10",
       "fork": "Fox 40 Factory",
       "shock": "RockShox Super Deluxe",
       "wheels": "DT Swiss XRC 1200"
   }
   ```

3. **Personnaliser la vue**
   - 🔍 Zoom avant/arrière
   - ↻ Rotation 360°
   - 🌗 Thème sombre/clair

4. **Sauvegarder/Exporter**
   - 💾 Enregistrer en local
   - 📤 Exporter en PNG/JSON

## 📂 Structure des Fichiers

```
abiclou/
├── 📁 css/                      # Styles
│   └── style.css               # Styles principaux
│
├── 📁 images/                   # Assets graphiques
│   ├── frames/                 # Images des cadres
│   ├── forks/                  # Images des fourches
│   ├── shocks/                 # Images des amortisseurs
│   ├── wheels/                 # Images des roues
│   └── logo.png               # Logo du projet
│
├── 📁 js/                       # Scripts JavaScript
│   └── main.js                # Script principal
│
├── 📁 configs/                  # Fichiers de configuration
│   └── configs.json           # Configuration des composants
│
├── 📄 index.html               # Page principale
├── 📄 LICENSE                  # Licence MIT
└── 📄 README.md                # Documentation

```

### 📁 Détails des Composants

#### CSS (`/css`)
- `style.css`: Styles globaux, thème sombre, animations et mise en page responsive

#### JavaScript (`/js`)
- `main.js`: 
  - Gestion du canvas et du rendu
  - Logique des composants
  - Gestion des événements
  - Sauvegarde/chargement des configurations

#### Configurations (`/configs`)
- `configs.json`:
  - Paramètres des cadres
  - Positions des composants
  - Échelles et rotations
  - Points d'ancrage

#### Images (`/images`)
Chaque sous-dossier contient les images des composants au format PNG:
- `frames/`: Cadres de vélos
- `forks/`: Fourches
- `shocks/`: Amortisseurs
- `wheels/`: Roues

### 🔧 Configuration Requise

- Navigateur moderne avec support Canvas
- Serveur local (Python, PHP, ou Node.js)
- Minimum 1GB de RAM
- Résolution d'écran minimale: 1024x768

### 📚 Conventions de Code

- Indentation: 4 espaces
- Nommage: camelCase pour JavaScript
- Commentaires: JSDoc pour les fonctions principales
- Structure CSS: BEM
