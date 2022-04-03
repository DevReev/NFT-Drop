import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  console.log(collections)
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <iframe
        src="https://gateway.ipfscdn.io/ipfs/QmeySjr2uTEuwo3nihtZMthwM5rzGc4UNg56ceLAJzizx2/drop.html?contract=0x22B98cD295580a030BBB0e228cd446A83dE088a1&chainId=4"
        width="600px" 
        height="600px"
        // style="max-width:100%;"
        // frameborder="0"
      ></iframe> */}

      <h1 className="mb-10 text-4xl font-extralight">
        The{' '}
        <span className="font-bold underline decoration-pink-600/50">Bob</span>{' '}
        NFT Market
      </h1>

      <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div className="flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-105">
                <img
                  className="h-96 w-60 rounded-2xl object-cover"
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                />

                <div className="p-5">
                  <h2 className="text-3xl">{collection.title}</h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
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

  }

}`

  // console.log(query)

  const collections = await sanityClient.fetch(query)
  // console.log(collections)

  return {
    props: {
      collections,
    },
  }
}
