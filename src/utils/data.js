export const valData = {
    roles: ['Duelist', 'Initiator', 'Controller', 'Sentinel'],
    agents: {
        Duelist: ['Jett', 'Phoenix', 'Reyna', 'Raze', 'Yoru', 'Neon', 'Iso'],
        Initiator: ['Breach', 'Sova', 'Skye', 'KAY/O', 'Fade', 'Gekko', 'Tejo'],
        Controller: ['Omen', 'Brimstone', 'Viper', 'Astra', 'Harbor', 'Clove', 'Miks'],
        Sentinel: ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse']
    }
};

export const valComps = [
    { comp: ['Duelist', 'Duelist', 'Controller', 'Sentinel', 'Initiator'], weight: 50, label: 'Double Duelist' },
    { comp: ['Duelist', 'Controller', 'Sentinel', 'Sentinel', 'Initiator'], weight: 15, label: 'Double Sentinel' },
    { comp: ['Duelist', 'Controller', 'Sentinel', 'Initiator', 'Initiator'], weight: 25, label: 'Double Initiator' },
    { comp: ['Duelist', 'Controller', 'Controller', 'Initiator', 'Initiator'], weight: 5, label: 'Double Smokes' },
    { comp: ['Duelist', 'Duelist', 'Controller', 'Controller', 'Initiator'], weight: 5, label: 'Agro Smokes' },
];

export const valMaps = [
    'Abyss', 'Ascent', 'Bind', 'Breeze', 'Fracture', 
    'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'
];
