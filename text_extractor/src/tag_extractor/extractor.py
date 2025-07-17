from src.tag_extractor.fast_model import models
from src.tag_extractor.utils import clean_text, merge_and_dedup, combine_title_body
from typing import List
from src.tag_extractor.utils import expand_with_synonyms
import numpy as np

def extract_tfidf_tags(text: str, top_n=10) -> List[str]:
    # Refit vectorizer on the input text
    models.vectorizer.fit([text])
    X = models.vectorizer.transform([text])
    scores = X.toarray()[0]
    tokens = models.vectorizer.get_feature_names_out()
    # Get top n tokens by tfidf score
    top_indices = np.argsort(scores)[::-1][:top_n]
    return [tokens[i] for i in top_indices if scores[i] > 0]

def extract_entities(text: str) -> List[str]:
    doc = models.nlp(text)
    return [
        ent.text for ent in doc.ents
        if len(ent.text.split()) <= 3 and not ent.text.strip().isdigit()
    ]


def predict_tags(title: str, body: str) -> List[str]:
    combined = combine_title_body(title, body)
    cleaned = clean_text(combined)

    # Short text fallback
    if len(cleaned.split()) < 10:
        base_tags = extract_entities(cleaned)
    else:
        tfidf_tags = extract_tfidf_tags(cleaned)
        entity_tags = extract_entities(cleaned)
        base_tags = merge_and_dedup(tfidf_tags, entity_tags)

    # Expand semantically
    enriched_tags = expand_with_synonyms(base_tags)

    return enriched_tags
