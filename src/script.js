
/* ==================== PRODUCTION-READY GAME STATE MANAGEMENT ==================== */

/**
 * Marco's Store - Fresh Vegetables Shopping Game
 * A fun, interactive shopping experience with virtual money
 * 
 * @version 1.0.0
 * @author Marco's Store Team
 * @license MIT
 */

// ==================== CONFIGURATION ====================

/**
 * Game Configuration Object
 * Contains all configurable game parameters
 */
const CONFIG = {
    INITIAL_MONEY: 999999999999,
    STORAGE_KEY: 'marcosStoreGameState',
    TOAST_DURATION: 3000,
    ANIMATION_STEPS: 30,
    ANIMATION_DURATION: 10,
    MAX_QUANTITY: 999999,
    MIN_QUANTITY: 1,
    DEBUG_MODE: false
};

/**
 * Vegetable Products Database
 * Contains all 25 vegetables with IDs, names, icons, and prices
 */
const vegetables = [
    { id: 1, name: 'Asparagus', icon: 'asparagus.png', price: 5 },
    { id: 2, name: 'Beans', icon: 'beans.png', price: 8 },
    { id: 3, name: 'Beetroot', icon: 'beetroot.png', price: 12 },
    { id: 4, name: 'Bell Pepper', icon: 'bellpepper.png', price: 15 },
    { id: 5, name: 'Broccoli', icon: 'broccoli.png', price: 18 },
    { id: 6, name: 'Cabbage', icon: 'cabbage.png', price: 22 },
    { id: 7, name: 'Carrot', icon: 'carrot.png', price: 25 },
    { id: 8, name: 'Cauliflower', icon: 'cauliflower.png', price: 30 },
    { id: 9, name: 'Celery', icon: 'celery.png', price: 35 },
    { id: 10, name: 'Chili Pepper', icon: 'chilipepper.png', price: 45 },
    { id: 11, name: 'Corn', icon: 'corn.png', price: 55 },
    { id: 12, name: 'Cucumber', icon: 'cucumber.png', price: 65 },
    { id: 13, name: 'Eggplant', icon: 'eggplant.png', price: 150 },
    { id: 14, name: 'Garlic', icon: 'garlic.png', price: 500 },
    { id: 15, name: 'Lettuce', icon: 'lettuce.png', price: 5000 },
    { id: 16, name: 'Mushroom', icon: 'mushroom.png', price: 50000 },
    { id: 17, name: 'Onion', icon: 'onion.png', price: 500000 },
    { id: 18, name: 'Peas', icon: 'peas.png', price: 5000000 },
    { id: 19, name: 'Potato', icon: 'potato.png', price: 50000000 },
    { id: 20, name: 'Pumpkin', icon: 'pumpkin.png', price: 500000000 },
    { id: 21, name: 'Radish', icon: 'radish.png', price: 5000000000 },
    { id: 22, name: 'Spinach', icon: 'spinach.png', price: 45000000000 },
    { id: 23, name: 'Sweet Potato', icon: 'sweetpotato.png', price: 68000000000 },
    { id: 24, name: 'Tomato', icon: 'tomato.png', price: 25000000 },
    { id: 25, name: 'Zucchini', icon: 'zucchini.png', price: 12000000 }
];

// ==================== GAME STATE ====================

/**
 * Main Game State Object
 * Tracks player money, inventory, theme, and filter preferences
 */
let gameState = {
    money: CONFIG.INITIAL_MONEY,
    inventory: {},
    theme: localStorage.getItem('theme') || 'light',
    sortBy: 'price-low',
    searchQuery: '',
    totalMoneyEarned: 0,
    totalMoneySpent: 0,
    totalTransactions: 0
};

// Initialize inventory with zeros for all vegetables
vegetables.forEach(veg => {
    gameState.inventory[veg.id] = 0;
});

// ==================== DOM ELEMENTS CACHE ====================

/**
 * DOM Elements Reference
 * Cached for better performance to avoid repeated DOM queries
 */
