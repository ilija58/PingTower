from rest_framework import generics, permissions
from .models import CheckResult
from .serializers import CheckResultSerializer

class SiteChecksListView(generics.ListAPIView):
    serializer_class = CheckResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        site_id = self.kwargs["site_id"]
        return CheckResult.objects.filter(site_id=site_id).order_by("-timestamp")

