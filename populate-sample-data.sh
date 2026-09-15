#!/bin/bash

set -e

echo "🚀 Populating PRMS with real sample data..."
echo "🔑 Getting authentication token..."

# Get JWT token
TOKEN=$(curl -s -X POST \
  'http://localhost:8180/realms/prms/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password&client_id=prms-frontend&username=procurement_admin&password=admin123' | jq -r '.access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Failed to get authentication token. Check Keycloak is running and realm is imported."
    exit 1
fi

echo "✅ Token obtained successfully"
API_BASE="http://localhost:8080/api/v1"

# Function to make authenticated API call
api_call() {
    curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"
}

echo "📦 Creating sample vendors..."

# Create vendors
echo "Creating vendor: TechCorp Solutions..."
VENDOR1=$(api_call -X POST "$API_BASE/vendors" -d '{
  "name": "TechCorp Solutions Ltd",
  "vendorCode": "TCL001",
  "email": "contact@techcorp.et",
  "phone": "+251911234567",
  "address": "Bole, Addis Ababa",
  "contactPersonName": "Alemayehu Tadesse",
  "contactPersonEmail": "alemayehu@techcorp.et",
  "contactPersonPhone": "+251911234567",
  "taxIdentificationNumber": "0012345678",
  "vendorType": "CORPORATE",
  "paymentTerms": "NET_30",
  "creditLimit": 250000.00,
  "performanceScore": 4.5
}')

echo "Creating vendor: Office Pro Supplies..."
VENDOR2=$(api_call -X POST "$API_BASE/vendors" -d '{
  "name": "Office Pro Supplies",
  "vendorCode": "OPS002",
  "email": "sales@officepro.et",
  "phone": "+251922345678",
  "address": "Kazanchis, Addis Ababa",
  "contactPersonName": "Tigest Haile",
  "contactPersonEmail": "tigest@officepro.et",
  "contactPersonPhone": "+251922345678",
  "taxIdentificationNumber": "0023456789",
  "vendorType": "CORPORATE",
  "paymentTerms": "NET_15",
  "creditLimit": 150000.00,
  "performanceScore": 4.2
}')

echo "Creating vendor: Cleaning Masters..."
VENDOR3=$(api_call -X POST "$API_BASE/vendors" -d '{
  "name": "Cleaning Masters Co.",
  "vendorCode": "CMC003",
  "email": "info@cleaningmasters.et",
  "phone": "+251933456789",
  "address": "Piassa, Addis Ababa",
  "contactPersonName": "Dawit Bekele",
  "contactPersonEmail": "dawit@cleaningmasters.et",
  "contactPersonPhone": "+251933456789",
  "taxIdentificationNumber": "0034567890",
  "vendorType": "INDIVIDUAL",
  "paymentTerms": "NET_30",
  "creditLimit": 80000.00,
  "performanceScore": 3.8
}')

echo "Creating vendor: IT Consultancy Hub..."
VENDOR4=$(api_call -X POST "$API_BASE/vendors" -d '{
  "name": "IT Consultancy Hub",
  "vendorCode": "ICH004",
  "email": "hello@itconsultancy.et",
  "phone": "+251944567890",
  "address": "4 Kilo, Addis Ababa",
  "contactPersonName": "Meron Asefa",
  "contactPersonEmail": "meron@itconsultancy.et",
  "contactPersonPhone": "+251944567890",
  "taxIdentificationNumber": "0045678901",
  "vendorType": "CORPORATE",
  "paymentTerms": "NET_60",
  "creditLimit": 300000.00,
  "performanceScore": 4.7
}')

echo "Creating vendor: Stationery World..."
VENDOR5=$(api_call -X POST "$API_BASE/vendors" -d '{
  "name": "Stationery World",
  "vendorCode": "STW005",
  "email": "orders@stationeryworld.et",
  "phone": "+251955678901",
  "address": "Merkato, Addis Ababa",
  "contactPersonName": "Hanna Girma",
  "contactPersonEmail": "hanna@stationeryworld.et",
  "contactPersonPhone": "+251955678901",
  "taxIdentificationNumber": "0056789012",
  "vendorType": "INDIVIDUAL",
  "paymentTerms": "NET_15",
  "creditLimit": 50000.00,
  "performanceScore": 4.0
}')

echo "✅ Vendors created successfully!"

echo "📋 Creating sample purchase requisitions..."

# Get current date and future date
CURRENT_DATE=$(date +%Y-%m-%d)
FUTURE_DATE=$(date -d "+30 days" +%Y-%m-%d)

# Create purchase requisitions
echo "Creating requisition: Laptop Computers..."
REQ1=$(api_call -X POST "$API_BASE/requisitions" -d "{
  \"requesterEmployeeId\": \"procurement_admin\",
  \"departmentCode\": \"IT\",
  \"purpose\": \"Laptop Computers for Staff\",
  \"itemDetails\": \"Dell Latitude 5520 (10 units @ 45,000 ETB each); HP EliteBook 850 (5 units @ 52,000 ETB each)\",
  \"estimatedAmount\": 710000.00,
  \"requiredByDate\": \"$FUTURE_DATE\"
}")

echo "Creating requisition: Office Furniture..."
REQ2=$(api_call -X POST "$API_BASE/requisitions" -d "{
  \"requesterEmployeeId\": \"requester\",
  \"departmentCode\": \"ADMIN\",
  \"purpose\": \"Office Furniture for New Building\",
  \"itemDetails\": \"Executive Desk (15 units @ 8,000 ETB each); Office Chairs (15 units @ 3,500 ETB each); Filing Cabinets (10 units @ 4,200 ETB each)\",
  \"estimatedAmount\": 214500.00,
  \"requiredByDate\": \"$FUTURE_DATE\"
}")

echo "Creating requisition: Cleaning Services..."
REQ3=$(api_call -X POST "$API_BASE/requisitions" -d "{
  \"requesterEmployeeId\": \"procurement_admin\",
  \"departmentCode\": \"FACILITIES\",
  \"purpose\": \"Monthly Cleaning Services Contract\",
  \"itemDetails\": \"Daily office cleaning for 3 floors (1 month @ 25,000 ETB); Window cleaning bi-weekly (1 month @ 8,000 ETB); Deep cleaning monthly (1 service @ 15,000 ETB)\",
  \"estimatedAmount\": 48000.00,
  \"requiredByDate\": \"$FUTURE_DATE\"
}")

echo "Creating requisition: Stationery Supplies..."
REQ4=$(api_call -X POST "$API_BASE/requisitions" -d "{
  \"requesterEmployeeId\": \"requester\",
  \"departmentCode\": \"GENERAL\",
  \"purpose\": \"Q4 Stationery and Office Supplies\",
  \"itemDetails\": \"A4 Paper (50 reams @ 120 ETB each); Blue Pens (100 pieces @ 15 ETB each); Notebooks (200 pieces @ 25 ETB each); Staplers (20 pieces @ 150 ETB each)\",
  \"estimatedAmount\": 14500.00,
  \"requiredByDate\": \"$FUTURE_DATE\"
}")

echo "Creating requisition: Software Licenses..."
REQ5=$(api_call -X POST "$API_BASE/requisitions" -d "{
  \"requesterEmployeeId\": \"procurement_admin\",
  \"departmentCode\": \"IT\",
  \"purpose\": \"Annual Software License Renewal\",
  \"itemDetails\": \"Microsoft Office 365 (50 licenses @ 2,400 ETB each); Adobe Creative Suite (10 licenses @ 15,000 ETB each); Antivirus Software (100 licenses @ 800 ETB each)\",
  \"estimatedAmount\": 350000.00,
  \"requiredByDate\": \"$FUTURE_DATE\"
}")

echo "✅ Purchase requisitions created successfully!"

echo "🎯 Submitting some requisitions for approval workflow..."

# Get requisition IDs and submit some for approval
REQ_IDS=$(api_call "$API_BASE/requisitions" | jq -r '.[].id' 2>/dev/null | head -3)

if [ ! -z "$REQ_IDS" ]; then
    for req_id in $REQ_IDS; do
        echo "Submitting requisition $req_id for approval..."
        api_call -X POST "$API_BASE/requisitions/$req_id/submit" -d '{}'
    done
fi

echo "✅ Requisitions submitted for approval!"

echo "🏢 Checking database counts..."

# Verify data was created
echo "📊 Database Summary:"
echo "==================="
docker exec prms-db-working psql -U prms_user -d prms -c "
SELECT 
  'Vendors' as entity, count(*) as count FROM vendors
UNION ALL
SELECT 
  'Purchase Requisitions' as entity, count(*) as count FROM purchase_requisitions;
"

echo ""
echo "🎉 Sample data population completed successfully!"
echo ""
echo "🌐 ACCESS YOUR PRMS SYSTEM:"
echo "==========================="
echo "✅ Backend (Spring Boot): http://localhost:8080"
echo "✅ Swagger UI: http://localhost:8080/swagger-ui/index.html"  
echo "✅ Frontend (Next.js): http://localhost:3000"
echo "✅ Keycloak Admin: http://localhost:8180/admin (admin/admin123)"
echo ""
echo "👥 TEST USERS:"
echo "=============="
echo "🔑 procurement_admin / admin123 (Full Access)"
echo "🔑 requester / requester123 (Purchase Requests)"
echo "🔑 supplier / supplier123 (Supplier Portal)"
echo ""
echo "📝 SWAGGER AUTHORIZATION:"
echo "========================"
echo "1. Go to http://localhost:8080/swagger-ui/index.html"
echo "2. Click 'Authorize' button"
echo "3. Use OAuth2 with any of the test users above"
echo "4. Test all API endpoints with real data!"
echo ""