from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/save_location', methods=['POST'])
def save_location():
    data = request.json
    print('Received data:', data)
    # データ処理のロジックをここに書く（例：データベースに保存など）

    return jsonify({'status': 'success'}), 200


if __name__ == '__main__':
    app.run(debug=True)
# from flask import Flask, request, jsonify
# app = Flask(__name__)

# locations = []


# @app.route('/save_location', methods=['POST'])
# def save_location():
#     data = request.json
#     locations.append({
#         'latitude': data['latitude'],
#         'longitude': data['longitude']
#     })
#     return jsonify({'message': 'Location saved'})


# @app.route('/get_locations', methods=['GET'])
# def get_locations():
#     return jsonify(locations)
