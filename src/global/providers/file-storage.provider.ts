import { FactoryProvider } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Client } from "minio";
import { FileStorageConfig } from "src/config";

export type FileStorageService = Client;

export const FILE_STORAGE = Symbol("FILE_STORAGE");
export const FileStorageProvider: FactoryProvider<FileStorageService> = {
  provide: FILE_STORAGE,
  inject: [FileStorageConfig.KEY],
  useFactory: (fileStorageConfig: ConfigType<typeof FileStorageConfig>) => {
    const { endPoint, port, useSSL, accessKey, secretKey } = fileStorageConfig;
    return new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  },
};
