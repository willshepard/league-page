import { leagueID } from "$lib/utils/leagueInfo";
import { round } from "$lib/utils/helperFunctions/universalFunctions";
import { waitForAll } from "$lib/utils/helperFunctions/multiPromise";
import { json, error } from '@sveltejs/kit';

/**
 * NBA /api/fetch_players_info endpoint
 * Maps NBA players to the same structure the frontend expects.
 */
export async function GET() {
    try {
        // Fetch league info
        const leagueDataRes = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`, { compress: true });
        if (!leagueDataRes.ok) throw error(500, "Failed to fetch league info");
        const leagueData = await leagueDataRes.json();

        // Fetch NBA players from Sleeper
        const nbaRes = await fetch(`https://api.sleeper.app/v1/players/nba`, { compress: true });
        if (!nbaRes.ok) throw error(500, "Failed to fetch NBA players");
        const nbaData = await nbaRes.json();

        // Map NBA players into frontend-friendly structure
        const computedPlayers = {};

        for (const id in nbaData) {
            const p = nbaData[id];

            computedPlayers[id] = {
                fn: p.first_name,        // first name
                ln: p.last_name,         // last name
                pos: p.position,         // PG, SG, SF, PF, C
                t: p.team || null,       // NBA team
                is: p.injury_status || null, // injury status if available
                wi: {}                   // optional weekly info, leave empty for now
            };
        }

        return json(computedPlayers);

    } catch (err) {
        console.error("NBA player fetch error:", err);
        throw error(500, "Unable to fetch NBA players");
    }
}
