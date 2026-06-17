

<?php



/* ---------------- CORS ---------------- */

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: POST, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json; charset=UTF-8");



/* ---------------- OPTIONS REQUEST ---------------- */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    exit();

}



/* ---------------- ERROR REPORTING ---------------- */

/* Disable in production */

error_reporting(E_ALL);

ini_set('display_errors', 1);



/* ---------------- POST ONLY ---------------- */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([

        "status" => "error",

        "message" => "Invalid request method"

    ]);

    exit();

}

/* ---------------- SANITIZE INPUT ---------------- */

function clean_input($value)

{

    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');

}



$type      = clean_input($_POST['type'] ?? '');
$name      = clean_input($_POST['name'] ?? '');
$email     = clean_input($_POST['email'] ?? '');
$phone     = clean_input($_POST['phone'] ?? '');
$company   = clean_input($_POST['company'] ?? '');
$revenue   = clean_input($_POST['revenue'] ?? '');
$pain      = clean_input($_POST['pain'] ?? '');


/* ---------------- VALIDATION ---------------- */

if (

    empty($name) ||

    empty($email) ||

    empty($phone) ||

    empty($company)

) {

    echo json_encode([

        "status" => "error",

        "message" => "Required fields are missing"

    ]);

    exit();

}



if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([

        "status" => "error",

        "message" => "Invalid email address"

    ]);

    exit();

}



/* ---------------- DATE ---------------- */

date_default_timezone_set("Asia/Kolkata");

$submittedAt = date("d-m-Y h:i A");



/* ---------------- MAIL CONFIG ---------------- */

$to = "sriethiraj@getnos.io,seetharaman@getnos.io";



$subject = "New Hoisst Lead Enquiry";



/* ---------------- EMAIL BODY ---------------- */

$message  = "NEW HOISST LEAD\n\n";



$message .= "Business Type: $type\n";

$message .= "Name: $name\n";

$message .= "Company: $company\n";

$message .= "Email: $email\n";

$message .= "Phone: $phone\n";

$message .= "Revenue: $revenue\n";

$message .= "Pain Point: $pain\n";


$message .= "Submitted At: $submittedAt\n";



/* ---------------- MAIL HEADERS ---------------- */

$headers  = "MIME-Version: 1.0\r\n";

$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$headers .= "From: Hoisst <hello@getnos.io>\r\n";

$headers .= "Reply-To: $email\r\n";

$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";



/* ---------------- SEND MAIL ---------------- */
file_put_contents(
    "debug.txt",
    print_r($_POST, true)
);
$mailSent = mail($to, $subject, $message, $headers);



if ($mailSent) {

    echo json_encode([
        "status" => "success",
        "message" => "Form submitted successfully",
        "redirect" => "/https://getnos.io/hossit/schedule"
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Mail sending failed"
    ]);

}


exit();



?>

