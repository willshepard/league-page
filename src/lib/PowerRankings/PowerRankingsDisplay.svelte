<script>
    import { getTeamFromTeamManagers } from '$lib/utils/helper';
    export let rostersData, leagueTeamManagers, leagueData;
    
    const rosters = rostersData.rosters;
    let standings = [];
    
    const buildStandings = () => {
        const temp = [];
        
        for(const rosterID in rosters) {
            const roster = rosters[rosterID];
            
            let wins = 0;
            let losses = 0;
            
            if(roster.metadata && roster.metadata.record) {
                const record = roster.metadata.record;
                for(const result of record) {
                    if(result === "W") wins++;
                    if(result === "L") losses++;
                }
            }
            
            temp.push({
                rosterID,
                manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
                wins,
                losses,
                winPct: wins + losses > 0 ? (wins / (wins + losses)).toFixed(3) : '.000'
            });
        }
        
        // Sort by wins desc, then by win percentage
        temp.sort((a, b) => {
            if(b.wins !== a.wins) return b.wins - a.wins;
            return parseFloat(b.winPct) - parseFloat(a.winPct);
        });
        
        standings = temp;
    }
    
    buildStandings();
</script>

<style>
    .standings-container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        color: white;
        margin: 0 0 30px 0;
        font-size: 2em;
        font-weight: 600;
    }

    .standings-table {
        width: 100%;
        border-collapse: collapse;
    }

    .table-header {
        display: grid;
        grid-template-columns: 1fr 80px 80px 80px;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px 8px 0 0;
        margin-bottom: 0;
        backdrop-filter: blur(10px);
        font-weight: 600;
        color: white;
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .header-rank {
        text-align: left;
        padding-left: 8px;
    }

    .header-stat {
        text-align: center;
    }

    .standing-row {
        display: grid;
        grid-template-columns: 1fr 80px 80px 80px;
        gap: 12px;
        padding: 16px 12px;
        background: rgba(255, 255, 255, 0.08);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        align-items: center;
        transition: all 0.3s ease;
    }

    .standing-row:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateX(4px);
    }

    .standing-row:last-child {
        border-bottom: none;
        border-radius: 0 0 8px 8px;
    }

    .team-info {
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;
    }

    .team-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .team-name {
        font-weight: 600;
        font-size: 1.05em;
    }

    .stat-box {
        text-align: center;
        color: white;
    }

    .stat-value {
        font-size: 1.4em;
        font-weight: 700;
        display: block;
    }

    .stat-label {
        font-size: 0.75em;
        opacity: 0.85;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 2px;
    }

    .win-pct {
        background: rgba(255, 255, 255, 0.2);
        padding: 6px;
        border-radius: 6px;
        font-size: 0.95em;
        font-weight: 600;
    }

    @media (max-width: 600px) {
        .standings-container {
            padding: 15px;
            margin: 15px;
        }

        h2 {
            font-size: 1.5em;
            margin-bottom: 20px;
        }

        .table-header,
        .standing-row {
            grid-template-columns: 1fr 60px 60px 60px;
            gap: 8px;
            padding: 12px 8px;
        }

        .team-avatar {
            width: 35px;
            height: 35px;
        }

        .stat-value {
            font-size: 1.2em;
        }

        .stat-label {
            font-size: 0.65em;
        }
    }
</style>

<div class="standings-container">
    <h2>Current Standings</h2>
    
    <div class="table-header">
        <div class="header-rank">Team</div>
        <div class="header-stat">Wins</div>
        <div class="header-stat">Losses</div>
        <div class="header-stat">Win %</div>
    </div>

    {#each standings as team, index}
        <div class="standing-row">
            <div class="team-info">
                <img 
                    alt="team avatar" 
                    class="team-avatar" 
                    src={team.manager?.avatar || 'https://sleepercdn.com/images/v2/icons/player_default.webp'} 
                />
                <div class="team-name">{team.manager?.name || 'Unknown'}</div>
            </div>
            <div class="stat-box">
                <span class="stat-value">{team.wins}</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">{team.losses}</span>
            </div>
            <div class="stat-box">
                <span class="stat-value win-pct">{team.winPct}</span>
            </div>
        </div>
    {/each}
</div>
