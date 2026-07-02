'use client';

// The "AI" chatbox. The user picks a canned question and the backend returns
// a pre-generated reply. A fake typing delay makes it feel like a real
// assistant — there is no actual AI model behind it.
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

export default function ChatBox() {
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const windowRef = useRef(null);

  useEffect(() => {
    api('chat/questions').then(setQuestions).catch(() => {});
  }, []);

  useEffect(() => {
    // Keep the newest message in view.
    const el = windowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  async function ask(question) {
    setMessages((m) => [...m, { from: 'user', text: question.question }]);
    setTyping(true);
    try {
      // Fetch the reply and the fake "thinking" pause in parallel, so the
      // bot always appears to type for at least ~1.5 seconds.
      const [{ reply }] = await Promise.all([
        api('chat', {
          method: 'POST',
          body: JSON.stringify({ questionId: question.id }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
      setMessages((m) => [...m, { from: 'bot', text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: `Sorry, something went wrong: ${err.message}` },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="card chat-card">
      <h2>💬 Smart AI Assistant</h2>
      <div className="chat-window" ref={windowRef}>
        {messages.length === 0 && !typing && (
          <div className="chat-empty">
            Namaste! 🙏 I&apos;m your Smart AI assistant.
            <br />
            Pick a question below and I&apos;ll help you out.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {typing && (
          <div className="chat-bubble bot typing">Smart AI is typing…</div>
        )}
      </div>
      <div className="chat-questions">
        {questions.map((q) => (
          <button
            key={q.id}
            className="chip"
            disabled={typing}
            onClick={() => ask(q)}
          >
            {q.question}
          </button>
        ))}
      </div>
    </div>
  );
}
