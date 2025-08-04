from flask import Flask, jsonify, request, send_file, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from flask_cors import CORS
from reportlab.pdfgen import canvas
import io

app = Flask(__name__)

uri = f"mongodb://{os.getenv("MONGO_USERNAME")}:{os.getenv("MONGO_PASSWORD")}@localhost:27017/?authSource=admin"
client = MongoClient(uri)
db = client['scoreboard']
collectionEiner = db['einer']
collectionZweier = db['zweier']
collectionConfig = db['config']

@app.route("/download-pdf")
def download_pdf():

    # Create a PDF in memory
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)

    y = 800
    p.setFont("Helvetica", 12)
    p.drawString(100, y, "MongoDB Data Export")
    y -= 30

    home_ff = collectionConfig.find_one()
    einerHome = list(collectionEiner.find({"feuerwehr": home_ff["home_ff"]}))
    einerHome = sorted(einerHome, key=lambda x: ms_to_time_str(x.get('zeit', 0), x.get('hasse', 0)))
    zweierHome = list(collectionZweier.find({"feuerwehr": home_ff["home_ff"]}))
    zweierHome = sorted(zweierHome, key=lambda x: ms_to_time_str(x.get('zeit', 0), x.get('hasse', 0)))
    einerGaeste = list(collectionEiner.find({"feuerwehr": {"$ne": home_ff["home_ff"]}}))
    einerGaeste = sorted(einerGaeste, key=lambda x: ms_to_time_str(x.get('zeit', 0), x.get('hasse', 0)))
    zweierGaeste = list(collectionZweier.find({"feuerwehr": {"$ne": home_ff["home_ff"]}}))  
    zweierGaeste = sorted(zweierGaeste, key=lambda x: ms_to_time_str(x.get('zeit', 0), x.get('hasse', 0)))


    for doc in einerHome:
        line = f"- Name: {doc.get('name')}, Feuerwehr: {doc.get('feuerwehr')}, Zeit: {ms_to_time_str(doc.get('zeit', 0), doc.get('hasse', 0))}"
        p.drawString(100, y, line)
        y -= 20
        if y < 50:
            p.showPage()
            y = 800

    for doc in einerGaeste:
            line = f"- Name: {doc.get('name')}, Feuerwehr: {doc.get('feuerwehr')}, Zeit: {ms_to_time_str(doc.get('zeit', 0), doc.get('hasse', 0))}"
            p.drawString(100, y, line)
            y -= 20
            if y < 50:
                p.showPage()
                y = 800

    for doc in zweierHome:
        line = f"- Name: {doc.get('name')}, Feuerwehr: {doc.get('feuerwehr')}, Zeit: {ms_to_time_str(doc.get('zeit', 0), doc.get('hasse', 0))}"
        p.drawString(100, y, line)
        y -= 20
        if y < 50:
            p.showPage()
            y = 800

    for doc in zweierGaeste:
        line = f"- Name: {doc.get('name')}, Feuerwehr: {doc.get('feuerwehr')}, Zeit: {ms_to_time_str(doc.get('zeit', 0), doc.get('hasse', 0))}"
        p.drawString(100, y, line)
        y -= 20
        if y < 50:
            p.showPage()
            y = 800

    p.save()

    buffer.seek(0)

    # Send the PDF as a response
    return send_file(
        buffer,
        as_attachment=True,
        download_name="generated.pdf",
        mimetype="application/pdf"
    )


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

if __name__ == "__main__":
    app.run(debug=True)