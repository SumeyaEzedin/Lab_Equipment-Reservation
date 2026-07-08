async function loadReservations() {
    const tbody = document.getElementById('reservationsTableBody');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    try {
        const reservations = await apiRequest('/reservations', 'GET');
        tbody.innerHTML = '';

        const user = getUser();
        const canManage = user.role === 'technician' || user.role === 'admin';

        reservations.forEach(r => {
            const row = document.createElement('tr');
            let actions = '';

            if (canManage && r.status === 'pending') {
                actions = `
                    <button class="btn-small btn-approve" onclick="approveReservation(${r.id})">Approve</button>
                    <button class="btn-small btn-reject" onclick="rejectReservation(${r.id})">Reject</button>
                `;
            } else if (canManage && r.status === 'approved') {
                actions = `<button class="btn-small btn-return" onclick="returnReservation(${r.id})">Mark Returned</button>`;
            } else {
                actions = '-';
            }

            row.innerHTML = `
                <td>${r.equipment_name || r.equipment_id}</td>
                <td>${r.quantity_requested}</td>
                <td>${new Date(r.start_time).toLocaleString()}</td>
                <td>${new Date(r.end_time).toLocaleString()}</td>
                <td><span class="status-badge status-${r.status}">${r.status}</span></td>
                <td>${actions}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6">Error loading reservations: ${err.message}</td></tr>`;
    }
}

async function requestReservation() {
    const errorEl = document.getElementById('reservationError');
    errorEl.textContent = '';

    const equipmentId = parseInt(document.getElementById('resEquipmentId').value, 10);
    const quantityRequested = parseInt(document.getElementById('resQuantity').value, 10);
    const startTime = document.getElementById('resStart').value;
    const endTime = document.getElementById('resEnd').value;

    try {
        await apiRequest('/reservations', 'POST', { equipmentId, quantityRequested, startTime, endTime });
        document.getElementById('resEquipmentId').value = '';
        document.getElementById('resQuantity').value = '';
        document.getElementById('resStart').value = '';
        document.getElementById('resEnd').value = '';
        loadReservations();
    } catch (err) {
        errorEl.textContent = err.message;
    }
}

async function approveReservation(id) {
    try {
        await apiRequest(`/reservations/${id}/approve`, 'PATCH');
        loadReservations();
    } catch (err) {
        alert('Error approving reservation: ' + err.message);
    }
}

async function rejectReservation(id) {
    try {
        await apiRequest(`/reservations/${id}/reject`, 'PATCH');
        loadReservations();
    } catch (err) {
        alert('Error rejecting reservation: ' + err.message);
    }
}

async function returnReservation(id) {
    try {
        await apiRequest(`/reservations/${id}/return`, 'PATCH');
        loadReservations();
    } catch (err) {
        alert('Error processing return: ' + err.message);
    }
}

document.getElementById('requestReservationBtn').addEventListener('click', requestReservation);