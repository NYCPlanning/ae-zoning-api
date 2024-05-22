// import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
// import { CommunityDistrictService } from "./community-district.service";
// import { CommunityDistrictRepository } from "./community-district.repository";
// import { Test } from "@nestjs/testing";
// import { ResourceNotFoundException } from "src/exception";
// import {
//   findCommunityDistrictByCommunityDistrictIdQueryResponseSchema,
//   findCommunityDistrictClassesByCommunityDistrictIdQueryResponseSchema,
// } from "src/gen";

// describe("Community district service unit", () => {
//   let communityDistrictService: CommunityDistrictService;

//   const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [CommunityDistrictService, CommunityDistrictRepository],
//     })
//       .overrideProvider(CommunityDistrictRepository)
//       .useValue(communityDistrictRepositoryMock)
//       .compile();

//     communityDistrictService = moduleRef.get<CommunityDistrictService>(
//       CommunityDistrictService,
//     );
//   });

//   describe("findById", () => {
//     it("service should return a community district compliant object", async () => {
//       const mock = communityDistrictRepositoryMock.findByIdMocks[0];
//       const communityDistrict = await communityDistrictService.findById(mock.id);
//       expect(() =>
//         findCommunityDistrictByCommunityDistrictIdQueryResponseSchema.parse(
//           communityDistrict,
//         ),
//       ).not.toThrow();
//     });

//     it("service should throw a resource error when requesting with a missing id", async () => {
//       const missingUuid = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
//       const communityDistrict = communityDistrictService.findById(missingUuid);
//       expect(communityDistrict).rejects.toThrow(ResourceNotFoundException);
//     });
//   });

//   describe("findCommunityDistrictClassesById", () => {
//     it("service should return a community district classes compliant object", async () => {
//       const { id } = communityDistrictRepositoryMock.checkByIdMocks[0];
//       const communityDistrictClasses =
//         await communityDistrictService.findCommunityDistrictClassesById(id);
//       expect(() =>
//         findCommunityDistrictClassesByCommunityDistrictIdQueryResponseSchema.parse(
//           communityDistrictClasses,
//         ),
//       ).not.toThrow();
//     });

//     it("service should throw a resource error when requesting with a missing id", async () => {
//       const missingUuid = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
//       const communityDistrict =
//         communityDistrictService.findCommunityDistrictClassesById(missingUuid);
//       expect(communityDistrict).rejects.toThrow(ResourceNotFoundException);
//     });
//   });
// });
