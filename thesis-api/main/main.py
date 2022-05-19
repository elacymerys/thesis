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
    res = [CategoryResponse(id=category.id, name=category.name) for category in categories]
    return CategoryListResponse(categories=res)
