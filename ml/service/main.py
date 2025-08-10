from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="CareerScan ML Service", version="1.0.0")

class Answer(BaseModel):
    questionId: str
    choice: str

class RankRequest(BaseModel):
    answers: List[Answer]

class PersonaScore(BaseModel):
    key: str
    probability: float

class RankResponse(BaseModel):
    personas: List[PersonaScore]

@app.post("/rank", response_model=RankResponse)
def rank_personas(request: RankRequest):
    # Simple rule-based scoring for now
    a_count = sum(1 for answer in request.answers if answer.choice == "A")
    b_count = len(request.answers) - a_count
    total = max(a_count + b_count, 1)
    
    # Calculate probabilities
    deliberate_prob = a_count / total
    energetic_prob = b_count / total
    
    return RankResponse(personas=[
        PersonaScore(key="Deliberate_Listener", probability=deliberate_prob),
        PersonaScore(key="Energetic_Responder", probability=energetic_prob)
    ])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)