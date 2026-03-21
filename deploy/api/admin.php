<?php
/**
 * STANDALONE PHP ADMIN PANEL
 * Path: /api/admin.php
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db.php';

// LOGIN SETUP
session_start();
$admin_token = 'admin_secret_123'; // SAME AS IN projects.php

// PASSWORD PROTECTION
if (isset($_POST['password'])) {
    if ($_POST['password'] === $admin_token) {
        $_SESSION['admin_auth'] = true;
    } else {
        $error = "Parolă incorectă!";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

if (!isset($_SESSION['admin_auth'])) {
    ?>
    <!DOCTYPE html>
    <html lang="ro">
    <head>
        <meta charset="UTF-8"><title>Admin Login | roby.media</title>
        <style>
            body { background: #0a0a0a; color: #fff; font-family: 'Segoe UI', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
            .login-box { background: #1a1a1a; padding: 2rem; border-radius: 12px; border: 1px solid #333; text-align: center; }
            input { width: 100%; padding: 0.8rem; margin: 1rem 0; border: 1px solid #444; background: #000; color: #fff; border-radius: 6px; box-sizing: border-box; }
            button { width: 100%; padding: 0.8rem; background: #7B61FF; border: none; color: #fff; cursor: pointer; border-radius: 6px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Admin Login</h2>
            <?php if (isset($error)) echo "<p style='color:#ff4444'>$error</p>"; ?>
            <form method="POST">
                <input type="password" name="password" placeholder="Parola secretă..." required autofocus>
                <button type="submit">Autentificare</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// ACTION: ADD PROJECT
if (isset($_POST['action']) && $_POST['action'] === 'add') {
    $title = $_POST['title'];
    $desc = $_POST['description'];
    $link = $_POST['link'];
    $image_url = '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $upload_dir = '../uploads/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
        
        $unique_name = time() . '_' . uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $unique_name)) {
            $image_url = 'uploads/' . $unique_name;
        }
    }

    $stmt = $pdo->prepare('INSERT INTO projects (title, description, image_url, link) VALUES (?, ?, ?, ?)');
    $stmt->execute([$title, $desc, $image_url, $link]);
    header("Location: admin.php");
    exit;
}

// ACTION: DELETE
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    header("Location: admin.php");
    exit;
}

// FETCH PROJECTS
$stmt = $pdo->query('SELECT * FROM projects ORDER BY id DESC');
$projects = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8"><title>Admin Panel | roby.media</title>
    <style>
        body { background: #000; color: #fff; font-family: 'Inter', sans-serif; display: grid; grid-template-columns: 350px 1fr; height: 100vh; margin: 0; }
        aside { background: #0d0d0d; border-right: 1px solid #222; padding: 2rem; }
        main { padding: 3rem; overflow-y: auto; }
        .form-group { margin-bottom: 1.5rem; }
        input, textarea { width: 100%; padding: 0.8rem; border: 1px solid #333; background: #050505; color: #fff; border-radius: 10px; box-sizing: border-box; }
        button { background: #7B61FF; color: #fff; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; transition: 0.2s; font-weight: bold; width: 100%; border: 1px solid rgba(123, 97, 255, 0.4); }
        button:hover { background: #5a4ac7; }
        .project-card { display: flex; align-items: center; background: #111; border: 1px solid #222; border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; }
        .project-thumb { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; margin-right: 1.5rem; background: #222; }
        .delete-btn { color: #ff4444; border: 1px solid #442222; background: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; width: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .live-gradient { background: linear-gradient(90deg, #7B61FF, #BF5AFF); -webkit-background-clip: text; color: transparent; font-weight: bold; }
    </style>
</head>
<body>
    <aside>
        <h2 class="live-gradient">Dashboard</h2>
        <p style="color:#666; font-size: 0.8rem">roby.media v2 (Spaceship)</p>
        <br>
        <form method="POST" enctype="multipart/form-data">
            <input type="hidden" name="action" value="add">
            <div class="form-group"><label>Titlu Proiect</label><input type="text" name="title" required placeholder="Ex: Aftermovie 2026"></div>
            <div class="form-group"><label>Descriere</label><textarea name="description" rows="3" placeholder="Scurtă descriere..."></textarea></div>
            <div class="form-group"><label>Link (URL)</label><input type="text" name="link" placeholder="Youtube / Site Link"></div>
            <div class="form-group"><label>Imagine (Thumbnail)</label><input type="file" name="image" accept="image/*"></div>
            <button type="submit">Adaugă Proiect Nou</button>
        </form>
        <br>
        <a href="?logout=1" style="color: #666; font-size: 0.8rem; text-decoration: none;">Deconectare</a>
    </aside>

    <main>
        <div class="header">
            <h1 style="margin:0; text-transform: uppercase; font-size: 2.5rem">PROIECTE <span class="live-gradient">ACTIVE</span></h1>
            <span style="opacity: 0.4">Total: <?= count($projects) ?></span>
        </div>

        <div class="project-list">
            <?php foreach ($projects as $p): ?>
            <div class="project-card">
                <img src="/<?= htmlspecialchars($p['image_url'] ?: 'hero_bg.png') ?>" class="project-thumb">
                <div style="flex:1">
                    <h3 style="margin:0 0 5px 0"><?= htmlspecialchars($p['title']) ?></h3>
                    <p style="margin:0; opacity: 0.5; font-size: 0.9rem"><?= htmlspecialchars($p['description']) ?></p>
                </div>
                <a href="?delete=<?= $p['id'] ?>" class="delete-btn" onclick="return confirm('Ștergi proiectul #<?= $p['id'] ?>?')">Șterge</a>
            </div>
            <?php endforeach; ?>
            <?php if (empty($projects)) echo "<p style='color:#666'>Nu există proiecte active.</p>"; ?>
        </div>
    </main>
</body>
</html>
