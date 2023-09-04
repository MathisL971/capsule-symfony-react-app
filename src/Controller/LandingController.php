<?php

namespace App\Controller;

use App\Controller\BaseController;
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
    public function home()
    {
        $vars = [];

        $repo = $this->em->getRepository(User::class);
        $pros = $repo->findBy(['role' => 'pro']);

        $liste = [];
        $vars['pros'] = [];

        if (count($pros) < 3) {
            $limit = count($pros);
        } 
        else {
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
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        return $this->render('landing/home.html.twig', $vars);
    }

    /**
     * @Route("/profil_jeune", name="landing_profil_jeune")
     */
    public function profil_jeune()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

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

        return $this->render('landing/jeune.html.twig', $vars);
    }

    /**
     * @Route("/profil_parent", name="landing_profil_parent")
     */
    public function profil_parent()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        return $this->render('landing/parent.html.twig', $vars);
    }

    /**
     * @Route("/profil_pro", name="landing_profil_pro")
     */
    public function profil_pro()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        return $this->render('landing/pro.html.twig', $vars);
    }

    /**
     * @Route("/liste_pros", name="landing_liste_pros")
     */
    public function liste_pros()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/liste_pros.html.twig', $vars));
        return $this->render('landing/liste_pros.html.twig', $vars);
    }

    /**
     * @Route("fiche_pro/{id}", name="landing_fiche_pro")
     */
    public function fiche_pro($id)
    {
        // Make sure id maps to existing pro user before

        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

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

        // return new Response($this->twig->render('landing/fiche_pro.html.twig', $vars));
        return $this->render('landing/fiche_pro.html.twig', $vars);
    }

    /**
     * @Route("/ressources", name="landing_ressources")
     */
    public function ressources()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/ressources.html.twig', $vars));
        return $this->render('landing/ressources.html.twig', $vars);
    }

    /**
     * @Route("/revue_presse", name="landing_revue_presse")
     */
    public function revue_presse()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/revue_presse.html.twig', $vars));
        return $this->render('landing/revue_presse.html.twig', $vars);
    }

    /**
     * @Route("/mentions", name="landing_mentions")
     */
    public function mentions()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/mentions.html.twig', $vars));
        return $this->render('landing/mentions.html.twig', $vars);
    }

    /**
     * @Route("/rgpd", name="landing_rgpd")
     */
    public function rgpd()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/rgpd.html.twig', $vars));
        return $this->render('landing/rgpd.html.twig', $vars);
    }

    /**
     * @Route("/cgs", name="landing_cgs")
     */
    public function cgs()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/cgs.html.twig', $vars));
        return $this->render('landing/cgs.html.twig', $vars);
    }

    /**
     * @Route("/faq", name="landing_faq")
     */
    public function faq()
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('landing/faq.html.twig', $vars));
        return $this->render('landing/faq.html.twig', $vars);
    }

    // /**
    //  * @Route("/messages", name="landing_messages")
    //  */
    // public function messages()
    // {
    //     if ($this->session->has('role')) {
    //         $path = '/' . strtolower($this->session->get('role')) . '/messages';
    //         return new RedirectResponse($path);
    //     } else {
    //         return new Response($this->twig->render('hello.html.twig', [
    //             'flash' => "L'accès à la messagerie nécessite d'être connecté"
    //         ]));
    //     }
    // }

    // /**
    //  * @Route("/visio", name="landing_visio")
    //  */
    // public function visio()
    // {
    //     if ($this->session->has('role')) {
    //         $path = '/' . strtolower($this->session->get('role')) . '/visio';
    //         return new RedirectResponse($path);
    //     } else {
    //         return new Response($this->twig->render('hello.html.twig', [
    //             'flash' => "L'accès au la page de téléconsultation nécessite d'être connecté"
    //         ]));
    //     }
    // }
}
