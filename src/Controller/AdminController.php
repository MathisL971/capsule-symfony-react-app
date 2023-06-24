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
use DateInterval;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Firebase\JWT\JWT;
use SessionIdInterface;

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
     * @Route("/admin/agenda/addMeeting", name="admin_add_meeting")
     */
    public function add_meeting(Request $rq, SessionInterface $session)
    {
        $vars['role'] = $session->get('role');

        $post = $rq->request;

        $repo = $this->em->getRepository(User::class);
        $user = $this->session->get('user');
        $host = $repo->findOneBy(['id' => $user->getId()]);

        $dateM = new \DateTime($post->get('date_meeting'), new DateTimeZone($user->getTimezone()));
        $dateM->setTimezone(new DateTimeZone('UTC'));

        $meeting = new Meeting;
        $meeting->setTitle($post->get('title'))
            ->setDateMeeting($dateM)
            ->setDateCreate(new \DateTime())
            ->setHost($host)
            ->setContent(($post->get('content')));

        if (!in_array($host->getId(), $_POST['guests'])) {
            $meeting->addGuest($host);
        }

        if ($post->get('guests')) {
            foreach ($_POST['guests'] as $id) {
                $guest = $repo->findOneBy(['id' => $id]);
                $meeting->addGuest($guest);
            }
            if ($post->get('visio')) {
                $meeting->setVisio(AdminController::randomString(64));
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
     * @Route("/admin/meeting/{id<\d+>?0}", name="admin_meeting")
     */
    public function meeting(Request $rq, SessionInterface $session, $id)
    {
        $vars['role'] = $session->get('role');

        $repoU = $this->em->getRepository(User::class);
        $repoM = $this->em->getRepository(Meeting::class);

        if (AdminController::authentify($session)) {

            if ($id == 0) {
                return new RedirectResponse('/admin/home');
            }

            if (isset($_POST['delete'])) {
                $meeting = $repoM->find($id);
                $this->em->remove($meeting);
                $this->em->flush();

                return new RedirectResponse('/admin/agenda');
            }

            if (isset($_POST['id'])) {
                $meeting = $repoM->find($id);

                $meeting->setTitle($rq->request->get('title'))
                    ->setDateMeeting(new \DateTime($rq->request->get('date_meeting')))
                    ->setContent(($rq->request->get('content')));;

                if ($meeting->getGuest()) {
                    foreach ($meeting->getGuest() as $guest) {
                        $listed[] = $guest->getId();
                    }
                    foreach ($_POST['guest'] as $guestId) {
                        if (!in_array($guestId, $listed)) {
                            $meeting->addGuest($repoU->findOneBy(['id' => $guestId]));
                        }
                    }

                    foreach ($listed as $guestId) {
                        if (!in_array($guestId, $_POST['guest'])) {
                            $meeting->removeGuest($repoU->findOneBy(['id' => $guestId]));
                        }
                    }
                } else {
                    foreach ($_POST['guest'] as $guestId) {
                        $meeting->addGuest($repoU->findOneBy(['id' => $guestId]));
                    }
                }

                $this->em->persist($meeting);
                $this->em->flush();
            }


            $user = $repoU->find($session->get('user')->getId());
            $vars['user'] = $user;
            $vars['guests'] = $repoU->findAll();

            $meeting = $repoM->find($id);
            $meeting->setDateMeeting($meeting->getDateMeeting()->setTimezone(new DateTimeZone($user->getTimezone())));

            foreach ($meeting->getGuest() as $guest) {
                $guestsId[] = $guest->getId();
                $vars['guestsId'] = $guestsId;
            }

            if (in_array($user->getId(), $guestsId)) {
                $vars['meeting'] = $meeting;

                return new Response($this->twig->render('admin/meeting.html.twig', $vars));
            } else {
                return new RedirectResponse('/admin/home');
            }
        }
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
     * @Route("/admin/user/resetpass/{id<\d+>}", name="admin_user_retespass")
     */
    public function user_resetpass(SessionInterface $session, EntityManagerInterface $em, $id)
    {
        if (AdminController::authentify($session)) {
            $user = $em->getRepository(User::class)->findOneBy(['id' => $id]);
            $password = AdminController::randomString(12, 1);
            $user->setPassword(password_hash($password, PASSWORD_DEFAULT));

            $em->persist($user);
            $em->flush();

            ini_set("SMTP", "SSL0.OVH.NET");

            $entete  = 'MIME-Version: 1.0' . "\r\n";
            $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            $entete .= 'From: contact@capsule-ado.com' . "\r\n";

            $message = 'Bonjour' . "\r\n" . '<p>Votre mot de passe a été réinitialisé par un administrateur.';
            $message .= '<br> Votre mot de passe provisoire est : ' . $password . '<br
            <p> <b>Pensez à le réinitialiser lors de votre connexion.</b> <p><b><i>Caspule</b></i>';

            $retour = mail($user->getEmail(), 'Nouveau mot de passe', $message, $entete);
            $retourbis = mail('christophe@klungstene.fr', 'Réinit mot de passe', $password, $entete);

            $results = 'Mot de passe provisoire : ' . $password . '<br>
                retour : ' . $retour . '<br>
                retour2 = ' . $retourbis;

            dd($results);

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

            if (count($rq->request)) {
                $repoM = $this->em->getRepository(Meeting::class);
                $meeting = $repoM->find($rq->request->get('meeting'));
                //dump($meeting);

                // if (time() < (date_timestamp_get($meeting->getDateMeeting()) - 2 * 60 * 60)) {
                //     dump('timestamp now : ' . number_format(date_timestamp_get(new DateTime('now', new DateTimeZone('Europe/Paris'))), 0, ",", " "));
                //     dump('timestamp meeting : ' . number_format(date_timestamp_get($meeting->getDateMeeting()), 0, ",", " "));
                //     dd('Trop tôt');
                // }

                // if (time() > (date_timestamp_get($meeting->getDateMeeting()) + 2 * 60 * 60)) {
                //     return new RedirectResponse('/admin/agenda');
                // }

                $repoP = $this->em->getRepository(Param::class);
                $kid = $repoP->findOneBy(['name' => 'kid']);

                $file = fopen('../src/Security/jaasauth.key', 'r');
                $privateKey = fread($file, filesize('../src/Security/jaasauth.key'));
                $moderator = false;
                if ($meeting->getHost()->getId() == $vars['user']->getId()) {
                    $moderator = true;
                }

                $payload = array(
                    "aud" => "jitsi",
                    "iss" => "chat",
                    "exp" => time() + 3600 * 2,  //ATTENTION A CHANGER !!!! C'est le timestamp d'expiration
                    "nbf" => time(),  //ATTENTION A CHANGER !!!! C'est le timestamp not before
                    "sub" => $repoP->findOneBy(['name' => 'sub'])->getValue(),
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
                            "moderator" => $moderator,
                            "name" => $vars['user']->getFirstName(),
                            "id" => "auth0|63749560694ed42ee589972d",
                            "avatar" => "",
                            "email" => $vars['user']->getEmail()
                        )
                    ),
                    "room" => $meeting->getVisio(),
                );

                $jwt = JWT::encode($payload, $privateKey, 'RS256', null, array('kid' => $kid->getValue()));

                $vars['domain'] = '8x8.vc';
                $vars['room'] = 'vpaas-magic-cookie-e9f22e0cc2264adc9c5beffec3ea2822/' . $meeting->getVisio();
                $vars['jwt'] = $jwt;
                $vars['subject'] = $meeting->getTitle();

                $page = $this->twig->render('admin/visio2.html.twig', $vars);

                return new Response($page);
            }
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

            $repoP = $this->em->getRepository(Param::class);
            $kid = $repoP->findOneBy(['name' => 'kid']);

            $file = fopen('../src/Security/jaasauth.key', 'r');
            $privateKey = fread($file, filesize('../src/Security/jaasauth.key'));

            $payload = array(
                "aud" => "jitsi",
                "iss" => "chat",
                "exp" => time() + 3600 * 2,  //ATTENTION A CHANGER !!!! C'est le timestamp d'expiration
                "nbf" => time(),  //ATTENTION A CHANGER !!!! C'est le timestamp not before
                "sub" => $repoP->findOneBy(['name' => 'sub'])->getValue(),
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
                "room" => "31sd564sd654sd654sdf"
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS256', null, array('kid' => $kid->getValue()));

            $vars['domain'] = '8x8.vc';
            $vars['room'] = 'vpaas-magic-cookie-e9f22e0cc2264adc9c5beffec3ea2822/31sd564sd654sd654sdf';
            $vars['jwt'] = $jwt;
            $vars['subject'] = "Salon des admins";

            $page = $this->twig->render('admin/visio2.html.twig', $vars);

            return new Response($page);
        }

        return new RedirectResponse('/');
    }

    /**
     * @Route("/admin/profil", name="admin_profil")
     * @Route("/superadmin/profil", name="superadmin_profil")
     */
    public function profil(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {

            $vars = [];

            $user = $session->get('user');
            $vars['user'] = $user;
            $vars['role'] = $session->get('role');

            $post = $rq->request;
            if (count($post) > 0) {
                $repo = $this->em->getRepository(User::class);
                $user = $repo->find($vars['user']->getId());

                if ($post->get('form') == 'infos') {

                    foreach ($post as $key => $value) {
                        $method = 'set' . ucfirst($key);
                        if ($key == 'birthDate') {
                            if ($value != "") {
                                $value  = new DateTime($post->get('birthDate'));
                                $user->$method($value);
                            }
                        } else {

                            if (is_callable([$user, $method])) {
                                $user->$method($value);
                            }
                        }
                    }
                }

                $file = $_FILES['profilePic'];
                if ($file['size'] > 0) {
                    $name = $file['tmp_name'];
                    $fileExt = "." . strtolower(substr(strrchr($file['name'], '.'), 1));
                    $dest = 'profilepics/' . $vars['user']->getId() . $fileExt;

                    $resultat = move_uploaded_file($name, $dest);
                    if ($resultat) {
                        $user->setProfilePic($dest);
                    }
                }

                $this->em->persist($user);
                $this->em->flush();
                $vars['user'] = $user;
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
     * @Route("/admin/updatePassword", name="admin_updatePassword")
     */
    public function updatePassword(Request $rq, SessionInterface $session)
    {
        if (AdminController::authentify($session)) {
            if (!empty($_POST)) {
                if ($rq->request->get('new') != $rq->request->get('repeat')) {
                    $vars['flash'] = "Le nouveau mot de passe n'est pas identique à la resaisie du nouveau mot de passe.";
                } else {
                    $repo = $this->em->getRepository(User::class);
                    $user = $repo->find($session->get('user')->getId());

                    if (password_verify($rq->request->get('old'), $user->getPassword())) {
                        $user->setPassword(password_hash($rq->request->get('new'), PASSWORD_DEFAULT));
                        $this->em->persist($user);
                        $this->em->flush();
                        return new RedirectResponse('/admin/profil');
                    } else {
                        $vars['flash'] = "Le mot de passe saisi n'a pas permis d'identifier l'utilisateur.";
                    }
                }
            }

            $vars['user'] = $session->get('user');
            $vars['role'] = $session->get('role');

            return new Response($this->twig->render('admin/updatePassword.html.twig', $vars));
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

    /**
     * Génération de chaine de caractères aléatoires
     */
    static function randomString($length, $special = 0)
    {
        $base = 'abcdefghiujklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $specials = '$%*+-=_-;:!§.#&€';

        if ($special) {
            $base .= $specials;
        }

        $nb = strlen($base);
        $string = '';

        for ($i = 1; $i <= $length; $i++) {
            $string .= substr($base, rand(1, $nb), 1);
        }

        return $string;
    }
}
