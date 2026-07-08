// Protect this page - redirect to login if not authenticated
const token = getToken();
const user = getUser();

if (!token || !user) {
    window.location.href = 'login.html';
}

// Show user info in navbar
document.getElementById('userInfo').textContent = `${user.name} (${user.role})`;

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    window.location.href = 'login.html';
});

// Only admins can see the "Add Equipment" form
if (user.role === 'admin') {
    document.getElementById('addEquipmentForm').classList.remove('hidden');
}

// Damage Reports
async function loadDamageReports() {
    const tbody = document.getElementById('damageTableBody');
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        const reports = await apiRequest('/damage-reports', 'GET');
        tbody.innerHTML = '';

        const canResolve = user.role === 'technician' || user.role === 'admin';

        reports.forEach(r => {
            const row = document.createElement('tr');
            const action = (canResolve && r.status !== 'resolved')
                ? `<button class="btn-small btn-approve" onclick="resolveDamageReport(${r.id})">Resolve</button>`
                : '-';

            row.innerHTML = `
                <td>${r.reservation_id}</td>
                <td>${r.description}</td>
                <td><span class="status-badge status-${r.status === 'resolved' ? 'approved' : 'pending'}">${r.status}</span></td>
                <td>${action}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4">Error loading damage reports: ${err.message}</td></tr>`;
    }
}

async function reportDamage() {
    const reservationId = parseInt(document.getElementById('damageReservationId').value, 10);
    const description = document.getElementById('damageDescription').value;

    if (!reservationId || !description) {
        alert('Reservation ID and description are required');
        return;
    }

    try {
        await apiRequest('/damage-reports', 'POST', { reservationId, description });
        document.getElementById('damageReservationId').value = '';
        document.getElementById('damageDescription').value = '';
        loadDamageReports();
    } catch (err) {
        alert('Error reporting damage: ' + err.message);
    }
}

async function resolveDamageReport(id) {
    try {
        await apiRequest(`/damage-reports/${id}/resolve`, 'PATCH');
        loadDamageReports();
    } catch (err) {
        alert('Error resolving damage report: ' + err.message);
    }
}

document.getElementById('reportDamageBtn').addEventListener('click', reportDamage);

// Initial load
loadEquipment();
loadReservations();
loadDamageReports();