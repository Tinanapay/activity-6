<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
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

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit;
}

$password = md5($password);

$stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = ? AND password = ?");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("ss", $email, $password);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Query failed: " . $stmt->error
    ]);
    exit;
}

$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user_id" => $user['id'],
        "username" => $user['username']
    ]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}

$stmt->close();
?>
