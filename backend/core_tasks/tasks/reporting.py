from celery import shared_task


@shared_task
def test_add(x, y):
    print(f'adding {x} + {y}')
    return x + y
