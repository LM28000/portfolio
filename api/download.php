<?php
/**
 * API de téléchargement sécurisé des fichiers
 */

require_once 'config.php';

// Vérifier l'authentification via paramètre GET pour les téléchargements
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
$fileToDownload = null;

foreach ($metadata['files'] as $file) {
    if ($file['id'] === $fileId) {
        $fileToDownload = $file;
        break;
    }
}

if (!$fileToDownload) {
    http_response_code(404);
    die('Fichier non trouvé');
}

$filePath = ADMIN_FILES_DIR . '/' . $fileToDownload['filePath'];

if (!file_exists($filePath)) {
    http_response_code(404);
    die('Fichier physique non trouvé');
}

// Headers pour le téléchargement
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $fileToDownload['originalName'] . '"');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');

// Lire et envoyer le fichier
readfile($filePath);
exit();
?>