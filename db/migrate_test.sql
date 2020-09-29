DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reports;
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS reports (
    week INT NOT NULL,
    text_data VARCHAR(255) NOT NULL,
    UNIQUE(week)
);
