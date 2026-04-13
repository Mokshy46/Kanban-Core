from .models import Boards,Cards,Lists,BoardMember
from rest_framework import serializers

class CardsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cards
        fields = "__all__"
        extra_kwargs = {
            'list' :{'read_only' : True},
            
        }       

class BoardMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = BoardMember
        fields = "__all__"


class ListDetailsSerializer(serializers.ModelSerializer):    

    cards = CardsSerializer(many=True, read_only = True)
    class Meta:
        model = Lists
        fields = ['id', 'title','cards' ]
        extra_kwargs = {
            'lists' :{'read_only' : True},
            
        }        


class BoardsSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.first_name')
    lists = ListDetailsSerializer(many = True, read_only = True )
    class Meta:
        model = Boards
        fields = ['id','title','created_at', 'owner' ,'lists']
        

class BoardDetailsSerializer(serializers.ModelSerializer):

    lists = ListDetailsSerializer(many = True, read_only = True)
    owner = serializers.ReadOnlyField(source='owner.first_name')

    class Meta:
        model = Boards
        fields = ['id', 'title','owner', 'lists']

