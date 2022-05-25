class WebConfig:
    ROUTE_PREFIX = "/api"
    CORS_ENABLED = True
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:8100"
    ]
