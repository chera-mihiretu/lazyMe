from sklearn.feature_extraction.text import TfidfVectorizer
import spacy

# Load everything once and reuse
class ModelCache:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 3),
            max_features=1000
        )
        self.vectorizer.fit(["sample text to initialize vectorizer"])
        self.nlp = spacy.load("en_core_web_sm")

models = ModelCache()
