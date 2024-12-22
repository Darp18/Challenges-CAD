document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reflectionForm');
    const agreeCheckbox = document.getElementById('agree');
    const submitBtn = document.getElementById('submitBtn');

    let moveState = 'down'; // track movement state of the button

    form.addEventListener('submit', function(e) {
        if(!agreeCheckbox.checked) {
            e.preventDefault();
            // Move the submit button up or down alternately
            if (moveState === 'down') {
                submitBtn.classList.remove('moving-down');
                submitBtn.classList.add('moving-up');
                moveState = 'up';
            } else {
                submitBtn.classList.remove('moving-up');
                submitBtn.classList.add('moving-down');
                moveState = 'down';
            }
        }
    });

    // When checkbox is checked, remove any movement classes so it stays still
    agreeCheckbox.addEventListener('change', function() {
        if(this.checked) {
            submitBtn.classList.remove('moving-up', 'moving-down');
        }
    });
});
