const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Portfolio Project";
pres.title = "IPL Sports Analytics — 2016-2024";

// Palette: Cherry Bold (cricket-appropriate: bold red/maroon + navy)
const PRIMARY = "990011";   // cherry
const BG_LIGHT = "FCF6F5";  // off-white
const ACCENT = "2F3C7E";    // navy
const DARK = "1A1A2E";
const TEXT_MUTED = "6B7280";
const WHITE = "FFFFFF";

const FONT_HEAD = "Bookman Old Style";
const FONT_BODY = "Calibri";

function titleSlideBg(slide) {
  slide.background = { color: DARK };
}

function sectionHeader(slide, kicker, title) {
  slide.addText(kicker.toUpperCase(), {
    x: 0.6, y: 0.4, w: 8, h: 0.4, fontFace: FONT_BODY, fontSize: 12,
    color: PRIMARY, bold: true, charSpacing: 2
  });
  slide.addText(title, {
    x: 0.6, y: 0.75, w: 11, h: 0.9, fontFace: FONT_HEAD, fontSize: 30,
    color: DARK, bold: true
  });
}

function pageNum(slide, n) {
  slide.addText(String(n), {
    x: 12.6, y: 7.05, w: 0.5, h: 0.3, fontFace: FONT_BODY, fontSize: 10, color: TEXT_MUTED
  });
}

// ============================================================
// Slide 1: Title
// ============================================================
{
  let s = pres.addSlide();
  titleSlideBg(s);
  s.addShape(pres.shapes.OVAL, { x: 9.7, y: -1.5, w: 5.5, h: 5.5, fill: { color: PRIMARY, transparency: 82 } });
  s.addShape(pres.shapes.OVAL, { x: -1.8, y: 4.8, w: 4, h: 4, fill: { color: ACCENT, transparency: 80 } });

  s.addText("IPL SPORTS ANALYTICS", {
    x: 0.9, y: 2.5, w: 11.5, h: 1.1, fontFace: FONT_HEAD, fontSize: 44, bold: true, color: WHITE
  });
  s.addText("A Full-Stack Data Analysis Project — SQL · Excel · PowerPoint · Live Dashboard", {
    x: 0.9, y: 3.55, w: 10.5, h: 0.6, fontFace: FONT_BODY, fontSize: 16, italic: true, color: "C9CDE0"
  });
  s.addText("2016 – 2024  |  9 Seasons  |  606 Matches  |  144,000+ Deliveries Analyzed", {
    x: 0.9, y: 4.3, w: 10.5, h: 0.5, fontFace: FONT_BODY, fontSize: 13, color: "9AA0C4"
  });
  s.addText("Portfolio Project", {
    x: 0.9, y: 6.6, w: 5, h: 0.4, fontFace: FONT_BODY, fontSize: 11, color: "6B7099"
  });
}

// ============================================================
// Slide 2: Project Overview
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Project Overview", "What This Project Demonstrates");

  const cols = [
    { icon: "SQL", title: "Database & SQL", body: "Relational schema, joins, aggregations, CTEs, and window functions across a 144K-row ball-by-ball table." },
    { icon: "XLS", title: "Excel Analysis", body: "VLOOKUP / XLOOKUP / INDEX-MATCH, pivot-style SUMIFS summaries, conditional formatting, and a chart dashboard." },
    { icon: "PPT", title: "Presentation", body: "Stakeholder-ready storytelling deck translating raw stats into a clear narrative." },
    { icon: "WEB", title: "Live Dashboard", body: "Interactive, filterable web dashboard — the same analysis, explorable in real time." }
  ];
  const startX = 0.6, w = 2.95, gap = 0.25;
  cols.forEach((c, i) => {
    const x = startX + i * (w + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.0, w, h: 4.0, rectRadius: 0.08, fill: { color: BG_LIGHT },
      shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 90, opacity: 0.10 }
    });
    s.addShape(pres.shapes.OVAL, { x: x + w/2 - 0.45, y: 2.35, w: 0.9, h: 0.9, fill: { color: PRIMARY } });
    s.addText(c.icon, { x: x + w/2 - 0.45, y: 2.35, w: 0.9, h: 0.9, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 13, bold: true, color: WHITE, margin: 0 });
    s.addText(c.title, { x: x + 0.2, y: 3.5, w: w - 0.4, h: 0.5, fontFace: FONT_HEAD, fontSize: 16, bold: true, color: DARK, align: "center" });
    s.addText(c.body, { x: x + 0.25, y: 4.05, w: w - 0.5, h: 1.7, fontFace: FONT_BODY, fontSize: 11.5, color: TEXT_MUTED, align: "center", valign: "top" });
  });
  pageNum(s, 2);
}

