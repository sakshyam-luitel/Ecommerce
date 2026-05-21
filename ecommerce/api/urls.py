from django.urls import path
from . import views

urlpatterns = [
    path('products/' , views.products , name = 'products'),
    path('cart/' , views.cart , name = 'cart'),
    path('cart/<str:pk>/', views.cart_details , name= 'cartdetails'),
    path('order/', views.order , name = 'order'),
    path('order/<str:pk>/', views.order_details, name='order_details'),
    path('order_items/',views.order_items , name = "order_item"),
]