<?php

namespace App\Controller;

use App\Entity\Task;
use App\Entity\User;
use App\Entity\Meeting;
use App\Entity\Education;
use App\Entity\Ressource;
use App\Entity\Experience;
use App\Controller\BaseController;
use App\Entity\Param;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class AdminController extends BaseController
{

    /**
     * @Route("/admin/home", name="admin_home")
     */
    public function home(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/home.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/agenda", name="admin_agenda")
     */
    public function agenda(Request $rq)
    {
        if (AdminController::authentify($this->session)) {

            $vars = [];

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            $repo = $this->em->getRepository(USer::class);
            $vars['guests'] = $repo->findAll();

            setlocale(LC_TIME, "fr_FR");

            if (count($rq->request) == 0) {
                $now = new \DateTime();
            } else {
                $now = new \DateTime($rq->request->get('month'));
            }

            $range = 0;
            $debut = new \DateTime(date_format($now, 'Y-m') . '-01');

            $before = new \DateTime(date_format($now, 'Y-m') . '-01');
            date_sub($before, new \DateInterval('P1M'));
            $vars['before']['button'] = date_format($before, 'Y-m-d');
            $vars['before']['text'] = date_format($before, 'F Y');

            $after =  new \DateTime(date_format($now, 'Y-m') . '-01');
            date_add($after, new \DateInterval('P1M'));
            $vars['after']['button'] = date_format($after, 'Y-m-d');
            $vars['after']['text'] = date_format($after, 'F Y');

            if (date_format($debut, 'w') != 1 and date_format($debut, 'w') != 0) {
                $interval = date_format($debut, 'w') - 1;
                $range = $interval + date_format($debut, 't');
                $interval = 'P' . $interval . 'D';
                $debut = date_sub($debut, new \DateInterval('P4D'));
            }

            if (date_format($debut, 'w') == 0) {
                $interval = 'P6D';
                $range = 6 + date_format($now, 't');
                $debut = date_sub($debut, new \DateInterval($interval));
            }

            if (date_format($debut, 'w') == 1) {
                $range = date_format($now, 't');
            }

            $range = ceil($range / 7) * 7;
            $vars['range'] = $range;
            $days[0] = ['day' => new \DateTime(date_format($debut, 'Y-m-d'))];

            if (date_format($days[0]['day'], 'm') == date_format($debut, 'm')) {
                $days[0]['class'] = 'faded';
            }

            for ($i = 1; $i < $range; $i++) {
                $day = date_add($debut, new \DateInterval('P1D'));
                $days[$i] = ['day' => new \DateTime(date_format($day, 'Y-m-d'))];
            }

            $vars['days'] = $days;

            return new Response($this->twig->render('admin/agenda.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/agenda/addMeeting", name="admin_add_meeting")
     */
    public function add_meeting(Request $rq)
    {
        $post = $rq->request;

        $repo = $this->em->getRepository(User::class);
        $user = $this->session->get('user');
        $host = $repo->findOneBy(['id' => $user->getId()]);

        $meeting = new Meeting;
        $meeting->setTitle($post->get('title'))
            ->setDateMeeting(new \DateTime($post->get('date_meeting')))
            ->setDateCreate(new \DateTime())
            ->setHost($host)
            ->setContent(($post->get('content')));

        if ($post->get('guest')) {
            $guests[] = $post->get('guest');

            foreach ($guests as $id) {
                $guest = $repo->findOneBy(['id' => $id]);
                $meeting->addGuest($guest);
            }
        }
        $this->em->persist($meeting);
        $this->em->flush();

        return new RedirectResponse('/admin/agenda');
    }

    /**
     * @Route("/admin/agenda/addTask", name="admin_add_task")
     */
    public function add_task(Request $rq)
    {
        $post = $rq->request;

        $repo = $this->em->getRepository(User::class);
        $user = $this->session->get('user');
        $owner = $repo->findOneBy(['id' => $user->getId()]);

        $task = new Task;
        $task->setTitle($post->get('title'))
            ->setDueDate(new \DateTime($post->get('due_date')))
            ->setOwner($owner)
            ->setDateCreate(new \DateTime())
            ->setContent($post->get('content'));

        $this->em->persist($task);
        $this->em->flush();

        return new RedirectResponse('/admin/agenda');
    }

    /**
     * @Route("/admin/users/", name="admin_users")
     */
    public function users()
    {
        if (AdminController::authentify($this->session)) {

            $vars = [];

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            $repo = $this->em->getRepository(User::class);
            $users = $repo->findAll();

            $vars['users'] = $users;

            return new Response($this->twig->render('admin/users.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/{id<\d+>}", name="admin_user")
     */
    public function user(SessionInterface $session, EntityManagerInterface $em, $id)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $vars['profile'] = $em->getRepository(User::class)->findOneBy(['id' => $id]);
            $vars['educations'] = $em->getRepository(Education::class)->findBy(['userId' => $id]);
            $vars['experiences'] = $em->getRepository(Experience::class)->findBy(['userId' => $id]);

            $page = $this->twig->render('admin/user.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/update/{id<\d+>}", name="admin_user_update")
     */
    public function user_update(Request $rq, SessionInterface $session, EntityManagerInterface $em, $id)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $vars['profile'] = $em->getRepository(User::class)->findOneBy(['id' => $id]);

            $page = $this->twig->render('admin/user.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/activate/{id<\d+>}", name="admin_user_activate")
     */
    public function user_activate($id)
    {
        if (AdminController::authentify($this->session)) {
            $repo = $this->em->getRepository(User::class);
            $user = $repo->findOneBy(['id' => $id]);

            $user->setStatus('active');
            $this->em->persist($user);
            $this->em->flush();

            return new RedirectResponse('/admin/user/' . $user->getId());
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/reactivate/{id<\d+>}", name="admin_user_reactivate")
     */
    public function user_reactivate(Request $rq, $id)
    {
        if (AdminController::authentify($this->session)) {
            $vars = [];

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            $profile = $this->em->getRepository(User::class)->findOneBy(['id' => $id]);
            $profile->setStatus('active');

            $this->em->persist($profile);
            $this->em->flush();

            $vars['profile'] = $profile;

            return new Response($this->twig->render('admin/user.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/upgrade/{id<\d+>}", name="admin_user_upgrade")
     */
    public function user_upgrade(Request $rq, SessionInterface $session, EntityManagerInterface $em, $id)
    {
        if (AdminController::authentify($session)) {
            $user = $em->getRepository(User::class)->findOneBy(['id' => $id]);
            $user->setRole('Admin');

            $em->persist($user);
            $em->flush();

            return new RedirectResponse('/admin/user/' . $user->getId());
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/upgrade2/{id<\d+>}", name="admin_user_upgrade2")
     */
    public function user_upgrade2(Request $rq, SessionInterface $session, EntityManagerInterface $em, $id)
    {
        if (AdminController::authentify($session)) {
            $user = $em->getRepository(User::class)->findOneBy(['id' => $id]);
            $user->setRole('SuperAdmin');

            $em->persist($user);
            $em->flush();

            return new RedirectResponse('/admin/user/' . $user->getId());
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/user/suspend/{id<\d+>}", name="admin_user_suspend")
     */
    public function user_suspend(Request $rq, SessionInterface $session, EntityManagerInterface $em, $id)
    {
        if (AdminController::authentify($session)) {
            $user = $em->getRepository(User::class)->findOneBy(['id' => $id]);
            $user->setStatus('suspended');

            $em->persist($user);
            $em->flush();

            return new RedirectResponse('/admin/user/' . $user->getId());
        }

        return new RedirectResponse('/');
    }


    /**
     * @Route("/admin/ressources", name="admin_ressources")
     */
    public function ressources(SessionInterface $session, Request $rq, EntityManagerInterface $em)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            if ($rq->request->count() != 0) {
                $url = $rq->request->get('url');
                preg_match('#(http[s]?)://[www.]*([a-zA-Z0-9.]*)/{1}(watch\?v=)?([a-zA-Z0-9]*)#', $url, $matches);
                $url = 'https://www.youtube.com/embed/' . $matches['4'];

                $repo = $em->getRepository(User::class);
                $user = $repo->findOneBy(['id' => $vars['user']->getId()]);

                $ressource = new Ressource;
                $ressource->setType($rq->request->get('type'))
                    ->setSource($rq->request->get('source'))
                    ->setUrl($url)
                    ->setDateUpload(new \Datetime())
                    ->setStatus('visible')
                    ->setAuthor($rq->request->get('author'))
                    ->setUploadedBy($user);

                $em->persist($ressource);
                $em->flush();

                $session->set('flash', 'La nouvelle ressource a été enregistrée');
            }

            $repoRessource = $em->getRepository(Ressource::class);
            $vars['videos'] = $repoRessource->findBy(['type' => 'video'], ['id' => 'DESC'], 10);

            $page = $this->twig->render('admin/ressources.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/revue", name="admin_revue")
     */
    public function revue(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/revue_presse.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/support", name="admin_support")
     */
    public function support(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/support.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/billing", name="admin_billing")
     */
    public function billing(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/billing.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/repay", name="admin_repay")
     */
    public function repay(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/repay.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/visios", name="admin_visios")
     */
    public function visios(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/visios.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/visio", name="admin_visio")
     */
    public function visio(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $page = $this->twig->render('admin/visio.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/visio2", name="admin_visio2")
     */
    public function visio2(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $paramRepo = $this->em->getRepository(Param::class);
            $kid = $paramRepo->findOneBy(['name' => 'kid']);

            $file = fopen('../src/Security/jaasauth.key', 'r');
            $privateKey = fread($file, filesize('../src/Security/jaasauth.key'));

            $payload = array(
                "aud" => "jitsi",
                "iss" => "chat",
                "exp" => time() + 3600 * 2,  //ATTENTION A CHANGER !!!! C'est le timestamp d'expiration
                "nbf" => time(),  //ATTENTION A CHANGER !!!! C'est le timestamp not before
                "sub" => $paramRepo->findOneBy(['name' => 'sub'])->getValue(),
                "context" => array(
                    "features" => array(
                        "livestreaming" => true,
                        "outbound-call" => true,
                        "sip-outbound-call" => false,
                        "transcription" => true,
                        "recording" => true
                    ),
                    "user" => array(
                        "hidden-from-recorder" => false,
                        "moderator" => true,
                        "name" => $vars['user']->getFirstName(),
                        "id" => "auth0|63749560694ed42ee589972d",
                        "avatar" => "",
                        "email" => $vars['user']->getEmail()
                    )
                ),
                "room" => "SalonDesAdmin"
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS256', null, array('kid' => $kid->getValue()));

            $vars['domain'] = '8x8.vc';
            $vars['room'] = 'vpaas-magic-cookie-e9f22e0cc2264adc9c5beffec3ea2822/SalonDesAdmin';
            $vars['jwt'] = $jwt;

            $page = $this->twig->render('admin/visio2.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/profil", name="admin_profil")
     */
    public function profil(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $post = $rq->request;

            if (count($post) > 0) {
                $file = $_FILES['pic'];
                $repo = $this->em->getRepository(User::class);
                $user = $repo->find($vars['user']->getId());
                $name = $file['tmp_name'];
                $fileExt = "." . strtolower(substr(strrchr($file['name'], '.'), 1));
                $dest = 'profilepics/' . $vars['user']->getId() . $fileExt;

                $resultat = move_uploaded_file($name, $dest);

                if ($resultat) {
                    $user->setProfilePic($dest);
                    $this->em->persist($user);
                    $this->em->flush();
                    $vars['user'] = $user;
                }
            }

            return new Response($this->twig->render('admin/profil.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/textes", name="admin_textes")
     */
    public function textes(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');
            return new Response($this->twig->render('admin/textes.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/params", name="admin_params")
     */
    public function params(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {
            if (!empty($_POST)) {
                $param = new Param;
                $param->setName($rq->request->get('name'))
                    ->setValue($rq->request->get('value'))
                    ->setCategory($rq->request->get('category'))
                    ->setDescription($rq->request->get('description'))
                    ->setDateUpdate(new DateTime());

                $this->em->persist($param);
                $this->em->flush();
            }

            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            $repo = $this->em->getRepository(Param::class);
            $vars['params'] = $repo->findAll();

            return new Response($this->twig->render('admin/params.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }

    /**
     * Authentification des admins
     */
    static function authentify(SessionInterface $session)
    {
        if ($session->get('role') == 'Admin' || $session->get('role') == 'SuperAdmin') {
            return true;
        } elseif ($session->get('role') == 'Ado' || $session->get('role') == 'Jeune' || $session->get('role') == 'Parent' || $session->get('role') == 'Pro') {
            $session->set('flash', 'Tu n\'as pas les droits pour accéder à cette page');
            return false;
        } else {
            $session->set('flash', 'L\'accès à cette page néceessite d\'être connnecté.e');
            return false;
        }
    }
}
