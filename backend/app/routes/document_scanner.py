from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.utils.auth import get_current_user
from app.database import get_collection, FILLED_FORMS_COLLECTION
from app.services.event_tracker import track_document_scan
import google.generativeai as genai
import os
from PIL import Image
import io
import base64
from typing import Dict, Any
import re
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class FormDataSubmission(BaseModel):
    form_name: str
    fields: Dict[str, str]
    image_url: str = None

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        extraction_prompt = """
        Analyze this document image carefully. It could be:
        - Aadhaar Card
        - PAN Card
        - Bank Passbook
        - Government Scheme Details
        - Any financial document
        
        Extract ALL text you can see in the image. Include:
        1. Document Type
        2. All numbers (ID numbers, account numbers, amounts)
        3. Names
        4. Dates
        5. Addresses
        6. Any other visible text
        
        Format the output clearly with labels.
        """
        
        response = model.generate_content([extraction_prompt, image])
        extracted_text = response.text
        analysis_prompt = f"""
        Based on this extracted document data, provide analysis:
        
        {extracted_text}
        
        Provide:
        1. Document Type identified
        2. Key Information Summary (keep it SHORT - 3-4 points only)
        3. Financial Insights (if applicable - 2-3 points only)
        4. Suggestions for rural users in simple language (2-3 practical tips only)
        
        Keep responses VERY SHORT and practical. Use simple Hindi/English mixed language suitable for rural India.
        If it's Aadhaar/PAN - suggest how to use it for schemes.
        If it's passbook - suggest savings habits.
        If it's scheme details - explain benefits simply.
        """
        
        analysis_response = model.generate_content(analysis_prompt)
        ai_analysis = analysis_response.text
        doc_type = detect_document_type(extracted_text)
        structured_data = extract_structured_data(extracted_text, doc_type)
        await track_document_scan(user_id=current_user["sub"], document_type=doc_type, success=True, metadata={"file_name": file.filename})
        
        return {
            "success": True,
            "documentType": doc_type,
            "extractedText": extracted_text,
            "aiAnalysis": ai_analysis,
            "structuredData": structured_data,
            "imagePreview": f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode()}"
        }
        
    except Exception as e:
        await track_document_scan(
            user_id=current_user["sub"],
            document_type="unknown",
            success=False,
            metadata={"error": str(e)}
        )
        print(f"Document scanner error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")


