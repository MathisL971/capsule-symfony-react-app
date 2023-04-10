<?php

namespace App\Controller;

use App\Entity\User;
use DateInterval;
use DateTime;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LandingController extends BaseController
{

    /**
     * @Route("/", name="landing_home")
     */
    public function home(Request $rq)
    {
        $vars = [];

        if (!empty($_POST)) {
            $repo = $this->em->getRepository(User::class);
            $user = $repo->findOneBy(['email' => $rq->request->get('email')]);
            $vars['flash'] = "L'authentification a échouée";

            if (!$user) {
                $vars['flash'] = "Hmmm... Etrange ! Cet email n'est pas reconnu.";

                return new Response($this->twig->render('landing/home.html.twig', $vars));
            }

            if ($user->getActivationKey()) {
                $vars['flash'] = 'Ce compte n\'a pas été activé. Un email avec un lien d\'activation a été renvoyé.';

                // Envoi d'un mail de confirmation
                ini_set("SMTP", "SSL0.OVH.NET");

                $entete  = 'MIME-Version: 1.0' . "\r\n";
                $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
                $entete .= 'From: postmaster@klungstene.fr' . "\r\n";

                $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
                $message .= "<p>Merci d'avoir créé ton compte chez Capsule. Active-le dès maintenant : <a href=\"https://capsule.klungstene.xyz/activate/" . $user->getActivationKey() . "\">capsule.klungstene.xyz" . '</a>.<br>' . "\r\n";
                $message .= "<p> Ton identifiant : " . $user->getEmail() . '.<br></p>' . "\r\n";
                $message .= "<p>A bientôt dans ton espace Capsule.";

                // mail($user->getEmail(), 'Active ton compte Capsule', $message, $entete);

                return new Response($this->twig->render('landing/home.html.twig', $vars));
            }

            if (password_verify($rq->request->get('password'), $user->getPassword())) {
                $this->session->set('user', $user);
                $this->session->set('role', $user->getRole());

                $vars['flash'] = "Bienvenue " . $user->getName();

                if ($user->getStatus() == 'suspended') {
                    return new Response('landing/suspended.html.twig');
                } elseif ($user->getStatus() == 'pending') {
                    return new Response('landing/pending.html.twig');
                } else {
                    if ($user->getRole() == 'SuperAdmin') {
                        return new RedirectResponse('/admin/home');
                    } else {
                        return new RedirectResponse('/' . strtolower($user->getRole()) . '/home');
                    }
                }
            }
        }

        if ($this->session->has('flash')) {
            $vars['flash'] = $this->session->get('flash');
            $this->session->remove('flash');
        }

        $repo = $this->em->getRepository(User::class);
        $pros = $repo->findBy(['role' => 'pro']);

        $liste = [];
        $vars['pros'] = [];

        if (count($pros) < 3) {
            $limit = count($pros);
        } else {
            $limit = 3;
        }
        while (count($liste) < $limit) {

            $row = rand(0, count($pros) - 1);

            if (!in_array($row, $liste)) {
                $liste[] = $row;
                $vars['pros'][] = $pros[$row];
            }
        }

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/home.html.twig', $vars));
    }

    /**
     * @Route("/profil_jeune"), name="landing_profil_jeune")
     */
    public function profil_jeune()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        $repo = $this->em->getRepository(User::class);
        $pros = $repo->findBy(['role' => 'pro']);

        $liste = [];
        $vars['pros'] = [];

        if (count($pros) < 3) {
            $limit = count($pros);
        } else {
            $limit = 3;
        }

        while (count($liste) < $limit) {

            $row = rand(0, count($pros) - 1);

            if (!in_array($row, $liste)) {
                $liste[] += $row;
                $vars['pros'][] = $pros[$row];
            }
        }

        $page = $this->twig->render('landing/jeune.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/profil_parent"), name="landing_profil_parent")
     */
    public function profil_parent()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        $page = $this->twig->render('landing/parent.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/profil_pro"), name="landing_profil_pro")
     */
    public function profil_pro()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        $page = $this->twig->render('landing/pro.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/liste_pros", name="landing_liste_pros")
     */
    public function liste_pros()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/prolist.html.twig', $vars));
    }

    /**
     * @Route("fiche_pro/{id}", name="landing_fiche_pro")
     */
    public function fiche_pro($id)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        $repo = $this->em->getRepository(USer::class);
        $vars['profile'] = $repo->find($id);
        $vars['speciality'] = array(
            '0' => 'Confance en soi',
            '1' => 'Gestion du stress',
            '2' => 'Concentration'
        );
        $date = new DateTime('now');
        $vars['dates'][0] = $date;

        for ($i = 1; $i < 6; $i++) {
            $date = new DateTime('now');
            $date->add(new DateInterval('P' . $i . 'D'));
            $vars['dates'][$i] = $date;
        }

        return new Response($this->twig->render('landing/fiche_pro.html.twig', $vars));
    }

    /**
     * @Route("/ressources", name="landing_ressources")
     */
    public function ressources()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/ressources.html.twig', $vars));
    }

    /**
     * @Route("/revue_presse", name="landing_revue_presse")
     */
    public function revue_presse()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/revuepresse.html.twig', $vars));
    }

    /**
     * @Route("/mentions", name="landing_mentions")
     */
    public function mentions()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/mentions.html.twig', $vars));
    }

    /**
     * @Route("/rgpd", name="landing_rgpd")
     */
    public function rgpd()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/rgpd.html.twig', $vars));
    }

    /**
     * @Route("/cgs", name="landing_cgs")
     */
    public function cgs()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/cgs.html.twig', $vars));
    }

    /**
     * @Route("/faq", name="landing_faq")
     */
    public function faq()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/faq.html.twig', $vars));
    }

    /**
     * @Route("/deconnect", name="landing_deconnect")
     */
    public function deconnect()
    {
    }

    /**
     * @Route("/new", name="landing_new")
     */
    public function new(Request $rq)
    {
        $vars = [];

        if ($rq->request->has('email')) {
            $repo = $this->em->getRepository(User::class);
            $userExistant = $repo->findOneBy(['email' => $rq->request->get('email')]);

            if (!$userExistant) {
                if ($rq->request->get('role') == 'Pro') {
                    $path = '/pro/subscription?email=' . $rq->request->get('email');
                    return new RedirectResponse($path);
                }

                if ($rq->request->get('password') == $rq->request->get('password2')) {
                    $user = new User;
                    $user
                        ->setEmail($rq->request->get('email'))
                        ->setRole($rq->request->get('role'))
                        ->setFirstName($rq->request->get('firstName'))
                        ->setPassword(password_hash($rq->request->get('password'), PASSWORD_DEFAULT))
                        ->setStatus('active')
                        ->setActivationKey($user->generateKey(47));

                    // $this->em->persist($user);
                    // $this->em->flush();

                    // Envoi d'un mail de confirmation
                    ini_set("SMTP", "SSL0.OVH.NET");

                    $entete  = 'MIME-Version: 1.0' . "\r\n";
                    $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
                    $entete .= 'From: postmaster@klungstene.fr' . "\r\n";

                    $message = 'Bonjour ' . $user->getFirstName() . ',<br>' . "\r\n";
                    $message .= "<p>Merci d'avoir créé ton compte chez Capsule. Active le dès maintenant : <a href=\"https://capsule.klungstene.xyz/activate/" . $user->getActivationKey() . "\">capsule.klungstene.xyz" . '</a>.<br>' . "\r\n";
                    $message .= "<p> Ton identifiant : " . $user->getEmail() . '.<br></p>' . "\r\n";
                    $message .= "<p>A bientôt dans ton espace Capsule.";

                    echo "<a href=\"http://mvpsymfony/activate/" . $user->getActivationKey() . "\">capsule.klungstene.xyz" . '</a>';
                    dd($message);

                    // mail($user->getEmail(), 'Bienvenue chez Capsule !', $message, $entete);

                    return new RedirectResponse('/');
                } else {
                    $vars['flash'] = "Les deux mots de passe doivent être identiques";
                }
            } else {
                $vars['flash'] = "un utilisateur utilise déjà cet email";
            }
        }

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        return new Response($this->twig->render('landing/new.html.twig', $vars));
    }

    /**
     * @Route("/activate/{key}", name="landing_activate")
     */
    public function activate($key, Request $rq)
    {
        $repo = $this->em->getRepository(User::class);
        $vars['user'] = $repo->findOneBy(['activationKey' => $key]);

        if (count($rq->request)) {
            $data = $rq->request;
            $repo = $this->em->getRepository(User::class);
            $profile = $repo->findOneBy(['id' => $vars['user']->getId()]);
            $profile->setFirstName($data->get('firstName'))
                ->setName($data->get('name'))
                ->setEmail($data->get('email'))
                ->setPhoneMobile($data->get('mobile'))
                ->setStreet1($data->get('street1'))
                ->setStreet2($data->get('street2'))
                ->setPostcode($data->get('postcode'))
                ->setCity($data->get('city'))
                ->setCountry($data->get('country'))
                ->setActivationKey(NULL);
            $this->em->persist($profile);
            $this->em->flush();

            $this->session->set('user', $profile);
            $vars['user'] = $profile;
            $vars['role'] = $profile->getRole();

            return new RedirectResponse('/' . strtolower($vars['role']) . '/home');
        }

        return new Response($this->twig->render('landing/profil.html.twig', $vars));
    }

    /**
     * @Route("/messages", name="landing_messages")
     */
    public function messages()
    {
        if ($this->session->has('role')) {
            $path = '/' . strtolower($this->session->get('role')) . '/messages';
            return new RedirectResponse($path);
        } else {
            return new Response($this->twig->render('hello.html.twig', [
                'flash' => "L'accès à la messagerie nécessite d'être connecté"
            ]));
        }
    }

    /**
     * @Route("/visio", name="landing_visio")
     */
    public function visio()
    {
        if ($this->session->has('role')) {
            $path = '/' . strtolower($this->session->get('role')) . '/visio';
            return new RedirectResponse($path);
        } else {
            return new Response($this->twig->render('hello.html.twig', [
                'flash' => "L'accès au la page de téléconsultation nécessite d'être connecté"
            ]));
        }
    }
}
