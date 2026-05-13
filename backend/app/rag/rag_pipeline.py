from app.rag.embeddings import (
    get_embedding_model
)

from app.rag.vector_store import (
    search_chunks
)

from app.services.ai_service import (
    ask_ai
)

embedding_model = get_embedding_model()

def ask_rag(
    query,
    user_id
):

    query_embedding = embedding_model.encode(
    query,
    convert_to_numpy=True
)

    relevant_chunks = search_chunks(
        query_embedding,
        user_id
    )

    context = "\n\n".join(
        relevant_chunks
    )

    prompt = f"""
    Answer the question
    using ONLY the context below.

    Context:
    {context}

    Question:
    {query}
    """

    response = ask_ai(
        prompt
    )

    return response