<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use DateInterval;
use DateTime;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Controller\BaseController;
use Symfony\Component\VarDumper\VarDumper;


class LoginController extends BaseController
{
    /**
     * @Route("/login", name="login")
     */
    public function login(Request $rq)
    {
        // $vars = [];

        // if (!empty($_POST)) {
        //     $repo = $this->em->getRepository(User::class);
        //     $user = $repo->findOneBy(['email' => $rq->request->get('email')]);

        //     $vars['flash'] = ('L\'authentification a échouée <p> <a href="/reset">Réinitialiser le mot de passe ?</a>');
        //     //echo nl2br("L'authentification a échouée <br> Réinitialiser le mot de passe ?");

        //     if (!$user) {
        //         // return new Response($this->twig->render('landing/home.html.twig', $vars));
        //         return $this->render('landing/home.html.twig', $vars);
        //     }

        //     if ($user->getActivationKey()) {
        //         $vars['flash'] = 'Ce compte n\'a pas été activé. Un email avec un lien d\'activation a été renvoyé.';

        //         // Envoi d'un mail de confirmation
        //         ini_set("SMTP", "SSL0.OVH.NET");

        //         $entete  = 'MIME-Version: 1.0' . "\r\n";
        //         $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        //         $entete .= 'From: postmaster@klungstene.fr' . "\r\n";

        //         $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
        //         $message .= "<p>Merci d'avoir créé ton compte chez Capsule. Active-le dès maintenant : <a href=\"https://capsule.klungstene.xyz/activate/" . $user->getActivationKey() . "\">Activer mon compte" . '</a>.<br>' . "\r\n";
        //         $message .= "<p> Ton identifiant : " . $user->getEmail() . '.<br></p>' . "\r\n";
        //         $message .= "<p>A bientôt dans ton espace Capsule.";

        //         mail($user->getEmail(), 'Active ton compte Capsule', $message, $entete);

        //         // return new Response($this->twig->render('landing/home.html.twig', $vars));
        //         return $this->render('landing/home.html.twig', $vars);
        //     }

        //     if (password_verify($rq->request->get('password'), $user->getPassword())) {
        //         $this->session->set('user', $user);
        //         $this->session->set('role', $user->getRole());

        //         $vars['flash'] = "Bienvenue " . $user->getName();

        //         if ($user->getStatus() == 'suspended') {
        //             // return new Response('landing/suspended.html.twig');
        //             return $this->render('landing/suspended.html.twig', $vars);
        //         } elseif ($user->getStatus() == 'pending') {
        //             // return new Response('landing/pending.html.twig');
        //             return $this->render('landing/pending.html.twig', $vars);
        //         } else {
        //             if ($user->getRole() == 'SuperAdmin') {
        //                 // return new RedirectResponse('/admin/home');
        //                 return $this->render('admin/home.html.twig', $vars);
        //             } else {
        //                 // return new RedirectResponse('/' . strtolower($user->getRole()) . '/home');
        //                 return $this->render('/' . strtolower($user->getRole()) . '/home.html.twig', $vars);
        //             }
        //         }
        //     }
        // }

        // if ($this->session->has('flash')) {
        //     $vars['flash'] = $this->session->get('flash');
        //     $this->session->remove('flash');
        // }

        // $user = $this->session->get('user');
        // $role = $this->session->get('role');

        // $vars['user'] = $user;
        // $vars['role'] = $role;

        // // If user already logged in
        // if ($user) {
        //     // Redirect to dashboard
        //     return $this->render('$role/home.html.twig', $vars);
        // }
        // else {
        //     // Redirect to login form
        //     return $this->render('login/home.html.twig', $vars);
        // }

        // If POST request (user trying to log in)
        if ($rq->isMethod('POST')) {

            $jsonContent = $rq->getContent();
            $requestData = json_decode($jsonContent, true);

            if ($requestData) {
                $email = $requestData['email'];
                $password = $requestData['password'];

                $repo = $this->em->getRepository(User::class);
                $user = $repo->findOneBy(['email' => $email]);

                if ($user && $user->getPassword() === $password) {
                    $this->session->set('user', $user);
                    $this->session->set('role', $user->getRole());

                    $userData = [
                        'id' => $user->getId(),
                        'username' => $user->getUsername(),
                        'role' => $user->getRole(),
                    ];
                    return new Response(json_encode($userData), 200, ['Content-Type' => 'application/json']);
                }

                return new Response(json_encode(['error' => 'Email or password is not valid']), 200, ['Content-Type' => 'application/json']);

            } else {
                // Handle invalid or missing data
                return new Response(json_encode(['error' => 'Missing body data']), 400, ['Content-Type' => 'application/json']);
            }

        // Else if GET request (rendering login form)
        } elseif ($rq->isMethod('GET')) {
            $vars = [];
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            // Return the rendered template for GET request
            return $this->render('login/home.html.twig', $vars);
        }
    
        // If the request method is neither GET nor POST
        return new Response('Invalid request method');
    }
    
