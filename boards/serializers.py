from .models import Boards,Cards,Lists
from rest_framework import serializers



class BoardsSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    class Meta:
        model = Boards
        fields = ['id','title','created_at', 'owner']


class ListsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lists
        fields = "__all__"



class CardsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cards
        fields = "__all__"
    

    