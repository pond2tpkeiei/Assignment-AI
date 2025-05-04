import { LocationData } from './location-data';

export const getLocation = async () : Promise<LocationData> => {
    const response = await fetch(`https://apiip.net/api/check?accessKey=${process.env.API_IP_KEY}`);
    const res = await response.json();
    
    return res
}