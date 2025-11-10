CREATE TABLE IF NOT EXISTS expiry (
    id UUID PRIMARY KEY,
    name varchar,
    description text NOT NULL,
    image_url varchar,
    expiry_date timestamp,
    created_at timestamp DEFAULT now(),
    created_by varchar(255) NOT NULL,
    updated_at timestamp DEFAULT now(),
    updated_by varchar(255) NOT NULL
);