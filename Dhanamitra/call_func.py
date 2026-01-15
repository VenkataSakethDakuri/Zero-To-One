import requests
from dotenv import load_dotenv
import psycopg2
import os
import pytz
from datetime import datetime, timedelta
from decimal import Decimal

load_dotenv()

db_config = {"host": "localhost", "database": "dhanamitra", "user": os.getenv("POSTGRESQL_USER"), "password": os.getenv("POSTGRESQL_PASSWORD")}

# def timestamp_to_ISO(timestamp: datetime):
#     ist = pytz.timezone('Asia/Kolkata')
#     # Make timezone-aware if naive
#     if timestamp.tzinfo is None:
#         timestamp = ist.localize(timestamp)
#     iso_time = timestamp.astimezone(ist).isoformat()

#     return iso_time


def timestamp_to_ISO(timestamp: datetime):
    ist = pytz.timezone('Asia/Kolkata')
    
    # 1. Make input timezone-aware (IST) if it is naive
    if timestamp.tzinfo is None:
        timestamp = ist.localize(timestamp)
    else:
        timestamp = timestamp.astimezone(ist)

    # 2. Get current time in IST (Timezone Aware)
    now = datetime.now(ist)

    # 3. Compare datetime objects (not strings)
    if timestamp <= now:
        timestamp = now + timedelta(seconds=10)
    
    # 4. Convert to ISO string at the very end
    return timestamp.isoformat()

def get_past_history(customer_id: int):
    connection = psycopg2.connect(**db_config)
    cursor = connection.cursor()
    query = """
        SELECT call_outcome, call_summary, created_at 
        FROM call_logs 
        WHERE customer_id = %s
        ORDER BY created_at DESC 
        LIMIT 3
    """
    cursor.execute(query, (customer_id,))
    logs = cursor.fetchall()

    cursor.close()
    connection.close()

    
    if not logs:
        return "No previous calls."

    history_text = ""
    for log in logs:
        outcome, summary, date = log
        date_str = date.strftime("%d-%b")
        history_text += f"- On {date_str} ({outcome}): {summary}\n"
    
    return history_text


def make_call(customer_number: str, customer_name: str, customer_email: str, assistant_id: str, next_call_time: datetime, phone_number_id: str, customer_id: int, outstanding_balance: Decimal, due_date: datetime):

    url = "https://api.vapi.ai/call"
    history_text = get_past_history(customer_id)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('VAPI_API_KEY')}"
    }

    print(timestamp_to_ISO(next_call_time))

    
    payload = {
        "name": "Loan_recovery_call",
        "customer": {
                "number": customer_number,
                "name": customer_name,
                "email": customer_email
            },

        "assistantId": assistant_id,
        "schedulePlan": {
            "earliestAt": timestamp_to_ISO(next_call_time),
            "latestAt": timestamp_to_ISO(next_call_time + timedelta(seconds=600))
        },
        
        "phoneNumberId": phone_number_id,

        "assistantOverrides": {
            "firstMessage": f"Hello! am I speaking to {customer_name}?",


            "model": {
                "provider": "google",
                "model": "gemini-2.5-flash",
                "messages": [
                    {
                        "role": "system",
                        "content": f"""
                        You are a loan recovery agent.
                        
                        Here is the history of previous calls with this customer:
                        {history_text}
                        
                        Here is the loan details:
                        Outstanding balance: {outstanding_balance}
                        Due date: {due_date}
                        
                        Use this context however needed.
                        """
                    }
                ]
            }
        }
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 201:
        print("Call scheduled successfully")
    else:
        print(f"Failed to schedule call: {response.status_code}")
        print(response.text)
        return None
    
    return response.json()
