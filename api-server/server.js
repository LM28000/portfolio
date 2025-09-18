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
const archiver = require('archiver');

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

// POST /api/files/upload-with-path - Upload fichier avec nom personnalisé (sans chemin)
app.post('/api/files/upload-with-path', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });
    }

    // Utiliser le nom fourni ou extraire le nom du fichier sans chemin
    const providedName = req.body.relativePath || req.file.originalname;
    const fileName = providedName.includes('/') ? 
      providedName.split('/').pop() : 
      providedName;
    
    const fileData = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: fileName, // Utiliser seulement le nom du fichier (sans chemin)
      type: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isEncrypted: true,
      category: req.body.category || 'other',
      tags: [],
      filePath: `uploads/${req.file.filename}`,
      originalPath: providedName // Garder une trace du chemin original pour référence
    };

    console.log(`📁 Upload dossier: ${providedName} -> ${fileName}`);

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

// GET /api/download/category/:category - Télécharger tous les fichiers d'une catégorie en ZIP
app.get('/api/download/category/:category', authenticateToken, async (req, res) => {
  try {
    const category = req.params.category;
    console.log(`📦 Téléchargement ZIP catégorie: ${category}`);
    
    const files = loadMetadata();
    const categoryFiles = files.filter(f => f.category === category);
    
    if (categoryFiles.length === 0) {
      return res.status(404).json({ success: false, error: 'Aucun fichier trouvé dans cette catégorie' });
    }

    console.log(`📁 ${categoryFiles.length} fichier(s) trouvé(s) dans la catégorie ${category}`);

    // Créer l'archive ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression maximale
    });

    // Headers pour le téléchargement du ZIP
    const zipFileName = `${category}_documents_${new Date().toISOString().split('T')[0]}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

    // Pipe l'archive vers la réponse
    archive.pipe(res);

    // Ajouter chaque fichier à l'archive
    let addedFiles = 0;
    for (const file of categoryFiles) {
      const filePath = path.join(__dirname, '../admin-files', file.filePath);
      
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.name });
        addedFiles++;
        console.log(`  ✅ Ajouté: ${file.name}`);
      } else {
        console.log(`  ❌ Fichier manquant: ${file.name} (${filePath})`);
      }
    }

    if (addedFiles === 0) {
      return res.status(404).json({ success: false, error: 'Aucun fichier physique trouvé' });
    }

    // Finaliser l'archive
    archive.finalize();
    
    console.log(`📦 ZIP créé avec succès: ${addedFiles}/${categoryFiles.length} fichiers`);

  } catch (error) {
    console.error('Erreur lors de la création du ZIP:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/download/all-organized - Télécharger tous les fichiers organisés par dossiers en ZIP
app.get('/api/download/all-organized', authenticateToken, async (req, res) => {
  try {
    console.log(`📦 Téléchargement ZIP organisé complet`);
    
    const files = loadMetadata();
    
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: 'Aucun fichier trouvé' });
    }

    console.log(`📁 ${files.length} fichier(s) trouvé(s) pour l'archive organisée`);

    // Créer l'archive ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression maximale
    });

    // Headers pour le téléchargement du ZIP
    const zipFileName = `documents_organises_${new Date().toISOString().split('T')[0]}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

    // Pipe l'archive vers la réponse
    archive.pipe(res);

    // Grouper les fichiers par catégorie
    const filesByCategory = {};
    files.forEach(file => {
      const category = file.category || 'other';
      if (!filesByCategory[category]) {
        filesByCategory[category] = [];
      }
      filesByCategory[category].push(file);
    });

    // Ajouter chaque fichier à l'archive organisé par dossier
    let addedFiles = 0;
    for (const [category, categoryFiles] of Object.entries(filesByCategory)) {
      console.log(`📂 Dossier ${category}: ${categoryFiles.length} fichier(s)`);
      
      for (const file of categoryFiles) {
        const filePath = path.join(__dirname, '../admin-files', file.filePath);
        
        if (fs.existsSync(filePath)) {
          // Ajouter le fichier dans le bon dossier de catégorie
          const archivePath = `${category}/${file.name}`;
          archive.file(filePath, { name: archivePath });
          addedFiles++;
          console.log(`  ✅ Ajouté: ${archivePath}`);
        } else {
          console.log(`  ❌ Fichier manquant: ${category}/${file.name} (${filePath})`);
        }
      }
    }

    if (addedFiles === 0) {
      return res.status(404).json({ success: false, error: 'Aucun fichier physique trouvé' });
    }

    // Finaliser l'archive
    archive.finalize();
    
    console.log(`📦 ZIP organisé créé avec succès: ${addedFiles}/${files.length} fichiers dans ${Object.keys(filesByCategory).length} dossiers`);

  } catch (error) {
    console.error('Erreur lors de la création du ZIP organisé:', error);
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
    const validCategories = [
      'identity', 'finance', 'medical', 'legal', 'other', 
      'scolaire', 'logement', 'transport', 'sante', 'micro-entreprise'
    ];
    if (!validCategories.includes(category)) {
      console.log(`   - ❌ Catégorie invalide: ${category}. Catégories valides: ${validCategories.join(', ')}`);
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

// PUT /api/files/bulk-category - Mettre à jour la catégorie de plusieurs fichiers
app.put('/api/files/bulk-category', authenticateToken, (req, res) => {
  try {
    const { fileIds, category } = req.body;

    console.log(`📝 PUT /api/files/bulk-category - Mise à jour de catégorie en lot`);
    console.log(`   - fileIds: ${fileIds?.join(', ')}`);
    console.log(`   - category: ${category}`);

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Liste des IDs de fichiers manquante ou vide' });
    }

    if (!category) {
      return res.status(400).json({ success: false, error: 'Catégorie manquante' });
    }

    // Vérifier que la catégorie est valide
    const validCategories = [
      'identity', 'finance', 'medical', 'legal', 'other', 
      'scolaire', 'logement', 'transport', 'sante', 'micro-entreprise'
    ];
    if (!validCategories.includes(category)) {
      console.log(`   - ❌ Catégorie invalide: ${category}. Catégories valides: ${validCategories.join(', ')}`);
      return res.status(400).json({ success: false, error: 'Catégorie invalide' });
    }

    let files = loadMetadata();
    console.log(`   - Nombre de fichiers total: ${files.length}`);
    
    const updatedFiles = [];
    const notFoundIds = [];
    
    // Traiter chaque fichier
    for (const fileId of fileIds) {
      const fileIndex = files.findIndex(f => f.id === fileId);
      
      if (fileIndex === -1) {
        notFoundIds.push(fileId);
        console.log(`   - ❌ Fichier non trouvé avec ID: ${fileId}`);
      } else {
        // Mettre à jour la catégorie
        files[fileIndex].category = category;
        files[fileIndex].lastModified = new Date().toISOString();
        updatedFiles.push(files[fileIndex]);
        console.log(`   - ✅ Fichier mis à jour: ${files[fileIndex].name} -> ${category}`);
      }
    }

    if (notFoundIds.length > 0) {
      console.log(`   - ⚠️ Fichiers non trouvés: ${notFoundIds.join(', ')}`);
    }

    if (updatedFiles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Aucun fichier trouvé pour les IDs fournis',
        debug: {
          requestedIds: fileIds,
          notFoundIds: notFoundIds
        }
      });
    }

    if (saveMetadata(files)) {
      console.log(`📝 ${updatedFiles.length} catégorie(s) mise(s) à jour vers ${category}`);
      res.json({ 
        success: true, 
        data: updatedFiles,
        message: `${updatedFiles.length} fichier(s) mis à jour avec succès`,
        warning: notFoundIds.length > 0 ? `${notFoundIds.length} fichier(s) non trouvé(s)` : null
      });
    } else {
      throw new Error('Erreur sauvegarde métadonnées');
    }

  } catch (error) {
    console.error('Erreur mise à jour catégories en lot:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/files/:id/rename - Renommer un fichier
app.patch('/api/files/:id/rename', authenticateToken, (req, res) => {
  try {
    const fileId = req.params.id;
    const { newName } = req.body;

    console.log(`📝 PATCH /api/files/${fileId}/rename - Renommage de fichier`);
    console.log(`   - fileId: ${fileId}`);
    console.log(`   - newName: ${newName}`);

    if (!fileId) {
      return res.status(400).json({ success: false, error: 'ID fichier manquant' });
    }

    if (!newName || newName.trim() === '') {
      return res.status(400).json({ success: false, error: 'Nouveau nom manquant' });
    }

    // Nettoyer le nom (enlever caractères dangereux)
    const cleanName = newName.trim().replace(/[<>:"/\\|?*]/g, '_');
    if (cleanName !== newName.trim()) {
      console.log(`   - Nom nettoyé: "${newName.trim()}" -> "${cleanName}"`);
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

    const oldName = files[fileIndex].name;

    // Mettre à jour le nom
    files[fileIndex].name = cleanName;
    files[fileIndex].lastModified = new Date().toISOString();

    if (saveMetadata(files)) {
      console.log(`📝 Fichier renommé: "${oldName}" -> "${cleanName}"`);
      res.json({ 
        success: true, 
        data: files[fileIndex],
        message: 'Fichier renommé avec succès'
      });
    } else {
      throw new Error('Erreur sauvegarde métadonnées');
    }

  } catch (error) {
    console.error('Erreur renommage fichier:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// ENDPOINTS POUR LES NOTES
// ========================

// Chemin pour le fichier des notes
const notesFile = path.join(__dirname, '../admin-files/notes.json');

// Fonction pour charger les notes
function loadNotes() {
  try {
    if (fs.existsSync(notesFile)) {
      const data = fs.readFileSync(notesFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erreur chargement notes:', error);
    return [];
  }
}

// Fonction pour sauvegarder les notes
function saveNotes(notes) {
  try {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde notes:', error);
    return false;
  }
}

// GET /api/notes - Récupérer toutes les notes
app.get('/api/notes', authenticateToken, (req, res) => {
  try {
    const notes = loadNotes();
    console.log(`📖 ${notes.length} notes récupérées`);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Erreur récupération notes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/notes - Créer une nouvelle note
app.post('/api/notes', authenticateToken, (req, res) => {
  try {
    const { title, content, category, tags, priority, isPrivate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le titre et le contenu sont obligatoires' 
      });
    }

    const notes = loadNotes();
    const newNote = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      content: content.trim(),
      category: category || 'général',
      tags: tags || [],
      priority: priority || 'normal',
      isPrivate: isPrivate || false,
      isPinned: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);

    if (saveNotes(notes)) {
      console.log(`📝 Nouvelle note créée: "${title}"`);
      res.status(201).json({ success: true, data: newNote });
    } else {
      throw new Error('Erreur sauvegarde de la note');
    }

  } catch (error) {
    console.error('Erreur création note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/notes/:id - Mettre à jour une note
app.put('/api/notes/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const notes = loadNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Note non trouvée' 
      });
    }

    // Mettre à jour les champs fournis
    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      id, // Garder l'ID original
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;

    if (saveNotes(notes)) {
      console.log(`📝 Note mise à jour: "${updatedNote.title}"`);
      res.json({ success: true, data: updatedNote });
    } else {
      throw new Error('Erreur sauvegarde de la note');
    }

  } catch (error) {
    console.error('Erreur mise à jour note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/notes/:id - Supprimer une note
app.delete('/api/notes/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const notes = loadNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Note non trouvée' 
      });
    }

    const deletedNote = notes[noteIndex];
    notes.splice(noteIndex, 1);

    if (saveNotes(notes)) {
      console.log(`🗑️ Note supprimée: "${deletedNote.title}"`);
      res.json({ success: true, message: 'Note supprimée avec succès' });
    } else {
      throw new Error('Erreur sauvegarde des notes');
    }

  } catch (error) {
    console.error('Erreur suppression note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/notes/import - Importer des notes depuis un fichier JSON
app.post('/api/notes/import', authenticateToken, (req, res) => {
  try {
    const { notes: importedNotes } = req.body;

    if (!Array.isArray(importedNotes)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Format d\'import invalide' 
      });
    }

    const currentNotes = loadNotes();
    let addedCount = 0;

    importedNotes.forEach(noteData => {
      if (noteData.title && noteData.content) {
        const newNote = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: noteData.title.trim(),
          content: noteData.content.trim(),
          category: noteData.category || 'général',
          tags: noteData.tags || [],
          priority: noteData.priority || 'normal',
          isPrivate: noteData.isPrivate || false,
          isPinned: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        currentNotes.push(newNote);
        addedCount++;
      }
    });

    if (saveNotes(currentNotes)) {
      console.log(`📥 ${addedCount} notes importées`);
      res.json({ 
        success: true, 
        message: `${addedCount} notes importées avec succès`,
        data: { imported: addedCount }
      });
    } else {
      throw new Error('Erreur sauvegarde des notes importées');
    }

  } catch (error) {
    console.error('Erreur import notes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/notes/export - Exporter toutes les notes
app.get('/api/notes/export', authenticateToken, (req, res) => {
  try {
    const notes = loadNotes();
    const exportData = {
      exportDate: new Date().toISOString(),
      notesCount: notes.length,
      notes: notes
    };

    console.log(`📤 ${notes.length} notes exportées`);
    res.json({ success: true, data: exportData });

  } catch (error) {
    console.error('Erreur export notes:', error);
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