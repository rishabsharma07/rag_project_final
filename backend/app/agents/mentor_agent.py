from app.rag.rag_pipeline import ask_rag
from app.services.ai_service import ask_ai

def mentor_agent(user_query):

    query = user_query.lower()

    if "quiz" in query:

        prompt = f"""
        Generate a quiz based on:
        {user_query}
        """

        return ask_ai(prompt)

    elif "roadmap" in query:

        prompt = f"""
        Create a personalized study roadmap for:
        {user_query}
        """

        return ask_ai(prompt)

    else:

        return ask_rag(user_query)