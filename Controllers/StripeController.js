const User = require("../Models/UserModel");
const Stripes = require('stripe');
const stripe = Stripes('sk_test_51JeezZLPp9miWmIeBehyA5nUgItfdPO17LA26XivmYbKAtVOQgCjLeQ9SsY5geg6L42hrcIRru3FUd0LwjkkZrQ600r7IKo9ZR');

class StripeController {
  static createCustomer = async (req, res) => {
    try {
      const { email } = req.body;



      const findUser = await User.findOne({ email: email });

      if (!findUser) {
        return res.status(400).json({ error: "User not found" });
      }

      if (findUser.customerId) {
        return res.json({ customerId: findUser.customerId });
      } else {
        const customer = await stripe.customers.create({
          email: email,
        });

        findUser.customerId = customer.id;

        await findUser.save();

        return res.json({ customerId: customer.id });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  static createSetupIntent = async (req, res) => {
    try {
      const { customerId } = req.body;

      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
      });

      res.json({ clientSecret: setupIntent.client_secret });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };


  static attachPaymentMethod = async (req, res) => {
    try {
      const { customerId, paymentMethodId } = req.body;

      // Attach the payment method to the customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set the attached payment method as the default for the customer
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      res.json({ success: true, message: "Payment method attached successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  static listSavedCards = async (req, res) => {
    try {
      const { customerId } = req.body;

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      res.json({ cards: paymentMethods.data });
    } catch (error) {
      console.error("Error retrieving payment methods:", error.message);
      res.status(500).send({ error: error.message });
    }
  };

  static createPaymentIntent = async (req, res) => {
    try {
      const { amount, customerId, paymentMethodId } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        customer: customerId,
        payment_method: paymentMethodId,
        automatic_payment_methods: {
          enabled: true,
        },
        off_session: true,
        confirm: true,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
}

module.exports = StripeController;
