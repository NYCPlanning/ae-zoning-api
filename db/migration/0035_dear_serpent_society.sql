CREATE TABLE "facility_operator" (
	"id" uuid PRIMARY KEY NOT NULL,
	"abbreviation" text,
	"name" text,
	"type" text,
	CONSTRAINT "facility_operator_type_options" CHECK ("facility_operator"."type" IN (
      'Public',
      'Non-public'
    ))
);
