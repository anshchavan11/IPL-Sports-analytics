-- ============================================================
-- IPL Sports Analytics Project — Database Schema
-- Works on MySQL / PostgreSQL / SQLite (minor type tweaks noted)
-- ============================================================

DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS matches;

CREATE TABLE matches (
    id               INTEGER PRIMARY KEY,
    season           INTEGER NOT NULL,
    match_date       DATE NOT NULL,
    team1            VARCHAR(50) NOT NULL,
    team2            VARCHAR(50) NOT NULL,
    venue            VARCHAR(100),
    city             VARCHAR(50),
    toss_winner      VARCHAR(50),
    toss_decision    VARCHAR(10),
    winner           VARCHAR(50),
    win_by_runs      INTEGER DEFAULT 0,
    win_by_wickets   INTEGER DEFAULT 0,
    player_of_match  VARCHAR(80),
    result           VARCHAR(20)
);

CREATE TABLE deliveries (
    match_id         INTEGER NOT NULL,
    season           INTEGER NOT NULL,
    inning           INTEGER NOT NULL,
    batting_team     VARCHAR(50) NOT NULL,
    bowling_team     VARCHAR(50) NOT NULL,
    over             INTEGER NOT NULL,
    ball             INTEGER NOT NULL,
    batter           VARCHAR(80) NOT NULL,
    bowler           VARCHAR(80) NOT NULL,
    non_striker      VARCHAR(80),
    batsman_runs     INTEGER DEFAULT 0,
    extra_runs       INTEGER DEFAULT 0,
    extras_type      VARCHAR(20),
    total_runs       INTEGER DEFAULT 0,
    is_wicket        INTEGER DEFAULT 0,
    dismissal_kind   VARCHAR(30),
    player_dismissed VARCHAR(80),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

CREATE INDEX idx_deliveries_match ON deliveries(match_id);
CREATE INDEX idx_deliveries_batter ON deliveries(batter);
CREATE INDEX idx_deliveries_bowler ON deliveries(bowler);
CREATE INDEX idx_matches_season ON matches(season);
CREATE INDEX idx_matches_winner ON matches(winner);

-- Load data (adjust path/import method for your DB engine):
-- MySQL:      LOAD DATA INFILE 'matches.csv' INTO TABLE matches FIELDS TERMINATED BY ',' IGNORE 1 ROWS;
-- PostgreSQL: \copy matches FROM 'matches.csv' WITH (FORMAT csv, HEADER true);
-- SQLite:     .mode csv  /  .import matches.csv matches  (after removing header row once)
