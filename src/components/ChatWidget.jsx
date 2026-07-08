import { useState, useRef, useEffect } from 'react';
import RippleButton from './RippleButton';

const MOCK_AI_RESPONSES = [
  { keywords: ['hello', 'hi', 'hey', 'start'], reply: "Hello! I am CareBot, your CareConnect support virtual assistant. How can I help you today? You can ask me about symptoms, booking appointments, buying medicines, or finding laboratory tests." },
  { keywords: ['pain', 'hurt', 'headache', 'fever', 'cough', 'cold'], reply: "I'm sorry to hear that you're feeling unwell. For mild symptoms, you can check our Medicine Store for common relief like Paracetamol or Cetirizine. However, if symptoms persist, I highly recommend booking an appointment with one of our featured doctors." },
  { keywords: ['doctor', 'book', 'appointment', 'consult', 'specialist'], reply: "You can book an appointment with our specialists in just a few clicks! Head over to our Doctors page, select a specialist (e.g., Dr. Maya Chen in Cardiology or Dr. Imran Patel in Pediatrics), click 'Book Appointment', and choose your preferred date and slot." },
  { keywords: ['medicine', 'pharmacy', 'pill', 'tablet', 'prescription'], reply: "We stock common prescription and over-the-counter medicines. Visit our Medicine Store page to browse categories, read dosage instructions, add items to your cart, and check out securely." },
  { keywords: ['lab', 'test', 'blood', 'screening', 'scan'], reply: "We offer comprehensive health checks! Go to our Lab Tests page to view available tests (like Lipid Panel, Complete Blood Count, or Thyroid Panel) and book them online." },
  { keywords: ['emergency', 'ambulance', 'hospital', 'urgent', 'police', 'blood bank'], reply: "If this is a medical emergency, please DO NOT wait! Call emergency services immediately. Go to our Emergency page for direct contacts for Ambulance, Blood Banks, and nearby hospitals." }
];

const DEFAULT_REPLY = "Thank you for reaching out. I've noted your query. To get direct medical guidance, you can search our Doctors list and book an online consultation. For general questions, you can also write to us via our Contact Page.";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm CareBot, your virtual assistant. How can I help you today?", isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg = { id: Date.now(), text: userText, isBot: false, time: timeString };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate bot thinking
    setTimeout(() => {
      let botReply = DEFAULT_REPLY;
      const cleanText = userText.toLowerCase();

      for (const response of MOCK_AI_RESPONSES) {
        if (response.keywords.some((keyword) => cleanText.includes(keyword))) {
          botReply = response.reply;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botReply, isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 750);
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Toggle Button */}
      <button className="chat-trigger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Support Chat">
        {isOpen ? (
          <span className="chat-icon">✕</span>
        ) : (
          <span className="chat-icon">💬</span>
        )}
        {!isOpen && <span className="chat-badge">1</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-avatar">🤖</div>
            <div>
              <h3>CareBot Support</h3>
              <span className="chat-status">Online • AI Assistant</span>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.isBot ? 'bot' : 'user'}`}>
                <div className="message-bubble">{msg.text}</div>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="chat-input"
            />
            <RippleButton type="submit" className="chat-send-btn">
              Send
            </RippleButton>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
