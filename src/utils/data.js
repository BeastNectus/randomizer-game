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
    { comp: ['Duelist', 'Controller', 'Sentinel', 'Sentinel', 'Initiator'], weight: 50, label: 'Double Sentinel' },
    { comp: ['Duelist', 'Controller', 'Sentinel', 'Initiator', 'Initiator'], weight: 50, label: 'Double Initiator' },
    { comp: ['Duelist', 'Controller', 'Controller', 'Initiator', 'Initiator'], weight: 50, label: 'Double Smokes' },
    { comp: ['Duelist', 'Duelist', 'Controller', 'Controller', 'Initiator'], weight: 50, label: 'Agro Smokes' },
];

export const valMaps = [
    'Abyss', 'Ascent', 'Bind', 'Breeze', 'Fracture',
    'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'
];

export const valPistols = [
    'Classic', 'Shorty', 'Frenzy', 'Ghost', 'Sheriff', 'Bandit'
];

export const valMainWeapons = [
    'Stinger', 'Spectre', 'Bucky', 'Judge',
    'Bulldog', 'Guardian', 'Phantom', 'Vandal',
    'Marshal', 'Outlaw', 'Operator',
    'Ares', 'Odin'
];

export const mcData = {
    commanders: [
        'Walice', 'Layla Delima', 'Zilong', 'Angelat', 'Harley', 
        'Polpol and Kupal', 'Kaguran', 'Bulox', 'Lylia', 'Choupapi', 
        'Wangwang', 'Banana', 'Tuliling', 'Vale', 'HAHAHAHAHA', 
        'Moscovado', 'Jennifer', 'Miyawa', 'Lansilog', 'Louyi', 
        'Biksana', 'Johnson Box', 'Aamon', 'Lukas', 'Brrrr', 
        'Itlog', 'Butiki', 'Kabaw Baka', 'Dakmats', 'Karina Sanchez', 
        'Gisingot', 'Dyrroth', 'Pakyaw', 'ShingShingShing'
    ],
    factions: [
        'Mortal Rivals', 'KOF', 'Soul Vessels', 'Heartbond', 
        'Luminexus', 'Exorcist', 'Neobeast', 'Toy Story', 
        'Glory League', 'Mystic Meow', 'Beyond The Clouds'
    ],
    roles: [
        'Bruiser', 'Defender', 'Dauntless', 'Weapon Master', 
        'Marksman', 'Stargazer', 'Swiftblade', 'Mage', 
        'FaceWarper', 'Scavenger'
    ]
};

export const squadGames = [
    'Valorant', 'Counter-Strike 2', 'League of Legends',
    'Overwatch 2', 'Apex Legends', 'Minecraft',
    'Lethal Company', 'Rocket League', 'Rainbow Six Siege',
    'Helldivers 2', 'Dead by Daylight', 'Content Warning'
];

export const valModes = [
    'Competitive', 'Unrated', 'Swiftplay', 'Spike Rush',
    'Escalation', 'Team Deathmatch'
];
