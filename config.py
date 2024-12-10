import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_SHEETS_CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_FILE")
    GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
