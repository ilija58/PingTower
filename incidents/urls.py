from django.urls import path
from .views import IncidentListView

urlpatterns = [
    path("sites/<int:site_id>/incidents/", IncidentListView.as_view(), name="site-incidents"),
]
