FROM postgres:15-bookworm

RUN apt update 
RUN apt install -y postgresql-15-postgis-3

WORKDIR /var/lib/postgresql

ARG STORAGE_URL
ADD  --chown=postgres $STORAGE_URL/tables/borough.csv borough.csv
ADD  --chown=postgres $STORAGE_URL/tables/land_use.csv land_use.csv
ADD  --chown=postgres $STORAGE_URL/tables/tax_lot.csv tax_lot.csv
ADD  --chown=postgres $STORAGE_URL/tables/zoning_district.csv zoning_district.csv
ADD  --chown=postgres $STORAGE_URL/tables/zoning_district_class.csv zoning_district_class.csv
ADD  --chown=postgres $STORAGE_URL/tables/zoning_district_zoning_district_class.csv zoning_district_zoning_district_class.csv