const DOM = {
    // Header elements
    moneyAmount: document.getElementById('moneyAmount'),
    themeToggle: document.getElementById('themeToggle'),
    
    // Filter elements
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    
    // Main content
    productsContainer: document.getElementById('productsContainer'),
    
    // Footer elements
    toast: document.getElementById('toast'),
    cartCount: document.getElementById('cartCount'),
    itemsOwned: document.getElementById('itemsOwned'),
    currentYear: document.getElementById('currentYear')
};

// ==================== INITIALIZATION ====================

/**
 * Initialize Application
 * Runs once on page load to set up the game
 */
function init() {
    try {
        loadGameState();
        setupTheme();
        renderProducts();
        setupEventListeners();
        updateMoneyDisplay();
        updateFooterStats();
        setCurrentYear();
        
        if (CONFIG.DEBUG_MODE) {
            console.log('✓ Game initialized successfully');
            console.log('Game State:', gameState);
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Error initializing game. Please refresh the page.', 'error');
    }
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }
}

// ==================== LOCAL STORAGE MANAGEMENT ====================

/**
 * Save Game State to Local Storage
 * Persists player progress across sessions
 */
function saveGameState() {
    try {
        const stateToSave = {
            money: gameState.money,
            inventory: gameState.inventory,
            theme: gameState.theme,
            sortBy: gameState.sortBy,
            totalMoneyEarned: gameState.totalMoneyEarned,
            totalMoneySpent: gameState.totalMoneySpent,
            totalTransactions: gameState.totalTransactions
        };
        
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(stateToSave));
        
        if (CONFIG.DEBUG_MODE) {
            console.log('✓ Game state saved');
        }
    } catch (error) {
        console.error('Error saving game state:', error);
        showToast('Unable to save progress', 'warning');
    }
}

/**
 * Load Game State from Local Storage
 * Restores player progress from previous sessions
 */
function loadGameState() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const loaded = JSON.parse(saved);
            gameState.money = loaded.money || CONFIG.INITIAL_MONEY;
            gameState.inventory = loaded.inventory || {};
            gameState.theme = loaded.theme || 'light';
            gameState.sortBy = loaded.sortBy || 'price-low';
            gameState.totalMoneyEarned = loaded.totalMoneyEarned || 0;
            gameState.totalMoneySpent = loaded.totalMoneySpent || 0;
            gameState.totalTransactions = loaded.totalTransactions || 0;
            
            if (CONFIG.DEBUG_MODE) {
                console.log('✓ Game state loaded from storage');
            }
        }
    } catch (error) {
        console.error('Error loading game state:', error);
        console.log('Starting fresh game');
    }
}

// ==================== THEME MANAGEMENT ====================

/**
 * Setup Theme
 * Applies saved theme preference on page load
 */
function setupTheme() {
    const isDark = gameState.theme === 'dark';
    
    if (isDark) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }
}

/**
 * Update Theme Icon
 * Changes icon based on current theme
 * 
 * @param {boolean} isDark - Whether dark mode is active
 */
function updateThemeIcon(isDark) {
    const icon = DOM.themeToggle.querySelector('i');
    if (!icon) return;
    
    if (isDark) {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    } else {
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
    }
}

/**
 * Toggle Theme
 * Switches between light and dark mode
 */
function toggleTheme() {
    gameState.theme = gameState.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    updateThemeIcon(gameState.theme === 'dark');
    saveGameState();
    
    if (CONFIG.DEBUG_MODE) {
        console.log('✓ Theme toggled:', gameState.theme);
    }
}

// ==================== EVENT LISTENERS ====================

/**
 * Setup Event Listeners
 * Attaches event handlers to interactive elements
 */
function setupEventListeners() {
    // Theme toggle
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search input
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', handleSearch);
    }
    
    // Sort select
    if (DOM.sortSelect) {
        DOM.sortSelect.addEventListener('change', handleSort);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window events
    window.addEventListener('beforeunload', () => saveGameState());
    
    if (CONFIG.DEBUG_MODE) {
        console.log('✓ Event listeners attached');
    }
}

