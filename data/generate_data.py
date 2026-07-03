import pandas as pd
import numpy as np
import random

random.seed(42)
np.random.seed(42)

TEAMS = [
    "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
    "Kolkata Knight Riders", "Delhi Capitals", "Punjab Kings",
    "Rajasthan Royals", "Sunrisers Hyderabad", "Gujarat Titans", "Lucknow Super Giants"
]

VENUES = [
    "Wankhede Stadium, Mumbai", "M. A. Chidambaram Stadium, Chennai",
    "M. Chinnaswamy Stadium, Bangalore", "Eden Gardens, Kolkata",
    "Arun Jaitley Stadium, Delhi", "Punjab Cricket Association Stadium, Mohali",
    "Sawai Mansingh Stadium, Jaipur", "Rajiv Gandhi International Stadium, Hyderabad",
    "Narendra Modi Stadium, Ahmedabad", "Ekana Cricket Stadium, Lucknow"
]

CITY_MAP = {
    "Wankhede Stadium, Mumbai": "Mumbai",
    "M. A. Chidambaram Stadium, Chennai": "Chennai",
    "M. Chinnaswamy Stadium, Bangalore": "Bangalore",
    "Eden Gardens, Kolkata": "Kolkata",
    "Arun Jaitley Stadium, Delhi": "Delhi",
    "Punjab Cricket Association Stadium, Mohali": "Mohali",
    "Sawai Mansingh Stadium, Jaipur": "Jaipur",
    "Rajiv Gandhi International Stadium, Hyderabad": "Hyderabad",
    "Narendra Modi Stadium, Ahmedabad": "Ahmedabad",
    "Ekana Cricket Stadium, Lucknow": "Lucknow"
}

TEAM_VENUE = dict(zip(TEAMS, VENUES))
TEAM_SHORT = {
    "Mumbai Indians": "MI", "Chennai Super Kings": "CSK", "Royal Challengers Bangalore": "RCB",
    "Kolkata Knight Riders": "KKR", "Delhi Capitals": "DC", "Punjab Kings": "PBKS",
    "Rajasthan Royals": "RR", "Sunrisers Hyderabad": "SRH", "Gujarat Titans": "GT",
    "Lucknow Super Giants": "LSG"
}

# Player pool per team (25 players each - realistic squad size)
FIRST_NAMES = ["Rohit","Virat","MS","Hardik","Jasprit","Ravindra","KL","Rishabh","Shubman","Suryakumar",
               "Yuzvendra","Bhuvneshwar","Mohammed","Shreyas","Ravichandran","Ajinkya","Cheteshwar","Kuldeep",
               "Axar","Deepak","Ishan","Sanju","Prithvi","Washington","Shardul","David","Kane","Jos","Ben",
               "Rashid","Kagiso","Trent","Andre","Faf","Glenn","Marcus","Nicholas","Quinton","Aiden","Jonny",
               "Sam","Liam","Mitchell","Pat","Steve","Marnus","Jason","Alex","Tim","Chris"]
LAST_NAMES = ["Sharma","Kohli","Dhoni","Pandya","Bumrah","Jadeja","Rahul","Pant","Gill","Yadav","Chahal",
              "Kumar","Shami","Iyer","Ashwin","Rahane","Pujara","Yadav","Patel","Chahar","Kishan","Samson",
              "Shaw","Sundar","Thakur","Warner","Williamson","Buttler","Stokes","Khan","Rabada","Boult",
              "Russell","du Plessis","Maxwell","Stoinis","Pooran","de Kock","Markram","Bairstow","Curran",
              "Livingstone","Starc","Cummins","Smith","Labuschagne","Behrendorff","Green","Paine","Lynn"]

def make_squad(team, n=25):
    random.shuffle(FIRST_NAMES)
    names = set()
    while len(names) < n:
        names.add(f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}")
    return list(names)

SQUADS = {team: make_squad(team) for team in TEAMS}
ALL_PLAYERS = [p for squad in SQUADS.values() for p in squad]
PLAYER_TEAM = {p: t for t, squad in SQUADS.items() for p in squad}

# Player "skill" ratings drive realistic stat distributions
BAT_SKILL = {p: np.random.beta(2, 3) for p in ALL_PLAYERS}
BOWL_SKILL = {p: np.random.beta(2, 3) for p in ALL_PLAYERS}

SEASONS = list(range(2016, 2025))  # 9 seasons
MATCH_ID = 1
matches_rows = []
deliveries_rows = []

TOSS_DECISIONS = ["bat", "field"]
DISMISSAL_KINDS = ["caught", "bowled", "lbw", "run out", "stumped", "caught and bowled", "hit wicket"]
DISMISSAL_WEIGHTS = [0.42, 0.18, 0.12, 0.13, 0.08, 0.05, 0.02]

