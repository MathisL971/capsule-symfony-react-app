<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\BaseController;

class SignupController extends BaseController
{
    /**
     * @Route("/signup", name="app_signup")
     */
    public function index(): Response
    {
        $data = [];
        return $this->render('signup/home.html.twig', $data);
    }
}
