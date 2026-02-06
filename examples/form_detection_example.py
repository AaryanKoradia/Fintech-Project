"""
Example: Using the Form Field Detection API

This script demonstrates how to use the form field detection feature
to detect fields in a form image and save the filled data.
"""

import requests
import base64
import json

# API Configuration
BASE_URL = "http://localhost:8000/api"
TOKEN = "your_jwt_token_here"  # Get this from login

headers = {
    "Authorization": f"Bearer {TOKEN}"
}


def detect_form_fields(image_path):
    """
    Detect fields in a form image
    
    Args:
        image_path: Path to the form image file
        
    Returns:
        Dictionary containing detected fields with bounding boxes
    """
    
    url = f"{BASE_URL}/document-scanner/detect-form-fields"
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, headers=headers, files=files)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.json())
        return None


def save_form_data(form_name, fields, image_url=None):
    """
    Save filled form data to database
    
    Args:
        form_name: Name/type of the form
        fields: Dictionary of field labels and values
        image_url: Optional base64 encoded image
        
    Returns:
        Response from server
    """
    
    url = f"{BASE_URL}/document-scanner/save-form-data"
    
    data = {
        "form_name": form_name,
        "fields": fields,
        "image_url": image_url
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.json())
        return None


def get_my_forms():
    """
    Get all saved forms for the current user
    
    Returns:
        List of saved forms
    """
    
    url = f"{BASE_URL}/document-scanner/my-forms"
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None


# Example Usage
if __name__ == "__main__":
    
    # Step 1: Detect fields in a form image
    print("🔍 Detecting form fields...")
    result = detect_form_fields("sample_form.jpg")
    
    if result and result.get('success'):
        print(f"✅ Detected {len(result['fields'])} fields")
        print(f"   Image size: {result['image_width']}x{result['image_height']}px")
        
        # Print detected fields
        print("\n📋 Detected Fields:")
        for i, field in enumerate(result['fields'], 1):
            print(f"   {i}. {field['label']}")
            print(f"      Position: ({field['bbox']['x']}, {field['bbox']['y']})")
            print(f"      Size: {field['bbox']['width']}x{field['bbox']['height']}px")
        
        # Step 2: Simulate filling the form
        print("\n✍️ Filling form fields...")
        filled_data = {}
        
        for field in result['fields']:
            label = field['label']
            
            # Simulate user input (in real app, user types this)
            if 'name' in label.lower():
                filled_data[label] = "Ramesh Kumar"
            elif 'email' in label.lower():
                filled_data[label] = "ramesh@example.com"
            elif 'phone' in label.lower() or 'mobile' in label.lower():
                filled_data[label] = "9876543210"
            elif 'address' in label.lower():
                filled_data[label] = "Village Rampur, District Varanasi, UP"
            elif 'age' in label.lower():
                filled_data[label] = "35"
            else:
                filled_data[label] = "Sample Data"
        
        print(f"✅ Filled {len(filled_data)} fields")
        
        # Step 3: Save the filled form
        print("\n💾 Saving form data...")
        save_result = save_form_data(
            form_name="Sample Application Form",
            fields=filled_data,
            image_url=result.get('image_url')
        )
        
        if save_result and save_result.get('success'):
            print(f"✅ Form saved successfully!")
            print(f"   Form ID: {save_result['form_id']}")
            print(f"   Fields saved: {save_result['fields_count']}")
        
        # Step 4: Retrieve saved forms
        print("\n📂 Retrieving saved forms...")
        my_forms = get_my_forms()
        
        if my_forms and my_forms.get('success'):
            print(f"✅ Found {my_forms['count']} saved forms")
            
            for form in my_forms['forms'][:3]:  # Show first 3
                print(f"\n   📝 {form['form_name']}")
                print(f"      ID: {form['_id']}")
                print(f"      Date: {form['created_at']}")
                print(f"      Fields: {len(form['fields'])}")
    
    else:
        print("❌ Failed to detect fields")


# Frontend Integration Example (JavaScript)
"""
// React Component Example

const FormFiller = () => {
  const [formFields, setFormFields] = useState(null);
  const [formData, setFormData] = useState({});

  const detectFields = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      '/document-scanner/detect-form-fields', 
      formData
    );
    
    setFormFields(response.data);
  };

  const saveForm = async () => {
    await api.post('/document-scanner/save-form-data', {
      form_name: 'User Form',
      fields: formData,
      image_url: formFields.image_url
    });
    
    alert('Form saved!');
  };

  return (
    <div style={{ position: 'relative' }}>
      <img src={formFields?.image_url} />
      
      {formFields?.fields.map(field => (
        <div
          key={field.label}
          style={{
            position: 'absolute',
            left: field.bbox.x,
            top: field.bbox.y,
            width: field.bbox.width,
            height: field.bbox.height,
            border: '2px solid blue'
          }}
        >
          <input
            type="text"
            placeholder={`Enter ${field.label}`}
            value={formData[field.label] || ''}
            onChange={(e) => 
              setFormData({...formData, [field.label]: e.target.value})
            }
          />
        </div>
      ))}
      
      <button onClick={saveForm}>Save Form</button>
    </div>
  );
};
"""
