from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.utils.auth import get_current_user
import google.generativeai as genai
import os
from PIL import Image
import io
import base64
from typing import Dict, Any
import re

router = APIRouter()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload and analyze document images (Aadhaar, PAN, Bank Passbook, Scheme Details)
    Extracts text using Gemini Vision and provides AI analysis
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image file
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Use Gemini Vision model for text extraction
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Extract text from image
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
        
        # Analyze the extracted data
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
        
        # Detect document type and extract structured data
        doc_type = detect_document_type(extracted_text)
        structured_data = extract_structured_data(extracted_text, doc_type)
        
        return {
            "success": True,
            "documentType": doc_type,
            "extractedText": extracted_text,
            "aiAnalysis": ai_analysis,
            "structuredData": structured_data,
            "imagePreview": f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode()}"
        }
        
    except Exception as e:
        print(f"Document scanner error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")


def detect_document_type(text: str) -> str:
    """Detect document type from extracted text"""
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
    """Extract structured data based on document type"""
    data = {
        "type": doc_type,
        "fields": []
    }
    
    # Extract PAN number (format: ABCDE1234F)
    pan_match = re.search(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b', text)
    if pan_match:
        data["fields"].append({
            "label": "PAN Number",
            "value": pan_match.group(),
            "icon": "credit-card"
        })
    
    # Extract account numbers (9-18 digits, excluding phone numbers)
    account_match = re.search(r'\b\d{9,18}\b', text)
    if account_match:
        data["fields"].append({
            "label": "Account Number",
            "value": account_match.group(),
            "icon": "university"
        })
    
    # Extract amounts (₹ or Rs.)
    amounts = re.findall(r'(?:₹|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d{2})?)', text)
    if amounts:
        for i, amount in enumerate(amounts[:3]):  # Max 3 amounts
            data["fields"].append({
                "label": f"Amount {i+1}",
                "value": f"₹{amount}",
                "icon": "money"
            })
    
    # Extract dates (DD/MM/YYYY or DD-MM-YYYY)
    dates = re.findall(r'\b\d{2}[/-]\d{2}[/-]\d{4}\b', text)
    if dates:
        data["fields"].append({
            "label": "Date",
            "value": dates[0],
            "icon": "calendar"
        })
    
    # Extract names (capitalize words after common prefixes)
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
