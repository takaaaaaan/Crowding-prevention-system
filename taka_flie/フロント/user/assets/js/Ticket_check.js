document.getElementById('agree-button').addEventListener('click', function() {
    const ticketNumber = document.getElementById('ticket-number').value;
    localStorage.setItem('ticketNumber', ticketNumber);
    // 同意が完了した後の処理
});
