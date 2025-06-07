document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('htsForm');
    const resultSection = document.getElementById('resultSection');
    const backBtn = document.getElementById('backBtn');
    const officialResult = document.getElementById('officialResult');
    const unofficialResult = document.getElementById('unofficialResult');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const userInput = document.getElementById('htsCode').value.trim();
  
      // Fetch from USITC HTS API
      fetch(`https://hts.usitc.gov/reststop/search?keyword=${encodeURIComponent(userInput)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            // Display the first result's schedule or tax rate
            const firstResult = data.results[0];
            // Adjust these fields based on actual API response structure
            officialResult.textContent = firstResult.heading || firstResult.description || 'No heading found';
            unofficialResult.textContent = firstResult.rate || firstResult.tariff_rate || 'No rate found';
          } else {
            officialResult.textContent = 'No results found';
            unofficialResult.textContent = '';
          }
          form.classList.add('hidden');
          resultSection.classList.remove('hidden');
        })
        .catch(error => {
          officialResult.textContent = 'Error fetching data';
          unofficialResult.textContent = '';
          form.classList.add('hidden');
          resultSection.classList.remove('hidden');
        });
    });
  
    backBtn.addEventListener('click', function() {
      resultSection.classList.add('hidden');
      form.classList.remove('hidden');
      form.reset();
      officialResult.textContent = '';
      unofficialResult.textContent = '';
    });
  });
  