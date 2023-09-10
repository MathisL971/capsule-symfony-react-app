<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Controller\BaseController;

class AdoController extends BaseController
{
    /**
     * @Route("/ado/home", name="ado_home")
     */
    public function home(Request $rq)
    {
        if (AdoController::authentify($this->session)) {
            $vars = [];

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

            return $this->render('ado/home.html.twig', $vars);
            // return new Response($this->twig->render('ado/profil.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }
    /**
     * @Route("/ado/profil"), name="ado_profil")
     */
    public function profil(Request $rq)
    {
        if (AdoController::authentify($this->session)) {
            $vars = [];

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

            if (count($rq->request) != 0) {
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
                    ->setBirthDate(new \DateTime($data->get('birthDate')));

                $this->em->persist($profile);
                $this->em->flush();

                $this->session->set('user', $profile);
                $vars['user'] = $profile;
            }

            return $this->render('ado/profil.html.twig', $vars);
            // return new Response($this->twig->render('ado/profil.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/ado/messages", name="ado_messages")
     */
    public function messages(Request $rq)
    {
        if (AdoController::authentify($this->session)) {
            $vars = [];

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

            return $this->render('ado/messages.html.twig', $vars);
            // return new Response($this->twig->render('ado/messages.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/ado/journal"), name="ado_journal")
     */
    public function journal(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));


        return $this->render('ado/journal.html.twig', $vars);
    }

    /**
     * @Route("/ado/videos"), name="ado_videos")
     */
    public function videos(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        $page = $this->twig->render('ado/videos.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/podcasts"), name="ado_podcasts")
     */
    public function podcasts(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));


        $page = $this->twig->render('ado/podcasts.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/audiobooks"), name="ado_audiobooks")
     */
    public function audiobooks(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));


        $page = $this->twig->render('ado/audiobooks.html.twig', $vars);

        return new Response($page);
    }

    
    /**
     * @Route("/ado/family"), name="ado_family")
     */
    public function family(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        $page = $this->twig->render('ado/family.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/news"), name="ado_news")
     */
    public function news(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        $page = $this->twig->render('ado/news.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/notes"), name="ado_notes")
     */
    public function notes(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));


        $page = $this->twig->render('ado/notes.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/community"), name="ado_community")
     */
    public function community(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));


        $page = $this->twig->render('ado/community.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/timing"), name="ado_timing")
     */
    public function timing(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));


        $page = $this->twig->render('ado/timing.html.twig', $vars);

        return new Response($page);
    }

    /**
     * @Route("/ado/visio", name="ado_visio")
     */
    public function visio(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        return new Response($this->twig->render('ado/visio.html.twig', $vars));
    }

   

    /**
     * Authentification des ados
     */
    static function authentify(SessionInterface $session)
    {
        if ($session->get('role') == 'ado' || $session->get('role') == 'admin' || $session->get('role') == 'superadmin') {
            return true;
        } else {
            return false;
        }
    }
}
