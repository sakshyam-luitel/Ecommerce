from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register , name = "register"),
    path('',views.intro , name = "intro"),
    path('login/',views.login , name = "login"),
    path('amazon/', views.products , name = 'amazon'),
    path('checkout/', views.checkout, name = 'checkout'),
    path('orders/' , views.orders , name = 'orders'),
    path('tracking/', views.tracking , name = 'tracking'),
]