import requests

BASE_URL = "http://localhost:8000/api"
YOUR_PHONE = "917058135626"  

def simulate_user_message(message):
    print(f"\nUser sends: {message}")
    print("-" * 50)
    
    url = f"{BASE_URL}/whatsapp/webhook"
    payload = {
        "body": message,
        "from": YOUR_PHONE,
        "type": "chat",
        "fromMe": False
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        print("Bot processed the message!")
        print("Bot will send this response to WhatsApp:")
        print("-" * 50)
        
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    print("=" * 50)
    print("WhatsApp Bot Conversation Simulator")
    print("=" * 50)
    print("Watch your WhatsApp - messages should arrive!")
    print()
    simulate_user_message("hi")
    input("Check WhatsApp, then press Enter to continue...")
    
    simulate_user_message("1")
    input("Check WhatsApp, then press Enter to continue...")
    
    simulate_user_message("schemes")
    input("Check WhatsApp, then press Enter to continue...")
    
    simulate_user_message("help")
    
    print("\n" + "=" * 50)
    print("Conversation simulation complete!")
    print("=" * 50)
