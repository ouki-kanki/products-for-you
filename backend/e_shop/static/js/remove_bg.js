const removeBackGround = (pk) => {
    console.log("inside remove background", pk)
}


// function removeBackground(imageId) {
//     const imgElement = document.querySelector(`img[data-image-id="${imageId}"]`);
//     const originalSrc = imgElement.src;
//
//     // Simulate background removal (replace with actual logic or fetched base64 data)
//     const processedImageSrc = originalSrc.replace("product_images", "processed_images"); // Adjust as needed
//
//     // Display preview modal
//     const modalHtml = `
//         <div id="previewModal" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#fff; padding:20px; z-index:1000; border-radius:8px;">
//             <h3>Preview</h3>
//             <img src="${processedImageSrc}" style="max-width:100%; height:auto;"/>
//             <div style="margin-top:10px;">
//                 <button onclick="confirmChanges(${imageId}, '${processedImageSrc}')">Save</button>
//                 <button onclick="closePreviewModal(${imageId}, '${originalSrc}')">Cancel</button>
//             </div>
//         </div>
//         <div id="modalOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0, 0, 0, 0.5); z-index:999;" onclick="closePreviewModal(${imageId}, '${originalSrc}')"></div>
//     `;
//     document.body.insertAdjacentHTML('beforeend', modalHtml);
// }
//
// function closePreviewModal(imageId, originalSrc) {
//     const modal = document.getElementById('previewModal');
//     const overlay = document.getElementById('modalOverlay');
//     if (modal) modal.remove();
//     if (overlay) overlay.remove();
//
//     // Revert preview to original image
//     const imgElement = document.querySelector(`img[data-image-id="${imageId}"]`);
//     if (imgElement) imgElement.src = originalSrc;
// }
//
// function confirmChanges(imageId, processedImageSrc) {
//     const imgElement = document.querySelector(`img[data-image-id="${imageId}"]`);
//     if (imgElement) imgElement.src = processedImageSrc;
//
//     // Notify server to save changes (optional or trigger inline form save)
//     alert('Changes will be saved when the form is submitted!');
//     closePreviewModal(imageId, processedImageSrc);
//
