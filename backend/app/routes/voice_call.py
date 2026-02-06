from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import Response, PlainTextResponse
from typing import Optional
import os
import logging
import google.generativeai as genai
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SERVER_URL = os.getenv("SERVER_URL", "https://zola-cathectic-oralia.ngrok-free.dev")
call_sessions = {}

SYSTEM_CONTEXT = """You are a helpful financial assistant for FinLit, a financial literacy platform. 
You help users with:
- Banking questions (account opening, ATM usage, safety)
- Budgeting and savings advice
- Government schemes information
- Expense tracking guidance
- Financial planning tips

Keep responses brief (2-3 sentences max) as they will be spoken over phone.
Be friendly, supportive, and use simple language.
For complex queries, offer to send detailed information via SMS or app.
Always prioritize user's financial safety and security."""

def get_gemini_response(user_input: str, session_history: list = None) -> str:
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        context = SYSTEM_CONTEXT
        if session_history:
            context += "\n\nConversation history:\n"
            for msg in session_history[-3:]:  
                context += f"{msg}\n"
        
        context += f"\nUser: {user_input}\nAssistant:"
        
        response = model.generate_content(context)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return "I'm sorry, I couldn't process that. Please try again or contact support."

def create_exotel_response(message: str, gather_input: bool = True, end_call: bool = False) -> str:
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n'
    xml += f'  <Say>{message}</Say>\n'
    
    if end_call:
        xml += '  <Hangup/>\n'
    elif gather_input:
        process_url = f"{SERVER_URL}/api/voice-call/process-input"
        xml += f'  <Record maxLength="30" timeout="5" finishOnKey="#" playBeep="true" action="{process_url}" method="POST"/>\n'
    
    xml += '</Response>'
    logger.info(f"Returning XML: {xml[:200]}...")
    return xml

@router.get("/incoming-call")
@router.get("/incoming-call")
@router.post("/incoming-call")
async def handle_incoming_call(request: Request):
    try:
        params = dict(request.query_params)
        
        call_sid = params.get('CallSid', 'UNKNOWN')
        from_number = params.get('From') or params.get('CallFrom', 'UNKNOWN')
        to_number = params.get('To') or params.get('CallTo', 'UNKNOWN')
        call_status = params.get('CallStatus', 'incoming')
    
        if request.method == "POST":
            form_data = await request.form()
            call_sid = form_data.get('CallSid', call_sid)
            from_number = form_data.get('From') or form_data.get('CallFrom', from_number)
            to_number = form_data.get('To') or form_data.get('CallTo', to_number)
            call_status = form_data.get('CallStatus', call_status)
        
        logger.info(f"Incoming call - CallSid: {call_sid}, From: {from_number}, To: {to_number}, Status: {call_status}")
        call_sessions[call_sid] = {
            'caller': from_number,
            'history': [],
            'start_time': datetime.now()
        }
        
        xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Say voice="female" language="en-IN">Hello. This is a test message from FinLit.</Say>
