from rest_framework.authentication import TokenAuthentication


class useBearerForAuth(TokenAuthentication):
    keyword = 'Bearer'
