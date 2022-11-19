+++
title = "Rain Calendar"
template = "project.html"
date = "2020-01-27"
[extra]
hype = "Convert the rain forecast into a calendar you can sync"
+++

<div class="embed">
  <img src="/assets/images/projects/weathercalendar2.png" style="width: 100%;"/>
</div>

It's been raining here a ton lately, so I though I'd resurrect an old project: the
rain calendar!

This app converts a forecast into a calendar you can subscribe to, with rain shown as events. If like me you travel a lot on foot/bicycle, you can quickly open your calendar to help decide when to make your move!

I think it's about a 72hr forecast which is good enough for checking what to wear before you head out in the morning.

The first incarnation of this tool was built with rails. This time I thought I'd
try implementing it using nodejs and <a href="https://hapi.dev/">hapi</a>, since
that's where my head is at at the moment.

Writing the weather service in js was a breeze (not any simpler than the Ruby
version). The serverside stuff was perhaps simpler just because for such a small
service everything could live in one place. I quite liked hapi, it had a great
caching plugin I could use to reduce the load on the weather service.

<div class="embed glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/ballistic-pink?path=app.js&previewSize=0&attributionHidden=true"
    title="ballistic-pink on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<div class="aside" markdown="1">
- **Online**: [Rain Calendar](https://ballistic-pink.glitch.me/)
- **Source**: [https://github.com/wwqrd/https://github.com/wwqrd/raincalendar](https://github.com/wwqrd/https://github.com/wwqrd/raincalendar)
</div>
