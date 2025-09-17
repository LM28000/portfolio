<?php
/**
 * API principale pour la gestion des fichiers administratifs
 * Endpoints: GET, POST, DELETE /api/files.php
 */

require_once 'config.php';

// Vérifier l'authentification pour toutes les requêtes
checkAuth();

// Headers JSON
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGetFiles();
            break;
        
        case 'POST':
            handleUploadFile();
            break;
        
        case 'DELETE':
            handleDeleteFile();
            break;
        
        default:
            jsonResponse(['success' => false, 'error' => 'Méthode non supportée'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}

/**
 * GET - Récupérer la liste des fichiers
 */
function handleGetFiles() {
    $metadata = readMetadata();
    $storage = getStorageInfo($metadata);
    
    jsonResponse([
        'success' => true,
        'files' => $metadata['files'],
        'storage' => $storage
    ]);
}

/**
 * POST - Upload d'un nouveau fichier
 */
function handleUploadFile() {
    if (!isset($_FILES['file'])) {
        jsonResponse(['success' => false, 'error' => 'Aucun fichier fourni'], 400);
    }
    
    $file = $_FILES['file'];
    
    // Vérifications de sécurité
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'error' => 'Erreur lors de l\'upload'], 400);
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        jsonResponse(['success' => false, 'error' => 'Fichier trop volumineux (max 50MB)'], 400);
    }
    
    if (!isAllowedFile($file['name'])) {
        jsonResponse(['success' => false, 'error' => 'Type de fichier non autorisé'], 400);
    }
    
    // Générer un nom de fichier sécurisé
    $fileId = generateFileId();
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = $fileId . '_' . $safeName . '.' . $extension;
    $filePath = UPLOADS_DIR . '/' . $filename;
    
    // Déplacer le fichier
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        jsonResponse(['success' => false, 'error' => 'Impossible de sauvegarder le fichier'], 500);
    }
    
    // Préparer les métadonnées du fichier
    $fileData = [
        'id' => $fileId,
        'name' => $filename,
        'originalName' => $file['name'],
        'type' => $file['type'],
        'size' => $file['size'],
        'extension' => strtolower($extension),
        'category' => $_POST['category'] ?? 'documents',
        'description' => $_POST['description'] ?? '',
        'uploadDate' => date('c'),
        'lastModified' => date('c'),
        'isEncrypted' => (bool)($_POST['isEncrypted'] ?? false),
        'filePath' => 'uploads/' . $filename
    ];
    
    // Ajouter aux métadonnées
    $metadata = readMetadata();
    $metadata['files'][] = $fileData;
    
    if (!writeMetadata($metadata)) {
        // Si échec sauvegarde métadonnées, supprimer le fichier
        unlink($filePath);
        jsonResponse(['success' => false, 'error' => 'Erreur lors de la sauvegarde des métadonnées'], 500);
    }
    
    jsonResponse([
        'success' => true,
        'file' => $fileData,
        'message' => 'Fichier uploadé avec succès'
    ]);
}

/**
 * DELETE - Supprimer un fichier
 */
function handleDeleteFile() {
    $input = json_decode(file_get_contents('php://input'), true);
    $fileId = $input['id'] ?? null;
    
    if (!$fileId) {
        jsonResponse(['success' => false, 'error' => 'ID de fichier requis'], 400);
    }
    
    $metadata = readMetadata();
    $fileIndex = -1;
    $fileToDelete = null;
    
    // Trouver le fichier
    foreach ($metadata['files'] as $index => $file) {
        if ($file['id'] === $fileId) {
            $fileIndex = $index;
            $fileToDelete = $file;
            break;
        }
    }
    
    if ($fileIndex === -1) {
        jsonResponse(['success' => false, 'error' => 'Fichier non trouvé'], 404);
    }
    
    // Supprimer le fichier physique
    $filePath = ADMIN_FILES_DIR . '/' . $fileToDelete['filePath'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    
    // Supprimer des métadonnées
    array_splice($metadata['files'], $fileIndex, 1);
    writeMetadata($metadata);
    
    jsonResponse([
        'success' => true,
        'message' => 'Fichier supprimé avec succès'
    ]);
}
?>