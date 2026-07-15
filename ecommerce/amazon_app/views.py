from django.shortcuts import render
from django.conf import settings
from .models import Products,Cart
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

import json

# Create your views here.
def products_data(request):
    products = list(Products.objects.all().values())  # convert queryset to list for JSON serialization

    return JsonResponse(products, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def products(request):
    # products = Products.objects.all()

    # for product in products:
    #     product.stars = int(product.stars * 10)
    #     product.priceCents = round(float((product.priceCents)/100) , 2)

    # context = {'products' : products}
    return render(request , 'amazon.html')


def intro(request):
    return render(request, 'intro.html', {'google_client_id': settings.GOOGLE_CLIENT_ID})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkout(request):
    return render(request , 'checkout.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orders(request):
    return render(request , 'orders.html')



def login(request):
    return render(request , "login.html", {'google_client_id': settings.GOOGLE_CLIENT_ID})

def register(request):
    return render(request , "register.html")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tracking(request):
    return render(request , "tracking.html")

def callback(request):
    return render(request , "callback.html")
    