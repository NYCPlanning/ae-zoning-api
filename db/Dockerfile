FROM postgis/postgis:15-3.4-alpine

ARG STORAGE_URL
ADD  --chown=postgres $STORAGE_URL/tables/borough.csv /var/lib/postgresql/borough.csv
ADD  --chown=postgres $STORAGE_URL/tables/land_use.csv /var/lib/postgresql/land_use.csv
ADD  --chown=postgres $STORAGE_URL/tables/tax_lot.csv /var/lib/postgresql/tax_lot.csv
ADD  --chown=postgres $STORAGE_URL/tables/zoning_district.csv /var/lib/postgresql/zoning_district.csv
ADD  --chown=postgres $STORAGE_URL/tables/zoning_district_class.csv /var/lib/postgresql/zoning_district_class.csv
ADD  --chown=postgres $STORAGE_URL/tables/zoning_district_zoning_district_class.csv /var/lib/postgresql/zoning_district_zoning_district_class.csv
