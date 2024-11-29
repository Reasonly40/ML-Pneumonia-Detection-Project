/* script.js */
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function () {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 10px;">`;
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = `<p>No image selected</p>`;
    }
}

function submitImage() {
    const imageInput = document.getElementById('imageUpload');
    const loadingIndicator = document.getElementById('loading');

    if (!imageInput.files.length) {
        alert("Please select an image before submitting.");
        return;
    }

    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    // Tampilkan indikator loading
    loadingIndicator.classList.remove('hidden');

    // Kirim gambar ke API untuk analisis
    fetch('https://your-backend-api-url/analyze', { // Ganti dengan endpoint API Anda
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        // Beralih ke tampilan kedua
        loadingIndicator.classList.add('hidden');

        if (result.success) {
            // Simpan hasil analisis jika diperlukan
            localStorage.setItem('analysisResult', JSON.stringify(result.data));

            // Redirect ke halaman kedua
            window.location.href = 'result.html';
        } else {
            alert("Analysis failed: " + result.message);
        }
    })
    .catch(error => {
        loadingIndicator.classList.add('hidden');
        console.error('Error during analysis:', error);
        alert("An error occurred during analysis. Please try again.");
    });
}
