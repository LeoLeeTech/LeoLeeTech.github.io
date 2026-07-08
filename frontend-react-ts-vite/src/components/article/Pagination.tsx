type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
};

/** 根据总文章数计算页码，父组件只需要保存当前页。 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onChange,
}: PaginationProps) {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          className={currentPage === page ? 'page-button active' : 'page-button'}
          type="button"
          key={page}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
