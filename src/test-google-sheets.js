const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1urQkyYPD6EZWRORKV4_ArGBOYubjcD4VSoOwtvKGJFw';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: SCOPES,
});

async function testSheetsAPI() {
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Data'!A1:Z1000",
    });
    console.log('Data fetched successfully:', response.data);
  } catch (error) {
    console.error('Error fetching data from spreadsheet:', error.response ? error.response.data : error);
  }
}

testSheetsAPI();
