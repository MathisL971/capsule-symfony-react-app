<?php

namespace App\Controller;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\Extension\DebugExtension;
// use Symfony\Component\HttpFoundation\Request;
use Twig\Extra\Intl\IntlExtension;
use Doctrine\ORM\EntityManagerInterface;
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
        $this->twig->addExtension(new DebugExtension());
        $this->twig->addExtension(new IntlExtension());
        $this->em = $em;
        $this->session = $session;
    }
}
