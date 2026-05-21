import uuid

from django.shortcuts import render
#from django.views.decorators.csrf import csrf_exempt
from .serializers import ProductsSerializer , CartSerializer , OrderSerializer, OrderItemSerializer


from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from amazon_app.models import Products , Cart, Order, OrderItem

# Create your views here.
@api_view(['GET' ,  'POST'])
def products(request):
    if request.method == "GET":
        products = Products.objects.all()
        serializer = ProductsSerializer(products , many = True)
        return Response(serializer.data , status = status.HTTP_200_OK)
    elif request.method == "POST":
        serializer = ProductsSerializer( data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status = status.HTTP_201_CREATED)
        return Response(serializer.errors , status = status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST','GET','DELETE'])
@permission_classes([IsAuthenticated])
def cart(request):
    
    if request.method == "POST":
        serializer = CartSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(user_id = request.user)
            return Response(serializer.data , status = status.HTTP_201_CREATED)
        return Response(serializer.errors , status = status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        cart = Cart.objects.filter(user_id = request.user)
        serializer = CartSerializer(cart , many = True)
        return Response(serializer.data , status = status.HTTP_200_OK)
    elif request.method == 'DELETE':
        cart = Cart.objects.filter(user_id = request.user)
        cart.delete()
        return Response(status= status.HTTP_204_NO_CONTENT)

    
@api_view(["GET","DELETE", "PATCH"])
def cart_details(request, pk):
    try:
        cart_data = Cart.objects.get(pk = pk)
    except:
        return Response(status = status.HTTP_404_NOT_FOUND)

    if request.method == "PATCH":
        serializer = CartSerializer(cart_data , data = request.data , partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status = status.HTTP_200_OK)
        return Response(serializer.errors , status = status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        cart_data = Cart.objects.get(pk = pk)
        cart_data.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)
    elif request.method == "GET":
        serializer = CartSerializer(cart_data)
        return Response(serializer.data , status = status.HTTP_200_OK)
    
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def order(request):
    if request.method == "GET":
        order = Order.objects.filter(user_id = request.user)
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data , status = status.HTTP_200_OK)
    elif request.method == "POST":
        serializer = OrderSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(user_id = request.user , id = uuid.uuid4())
            return Response(serializer.data , status = status.HTTP_201_CREATED)
        return Response(serializer.errors , status = status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def order_details(request, pk):
    try:
        order_data = Order.objects.get(pk=pk, user_id=request.user)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        order_data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'GET':
        serializer = OrderSerializer(order_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def order_items(request):
    if request.method == 'GET':
        order_data = OrderItem.objects.filter(order__user_id=request.user)
        serializer = OrderItemSerializer(order_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





    
    



