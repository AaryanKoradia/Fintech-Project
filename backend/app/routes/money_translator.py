from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import re

router = APIRouter()

class TranslateRequest(BaseModel):
    sms_text: str
    language: str = "hi" 

class TranslateResponse(BaseModel):
    simple_explanation: str
    risk_level: str  
    next_action: str
    original_text: str

BANK_PHRASES = {
    "emi.*overdue": {
        "en": "Your monthly loan payment is late. You will get charged extra.",
        "hi": "Aapki maasik loan payment der se hai. Aapko extra charge lagega.",
        "risk": "high",
        "action_en": "Pay your EMI as soon as possible to avoid extra charges",
        "action_hi": "Jitni jaldi ho sake EMI bharein, extra charge se bachne ke liye"
    },
    "emi.*capitalized": {
        "en": "You missed EMI payment. Now interest will be charged on the missed interest too.",
        "hi": "Aapne EMI nahi bhari. Ab interest par bhi interest lagega.",
        "risk": "high",
        "action_en": "Contact bank immediately or pay the EMI now",
        "action_hi": "Bank se turant baat karein ya EMI bhariye"
    },
    "penal.*interest": {
        "en": "You are being charged penalty because payment was late.",
        "hi": "Aapko jurmana lag raha hai kyunki payment der se hui.",
        "risk": "high",
        "action_en": "Pay immediately to stop more penalties",
        "action_hi": "Turant payment karein, aur penalty se bachein"
    },
    "debited.*rs|debited.*inr|withdrawn": {
        "en": "Money has been taken out from your account.",
        "hi": "Aapke account se paisa nikal gaya hai.",
        "risk": "medium",
        "action_en": "Check if this transaction was done by you",
        "action_hi": "Check karein ki yeh transaction aapne kiya tha"
    },
    "default|loan.*overdue|payment.*default": {
        "en": "Your loan payment is very late. This is serious and can affect your future loans.",
        "hi": "Aapki loan payment bahut der se hai. Yeh serious hai aur aapke future loans ko affect karega.",
        "risk": "high",
        "action_en": "Pay immediately or talk to bank officer today",
        "action_hi": "Aaj hi payment karein ya bank officer se baat karein"
    },
    "credited.*rs|credited.*inr|subsidy.*credited": {
        "en": "Money has been added to your account. This is good news!",
        "hi": "Aapke account mein paisa aaya hai. Yeh achhi khabar hai!",
        "risk": "low",
        "action_en": "Check your account balance to confirm",
        "action_hi": "Apna account balance check karein"
    },
    "minimum.*balance|insufficient.*balance": {
        "en": "Your account has less money than required. Bank may charge fees.",
        "hi": "Aapke account mein zaroori se kam paisa hai. Bank charge le sakta hai.",
        "risk": "medium",
        "action_en": "Add money to your account soon",
        "action_hi": "Jald se jald account mein paisa dalein"
    },
    "otp|one.*time.*password": {
        "en": "This is a security code. Do NOT share this with anyone, even bank staff.",
        "hi": "Yeh security code hai. Isko KISI se bhi share mat karein, bank wale se bhi nahi.",
        "risk": "medium",
        "action_en": "Use this code only if you started a transaction yourself",
        "action_hi": "Yeh code tabhi use karein jab aapne khud transaction shuru ki ho"
    },
    "card.*blocked|account.*blocked": {
        "en": "Your card or account has been stopped. You cannot use it right now.",
        "hi": "Aapka card ya account band kar diya gaya hai. Aap abhi use nahi kar sakte.",
        "risk": "high",
        "action_en": "Call bank customer care immediately",
        "action_hi": "Turant bank customer care ko call karein"
    },
    "interest.*rate.*revised|rate.*change": {
        "en": "The interest rate on your loan or account has changed.",
        "hi": "Aapke loan ya account par interest rate badal gaya hai.",
        "risk": "medium",
        "action_en": "Check your new EMI amount or interest earned",
        "action_hi": "Apni nayi EMI ya interest check karein"
    }
}

def translate_sms(sms_text: str, language: str = "hi") -> dict:
    sms_lower = sms_text.lower()
    
    for pattern, translation in BANK_PHRASES.items():
        if re.search(pattern, sms_lower):
            explanation = translation.get(language, translation["en"])
            risk = translation["risk"]
            action = translation.get(f"action_{language}", translation["action_en"])
            
            return {
                "simple_explanation": explanation,
                "risk_level": risk,
                "next_action": action,
                "original_text": sms_text
            }
    
    generic_responses = {
        "en": "This is a message from your bank. If you don't understand it, visit the bank branch or call customer care.",
        "hi": "Yeh aapke bank ka message hai. Agar samajh nahi aa raha, bank branch jaayen ya customer care ko call karein.",
        "action_en": "Visit your bank branch or call customer care for help",
        "action_hi": "Bank branch jaayen ya customer care se madad lein"
    }
    
    return {
        "simple_explanation": generic_responses[language],
        "risk_level": "medium",
        "next_action": generic_responses[f"action_{language}"],
        "original_text": sms_text
    }

@router.post("/translate-money-text", response_model=TranslateResponse)
async def translate_money_text(request: TranslateRequest):
    if not request.sms_text or len(request.sms_text.strip()) < 5:
        raise HTTPException(status_code=400, detail="SMS text is too short or empty")
    
    translation = translate_sms(request.sms_text, request.language)
    return translation

SAMPLE_SMS_MESSAGES = [
    "Dear Customer, Your EMI of Rs.3,500 is overdue. Penal interest @2% will be charged. Please pay immediately to avoid further action. -HDFC Bank",
    "Your A/c XX1234 debited with Rs.5,000 on 07-Feb-26. Available balance: Rs.2,340. -SBI",
    "Alert! Your loan payment is in default. Immediate action required to avoid legal consequences. Contact us at 1800-XXX-XXXX. -Axis Bank",
    "Good news! PM-KISAN subsidy of Rs.2,000 has been credited to your account XX5678. -ICICI Bank",
    "Your EMI has been capitalized due to non-payment. Interest will now be charged on accumulated interest. -Kotak Bank"
]
