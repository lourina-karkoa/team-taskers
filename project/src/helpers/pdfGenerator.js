const pdfPrinter = require('pdfmake');
const path = requrie('path');

const fonts ={
    Roboto:{
        normal: path.join(__dirname,'../config/fonts/Roboto-Regular.ttf'),
        blod: path.join(__dirname,'../config/fonts/Roboto-Bold.ttf'),
        italics: path.join(__dirname,'../config/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname,'../config/fonts/Roboto-BoldItalic.ttf')
    }
};

const printer = new pdfPrinter(fonts);
module.exports = generatePdf=(docDefinition)=>{
    return printer.createPdfKitDocument(docDefinition);
}
