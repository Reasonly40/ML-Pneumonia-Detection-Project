/* script.js */
// TODO: change from getElementById to `querySelector('#<id>)
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

async function submitImage() {
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
    const response = await fetch('http://localhost:8888/api/v1/image', {
        method: 'POST',
        body: formData
    })
    
    if (response.ok){
        console.log('resp ok!')
        const result = await response.json()
        loadingIndicator.classList.add('hidden');

        localStorage.setItem('analysisResult', JSON.stringify(result.data));

        // Redirect ke halaman kedua
        window.location.href = 'result.html';
    }
    else {
        console.log('resp error')
        loadingIndicator.classList.add('hidden');
        error_message = response.body
        console.error('Error during analysis:', error_message);
        alert("An error occurred during analysis. Please try again.");
    }
}
