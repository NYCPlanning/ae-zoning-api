import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
// import { DataRetrievalException } from "src/exception";
import { TaxLotModule } from "src/tax-lot/tax-lot.module";
import { TaxLotRepository } from "src/tax-lot/tax-lot.repository";
import { StorageConfig } from "src/config";
import { createMultiPolygon, createTaxLot } from "src/gen/mocks";

describe("TaxLots", () => {
  let app: INestApplication;

  const taxLotGeojsonMock = {
    ...createTaxLot(),
    geometry: createMultiPolygon(),
  };

  const mockTaxLotsArray = [
    {
      bbl: "1000010010",
      block: "1",
      lot: "10",
      address: " ANDES ROAD",
      borough: {
        id: "1",
        title: "Manhattan",
        abbr: "MN",
      },
      landUse: {
        id: "08",
        description: "Public Facilities & Institutions",
        color: "#44a3d5ff",
      },
    },
    {
      bbl: "5080500094",
      block: "8050",
      lot: "94",
      address: "162 BENTLEY STREET",
      borough: {
        id: "5",
        title: "Staten Island",
        abbr: "SI",
      },
      landUse: {
        id: "01",
        description: "One & Two Family Buildings",
        color: "#feffa8ff",
      },
    },
  ];

  // const mockTaxLotsSpatialArray = [
  //   {
  //     bbl: "1000010010",
  //     block: "1",
  //     lot: "10",
  //     address: " ANDES ROAD",
  //     geometry:
  //       '{"type":"MultiPolygon","coordinates":[[[[-74.015922,40.693611],[-74.013251,40.692955],[-74.011411,40.69153],[-74.011067,40.690986],[-74.011028,40.690591],[-74.011646,40.689016],[-74.01248,40.687813],[-74.014463,40.686834],[-74.024274,40.68385],[-74.026719,40.684615],[-74.026853,40.686649],[-74.019763,40.692127],[-74.019161,40.693492],[-74.018011,40.693614],[-74.015922,40.693611]],[[-74.018269,40.693158],[-74.018427,40.693148],[-74.018422,40.692711],[-74.018263,40.692701],[-74.017081,40.692624],[-74.01707,40.692728],[-74.017072,40.692729],[-74.017068,40.692771],[-74.017001,40.692767],[-74.016988,40.692884],[-74.017052,40.692888],[-74.017031,40.693074],[-74.017031,40.693076],[-74.017031,40.693078],[-74.017031,40.69308],[-74.017031,40.693082],[-74.017031,40.693084],[-74.017031,40.693086],[-74.017032,40.693087],[-74.017032,40.693089],[-74.017033,40.693091],[-74.017033,40.693093],[-74.017034,40.693095],[-74.017035,40.693097],[-74.017036,40.693099],[-74.017037,40.6931],[-74.017038,40.693102],[-74.017039,40.693104],[-74.01704,40.693105],[-74.017041,40.693107],[-74.017043,40.693109],[-74.017044,40.69311],[-74.017046,40.693112],[-74.017047,40.693113],[-74.017049,40.693115],[-74.01705,40.693116],[-74.017052,40.693118],[-74.017054,40.693119],[-74.017056,40.69312],[-74.017058,40.693121],[-74.01706,40.693123],[-74.017062,40.693124],[-74.017064,40.693125],[-74.017066,40.693126],[-74.017068,40.693127],[-74.01707,40.693128],[-74.017073,40.693129],[-74.017075,40.693129],[-74.017077,40.69313],[-74.01708,40.693131],[-74.017082,40.693131],[-74.017085,40.693132],[-74.017087,40.693132],[-74.017089,40.693133],[-74.017092,40.693133],[-74.017094,40.693133],[-74.017097,40.693133],[-74.017187,40.693139],[-74.017184,40.693162],[-74.017184,40.693163],[-74.017184,40.693165],[-74.017184,40.693166],[-74.017184,40.693167],[-74.017184,40.693169],[-74.017184,40.69317],[-74.017185,40.693172],[-74.017185,40.693173],[-74.017185,40.693175],[-74.017186,40.693176],[-74.017186,40.693177],[-74.017187,40.693179],[-74.017188,40.69318],[-74.017188,40.693181],[-74.017189,40.693183],[-74.01719,40.693184],[-74.017191,40.693185],[-74.017192,40.693186],[-74.017193,40.693188],[-74.017194,40.693189],[-74.017195,40.69319],[-74.017196,40.693191],[-74.017197,40.693192],[-74.017199,40.693193],[-74.0172,40.693194],[-74.017201,40.693195],[-74.017203,40.693196],[-74.017204,40.693197],[-74.017206,40.693198],[-74.017207,40.693199],[-74.017209,40.6932],[-74.01721,40.693201],[-74.017212,40.693201],[-74.017214,40.693202],[-74.017215,40.693203],[-74.017217,40.693203],[-74.017219,40.693204],[-74.017221,40.693204],[-74.017222,40.693205],[-74.017224,40.693205],[-74.017226,40.693205],[-74.017228,40.693206],[-74.01723,40.693206],[-74.017232,40.693206],[-74.017234,40.693206],[-74.017309,40.693211],[-74.017381,40.693211],[-74.018269,40.693158]]]]}',
  //     borough: {
  //       id: "1",
  //       title: "Manhattan",
  //       abbr: "MN",
  //     },
  //     landUse: {
  //       id: "08",
  //       description: "Public Facilities & Institutions",
  //       color: "#44a3d5ff",
  //     },
  //   },
  //   {
  //     bbl: "5080500094",
  //     block: "8050",
  //     lot: "94",
  //     address: "162 BENTLEY STREET",
  //     geometry:
  //       '{"type":"MultiPolygon","coordinates":[[[[-74.249769,40.5086],[-74.24984,40.508726],[-74.249599,40.508802],[-74.249484,40.50869],[-74.249621,40.508647],[-74.249769,40.5086]]]]}',
  //     borough: {
  //       id: "5",
  //       title: "Staten Island",
  //       abbr: "SI",
  //     },
  //     landUse: {
  //       id: "01",
  //       description: "One & Two Family Buildings",
  //       color: "#feffa8ff",
  //     },
  //   },
  // ];

  const taxLotRepository = {
    findByBbl: (bbl: string) => mockTaxLotsArray.find((tl) => tl.bbl === bbl),
    // findByBblSpatial: (bbl: string) =>
    // mockTaxLotsSpatialArray.find((tl) => tl.bbl === bbl),
    findByBblSpatial: () => taxLotGeojsonMock,
  };
  const storageConfig = {};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TaxLotModule],
    })
      // .overrideProvider(TaxLotService)
      // .useValue(taxLotService)
      .overrideProvider(TaxLotRepository)
      .useValue(taxLotRepository)
      .overrideProvider(StorageConfig)
      .useValue(storageConfig)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it("/GET tax-lots", () => {
    return request(app.getHttpServer())
      .get("/tax-lots/1000010010")
      .expect(200)
      .expect({
        bbl: "1000010010",
        block: "1",
        lot: "10",
        address: " ANDES ROAD",
        borough: {
          id: "1",
          title: "Manhattan",
          abbr: "MN",
        },
        landUse: {
          id: "08",
          description: "Public Facilities & Institutions",
          color: "#44a3d5ff",
        },
      });
  });

  it("/GET tax-lots", () => {
    return request(app.getHttpServer()).get("/tax-lots/012345678Y").expect({
      statusCode: 400,
      message: "Invalid data type or format for request parameter",
      error: "Bad Request",
    });
  });

  it.only("/GET tax-lots by geojson", () => {
    const testBbl = taxLotGeojsonMock.bbl;
    console.log(taxLotGeojsonMock);
    return (
      request(app.getHttpServer())
        .get(`/tax-lots/${testBbl}/geojson`)
        // .expect(200)
        .expect(taxLotGeojsonMock)
    );
    // .expect({
    //   type: "Feature",
    //   id: "5080500094",
    //   properties: {
    //     bbl: "5080500094",
    //     borough: {
    //       id: "5",
    //       title: "Staten Island",
    //       abbr: "SI",
    //     },
    //     block: "8050",
    //     lot: "94",
    //     address: "162 BENTLEY STREET",
    //     landUse: {
    //       id: "01",
    //       description: "One & Two Family Buildings",
    //       color: "#feffa8ff",
    //     },
    //   },
    //   geometry: {
    //     type: "MultiPolygon",
    //     coordinates: [
    //       [
    //         [
    //           [-74.249769, 40.5086],
    //           [-74.24984, 40.508726],
    //           [-74.249599, 40.508802],
    //           [-74.249484, 40.50869],
    //           [-74.249621, 40.508647],
    //           [-74.249769, 40.5086],
    //         ],
    //       ],
    //     ],
    //   },
    // });
  });

  // it("/GET boroughs exception", () => {
  //   jest.spyOn(boroughRepo, "findAll").mockImplementationOnce(() => {
  //     throw new DataRetrievalException();
  //   });
  //   return request(app.getHttpServer()).get("/boroughs").expect(500);
  // });

  afterAll(async () => {
    await app.close();
  });
});
