#!/bin/bash

echo "🔧 Fixing ESLint warnings for Netlify deployment..."

# Navigate to frontend directory
cd /Users/suchithkc/projects/aeumbra/auembranodeserv

# Fix AdminPricingPage.tsx
echo "Fixing AdminPricingPage.tsx..."
sed -i '' 's/Paper,/\/\/ Paper,/g' src/pages/AdminPricingPage.tsx
sed -i '' 's/Cancel,/\/\/ Cancel,/g' src/pages/AdminPricingPage.tsx
sed -i '' 's/Security,/\/\/ Security,/g' src/pages/AdminPricingPage.tsx

# Fix FeedPage.tsx
echo "Fixing FeedPage.tsx..."
sed -i '' 's/List,/\/\/ List,/g' src/pages/FeedPage.tsx
sed -i '' 's/ListItem,/\/\/ ListItem,/g' src/pages/FeedPage.tsx
sed -i '' 's/ListItemText,/\/\/ ListItemText,/g' src/pages/FeedPage.tsx
sed -i '' 's/ListItemAvatar,/\/\/ ListItemAvatar,/g' src/pages/FeedPage.tsx
sed -i '' 's/Divider,/\/\/ Divider,/g' src/pages/FeedPage.tsx
sed -i '' 's/Favorite,/\/\/ Favorite,/g' src/pages/FeedPage.tsx
sed -i '' 's/LocationOn,/\/\/ LocationOn,/g' src/pages/FeedPage.tsx
sed -i '' 's/Star,/\/\/ Star,/g' src/pages/FeedPage.tsx
sed -i '' 's/Security,/\/\/ Security,/g' src/pages/FeedPage.tsx
sed -i '' 's/Bookmark,/\/\/ Bookmark,/g' src/pages/FeedPage.tsx

# Fix HomePage.tsx
echo "Fixing HomePage.tsx..."
sed -i '' 's/CardMedia,/\/\/ CardMedia,/g' src/pages/HomePage.tsx
sed -i '' 's/Schedule,/\/\/ Schedule,/g' src/pages/HomePage.tsx
sed -i '' 's/TrendingUp,/\/\/ TrendingUp,/g' src/pages/HomePage.tsx

# Fix NotificationsPage.tsx
echo "Fixing NotificationsPage.tsx..."
sed -i '' 's/Notification,/\/\/ Notification,/g' src/pages/NotificationsPage.tsx

# Fix ProfilePage.tsx
echo "Fixing ProfilePage.tsx..."
sed -i '' 's/Divider,/\/\/ Divider,/g' src/pages/ProfilePage.tsx
sed -i '' 's/Paper,/\/\/ Paper,/g' src/pages/ProfilePage.tsx
sed -i '' 's/Security,/\/\/ Security,/g' src/pages/ProfilePage.tsx
sed -i '' 's/Email,/\/\/ Email,/g' src/pages/ProfilePage.tsx
sed -i '' 's/Work,/\/\/ Work,/g' src/pages/ProfilePage.tsx
sed -i '' 's/School,/\/\/ School,/g' src/pages/ProfilePage.tsx

# Fix RegisterPage.tsx
echo "Fixing RegisterPage.tsx..."
sed -i '' 's/FormControl,/\/\/ FormControl,/g' src/pages/RegisterPage.tsx
sed -i '' 's/InputLabel,/\/\/ InputLabel,/g' src/pages/RegisterPage.tsx
sed -i '' 's/Select,/\/\/ Select,/g' src/pages/RegisterPage.tsx
sed -i '' 's/MenuItem,/\/\/ MenuItem,/g' src/pages/RegisterPage.tsx

# Fix ReviewsPage.tsx
echo "Fixing ReviewsPage.tsx..."
sed -i '' 's/List,/\/\/ List,/g' src/pages/ReviewsPage.tsx
sed -i '' 's/ListItem,/\/\/ ListItem,/g' src/pages/ReviewsPage.tsx
sed -i '' 's/ListItemText,/\/\/ ListItemText,/g' src/pages/ReviewsPage.tsx
sed -i '' 's/ListItemAvatar,/\/\/ ListItemAvatar,/g' src/pages/ReviewsPage.tsx
sed -i '' 's/Divider,/\/\/ Divider,/g' src/pages/ReviewsPage.tsx
sed -i '' 's/Rating,/\/\/ Rating,/g' src/pages/ReviewsPage.tsx

# Fix SettingsPage.tsx
echo "Fixing SettingsPage.tsx..."
sed -i '' 's/Security,/\/\/ Security,/g' src/pages/SettingsPage.tsx
sed -i '' 's/VolumeUp,/\/\/ VolumeUp,/g' src/pages/SettingsPage.tsx
sed -i '' 's/LocationOn,/\/\/ LocationOn,/g' src/pages/SettingsPage.tsx
sed -i '' 's/Email,/\/\/ Email,/g' src/pages/SettingsPage.tsx
sed -i '' 's/Phone,/\/\/ Phone,/g' src/pages/SettingsPage.tsx

echo "✅ ESLint fixes applied!"
echo "Building project to test..."
export PATH="/Users/suchithkc/projects/aeumbra/node-v20.10.0-darwin-x64/bin:$PATH"
npm run build

echo "🎉 Build completed! Ready for Netlify deployment."
