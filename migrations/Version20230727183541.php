<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230727183541 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, ressource_id INT NOT NULL, date_create DATE NOT NULL, text LONGTEXT NOT NULL, status VARCHAR(30) NOT NULL, INDEX IDX_9474526CA76ED395 (user_id), INDEX IDX_9474526CFC6CD52A (ressource_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE education (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, date DATETIME NOT NULL, degree VARCHAR(255) NOT NULL, school VARCHAR(255) NOT NULL, INDEX IDX_DB0A5ED29D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE experience (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, date_start DATETIME NOT NULL, date_end DATETIME DEFAULT NULL, position VARCHAR(255) NOT NULL, employer VARCHAR(255) NOT NULL, INDEX IDX_590C1039D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE invoice (id INT AUTO_INCREMENT NOT NULL, socid INT NOT NULL, total_ht DOUBLE PRECISION NOT NULL, total_tva DOUBLE PRECISION NOT NULL, total_ttc DOUBLE PRECISION NOT NULL, remaintopay DOUBLE PRECISION NOT NULL, note_private LONGTEXT DEFAULT NULL, entity INT NOT NULL, cond_reglement_id INT NOT NULL, cond_reglement_code VARCHAR(15) NOT NULL, cond_reglement_doc VARCHAR(50) NOT NULL, mode_reglement_id INT NOT NULL, mode_reglement_code VARCHAR(15) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE line (id INT AUTO_INCREMENT NOT NULL, fk_facture_id INT NOT NULL, description LONGTEXT NOT NULL, product_type INT NOT NULL, qty DOUBLE PRECISION NOT NULL, subprice DOUBLE PRECISION NOT NULL, total_ht DOUBLE PRECISION NOT NULL, tva_tx DOUBLE PRECISION NOT NULL, total_tva DOUBLE PRECISION NOT NULL, total_ttc DOUBLE PRECISION NOT NULL, INDEX IDX_D114B4F68F43249B (fk_facture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE meeting (id INT AUTO_INCREMENT NOT NULL, host_id INT NOT NULL, guest LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', date_create DATE NOT NULL, date_meeting DATETIME NOT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT DEFAULT NULL, token LONGTEXT DEFAULT NULL, visio VARCHAR(255) DEFAULT NULL, INDEX IDX_F515E1391FB8D185 (host_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE param (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, date_update DATE NOT NULL, description LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ressource (id INT AUTO_INCREMENT NOT NULL, uploaded_by_id INT NOT NULL, type VARCHAR(35) NOT NULL, url VARCHAR(255) NOT NULL, source VARCHAR(255) NOT NULL, date_upload DATE NOT NULL, status VARCHAR(30) NOT NULL, author VARCHAR(255) NOT NULL, INDEX IDX_939F4544A2B28FE8 (uploaded_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE slot (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, meeting_id INT DEFAULT NULL, day DATE NOT NULL, start_hour TIME NOT NULL, end_hour TIME NOT NULL, INDEX IDX_AC0E2067A76ED395 (user_id), UNIQUE INDEX UNIQ_AC0E206767433D9C (meeting_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE specialty (id INT AUTO_INCREMENT NOT NULL, french VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE task (id INT AUTO_INCREMENT NOT NULL, owner_id INT NOT NULL, date_create DATE NOT NULL, due_date DATE DEFAULT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT NOT NULL, INDEX IDX_527EDB257E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE task_user (task_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_FE2042328DB60186 (task_id), INDEX IDX_FE204232A76ED395 (user_id), PRIMARY KEY(task_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, role VARCHAR(15) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) DEFAULT NULL, first_name VARCHAR(255) DEFAULT NULL, phone_office VARCHAR(255) DEFAULT NULL, phone_mobile VARCHAR(255) DEFAULT NULL, street1 VARCHAR(255) DEFAULT NULL, street2 VARCHAR(255) DEFAULT NULL, postcode VARCHAR(10) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, status VARCHAR(25) DEFAULT NULL, profile_pic VARCHAR(255) DEFAULT NULL, country VARCHAR(60) DEFAULT NULL, birth_date DATE DEFAULT NULL, activation_key VARCHAR(47) DEFAULT NULL, title VARCHAR(20) DEFAULT NULL, profession VARCHAR(80) DEFAULT NULL, bio LONGTEXT DEFAULT NULL, socid INT DEFAULT NULL, timezone VARCHAR(255) NOT NULL, alias VARCHAR(50) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CFC6CD52A FOREIGN KEY (ressource_id) REFERENCES ressource (id)');
        $this->addSql('ALTER TABLE education ADD CONSTRAINT FK_DB0A5ED29D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE experience ADD CONSTRAINT FK_590C1039D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE line ADD CONSTRAINT FK_D114B4F68F43249B FOREIGN KEY (fk_facture_id) REFERENCES invoice (id)');
        $this->addSql('ALTER TABLE meeting ADD CONSTRAINT FK_F515E1391FB8D185 FOREIGN KEY (host_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE ressource ADD CONSTRAINT FK_939F4544A2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE slot ADD CONSTRAINT FK_AC0E2067A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE slot ADD CONSTRAINT FK_AC0E206767433D9C FOREIGN KEY (meeting_id) REFERENCES meeting (id)');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB257E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE task_user ADD CONSTRAINT FK_FE2042328DB60186 FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE task_user ADD CONSTRAINT FK_FE204232A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CA76ED395');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CFC6CD52A');
        $this->addSql('ALTER TABLE education DROP FOREIGN KEY FK_DB0A5ED29D86650F');
        $this->addSql('ALTER TABLE experience DROP FOREIGN KEY FK_590C1039D86650F');
        $this->addSql('ALTER TABLE line DROP FOREIGN KEY FK_D114B4F68F43249B');
        $this->addSql('ALTER TABLE meeting DROP FOREIGN KEY FK_F515E1391FB8D185');
        $this->addSql('ALTER TABLE ressource DROP FOREIGN KEY FK_939F4544A2B28FE8');
        $this->addSql('ALTER TABLE slot DROP FOREIGN KEY FK_AC0E2067A76ED395');
        $this->addSql('ALTER TABLE slot DROP FOREIGN KEY FK_AC0E206767433D9C');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB257E3C61F9');
        $this->addSql('ALTER TABLE task_user DROP FOREIGN KEY FK_FE2042328DB60186');
        $this->addSql('ALTER TABLE task_user DROP FOREIGN KEY FK_FE204232A76ED395');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE education');
        $this->addSql('DROP TABLE experience');
        $this->addSql('DROP TABLE invoice');
        $this->addSql('DROP TABLE line');
        $this->addSql('DROP TABLE meeting');
        $this->addSql('DROP TABLE param');
        $this->addSql('DROP TABLE ressource');
        $this->addSql('DROP TABLE slot');
        $this->addSql('DROP TABLE specialty');
        $this->addSql('DROP TABLE task');
        $this->addSql('DROP TABLE task_user');
        $this->addSql('DROP TABLE user');
    }
}