for season in SEASONS:
    season_teams = TEAMS if season >= 2022 else [t for t in TEAMS if t not in ("Gujarat Titans", "Lucknow Super Giants")]
    matchups = []
    for i, t1 in enumerate(season_teams):
        for t2 in season_teams[i+1:]:
            matchups.append((t1, t2))
            matchups.append((t2, t1))
    random.shuffle(matchups)

    season_date = pd.Timestamp(f"{season}-03-25")
    team_points = {t: 0 for t in season_teams}

    for match_num, (team1, team2) in enumerate(matchups):
        match_date = season_date + pd.Timedelta(days=match_num)
        venue = TEAM_VENUE[team1] if match_num % 3 != 0 else random.choice(VENUES)
        city = CITY_MAP[venue]

        toss_winner = random.choice([team1, team2])
        toss_decision = random.choices(TOSS_DECISIONS, weights=[0.45, 0.55])[0]

        t1_strength = np.mean([BAT_SKILL[p] + BOWL_SKILL[p] for p in SQUADS[team1]])
        t2_strength = np.mean([BAT_SKILL[p] + BOWL_SKILL[p] for p in SQUADS[team2]])
        win_prob_t1 = t1_strength / (t1_strength + t2_strength)
        winner = team1 if random.random() < win_prob_t1 else team2
        loser = team2 if winner == team1 else team1

        win_by_runs = 0
        win_by_wickets = 0
        if random.random() < 0.5:
            win_by_runs = int(np.clip(np.random.exponential(22), 1, 120))
        else:
            win_by_wickets = int(np.clip(np.random.exponential(4) + 1, 1, 10))

        player_of_match = random.choice(SQUADS[winner])

        matches_rows.append({
            "id": MATCH_ID,
            "season": season,
            "date": match_date.strftime("%Y-%m-%d"),
            "team1": team1,
            "team2": team2,
            "venue": venue,
            "city": city,
            "toss_winner": toss_winner,
            "toss_decision": toss_decision,
            "winner": winner,
            "win_by_runs": win_by_runs,
            "win_by_wickets": win_by_wickets,
            "player_of_match": player_of_match,
            "result": "normal" if random.random() > 0.03 else "tie"
        })

        # ---- Ball-by-ball deliveries for this match (both innings) ----
        for inning, (batting_team, bowling_team) in enumerate([(team1, team2), (team2, team1)], start=1):
            batters = list(SQUADS[batting_team])
            bowlers = list(SQUADS[bowling_team])
            random.shuffle(batters)
            random.shuffle(bowlers)
            wickets_fallen = 0
            batter_idx = 0
            striker, non_striker = batters[0], batters[1]
            batter_idx = 2

            max_overs = 20
            for over in range(max_overs):
                if wickets_fallen >= 10:
                    break
                bowler = bowlers[over % len(bowlers)]
                balls_this_over = 6
                for ball in range(1, balls_this_over + 1):
                    if wickets_fallen >= 10:
                        break
                    skill = BAT_SKILL[striker] - BOWL_SKILL[bowler] * 0.5
                    r = random.random()
                    is_wicket = 0
                    runs_batter = 0
                    extras = 0
                    extras_type = ""

                    wicket_prob = np.clip(0.055 - skill * 0.03, 0.01, 0.12)
                    if r < wicket_prob:
                        is_wicket = 1
                    elif r < wicket_prob + 0.02:
                        extras = 1
                        extras_type = random.choice(["wide", "noball", "legbyes", "byes"])
                        if extras_type in ("wide", "noball"):
                            runs_batter = 0
                    else:
                        run_choices = [0, 1, 2, 3, 4, 6]
                        base_weights = np.array([0.36, 0.34, 0.06, 0.01, 0.14, 0.09])
                        adj = base_weights * (1 + skill)
                        adj = adj / adj.sum()
                        runs_batter = int(np.random.choice(run_choices, p=adj))

                    total_runs = runs_batter + extras

                    deliveries_rows.append({
                        "match_id": MATCH_ID,
                        "season": season,
                        "inning": inning,
                        "batting_team": batting_team,
                        "bowling_team": bowling_team,
                        "over": over + 1,
                        "ball": ball,
                        "batter": striker,
                        "bowler": bowler,
                        "non_striker": non_striker,
                        "batsman_runs": runs_batter,
                        "extra_runs": extras,
                        "extras_type": extras_type,
                        "total_runs": total_runs,
                        "is_wicket": is_wicket,
                        "dismissal_kind": random.choices(DISMISSAL_KINDS, weights=DISMISSAL_WEIGHTS)[0] if is_wicket else "",
                        "player_dismissed": striker if is_wicket else ""
                    })

                    if is_wicket:
                        wickets_fallen += 1
                        if batter_idx < len(batters):
                            striker = batters[batter_idx]
                            batter_idx += 1
                    elif runs_batter in (1, 3):
                        striker, non_striker = non_striker, striker
                if wickets_fallen >= 10:
                    break
                striker, non_striker = non_striker, striker  # over change swap

        MATCH_ID += 1

matches_df = pd.DataFrame(matches_rows)
deliveries_df = pd.DataFrame(deliveries_rows)

matches_df.to_csv("/home/claude/ipl-analytics-project/data/matches.csv", index=False)
deliveries_df.to_csv("/home/claude/ipl-analytics-project/data/deliveries.csv", index=False)

print("Matches:", matches_df.shape)
print("Deliveries:", deliveries_df.shape)
print("Seasons:", sorted(matches_df.season.unique()))
