from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.agents.mentor_agent import mentor_agent
from app.auth.auth_bearer import JWTBearer
router = APIRouter()

class AgentRequest(BaseModel):

    query: str

@router.post(
        "/agent", 
        dependencies=[Depends(JWTBearer())])

def run_agent(request: AgentRequest):

    response = mentor_agent(
        request.query
    )

    return {
        "response": response
    }