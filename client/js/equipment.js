async function loadEquipment() {
    const tbody = document.getElementById('equipmentTableBody');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    try {
        const equipment = await apiRequest('/equipment', 'GET');
        tbody.innerHTML = '';

        equipment.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.category || '-'}</td>
                <td>${item.quantity}</td>
                <td><span class="status-badge status-${item.status}">${item.status}</span></td>
                <td>ID: ${item.id}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5">Error loading equipment: ${err.message}</td></tr>`;
    }
}

async function addEquipment() {
    const name = document.getElementById('eqName').value;
    const category = document.getElementById('eqCategory').value;
    const description = document.getElementById('eqDescription').value;
    const quantity = parseInt(document.getElementById('eqQuantity').value, 10);

    if (!name || !quantity) {
        alert('Name and quantity are required');
        return;
    }

    try {
        await apiRequest('/equipment', 'POST', { name, category, description, quantity });
        document.getElementById('eqName').value = '';
        document.getElementById('eqCategory').value = '';
        document.getElementById('eqDescription').value = '';
        document.getElementById('eqQuantity').value = '';
        loadEquipment();
    } catch (err) {
        alert('Error adding equipment: ' + err.message);
    }
}

document.getElementById('addEquipmentBtn').addEventListener('click', addEquipment);