// fetchData.js
import * as XLSX from 'xlsx';

export const fetchExcelData = async () => {
    const filePath = '/vapes_sorted.xlsx'; // Path relative to the public directory
    const response = await fetch(filePath);
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.blob();
    const workbook = XLSX.read(await data.arrayBuffer(), { type: 'array' });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData;
};
