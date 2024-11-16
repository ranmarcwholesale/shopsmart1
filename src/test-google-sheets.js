const { google } = require('googleapis');

async function testSheetsAPI() {

  const sheets = google.sheets({ version: 'v4', auth: 'AIzaSyC09Dj8aXANHQ1P1AXmcTrRVtylr71xE3s' });
  const range = "'Data'!A1";
  sheets.spreadsheets.values.get({
    spreadsheetId: '1urQkyYPD6EZWRORKV4_ArGBOYubjcD4VSoOwtvKGJFw',
    range: range,
  }, (err, res) => {
    if (err) return console.error('API returned an error:', err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Data:', rows[0]);
    } else {
      console.log('No data found.');
    }
  });
  
}
testSheetsAPI();
