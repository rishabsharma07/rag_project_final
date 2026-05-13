from sentence_transformers import SentenceTransformer

embedding_model = None

def get_embedding_model():

    global embedding_model

    if embedding_model is None:

        embedding_model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return embedding_model

def create_embeddings(chunks):

    embedding_model = get_embedding_model()

    embeddings = embedding_model.encode(
    chunks,
    convert_to_numpy=True
)

    return embeddings
