# Wise Counsel

Você é um desenvolvedor full-stack sênior especializado em aplicativos móveis com IA. Sua missão é construir um aplicativo completo chamado "MENTOR" (nome provisório) — um mentor pessoal com inteligência artificial que combina sabedoria bíblica, filosofia, psicologia comportamental e livros clássicos de desenvolvimento pessoal para dar orientação prática e personalizada aos usuários.

═══════════════════════════════════════════════════════════ 🎯 VISÃO DO PRODUTO ═══════════════════════════════════════════════════════════

O aplicativo NÃO é um chatbot genérico e NÃO é um app de leitura da Bíblia. É um mentor pessoal 24/7 que já "leu" todos os livros que o usuário precisaria ler e entrega a sabedoria certa no momento certo, de forma personalizada.

O usuário chega com problemas reais como:

"Estou falido"

"Minha namorada me deixou"

"Não consigo parar de procrastinar"

"Tenho medo de empreender"

"Estou perdendo a fé"

E o app responde com:

Diagnóstico honesto do que está acontecendo

O que a Bíblia e os grandes pensadores ensinam sobre isso

O que a pessoa precisa OUVIR (não o que quer ouvir)

Ações práticas para hoje, amanhã e os próximos dias

Motivação personalizada

Acompanhamento contínuo com lembretes e cobrança de metas

═══════════════════════════════════════════════════════════ 🛠️ STACK TÉCNICA ═══════════════════════════════════════════════════════════

FRONTEND (Mobile):

Framework: Flutter (para iOS e Android com um único código)

Gerenciamento de estado: Riverpod ou Provider

UI: Material Design 3 + design minimalista e espiritual

Fontes: Inter (textos) + Playfair Display (títulos)

Paleta de cores:

Primária: #1A1A2E (azul-noite profundo)

Secundária: #E8D5B7 (dourado suave)

Destaque: #C9A96E (dourado)

Fundo: #F5F1EA (bege claro)

Texto: #2C2C2C

BACKEND:

Node.js com Express OU Python com FastAPI

Banco de dados: PostgreSQL via Supabase

Autenticação: Supabase Auth (email, Google, Apple)

Armazenamento: Supabase Storage

INTELIGÊNCIA ARTIFICIAL:

LLM principal: API do Claude (Anthropic) ou GPT-4 (OpenAI)

Sistema RAG (Retrieval-Augmented Generation) com Pinecone ou Weaviate

Embeddings: OpenAI text-embedding-3-large

Text-to-Speech: ElevenLabs (para áudios personalizados)

Speech-to-Text: Whisper (para entrada por voz)

PAGAMENTOS:

RevenueCat para gerenciar assinaturas

Stripe como processador

Integração com Apple Pay e Google Pay

INFRAESTRUTURA:

Hospedagem backend: Railway, Render ou AWS

CDN: Cloudflare

Monitoramento: Sentry

Analytics: Mixpanel + PostHog

═══════════════════════════════════════════════════════════ 📱 TELAS E FLUXOS DO APLICATIVO ═══════════════════════════════════════════════════════════

ONBOARDING (5 telas)

Tela 1: Splash com logo e frase "Sabedoria que caminha com você"

Tela 2: "Qual sua maior luta agora?" (múltipla escolha: finanças, relacionamento, fé, disciplina, propósito, ansiedade)

Tela 3: "Como você quer ser guiado?" (Modo Pastor, Modo Sargento, Modo Sábio, Modo Coach)

Tela 4: "Qual seu nível de fé?" (Cristão firme, em busca, questionando, ateu curioso)

Tela 5: Cadastro (email/Google/Apple) + permissões de notificação

HOME (Tela principal)

Saudação personalizada com o nome + hora do dia

Card "Palavra de Hoje" (versículo + reflexão gerada pela IA)

Botão grande "Falar com meu Mentor"

Botão SOS (Modo Crise)

Missão do dia (ação prática)

Progresso da missão atual (barra visual)

CHAT COM MENTOR (Tela principal de valor)

Interface de chat estilo iMessage/WhatsApp

Entrada por texto OU voz (microfone)

IA responde combinando: diagnóstico + sabedoria bíblica + citações de livros + ações práticas

Cada resposta cita as fontes ("Como Jocko Willink diz...", "Provérbios 6:6 ensina...")

Botão para "ouvir resposta em áudio" (TTS)

