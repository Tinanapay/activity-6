<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // safer than *
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit; // respond instantly
}

include 'db.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if ($data === null) {
    $error = json_last_error_msg();
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON: " . $error,
        "error_code" => json_last_error(),
        "raw_length" => strlen($raw)
    ]);
    exit;
}

if (empty($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Empty JSON object received"
    ]);
    exit;
}

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Username, email, and password are required"
    ]);
    exit;
}

$password = md5($password);

$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("sss", $username, $email, $password);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully"
    ]);
} else {
    $error = $stmt->error;
    $errno = $stmt->errno;
    
    // Handle duplicate key (email or username already exists)
    if ($errno == 1062) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Email or username already exists"
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Registration failed: " . $error
        ]);
    }
}

$stmt->close();
?>
