
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${apiKey}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}
