
import React, { useState, useRef, useEffect } from "react";

// URL da mascote enviada pelo usuário
const mascotImg = "/lovable-uploads/62e9b834-d6d6-403f-b398-9654f480c00e.png";

// Helper para rolar sempre para a última mensagem
function useAutoScroll(dep: any) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep]);

  return messagesEndRef;
}

type ChatMsg = {
  from: "user" | "bot";
  text: string;
};

const WELCOME_MSG = "Olá! Eu sou o mascote ABELV e posso te ajudar com dúvidas sobre como navegar e usar o sistema. Pergunte como realizar tarefas ou a localização de funcionalidades.";

// Prompt com instruções para o assistente lidar com dúvidas do sistema
const SYSTEM_PROMPT = `
Você é o mascote do sistema chamado ABELV. Seu papel é ajudar os usuários a tirar dúvidas sobre as funcionalidades deste sistema, mostrando o passo a passo e explicando o caminho das telas quando possível. Seja amigável e objetivo. 
Se não souber a resposta, oriente o usuário a buscar o suporte.
Responda preferencialmente em tópicos, se possível.
`;

async function askBot(question: string, history: ChatMsg[]): Promise<string> {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text
      })),
      { role: "user", content: question }
    ];

    // Chamada à edge function para o OpenAI
    const response = await fetch("/edge/generate-with-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: question, messages })
    });
    const data = await response.json();
    return data.generatedText || "Desculpe, não consegui responder sua dúvida.";
  } catch (e) {
    return "Ocorreu um erro ao tentar responder. Tente novamente!";
  }
}

const MascoteChatbot = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: "bot", text: WELCOME_MSG }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useAutoScroll(messages);

  const sendMsg = async () => {
    const question = input.trim();
    if (!question) return;
    setMessages(msgs => [...msgs, { from: "user", text: question }]);
    setInput("");
    setIsSending(true);

    const response = await askBot(question, [
      ...messages,
      { from: "user", text: question }
    ]);
    setMessages(msgs => [...msgs, { from: "bot", text: response }]);
    setIsSending(false);
  };

  // Enviar com enter
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  }

  return (
    <div className="fixed bottom-7 right-5 z-50 w-80 sm:w-96">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-100 px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <img src={mascotImg} alt="" className="h-10 w-10 rounded-full bg-white border" />
            <span className="font-bold text-blue-700">Mascote ABELV</span>
          </div>
          <span className="text-xs font-semibold text-blue-700">Tira-dúvidas</span>
        </div>
        {/* Mensagens */}
        <div className="flex-1 flex flex-col gap-2 px-4 py-3 overflow-y-auto max-h-72" style={{ background: "#f6fafd" }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              {m.from === "bot" && (
                <img
                  src={mascotImg}
                  alt="Mascote"
                  className="w-7 h-7 mr-2 rounded-full bg-white border"
                  style={{ alignSelf: "flex-end" }}
                />
              )}
              <span className={`px-3 py-2 rounded-lg max-w-[75%] leading-relaxed whitespace-pre-line
                ${m.from === "bot"
                  ? "bg-blue-50 text-blue-900"
                  : "bg-blue-600 text-white"}`
              }>
                {m.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className="flex gap-2 items-center border-t bg-white px-3 py-2">
          <input
            type="text"
            className="flex-1 rounded-md px-3 py-2 border border-gray-200 focus:outline-blue-400 text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Digite sua dúvida..."
            disabled={isSending}
          />
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            onClick={sendMsg}
            disabled={isSending || !input.trim()}
            aria-label="Enviar mensagem"
          >
            {isSending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MascoteChatbot;