<Pause length="2"/>
<Say voice="female" language="en-IN">If you can hear this, the voice is working.</Say>
<Pause length="3"/>
<Hangup/>
</Response>'''
        
        logger.info(f"Responding to call {call_sid} from {from_number}")
        logger.info(f"XML being returned:\n{xml_content}")
        
        return PlainTextResponse(
            content=xml_content,
            media_type="text/xml",
            headers={
                "Content-Type": "text/xml; charset=utf-8"
            }
        )
        
        return Response(
            content=xml_content,
            media_type="application/xml",
            headers={
                "Content-Type": "application/xml",
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        logger.error(f"Error in incoming call handler: {e}")
        error_msg = "क्षमा करें, कुछ गलत हो गया। कृपया बाद में प्रयास करें।"
        xml_response = create_exotel_response(error_msg, gather_input=False, end_call=True)
        return Response(content=xml_response, media_type="application/xml")

@router.get("/process-input")
@router.post("/process-input")
async def process_voice_input(
    request: Request,
    CallSid: str = None,
    RecordingUrl: str = None,
    RecordingDuration: str = None,
    Digits: str = None
):
    """Process user voice input and generate AI response (supports both GET and POST)"""
    try:
        # Handle both query parameters (GET) and form data (POST)
        if request.method == "GET":
            params = dict(request.query_params)
            CallSid = params.get('CallSid', 'UNKNOWN')
            RecordingUrl = params.get('RecordingUrl')
            RecordingDuration = params.get('RecordingDuration')
            Digits = params.get('Digits')
        else:
            if not CallSid:
                form_data = await request.form()
                CallSid = form_data.get('CallSid', 'UNKNOWN')
                RecordingUrl = form_data.get('RecordingUrl')
                RecordingDuration = form_data.get('RecordingDuration')
                Digits = form_data.get('Digits')
        
        logger.info(f"Processing input - CallSid: {CallSid}, RecordingUrl: {RecordingUrl}")
        
        # Get session
        session = call_sessions.get(CallSid, {})
        
        # For now, we'll use a placeholder text
        # In production, you would:
        # 1. Download the recording from RecordingUrl
        # 2. Use Google Speech-to-Text or similar service to transcribe
        # 3. Pass the transcribed text to Gemini
        
        # Simulated user input handling
        # You can integrate Google Speech-to-Text here
        user_text = "Tell me about opening a bank account"  # Placeholder
        
        # Get AI response from Gemini
        ai_response = get_gemini_response(user_text, session.get('history', []))
        
        # Update session history
        if CallSid in call_sessions:
            call_sessions[CallSid]['history'].append(f"User: {user_text}")
            call_sessions[CallSid]['history'].append(f"AI: {ai_response}")
        
        # Add follow-up option
        response_msg = f"{ai_response}\n\nक्या आपका कोई और सवाल है? हाँ के लिए बोलें या कॉल खत्म करने के लिए तारा दबाएं।"
        
        xml_response = create_exotel_response(response_msg, gather_input=True)
        
        return Response(content=xml_response, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"Error processing voice input: {e}")
        error_msg = "क्षमा करें, मैं आपका जवाब नहीं सुन पाया। कृपया फिर से कोशिश करें।"
        xml_response = create_exotel_response(error_msg, gather_input=True)
        return Response(content=xml_response, media_type="application/xml")

@router.get("/call-status")
@router.post("/call-status")
async def call_status_webhook(
    request: Request,
    CallSid: str = None,
    CallStatus: str = None,
    CallDuration: str = None
):
    """Handle call status updates from Exotel (supports both GET and POST)"""
    try:
        # Handle both query parameters (GET) and form data (POST)
        if request.method == "GET":
            params = dict(request.query_params)
            CallSid = params.get('CallSid', 'UNKNOWN')
            CallStatus = params.get('CallStatus', 'unknown')
            CallDuration = params.get('CallDuration')
        else:
            if not CallSid:
                form_data = await request.form()
                CallSid = form_data.get('CallSid', 'UNKNOWN')
                CallStatus = form_data.get('CallStatus', 'unknown')
                CallDuration = form_data.get('CallDuration')
        
        logger.info(f"Call status - CallSid: {CallSid}, Status: {CallStatus}, Duration: {CallDuration}")
        
        # Clean up session when call ends
        if CallStatus in ['completed', 'failed', 'busy', 'no-answer'] and CallSid in call_sessions:
            logger.info(f"Cleaning up session for CallSid: {CallSid}")
            del call_sessions[CallSid]
        
        return {"status": "received"}
        
    except Exception as e:
        logger.error(f"Error in call status webhook: {e}")
        return {"status": "error", "message": str(e)}

@router.get("/active-sessions")
async def get_active_sessions():
    """Get active call sessions (for monitoring)"""
    return {
        "active_calls": len(call_sessions),
        "sessions": list(call_sessions.keys())
    }

# Advanced features

@router.post("/process-speech")
async def process_speech_to_text(
    request: Request,
    CallSid: str = Form(...),
    RecordingUrl: str = Form(None)
):
    """
    Enhanced speech processing with Google Speech-to-Text
    This endpoint can be used for more accurate transcription
    """
    try:
        # In production, implement:
        # 1. Download audio from RecordingUrl
        # 2. Convert to appropriate format if needed
        # 3. Use Google Speech-to-Text API
        # 4. Return transcribed text
        
        # Placeholder implementation
        import requests
        
        if not RecordingUrl:
            raise HTTPException(status_code=400, detail="No recording URL provided")
        
        # Download recording (you'll need Exotel credentials)
        # response = requests.get(RecordingUrl, auth=(EXOTEL_SID, EXOTEL_TOKEN))
        
        # For now, return placeholder
        return {
            "transcription": "Sample transcription - integrate Google Speech-to-Text here",
            "confidence": 0.95
        }
        
    except Exception as e:
        logger.error(f"Error in speech processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/menu-selection")
@router.post("/menu-selection")
async def handle_menu_selection(
    request: Request,
    CallSid: str = None,
    Digits: str = None
):
    """Handle DTMF menu selections (supports both GET and POST)"""
    try:
        # Handle both query parameters (GET) and form data (POST)
        if request.method == "GET":
            params = dict(request.query_params)
            CallSid = params.get('CallSid', 'UNKNOWN')
            Digits = params.get('Digits')
        else:
            if not CallSid:
                form_data = await request.form()
                CallSid = form_data.get('CallSid', 'UNKNOWN')
                Digits = form_data.get('Digits')
        
        logger.info(f"Menu selection - CallSid: {CallSid}, Digits: {Digits}")
        
        menu_options = {
            '1': 'बैंकिंग की जानकारी के लिए',
            '2': 'बचत और बजट सलाह के लिए',
            '3': 'सरकारी योजनाओं के लिए',
            '4': 'खर्च ट्रैकिंग के लिए',
            '9': 'मुख्य मेनू पर वापस जाने के लिए'
        }
        
        if Digits in menu_options:
            response_msg = f"आपने {menu_options[Digits]} चुना है। कृपया अपना सवाल बोलें।"
            
            # Update session with selected category
            if CallSid in call_sessions:
                call_sessions[CallSid]['category'] = Digits
            
            xml_response = create_exotel_response(response_msg, gather_input=True)
        else:
            response_msg = "गलत विकल्प। कृपया 1 से 4 के बीच कोई नंबर दबाएं।"
            xml_response = create_exotel_response(response_msg, gather_input=True)
        
        return Response(content=xml_response, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"Error in menu selection: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emergency-help")
async def emergency_help(
    request: Request,
    CallSid: str = Form(...)
):
    """Provide emergency financial help information"""
    try:
        help_msg = """आपातकालीन वित्तीय सहायता के लिए:
पीएम केयर्स फंड: 1800-XXX-XXXX
बैंक हेल्पलाइन: आपके बैंक का टोल फ्री नंबर
साइबर क्राइम: 1930
हम आपको SMS से विवरण भेज रहे हैं।"""
        
        xml_response = create_exotel_response(help_msg, gather_input=False, end_call=True)
        return Response(content=xml_response, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"Error in emergency help: {e}")
        raise HTTPException(status_code=500, detail=str(e))
