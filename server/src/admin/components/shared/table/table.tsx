import dayjs from "dayjs";
import { useMedusa } from "medusa-react";
import { type FC, useEffect, useState } from "react";
import { type Column, useTable } from "react-table";

import { useDebounce } from "../../../context/shared/use-debounce";
import { cx } from "../../../utils/cx";
import Button from "../button";
import ChevronDownIcon from "../icons/chevron-down";
import EyeIcon from "../icons/eye";
import GhostIcon from "../icons/ghost";
import PencilIcon from "../icons/pencil";
import TrashIcon from "../icons/trash";
import { ShowIf } from "../show-if";
import Spin from "../spin";

interface TableProps {
  columns: readonly Column<{}>[];
  data: readonly ({} & { id: string })[];
  handleNext: () => void;
  handlePrevious: () => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectSortBy: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChangeLimit: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalPages: number;
  totalItems: number;
  page: number;
  limit: number;
  orderBy: string;
  search: string;
  loading?: boolean;
  onView?: (id: string, payload: {}) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  hideSearch?: boolean;
}

const Table: FC<TableProps> = ({
  columns,
  data,
  handleNext,
  handlePrevious,
  handleSearch,
  handleSelectSortBy,
  handleChangeLimit,
  totalPages,
  totalItems,
  page,
  limit,
  orderBy,
  search,
  onDelete,
  onEdit,
  onView,
  loading,
  hideSearch,
}) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const { className: tableClassname, ...tableProps } = getTableProps();
  const { className: tableBodyClassname, ...tableBodyProps } = getTableBodyProps();

  // Render the UI for your table
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <ShowIf condition={!hideSearch}>
          <input
            type="text"
            placeholder="Search by title"
            className="flex-grow p-2 border border-gray-300 rounded-md max-w-72"
            onChange={handleSearch}
            value={search}
          />
        </ShowIf>
        <ShowIf condition={hideSearch}>&nbsp;</ShowIf>

        <div className="flex flex-row items-center justify-between space-x-4">
          <span> Sort by: </span>
          <div className="grid">
            <ChevronDownIcon
              size={16}
              className="relative z-10 self-center w-4 h-4 col-start-1 row-start-1 pointer-events-none right-1 justify-self-end forced-colors:hidden"
            />
            <select
              className="w-52 col-start-1 row-start-1 px-4 py-1.5 border rounded-lg appearance-none forced-colors:appearance-auto dark:bg-slate-800 hover:border-cyan-500 dark:hover:border-cyan-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              onChange={handleSelectSortBy}
              value={orderBy}
              disabled={loading}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-a-z">Title A-Z</option>
              <option value="title-z-a">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <ShowIf condition={data.length === 0}>
        <div className="flex flex-col items-center my-4 space-y-2 rounded-md border  w-full min-h-[150px] justify-center">
          <GhostIcon size={28} />
          <p className="w-full text-center inter-large-regular text-grey-50">No data</p>
        </div>
      </ShowIf>

      <ShowIf condition={data.length > 0}>
        <div className="w-full overflow-x-auto">
          <table
            {...tableProps}
            className={cx(tableClassname, "border-spacing-0 w-full overflow-x-scroll overflow-auto my-2")}
          >
            <thead>
              {headerGroups.map((headerGroup) => {
                const { className: headerGroupClassname, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                return (
                  <tr {...headerGroupProps} className={cx(headerGroupClassname)} key={`header-group-${headerGroup.id}`}>
                    {headerGroup.headers.map((column) => {
                      const { className: columnClassname, ...columnProps } = column.getHeaderProps();
                      return (
                        <th
                          {...columnProps}
                          className={cx(columnClassname, "border min-w-32 px-4 py-2 text-gray-900")}
                          key={`header-${column.id}`}
                        >
                          {column.render("Header")}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...tableBodyProps} className={cx(tableBodyClassname, "")}>
              {rows.map((row) => {
                prepareRow(row);
                const { className: rowClassName, ...rowProps } = row.getRowProps();

                const rowId = row.values.id;

                return (
                  <tr {...rowProps} className={cx(rowClassName, "")} key={`row-${row.id}`}>
                    {row.cells.map((cell) => {
                      const { className: cellClassName, ...cellProps } = cell.getCellProps();

                      if (cell.column.id === "actions") {
                        return (
                          <ShowIf condition={!!onView || !!onEdit || !!onDelete}>
                            <td {...cellProps} className={cx(cellClassName, "border px-4 py-2 text-gray-800")}>
                              <div className="flex flex-row items-center justify-center space-x-2">
                                <ShowIf condition={!!onView}>
                                  <button
                                    type="button"
                                    className="px-2 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 active:bg-green-800 disabled:bg-gray-500"
                                    onClick={() =>
                                      onView?.(
                                        rowId,
                                        data.find((d) => d.id === rowId),
                                      )
                                    }
                                    disabled={loading}
                                  >
                                    <EyeIcon size={16} />
                                  </button>
                                </ShowIf>
                                <ShowIf condition={!!onEdit}>
                                  <button
                                    type="button"
                                    className="px-2 py-2 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700 active:bg-orange-800 disabled:bg-gray-500"
                                    onClick={() => onEdit?.(rowId)}
                                    disabled={loading}
                                  >
                                    <PencilIcon size={16} />
                                  </button>
                                </ShowIf>
                                <ShowIf condition={!!onDelete}>
                                  <button
                                    type="button"
                                    className="px-2 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 active:bg-red-800 disabled:bg-gray-500"
                                    onClick={() => onDelete?.(rowId)}
                                    disabled={loading}
                                  >
                                    <TrashIcon size={16} />
                                  </button>
                                </ShowIf>
                              </div>
                            </td>
                          </ShowIf>
                        );
                      }

                      return (
                        <td
                          {...cellProps}
                          className={cx(cellClassName, "border px-4 py-2 text-gray-800")}
                          key={`cell-${cell.column}-${cell.value}`}
                        >
                          <ShowIf condition={cell.column.id === "created_at"}>
                            {dayjs(cell.value).format("DD MMM YYYY")}
                          </ShowIf>
                          <ShowIf condition={cell.column.id !== "created_at"}> {cell.render("Cell")}</ShowIf>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ShowIf>

      <div className="flex flex-row items-center justify-between w-full mt-2">
        <ShowIf condition={!loading && data.length > 0}>
          <div>
            Showing {1 + (page - 1) * limit}-{page * limit > totalItems ? totalItems : page * limit} of{" "}
            {page * limit > totalItems ? totalItems : page * limit} items
          </div>
        </ShowIf>
        <ShowIf condition={data.length === 0 && !loading}>
          <span>&nbsp;</span>
        </ShowIf>
        <ShowIf condition={loading}>
          <Spin />
        </ShowIf>

        <div className="flex flex-row items-center justify-between space-x-4">
          <span> Rows per page: </span>
          <div className="grid">
            <ChevronDownIcon
              size={16}
              className="relative z-10 self-center w-4 h-4 col-start-1 row-start-1 pointer-events-none right-1 justify-self-end forced-colors:hidden"
            />
            <select
              className="w-20 col-start-1 row-start-1 px-4 py-1.5 border rounded-lg appearance-none forced-colors:appearance-auto dark:bg-slate-800 hover:border-cyan-500 dark:hover:border-cyan-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              onChange={handleChangeLimit}
              value={limit}
              disabled={loading}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <Button onClick={handlePrevious} disabled={page === 1 || loading || data.length === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={page === totalPages || loading || data.length === 0}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WrappedTableProps {
  endpoint: string;
  columns: readonly Column<{}>[];
  hideSearch?: boolean;
  onView?: (id: string, payload: {}) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

interface Parameters {
  limit: number;
  page: number;
  search: string;
  orderBy: string;
}

const WrappedTable: FC<WrappedTableProps> = (props) => {
  const { endpoint, columns, onDelete, onEdit, onView, hideSearch } = props;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState<Parameters>({ limit: 10, page: 1, search: "", orderBy: "newest" });

  const query = useDebounce(params.search, 750);
  const { client } = useMedusa();

  const fetchData = async (newParams: Parameters) => {
    try {
      setLoading(true);

      const params = {
        limit: newParams.limit,
        page: newParams.page,
        filters: [{ field: "title", value: newParams.search, operator: "like" }],
        field: "",
        order: "",
      };

      if (!newParams.search) {
        delete params.filters;
      }

      if (newParams.orderBy === "newest") {
        params.field = "created_at";
        params.order = "desc";
      } else if (newParams.orderBy === "oldest") {
        params.field = "created_at";
        params.order = "asc";
      } else if (newParams.orderBy === "title-a-z") {
        params.field = "title";
        params.order = "asc";
      } else if (newParams.orderBy === "title-z-a") {
        params.field = "title";
        params.order = "desc";
      }

      const data = await client.admin.custom.get(endpoint, params);

      setData(data.data);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
      setParams(newParams);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => fetchData({ ...params, page: params.page + 1 });
  const handlePrevious = () => fetchData({ ...params, page: params.page - 1 });
  const handleChangeLimit = (e: React.ChangeEvent<HTMLSelectElement>) =>
    fetchData({ ...params, limit: Number.parseInt(e.target.value), page: 1 });
  const handleSelectSortBy = (e: React.ChangeEvent<HTMLSelectElement>) =>
    fetchData({ ...params, orderBy: e.target.value, page: 1 });
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams({ ...params, search: e.target.value, page: 1 });

  useEffect(() => {
    fetchData({ ...params, search: query, page: 1 });
  }, [query]);

  useEffect(() => {
    fetchData(params);
  }, []);

  return (
    <Table
      hideSearch={hideSearch}
      columns={columns}
      data={data}
      limit={params.limit}
      page={params.page}
      orderBy={params.orderBy}
      search={params.search}
      totalItems={totalItems}
      totalPages={totalPages}
      handleChangeLimit={handleChangeLimit}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleSearch={handleSearch}
      handleSelectSortBy={handleSelectSortBy}
      onDelete={
        onDelete
          ? (id: string) => {
              setLoading(true);
              onDelete(id).then(() => fetchData(params));
            }
          : null
      }
      loading={loading}
      onEdit={onEdit}
      onView={onView}
    />
  );
};

export default WrappedTable;
