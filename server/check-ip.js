// Quick script to check your current public IP address
// This helps you know which IP to whitelist in MongoDB Atlas

import https from 'https';

console.log('Checking your current public IP address...\n');

https.get('https://api.ipify.org?format=json', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('✅ Your current public IP address is:', result.ip);
      console.log('\n📝 To whitelist this IP in MongoDB Atlas:');
      console.log('   1. Go to: https://cloud.mongodb.com/');
      console.log('   2. Select your cluster');
      console.log('   3. Click "Security" → "Network Access"');
      console.log('   4. Click "Add IP Address"');
      console.log('   5. Enter:', result.ip);
      console.log('   6. Click "Confirm"');
      console.log('\n   Or for testing, you can add: 0.0.0.0/0 (allows all IPs)');
    } catch (error) {
      console.error('Error parsing response:', error.message);
    }
  });
}).on('error', (error) => {
  console.error('Error fetching IP address:', error.message);
  console.log('\nYou can manually check your IP at: https://whatismyipaddress.com/');
});

