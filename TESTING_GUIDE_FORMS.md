# Quick Start Guide: Form Field Detection

## 🚀 Getting Started

### Prerequisites
- Backend server running on port 8000
- Frontend running on development server
- Google Gemini API key configured
- User account created and logged in

---

## 📝 Step-by-Step Testing

### 1. **Start the Servers**

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 2. **Login to Application**

Navigate to `http://localhost:5173` and login with your credentials.

### 3. **Navigate to Document Scanner**

Click on "Document Scanner" from the navigation menu or sidebar.

### 4. **Switch to Form Fill Mode**

You'll see two mode buttons:
- 📄 **Scan Document** (default)
- ✍️ **Fill Form** (click this)

Click on "✍️ Fill Form" button.

### 5. **Upload a Form Image**

Two options:
- **Choose from Gallery**: Click to select an image from your device
- **Open Camera**: Take a photo of a paper form

Good test forms:
- Government application forms
- Bank account opening forms
- Job application forms
- School admission forms
- Any form with labeled blank fields

### 6. **Detect Fields**

After uploading, click **"Detect Fields"** button.

Wait for processing (3-5 seconds). You'll see:
- Green bordered boxes over detected fields
- Field count in the header
- Interactive input boxes overlaid on the form

### 7. **Fill in the Data**

Click inside any detected field and start typing:
- Name
- Email
- Phone number
- Address
- Any other detected fields

The data is saved in real-time to the `formData` state.

### 8. **Save the Form**

Click the **"Save"** button in the top-right corner.

You'll see a success message: "✓ Form saved successfully! X fields saved."

### 9. **Verify Saved Data**

Check MongoDB to verify the data was saved:

```bash
# Using MongoDB Compass or mongosh
db.filled_forms.find().pretty()
```

You should see:
```json
{
  "_id": ObjectId("..."),
  "user_id": "user123",
  "user_email": "user@example.com",
  "form_name": "User Form",
  "fields": {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Phone Number": "9876543210"
  },
  "created_at": ISODate("2026-02-06T..."),
  "updated_at": ISODate("2026-02-06T...")
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Simple Form
**Form**: 3-4 fields (Name, Email, Phone)
**Expected**: All fields detected accurately
**Verify**: Input boxes align perfectly with form fields

### Scenario 2: Complex Government Form
**Form**: 10+ fields with Hindi labels
**Expected**: Most fields detected, Hindi labels translated
**Verify**: Field labels are in English

### Scenario 3: Multi-column Form
**Form**: Fields in multiple columns
**Expected**: All columns processed
**Verify**: Bounding boxes don't overlap

### Scenario 4: Poor Quality Image
**Form**: Blurry or low-light photo
**Expected**: May miss some fields or show error
**Verify**: Error handling works gracefully

---

## 🔍 What to Look For

### ✅ Success Indicators
- Green borders appear on input fields
- Input boxes are positioned correctly
- Field labels are accurate
- Can type in all fields
- Save button works
- Success message appears

### ❌ Potential Issues
- **Missing fields**: Form too complex or unclear
- **Wrong positioning**: Image skewed or distorted
- **Incorrect labels**: Ambiguous field labels
- **Overlapping boxes**: Dense form layout

---

## 📊 Expected Output Format

### Backend Response (detect-form-fields)
```json
{
  "success": true,
  "image_url": "data:image/jpeg;base64,...",
  "image_width": 1200,
  "image_height": 1600,
  "fields": [
    {
      "label": "Name",
      "bbox": {
        "x": 150,
        "y": 200,
        "width": 300,
        "height": 40
      }
    },
    {
      "label": "Email",
      "bbox": {
        "x": 150,
        "y": 280,
        "width": 300,
        "height": 40
      }
    },
    {
      "label": "Phone Number",
      "bbox": {
        "x": 150,
        "y": 360,
        "width": 300,
        "height": 40
      }
    }
  ]
}
```

### Frontend State
```javascript
formFields: {
  success: true,
  image_url: "data:image/jpeg;base64,...",
  image_width: 1200,
  image_height: 1600,
  fields: [...]
}

