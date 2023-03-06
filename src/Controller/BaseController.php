<?php

namespace App\Controller;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class BaseController
{
    protected $twig;
    protected $em;
    protected $session;

    public function __construct(EntityManagerInterface $em, SessionInterface $session)
    {
        $loader = new FilesystemLoader('../templates');
        $this->twig = new Environment($loader, ['debug' => true]);
        $this->twig->addExtension(new \Twig\Extension\DebugExtension());
        // $this->rq = $rq;
        $this->em = $em;
        $this->session = $session;
    }
}
