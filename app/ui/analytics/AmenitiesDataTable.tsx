"use client";
import React from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";

import { sortBy } from "lodash";
import { Amenity, AmenityCategory } from "@/app/ui/types";

const AmenitiesDataTable = ({
  savedAmenities,
}: {
  savedAmenities: Amenity[];
}) => {
  const filters = {
    "amenity.name": { value: null, matchMode: FilterMatchMode.IN },
    postcode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    locality: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    neighborhood: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    place: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    district: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  };

  const getSeverity = (amenity: AmenityCategory) => {
    const { id, parentId } = amenity;
    if (id === 60) {
      return "danger";
    }

    switch (parentId) {
      case 2:
        return "success";

      case 3:
        return "info";

      case 4:
        return "warning";

      case 1:
        return null;
    }
  };

  const amenityBodyTemplate = (rowData: Amenity) => {
    return (
      <Tag
        value={rowData.amenity.name}
        severity={getSeverity(rowData.amenity)}
      />
    );
  };

  const amenityRowFilterTemplate = (options: {
    value: string;
    filterApplyCallback: (value: string) => void;
  }) => {
    return (
      <MultiSelect
        value={options.value}
        options={sortBy(
          Array.from(
            new Set(savedAmenities.map(({ amenity: { name } }) => name)),
          ),
        )}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Any"
        className="p-column-filter"
        style={{ minWidth: "14rem" }}
      />
    );
  };

  return (
    <div className="card">
      <DataTable
        value={savedAmenities}
        paginator
        rows={10}
        filterDisplay="row"
        dataKey="id"
        filters={filters}
        loading={false}
        emptyMessage="No data found."
        globalFilterFields={["postcode", "locality", "neighborhood"]}
        sortMode="multiple"
      >
        <Column
          field="amenity.name"
          header="Amentity"
          filter
          filterPlaceholder="Any"
          style={{ minWidth: "12rem", maxWidth: "24rem" }}
          filterElement={amenityRowFilterTemplate}
          body={amenityBodyTemplate}
          sortable
        />
        <Column
          field="postcode"
          header="Postcode"
          filter
          filterPlaceholder="Any"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="neighborhood"
          header="Neighborhood"
          filter
          filterPlaceholder="Any"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="locality"
          header="Borough"
          filter
          filterPlaceholder="Any"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="place"
          header="City"
          filter
          filterPlaceholder="Any"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="district"
          header="Region"
          filter
          filterPlaceholder="Any"
          style={{ minWidth: "12rem" }}
          sortable
        />
      </DataTable>
    </div>
  );
};

export default AmenitiesDataTable;
