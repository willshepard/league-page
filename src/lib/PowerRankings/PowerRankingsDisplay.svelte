<script>
	import BarChart from '$lib/BarChart.svelte';
    import { generateGraph, getTeamFromTeamManagers, round } from '$lib/utils/helper';
    export let rostersData, leagueTeamManagers, leagueData;
    const rosters = rostersData.rosters;
    let validGraph = false;
    let graphs = [];
    
    const buildStandings = () => {
        const standings = [];
        let hasData = false;
        
        for(const rosterID in rosters) {
            const roster = rosters[rosterID];
            
            // Get wins and losses from metadata
            let wins = 0;
            let losses = 0;
            
            if(roster.metadata && roster.metadata.record) {
                const record = roster.metadata.record;
                for(const result of record) {
                    if(result === "W") wins++;
                    if(result === "L") losses++;
                }
                hasData = true;
            }
            
            standings.push({
                rosterID,
                manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
                wins: wins,
                losses: losses,
                score: roster.settings?.fpts || 0
            });
        }
        
        if(hasData) {
            validGraph = true;
        }
        
        // Sort by wins descending
        standings.sort((a, b) => b.wins - a.wins);
        
        const standingsGraph = {
            stats: standings,
            x: "Manager",
            y: "Wins",
            stat: "",
            header: "Current Standings",
            field: "wins",
            short: "Wins"
        };
        
        graphs = [
            generateGraph(standingsGraph, leagueData.season),
        ]
    }
    
    buildStandings();
</script>

<style>
    .enclosure {
        display: block;
        position: relative;
        width: 100%;
    }
</style>

{#if validGraph}
    <div class="enclosure">
        <BarChart {graphs} leagueTeamManagers={leagueTeamManagers} />
    </div>
{/if}
