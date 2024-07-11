import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import argparse
import requests
from io import BytesIO

# Load the model and processor
model_id = "Salesforce/blip-image-captioning-large"
processor = BlipProcessor.from_pretrained(model_id)
model = BlipForConditionalGeneration.from_pretrained(model_id)

# Parse command-line arguments
parser = argparse.ArgumentParser(description='Process a list of image paths.')
parser.add_argument('image_paths', type=str, help='Comma-separated list of image paths')
args = parser.parse_args()

# Split the image_urls argument into a list of URLs
image_paths = args.image_paths.split(',')

print("")
print(f"Processing {len(image_paths)} images...")
print("")

# Process each image file path
for image_path in image_paths:
    # Open the image from the file path
    image = Image.open(image_path).convert('RGB')

    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")

    # Generate the caption with adjusted parameters for more detailed descriptions
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=150, num_beams=5, temperature=0.9, do_sample=True)
        
    # Decode the generated caption
    caption = processor.decode(outputs[0], skip_special_tokens=True)
    print(f"Generated Caption for {image_path}:")
    print(caption)
    print("")