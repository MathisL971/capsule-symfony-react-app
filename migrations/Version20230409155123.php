<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230409155123 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE slot (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, meeting_id INT DEFAULT NULL, day DATE NOT NULL, start_hour TIME NOT NULL, end_hour TIME NOT NULL, INDEX IDX_AC0E2067A76ED395 (user_id), UNIQUE INDEX UNIQ_AC0E206767433D9C (meeting_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE slot ADD CONSTRAINT FK_AC0E2067A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE slot ADD CONSTRAINT FK_AC0E206767433D9C FOREIGN KEY (meeting_id) REFERENCES meeting (id)');
        $this->addSql('ALTER TABLE param CHANGE value value VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE slot DROP FOREIGN KEY FK_AC0E2067A76ED395');
        $this->addSql('ALTER TABLE slot DROP FOREIGN KEY FK_AC0E206767433D9C');
        $this->addSql('DROP TABLE slot');
        $this->addSql('ALTER TABLE param CHANGE value value TEXT NOT NULL');
    }
}
