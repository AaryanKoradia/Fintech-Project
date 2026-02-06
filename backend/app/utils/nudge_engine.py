"""
Daily AI Nudges Engine
Generates personalized daily action recommendations for users
Based on user profile, activity, and confidence score
"""

from datetime import datetime
from typing import List, Dict
import random


def generate_daily_nudges(user_data: dict, confidence_data: dict) -> List[Dict]:
    """
    Generate 1-3 daily action recommendations
    
    Args:
        user_data: User profile (age, occupation, village, etc.)
        confidence_data: Confidence score and breakdown
        
    Returns:
        List of nudge actions with icons and actions
    """
    nudges = []
    score = confidence_data.get("totalScore", 0)
    breakdown = confidence_data.get("breakdown", {})
    
    # Priority 1: Low confidence - complete lessons
    if score < 30 or breakdown.get("lessonsScore", 0) < 40:
        nudges.append({
            "id": "complete_lesson",
            "type": "lesson",
            "priority": "high",
            "title": {
                "en": "Complete your next financial lesson",
                "hi": "अपना अगला वित्तीय पाठ पूरा करें"
            },
            "description": {
                "en": "Build your knowledge step by step",
                "hi": "अपने ज्ञान को धीरे-धीरे बढ़ाएं"
            },
            "icon": "book",
            "action": "/learn",
            "actionText": {
                "en": "Start Learning",
                "hi": "सीखना शुरू करें"
            }
        })
    
    # Priority 2: Check eligible schemes
    if breakdown.get("schemesScore", 0) < 50:
        # Occupation-based scheme suggestions
        occupation = user_data.get("occupation", "").lower()
        scheme_hint = ""
        
        if "farmer" in occupation or "कृषि" in occupation or "किसान" in occupation:
            scheme_hint = "PM-KISAN"
        elif "student" in occupation or "छात्र" in occupation:
            scheme_hint = "Scholarship"
        else:
            scheme_hint = "Savings"
        
        nudges.append({
            "id": "check_scheme",
            "type": "scheme",
            "priority": "high",
            "title": {
                "en": f"You may be eligible for {scheme_hint} scheme",
                "hi": f"आप {scheme_hint} योजना के लिए पात्र हो सकते हैं"
            },
            "description": {
                "en": "Check government benefits for you",
                "hi": "आपके लिए सरकारी लाभ जांचें"
            },
            "icon": "landmark",
            "action": "/schemes",
            "actionText": {
                "en": "View Schemes",
                "hi": "योजनाएं देखें"
            }
        })
    
    # Priority 3: Practice banking conversations
    if breakdown.get("practiceScore", 0) < 50:
        nudges.append({
            "id": "practice_bank",
            "type": "practice",
            "priority": "medium",
            "title": {
                "en": "Practice talking to bank staff",
                "hi": "बैंक कर्मचारी से बात करने का अभ्यास करें"
            },
            "description": {
                "en": "Build confidence for real conversations",
                "hi": "वास्तविक बातचीत के लिए आत्मविश्वास बनाएं"
            },
            "icon": "comments",
            "action": "/bank-scripts",
            "actionText": {
                "en": "Start Practice",
                "hi": "अभ्यास शुरू करें"
            }
        })
    
    # Priority 4: Daily saving tip (always relevant)
    if len(nudges) < 3:
        daily_tips = [
            {
                "en": "Save at least ₹10 every day",
                "hi": "हर दिन कम से कम ₹10 बचाएं"
            },
            {
                "en": "Keep track of your daily expenses",
                "hi": "अपने दैनिक खर्चों का हिसाब रखें"
            },
            {
                "en": "Avoid unnecessary purchases today",
                "hi": "आज अनावश्यक खरीदारी से बचें"
            }
        ]
        
        tip = random.choice(daily_tips)
        nudges.append({
            "id": "daily_tip",
            "type": "tip",
            "priority": "low",
            "title": {
                "en": "Today's Money Saving Tip",
                "hi": "आज की पैसे बचाने की युक्ति"
            },
            "description": tip,
            "icon": "piggy-bank",
            "action": None,
            "actionText": {
                "en": "Got it!",
                "hi": "समझ गया!"
            }
        })
    
    # Priority 5: Update profile for better recommendations
    age = user_data.get("age")
    income = user_data.get("monthlyIncome")
    
    if not age or not income:
        nudges.insert(0, {
            "id": "update_profile",
            "type": "profile",
            "priority": "high",
            "title": {
                "en": "Complete your profile",
                "hi": "अपनी प्रोफाइल पूरी करें"
            },
            "description": {
                "en": "Get personalized scheme recommendations",
                "hi": "व्यक्तिगत योजना सुझाव प्राप्त करें"
            },
            "icon": "user",
            "action": "/profile",
            "actionText": {
                "en": "Update Profile",
                "hi": "प्रोफाइल अपडेट करें"
            }
        })
    
    # Return top 3 nudges
    return nudges[:3]


def get_contextual_message(user_data: dict) -> Dict:
    """
    Get personalized greeting based on time and user activity
    """
    hour = datetime.now().hour
    name = user_data.get("fullName", "").split()[0]
    
    if hour < 12:
        greeting = {
            "en": f"Good Morning, {name}!",
            "hi": f"सुप्रभात, {name}!"
        }
    elif hour < 17:
        greeting = {
            "en": f"Good Afternoon, {name}!",
            "hi": f"नमस्ते, {name}!"
        }
    else:
        greeting = {
            "en": f"Good Evening, {name}!",
            "hi": f"शुभ संध्या, {name}!"
        }
    
    # Activity-based message
    lessons_completed = user_data.get("lessonsCompleted", 0)
    
    if lessons_completed == 0:
        message = {
            "en": "Let's start your financial learning journey today!",
            "hi": "आइए आज अपनी वित्तीय शिक्षा यात्रा शुरू करें!"
        }
    elif lessons_completed < 5:
        message = {
            "en": "You're making good progress! Keep learning.",
            "hi": "आप अच्छी प्रगति कर रहे हैं! सीखते रहें।"
        }
    else:
        message = {
            "en": "Great job! You're becoming financially confident.",
            "hi": "शाबाश! आप वित्तीय रूप से आत्मविश्वासी बन रहे हैं।"
        }
    
    return {
        "greeting": greeting,
        "message": message
    }
