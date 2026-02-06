"""
Quick test script for WhatsApp integration
Run this to test WhatsApp message sending
"""

import requests

# Configuration
BASE_URL = "http://localhost:8000/api"
PHONE = "917058135626"  # Change to your test phone number

def test_send_message():
    """Test sending a WhatsApp message"""
    print("🧪 Testing WhatsApp Message...")
    
    url = f"{BASE_URL}/whatsapp/test?phone={PHONE}"
    
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.json().get("success"):
        print("✅ Message sent successfully!")
    else:
        print("❌ Failed to send message")


def test_webhook():
    """Test webhook command processing"""
    print("\n🧪 Testing Webhook Commands...")
    
    test_commands = [
        "hi",
        "1",
        "learn",
        "schemes",
        "help"
    ]
    
    for command in test_commands:
        print(f"\n📤 Testing command: '{command}'")
        
        url = f"{BASE_URL}/whatsapp/webhook"
        payload = {
            "body": command,
            "from": PHONE,
            "type": "chat",
            "fromMe": False
        }
        
        response = requests.post(url, json=payload)
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        
        if result.get("status") == "success":
            print(f"✅ Command processed: {command}")
        else:
            print(f"❌ Command failed: {command}")


if __name__ == "__main__":
    print("=" * 50)
    print("WhatsApp Integration Test")
    print("=" * 50)
    
    # Test 1: Direct message sending
    test_send_message()
    
    # Test 2: Webhook command processing
    test_webhook()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")
    print("=" * 50)
    print("\n💡 Next steps:")
    print("1. Check your WhatsApp for the test message")
    print("2. Configure webhook in UltraMsg dashboard")
    print("3. Send 'hi' to your WhatsApp bot number")
    print("4. Test all commands!")
