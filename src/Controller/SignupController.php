<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\BaseController;
use App\Entity\User;
use Symfony\Component\VarDumper\VarDumper;


class SignupController extends BaseController
{
    /**
     * @Route("/signup", name="app_signup")
     */
    public function signup(Request $rq): Response
    {
        //If POST request (user trying to sign up)
        if ($rq->isMethod('POST')) {

            $jsonContent = $rq->getContent();
            $requestData = json_decode($jsonContent, true);

            if ($requestData) {
                $requestData['status'] = 'active';
                $requestData['activationKey'] = '';
                $requestData['socid'] = 0;
                $requestData['profilePic'] = '';
                $requestData['alias'] = '';

                // Make POST request to "api/users" with request data
                $client = HttpClient::create(['verify_peer' => false, 'verify_host' => false]);

                // Make the POST request to "api/users" with the decoded request data
                $response = $client->request('POST', 'https://127.0.0.1:8000/api/users', [
                    'json' => $requestData,
                ]);

                $apiResponse = $response->getContent();

                $responseData = json_decode($apiResponse, true);

                // Check if the API response represents an error
                if (isset($responseData['hydra:title']) && $responseData['hydra:title'] === 'An error occurred') {
                    // Handle error response and return it
                    return new Response($apiResponse, $response->getStatusCode(), ['Content-Type' => 'application/json']);
                } else {
                    $this->session->set('user', $responseData);
                    $this->session->set('role', $responseData['role']);

                    // Extract desired fields (username and role)
                    $userFields = [
                        'username' => $responseData['username'] ?? null,
                        'role' => $responseData['role'] ?? null,
                    ];

                    // Return the extracted user fields
                    return new Response(json_encode($userFields), 200, ['Content-Type' => 'application/json']);
                }
            } 
            else {
                // Handle invalid or missing data
                return new Response(json_encode(['error' => 'Missing body data']), 400, ['Content-Type' => 'application/json']);
            }
        } 
        // Else if GET request (rendering login form)
        elseif ($rq->isMethod('GET')) {
            $vars = [];
            $vars['flash'] = '';
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));
            // Return the rendered template for GET request
            return $this->render('signup/home.html.twig', $vars);
        }
    
        // If the request method is neither GET nor POST
        return new Response('Invalid request method');
    }

    // /**
    //  * @Route("/new", name="landing_new")
    //  */
    // public function new(Request $rq)
    // {
    //     $vars = [];

    //     if ($rq->request->has('email')) {
    //         $repo = $this->em->getRepository(User::class);
    //         $userExistant = $repo->findOneBy(['email' => $rq->request->get('email')]);

    //         if (!$userExistant) {
    //             if ($rq->request->get('role') == 'pro') {
    //                 $path = '/pro/subscription?email=' . $rq->request->get('email');
    //                 return new RedirectResponse($path);
    //             }

    //             if ($rq->request->get('password') == $rq->request->get('password2')) {
    //                 $user = new User;
    //                 $user
    //                     ->setEmail($rq->request->get('email'))
    //                     ->setRole($rq->request->get('role'))
    //                     ->setFirstName($rq->request->get('firstName'))
    //                     ->setPassword(password_hash($rq->request->get('password'), PASSWORD_DEFAULT))
    //                     ->setStatus('active')
    //                     ->setActivationKey($user->generateKey(47));

    //                 $this->em->persist($user);
    //                 $this->em->flush();

    //                 // Envoi d'un mail de confirmation
    //                 ini_set("SMTP", "SSL0.OVH.NET");

    //                 $entete  = 'MIME-Version: 1.0' . "\r\n";
    //                 $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    //                 $entete .= 'From: contact@capsule-ado.com' . "\r\n";

    //                 $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
    //                 $message .= "<p>Merci d'avoir créé ton compte chez Capsule. Active le dès maintenant : <a href=\"https://capsule.klungstene.xyz/activate/" . $user->getActivationKey() . "\">capsule.klungstene.xyz" . '</a>.<br>' . "\r\n";
    //                 $message .= "<p> Ton identifiant : " . $user->getEmail() . '.<br></p>' . "\r\n";
    //                 $message .= "<p>A bientôt dans ton espace Capsule.";

    //                 //echo "<a href=\"http://mvpsymfony/activate/" . $user->getActivationKey() . "\">capsule.klungstene.xyz" . '</a>';


    //                 $mail = mail($user->getEmail(), 'Bienvenue chez Capsule !', $message, $entete);

    //                 return new RedirectResponse('/');
    //             } else {
    //                 $vars['flash'] = "Les deux mots de passe doivent être identiques";
    //             }
    //         } else {
    //             $vars['flash'] = "un utilisateur utilise déjà cet email";
    //         }
    //     }

    //     $vars['user'] = $this->session->get('user');
    //     $vars['role'] = $this->session->get('role');

    //     // return new Response($this->render('signup/new.html.twig', $vars));
    //     return $this->render('signup/new.html.twig', $vars);
    // }
}
