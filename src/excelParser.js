// excelParser.js
import * as XLSX from 'xlsx';

export const parseExcel = (file) => {
  const workbook = XLSX.read(file, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  return data; // Returns the array of data from the excel file
};
