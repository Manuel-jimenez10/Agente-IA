import cv2
import os
from ultralytics import YOLO

model = YOLO('yolov5su.pt')

# Directorio de los segmentos HLS generados por ffmpeg
hls_directory = '/opt/venv/aigis/streaming'
m3u8_file = os.path.join(hls_directory, 'output.m3u8')
info_filename = '/opt/venv/aigis/scripts/info.txt'

def get_latest_segment():
    """Obtiene el nombre del último segmento desde el archivo output.m3u8."""
    try:
        with open(m3u8_file, 'r') as file:
            lines = file.readlines()
            ts_files = [line.strip() for line in lines if line.strip().endswith('.ts')]
            if ts_files:
                return os.path.join(hls_directory, ts_files[-1])  # Devuelve el segmento más reciente
    except FileNotFoundError:
        print(f"No se encontró el archivo: {m3u8_file}")
    return None

def process_latest_segment():
    """Procesa el segmento HLS más reciente y guarda la detección en info.txt."""
    try:
        segment_path = get_latest_segment()
        if not segment_path:
            print("No se encontraron segmentos para procesar.")
            return

        print(f"Procesando segmento más reciente: {segment_path}")
        cap = cv2.VideoCapture(segment_path)

        if not cap.isOpened():
            print(f"Error al abrir el archivo de segmento: {segment_path}")
            return

        detection_text = ""
        detected_objects = False

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            results = model(frame)
            first_detection = True

            for result in results[0].boxes.data:
                class_id = int(result[5])
                class_name = model.names[class_id]
                
                if not first_detection:
                    detection_text += ","
                
                detection_text += class_name
                detected_objects = True
                first_detection = False
            
            if detected_objects:
                break  # Detener después de la primera detección para optimizar

        cap.release()

        if detected_objects:
            with open(info_filename, 'w') as text_file:
                text_file.write(detection_text)
            print(f"Objetos detectados guardados en: {info_filename}")
        else:
            print("No se detectaron objetos en el segmento más reciente.")

    except KeyboardInterrupt:
        print("Interrupción detectada. Saliendo del script...")

if __name__ == "__main__":
    process_latest_segment()
