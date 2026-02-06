"""
Financial Confidence Score Calculator
Calculates user confidence score (0-100) based on:
- Lessons completed
- Scheme awareness
- Banking practice usage
- Platform engagement
"""

def calculate_confidence_score(user_data):
    """
    Calculate financial confidence score for a user
    
    Args:
        user_data (dict): User profile and activity data
        
    Returns:
        dict: Score breakdown and total
    """
    
    # Component weights
    LESSONS_WEIGHT = 0.35      # 35%
    SCHEMES_WEIGHT = 0.25      # 25%
    PRACTICE_WEIGHT = 0.20     # 20%
    ENGAGEMENT_WEIGHT = 0.20   # 20%
    
    # Lessons Score (0-100)
    lessons_completed = user_data.get('lessonsCompleted', 0)
    lessons_score = min(100, (lessons_completed / 10) * 100)  # 10 lessons = 100%
    
    # Schemes Awareness Score (0-100)
    schemes_viewed = user_data.get('schemesViewed', 0)
    schemes_score = min(100, (schemes_viewed / 5) * 100)  # 5 schemes = 100%
    
    # Practice Score (0-100)
    practice_sessions = user_data.get('practiceSessions', 0)
    practice_score = min(100, (practice_sessions / 5) * 100)  # 5 practices = 100%
    
    # Engagement Score (0-100)
    # Based on login frequency and activity
    days_active = user_data.get('daysActive', 0)
    last_login_days_ago = user_data.get('lastLoginDaysAgo', 999)
    
    # Active days score
    engagement_score = min(100, (days_active / 15) * 100)  # 15 days = 100%
    
    # Penalty for inactivity
    if last_login_days_ago > 7:
        engagement_score *= 0.5
    elif last_login_days_ago > 3:
        engagement_score *= 0.8
    
    # Calculate weighted total
    total_score = int(
        (lessons_score * LESSONS_WEIGHT) +
        (schemes_score * SCHEMES_WEIGHT) +
        (practice_score * PRACTICE_WEIGHT) +
        (engagement_score * ENGAGEMENT_WEIGHT)
    )
    
    # Get confidence level
    confidence_level = get_confidence_level(total_score)
    
    return {
        "totalScore": total_score,
        "level": confidence_level,
        "breakdown": {
            "lessonsScore": int(lessons_score),
            "schemesScore": int(schemes_score),
            "practiceScore": int(practice_score),
            "engagementScore": int(engagement_score)
        }
    }


def get_confidence_level(score):
    """Get confidence level text based on score"""
    if score >= 80:
        return "expert"
    elif score >= 60:
        return "high"
    elif score >= 30:
        return "medium"
    else:
        return "low"


def get_improvement_suggestions(breakdown):
    """
    Get personalized suggestions to improve confidence score
    
    Args:
        breakdown (dict): Score breakdown
        
    Returns:
        list: List of improvement suggestions
    """
    suggestions = []
    
    if breakdown["lessonsScore"] < 70:
        suggestions.append({
            "type": "lessons",
            "priority": "high",
            "action": "complete_lessons"
        })
    
    if breakdown["schemesScore"] < 50:
        suggestions.append({
            "type": "schemes",
            "priority": "medium",
            "action": "explore_schemes"
        })
    
    if breakdown["practiceScore"] < 50:
        suggestions.append({
            "type": "practice",
            "priority": "high",
            "action": "practice_banking"
        })
    
    if breakdown["engagementScore"] < 60:
        suggestions.append({
            "type": "engagement",
            "priority": "low",
            "action": "stay_active"
        })
    
    return suggestions
