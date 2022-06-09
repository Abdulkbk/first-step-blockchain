import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'
import Token from '../src/artifacts/contracts/Token.sol/Token.json'

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const tokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

function Display() {
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccountValue] = useState('')
  const [amount, setAmount] = useState(0)

  // console.log(process.env.REACT_APP_SECRET_KEY)

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log('Balance: ', balance.toString())
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()
      console.log(`${amount} coins successfully sent to ${userAccount}`)
    }
  }

  async function fetchGreeting() {
    if (window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      )
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className='w-screen flex flex-col h-screen justify-center items-center'>
      <button
        className='w-full bg-blue-200 py-2 border rounded-md'
        onClick={fetchGreeting}
      >
        Fetch Greeting
      </button>
      <button
        className='w-full bg-blue-200 py-2 border rounded-md'
        onClick={setGreeting}
      >
        Set Greeting
      </button>
      <input
        type='text'
        placeholder='Set Greetings'
        className='w-full bg-blue-200 py-2 px-3 border rounded-md'
        onChange={e => setGreetingValue(e.target.value)}
        value={greeting}
      />

      <div className='flex flex-col h-1/3 w-full'>
        <button
          onClick={getBalance}
          className='w-full bg-blue-200 py-2 border rounded-md'
        >
          Get Balance
        </button>
        <button
          onClick={sendCoins}
          className='w-full bg-blue-200 py-2 border rounded-md'
        >
          Send Coins
        </button>
        <input
          type='text'
          onChange={e => setUserAccountValue(e.target.value)}
          placeholder='User Account'
          className='w-full bg-blue-200 py-2 px-3 border rounded-md'
        />
        <input
          type='text'
          onChange={e => setAmount(e.target.value)}
          placeholder='Amount'
          className='w-full bg-blue-200 py-2 px-3 border rounded-md'
        />
      </div>
    </div>
  )
}

export default Display
