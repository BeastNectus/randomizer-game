require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates // Required to read what voice channel a user's in
    ]
});

const discordToken = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// ==== Game Data ====
const valData = {
    roles: ['Duelist', 'Initiator', 'Controller', 'Sentinel'],
    agents: {
        Duelist: ['Jett', 'Phoenix', 'Reyna', 'Raze', 'Yoru', 'Neon', 'Iso'],
        Initiator: ['Breach', 'Sova', 'Skye', 'KAY/O', 'Fade', 'Gekko', 'Tejo'],
        Controller: ['Omen', 'Brimstone', 'Viper', 'Astra', 'Harbor', 'Clove', 'Miks'
        ],
        Sentinel: ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse']
    }
};

const owData = {
    roles: ['Tank', 'Damage', 'Support'],
    heroes: {
        Tank: ['D.Va', 'Doomfist', 'Junker Queen', 'Mauga', 'Orisa', 'Ramattra', 'Reinhardt', 'Roadhog', 'Sigma', 'Winston', 'Wrecking Ball', 'Zarya', 'Hazard'],
        Damage: ['Ashe', 'Bastion', 'Cassidy', 'Echo', 'Genji', 'Hanzo', 'Junkrat', 'Mei', 'Pharah', 'Reaper', 'Sojourn', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjörn', 'Tracer', 'Widowmaker', 'Venture'],
        Support: ['Ana', 'Baptiste', 'Brigitte', 'Illari', 'Kiriko', 'Lifeweaver', 'Lúcio', 'Mercy', 'Moira', 'Zenyatta', 'Juno']
    }
};

// ==== Strict Meta Structures (For 5 players) ====
const valComps = [
    ['Duelist', 'Duelist', 'Controller', 'Sentinel', 'Initiator'],
    ['Duelist', 'Controller', 'Sentinel', 'Sentinel', 'Initiator'],
    ['Duelist', 'Controller', 'Sentinel', 'Initiator', 'Initiator'],
    ['Duelist', 'Controller', 'Controller', 'Initiator', 'Initiator'],
    ['Duelist', 'Duelist', 'Controller', 'Controller', 'Initiator'],
];
const owComp = ['Tank', 'Damage', 'Damage', 'Support', 'Support'];

// Helper function to randomly shuffle an array
const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// ==== Command Builder ====
const command = new SlashCommandBuilder()
    .setName('randomize')
    .setDescription('Randomize squad roles and agents/heroes.')
    .addStringOption(option =>
        option.setName('game')
            .setDescription('Game to randomize for')
            .setRequired(true)
            .addChoices(
                { name: 'Valorant', value: 'Valorant' },
                { name: 'Overwatch 2', value: 'Overwatch 2' }
            ))
    .addStringOption(option =>
        option.setName('mode')
            .setDescription('Randomize Agents/Heroes or just Roles')
            .setRequired(true)
            .addChoices(
                { name: 'Agents', value: 'Agents' },
                { name: 'Roles', value: 'Roles' }
            ))
    .addStringOption(option =>
        option.setName('players')
            .setDescription('Comma-separated list of players (optional)')
            .setRequired(false));

const helpCommand = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show examples and instructions on how to use the bot.');

const helpRandomCommand = new SlashCommandBuilder()
    .setName('help_random')
    .setDescription('Show specific details on how the randomizer works for squad setups.');

// ==== Bot Initialization & Command Registration ====
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const rest = new REST({ version: '10' }).setToken(discordToken);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: [command.toJSON(), helpCommand.toJSON(), helpRandomCommand.toJSON()] },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

