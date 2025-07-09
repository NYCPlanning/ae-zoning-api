import { FactoryProvider } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Client } from "minio";
import { FileStorageConfig } from "src/config";

export type FileStorageService = {
  getFileName: (
    domain: string,
    filters: Record<string, unknown>,
    fileExtension: ".csv",
  ) => string;
  getFileUrl: (
    fileName: string,
  ) => Promise<
    | { url: string; size: number; lastModified: Date }
    | { url: null; size: null; lastModified: null }
  >;
  replaceFile: (
    fileName: string,
    file: Buffer,
  ) => Promise<{ url: string; size: number }>;
};

export const FILE_STORAGE = Symbol("FILE_STORAGE");
export const FileStorageProvider: FactoryProvider<FileStorageService> = {
  provide: FILE_STORAGE,
  inject: [FileStorageConfig.KEY],
  useFactory: async (
    fileStorageConfig: ConfigType<typeof FileStorageConfig>,
  ) => {
    const bucketName = "test-bucket";
    const { endPoint, port, useSSL, accessKey, secretKey } = fileStorageConfig;
    const client = new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    const exists = await client.bucketExists(bucketName);
    if (!exists) await client.makeBucket(bucketName);

    const getFileName = (
      domain: string,
      filters: Record<string, unknown>,
      fileExtension: ".csv",
    ) => {
      let fileName = domain;
      Object.entries(filters).forEach(([key, value]) => {
        fileName = fileName.concat(`_${key}:${value}`);
      });
      return fileName.concat(fileExtension);
    };

    const getFileUrl = async (fileName: string) => {
      try {
        const stat = await client.statObject(bucketName, fileName);
        return {
          url: `${endPoint}:${port}/${bucketName}/${fileName}`,
          size: stat.size,
          lastModified: stat.lastModified,
        };
      } catch (e) {
        if (e.code === "NotFound") {
          return {
            url: null,
            size: null,
            lastModified: null,
          };
        } else {
          throw new Error(e);
        }
      }
    };

    const replaceFile = async (fileName: string, file: Buffer) => {
      await client.putObject(bucketName, fileName, file, file.byteLength);
      return {
        url: `${endPoint}:${port}/${bucketName}/${fileName}`,
        size: file.byteLength,
      };
    };

    return {
      getFileName,
      getFileUrl,
      replaceFile,
    };
  },
};
