
import React from 'react';
import type { ComponentData, SimulationStep } from './types';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-12 h-12 mb-4 text-cyan-400">{children}</div>
);

export const COMPONENTS_DATA: ComponentData[] = [
  {
    id: 'phone',
    title: '1. The Phone System',
    description: "The 'Front Door'. It provides the phone number, answers calls, and manages audio streams.",
    examples: 'Twilio, Amazon Connect, Vonage API',
    icon: (
      <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-1 col-end-3 row-start-1',
    details: {
      pmTask: "Procure a phone number and a service plan. Define the initial call routing rules.",
      challenges: [
        "Ensuring low latency and high audio quality.",
        "Handling dropped calls and network issues gracefully.",
        "Managing costs for telephony services at scale.",
      ],
    },
  },
  {
    id: 'stt',
    title: '2. The Ears (STT)',
    description: "'Speech-to-Text'. Transcribes raw audio from the call into written text in real-time.",
    examples: 'Google Cloud STT, Azure Speech',
    icon: (
      <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 7.5v-1.5a6 6 0 0 0-6-6v-1.5a6 6 0 0 0-6 6v1.5m6 7.5h.75a6 6 0 0 0 6-6v-1.5M12 12.75v-1.5a6 6 0 0 0-6-6v-1.5a6 6 0 0 0-6 6v1.5m6 7.5h-.75a6 6 0 0 1-6-6v-1.5" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-1 col-end-3 row-start-3',
    details: {
      pmTask: "Ensure the STT service is accurate for your customers' accents and terminology. Monitor its performance.",
      challenges: [
        "Maintaining accuracy with diverse accents, dialects, and terminology.",
        "Effectively handling background noise and poor audio quality.",
        "Minimizing real-time transcription latency.",
      ],
    },
  },
  {
    id: 'brain',
    title: '3. The Brain (AI Agent)',
    description: 'The core intelligence. Understands intent, makes decisions, and formulates a text response.',
    examples: 'Google Gemini, OpenAI GPT-4',
    icon: (
       <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L12 5.25l2.846 2.846a4.5 4.5 0 0 1 3.09 3.09L21.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09L12 18.75l-2.187-2.846Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12h.008v.008h-.008V12Z" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-3 col-end-5 row-start-2',
    details: {
        pmTask: "Constantly refine the instructions and examples in AI Studio to improve the agent's performance, tone, and accuracy.",
        challenges: [
          "Preventing AI 'hallucinations' and ensuring factual accuracy.",
          "Maintaining a consistent tone and brand voice across conversations.",
          "Managing complex, multi-turn conversation states effectively.",
        ],
      },
  },
  {
    id: 'memory',
    title: '4. The Memory (Data & APIs)',
    description: "The AI's connection to company info. Looks up orders, checks stock, and accesses knowledge bases.",
    examples: 'Salesforce CRM, Customer DBs',
    icon: (
      <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-5 col-end-7 row-start-2',
    details: {
        pmTask: "Define exactly what information the AI needs access to. Work with the technical team to ensure data connections are fast, reliable, and secure.",
        challenges: [
          "Ensuring data security and privacy (e.g., PII compliance).",
          "Dealing with API rate limiting, latency, and reliability from external systems.",
          "Keeping data synchronized and consistent in real-time.",
        ],
      },
  },
  {
    id: 'tts',
    title: '5. The Voice (TTS)',
    description: "'Text-to-Speech'. Converts the AI's text response into natural-sounding audio.",
    examples: 'Google Cloud TTS, ElevenLabs',
    icon: (
       <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-7 col-end-9 row-start-1',
    details: {
        pmTask: "Select a voice that aligns with the company's brand identity. Ensure correct pronunciation of company-specific terms.",
        challenges: [
          "Achieving natural-sounding prosody, intonation, and emotional expression.",
          "Correctly pronouncing jargon, acronyms, or unique brand names.",
          "Minimizing audio generation latency ('time to first byte').",
        ],
      },
  },
  {
    id: 'conductor',
    title: '6. The Conductor',
    description: 'The master controller. Manages the conversation flow between all other components.',
    examples: 'Custom Application Logic',
    icon: (
       <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5 3 11.25l3.75 3.75M17.25 7.5 21 11.25l-3.75 3.75M12 19.5V4.5" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-3 col-end-7 row-start-4',
    details: {
        pmTask: "Design the end-to-end workflow, including error handling, retries, and escalation paths. Define the step-by-step process from 'hello' to 'goodbye'.",
        challenges: [
          "Managing asynchronous operations and timing between all components.",
          "Implementing complex error handling and graceful fallback logic.",
          "Maintaining state and context across the entire call duration.",
        ],
      },
  },
  {
    id: 'human',
    title: '7. The Human Backup',
    description: "The 'Safety Net'. Escalates the call to a human agent if the AI gets stuck or is requested.",
    examples: 'Live Agent Transfer',
    icon: (
       <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </IconWrapper>
    ),
    gridClass: 'col-start-7 col-end-9 row-start-3',
    details: {
        pmTask: "Define the rules for escalation. When should the AI give up and transfer? How should the human agent be briefed on the conversation so far?",
        challenges: [
          "Achieving a seamless, context-aware call handoff with no dropped info.",
          "Training human agents on how to effectively collaborate with the AI system.",
          "Defining clear, unambiguous triggers for when to escalate.",
        ],
      },
  },
];

export const SIMULATION_STEPS: SimulationStep[] = [
    { activeComponents: ['phone'], activeConnectors: [], description: 'Customer calls the phone number...', startTime: 0, duration: 1000 },
    { activeComponents: ['stt'], activeConnectors: ['phone-stt'], description: 'Audio is streamed to Speech-to-Text...', startTime: 1000, duration: 1000 },
    { activeComponents: ['conductor'], activeConnectors: ['stt-conductor'], description: 'Transcribed text is sent to the Conductor...', startTime: 2000, duration: 1000 },
    { activeComponents: ['brain'], activeConnectors: ['conductor-brain'], description: 'Conductor passes the text to the AI Brain...', startTime: 3000, duration: 1000 },
    { activeComponents: ['conductor', 'memory'], activeConnectors: ['brain-conductor', 'conductor-memory'], description: 'Brain needs info, asks Conductor to query Memory...', startTime: 4000, duration: 1500 },
    { activeComponents: ['conductor', 'brain'], activeConnectors: ['memory-conductor', 'conductor-brain'], description: 'Memory returns data to Brain via Conductor...', startTime: 5500, duration: 1500 },
    { activeComponents: ['conductor'], activeConnectors: ['brain-conductor'], description: 'Brain formulates a response and sends to Conductor...', startTime: 7000, duration: 1000 },
    { activeComponents: ['tts'], activeConnectors: ['conductor-tts'], description: 'Conductor sends text response to Text-to-Speech...', startTime: 8000, duration: 1000 },
    { activeComponents: ['phone'], activeConnectors: ['tts-phone'], description: 'Audio is played back to the customer...', startTime: 9000, duration: 1000 },
    { activeComponents: ['human'], activeConnectors: ['conductor-human'], description: 'If needed, Conductor can escalate to a human agent.', startTime: 10000, duration: 1500 },
];

export const TOTAL_DURATION = 11500;
