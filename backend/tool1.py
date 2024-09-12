from flask import Flask, request, jsonify
import json
import os
import logging
from flask_cors import CORS

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Configure CORS to allow requests from any origin (be cautious in production)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/search', methods=['POST'])
def search():
    try:
        logging.debug('Received request headers: %s', request.headers)
        logging.debug('Received request data: %s', request.data)
        
        data = request.json
        if not data:
            raise ValueError('No JSON data received or invalid JSON format')
        
        search_query = data.get('query', '')
        location = data.get('location', '')
        
        logging.debug('Extracted search query: %s', search_query)
        logging.debug('Extracted location: %s', location)
        
        if not search_query or not location:
            raise ValueError('Both query and location must be provided')
        
        data_to_save = {
            'query': search_query,
            'location': location
        }
        
        # Use relative path to save the file in the backend/data folder
        file_path = os.path.join('backend', 'data.json')
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Write or update the file
        with open(file_path, 'w') as json_file:
            json.dump(data_to_save, json_file, indent=4)
            
        logging.info('Data successfully saved to %s', file_path)
        
        response_message = f'Search Query: "{search_query}", Location: "{location}"'
        return jsonify({'message': response_message})
        
    except ValueError as ve:
        logging.error('ValueError: %s', str(ve))
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logging.error('Unexpected error: %s', str(e))
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/process', methods=['POST'])
def process():
    try:
        logging.debug('Processing request headers: %s', request.headers)
        logging.debug('Processing request data: %s', request.data)
        
        data = request.json
        if not data:
            raise ValueError('No JSON data received or invalid JSON format')
        
        results = {
            'status': 'Processing completed',
            'query': data.get('query'),
            'location': data.get('location')
        }
        
        # Use relative path to save the file in the backend/data folder
        file_path = os.path.join('backend', 'results.json')
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Write or update the file
        with open(file_path, 'w') as json_file:
            json.dump(results, json_file, indent=4)
            
        logging.info('Results successfully saved to %s', file_path)
        
        return jsonify({'message': 'Processing completed', 'results': results})
    
    except ValueError as ve:
        logging.error('ValueError: %s', str(ve))
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logging.error('Unexpected error: %s', str(e))
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/api/results', methods=['GET'])
def get_results():
    try:
        # Use relative path to read the file in the backend/data folder
        file_path = os.path.join('backend',  'results.json')
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f'{file_path} not found')
        
        with open(file_path, 'r') as json_file:
            results_data = json.load(json_file)
        
        logging.debug('Fetched results data: %s', results_data)
        
        return jsonify(results_data)
    
    except FileNotFoundError as fnf_error:
        logging.error('FileNotFoundError: %s', str(fnf_error))
        return jsonify({'error': str(fnf_error)}), 404
    except Exception as e:
        logging.error('Error fetching results: %s', str(e))
        return jsonify({'error': 'Failed to fetch results'}), 500

if __name__ == '__main__':
    app.run(port=5000)
