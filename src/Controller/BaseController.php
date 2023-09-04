<?php

namespace App\Controller;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\Extension\DebugExtension;
// use Symfony\Component\HttpFoundation\Request;
use Twig\Extra\Intl\IntlExtension;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;


class BaseController extends AbstractController
{
    protected $twig;
    protected $em;
    protected $session;
    protected $serializer;

    public function __construct(EntityManagerInterface $em, SessionInterface $session, SerializerInterface $serializer)
    {

        $loader = new FilesystemLoader('../templates');
        $this->twig = new Environment($loader, ['debug' => true]);
        $this->twig->addExtension(new DebugExtension());
        $this->twig->addExtension(new IntlExtension());
        $this->em = $em;
        $this->session = $session;
        $this->serializer = $serializer;
    }
}
