
// Service to ask GPT (edge function) with system instruction for ABELV bot
export async function askMascoteBot({ question, history }: {
  question: string;
  history: { from: "user" | "bot", text: string }[];
}) {
  const SYSTEM_PROMPT = `
Você é o mascote do sistema chamado ABELV. Seu papel é ajudar os usuários a tirar dúvidas sobre as funcionalidades deste sistema, mostrando o passo a passo e explicando o caminho das telas quando possível. Seja amigável e objetivo. 
Se não souber a resposta, oriente o usuário a buscar o suporte.
Responda preferencialmente em tópicos, se possível.
`;
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text
    })),
    { role: "user", content: question }
  ];

  const response = await fetch("/edge/generate-with-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: question, messages })
  });
  const data = await response.json();
  return data.generatedText || "Desculpe, não consegui responder sua dúvida.";
}
