<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use DateInterval;
use DateTime;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class LoginController extends AbstractController
{
    /**
     * @Route("/login", name="app_login")
     */
    public function show_login_form(Request $rq): Response
    {
        $data = ['controller_name' => 'LoginController', 'message' => 'Returning from login...'];
        return $this->render('login/index.html.twig', $data);
    }

    /**
     * @Route("/login", name="app_login_handle")
     */
    public function handle_login(Request $rq): Response
    {

    }
}