import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_comments(code, mode):

    prompt = f"""
You are an expert Python developer.

Generate {mode.lower()} comments for the following Python code.

Rules:
- Add meaningful comments.
- Do not change the code logic.
- Return only the commented Python code.

Python Code:

{code}
"""

    response = model.generate_content(prompt)

    return response.text