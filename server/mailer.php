<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
    $mail->Host       = 'smtp.example.com'; // SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your_email@example.com'; // Your email address
    $mail->Password   = 'your_app_password';      // Your App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('your_email@example.com', 'Website Contact Form');
    $mail->addAddress('recipient@example.com');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
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
