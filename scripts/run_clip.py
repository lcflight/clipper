import os
import clip
import torch
from PIL import Image
import open_clip
open_clip.list_pretrained()

# Load the model and the preprocessing function
model, preprocess = clip.load("ViT-B/32", device="cpu")

# Directory containing the images
image_dir = "../images"

# Prepare the texts
texts = [
    "indoor", "outdoor", "daytime", "nighttime", "cat", "dog", "car", "bicycle"
]
text_inputs = clip.tokenize(texts)

# Get a list of all files in the image directory
files = os.listdir(image_dir)

# Filter out non-image files
image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

# Loop through each image file
for image_file in image_files:
    # Load and preprocess the image
    image_path = os.path.join(image_dir, image_file)
    image = preprocess(Image.open(image_path)).unsqueeze(0)

    # Get the image and text features
    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text_inputs)

    # Calculate the similarity
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0)

    # Define a similarity threshold
    similarity_threshold = 0.2  # Adjust this value as needed

    # Print the image file name
    print(f"Image: {image_file}")

    # Print the results only if similarity is above the threshold
    for i, text in enumerate(texts):
        if similarity[i].item() > similarity_threshold:
            print(f"  {text}: {similarity[i].item():.3f}")
    
    # Add a separator for readability between images
    print("-" * 40)