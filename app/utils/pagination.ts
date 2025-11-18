/**
 * 生成分頁頁碼列表
 * @param current 當前頁碼
 * @param total 總頁數
 * @param delta 當前頁前後顯示的頁數 (預設 2)
 * @returns 頁碼陣列，包含數字或 'ellipsis' 字符串
 */
export function getPaginationPages(
  current: number,
  total: number,
  delta: number = 2
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  for (let i = 1; i <= total; i++) {
    // 總是顯示第一頁、最後一頁，以及當前頁附近的頁碼
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      // 避免連續的省略號
      pages.push('ellipsis')
    }
  }

  return pages
}
