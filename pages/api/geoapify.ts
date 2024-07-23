
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY; 
  const encodedQuery = encodeURIComponent(query as string);

  try {
    const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodedQuery}&apiKey=${apiKey}`);
    res.status(200).json(response.data);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}
