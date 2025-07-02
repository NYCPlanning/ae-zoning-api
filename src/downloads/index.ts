import * as ExcelJS from "exceljs";
import { FindCapitalProjectsQueryParams } from "src/gen";

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

export async function createWorkBookFromTemplate({
  templateFilename = "template.xlsx",
  outputFilename,
  reportName,
  data,
  tableHeaders,
  queryParams,
}: {
  templateFilename: string;
  outputFilename: string | null; // null skips saving the file
  reportName: string;
  data: any;
  tableHeaders: any;
  queryParams: FindCapitalProjectsQueryParams;
}) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templateFilename);

  const ws =
    workbook.getWorksheet("Template Sheet") ||
    workbook.addWorksheet("Template Sheet");

  ws.name = reportName;

  ws.getCell("A6").value = reportName;
  ws.getCell("B8").value = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  let activeRow = 11;

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
      name: "MyTable",
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

  if (outputFilename) {
    await workbook.xlsx.writeFile(outputFilename);
  }

  return workbook.xlsx.writeBuffer();
}
