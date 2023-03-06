<?php

namespace App\Twig;

use DateTime;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Twig\Extension\AbstractExtension;

class AppExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            // If your filter generates SAFE HTML, you should add a third
            // parameter: ['is_safe' => ['html']]
            // Reference: https://twig.symfony.com/doc/3.x/advanced.html#automatic-escaping
            new TwigFilter('datecomplete', [$this, 'datecomplete']),
        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('function_name', [$this, 'doSomething']),
        ];
    }

    public function datecomplete(DateTime $date): string
    {
        $days = array(
            ['0' => 'dimanche '],
            ['1' => 'lundi '],
            ['2' => 'mardi '],
            ['3' => 'mercredi '],
            ['4' => 'jeudi '],
            ['5' => 'vendredi '],
            ['6' => 'samedi ']
        );

        $months = array(
            ['1' => 'janvier '],
            ['2' => 'février '],
            ['3' => 'mars '],
            ['4' => 'avril '],
            ['5' => 'mai '],
            ['6' => 'juin '],
            ['7' => 'juillet '],
            ['8' => 'août '],
            ['9' => 'septembre '],
            ['10' => 'octobre '],
            ['10' => 'novembre '],
            ['12' => 'décembre ']
        );

        $weekday = date_format($date, 'w');
        $day = date_format($date, 'j');
        $month = date_format($date, 'n');
        $year = date_format($date, 'Y');

        $date = $days[$weekday] . $day;
        $date = ($day == 1) ? $date . 'er ' : $date . ' ';
        $date .= $months[$months] . $year;

        return $date;
    }
}
