<?php
// include $_SERVER['DOCUMENT_ROOT'].'.\session.php';
session_start();
$webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";

if (isset($_POST["username"]) && isset($_POST["password"]) && trim($_POST["username"]) != "" && $_POST["password"] != "") {
    $biousername = $_POST["username"];
    $password = $_POST["password"];

    $param = array("bioUserName" => $biousername, "password" => $password, "accessMode" => 0);

    $soap = new SOAPClient($webservice);

    $result = $soap->AuthenticateEmployee($param)->AuthenticateEmployeeResult;

    // echo '<pre>';
    // var_dump($result);
    // echo '</pre>';

$code = $result->Code;
$canAccess = $result->CanAccess;
$errorMessage = $result->Message;
$userType = $result->UserType;


if ($canAccess == 1) {
    if (isset($result->Account)) {
        $account = $result->Account;
        $name = $account->FirstName." ".substr($account->MiddleName,0,1).". ".$account->LastName;

        $_SESSION["user"] = $account->BiometricID;          
        $_SESSION["name"] = $account->FullName;
        $_SESSION["section"] = $account->Section;
        $_SESSION["division"] = $account->Division; 
        $_SESSION["password"] = $password;     
        $_SESSION["Authorized"] = "Yes";

        // include 'config.php';

        //     $pdo = new PDO("sqlsrv:Server=$host;Database=$dbname", $user, $password);
        //     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        //     if (isset($_SESSION["user"])) {
        //         $bioIDToCheck = $_SESSION["user"];
                
        //         $countQuery = "SELECT COUNT(*) AS rowCounts FROM dbo.Admin WHERE bioID = :bioID";
        //         $stmtCount = $pdo->prepare($countQuery);
        //         $stmtCount->bindParam(':bioID', $bioIDToCheck);
        //         $stmtCount->execute();
        //         $rowCountResult = $stmtCount->fetch(PDO::FETCH_ASSOC);

        //         if ($rowCountResult['rowCounts'] > 0) {
        //             $_SESSION["Admin"] = 1;
        //         } else {
        //             $_SESSION["Admin"] = 0;
        //         }
        //     }

        echo "/views/home.php";
    }
}
else {
    header("location:../../Login.php?error=".$code);
}

}else {
    header("location:../../Login.php?error=999");
}


?>