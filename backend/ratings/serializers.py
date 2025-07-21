from sqlite3 import DatabaseError
from django.db import transaction
from rest_framework import serializers
from .models import AdminResponse, Comment, Rating, RatingAspect, RatingScore
from products.models import ProductItem


class RatingAspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingAspect
        fields = ['name']


class RatingScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingScore
        fields = ['aspect', 'score']

    def to_internal_value(self, data):
        aspect_str = data.get('aspect')
        if isinstance(aspect_str, str):
            aspect_instance, _ = RatingAspect.objects.get_or_create(name=aspect_str)
            data['aspect'] = aspect_instance.pk
        return super().to_internal_value(data)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']


class AdminResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminResponse
        fields = ['text']

class RatingSerializer(serializers.ModelSerializer):
    product_item_uuid = serializers.UUIDField(write_only=True)
    overall_rating = serializers.IntegerField(required=False, min_value=1, max_value=10)
    # NOTE: this serializer is important to validate that the dictionaries inside the list are valid
    rating_aspects = RatingScoreSerializer(many=True, required=False)
    comment = CommentSerializer(required=False)

    class Meta:
        model = Rating
        fields = ['product_item_uuid', 'overall_rating', 'rating_aspects', 'comment']

    def to_internal_value(self, data):
        return super().to_internal_value(self._normalize_comment(data))

    def _normalize_comment(self, data):
        """ the nestedSerializer for comment expects a dict """
        comment = data.get('comment')
        if isinstance(comment, str):
            data = data.copy()
            data['comment'] = {'text': comment.strip()}
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        product_item_uuid = validated_data.pop('product_item_uuid')
        rating_aspects = validated_data.pop('rating_aspects', [])
        overall_rating = validated_data.pop('overall_rating')
        comment_data = validated_data.pop('comment', None)

        # if commend_data exists

        try:
            product_item = ProductItem.objects.select_related('product').get(
                uuid=product_item_uuid
            )
            product = product_item.product
        except ProductItem.DoesNotExist:
            raise serializers.ValidationError({
                'product_uuid': 'Invalid produc_item uuid'
            })

        try:
            with transaction.atomic():
                rating = Rating.objects.create(user=user, product=product)

                scores = []
                total = 0
                if rating_aspects:
                    for item in rating_aspects:
                        name = item['aspect']
                        score = item['score']
                        aspect_obj, _ = RatingAspect.objects.get_or_create(name=name)
                        score_serializer = RatingScoreSerializer(data={
                            'aspect': aspect_obj.pk,
                            'score': score
                        })
                        score_serializer.is_valid(raise_exception=True)
                        scores.append(RatingScore(rating=rating, aspect=aspect_obj, score=score))

                        # calculate the overall rating from the aspects
                        total += score
                    avg = round(total / len(rating_aspects))

                    overall_aspect, _ = RatingAspect.objects.get_or_create(name='overall')
                    # add the average rating score to the scores list
                    scores.append(RatingScore(rating=rating, aspect=overall_aspect, score=avg))
                else:
                    if overall_rating is None:
                        raise serializers.ValidationError({
                            'overall_rating': "overall_rating is required if ratings aspects is empty"
                        })
                    overall_aspect, _ = RatingAspect.objects.get_or_create(name='overall')
                    scores.append(RatingScore(rating=rating, aspect=overall_aspect, score=overall_rating))

                RatingScore.objects.bulk_create(scores)

                if comment_data:
                    comment_serializer = CommentSerializer(data=comment_data)
                    comment_serializer.is_valid(raise_exception=True)
                    Comment.objects.create(user=user, rating=rating, text=comment_data['text'])

                return rating
        except DatabaseError as e:
            raise serializers.ValidationError({
                'message': f'couln\'t create the rating.error: {str(e)}'
            })

        return super().create(validated_data)


class RatingSerializerReadOnly(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    overall_score = serializers.SerializerMethodField()
    aspects = serializers.SerializerMethodField()
    admin_response = AdminResponseSerializer(read_only=True)
    comment = CommentSerializer(source='comments.first', read_only=True)

    class Meta:
        model = Rating
        fields = [
            'username',
            'overall_score',
            'aspects',
            'comment',
            'admin_response'
        ]

    def get_overall_score(self, obj):
        overall = obj.scores.filter(aspect__name='overall').first()
        return overall.score if overall else None

    def get_aspects(self, obj):
        return {
            score.aspect.name: score.score
            for score in obj.scores.exclude(aspect__name='overall')
        }


