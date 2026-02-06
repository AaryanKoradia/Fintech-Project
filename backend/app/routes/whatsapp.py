from fastapi import APIRouter, Request, HTTPException, Depends, Body
from app.utils.auth import get_current_user
from app.database import get_collection, USERS_COLLECTION
import requests
import os
from typing import Dict, Any
from datetime import datetime
import logging

router = APIRouter()

# UltraMsg Configuration
ULTRAMSG_INSTANCE = os.getenv("ULTRAMSG_INSTANCE", "instance161117")
ULTRAMSG_TOKEN = os.getenv("ULTRAMSG_TOKEN", "cuzs4wytqcsvut0c")
ULTRAMSG_BASE_URL = f"https://api.ultramsg.com/{ULTRAMSG_INSTANCE}"

logger = logging.getLogger(__name__)


def send_whatsapp_message(to: str, body: str) -> Dict[str, Any]:
    """
    Send WhatsApp message using UltraMsg API
    
    Args:
        to: Phone number without + (e.g., "917058135626")
        body: Message text
        
    Returns:
        Response from UltraMsg API
    """
    url = f"{ULTRAMSG_BASE_URL}/messages/chat"
    
    payload = {
        "token": ULTRAMSG_TOKEN,
        "to": to,
        "body": body
    }
    
    try:
        response = requests.post(url, data=payload)
        logger.info(f"WhatsApp message sent to {to}: Status {response.status_code}")
        return {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "response": response.json() if response.status_code == 200 else response.text
        }
    except Exception as e:
        logger.error(f"Error sending WhatsApp message: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


def handle_command(message: str, user_phone: str) -> str:
    """
    Handle WhatsApp commands and return appropriate response
    
    Args:
        message: User's message text
        user_phone: User's phone number
        
    Returns:
        Response message to send back
    """
    message_lower = message.lower().strip()
    
    # Welcome/Hi command
    if message_lower in ['hi', 'hello', 'hey', 'start', 'namaste', 'नमस्ते']:
        return """🙏 *Welcome to FinLit - Financial Literacy Platform*

Please select your preferred language:

1️⃣ English
2️⃣ हिन्दी (Hindi)

Reply with *1* for English or *2* for Hindi

---
💡 This is your personal financial assistant! I can help you with:
✅ Learn about money & savings
✅ Track your expenses
✅ Find government schemes
✅ Get financial advice
✅ Scan documents

Type *help* anytime for assistance."""
    
    # Language selection
    elif message_lower in ['1', 'english']:
        return """✅ *Language set to English*

🎯 *What would you like to do?*

📚 *learn* - Financial literacy lessons
💰 *schemes* - Government schemes & benefits
📊 *expense* - Track your expenses
🤖 *advice* - Get AI financial advisor
📄 *scan* - Scan documents (Aadhaar, PAN, etc.)
📈 *score* - Check your confidence score
ℹ️ *help* - Show this menu

Reply with a keyword to continue!"""
    
    elif message_lower in ['2', 'hindi', 'हिन्दी']:
        return """✅ *भाषा हिन्दी में सेट की गई*

🎯 *आप क्या करना चाहेंगे?*

📚 *सीखें* - वित्तीय साक्षरता पाठ
💰 *योजनाएं* - सरकारी योजनाएं और लाभ
📊 *खर्च* - अपने खर्चों पर नज़र रखें
🤖 *सलाह* - AI वित्तीय सलाहकार
📄 *स्कैन* - दस्तावेज़ स्कैन करें
📈 *स्कोर* - अपना आत्मविश्वास स्कोर देखें
ℹ️ *मदद* - यह मेनू दिखाएं

जारी रखने के लिए कीवर्ड के साथ उत्तर दें!"""
    
    # Help command
    elif message_lower in ['help', 'मदद', 'menu']:
        return """📱 *FinLit WhatsApp Assistant Menu*

🌐 *Language*
• *english* or *1* - Switch to English
• *hindi* or *2* - Switch to Hindi

📚 *Learning*
• *learn* - View financial lessons
• *lessons* - Browse all lessons
• *quiz* - Take financial quiz

💰 *Schemes*
• *schemes* - Government schemes
• *pmkisan* - PM-KISAN scheme info
• *benefits* - Check eligibility

📊 *Expenses*
• *expense* - Add expense
• *total* - View total expenses
• *report* - Monthly report

🤖 *AI Advisor*
• *advice* - Get financial advice
• *ask* [question] - Ask anything

📄 *Documents*
• *scan* - How to scan documents
• *forms* - Fill government forms

📈 *Progress*
• *score* - Confidence score
• *progress* - Learning progress

Type any keyword to get started!"""
    
    # Learn/Lessons
    elif message_lower in ['learn', 'lessons', 'सीखें', 'पाठ']:
        return """📚 *Financial Literacy Lessons*

🎓 Available Topics:

1. *Savings* - How to save money
2. *Banking* - Understanding banks
3. *Schemes* - Government benefits
4. *Budget* - Money management
5. *Digital* - Online transactions
6. *Investment* - Growing your money

📱 *To access full lessons with videos:*
Visit: https://finlit-app.com/lessons

💡 *Quick Tip:* Start with Savings lesson - it's the foundation of financial health!

Reply *menu* to see all options."""
    
    # Schemes
    elif message_lower in ['schemes', 'योजनाएं', 'yojana']:
        return """💰 *Government Schemes & Benefits*

🏛️ *Popular Schemes:*

1. 🌾 *PM-KISAN* - ₹6000/year for farmers
2. 🏠 *PMAY* - Housing for all
3. 💡 *UJJWALA* - Free LPG connection
4. 🏥 *AYUSHMAN* - Free health insurance
5. 💰 *JAN DHAN* - Bank account benefits
6. 👩 *SUKANYA* - Girl child savings

📱 *Check Eligibility:*
Visit: https://finlit-app.com/schemes

⚡ *Quick Check:* Reply *pmkisan* for PM-KISAN details

Reply *menu* for more options."""
    
    # Expense tracking
    elif message_lower in ['expense', 'खर्च', 'track']:
        return """📊 *Expense Tracker*

💵 *Track your spending easily!*

📱 *Add Expense via App:*
Visit: https://finlit-app.com/expenses

📝 *Categories Available:*
• Food & Groceries
• Transport
• Bills & Utilities
• Healthcare
• Education
• Entertainment
• Others

💡 *Pro Tip:* Track daily expenses to understand your spending patterns!

📈 Reply *report* to see expense insights
🔙 Reply *menu* for all options"""
    
    # AI Advice
    elif message_lower in ['advice', 'सलाह', 'ask', 'help me']:
        return """🤖 *AI Financial Advisor*

💬 *Ask me anything about:*
• Saving money
• Budgeting tips
• Loan advice
• Investment basics
• Scheme eligibility
• Financial planning

📱 *How to use:*
Simply type your question!

Example:
"How to save ₹10,000 in 6 months?"
"Which scheme is best for farmers?"
"How to reduce monthly expenses?"

🌟 *For detailed AI advice:*
Visit: https://finlit-app.com/ai-advisor

Reply *menu* to see all options."""
    
    # Document scanning
    elif message_lower in ['scan', 'स्कैन', 'document']:
        return """📄 *Document Scanner & Form Filler*

📸 *What you can do:*
✅ Scan Aadhaar card
✅ Scan PAN card
✅ Scan bank passbook
✅ Fill government forms automatically

🎯 *Features:*
• AI text extraction
• Auto form filling
• Data validation
• Secure storage

📱 *Access Scanner:*
Visit: https://finlit-app.com/document-scanner

💡 *Tip:* Keep documents ready for scheme applications!

Reply *menu* for all options."""
    
    # Score/Progress
    elif message_lower in ['score', 'स्कोर', 'progress']:
        return """📈 *Your Financial Confidence Score*

🎯 *Track your progress:*
• Learning completion
• Quiz scores
• Scheme applications
• Savings progress

📱 *View Detailed Score:*
Visit: https://finlit-app.com/profile

🏆 *Improve Your Score:*
• Complete more lessons
• Take regular quizzes
• Track expenses daily
• Apply for eligible schemes

💪 *Keep learning to boost your score!*

Reply *menu* for all options."""
    
    # Unknown command
    else:
        return """❓ *I didn't understand that command*

Please try one of these:
• *hi* - Start over
• *help* - Show menu
• *learn* - Financial lessons
• *schemes* - Government schemes
• *expense* - Track expenses
• *advice* - AI advisor
• *scan* - Document scanner

Or visit our app: https://finlit-app.com

Reply *menu* to see all options."""


@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    Webhook to receive incoming WhatsApp messages from UltraMsg
    """
    try:
        data = await request.json()
        logger.info(f"Received webhook: {data}")
        
        # Extract message details
        message_body = data.get("body", "")
        user_phone = data.get("from", "").replace("+", "")
        message_type = data.get("type", "")
        
        # Only process text messages
        if message_type != "chat":
            return {"status": "ignored", "reason": "Not a text message"}
        
        # Ignore messages sent by bot itself
        if data.get("fromMe", False):
            return {"status": "ignored", "reason": "Message from bot"}
        
        # Handle the command and get response
        response_message = handle_command(message_body, user_phone)
        
        # Send response back to user
        result = send_whatsapp_message(user_phone, response_message)
        
        # Log the interaction
        users_collection = get_collection(USERS_COLLECTION)
        await users_collection.update_one(
            {"phone": user_phone},
            {
                "$push": {
                    "whatsapp_interactions": {
                        "timestamp": datetime.utcnow(),
                        "user_message": message_body,
                        "bot_response": response_message
                    }
                },
                "$set": {"last_whatsapp_interaction": datetime.utcnow()}
            },
            upsert=False
        )
        
        return {
            "status": "success",
            "message_sent": result.get("success", False)
        }
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return {"status": "error", "error": str(e)}


@router.post("/send-message")
async def send_message(
    to: str = Body(..., embed=True),
    message: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_user)
):
    """
    Admin endpoint to send WhatsApp messages
    
    Args:
        to: Phone number without + (e.g., "917058135626")
        message: Message text
    """
    try:
        # Remove + if present
        to = to.replace("+", "")
        
        result = send_whatsapp_message(to, message)
        
        return {
            "success": result.get("success", False),
            "message": "WhatsApp message sent successfully" if result.get("success") else "Failed to send message",
            "details": result
        }
        
    except Exception as e:
        logger.error(f"Send message error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/broadcast")
async def broadcast_message(
    message: str = Body(..., embed=True),
    user_ids: list = Body(None, embed=True),
    current_user: dict = Depends(get_current_user)
):
    """
    Admin endpoint to broadcast WhatsApp messages to multiple users
    
    Args:
        message: Message text
        user_ids: List of user IDs (if None, send to all users with phone numbers)
    """
    try:
        # Check if user is admin
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        users_collection = get_collection(USERS_COLLECTION)
        
        # Get users to send to
        if user_ids:
            query = {"_id": {"$in": user_ids}, "phone": {"$exists": True, "$ne": ""}}
        else:
            query = {"phone": {"$exists": True, "$ne": ""}}
        
        users = []
        async for user in users_collection.find(query):
            users.append(user)
        
        # Send messages
        results = {
            "total": len(users),
            "sent": 0,
            "failed": 0,
            "details": []
        }
        
        for user in users:
            phone = user.get("phone", "").replace("+", "")
            if phone:
                result = send_whatsapp_message(phone, message)
                if result.get("success"):
                    results["sent"] += 1
                else:
                    results["failed"] += 1
                results["details"].append({
                    "phone": phone,
                    "status": "sent" if result.get("success") else "failed"
                })
        
        return {
            "success": True,
            "message": f"Broadcast completed: {results['sent']} sent, {results['failed']} failed",
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Broadcast error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test")
async def test_whatsapp(phone: str = "917058135626"):
    """
    Test endpoint to send a test WhatsApp message
    """
    try:
        result = send_whatsapp_message(
            phone,
            "🚀 *FinLit WhatsApp Integration is Working!*\n\nReply *hi* to get started with your financial literacy journey."
        )
        
        return {
            "success": result.get("success", False),
            "message": "Test message sent",
            "details": result
        }
        
    except Exception as e:
        logger.error(f"Test error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
