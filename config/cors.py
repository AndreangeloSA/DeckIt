"""Small development-only CORS middleware for the local static frontend."""
from django.utils.cache import patch_vary_headers


class LocalFrontendCorsMiddleware:
    allowed_origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://deckit.pages.dev"
    }
    allowed_methods = "GET, POST, PATCH, DELETE, OPTIONS"
    allowed_headers = "Accept, Authorization, Content-Type"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get("Origin")
        if request.method == "OPTIONS" and origin in self.allowed_origins:
            from django.http import HttpResponse

            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        if origin in self.allowed_origins:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Methods"] = self.allowed_methods
            response["Access-Control-Allow-Headers"] = self.allowed_headers
            patch_vary_headers(response, ("Origin",))
        return response
