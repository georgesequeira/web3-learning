import './App.css';

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program,
  Provider,
  web3
} from '@project-serum/anchor';
import { useEffect, useState } from 'react';

import idl from './idl.json';
import kp from './keypair.json'
import twitterLogo from './assets/twitter-logo.svg';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Get our program's id form the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devent.
const network = clusterApiUrl('devnet');

// Control's how we want to acknowledge when a trasnaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)


// Constants
const TWITTER_HANDLE = 'george_sequeira';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/F6g1ccQ8IDetW/giphy.gif',
	'https://media.giphy.com/media/B26v0NAfBr9qhjdpAT/giphy.gif',
	'https://media.giphy.com/media/10tytwcRXOipWw/giphy.gif',
	'https://media.giphy.com/media/UodI2uazt6WXMQhpSS/giphy.gif'
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)
      setGifList(account.gifList)
  
    } catch (error) {
      console.log("Error in getGifs: ", error)
      setGifList(null);
    }
  }

  const checkIfSolanaDetected = async () => {
    try {
        const {solana} = window;
        if (solana) {
            if (solana.isPhantom) {
                console.log("Phantom wallet!!!! LETS GOOOOO!");
            }
            const response = await solana.connect({ onlyIfTrusted: true });
            console.log(
              'DADDY  STRING:',
              response.publicKey.toString(),
            );
            setWalletAddress(response.publicKey.toString());
        } else {
            alert ("Solana object not found! Get a phantom wallet");
        }
    }
    catch (error) {
        console.log(error);
        alert("Error happened");
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
      return provider;
  }

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getGifList();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  const sendGif = async () => {
    if (inputValue.length === 0) {
        console.log("No gif link given!")
        return
      }
      console.log('Gif link:', inputValue);
      try {
        const provider = getProvider();
        const program = new Program(idl, programID, provider);
    
        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
          },
        });
        console.log("GIF sucesfully sent to program", inputValue)
    
        await getGifList();
      } catch (error) {
        console.log("Error sending GIF:", error)
      }
  };

  useEffect(() => {
    window.addEventListener('load', async (event) => {
      await checkIfSolanaDetected();
    });
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.
      getGifList()
    }
  }, [walletAddress]);

  const renderNotConnected = () => {
    return (
        <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}>
                    Connect to Wallet
        </button>
    );
  };

  const renderConnectedContainer = () => {
    if (gifList === null) {
        return (
          <div className="connected-container">
            <button className="cta-button submit-gif-button" onClick={createGifAccount}>
              Do One-Time Initialization For GIF Program Account
            </button>
          </div>
        )
      } 
    else {
      return (
        <div className="connected-container">
        {/* Go ahead and add this input and button to start */}
        <input 
          type="text" 
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}/>
  
        <button className="cta-button submit-gif-button" onClick={sendGif}>Submit</button>
        <div className="gif-grid">
          {/* Map through gifList instead of TEST_GIFS */}
          {gifList.map((gif) => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
      );
    }
  };

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="container">
            <div className="header-container">
            <p className="header">🖼 GIF Portal</p>
            <p className="sub-text">
                View your GIF collection in the metaverse ✨
            </p>
            {walletAddress ?  renderConnectedContainer() : renderNotConnected()}
            <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default App;
