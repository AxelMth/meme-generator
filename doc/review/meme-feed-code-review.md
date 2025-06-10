# Performance Issues

## Excessive API Calls

The current implementation attempts to retrieve each meme along with its related data (author and comments).
Initially, it fetches the first page of memes, followed by subsequent pages.

For every meme, it also retrieves:

- the author information, and
- the comments, page by page.

Assuming the following parameters:

- `\text{pageNumber} = 10` (number of pages of memes)
- `\text{memePerPage} = 20` (number of memes per page)
- `\text{commentPerMeme} = 30` (average number of comments per meme)
- `\text{commentPageSize} = 10` (number of comments per comment page)

The total number of API calls becomes:

$$
\text{TotalCalls} = \text{pageNumber} \times \left(1 + \left(1 + \frac{\text{commentPerMeme}}{\text{commentPageSize}}\right) \times \text{memePerPage} \right)
$$

Plugging in the parameters:

$$
\text{TotalCalls} = 10 \times \left(1 + \left(1 + \frac{30}{10} \right) \times 20 \right) = 10 \times \left(1 + (1 + 3) \times 20 \right) = 10 \times (1 + 4 \times 20) = 10 \times 81 = 810
$$

**Result**: **810 API calls**

## Sequential Requests

Another major performance issue is that all API calls are made **sequentially**.
This significantly increases total load time and blocks UI updates.

**Improvement**: Use parallel or batched API requests to reduce waiting time.

**Warning**: Making too many calls in parallel may overload the backend (database stress, rate-limiting, etc.)

## Inefficient Memory Usage

The code attempts to load **all memes at once** into memory.
This can:

- Slow down the application,
- Lead to excessive memory usage,
- Degrade user experience (especially on low-end devices).

**Recommendation**: Implement a strategy to fetch and render memes progressively (pagination or lazy loading).

## Improper Pagination

Although the API supports pagination, the implementation ignores this feature and fetches all memes at once.
This defeats the purpose of paginated APIs.

**Solution**:
Use pagination properly by either:

- Implementing classic pagination (e.g., "Next" / "Previous" buttons), or
- Using infinite scroll to load more data as the user scrolls.

## Missing Caching Strategy

Each time a meme is fetched, the corresponding author is fetched again—even if already retrieved earlier.

**Issue**: No caching layer is used.

**Recommendation**: Implement a cache (e.g., in-memory or local storage) to avoid redundant author fetches.

---

# Design Issues

## Lack of Error Handling

None of the API calls are wrapped with proper error handling.

**Implications**:

- If a call fails, the entire data flow can break,
- Errors are not logged or shown to users,
- Makes debugging and monitoring harder.

**Recommendation**:

- Use `try/catch` or promise `.catch()` blocks,
- Provide fallback UI or error messages,
- Log errors appropriately for observability.

---

Let me know if you'd like this formatted for a specific platform (e.g., GitHub, Notion, etc.) or exported as a PDF or DOCX.
