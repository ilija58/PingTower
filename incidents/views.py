from rest_framework import generics, permissions
from .models import Incident
from .serializers import IncidentSerializer

class IncidentListView(generics.ListAPIView):
    serializer_class = IncidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        site_id = self.kwargs["site_id"]
        return Incident.objects.filter(site_id=site_id).order_by("-start_time")

