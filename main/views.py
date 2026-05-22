import resend
from django.conf import settings
from django.contrib import messages
from django.shortcuts import redirect, render
from django.views.generic import TemplateView
from decouple import config

from .forms import ContactForm

resend.api_key = config('re_Vmkye5QR_3aMrLd8S3um9bPX45iBQq6Zn', default='')


class HomeView(TemplateView):
    template_name = 'main/home.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['form'] = ContactForm()
        return ctx


def contact_submit(request):
    if request.method != 'POST':
        return redirect('home')

    form = ContactForm(request.POST)

    if not form.is_valid():
        messages.error(request, 'Please fix the errors below and try again.')
        return render(request, 'main/home.html', {'form': form}, status=400)

    submission = form.save()

    try:
        resend.Emails.send({
            "from": "Balance Collective <isa@balancecollective.co>",
            "to": ["isa@balancecollective.co"],
            "subject": f"New Balance Collective inquiry — {submission.name}",
            "text": (
                f"Name: {submission.name}\n"
                f"Email: {submission.email}\n"
                f"Company: {submission.company or '(not provided)'}\n\n"
                f"Message:\n{submission.message or '(none)'}\n"
            ),
        })
    except Exception as e:
        print(f"Resend error: {e}")
        messages.warning(request, 'Got it — your note is saved. We had a hiccup notifying Isa, but she will see it.')
        return redirect(f"{request.path or '/'}#contact")

    messages.success(request, 'Thank you. Isa will be in touch soon.')
    return redirect('/#contact')