// Force the app to use real backend instead of mock data
// Run this in the browser console when accessing via ngrok

console.log('🔄 Forcing app to use real backend...');

// Clear mock API flag
localStorage.removeItem('using_mock_api');

// Clear any cached backend availability
if (window.apiService) {
    window.apiService.isBackendAvailable = null;
    window.apiService.checkPromise = null;
}

console.log('✅ Mock API flag cleared');
console.log('🔄 Reloading page to apply changes...');

// Reload the page
window.location.reload();
