<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230321151433 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE invoice (id INT AUTO_INCREMENT NOT NULL, socid INT NOT NULL, total_ht DOUBLE PRECISION NOT NULL, total_tva DOUBLE PRECISION NOT NULL, total_ttc DOUBLE PRECISION NOT NULL, remaintopay DOUBLE PRECISION NOT NULL, note_private LONGTEXT DEFAULT NULL, entity INT NOT NULL, cond_reglement_id INT NOT NULL, cond_reglement_code VARCHAR(15) NOT NULL, cond_reglement_doc VARCHAR(50) NOT NULL, mode_reglement_id INT NOT NULL, mode_reglement_code VARCHAR(15) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE line (id INT AUTO_INCREMENT NOT NULL, fk_facture_id INT NOT NULL, description LONGTEXT NOT NULL, product_type INT NOT NULL, qty DOUBLE PRECISION NOT NULL, subprice DOUBLE PRECISION NOT NULL, total_ht DOUBLE PRECISION NOT NULL, tva_tx DOUBLE PRECISION NOT NULL, total_tva DOUBLE PRECISION NOT NULL, total_ttc DOUBLE PRECISION NOT NULL, INDEX IDX_D114B4F68F43249B (fk_facture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE line ADD CONSTRAINT FK_D114B4F68F43249B FOREIGN KEY (fk_facture_id) REFERENCES invoice (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE line DROP FOREIGN KEY FK_D114B4F68F43249B');
        $this->addSql('DROP TABLE invoice');
        $this->addSql('DROP TABLE line');
    }
}
