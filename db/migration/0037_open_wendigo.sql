CREATE TABLE "data_source" (
	"schema_name" text PRIMARY KEY NOT NULL,
	"dataset_name" text,
	"version" text NOT NULL,
	"retrieve_date" date NOT NULL
);
