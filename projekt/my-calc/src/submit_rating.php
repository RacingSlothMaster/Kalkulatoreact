<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_log("Received rating: " . file_get_contents('php://input'));

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kalkulatoreact_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['rating'])) {
    $rating = $data['rating'];

    $stmt = $conn->prepare("INSERT INTO ratings (rating) VALUES (?)");
    $stmt->bind_param("i", $rating);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Rating saved successfully"]);
    } else {
        echo json_encode(["error" => "Failed to save rating"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Rating is required"]);
}

$conn->close();
?>