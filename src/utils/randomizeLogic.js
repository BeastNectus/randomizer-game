import { valData, valComps } from './data';

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

        if (mode === 'Roles') {
            assignments.push({ player, role, agent: null });
        } else {
            const agentsInRole = availableAgents[role];
            if (agentsInRole && agentsInRole.length > 0) {
                // Select random index, remove it from the array, use the removed hero
                const randomIdx = Math.floor(Math.random() * agentsInRole.length);
                const agent = agentsInRole.splice(randomIdx, 1)[0]; 
                
                assignments.push({ player, role, agent });
            } else {
                // Fallback catch block in case pool empties
                assignments.push({ player, role, agent: 'Any' });
            }
        }
    }

    return assignments;
};
