# Punks by Cybrix

A fun project on Web3 NFT minting. I know the Web3 hype is gone 💨 but wanted to drive the hype train 🚅.

## Step 1: About the drawings

Believe it or not, recently whenever I draw something its tends to be creepy, and I end up quitting. To avoid this I am using [DiceBear](https://www.dicebear.com/) to get a set of Scalable Vector Graphics and upload them to <abbr title="Inter Planetary File System">ipfs://</abbr>. Side note, I know these pictures exists and every one can actually find them using the Dicebear API. Oh well 🤷!

A small node.js script in [random-punk-img](./random-punk-img/index.js) is enough to generate a set of random images.

```
cd random-punk-img
npm start
```

## Step 2: Deploy to ipfs

There are many ipfs services out there to host our assets. But I found [Pinata](https://www.pinata.cloud/), the best among the lot. Its just like Google Drive and even allows us to host a full folder. At the time of writing, the free plan only allows 100 free files pinned at once.


> Many more steps... (Shortly updated)