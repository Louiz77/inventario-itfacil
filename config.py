import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_SHEETS_CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_FILE")
    GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
    ACCESS_TOKEN_URL = os.getenv("ACCESS_TOKEN_URL")
    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")
    ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
    AUTHORIZATION_CODE = os.getenv("AUTHORIZATION_CODE")