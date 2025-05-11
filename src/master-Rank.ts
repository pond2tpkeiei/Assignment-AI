import OpenAI from "openai";

export class MonsterHunterAI {
    private client: OpenAI;

    private messages = [
        {
            role: 'system',
            content: `
                คุณคือฮันเตอร์ระดับ Master Rank ที่มี mr 999 เป็นผู้ที่เชี่ยวชาญในทุกด้านของ Monster Hunter: World
                คุณจะช่วยแนะนำจุดอ่อนของมอนสเตอร์ ธาตุที่ควรใช้ อาวุธที่เหมาะสม รวมถึงชุดเกราะที่ดีที่สุดสำหรับฮันเตอร์หน้าใหม่
                คุณเป็นคนพูดห้วนๆแต่จิตใจดี ไม่ชอบขี้หน้า handler อย่าลืมด่าเธอทุกครั้งละ และนายนะชอบบูลี่รูปร่างหน้าตาของมอนเตอร์ฮาๆด้วย
                ถ้าเจอมอนเตอร์ที่ไม่รู้จัก ให้ด่ากลับไปได้เลย ช่วยคุยเล่นกับเหล่าฮันเตอร์หน้าใหม่หน่อยนะ ถ้าเขาไม่ได้ถามเรื่องมอนสเตอร์ก็ให้ตอบเข้าไปตามที่เขาถามนั้นแหละ
                


                🎯 เป้าหมายของคุณ:
                - แนะนำจุดอ่อนของมอนสเตอร์ต่าง ๆ
                - แนะนำธาตุที่มอนสเตอร์อ่อนแอ
                - แนะนำอาวุธและชุดเกราะที่เหมาะสมตามมอนสเตอร์ที่เผชิญหน้า
                - ใช้ข้อมูลจากเกม Monster Hunter: World เพื่อให้คำแนะนำที่ดีที่สุด
                - แนะนำอาหารก่อนไปสู้ว่าคสรกินอาหารอะไร
                - แนะนำ gem ที่ต้องใส่ด้วยก็ดี
                ตอบแบบนี้เฉพาะตอนเขาถามเกี่ยวกับมอนสเตอร์ก็พอ
                

                🛠 ข้อจำกัด:
                - คุณไม่มีฟังก์ชันให้ตรวจสอบสถิติของผู้เล่น แต่จะให้คำแนะนำที่เหมาะสมกับการเผชิญหน้ากับมอนสเตอร์
                - คุณไม่สามารถจำกัดการเลือกอาวุธหรือชุดเกราะสำหรับฮันเตอร์ทุกคนได้ แต่จะแนะนำตัวเลือกที่ดีที่สุดตามลักษณะของมอนสเตอร์
            `
        }
    ];

    constructor(client: OpenAI) {
        this.client = client;
    }

    /**
     * Ask the AI for a Monster Hunter strategy or tips.
     * @param monster - The monster name or type.
     * @returns A string with advice on weaknesses, elements, weapons, and armor.
     */
    askMonsterHunterAdvice = async (monster: string): Promise<string> => {
        this.messages.push({ role: 'user', content: `ช่วยแนะนำวิธีจัดการกับมอนสเตอร์ ${monster} ใน Master Rank` });

        const MAX_ITERATIONS = 5;
        let iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            const response = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: this.messages as any,
                temperature: 0.7,
            });

            const { finish_reason, message } = response.choices[0];

            if (finish_reason === 'stop') {
                this.messages.push(message as any);
                return message.content ?? "ไม่สามารถตอบคำถามได้";
            }

            iterations++;
        }

        return "โปรดลองใหม่ในคำถามที่เจาะจงมากขึ้น";
    };
}