// ============================================================
// Slide 3: Data Source & Methodology
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Methodology", "Data Source & Approach");

  s.addText([
    { text: "Dataset: ", options: { bold: true, color: DARK } },
    { text: "Schema-matched to the public Kaggle dataset \u201CIPL Complete Dataset (2008\u20132020)\u201D (matches.csv + deliveries.csv) \u2014 the same structure used across dozens of published cricket-analytics projects.", options: { color: TEXT_MUTED, breakLine: true } },
  ], { x: 0.7, y: 2.0, w: 11.8, h: 1.0, fontFace: FONT_BODY, fontSize: 14, valign: "top" });

  const steps = [
    "Generated a realistic 9-season dataset (2016\u20132024) with the identical column structure as the real Kaggle files, so real data drops in with zero rebuild.",
    "Loaded matches.csv and deliveries.csv into a relational database and wrote SQL to compute team, player, and season-level metrics.",
    "Built the Excel workbook on top of the raw + aggregated tables: lookups, pivot-style summaries, conditional formatting, and charts.",
    "Distilled the findings into a 10-slide stakeholder presentation.",
    "Rebuilt the core metrics as an interactive live dashboard (HTML/JS + Chart.js) for exploration beyond static slides."
  ];
  steps.forEach((t, i) => {
    const y = 3.15 + i * 0.72;
    s.addShape(pres.shapes.OVAL, { x: 0.7, y: y, w: 0.4, h: 0.4, fill: { color: ACCENT } });
    s.addText(String(i+1), { x: 0.7, y: y, w: 0.4, h: 0.4, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 12, bold: true, color: WHITE, margin: 0 });
    s.addText(t, { x: 1.3, y: y - 0.08, w: 11.2, h: 0.6, fontFace: FONT_BODY, fontSize: 12.5, color: DARK, valign: "middle" });
  });
  pageNum(s, 3);
}

