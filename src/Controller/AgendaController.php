<?php

namespace App\Controller;

use DateInterval;
use DateTimeZone;
use App\Entity\User;
use App\Entity\Meeting;
use App\Controller\BaseController;
use App\Controller\AdminController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AgendaController extends BaseController
{
    /**
     * @Route("/{qui}/agenda"), name="agenda")
     */
    public function agenda(Request $rq, $qui)
    {
        if (!in_array($qui, array('ado', 'parent', 'pro', 'admin', 'superadmin'))) {
            return new RedirectResponse('/');
        }


        if (AdminController::authentify($this->session)) {

            $vars = [];

            $user = $this->session->get('user');
            $vars['user'] = $user;
            $vars['role'] = $this->session->get('role');

            $repo = $this->em->getRepository(User::class);
            $vars['guests'] = $repo->findAll();

            $repoM = $this->em->getRepository(Meeting::class);

            // Affichage de l'agenda des pro
            if ($qui == 'pro') {
                // Si pas d'info date passé, on affiche la semaine en cours, sinon, on affiche la semaine demandée
                if (count($rq->request) == 0) {
                    $now = new \DateTime();
                } else {
                    $now = new \DateTime($rq->request->get('week'));
                }

                if (date_format($now, 'N') != 1) {
                    $retour = date_format($now, 'N') - 1;
                    date_sub($now, new DateInterval('P' . $retour . 'D'));
                }

                // Préparation des variables de navigation
                $before = new \DateTime(date_format($now, 'Y-m-d'));
                date_sub($before, new \DateInterval('P7D'));
                $vars['before']['button'] = date_format($before, 'Y-m-d');
                $vars['before']['text'] = 'Sem ' . date_format($before, 'W');

                $after =  new \DateTime(date_format($now, 'Y-m-d'));
                date_add($after, new \DateInterval('P7D'));
                $vars['after']['button'] = date_format($after, 'Y-m-d');
                $vars['after']['text'] = 'Sem ' . date_format($after, 'W');

                // Préparation des dates pour la requête
                $debutQuery = new \DateTimeImmutable(date_format($now, 'Y-m-d'), new DateTimeZone($user->getTimezone()));
                $dayQuery = $debutQuery->setTimezone(new DateTimeZone('UTC'));

                for ($i = 1; $i < 6; $i++) {
                    $days[$i] = ['day' => date_format($now, 'd / m / Y')];
                    $days[$i]['meetings'] = $repoM->findByDate($vars['user'], $dayQuery);
                    $day = date_add($now, new \DateInterval('P1D'));
                    $dayQuery = $dayQuery->add(new \DateInterval('P1D'));
                }

                $dateWeekend = date_format($day, 'd') . ' & ';
                $meetings[] = $repoM->findByDate($vars['user'], $dayQuery);
                $day = date_add($now, new \DateInterval('P1D'));
                $dayQuery = $dayQuery->add(new \DateInterval('P1D'));
                $dateWeekend .= date_format($day, 'd / m / Y');
                $days[$i] = ['day' => $dateWeekend];
                $meetings[] = $repoM->findByDate($vars['user'], $dayQuery);
                $days[$i]['meetings'] = array_merge($meetings['0'], $meetings['1']);
                $day = date_add($now, new \DateInterval('P1D'));
                $dayQuery = $dayQuery->add(new \DateInterval('P1D'));
                $meetings = array();

                $vars['days'] = $days;

                $contacts = $repo->findAll();
                $contactsArray = [];
                foreach ($contacts as $contact) {
                    $contactsArray[] = ['id' => $contact->getId(), 'name' => $contact->getSlug()];
                }
                $vars['contacts'] = json_encode($contactsArray);

                // Affichage
                return new Response($this->render('pro/agenda.html.twig', $vars));
            }

            // Affichage de l'agenda ado / parents / admin
            if (count($rq->request) == 0) {
                $now = new \DateTime();
            } else {
                $now = new \DateTime($rq->request->get('month'));
            }

            $debut = new \DateTime(date_format($now, 'Y-m') . '-01');
            $debutQuery = new \DateTimeImmutable(date_format($now, 'Y-m') . '-01', new DateTimeZone($user->getTimezone()));

            $before = new \DateTime(date_format($now, 'Y-m') . '-01');
            date_sub($before, new \DateInterval('P1M'));
            $vars['before']['button'] = date_format($before, 'Y-m-d');
            $vars['before']['text'] = date_format($before, 'F Y');

            $after =  new \DateTime(date_format($now, 'Y-m') . '-01');
            date_add($after, new \DateInterval('P1M'));
            $vars['after']['button'] = date_format($after, 'Y-m-d');
            $vars['after']['text'] = date_format($after, 'F Y');

            $end = new \DateTime(date_format($now, 'Y-m-t'));

            if (date_format($debut, 'N') != 1) {
                $retour = date_format($debut, 'N') - 1;
                date_sub($debut, new DateInterval('P' . $retour . 'D'));
                $debutQuery = $debutQuery->sub(new DateInterval('P' . $retour . 'D'));
            }

            $day = $debut;
            $week = 1;
            $dayQuery = $debutQuery->setTimezone(new DateTimeZone('UTC'));

            while ($debut < $end) {
                for ($i = 1; $i < 6; $i++) {
                    $days[$week][$i] = ['day' => date_format($day, 'd / m / Y')];
                    $days[$week][$i]['meetings'] = $repoM->findByDate($vars['user'], $dayQuery);
                    $day = date_add($debut, new \DateInterval('P1D'));
                    $dayQuery = $dayQuery->add(new \DateInterval('P1D'));
                }

                $dateWeekend = date_format($day, 'd') . ' & ';
                $meetings[] = $repoM->findByDate($vars['user'], $dayQuery);
                $day = date_add($debut, new \DateInterval('P1D'));
                $dayQuery = $dayQuery->add(new \DateInterval('P1D'));
                $dateWeekend .= date_format($day, 'd / m / Y');
                $days[$week][$i] = ['day' => $dateWeekend];
                $meetings[] = $repoM->findByDate($vars['user'], $dayQuery);
                $days[$week][$i]['meetings'] = array_merge($meetings['0'], $meetings['1']);
                $day = date_add($debut, new \DateInterval('P1D'));
                $dayQuery = $dayQuery->add(new \DateInterval('P1D'));
                $meetings = array();
                $week += 1;
            }
            //dd($days);
            $vars['days'] = $days;

            $contacts = $repo->findAll();
            $contactsArray = [];
            foreach ($contacts as $contact) {
                $contactsArray[] = ['id' => $contact->getId(), 'name' => $contact->getSlug()];
            }
            $vars['contacts'] = json_encode($contactsArray);

            return new Response($this->render($qui . '/agenda.html.twig', $vars));
        }

        return new RedirectResponse('/');
    }
}
