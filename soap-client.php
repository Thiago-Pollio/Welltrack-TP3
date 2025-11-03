<?php

// Este archivo va fuera del proyecto, se guarda en htdocs

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
echo json_encode($response);
$options = [
'location' => 'http://localhost/soap-server.php',
'uri' => 'http://localhost/soap-server.php'

];

$client = new SoapClient(null, $options);

$response = $client->obtenerUsuarioPorEmail('test@mail.com');

print_r($response);
