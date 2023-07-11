<?php

namespace App\Entity;

use App\Repository\LineRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass=LineRepository::class)
 * @ApiResource
 */
class Line
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Invoice::class, inversedBy="det_lines")
     * @ORM\JoinColumn(nullable=false)
     */
    private $fk_facture;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="integer")
     */
    private $product_type;

    /**
     * @ORM\Column(type="float")
     */
    private $qty;

    /**
     * @ORM\Column(type="float")
     */
    private $subprice;

    /**
     * @ORM\Column(type="float")
     */
    private $total_ht;

    /**
     * @ORM\Column(type="float")
     */
    private $tva_tx;

    /**
     * @ORM\Column(type="float")
     */
    private $total_tva;

    /**
     * @ORM\Column(type="float")
     */
    private $total_ttc;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFkFacture(): ?Invoice
    {
        return $this->fk_facture;
    }

    public function setFkFacture(?Invoice $fk_facture): self
    {
        $this->fk_facture = $fk_facture;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getProductType(): ?int
    {
        return $this->product_type;
    }

    public function setProductType(int $product_type): self
    {
        $this->product_type = $product_type;

        return $this;
    }

    public function getQty(): ?float
    {
        return $this->qty;
    }

    public function setQty(float $qty): self
    {
        $this->qty = $qty;

        return $this;
    }

    public function getSubprice(): ?float
    {
        return $this->subprice;
    }

    public function setSubprice(float $subprice): self
    {
        $this->subprice = $subprice;

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

    public function getTvaTx(): ?float
    {
        return $this->tva_tx;
    }

    public function setTvaTx(float $tva_tx): self
    {
        $this->tva_tx = $tva_tx;

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
}
