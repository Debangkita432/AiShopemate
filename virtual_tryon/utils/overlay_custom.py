# import cv2
# import numpy as np

# def overlay_image(background, overlay, x, y, scale=1.0):
#     # Resize overlay
#     h, w = overlay.shape[:2]
#     new_w = int(w * scale)
#     new_h = int(h * scale)
#     overlay_resized = cv2.resize(overlay, (new_w, new_h))

#     # Clip to background dimensions
#     bg_h, bg_w = background.shape[:2]
#     if x + new_w > bg_w:
#         new_w = bg_w - x
#         overlay_resized = overlay_resized[:, :new_w]
#     if y + new_h > bg_h:
#         new_h = bg_h - y
#         overlay_resized = overlay_resized[:new_h]

#     # Separate RGB and alpha or build mask
#     if overlay_resized.shape[2] == 4:
#         b, g, r, a = cv2.split(overlay_resized)
#         overlay_rgb = cv2.merge((b, g, r))
#         mask = a
#     else:
#         overlay_rgb = overlay_resized
#         gray = cv2.cvtColor(overlay_resized, cv2.COLOR_BGR2GRAY)
#         _, mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)

#     # Resize mask to match overlay region
#     mask = cv2.resize(mask, (overlay_rgb.shape[1], overlay_rgb.shape[0]))
#     mask_inv = cv2.bitwise_not(mask)

#     roi = background[y:y+overlay_rgb.shape[0], x:x+overlay_rgb.shape[1]]

#     bg = cv2.bitwise_and(roi, roi, mask=mask_inv)
#     fg = cv2.bitwise_and(overlay_rgb, overlay_rgb, mask=mask)
#     combined = cv2.add(bg, fg)

#     background[y:y+overlay_rgb.shape[0], x:x+overlay_rgb.shape[1]] = combined
#     return background

import cv2
import numpy as np

def overlay_image(background, overlay, x, y, scale=1.0):
    # Resize overlay
    h, w = overlay.shape[:2]
    new_w = int(w * scale)
    new_h = int(h * scale)
    overlay_resized = cv2.resize(overlay, (new_w, new_h))

    # Clip to background dimensions
    bg_h, bg_w = background.shape[:2]
    if x + new_w > bg_w:
        new_w = bg_w - x
        overlay_resized = overlay_resized[:, :new_w]
    if y + new_h > bg_h:
        new_h = bg_h - y
        overlay_resized = overlay_resized[:new_h]

    # Separate RGB and alpha or build mask
    if overlay_resized.shape[2] == 4:
        b, g, r, a = cv2.split(overlay_resized)
        overlay_rgb = cv2.merge((b, g, r))
        mask = a
    else:
        overlay_rgb = overlay_resized
        gray = cv2.cvtColor(overlay_resized, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)

    # Resize mask to match overlay region
    mask = cv2.resize(mask, (overlay_rgb.shape[1], overlay_rgb.shape[0]))
    mask_inv = cv2.bitwise_not(mask)

    roi = background[y:y+overlay_rgb.shape[0], x:x+overlay_rgb.shape[1]]

    bg = cv2.bitwise_and(roi, roi, mask=mask_inv)
    fg = cv2.bitwise_and(overlay_rgb, overlay_rgb, mask=mask)
    combined = cv2.add(bg, fg)

    background[y:y+overlay_rgb.shape[0], x:x+overlay_rgb.shape[1]] = combined
    return background