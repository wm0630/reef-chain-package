import { setSelectedAddress } from "../src/reefState/account/setAccounts";
import {
  selectedNFTs_status$,
  selectedTokenBalances_status$,
  selectedTokenPrices_status$,
  selectedTransactionHistory_status$,
} from "../src/reefState/tokenState.rx";
import { firstValueFrom, skipWhile } from "rxjs";
import {StatusDataObject, FeedbackStatusCode} from "../src/reefState/model/statusDataObject";
import { fetchPools$ } from "../src/pools/pools";
import { REEF_ADDRESS } from "../src/token/tokenModel";
import {availableAddresses$} from "../src/reefState/account/availableAddresses";
import { selectedAccountAddressChange$ } from "../src/reefState/account/selectedAccountAddressChange";
import { accountsWithUpdatedIndexedData$ } from "../src/reefState/account/accountsIndexedData";
import { selectedAccount_status$ } from "../src/reefState";
import { selectedProvider$ } from "../src/reefState/providerState";
import { decodePayloadMethod } from "../src/signature/tx-signature-util";
import { pendingTxList$ } from "../src/reefState/tx/pendingTx.rx";
import { getReefAccountSigner } from "../src";
import { Contract } from "ethers";
import { ERC20 } from "../src/token/abi/ERC20";

const TEST_ACCOUNTS = [
  { address: "5GKKbUJx6DQ4rbTWavaNttanWAw86KrQeojgMNovy8m2QoXn", name: "acc1", meta: { source: "reef" } },
  { address: "5EnY9eFwEDcEJ62dJWrTXhTucJ4pzGym4WZ2xcDKiT3eJecP", name: "test-mobile", meta: { source: "reef" } },
  { address: "5G9f52Dx7bPPYqekh1beQsuvJkhePctWcZvPDDuhWSpDrojN", name: "test1", meta: { source: "reef" } },
];


async function testNfts() {
  // await changeSelectedAddress();
  // let nfts = await firstValueFrom(selectedNFTs_status$);
  // console.assert(nfts.hasStatus(FeedbackStatusCode.LOADING), 'Nfts not cleared when changing signer stat=' + nfts.getStatus().map(v=>v.code))
  console.log("resolve nft urls", );
  let nfts;
  // nfts = await firstValueFrom(selectedNFTs_status$.pipe(skipWhile((nfts)=>nfts.hasStatus(FeedbackStatusCode.LOADING))));
  // if(nfts.data.length) {
  //     console.assert(nfts.hasStatus(FeedbackStatusCode.PARTIAL_DATA_LOADING), 'Nft data should not be complete yet.')
  // }
  // nfts = await firstValueFrom(selectedNFTs_status$.pipe(
  //     // tap(v => console.log('Waiting for nft complete data')),
  //     skipWhile((nfts: StatusDataObject<any>) => {
  //         return !(nfts.hasStatus(FeedbackStatusCode.COMPLETE_DATA) && nfts.getStatusList().length===1)
  //     }))
  // );

  console.assert(!nfts?.data.find(nft => !nft.hasStatus(FeedbackStatusCode.COMPLETE_DATA)), 'Nft data not complete')
  console.log(`END test nfts=`, nfts);
}

async function changeSelectedAddress(): Promise<string> {
  const allSig = await firstValueFrom(availableAddresses$);
  console.assert(allSig.length>1, 'Need more than 1 signer.')
  const currSig0 = await firstValueFrom(selectedAccount_status$);
  const currSig = await firstValueFrom(selectedAccountAddressChange$);
  const newSig = allSig.find(sig => sig.address !== currSig.data.address);
  console.log("changing selected address to=",newSig?.address);
  setSelectedAddress(newSig?.address);
  return newSig?.address!;
}



describe("Unit tests", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("testNfts", async () => {
    const mockSetSelectedAddress = jest.fn();

    selectedNFTs_status$.pipe(skipWhile((nfts) => nfts.hasStatus(FeedbackStatusCode.LOADING)));

    await testNfts();

    expect(mockSetSelectedAddress).toHaveBeenCalled();
  });

  // test("testAppStateTokens", async () => {
  //   setSelectedAddress = jest.fn();

  //   selectedTokenBalances_status$.pipe(skipWhile((v) => !v.hasStatus(FeedbackStatusCode.COMPLETE_DATA)));
  //   selectedTokenPrices_status$.pipe(skipWhile((v) => !v.hasStatus(FeedbackStatusCode.COMPLETE_DATA)));

  //   await testAppStateTokens();

  //   expect(setSelectedAddress).toHaveBeenCalled();
  // });

  // test("testAvailablePools", async () => {
  //   fetchPools$ = jest.fn();

  //   await testAvailablePools([], null, null);

  //   expect(fetchPools$).toHaveBeenCalled();
  // });

  // test("testAppStateSigners", async () => {
  //   accountsWithUpdatedIndexedData$.pipe(
  //     skipWhile((t) => !t.hasStatus(FeedbackStatusCode.COMPLETE_DATA))
  //   );

  //   await testAppStateSigners(TEST_ACCOUNTS);
  // });
});
