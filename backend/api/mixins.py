


# NOTE: mixin example to ovveride the dispatch method
# mixin can then included in the desired view

# class ProductExistsRequiredMixin:

#     def dispatch(self, request, *args, **kwargs):
#         if Product.objects.filter(pk=1, activate=True):
#             return super().dispatch(request, *args, **kwargs)
#         else:
#             raise PermissionDenied