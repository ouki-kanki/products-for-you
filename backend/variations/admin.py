from django.contrib import admin
from django.utils.html import format_html


from .models import Variation, VariationOptions, VariationOptionalField


def render_color_box(hex_value):
    '''
        renders a colored box using hex values
    '''
    return format_html('<div style="background-color:{};width: 100px; height: 20px"/>', hex_value)    

class VariationValuesInline(admin.StackedInline):
    model = VariationOptions
    fields = ('value', ('get_child_property_name', 'get_child_property_value'),)
    readonly_fields = ('value', 'get_child_property_value', 'get_child_property_name')

    # TODO: this is for testing purposes, needs to be changed 
    @admin.display(description='property name')
    def get_child_property_name(self, instance):
        obj = instance.variation_extra_parameters.all().first()
        return obj.name

    # TODO: this is for testing purposes, needs to be changed
    @admin.display(description='property value')
    def get_child_property_value(self, instance):
        obj = instance.variation_extra_parameters.all().first()
        if obj.name == 'color code':
            return render_color_box(obj.value)
        return obj.value
    

@admin.register(Variation)
class VariationAdmin(admin.ModelAdmin):
    '''
    shows the name of each variation
    '''
    list_display = ('name', 'related_category',)
    # list_editable = ('name',)
    inlines = (VariationValuesInline, )


@admin.register(VariationOptions)
class VariationOptionsAdmin(admin.ModelAdmin):
    '''
    shows the value of each variation
    '''
    list_display = ('value', 'get_parent')

    @admin.display(description="parent - variation name")
    def get_parent(self, obj):
        return obj.variation


@admin.register(VariationOptionalField)
class VariationOptionalFieldAdmin(admin.ModelAdmin):
    '''
    show aditional properteies for each variation if there are any
    '''
    list_display = ('parent_value', 'name', 'value', 'get_hex_color_display')

    @admin.display(description="color")
    def get_hex_color_display(self, obj):
        return render_color_box(obj.value)

