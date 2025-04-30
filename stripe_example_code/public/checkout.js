// This is your test secret API key.
const stripe = Stripe("pk_live_51RJ0KLAIKeA0MU3RgU9KOf6vdPzuO0ONLTFGeysa4RkdfzRZzd7orAQSgLzHEyLG0M69x3PcCNpJ674buI4SlL9H00YFacEAoo");

initialize();

// Create a Checkout Session
async function initialize() {
  console.log("Checkout page initialized");

  // Get client secret from URL if available (passed from index.js)
  const urlParams = new URLSearchParams(window.location.search);
  const storedClientSecret = sessionStorage.getItem('checkoutClientSecret');

  console.log("Stored client secret:", storedClientSecret);

  const fetchClientSecret = async () => {
    try {
      // Check if we already have a client secret stored in session storage
      if (storedClientSecret) {
        console.log("Using stored client secret");
        return storedClientSecret;
      }

      console.log("Fetching new client secret");
      const response = await fetch("/create-checkout-session", {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Error response:", await response.text());
        throw new Error("Failed to create checkout session");
      }

      const { clientSecret } = await response.json();
      console.log("Received client secret:", clientSecret);
      return clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error;
    }
  };

  try {
    const checkout = await stripe.initEmbeddedCheckout({
      fetchClientSecret,
    });

    console.log("Checkout initialized successfully");

    // Mount Checkout
    checkout.mount('#checkout');

    // Clear stored client secret
    sessionStorage.removeItem('checkoutClientSecret');
  } catch (error) {
    console.error("Error initializing checkout:", error);
  }
}