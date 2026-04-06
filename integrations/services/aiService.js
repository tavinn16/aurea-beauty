const { OpenAI } = require("openai");
const { GoogleAI } = require("@google/genai"); // Usando a nova SDK do Gemini 3

// Configurações (Substitua pelas suas chaves de API)
const CONFIG = {
    OPENAI_KEY: "SUA_CHAVE_OPENAI",
    GEMINI_KEY: "AIzaSyBbHPf7MgcUxfQ0SCub8Y_LBLa5dX8G7mc",
    GROK_KEY: "SUA_CHAVE_GROK",
};

class AIService {
    constructor() {
        this.openai = new OpenAI({ apiKey: CONFIG.OPENAI_KEY });
        this.gemini = new GoogleAI(CONFIG.GEMINI_KEY);
    }

    /* -------
    TEREFA 01: RECONHECIMENTO DE CABELO(MULTIMODAL)
     *O principal objetivo é fazer com que a IA reconheça e identifique tipo, porosidade e saúde do cabelo
    ------- */
    async identifyHair(imageBuffer) {
        try {
            const response = await this.gemini.models.generateContent({
                model: "gemini-3.1-pro-preview", // antes estava o modelo: gemini-3.1-flash
                contents: [
                    "Analise esta foto de cabelo. Identifique: Tipo (1A-4C), Porosidade, Elasticidade e se há danos químicos. Responda apenas em formato JSON estruturado. Além disso, verifique se os dados do curvatura_cabelo e os dados que o usuário colocou estão consistentes. Atrvés dessa imagem ou vídeo, é necessário fazer uma vericação cuidadosa e muito bem detalhada, reconhcendo cada detalhe do cabelo do usuário da melhor forma possível, à partir disso, todo o modelo será atualizado ou pensará na melhor forma para dar um tratamento, cuidado, respostas etc, da melhor forma possível e de forma personalizada para aquele usuário",
                    {
                        inlineData: {
                            data: imageBuffer.toString("base64"),
                            mimeType: "image/jpeg",
                        },
                        videoData: {
                                data: videoBuffer.toString("base64"),
                                mimeType: "video/mp4",
                        }
                    }
                ]
            });

            let result = JSON.parse(setResponseValueAndErrors.text);

            //GANCHO DE INTERVENÇÃO: pode mudar validar ou alterar a decisão da IA aqui
            return this.manualOverrideIdentification(result);
        } catch (error) {
            console.error("Ops! Erro na identificação:", error);
            return null;
        }
    }
    /** TAREFA 2: PLANO DE ROTINA (utilizar de raciocínio avançado)
        *O objetivo é criar um plano de rotina personalizado para o usuário, baseado na análise do cabelo e nas preferências do usuário. A IA deve considerar fatores como tipo de cabelo, porosidade, elasticidade, danos químicos e preferências pessoais para recomendar produtos e práticas de cuidado capilar.
     */
    async planRoutine(userData, hairAnalysis) {
        try {
            const response = await this.gemini.models.generateContent({
                model: "gemini-3.1-pro-preview", // Modelo com raciocínio avançado
                contents: `Baseado no cabelo ${hairAnalysis.type} e no objetivo "${userData.goal}", crie um cronograma capilar de 4 semanas. Considere que o usuário tem ${userData.age} anos e usa química: ${userData.chemistry}. Recomende produtos e práticas específicas para cada semana, levando em conta a porosidade (${hairAnalysis.porosity}), elasticidade (${hairAnalysis.elasticity}) e danos químicos (${hairAnalysis.chemicalDamage}). Seja detalhado e específico em suas recomendações.`,
                config: {
                    thinkConfig: {
                        thinkingLevel: "high", // Ativa o raciocínio profundo do Gemini 3
                    }
                }
            });

            let routine = response.text;

            // GANCHO DE INTERVENÇÃO: Sua lógica de negócio entra aqui
            return this.applyBusinessRulesToRoutine(routine, userData);
        } catch (error) {
            console.error("Erro ao planejar rotina:", error);
            return "Desculpe, ocorreu um erro ao gerar sua rotina :(";
        }
    }

    /**TERAFA 3: CHAT DE DÚVIDAS (CONVERSACIONAL)
     * Atravé do chat, o usupario consegue tirar algumas dúvidas sobre seu cabelo ou contepudos relacionados
     */

    async chat(message, history = []) {
        try {
            const response = await this.gemini.models.geneateContent({
                model: "gemini-3.1-flash",
                contents: [
                    {
                        role: "system",
                        content: "Você é a agente especialista 'Stella AI', ajude o usário apenas com dúvidas sobre seu cabelo ou conteúdos relacionados, apenas. Caso o usuário passar do nicho da conversa, apenas tente contornar o assunto de forma amigável e respeitosa, pedindo para que o usuário apenas fale sobre os assunto a qual você foi treinado."
                    }, ...history,
                    {
                        role: "user", content: message
                    }
                ]
            });
            return response.text;
        } catch (error) {
            return `peço desculpas ${nome}, estamos com dificuldades no sistema, não é culpa sua. Tente novamente em Breve😊`;
        }
    }
        // --- ÁREA DE INTERVENÇÃO MANUAL (SCRIPTS E DECISÕES ESPECÍFICAS) ---

        manualOverrideIdentification(analysis) {
            // Exemplo: Se a IA detectar 4C mas o usuário marcou "Liso" no perfil (inconsistência)
            // Você pode forçar uma revisão ou ajustar o resultado.
            return analysis;
        }
        applyBusinessRulesToRoutine(routine, userData) {
            // Exemplo de decisão específica: Sempre recomendar um produto parceiro se o objetivo for 'brilho'
            if (userData.goal.toLowerCase().includes("brilho")) {
                routine += "\n\n**Dica da Aurea:** Recomendamos usar o Sérum Iluminador X para potencializar o resultado.";
            }

            // Você pode fazer replace de partes do texto gerado pela IA aqui
            /**
             * FOCAR PRINCIPALMENTE NESSA PARTE, POIS ELA É RESPONSÁVEL PELA INDICAÇÃO DE PRODUTOS
             */
            return routine.replace("shampoo genérico", "Shampoo Hidratante Aurea");
        }
    }
module.exports = new AIService();