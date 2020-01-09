---
title: sketchbook
layout: sketchbook
---

<div class="sketches">
  {% assign sketches = site.sketchbook | sort: 'date' | reverse %}
  {% for sketch in sketches %}
    <a class="sketches__sketch" href="{{ sketch.url }}">
      <img class="sketches__sketch-hype" src="{{ sketch.hype }}" />
      <div class="sketches__sketch-meta">
        <h1 class="sketches__sketch-title">{{ sketch.title }}</h1>
      </div>
    </a>
  {% endfor %}
</div>