@router.post("/detect-form-fields")
async def detect_form_fields(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        img_width, img_height = image.size
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        detection_prompt = """
        Analyze this paper form image carefully. You are detecting INPUT FIELDS (blank spaces where users write).

        CRITICAL INSTRUCTIONS:
        1. Detect ONLY the blank input areas (lines, boxes, spaces) - NOT the labels
        2. The bounding box should cover ONLY the writeable area
        3. Exclude the field labels from the bounding box
        4. Be VERY PRECISE with coordinates
        
        For each input field:
        - Look for blank lines (________), empty boxes (□), or blank spaces
        - Measure the EXACT position of the blank area only
        - The label is usually to the LEFT or ABOVE the blank space
        - Don't include the label text in the bounding box
        
        Identify field types from nearby labels:
        - Name / नाम / Name in English
        - Email / Email ID / ईमेल
        - Phone Number / Mobile / Phone / फोन / मोबाइल
        - Address / पता / निवासी पत्ता
        - Date / तारीख / Date of Birth / DOB / जन्म तिथि
        - Age / आयु / उम्र / वय
        - Gender / लिंग / Sex
        - Father's Name / पिता का नाम
        - Mother's Name / माता का नाम  
        - Guardian / अभिभावक
        - Aadhar Number / आधार संख्या / आधार क्रमांक
        - Account Number / खाता संख्या
        - Amount / राशि / रक्कम
        - Signature / हस्ताक्षर / सही
        - Standard / Class / इयत्ता / वर्ग
        - School / College / शाळा / कॉलेज
        - Residential Address / निवास पत्ता
        - Any other labeled input field

        For bounding box coordinates:
        - Origin (0,0) is top-left corner
        - x = pixels from left edge to START of blank area
        - y = pixels from top edge to START of blank area  
        - width = horizontal length of blank area ONLY
        - height = vertical height of blank area ONLY
        - Add 5-10px padding to make fields easier to click
        
        Output ONLY valid JSON:
        {{
          "image_width": {img_width},
          "image_height": {img_height},
          "fields": [
            {{
              "label": "Name",
              "bbox": {{
                "x": 120,
                "y": 85,
                "width": 280,
                "height": 25
              }}
            }}
          ]
        }}

        Rules:
        - Output ONLY JSON, no markdown, no explanation
        - Detect BLANK INPUT AREAS, not labels
        - If label is in Hindi, translate to English
        - Exclude pre-printed text from bbox
        - Be extremely precise with measurements
        - Skip any fields you're unsure about
        """
        
        response = model.generate_content([detection_prompt, image])
        response_text = response.text.strip()
    
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        elif response_text.startswith('```'):
            response_text = response_text[3:]
        
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        import json
        field_data = json.loads(response_text)
        
        if not isinstance(field_data, dict):
            raise ValueError("Invalid response format")
        
        if 'fields' not in field_data:
            field_data['fields'] = []
        
        field_data['image_width'] = img_width
        field_data['image_height'] = img_height
        img_base64 = base64.b64encode(image_bytes).decode()
        
        return {
            "success": True,
            "image_url": f"data:image/jpeg;base64,{img_base64}",
            "image_width": img_width,
            "image_height": img_height,
            "fields": field_data.get('fields', [])
        }
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print(f"Response text: {response_text}")
        raise HTTPException(status_code=500, detail="Error parsing AI response. The form may be too complex or unclear.")
    except Exception as e:
        print(f"Form field detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error detecting form fields: {str(e)}")

@router.post("/save-form-data")
async def save_form_data(form_data: FormDataSubmission, current_user: dict = Depends(get_current_user)):
    try:
        saved_form = {
            "user_id": current_user["id"],
            "user_email": current_user["email"],
            "form_name": form_data.form_name,
            "fields": form_data.fields,
            "image_url": form_data.image_url,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        filled_forms_collection = get_collection(FILLED_FORMS_COLLECTION)
        result = await filled_forms_collection.insert_one(saved_form)
        
        return {
            "success": True,
            "message": "Form data saved successfully",
            "form_id": str(result.inserted_id),
            "fields_count": len(form_data.fields)
        }
        
    except Exception as e:
        print(f"Save form data error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving form data: {str(e)}")


@router.get("/my-forms")
async def get_my_forms(current_user: dict = Depends(get_current_user)):
    try:
        forms = []
        filled_forms_collection = get_collection(FILLED_FORMS_COLLECTION)
        cursor = filled_forms_collection.find({"user_id": current_user["id"]}).sort("created_at", -1)
        
        async for form in cursor:
            form["_id"] = str(form["_id"])
            forms.append(form)
        
        return {
            "success": True,
            "forms": forms,
            "count": len(forms)
        }
        
    except Exception as e:
        print(f"Get forms error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving forms: {str(e)}")


def detect_document_type(text: str) -> str:
    text_lower = text.lower()
    
    if 'aadhaar' in text_lower or 'आधार' in text_lower:
        return 'Aadhaar Card'
    elif 'pan' in text_lower or 'income tax' in text_lower:
        return 'PAN Card'
    elif 'bank' in text_lower or 'passbook' in text_lower or 'account' in text_lower:
        return 'Bank Passbook'
    elif 'scheme' in text_lower or 'yojana' in text_lower or 'योजना' in text_lower:
        return 'Government Scheme'
    else:
        return 'Financial Document'


def extract_structured_data(text: str, doc_type: str) -> Dict[str, Any]:
    data = {
        "type": doc_type,
        "fields": []
    }
    
    pan_match = re.search(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b', text)
    if pan_match:
        data["fields"].append({
            "label": "PAN Number",
            "value": pan_match.group(),
            "icon": "credit-card"
        })
    
    account_match = re.search(r'\b\d{9,18}\b', text)
    if account_match:
        data["fields"].append({
            "label": "Account Number",
            "value": account_match.group(),
            "icon": "university"
        })
    amounts = re.findall(r'(?:₹|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d{2})?)', text)
    if amounts:
        for i, amount in enumerate(amounts[:3]):  # Max 3 amounts
            data["fields"].append({
                "label": f"Amount {i+1}",
                "value": f"₹{amount}",
                "icon": "money"
            })
    
    dates = re.findall(r'\b\d{2}[/-]\d{2}[/-]\d{4}\b', text)
    if dates:
        data["fields"].append({
            "label": "Date",
            "value": dates[0],
            "icon": "calendar"
        })
    
    name_patterns = [
        r'Name[:\s]+([A-Z][a-zA-Z\s]+)',
        r'नाम[:\s]+([A-Z][a-zA-Z\s]+)',
    ]
    for pattern in name_patterns:
        name_match = re.search(pattern, text)
        if name_match:
            data["fields"].append({
                "label": "Name",
                "value": name_match.group(1).strip(),
                "icon": "user"
            })
            break
    
    return data
