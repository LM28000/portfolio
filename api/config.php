<?php
/**
 * Configuration de base pour l'API Admin Files
 */

// Configuration CORS pour le développement
header('Access-Control-Allow-Origin: http://localhost:5174'); // Port Vite mis à jour
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Répondre aux requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration des chemins
define('ADMIN_FILES_DIR', __DIR__ . '/../admin-files');
define('UPLOADS_DIR', ADMIN_FILES_DIR . '/uploads');
define('METADATA_FILE', ADMIN_FILES_DIR . '/metadata.json');

// Créer les répertoires s'ils n'existent pas
if (!is_dir(ADMIN_FILES_DIR)) {
    mkdir(ADMIN_FILES_DIR, 0755, true);
}
if (!is_dir(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}

// Configuration de sécurité
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'zip']);
define('ADMIN_TOKEN', 'admin123'); // En production, utilisez un token sécurisé

/**
 * Vérifier l'authentification
 */
function checkAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token d\'authentification requis']);
        exit();
    }
    
    $token = substr($authHeader, 7); // Enlever "Bearer "
    if ($token !== ADMIN_TOKEN) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Token invalide']);
        exit();
    }
}

/**
 * Lire les métadonnées des fichiers
 */
function readMetadata() {
    if (!file_exists(METADATA_FILE)) {
        return ['files' => [], 'lastUpdate' => date('c')];
    }
    
    $content = file_get_contents(METADATA_FILE);
    return json_decode($content, true) ?: ['files' => [], 'lastUpdate' => date('c')];
}

/**
 * Écrire les métadonnées des fichiers
 */
function writeMetadata($metadata) {
    $metadata['lastUpdate'] = date('c');
    return file_put_contents(METADATA_FILE, json_encode($metadata, JSON_PRETTY_PRINT));
}

/**
 * Générer un ID unique pour un fichier
 */
function generateFileId() {
    return uniqid() . '_' . bin2hex(random_bytes(8));
}

/**
 * Vérifier l'extension du fichier
 */
function isAllowedFile($filename) {
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return in_array($extension, ALLOWED_EXTENSIONS);
}

/**
 * Calculer les informations de stockage
 */
function getStorageInfo($metadata) {
    $totalSize = 0;
    $fileCount = count($metadata['files']);
    
    foreach ($metadata['files'] as $file) {
        $totalSize += $file['size'];
    }
    
    return [
        'used' => $totalSize,
        'total' => 100 * 1024 * 1024, // 100MB par défaut
        'count' => $fileCount
    ];
}

/**
 * Répondre avec du JSON
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}
?>