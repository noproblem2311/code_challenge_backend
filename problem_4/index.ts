// O(n) time.
export function sum_to_n_a(n: number): number {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total += i
  }
  return total
}

// (O(n) time, O(n) space
export function sum_to_n_b(n: number): number {
  if (n <= 1) return n
  return n + sum_to_n_b(n - 1)
}

//O(1) time, O(1) space
export function sum_to_n_c(n: number): number {
  return (n * (n + 1)) / 2
}

function test_time_complexity_a() {
  const start = performance.now()
  sum_to_n_a(1000)
  const end = performance.now()
  console.log(`Time taken: ${end - start} milliseconds`)
}
function test_time_complexity_b() {
  const start = performance.now()
  sum_to_n_b(1000)
  const end = performance.now()
  console.log(`Time taken: ${end - start} milliseconds`)
}
function test_time_complexity_c() {
  const start = performance.now()
  sum_to_n_c(1000)
  const end = performance.now()
  console.log(`Time taken: ${end - start} milliseconds`)
}

function test_all_time_complexity() {
  test_time_complexity_a()
  test_time_complexity_b()
  test_time_complexity_c()
}

test_all_time_complexity()
