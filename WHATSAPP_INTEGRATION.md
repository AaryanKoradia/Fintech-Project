# WhatsApp Messaging Setup Guide

## Overview

The FinLit platform now includes WhatsApp messaging integration using **UltraMsg API**. This allows users to interact with the platform via WhatsApp instead of the web app.

---

## Features

### 🤖 Automated Command Responses

Users can interact via simple commands:

| Command | Response |
|---------|----------|
| `hi`, `hello`, `namaste` | Welcome message + language selection |
| `1` or `english` | Switch to English language |
| `2` or `hindi` | Switch to Hindi language |
| `help`, `menu` | Show all available commands |
| `learn`, `lessons` | View financial lessons |
| `schemes` | Government schemes information |
| `expense` | Expense tracking info |
| `advice` | AI financial advisor |
| `scan` | Document scanner info |
| `score` | Check confidence score |

### 📱 Supported Languages

- 🇬🇧 English
- 🇮🇳 हिन्दी (Hindi)

---

## Setup Instructions

### 1. **Get UltraMsg Account**

1. Visit https://ultramsg.com
2. Sign up for an account
3. Create a WhatsApp instance
4. Note your:
   - Instance ID (e.g., `instance161117`)
   - API Token (e.g., `cuzs4wytqcsvut0c`)

### 2. **Configure Environment Variables**

Add these to your `.env` file:

```bash
# WhatsApp Configuration (UltraMsg)
ULTRAMSG_INSTANCE=instance161117
ULTRAMSG_TOKEN=cuzs4wytqcsvut0c
```

### 3. **Install Dependencies**

```bash
cd backend
pip install -r requirements.txt
```

This will install the `requests` library needed for API calls.

### 4. **Configure Webhook**

In your UltraMsg dashboard:
1. Go to Settings → Webhooks
2. Set webhook URL to: `https://your-domain.com/api/whatsapp/webhook`
3. Enable webhooks for incoming messages
4. Save settings

---

## API Endpoints

### 1. **POST /api/whatsapp/webhook**

Receives incoming WhatsApp messages from UltraMsg.

**Request (from UltraMsg):**
```json
{
  "body": "hi",
  "from": "917058135626",
  "type": "chat",
  "fromMe": false
}
```

**Response:**
```json
{
  "status": "success",
  "message_sent": true
}
```

### 2. **POST /api/whatsapp/send-message**

Send a WhatsApp message to a user (requires authentication).

**Request:**
```json
{
  "to": "917058135626",
  "message": "Hello from FinLit!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "details": {
    "success": true,
    "status_code": 200
  }
}
```

### 3. **POST /api/whatsapp/broadcast**

Broadcast message to multiple users (admin only).

**Request:**
```json
{
  "message": "New scheme available!",
  "user_ids": ["user1", "user2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Broadcast completed: 45 sent, 2 failed",
  "results": {
    "total": 47,
    "sent": 45,
    "failed": 2
  }
}
```

### 4. **GET /api/whatsapp/test**

Test WhatsApp integration.

**Query Params:**
- `phone` (optional): Phone number to test (default: 917058135626)

**Response:**
```json
{
  "success": true,
  "message": "Test message sent",
  "details": {
    "success": true,
    "status_code": 200
  }
}
```

---

## How It Works

### User Flow

```
1. User sends "hi" to WhatsApp
   ↓
2. Webhook receives message
   ↓
3. Bot processes command
   ↓
4. Sends language selection menu
   ↓
5. User selects language (1 or 2)
   ↓
6. Bot sends main menu
   ↓
7. User interacts with commands
   ↓
8. Bot provides information/links
```

### Example Conversation

```
User: hi

Bot: 🙏 Welcome to FinLit - Financial Literacy Platform

Please select your preferred language:

1️⃣ English
2️⃣ हिन्दी (Hindi)

Reply with 1 for English or 2 for Hindi

---

User: 1

Bot: ✅ Language set to English

🎯 What would you like to do?

📚 learn - Financial literacy lessons
💰 schemes - Government schemes & benefits
📊 expense - Track your expenses
🤖 advice - Get AI financial advisor
📄 scan - Scan documents
📈 score - Check your confidence score

Reply with a keyword to continue!

---

User: schemes

Bot: 💰 Government Schemes & Benefits

🏛️ Popular Schemes:

1. 🌾 PM-KISAN - ₹6000/year for farmers
2. 🏠 PMAY - Housing for all
3. 💡 UJJWALA - Free LPG connection
...
```

