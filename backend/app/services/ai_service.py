import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()

def _call_gpt(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are Samadhan AI, a helpful assistant for Indian users."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content

def explain_document(text: str) -> str:
    prompt = f"""
    Explain the following document in simple language.
    Highlight important points and required actions.

    Document:
    {text}
    """
    return _call_gpt(prompt)

def explain_finance_with_ai(data: dict) -> str:
    prompt = f"""
    Explain the following financial details in simple language for an Indian user.
    Do NOT calculate numbers. Only explain what they mean.

    Data:
    {data}
    """
    return _call_gpt(prompt)

def explain_eligibility_with_ai(answers: dict, rules: dict) -> dict:
    prompt = f"""
    You are helping an Indian user understand eligibility.

    Eligibility Rules:
    {rules}

    User Details:
    {answers}

    Instructions:
    - Decide if the user is Eligible, Not Eligible, or Depends
    - Explain the reason in simple language
    - Suggest next steps if not eligible

    Respond strictly in JSON format.
    """

    result = _call_gpt(prompt)

    return {
        "raw_response": result
    }
