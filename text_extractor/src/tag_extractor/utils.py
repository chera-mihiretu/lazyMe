import re
from typing import List
import nltk
from nltk.corpus import wordnet as wn
nltk.download('wordnet')
nltk.download('omw-1.4')

CUSTOM_STOPWORDS = {
    "used", "using", "use", "based", "done", "doing", "this", "that", "these", "those",
    "thing", "things", "etc", "get", "got", "give", "given", "taken", "take",
    "make", "made", "do", "did", "good", "great", "bad", "well", "help", "nice",
    "create", "created", "creating", "support", "work", "working"
}


def clean_text(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r'\s+', ' ', text)
    return text

def combine_title_body(title: str, body: str) -> str:
    return f"{title.strip()}. {body.strip()}"

def merge_and_dedup(list1: List[str], list2: List[str]) -> List[str]:
    seen = set()
    result = []
    for item in list1 + list2:
        cleaned = item.strip().lower()
        if cleaned not in seen and is_valid_tag(cleaned):
            seen.add(cleaned)
            result.append(cleaned)
    return result

def is_valid_tag(tag: str) -> bool:
    words = tag.lower().split()
    if not words or len(words) > 4:
        return False

    # If all words are stopwords
    if all(w in CUSTOM_STOPWORDS for w in words):
        return False

    # If tag starts or ends with a stopword
    if words[0] in CUSTOM_STOPWORDS or words[-1] in CUSTOM_STOPWORDS:
        return False

    # If tag includes generic terms like 'used', 'thing', 'good'
    for w in words:
        if w in CUSTOM_STOPWORDS or len(w) < 2:
            return False

    return True

def expand_with_synonyms(tags: List[str], limit=2) -> List[str]:
    expanded = set(tags)

    for tag in tags:
        words = tag.split()
        for word in words:
            syns = wn.synsets(word)
            for s in syns[:2]:  # Limit to top 2 senses
                for lemma in s.lemmas()[:limit]:  # Limit synonyms per sense
                    synonym = lemma.name().replace("_", " ").lower()
                    if synonym != word and len(synonym.split()) <= 2:
                        expanded.add(synonym)

    return list(expanded)
