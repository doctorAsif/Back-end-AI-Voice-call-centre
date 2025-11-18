import os
import asyncio
import json
import websockets
import httpx
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from backend.knowledge import load_knowledge_base
from twilio.rest import Client
from pydantic import BaseModel

load_dotenv()
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")

try:
    genai.configure(api_key=GOOGLE_API_KEY)
    VECTOR_DB = load_knowledge_base()
    EMBEDDING_MODEL = 'models/embedding-001' # <-- THE FIX!
    GENERATION_MODEL = genai.GenerativeModel('gemini-2.0-flash')
    print(f"🧠 Brain Ready: {len(VECTOR_DB)} knowledge vectors loaded.")
except Exception as e:
    print(f"❌ FATAL ERROR: Could not load models or DB: {e}")
    exit()

CONVERSATION_HISTORY = []
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def find_relevant_context(question_embedding, top_k=3):
    """Finds the most relevant text chunks from the vector database."""
    if not VECTOR_DB:
        return ["No knowledge base loaded."]
        
    question_embedding = np.array(question_embedding)
    
    doc_embeddings = [np.array(doc_vec) for _, doc_vec in VECTOR_DB]
    
    similarities = [np.dot(question_embedding, doc_vec) / (np.linalg.norm(question_embedding) * np.linalg.norm(doc_vec)) for doc_vec in doc_embeddings]
    
    top_k_indices = np.argsort(similarities)[-top_k:][::-1]
    return [VECTOR_DB[i][0] for i in top_k_indices]

def get_voice_model(lang_code):
    if lang_code.startswith("bn"): return "aura-aarav-bn-in"
    elif lang_code.startswith("ar"): return "aura-samir-ar-xa"
    else: return "aura-asteria-en"

async def text_to_speech(text, lang_code):
    model = get_voice_model(lang_code)
    print(f"🗣️ Speaking ({model}): \"{text[:50]}...\"")
    url = f"https://api.deepgram.com/v1/speak?model={model}"
    headers = {"Authorization": f"Token {DEEPGRAM_API_KEY}", "Content-Type": "application/json"}
    async with httpx.AsyncClient() as client:
        async with client.stream("POST", url, headers=headers, json={"text": text}) as response:
            async for chunk in response.aiter_bytes():
                yield chunk

@app.websocket("/ws/audio")
async def audio_websocket(websocket: WebSocket):
    await websocket.accept()
    print("🔌 Client connected")
    global CONVERSATION_HISTORY
    CONVERSATION_HISTORY = [] 
    deepgram_url = "wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&detect_language=true"
    try:
        async with websockets.connect(deepgram_url, additional_headers={"Authorization": f"Token {DEEPGRAM_API_KEY}"}) as dg_socket:
            async def sender():
                try:
                    while True: await dg_socket.send(await websocket.receive_bytes())
                except: pass
            async def receiver():
                try:
                    async for msg in dg_socket:
                        res = json.loads(msg)
                        if res.get("is_final") and res["channel"]["alternatives"][0]["transcript"]:
                            await process_llm_response(websocket, res["channel"]["alternatives"][0]["transcript"], res["channel"]["detected_language"])
                except: pass
            await asyncio.gather(sender(), receiver())
    except: pass

async def process_llm_response(websocket: WebSocket, user_text: str, lang_code: str):
    print(f"🎤 User ({lang_code}): {user_text}")
    await websocket.send_text(json.dumps({"type": "user_text", "content": user_text}))
    CONVERSATION_HISTORY.append(f"User: {user_text}")
    
    try:
        question_embedding = genai.embed_content(
            model=EMBEDDING_MODEL, # <-- Using the correct model
            content=user_text,
            task_type="retrieval_query"
        )['embedding']
        
        relevant_context = find_relevant_context(question_embedding)
        context_str = "\n\n".join(relevant_context)
        print(f"📚 Found {len(relevant_context)} relevant docs.")

        history_text = "\n".join(CONVERSATION_HISTORY[-10:])
        system_prompt = f"""
        You are an expert consultant. Answer ONLY in the user's language ({lang_code}).
        Use ONLY the KNOWLEDGE BASE below. If the answer isn't there, say "I am not familiar with that" in {lang_code}.

        --- KNOWLEDGE BASE ---
        {context_str}
        ----------------------
        
        --- CONVERSATION HISTORY ---
        {history_text}
        ----------------------------
        
        User asks: {user_text}
        AI Answer ({lang_code}):
        """
        
        response = await asyncio.to_thread(GENERATION_MODEL.generate_content, system_prompt)
        ai_text = response.text
        
        CONVERSATION_HISTORY.append(f"AI: {ai_text}")
        print(f"🤖 AI: {ai_text}")
        
        await websocket.send_text(json.dumps({"type": "text", "content": ai_text}))
        
        full_audio = b""
        async for chunk in text_to_speech(ai_text, lang_code): full_audio += chunk
        await websocket.send_bytes(full_audio)
        
    except Exception as e:
        print(f"❌ Processing Error: {e}")

class WhatsappMessage(BaseModel):
    to: str
    body: str

@app.post("/whatsapp")
async def send_whatsapp_message(message: WhatsappMessage):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            from_=f'whatsapp:{TWILIO_FROM_NUMBER}',
            body=message.body,
            to=f'whatsapp:{message.to}'
        )
        return {"status": "success", "sid": message.sid}
    except Exception as e:
        print(f"❌ WhatsApp Error: {e}")
        return {"status": "error", "message": str(e)}
