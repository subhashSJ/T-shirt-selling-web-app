const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "3zf8p7xqr53tmvz9",
  publicKey: "4gv6444rgd66nk23",
  privateKey: "57e0d510e5c114c519d726d1ccfbaf6b",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response); //we will get clientToken at frontend from response
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amount = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
};
