# haneplane
Flappy Bird clone in honor of a certain someone. Hosted at philnova.io

## Game

Haneplane is a clone of Flappy Bird and has the same basic mechanics. The player falls with constant acceleration. Clicking gives the player a boost upward with fixed velocity.

The goal of the game is to avoid the sets of pipes that come at the player. The height of the pipes is randomized, with the distance between them fixed. The player's x coordinate stays fixed as the pipes come toward them. The player must adjust their height by timing clicks in order to safely pass through the oncoming pipes, earning them one point. The game has no end; the goal is to obtain a high score.

In reality, there are two sets of pipes at any one time. Once one set of pipes passes off the left side of the screen, it is recreated, with a new randomized height, to the right of the screen.

## Structure

The game logic is split over three JavaScript files and requires jQuery to interact with the DOM.

- resources.js is an image loading utility developed by Udacity.
- engine.js is a game engine developed by Udacity. It maps the refresh rate of the browser to clock time, allowing the game to run smoothly on any device. It also contains the update functions, loads the game's images, and calls the render methods defined on the game's objects.
- app.js contains the game's objects: the player, backdrop, and pipes. It constructs these objects and defines their update and render methods, and defines functions for detecting collisions.

## Planned Updates

The HTML Canvas is of fixed size and in its current state the game is not suitable for small screens. In future updates I plan to make the canvas respond dynamically.
