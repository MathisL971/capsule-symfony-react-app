<?php

namespace App\Entity;

use App\Repository\ConversationRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass=ConversationRepository::class)
 * @ApiResource
 */
class Conversation
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
    private $idCreator;

    /**
     * @ORM\Column(type="integer")
     */
    private $idCorrespondant;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateLastMessage;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="integer")
     */
    private $idLastSender;

    /**
     * @ORM\Column(type="boolean")
     */
    private $creatorHasNewMessage;

    /**
     * @ORM\Column(type="boolean")
     */
    private $correspondantHasNewMessage;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdCreator(): ?int
    {
        return $this->idCreator;
    }

    public function setIdCreator(int $idCreator): self
    {
        $this->idCreator = $idCreator;

        return $this;
    }

    public function getIdCorrespondant(): ?int
    {
        return $this->idCorrespondant;
    }

    public function setIdCorrespondant(int $idCorrespondant): self
    {
        $this->idCorrespondant = $idCorrespondant;

        return $this;
    }

    public function getDateLastMessage(): ?\DateTimeInterface
    {
        return $this->dateLastMessage;
    }

    public function setDateLastMessage(\DateTimeInterface $dateLastMessage): self
    {
        $this->dateLastMessage = $dateLastMessage;

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

    public function getIdLastSender(): ?int
    {
        return $this->idLastSender;
    }

    public function setIdLastSender(int $idLastSender): self
    {
        $this->idLastSender = $idLastSender;

        return $this;
    }

    public function isCreatorHasNewMessage(): ?bool
    {
        return $this->creatorHasNewMessage;
    }

    public function setCreatorHasNewMessage(bool $creatorHasNewMessage): self
    {
        $this->creatorHasNewMessage = $creatorHasNewMessage;

        return $this;
    }

    public function isCorrespondantHasNewMessage(): ?bool
    {
        return $this->correspondantHasNewMessage;
    }

    public function setCorrespondantHasNewMessage(bool $correspondantHasNewMessage): self
    {
        $this->correspondantHasNewMessage = $correspondantHasNewMessage;

        return $this;
    }
}
