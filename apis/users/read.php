<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// includiamo database.php e libro.php per poterli usare
include_once '../config/database.php';
include_once '../models/users.php';

// creiamo un nuovo oggetto Database e ci colleghiamo al nostro database
$database = new Database();
$db = $database->getConnection();

// Creiamo un nuovo oggetto Libro
$Users = new Users($db);

// query products
$stmt = $Users->read();
$num = $stmt->rowCount();

// se vengono trovati libri nel database
if($num>0){

    // array di libri
    $users_arr = array();

    $users_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        extract($row);

        $user_item = array(
            "user_id" => $User_id,
            "email" => $Email,
            "name" => $Name,
            "provider" => $Provider,
            "provider_id" => $Provider_id,
            "provider_pic" => $Provider_pic,
            "token" => $Token,
            "condividi" => $Condividi
        );

        array_push($users_arr["records"], $user_item);
    }

    echo json_encode($users_arr);

} else {

    echo json_encode(
        array("message" => "Nessun utente trovato.")
    );
}

?>