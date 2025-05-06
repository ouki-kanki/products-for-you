from typing import Any, TypedDict, List
from django.conf import settings
from django.core.paginator import PageNotAnInteger, EmptyPage
from common.paginators.paginator_elasticsearch import ElasticSearchPaginator


class PartialPost(TypedDict, total=False):
    id: int
    name: str
    tags: List[str]


class PaginationReturn(TypedDict):
    posts: List[PartialPost]
    total_items: int
    items_per_page: int
    num_of_pages: int
    prev_link: str | None
    next_link: str | None
    facets_response: Any


def paginate(request, search_str, fc) -> PaginationReturn:
    uri = request.build_absolute_uri(request.path)
    default_page = '1'
    default_page_size = settings.PAGE_SIZE

    page = int(request.query_params.get('page', default_page))
    page_size = int(request.query_params.get('page_size', default_page_size))

    if page_size <= 0 or page_size > settings.MAX_PAGE_SIZE_LIMIT:
        page_size = default_page_size

    start = (page - 1) * page_size
    end = start + page_size

    fc = fc[start:end]
    facets = fc.execute()
    # print("facets", response.facets)

    # for (name, count, selected) in response.facets.name:
    #     print("the name facet group", name, count, selected)

    paginator = ElasticSearchPaginator(facets, page_size)

    next_link = None
    prev_link = None
    if page < paginator.num_pages:
        next_link = f'{uri}/?search={search_str}&page={page + 1}&page_size={page_size}'
    if page > 1:
        prev_link = f'{uri}/?search={search_str}&page={page - 1}&page_size={page_size}'

    try:
        posts = paginator.page(page)

    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    return {
        "posts": posts,
        "total_items": paginator._count.value,  # pylint: disable=protected-access
        "items_per_page": paginator.count,
        "num_of_pages": paginator.num_pages,
        "prev_link": prev_link,
        "next_link": next_link,
        "facets_response": facets
    }