// ==== Interaction Handler ====
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎲 Squad Randomizer Help & Examples')
            .setColor('#0099ff')
            .setDescription('Here is how to use the bot to randomize your squads!')
            .addFields(
                { name: '1. Auto-Detect Voice Channel (Recommended)', value: '`/randomize game:Valorant mode:Agents`\nLeave the `players` option blank! The bot will automatically grab everyone currently in your Voice Channel. If it detects exactly 5 people, it forces a strict meta team comp!' },
                { name: '2. Custom Player List', value: '`/randomize game:Overwatch 2 mode:Roles players:Alice, Bob, Charlie`\nIgnores the voice channel and assigns Roles specifically to Alice, Bob, and Charlie.' },
                { name: 'Game & Modes Built-in', value: '**Games:** Valorant, Overwatch 2\n**Modes:** \n- `Agents` (Assigns a specific character + role)\n- `Roles` (Assigns only the generic role, e.g., Tank or Duelist)' }
            )
            .setFooter({ text: 'Generated by John Dev' });
            
        return interaction.reply({ embeds: [helpEmbed] });
    }

    if (interaction.commandName === 'help_random') {
        const randomHelpEmbed = new EmbedBuilder()
            .setTitle('🧠 How The Randomizer Works')
            .setColor('#9b59b6')
            .setDescription('Ever wonder how the bot assigns roles? Here is the logic it follows:')
            .addFields(
                { name: '🔥 Strict 5-Stack Meta (Valorant)', value: 'If exactly 5 players are selected, it forces one of these comps:\n`2 Duelist, 1 Controller, 1 Sentinel, 1 Initiator`\n`1 Duelist, 1 Controller, 2 Sentinel, 1 Initiator`\n`1 Duelist, 1 Controller, 1 Sentinel, 2 Initiator`' },
                { name: '🛡️ Strict 5-Stack Meta (Overwatch 2)', value: 'If exactly 5 players are selected, it strictly enforces standard role queue:\n`1 Tank, 2 Damage, 2 Support`' },
                { name: '🎲 Non-Standard Lobby (Not 5 Players)', value: 'If your group has 2, 3, 4, or 6+ players, the meta is thrown out! Roles are randomly picked from the entire pool, leading to chaotic and fun combinations.' },
                { name: '🦸 Prevent Duplicates (Agents Mode)', value: 'The bot uses an intelligent selection system to ensure the same Agent/Hero is never assigned to two different players on the same squad.' }
            )
            .setFooter({ text: 'Generated by John Dev' });
            
        return interaction.reply({ embeds: [randomHelpEmbed] });
    }

    if (interaction.commandName !== 'randomize') return;

    const game = interaction.options.getString('game');
    const mode = interaction.options.getString('mode');
    const playersStr = interaction.options.getString('players');

    let players = [];
    
    // Resolve players list (either from command argument OR from the voice channel)
    if (playersStr) {
        players = playersStr.split(',').map(p => p.trim()).filter(p => p);
    } else {
        const vc = interaction.member?.voice?.channel;
        if (!vc) {
            return interaction.reply({ 
                content: 'You must be in a Voice Channel or provide a comma-separated list of players.', 
                ephemeral: true 
            });
        }
        players = Array.from(vc.members.values()).map(m => m.displayName || m.user.username);
    }

    if (players.length === 0) {
        return interaction.reply({ content: 'No players found to randomize.', ephemeral: true });
    }

    const isVal = game === 'Valorant';
    const gameColor = isVal ? '#ff4655' : '#f99e1a';
    const data = isVal ? valData : owData;
    
    // Select the Role Structure based on Player Count
    let assignedRoles = [];
    if (players.length === 5) {
        // Enforce Strict Meta for full 5 person stacks
        const compPool = isVal ? shuffle(valComps)[0] : owComp;
        assignedRoles = shuffle(compPool);
    } else {
        // Fallback: Total random roles for anything not = 5
        assignedRoles = players.map(() => data.roles[Math.floor(Math.random() * data.roles.length)]);
    }

    let assignments = [];
    // Deep copy available agents pool so we can splice elements to guarantee NO DUPLICATES
    const availableAgents = JSON.parse(JSON.stringify(isVal ? data.agents : data.heroes));

    // Map out roles and select characters
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const role = assignedRoles[i];

        if (mode === 'Roles') {
            assignments.push({ name: player, value: role, inline: true });
        } else {
            const agentsInRole = availableAgents[role];
            if (agentsInRole && agentsInRole.length > 0) {
                // Select random index, remove it from the array, use the removed hero
                const randomIdx = Math.floor(Math.random() * agentsInRole.length);
                const agent = agentsInRole.splice(randomIdx, 1)[0]; 
                
                assignments.push({ name: player, value: `${agent} (${role})`, inline: true });
            } else {
                // Fallback catch block in case pool empties
                assignments.push({ name: player, value: `Any (${role})`, inline: true });
            }
        }
    }

    // Embed Construction
    const embed = new EmbedBuilder()
        .setTitle(`🎲 ${game} ${mode} Randomizer`)
        .setColor(gameColor)
        .addFields(assignments)
        .setFooter({ text: 'Generated by John Dev' });

    await interaction.reply({ embeds: [embed] });
});

client.login(discordToken);