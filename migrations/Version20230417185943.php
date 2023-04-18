<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230417185943 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE meeting_user DROP FOREIGN KEY FK_61622E9B67433D9C');
        $this->addSql('ALTER TABLE meeting_user DROP FOREIGN KEY FK_61622E9BA76ED395');
        $this->addSql('DROP TABLE meeting_user');
        $this->addSql('ALTER TABLE meeting ADD guest LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE meeting_user (meeting_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_61622E9B67433D9C (meeting_id), INDEX IDX_61622E9BA76ED395 (user_id), PRIMARY KEY(meeting_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE meeting_user ADD CONSTRAINT FK_61622E9B67433D9C FOREIGN KEY (meeting_id) REFERENCES meeting (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE meeting_user ADD CONSTRAINT FK_61622E9BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE meeting DROP guest');
    }
}
