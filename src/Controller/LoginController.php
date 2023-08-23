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

class LoginController extends BaseController
{
    /**
     * @Route("/login", name="app_login")
     */
    public function show_login_form(Request $rq): Response
    {
        $data = [];
        return $this->render('login/home.html.twig', $data);
    }

    /**
     * @Route("/login", name="app_login_handle")
     */
    public function handle_login(Request $rq): Response
    {

    }
}