<?php

namespace App\Controller;

use DateTime;
use DateInterval;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class SubscriptionController extends BaseController
{
    /**
     * @Route("/subscription", name="subscription_subscription")
     */
    public function subscription()
    {
        if ($this->session->get('user')) {
            $vars['flash'] = '';
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));
            $vars['extend'] = "ado" . "/navbar.html.twig";

            if (!empty($_POST)) {
                $user = $this->session->get('user');
                //$apikey = $this->em->getRepository(Param::class)->findBy(['name' => 'doli_apikey']);
                $apikey = "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v";
                //$url = $this->em->getRepository(Param::class)->findBy(['name' => 'doli_base_url']);
                $url = "http://dolilocal/htdocs/api/index.php/";
                //$prix = $this->em->getRepository(Param::class)->findBy(['name' => 'prix_abo']);
                $prix = 5;

                $client_id = $user->getSocid();

                if (empty($user->getSocid())) {
                    //Création du nouveau client s'il n'est pas déjà enregistré dans Dolibarr
                    $name = $user->getFirstName() . " " . $user->getName();
                    $name = ($user->getTitle() == "Dr") ? "Dr " . $name : $name;
                    $name = ($user->getTitle() == "Pr") ? "Pr " . $name : $name;

                    $address = ($user->getStreet2()) ? $user->getStreet1() . "<br>" . $user->getStreet2() : $user->getStreet1();
                    $phone = ($user->getPhoneMobile()) ? $user->getPhoneMobile() : $user->getPhoneOffice();

                    $client = json_encode(array(
                        'name' => $name,
                        'address' => $address,
                        'zip' => $user->getPostcode(),
                        'town' => $user->getCity(),
                        'status' => '1',
                        'phone' => $phone,
                        'email' => $user->getEmail()
                    ));

                    //Enregistrement du client & récupération de son id
                    $client_id = $this->CallAPI("POST", $apikey, $url . "ThirdParties", $client);

                    //Mise à jour du User avec le socid
                    $user->setSocid($client_id);
                    $this->em->persist($user);
                }

                //Création de la facture rattachée à ce client
                $date_ref = new DateTime('now');
                $date_debut = date_format($date_ref, 'd/m/Y');
                $ht = '5.00000000';
                $tva = '1.00000000';
                $ttc = '6.00000000';
                $abo = 'Abonnement 1 an';
                $date_fin = date_format(date_add($date_ref, new DateInterval('P1Y')), 'd/m/Y');

                $facture = json_encode(array(
                    'socid' => $client_id,
                    'total_ht' => $ht,
                    'total_tva' => $tva,
                    'total_ttc' => $ttc,
                    'cond_reglement_code' => 'RECEP',
                    'mode_reglement_code' => 'CB',
                    'lines' =>
                    array(
                        0 =>
                        array(
                            'desc' => $abo . '<br>Du ' . $date_debut . ' au ' . $date_fin,
                            'product_type' => '1',
                            'qty' => '1',
                            'subprice' => $ht,
                            'tva_tx' => '20.000',
                            'total_ht' => $ht,
                            'total_tva' => $tva,
                            'total_ttc' => $ttc,
                            'description' => $abo . '<br>Du ' . $date_debut . ' au ' . $date_fin
                        )
                    ),
                    'remaintopay' => $ttc,
                    'entity' => '1',
                    'mode_reglement_id' => '6',
                    'cond_reglement_id' => '12',
                    'cond_reglement_doc' => 'Due upon receipt',
                    'note_private' => 'Test formulaire abo. Merci Karine Leprêtre'
                ));

                $facture_id = $this->CallAPI("POST", $apikey, $url . "invoices", $facture);

                $this->CallAPI("POST", $apikey, $url . $facture_id . "/validate");

                $facture = json_decode($this->CallAPI("GET", $apikey, $url . "invoices/" . $facture_id));

                $pdf_a_generer = json_encode(array(
                    'modulepart' => 'invoice',
                    'original_file' => $facture->ref . "/" . $facture->ref . ".pdf",
                    'doctemplate' => 'sponge',
                    'langcode' => 'fr_FR'
                ));
                $this->CallAPI("PUT", "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v",  $url . "documents/builddoc", $pdf_a_generer);
            } else {
                return $this->render('subscription/subscription.html.twig', $vars);
            } 
        }
        
        return new RedirectResponse("/");
    }

     /**
     * @Route("/completion", name="subscription_completion")
     */
    public function completion()
    {
        if ($this->session->get('user')) {
            $vars = [];
            $vars['flash'] = '';
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

            return $this->render('subscription/subscription.html.twig', $vars);
        }

        return new RedirectResponse("/");
    }

    public function CallAPI($method, $apikey, $url, $data = false)
    {
        $curl = curl_init();
        $httpheader = ['DOLAPIKEY: ' . $apikey];

        switch ($method) {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);
                $httpheader[] = "Content-Type:application/json";

                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

                break;

            case "PUT":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
                $httpheader[] = "Content-Type:application/json";

                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

                break;

            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        // Optional Authentication:
        //    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        //    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $httpheader);

        $result = curl_exec($curl);

        curl_close($curl);

        return $result;
    }
}
