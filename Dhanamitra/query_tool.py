import requests
from dotenv import load_dotenv
import os

load_dotenv()


def Query_tool(fileIds: list[str]):
    url = "https://api.vapi.ai/tool"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('VAPI_API_KEY')}"
    }

    payload = {
        "type": "query",
        "function": {    "name": "loan_details_search",    "description": "Search loan terms and conditions for customer inquiries"  },
        "messages": [
            {
                "type": "request-start",
                "content": "Let me check your loan details. Please hold for just a moment.",

            },

            {
                "type": "request-failed",
                "content": "I am sorry, I am not able to answer your question. Please ask me something else or ask me after some time."
            },

            {
                "type": "request-response-delayed",
                "content": "This is taking a bit longer than expected. Please bear with me"
            }
        ],

        "knowledgeBases": [
            {
                "name": "Loan_terms_and_conditions",
                "provider": "google",
                "description": "This collection outlines the operational and legal guidelines for loan recovery.",
                "fileIds": fileIds,
                "model": "gemini-2.5-flash"
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 201:
        print("Query tool created successfully")
    else:
        print("Failed to create query tool")
        return None
    
    return response.json()