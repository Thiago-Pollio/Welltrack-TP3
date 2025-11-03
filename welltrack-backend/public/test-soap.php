<?php
$client = new SoapClient(null, [
    'location' => 'http://example.com',
    'uri' => 'http://example.com'
]);
echo "SOAP está funcionando correctamente.";
?>