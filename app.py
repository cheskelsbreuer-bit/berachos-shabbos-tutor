"""Berachos/Shabbos Tutor V2 — minimal Flask server.
Serves a static index.html and proxies Sefaria so the browser doesn't hit CORS edge cases.
"""
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/sefaria/<path:ref>")
def sefaria_proxy(ref):
    """Proxy Sefaria's text API. ref is the URL-encoded reference like 'Shabbat.2a'."""
    url = "https://www.sefaria.org/api/texts/" + urllib.parse.quote(ref) + "?context=0&commentary=0"
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.loads(r.read().decode("utf-8"))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 502


@app.route("/api/lexicon/<path:word>")
def lexicon_proxy(word):
    """Proxy Sefaria's lexicon API for word definitions."""
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
