from flask import request, send_file, jsonify, Flask
from flask_cors import CORS
import os
import yt_dlp
import uuid

app=Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

DOWNLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'downloads')
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

@app.route("/convert", methods=["GET"])
def convert():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    download_id = str(uuid.uuid4())
    download_path = os.path.join(DOWNLOAD_DIR, download_id)
    os.makedirs(download_path, exist_ok=True)
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
        'outtmpl': os.path.join(download_path, '%(title)s.%(ext)s'),
        'noplaylist': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        
        print(f"Downloaded file: {filename}")
        print(f"File path: {os.path.join(download_path, filename)}")
        
        if not os.path.exists(os.path.join(download_path, filename)):
            files = os.listdir(download_path)
            if files:
                filename = os.path.join(download_path, files[0])
                print(f"Found alternative file: {filename}")
                return send_file(
                    filename,
                    as_attachment=True,
                    download_name=os.path.basename(filename)
                )
        
        print(f"Sending file: {os.path.join(download_path, filename)}")
        return send_file(
            os.path.join(download_path, filename),
            as_attachment=True,
            download_name=filename
        )

if __name__ == "__main__":
    app.run(debug=True)