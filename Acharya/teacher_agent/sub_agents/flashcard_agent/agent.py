from google.adk.agents import Agent
from pydantic import BaseModel, Field


class Flashcard(BaseModel):
    """Model representing a flashcard with a question and answer."""
    question: str = Field(..., description="The question for the flashcard")
    answer: str = Field(..., description="The answer to the flashcard question")

flashcard_agent = Agent(
    name = "flashcard_agent",
    description = "Generates flashcards for a given topic",
    tools = [],
    output_key = "flashcards",
    output_schema = Flashcard,

)