from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
import face_recognition
import numpy as np
from PIL import Image
import io
import os
import shutil

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_images(files: list[UploadFile] = File(...)):
    images = []
    encodings = []
    filenames = []

    # Save uploaded images
    for file in files:
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb") as f:
            content = await file.read()
            f.write(content)

        image = face_recognition.load_image_file(file_location)
        face_encs = face_recognition.face_encodings(image)
        if face_encs:
            encodings.append(face_encs[0])
            filenames.append(file.filename)

    # Group images by face similarity
    groups = {}
    group_id = 1
    assigned = [False] * len(encodings)

    for i in range(len(encodings)):
        if assigned[i]:
            continue
        groups[f"Person_{group_id}"] = [filenames[i]]
        assigned[i] = True
        for j in range(i + 1, len(encodings)):
            if assigned[j]:
                continue
            dist = np.linalg.norm(encodings[i] - encodings[j])
            if dist < 0.6:
                groups[f"Person_{group_id}"].append(filenames[j])
                assigned[j] = True
        group_id += 1

    return {"groups": groups}

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")