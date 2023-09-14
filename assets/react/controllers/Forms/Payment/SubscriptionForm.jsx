import { PaymentElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function SubscriptionForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* <h1 className="w-full text-2xl">Formulaire de paiment</h1> */}
      <div className="flex flex-col p-3 bg-slate-100 rounded-md gap-3 border-teal-900 border-2">
        <PaymentElement id="payment-element" />
        {elements && (
          <button
            disabled={isProcessing || !stripe || !elements}
            id="submit"
            className="text-white bg-teal-900 border-2 my-auto border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
          >
            <span id="button-text">
              {isProcessing ? "En cours de traitement... " : "Payer"}
            </span>
          </button>
        )}
      </div>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
