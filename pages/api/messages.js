import messages from '../../messages.json';

export default (req, res) => {
  if (req.method === 'GET') {
    res.json(messages);
  } else if (req.method === 'POST') {
    const { name, message } = req.body;
    const newMessage = { name, message, timestamp: Date.now() };
    messages.push(newMessage);
    res.status(201).json(newMessage);
  }
};
