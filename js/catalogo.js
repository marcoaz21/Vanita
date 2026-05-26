/* =========================================================
   Vanità Boutique — catalogo.js (versione Snipcart)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    const PHONE    = '393391569040';
    const BASE_URL = window.location.origin + window.location.pathname.replace('catalogo.html','');

    let products = [];
    const catalogGrid    = document.getElementById('catalog-grid');
    const searchInput    = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter    = document.getElementById('brand-filter');
    const modal          = document.getElementById('product-modal');
    const closeModal     = document.querySelector('.close-modal');

    if (!catalogGrid) return;

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

    /* ─── Prezzo numerico per Snipcart ─── */
    function parsePrice(str) {
        if (typeof str !== 'string') return '0.00';
        return parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.') || '0').toFixed(2);
    }

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
            card.setAttribute('aria-label', product.nome + ' — ' + product.marca);

            const imgUrl = BASE_URL + product.foto;

            card.innerHTML = `
                <div class="product-img">
                    <img
                        src="${escHtml(product.foto)}"
                        alt="${escHtml(product.nome)} — ${escHtml(product.marca)}"
                        loading="lazy" decoding="async" width="480" height="640"
                    >
                    <div class="product-overlay">
                        <button class="btn-quick-view" data-id="${product.id}">Vedi dettagli</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${escHtml(product.marca)}</div>
                    <h3>${escHtml(product.nome)}</h3>
                    <p class="price">${escHtml(product.prezzo)}</p>
                    <button
                        class="btn btn--add-cart btn--full snipcart-add-item"
                        data-item-id="${product.id}"
                        data-item-name="${escHtml(product.nome)} — ${escHtml(product.marca)}"
                        data-item-price="${parsePrice(product.prezzo)}"
                        data-item-url="${escHtml(imgUrl)}"
                        data-item-image="${escHtml(imgUrl)}"
                        data-item-description="${escHtml(product.descrizione)}"
                        data-item-categories="${escHtml(product.categoria)}"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Aggiungi al carrello
                    </button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.snipcart-add-item') || e.target.closest('.btn-quick-view')) return;
                openModal(product);
            });
            card.querySelector('.btn-quick-view').addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(product);
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
            const matchSearch   = !search || p.nome.toLowerCase().includes(search) || p.descrizione.toLowerCase().includes(search) || p.marca.toLowerCase().includes(search);
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
        const imgUrl = BASE_URL + product.foto;

        document.getElementById('modal-img').src = product.foto;
        document.getElementById('modal-img').alt = product.nome + ' — ' + product.marca;
        document.getElementById('modal-category').textContent = product.categoria || '';
        document.getElementById('modal-name').textContent = product.nome;
        document.getElementById('modal-brand').textContent = product.marca;
        document.getElementById('modal-price').textContent = product.prezzo;
        document.getElementById('modal-description').textContent = product.descrizione;

        // Bottone Snipcart dinamico nel modal
        document.getElementById('modal-cart-btn-wrap').innerHTML = `
            <button
                class="btn btn--add-cart btn--full snipcart-add-item"
                data-item-id="${product.id}"
                data-item-name="${escHtml(product.nome)} — ${escHtml(product.marca)}"
                data-item-price="${parsePrice(product.prezzo)}"
                data-item-url="${escHtml(imgUrl)}"
                data-item-image="${escHtml(imgUrl)}"
                data-item-description="${escHtml(product.descrizione)}"
                data-item-categories="${escHtml(product.categoria)}"
                style="margin-bottom:0.8rem;width:100%;"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Aggiungi al carrello
            </button>
        `;

        const waMsg = encodeURIComponent('Ciao Vanità! Sono interessata al prodotto "' + product.nome + '" di ' + product.marca + ' (' + product.prezzo + '). È disponibile?');
        document.getElementById('modal-wa-btn').href = 'https://wa.me/' + PHONE + '?text=' + waMsg;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => closeModal.focus(), 50);
    }

    function closeModalFn() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeModal.addEventListener('click', closeModalFn);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFn(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'block') closeModalFn(); });

    /* ─── Utility ─── */
    function escHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

});
