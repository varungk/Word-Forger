import { NextApiRequest, NextApiResponse } from 'next'

export default async function createMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = req.body;
  console.log(messages);
  const apiKey = "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";
  const url = 'https://api.openai.com/v1/chat/completions';

  const body = JSON.stringify({
    messages,
    model: 'gpt-3.5-turbo',
    stream: false,
  });

  console.log("from api: ",body)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

    const data = await response.json();
    console.log("This is the data we get back",data)
    const result = data.choices[0].message.content;

    // Send the result back as the response to the API calling position
    res.status(200).json({ result });

  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}
