from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/api/get_location', methods=['POST'])
def get_location():
    data = request.json
    address = data.get('Ramapuram chennai')

    # API endpoint and parameters
    url = "https://map-geocoding.p.rapidapi.com/json"
    querystring = {"address": address}

    # Headers including the API key and host
    headers = {
        "x-rapidapi-key": "6d1abe9edamsh6daae6a50b72ab8p1a01dcjsna66d4b8e8627",
        "x-rapidapi-host": "map-geocoding.p.rapidapi.com"
    }

    # Making the API request
    response = requests.get(url, headers=headers, params=querystring)

    # Checking if the request was successful
    if response.status_code == 200:
        data = response.json()

        # Assuming the API returns the latitude and longitude under 'location' key
        if "results" in data and len(data["results"]) > 0:
            lat = data["results"][0]["geometry"]["location"]["lat"]
            lng = data["results"][0]["geometry"]["location"]["lng"]
            formatted_address = data["results"][0]["formatted_address"]

            return jsonify({
                'lat': lat,
                'lng': lng,
                'address': formatted_address
            })
        else:
            return jsonify({'error': 'No results found.'}), 404
    else:
        return jsonify({'error': f'Error: {response.status_code}'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
