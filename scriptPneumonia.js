/* script.js */
// TODO: change from getElementById to `querySelector('#<id>)
async function previewImage(event) {
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
        
        const _data = result.data

        localStorage.setItem('analysisResult', JSON.stringify(_data));

        // Redirect ke halaman kedua
        // window.location.href = 'result.html';
        let resultElement = document.querySelector('#result');
        resultElement.textContent = _data.result

        let resultContainer = document.querySelector('#result-container');
        resultContainer.classList.remove('hidden');

        let resultDetailContainerElement = document.querySelector('#resultDetail');
        let {normal, bacteria, virus} = _data._prediction_value
        
        function createResultElement(resultType, value){
            // WARNING: probably not safe (may injected using client side scripting)
            let resultElementHTML = `
                <div class="flex flex-row gap-x-2 justify-center">
                    <div>
                        <p class="capitalize">${resultType}: </p>
                    </div>

                    <div>
                        <p>${value}</p>
                    </div>
                </div>
            `
            
            let resultElement = document.createElement('div')
            resultElement.innerHTML = resultElementHTML
            resultDetailContainerElement.appendChild(resultElement)
        }

        createResultElement('normal', normal)
        createResultElement('bacteria', bacteria)
        createResultElement('virus', virus)
    }
    else {
        console.log('resp error')
        loadingIndicator.classList.add('hidden');
        error_message = response.body
        console.error('Error during analysis:', error_message);
        alert("An error occurred during analysis. Please try again.");
    }
}