---

## Testing

### Test via Postman

1. **Test Message Sending:**

```bash
POST http://localhost:8000/api/whatsapp/test?phone=917058135626
```

2. **Simulate Webhook:**

```bash
POST http://localhost:8000/api/whatsapp/webhook
Content-Type: application/json

{
  "body": "hi",
  "from": "917058135626",
  "type": "chat",
  "fromMe": false
}
```

### Test with Real WhatsApp

1. Get your UltraMsg webhook URL
2. Configure it in UltraMsg dashboard
3. Send "hi" to your UltraMsg WhatsApp number
4. Wait for automated response

---

## Command Handling Logic

The bot uses the `handle_command()` function to process user messages:

```python
def handle_command(message: str, user_phone: str) -> str:
    message_lower = message.lower().strip()
    
    if message_lower in ['hi', 'hello', 'hey', 'start']:
        return "Welcome message..."
    elif message_lower in ['1', 'english']:
        return "English menu..."
    elif message_lower in ['2', 'hindi']:
        return "Hindi menu..."
    # ... more commands
```

### Adding New Commands

To add a new command, simply add an `elif` block:

```python
elif message_lower in ['newcommand', 'nc']:
    return "Your response message here"
```

---

## Security Considerations

1. **Webhook Verification**: UltraMsg sends all webhooks with their signature
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **User Authentication**: Link WhatsApp phone to user accounts
4. **Data Privacy**: Don't send sensitive data via WhatsApp

---

## Limitations

### UltraMsg Free Tier

- Limited messages per month
- May have delays
- Basic features only

### Upgrade for Production

For production use, consider:
- UltraMsg paid plan
- WhatsApp Business API (official)
- Twilio WhatsApp API

---

## Frontend Integration

You can add WhatsApp functionality to your frontend:

```javascript
// Send WhatsApp message from frontend
const sendWhatsAppMessage = async (phone, message) => {
  const response = await api.post('/whatsapp/send-message', {
    to: phone,
    message: message
  });
  return response.data;
};

// Broadcast to all users (admin only)
const broadcastMessage = async (message) => {
  const response = await api.post('/whatsapp/broadcast', {
    message: message
  });
  return response.data;
};
```

---

## Database Schema

WhatsApp interactions are logged in user documents:

```javascript
{
  phone: "917058135626",
  whatsapp_interactions: [
    {
      timestamp: ISODate("2026-02-06T10:30:00Z"),
      user_message: "hi",
      bot_response: "Welcome message..."
    }
  ],
  last_whatsapp_interaction: ISODate("2026-02-06T10:30:00Z")
}
```

---

## Troubleshooting

### Messages Not Sending

1. Check UltraMsg token is correct
2. Verify instance is active
3. Check phone number format (no +)
4. Review UltraMsg dashboard for errors

### Webhook Not Working

1. Ensure webhook URL is publicly accessible
2. Check webhook is configured in UltraMsg
3. Verify HTTPS (required for webhooks)
4. Check server logs for errors

### Commands Not Working

1. Check command spelling
2. Commands are case-insensitive
3. Review `handle_command()` function
4. Check bot logs

---

## Future Enhancements

### Planned Features

1. **User Registration via WhatsApp**
   - Create account via WhatsApp
   - Link phone to user ID

2. **Expense Tracking via WhatsApp**
   - Send "expense 500 food" to track
   - Get monthly reports

3. **Quiz via WhatsApp**
   - Take financial quizzes
   - Get instant results

4. **Scheme Application**
   - Apply for schemes via WhatsApp
   - Get status updates

5. **AI Advisor Integration**
   - Ask questions directly
   - Get personalized advice

6. **Media Support**
   - Send images for document scanning
   - Receive infographics

---

## Production Checklist

- [ ] Configure production WhatsApp number
- [ ] Set up proper webhook URL
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement user linking
- [ ] Set up monitoring
- [ ] Add error handling
- [ ] Configure backup for failed messages
- [ ] Test all commands
- [ ] Train support team

---

## Support

For WhatsApp integration issues:
1. Check UltraMsg documentation: https://docs.ultramsg.com
2. Review server logs
3. Test with `/api/whatsapp/test` endpoint
4. Contact UltraMsg support

---

## Status

✅ **Fully Implemented and Ready to Use**

All WhatsApp messaging features are configured and ready for testing!
