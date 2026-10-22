const sourcePostOrder = [
  'background-job-processing-with-rust-actix-redis',
  'simple-authentication-approach-with-actix-web',
  'tabs-with-no-javascript',
  'the-perfect-tribonacci-sequence',
  'the-python-fudge-it-approach',
]

export function orderPosts<T extends { id: string }>(posts: T[]) {
  const order = new Map(sourcePostOrder.map((id, index) => [id, index]))
  return posts.toSorted((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity))
}
