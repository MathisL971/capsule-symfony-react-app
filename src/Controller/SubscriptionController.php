<?php

namespace App\Controller;

use DateTime;
use DateInterval;
use Chris\Apidoli;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class SubscriptionController extends BaseController
{
    /**
     * @Route("/subscription", name="subscription_subscription")
     */
    public function subscription()
    {

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['extend'] = "ado" . "/navbar.html.twig";

        if (!empty($_POST)) {
            $user = $this->session->get('user');
            //$apikey = $this->em->getRepository(Param::class)->finBy(['name' => 'doli_apikey']);
            $apikey = "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v";
            //$url = $this->em->getRepository(Param::class)->finBy(['name' => 'doli_base_url']);
            $url = "http://dolilocal/htdocs/api/index.php/";
            //$prix = $this->em->getRepository(Param::class)->finBy(['name' => 'prix_abo']);
            $prix = 5;

            if (empty($user->getSocid())) {
                //Création du nouveau client s'il n'est pas déjà enregistré dans Dolibarr
                $name = $user->getFirstName() . " " . $user->getName();
                $name = ($user->getTitle() == "Dr") ? "Dr " . $name : '';
                $name = ($user->getTitle() == "Pr") ? "Pr " . $name : '';

                $address = ($user->getStreet2()) ? $user->getStreet1() . "<br>" . $user->getStreet2() : $user->getStreet1();

                $client = json_encode(array(
                    'name' => $name,
                    'address' => $address,
                    'zip' => $user->getPostcode(),
                    'town' => $user->getCity(),
                    'status' => '1',
                    'phone' => $user->getPhone(),
                    'email' => $user->getEmail()
                ));

                //Enregistrement du client & récupération de son id
                //$client_id = Apidoli::CallAPI("POST", $apikey, $url . "http://dolilocal/htdocs/api/index.php/ThirdParties", $client);
                $client_id = 2;

                //Mise à jour du User avec le socid
                $user->setSocid = $client_id;
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

            echo 'Enregistrement de la facture<br>';
            $facture_id = CallAPI("POST", "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v", "http://dolilocal/htdocs/api/index.php/invoices", $facture);

            echo 'Validation de la facture <br>';
            $url = "http://dolilocal/htdocs/api/index.php/invoices/" . $facture_id . "/validate";
            CallAPI("POST", "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v", $url);

            echo 'Récupération de la facture validée';
            $facture = json_decode(CallAPI("GET", "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v", "http://dolilocal/htdocs/api/index.php/invoices/" . $facture_id));

            echo 'Génération du pdf<br>';
            $pdf_a_generer = json_encode(array(
                'modulepart' => 'invoice',
                'original_file' => $facture->ref . "/" . $facture->ref . ".pdf",
                'doctemplate' => 'sponge',
                'langcode' => 'fr_FR'
            ));
            CallAPI("PUT", "If1Xo2WXDYp5Qr5vy98GVjNz75ee1D3v", "http://dolilocal/htdocs/api/index.php/documents/builddoc", $pdf_a_generer);
        } else {
            echo 'Oh my God! They killed Kenny!';
        }



        return new Response($this->twig->render('subscription/subscription.html.twig', $vars));
    }
}
