import React from 'react';
import { Filter } from 'lucide-react';
import ReactPaginate from 'react-paginate';

function SummarySection({
  selectedCategory,
  handleCategoryChange,
  dateRange,
  handleStartDateChange,
  handleEndDateChange,
  headers,
  currentItems,
  hypervisors,
  pageCount,
  handlePageClick,
}) {
  return (
    <>
      {/* Filters and Date Range */}
      <div className="mb-3 d-flex flex-wrap gap-3 align-items-center">
        <Filter size={16} />
        <label htmlFor="categoryFilter" className="form-label">
          Filtrar por:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          <option value="all">Todos</option>
          <option value="completed">Completadas</option>
          <option value="failed">Fallidas</option>
          <option value="inProgress">En Proceso</option>
          <option value="total">Máquinas Virtuales</option>
        </select>
        {/* Date Range Inputs - Side by Side */}
        <div className="d-flex gap-3 align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="startDate" className="form-label m-0">
              Desde:
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="endDate" className="form-label m-0">
              Hasta:
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive mb-4">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              {headers.map((header) => (
                <th key={header.key} scope="col">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const hypervisorName =
                hypervisors.find((h) => h.id === item.hypervisor_id)?.name ||
                'N/A';
              return (
                <tr key={item.id}>
                  {headers.map((header) => {
                    let value = item[header.key];
                    if (header.key === 'hypervisor') {
                      value = hypervisorName;
                    }
                    if (header.key === 'date') {
                      value = new Date(value).toLocaleString();
                    }
                    return <td key={`${item.id}-${header.key}`}>{value}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </>
  );
}

export default SummarySection;
