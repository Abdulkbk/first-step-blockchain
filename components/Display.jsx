import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function Display() {
  const [greeting, setGreetingValue] = useState('')

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
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
    </div>
  )
}

export default Display
