<?php

namespace App\Entity;

use App\Repository\MeetingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=MeetingRepository::class)
 */
class Meeting
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $host;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, inversedBy="meetings")
     * @ORM\JoinTable(name="meeting_user")
     */
    private $guest;

    /**
     * @ORM\Column(type="date")
     */
    private $date_create;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date_meeting;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $content;

    /**
     * @ORM\OneToOne(targetEntity=Slot::class, mappedBy="meeting", cascade={"persist", "remove"})
     */
    private $slot;

    public function __construct()
    {
        $this->guest = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHost(): ?User
    {
        return $this->host;
    }

    public function setHost(?User $host): self
    {
        $this->host = $host;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getGuest(): Collection
    {
        return $this->guest;
    }

    public function addGuest(User $guest): self
    {
        if (!$this->guest->contains($guest)) {
            $this->guest[] = $guest;
        }

        return $this;
    }

    public function removeGuest(User $guest): self
    {
        $this->guest->removeElement($guest);

        return $this;
    }

    public function getDateCreate(): ?\DateTimeInterface
    {
        return $this->date_create;
    }

    public function setDateCreate(\DateTimeInterface $date_create): self
    {
        $this->date_create = $date_create;

        return $this;
    }

    public function getDateMeeting(): ?\DateTimeInterface
    {
        return $this->date_meeting;
    }

    public function setDateMeeting(\DateTimeInterface $date_meeting): self
    {
        $this->date_meeting = $date_meeting;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getSlot(): ?Slot
    {
        return $this->slot;
    }

    public function setSlot(?Slot $slot): self
    {
        // unset the owning side of the relation if necessary
        if ($slot === null && $this->slot !== null) {
            $this->slot->setMeeting(null);
        }

        // set the owning side of the relation if necessary
        if ($slot !== null && $slot->getMeeting() !== $this) {
            $slot->setMeeting($this);
        }

        $this->slot = $slot;

        return $this;
    }
}
