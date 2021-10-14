import ABI from 'src/config/abi';
import Util from 'src/helpers/payrun/Util';
import Web3 from 'web3';
import { PNG } from 'src/config/config';

const SPLITTER = process.env.REACT_APP_PAYRUN_SPLITTER;
const RPC = process.env.REACT_APP_PAYRUN_RPC;
const KEY = process.env.REACT_APP_PAYRUN_KEY;
const WALLET = process.env.REACT_APP_PAYRUN_WALLET;
const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
web3.eth.accounts.wallet.add(KEY);

export const approve = async (chainId, MULTISIG) => {
  const TOKEN = PNG[chainId];
  // Contracts
  const token = new web3.eth.Contract(ABI.ERC20, TOKEN);
  const multi = MULTISIG
    ? new web3.eth.Contract(ABI.GNOSIS_MULTISIG, MULTISIG)
    : null;

  const symbol = await token.methods.symbol().call();
  const decimals = parseInt(await token.methods.decimals().call());

  // Create actual approval tx
  console.log(`Creating approval transaction ...`);
  const directApprovalTX = await token.methods.approve(
    SPLITTER,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  );

  const approvalBytecode = directApprovalTX.encodeABI();
  console.log(`Bytecode:`);
  console.log(approvalBytecode);
  console.log();

  console.log(
    `Checking current allowance of ${
      MULTISIG ? `multisig (${MULTISIG})` : `wallet (${WALLET})`
    } for splitter ...`,
  );
  const allowance = await token.methods
    .allowance(MULTISIG ? MULTISIG : WALLET, SPLITTER)
    .call();
  console.log(
    `Current allowance: ${Util.convertStringToFloat(
      allowance,
      decimals,
    )} ${symbol}`,
  );
  console.log();

  if (MULTISIG) {
    // Create multisig transaction
    console.log(`Creating multisig submission transaction ...`);
    const multisigApproveTX = multi.methods.submitTransaction(
      TOKEN,
      0,
      approvalBytecode,
    );
    console.log();

    console.log(`Estimating gas ...`);
    const gas = await multisigApproveTX.estimateGas({ from: WALLET });
    const gasPrice = await web3.eth.getGasPrice();
    console.log(
      `Estimated gas: ${((parseInt(gas) / 10 ** 18) * gasPrice).toFixed(
        5,
      )} AVAX`,
    );
    console.log();

    console.log(`Will send multisig transaction in 15 seconds ...`);
    await new Promise((resolve) => setTimeout(resolve, 15000));
    console.log();

    console.log(`Submitting transaction to multisig ...`);

    return multisigApproveTX.send({
      from: WALLET,
      gas,
      gasPrice,
    });
  } else {
    console.log(`Estimating gas ...`);
    const gas = await directApprovalTX.estimateGas({ from: WALLET });
    const gasPrice = await web3.eth.getGasPrice();
    console.log(
      `Estimated gas: ${((parseInt(gas) / 10 ** 18) * gasPrice).toFixed(
        5,
      )} AVAX`,
    );
    console.log();

    console.log(`Will send transaction in 15 seconds ...`);
    await new Promise((resolve) => setTimeout(resolve, 15000));
    console.log();

    console.log(`Sending transaction ...`);

    return directApprovalTX.send({
      from: WALLET,
      gas,
      gasPrice,
    });
  }
};
