from flask import Flask, jsonify, request, send_file, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from flask_cors import CORS
from reportlab.pdfgen import canvas
import io

load_dotenv()

uri = f"mongodb://{os.getenv("MONGO_USERNAME")}:{os.getenv("MONGO_PASSWORD")}@localhost:27017/?authSource=admin"
client = MongoClient(uri)
db = client['scoreboard']
collectionEiner = db['einer']
collectionZweier = db['zweier']
collectionConfig = db['config']

app = Flask(__name__)
CORS(app) 

@app.route('/einer', methods=['GET'])
def get_all_einer():
    documents = list(collectionEiner.find())
    documents = [convert_id(doc) for doc in documents]
    return jsonify(documents) 

@app.route('/einer/home', methods=['GET'])
def get_home_einer():
    try:
        home_ff = collectionConfig.find_one()

        documents = list(collectionEiner.find({"feuerwehr":  {
        "$regex": f"^{home_ff['home_ff']}$",
        "$options": "i"
    }}))
        documents = [convert_id(doc) for doc in documents]
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/einer/gaeste', methods=['GET'])
def get_gaeste_einer():
    try:
        home_ff = collectionConfig.find_one()

        documents = list(collectionEiner.find({"feuerwehr": {"$not": {
            "$regex": f"^{home_ff['home_ff']}$",
            "$options": "i"
        }}}))
        documents = [convert_id(doc) for doc in documents]
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/einer', methods=['POST'])
def create_einer():
    try:
        data = request.get_json(force=True)

        # Optional: Basic validation
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input"}), 400

        result = collectionEiner.insert_one(data)
        return jsonify({"inserted_id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/einer/<id>', methods=['PUT'])
def update_einer(id):
    try:
        data = request.get_json(force=True)
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input"}), 400

        result = collectionEiner.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.matched_count > 0:
            return jsonify({"message": "Item updated successfully"}), 200
        else:
            return jsonify({"error": "Item not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/einer/<id>', methods=['GET'])
def get_einer(id):
    try:
        document = collectionEiner.find_one({"_id": ObjectId(id)})
        if document:
            document = convert_id(document)
            return jsonify(document)
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    





@app.route('/zweier', methods=['GET'])
def get_all_zweier():
    documents = list(collectionZweier.find())
    documents = [convert_id(doc) for doc in documents]
    return jsonify(documents) 
    

@app.route('/zweier', methods=['POST'])
def create_zweier():
    try:
        data = request.get_json(force=True)

        # Optional: Basic validation
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input"}), 400

        result = collectionZweier.insert_one(data)
        return jsonify({"inserted_id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/zweier/<id>', methods=['PUT'])
def update_zweier(id):
    try:
        data = request.get_json(force=True)
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input"}), 400

        result = collectionZweier.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.matched_count > 0:
            return jsonify({"message": "Item updated successfully"}), 200
        else:
            return jsonify({"error": "Item not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/zweier/<id>', methods=['GET'])
def get_zweier(id):
    try:
        document = collectionZweier.find_one({"startnummer": str(id)})
        if document:
            document = convert_id(document)
            return jsonify(document)
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/zweier/home', methods=['GET'])
def get_home_zweier():
    try:
        home_ff = collectionConfig.find_one()

        documents = list(collectionZweier.find({"feuerwehr": {"$regex": f"^{home_ff['home_ff']}$","$options": "i"}}))
        documents = [convert_id(doc) for doc in documents]
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/zweier/gaeste', methods=['GET'])
def get_gaeste_zweier():
    try:
        home_ff = collectionConfig.find_one()

        documents = list(collectionZweier.find({"feuerwehr": {"$not": {
            "$regex": f"^{home_ff['home_ff']}$",
            "$options": "i"
        }}}))
        documents = [convert_id(doc) for doc in documents]
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/config', methods=['GET'])
def get_config():
    try:
        document = collectionConfig.find_one()
        if document:
            document = convert_id(document)
            return jsonify(document)
        else:
            return jsonify({"error": "Configuration not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/config/<id>', methods=['PUT'])
def update_config(id):
    try:
        data = request.get_json(force=True)
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input"}), 400

        result = collectionConfig.update_one({"_id": ObjectId(id)}, {"$set": data}, upsert=True)
        if result.modified_count > 0 or result.upserted_id:
            return jsonify({"message": "Configuration updated successfully"}), 200
        else:
            return jsonify({"error": "No changes made"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/clear-db', methods=['DELETE'])
def clear_db():
    try:
        # Clear all collections
        collectionEiner.delete_many({})
        collectionZweier.delete_many({})

        return jsonify({"message": "Database cleared successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/download-pdf")
def download_pdf():

    # Create a PDF in memory
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)

    y = 800
    p.setFont("Helvetica", 16)
    p.drawString(50, y, "Ergebnisliste")
    y -= 30

    home_ff = collectionConfig.find_one()
    einerHome = list(collectionEiner.find({"feuerwehr": home_ff["home_ff"]}))
    einerHome = sorted(einerHome, key=lambda x: ms_to_time_str(time_str_to_ms(x.get('zeit', '00:00:000')), int(x.get('hasse', 0))))
    zweierHome = list(collectionZweier.find({"feuerwehr": home_ff["home_ff"]}))
    zweierHome = sorted(zweierHome, key=lambda x: ms_to_time_str(time_str_to_ms(x.get('zeit', '00:00:000')), int(x.get('hasse', 0))))
    einerGaeste = list(collectionEiner.find({"feuerwehr": {"$ne": home_ff["home_ff"]}}))
    einerGaeste = sorted(einerGaeste, key=lambda x: ms_to_time_str(time_str_to_ms(x.get('zeit', '00:00:000')), int(x.get('hasse', 0))))
    zweierGaeste = list(collectionZweier.find({"feuerwehr": {"$ne": home_ff["home_ff"]}}))  
    zweierGaeste = sorted(zweierGaeste, key=lambda x: ms_to_time_str(time_str_to_ms(x.get('zeit', '00:00:000')), int(x.get('hasse', 0))))

    sections = [
        ("Heim - Einer", einerHome),
        ("Heim - Zweier", zweierHome),    
        ("Gast - Einer", einerGaeste),
        ("Gast - Zweier", zweierGaeste)
    ]
    
    for title, data in sections:
        p.setFont("Helvetica-Bold", 14)
        p.drawString(50, y, f"{title}")
        y -= 20

        p.setFont("Helvetica", 10)
        for doc in data:
            name = doc.get("name")
            zeit = doc.get("zeit", "00:00:000")
            hasse = doc.get("hasse", 0)
            feuerwehr = doc.get("feuerwehr", "N/A")
            startnummer = doc.get("startnummer", "N/A")
            if name: 
                line = f"- Name: {name}, Feuerwehr: {feuerwehr}, Startnummer: {startnummer}, Zeit: {zeit}, Hasse: {hasse}, Endzeit: {ms_to_time_str(time_str_to_ms(zeit), hasse)}"
                p.drawString(50, y, line)
            else:
                name1 = doc.get("name1", "N/A")
                name2 = doc.get("name2", "N/A")
                line1 = f"- Steuermann: {name1}, Kranzlmann: {name2}, Feuerwehr: {feuerwehr}"
                line2 = f"   Startnummer: {startnummer}, Zeit: {zeit}, Hasse: {hasse}, Endzeit: {ms_to_time_str(time_str_to_ms(zeit), hasse)}"
                p.drawString(50, y, line1)
                y-= 15
                p.drawString(75, y, line2)
            
            y -= 15

            if y < 50:
                p.showPage()
                y = 800

        y -= 20  # space after section

    p.save()

    buffer.seek(0)

    # Send the PDF as a response
    return send_file(
        buffer,
        as_attachment=True,
        download_name="generated.pdf",
        mimetype="application/pdf"
    )


# Helper function to convert ObjectId to string
def convert_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc

def time_str_to_ms(time_str: str) -> int:
    try:
        minutes, seconds, millis = map(int, time_str.split(":"))
        return (minutes * 60 * 1000) + (seconds * 1000) + millis
    except ValueError:
        raise ValueError("Time string must be in the format MM:SS:mmm")
    
def ms_to_time_str(ms: int, hasse:int) -> str:
    ms = ms + (hasse * 1000)
    minutes = ms // (60 * 1000)
    ms %= (60 * 1000)
    seconds = ms // 1000
    millis = ms % 1000
    return f"{minutes:02d}:{seconds:02d}:{millis:03d}"