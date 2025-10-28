#!/bin/bash

echo "🔧 Fixing API calls in postService..."

# Update all api.get calls to apiService.get
sed -i '' 's/api\.get/apiService.get/g' auembranodeserv/src/services/postService.ts

# Update all api.post calls to apiService.post
sed -i '' 's/api\.post/apiService.post/g' auembranodeserv/src/services/postService.ts

# Update all api.put calls to apiService.put
sed -i '' 's/api\.put/apiService.put/g' auembranodeserv/src/services/postService.ts

# Update all api.delete calls to apiService.delete
sed -i '' 's/api\.delete/apiService.delete/g' auembranodeserv/src/services/postService.ts

# Remove .data from response handling
sed -i '' 's/response\.data\.data/response/g' auembranodeserv/src/services/postService.ts
sed -i '' 's/response\.data/response/g' auembranodeserv/src/services/postService.ts

echo "✅ API calls updated in postService!"

# Also update other services
echo "🔧 Updating other services..."

# Update bookingService
if [ -f "auembranodeserv/src/services/bookingService.ts" ]; then
  sed -i '' 's/import api from/import apiService from/g' auembranodeserv/src/services/bookingService.ts
  sed -i '' 's/api\.get/apiService.get/g' auembranodeserv/src/services/bookingService.ts
  sed -i '' 's/api\.post/apiService.post/g' auembranodeserv/src/services/bookingService.ts
  sed -i '' 's/api\.put/apiService.put/g' auembranodeserv/src/services/bookingService.ts
  sed -i '' 's/api\.delete/apiService.delete/g' auembranodeserv/src/services/bookingService.ts
  sed -i '' 's/response\.data/response/g' auembranodeserv/src/services/bookingService.ts
  echo "✅ bookingService updated!"
fi

# Update notificationService
if [ -f "auembranodeserv/src/services/notificationService.ts" ]; then
  sed -i '' 's/import api from/import apiService from/g' auembranodeserv/src/services/notificationService.ts
  sed -i '' 's/api\.get/apiService.get/g' auembranodeserv/src/services/notificationService.ts
  sed -i '' 's/api\.post/apiService.post/g' auembranodeserv/src/services/notificationService.ts
  sed -i '' 's/api\.put/apiService.put/g' auembranodeserv/src/services/notificationService.ts
  sed -i '' 's/api\.delete/apiService.delete/g' auembranodeserv/src/services/notificationService.ts
  sed -i '' 's/response\.data/response/g' auembranodeserv/src/services/notificationService.ts
  echo "✅ notificationService updated!"
fi

# Update userService
if [ -f "auembranodeserv/src/services/userService.ts" ]; then
  sed -i '' 's/import api from/import apiService from/g' auembranodeserv/src/services/userService.ts
  sed -i '' 's/api\.get/apiService.get/g' auembranodeserv/src/services/userService.ts
  sed -i '' 's/api\.post/apiService.post/g' auembranodeserv/src/services/userService.ts
  sed -i '' 's/api\.put/apiService.put/g' auembranodeserv/src/services/userService.ts
  sed -i '' 's/api\.delete/apiService.delete/g' auembranodeserv/src/services/userService.ts
  sed -i '' 's/response\.data/response/g' auembranodeserv/src/services/userService.ts
  echo "✅ userService updated!"
fi

echo "🎉 All API services updated!"
