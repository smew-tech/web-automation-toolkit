#!/usr/bin/env python3
"""
Quick test to verify the N8N-style UI is working
"""
import requests
import time
import sys

def test_server():
    """Test if the server is responding"""
    try:
        response = requests.get('http://localhost:5001', timeout=5)
        if response.status_code == 200:
            print("✅ Server is responding correctly")
            return True
        else:
            print(f"❌ Server responded with status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on port 5001")
        return False
    except Exception as e:
        print(f"❌ Error testing server: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    try:
        # Test workspaces endpoint
        response = requests.get('http://localhost:5001/api/workspaces', timeout=5)
        if response.status_code == 200:
            print("✅ Workspaces API endpoint working")
            workspaces = response.json()
            print(f"📊 Found {len(workspaces)} workspace(s)")
            return True
        else:
            print(f"❌ Workspaces API failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing N8N-Style Web Automation UI...")
    print("⏳ Waiting for server to start...")
    
    # Wait a bit for server to start
    time.sleep(2)
    
    # Test basic server response
    if not test_server():
        sys.exit(1)
    
    # Test API endpoints
    if not test_api_endpoints():
        sys.exit(1)
    
    print("🎉 All tests passed! The N8N-style UI is working correctly.")
    print("🌐 Open http://localhost:5001 in your browser to access the interface.")