-- ===========================================
-- TABLE: FUNERAL_HOMES
-- Each funeral home can have multiple users (clients or workers).
-- If a funeral home is deleted, its users will have id_funeral_home = NULL.
-- ===========================================
CREATE TABLE funeral_homes (
  id_funeral_home INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  funeral_home_status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id_funeral_home)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ===========================================
-- TABLE: USERS
-- Represents clients, administrators, workers or funeral homes (based on role).
-- Each user has a unique email.
-- A user may optionally belong to a funeral home.
-- ===========================================
CREATE TABLE users (
  id_user INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  role ENUM('cliente','admin','worker','funeral_home') NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  death_date DATE DEFAULT NULL,
  alive TINYINT(1) NOT NULL DEFAULT 1,
  user_status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  password VARCHAR(255) NOT NULL,
  id_funeral_home INT(11) DEFAULT NULL,
  PRIMARY KEY (id_user),
  KEY idx_funeral_home (id_funeral_home),
  CONSTRAINT fk_user_funeral_home
    FOREIGN KEY (id_funeral_home)
    REFERENCES funeral_homes (id_funeral_home)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ===========================================
-- TABLE: RELATIVES
-- Stores relatives’ personal information.
-- Relationship with users is many-to-many.
-- ===========================================
CREATE TABLE relatives (
  id_relative INT(11) NOT NULL AUTO_INCREMENT,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_relative),
  UNIQUE KEY uk_relative_contact (email, phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ===========================================
-- TABLE: RELATIVES_USERS
-- Many-to-many relation between users and relatives.
-- A relative may belong to multiple users.
-- A user may have many relatives.
-- ===========================================
CREATE TABLE relatives_users (
  id_user INT(11) NOT NULL,
  id_relative INT(11) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT(11) DEFAULT NULL,
  relationship ENUM(
    'Mother','Father','Son','Daughter','Brother','Sister','Husband','Wife',
    'Grandfather','Grandmother','Uncle','Aunt','Nephew','Niece','Grandson','Granddaughter',
    'Cousin','Friend','Other'
  ) NOT NULL,
  PRIMARY KEY (id_user, id_relative),
  CONSTRAINT fk_ru_user FOREIGN KEY (id_user)
    REFERENCES users (id_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ru_relative FOREIGN KEY (id_relative)
    REFERENCES relatives (id_relative)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ===========================================
-- TABLE: MEMORIES
-- Each memory belongs to one user.
-- It can be delivered to multiple relatives.
-- ===========================================
CREATE TABLE memories (
  id_memory INT(11) NOT NULL AUTO_INCREMENT,
  id_user INT(11) NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered TINYINT(1) NOT NULL DEFAULT 0,
  delivery_date DATETIME DEFAULT NULL,
  PRIMARY KEY (id_memory),
  KEY idx_user_memory (id_user),
  CONSTRAINT fk_memory_user
    FOREIGN KEY (id_user)
    REFERENCES users (id_user)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ===========================================
-- TABLE: MEMORIES_RELATIVES
-- Defines the deliveries of memories to relatives.
-- Each memory-relative pair must be unique.
-- ===========================================
CREATE TABLE memories_relatives (
  id_delivery INT(11) NOT NULL AUTO_INCREMENT,
  id_memory INT(11) NOT NULL,
  id_relative INT(11) NOT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivery_method ENUM('Email','SMS','WhatsApp') NOT NULL DEFAULT 'Email',
  delivery_status ENUM('Pending','Sent','Failed') NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (id_delivery),
  UNIQUE KEY unique_memory_relative (id_memory, id_relative),
  CONSTRAINT fk_delivery_memory
    FOREIGN KEY (id_memory)
    REFERENCES memories (id_memory)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_delivery_relative
    FOREIGN KEY (id_relative)
    REFERENCES relatives (id_relative)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