/**
 * Keyboard Shortcuts Handler
 * 
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardShortcuts(e) {
    // Spacebar to toggle theme
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        toggleTheme();
    }
    
    // Ctrl+Shift+M for secret cheat (double money)
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyM') {
        e.preventDefault();
        activateCheat();
    }
}

/**
 * Secret Cheat: Double Money
 * Easter egg for testing/fun
 */
function activateCheat() {
    gameState.money *= 2;
    updateMoneyDisplay();
    saveGameState();
    showToast('💰 Money doubled! (Secret cheat activated)', 'warning');
    
    if (CONFIG.DEBUG_MODE) {
        console.log('✓ Cheat activated: Money doubled');
    }
}

// ==================== SEARCH & FILTER ====================

/**
 * Handle Search Input
 * Filters products by search query
 * 
 * @param {Event} e - Input event
 */
function handleSearch(e) {
    gameState.searchQuery = e.target.value.toLowerCase();
    renderProducts();
}

/**
 * Handle Sort Selection
 * Changes product sorting order
 * 
 * @param {Event} e - Change event
 */
function handleSort(e) {
    gameState.sortBy = e.target.value;
    renderProducts();
}

/**
 * Get Filtered and Sorted Vegetables
 * Applies search and sort filters to product list
 * 
 * @returns {Array} Filtered and sorted vegetables
 */
function getFilteredAndSortedVegetables() {
    // Filter by search query
    let filtered = vegetables.filter(veg => 
        veg.name.toLowerCase().includes(gameState.searchQuery)
    );

    // Apply sorting
    switch(gameState.sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }

    return filtered;
}

// ==================== RENDERING ====================

/**
 * Render Products
 * Generates and displays product cards based on current filters
 */
