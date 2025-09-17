<?php
/**
 * API d'aperçu des fichiers (pour images, PDF, etc.)
 */

require_once 'config.php';

// Vérifier l'authentification via paramètre GET
$token = $_GET['token'] ?? '';
if ($token !== ADMIN_TOKEN) {
    http_response_code(403);
    die('Accès non autorisé');
}

$fileId = $_GET['id'] ?? '';
if (!$fileId) {
    http_response_code(400);
    die('ID de fichier requis');
}

// Lire les métadonnées pour trouver le fichier
$metadata = readMetadata();
$fileToPreview = null;

foreach ($metadata['files'] as $file) {
    if ($file['id'] === $fileId) {
        $fileToPreview = $file;
        break;
    }
}

if (!$fileToPreview) {
    http_response_code(404);
    die('Fichier non trouvé');
}

$filePath = ADMIN_FILES_DIR . '/' . $fileToPreview['filePath'];

if (!file_exists($filePath)) {
    http_response_code(404);
    die('Fichier physique non trouvé');
}

// Définir le Content-Type approprié
$mimeType = $fileToPreview['type'];
if (empty($mimeType)) {
    // Fallback basé sur l'extension
    $extension = strtolower($fileToPreview['extension']);
    $mimeTypes = [
        'pdf' => 'application/pdf',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'txt' => 'text/plain',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
}

// Headers pour l'aperçu
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: public, max-age=3600');
header('Content-Disposition: inline; filename="' . $fileToPreview['originalName'] . '"');

// Lire et envoyer le fichier
readfile($filePath);
exit();
?>