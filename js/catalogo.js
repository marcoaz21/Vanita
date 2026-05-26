document.addEventListener('DOMContentLoaded', () => {

    const PHONE = '393391569040';

    let products = [];
    const catalogGrid    = document.getElementById('catalog-grid');
    const searchInput    = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter    = document.getElementById('brand-filter');
    const modal          = document.getElementById('product-modal');
    const closeModal     = document.querySelector('.close-modal');

    if (!catalogGrid) return; // non siamo nella pagina catalogo

    /* ─── Carica prodotti ─── */
    fetch('data/prodotti.json')
        .then(res => {
            if (!res.ok) throw new Error('Errore nel caricamento dei prodotti');
            return res.json();
        })
        .then(data => {
            products = data;
            renderProducts(products);
        })
        .catch(err => {
            console.error(err);
            catalogGrid.innerHTML = '<p class="no-results">Impossibile caricare i prodotti. Riprova più tardi.</p>';
        });

    /* ─── Rendering cards ─── */
    function renderProducts(list) {
        catalogGrid.innerHTML = '';

        if (list.length === 0) {
            catalogGrid.innerHTML = '<p class="no-results">Nessun prodotto trovato per i filtri selezionati.</p>';
            return;
        }

        list.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.setAttribute('role', 'listitem');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', product.nome + ' — ' + product.marca);

            card.innerHTML = `
                <div class="product-img">
                    <img
                        src="${escHtml(product.foto)}"
                        alt="${escHtml(product.nome)} — ${escHtml(product.marca)}"
                        loading="lazy"
                        decoding="async"
                        width="480"
                        height="640"
                    >
                </div>
                <div class="product-info">
                    <div class="product-brand">${escHtml(product.marca)}</div>
                    <h3>${escHtml(product.nome)}</h3>
                    <p class="price">${escHtml(product.prezzo)}</p>
                </div>
            `;

            card.addEventListener('click', () => openModal(product));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(product);
                }
            });

            catalogGrid.appendChild(card);
        });
    }

    /* ─── Filtri ─── */
    function filterProducts() {
        const search   = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const brand    = brandFilter.value;

        const filtered = products.filter(p => {
            const matchSearch   = !search ||
                p.nome.toLowerCase().includes(search) ||
                p.descrizione.toLowerCase().includes(search) ||
                p.marca.toLowerCase().includes(search);
            const matchCategory = category === 'all' || p.categoria === category;
            const matchBrand    = brand === 'all' || p.marca === brand;
            return matchSearch && matchCategory && matchBrand;
        });

        renderProducts(filtered);
    }

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    brandFilter.addEventListener('change', filterProducts);

    /* ─── Modal ─── */
    function openModal(product) {
        document.getElementById('modal-img').src = product.foto;
        document.getElementById('modal-img').alt = product.nome + ' — ' + product.marca;
        document.getElementById('modal-category').textContent = product.categoria || '';
        document.getElementById('modal-name').textContent = product.nome;
        document.getElementById('modal-brand').textContent = product.marca;
        document.getElementById('modal-price').textContent = product.prezzo;
        document.getElementById('modal-description').textContent = product.descrizione;

        // Link WhatsApp dinamico per ogni prodotto
        const waMsg = encodeURIComponent(
            'Ciao Vanità! Sono interessata al prodotto "' + product.nome +
            '" di ' + product.marca + ' (' + product.prezzo + '). È disponibile?'
        );
        const waBtn = document.getElementById('modal-wa-btn');
        waBtn.href = 'https://wa.me/' + PHONE + '?text=' + waMsg;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Focus accessibilità
        setTimeout(() => closeModal.focus(), 50);
    }

    function closeModalFn() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeModal.addEventListener('click', closeModalFn);

    // Chiudi cliccando fuori dal contenuto
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFn();
    });

    // Chiudi con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModalFn();
    });

    /* ─── Utility: escaping HTML ─── */
    function escHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

});
