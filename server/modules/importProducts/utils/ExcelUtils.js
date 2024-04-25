const XLSX = require('xlsx');

const convertToWorkbook = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    return workbook;
}

const writeWorkbookToBuffer = (workbook) => {
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
    convertToWorkbook,
    writeWorkbookToBuffer
}