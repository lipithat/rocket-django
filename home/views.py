import boto3
import datetime
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.cache import cache  # Django cache framework

from .models import *

# Function to get data from DynamoDB
def get_dynamodb_data():
    # Use caching to avoid frequent DynamoDB calls
    cache_key = 'dynamodb_sensor_data'
    data = cache.get(cache_key)

    if not data:
        session = boto3.Session(profile_name='PowerUserAccess-963517230849')
        db = session.resource('dynamodb', region_name='eu-west-1')
        table = db.Table('sensor_data')

        # Scan the DynamoDB table for all items
        response = table.scan(ProjectionExpression="fluviq, payload")
        items = response.get('Items', [])

        # Handle pagination
        while 'LastEvaluatedKey' in response:
            response = table.scan(ProjectionExpression="fluviq, payload", ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))

        # Cache the data for 10 minutes
        cache.set(cache_key, items, timeout=600)
    else:
        items = data

    return items

def process_items(items):
    valid_items = []
    for item in items:
        fluviq_timestamp = item.get('fluviq', '')
        if fluviq_timestamp:
            item_datetime = datetime.datetime.fromtimestamp(int(fluviq_timestamp) / 1000)
            item['item_datetime'] = item_datetime
            valid_items.append(item)

    valid_items.sort(key=lambda x: x['item_datetime'])
    return valid_items

def index(request):
    items = get_dynamodb_data()
    valid_items = process_items(items)

    temperatures = []
    humidity = []
    voltage = []

    for item in valid_items:
        item_datetime = item['item_datetime']
        formatted_timestamp = item_datetime.strftime('%Y-%m-%d %H:%M:%S')

        payload = item.get('payload', {})

        temperatures.append({
            't1': float(payload.get('temperature', {}).get('t1', 0)),
            't2': float(payload.get('temperature', {}).get('t2', 0)),
            'timestamp': formatted_timestamp
        })

        humidity.append({
            'h1': float(payload.get('humidity', {}).get('h1', 0)),
            'h2': float(payload.get('humidity', {}).get('h2', 0)),
            'h3': float(payload.get('humidity', {}).get('h3', 0)),
            'timestamp': formatted_timestamp
        })

        voltage.append({
            'voltage': float(payload.get('voltage', 0)),
            'timestamp': formatted_timestamp
        })

    context = {
        'segment': 'dashboard',
        'temperature_data': json.dumps(temperatures),
        'humidity_data': json.dumps(humidity),
        'voltage': json.dumps(voltage)
    }

    return render(request, "dashboard/index.html", context)

@login_required(login_url='/users/signin/')
def starter(request):
    context = {}
    return render(request, "pages/starter.html", context)
