import React, { useState, useCallback, useRef, useEffect } from 'react'

import { ethers } from 'ethers';

import CybrixGuys from '../../../artifacts/contracts/CybrixGuys.sol/CybrixGuys.json';

const contractAddress = import.meta.env.PUBLIC_NETWORK
const contentId = import.meta.env.PUBLIC_PUNK_CID;

const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : undefined;
const signer = window.ethereum ? provider.getSigner() : undefined
const contract = window.ethereum ? new ethers.Contract(contractAddress, CybrixGuys.abi, signer) : undefined;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const cost = 0.03;

export default function Home() {

	const [ balance, setBalance ] = useState('View Balance');

	const [ totalMinted, setTotalMinted ] = useState(0);

	const [ connected, setConnected ] = useState(false);

	const balanceRef = useRef();

	const getBalance = useCallback(async () => {
		try {
			const [ account ] = await ethereum.request({ method: 'eth_requestAccounts' });		
			const balance = await provider.getBalance(account);
			const formatted = ethers.utils.formatEther(balance);
			setBalance((_) => (`${formatted} eth`));
		}catch( err ) {
			balanceRef.current.disabled = true;
			setBalance(`Error while showing balance. Try Again!`);
			setTimeout( () => {
				balanceRef.current.disabled = !true;
				setBalance('View Balance');
			}, 5000)
		}
	}, []);

	const getCount = useCallback( async () => {
		const count = await contract.count();
		setTotalMinted(parseInt(count));
	}, []);

	const addNetwork = async function() {
		try{
			if(window.ethereum) {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [{
						chainId: "0x13881",
						rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/YSaEg_UcCrzMAfC2MHTaNbUNa3xuGqpV"],
						chainName: "Polygon Mumbai (Alchemy)",
						nativeCurrency: {
							name: "MATIC",
							symbol: "MATIC",
							decimals: 18
						},
						blockExplorerUrls: ["https://mumbai.polygonscan.com"]
					}]
				});
			}
		}catch( err) {
			console.log(err)
		}
		
	}
	


	useEffect( () => {

		getCount();
	}, [])


	useEffect( () => {

		if(!window.ethereum) return;

		console.log(window.ethereum.selectedAddress)

		let selectedAddress = typeof window.ethereum !== 'undefined' ? window.ethereum.selectedAddress : null;

		setConnected(true);

		const accountChangeHandler = async (accounts) => {
			if(selectedAddress === null) selectedAddress = window.ethereum.selectedAddress;

			if(Array.isArray(accounts)) {
				if(accounts.length === 0) {
					setBalance('View Balance')
					setConnected(false);
				}else {
					selectedAddress = window.ethereum.selectedAddress;
					const balance = await provider.getBalance(selectedAddress);
					const formatted = ethers.utils.formatEther(balance);
					setBalance((_) => (`${formatted} eth`));
					setConnected(true);
				}
			}

			console.log({
				selectedAddress,
				accounts
			})
		};
		
		window.ethereum.addListener('accountsChanged', accountChangeHandler)

		return () => window.ethereum.removeListener('accountsChanged', accountChangeHandler);
		
	}, [])
	

	console.log(connected)

  return (
    <>
    <header>
        <div className="container-fluid">
            <div className='row align-items-center pt-6 pb-4 mt-4 mt-lg-0'>
                <div className='col-xl-2 col-md-3 mb-4 mb-md-0 col-12 text-center text-md-start'>
                    <div className='navbar-brand' style={{
                        fontFamily: 'Inter',
                        fontSize: '1.8rem',
                        "color": "var(--fc-primary)",
                        "fontWeight": "bold",
						backgroundImage: "url('/openPeeps.svg')",
						backgroundPosition: "center",
    					backgroundSize: "contain",
    					height: "100px",
    					backgroundRepeat: "no-repeat"
                    }}></div>
                </div>
				<div className='col-xl-2 col-md-3 mb-4 mb-md-0 col-12 text-center text-md-start'>
                    <button ref={balanceRef} className='btn btn-primary btn-sm' onClick={async () => await getBalance()}>{balance}</button>
                </div>
				<div className='col-xl-2 col-md-3 mb-4 mb-md-0 col-12 text-center text-md-start'>
                    <button className='btn btn-primary btn-sm' onClick={addNetwork}>Add Test Net</button>
                </div>
                <hr />
            </div>
        </div>
    </header>
    <main className='my-8'>
		<div className='container'>
			{ connected && 
			(<div className="row g-5 row-cols-lg-5 row-cols-2 row-cols-md-3" style={{"columnGap": "10rem"}}>
				{
					Array(totalMinted + 1)
					.fill(0)
					.map( (_, i) => (
						<Punk tokenId={i} key={i.toString()} getCount={getCount} connected={connected}/>
					))
				}
			</div>)}
		</div>
    </main>
    </>
  )
}


function Punk({tokenId, getCount, connected}){

	const metadataURI = `${contentId}/${tokenId}.json`;
  	// const imageURI = `https://gateway.pinata.cloud/ipfs/QmYfXMGbZ6WZKoApvwf7XR8KVQMSTyq5wfRkFY7E2VwhR9/${tokenId}.png`;
	const imageURI = `/assets/${tokenId}.png`

	const [isMinted, setIsMinted] = useState(false);

	useEffect(() => {
		getMintedStatus();
	}, [isMinted]);
  
	const getMintedStatus = async () => {
	  const result = await contract.isContentOwned(metadataURI);
	  console.log(result)
	  setIsMinted(result);
	};


	const mintToken = async (evt) => {
		if(evt.currentTarget) {
			evt.currentTarget.disabled = true;
		}
		const currentTarget = evt.currentTarget;
		console.log(evt.currentTarget, evt.currentTarget.innerText);
		try {	
			const connection = contract.connect(signer);
			const addr = connection.address;
			const result = await contract.payToMint(addr, metadataURI, {
			  value: ethers.utils.parseEther(cost.toString()),
			});
			currentTarget.innerText = "Minting...";
		
			await result.wait();
			getMintedStatus();
			getCount();

		}catch(err) {
			console.log(err);
			console.log({
				error: true,
				currentTarget,
			})

			currentTarget.innerText = 'Error Occured';
			await sleep(5000);
			currentTarget.disabled = false;
			currentTarget.innerText = "Mint";

			
		}
	};

	async function getURI() {
		const uri = await contract.tokenURI(tokenId);
		alert(uri);
	}
	


	return (
		<div className="col">
			<div className="card card-product" style={{"width": "300px"}}>
				<div className="card-body">
					<div className="text-center position-relative ">
						<img src={isMinted ? imageURI : '/placeholder.png'} style={{"width": "215px", borderRadius: "2px"}} alt="Cybrix Punk" className="mb-3 img-fluid" />
					</div>
					<div className="text-small mb-1"></div>
						<h2 className="fs-6">ID #{tokenId}</h2>
					<div>
					</div>
					<div className="d-flex justify-content-between align-items-center mt-3">
						<div>
							{!isMinted ? (<button className="btn btn-primary btn-sm" key={`mint-${tokenId}`} onClick={async (evt) => await mintToken(evt)} disabled={!connected}>Mint</button>) : (<button className="btn btn-primary btn-sm" key={`taken-${tokenId}`} onClick={getURI} disabled={!connected}>Taken! Show URI</button> )}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}