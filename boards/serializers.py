from .models import Boards,Cards,Lists,BoardMember
from rest_framework import serializers



class BoardsSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.first_name')
    class Meta:
        model = Boards
        fields = ['id','title','created_at', 'owner']


# class ListsSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Lists
#         fields = "__all__"



class CardsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cards
        fields = "__all__"
    

class BoardMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = BoardMember
        fields = "__all__"


class ListDetailsSerializer(serializers.ModelSerializer):    

    # cards = CardsSerializer(many=True, read_only = True)
    cards = serializers.SlugRelatedField(  many=True,
        read_only=True,
        slug_field='title'
)
    class Meta:
        model = Lists
        fields = ['id', 'title','cards' ]



class BoardDetailsSerializer(serializers.ModelSerializer):

    lists = ListDetailsSerializer(many = True, read_only = True)


    owner = serializers.ReadOnlyField(source='owner.first_name')

    class Meta:
        model = Boards
        fields = ['id', 'title','owner', 'lists']


