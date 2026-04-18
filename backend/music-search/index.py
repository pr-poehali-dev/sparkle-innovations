import json
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    """Поиск музыки через iTunes Search API и Deezer API — бесплатно, без ключей"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {'Access-Control-Allow-Origin': '*'}

    params = event.get('queryStringParameters') or {}
    query = params.get('q', '').strip()
    source = params.get('source', 'itunes')
    limit = int(params.get('limit', '20'))

    if not query:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Query is required'})}

    tracks = []

    if source == 'deezer':
        tracks = search_deezer(query, limit)
    else:
        tracks = search_itunes(query, limit)

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'tracks': tracks, 'total': len(tracks), 'source': source, 'query': query})
    }


def search_itunes(query: str, limit: int) -> list:
    encoded = urllib.parse.quote(query)
    url = f"https://itunes.apple.com/search?term={encoded}&media=music&entity=song&limit={limit}&country=US"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
        tracks = []
        for item in data.get('results', []):
            tracks.append({
                'id': str(item.get('trackId', '')),
                'title': item.get('trackName', ''),
                'artist': item.get('artistName', ''),
                'album': item.get('collectionName', ''),
                'duration': item.get('trackTimeMillis', 0) // 1000,
                'preview_url': item.get('previewUrl', ''),
                'cover': item.get('artworkUrl100', '').replace('100x100', '300x300'),
                'source': 'iTunes',
                'genre': item.get('primaryGenreName', ''),
            })
        return tracks
    except Exception as e:
        return []


def search_deezer(query: str, limit: int) -> list:
    encoded = urllib.parse.quote(query)
    url = f"https://api.deezer.com/search?q={encoded}&limit={limit}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
        tracks = []
        for item in data.get('data', []):
            tracks.append({
                'id': str(item.get('id', '')),
                'title': item.get('title', ''),
                'artist': item.get('artist', {}).get('name', ''),
                'album': item.get('album', {}).get('title', ''),
                'duration': item.get('duration', 0),
                'preview_url': item.get('preview', ''),
                'cover': item.get('album', {}).get('cover_medium', ''),
                'source': 'Deezer',
                'genre': '',
            })
        return tracks
    except Exception as e:
        return []
