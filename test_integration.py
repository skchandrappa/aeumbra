#!/usr/bin/env python3
"""
Test script to verify backend and frontend integration
"""

import requests
import json
import time

def test_backend_health():
    """Test backend health endpoint"""
    print("🔍 Testing Backend Health...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is healthy: {data['message']}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend not reachable: {e}")
        return False

def test_backend_api_docs():
    """Test backend API documentation"""
    print("\n🔍 Testing Backend API Documentation...")
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API Documentation is accessible")
            return True
        else:
            print(f"❌ API Documentation not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Documentation not reachable: {e}")
        return False

def test_backend_openapi():
    """Test backend OpenAPI schema"""
    print("\n🔍 Testing Backend OpenAPI Schema...")
    try:
        response = requests.get("http://localhost:8000/openapi.json", timeout=5)
        if response.status_code == 200:
            schema = response.json()
            endpoints = list(schema.get('paths', {}).keys())
            print(f"✅ OpenAPI schema accessible with {len(endpoints)} endpoints")
            print(f"   Available endpoints: {', '.join(endpoints[:5])}...")
            return True
        else:
            print(f"❌ OpenAPI schema not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ OpenAPI schema not reachable: {e}")
        return False

def test_frontend():
    """Test frontend accessibility"""
    print("\n🔍 Testing Frontend...")
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            return True
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend not reachable: {e}")
        return False

def test_api_endpoints():
    """Test specific API endpoints"""
    print("\n🔍 Testing API Endpoints...")
    
    # Test registration endpoint
    print("   Testing registration endpoint...")
    try:
        registration_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
            "user_type": "consumer",
            "phone_number": "+1234567890"
        }
        
        response = requests.post(
            "http://localhost:8000/api/v1/auth/register",
            json=registration_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("   ✅ Registration endpoint working")
            return True
        else:
            print(f"   ❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Registration endpoint error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Integration Tests\n")
    
    # Test backend
    backend_health = test_backend_health()
    api_docs = test_backend_api_docs()
    openapi = test_backend_openapi()
    
    # Test frontend
    frontend_accessible = test_frontend()
    
    # Test API endpoints
    api_working = test_api_endpoints()
    
    # Summary
    print("\n📊 Test Summary:")
    print(f"   Backend Health: {'✅' if backend_health else '❌'}")
    print(f"   API Documentation: {'✅' if api_docs else '❌'}")
    print(f"   OpenAPI Schema: {'✅' if openapi else '❌'}")
    print(f"   Frontend: {'✅' if frontend_accessible else '❌'}")
    print(f"   API Endpoints: {'✅' if api_working else '❌'}")
    
    if backend_health and api_docs and openapi:
        print("\n🎉 Backend is running successfully!")
        print("   📖 API Documentation: http://localhost:8000/docs")
        print("   🔧 OpenAPI Schema: http://localhost:8000/openapi.json")
    else:
        print("\n⚠️  Backend has issues that need to be resolved")
    
    if frontend_accessible:
        print("   🌐 Frontend: http://localhost:3000")
    else:
        print("   ⚠️  Frontend is not running or not accessible")

if __name__ == "__main__":
    main()
