# 🚀 WhatsApp Integration Quick Start

## 📱 Setup in 5 Minutes

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

Add to your `.env` file:

```env
ULTRAMSG_INSTANCE=instance161117
ULTRAMSG_TOKEN=cuzs4wytqcsvut0c
```

### Step 3: Start the Server

```bash
python -m uvicorn app.main:app --reload
```

### Step 4: Test WhatsApp

```bash
# Run test script
python test_whatsapp.py
```

Or use the API:

```bash
http://localhost:8000/api/whatsapp/test?phone=917058135626
```

---

## 🎯 How Users Interact

### Via WhatsApp

User sends to your WhatsApp bot number:

```
User: hi
```

Bot responds:

```
🙏 Welcome to FinLit

Please select your language:
1️⃣ English
2️⃣ हिन्दी (Hindi)

Reply with 1 or 2
```

User continues:

```
User: 1
```

Bot sends menu:

```
✅ Language set to English

What would you like to do?

📚 learn - Financial lessons
💰 schemes - Government schemes
📊 expense - Track expenses
🤖 advice - AI advisor
```

---

## 📋 Available Commands

| Command | Action |
|---------|--------|
| `hi` / `hello` | Start conversation |
| `1` / `english` | English menu |
| `2` / `hindi` | Hindi menu |
| `learn` | Financial lessons |
| `schemes` | Government schemes |
| `expense` | Expense tracking |
| `advice` | AI financial advisor |
| `scan` | Document scanner |
| `score` | Confidence score |
| `help` / `menu` | Show all commands |

---

## 🔧 API Endpoints

### Send Message

```http
POST /api/whatsapp/send-message
Authorization: Bearer <token>

{
  "to": "917058135626",
  "message": "Hello from FinLit!"
}
```

### Broadcast (Admin only)

```http
POST /api/whatsapp/broadcast
Authorization: Bearer <admin-token>

{
  "message": "New scheme available!"
}
```

### Webhook (Receives messages)

```http
POST /api/whatsapp/webhook

{
  "body": "hi",
  "from": "917058135626",
  "type": "chat"
}
```

---

## 🎨 Customizing Responses

Edit [whatsapp.py](backend/app/routes/whatsapp.py):

```python
def handle_command(message: str, user_phone: str) -> str:
    message_lower = message.lower().strip()
    
    # Add your custom command
    if message_lower in ['custom', 'mycmd']:
        return "Your custom response here!"
```

---

## 🔗 Configure Webhook

1. Go to UltraMsg dashboard: https://ultramsg.com
2. Settings → Webhooks
3. Set URL: `https://your-domain.com/api/whatsapp/webhook`
4. Enable webhooks
5. Save

---

## ✅ Testing Checklist

- [ ] Dependencies installed
- [ ] .env configured
- [ ] Server running
- [ ] Test endpoint works
- [ ] WhatsApp message received
- [ ] Commands respond correctly
- [ ] Webhook configured
- [ ] Real WhatsApp test done

---

## 📝 Example Conversation Flow

```
User: hi
Bot: [Welcome + Language selection]

User: 1
Bot: [English menu]

User: schemes
Bot: [Government schemes list]
     - PM-KISAN
     - PMAY
     - UJJWALA
     ...
     Visit: https://finlit-app.com/schemes

User: learn
Bot: [Financial lessons]
     - Savings
     - Banking
     - Budget
     ...
     Visit: https://finlit-app.com/lessons

User: help
Bot: [Full menu of commands]
```

---

## 🚀 Status

**✅ Fully implemented and ready to use!**

All WhatsApp features are working. Just configure your UltraMsg credentials and start testing!

---

## 📞 Support

Need help? Check:
- [WHATSAPP_INTEGRATION.md](WHATSAPP_INTEGRATION.md) - Full documentation
- UltraMsg docs: https://docs.ultramsg.com
- Test script: `python backend/test_whatsapp.py`
