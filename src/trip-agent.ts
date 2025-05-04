import OpenAI from "openai";
import {availableTools, tools} from "./tools";

/**
 * Represents a weather agent that can provide weather information.
 */
export class TripAgent {
    private client: OpenAI;

    private messages = [
        {
            role: 'system',
            content: `
                    คุณคือผู้ช่วยวางแผนทริปเที่ยวในประเทศไทยที่เป็นกันเองเหมือนเพื่อนคุยกัน

                    🎯 เป้าหมายของคุณ:
                    - ช่วยผู้ใช้วางแผนเที่ยวทั้งทริป โดยเฉพาะในไทย
                    - แนะนำกิจกรรม ที่เที่ยว คาเฟ่ ร้านอาหาร ฯลฯ ตามความสนใจ
                    - ประเมินงบประมาณรวมให้ผู้ใช้เข้าใจว่าทริปนี้ใช้เงินประมาณเท่าไร

                    🛠 ข้อจำกัด:
                    - คุณมีฟังก์ชัน estimateBudget(days, level) เพียงฟังก์ชันเดียวสำหรับคำนวณงบ
                    - คุณไม่มีฟังก์ชันอื่น เช่น createTripPlan
                    - ดังนั้น คุณต้อง **คิดแผนเที่ยวด้วยตัวเองทั้งหมด** จากคำถามของผู้ใช้

                    🗣 รูปแบบการตอบ:
                    - ตอบเหมือนเพื่อนแนะนำเพื่อน (กันเอง อบอุ่น เป็นธรรมชาติ)
                    - ใช้ bullet point, อีโมจิ, และจัดรูปแบบให้อ่านง่าย
                    - หลีกเลี่ยง JSON หรือข้อความที่ดูเป็นระบบเกินไป
                    - ใช้ภาษากึ่งทางการ เช่น “แนะนำร้านนี้เลย”, “วิวดี ถ่ายรูปสวยมาก”

                    📋 ตัวอย่างคำตอบที่เหมาะสม:

                    🗺️ แผนเที่ยวรายวัน:
                    Day 1: เดินเที่ยวเมืองเก่า – คาเฟ่ย่านนิมมาน – ถนนคนเดิน  
                    Day 2: ขึ้นดอยสุเทพ – คาเฟ่กลางธรรมชาติ – One Nimman  
                    Day 3: ซื้อของฝาก – เดินเล่นสวนสาธารณะ – เดินทางกลับ

                    💰 งบประมาณโดยรวม:
                    - ตั๋วไป-กลับ: ~1,200
                    - ที่พัก 2 คืน: ~1,000
                    - อาหาร + คาเฟ่: ~2,000
                    - การเดินทางในเมือง: ~500  
                    รวม: ~4,700 ✅ ไม่เกินงบ 5,000 บาท!

                    💡 เคล็ดลับ:
                    - ถ้าต้องการประหยัดมากขึ้น ลองเช่ามอไซค์แทนเรียกแกร็บ
                    - ที่พักราคาดีในย่านเมืองเก่า: ONCE MORE Hostel หรือ Stay With Me`
        }
    ]

    /**
     * Creates a new instance of the WeatherAgent.
     * @param client - An instance of the OpenAI client used for processing weather-related queries.
     */
    constructor(client: OpenAI) {
        this.client = client;
    }

    /**
     * Processes a weather-related question and provides a response.
     * @param message - The weather-related question or query from the user.
     * @returns A Promise that resolves to a string containing the response to the weather query.
     */
    askQuestion = async (message: string): Promise<string> => {
        this.messages.push({ role: 'user', content: message })

        const MAX_ITERATIONS = 5;
        let iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            console.log(`Iteration: ${iterations}`)

            const response = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: this.messages as any,
                temperature: 0.7,
                tools: tools as any,
            })


            const {finish_reason, message} =  response.choices[0]

            if (finish_reason === 'stop') {
                this.messages.push(message as any)
                return message.content ?? "I don't know"
            }

            if (finish_reason === 'tool_calls') {
                
                const call = message.tool_calls![0];
                const func = availableTools[call.function.name];
                console.log(call.function.name)
                const args = JSON.parse(call.function.arguments);
                const result = await func(...Object.values(args));
                
                this.messages.push({
                  role: 'function',
                  name: call.function.name,
                  content: typeof result === "string" ? result : JSON.stringify(result),
                }as any);
            }

            iterations++
        }

        return "Please try again with a more specific question."
    }
}