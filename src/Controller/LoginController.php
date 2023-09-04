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
use Symfony\Component\Security\Core\Exception\AuthenticationException;


class LoginController extends BaseController
{
    /**
     * @Route("/login", name="login_post", methods={"POST"})
     */
    public function login(Request $rq)
    {
        $vars = [];

        $requestData = json_decode($rq->getContent(), true);
        $email = $requestData['email'];
        $password = $requestData['password'];

        $user = $this->em->getRepository(User::class)->findOneBy(['email' => $email]);

        // dump($user);

        // $user = $this->em->getRepository(User::class)->findOneBy(['email' => $rq->request->get('email')]);

        // $vars['flash'] = ('L\'authentification a échouée <p> <a href="/reset">Réinitialiser le mot de passe ?</a>');
        //echo nl2br("L'authentification a échouée <br> Réinitialiser le mot de passe ?");

        if (!$user) {
            // Invalid credentials
            throw new AuthenticationException('Credentials are not valid (email)');
        }

        if ($user->getActivationKey()) {
            // $vars['flash'] = 'Ce compte n\'a pas été activé. Un email avec un lien d\'activation a été renvoyé.';

            // Envoi d'un mail de confirmation
            // sendVerificationEmail($user);

            return new AuthenticationException('Account has not been verified yet');
            // return new Response(json_encode([ "message" => "account has not been verified yet"]), 200, ['Content-Type' => 'application/json']);
        }

        if ($user->getPassword() === $password) {

            $this->session->set('user', $user);
            $this->session->set('role', $user->getRole());

            $vars['flash'] = "Bienvenue " . $user->getName();
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

            if ($user->getStatus() == 'suspended') {
                return new Response('landing/suspended.html.twig');
                // return $this->render('landing/suspended.html.twig', $vars);
            }
            
            if ($user->getStatus() == 'pending') {
                return new Response('landing/pending.html.twig');
                // return $this->render('landing/pending.html.twig', $vars);
            } 

            // return $this->render('/' . strtolower($user->getRole()) . '/home.html.twig', $vars);

            // return new Response(json_encode($vars), 200, ['Content-Type' => 'application/json']);

            // if ($user->getRole() == 'superadmin') {
            //     return new Response(json_encode($userData), 200, ['Content-Type' => 'application/json']);
            //     return new RedirectResponse('/admin/home');
            //     return $this->render('admin/home.html.twig', $vars);
            // } 

            return new Response('/' . strtolower($user->getRole()) . '/home');
            // return new Response(json_encode($userData), 200, ['Content-Type' => 'application/json']);
        }

        throw new AuthenticationException('Credentials are not valid (password)');
    }


    // /**
    //  * @Route("/login", name="login_post", methods={"POST"})
    //  */
    // public function login(Request $rq)
    // {
        // $requestData = json_decode($rq->getContent(), true);
        // $email = $requestData['email'];
        // $password = $requestData['password'];

        // $user = $this->em->getRepository(User::class)->findOneBy(['email' => $email]);

    //     if ($user && $user->getPassword() === $password) {
    //         $this->session->set('user', $user);
    //         $this->session->set('role', $user->getRole());

    //         $userData = [
    //             'username' => $user->getUsername(),
    //             'role' => $user->getRole(),
    //         ];

    //         $vars = [];
    //         $vars['user'] = $this->session->get('user');
    //         $vars['role'] = $this->session->get('role');  

    //         // return $this->render(strtolower($user->getRole()) . '/home.html.twig', $vars);

    //         return new Response(json_encode($userData), 200, ['Content-Type' => 'application/json']);
    //     }

    //     // Invalid credentials
    //     throw new AuthenticationException('Email or password is not valid');
    // }

    // /**
    //  * @Route("/login", name="login_post", methods={"POST"})
    //  */
    // public function login(Request $rq)
    // {
    //     $vars = [];

    //     if (!empty($_POST)) {
    //         $repo = $this->em->getRepository(User::class);
    //         $user = $repo->findOneBy(['email' => $rq->request->get('email')]);

    //         $vars['flash'] = ('L\'authentification a échouée <p> <a href="/reset">Réinitialiser le mot de passe ?</a>');
    //         //echo nl2br("L'authentification a échouée <br> Réinitialiser le mot de passe ?");

    //         if (!$user) {
    //             return new Response($this->render('landing/home.html.twig', $vars));
    //         }

