---
title: Violin sight reading game
hype: This is a tool to help the player learn to read music and the corresponding finger positions for the violin.
layout: project
date: 2015-04-13
---

I wanted to get some practical experience writing a game, and came up with this
little violin tutoring app.

I've only professionally ever written web-apps, which really only follow a couple of
programming paradigms, the transactional CRUD of the server, and the MVC of the
client and/or renderer.

I've tried to read up on game development and came up with the familiar
'game loop' -- but there's no way they make high production games that
way right? This practical project uses (attempts to at least), use a
modular approach I read about somewhere or other.

It's built in javascript, using the [PIXI.js](http://www.pixijs.com/)
library, and theoretically should work on small screen devices.

The result was interesting, perhaps I choose the wrong game for this
type of structure and perhaps I'm just too familiar with MVC, but building
this game was like putting a square peg in a round hole! I also wasted
a lot of time trying to render a score -- but then perhaps that
would pay off later if I choose to add animations.

Another time I would have just built something like this using MVC.

Possible future features: Choice of musical instrument; choice of musical
scale; play a reference sound for each note; detect played notes;
learn which notes the player is having difficulty with.

**Update**: I built a much better version of this game using React! [Find out more here!](/projects/violin-sight-reading-game-2_0.html)

<div class="aside" markdown="1">
- **Play online**: [Violino](https://wwqrd.uk/violino)
- **Source**: [https://github.com/wwqrd/violino](https://github.com/wwqrd/violino)
</div>
