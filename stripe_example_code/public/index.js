// Product IDs from Stripe - can be overridden by environment variables in the server
const PRODUCT_IDS = {
  product1: 'price_1RJ1FNAIKeA0MU3RRAXRcoCZ',
  product2: 'price_1RJ1EsAIKeA0MU3RFaNyWzNO'
};

document.addEventListener('DOMContentLoaded', function () {
  const checkoutButton = document.getElementById('checkout-button');

  checkoutButton.addEventListener('click', async () => {
    const product1Quantity = parseInt(document.getElementById('product1-quantity').value) || 0;
    const product2Quantity = parseInt(document.getElementById('product2-quantity').value) || 0;

    console.log('Product 1 Quantity:', product1Quantity);
    console.log('Product 2 Quantity:', product2Quantity);

    // Make sure at least one product is selected
    if (product1Quantity <= 0 && product2Quantity <= 0) {
      alert('Please select at least one product');
      return;
    }

    const requestData = {
      items: [
        { id: PRODUCT_IDS.product1, quantity: product1Quantity },
        { id: PRODUCT_IDS.product2, quantity: product2Quantity }
      ]
    };

    console.log('Sending request data:', JSON.stringify(requestData));

    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Network response was not ok: ' + errorText);
      }

      // Get client secret from response
      const { clientSecret } = await response.json();
      console.log('Received client secret:', clientSecret);

      // Store client secret in session storage
      sessionStorage.setItem('checkoutClientSecret', clientSecret);

      // Redirect to checkout page
      window.location.href = '/checkout.html';

    } catch (error) {
      console.error('Error:', error);
      alert('There was a problem with your request. Please try again.');
    }
  });
});