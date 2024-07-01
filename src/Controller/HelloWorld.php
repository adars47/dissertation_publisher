<?php

namespace App\Controller;
use App\Kernel;
use Cloutier\PhpIpfsApi\IPFS;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Attribute\Route;
use Web3\Eth;
use Web3\Net;
use Web3\Utils;
use Web3\Web3;


class HelloWorld extends AbstractController
{
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

    #[Route('/submit', methods: ['POST'])]
    public function submit(Request $request)
    {
        header('Access-Control-Allow-Origin: *');
        $patient_pub = $request->get('patient_pub_k',null);
        $doctor_pub = $request->get('doctor_pub_k',null);
        $doctor_private = $request->get('doctor_pri_k',null);
        $doctorAccount = $request->get('doctor_account',null);
        $patientAccount = $request->get('patient_account',null);

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
        $this->publishToBlockchain($doctorAccount,$patientAccount,$fileLocation,$response);
        return $response;
    }

    private function publishToBlockchain($from,$to,$hash, $response)
    {
        $eth = new Eth("http://host.docker.internal:7545");

        $fromAccount = $from;
        $toAccount = $to;
        $eth->sendTransaction([
            'from' => $fromAccount,
            'to' => $toAccount,
            'value' => '0x1',
            'data' => '0x'.bin2hex($hash)
        ], function ($err, $transaction) use ($eth, $fromAccount, $toAccount, $response) {
            if ($err !== null) {
                echo 'Error: ' . $err->getMessage();
                return;
            }
            $response->setContent($transaction);
        });
    }
}