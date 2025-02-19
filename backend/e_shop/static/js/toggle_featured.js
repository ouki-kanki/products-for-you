document.addEventListener('DOMContentLoaded', function() {
    const isFeaturedCheckbox = document.querySelector('#id_is_featured');
    const featuredItemInline = document.querySelector('#featured_item-group');

    console.log("heeloi there")

    function toggleFeaturedItemInline() {
        if (isFeaturedCheckbox.checked) {
            featuredItemInline.style.display = 'block';
        } else {
            featuredItemInline.style.display = 'none';
        }
    }

    isFeaturedCheckbox.addEventListener('change', toggleFeaturedItemInline);

    // Initial toggle based on the current checkbox state
    toggleFeaturedItemInline()
})
