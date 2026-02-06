import requests
import json
from urllib.parse import urlencode

BASE_URL = "http://localhost:8000/api/voice-call"
CALL_SID = "TEST_CALL_123"
FROM_NUMBER = "+919876543210"

def test_incoming_call():
    print("\nTesting Incoming Call Endpoint...")
    
    data = {
        "CallSid": CALL_SID,
        "From": FROM_NUMBER,
        "To": "+911234567890",
        "CallStatus": "ringing"
    }
    
    response = requests.post(f"{BASE_URL}/incoming-call", data=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response (XML):\n{response.text[:500]}...")
    
    return response.status_code == 200

def test_process_input():
    print("\nTesting Process Input Endpoint...")
    
    data = {
        "CallSid": CALL_SID,
        "RecordingUrl": "https://example.com/recording.wav",
        "RecordingDuration": "10"
    }
    
    response = requests.post(f"{BASE_URL}/process-input", data=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response (XML):\n{response.text[:500]}...")
    
    return response.status_code == 200

def test_menu_selection():
    print("\nTesting Menu Selection Endpoint...")
    
    data = {
        "CallSid": CALL_SID,
        "Digits": "1"
    }
    
    response = requests.post(f"{BASE_URL}/menu-selection", data=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response (XML):\n{response.text[:500]}...")
    
    return response.status_code == 200

def test_call_status():
    print("\nTesting Call Status Endpoint...")
    
    data = {
        "CallSid": CALL_SID,
        "CallStatus": "completed",
        "CallDuration": "120"
    }
    
    response = requests.post(f"{BASE_URL}/call-status", data=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    return response.status_code == 200

def test_active_sessions():
    print("\nTesting Active Sessions Endpoint...")
    
    response = requests.get(f"{BASE_URL}/active-sessions")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200

def test_emergency_help():
    print("\nTesting Emergency Help Endpoint...")
    
    data = {
        "CallSid": CALL_SID
    }
    
    response = requests.post(f"{BASE_URL}/emergency-help", data=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response (XML):\n{response.text[:500]}...")
    
    return response.status_code == 200

def main():
    print("=" * 60)
    print("Voice Call Integration Test Suite")
    print("=" * 60)
    
    tests = [
        ("Incoming Call", test_incoming_call),
        ("Process Input", test_process_input),
        ("Menu Selection", test_menu_selection),
        ("Active Sessions", test_active_sessions),
        ("Emergency Help", test_emergency_help),
        ("Call Status", test_call_status),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, "PASSED" if success else "FAILED"))
        except Exception as e:
            results.append((test_name, f"ERROR: {str(e)}"))
    
    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    for test_name, result in results:
        print(f"{test_name:<25} {result}")
    
    print("=" * 60)
    
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("Server is running!")
        else:
            print("Server responded but health check failed")
    except Exception as e:
        print("Server is not running or not accessible")
        print(f"Error: {e}")
        print("\nStart server with: uvicorn app.main:app --reload")

if __name__ == "__main__":
    main()
