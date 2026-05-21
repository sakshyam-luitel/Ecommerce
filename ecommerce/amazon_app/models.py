# import uuid
# from django.db import models
# from django.conf import settings

# # Create your models here.
# class Cart(models.Model):
#     user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     productId = models.CharField(max_length = 100, primary_key = True)
#     quantity = models.IntegerField()
#     deliveryOptionId = models.CharField(max_length = 50)

# class Products(models.Model):
#     id = models.CharField(max_length = 100 , primary_key = True)
#     image = models.CharField(max_length = 255)
#     name = models.CharField(max_length = 255)
#     stars = models.FloatField()
#     count = models.IntegerField()
#     priceCents = models.IntegerField()

# class Order(models.Model):
#     user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     order_placed_date = models.DateTimeField(auto_now_add=True)
#     total_price = models.DecimalField(max_digits=10, decimal_places=2)


# class OrderItem(models.Model):
#     order= models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
#     product_id = models.UUIDField()
#     quantity = models.IntegerField()
#     arriving_date = models.DateField()

#     # class Meta:
#     #     unique_together = ('order', 'product_id')


import uuid
from django.db import models
from django.conf import settings


class Cart(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product_id = models.CharField(max_length=100, primary_key=True)
    quantity = models.IntegerField()
    delivery_option_id = models.CharField(max_length=50)


class Products(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    image = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    stars = models.FloatField()
    count = models.IntegerField()
    priceCents = models.IntegerField()


class Order(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_placed_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_id = models.UUIDField()
    quantity = models.IntegerField()
    arriving_date = models.DateField()
