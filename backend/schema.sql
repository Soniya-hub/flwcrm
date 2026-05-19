-- FlowCRM Database Schema (PostgreSQL)
-- Run this before starting the application for the first time

CREATE DATABASE flowcrm;
\c flowcrm;

-- Users table
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    phone        VARCHAR(30),
    company      VARCHAR(150) NOT NULL,
    notes        TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CLOSED')),
    assigned_to  BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    priority     VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    status       VARCHAR(20)  NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    due_date     DATE,
    assigned_to  BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Seed Data (passwords are BCrypt of "admin123"/"user123")
INSERT INTO users (name, email, password, role, status) VALUES
  ('Admin User',  'admin@crm.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ACTIVE'),
  ('John Smith',  'john@crm.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER',  'ACTIVE'),
  ('Sarah Lee',   'sarah@crm.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER',  'ACTIVE'),
  ('Mike Chen',   'mike@crm.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER',  'INACTIVE');

INSERT INTO leads (name, email, phone, company, notes, status, assigned_to) VALUES
  ('Alice Johnson', 'alice@techcorp.com',  '+1-555-0101', 'TechCorp Inc.',   'Interested in Enterprise plan',  'NEW',       2),
  ('Bob Williams',  'bob@startupxyz.com',  '+1-555-0102', 'StartupXYZ',      'Requested demo call',            'CONTACTED', 3),
  ('Carol Davis',   'carol@megacorp.io',   '+1-555-0103', 'MegaCorp IO',     'Signed contract',                'CLOSED',    2),
  ('David Brown',   'david@innovate.co',   '+1-555-0104', 'Innovate Co',     'Follow up next week',            'CONTACTED', 3),
  ('Emma Wilson',   'emma@ventures.com',   '+1-555-0105', 'Wilson Ventures', 'Budget approved',                'NEW',       2),
  ('Frank Miller',  'frank@globaltech.net','+1-555-0106', 'GlobalTech Net',  'Trial period started',           'CONTACTED', 3),
  ('Grace Taylor',  'grace@nexgen.io',     '+1-555-0107', 'NexGen IO',       'Contract closed',                'CLOSED',    2),
  ('Henry Anderson','henry@solutions.co',  '+1-555-0108', 'Solutions Co',    'Needs follow-up',                'NEW',       3);

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to) VALUES
  ('Send proposal to TechCorp',        'Prepare and send detailed proposal',   'HIGH',   'TODO',        '2024-05-20', 2),
  ('Schedule demo call with StartupXYZ','Arrange product demo',                 'MEDIUM', 'IN_PROGRESS', '2024-05-18', 3),
  ('Follow up with MegaCorp',          'Post-contract follow-up call',          'LOW',    'DONE',        '2024-05-10', 2),
  ('Prepare Q2 sales report',          'Compile Q2 statistics and insights',    'HIGH',   'TODO',        '2024-05-25', 2),
  ('Update CRM records',               'Clean up and update all lead records',  'MEDIUM', 'IN_PROGRESS', '2024-05-22', 3),
  ('Client onboarding - GlobalTech',   'Setup and onboard GlobalTech team',     'HIGH',   'TODO',        '2024-05-28', 3);
