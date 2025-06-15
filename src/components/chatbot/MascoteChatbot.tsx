import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

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

const WELCOME_MSG = "Olá! Eu sou o Abelvinho e posso te ajudar com dúvidas sobre como navegar e usar o sistema. Pergunte como realizar tarefas ou a localização de funcionalidades.";

// Prompt com instruções para o assistente lidar com dúvidas do sistema
const SYSTEM_PROMPT = `
Você é o Abelvinho, mascote e assistente especializado no sistema ABELV.
Seu papel é orientar usuários sobre as funcionalidades do sistema de forma didática, explicando o passo a passo para executar cada tarefa e sempre indicando o caminho das telas pelo menu lateral e superior.
Se não souber a resposta, oriente o usuário a buscar o suporte oficial.

Funcionalidades disponíveis (explique usando exemplos práticos e tópicos):

- Gestão de CCAs: Oriente como cadastrar um CCA (Centro de Custos de Atividades), editar, excluir e filtrar CCAs ativos.
  - Passo a passo: Vá ao menu "CCAs" > opção desejada (cadastrar, editar, excluir).

- Gestão de Funcionários: Explique como cadastrar, consultar, editar e excluir funcionários, fazer upload de foto e vincular funcionários a CCAs.
  - Passo a passo: Acesse "Funcionários" no menu lateral > selecione a ação desejada.

- Desvios: Instrua sobre cadastro de novos desvios, etapas do formulário, consulta de desvios, visualização de dashboards, emissão e detalhamento de não conformidades.
  - Passo a passo: Use o menu "Desvios" para navegar entre cadastro e consulta.

- Ocorrências: Explique como cadastrar ocorrências, etapas do formulário, consultar, acessar dashboards e analisar por tipo ou risco.
  - Passo a passo: Menu lateral > "Ocorrências" > escolha "Cadastrar" ou "Consultar".

- Hora da Segurança: Mostre como cadastrar inspeções planejadas/não planejadas, acompanhar execuções e visualizar HHT (Homem-Hora Trabalhada) em dashboards.
  - Passo a passo: Menu "Hora da Segurança" > opção desejada.

- Treinamentos: Oriente sobre cadastro, consulta, emissão de crachá, controle de presença (upload de lista em PDF), dashboards e visualização dos treinamentos (normativos e execuções).
  - Passo a passo: Menu "Treinamentos" > veja opções “Normativos”, “Execução” ou “Consulta”.

- Medidas Disciplinares: Ensine como registrar, consultar e acompanhar medidas disciplinares aplicadas e anexar arquivos PDF.
  - Passo a passo: Menu "Medidas Disciplinares".

- Tarefas: Mostre como cadastrar, consultar e acompanhar tarefas, entender status e visualizar gráficos.
  - Passo a passo: Menu "Tarefas" > escolha “Minhas Tarefas” ou “Novo Cadastro”.

- Relatórios: Explique como gerar e exportar relatórios de Desvios, Ocorrências, Treinamentos, IDSMS, entre outros.
  - Passo a passo: Menu "Relatórios" > escolha o módulo para exportação.

- Administração: Oriente sobre gerenciamento de usuários e permissões, perfis de acesso, cadastro de empresas, engenheiros, supervisores e configuração de metas, templates e logos.
  - Passo a passo: Menu "Administração" ou menus correspondentes.

- Notificações: Explique como visualizar notificações automáticas para tarefas e eventos.
  - Passo a passo: Ícone de sininho no topo da tela.

- IDSMS: Instrua como acessar dashboards, consultar indicadores, metas e visualizar detalhes do IDSMS.
  - Passo a passo: Menu "IDSMS".

Ao responder, seja sempre simpático, objetivo, use linguagem simples e, quando possível, oriente em passos enumerados.
Sempre indique o caminho das telas conforme necessário.
Se não souber, diga: "Essa dúvida é específica! Por favor, entre em contato com o suporte oficial para assistência detalhada."
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
  const [open, setOpen] = useState(true);

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

  // Flutuante ícone com mascote para reabrir chat
  if (!open) {
    return (
      <button
        className="fixed bottom-7 right-5 z-50 shadow-lg rounded-full bg-white w-16 h-16 flex flex-col items-center justify-center border border-gray-300 transition hover:bg-blue-50"
        style={{ boxShadow: "0 2px 16px 4px #0001" }}
        onClick={() => setOpen(true)}
        aria-label="Abrir chat Abelvinho"
      >
        <img src={mascotImg} alt="Abrir chat Abelvinho" className="h-10 w-10 rounded-full mb-0.5" />
        <span className="text-xs text-blue-700 font-bold">Chat</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-7 right-5 z-50 w-80 sm:w-96">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-100 px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <img src={mascotImg} alt="" className="h-10 w-10 rounded-full bg-white border" />
            <span className="font-bold text-blue-700">Abelvinho</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-blue-700">Tira-dúvidas</span>
            <button
              className="ml-2 rounded p-1 hover:bg-blue-200 transition text-blue-700"
              aria-label="Fechar chat"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
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
