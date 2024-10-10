import boto3
import datetime
import json

def mf():
    # Create a DynamoDB client
    session = boto3.Session(profile_name='PowerUserAccess-963517230849')
    db = session.resource('dynamodb', region_name='eu-west-1')
    table = db.Table('sensor_data')

    # Scan the DynamoDB table for all items
    response = table.scan()
    items = response['Items']

    valid_items = []
    for item in items:
        fluviq_timestamp = item.get('fluviq', '')
        if fluviq_timestamp:
            # Convert the timestamp from milliseconds to a datetime object and add to valid items
            item_datetime = datetime.datetime.fromtimestamp(int(fluviq_timestamp) / 1000)
            item['item_datetime'] = item_datetime  # Add datetime object for sorting
            valid_items.append(item)

    # Step 2: Sort the valid_items by their datetime object (ascending)
    valid_items.sort(key=lambda x: x['item_datetime'])

    print(valid_items)
    # Prepare temperature data for the template
    temperatures = []

    for item in valid_items:
        fluviq_timestamp = item.get('fluviq', '')
        if fluviq_timestamp:
            # Convert the timestamp from milliseconds to a datetime object
            item_datetime = datetime.datetime.fromtimestamp(int(fluviq_timestamp) / 1000)
            formatted_timestamp = item_datetime.strftime('%Y-%m-%d %H:%M:%S')

            payload = item.get('payload', {})

            # Add temperature data
            temperatures.append({
                't1': float(payload.get('temperature', {}).get('t1', 0)),
                't2': float(payload.get('temperature', {}).get('t2', 0)),
                'timestamp': formatted_timestamp
            })
    print(json.dumps(temperatures))
    return temperatures

if __name__ == "__main__":
    mf()