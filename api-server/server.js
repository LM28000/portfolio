const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.API_PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

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

// GET /api/preview - Prévisualiser fichier
app.get('/api/preview', authenticateToken, (req, res) => {
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

    res.setHeader('Content-Type', file.type);
    res.sendFile(filePath);

  } catch (error) {
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