<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230110133935 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user ADD first_name VARCHAR(255) DEFAULT NULL, ADD phone_office VARCHAR(255) DEFAULT NULL, ADD phone_mobile VARCHAR(255) DEFAULT NULL, ADD street1 VARCHAR(255) DEFAULT NULL, ADD street2 VARCHAR(255) DEFAULT NULL, ADD postcode VARCHAR(10) NOT NULL, ADD city VARCHAR(255) NOT NULL, CHANGE role role VARCHAR(15) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user DROP first_name, DROP phone_office, DROP phone_mobile, DROP street1, DROP street2, DROP postcode, DROP city, CHANGE role role VARCHAR(10) NOT NULL');
    }
}
