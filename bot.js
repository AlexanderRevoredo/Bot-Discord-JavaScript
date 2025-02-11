require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure a API do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API); // Coloque sua chave de API do Google AI aqui

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return; // Evita que o bot responda a si mesmo

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const response = await model.generateContent(msg.content);
        const replyText = response.response.text();

        msg.reply(replyText);
    } catch (error) {
        console.error(error);
        msg.reply("Ocorreu um erro ao tentar responder. 😥");
    }
});

client.login(process.env.DISCORD_TOKEN);

const keepAlive = () => {
    require('http').createServer((req, res) => res.end("Bot está online!")).listen(3000);
};
keepAlive();