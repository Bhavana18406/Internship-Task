// Price range filter functionality
        const priceRange = document.getElementById('priceRange');
        const selectedPrice = document.querySelector('.selected-price');
        
        priceRange.addEventListener('input', function() {
            selectedPrice.textContent = `Selected: Up to $${this.value}`;
        });

        // Sorting functionality
        const sortSelect = document.getElementById('sort');
        sortSelect.addEventListener('change', function() {
            // In a real implementation, this would reload products with new sorting
            console.log(`Sorting by: ${this.value}`);
            // You would typically make an API call or filter client-side data here
        });

        // Category filter functionality
        const categoryLinks = document.querySelectorAll('.category-list a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                // In real implementation, filter products by selected category
                console.log(`Filtering by category: ${this.textContent}`);
            });
        });

        // Rating filter functionality
        const ratingCheckboxes = document.querySelectorAll('.rating-filter input');
        ratingCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // In real implementation, filter products by selected rating
                console.log(`Filtering by rating: ${this.value} stars`);
            });
        });

        // Apply filters button
        const applyFiltersBtn = document.querySelector('.apply-filters');
        applyFiltersBtn.addEventListener('click', function() {
            // In real implementation, this would apply all selected filters
            const maxPrice = priceRange.value;
            const selectedCategory = document.querySelector('.category-list a.active').textContent;
            const selectedRatings = Array.from(ratingCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            console.log('Applying filters:', {
                maxPrice,
                selectedCategory,
                selectedRatings
            });
            
            // Typically you would reload products with these filters applied
            alert('Filters applied! (This is a demo - in a real app, products would update)');
        });