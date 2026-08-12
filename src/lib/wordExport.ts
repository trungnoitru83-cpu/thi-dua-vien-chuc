// Word document export utility for Mẫu 01, Mẫu 02, Mẫu 03, and Bảng Tổng hợp
export const exportToWord = (htmlContent: string, fileName: string) => {
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${fileName}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 15mm 20mm 15mm;
            }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 13pt; 
              line-height: 1.3; 
              color: #000;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .italic { font-style: italic; }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin-top: 10pt; 
              margin-bottom: 12pt; 
            }
            th, td { 
              border: 1px solid #000; 
              padding: 5pt 7pt; 
              text-align: left; 
              vertical-align: top; 
              font-size: 11pt; 
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold; 
              text-align: center; 
            }
            .title { 
              font-size: 15pt; 
              font-weight: bold; 
              text-align: center; 
              text-transform: uppercase; 
              margin-top: 15pt; 
              margin-bottom: 5pt; 
            }
            .subtitle { 
              font-size: 11pt; 
              font-style: italic; 
              text-align: center; 
              margin-bottom: 15pt; 
            }
            .header-table { 
              width: 100%; 
              margin-bottom: 15pt; 
              border: none; 
            }
            .header-table td { 
              border: none; 
              padding: 0; 
              vertical-align: top; 
            }
            .signature-table { 
              width: 100%; 
              margin-top: 25pt; 
              border: none; 
            }
            .signature-table td { 
              border: none; 
              text-align: center; 
              vertical-align: top; 
            }
          </style>
        </head>
        <body>`;

  const footer = `</body></html>`;
  const fullHtml = header + htmlContent + footer;

  const blob = new Blob(['\ufeff', fullHtml], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
