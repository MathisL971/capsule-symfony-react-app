<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass=MessageRepository::class)
 * @ApiResource
 */
class Message
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $text;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateSent;

    /**
     * @ORM\Column(type="integer")
     */
    private $idSender;

    /**
     * @ORM\Column(type="integer")
     */
    private $idReceiver;

    /**
     * @ORM\Column(type="integer")
     */
    private $idConversation;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getDateSent(): ?\DateTimeInterface
    {
        return $this->dateSent;
    }

    public function setDateSent(\DateTimeInterface $dateSent): self
    {
        $this->dateSent = $dateSent;

        return $this;
    }

    public function getIdSender(): ?int
    {
        return $this->idSender;
    }

    public function setIdSender(int $idSender): self
    {
        $this->idSender = $idSender;

        return $this;
    }

    public function getIdReceiver(): ?int
    {
        return $this->idReceiver;
    }

    public function setIdReceiver(int $idReceiver): self
    {
        $this->idReceiver = $idReceiver;

        return $this;
    }

    public function getIdConversation(): ?int
    {
        return $this->idConversation;
    }

    public function setIdConversation(int $idConversation): self
    {
        $this->idConversation = $idConversation;

        return $this;
    }
}
