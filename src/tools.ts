import { getCurrentWeather } from "./weather";
import { getLocation } from "./location";
import {
  estimateBudget
} from "./trip";

export const tools = [
  {
    type: 'function',
    function: {
      name: 'estimateBudget',
      description: 'The AI must evaluate its own spending level (budget, standard, luxury) based on the users words and send it to this function to calculate the cost.',
      parameters: {
        type: 'object',
        properties: {
          days: { type: 'number' },
          level: {
            type: 'string',
            enum: ['budget', 'standard', 'luxury']
          }
        },
        required: ['days', 'level']
      }
    }
  }
];

export const availableTools: {[key:string]: Function} = {
  estimateBudget
};
