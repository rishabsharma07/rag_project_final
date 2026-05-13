import chromadb

# ---------------- CHROMA CLIENT ---------------- #

client = chromadb.PersistentClient(
    path="chroma_db"
)

# ---------------- COLLECTION ---------------- #

collection = client.get_or_create_collection(
    name="rag_collection"
)

# ---------------- STORE EMBEDDINGS ---------------- #

def store_embeddings(
    chunks,
    embeddings,
    user_id
):

    for i, chunk in enumerate(chunks):

        collection.add(

            documents=[chunk],

            embeddings=[
                embeddings[i].tolist()
            ],

            ids=[
                f"{user_id}_{i}_{hash(chunk)}"
            ],

            metadatas=[
                {
                    "user_id": user_id
                }
            ]
        )

# ---------------- SEARCH CHUNKS ---------------- #

def search_chunks(
    query_embedding,
    user_id,
    k=3
):

    results = collection.query(

        query_embeddings=[
            query_embedding.tolist()
        ],

        n_results=k,

        where={
            "user_id": user_id
        }
    )

    documents = results.get(
        "documents",
        []
    )

    if not documents:
        return []

    return documents[0]