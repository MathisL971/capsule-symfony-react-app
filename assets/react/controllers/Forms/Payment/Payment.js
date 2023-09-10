import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from "./SubscriptionForm";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function fetchData() {
      axios
        .get("http://localhost:3002/config")
        .then(async (res) => {
          const { publishableKey } = res.data;
          setStripePromise(loadStripe(publishableKey));
        })
        .catch((e) => console.log(e));
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      axios
        .post("http://localhost:3002/create-payment-intent")
        .then(async (res) => {
          var { clientSecret } = res.data;
          setClientSecret(clientSecret);
        });
    }
    fetchData();
  }, []);

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SubscriptionForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
