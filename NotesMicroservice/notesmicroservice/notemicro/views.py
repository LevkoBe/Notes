from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random

@csrf_exempt
def random_note(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        
        note_titles = body.get('note_titles', [])
        
        if not note_titles:
            return JsonResponse({'error': 'No note titles provided'}, status=400)
        
        random_title = random.choice(note_titles)
        
        return JsonResponse({'random_title': random_title})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
