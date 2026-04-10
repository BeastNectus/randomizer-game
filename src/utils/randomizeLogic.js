import { valData, valComps, valPistols, valMainWeapons, mcData } from './data';

// Helper function to randomly shuffle an array
const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const generateRandomization = (mode, players) => {
    if (!players || players.length === 0) {
        return [];
    }

    const data = valData;
    
    // Select the Role Structure based on Player Count
    let assignedRoles = [];
    if (players.length === 5) {
        // Enforce Strict Meta for full 5 person stacks using weighted chances
        const totalWeight = valComps.reduce((acc, curr) => acc + curr.weight, 0);
        let randomNum = Math.random() * totalWeight;
        let selectedCompPool;
        
        for (const meta of valComps) {
            if (randomNum < meta.weight) {
                selectedCompPool = meta.comp;
                break;
            }
            randomNum -= meta.weight;
        }

        // Fallback in case of rounding errors
        if (!selectedCompPool) selectedCompPool = valComps[0].comp;

        assignedRoles = shuffle(selectedCompPool);
    } else {
        // Fallback: Total random roles for anything not = 5
        assignedRoles = players.map(() => data.roles[Math.floor(Math.random() * data.roles.length)]);
    }

    let assignments = [];
    // Deep copy available agents pool so we can splice elements to guarantee NO DUPLICATES
    const availableAgents = JSON.parse(JSON.stringify(data.agents));

    // Map out roles and select characters
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const role = assignedRoles[i];
        
        // Split Weapons
        const pistolWeapon = valPistols[Math.floor(Math.random() * valPistols.length)];
        const mainWeapon = valMainWeapons[Math.floor(Math.random() * valMainWeapons.length)];

        if (mode === 'Roles') {
            assignments.push({ player, role, agent: null, pistolWeapon, mainWeapon });
        } else {
            const agentsInRole = availableAgents[role];
            if (agentsInRole && agentsInRole.length > 0) {
                // Select random index, remove it from the array, use the removed hero
                const randomIdx = Math.floor(Math.random() * agentsInRole.length);
                const agent = agentsInRole.splice(randomIdx, 1)[0]; 
                
                assignments.push({ player, role, agent, pistolWeapon, mainWeapon });
            } else {
                // Fallback catch block in case pool empties
                assignments.push({ player, role, agent: 'Any', pistolWeapon, mainWeapon });
            }
        }
    }

    return assignments;
};

export const generateMCRandomization = () => {
    const commander = mcData.commanders[Math.floor(Math.random() * mcData.commanders.length)];
    const faction = mcData.factions[Math.floor(Math.random() * mcData.factions.length)];
    const role = mcData.roles[Math.floor(Math.random() * mcData.roles.length)];

    return { commander, faction, role };
};