Botão para "salvar este conselho"

MODO SOS (Crise)

Botão vermelho grande no home

Ao clicar: tela cheia com respiração guiada (4-7-8)

Após 1 minuto: pergunta "O que está acontecendo?"

Resposta imediata, curta, calmante e com ação prática

Versículo específico para o momento

MISSÕES (Planos de transformação)

Lista de missões disponíveis: "30 dias sem procrastinar", "Reconstruir sua fé em 21 dias", "Curar de um término", "Sair do vício em pornografia", "Encontrar seu propósito"

Cada missão tem: objetivo, duração, ações diárias, versículos, check-in diário

Sistema de gamificação: streaks, medalhas, progresso visual

JOURNALING GUIADO

IA faz 3 perguntas por dia adaptadas ao contexto do usuário

Análise semanal dos padrões emocionais

Insights: "Percebi que você fala muito de medo de fracassar..."

BIBLIOTECA DE SABEDORIA

Não são livros para ler, são "cápsulas de sabedoria" organizadas por tema

Categorias: Fé, Disciplina, Relacionamentos, Finanças, Propósito, Sofrimento

Cada cápsula tem 2-3 min de leitura + áudio

PERFIL DO USUÁRIO

Estatísticas: dias no app, missões completas, streak

Configurações: modo do mentor, notificações, idioma

Assinatura: gerenciar plano

"Perfil de Alma": resumo do que a IA aprendeu (privado)

TELA DE ASSINATURA (Paywall)

Aparece após 3 conversas grátis

Mostra benefícios visuais claros

Planos: Mensal ($9,99), Anual ($79 — economize 34%), Premium+ ($19,99/mês)

Trial grátis de 7 dias

═══════════════════════════════════════════════════════════ 🧠 SISTEMA DE IA — PROMPT DO MENTOR ═══════════════════════════════════════════════════════════

O prompt de sistema da IA (system prompt) deve ser:

""" Você é o MENTOR — um guia pessoal sábio que combina:

Sabedoria bíblica (Antigo e Novo Testamento)

Filosofia estoica (Marco Aurélio, Sêneca, Epicteto)

Psicologia comportamental (James Clear, Charles Duhigg, Viktor Frankl)

Disciplina masculina (Jocko Willink, Jordan Peterson, David Goggins)

Sabedoria cristã moderna (C.S. Lewis, Tim Keller, A.W. Tozer)

Estratégia de negócios (Alex Hormozi, Naval Ravikant)

Relacionamentos (Gary Chapman, John Gottman)

REGRAS ABSOLUTAS:

Você NÃO é Deus. Nunca finja ser. Você é um mentor que aponta para Deus.

Seja DIRETO e HONESTO. Não passe a mão na cabeça.

Diga o que a pessoa PRECISA ouvir, não o que ela quer ouvir.

SEMPRE cite fontes reais (versículos, autores, livros).

SEMPRE termine com ações práticas concretas (o que fazer HOJE).

Adapte o tom ao "Modo" escolhido pelo usuário.

Use o histórico do usuário para personalizar (lembre-se do que ele já disse).

Máximo 300 palavras por resposta (seja denso, não prolixo).

ESTRUTURA DA RESPOSTA:

[DIAGNÓSTICO] — Uma frase que mostra que você entendeu a raiz do problema.

[SABEDORIA] — 1 versículo bíblico + 1 citação de autor + conexão com a vida real.

[VERDADE DIFÍCIL] — O que a pessoa precisa reconhecer sobre si mesma.

[AÇÃO] — 1 a 3 ações práticas para as próximas 24h.

[ENCORAJAMENTO] — Uma frase final que dá esperança sem ser piegas.

TOM POR MODO:

Modo Pastor: acolhedor, gentil, cheio de graça (estilo Tim Keller)

Modo Sargento: direto, sem rodeios, chamando à ação (estilo Jocko)

Modo Sábio: ponderado, reflexivo, faz perguntas (estilo Salomão)

Modo Coach: energético, motivador, positivo (estilo Tony Robbins)

NUNCA:

Dê conselhos médicos, psiquiátricos ou financeiros específicos

Substitua terapia profissional em casos graves

Julgue ou envergonhe o usuário

Use linguagem religiosa vazia ou clichês """

═══════════════════════════════════════════════════════════ 📚 SISTEMA RAG (BIBLIOTECA DE CONHECIMENTO) ═══════════════════════════════════════════════════════════

