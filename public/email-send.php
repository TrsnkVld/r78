<?php
$inputJson = json_decode(file_get_contents("php://input"), true);

$managerEmails = $inputJson['managerEmails'];
$name = $inputJson['name'];
$phone = $inputJson['phone'];
$email = $inputJson['email'];
$region = $inputJson['region'];
$metro = $inputJson['metro'];
$routes = $inputJson['routes'];
$vehicles = $inputJson['vehicles'];
$grp = $inputJson['grp'];
$ots = $inputJson['ots'];
$url = $inputJson['url'];
$urlForManager = $inputJson['urlForManager'];

$name = htmlspecialchars($name);
$phone = htmlspecialchars($phone);
$email = htmlspecialchars($email);
$region = htmlspecialchars($region);
$metro = htmlspecialchars($metro);
$routes = htmlspecialchars($routes);
$vehicles = htmlspecialchars($vehicles);
$grp = htmlspecialchars($grp);
$ots = htmlspecialchars($ots);
$url = htmlspecialchars($url);
$urlForManager = htmlspecialchars($urlForManager);

$name = urldecode($name);
$phone = urldecode($phone);
$email = urldecode($email);
$region = urldecode($region);
$metro = urldecode($metro);
$routes = urldecode($routes);
$vehicles = urldecode($vehicles);
$grp = urldecode($grp);
$ots = urldecode($ots);
$url = urldecode($url);
$urlForManager = urldecode($urlForManager);

$name = trim($name);
$phone = trim($phone);
$email = trim($email);
$region = trim($region);
$metro = trim($metro);
$routes = trim($routes);
$vehicles = trim($vehicles);
$grp = trim($grp);
$ots = trim($ots);
$url = trim($url);
$urlForManager = trim($urlForManager);

$message = array();

for ($i = 0; $i < 2; $i++) {
    $messageItem = "<html><body>\n";
    if ($i==0) {
        $messageItem .= "<h3 style='margin:0; font-weight:normal'><strong>Добрый день, $name!</strong></h3>\n";
        $messageItem .= "\n";
    }
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>".($i==0 ? 'По Вашему запросу на сайте r-78.net' : 'По запросу клиента на сайте')." сформирована карта маршрутов.</h3><br/>\n";
    $messageItem .= "\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>".($i==0 ? 'Вами выбрано:' : 'Статистика:')."</h3>\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>- " . $region . "</h3>\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>- " . $metro . "</h3>\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>- " . $routes . "</h3>\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>- " . $grp . "</h3>\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>- " . $ots . "</h3><br/>\n";
    $messageItem .= "\n";
    $messageItem .= "\n";
    $messageItem .= "<h3 style='margin:0; font-weight:normal'>\n<a href='".($i==0 ? $url : $urlForManager)."'>Карта маршрутов заказа</a></h3><br/>\n";
    $messageItem .= "<a href='//r-78.net/'><img src='http://map.r-78.net/logo.png' /></a>\n";
    $messageItem .= "</body></html>";

    $message[] = $messageItem;
}


$client_email = $email;


$subject = 'Статистика';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'From: R78 <cy24412@bitrix316.timeweb.ru>';
$headers[] = 'Content-Type: text/html; charset=ISO-8859-1\r\n';

//mail($test, $subject, $message, implode("\r\n", $headers));
// mail($manager_email, $subject, $message, implode("\r\n", $headers));
// mail($manager_email_second, $subject, $message, implode("\r\n", $headers));

mail($client_email, $subject, $message[0], implode("\r\n", $headers));

foreach ($managerEmails as $email) {
    mail($email, $subject, $message[1], implode("\r\n", $headers));
}
