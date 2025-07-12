import streamlit as st
import cv2
import numpy as np
from PIL import Image
from utils.overlay_custom import overlay_image

# Streamlit config
st.set_page_config(page_title="Walmart Virtual Try-On", layout="wide")

# --- Custom CSS ---
st.markdown("""
<style>
html, body, [data-testid="stApp"] {
    background-color: #ffffff !important;
    font-family: 'Segoe UI', sans-serif;
    color: #000000;
}

h1, h2, h3 {
    color: #0071DC;
}

.st-emotion-cache-1kyxreq {
    padding: 1rem 2rem;
}

section[data-testid="stFileUploader"] > div {
    background-color: #FFF9DB !important;
    border: 2px dashed #FFC220 !important;
    border-radius: 12px;
    padding: 1.5rem;
    color: #000000;
    transition: all 0.3s ease-in-out;
}

section[data-testid="stFileUploader"] > div:hover {
    background-color: #FFF3B0 !important;
}

section[data-testid="stFileUploader"] label {
    color: #005DAA !important;
    font-weight: bold;
    font-size: 15px;
}

.stButton>button, .stDownloadButton>button {
    background-color: #FFC220;
    color: #000;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    padding: 0.6rem 1.5rem;
    transition: 0.3s ease;
}

.stButton>button:hover, .stDownloadButton>button:hover {
    background-color: #FFD944;
}

[data-testid="stNotificationContent"] {
    background-color: #FFF9DB;
    color: #333;
    border-radius: 8px;
    padding: 1rem;
}

.css-1aumxhk { color: #0071DC; }
</style>
""", unsafe_allow_html=True)

# --- Header ---
st.markdown("### Walmart Virtual Try-On")
st.caption("Try on your products virtually before buying — just upload your selfie and product.")

# --- Upload Section ---
st.markdown("---")
col1, col2 = st.columns(2)

with col1:
    st.subheader(" Upload Your Selfie")
    user_img_file = st.file_uploader("Upload a JPG or PNG selfie", type=["jpg", "jpeg", "png"], key="user")

with col2:
    st.subheader(" Upload Product Image")
    product_img_file = st.file_uploader("Upload product image (e.g., glasses, dress)", type=["jpg", "jpeg", "png"], key="product")

# --- Processing & Output ---
if user_img_file and product_img_file:
    user_bytes = np.asarray(bytearray(user_img_file.read()), dtype=np.uint8)
    user_img = cv2.imdecode(user_bytes, 1)

    product_bytes = np.asarray(bytearray(product_img_file.read()), dtype=np.uint8)
    product_img = cv2.imdecode(product_bytes, cv2.IMREAD_UNCHANGED)

    st.markdown("---")
    st.subheader(" Preview Images")
    st.image(user_img, caption="Original Selfie", channels="BGR", use_column_width=True)
    st.image(product_img, caption="Overlay Product", channels="BGR" if product_img.shape[2] == 3 else "BGRA", use_column_width=True)

    st.markdown("---")
    st.subheader("Adjust Product Position")
    x = st.slider("X Offset", 0, user_img.shape[1], user_img.shape[1] // 2)
    y = st.slider("Y Offset", 0, user_img.shape[0], user_img.shape[0] // 2)
    scale = st.slider("Scale (%)", 10, 300, 100)

    result = overlay_image(user_img, product_img, x, y, scale / 100.0)
    st.image(result, caption="🧍 Virtual Try-On Result", channels="BGR", use_column_width=True)

    result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
    result_pil = Image.fromarray(result_rgb)

    st.download_button(
        label="⬇️ Download Your Try-On Image",
        data=result_pil.tobytes(),
        file_name="walmart_tryon_result.jpg",
        mime="image/jpeg"
    )
else:
    st.info("Please upload both a selfie and a product image to get started.")
