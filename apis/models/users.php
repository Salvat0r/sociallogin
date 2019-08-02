<?php
class Users {

	private $conn;
    private $table_name = "users";
    
	// proprietà di un libro
	public $User_id;
	public $Email;
    public $Name;
    public $Provider;
    public $Provider_id;
    public $Provider_pic;
	public $Token;
	public $Condividi;

	// costruttore
	public function __construct($db) {
		$this->conn = $db;
    }
        
	// READ
	function read() {
		// select all
		$query = "SELECT a.User_id, a.Email, a.Name, a.Provider, a.Provider_id, a.Provider_pic, a.Token FROM " . $this->table_name . " a ";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}
        
	// CREARE
	function create() {

		$Email=htmlspecialchars(strip_tags($this->Email));
		$Name=htmlspecialchars(strip_tags($this->Name));
		$Provider=htmlspecialchars(strip_tags($this->Provider));
		$Provider_id=htmlspecialchars(strip_tags($this->Provider_id));
		$Provider_pic=htmlspecialchars(strip_tags($this->Provider_pic));
		$Token=htmlspecialchars(strip_tags($this->Token));
		$Condividi=htmlspecialchars(strip_tags($this->Condividi));

		$query = "INSERT INTO " . $this->table_name . " 
			SET 
				Email=:email, Name=:name, Provider=:provider, Provider_id=:provider_id, Provider_pic=:provider_pic, Token=:token, Condividi=:condividi";
		$stmt = $this->conn->prepare($query);

		// binding
		$stmt->bindParam(":email", $Email, PDO::PARAM_STR, 300);
		$stmt->bindParam(":name", $Name, PDO::PARAM_STR, 200);
		$stmt->bindParam(":provider", $Provider, PDO::PARAM_STR, 50);
		$stmt->bindParam(":provider_id", $Provider_id, PDO::PARAM_STR, 200);
		$stmt->bindParam(":provider_pic", $Provider_pic, PDO::PARAM_STR, 200);
		$stmt->bindParam(":token", $Token, PDO::PARAM_STR, 500);
		$stmt->bindParam(":condividi", $Condividi, PDO::PARAM_INT);

		
		// execute query
		if($stmt->execute()){
			return true;
		}

    	return false;
	}

	// AGGIORNARE
	function update(){

		$query = "UPDATE " . $this->table_name . " SET condividi = :condividi, WHERE user_id = :user_id";

		$stmt = $this->conn->prepare($query);

		$this->user_id = htmlspecialchars(strip_tags($this->user_id));
		$this->condividi = htmlspecialchars(strip_tags($this->condividi));

		// binding
		$stmt->bindParam(":user_id", $this->user_id);
		$stmt->bindParam(":condividi", $this->condividi);

		// execute the query
		if($stmt->execute()){
			return true;
		}

		return false;
	}

	// CANCELLARE

}
    
?>