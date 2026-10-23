import type { DimensionResult, ScoreResult } from "./score/types";

export interface Playbook {
  slug: string;
  title: string;
  trigger: string;
  goal: string;
  steps: string[];
  script: string[];
  messageTemplate: string;
  successCriteria: string;
  escalateWhen: string;
}

/** Variáveis do modelo de mensagem: {{conta}}, {{csm}}, {{dias}}. */
export const PLAYBOOKS: Playbook[] = [
  {
    slug: "baixa-adocao",
    title: "Baixa adoção",
    trigger: "Adoção abaixo de 50: a conta usa menos de 3 dos 5 módulos.",
    goal: "Levar a conta a usar pelo menos 3 módulos em 30 dias, começando pelo que resolve a dor principal dela.",
    steps: [
      "Abrir a conta e ver quais módulos estão sem uso.",
      "Ligar para o responsável pela frota e perguntar qual tarefa ainda é feita em planilha ou no papel.",
      "Combinar um módulo-alvo (normalmente abastecimento ou manutenção) e marcar 30 minutos de configuração guiada.",
      "Reavaliar o uso em 14 dias e registrar a ação com o resultado.",
    ],
    script: [
      "Abertura: “Vi que vocês usam bem as rotas, mas ainda não o controle de abastecimento. Como vocês fazem isso hoje?”",
      "Descoberta: “Quanto tempo o time perde por semana conferindo nota de combustível?”",
      "Proposta: “Posso configurar com você em 30 minutos, usando 2 veículos de teste. Pode ser quinta?”",
    ],
    messageTemplate:
      "Olá! Aqui é {{csm}}, da Frota Leve. Analisando o uso da {{conta}}, vi que alguns módulos ainda não foram ativados e que eles podem poupar tempo da sua equipe. Podemos marcar 30 minutos para eu configurar com você? Qual dia fica melhor esta semana?",
    successCriteria: "Pelo menos 1 módulo novo com 4 ou mais eventos nos 14 dias seguintes.",
    escalateWhen: "Duas tentativas sem resposta em 10 dias: envolver a liderança de CS.",
  },
  {
    slug: "queda-de-uso",
    title: "Queda de uso",
    trigger: "Volume de uso dos últimos 30 dias abaixo de 70% do período anterior.",
    goal: "Descobrir a causa da queda (mudança de pessoas, sazonalidade, problema técnico) antes que vire cancelamento.",
    steps: [
      "Comparar uso por módulo nos dois últimos períodos e achar onde a queda se concentra.",
      "Checar chamados recentes: a queda pode ser consequência de um problema técnico.",
      "Contatar o responsável com uma pergunta aberta sobre mudanças na operação.",
      "Se houve troca de responsável, oferecer um novo onboarding curto.",
    ],
    script: [
      "Abertura: “Percebi que o uso do sistema caiu nas últimas semanas e queria entender se aconteceu algo na operação.”",
      "Descoberta: “Mudou alguém da equipe? Algum veículo saiu da frota? Teve algum problema que atrapalhou?”",
      "Fechamento: “Posso ajudar com um treinamento rápido para quem entrou?”",
    ],
    messageTemplate:
      "Olá! Aqui é {{csm}}, da Frota Leve. Notei que o uso da {{conta}} diminuiu nas últimas semanas e queria saber se aconteceu algo na operação ou se há algo que eu possa ajudar. Posso te ligar hoje ou amanhã?",
    successCriteria: "Causa identificada e registrada; uso voltando a pelo menos 85% do período anterior em 30 dias.",
    escalateWhen: "A causa é um defeito do produto: acionar o suporte nível 2 e acompanhar até a resolução.",
  },
  {
    slug: "chamados-repetidos",
    title: "Chamados repetidos",
    trigger: "Mais de uma categoria com 2 ou mais chamados em 60 dias, ou chamado crítico aberto.",
    goal: "Resolver a causa raiz e devolver confiança ao cliente, em vez de tratar cada chamado isoladamente.",
    steps: [
      "Listar os chamados da categoria repetida e ler o histórico.",
      "Falar com o suporte para saber se há causa raiz conhecida e prazo de correção.",
      "Ligar para o cliente antes que ele ligue: reconhecer o problema e dar uma data.",
      "Acompanhar até o fechamento e confirmar com o cliente que ficou resolvido.",
    ],
    script: [
      "Abertura: “Vi que vocês abriram mais de um chamado sobre o mesmo ponto e quero garantir que seja resolvido de vez.”",
      "Alinhamento: “A equipe técnica identificou a causa e a previsão é de [prazo]. Vou te avisar assim que estiver no ar.”",
      "Fechamento: “Quando resolver, posso te ligar para confirmar que ficou tudo certo?”",
    ],
    messageTemplate:
      "Olá! Aqui é {{csm}}, da Frota Leve. Acompanhei os chamados recentes da {{conta}} e sei que o problema se repetiu. Já falei com o time técnico e vou te manter informado até a solução definitiva. Posso te ligar para alinhar o prazo?",
    successCriteria: "Nenhum chamado crítico aberto e nenhuma categoria repetida nos 30 dias seguintes.",
    escalateWhen: "Chamado crítico aberto há mais de 3 dias: escalar para a liderança de CS e de suporte.",
  },
  {
    slug: "nps-baixo",
    title: "NPS baixo",
    trigger: "Última nota de NPS de 6 ou menos (detrator), ou queda de 3 pontos ou mais.",
    goal: "Fechar o ciclo com o cliente: entender o motivo da nota, agradecer e comprometer-se com uma ação concreta.",
    steps: [
      "Ler o comentário (se houver) e o histórico de chamados do período da resposta.",
      "Ligar em até 3 dias úteis; não vender nada nessa conversa.",
      "Perguntar o que faria a nota subir e anotar literalmente.",
      "Devolver um compromisso com prazo e registrar o resultado.",
    ],
    script: [
      "Abertura: “Obrigado por responder a pesquisa. Sua nota foi baixa e queria ouvir de você o que podemos melhorar.”",
      "Escuta: “O que mais incomodou? O que faria diferença para vocês?”",
      "Compromisso: “Vou levar isso ao time e te retorno até [data] com o que vamos fazer.”",
    ],
    messageTemplate:
      "Olá! Aqui é {{csm}}, da Frota Leve. Obrigado por responder nossa pesquisa. A nota da {{conta}} me mostrou que temos o que melhorar e queria ouvir de você, sem compromisso, o que mais pesou. Tem 10 minutos nesta semana?",
    successCriteria: "Conversa realizada em até 3 dias úteis, compromisso registrado e próxima pesquisa com nota maior ou igual.",
    escalateWhen: "Cliente fala em cancelar: avisar a liderança de CS no mesmo dia.",
  },
  {
    slug: "renovacao-proxima",
    title: "Renovação próxima",
    trigger: "Renovação em 90 dias ou menos (ou contrato vencido).",
    goal: "Conduzir a renovação com antecedência, com conversa de valor entregue e sem surpresas de preço.",
    steps: [
      "Preparar um resumo do que a conta usou e dos problemas resolvidos no contrato.",
      "Marcar reunião de renovação com 60 dias de antecedência.",
      "Apresentar valor entregue, ajuste de plano (se a frota mudou) e condições.",
      "Registrar objeções e enviar a proposta por escrito no mesmo dia.",
    ],
    script: [
      "Abertura: “Seu contrato renova em {{dias}} dias e quis conversar antes, para ajustar o plano ao tamanho atual da frota.”",
      "Valor: “Nos últimos meses vocês [resultado]. Quero garantir que isso continue.”",
      "Fechamento: “Posso te enviar a proposta hoje e marcamos a decisão na semana que vem?”",
    ],
    messageTemplate:
      "Olá! Aqui é {{csm}}, da Frota Leve. O contrato da {{conta}} renova em {{dias}} dias. Gostaria de revisar com você o que a plataforma entregou e ajustar o plano à frota atual. Qual horário funciona para uma reunião de 20 minutos?",
    successCriteria: "Reunião realizada até 60 dias antes do vencimento e proposta enviada.",
    escalateWhen: "Cliente pede desconto acima da alçada do CSM: levar a liderança de CS para a negociação.",
  },
];

