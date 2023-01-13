import { Request, Response } from 'express';

export default function handler(request: Request, response: Response) {
  response.status(200).json({ name: 'John Doe' })
}
