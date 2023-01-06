export default function defaultColumnFilter({
  column: { filterValue, preFilteredRow, setFilter },
}) {
  return (
    <input
      className="form-control"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search records`}
    />
  );
}
