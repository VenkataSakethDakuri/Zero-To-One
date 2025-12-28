import asyncio

from dotenv import load_dotenv
from google.adk.sessions import DatabaseSessionService
from google.adk.runners import Runner
from google.genai import types
from teacher_agent.agent import teacher_agent

# Load environment variables
load_dotenv()

# Local storage
db_url = "sqlite:///./Acharya_data.db"
session_service = DatabaseSessionService(db_url=db_url)


# async allows streaming
async def main_async():

    APP_NAME = "Acharya"
    USER_ID = "Saketh"
    
    topic = input("\nEnter the topic you want to learn about: ").strip()
    
    if not topic:
        print("Error: Topic cannot be empty!")
        return {"error": "No topic provided"}
    
    # Set initial state with the user's topic
    initial_state = {
        "topic": topic,  # This will be accessible to all agents via {topic}
    }

    existing_sessions = session_service.list_sessions(
        app_name=APP_NAME,
        user_id=USER_ID,
    )

    if existing_sessions and len(existing_sessions.sessions) > 0:
        # Use the most recent session
        SESSION_ID = existing_sessions.sessions[0].id
        print(f"Continuing existing session: {SESSION_ID}")
        
        # Update the session state with the new topic
        session = session_service.get_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID
        )
        session.state["topic"] = topic
        session_service.update_session(session)
    else:
        # Create a new session with initial state
        # Session = Events + State
        new_session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            state=initial_state,
        )
        SESSION_ID = new_session.id
        print(f"Created new session: {SESSION_ID}")

    runner = Runner(
        agent=teacher_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )
    
    # Send a message to trigger the agent workflow
    content = types.Content(
        role="user", 
        parts=[types.Part(text=f"Please generate educational content for the topic: {topic}")]
    )
    
    final_response = None
    async for response in runner.run_async(
        user_id=USER_ID, 
        session_id=SESSION_ID, 
        new_message=content
    ):
        if response.is_final_response():
            final_response = response.text
    
    if final_response:
        print(f"\n{final_response}\n")
    
    return {"final_response": final_response}



if __name__ == "__main__":
    asyncio.run(main_async())
