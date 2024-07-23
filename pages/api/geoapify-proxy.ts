import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { z, x, y } = req.query;

  if (typeof z === 'string' && typeof x === 'string' && typeof y === 'string') {
    console.log(`Proxy request received for ${z}/${x}/${y}.png`); // Debugging line

    try {
      const response = await axios.get(`https://maps.geoapify.com/v1/tile/osm-carto/${z}/${x}/${y}.png?apiKey=${process.env.GEOAPIFY_API_KEY}`, {
        responseType: 'arraybuffer',
      });
      res.setHeader('Content-Type', 'image/png');
      res.send(response.data);
    } catch (error) {
      console.error("Error fetching tile:", error);
      res.status(500).send("Error fetching tile");
    }
  } else {
    res.status(400).send("Invalid parameters");
  }
}
