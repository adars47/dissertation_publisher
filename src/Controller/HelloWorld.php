<?php

namespace App\Controller;

use Cloutier\PhpIpfsApi\IPFS;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Web3\Eth;


class HelloWorld extends AbstractController
{
    private $files = [];
    #[Route('/ada')]
    public function upload()
    {
        try {
            $ipfs = new IPFS("127.0.0.1", "8080", "5001");
            $hash = $ipfs->add("Hello world");
            echo($ipfs->cat($hash));die;
        }
        catch (\Exception $exception)
        {
            var_dump($exception->getMessage());die;
        }

    }

    #[Route('/getFile', methods: ['POST'])]
    public function getFile(Request $request)
    {
        $response = new JsonResponse();
        $json = json_decode($request->getContent(),true);
        if($json === null || !isset($json['filePath']))
        {
            $response->setStatusCode(404);
            return $response;
        }
        $filepath = $json['filePath'];
        if(!file_exists($filepath))
        {
            $response->setStatusCode(404);
            return $response;
        }
        return new BinaryFileResponse($filepath);
    }

    #[Route('/getFilePath')]
    public function getFilePath(Request $request)
    {
        header("Access-Control-Expose-Headers: X-Signed-Enc-Key");
        $response = new JsonResponse();
        try {
            $tmpir = time();
            $filepath = $request->query->get('filepath');
            if($filepath === null || $filepath === "")
            {
                $response = new JsonResponse();
                $response->setStatusCode(400);
                return $response;
            }
            $filepath = hex2bin($filepath);
            $decoded = json_decode($filepath,true);
            $filepath = $decoded['hash'];
            $signedEncKey = $decoded['signedEncryptionKey'];
            $base_folder = dirname(__DIR__)."/../tmp/".$tmpir;
            $command = sprintf("mkdir %s && cd %s && ipfs get %s --api /dns4/ipfs0/tcp/5001",$base_folder,$base_folder,$filepath);
            $output = shell_exec($command);
            $filescan = scandir($base_folder);
            $mainfolder = $base_folder."/".$filescan[2];
            $this->map_recursively($mainfolder);
            $response->setStatusCode(200);
            $response->headers->set('X-SIGNED-ENC-KEY', $signedEncKey);
            $response->setContent(json_encode($this->files));
            return $response;
        }
        catch (\Exception $exception)
        {
            $response->setStatusCode(500);
            return $response;
        }
    }

    private function map_recursively($currentDir)
    {
        if (is_dir($currentDir)) {

            $files = glob($currentDir . '*', GLOB_MARK); //GLOB_MARK adds a slash to directories returned

            foreach ($files as $file) {
                $this->map_recursively($file);
            }

        } elseif (is_file($currentDir)) {
            $this->files[] = $currentDir;
        }
    }

    #[Route('/submit', methods: ['POST'])]
    public function submit(Request $request)
    {
        $patient_pub = $request->get('patient_pub_k',null);
        $doctor_pub = $request->get('doctor_pub_k',null);
        $doctor_private = $request->get('doctor_pri_k',null);
        $doctorAccount = $request->get('doctor_account',null);
        $patientAccount = $request->get('patient_account',null);
        $signedEncryptionKey = $request->get('signed_encryption_key',null);

        $base_folder = dirname(__DIR__)."/../tmp/".$patient_pub;
        /**
         * @var File $file
         */
        foreach($request->files as $key=>$file)
        {
            $type = explode("_",$key)[0];
            $file->move($base_folder."/".$type."/",$file->getClientOriginalName());
        }

        $command = sprintf("ipfs add -r %s/ --api /dns4/ipfs0/tcp/5001",$base_folder);
        $output = shell_exec($command);
        $output = explode(PHP_EOL,$output);
        $hash = $output[count($output)-2];
        $actualHash = explode(" ",$hash);
        $fileLocation = $actualHash[1];

        $response = new JsonResponse();
        $response->setStatusCode(200);
        $this->publishToBlockchain($doctorAccount,$patientAccount,$fileLocation,$signedEncryptionKey,$response);
        return $response;
    }

    private function publishToBlockchain($from,$to,$hash, $signedEncryptionKey, $response)
    {
        $eth = new Eth("http://host.docker.internal:7545");

        $fromAccount = $from;
        $toAccount = $to;
        $eth->sendTransaction([
            'from' => $fromAccount,
            'to' => $toAccount,
            'value' => '0x1',
            'data' => '0x'.bin2hex(json_encode(["hash"=>$hash,'signedEncryptionKey'=>$signedEncryptionKey]))
        ], function ($err, $transaction) use ($eth, $fromAccount, $toAccount, $response) {
            if ($err !== null) {
                echo 'Error: ' . $err->getMessage();
                return;
            }
            $response->setContent($transaction);
        });
    }
}