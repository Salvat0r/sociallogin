<?php

$requestMethod = $_SERVER["REQUEST_METHOD"];

include_once '../config/database.php';
include_once '../models/users.php';

switch($requestMethod) {
    case 'OPTIONS':	    
        header("HTTP/1.0 200 Ok");     
        http_response_code(200);
        header('Access-Control-Allow-Origin: http://localhost:3000/');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        break;
	case 'POST':	
        header('Access-Control-Allow-Origin: http://localhost:3000/');
        header("Content-Type: application/json; charset=UTF-8");
        header('Access-Control-Allow-Methods: POST');
        header("Access-Control-Max-Age: 3600");
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

        $database = new Database();

        $db = $database->getConnection();

        $Users = new Users($db);

        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->email) &&
            !empty($data->name) &&
            !empty($data->provider) &&
            !empty($data->provider_id) &&
            !empty($data->provider_pic) &&
            !empty($data->token) 
        ) {

            $Users->Email = $data->email;
            $Users->Name = $data->name;
            $Users->Provider = $data->provider;
            $Users->Provider_id = $data->provider_id;
            $Users->Provider_pic = $data->provider_pic;
            $Users->Token = $data->token;
            $Users->Condividi = $data->condividi;

            if( $Users->create() ) {
                http_response_code(201);
                echo json_encode(array("utente" => $data));

            } else {
                //503 servizio non disponibile
                http_response_code(503);
                echo json_encode(array("message" => "Impossibile creare utente."));
            }

        } else{
            //400 bad request
            http_response_code(400);
            echo json_encode(array("message" => "Impossibile creare utente i dati sono incompleti."));
        }

		break;
	default:
    header("HTTP/1.0 405 Method Not Allowed");
    http_response_code(405);
    echo json_encode(array("message" => $requestMethod));
    break;
}

?>

