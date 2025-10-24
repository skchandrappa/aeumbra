// Clear mock data and force real backend usage
// Run this in the browser console when accessing via ngrok

console.log('🔄 Clearing mock data and forcing real backend...');

// Clear all mock API flags
localStorage.removeItem('using_mock_api');
localStorage.removeItem('auth_token');
localStorage.removeItem('refresh_token');

// Clear any cached data
if (window.apiService) {
    window.apiService.isBackendAvailable = null;
    window.apiService.checkPromise = null;
}

console.log('✅ Mock data cleared');
console.log('🔄 Reloading page to apply changes...');

// Reload the page
window.location.reload();
