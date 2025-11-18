import os
import json
import requests
import numpy as np
from pypdf import PdfReader
from bs4 import BeautifulSoup
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    print(f"Error configuring Google AI: {e}")

CACHE_FILE = "backend/knowledge_vectors.json"
TEXT_CHUNK_SIZE = 1000
TEXT_CHUNK_OVERLAP = 100
EMBEDDING_MODEL = 'models/embedding-001' # <-- THE FIX!

def get_pdf_text(pdf_path):
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(f"✅ Read PDF: {os.path.basename(pdf_path)}")
    except Exception as e:
        print(f"❌ Error reading PDF {pdf_path}: {e}")
    return text

def get_website_text(url):
    text = ""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
             print(f"⚠️ Failed to load {url} (Status: {response.status_code})")
             return ""
        soup = BeautifulSoup(response.text, 'html.parser')
        for script in soup(["script", "style", "nav", "footer", "aside"]):
            script.extract()
        text = soup.get_text(separator=' ')
        lines = (line.strip() for line in text.splitlines())
        text = '\n'.join(chunk for chunk in lines if chunk)
        print(f"✅ Read Website: {url}")
    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
    return text[:4000] 

def embed_content(text):
    """Generates an embedding vector for a text chunk."""
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL, # <-- Using the correct model
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"❌ Embedding Error: {e}")
        return None

def load_knowledge_base():
    if os.path.exists(CACHE_FILE):
        print(f"💾 Found vector database. Loading instantly...")
        try:
            with open(CACHE_FILE, "r") as f:
                data = json.load(f)
                return [(item['text'], np.array(item['embedding'])) for item in data]
        except:
            print(f"⚠️ Vector cache corrupted, rebuilding...")

    print("🧠 No vector cache found. Building new brain...")
    full_text = ""
    
    urls = [
        "https://bangladesh.gov.bd/", "https://bn.wikipedia.org/wiki/%E0%A6%AE%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC%E0%A7%87%E0%A6%B6%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A6_BE",
        "https://asifkibriahelpline.com/",
        "https://immi.homeaffairs.gov.au/", "https://www.canada.ca/en/immigration-refugees-citizenship.html",
        "https://travel.state.gov/content/travel/en/us-visas.html", "https://www.uscis.gov/",
        "https://nyidanmark.dk/en-GB", "https://www.gov.uk/browse/visas-immigration",
        "https://www.deel.com/", "https://remote.com/", "https://clutch.co/it-services",
    ]
    for url in urls:
        full_text += get_website_text(url) + "\n\n"

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    for filename in os.listdir(backend_dir):
        if filename.endswith(".pdf"):
            path = os.path.join(backend_dir, filename)
            full_text += get_pdf_text(path) + "\n\n"
            
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=TEXT_CHUNK_SIZE, chunk_overlap=TEXT_CHUNK_OVERLAP)
    chunks = text_splitter.split_text(full_text)
    
    database = []
    
    print(f"🧠 Creating {len(chunks)} knowledge vectors... (This will take 5-10 minutes)")
    for i, chunk in enumerate(chunks):
        embedding = embed_content(chunk)
        if embedding:
            database.append({'text': chunk, 'embedding': embedding})
            print(f"   ...vector {i+1} of {len(chunks)} created")
        else:
            print(f"   ...vector {i+1} FAILED (skipping)")

    with open(CACHE_FILE, "w") as f:
        json.dump([{'text': item['text'], 'embedding': item['embedding']} for item in database if 'embedding' in item and item['embedding'] is not None], f, default=lambda x: x.tolist() if isinstance(x, np.ndarray) else x)
    print(f"💾 Vector database saved to {CACHE_FILE}")

    return [(item['text'], np.array(item['embedding'])) for item in database if 'embedding' in item and item['embedding'] is not None]
