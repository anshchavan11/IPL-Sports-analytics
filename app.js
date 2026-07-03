// ============================================================
// IPL Analytics Dashboard — app logic
// Consumes IPL_DATA (from data.js)
// ============================================================

const COLORS = {
  cherry: '#990011',
  cherryLight: '#c41e2a',
  navy: '#2F3C7E',
  navyLight: '#4a5aa8',
  muted: '#6b7280',
  grid: '#eee0de'
};

let charts = {};

function $(id) { return document.getElementById(id); }

function init() {
  populateFilters();
  render();
  $('seasonFilter').addEventListener('change', render);
  $('teamFilter').addEventListener('change', render);
}

function populateFilters() {
  const seasonSel = $('seasonFilter');
  IPL_DATA.seasons.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    seasonSel.appendChild(opt);
  });
  const teamSel = $('teamFilter');
  IPL_DATA.teams.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    teamSel.appendChild(opt);
  });
}

function getFilteredMatches() {
  const season = $('seasonFilter').value;
  const team = $('teamFilter').value;
  return IPL_DATA.matches.filter(m => {
    if (season !== 'all' && String(m.season) !== season) return false;
    if (team !== 'all' && m.team1 !== team && m.team2 !== team) return false;
    return true;
  });
}

function render() {
  const matches = getFilteredMatches();
  renderKPIs(matches);
  renderTeamChart();
  renderTossChart(matches);
  renderSeasonChart();
  renderBatters();
  renderBowlers();
  renderMatchLog(matches);
}

function renderKPIs(matches) {
  const totalMatches = matches.length;
  const seasonsCount = new Set(matches.map(m => m.season)).size;
  const winCounts = {};
  matches.forEach(m => { if (m.winner) winCounts[m.winner] = (winCounts[m.winner] || 0) + 1; });
  let topTeam = '-', topWins = 0;
  Object.entries(winCounts).forEach(([t, w]) => { if (w > topWins) { topTeam = t; topWins = w; } });

  const topScorer = IPL_DATA.batOverall[0];

  const kpis = [
    { label: 'Matches Shown', value: totalMatches, sub: `${seasonsCount} season${seasonsCount !== 1 ? 's' : ''}` },
    { label: 'Most Wins (filtered)', value: topTeam === '-' ? '-' : topTeam.split(' ').map(w => w[0]).join(''), sub: topTeam === '-' ? '' : `${topWins} wins — ${topTeam}` },
    { label: 'All-Time Top Scorer', value: topScorer.total_runs.toLocaleString(), sub: topScorer.batter },
    { label: 'Total Deliveries Analyzed', value: '144,032', sub: 'Ball-by-ball dataset' },
  ];

  $('kpiRow').innerHTML = kpis.map(k => `
    <div class="kpi">
      <div class="label">${k.label}</div>
      <div class="value">${k.value}</div>
      <div class="sub">${k.sub}</div>
    </div>
  `).join('');
}

function renderTeamChart() {
  const season = $('seasonFilter').value;
  let rows;
  if (season === 'all') {
    rows = IPL_DATA.overallTeam.slice().sort((a, b) => b.win_pct - a.win_pct);
  } else {
    rows = IPL_DATA.seasonTeamStats
      .filter(r => String(r.season) === season)
      .sort((a, b) => b.win_pct - a.win_pct);
  }
  const labels = rows.map(r => r.team);
  const data = rows.map(r => r.win_pct);

  if (charts.team) charts.team.destroy();
  charts.team = new Chart($('teamChart'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Win %', data, backgroundColor: COLORS.cherry, borderRadius: 4, maxBarThickness: 34 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.parsed.y}% win rate` } } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: COLORS.grid }, ticks: { color: COLORS.muted } },
        x: { grid: { display: false }, ticks: { color: COLORS.muted, autoSkip: false, maxRotation: 45, minRotation: 45, font: { size: 10 } } }
      }
    }
  });
}

function renderTossChart(matches) {
  const bat = matches.filter(m => m.toss_decision === 'bat').length;
  const field = matches.filter(m => m.toss_decision === 'field').length;
  const tossWinAlsoMatchWin = matches.filter(m => m.toss_winner === m.winner).length;
  const total = matches.length || 1;

  if (charts.toss) charts.toss.destroy();
  charts.toss = new Chart($('tossChart'), {
    type: 'doughnut',
    data: {
      labels: ['Chose to Field', 'Chose to Bat'],
      datasets: [{ data: [field, bat], backgroundColor: [COLORS.navy, COLORS.cherry], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: COLORS.muted, font: { size: 11 } } },
        tooltip: { callbacks: { label: c => `${c.label}: ${c.parsed} matches` } },
        title: {
          display: true,
          text: `Toss winner also won match: ${((tossWinAlsoMatchWin / total) * 100).toFixed(1)}%`,
          color: COLORS.dark, font: { size: 11, weight: 'normal' }, position: 'bottom'
        }
      }
    }
  });
}

function renderSeasonChart() {
  const rows = IPL_DATA.seasonSummary;
  const labels = rows.map(r => r.season);
  const data = rows.map(r => r.runs);

  if (charts.season) charts.season.destroy();
  charts.season = new Chart($('seasonChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Orange Cap Runs', data, borderColor: COLORS.cherry, backgroundColor: 'rgba(153,0,17,0.08)',
        tension: 0.35, fill: true, pointBackgroundColor: COLORS.cherry, pointRadius: 4, borderWidth: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: c => `${rows[c.dataIndex].orange_cap}: ${c.parsed.y} runs`
          }
        }
      },
      scales: {
        y: { beginAtZero: false, grid: { color: COLORS.grid }, ticks: { color: COLORS.muted } },
        x: { grid: { display: false }, ticks: { color: COLORS.muted } }
      }
    }
  });
}

function renderBatters() {
  const rows = IPL_DATA.batOverall.slice(0, 10);
  $('battersBody').innerHTML = rows.map((r, i) => `
    <tr>
      <td class="rank">${i + 1}</td>
      <td>${r.batter}</td>
      <td>${r.total_runs.toLocaleString()}</td>
      <td>${r.strike_rate}</td>
      <td>${r.sixes}</td>
    </tr>
  `).join('');
}

function renderBowlers() {
  const rows = IPL_DATA.bowlOverall.slice(0, 10);
  $('bowlersBody').innerHTML = rows.map((r, i) => `
    <tr>
      <td class="rank">${i + 1}</td>
      <td>${r.bowler}</td>
      <td>${r.wickets}</td>
      <td>${r.economy}</td>
      <td>${r.matches}</td>
    </tr>
  `).join('');
}

function renderMatchLog(matches) {
  $('matchCountTag').textContent = `${matches.length} matches`;
  const sorted = matches.slice().sort((a, b) => b.id - a.id).slice(0, 50);
  $('matchesBody').innerHTML = sorted.map(m => {
    const margin = m.win_by_runs > 0 ? `${m.win_by_runs} runs` : (m.win_by_wickets > 0 ? `${m.win_by_wickets} wkts` : '-');
    return `
      <tr>
        <td>${m.season}</td>
        <td>${m.team1}</td>
        <td>${m.team2}</td>
        <td><strong>${m.winner || '-'}</strong></td>
        <td>${margin}</td>
        <td>${m.venue}</td>
      </tr>
    `;
  }).join('') + (matches.length > 50 ? `<tr><td colspan="6" style="text-align:center;color:#6b7280;font-style:italic;">Showing 50 most recent of ${matches.length} matches</td></tr>` : '');
}

document.addEventListener('DOMContentLoaded', init);
