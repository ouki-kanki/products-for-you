from elasticsearch_dsl import analyzer, token_filter, tokenizer


__all__ = (
    'html_strip',
)

_filters = ["lowercase", "stop", "snowball"]

# split to tokens between dashes
dash_tokenizer = tokenizer(
    'dash_tokenizer',
    type='pattern',
    pattern='-'
)

# this is used for substring matching
edge_ngram_filter = token_filter(
    'edge_ngram_filter',
    type='edge_ngram',
    min_gram=3,
    max_gram=6
)

variation_name_analyzer = analyzer(
    'variation_name_analyzer',
    tokenizer=dash_tokenizer,
    filter=[* _filters, edge_ngram_filter]
)

html_strip = analyzer(
    'html_strip',
    tokenizer="standard",
    filter=_filters,
    char_filter=["html_strip"]
)