    /**
     * @Route("/reset", name="reset_credentials")
     */
    public function reset_credentials(Request $rq)
    {
        $vars = [];
        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        if (count($rq->request)) {
            $user = $this->em->getRepository(User::class)->findOneBy(['email' => $rq->request->get('email')]);

            if ($user) {
                $tempPw = $user->generate(12);
                $user->setPassword(password_hash($tempPw, PASSWORD_DEFAULT))
                    ->setActivationKey($user->generateKey(47));

                // Envoi d'un mail de confirmation
                ini_set("SMTP", "SSL0.OVH.NET");

                $entete  = 'MIME-Version: 1.0' . "\r\n";
                $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
                $entete .= 'From: noreply@klungstene.fr' . "\r\n";

                $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
                $message .= "<p>Un mot de passe provisoire a été défini : <b><i>" . $tempPw . "</i></b> . Pour redéfinir un mot de passe personnalisé, rendez-vous ici : <a href=\"https://capsule.klungstene.xyz/updatePassword/" . $user->getActivationKey() . "\">Réinitialiser mon mot de passe" . '</a>.<br>' . "\r\n";
                $message .= "<p>A bientôt dans ton espace Capsule.";

                //echo $message;
                mail($user->getEmail(), 'Mot de passe provisoire', $message, $entete);
                $this->em->flush();
            } else {
                // Envoi d'un mail : compte inconnu
                ini_set("SMTP", "SSL0.OVH.NET");

                $entete  = 'MIME-Version: 1.0' . "\r\n";
                $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
                $entete .= 'From: noreply@klungstene.fr' . "\r\n";

                $message = 'Bonjour,<br>' . "\r\n";
                $message .= "<p>Cette adresse email n'est rattachée à aucun compte Capsules.<br>" . "\r\n";
                $message .= "<p> Pour créer un compte, rendez-vous ici : <a href=\"https://capsule.klungstene.xyz/new/\">Capsules</a>." . "\r\n";
                $message .= "<p>A bientôt dans ton espace Capsule.";

                //echo $message;
                mail($user->getEmail(), 'Capsules', $message, $entete);
            }

            $vars['flash'] = "Un email a été envoyé à l'adresse " . $rq->request->get('email') . ".";

            return $this->render('login/home.html.twig', $vars);
            // return new Response($this->twig->render('landing/home.html.twig', $vars));
        }

        return $this->render('login/reset.html.twig', $vars);
        // return new Response($this->twig->render('login/reset.html.twig', $vars));
    }

    /**
     * @Route("/updatePassword/{key?0}", name="landing_updatePassword")
     */
    public function updatePassword($key, Request $rq)
    {
        if (!$key) {
            return new RedirectResponse('/');
        }

        if (count($rq->request)) {
            $user = $this->em->getRepository(User::class)->findOneBy(['activationKey' => $key]);
            if ($rq->request->get('new') != $rq->request->get('repeat')) {
                $vars['flash'] = "Le nouveau mot de passe n'est pas identique à la resaisie du nouveau mot de passe.";
            } else {
                if (password_verify($rq->request->get('temp'), $user->getPassword())) {
                    $user->setPassword(password_hash($rq->request->get('new'), PASSWORD_DEFAULT));
                    $user->setActivationKey(NULL);
                    $this->em->persist($user);
                    $this->em->flush();
                    $this->session->set('user', $user);
                    $this->session->set('role', $user->getRole());
                    return new RedirectResponse('/' . strtolower($user->getRole()) . '/home');
                } else {
                    $vars['flash'] = "Le mot de passe saisi n'a pas permis d'identifier l'utilisateur.";
                }
            }
        }

        return $this->render('login/updatePassword.html.twig', $vars);
        // return new Response($this->twig->render('login/updatePassword.html.twig'));
    }

    /**
     * @Route("/activate/{key}", name="landing_activate")
     */
    public function activate($key)
    {
        $repo = $this->em->getRepository(User::class);
        $profile = $repo->findOneBy(['activationKey' => $key]);
        $vars['user'] = $profile;

        $profile->setActivationKey(NULL);
        $this->em->persist($profile);
        $this->em->flush();

        $this->session->set('user', $profile);
        $this->session->set('role', $profile->getRole());
        $vars['user'] = $profile;
        $vars['role'] = $profile->getRole();

        return new RedirectResponse('/' . strtolower($vars['role']) . '/home');
    }

    /**
     * @Route("/deconnect", name="landing_deconnect")
     */
    public function deconnect()
    {
    }
}