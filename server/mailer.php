<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load environment variables from .env file if it exists
if (file_exists('.env')) {
    $lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && !str_starts_with($line, '#')) {
            [$key, $value] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value, '"\'');
        }
    }
}

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Allow both CLI and POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit;
}
try {
    // Read JSON body
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);

    // Basic validation (you should improve this for production)
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        exit;
    }

    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USERNAME'] ?? '';
    $mail->Password   = $_ENV['SMTP_PASSWORD'] ?? '';
    $mail->SMTPSecure = $_ENV['SMTP_SECURE'] ?? PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $_ENV['SMTP_PORT'] ?? 587;

    // Recipients
    $mail->setFrom($_ENV['SMTP_FROM_EMAIL'] ?? $_ENV['SMTP_USERNAME'], $_ENV['SMTP_FROM_NAME'] ?? 'Website Contact Form');
    $mail->addAddress($_ENV['RECIPIENT_EMAIL'] ?? $_ENV['SMTP_USERNAME']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Nuovo Contatto dal sito web';
    $mail->Body    = "
        <strong>Name:</strong> " . htmlspecialchars($data['name']) . "<br>
        <strong>Surname:</strong> " . htmlspecialchars($data['surname']) . "<br>
        <strong>Email:</strong> " . htmlspecialchars($data['email']) . "<br>
        <strong>Message:</strong><br>" . nl2br(htmlspecialchars($data['message'])) . "
    ";

    $mail->send();
    echo json_encode(['message' => 'Message sent successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
