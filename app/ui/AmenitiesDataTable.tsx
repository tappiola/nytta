"use client";
import React, { useState, ChangeEventHandler } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";

import { sortBy } from "lodash";
import Header from "@/app/ui/Header";
import { Amenity, Category } from "@/app/ui/types";

type Filter = {
  value: null | string;
  matchMode: FilterMatchMode;
};

type FilterObject = {
  [key: string]: Filter;
};

const AmenitiesDataTable = ({
  savedAmenities,
}: {
  savedAmenities: Amenity[];
}) => {
  const [filters, setFilters] = useState<FilterObject>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "amenity.name": { value: null, matchMode: FilterMatchMode.IN },
    postcode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    locality: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    neighborhood: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    place: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    district: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const getSeverity = (amenity: Category) => {
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

  const onGlobalFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    setFilters({ ...filters, global: { ...filters.global, value } });
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <Header>
        <span className="p-input-icon-left ms-auto me-0">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </Header>
    );
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
        onChange={(e) => {
          console.log(e);
          options.filterApplyCallback(e.value);
        }}
        placeholder="Any"
        className="p-column-filter"
        style={{ minWidth: "14rem" }}
      />
    );
  };

  return (
    <div className="card">
      {renderHeader()}
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
          filterPlaceholder="Search by amenity"
          style={{ minWidth: "12rem", maxWidth: "24rem" }}
          filterElement={amenityRowFilterTemplate}
          body={amenityBodyTemplate}
          sortable
        />
        <Column
          field="postcode"
          header="Postcode"
          filter
          filterPlaceholder="Search by postcode"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="neighborhood"
          header="Neighborhood"
          filter
          filterPlaceholder="Search by neighborhood"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="locality"
          header="Borough"
          filter
          filterPlaceholder="Search by borough"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="place"
          header="City"
          filter
          filterPlaceholder="Search by city"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="district"
          header="Region"
          filter
          filterPlaceholder="Search by region"
          style={{ minWidth: "12rem" }}
          sortable
        />
      </DataTable>
    </div>
  );
};

export default AmenitiesDataTable;
