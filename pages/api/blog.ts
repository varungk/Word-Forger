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
    console.log("The data we get is: ",data)
    const result = data.choices[0].message.content;

    // Send the result back as the response to the API calling position
    res.status(200).json({ result });

  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}
