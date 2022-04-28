<?php
    $inputJson = json_decode(file_get_contents("php://input"), true);

    $managerEmails = $inputJson['managerEmails'];
    $name = $inputJson['name'];
    $phone = $inputJson['phone'];
    $email = $inputJson['email'];
    $url = $inputJson['url'];
    $dateStart = $inputJson['dateStart'];
    $dateFinish = $inputJson['dateFinish'];
    $advType = $inputJson['advType'];
    $advFormat = $inputJson['advFormat'];

    $name = htmlspecialchars($name);
    $phone = htmlspecialchars($phone);
    $email = htmlspecialchars($email);
    $url = htmlspecialchars($url);
    $dateStart = htmlspecialchars($dateStart);
    $dateFinish = htmlspecialchars($dateFinish);
    $advType = htmlspecialchars($advType);
    $advFormat = htmlspecialchars($advFormat);

    $name = urldecode($name);
    $phone = urldecode($phone);
    $email = urldecode($email);
    $url = urldecode($url);
    $dateStart = urldecode($dateStart);
    $dateFinish = urldecode($dateFinish);
    $advType = urldecode($advType);
    $advFormat = urldecode($advFormat);

    $name = trim($name);
    $phone = trim($phone);
    $email = trim($email);
    $url = trim($url);
    $dateStart = trim($dateStart);
    $dateFinish = trim($dateFinish);
    $advType = trim($advType);
    $advFormat = trim($advFormat);


    $message = "<html><body>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>Имя: <b>".$name."</b></h3>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>Email: <b>".$email."</b></h3>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>Телефон: <b>".$phone."</b></h3>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>Период: <b>".$dateStart." - ".$dateFinish."</b></h3>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>Тип рекламы: <b>".$advType."</b></h3>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>Формат рекламы: <b>".$advFormat."</b></h3>\n";
    $message .= "<h3 style='margin:0; font-weight:normal'>\n<a href='".$url."'>Карта маршрутов заказа</a></h3>\n";
    $message .= "</body></html>";


    $subject = 'Предварительный расчёт';
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'From: R78 <cy24412@bitrix316.timeweb.ru>';
    $headers[] = 'Content-Type: text/html; charset=ISO-8859-1\r\n';
    // mail($to_email, $subject, $message, implode("\r\n", $headers));
    // mail($manager_email, $subject, $message, implode("\r\n", $headers));
    // mail($manager_email_second, $subject, $message, implode("\r\n", $headers));

    foreach ($managerEmails as $email) {
        mail($email, $subject, $message, implode("\r\n", $headers));
    }
