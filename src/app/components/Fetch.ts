"use server"
import axios from "axios";

export async function name(url: any) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY; 
        const res = await axios.get(url);
        console.log("data ", res.data); 
        console.log("Key " , apiKey);
        return res.data;
      } catch (error) {
        console.error(error); 
        return "error"
      }
}