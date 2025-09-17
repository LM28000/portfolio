// Charger les variables d'environnement depuis le dossier du serveur (dev seulement)
const fs = require('fs');
const path = require('path');

// Chercher d'abord .env.local, puis .env
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
  console.log('🔧 Variables d\'environnement chargées depuis .env.local');
} else if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('🔧 Variables d\'environnement chargées depuis .env');
} else {
  console.log('📦 Production mode: utilisation des variables d\'environnement système');
}

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.API_PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'default-dev-token';

// Debug des variables d'environnement
console.log('🔍 Variables d\'environnement:');
console.log(`   - NODE_ENV: ${NODE_ENV}`);
console.log(`   - API_PORT: ${PORT}`);
console.log(`   - ADMIN_TOKEN: ${ADMIN_TOKEN ? '***défini***' : 'NON DÉFINI'}`);
console.log(`   - process.env.ADMIN_TOKEN: ${process.env.ADMIN_TOKEN ? '***défini***' : 'NON DÉFINI'}`);

// Configuration CORS adaptée à l'environnement
let corsOptions = {
  credentials: true
};

if (NODE_ENV === 'production') {
  // En production, accepter toutes les origines du même domaine
  corsOptions.origin = true;
  console.log('🌐 Mode production : CORS configuré pour tous les domaines');
} else {
  // En développement, origines spécifiques
  corsOptions.origin = ['http://localhost:5173', 'http://localhost:5174'];
  console.log('🔧 Mode développement : CORS configuré pour localhost');
}

app.use(cors(corsOptions));

app.use(express.json());

// Configuration multer pour l'upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../admin-files/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueId + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Chemin du fichier de métadonnées
const metadataFile = path.join(__dirname, '../admin-files/metadata.json');

// Utilitaires
function loadMetadata() {
  try {
    if (fs.existsSync(metadataFile)) {
      return JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    }
    return [];
  } catch (error) {
    console.error('Erreur lecture métadonnées:', error);
    return [];
  }
}

function saveMetadata(data) {
  try {
    const dir = path.dirname(metadataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde métadonnées:', error);
    return false;
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔐 Debug Auth:');
  console.log('   Headers:', req.headers);
  console.log('   Auth Header:', authHeader);
  console.log('   Extracted Token:', token);
  console.log('   Expected Token: admin123');
  
  if (token !== 'admin123') {
    console.log('❌ Authentication failed');
    return res.status(401).json({ success: false, error: 'Token invalide' });
  }
  
  console.log('✅ Authentication successful');
  next();
}

// Routes API

// Route de test sans authentification
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API fonctionne !', 
    timestamp: new Date().toISOString() 
  });
});

// Route de santé avec authentification
app.get('/api/health', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Serveur en ligne et authentifié',
    timestamp: new Date().toISOString(),
    authenticated: true
  });
});

