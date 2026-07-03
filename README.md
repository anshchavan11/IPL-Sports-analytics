# 🏏 IPL Sports Analytics — Full-Stack Data Project

A complete sports-analytics pipeline built on IPL (Indian Premier League) cricket data — covering **SQL, Excel, PowerPoint, and a live interactive dashboard**. Built as a portfolio project to demonstrate foundational + intermediate data analysis skills end-to-end.

**[Live Dashboard →](#)** *(add your GitHub Pages link here after deploying — see Setup below)*

---

## What's in this project

| Deliverable | Location | Skills demonstrated |
|---|---|---|
| Raw dataset | [`/data`](./data) | Data generation matching a real public schema |
| SQL schema + queries | [`/sql`](./sql) | Joins, aggregation, CTEs, window functions, subqueries |
| Excel workbook | [`/excel/IPL_Analytics.xlsx`](./excel/IPL_Analytics.xlsx) | VLOOKUP, XLOOKUP, INDEX-MATCH, pivot-style SUMIFS, conditional formatting, charts |
| PowerPoint deck | [`/presentation/IPL_Analytics_Presentation.pptx`](./presentation/IPL_Analytics_Presentation.pptx) | Data storytelling, stakeholder-ready design |
| Live dashboard | [`/dashboard/index.html`](./dashboard/index.html) | HTML/CSS/JS, Chart.js, interactive filtering |

---

## About the data

This project targets the schema of the well-known public Kaggle dataset **["IPL Complete Dataset (2008–2020)"](https://www.kaggle.com/datasets/patrickb1912/ipl-complete-dataset-20082020) by patrickb1912** (`matches.csv` + `deliveries.csv`, ball-by-ball data) — the same structure used across many published cricket-analytics projects.

The CSVs in `/data` are **realistically simulated** (9 seasons, 2016–2024, 606 matches, 144,000+ deliveries, real team/venue names) rather than downloaded directly, because this was built in a sandboxed environment without Kaggle API access. The column structure is identical to the real dataset, so you can:

1. Download the real dataset from Kaggle
2. Drop `matches.csv` and `deliveries.csv` into `/data`, replacing the simulated files
3. Re-run `data/generate_data.py`'s downstream aggregation steps (or just re-import into SQL/Excel) — every formula, query, and chart keeps working with zero rebuild

This is standard practice for prototyping a data pipeline against a schema before wiring up the live production data source.

---

## How each piece was built

### 1. Data generation (`/data`)
`generate_data.py` produces realistic match and ball-by-ball data: 10 teams, 9 seasons, skill-weighted outcomes (so results aren't uniformly random), realistic strike rates/economy rates, and season progression (league expanded from 8 to 10 teams in 2022, matching the real IPL's history).

### 2. SQL layer (`/sql`)
- `01_schema.sql` — relational schema (`matches`, `deliveries`) with foreign keys and indexes
- `02_analysis_queries.sql` — 10 analysis queries covering:
  - Aggregate functions (`SUM`, `COUNT`, `AVG`)
  - `GROUP BY` + `HAVING`
  - `JOIN`/`UNION` (computing matches-played across both `team1`/`team2` columns)
  - `CASE` statements (toss-impact analysis)
  - **Window functions**: `RANK()`, `ROW_NUMBER() OVER (PARTITION BY ...)` for season-by-season leaderboards
  - CTEs (`WITH` clauses) for multi-step aggregation

Run these against any SQL engine (MySQL, PostgreSQL, SQLite) after loading the CSVs — see comments in `01_schema.sql` for load syntax per engine.

### 3. Excel workbook (`/excel`)
Built with `openpyxl`, then recalculated and validated with LibreOffice (zero formula errors across 51 formulas). Sheets:
- **README** — workbook guide
- **Dashboard** — KPI cards + bar/line/pie charts, all formula-driven
- **Matches_Raw** — full 606-match source table (Excel Table)
- **Deliveries_Sample** — 3,000-row ball-by-ball sample (full data lives in `/data` + SQL)
- **Lookups** — live VLOOKUP / INDEX-MATCH / XLOOKUP demo (type a Match ID, see all three methods return the same result)
- **Team_Pivot** — SUMIFS/COUNTIFS pivot-style team summary with data bars
- **Player_Pivot** — top scorers/wicket-takers with color-scale conditional formatting
- **Season_Pivot** — Orange Cap / Purple Cap per season

### 4. PowerPoint deck (`/presentation`)
Built with `pptxgenjs`. 10 slides: title, project overview, methodology, team performance, batting trends, top scorers/bowlers, toss-impact analysis, technical skills summary, and closing/links slide. Native editable charts (not images) throughout.

### 5. Live dashboard (`/dashboard`)
Single-file HTML/CSS/JS dashboard using [Chart.js](https://www.chartjs.org/) (via CDN). No build step, no server required — open `index.html` directly or host on GitHub Pages. Features:
- Season and team filters that recompute every chart and table live
- KPI cards, team win% bar chart, toss-impact donut chart, season run trend
- Sortable top-10 batter/bowler tables
- Filterable match log

---

## Running this locally

**Prerequisites:** Python 3.9+, Node.js 18+, a modern web browser. SQL steps need any SQL engine (SQLite is easiest to start with, needs no install on macOS/Linux).

```bash
# 1. Clone your repo
git clone https://github.com/<your-username>/ipl-sports-analytics.git
cd ipl-sports-analytics

# 2. (Optional) Regenerate the dataset
cd data
pip install pandas numpy
python3 generate_data.py

# 3. Load into SQLite and try the queries
sqlite3 ipl.db
sqlite> .mode csv
sqlite> .import matches.csv matches_temp
sqlite> -- then run sql/01_schema.sql and sql/02_analysis_queries.sql

# 4. Open the Excel workbook
open excel/IPL_Analytics.xlsx        # macOS
start excel\IPL_Analytics.xlsx       # Windows

# 5. Open the PowerPoint deck
open presentation/IPL_Analytics_Presentation.pptx

# 6. Run the live dashboard — just open it, no server needed
open dashboard/index.html            # macOS
start dashboard\index.html           # Windows
```

---

## Pushing to GitHub + hosting the live dashboard for free

```bash
git init
git add .
git commit -m "Initial commit: IPL sports analytics project"
git branch -M main
git remote add origin https://github.com/<your-username>/ipl-sports-analytics.git
git push -u origin main
```

**To make the dashboard link work on your resume** (free, no server needed):
1. On GitHub, go to your repo → **Settings → Pages**
2. Under "Build and deployment", set **Source: Deploy from a branch**
3. Branch: `main`, folder: `/dashboard` (or `/root` if you move `index.html` to the repo root)
4. Save — GitHub gives you a live URL like `https://<your-username>.github.io/ipl-sports-analytics/`
5. Put that URL on your resume/portfolio and in this README's top link

---

## Project structure

```
ipl-sports-analytics/
├── data/
│   ├── generate_data.py       # dataset generator
│   ├── matches.csv            # 606 matches, 2016-2024
│   ├── deliveries.csv         # 144,032 ball-by-ball rows
│   └── *_summary.csv          # pre-aggregated summaries
├── sql/
│   ├── 01_schema.sql
│   └── 02_analysis_queries.sql
├── excel/
│   ├── IPL_Analytics.xlsx
│   ├── build_workbook.py
│   └── build_dashboard_sheet.py
├── presentation/
│   ├── IPL_Analytics_Presentation.pptx
│   └── build_deck.js
├── dashboard/
│   ├── index.html
│   ├── app.js
│   └── data.js
└── README.md
```

## License

MIT — see [LICENSE](./LICENSE). Free to reuse for your own portfolio.
