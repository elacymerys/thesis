import logging

from fastapi import FastAPI, Depends
from starlette.status import HTTP_200_OK

from services.category_service import CategoryService
from web.schemas import CategoryListResponse, CategoryResponse

app = FastAPI()


logging.getLogger().setLevel(logging.INFO)


@app.get("/api/categories", status_code=HTTP_200_OK, response_model=CategoryListResponse)
async def get_categories(service: CategoryService = Depends()):
    categories = service.get_all()

    res = []
    for category in categories:
        res.append(CategoryResponse(id=category.id, name=category.name))

    return CategoryListResponse(categories=res)