// GET /api/files - Lister les fichiers
app.get('/api/files', authenticateToken, (req, res) => {
  try {
    const files = loadMetadata();
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/files - Upload fichier
app.post('/api/files', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });
    }

    const fileData = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isEncrypted: true,
      category: req.body.category || 'other',
      tags: [],
      filePath: `uploads/${req.file.filename}`
    };

    const files = loadMetadata();
    files.push(fileData);
    
    if (saveMetadata(files)) {
      res.json({ success: true, data: fileData });
    } else {
      throw new Error('Erreur sauvegarde métadonnées');
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/files/upload-with-path - Upload fichier avec préservation du chemin
app.post('/api/files/upload-with-path', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });
    }

    const relativePath = req.body.relativePath || req.file.originalname;
    
    const fileData = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: relativePath, // Utiliser le chemin relatif comme nom
      type: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isEncrypted: true,
      category: req.body.category || 'other',
      tags: [],
      filePath: `uploads/${req.file.filename}`,
      originalPath: relativePath // Garder une trace du chemin original
    };

    const files = loadMetadata();
    files.push(fileData);
    
    if (saveMetadata(files)) {
      res.json({ success: true, data: fileData });
    } else {
      throw new Error('Erreur sauvegarde métadonnées');
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/files - Supprimer fichier
app.delete('/api/files', authenticateToken, (req, res) => {
  try {
    const fileId = req.query.id;
    if (!fileId) {
      return res.status(400).json({ success: false, error: 'ID fichier manquant' });
    }

    let files = loadMetadata();
    const fileIndex = files.findIndex(f => f.id === fileId);
    
    if (fileIndex === -1) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' });
    }

    const file = files[fileIndex];
    const filePath = path.join(__dirname, '../admin-files', file.filePath);
    
    // Supprimer le fichier physique
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer des métadonnées
    files.splice(fileIndex, 1);
    saveMetadata(files);

    res.json({ success: true, message: 'Fichier supprimé' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/download - Télécharger fichier
app.get('/api/download', authenticateToken, (req, res) => {
  try {
    const fileId = req.query.id;
    const files = loadMetadata();
    const file = files.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' });
    }

    const filePath = path.join(__dirname, '../admin-files', file.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Fichier physique non trouvé' });
    }

    res.download(filePath, file.name);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/preview - Prévisualiser fichier (auth via query parameter pour HTML)
app.get('/api/preview', (req, res) => {
  try {
    const fileId = req.query.id;
    const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    
    // Vérifier l'authentification
    if (!token || token !== ADMIN_TOKEN) {
      return res.status(401).json({ success: false, error: 'Token invalide' });
    }
    
    console.log(`📄 Prévisualisation demandée: ${fileId}`);
    
    const files = loadMetadata();
    const file = files.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' });
    }

    const filePath = path.join(__dirname, '../admin-files', file.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Fichier physique non trouvé' });
    }

    console.log(`✅ Prévisualisation: ${file.name} (${file.type})`);
    
    // Headers pour la prévisualisation
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/files/:id/category - Mettre à jour la catégorie d'un fichier
app.patch('/api/files/:id/category', authenticateToken, (req, res) => {
  try {
    const fileId = req.params.id;
    const { category } = req.body;

    console.log(`📝 PATCH /api/files/${fileId}/category - Mise à jour de catégorie`);
    console.log(`   - fileId: ${fileId}`);
    console.log(`   - category: ${category}`);

    if (!fileId) {
      return res.status(400).json({ success: false, error: 'ID fichier manquant' });
    }

    if (!category) {
      return res.status(400).json({ success: false, error: 'Catégorie manquante' });
    }

    // Vérifier que la catégorie est valide
    const validCategories = ['identity', 'finance', 'medical', 'legal', 'other', 'scolaire'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, error: 'Catégorie invalide' });
    }

    let files = loadMetadata();
    console.log(`   - Nombre de fichiers total: ${files.length}`);
    console.log(`   - IDs disponibles: ${files.map(f => `${f.id} (${f.name})`).join(', ')}`);
    
    const fileIndex = files.findIndex(f => f.id === fileId);
    console.log(`   - Index trouvé: ${fileIndex}`);
    
    if (fileIndex === -1) {
      console.log(`   - ❌ Fichier non trouvé avec ID: ${fileId}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Fichier non trouvé',
        debug: {
          requestedId: fileId,
          availableIds: files.map(f => f.id),
          totalFiles: files.length
        }
      });
    }

    // Mettre à jour la catégorie
    files[fileIndex].category = category;
    files[fileIndex].lastModified = new Date().toISOString();

    if (saveMetadata(files)) {
      console.log(`📝 Catégorie mise à jour: ${files[fileIndex].name} -> ${category}`);
      res.json({ 
        success: true, 
        data: files[fileIndex],
        message: 'Catégorie mise à jour avec succès'
      });
    } else {
      throw new Error('Erreur sauvegarde métadonnées');
    }

  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
  console.log(`📂 API accessible via: http://localhost:${PORT}/api/`);
  console.log(`🔗 Testez avec: http://localhost:${PORT}/api/files`);
  
  // Créer les dossiers nécessaires
  const adminDir = path.join(__dirname, '../admin-files');
  const uploadsDir = path.join(adminDir, 'uploads');
  
  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
    console.log(`📁 Dossier créé: ${adminDir}`);
  }
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`📁 Dossier créé: ${uploadsDir}`);
  }
});