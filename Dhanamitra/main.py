from dotenv import load_dotenv
import os
import psycopg2
import time
import json
from decimal import Decimal

from voice_agent import create_voice_agent
from call_func import make_call
from query_tool import Query_tool
from phone_no import create_phone_number
from file_upload import upload_file

load_dotenv()

db_config = {"host": "localhost", "database": "dhanamitra", "user": os.getenv("POSTGRESQL_USER"), "password": os.getenv("POSTGRESQL_PASSWORD")}

def dispatch_calls(voice_agent: dict, phone_number: dict, file_list: list, due_calls: list, connection: object, cursor: object):

    if not due_calls:
        print("No due calls found right now.")
        return
    
    for call in due_calls:
        customer_number = call['phone_number']
        customer_name = call['first_name']
        customer_email = call['email']
        assistant_id = voice_agent['id']
        phone_number_id = phone_number['id']
        loan_reference_id = call['loan_reference_id']
        next_call_scheduled_at = call['next_call_scheduled_at']
        outstanding_balance = Decimal(call['outstanding_balance'])
        due_date = call['due_date']
        customer_id = call[0]

        dialed_call =  make_call(customer_number, customer_name, customer_email, assistant_id, next_call_scheduled_at, phone_number_id, customer_id, outstanding_balance, due_date)



if __name__ == "__main__":
    voice_agent = create_voice_agent()
    phone_number = create_phone_number(voice_agent['id'])

    file_list = []

    for file in os.listdir("./kb_files"):
        file_path = os.path.join("./kb_files", file)  
        response = upload_file(file_path)
        file_list.append(response['id'])

        connection = None

    connection = psycopg2.connect(**db_config)

    cursor = connection.cursor()

    # Find due calls
    query = """
        SELECT customer_id, first_name, phone_number, loan_reference_id, outstanding_balance, due_date
        FROM customers
        WHERE call_status = 'PENDING' 
        AND next_call_scheduled_at <= NOW()
    """
    cursor.execute(query)
    due_calls = cursor.fetchall()

    phone_number_id = phone_number['id']
    os.putenv("VAPI_PHONE_NUMBER_ID", phone_number_id)
    
    dispatch_calls(voice_agent, phone_number, file_list, due_calls, connection, cursor)