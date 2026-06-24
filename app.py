from flask import Flask, render_template, request, jsonify, session
import os
import random

app = Flask(__name__)
app.secret_key = "super_secret_office_key_123" # सेशन्स को सुरक्षित रखने के लिए

# नकली डेटाबेस (शुरुआत के लिए एक डिफॉल्ट यूजर रख दिया है)
USERS_DB = {
    "9876543210": "Vikas@2026"
}

@app.route('/')
def index():
    return render_template('login.html')

# 1. नया कैप्चा जनरेट करने का एंडपॉइंट
@app.route('/api/generate-captcha', methods=['GET'])
def generate_captcha():
    num1 = random.randint(1, 9)
    num2 = random.randint(1, 9)
    session['captcha_result'] = num1 + num2 # सही जवाब सेशन में सेव कर लिया
    return jsonify({"question": f"{num1} + {num2} = ?"})

# 2. लॉगिन का बैकएंड लॉजिक
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    mobile = data.get('mobile')
    password = data.get('password')
    
    if mobile in USERS_DB and USERS_DB[mobile] == password:
        return jsonify({"status": "success", "message": "लॉगिन सफल! डैशबोर्ड पर रीडायरेक्ट हो रहे हैं..."})
    else:
        return jsonify({"status": "error", "message": "गलत मोबाइल नंबर या पासवर्ड!"})

# 3. रजिस्ट्रेशन का बैकएंड लॉजिक (कैप्चा चेकिंग के साथ)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    mobile = data.get('mobile')
    password = data.get('password')
    captcha_input = data.get('captcha')
    
    # कैप्चा वेरिफिकेशन
    if not captcha_input or int(captcha_input) != session.get('captcha_result'):
        return jsonify({"status": "error", "message": "गलत कैप्चा कोड! कृपया दोबारा प्रयास करें।"})
        
    if mobile in USERS_DB:
        return jsonify({"status": "error", "message": "यह मोबाइल नंबर पहले से रजिस्टर्ड है!"})
        
    # डेटाबेस में नया यूजर जोड़ना
    USERS_DB[mobile] = password
    return jsonify({"status": "success", "message": "रजिस्ट्रेशन सफल! अब आप लॉगिन कर सकते हैं।"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
