import React, { useEffect } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import toast, { Toaster } from 'react-hot-toast'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

interface Props {
  collection: Collection
}

interface ClaimedNFT {}

function NFTDropPage({ collection }: Props) {
  const nftDrop = useNFTDrop(collection.address)

  const [claimedSupply, setClaimedSupply] = React.useState(0)
  const [totalSupply, setTotalSupply] = React.useState<BigNumber>()
  const [priceEth, setPriceEth] = React.useState<string>()
  const [loading, setLoading] = React.useState(true)
  // const [claimedNFT, setClaimedNFT] = React.useState<any>()
  const [image, setImage] = React.useState<string>()
  const [name, setName] = React.useState<string>()
  const [description, setDescription] = React.useState<string>()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    if (!nftDrop) {
      return
    }

    const fetchNFTDrop = async () => {
      setLoading(true)
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchNFTDrop()
    fetchPrice()
    // setClaimedSupply(claimed)
    // setTotalSupply(nftDrop.totalSupply)
  }, [nftDrop])

  // AUTH
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  const mintNFT = () => {
    if (!nftDrop || !address) {
      return
    }

    setLoading(true)
    const notification = toast.loading('Minting', {
      style: {
        background: 'white',
        color: 'green',
        fontSize: '17px',
        fontWeight: 'bolder',
        padding: '20px',
      },
    })

    const quantity = 1
    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt
        const claimedTokenId = tx[0].id
        const claimedNFTData = await tx[0].data()
        // claimedNFT = claimedNFTData.metadata
        setImage(claimedNFTData.metadata.image)
        setName(claimedNFTData.metadata.name)
        setDescription(claimedNFTData.metadata.description)

        toast('NFT Minted!', {
          duration: 9000,
          style: {
            background: 'green',
            color: 'white',
            fontSize: '17px',
            fontWeight: 'bolder',
            padding: '20px',
          },
        })

        // setClaimedNFT(claimedNFTData.metadata)
        console.log(receipt)
        console.log(claimedTokenId)

        console.log(description)
        console.log(image)
        console.log(name)
        handleOpen()
      })
      .catch((err) => {
        alert(err)
        toast('Something went wrong', {
          // duration : 9000,
          style: {
            background: 'red',
            color: 'white',
            fontSize: '17px',
            fontWeight: 'bolder',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        // console.log(claimedNFT)
        toast.dismiss(notification)
        setLoading(false)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt=""
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col p-10 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{' '}
              <span className="font-bold underline decoration-pink-600/50">
                Bob GAN
              </span>{' '}
              NFT Market
            </h1>
          </Link>

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
            src={urlFor(collection.mainImage).url()}
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl">{collection.title}</h1>

          {loading ? (
            <p className="animate-pulse pt-2 text-xl text-green-500">
              Loading Supply Count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">{`${claimedSupply}/${totalSupply?.toString()} NFTs Claimed`}</p>
          )}

          {loading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt=""
            />
          )}
        </div>

        <div>
          {/* <Button onClick={handleOpen}>Open modal</Button> */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="my-10 mx-auto h-2/3 w-2/3 rounded-xl bg-gradient-to-br from-purple-600 to-yellow-400 p-2">
              <div className="flex h-full  flex-col items-center rounded-xl bg-gradient-to-br from-cyan-800 to-rose-500 text-center">
                <div className="py-4 text-2xl font-bold text-white">
                  NFT Minted!
                </div>

                <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
                  <img className="h-72 object-contain" src={image} alt="" />
                </div>

                <span className="py-2 text-xl font-bold text-white">
                  {name}
                </span>

                <div className="pt-5 text-lg font-thin text-gray-200">
                  <p>{description}</p>
                </div>
                {/* disabled */}
              </div>
            </div>
          </Modal>
        </div>

        {/* Mint Botton */}
        <button
          onClick={mintNFT}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mx-auto mt-10 h-16 w-3/4 rounded-full bg-red-500 font-bold text-white hover:drop-shadow-lg disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Sign In To Mint</>
          ) : (
            <span>Mint NFT ({priceEth})</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // console.log(sanityClient)

  const query = `*[_type == "collection" && slug.current == $id][0]{
  title,
  id,
  title,
  address,
  description,
  nftCollectionName,
  mainImage{
    asset
  },
  previewImage{
    asset
  },
  slug{
    current
  },
  creator -> {
    _id,
    name,
    address,
    slug{
    current
  },
},
}`

  const collection = await sanityClient.fetch(query, { id: params?.id })
  // console.log(collection)
  // const collection = sanityClient.fetch(query)

  // console.log(collection)

  if (!collection) {
    return {
      notFound: true,
    }
  }
  // console.log(params?.id)
  return {
    props: {
      collection,
    },
  }
}

// *[_type == "collection" && slug.current == $id][0]{
//   id,
//   title,
//   address,
//   description,
//   nftCollectionName,
//   mainImage{
//     asset
//   },
//   previewImage{
//     asset
//   },
//   slug{
//     current
//   },
//   creator -> {
//     _id,
//     name,
//     address,
//     slug{
//     current
//   },
// },
// }
