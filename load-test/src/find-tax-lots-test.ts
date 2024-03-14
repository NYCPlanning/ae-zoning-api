import { sleep } from "k6";
import { Options } from "k6/options";
import http from "k6/http";

export const options: Options = {
  vus: 70,
  duration: "2m",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<200"],
  },
};

export default () => {
  const findTaxLotsRequests = [];
  for (let offset = 0; offset < 8e5; offset += 5e4) {
    const req = {
      method: "GET",
      url: `http://host.docker.internal:3000/api/tax-lots?limit=10&${offset}`,
      params: {
        tags: {
          name: "findTaxLots",
        },
      },
    };
    findTaxLotsRequests.push(req);
  }
  const findTaxLotsReponses = http.batch(findTaxLotsRequests);
  const findTaxLotByBblRequests = findTaxLotsReponses.map((response) => {
    const data = JSON.parse(response.body as string);
    const taxLot = (data.taxLots as Array<{ bbl: string }>)[0];
    return {
      method: "GET",
      url: `http://host.docker.internal:3000/api/tax-lots/${taxLot.bbl}`,
      params: {
        tags: {
          name: "findTaxLotByBbl",
        },
      },
    };
  });
  http.batch(findTaxLotByBblRequests);
  sleep(1);
};
