from django.urls import path
from .views import SiteChecksListView

urlpatterns = [
    path("sites/<int:site_id>/checks/", SiteChecksListView.as_view(), name="site-checks"),
]
