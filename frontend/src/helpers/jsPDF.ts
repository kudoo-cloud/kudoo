import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId) => {
  const pdf = new jsPDF('p', 'pt', 'letter', true);
  const canvas = await html2canvas(document.getElementById(elementId) as any, {
    useCORS: true,
  });
  const image = canvas.toDataURL('image/png');
  const hratio = canvas.height / canvas.width;
  const width = pdf.internal.pageSize.getWidth();
  const height = width * hratio;
  pdf.addImage(image, 'png', 0, 0, width, height, '', 'FAST');
  // pdf.save('test.pdf');
  return pdf.output('blob');
};
