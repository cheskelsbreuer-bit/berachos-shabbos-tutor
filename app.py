"""Learning Tutor — Flask backend.

Serves the single-page app and Gemara content from data/content.json.
"""
import json
import os
from pathlib import Path

from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "content.json"

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)


def load_content():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/content")
def api_content():
    return jsonify(load_content())


@app.route("/api/sugya/<sugya_id>")
def api_sugya(sugya_id):
    data = load_content()
    for masechta in data.get("masechtos", []):
        for perek in masechta.get("perakim", []):
            for sugya in perek.get("sugyos", []):
                if sugya.get("id") == sugya_id:
                    return jsonify(sugya)
    return jsonify({"error": "sugya not found"}), 404


@app.route("/api/lexicon/<path:word>")
def lexicon_proxy(word):
    """Proxy Sefaria's lexicon API so the browser can do live word lookups."""
    import urllib.parse
    import urllib.request
    url = "https://www.sefaria.org/api/words/" + urllib.parse.quote(word) + "?never_split=1"
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            data = json.loads(r.read().decode("utf-8"))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 502


@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory(app.static_folder, filename)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
