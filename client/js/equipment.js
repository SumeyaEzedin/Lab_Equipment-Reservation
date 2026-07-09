let equipmentCache = [];

async function loadEquipment() {
    const grid = document.getElementById('equipmentGrid');
    grid.innerHTML = '<p>Loading equipment...</p>';

    try {
        const equipment = await apiRequest('/equipment', 'GET');
        equipmentCache = equipment;
        grid.innerHTML = '';

        equipment.forEach(item => {
            const card = document.createElement('div');
            card.className = 'equipment-card';

            const imageSrc = item.image_url && item.image_url.trim() !== ''
                ? item.image_url
                : 'https://via.placeholder.com/220x140?text=No+Image';

            card.innerHTML = `
                <img src="${imageSrc}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/220x140?text=No+Image'">
                <div class="equipment-card-body">
                    <h4>${item.name}</h4>
                    <p>${item.category || 'Uncategorized'}</p>
                    <p>Qty available: ${item.quantity}</p>
                    <span class="status-badge status-${item.status}">${item.status}</span>
                    <p class="equipment-id-tag">ID: ${item.id}</p>
                </div>
            `;
            grid.appendChild(card);
        });

        populateEquipmentDropdown(equipment);
    } catch (err) {
        grid.innerHTML = `<p>Error loading equipment: ${err.message}</p>`;
    }
}

function populateEquipmentDropdown(equipment) {
    const select = document.getElementById('resEquipmentId');
    select.innerHTML = '';
    equipment.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (${item.quantity} available)`;
        select.appendChild(option);
    });
}

async function addEquipment() {
    const name = document.getElementById('eqName').value;
    const category = document.getElementById('eqCategory').value;
    const description = document.getElementById('eqDescription').value;
    const quantity = parseInt(document.getElementById('eqQuantity').value, 10);
    const imageUrl = document.getElementById('eqImageUrl').value;

    if (!name || !quantity) {
        alert('Name and quantity are required');
        return;
    }

    try {
        await apiRequest('/equipment', 'POST', { name, category, description, quantity, imageUrl });
        document.getElementById('eqName').value = '';
        document.getElementById('eqCategory').value = '';
        document.getElementById('eqDescription').value = '';
        document.getElementById('eqQuantity').value = '';
        document.getElementById('eqImageUrl').value = '';
        loadEquipment();
    } catch (err) {
        alert('Error adding equipment: ' + err.message);
    }
}

document.getElementById('addEquipmentBtn').addEventListener('click', addEquipment);