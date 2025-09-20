from django.shortcuts import render
from rest_framework import viewsets, permissions

from .serializers import SiteSerializer


class SiteViewSet(viewsets.ModelViewSet):
    serializer_class = SiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.sites.all()