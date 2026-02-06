from fastapi import APIRouter, Depends, HTTPException
from app.schemas import AIQuestion, AIResponse
from app.utils.auth import get_current_user
import os
import logging
import google.generativeai as genai

router = APIRouter()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API configured successfully")
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

@router.post("/ask", response_model=AIResponse)
async def ask_ai(
    question_data: AIQuestion,
    current_user: dict = Depends(get_current_user)
):
    
    try:
        if not GEMINI_API_KEY:
            logger.error("Gemini API key not configured")
            raise HTTPException( status_code=500, detail="Gemini API key not configured" )
        
        logger.info(f"Processing question: {question_data.question}")
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f'''You are a helpful financial advisor for rural users in India who may have limited financial literacy.

Guidelines:
- Use SIMPLE, EASY-TO-UNDERSTAND language
- Keep responses CONCISE (under 150 words)
- Provide PRACTICAL, ACTIONABLE advice
- Use examples relevant to rural India
- Avoid complex financial jargon
- Be encouraging and supportive
- If the question is in Hindi (हिंदी), respond in Hindi
- If the question is in English, respond in English

User Question: {question_data.question}

Provide helpful financial guidance:'''
        
        logger.info("Sending request to Gemini API...")
        response = model.generate_content(prompt)
        answer = response.text
        logger.info("Successfully received response from Gemini API")
        
    except Exception as e:
        logger.error(f"Error in AI advisor: {type(e).__name__}: {str(e)}")
        answer = f"""I'm here to help with your financial question: "{question_data.question}"

For immediate assistance, try:
- Check our Financial Lessons section for detailed guides
- Browse Government Schemes that might help you
- Ask specific questions about savings, budgeting, or business

Our AI advisor is currently experiencing technical issues. Please try again in a moment.

Error details: {type(e).__name__}"""
    
    return {
        "question": question_data.question,
        "answer": answer
    }

@router.get("/suggestions")
async def get_suggestions(current_user: dict = Depends(get_current_user)):
    suggestions = [
        "Try to save 10% of your income every month",
        "Create a monthly budget and track your expenses",
        "Check government schemes you might be eligible for",
        "Start a small savings account if you don't have one",
        "Learn about financial planning through our lessons"
    ]
    
    return {
        "suggestions": suggestions
    }
