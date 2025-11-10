CREATE TABLE IF NOT EXISTS expiry (
    id UUID PRIMARY KEY,
    name varchar,
    description text NOT NULL,
    image_url varchar,
    expiry_date timestamp
);