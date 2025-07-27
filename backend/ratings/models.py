from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user_control.models import CustomUser as User
from products.models import Product


class RatingAspect(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return str(self.name)


class AspectGroup(models.Model):
    name = models.CharField(max_length=100)
    aspects = models.ManyToManyField(RatingAspect)

    def __str__(self):
        return f'{self.name}'


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'product')


class RatingScore(models.Model):
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, related_name='scores')
    aspect = models.ForeignKey(RatingAspect, on_delete=models.CASCADE, related_name='scores')
    score = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commments')
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.created_at.strftime('%d-%B-%Y-%X')}'


class AdminResponse(models.Model):
    comment = models.OneToOneField(Comment, on_delete=models.CASCADE, related_name='response', null=True, blank=True)
    responder = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'is_staff': True})
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.responder.email}- {self.created_at.strftime('%d-%B-%Y-%X')}'
