-- Web3 Security Platform — Database Initialization
-- Run order: 01-init.sql (this file)

SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

CREATE DATABASE IF NOT EXISTS web3security
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE web3security;

-- ── Users ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(36)  PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','moderator') NOT NULL DEFAULT 'moderator',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login    DATETIME     NULL,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Reports ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id            VARCHAR(36)  PRIMARY KEY,
  type          ENUM('url','phone','email','wallet','contract','token','other') NOT NULL,
  value         VARCHAR(512) NOT NULL,
  description   TEXT,
  contact_email VARCHAR(255),
  lang          VARCHAR(10)  DEFAULT 'en',
  status        ENUM('pending','verified','rejected','resolved') NOT NULL DEFAULT 'pending',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NULL,
  INDEX idx_status (status),
  INDEX idx_type   (type),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Fraud Entries (central blacklist) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS fraud_entries (
  id          VARCHAR(36)   PRIMARY KEY,
  type        ENUM('url','phone','email','wallet','contract','token','other') NOT NULL,
  value       VARCHAR(512)  NOT NULL,
  description TEXT,
  severity    ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  source      VARCHAR(128)  DEFAULT 'manual',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NULL,
  INDEX idx_type_value (type, value(191)),
  INDEX idx_severity   (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
