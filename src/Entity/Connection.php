<?php

namespace App\Entity;

use App\Repository\ConnectionRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass=ConnectionRepository::class)
 * @ApiResource
 */
class Connection
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $idConnector;

    /**
     * @ORM\Column(type="integer")
     */
    private $idConnectee;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdConnector(): ?int
    {
        return $this->idConnector;
    }

    public function setIdConnector(int $idConnector): self
    {
        $this->idConnector = $idConnector;

        return $this;
    }

    public function getIdConnectee(): ?int
    {
        return $this->idConnectee;
    }

    public function setIdConnectee(int $idConnectee): self
    {
        $this->idConnectee = $idConnectee;

        return $this;
    }

    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->dateCreated;
    }

    public function setDateCreated(\DateTimeInterface $dateCreated): self
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
