import dotenv from 'dotenv';
import OpenAI from 'openai';
import readline from 'readline';
import { MonsterHunterAI } from './src/master-Rank';
//npx ts-node index.ts

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const monsterHunterAI = new MonsterHunterAI(openai);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askLoop = () => {
    rl.question('', async (monster) => {
        if (monster.toLowerCase() === 'ลาก่อน') {
            console.log("👋 แล้วเจอกัน ไอหนู!");
            rl.close();
            return;
        }

        try {
            const response = await monsterHunterAI.askMonsterHunterAdvice(monster);
            console.log(`----------------------------------------------------\n${response}\n`);
        } catch (error) {
            console.error("❌ เกิดข้อผิดพลาด:", error);
        }

        askLoop();
    });
};

askLoop();
