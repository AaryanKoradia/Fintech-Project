import requests

url = "http://localhost:8000/api/schemes"
login_url = "http://localhost:8000/api/auth/login"
login_data = {
    "email": "admin@finlit.com",  
    "password": "admin123"
}

try:
    print("Logging in...")
    login_response = requests.post(login_url, json=login_data)
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        print("Login successful!")
        print("\nFetching schemes...")
        headers = {"Authorization": f"Bearer {token}"}
        schemes_response = requests.get(url, headers=headers)
        
        if schemes_response.status_code == 200:
            schemes = schemes_response.json()
            print(f"\nSuccessfully fetched {len(schemes)} schemes!")
            print("\nFirst 5 schemes:")
            for i, scheme in enumerate(schemes[:5], 1):
                print(f"\n{i}. {scheme['name']}")
                print(f"   Category: {scheme['category']}")
                print(f"   Description: {scheme['description'][:100]}...")
            categories = {}
            for scheme in schemes:
                cat = scheme['category']
                categories[cat] = categories.get(cat, 0) + 1
            
            print("\nSchemes by category:")
            for cat, count in categories.items():
                print(f"   {cat}: {count} schemes")
        else:
            print(f"Failed to fetch schemes: {schemes_response.status_code}")
            print(schemes_response.text)
    else:
        print(f"Login failed: {login_response.status_code}")
        print(login_response.text)
        
except requests.exceptions.ConnectionError:
    print("Could not connect to the server. Make sure:")
    print("   1. Backend server is running (uvicorn main:app)")
    print("   2. MongoDB is running")
except Exception as e:
    print(f"Error: {e}")
