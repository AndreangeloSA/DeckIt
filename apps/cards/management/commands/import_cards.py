from django.core.management.base import BaseCommand

from apps.cards.services import import_all_cards

class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        import_all_cards()

        self.stdout.write(
            self.style.SUCCESS(
                "Cards imported successfully"
            )
        )



