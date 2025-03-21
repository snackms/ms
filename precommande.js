// Initialisation du compteur pour le numéro de commande
let orderNumber = localStorage.getItem('orderNumber') ? parseInt(localStorage.getItem('orderNumber')) : 1;

// Fonction pour mettre à jour le numéro de commande dans le champ du formulaire
function updateOrderNumber() {
    document.getElementById('numero-commande').value = orderNumber;
}

// Fonction pour incrémenter le numéro de commande et le réinitialiser à 1 si nécessaire
function incrementOrderNumber() {
    orderNumber++;
    if (orderNumber > 999) {
        orderNumber = 1; // Réinitialiser à 1 une fois atteint 999
    }
    localStorage.setItem('orderNumber', orderNumber); // Sauvegarder le numéro dans localStorage
}

// Fonction pour afficher un message de confirmation après paiement réussi
function showConfirmation() {
    incrementOrderNumber(); // Incrémenter et réinitialiser le numéro de commande
    document.getElementById('precommande-form').style.display = 'none'; // Cacher le formulaire
    document.getElementById('confirmation').style.display = 'block'; // Afficher le message de confirmation
}

// Initialisation de Stripe avec votre clé publique (remplacez "pk_test_xxxx" par votre vraie clé publique)
const stripe = Stripe('pk_test_xxxx'); // Clé publique Stripe
const paymentButton = document.getElementById('pay-button');
const submitButton = document.getElementById('submit-button');

// Lorsque l'utilisateur clique sur le bouton de paiement
paymentButton.addEventListener('click', function() {
    // Crée une session de paiement Stripe
    fetch('/create-checkout-session', {
        method: 'POST',
    })
    .then((response) => response.json())
    .then((sessionId) => {
        // Crée une instance de checkout Stripe
        stripe.redirectToCheckout({ sessionId: sessionId })
        .then(function(result) {
            if (result.error) {
                alert(result.error.message); // Si une erreur survient lors de la redirection
            }
        });
    });
});

// Après un paiement réussi (sur votre backend), la confirmation est montrée
// Remarque : Vous devez avoir une API backend qui gère la session de paiement Stripe et redirige vers cette page
function handlePaymentSuccess() {
    showConfirmation();
}

// Lors du chargement de la page
window.onload = function() {
    updateOrderNumber(); // Mettre à jour le numéro de commande
}
