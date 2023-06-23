<?php

namespace App\Repository;

use DateTime;
use DateInterval;
use DateTimeZone;
use App\Entity\User;
use DateTimeImmutable;
use App\Entity\Meeting;
use Doctrine\DBAL\Types\DateIntervalType;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Meeting>
 *
 * @method Meeting|null find($id, $lockMode = null, $lockVersion = null)
 * @method Meeting|null findOneBy(array $criteria, array $orderBy = null)
 * @method Meeting[]    findAll()
 * @method Meeting[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MeetingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Meeting::class);
    }

    public function add(Meeting $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Meeting $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByDate(User $user, DateTimeImmutable $date)
    {
        $fdate = date_format($date, 'Y-m-d-H-i-s');
        $tdate = date_format($date->add(new DateInterval('P1D')), 'Y-m-d-H-i-s');

        $meetings =  $this->createQueryBuilder('m')
            ->andWhere('m.guest LIKE :user AND m.date_meeting BETWEEN :fdate AND :tdate')
            ->setParameter('user', '%id";i:' . $user->getId() . '%')
            ->setParameter('fdate', $fdate)
            ->setParameter('tdate', $tdate)
            ->orderBy('m.date_meeting', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();

        if ($meetings) {
            foreach ($meetings as $meeting) {
                $meeting->setDateMeeting($meeting->getDateMeeting()->setTimezone(new DateTimeZone($user->getTimezone())));
            }
        }
        return $meetings;
    }





    //    /**
    //     * @return Meeting[] Returns an array of Meeting objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Meeting
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