// ============================================================
// Slide 4: Team performance - bar chart
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Team Performance", "Win Percentage by Team (2016\u20132024)");

  s.addChart(pres.charts.BAR, [{
    name: "Win %",
    labels: ["PBKS","LSG","SRH","KKR","RR","CSK","GT","MI","RCB","DC"],
    values: [55.8, 55.56, 55.07, 54.35, 49.28, 49.28, 48.15, 45.65, 44.93, 44.2]
  }], {
    x: 0.6, y: 1.9, w: 8.3, h: 4.7, barDir: "col",
    chartColors: [PRIMARY], showValue: true, dataLabelPosition: "outEnd",
    dataLabelColor: DARK, dataLabelFontSize: 10,
    catAxisLabelColor: TEXT_MUTED, valAxisLabelColor: TEXT_MUTED,
    valGridLine: { color: "E5E7EB", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, chartArea: { fill: { color: WHITE } }
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.2, y: 1.9, w: 3.5, h: 4.7, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText("Key Insight", { x: 9.5, y: 2.15, w: 3, h: 0.4, fontFace: FONT_HEAD, fontSize: 14, bold: true, color: PRIMARY });
  s.addText([
    { text: "Punjab Kings", options: { bold: true, breakLine: true } },
    { text: "led all franchises with a 55.8% win rate across the period, narrowly ahead of newer entrants Lucknow Super Giants.", options: { breakLine: true, color: TEXT_MUTED } },
    { text: "\nSample size matters: ", options: { bold: true, breakLine: true } },
    { text: "GT and LSG joined in 2022, so their win% is based on fewer matches (54) than the 9-season franchises (138).", options: { color: TEXT_MUTED } },
  ], { x: 9.5, y: 2.65, w: 3.0, h: 3.7, fontFace: FONT_BODY, fontSize: 11.5, valign: "top" });
  pageNum(s, 4);
}

// ============================================================
// Slide 5: Orange Cap trend - line chart
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Batting Trends", "Orange Cap (Most Runs) — Season by Season");

  s.addChart(pres.charts.LINE, [{
    name: "Runs",
    labels: ["2016","2017","2018","2019","2020","2021","2022","2023","2024"],
    values: [382, 353, 338, 433, 369, 487, 454, 394, 419]
  }], {
    x: 0.6, y: 1.9, w: 8.3, h: 4.7, lineSize: 3, lineSmooth: true,
    chartColors: [PRIMARY], showValue: true, dataLabelColor: DARK, dataLabelFontSize: 10,
    catAxisLabelColor: TEXT_MUTED, valAxisLabelColor: TEXT_MUTED,
    valGridLine: { color: "E5E7EB", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, chartArea: { fill: { color: WHITE } }
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.2, y: 1.9, w: 3.5, h: 4.7, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText("Key Insight", { x: 9.5, y: 2.15, w: 3, h: 0.4, fontFace: FONT_HEAD, fontSize: 14, bold: true, color: PRIMARY });
  s.addText([
    { text: "2021 stands out", options: { bold: true, breakLine: true } },
    { text: "with the highest single-season run tally (487) in the analyzed period, followed by a strong 2022 (454).", options: { breakLine: true, color: TEXT_MUTED } },
    { text: "\nExpanded schedule: ", options: { bold: true, breakLine: true } },
    { text: "From 2022 onward, the league grew to 10 teams and 90 matches per season, giving batters more innings to accumulate runs.", options: { color: TEXT_MUTED } },
  ], { x: 9.5, y: 2.65, w: 3.0, h: 3.7, fontFace: FONT_BODY, fontSize: 11.5, valign: "top" });
  pageNum(s, 5);
}

// ============================================================
// Slide 6: Top run scorers table
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Player Performance", "Top 5 Run Scorers (All Seasons)");

  const header = [
    { text: "Player", options: { fill: { color: PRIMARY }, color: WHITE, bold: true } },
    { text: "Total Runs", options: { fill: { color: PRIMARY }, color: WHITE, bold: true } },
    { text: "Innings", options: { fill: { color: PRIMARY }, color: WHITE, bold: true } },
    { text: "Strike Rate", options: { fill: { color: PRIMARY }, color: WHITE, bold: true } },
    { text: "6s / 4s", options: { fill: { color: PRIMARY }, color: WHITE, bold: true } },
  ];
  const rows = [
    ["Mohammed Williamson","2169","79","151.47","119 / 210"],
    ["Axar Williamson","2163","84","151.68","122 / 190"],
    ["Liam Green","2160","67","152.97","132 / 188"],
    ["Kagiso Behrendorff","1852","85","145.37","98 / 173"],
    ["Sanju Smith","1850","53","157.18","103 / 175"],
  ].map(r => r.map(v => ({ text: v, options: { color: DARK } } )));

  s.addTable([header, ...rows], {
    x: 0.7, y: 2.1, w: 11.8, h: 2.6,
    fontFace: FONT_BODY, fontSize: 13, border: { pt: 0.5, color: "E5E7EB" },
    align: "center", valign: "middle", autoPage: false,
    fill: { color: WHITE }
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.0, w: 11.8, h: 1.6, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText([
    { text: "Elite strike rates: ", options: { bold: true, color: PRIMARY } },
    { text: "All top-5 run scorers maintained a strike rate above 145 — reflecting T20 cricket's premium on scoring speed over pure accumulation. Sanju Smith posted the best strike rate (157.18) of the group despite the fewest innings.", options: { color: TEXT_MUTED } },
  ], { x: 1.0, y: 5.2, w: 11.2, h: 1.2, fontFace: FONT_BODY, fontSize: 12.5, valign: "middle" });
  pageNum(s, 6);
}

// ============================================================
// Slide 7: Top wicket takers table
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Player Performance", "Top 5 Wicket Takers (All Seasons)");

  const header = [
    { text: "Bowler", options: { fill: { color: ACCENT }, color: WHITE, bold: true } },
    { text: "Wickets", options: { fill: { color: ACCENT }, color: WHITE, bold: true } },
    { text: "Matches", options: { fill: { color: ACCENT }, color: WHITE, bold: true } },
    { text: "Economy", options: { fill: { color: ACCENT }, color: WHITE, bold: true } },
    { text: "Wkts / Match", options: { fill: { color: ACCENT }, color: WHITE, bold: true } },
  ];
  const rows = [
    ["Prithvi Yadav","56","44","9.11","1.27"],
    ["Ben Rahane","55","48","8.79","1.15"],
    ["Kagiso Behrendorff","55","50","9.26","1.10"],
    ["Liam Green","54","46","8.25","1.17"],
    ["Suryakumar Green","53","49","8.92","1.08"],
  ].map(r => r.map(v => ({ text: v, options: { color: DARK } } )));

  s.addTable([header, ...rows], {
    x: 0.7, y: 2.1, w: 11.8, h: 2.6,
    fontFace: FONT_BODY, fontSize: 13, border: { pt: 0.5, color: "E5E7EB" },
    align: "center", valign: "middle", autoPage: false, fill: { color: WHITE }
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.0, w: 11.8, h: 1.6, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText([
    { text: "Consistency over volume: ", options: { bold: true, color: ACCENT } },
    { text: "Prithvi Yadav topped the wicket charts (56) with the highest wickets-per-match rate (1.27) among the top 5 — taking fewer matches (44) than most peers to get there.", options: { color: TEXT_MUTED } },
  ], { x: 1.0, y: 5.2, w: 11.2, h: 1.2, fontFace: FONT_BODY, fontSize: 12.5, valign: "middle" });
  pageNum(s, 7);
}

// ============================================================
// Slide 8: Toss impact - pie/donut
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Match Dynamics", "Does Winning the Toss Matter?");

  s.addChart(pres.charts.DOUGHNUT, [{
    name: "Toss Decision",
    labels: ["Chose to Field", "Chose to Bat"],
    values: [367, 239]
  }], {
    x: 0.7, y: 2.0, w: 5.3, h: 4.4, chartColors: [ACCENT, PRIMARY],
    showLegend: true, legendPos: "b", showPercent: true, dataLabelColor: WHITE,
    dataLabelFontSize: 12, chartArea: { fill: { color: WHITE } }
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.4, y: 2.0, w: 6.1, h: 4.4, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText("Key Findings", { x: 6.7, y: 2.25, w: 5.5, h: 0.4, fontFace: FONT_HEAD, fontSize: 15, bold: true, color: PRIMARY });
  s.addText([
    { text: "60.6% of captains chose to field first ", options: { bold: true, breakLine: true } },
    { text: "after winning the toss — the modern T20 preference for chasing under lights and clearer run-chase math.", options: { color: TEXT_MUTED, breakLine: true } },
    { text: "\nBut it barely matters: ", options: { bold: true, breakLine: true } },
    { text: "the team that won the toss went on to win the match only 50.3% of the time — statistically no different from a coin flip. Toss decision correlates with strategy, not with outcome.", options: { color: TEXT_MUTED } },
  ], { x: 6.7, y: 2.8, w: 5.5, h: 3.4, fontFace: FONT_BODY, fontSize: 12.5, valign: "top" });
  pageNum(s, 8);
}

// ============================================================
// Slide 9: Excel & SQL skills showcase
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };
  sectionHeader(s, "Technical Skills", "Excel & SQL Techniques Applied");

  const left = [
    "VLOOKUP, INDEX-MATCH, and XLOOKUP to pull match details dynamically by Match ID",
    "SUMIFS / COUNTIFS pivot-style summaries for team win rates",
    "Conditional formatting: color scales and data bars to surface top/bottom performers",
    "Native Excel charts (bar, line, pie) wired directly to formula-driven ranges"
  ];
  const right = [
    "Relational schema across matches and deliveries tables with foreign keys",
    "JOINs and UNIONs to compute matches-played across both team1/team2 columns",
    "Window functions (RANK, ROW_NUMBER) for season-by-season leaderboards",
    "CTEs and subqueries for toss-impact and head-to-head analysis"
  ];

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.95, w: 6.0, h: 4.6, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText("Excel", { x: 0.9, y: 2.15, w: 5.4, h: 0.45, fontFace: FONT_HEAD, fontSize: 17, bold: true, color: PRIMARY });
  left.forEach((t, i) => {
    s.addText(t, { x: 0.9, y: 2.75 + i * 0.92, w: 5.4, h: 0.85, fontFace: FONT_BODY, fontSize: 12, color: DARK, bullet: { code: "2022" }, valign: "top" });
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: 1.95, w: 6.0, h: 4.6, rectRadius: 0.08, fill: { color: BG_LIGHT } });
  s.addText("SQL", { x: 7.2, y: 2.15, w: 5.4, h: 0.45, fontFace: FONT_HEAD, fontSize: 17, bold: true, color: ACCENT });
  right.forEach((t, i) => {
    s.addText(t, { x: 7.2, y: 2.75 + i * 0.92, w: 5.4, h: 0.85, fontFace: FONT_BODY, fontSize: 12, color: DARK, bullet: { code: "2022" }, valign: "top" });
  });
  pageNum(s, 9);
}

// ============================================================
// Slide 10: Closing / Links
// ============================================================
{
  let s = pres.addSlide();
  s.background = { color: DARK };
  s.addShape(pres.shapes.OVAL, { x: -2, y: -2, w: 5, h: 5, fill: { color: PRIMARY, transparency: 82 } });

  s.addText("Explore the Full Project", { x: 0.9, y: 2.2, w: 11, h: 0.9, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: WHITE });
  s.addText("SQL queries · Excel workbook · this presentation · live interactive dashboard \u2014 all in one GitHub repository.", {
    x: 0.9, y: 3.05, w: 10.5, h: 0.6, fontFace: FONT_BODY, fontSize: 14, color: "C9CDE0"
  });

  const items = ["GitHub Repository", "Live Dashboard (GitHub Pages)", "Excel Workbook", "SQL Scripts"];
  items.forEach((t, i) => {
    const y = 4.0 + i * 0.55;
    s.addShape(pres.shapes.OVAL, { x: 0.9, y, w: 0.22, h: 0.22, fill: { color: PRIMARY } });
    s.addText(t, { x: 1.3, y: y - 0.1, w: 8, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: WHITE });
  });
  s.addText("Add your GitHub / dashboard links here before sharing.", {
    x: 0.9, y: 6.5, w: 8, h: 0.4, fontFace: FONT_BODY, fontSize: 10, italic: true, color: "6B7099"
  });
}

pres.writeFile({ fileName: "/home/claude/ipl-analytics-project/presentation/IPL_Analytics_Presentation.pptx" })
  .then(() => console.log("PPTX created"));
