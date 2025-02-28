const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActivityType } = require('discord.js');

// สร้าง Client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// กำหนด Token ของบอท
const token = '';

// สร้างคำสั่ง /random
const commands = [
    {
        name: 'random',
        description: 'สุ่มรหัสที่มีตัวอักษร ตัวเลข และตัวอักษรพิเศษ',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('เริ่มต้นการรีจิสเตอร์คำสั่ง...');
        await rest.put(Routes.applicationCommands(''), { //ใส่ Client id ไม่งั้นไม่ทำงาน ✅
            body: commands,
        });
        console.log('รีจิสเตอร์คำสั่งเสร็จสิ้น!');
    } catch (error) {
        console.error(error);
    }
})();

// ฟังก์ชันเพื่อสร้างรหัสสุ่ม
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'; // เพิ่มตัวที่จะให้สุ่มได้
    const length = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// ฟังก์ชันเมื่อบอทพร้อมทำงาน
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    // ตั้งค่าสถานะเป็น Streaming
    client.user.setActivity({
        name: 'ilv',
        type: ActivityType.Streaming, // ตั้งค่าสถานะเป็น Streaming
        url: 'https://twitch.tv/Discord' // URL ของ Twitch หรือแพลตฟอร์มอื่นๆ
    });
});

// ฟังก์ชันเมื่อรับคำสั่งจากผู้ใช้
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'random') {
        const code = generateRandomCode();

        // สร้าง Embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('รหัสสุ่ม')
            .setDescription(`รหัสที่สุ่มได้:\n\`\`\`${code}\`\`\``) // ใช้ code block
            .setImage('https://media1.tenor.com/m/YH-LbMCZTrEAAAAC/okay-onepunchman.gif') // ใส่ URL ของรูปภาพที่ต้องการ
            .setFooter({ text: 'Generated by ilv' });

        // ส่งคำตอบแบบ DM
        try {
            await interaction.user.send({ embeds: [embed] });
            await interaction.reply({ content: 'รหัสสุ่มได้ถูกส่งไปยัง DM ของคุณแล้ว!', ephemeral: true });
        } catch (error) {
            console.error('ไม่สามารถส่ง DM ได้:', error);
            await interaction.reply({ content: 'ไม่สามารถส่ง DM ให้คุณได้. โปรดลองใหม่อีกครั้ง.', ephemeral: true });
        }
    }
});


client.login(token);
