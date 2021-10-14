# Kudoo

Please make sure that you are running [Kudoo v2](https://github.com/kudoo-cloud/kudoo-v2) locally to run the application.

Then run
`yarn install`

To run payrun successfully, we need to have below values in .env file.

REACT_APP_PAYRUN_SPLITTER: Address of the deployed Splitter contract.
REACT_APP_PAYRUN_WALLET: Address of the wallet submitting (and paying gas) for the initial transaction.
REACT_APP_PAYRUN_KEY: Private key of the WALLET mentioned above.
REACT_APP_PAYRUN_RPC: Json rpc of the network being used.
