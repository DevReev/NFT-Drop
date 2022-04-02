import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

function NFTDropPage() {
  // AUTH
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt=""
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">Bob Apes</h1>
            <h2 className="text-xl text-gray-300">Good Bob Apes Collection</h2>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col p-10 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-bold underline decoration-pink-600/50">
              Bob
            </span>{' '}
            NFT Market
          </h1>

          <button
            onClick={address ? disconnect : connectWithMetamask}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-rose-400">
            You're Logged In With Wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}

        {/* Contetnt */}
        <div className="text-centre mt-10 flex flex-1 flex-col items-center space-y-6 lg:justify-center lg:space-y-0">
          <img
            className="lg:h-50 w-80 object-cover pb-10"
            src="https://links.papareact.com/bdy"
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl">Bob Club</h1>

          <p className="pt-2 text-xl text-green-500">16/20 NFTs Claimed</p>
        </div>

        {/* Mint Botton */}
        <button className="mx-auto mt-10 h-16 w-3/4 rounded-full bg-red-500 font-bold text-white hover:drop-shadow-lg">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage