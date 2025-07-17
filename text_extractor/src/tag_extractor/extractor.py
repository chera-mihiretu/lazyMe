from src.tag_extractor.fast_model import models
from src.tag_extractor.utils import clean_text, merge_and_dedup, combine_title_body
from typing import List
from src.tag_extractor.utils import expand_with_synonyms


def extract_keybert_tags(text: str, top_n=10, ngram_range=(1, 3)) -> List[str]:
    keywords = models.kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=ngram_range,
        stop_words="english",
        top_n=top_n,
        use_maxsum=False,
        diversity=0.85
    )
    return [kw for kw, _ in keywords]

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
        keybert_tags = extract_keybert_tags(cleaned)
        entity_tags = extract_entities(cleaned)
        base_tags = merge_and_dedup(keybert_tags, entity_tags)

    # Expand semantically
    enriched_tags = expand_with_synonyms(base_tags)

    return enriched_tags