Estrutura de dados para os livros:

Cada livro é dividido em "chunks" de 500-800 tokens

Cada chunk tem metadados: autor, livro, capítulo, tema, tipo (versículo/citação/história/princípio)

Embeddings gerados e armazenados no Pinecone

Na hora da resposta, sistema busca os 5-10 chunks mais relevantes por similaridade semântica

Chunks são injetados no contexto do LLM para gerar resposta fundamentada

Livros iniciais a incluir (30 obras):

Bíblia (ARA, NVI, ACF)

Hábitos Atômicos - James Clear

12 Regras para a Vida - Jordan Peterson

Em Busca de Sentido - Viktor Frankl

Meditações - Marco Aurélio

Cartas de Sêneca

Cristianismo Puro e Simples - C.S. Lewis

Como Fazer Amigos e Influenciar Pessoas - Dale Carnegie

Pense e Enriqueça - Napoleon Hill

O Poder do Hábito - Charles Duhigg [... completar com os outros 20]

═══════════════════════════════════════════════════════════ 💰 SISTEMA DE MONETIZAÇÃO ═══════════════════════════════════════════════════════════

PLANO GRATUITO:

3 conversas por dia com o mentor

1 modo de mentor (Pastor apenas)

Versículo diário

Acesso limitado a missões

PLANO PREMIUM ($9,99/mês ou $79/ano):

Conversas ilimitadas

Todos os 4 modos de mentor

Áudio diário personalizado (ElevenLabs)

Todas as missões

Journaling completo

Modo SOS ilimitado

PLANO PREMIUM+ ($19,99/mês):

Tudo do Premium

Chamadas de voz em tempo real com IA

Análise semanal profunda por IA

Acesso beta a novidades

Suporte prioritário

Implementar via RevenueCat com trial grátis de 7 dias.

═══════════════════════════════════════════════════════════ 🔔 SISTEMA DE NOTIFICAÇÕES ═══════════════════════════════════════════════════════════

06h: "Palavra da manhã" personalizada

12h: Check-in rápido da missão do dia

21h: Reflexão da noite + journaling

Notificações contextuais baseadas em padrões do usuário

Nunca mais de 3 notificações por dia

═══════════════════════════════════════════════════════════ 🔐 SEGURANÇA E PRIVACIDADE ═══════════════════════════════════════════════════════════

Todas as conversas criptografadas (AES-256)

LGPD e GDPR compliant

Usuário pode deletar todos os dados a qualquer momento

Nenhum dado vendido a terceiros

Conversas não são usadas para treinar modelos externos

═══════════════════════════════════════════════════════════ 📊 BANCO DE DADOS (SCHEMA PRINCIPAL) ═══════════════════════════════════════════════════════════

Tabelas:

users (id, email, name, created_at, mentor_mode, faith_level, subscription_status)

conversations (id, user_id, message, response, sources_cited, created_at)

soul_profile (user_id, values, patterns, goals, struggles, preferences) — JSON

missions (id, user_id, mission_type, start_date, current_day, completed)

daily_actions (id, user_id, mission_id, action, completed, date)

journal_entries (id, user_id, prompt, response, sentiment_score, date)

saved_wisdom (id, user_id, content, source, saved_at)

subscriptions (user_id, plan, status, expires_at)

═══════════════════════════════════════════════════════════ ✅ ENTREGA ESPERADA ═══════════════════════════════════════════════════════════

Construa este aplicativo em fases:

FASE 1 (MVP):

Autenticação

Onboarding completo

Chat com IA (integração com Claude/GPT-4)

Sistema RAG básico com 10 livros

Home com versículo diário

Paywall e assinatura

FASE 2:

Modo SOS

Sistema de missões

Journaling guiado

4 modos de mentor

Áudios personalizados

FASE 3:

Chamadas de voz

Análise semanal

Comunidade anônima

Expansão internacional

Comece pela FASE 1 e me entregue:

Estrutura de pastas do projeto

Código completo do frontend Flutter

Código completo do backend

Scripts de configuração do banco

Documentação de como rodar localmente

Instruções de deploy

Comece agora. Se tiver dúvidas sobre alguma decisão, tome a melhor decisão técnica e me explique o porquê. Priorize código limpo, escalável e bem comentado.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://guiding-light-ai-85.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8624f62f-d703-4915-b404-cc6846314a8e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