formData: {
  "Name": "Ramesh Kumar",
  "Email": "ramesh@example.com",
  "Phone Number": "9876543210"
}
```

---

## 🛠️ Debugging

### Check Backend Logs
```bash
# Look for these logs
Document scanner logs:
- "Document scanner error: ..."
- "JSON parsing error: ..."
- "Form field detection error: ..."
```

### Check Frontend Console
```javascript
// Look for these logs
console.log('Form Data:', formData);
console.error('Upload error:', error);
```

### Network Tab
Check the API calls in browser DevTools:
- **POST** `/document-scanner/detect-form-fields`
  - Status: 200 OK
  - Response contains `fields` array
- **POST** `/document-scanner/save-form-data`
  - Status: 200 OK
  - Response contains `form_id`

---

## 📱 Mobile Testing

### On Mobile Browser
1. Open `http://your-server-ip:5173`
2. Login
3. Go to Document Scanner
4. Switch to Form Fill mode
5. Use camera to capture form
6. Test touch interaction with overlays

### Expected Behavior
- Camera access works
- Touch targets are large enough
- Input fields are scrollable
- Save button accessible
- Responsive layout

---

## 🌐 Testing Different Languages

### English Form
```
Name: ___________
Email: __________
Phone: __________
```

### Hindi Form
```
नाम: ___________
ईमेल: __________
फोन: ___________
```

Both should work! The AI will:
- Detect Hindi labels
- Translate to English for consistency
- Return "Name", "Email", "Phone" in response

---

## 💡 Tips for Best Results

### Image Quality
- ✅ Good lighting, clear image
- ✅ Straight-on capture (not angled)
- ✅ Full form visible in frame
- ✅ High resolution (>800px width)
- ❌ Avoid shadows, glare
- ❌ Avoid extreme angles

### Form Types
- ✅ Printed forms with clear labels
- ✅ Simple layouts with lined fields
- ✅ Standard government/bank forms
- ❌ Hand-drawn forms
- ❌ Extremely complex multi-column layouts

---

## 📦 Sample Test Forms

Create these simple test forms to verify functionality:

### Test Form 1: Basic
```
APPLICATION FORM

Name: _______________________

Email: ______________________

Phone: ______________________

Address: ____________________
         ____________________
```

### Test Form 2: Government Style
```
सरकारी आवेदन फॉर्म

नाम: _______________________

पिता का नाम: _______________

आधार नंबर: _________________

मोबाइल: ____________________

पता: _______________________
```

---

## 🎯 Success Criteria

The feature is working correctly if:

1. ✅ Upload completes successfully
2. ✅ AI detects at least 70% of fields
3. ✅ Bounding boxes align with field positions
4. ✅ User can type in all detected fields
5. ✅ Form data saves to database
6. ✅ Saved data is retrievable
7. ✅ Both English and Hindi forms work
8. ✅ Mobile camera integration works

---

## 🆘 Troubleshooting

### Issue: No fields detected
**Solution**: 
- Check image quality
- Ensure form has clear labels
- Try a simpler form first

### Issue: Wrong field positions
**Solution**:
- Ensure image is not skewed
- Try capturing straight-on
- Verify image dimensions are correct

### Issue: Save button not working
**Solution**:
- Check authentication token
- Verify network connection
- Check backend logs

### Issue: Camera not opening
**Solution**:
- Grant camera permissions
- Use HTTPS (required for camera API)
- Try on different browser

---

## 📈 Next Steps

After successful testing:

1. **Test with real forms**: Use actual government/bank forms
2. **Gather user feedback**: Have rural users test it
3. **Optimize accuracy**: Fine-tune AI prompts based on results
4. **Add features**: Photo attachments, signatures, etc.
5. **Performance testing**: Test with high-resolution images

---

## ✅ Checklist

Before deploying to production:

- [ ] Backend API endpoints tested
- [ ] Frontend UI tested on desktop
- [ ] Mobile responsiveness verified
- [ ] Camera capture working
- [ ] Form data saves correctly
- [ ] Error handling works
- [ ] Hindi forms tested
- [ ] Multiple users tested
- [ ] Database queries working
- [ ] Security (auth) verified

---

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review [FORM_FIELD_DETECTION.md](FORM_FIELD_DETECTION.md)
3. Check backend logs
4. Review network requests
5. Test with sample forms first

**Status**: ✅ Ready for Testing!
