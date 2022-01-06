# No-shuffle 1862 tableau manager

## What is this?

I like the solo game in 1862, but if you don't shuffle the share certs thoroughly the game is easier. And shuffling 140 small cards is quite annoying, especially because playing the game (solo or multiplayer) means that card distribution is nothing like uniform.

This project saves the shuffling by managing the tableau of cards for you.

It runs in the browser, and it stores its state in your browser's local storage. That means that you can accidentally refresh the page, or close the window and come back to it, and the state of the share cards will be the same.

## Why does the code look like it was written in a hurry?

It was. I'm slowly improving it as needed.

## How can I help?

### Improve it

Install dependencies with `yarn install` then run the app with `yarn start`. You can then access the app on port 3000.

My preferred way is to run the app in Docker. You can do that by just running `docker-compose up --build` from the root directory. You can then access the app by going to `localhost:1862`.

Make your improvements, and send me a pull request. I'll be glad to see it. You might want to message me first and discuss the change. I'm `@h` on the 18xx Slack.

### By the way

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
