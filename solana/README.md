# Random: NFT for doing this
https://opensea.io/assets/matic/0x3CD266509D127d0Eac42f4474F57D0526804b44e/2597?force_update=true

# Solana project
Solana is similar to ethereum in that there are smart contracts (named 'Programs' --- how original). The difference is that the programs are stateless whereas Ethereum allows you to store state on the contract themselves. Solana allows you to interact with "Accounts" which store state. So the blockchain only tells you what things will happen but the state is not recorded. Accounts are not the account that you sign up with or have your wallet. It's everything. A program is an account, a wallet is an account, you can also just make an account to store stuff in.... More info here: https://docs.solana.com/developing/programming-model/accounts

## What does this project do?
It's a react app that allows users to connect their Solana wallets and then will allow the user to interact with content on the solana blockchain on their behalf.

## What is the web3 part?
So when you have a crypto browser wallet. It not only has access to your funds itself, it also knows who you are. This means that it can then execute code (because it costs money) on your behalf but it also can properly use your identity to send (or receive) stuff. At the moment, it's merely allowing folks to have their identity connected in the app. This lives honestly outside of the stack I am building and allows the library injected by the extension to populate the necessary fields.

This may need to be updated after I do rust stuff.


## What are some dependencies
Outside of the dependencies in the package.json. Solana programs are written in rust. So that sentence tells us we need to install two things:

* rust at - https://doc.rust-lang.org/book/ch01-01-installation.html
* solana at - https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool
* anchor by - cargo install --git https://github.com/project-serum/anchor anchor-cli --locked


# Questions that I have (and hopefully answer)

* why would i store data on a linked list?
* what does anchor actualy do?
* why doesn't it take longer to traverse the list to find the program and perform the action?