export const getPlaybook = (slug: string): Playbook | undefined => PLAYBOOKS.find((p) => p.slug === slug);

export function fillTemplate(text: string, vars: { conta: string; csm: string; dias: number }): string {
  return text.replaceAll("{{conta}}", vars.conta).replaceAll("{{csm}}", vars.csm).replaceAll("{{dias}}", String(Math.max(0, Math.round(vars.dias))));
}

const dim = (r: ScoreResult, d: DimensionResult["dimension"]) => r.dimensions.find((x) => x.dimension === d);

/** Regras de recomendação (documentadas em docs/02-definicao/regras-de-negocio.md, RN-12). */
export function recommendPlaybooks(result: ScoreResult, daysToRenewal: number): Playbook[] {
  const slugs: string[] = [];
  const adoption = dim(result, "adoption");
  if (adoption && adoption.value !== null && adoption.value < 50) slugs.push("baixa-adocao");
  const engagement = dim(result, "engagement");
  if (engagement && engagement.value !== null && (engagement.meta.usageRatio ?? 1) < 0.7 && (engagement.meta.volumePrevious ?? 0) > 0) slugs.push("queda-de-uso");
  const support = dim(result, "support");
  if (support && ((support.meta.repeatedCategories ?? 0) >= 1 || (support.meta.openHigh ?? 0) >= 1 || (support.meta.recentTickets ?? 0) >= 3)) slugs.push("chamados-repetidos");
  const sat = dim(result, "satisfaction");
  if (sat && sat.value !== null && ((sat.meta.latestNps ?? 10) <= 6 || (sat.meta.npsDelta ?? 0) <= -3)) slugs.push("nps-baixo");
  if (daysToRenewal <= 90) slugs.push("renovacao-proxima");
  return slugs.map((s) => getPlaybook(s) as Playbook);
}