function renderProducts() {
    try {
        const filtered = getFilteredAndSortedVegetables();
        DOM.productsContainer.innerHTML = '';

        if (filtered.length === 0) {
            DOM.productsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.2rem; color: var(--text-gray);">
                        No vegetables found matching "<strong>${escapeHtml(gameState.searchQuery)}</strong>"
                    </p>
                </div>
            `;
            return;
        }

        filtered.forEach((veg, index) => {
            const card = createProductCard(veg);
            DOM.productsContainer.appendChild(card);
            
            // Stagger animation for smooth effect
            setTimeout(() => {
                card.style.animation = 'scaleIn 0.4s ease-out';
            }, index * 30);
        });

        if (CONFIG.DEBUG_MODE) {
            console.log(`✓ Rendered ${filtered.length} products`);
        }
    } catch (error) {
        console.error('Error rendering products:', error);
        showToast('Error loading products', 'error');
    }
}

/**
 * Create Product Card
 * Generates HTML for a single product card
 * 
 * @param {Object} veg - Vegetable object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(veg) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = veg.id;

    const quantity = gameState.inventory[veg.id] || 0;

    card.innerHTML = `
        <div class="product-image-container">
            <img 
                src="src/icons/${veg.icon}" 
                alt="${veg.name}" 
                class="product-image" 
                loading="lazy"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-size=%2214%22%3E${veg.name}%3C/text%3E%3C/svg%3E'"
            >
        </div>
        
        <div class="product-info">
            <h3 class="product-name">${veg.name}</h3>
            <p class="product-price">$${formatNumber(veg.price)}</p>
            <p class="product-quantity-owned">You own: <strong id="qty-${veg.id}">${quantity}</strong></p>
        </div>

        <div class="product-controls">
            <div class="quantity-control">
                <button class="qty-btn minus-btn" data-id="${veg.id}" type="button" aria-label="Decrease quantity">
                    <i class="bi bi-dash"></i>
                </button>
                <input 
                    type="number" 
                    class="qty-input" 
                    id="input-${veg.id}" 
                    value="1" 
                    min="1" 
                    max="${CONFIG.MAX_QUANTITY}"
                    aria-label="Quantity to buy or sell"
                >
                <button class="qty-btn plus-btn" data-id="${veg.id}" type="button" aria-label="Increase quantity">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
        </div>

        <div class="product-actions">
            <button class="btn btn-sell" data-id="${veg.id}" type="button" aria-label="Sell ${veg.name}">
                <i class="bi bi-cash-coin"></i> Sell
            </button>
            <button class="btn btn-buy" data-id="${veg.id}" type="button" aria-label="Buy ${veg.name}">
                <i class="bi bi-shopping-bag"></i> Buy
            </button>
        </div>
    `;

    // Add event listeners to card elements
    attachCardEventListeners(card, veg);

    return card;
}

/**
 * Attach Event Listeners to Product Card
 * Handles all interactions for a product card
 * 
 * @param {HTMLElement} card - Product card element
 * @param {Object} veg - Vegetable object
 */
function attachCardEventListeners(card, veg) {
    const input = card.querySelector('.qty-input');
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    const buyBtn = card.querySelector('.btn-buy');
    const sellBtn = card.querySelector('.btn-sell');

    if (minusBtn) minusBtn.addEventListener('click', () => decrementQuantity(input));
    if (plusBtn) plusBtn.addEventListener('click', () => incrementQuantity(input));
    if (buyBtn) buyBtn.addEventListener('click', () => buyVegetable(veg.id, veg.name, veg.price, input));
    if (sellBtn) sellBtn.addEventListener('click', () => sellVegetable(veg.id, veg.name, veg.price, input));
}

// ==================== QUANTITY CONTROLS ====================

/**
 * Increment Quantity
 * Increases quantity input value
 * 
 * @param {HTMLElement} input - Quantity input element
 */
function incrementQuantity(input) {
    let value = parseInt(input.value) || CONFIG.MIN_QUANTITY;
    value = Math.min(value + 1, CONFIG.MAX_QUANTITY);
    input.value = value;
}

/**
 * Decrement Quantity
 * Decreases quantity input value
 * 
 * @param {HTMLElement} input - Quantity input element
 */
function decrementQuantity(input) {
    let value = parseInt(input.value) || CONFIG.MIN_QUANTITY;
    value = Math.max(value - 1, CONFIG.MIN_QUANTITY);
    input.value = value;
}

// ==================== BUY & SELL FUNCTIONS ====================

/**
 * Buy Vegetable
 * Handles purchase transaction
 * 
 * @param {number} vegId - Vegetable ID
 * @param {string} vegName - Vegetable name
 * @param {number} price - Unit price
 * @param {HTMLElement} input - Quantity input element
 */
function buyVegetable(vegId, vegName, price, input) {
    try {
        const quantity = parseInt(input.value) || CONFIG.MIN_QUANTITY;
        
        // Validate quantity
        if (quantity < CONFIG.MIN_QUANTITY || quantity > CONFIG.MAX_QUANTITY) {
            showToast(`Quantity must be between ${CONFIG.MIN_QUANTITY} and ${CONFIG.MAX_QUANTITY}`, 'error');
            return;
        }
        
        const totalCost = price * quantity;

        // Check if player has enough money
        if (gameState.money < totalCost) {
            showToast(`Not enough money to buy ${quantity} ${vegName}!`, 'error');
            return;
        }

        // Process transaction
        gameState.money -= totalCost;
        gameState.inventory[vegId] = (gameState.inventory[vegId] || 0) + quantity;
        gameState.totalMoneySpent += totalCost;
        gameState.totalTransactions++;

        // Update UI
        updateMoneyDisplay();
        updateProductQuantity(vegId);
        updateFooterStats();
        saveGameState();

        // Show success message
        showToast(`✓ Bought ${quantity}x ${vegName} for $${formatNumber(totalCost)}`, 'success');

        // Reset input
        input.value = CONFIG.MIN_QUANTITY;

        if (CONFIG.DEBUG_MODE) {
            console.log(`✓ Bought ${quantity}x ${vegName} for $${totalCost}`);
        }
    } catch (error) {
        console.error('Error buying vegetable:', error);
        showToast('Error processing purchase', 'error');
    }
}

/**
 * Sell Vegetable
 * Handles sale transaction
 * 
 * @param {number} vegId - Vegetable ID
 * @param {string} vegName - Vegetable name
 * @param {number} price - Unit price
 * @param {HTMLElement} input - Quantity input element
 */
function sellVegetable(vegId, vegName, price, input) {
    try {
        const quantity = parseInt(input.value) || CONFIG.MIN_QUANTITY;
        
        // Validate quantity
        if (quantity < CONFIG.MIN_QUANTITY || quantity > CONFIG.MAX_QUANTITY) {
            showToast(`Quantity must be between ${CONFIG.MIN_QUANTITY} and ${CONFIG.MAX_QUANTITY}`, 'error');
            return;
        }
        
        const owned = gameState.inventory[vegId] || 0;

        // Check if player owns enough
        if (owned < quantity) {
            showToast(`You only own ${owned} ${vegName}!`, 'error');
            return;
        }

        const totalRevenue = price * quantity;

        // Process transaction
        gameState.money += totalRevenue;
        gameState.inventory[vegId] -= quantity;
        gameState.totalMoneyEarned += totalRevenue;
        gameState.totalTransactions++;

        // Update UI
        updateMoneyDisplay();
        updateProductQuantity(vegId);
        updateFooterStats();
        saveGameState();

        // Show success message
        showToast(`✓ Sold ${quantity}x ${vegName} for $${formatNumber(totalRevenue)}`, 'success');

        // Reset input
        input.value = CONFIG.MIN_QUANTITY;

        if (CONFIG.DEBUG_MODE) {
            console.log(`✓ Sold ${quantity}x ${vegName} for $${totalRevenue}`);
        }
    } catch (error) {
        console.error('Error selling vegetable:', error);
        showToast('Error processing sale', 'error');
    }
}

// ==================== UI UPDATES ====================

/**
 * Update Money Display
 * Updates header money amount with animation
 */
function updateMoneyDisplay() {
    if (!DOM.moneyAmount) return;

    // Apply pulse animation
    DOM.moneyAmount.classList.remove('pulse');
    
    // Trigger reflow to restart animation
    void DOM.moneyAmount.offsetWidth;
    
    DOM.moneyAmount.classList.add('pulse');

    // Animate number counting
    animateNumber(DOM.moneyAmount, gameState.money);
}

/**
 * Animate Number
 * Smoothly animates number from current to target value
 * 
 * @param {HTMLElement} element - Element to update
 * @param {number} targetNumber - Target value to reach
 */
function animateNumber(element, targetNumber) {
    const currentText = element.textContent
        .replace(/,/g, '')
        .replace(/B/g, '')
        .replace(/M/g, '')
        .replace(/K/g, '')
        .replace(/T/g, '');
    
    const currentNumber = parseInt(currentText) || 0;
    const difference = targetNumber - currentNumber;
    const steps = CONFIG.ANIMATION_STEPS;
    const stepValue = difference / steps;
    let currentStep = 0;

    const counter = setInterval(() => {
        currentStep++;
        const newValue = Math.round(currentNumber + stepValue * currentStep);
        element.textContent = formatNumberExact(newValue);

        if (currentStep >= steps) {
            element.textContent = formatNumberExact(targetNumber);
            clearInterval(counter);
        }
    }, CONFIG.ANIMATION_DURATION);
}

/**
 * Update Product Quantity Display
 * Updates quantity badge on product card
 * 
 * @param {number} vegId - Vegetable ID
 */
function updateProductQuantity(vegId) {
    const quantityElement = document.getElementById(`qty-${vegId}`);
    if (!quantityElement) return;

    const newQuantity = gameState.inventory[vegId] || 0;
    quantityElement.textContent = newQuantity;
    
    // Add bounce animation
    quantityElement.style.animation = 'none';
    setTimeout(() => {
        quantityElement.style.animation = 'bounce 0.6s ease-out';
    }, 10);
}

/**
 * Update Footer Statistics
 * Updates cart count and items owned displays
 */
function updateFooterStats() {
    try {
        // Calculate total items in inventory
        const totalItems = Object.values(gameState.inventory)
            .reduce((a, b) => a + b, 0);
        
        // Count unique items owned (excluding 0 quantities)
        const itemsOwnedCount = Object.values(gameState.inventory)
            .filter(qty => qty > 0).length;

        if (DOM.cartCount) {
            DOM.cartCount.textContent = totalItems;
        }
        
        if (DOM.itemsOwned) {
            DOM.itemsOwned.textContent = itemsOwnedCount;
        }

        if (CONFIG.DEBUG_MODE) {
            console.log(`✓ Stats updated: ${totalItems} total items, ${itemsOwnedCount} unique items`);
        }
    } catch (error) {
        console.error('Error updating footer stats:', error);
    }
}

// ==================== TOAST NOTIFICATIONS ====================

/**
 * Show Toast Notification
 * Displays temporary notification message
 * 
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    if (!DOM.toast) return;

    try {
        // Remove existing toast classes and show state
        DOM.toast.classList.remove('show', 'success', 'error', 'warning', 'info');
        
        // Set new content
        DOM.toast.textContent = message;
        DOM.toast.classList.add(type, 'show');

        // Auto hide after configured duration
        setTimeout(() => {
            DOM.toast.classList.remove('show');
        }, CONFIG.TOAST_DURATION);

        if (CONFIG.DEBUG_MODE) {
            console.log(`✓ Toast shown: [${type}] ${message}`);
        }
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}

// ==================== NUMBER FORMATTING ====================

/**
 * Format Number with Abbreviations
 * Converts large numbers to readable format (T, B, M, K)
 * 
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    
    num = Math.floor(num);
    
    if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(2) + 'T';
    } else if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    } else {
        return num.toLocaleString();
    }
}

/**
 * Format Number Exactly
 * Converts number to full format with commas (no abbreviations)
 * 
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumberExact(num) {
    if (num === undefined || num === null) return '0';
    return Math.floor(num).toLocaleString('en-US');
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Escape HTML
 * Prevents XSS attacks by escaping HTML characters
 * 
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get Vegetable by ID
 * Finds vegetable object by ID
 * 
 * @param {number} id - Vegetable ID
 * @returns {Object|null} Vegetable object or null
 */
function getVegetableById(id) {
    return vegetables.find(v => v.id === id) || null;
}

/**
 * Get Total Inventory Value
 * Calculates total value of all owned items
 * 
 * @returns {number} Total inventory value
 */
function getTotalInventoryValue() {
    return vegetables.reduce((total, veg) => {
        return total + (veg.price * (gameState.inventory[veg.id] || 0));
    }, 0);
}

/**
 * Get Net Worth
 * Calculates total money + inventory value
 * 
 * @returns {number} Total net worth
 */
function getNetWorth() {
    return gameState.money + getTotalInventoryValue();
}

/**
 * Get Game Statistics
 * Compiles comprehensive game statistics
 * 
 * @returns {Object} Statistics object
 */
function getGameStatistics() {
    const totalItems = Object.values(gameState.inventory).reduce((a, b) => a + b, 0);
    const uniqueItems = Object.values(gameState.inventory).filter(qty => qty > 0).length;
    
    return {
        currentMoney: gameState.money,
        netWorth: getNetWorth(),
        totalMoneySpent: gameState.totalMoneySpent,
        totalMoneyEarned: gameState.totalMoneyEarned,
        totalTransactions: gameState.totalTransactions,
        totalItems: totalItems,
        uniqueItems: uniqueItems,
        inventoryValue: getTotalInventoryValue()
    };
}

// ==================== DEBUG & DEVELOPMENT FUNCTIONS ====================

/**
 * Export Game State
 * Logs complete game state to console (for debugging)
 */
function exportGameState() {
    const stats = getGameStatistics();
    console.log('%c=== GAME STATE ===', 'font-size: 14px; font-weight: bold; color: #10b981;');
    console.log('Current State:', gameState);
    console.log('Statistics:', stats);
    console.log('Full Export:', JSON.stringify({ gameState, stats }, null, 2));
    showToast('Game state exported to console', 'info');
}

/**
 * Reset Game
 * Resets all progress with confirmation
 */
function resetGame() {
    if (!confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        return;
    }

    try {
        gameState.money = CONFIG.INITIAL_MONEY;
        gameState.inventory = {};
        gameState.totalMoneyEarned = 0;
        gameState.totalMoneySpent = 0;
        gameState.totalTransactions = 0;
        
        vegetables.forEach(veg => {
            gameState.inventory[veg.id] = 0;
        });

        saveGameState();
        renderProducts();
        updateMoneyDisplay();
        updateFooterStats();
        showToast('Game reset successfully!', 'success');

        if (CONFIG.DEBUG_MODE) {
            console.log('✓ Game reset');
        }
    } catch (error) {
        console.error('Error resetting game:', error);
        showToast('Error resetting game', 'error');
    }
}

/**
 * Toggle Debug Mode
 * Enables/disables debug console logging
 */
function toggleDebugMode() {
    CONFIG.DEBUG_MODE = !CONFIG.DEBUG_MODE;
    console.log('%c[DEBUG] Debug mode:', 'color: #f59e0b; font-weight: bold;', CONFIG.DEBUG_MODE);
    
    if (CONFIG.DEBUG_MODE) {
        console.log('%cAvailable Commands:', 'color: #10b981; font-weight: bold;');
        console.log('• exportGameState() - Export complete game state');
        console.log('• resetGame() - Reset all progress');
        console.log('• getGameStatistics() - Get game statistics');
        console.log('• getTotalInventoryValue() - Get inventory value');
        console.log('• getNetWorth() - Get net worth');
        console.log('• gameState - Access current game state');
        console.log('• vegetables - Access vegetables database');
        console.log('• CONFIG - Access configuration');
    }
}

// ==================== PERFORMANCE OPTIMIZATION ====================

/**
 * Lazy Load Images
 * Uses Intersection Observer for efficient image loading
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all product images
        document.querySelectorAll('.product-image').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Throttle Function
 * Limits how often a function can be called
 * 
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Debounce Function
 * Delays function execution until after wait time with no calls
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== ACCESSIBILITY ====================

/**
 * Setup Keyboard Navigation
 * Allows keyboard-only navigation
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const focused = document.activeElement;
            if (focused && (focused.classList.contains('btn-buy') || 
                           focused.classList.contains('btn-sell') ||
                           focused.classList.contains('qty-btn'))) {
                focused.click();
            }
        }
    });
}

// ==================== NETWORK STATUS ==================== 

/**
 * Check Network Status
 * Monitors connection and shows appropriate messages
 */
function setupNetworkStatus() {
    window.addEventListener('online', () => {
        showToast('✓ Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
        showToast('✗ No internet connection', 'error');
    });
}

// ==================== PAGE VISIBILITY ====================

/**
 * Setup Page Visibility Handler
 * Auto-saves progress when page loses focus
 */
function setupPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveGameState();
            if (CONFIG.DEBUG_MODE) {
                console.log('✓ Progress auto-saved');
            }
        }
    });
}

// ==================== GLOBAL EXPORTS FOR DEBUGGING ====================

// Make functions globally accessible for debugging
window.exportGameState = exportGameState;
window.resetGame = resetGame;
window.toggleDebugMode = toggleDebugMode;
window.getGameStatistics = getGameStatistics;
window.getTotalInventoryValue = getTotalInventoryValue;
window.getNetWorth = getNetWorth;
window.gameState = gameState;
window.vegetables = vegetables;
window.CONFIG = CONFIG;

// ==================== APP STARTUP ====================

/**
 * Document Ready Handler
 * Initializes app when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupKeyboardNavigation();
    setupNetworkStatus();
    setupPageVisibility();
    
    // Console welcome message
    console.log(
        '%c🥕 Welcome to Marco\'s Store! 🥕\n' +
        '%cVersion: 1.0.0\n' +
        '%cType toggleDebugMode() to enable debug logging',
        'font-size: 16px; font-weight: bold; color: #10b981;',
        'font-size: 12px; color: #6b7280;',
        'font-size: 12px; color: #f59e0b;'
    );
});

// ==================== ERROR HANDLING ====================

/**
 * Global Error Handler
 * Catches and handles unhandled errors
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
});

/**
 * Unhandled Promise Rejection Handler
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An error occurred. Please try again.', 'error');
});

// ==================== END OF SCRIPT ====================
