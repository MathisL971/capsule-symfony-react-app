<?php

namespace App\Controller;

use DateTime;
use App\Entity\User;
use App\Entity\Meeting;
use App\Entity\Education;
use App\Entity\Experience;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;


class ProController extends BaseController
{
    /**
     * @Route("/pro/home", name="pro_home")
     */
    public function home(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            $vars['date'] = ProController::datecomplete(new \DateTime());

            $repoM = $this->em->getRepository(Meeting::class);

            $hostedMeetings = $repoM->findByDate($this->session->get('user'), new DateTime());

            // $attendedMeetings = $repoM->findAttendedByDate($this->session->get('user'), new DateTime());

            $vars['meetings'] = $hostedMeetings;

            return new Response($this->twig->render('pro/home.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/patients", name="pro_patients")
     */
    public function patients(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/patients.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/patient/{id}", name="pro_patient")
     */
    public function patient(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');
            $vars['id'] = $rq->query->get('id', 0);

            return new Response($this->twig->render('pro/patient.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/agenda", name="pro_agenda")
     */
    public function agenda(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/agenda.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/messages", name="pro_messages")
     */
    public function messages(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/messages.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/visios", name="pro_visios")
     */
    public function visios(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/visios.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/visio", name="pro_visio")
     */
    public function visio(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/visio.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/repays", name="pro_repays")
     */
    public function repays(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/repays.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("/pro/profil", name="pro_profil")
     */
    public function profil(Request $rq)
    {
        if (ProController::authentify($this->session)) {

            $vars['user'] = $this->session->get('user');
            $vars['role'] = $this->session->get('role');

            return new Response($this->twig->render('pro/profil.html.twig', $vars));
        }

        $this->session->set('flash', 'La page demandée n\'est pas accessible hors connexion');
        return new RedirectResponse('/');
    }

    /**
     * @Route("pro/new", name="pro_new")
     */
    public function new(Request $rq)
    {
        $vars['user'] = $this->session->get('user');
        $vars['role'] = $this->session->get('role');

        if ($rq->request->has('name')) {
            $repo = $this->em->getRepository(User::class);
            $user = $repo->findOneBy(['email' => $rq->request->get('email')]);

            if (!$user) {
                $user = new User();
                $pass = $user->generate(12);
                $user->setEmail($rq->request->get('email'))
                    ->setPassword(password_hash($pass, PASSWORD_DEFAULT))
                    ->setRole($rq->request->get('role'))
                    ->setName($rq->request->get('name'))
                    ->setFirstName($rq->request->get('first_name'))
                    ->setPhoneOffice($rq->request->get('phone_office'))
                    ->setPhoneMobile($rq->request->get('phone_mobile'))
                    ->setStreet1($rq->request->get('street1'))
                    ->setStreet2($rq->request->get('street2'))
                    ->setPostcode($rq->request->get('postcode'))
                    ->setCity($rq->request->get('city'))
                    ->setStatus('pending')
                    ->setTitle($rq->request->get('title'))
                    ->setProfession($rq->request->get('profession'))
                    ->setBio($rq->request->get('bio'));


                for ($i = 1; $i < $rq->request->get('educations') + 1; $i++) {
                    if ($rq->request->get('date' . $i) != null && $rq->request->get('degree' . $i) != null && $rq->request->get('school' . $i) != null) {
                        $education = new Education();
                        $education->setDate(new DateTime($rq->request->get('date' . $i)))
                            ->setDegree($rq->request->get('degree' . $i))
                            ->setSchool($rq->request->get('school' . $i));
                        $user->addEducation($education);
                        $this->em->persist($education);
                    }
                }

                for ($i = 1; $i < $rq->request->get('experiences') + 1; $i++) {
                    if ($rq->request->get('dateStart' . $i) != null && $rq->request->get('position' . $i) != null && $rq->request->get('employer' . $i) != null) {
                        $experience = new Experience();
                        $experience->setDateStart(new DateTime($rq->request->get('dateStart' . $i)))
                            ->setPosition($rq->request->get('position' . $i))
                            ->setEmployer($rq->request->get('employer' . $i));

                        if ($rq->request->get('dateEnd' . $i == '')) {
                            $experience->setDateEnd(new DateTime($rq->request->get('dateEnd' . $i)));
                        } else {
                            $experience->setDateEnd(null);
                        }
                        $user->addExperience($experience);
                        $this->em->persist($experience);
                    }
                }

                $user->setStatus('pending');
                $this->em->persist($user);

                dump($rq->request);
                dd($user);

                $this->em->flush();

                if (isset($_FILES['pic'])) {
                    $file = $_FILES['pic'];
                    $name = $file['tmp_name'];
                    $fileExt = "." . strtolower(substr(strrchr($file['name'], '.'), 1));
                    $dest = '/profilepics/' . $user->getId() . $fileExt;

                    $resultat = move_uploaded_file($name, $dest);

                    if ($resultat) {
                        $user->setProfilePic($dest);
                        $this->em->persist($user);
                        $this->em->flush();
                        $vars['user'] = $user;
                    }
                }

                $this->session->set('flash', 'Votre demande a été soumise, elle sera examinée dans les plus brefs délais. Merci de votre intérêt.');
                return new RedirectResponse(('/'));
            } else {
                $vars['flash'] = "un utilisateur utilise déjà cet email";
            }
        }

        return new Response($this->twig->render('pro/new.html.twig', $vars));
    }

    /**
     * Authentification des pro
     */
    static function authentify(SessionInterface $session)
    {
        if ($session->get('role') == 'Pro' || $session->get('role') == 'Admin' || $session->get('role') == 'SuperAdmin') {
            return true;
        } else {
            return false;
        }
    }

    static function datecomplete(DateTime $date): string
    {
        $days = array(
            '0' => 'dimanche ',
            '1' => 'lundi ',
            '2' => 'mardi ',
            '3' => 'mercredi ',
            '4' => 'jeudi ',
            '5' => 'vendredi ',
            '6' => 'samedi '
        );

        $months = array(
            '1' => 'janvier ',
            '2' => 'février ',
            '3' => 'mars ',
            '4' => 'avril ',
            '5' => 'mai ',
            '6' => 'juin ',
            '7' => 'juillet ',
            '8' => 'août ',
            '9' => 'septembre ',
            '10' => 'octobre ',
            '10' => 'novembre ',
            '12' => 'décembre '
        );

        $weekday = date_format($date, 'w');
        $day = date_format($date, 'j');
        $month = date_format($date, 'n');
        $year = date_format($date, 'Y');

        $date = $days[$weekday] . $day;
        $date = ($day == 1) ? $date . 'er ' : $date . ' ';
        $date .= $months[$month] . $year;

        return $date;
    }
}
