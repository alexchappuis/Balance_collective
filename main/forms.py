from django import forms
from .models import ContactSubmission


class ContactForm(forms.ModelForm):
    # honeypot — bots fill this; humans don't
    website = forms.CharField(required=False, widget=forms.HiddenInput)

    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'company', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Your name',
                'autocomplete': 'name',
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'Your email',
                'autocomplete': 'email',
            }),
            'company': forms.TextInput(attrs={
                'placeholder': 'Company',
                'autocomplete': 'organization',
            }),
            'message': forms.Textarea(attrs={
                'placeholder': 'Tell us a bit about your team (optional)',
                'rows': 4,
            }),
        }

    def clean_website(self):
        # If the honeypot is filled, treat it as spam.
        if self.cleaned_data.get('website'):
            raise forms.ValidationError('Spam detected.')
        return ''
