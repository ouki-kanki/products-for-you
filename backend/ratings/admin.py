from django.contrib import admin
from .models import (
    Rating, RatingAspect, RatingScore, Comment, AdminResponse
)


# Register your models here.
class RatingScoreInline(admin.TabularInline):
    model = RatingScore
    extra = 0
    readonly_fields = ['aspect', 'score']


class CommentInline(admin.StackedInline):
    model = Comment
    extra = 0


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'overall_score', 'created_at']
    inlines = [RatingScoreInline]
    fields = ['user', 'product', 'created_at']
    readonly_fields = ['created_at']

    def overall_score(self, obj):
        score = obj.scores.filter(aspect__name='overall').first()
        return score.score if score else '-'


admin.site.register(RatingAspect)
admin.site.register(RatingScore)
admin.site.register(Comment)
admin.site.register(AdminResponse)

