import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Destructure the 'query' parameter from the request query
  const { query } = req.query;

  // Retrieve the API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  // Encode the query parameter to ensure it is safe for inclusion in the URL
  const encodedQuery = encodeURIComponent(query as string);

  try {
    // Make a request to the Geoapify geocoding API with the encoded query and API key
    const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodedQuery}&apiKey=${apiKey}`);
    
    // Send a successful response with the data received from the Geoapify API
    res.status(200).json(response.data);
  } catch (error: any) {
    
    res.status(500).json({ error: error.message });
  }
}
