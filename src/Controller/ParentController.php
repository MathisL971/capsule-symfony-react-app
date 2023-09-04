<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use App\Controller\BaseController;

class ParentController extends BaseController
{
    /**
     * @Route("/parent/home", name="parent_home")
     */
    public function home(Request $rq)
    {
        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        return $this->render('parent/home.html.twig', $vars);
    }

    /**
     * @Route("/parent/journal", name="parent_journal")
     */
    public function journal(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/journal.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/videos", name="parent_videos")
     */
    public function videos(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/videos.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/podcasts", name="parent_podcasts")
     */
    public function podcasts(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/podcasts.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/audiobooks", name="parent_audiobooks")
     */
    public function audiobooks(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/audiobooks.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/messages", name="parent_messages")
     */
    public function messages(Request $rq)
    {
        // $vars = [];

        // if (ParentController::authentify($this->session)) {
        //     $vars['user'] = $this->session->get('user');
        //     $vars['role'] = $this->session->get('role');
        //     $vars['menu2'] = true;

        //     return new Response($this->twig->render('parent/messages.html.twig', $vars));
        // }

        // $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        // return new RedirectResponse('/');

        $vars = [];

        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');
        $vars['userJson'] = json_encode($this->serializer->normalize($this->session->get('user'), 'json'));

        // return new Response($this->twig->render('ado/messages.html.twig', $vars));
        return $this->render('parent/messages.html.twig', $vars);
    }

    /**
     * @Route("/parent/news", name="parent_news")
     */
    public function news(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/news.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/notes", name="parent_notes")
     */
    public function notes(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/notes.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/timing", name="parent_timing")
     */
    public function timing(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/timing.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/visio", name="parent_visio")
     */
    public function visio(Request $rq)
    {
        $vars = [];

        if (ParentController::authentify($this->session)) {
            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['menu2'] = true;

            return new Response($this->twig->render('parent/visio.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/parent/profil", name="parent_profil")
     */
    public function profil(Request $rq)
    {
        if (ParentController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            $post = $rq->request;



            return new Response($this->twig->render('parent/profil.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * Authentification des parents
     */
    static function authentify(SessionInterface $session)
    {
        if ($session->get('role') == 'parent' || $session->get('role') == 'admin' || $session->get('role') == 'superadmin') {
            return true;
        } else {
            return false;
        }
    }
}
