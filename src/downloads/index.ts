import * as ExcelJS from "exceljs";
import { FindCapitalProjectsQueryParams } from "src/gen";
import type { CapitalProject } from "src/gen";

export function numberToColumn(num: number) {
  //This makes num=1 return A, otherwise num=0 returns A
  num--;

  let letters = "";
  while (num >= 0) {
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
}

export interface TableHeader {
  variable: string;
  label: string;
}

export interface SheetParams {
  tableName: string;
  tableHeaders: TableHeader[];
  queryParams: FindCapitalProjectsQueryParams;
  data: CapitalProject[];
}

export interface AddSheetToExcelDocumentParams extends SheetParams {
  reportName: string;
  workbook: ExcelJS.Workbook;
  generationDate: string;
  sheetNumber: number;
}

export interface GenerateExcelDocumentParams {
  /**
   * @description The path to the file to use as a template
   * @type string
   */
  templateFilename: string;
  /**
   * @description The path to the file to save the output to. If undefined, file will not be saved to disk
   * @type string | undefined
   */
  outputFilename?: string;
  /**
   * @description The name of the generated report
   * @type string
   */
  reportName: string;
  /**
   * @description The set of sheets to include in the document
   * @type array
   */
  sheets: SheetParams[];
}

export async function generateExcelDocument({
  templateFilename = "src/downloads/template.xlsx",
  outputFilename,
  reportName,
  sheets,
}: GenerateExcelDocumentParams) {
  let workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templateFilename);

  if (!workbook.worksheets[sheets.length - 1]) {
    throw new Error(
      "The Excel template does not have enough sheets for this request.",
    );
  }

  const generationDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  for (let sheetNumber = 0; sheetNumber < sheets.length; sheetNumber++) {
    workbook = await addSheetToExcelDocument({
      workbook,
      reportName,
      generationDate,
      sheetNumber,
      ...sheets[sheetNumber],
    });
  }

  // Delete any extra unused sheets from the template
  if (workbook.worksheets.length > sheets.length) {
    for (let i = workbook.worksheets.length - 1; i >= sheets.length; i--) {
      workbook.removeWorksheet(workbook.worksheets[i].id);
    }
  }

  // Save the file to disk
  if (outputFilename) {
    await workbook.xlsx.writeFile(outputFilename);
  }

  return workbook.xlsx.writeBuffer();
}

export async function addSheetToExcelDocument({
  workbook,
  sheetNumber,
  generationDate,
  reportName,
  tableName,
  tableHeaders,
  queryParams,
  data,
}: AddSheetToExcelDocumentParams) {
  const ws =
    workbook.worksheets[sheetNumber] || workbook.addWorksheet(tableName);

  ws.name = tableName;
  ws.getCell("A6").value = reportName;
  ws.getCell("B8").value = generationDate;
  ws.getCell("B11").value = tableName;

  let activeRow = 14;

  if (queryParams.cityCouncilDistrictId) {
    ws.getCell(`B${activeRow}`).value = "City Council District:";
    ws.getCell(`C${activeRow}`).value = queryParams.cityCouncilDistrictId;
    activeRow++;
  }
  if (queryParams.communityDistrictId) {
    ws.getCell(`B${activeRow}`).value = "Community District:";
    ws.getCell(`C${activeRow}`).value = queryParams.communityDistrictId;
    activeRow++;
  }
  if (queryParams.managingAgency) {
    ws.getCell(`B${activeRow}`).value = "Managing Agency:";
    ws.getCell(`C${activeRow}`).value = queryParams.managingAgency;
    activeRow++;
  }
  if (queryParams.agencyBudget) {
    ws.getCell(`B${activeRow}`).value = "Agency Budget:";
    ws.getCell(`C${activeRow}`).value = queryParams.agencyBudget;
    activeRow++;
  }
  if (queryParams.isMapped) {
    ws.getCell(`B${activeRow}`).value = "Mapped Projects:";
    ws.getCell(`C${activeRow}`).value = queryParams.isMapped;
    activeRow++;
  }
  if (queryParams.commitmentsTotalMin) {
    ws.getCell(`B${activeRow}`).value = "Project Amount Minimum:";
    ws.getCell(`C${activeRow}`).value = queryParams.commitmentsTotalMin;
    activeRow++;
  }
  if (queryParams.commitmentsTotalMax) {
    ws.getCell(`B${activeRow}`).value = "Project Amount Maximum:";
    ws.getCell(`C${activeRow}`).value = queryParams.commitmentsTotalMax;
    activeRow++;
  }

  const columns = tableHeaders.map(
    (header: { variable: string; label: string }) => {
      return { name: header.label, filterButton: true };
    },
  );

  const rows = data.map((item: any) => {
    return tableHeaders.reduce((acc: any, curr: any) => {
      return [...acc, item[curr.variable]];
    }, []);
  });

  try {
    ws.addTable({
      name: `Table${sheetNumber + 1}`,
      ref: `E2`,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "TableStyleDark3",
        showRowStripes: true,
      },
      columns,
      rows,
    });
  } catch (e) {
    console.error(e);
  }

  return workbook;
}
