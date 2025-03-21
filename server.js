// Importation des modules nécessaires
const express = require('express');
const stripe = require('stripe')('sk_test_your_secret_key'); // Remplace avec ta clé secrète Stripe
const bodyParser = require('body-parser');

// Initialisation de l'application Express
const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Route pour créer une session de paiement Stripe
app.post('/create-checkout-session', async (req, res) => {
    try {
        // Créer une session de paiement Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur', // Devise (par exemple, EUR pour l'euro)
                        product_data: {
                            name: 'Repas Snack M&S', // Nom du produit
                        },
                        unit_amount: 1500, // Montant en centimes (15€ ici)
                    },
                    quantity: 1, // Quantité (1 pour un seul repas)
                },
            ],
            mode: 'payment', // Mode de paiement
            success_url: 'http://localhost:3000/success', // URL en cas de succès
            cancel_url: 'http://localhost:3000/cancel', // URL en cas d'annulation
        });

        // Retourne l'ID de la session de paiement à la page front-end
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement:', error);
        res.status(500).send('Une erreur est survenue');
    }
});

// Route pour la page de succès
app.get('/success', (req, res) => {
    res.send('Paiement réussi ! Merci pour votre précommande.');
});

// Route pour la page d'annulation
app.get('/cancel', (req, res) => {
    res.send('Le paiement a été annulé.');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
