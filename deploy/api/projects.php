<?php
/**
 * REST API FOR PROJECTS
 * Path: /api/projects.php
 */
require_once 'db.php';

// SIMPLE PASSWORD PROTECTION
$admin_token = 'admin_secret_123'; // User MUST change this for security

$method = $_SERVER['REQUEST_METHOD'];

// AUTH CHECK (REQUIRED FOR POST/DELETE)
function isAuthorized() {
    global $admin_token;
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? ($_GET['auth'] ?? '');
    return $auth === $admin_token;
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM projects ORDER BY id DESC');
    $projects = $stmt->fetchAll();
    echo json_encode($projects);
    exit;
}

if ($method === 'POST') {
    if (!isAuthorized()) {
        http_response_code(401);
        echo json_encode(['error' => 'UNAUTHORIZED_ACCESS']);
        exit;
    }

    $title = $_POST['title'] ?? 'Fără nume';
    $desc = $_POST['description'] ?? '';
    $link = $_POST['link'] ?? '';
    $image_url = '';

    // IMAGE PROCESSING
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $unique_name = time() . '_' . uniqid() . '.' . $ext;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $unique_name)) {
            $image_url = 'uploads/' . $unique_name;
        }
    }

    $stmt = $pdo->prepare('INSERT INTO projects (title, description, image_url, link) VALUES (?, ?, ?, ?)');
    $stmt->execute([$title, $desc, $image_url, $link]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

if ($method === 'DELETE') {
    if (!isAuthorized()) {
        http_response_code(401);
        echo json_encode(['error' => 'UNAUTHORIZED_ACCESS']);
        exit;
    }

    $id = $_GET['id'] ?? null;
    if ($id) {
        // Find and delete the image file first
        $find = $pdo->prepare('SELECT image_url FROM projects WHERE id = ?');
        $find->execute([$id]);
        $p = $find->fetch();
        if ($p && $p['image_url']) {
            $file_path = $_SERVER['DOCUMENT_ROOT'] . '/' . $p['image_url'];
            if (file_exists($file_path)) unlink($file_path);
        }

        $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
    exit;
}
?>
