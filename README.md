# No-shuffle 1862 tableau manager

## What is this?

I like the solo game in 1862, but if you don't shuffle the share certs thoroughly the game is easier. And shuffling 140 small cards is quite annoying, especially because playing the game (solo or multiplayer) means that card distribution is nothing like uniform.

This project saves the shuffling. Tell it which companies you take out of the game, and how many certs you need to draw, and it'll tell you which certs to take.

It runs in the browser, and it stores its state in your browser's local storage. That means that you can accidentally refresh the page, or close the window and come back to it, and the state of the share cards will be the same.

It *doesn't* implement the actual tableau for you, yet.

## Why does the code look like it was written in a hurry?

It was written in one lunch break. I'll improve it as needed.

## How can I help?

### Improve it

Install dependencies with `yarn install` then run the app with `yarn start`.

Make your improvements, and send me a pull request. I'll be glad to see it. You might want to message me first and discuss the change. I'm `@h` on the 18xx Slack.

### By the way

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
