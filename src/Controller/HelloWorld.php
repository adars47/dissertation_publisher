<?php

namespace App\Controller;
use App\Kernel;
use Cloutier\PhpIpfsApi\IPFS;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Attribute\Route;
use Web3\Eth;


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
        echo($actualHash[1]);
        die;
    }

    #[Route('/pub')]
    public function publish()
    {
        $eth = new Eth("http://127.0.0.1:7545");
        var_dump($eth->eth_accounts());die;

        $fromAccount = "0x76F75F637C7eEFe2b0294F22a0a957C990412bb4";
        $toAccount = "0x7D378c0c7D5E046Fc1e9b95d5d4411FC4E6424f4";
        $eth->sendTransaction([
            'from' => $fromAccount,
            'to' => $toAccount,
            'value' => '0x1',
            'data' => '0x'.bin2hex("QmPDmLxkf2T1tErgEy5SnskGcTBRE4BeiyKMHpToihcffw")
        ], function ($err, $transaction) use ($eth, $fromAccount, $toAccount) {
            if ($err !== null) {
                echo 'Error: ' . $err->getMessage();
                return;
            }
            echo 'Tx hash: ' . $transaction . PHP_EOL;
        });
    }
}