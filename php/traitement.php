<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
    $email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
    $message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';
    
    // Your email address where you want to receive messages
    $to = "01.janvier.00@gmail.com";
    
    // Email subject
    $subject = "New Contact Form Message from $name";
    
    // Email body
    $body = "You have received a new message from your website contact form.\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Message:\n$message\n";
    
    // Email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Success - redirect back to contact page with success message
        header("Location: contact.html?status=success");
        exit();
    } else {
        // Error - redirect back with error message
        header("Location: contact.html?status=error");
        exit();
    }
} else {
    // If someone tries to access this file directly, redirect to contact page
    header("Location: contact.html");
    exit();
}
?>