import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

export default function MyDataTable({
  data,
  columns,
  actions,
  title,
  filterClass,
  defaultSortFieldId,
  conditionalRowStyles,
}) {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  // const filteredItems = data.filter(
  //   item => item.name && item.name.includes(filterText)
  // );
  let filteredItems = null;
  if (data) {
    filteredItems = data.filter(
      (item) =>
        JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
        -1
    );
  }

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <input
        type="text"
        className={filterClass ? filterClass : "w-25 form-control"}
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Filtre ... "
      />
    );
  }, [filterText, resetPaginationToggle]);

  // -------------------------
  return (
    <DataTable
      title={title}
      columns={columns}
      data={filteredItems}
      noDataComponent="Aucunes données trouvées" 
      defaultSortField="name" 
      defaultSortFieldId={defaultSortFieldId}
      customStyles={{ 
        header:{
          style:{
            color: "#007A64",
            textDecoration: 'underline'
          }
        },
        table: {
          style: { 
            zIndex: 0,
          },
        }, 
        rows: {
          style: {
            zIndex: 0, 
            borderRadius: "5px",
            margin:'1px 0',
          },
        },  
      }}
      striped
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
      fixedHeader
      fixedHeaderScrollHeight="800vh"
      highlightOnHover
		  pointerOnHover
      actions={actions}
      conditionalRowStyles={conditionalRowStyles}
    />
  );
}
