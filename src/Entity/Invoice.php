<?php

namespace App\Entity;

use App\Repository\InvoiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource
 */
class Invoice
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
    private $socid;

    /**
     * @ORM\Column(type="float")
     */
    private $total_ht;

    /**
     * @ORM\Column(type="float")
     */
    private $total_tva;

    /**
     * @ORM\Column(type="float")
     */
    private $total_ttc;

    /**
     * @ORM\Column(type="float")
     */
    private $remaintopay;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $note_private;

    /**
     * @ORM\Column(type="integer")
     */
    private $entity;

    /**
     * @ORM\Column(type="integer")
     */
    private $cond_reglement_id;

    /**
     * @ORM\Column(type="string", length=15)
     */
    private $cond_reglement_code;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $cond_reglement_doc;

    /**
     * @ORM\Column(type="integer")
     */
    private $mode_reglement_id;

    /**
     * @ORM\Column(type="string", length=15)
     */
    private $mode_reglement_code;

    /**
     * @ORM\OneToMany(targetEntity=Line::class, mappedBy="fk_facture", orphanRemoval=true)
     */
    private $det_lines;

    public function __construct()
    {
        $this->det_lines = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSocid(): ?int
    {
        return $this->socid;
    }

    public function setSocid(int $socid): self
    {
        $this->socid = $socid;

        return $this;
    }

    public function getTotalHt(): ?float
    {
        return $this->total_ht;
    }

    public function setTotalHt(float $total_ht): self
    {
        $this->total_ht = $total_ht;

        return $this;
    }

    public function getTotalTva(): ?float
    {
        return $this->total_tva;
    }

    public function setTotalTva(float $total_tva): self
    {
        $this->total_tva = $total_tva;

        return $this;
    }

    public function getTotalTtc(): ?float
    {
        return $this->total_ttc;
    }

    public function setTotalTtc(float $total_ttc): self
    {
        $this->total_ttc = $total_ttc;

        return $this;
    }

    public function getRemaintopay(): ?float
    {
        return $this->remaintopay;
    }

    public function setRemaintopay(float $remaintopay): self
    {
        $this->remaintopay = $remaintopay;

        return $this;
    }

    public function getNotePrivate(): ?string
    {
        return $this->note_private;
    }

    public function setNotePrivate(?string $note_private): self
    {
        $this->note_private = $note_private;

        return $this;
    }

    public function getEntity(): ?int
    {
        return $this->entity;
    }

    public function setEntity(int $entity): self
    {
        $this->entity = $entity;

        return $this;
    }

    public function getCondReglementId(): ?int
    {
        return $this->cond_reglement_id;
    }

    public function setCondReglementId(int $cond_reglement_id): self
    {
        $this->cond_reglement_id = $cond_reglement_id;

        return $this;
    }

    public function getCondReglementCode(): ?string
    {
        return $this->cond_reglement_code;
    }

    public function setCondReglementCode(string $cond_reglement_code): self
    {
        $this->cond_reglement_code = $cond_reglement_code;

        return $this;
    }

    public function getCondReglementDoc(): ?string
    {
        return $this->cond_reglement_doc;
    }

    public function setCondReglementDoc(string $cond_reglement_doc): self
    {
        $this->cond_reglement_doc = $cond_reglement_doc;

        return $this;
    }

    public function getModeReglementId(): ?int
    {
        return $this->mode_reglement_id;
    }

    public function setModeReglementId(int $mode_reglement_id): self
    {
        $this->mode_reglement_id = $mode_reglement_id;

        return $this;
    }

    public function getModeReglementCode(): ?string
    {
        return $this->mode_reglement_code;
    }

    public function setModeReglementCode(string $mode_reglement_code): self
    {
        $this->mode_reglement_code = $mode_reglement_code;

        return $this;
    }

    /**
     * @return Collection<int, Line>
     */
    public function getDetLines(): Collection
    {
        return $this->det_lines;
    }

    public function addDetLine(Line $detLine): self
    {
        if (!$this->det_lines->contains($detLine)) {
            $this->det_lines[] = $detLine;
            $detLine->setFkFacture($this);
        }

        return $this;
    }

    public function removeDetLine(Line $detLine): self
    {
        if ($this->det_lines->removeElement($detLine)) {
            // set the owning side to null (unless already changed)
            if ($detLine->getFkFacture() === $this) {
                $detLine->setFkFacture(null);
            }
        }

        return $this;
    }
}
