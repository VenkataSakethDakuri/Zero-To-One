import asyncio

from dotenv import load_dotenv
from google.adk.sessions import DatabaseSessionService
from google.adk.runners import Runner
from google.genai import types



# Local storage
db_url = "sqlite:///./Acharya_data.db"
session_service = DatabaseSessionService(db_url=db_url)

initial_state = {}

# async allows streaming
async def main_async():

    APP_NAME = "Acharya"
    USER_ID = "Saketh"

    existing_sessions = session_service.list_sessions(
        app_name=APP_NAME,
        user_id=USER_ID,
    )

    if existing_sessions and len(existing_sessions.sessions) > 0:
        # Use the most recent session
        SESSION_ID = existing_sessions.sessions[0].id
        print(f"Continuing existing session: {SESSION_ID}")
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
    agent=memory_agent,
    app_name=APP_NAME,
    session_service=session_service,
)
    content = types.Content(role="user", parts=[types.Part(text=query)])

    async for response in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content):
        if response.is_final_response():
            final_response = response.text
    
    return {"final_response": final_response}



if __name__ == "__main__":
    asyncio.run(main_async())
