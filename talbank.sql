CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    telegram_id VARCHAR(50) UNIQUE,
    age INT,
    gender VARCHAR(10),
    preferences TEXT,
    equipment_ids TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Characteristics (
    user_id INT,
    characteristics TEXT,
    question TEXT
)

CREATE TABLE (
    sport_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT,
    suitability JSON,
    benefits TEXT
);

CREATE TABLE Equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT,
    sport_id INT,
    partner_link VARCHAR(255),
    price_range VARCHAR(50),
    FOREIGN KEY (sport_id) REFERENCES Sports(sport_id)
);

CREATE TABLE Interactions (
    interaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    interaction_type VARCHAR(50),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
