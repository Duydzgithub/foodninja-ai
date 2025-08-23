#!/usr/bin/env python3
"""
Test script for Food Ninja API endpoints
Requires: pip install requests pillow
"""

import requests
import json
from io import BytesIO
from PIL import Image
import base64

# API base URL (thay đổi nếu cần)
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    try:
        data = {"message": "Cho tôi biết về lợi ích của chuối"}
        response = requests.post(f"{BASE_URL}/chat", json=data)
        print(f"Chat test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()['response'][:100]}...")
        else:
            print(f"Error: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False

def test_ask_ai():
    """Test ask_ai endpoint"""
    try:
        data = {"prompt": "Nước có tác dụng gì với sức khỏe?"}
        response = requests.post(f"{BASE_URL}/ask_ai", json=data)
        print(f"Ask AI test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()['result'][:100]}...")
        else:
            print(f"Error: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Ask AI test failed: {e}")
        return False

def create_test_image():
    """Tạo ảnh test đơn giản"""
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes

def test_predict():
    """Test predict endpoint with a test image"""
    try:
        img_bytes = create_test_image()
        files = {'image': ('test.jpg', img_bytes, 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/predict", files=files)
        print(f"Predict test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            if result.get('low_confidence'):
                print("Low confidence detection - this is expected for test image")
                print(f"Alternatives: {result.get('alternatives', [])}")
            else:
                print(f"Food detected: {result.get('food_name')}")
                print(f"Confidence: {result.get('probability', 0):.2%}")
        else:
            print(f"Error: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Predict test failed: {e}")
        return False

def run_all_tests():
    """Chạy tất cả tests"""
    print("=== Food Ninja API Tests ===\n")
    
    tests = [
        ("Health Check", test_health_check),
        ("Chat Endpoint", test_chat),
        ("Ask AI Endpoint", test_ask_ai),
        ("Predict Endpoint", test_predict)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        result = test_func()
        results.append((test_name, result))
        print(f"Result: {'✅ PASS' if result else '❌ FAIL'}")
    
    print("\n=== Summary ===")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"Tests passed: {passed}/{total}")
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")

if __name__ == "__main__":
    run_all_tests()
