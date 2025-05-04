import dotenv from 'dotenv'
import OpenAI from "openai";
import {TripAgent} from "./src/trip-agent";

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const run = async () => {
    const agent = new TripAgent(client)
    const response = await agent.askQuestion("อยากเที่ยวเชียงใหม่ 3 วัน คาเฟ่เยอะ ๆ งบ 10000 ช่วยวางแผนให้หน่อย")
    console.log(response)
}

run().then(() => {
    console.log("---------------------------------------------------------------------------------")
})