    //         if ($user->getActivationKey()) {
    //             $vars['flash'] = 'Ce compte n\'a pas été activé. Un email avec un lien d\'activation a été renvoyé.';

    //             // Envoi d'un mail de confirmation
    //             ini_set("SMTP", "SSL0.OVH.NET");

    //             $entete  = 'MIME-Version: 1.0' . "\r\n";
    //             $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    //             $entete .= 'From: postmaster@klungstene.fr' . "\r\n";

    //             $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
    //             $message .= "<p>Merci d'avoir créé ton compte chez Capsule. Active-le dès maintenant : <a href=\"https://capsule.klungstene.xyz/activate/" . $user->getActivationKey() . "\">Activer mon compte" . '</a>.<br>' . "\r\n";
    //             $message .= "<p> Ton identifiant : " . $user->getEmail() . '.<br></p>' . "\r\n";
    //             $message .= "<p>A bientôt dans ton espace Capsule.";

    //             mail($user->getEmail(), 'Active ton compte Capsule', $message, $entete);

    //             return new Response($this->render('landing/home.html.twig', $vars));
    //         }

    //         if (password_verify($rq->request->get('password'), $user->getPassword())) {
    //             $this->session->set('user', $user);
    //             $this->session->set('role', $user->getRole());

    //             $vars['flash'] = "Bienvenue " . $user->getName();

    //             if ($user->getStatus() == 'suspended') {
    //                 return new Response('landing/suspended.html.twig');
    //             } elseif ($user->getStatus() == 'pending') {
    //                 return new Response('landing/pending.html.twig');
    //             } else {
    //                 if ($user->getRole() == 'superadmin') {
    //                     return new RedirectResponse('/admin/home');
    //                 } else {
    //                     return new RedirectResponse('/' . strtolower($user->getRole()) . '/home');
    //                 }
    //             }
    //         }
    //     }

    //     if ($this->session->has('flash')) {
    //         $vars['flash'] = $this->session->get('flash');
    //         $this->session->remove('flash');
    //     }

    //     $repo = $this->em->getRepository(User::class);
    //     $pros = $repo->findBy(['role' => 'pro']);

    //     $liste = [];
    //     $vars['pros'] = [];

    //     if (count($pros) < 3) {
    //         $limit = count($pros);
    //     } else {
    //         $limit = 3;
    //     }
    //     while (count($liste) < $limit) {

    //         $row = rand(0, count($pros) - 1);

    //         if (!in_array($row, $liste)) {
    //             $liste[] = $row;
    //             $vars['pros'][] = $pros[$row];
    //         }
    //     }

    //     $vars['user'] = $this->session->get('user');
    //     $vars['role'] = $this->session->get('role');

    //     return new Response($this->render('landing/home.html.twig', $vars));
    // }

    /**
     * @Route("/login", name="login_get", methods={"GET"})
     */
    public function showLoginForm()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // if ($vars['user']) {
        //     return $this->render(strtolower($vars['role']) . '/home.html.twig', $vars);
        // }

        return $this->render('login/home.html.twig', $vars);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {        
        $this->session->set('user', null);
        $this->session->set('role', null);
        $this->session->set('userJson', null);

        return new Response(json_encode("User successfully logged out"), 200, ['Content-Type' => 'application/json']);

        // dump($this->session->get('user'));
        // dump($this->session->get('role'));

        // return new Response(json_encode($vars), 200, ['Content-Type' => 'application/json']);

        // return $this->render('/login/home.html.twig', $vars);

    }
    
    /**
     * @Route("/reset", name="reset_credentials")
     */
    public function reset_credentials(Request $rq)
    {
        $vars = [];
        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

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

    private function sendVerificationEmail($user)
    {
        ini_set("SMTP", "SSL0.OVH.NET");

        $entete  = 'MIME-Version: 1.0' . "\r\n";
        $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $entete .= 'From: postmaster@klungstene.fr' . "\r\n";

        $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
        $message .= "<p>Merci d'avoir créé ton compte chez Capsule. Active-le dès maintenant : <a href=\"https://capsule.klungstene.xyz/activate/" . $user->getActivationKey() . "\">Activer mon compte" . '</a>.<br>' . "\r\n";
        $message .= "<p> Ton identifiant : " . $user->getEmail() . '.<br></p>' . "\r\n";
        $message .= "<p>A bientôt dans ton espace Capsule.";

        mail($user->getEmail(), 'Active ton compte Capsule', $message, $entete);
    }
}

