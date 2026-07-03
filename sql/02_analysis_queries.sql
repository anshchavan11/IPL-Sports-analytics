-- ============================================================
-- IPL Sports Analytics Project — Analysis Queries
-- Demonstrates: JOINs, GROUP BY, aggregate functions, subqueries,
-- CASE statements, and window functions
-- ============================================================

-- 1) Season-wise matches, and champion (most wins) per season
SELECT season,
       COUNT(*) AS total_matches
FROM matches
GROUP BY season
ORDER BY season;

-- 2) Team win totals across all seasons, ranked
SELECT winner AS team,
       COUNT(*) AS total_wins,
       RANK() OVER (ORDER BY COUNT(*) DESC) AS win_rank
FROM matches
WHERE winner IS NOT NULL
GROUP BY winner
ORDER BY total_wins DESC;

-- 3) Team win % (wins / matches played), using UNION to combine team1+team2 appearances
WITH matches_played AS (
    SELECT team1 AS team, id FROM matches
    UNION ALL
    SELECT team2 AS team, id FROM matches
),
played_count AS (
    SELECT team, COUNT(*) AS played FROM matches_played GROUP BY team
),
win_count AS (
    SELECT winner AS team, COUNT(*) AS wins FROM matches GROUP BY winner
)
SELECT p.team,
       p.played,
       COALESCE(w.wins, 0) AS wins,
       ROUND(100.0 * COALESCE(w.wins, 0) / p.played, 2) AS win_pct
FROM played_count p
LEFT JOIN win_count w ON p.team = w.team
ORDER BY win_pct DESC;

-- 4) Top 10 run scorers (career) — aggregate + JOIN to matches for season context
SELECT batter,
       SUM(batsman_runs) AS total_runs,
       COUNT(DISTINCT match_id) AS innings_played,
       ROUND(SUM(batsman_runs) * 1.0 / COUNT(DISTINCT match_id), 2) AS avg_runs_per_match,
       SUM(CASE WHEN batsman_runs = 6 THEN 1 ELSE 0 END) AS sixes,
       SUM(CASE WHEN batsman_runs = 4 THEN 1 ELSE 0 END) AS fours
FROM deliveries
GROUP BY batter
ORDER BY total_runs DESC
LIMIT 10;

-- 5) Top 10 wicket-takers (bowlers), excluding run-outs (not credited to bowler)
SELECT bowler,
       COUNT(*) AS wickets,
       COUNT(DISTINCT match_id) AS matches_bowled_in,
       ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT match_id), 2) AS avg_wickets_per_match
FROM deliveries
WHERE is_wicket = 1 AND dismissal_kind <> 'run out'
GROUP BY bowler
ORDER BY wickets DESC
LIMIT 10;

-- 6) Toss impact analysis: does winning the toss increase match win probability?
SELECT
    CASE WHEN toss_winner = winner THEN 'Won toss & match'
         ELSE 'Won toss, lost match' END AS outcome,
    COUNT(*) AS matches,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM matches WHERE winner IS NOT NULL), 2) AS pct_of_all_matches
FROM matches
WHERE winner IS NOT NULL
GROUP BY outcome;

-- 7) Venue analysis: which grounds favor batting-first teams?
SELECT venue,
       COUNT(*) AS matches_played,
       SUM(CASE WHEN toss_decision = 'bat' AND toss_winner = winner THEN 1 ELSE 0 END) AS bat_first_wins,
       SUM(CASE WHEN toss_decision = 'field' AND toss_winner = winner THEN 1 ELSE 0 END) AS field_first_wins
FROM matches
GROUP BY venue
ORDER BY matches_played DESC;

-- 8) Player of the Match — most frequent winners (subquery + JOIN pattern)
SELECT player_of_match,
       COUNT(*) AS awards
FROM matches
WHERE player_of_match IS NOT NULL
GROUP BY player_of_match
HAVING COUNT(*) > 1
ORDER BY awards DESC
LIMIT 10;

-- 9) Season-by-season top run scorer (window function: ROW_NUMBER partitioned by season)
WITH season_runs AS (
    SELECT d.season,
           d.batter,
           SUM(d.batsman_runs) AS runs,
           ROW_NUMBER() OVER (PARTITION BY d.season ORDER BY SUM(d.batsman_runs) DESC) AS rn
    FROM deliveries d
    GROUP BY d.season, d.batter
)
SELECT season, batter AS orange_cap_holder, runs
FROM season_runs
WHERE rn = 1
ORDER BY season;

-- 10) Head-to-head record between any two teams (self-referencing logic via CASE)
SELECT
    CASE WHEN team1 < team2 THEN team1 ELSE team2 END AS team_a,
    CASE WHEN team1 < team2 THEN team2 ELSE team1 END AS team_b,
    COUNT(*) AS matches_played,
    SUM(CASE WHEN winner = CASE WHEN team1 < team2 THEN team1 ELSE team2 END THEN 1 ELSE 0 END) AS team_a_wins,
    SUM(CASE WHEN winner = CASE WHEN team1 < team2 THEN team2 ELSE team1 END THEN 1 ELSE 0 END) AS team_b_wins
FROM matches
GROUP BY team_a, team_b
ORDER BY matches_played DESC;
