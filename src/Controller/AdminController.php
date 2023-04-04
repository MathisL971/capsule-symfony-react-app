<?php

namespace App\Controller;

use App\Entity\Task;
use App\Entity\User;
use App\Entity\Meeting;
use App\Entity\Education;
use App\Entity\Ressource;
use App\Entity\Experience;
use App\Controller\BaseController;
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

            $kid = 'vpaas-magic-cookie-e9f22e0cc2264adc9c5beffec3ea2822/322a75';
            $privateKey = <<<EOD
            -----BEGIN RSA PRIVATE KEY-----
            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
            -----END RSA PRIVATE KEY-----            
            EOD;

            $publicKey = <<<EOD
            -----BEGIN PUBLIC KEY-----
            MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwkXDfAoInGGuruuWbK8O
            rFJ3C+Zhi/DiUPkTamS4YY39PMdQdvEAXbX0QopfrAcpyFH6cfD+TgYv0ByDy0jY
            deAurNB83DLPrR1Pu4B23TUxI5TW/yyOBRovVpA38eHi6rZ2vbwXaEoOlfQ3RIMB
            yNlMMO0N/RBmLSGVIQ71UCCv6iWKOCmZ4R+aP3ttKbfuIzoeDR35Q+tBgSYXRst7
            dUu42p6YN99mCkCnD3ZNCDBZ95N4bHu931TCwEc3U0ALrEYQIzwQFVjsf99DUME7
            tGxlNA/9H1zW/x5IPFvigvFiAD4HWXM19toOW+oHAw6x2R9Tk6v6nnjBy/geJwN6
            CylPODnjDWCLv9y0I0y3A50mIbBIfwiDzSc/MvlBDukwy1yoY/6mOKRyqVSE+htm
            Z3ND/sT6oc3/h9mqtGTKnnswGW7R+goahVp8QX4HGx0SCC+dKFKS+H8Av7CgpLXF
            HTVRFU2uuxXyqhtiXT5wXovS3m5gwo3tpXlmyYmnsOHxnu3dXj5ABrDAL0teG7Gr
            uTNebOuJ6h8n32S9IxGtIbJxZys8X98kw+nLgeSLydsRL1wNC8pIn84wfJopIZuP
            ZldcjgK1gL6OWkFdSr1ueXIJNNw5vK4hO8V1B0X4iAs8oQcVnm5xsA0AwME7RdD7
            NSGWp/i+B6WOQotXjQCbQycCAwEAAQ==
            -----END PUBLIC KEY-----
            EOD;

            $payload = array(
                "aud" => "jitsi",
                "iss" => "chat",
                "iat" => 1680609623,
                "exp" => 1680616823,
                "nbf" => 1680609618,
                "sub" => "vpaas-magic-cookie-e9f22e0cc2264adc9c5beffec3ea2822",
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
                        "name" => "Chris",
                        "id" => "auth0|63749560694ed42ee589972d",
                        "avatar" => "",
                        "email" => "christophe@capsule-ado.com"
                    )
                ),
                "room" => "SalonDesAdmin"
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS256', null, array('kid' => $kid));
            // echo "Encode:\n" . print_r($jwt, true) . "\n";
            // $decoded = JWT::decode($jwt, new Key($publicKey, 'RS256'));
            /*
             NOTE: This will now be an object instead of an associative array. To get
             an associative array, you will need to cast it as such:
            */
            // $decoded_array = (array) $decoded;
            // echo "<p>Decode:\n" . print_r($decoded_array, true) . "\n";
            // die();

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


            $vars = [];

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');
            $vars['post'] = $_POST;
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
