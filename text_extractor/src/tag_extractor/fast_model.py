from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import spacy

# Load everything once and reuse
class ModelCache:
    def __init__(self):
        self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.kw_model = KeyBERT(model=self.embedding_model)
        self.nlp = spacy.load("en_core_web_sm")

models = ModelCache()
